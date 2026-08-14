import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Milk, Menu, X, PhoneCall, ShieldCheck, Tag, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { cartCount, pricingMode, setPricingMode } = useCart();
  const { customerUser, isCustomerLoggedIn, logoutCustomer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
    }}>
      {/* Top Banner with Contact & FSSAI */}
      <div style={{
        background: '#1b5e20',
        color: '#ffffff',
        fontSize: '0.8rem',
        padding: '6px 0',
        fontWeight: 500
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PhoneCall size={13} /> Call Us: <strong>9481327296 / 7795687471</strong>
            </span>
            <span style={{ opacity: 0.8 }}>|</span>
            <span>📍 Ingali, Chikkodi, Belagavi, Karnataka</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldCheck size={12} /> FSSAI APPROVED DAIRY
            </span>
            <span style={{ opacity: 0.8 }}>|</span>
            <span style={{ color: '#fff9c4', fontWeight: 600 }}>Wholesale & Retail Dairy</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ padding: '12px 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo & Name */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
            color: '#ffffff',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(27, 94, 32, 0.3)'
          }}>
            <Milk size={26} />
          </div>
          <div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#1b5e20',
              lineHeight: 1.1,
              letterSpacing: '-0.3px'
            }}>
              Shri Datta Krushi
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d4a373', letterSpacing: '0.5px' }}>
              ABHIVRUDHI SANGH, INGALI
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="desktop-nav">
          <Link to="/" style={{
            fontWeight: isActive('/') ? 700 : 500,
            color: isActive('/') ? '#1b5e20' : '#475569',
            fontSize: '0.95rem'
          }}>
            Home
          </Link>
          <Link to="/shop" style={{
            fontWeight: isActive('/shop') ? 700 : 500,
            color: isActive('/shop') ? '#1b5e20' : '#475569',
            fontSize: '0.95rem'
          }}>
            Shop Products
          </Link>
          <Link to="/about" style={{
            fontWeight: isActive('/about') ? 700 : 500,
            color: isActive('/about') ? '#1b5e20' : '#475569',
            fontSize: '0.95rem'
          }}>
            About Us
          </Link>
          <Link to="/contact" style={{
            fontWeight: isActive('/contact') ? 700 : 500,
            color: isActive('/contact') ? '#1b5e20' : '#475569',
            fontSize: '0.95rem'
          }}>
            Contact
          </Link>

          {/* Logged in Customer Avatar Dropdown */}
          {isCustomerLoggedIn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/my-orders" style={{
                background: '#e8f5e9',
                color: '#1b5e20',
                fontWeight: 700,
                fontSize: '0.88rem',
                padding: '6px 12px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid #c8e6c9'
              }}>
                <User size={15} /> Hi, {customerUser.name?.split(' ')[0] || 'Customer'}
              </Link>
              <button
                onClick={logoutCustomer}
                style={{
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
                title="Logout Account"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </nav>

        {/* Action Controls: Wholesale Toggle & Cart Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Wholesale vs Retail Toggle */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '24px',
            padding: '3px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setPricingMode('retail')}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: pricingMode === 'retail' ? 700 : 500,
                background: pricingMode === 'retail' ? '#1b5e20' : 'transparent',
                color: pricingMode === 'retail' ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: pricingMode === 'retail' ? '0 2px 6px rgba(27,94,32,0.3)' : 'none'
              }}
            >
              Retail
            </button>
            <button
              onClick={() => setPricingMode('wholesale')}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: pricingMode === 'wholesale' ? 700 : 500,
                background: pricingMode === 'wholesale' ? '#e65100' : 'transparent',
                color: pricingMode === 'wholesale' ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: pricingMode === 'wholesale' ? '0 2px 6px rgba(230,81,0,0.3)' : 'none'
              }}
            >
              <Tag size={12} /> Wholesale
            </button>
          </div>

          {/* Cart Icon Button */}
          <Link to="/cart" style={{
            position: 'relative',
            background: '#1b5e20',
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(27, 94, 32, 0.25)'
          }}>
            <ShoppingBag size={18} />
            <span className="cart-text-mobile" style={{ display: 'inline' }}>Cart</span>
            {cartCount > 0 && (
              <span style={{
                background: '#f4a261',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                borderRadius: '9999px',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 6px',
                marginLeft: '2px'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: '#f1f5f9',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              color: '#334155',
              display: 'none'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600, color: '#1b5e20' }}>
            Home
          </Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600, color: '#334155' }}>
            Shop Products
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600, color: '#334155' }}>
            About Us
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 600, color: '#334155' }}>
            Contact
          </Link>

          {isCustomerLoggedIn && (
            <>
              <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: 700, color: '#1b5e20' }}>
                📦 My Orders ({customerUser.name})
              </Link>
              <button onClick={() => { logoutCustomer(); setMobileMenuOpen(false); }} style={{ textAlign: 'left', padding: '8px 0', fontWeight: 600, color: '#c62828', background: 'none', border: 'none' }}>
                Logout Account
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};
