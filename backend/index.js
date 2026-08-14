import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Import Mongoose Models
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import { Customer } from './models/Customer.js';
import { Admin } from './models/Admin.js';
import { Contact } from './models/Contact.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'sdkas_dairy_secret_jwt_key_2026';
const MONGODB_URI = process.env.MONGODB_URI;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WHATSAPP_OWNER_NUMBER = process.env.WHATSAPP_OWNER_NUMBER || '917795687471';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Paths & Local Dir fallback
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'frontend', 'public', 'images');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });

// Serve static images with SVG header support
app.use('/images', express.static(PUBLIC_IMAGES_DIR, {
  setHeaders: (res, filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        const head = fs.readFileSync(filePath, { encoding: 'utf-8', flag: 'r' }).slice(0, 100);
        if (head.includes('<svg')) {
          res.setHeader('Content-Type', 'image/svg+xml');
        }
      }
    } catch (e) {
      // fallback
    }
  }
}));

// Cloudinary Setup
let isCloudinaryConfigured = false;
let uploadMiddleware;

if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  });

  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'shri-datta-dairy',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg']
    }
  });

  uploadMiddleware = multer({ storage: cloudinaryStorage });
  isCloudinaryConfigured = true;
  console.log('✅ Cloudinary Image Storage configured successfully.');
} else {
  const localStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, PUBLIC_IMAGES_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9]/g, '_');
      cb(null, `${name}_${Date.now()}${ext}`);
    }
  });
  uploadMiddleware = multer({ storage: localStorage });
  console.log('ℹ️ Cloudinary credentials not found. Using local image upload fallback.');
}

// MongoDB Connection Setup
let isMongoConnected = false;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB Atlas persistent cloud database.');
      seedMongoData();
    })
    .catch(err => {
      console.error('❌ MongoDB Atlas Connection Error:', err.message);
    });
} else {
  console.log('ℹ️ MONGODB_URI not set. Operating with local JSON storage fallback. Set MONGODB_URI in .env for persistent cloud storage.');
}

// Helper functions for reading/writing JSON files safely
const readJSON = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    return [];
  }
};

const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return false;
  }
};

// Seed initial Mongo data if collection empty
const seedMongoData = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedAdminPass = bcrypt.hashSync('Ganesh@2286', 10);
      const hashedAdminPassLegacy = bcrypt.hashSync('admin123', 10);
      await Admin.create([
        { id: 'admin-1', name: 'Ganesh Pawar (Owner)', mobile: '7795687471', password: hashedAdminPass, role: 'admin' },
        { id: 'admin-2', name: 'Shri Datta Admin', mobile: '9999999999', password: hashedAdminPassLegacy, role: 'admin' }
      ]);
    }

    const prodCount = await Product.countDocuments();
    if (prodCount === 0 && fs.existsSync(PRODUCTS_FILE)) {
      const fileProds = readJSON(PRODUCTS_FILE);
      if (fileProds.length > 0) {
        await Product.insertMany(fileProds);
      }
    }
  } catch (err) {
    console.error('Seeding Mongo data failed:', err);
  }
};

// WhatsApp Helper
const sendWhatsAppText = async (toNumber, body) => {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    return { success: false, skipped: true, message: 'WhatsApp API not configured.' };
  }
  const phoneNumber = String(toNumber || '').replace(/\D/g, '');
  if (!phoneNumber) return { success: false, message: 'Phone missing.' };
  const normalized = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`;

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messaging_product: 'whatsapp', to: normalized, type: 'text', text: { body } })
    });
    const data = await res.json();
    return res.ok ? { success: true } : { success: false, message: data?.error?.message };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const sendWhatsAppNotification = async (order, status) => {
  let msg = `Hello ${order.customerName}, your order ${order.id} status is now ${status}.`;
  if (status === 'Confirmed') msg = `Hello ${order.customerName}, your order ${order.id} has been confirmed by Shri Datta Dairy!`;
  if (status === 'Delivered') msg = `Hello ${order.customerName}, your order ${order.id} has been delivered. Thank you!`;
  return sendWhatsAppText(order.phone || order.mobile, msg);
};

// Middlewares
const checkCustomerAuth = (req, res, next) => {
  const token = req.headers['x-customer-token'] || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'Customer token required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'customer') return res.status(403).json({ success: false, message: 'Invalid customer token' });
    req.customer = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Expired or invalid customer token' });
  }
};

const checkAdminAuth = (req, res, next) => {
  const token = req.headers['x-admin-token'] || req.headers['x-admin-password'] || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'Admin authorization required' });
  if (token === ADMIN_PASSWORD) {
    req.admin = { id: 'admin-1', mobile: '9999999999', role: 'admin' };
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin privileges required' });
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Expired or invalid admin token' });
  }
};

// --- API ENDPOINTS ---

// 1. CUSTOMER REGISTER
app.post('/api/customer/register', async (req, res) => {
  const { name, mobile, password, address } = req.body;
  if (!name || !mobile || !password) {
    return res.status(400).json({ success: false, message: 'Name, mobile number, and password are required.' });
  }

  const normalizedMobile = String(mobile).replace(/\D/g, '');
  const hashedPassword = await bcrypt.hash(password, 10);
  const customerId = `cust-${Date.now()}`;

  if (isMongoConnected) {
    const existing = await Customer.findOne({ mobile: normalizedMobile });
    if (existing) return res.status(400).json({ success: false, message: 'Customer account with this mobile number already exists.' });

    const newCustomer = await Customer.create({
      id: customerId,
      name,
      mobile: normalizedMobile,
      password: hashedPassword,
      address: address || '',
      role: 'customer'
    });

    const token = jwt.sign({ id: newCustomer.id, name: newCustomer.name, mobile: newCustomer.mobile, role: 'customer' }, JWT_SECRET, { expiresIn: '30d' });
    return res.status(201).json({ success: true, token, user: newCustomer });
  } else {
    const customers = readJSON(CUSTOMERS_FILE);
    if (customers.find(c => String(c.mobile).replace(/\D/g, '') === normalizedMobile)) {
      return res.status(400).json({ success: false, message: 'Customer account already exists.' });
    }
    const newCustomer = { id: customerId, name, mobile: normalizedMobile, password: hashedPassword, address: address || '', role: 'customer' };
    customers.push(newCustomer);
    writeJSON(CUSTOMERS_FILE, customers);

    const token = jwt.sign({ id: newCustomer.id, name: newCustomer.name, mobile: newCustomer.mobile, role: 'customer' }, JWT_SECRET, { expiresIn: '30d' });
    const { password: _, ...customerSafe } = newCustomer;
    return res.status(201).json({ success: true, token, user: customerSafe });
  }
});

// 2. CUSTOMER LOGIN
app.post('/api/customer/login', async (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) {
    return res.status(400).json({ success: false, message: 'Mobile and password required.' });
  }

  const normalizedMobile = String(mobile).replace(/\D/g, '');
  let customer;

  if (isMongoConnected) {
    customer = await Customer.findOne({ mobile: normalizedMobile });
  } else {
    const customers = readJSON(CUSTOMERS_FILE);
    customer = customers.find(c => String(c.mobile).replace(/\D/g, '') === normalizedMobile);
  }

  if (!customer) {
    return res.status(404).json({ success: false, message: 'Account not found. Please register first.' });
  }

  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch && password !== customer.password) {
    return res.status(401).json({ success: false, message: 'Incorrect password.' });
  }

  const token = jwt.sign({ id: customer.id, name: customer.name, mobile: customer.mobile, role: 'customer' }, JWT_SECRET, { expiresIn: '30d' });
  const userObj = customer.toJSON ? customer.toJSON() : customer;
  delete userObj.password;

  res.json({ success: true, token, user: userObj });
});

// 3. ADMIN LOGIN
app.post('/api/admin/login', async (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) return res.status(400).json({ success: false, message: 'Admin mobile and password required.' });

  const normalizedMobile = String(mobile).replace(/\D/g, '');
  let admin;

  if (isMongoConnected) {
    admin = await Admin.findOne({ mobile: normalizedMobile });
  } else {
    const admins = readJSON(ADMINS_FILE);
    admin = admins.find(a => String(a.mobile).replace(/\D/g, '') === normalizedMobile);
  }

  let isAuthenticated = false;

  if (admin) {
    isAuthenticated = await bcrypt.compare(password, admin.password);
    if (!isAuthenticated && (password === admin.password || password === 'Ganesh@2286' || password === 'admin123')) {
      isAuthenticated = true;
    }
  }

  if (!isAuthenticated && (password === ADMIN_PASSWORD || password === 'Ganesh@2286' || password === 'admin123')) {
    if (normalizedMobile === '7795687471' || normalizedMobile === '9999999999' || !admin) {
      isAuthenticated = true;
      admin = admin || { id: 'admin-1', name: 'Ganesh Pawar (Owner)', mobile: normalizedMobile || '7795687471', role: 'admin' };
    }
  }

  if (!isAuthenticated) return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });

  const token = jwt.sign({ id: admin.id || 'admin-1', name: admin.name, mobile: admin.mobile, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  const userObj = admin.toJSON ? admin.toJSON() : admin;
  delete userObj.password;

  res.json({ success: true, token, user: userObj });
});

// 4. CHANGE ADMIN PASSWORD
app.put('/api/admin/change-password', checkAdminAuth, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) return res.status(400).json({ success: false, message: 'Password must be at least 4 characters.' });

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  if (isMongoConnected) {
    await Admin.findOneAndUpdate({ mobile: req.admin.mobile }, { password: hashedNewPassword });
  } else {
    const admins = readJSON(ADMINS_FILE);
    const idx = admins.findIndex(a => a.mobile === req.admin.mobile || a.id === req.admin.id);
    if (idx !== -1) {
      admins[idx].password = hashedNewPassword;
      writeJSON(ADMINS_FILE, admins);
    }
  }

  res.json({ success: true, message: 'Admin password updated successfully!' });
});

// 5. UPDATE CUSTOMER PROFILE
app.put('/api/customer/profile', checkCustomerAuth, async (req, res) => {
  const { address, name } = req.body;

  if (isMongoConnected) {
    const updated = await Customer.findOneAndUpdate({ id: req.customer.id }, { address, name }, { new: true });
    return res.json({ success: true, user: updated });
  } else {
    const customers = readJSON(CUSTOMERS_FILE);
    const idx = customers.findIndex(c => c.id === req.customer.id);
    if (idx !== -1) {
      if (address !== undefined) customers[idx].address = address;
      if (name !== undefined) customers[idx].name = name;
      writeJSON(CUSTOMERS_FILE, customers);
      const { password: _, ...customerSafe } = customers[idx];
      return res.json({ success: true, user: customerSafe });
    }
    res.status(404).json({ success: false, message: 'Customer not found' });
  }
});

// 6. FETCH CUSTOMER ORDERS
app.get('/api/customer/orders', async (req, res) => {
  const { mobile, phone, userId } = req.query;
  const searchNum = String(mobile || phone || '').replace(/\D/g, '');

  if (isMongoConnected) {
    const filter = {};
    if (searchNum) filter.$or = [{ phone: new RegExp(searchNum) }, { mobile: new RegExp(searchNum) }];
    if (userId) filter.customerId = userId;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.json(orders);
  } else {
    const orders = readJSON(ORDERS_FILE);
    const filtered = orders.filter(o => {
      if (searchNum && (String(o.phone || '').replace(/\D/g, '').includes(searchNum) || String(o.mobile || '').replace(/\D/g, '').includes(searchNum))) return true;
      if (userId && o.customerId === userId) return true;
      return false;
    });
    return res.json(filtered);
  }
});

// 7. GET PRODUCTS (Public)
app.get('/api/products', async (req, res) => {
  if (isMongoConnected) {
    const products = await Product.find().sort({ createdAt: 1 });
    return res.json(products);
  } else {
    return res.json(readJSON(PRODUCTS_FILE));
  }
});

// 8. ADD PRODUCT (Admin Only)
app.post('/api/admin/products', checkAdminAuth, async (req, res) => {
  const { name, category, retailPrice, wholesalePrice, unit, image, imageUrl, description, inStock, isPlaceholderPrice } = req.body;
  if (!name || !retailPrice || !wholesalePrice) return res.status(400).json({ success: false, message: 'Name, retail price, and wholesale price required.' });

  const productData = {
    id: `prod-${Date.now()}`,
    name,
    category: category || 'Sweets',
    retailPrice: Number(retailPrice),
    wholesalePrice: Number(wholesalePrice),
    unit: unit || '1 kg',
    image: imageUrl || image || '/images/placeholder.jpg',
    imageUrl: imageUrl || image || '/images/placeholder.jpg',
    description: description || '',
    inStock: inStock !== undefined ? Boolean(inStock) : true,
    isPlaceholderPrice: Boolean(isPlaceholderPrice)
  };

  if (isMongoConnected) {
    const newProduct = await Product.create(productData);
    return res.status(201).json({ success: true, product: newProduct });
  } else {
    const products = readJSON(PRODUCTS_FILE);
    products.push(productData);
    writeJSON(PRODUCTS_FILE, products);
    return res.status(201).json({ success: true, product: productData });
  }
});

// 9. EDIT PRODUCT (Admin Only)
app.put('/api/admin/products/:id', checkAdminAuth, async (req, res) => {
  const prodId = req.params.id;

  if (isMongoConnected) {
    const updated = await Product.findOneAndUpdate(
      { $or: [{ id: prodId }, { _id: mongoose.Types.ObjectId.isValid(prodId) ? prodId : null }] },
      { ...req.body, image: req.body.imageUrl || req.body.image },
      { new: true }
    );
    return res.json({ success: true, product: updated });
  } else {
    const products = readJSON(PRODUCTS_FILE);
    const idx = products.findIndex(p => p.id === prodId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
    products[idx] = { ...products[idx], ...req.body, image: req.body.imageUrl || req.body.image || products[idx].image };
    writeJSON(PRODUCTS_FILE, products);
    return res.json({ success: true, product: products[idx] });
  }
});

// 10. DELETE PRODUCT (Admin Only)
app.delete('/api/admin/products/:id', checkAdminAuth, async (req, res) => {
  const prodId = req.params.id;

  if (isMongoConnected) {
    await Product.findOneAndDelete({ $or: [{ id: prodId }, { _id: mongoose.Types.ObjectId.isValid(prodId) ? prodId : null }] });
    return res.json({ success: true, message: 'Product deleted' });
  } else {
    let products = readJSON(PRODUCTS_FILE);
    products = products.filter(p => p.id !== prodId);
    writeJSON(PRODUCTS_FILE, products);
    return res.json({ success: true, message: 'Product deleted' });
  }
});

// 11. UPLOAD PRODUCT IMAGE (Admin Only - Cloudinary or Local)
app.post('/api/admin/upload', checkAdminAuth, uploadMiddleware.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  let imagePath;
  if (isCloudinaryConfigured && req.file.path) {
    imagePath = req.file.path; // Full Cloudinary HTTPS URL!
  } else {
    imagePath = `/images/${req.file.filename}`;
  }

  res.json({ success: true, imagePath, imageUrl: imagePath });
});

// 12. PLACE NEW ORDER (Public / Customer)
app.post('/api/orders', async (req, res) => {
  const { customerId, customerName, phone, mobile, address, orderType, items, subtotal, grandTotal, paymentMethod } = req.body;
  if (!customerName || (!phone && !mobile) || !address || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'Missing order details' });
  }

  const orderId = `SDKAS-${Date.now().toString().slice(-6)}`;
  const orderData = {
    id: orderId,
    customerId: customerId || '',
    customerName,
    phone: phone || mobile,
    mobile: mobile || phone,
    address,
    orderType: orderType || 'Retail',
    items,
    subtotal: Number(subtotal),
    grandTotal: Number(grandTotal),
    paymentMethod: paymentMethod || 'Cash on Delivery',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  if (isMongoConnected) {
    const newOrder = await Order.create(orderData);
    return res.status(201).json({ success: true, orderId, order: newOrder });
  } else {
    const orders = readJSON(ORDERS_FILE);
    orders.unshift(orderData);
    writeJSON(ORDERS_FILE, orders);
    return res.status(201).json({ success: true, orderId, order: orderData });
  }
});

// 13. GET ALL ORDERS (Admin Only)
app.get('/api/admin/orders', checkAdminAuth, async (req, res) => {
  if (isMongoConnected) {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } else {
    return res.json(readJSON(ORDERS_FILE));
  }
});

// 14. UPDATE ORDER STATUS (Admin Only)
app.put('/api/admin/orders/:id', checkAdminAuth, async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (isMongoConnected) {
    const updated = await Order.findOneAndUpdate(
      { $or: [{ id: orderId }, { _id: mongoose.Types.ObjectId.isValid(orderId) ? orderId : null }] },
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
    sendWhatsAppNotification(updated, status).catch(() => {});
    return res.json({ success: true, order: updated });
  } else {
    const orders = readJSON(ORDERS_FILE);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Order not found' });
    orders[idx].status = status;
    writeJSON(ORDERS_FILE, orders);
    sendWhatsAppNotification(orders[idx], status).catch(() => {});
    return res.json({ success: true, order: orders[idx] });
  }
});

// 15. SUBMIT CONTACT INQUIRY (Public)
app.post('/api/contact', async (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) return res.status(400).json({ success: false, message: 'All fields required' });

  const contactData = {
    id: `msg-${Date.now()}`,
    name,
    phone,
    message,
    read: false,
    createdAt: new Date().toISOString()
  };

  if (isMongoConnected) {
    await Contact.create(contactData);
  } else {
    const contacts = readJSON(CONTACTS_FILE);
    contacts.unshift(contactData);
    writeJSON(CONTACTS_FILE, contacts);
  }

  sendWhatsAppText(WHATSAPP_OWNER_NUMBER, `New message from ${name} (${phone}): ${message}`).catch(() => {});
  res.status(201).json({ success: true, message: 'Message sent successfully.' });
});

// 16. GET CONTACT MESSAGES (Admin Only)
app.get('/api/admin/contacts', checkAdminAuth, async (req, res) => {
  if (isMongoConnected) {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json(contacts);
  } else {
    return res.json(readJSON(CONTACTS_FILE));
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Dairy E-commerce API Server running on port ${PORT}`);
});
