# Shri Datta Krushi Abhivrudhi Sangh, Ingali - Dairy E-Commerce Website

A modern, responsive, full-stack e-commerce web application with **MongoDB Atlas Cloud Database**, **Cloudinary Cloud Image Storage**, **Delivery Area Restriction (Chikkodi Taluka)**, **Google Maps Pin Drop Picker**, and multi-step **Order Status Tracking**.

---

## 📍 Delivery Area Restriction & Location Validation

- **Allowed Region**: Orders are strictly restricted to **Chikkodi Taluka, Belagavi District, Karnataka** (59 master villages including Ingali `591242`, Chikkodi `591201`, etc.).
- **Master List**: `backend/data/deliveryAreas.json` (dynamic list accessible via `GET /api/delivery-areas`).
- **Validation**: Enforced on both frontend checkout and backend API (`POST /api/orders`).
- **Google Maps Pin Drop Picker**: Customers select their exact delivery pin drop location with latitude and longitude.

---

## 🚚 Order Status Tracking System

Multi-stage order lifecycle:
`Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered` (or `Cancelled`)

- **Admin Orders Portal**: Includes status dropdown and map preview link opening exact coordinates in Google Maps (`https://www.google.com/maps?q=<lat>,<lng>`).
- **Customer My Orders Portal**: Vertical tracking timeline displaying live progress and timestamps for every stage from `deliveryHistory`.

---

## 📁 Project Structure

```
ecommerce/
├── package.json               # Root launcher (runs frontend & API together)
├── README.md
├── backend/                   # Node.js + Express Backend REST API
│   ├── .env.example           # Environment variables template
│   ├── index.js               # API Server routes & cloud database connections
│   ├── models/                # Mongoose Models (Product, Order, Customer, Admin, Contact)
│   ├── data/
│   │   ├── deliveryAreas.json # Master 59 Villages & PIN codes list
│   │   ├── products.json
│   │   └── orders.json
│   └── uploads/
└── frontend/                  # React (Vite) Frontend Application
    ├── .env.example           # Production API URL & Google Maps key template
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── LocationPickerMap.jsx # Interactive Map location picker
        │   └── Navbar.jsx
        ├── pages/             # Home, Shop, Cart, Checkout, CustomerOrders, Admin
        └── services/          # API Service layer (api.js)
```

---

## 🛠️ Step-by-Step Setup Guide

### 1. Setting Up Free MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. Create a **Free Shared Cluster (M0)**.
3. Under **Database Access**, create a database user (e.g. username `datta_admin` and password).
4. Under **Network Access**, click **Add IP Address** and choose `0.0.0.0/0` (Allow Access from Anywhere).
5. Copy your Connection String:
   ```
   mongodb+srv://datta_admin:<password>@cluster0.mongodb.net/shri_datta_dairy?retryWrites=true&w=majority
   ```

### 2. Setting Up Cloudinary Image Storage
1. Sign up on [Cloudinary](https://cloudinary.com/).
2. Copy your **Cloud Name**, **API Key**, and **API Secret**.

### 3. Setting Up Google Maps API Key (Optional for Custom Map Tiles)
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Maps JavaScript API** and **Geocoding API**.
3. Create an API Key and add it to `frontend/.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```
   *(If not set, the app uses standard interactive map embeds automatically!)*

---

## 🚀 How to Run Locally

```bash
# Install dependencies in root, backend, and frontend
npm run install:all

# Start both Backend API (Port 5000) and Frontend (Port 5173) concurrently
npm run dev
```

- **Customer Site**: [http://localhost:5173](http://localhost:5173)
- **Admin Portal**: [http://localhost:5173/admin](http://localhost:5173/admin) (Mobile: `7795687471` / Password: `Ganesh@2286`)