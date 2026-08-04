import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Milk, ShieldCheck, Tag, ArrowRight, Award, Truck, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';
import { fetchProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { FSSAIBadge } from '../components/FSSAIBadge';
import { useCart } from '../context/CartContext';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { pricingMode, setPricingMode } = useCart();

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="animate-fade-in">
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #0f3813 0%, #1b5e20 60%, #2e7d32 100%)',
        color: '#ffffff',
        padding: '4rem 0 5rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Soft background glow */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(212, 163, 115, 0.15)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', padding: '6px 14px', borderRadius: '20px', marginBottom: '1.2rem', backdropFilter: 'blur(4px)' }}>
                <ShieldCheck size={16} style={{ color: '#81c784' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e8f5e9' }}>FSSAI Approved • Pure & Organic Quality</span>
              </div>

              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '2.8rem',
                fontWeight: 800,
                lineHeight: '1.15',
                color: '#ffffff',
                marginBottom: '1.2rem'
              }}>
                Shri Datta Krushi <br />
                <span style={{ color: '#ffd54f' }}>Abhivrudhi Sangh, Ingali</span>
              </h1>

              <p style={{ fontSize: '1.15rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '2rem', maxWidth: '540px' }}>
                Fresh & Authentic Dairy Products delivered directly from our dairy in Ingali. Serving <strong>Wholesale & Retail</strong> buyers with premium Peda, Khova, Basundi, Ghee, Paneer, Dahi & fresh Milk daily.
              </p>

              {/* Wholesale vs Retail Selection Quick Box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '2rem',
                maxWidth: '480px'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#fff9c4', fontWeight: 600, marginBottom: '8px' }}>
                  Select Your Preferred Buying Mode:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => setPricingMode('retail')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: 'none',
                      background: pricingMode === 'retail' ? '#ffffff' : 'rgba(255,255,255,0.15)',
                      color: pricingMode === 'retail' ? '#1b5e20' : '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    🥛 Retail Customer
                  </button>

                  <button
                    onClick={() => setPricingMode('wholesale')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: 'none',
                      background: pricingMode === 'wholesale' ? '#f57c00' : 'rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Tag size={14} /> Wholesale Buyer
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/shop" className="btn btn-accent" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                  Shop All Products <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn btn-outline" style={{ borderColor: '#ffffff', color: '#ffffff', padding: '0.9rem 1.8rem', fontSize: '1rem' }}>
                  <PhoneCall size={18} /> Call for Wholesale Inquiry
                </Link>
              </div>
            </div>

            {/* Hero Image Card with Shri Datta Maharaj */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                transform: 'rotate(-1.5deg)'
              }}>
                <img
                  src="/images/shri_datta.jpg"
                  alt="Shri Datta Maharaj"
                  style={{ width: '100%', height: '340px', objectFit: 'contain', borderRadius: '16px', background: '#fffefb' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.svg';
                  }}
                />
                <div style={{ padding: '12px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1b5e20' }}>Shri Datta Maharaj Blessings</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pure & Authentic Dairy Products in Ingali</div>
                  </div>
                  <span className="badge badge-fssai">100% Pure Milk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE HIGHLIGHTS BAR */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: '#e8f5e9', color: '#1b5e20', padding: '12px', borderRadius: '12px' }}>
                <Award size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>FSSAI Approved</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Certified quality & hygiene standards</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: '#fff3e0', color: '#e65100', padding: '12px', borderRadius: '12px' }}>
                <Tag size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Wholesale & Retail</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Special rates for sweet shops & bulk orders</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: '#e3f2fd', color: '#1565c0', padding: '12px', borderRadius: '12px' }}>
                <Milk size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>100% Pure Milk</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Directly from trusted local farms</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: '#f3e5f5', color: '#7b1fa2', padding: '12px', borderRadius: '12px' }}>
                <Truck size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Fresh Daily Supply</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Ingali, Chikkodi & Belagavi regional delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: '#1b5e20', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Our Specialties
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>
                Featured Fresh Dairy Products
              </h2>
            </div>
            <Link to="/shop" className="btn btn-secondary">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              Loading products...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.8rem' }}>
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT US BANNER */}
      <section style={{ background: '#ffffff', padding: '4rem 0', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <FSSAIBadge style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1b5e20', marginBottom: '1.2rem' }}>
                About Shri Datta Krushi Abhivrudhi Sangh
              </h2>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                Located at <strong>Ingali, Chikkodi Taluk, Belagavi District</strong>, our organization is dedicated to providing high-quality, pure dairy products directly from local farmers to households and commercial businesses.
              </p>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.8rem' }}>
                From daily fresh milk to rich Peda, Khova, Basundi, Kalakand, Ghee, and Paneer, we follow strict quality standards approved by FSSAI.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 600 }}>
                  <CheckCircle2 size={18} style={{ color: '#2e7d32' }} /> FSSAI Certified Processing Facility
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 600 }}>
                  <CheckCircle2 size={18} style={{ color: '#2e7d32' }} /> Wholesale supply for weddings, caterers, & sweet shops
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 600 }}>
                  <CheckCircle2 size={18} style={{ color: '#2e7d32' }} /> Transparent pricing for retail & bulk orders
                </div>
              </div>

              <Link to="/about" className="btn btn-primary">
                Read Full Story
              </Link>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
              borderRadius: '24px',
              padding: '2.5rem',
              textAlign: 'center'
            }}>
              <Sparkles size={48} style={{ color: '#1b5e20', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b5e20', marginBottom: '1rem' }}>
                Need Bulk / Wholesale Supply?
              </h3>
              <p style={{ color: '#2e7d32', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                We cater to sweet manufacturers, hotels, caterers, and events across Chikkodi & Belagavi with special wholesale pricing.
              </p>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f3813', marginBottom: '1.5rem' }}>
                Call Us: 9481327296 / 7795687471 / 7899507471
              </div>
              <Link to="/contact" className="btn btn-accent">
                Contact For Wholesale Rates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
