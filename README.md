# Shri Datta Krushi Abhivrudhi Sangh, Ingali - Dairy E-Commerce Website

A modern, responsive, full-stack e-commerce web application with **MongoDB Atlas Cloud Database**, **Cloudinary Cloud Image Storage**, and decoupled **Frontend** and **Backend** architecture.

---

## ☁️ Persistent Cloud Infrastructure Overview

- **Database**: MongoDB Atlas (Cloud NoSQL Database)
- **Image Storage**: Cloudinary (Cloud Media Storage & CDN)
- **Authentication**: JWT Tokens + bcrypt Password Hashing
- **Deployment Resilience**: All products, customer orders, user accounts, and image uploads persist across server deploys, restarts, and host switches!

---

## 📁 Project Structure

```
ecommerce/
├── package.json               # Root launcher (runs frontend & backend together)
├── README.md
├── backend/                   # Node.js + Express Backend REST API
│   ├── .env.example           # Environment variables template
│   ├── index.js               # API Server routes & cloud database connections
│   ├── migrate.js             # One-time JSON to MongoDB Atlas migration script
│   ├── models/                # Mongoose Models (Product, Order, Customer, Admin, Contact)
│   ├── data/                  # Seed JSON files
│   └── uploads/
└── frontend/                  # React (Vite) Frontend Application
    ├── .env.example           # Production API URL template
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── components/
        ├── context/           # CartContext & AuthContext
        ├── pages/             # Home, Shop, Cart, Checkout, CustomerAuth, CustomerOrders, Admin
        └── services/          # API Service layer
```

---

## 🛠️ Step-by-Step Setup Guide

### 1. Setting Up Free MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. Create a **Free Shared Cluster (M0)**.
3. Under **Database Access**, create a database user (e.g. username `datta_admin` and password).
4. Under **Network Access**, click **Add IP Address** and choose `0.0.0.0/0` (Allow Access from Anywhere).
5. Click **Connect** -> **Drivers** -> Copy your Connection String:
   ```
   mongodb+srv://datta_admin:<password>@cluster0.mongodb.net/shri_datta_dairy?retryWrites=true&w=majority
   ```

### 2. Setting Up Free Cloudinary Image Storage
1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account.
2. On your Cloudinary Dashboard, copy your:
   - **Cloud Name** (`CLOUDINARY_CLOUD_NAME`)
   - **API Key** (`CLOUDINARY_API_KEY`)
   - **API Secret** (`CLOUDINARY_API_SECRET`)

### 3. Setting Environment Variables
Create a `.env` file in the `backend/` directory using `backend/.env.example` as a guide:

```env
PORT=5000
JWT_SECRET=your_secret_jwt_key_here
MONGODB_URI=mongodb+srv://datta_admin:your_password@cluster0.mongodb.net/shri_datta_dairy?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

On production hosting platforms (Render, Railway, Vercel, Heroku), add these exact environment variable names in the hosting provider's Dashboard settings!

---

## 🚚 One-Time Data Migration Script (`migrate.js`)

To push all your existing product catalog (Peda, Khova, Basundi, Kalakand, Curd, Shrikhand, Milk Cake, Milk, Kunda, Ghee, Lassi, Paneer, Butter) and user accounts into MongoDB Atlas automatically:

```bash
cd backend
node migrate.js
```

Upon completion, you will see:
`🎉 ALL DATA MIGRATED TO MONGODB ATLAS SUCCESSFULLY!`

---

## 🚀 How to Run locally

```bash
# Install dependencies in root, backend, and frontend
npm run install:all

# Start both Backend API (Port 5000) and Frontend (Port 5173) concurrently
npm run dev
```

- **Customer Site**: [http://localhost:5173](http://localhost:5173)
- **Hidden Admin Portal**: [http://localhost:5173/admin](http://localhost:5173/admin) (Mobile: `9999999999` / Password: `admin123`)