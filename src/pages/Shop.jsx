import React, { useState, useEffect } from 'react';
import { Search, Filter, Tag, Milk, Check } from 'lucide-react';
import { fetchProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { useCart } from '../context/CartContext';

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyInStock, setOnlyInStock] = useState(false);
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

  const categories = ['All', 'Sweets', 'Fresh Dairy', 'Raw Dairy', 'Pure Ghee', 'Beverages'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStock = !onlyInStock || p.inStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: '#1b5e20', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Fresh & Pure Dairy Catalog
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
            Shop Dairy Products
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            All products are sourced and processed fresh daily under strict FSSAI guidelines at Shri Datta Krushi Abhivrudhi Sangh, Ingali.
          </p>
        </div>

        {/* Pricing Mode Selection Bar */}
        <div style={{
          background: pricingMode === 'wholesale' ? '#fff3e0' : '#e8f5e9',
          border: pricingMode === 'wholesale' ? '1px solid #ffe0b2' : '1px solid #c8e6c9',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: pricingMode === 'wholesale' ? '#e65100' : '#1b5e20', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={18} /> Currently Viewing {pricingMode === 'wholesale' ? 'Wholesale Bulk Prices' : 'Retail Consumer Prices'}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              {pricingMode === 'wholesale'
                ? 'Discounted rates active for bulk buyers, caterers & sweet shops.'
                : 'Standard consumer retail rates. Switch to Wholesale for bulk discounts.'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setPricingMode('retail')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: pricingMode === 'retail' ? '#1b5e20' : '#ffffff',
                color: pricingMode === 'retail' ? '#ffffff' : '#475569',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              Retail Prices
            </button>
            <button
              onClick={() => setPricingMode('wholesale')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: pricingMode === 'wholesale' ? '#e65100' : '#ffffff',
                color: pricingMode === 'wholesale' ? '#ffffff' : '#475569',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              Wholesale Prices
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.2rem',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search Peda, Khova, Ghee, Paneer, Curd..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* In-Stock Filter Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#475569',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#1b5e20' }}
              />
              Show In-Stock Only
            </label>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  background: selectedCategory === cat ? '#1b5e20' : '#f1f5f9',
                  color: selectedCategory === cat ? '#ffffff' : '#475569',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            Loading products catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px dashed #cbd5e1'
          }}>
            <Milk size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#334155', marginBottom: '0.5rem' }}>
              No products found
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Try adjusting your search query or category filter.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.8rem' }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
