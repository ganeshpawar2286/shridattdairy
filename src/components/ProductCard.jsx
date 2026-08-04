import React from 'react';
import { ShoppingCart, Eye, Tag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { cart, pricingMode, getUnitPrice, addToCart, updateQuantity } = useCart();

  const currentPrice = getUnitPrice(product);
  const isWholesale = pricingMode === 'wholesale';
  const savings = product.retailPrice - product.wholesalePrice;

  // Check if item is already in cart
  const cartItem = cart.find(item => item.product.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}
    className="product-card"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(27, 94, 32, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
    }}
    >
      {/* Top Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        <span style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(4px)',
          color: '#1b5e20',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}>
          {product.category}
        </span>

        {isWholesale && savings > 0 && (
          <span style={{
            background: '#e65100',
            color: '#ffffff',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Tag size={10} /> Save ₹{savings}/{product.unit}
          </span>
        )}
      </div>

      {/* Image Container */}
      <div style={{
        width: '100%',
        height: '200px',
        background: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer'
      }} onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.svg';
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '6px',
          cursor: 'pointer'
        }} onClick={() => onQuickView(product)}>
          {product.name}
        </h3>

        <p style={{
          color: '#64748b',
          fontSize: '0.85rem',
          lineHeight: '1.4',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {product.description}
        </p>

        {/* Pricing Block */}
        <div style={{
          background: isWholesale ? '#fff3e0' : '#f8fafc',
          padding: '10px 12px',
          borderRadius: '12px',
          marginBottom: '1rem',
          border: isWholesale ? '1px solid #ffe0b2' : '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <span style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: isWholesale ? '#e65100' : '#1b5e20',
                fontFamily: "'Outfit', sans-serif"
              }}>
                ₹{currentPrice}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '4px' }}>
                / {product.unit}
              </span>
            </div>

            <span className={`badge ${isWholesale ? 'badge-wholesale' : 'badge-retail'}`}>
              {isWholesale ? 'Wholesale' : 'Retail'}
            </span>
          </div>

          {/* Show comparison price */}
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            {isWholesale ? (
              <span>Retail Price: <del>₹{product.retailPrice}</del></span>
            ) : (
              <span>Wholesale Available: <span style={{ color: '#e65100', fontWeight: 600 }}>₹{product.wholesalePrice}/{product.unit}</span></span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onQuickView(product)}
            style={{
              background: '#f1f5f9',
              color: '#334155',
              border: 'none',
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            title="View Details"
          >
            <Eye size={18} />
          </button>

          {cartQuantity > 0 ? (
            /* Interactive +1 / -1 Quantity Control Bar */
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#e8f5e9',
              border: '1.5px solid #2e7d32',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => updateQuantity(product.id, -1)}
                style={{
                  background: '#1b5e20',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
                title="Decrease quantity (-1)"
              >
                <Minus size={16} />
              </button>

              <span style={{
                fontWeight: 800,
                fontSize: '0.92rem',
                color: '#1b5e20',
                padding: '0 8px'
              }}>
                {cartQuantity} in Cart
              </span>

              <button
                onClick={() => updateQuantity(product.id, 1)}
                style={{
                  background: '#1b5e20',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
                title="Increase quantity (+1)"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            /* Standard Add to Cart Button */
            <button
              onClick={() => addToCart(product, 1)}
              disabled={!product.inStock}
              style={{
                flex: 1,
                background: product.inStock ? '#1b5e20' : '#cbd5e1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 14px',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: product.inStock ? 'pointer' : 'not-allowed'
              }}
            >
              <ShoppingCart size={16} />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
