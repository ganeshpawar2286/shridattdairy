# Shri Datta Krushi Abhivrudhi Sangh, Ingali - Dairy E-Commerce Website

A modern, responsive, full-stack e-commerce web application built for **Shri Datta Krushi Abhivrudhi Sangh, Ingali**.

## 🌟 Key Features

- **Editable Products Database**: Products are stored in `server/data/products.json`, which acts as a zero-config, editable single source of truth.
- **Wholesale vs Retail Pricing Toggle**: Customers can switch between Retail and Wholesale pricing modes anytime across the site and cart.
- **Owner Admin Portal (`/admin`)**: Password-protected login (`admin123`) to add, edit, or delete products, update prices, manage stock, view customer orders, and read contact form submissions.
- **FSSAI Quality Badge**: FSSAI certification displayed in the Header, Footer, Home, and About pages.
- **Payment Options**: Cash on Delivery and direct UPI Payment using `7795687471@rbl` with dynamic QR code generator & click-to-copy UPI ID.
- **Floating WhatsApp Button**: Quick chat link to `+91 7795687471`.
- **Contact Form**: Customer inquiries saved to `server/data/contacts.json`.

---

## 🚀 How to Run Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### 2. Installation
Open your terminal in the project root folder and run:
```bash
npm install
```

### 3. Start Development Server (Frontend + Backend)
Run the following command to start both the Express backend API (Port 5000) and the Vite frontend (Port 5173):
```bash
npm run dev
```

Then open your browser and navigate to:
- **Website Frontend**: [http://localhost:5173](http://localhost:5173)
- **Owner Admin Panel**: [http://localhost:5173/admin](http://localhost:5173/admin) (Default password: `admin123`)

---

## 📁 How to Edit `products.json` & Manage Products

### Method A: Via Admin Panel (Recommended)
1. Go to `http://localhost:5173/admin`
2. Enter password `admin123`
3. Under **Manage Products**, click **"Edit"** on any product (or click **"Add New Product"**).
4. Update the **Retail Price**, **Wholesale Price**, Stock status, Unit, or description and click **"Save Changes"**.
5. The changes update `server/data/products.json` in real time!

### Method B: Direct File Editing
You can open `server/data/products.json` in any text editor and edit product objects directly:
```json
{
  "id": "prod-1",
  "name": "Peda",
  "category": "Sweets",
  "retailPrice": 360,
  "wholesalePrice": 330,
  "unit": "1 kg",
  "image": "/images/peda.jpg",
  "description": "Traditional fresh milk sweet made daily from pure condensed milk.",
  "inStock": true,
  "isPlaceholderPrice": false
}
```

---

## 🖼️ Replacing Placeholder Product Images

Product images are located in the `public/images/` folder. The website comes with pre-generated crisp SVG placeholder images for all 13 products.

To replace them with real photos of your products:
1. Place your photo files into `public/images/` using the exact file names below:
   - `peda.jpg`
   - `khova.jpg`
   - `basundi.jpg`
   - `kalakand.jpg`
   - `curd.jpg`
   - `shrikhand.jpg`
   - `milk_cake.jpg`
   - `milk.jpg`
   - `kunda.jpg`
   - `ghee.jpg`
   - `lassi.jpg`
   - `paneer.jpg`
   - `butter.jpg`

*(Alternatively, you can upload new images directly from the Admin Panel when adding or editing a product!)*

---

## 📞 Business Details

- **Business Name**: Shri Datta Krushi Abhivrudhi Sangh, Ingali
- **Location**: Ingali, Chikkodi Taluk, Belagavi District, Karnataka, India
- **Contact Numbers**: 9481327296, 7795687471, 7899507471
- **Email**: pawarganesh5070@gmail.com
- **UPI ID**: `7795687471@rbl`
