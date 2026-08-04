import React from 'react';
import { Link } from 'react-router-dom';
import { Milk, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { FSSAIBadge } from './FSSAIBadge';

export const Footer = () => {
  return (
    <footer style={{
      background: '#0f3813',
      color: '#f8fafc',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
      borderTop: '4px solid #2e7d32'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Col 1: Business Overview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: '#2e7d32', padding: '8px', borderRadius: '10px', color: '#ffffff' }}>
                <Milk size={24} />
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Shri Datta Krushi Abhivrudhi Sangh
              </div>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1.2rem', lineHeight: '1.6' }}>
              Premier producer & supplier of 100% pure, farm-fresh milk products in Wholesale & Retail. Serving authentic taste and rich quality directly from Ingali, Karnataka.
            </p>
            <FSSAIBadge />
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#cbd5e1' }}>Home Page</Link></li>
              <li><Link to="/shop" style={{ color: '#cbd5e1' }}>Shop Dairy Products</Link></li>
              <li><Link to="/about" style={{ color: '#cbd5e1' }}>About Our Sangh</Link></li>
              <li><Link to="/contact" style={{ color: '#cbd5e1' }}>Contact Us</Link></li>
              <li><Link to="/cart" style={{ color: '#cbd5e1' }}>Shopping Cart</Link></li>
              <li><Link to="/admin" style={{ color: '#94a3b8' }}>Admin Login</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Contact Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} style={{ color: '#81c784', flexShrink: 0, marginTop: '3px' }} />
                <span>Ingali, Chikkodi Taluk, Belagavi District, Karnataka, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} style={{ color: '#81c784', flexShrink: 0 }} />
                <div>
                  <a href="tel:9481327296" style={{ color: '#ffffff', fontWeight: 600 }}>9481327296</a>,{' '}
                  <a href="tel:7795687471" style={{ color: '#ffffff', fontWeight: 600 }}>7795687471</a>,{' '}
                  <a href="tel:7899507471" style={{ color: '#ffffff', fontWeight: 600 }}>7899507471</a>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} style={{ color: '#81c784', flexShrink: 0 }} />
                <a href="mailto:pawarganesh5070@gmail.com" style={{ color: '#ffffff', wordBreak: 'break-all' }}>
                  pawarganesh5070@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#94a3b8'
        }}>
          <div>
            © {new Date().getFullYear()} Shri Datta Krushi Abhivrudhi Sangh, Ingali. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>FSSAI Certified</span>
            <span>•</span>
            <span>Wholesale & Retail Dairy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
