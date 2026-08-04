import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Paths
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

// Serve uploaded/static images with correct SVG content type handling
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

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PUBLIC_IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9]/g, '_');
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Helper functions for reading/writing JSON files safely
const readJSON = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
};

const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
};

// Admin authentication middleware helper
const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const providedPass = req.headers['x-admin-password'] || (authHeader ? authHeader.replace('Bearer ', '') : null);
  
  if (providedPass === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized. Invalid admin password.' });
  }
};

// --- ROUTES ---

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Authenticated successfully' });
  }
  return res.status(401).json({ success: false, message: 'Incorrect password' });
});

// 2. Get All Products
app.get('/api/products', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  res.json(products);
});

// 3. Add Product (Admin)
app.post('/api/admin/products', checkAuth, (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const { name, category, retailPrice, wholesalePrice, unit, image, description, inStock, isPlaceholderPrice } = req.body;

  if (!name || !retailPrice || !wholesalePrice) {
    return res.status(400).json({ success: false, message: 'Name, retail price, and wholesale price are required.' });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    category: category || 'General',
    retailPrice: Number(retailPrice),
    wholesalePrice: Number(wholesalePrice),
    unit: unit || '1 kg',
    image: image || '/images/placeholder.jpg',
    description: description || '',
    inStock: inStock !== undefined ? Boolean(inStock) : true,
    isPlaceholderPrice: Boolean(isPlaceholderPrice)
  };

  products.push(newProduct);
  writeJSON(PRODUCTS_FILE, products);
  res.status(201).json({ success: true, product: newProduct });
});

// 4. Edit Product (Admin)
app.put('/api/admin/products/:id', checkAuth, (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const existing = products[index];
  const updated = {
    ...existing,
    ...req.body,
    retailPrice: req.body.retailPrice !== undefined ? Number(req.body.retailPrice) : existing.retailPrice,
    wholesalePrice: req.body.wholesalePrice !== undefined ? Number(req.body.wholesalePrice) : existing.wholesalePrice,
    inStock: req.body.inStock !== undefined ? Boolean(req.body.inStock) : existing.inStock,
    isPlaceholderPrice: req.body.isPlaceholderPrice !== undefined ? Boolean(req.body.isPlaceholderPrice) : existing.isPlaceholderPrice
  };

  products[index] = updated;
  writeJSON(PRODUCTS_FILE, products);
  res.json({ success: true, product: updated });
});

// 5. Delete Product (Admin)
app.delete('/api/admin/products/:id', checkAuth, (req, res) => {
  let products = readJSON(PRODUCTS_FILE);
  const initialLength = products.length;
  products = products.filter(p => p.id !== req.params.id);

  if (products.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  writeJSON(PRODUCTS_FILE, products);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// 6. Upload Image (Admin)
app.post('/api/admin/upload', checkAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  const imagePath = `/images/${req.file.filename}`;
  res.json({ success: true, imagePath });
});

// 7. Place New Order (Public)
app.post('/api/orders', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const { customerName, phone, address, orderType, items, subtotal, grandTotal, paymentMethod } = req.body;

  if (!customerName || !phone || !address || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'Missing required order details' });
  }

  const orderId = `SDKAS-${Date.now().toString().slice(-6)}`;
  const newOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customerName,
    phone,
    address,
    orderType: orderType || 'Retail', // Wholesale or Retail
    items,
    subtotal: Number(subtotal),
    grandTotal: Number(grandTotal),
    paymentMethod: paymentMethod || 'Cash on Delivery',
    status: 'Pending' // Pending, Confirmed, Delivered, Cancelled
  };

  orders.unshift(newOrder); // Newest first
  writeJSON(ORDERS_FILE, orders);
  res.status(201).json({ success: true, orderId, order: newOrder });
});

// 8. Get Orders (Admin)
app.get('/api/admin/orders', checkAuth, (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  res.json(orders);
});

// 9. Update Order Status (Admin)
app.put('/api/admin/orders/:id', checkAuth, (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const index = orders.findIndex(o => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  orders[index].status = req.body.status || orders[index].status;
  writeJSON(ORDERS_FILE, orders);
  res.json({ success: true, order: orders[index] });
});

// 10. Submit Contact Form (Public)
app.post('/api/contact', (req, res) => {
  const contacts = readJSON(CONTACTS_FILE);
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Name, phone, and message are required.' });
  }

  const newContact = {
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    name,
    phone,
    message,
    read: false
  };

  contacts.unshift(newContact);
  writeJSON(CONTACTS_FILE, contacts);
  res.status(201).json({ success: true, message: 'Thank you! Your message has been sent successfully.' });
});

// 11. Get Contact Messages (Admin)
app.get('/api/admin/contacts', checkAuth, (req, res) => {
  const contacts = readJSON(CONTACTS_FILE);
  res.json(contacts);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Dairy E-commerce API Server running on port ${PORT}`);
});
