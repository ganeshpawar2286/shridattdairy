import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { FSSAIBadge } from '../components/FSSAIBadge';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pricingMode, getUnitPrice, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts()
      .then(products => {
        const found = products.find(p => p.id === id);
        setProduct(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return to Shop</Link>
      </div>
    );
  }

  const currentPrice = getUnitPrice(product);
  const isWholesale = pricingMode === 'wholesale';

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#1b5e20', fontWeight: 600, marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Products Catalog
        </Link>

        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
        }}>
          {/* Image */}
          <div style={{ background: '#f8fafc', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

          {/* Info */}
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <FSSAIBadge size="small" />
              <span className={`badge ${isWholesale ? 'badge-wholesale' : 'badge-retail'}`}>
                {isWholesale ? 'Wholesale Price Mode' : 'Retail Price Mode'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
              {product.name}
            </h1>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: isWholesale ? '#e65100' : '#1b5e20', fontFamily: "'Outfit', sans-serif", marginBottom: '1rem' }}>
              ₹{currentPrice} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>per {product.unit}</span>
            </div>

            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              {product.description}
            </p>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', marginBottom: '2rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Retail Price:</span>
                <strong>₹{product.retailPrice} / {product.unit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Wholesale Bulk Price:</span>
                <strong style={{ color: '#e65100' }}>₹{product.wholesalePrice} / {product.unit}</strong>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                Select Quantity ({product.unit}):
              </label>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '12px' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '10px 16px', background: 'transparent', border: 'none' }}>
                  <Minus size={18} />
                </button>
                <span style={{ padding: '0 20px', fontWeight: 700, fontSize: '1.2rem' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ padding: '10px 16px', background: 'transparent', border: 'none' }}>
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity);
                navigate('/cart');
              }}
              disabled={!product.inStock}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: 'auto' }}
            >
              <ShoppingCart size={20} />
              Add {quantity} to Cart (₹{currentPrice * quantity})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
