import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { CustomerOrders } from './pages/CustomerOrders';
import { SingleLoginLanding } from './pages/SingleLoginLanding';

// Main Layout Handler
const AppContent = () => {
  const { isAdminLoggedIn, isCustomerLoggedIn } = useAuth();
  const isLoggedIn = isAdminLoggedIn || isCustomerLoggedIn;

  // 1. If NOT logged in: Show ONLY the Login Page (Hide Navbar, Footer, and Navigation links)
  if (!isLoggedIn) {
    return <SingleLoginLanding />;
  }

  // 2. If Admin is logged in: Render Admin Control Dashboard
  if (isAdminLoggedIn) {
    return (
      <div className="app-container">
        <main className="main-content">
          <Admin />
        </main>
      </div>
    );
  }

  // 3. If Customer is logged in: Show full Storefront with Navbar, Home, Shop, Contact, Footer
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<CustomerOrders />} />
          <Route path="/my-orders" element={<CustomerOrders />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
