import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { pricingMode, getUnitPrice, addToCart } = useCart();

  if (!product) return null;

  const currentPrice = getUnitPrice(product);
  const isWholesale = pricingMode === 'wholesale';

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }} onClick={onClose}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        animation: 'fadeIn 0.25s ease-out'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#334155',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {/* Image */}
          <div style={{
            background: '#f8fafc',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/placeholder.svg';
              }}
            />
          </div>

          {/* Details */}
          <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-fssai">
                <ShieldCheck size={12} /> FSSAI Approved
              </span>
              <span className={`badge ${isWholesale ? 'badge-wholesale' : 'badge-retail'}`}>
                {isWholesale ? 'Wholesale Price Active' : 'Retail Price Active'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
              {product.name}
            </h2>

            <div style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: isWholesale ? '#e65100' : '#1b5e20',
              fontFamily: "'Outfit', sans-serif",
              marginBottom: '1rem'
            }}>
              ₹{currentPrice} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>per {product.unit}</span>
            </div>

            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Price comparison box */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '10px 14px',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Retail Price:</span>
                <strong>₹{product.retailPrice} / {product.unit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Wholesale Price:</span>
                <strong style={{ color: '#e65100' }}>₹{product.wholesalePrice} / {product.unit}</strong>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                Select Quantity ({product.unit})
              </label>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '12px' }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ padding: '8px 14px', background: 'transparent', border: 'none', color: '#334155' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ padding: '0 16px', fontWeight: 700, fontSize: '1.1rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ padding: '8px 14px', background: 'transparent', border: 'none', color: '#334155' }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                opacity: product.inStock ? 1 : 0.6
              }}
            >
              <ShoppingCart size={18} />
              Add {quantity} to Cart (₹{currentPrice * quantity})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
