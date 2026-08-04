import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const {
    cart,
    pricingMode,
    setPricingMode,
    getUnitPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal
  } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '4rem 2rem',
          maxWidth: '540px',
          margin: '0 auto',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          <div style={{ background: '#e8f5e9', color: '#1b5e20', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.8rem' }}>
            Your Shopping Cart is Empty
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            Explore our fresh dairy products including Peda, Khova, Basundi, Ghee, and Paneer directly from Ingali.
          </p>
          <Link to="/shop" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Browse Dairy Shop <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>
          Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>

        {/* Pricing Mode Bar */}
        <div style={{
          background: pricingMode === 'wholesale' ? '#fff3e0' : '#e8f5e9',
          border: pricingMode === 'wholesale' ? '1px solid #ffe0b2' : '1px solid #c8e6c9',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Tag size={20} style={{ color: pricingMode === 'wholesale' ? '#e65100' : '#1b5e20' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: pricingMode === 'wholesale' ? '#e65100' : '#1b5e20' }}>
                Cart Pricing Mode: {pricingMode === 'wholesale' ? 'Wholesale Pricing Active' : 'Retail Pricing Active'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                You can switch between Retail and Wholesale mode at any time.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setPricingMode('retail')}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: pricingMode === 'retail' ? '#1b5e20' : '#ffffff',
                color: pricingMode === 'retail' ? '#ffffff' : '#475569'
              }}
            >
              Retail Mode
            </button>
            <button
              onClick={() => setPricingMode('wholesale')}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: pricingMode === 'wholesale' ? '#e65100' : '#ffffff',
                color: pricingMode === 'wholesale' ? '#ffffff' : '#475569'
              }}
            >
              Wholesale Mode
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Cart Items List */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              {cart.map((item, index) => {
                const unitPrice = getUnitPrice(item.product, pricingMode);
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.2rem',
                      borderBottom: index < cart.length - 1 ? '1px solid #f1f5f9' : 'none',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Item Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        background: '#f8fafc'
                      }}
                      onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <span className="badge badge-fssai" style={{ fontSize: '0.7rem', padding: '2px 8px', marginBottom: '4px' }}>
                        {item.product.category}
                      </span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                        {item.product.name}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                        Unit Price: <strong style={{ color: pricingMode === 'wholesale' ? '#e65100' : '#1b5e20' }}>₹{unitPrice}</strong> / {item.product.unit}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px' }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        style={{ padding: '6px 12px', background: 'transparent', border: 'none', color: '#334155' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.95rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        style={{ padding: '6px 12px', background: 'transparent', border: 'none', color: '#334155' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', fontFamily: "'Outfit', sans-serif" }}>
                        ₹{itemTotal}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {item.quantity} × ₹{unitPrice}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      style={{
                        background: '#ffebee',
                        color: '#c62828',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1b5e20', fontWeight: 600 }}>
                <ArrowLeft size={16} /> Continue Shopping
              </Link>

              <button
                onClick={clearCart}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.88rem', cursor: 'pointer' }}
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div>
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '1.8rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              position: 'sticky',
              top: '100px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid #f1f5f9' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Pricing Mode:</span>
                  <strong style={{ color: pricingMode === 'wholesale' ? '#e65100' : '#1b5e20' }}>
                    {pricingMode === 'wholesale' ? 'Wholesale' : 'Retail'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Subtotal:</span>
                  <strong>₹{cartSubtotal}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>FSSAI Quality Assurance:</span>
                  <span style={{ color: '#2e7d32', fontWeight: 600 }}>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Estimated Delivery:</span>
                  <span>Direct from Ingali</span>
                </div>

                <div style={{
                  borderTop: '2px dashed #e2e8f0',
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Grand Total:</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1b5e20', fontFamily: "'Outfit', sans-serif" }}>
                    ₹{cartSubtotal}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <ShieldCheck size={14} style={{ color: '#2e7d32' }} /> Pay on Delivery or UPI Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
