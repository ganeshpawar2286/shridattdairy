import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import { Customer } from './models/Customer.js';
import { Admin } from './models/Admin.js';
import { Contact } from './models/Contact.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI environment variable is missing in .env file.');
  console.log('Please set MONGODB_URI in backend/.env before running migrate.js');
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

const readJSON = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    return [];
  }
};

const runMigration = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully.');

    // 1. Migrate Products
    const productsData = readJSON(PRODUCTS_FILE);
    if (productsData.length > 0) {
      console.log(`Migrating ${productsData.length} products to MongoDB...`);
      for (const item of productsData) {
        await Product.findOneAndUpdate(
          { id: item.id },
          {
            id: item.id,
            name: item.name,
            category: item.category || 'General',
            retailPrice: Number(item.retailPrice),
            wholesalePrice: Number(item.wholesalePrice),
            unit: item.unit || '1 kg',
            image: item.image || '/images/placeholder.jpg',
            imageUrl: item.imageUrl || item.image || '/images/placeholder.jpg',
            description: item.description || '',
            inStock: item.inStock !== undefined ? Boolean(item.inStock) : true,
            isPlaceholderPrice: Boolean(item.isPlaceholderPrice)
          },
          { upsert: true, new: true }
        );
      }
      console.log('✅ Products migration complete.');
    }

    // 2. Migrate Admins
    const adminsData = readJSON(ADMINS_FILE);
    if (adminsData.length > 0) {
      console.log(`Migrating ${adminsData.length} admin accounts to MongoDB...`);
      for (const item of adminsData) {
        await Admin.findOneAndUpdate(
          { mobile: item.mobile },
          {
            id: item.id || `admin-${Date.now()}`,
            name: item.name || 'Shri Datta Admin',
            mobile: item.mobile,
            password: item.password,
            role: 'admin'
          },
          { upsert: true, new: true }
        );
      }
      console.log('✅ Admin accounts migration complete.');
    }

    // 3. Migrate Customers
    const customersData = readJSON(CUSTOMERS_FILE);
    if (customersData.length > 0) {
      console.log(`Migrating ${customersData.length} customer accounts to MongoDB...`);
      for (const item of customersData) {
        await Customer.findOneAndUpdate(
          { mobile: item.mobile },
          {
            id: item.id || `cust-${Date.now()}`,
            name: item.name,
            mobile: item.mobile,
            password: item.password,
            address: item.address || '',
            role: 'customer'
          },
          { upsert: true, new: true }
        );
      }
      console.log('✅ Customer accounts migration complete.');
    }

    // 4. Migrate Orders
    const ordersData = readJSON(ORDERS_FILE);
    if (ordersData.length > 0) {
      console.log(`Migrating ${ordersData.length} orders to MongoDB...`);
      for (const item of ordersData) {
        await Order.findOneAndUpdate(
          { id: item.id },
          {
            id: item.id,
            customerId: item.customerId || '',
            customerName: item.customerName,
            phone: item.phone || item.mobile,
            mobile: item.mobile || item.phone,
            address: item.address,
            orderType: item.orderType || 'Retail',
            items: item.items || [],
            subtotal: Number(item.subtotal || item.grandTotal || 0),
            grandTotal: Number(item.grandTotal || 0),
            paymentMethod: item.paymentMethod || 'Cash on Delivery',
            status: item.status || 'Pending'
          },
          { upsert: true, new: true }
        );
      }
      console.log('✅ Orders migration complete.');
    }

    // 5. Migrate Contacts
    const contactsData = readJSON(CONTACTS_FILE);
    if (contactsData.length > 0) {
      console.log(`Migrating ${contactsData.length} contact messages to MongoDB...`);
      for (const item of contactsData) {
        await Contact.findOneAndUpdate(
          { id: item.id },
          {
            id: item.id,
            name: item.name,
            phone: item.phone,
            message: item.message,
            read: Boolean(item.read)
          },
          { upsert: true, new: true }
        );
      }
      console.log('✅ Contacts migration complete.');
    }

    console.log('\n🎉 ALL DATA MIGRATED TO MONGODB ATLAS SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

runMigration();
