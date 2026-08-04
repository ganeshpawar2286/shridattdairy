import React, { useState, useEffect } from 'react';
import {
  Lock, KeyRound, Plus, Edit, Trash2, CheckCircle, AlertCircle,
  Upload, Tag, ShoppingBag, MessageSquare, RefreshCw, X, ShieldAlert
} from 'lucide-react';
import {
  adminLogin, fetchProducts, createProduct, updateProduct, deleteProduct,
  fetchOrders, updateOrderStatus, fetchContactMessages, uploadProductImage
} from '../services/api';

export const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('sdkas_admin_pass'));
  });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'messages'

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Product Modal State (Add / Edit)
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sweets',
    retailPrice: '',
    wholesalePrice: '',
    unit: '1 kg',
    image: '/images/placeholder.jpg',
    description: '',
    inStock: true,
    isPlaceholderPrice: false
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const getAdminPass = () => localStorage.getItem('sdkas_admin_pass') || password;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await adminLogin(password);
      if (res.success) {
        localStorage.setItem('sdkas_admin_pass', password);
        setIsAuthenticated(true);
        loadAdminData(password);
      }
    } catch (err) {
      setLoginError(err.message || 'Incorrect admin password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sdkas_admin_pass');
    setIsAuthenticated(false);
    setPassword('');
  };

  const loadAdminData = (pass = getAdminPass()) => {
    setLoading(true);
    setStatusMsg('');

    Promise.all([
      fetchProducts(),
      fetchOrders(pass).catch(() => []),
      fetchContactMessages(pass).catch(() => [])
    ]).then(([prods, ords, msgs]) => {
      setProducts(prods);
      setOrders(ords);
      setMessages(msgs);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  // Open Modal for Create or Edit
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Sweets',
      retailPrice: '',
      wholesalePrice: '',
      unit: '1 kg',
      image: '/images/placeholder.jpg',
      description: '',
      inStock: true,
      isPlaceholderPrice: false
    });
    setProductModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      retailPrice: p.retailPrice,
      wholesalePrice: p.wholesalePrice,
      unit: p.unit,
      image: p.image,
      description: p.description,
      inStock: p.inStock,
      isPlaceholderPrice: Boolean(p.isPlaceholderPrice)
    });
    setProductModalOpen(true);
  };

  // Image File Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await uploadProductImage(data, getAdminPass());
      if (res.success) {
        setFormData(prev => ({ ...prev, image: res.imagePath }));
        setStatusMsg('Image uploaded successfully!');
      }
    } catch (err) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Product (Create / Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData, getAdminPass());
        setStatusMsg(`Updated "${formData.name}" successfully!`);
      } else {
        await createProduct(formData, getAdminPass());
        setStatusMsg(`Created new product "${formData.name}"!`);
      }
      setProductModalOpen(false);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(id, getAdminPass());
      setStatusMsg(`Deleted product "${name}"`);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Update Order Status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, getAdminPass());
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  // 1. Password Login View
  if (!isAuthenticated) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', maxWidth: '440px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '2.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <div style={{ background: '#e8f5e9', color: '#1b5e20', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto' }}>
            <Lock size={32} />
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1b5e20', marginBottom: '0.4rem' }}>
            Owner / Admin Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
            Enter admin password to manage products, orders, and messages for Shri Datta Dairy.
          </p>

          {loginError && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                placeholder="Enter password (default: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '1rem', width: '100%', justifyContent: 'center' }}>
              Login to Admin Panel
            </button>
          </form>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '1.5rem' }}>
            Default login password is <strong>admin123</strong>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div>
            <span style={{ color: '#1b5e20', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Shri Datta Krushi Abhivrudhi Sangh, Ingali
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>
              Owner Control Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => loadAdminData()} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button onClick={handleLogout} className="btn" style={{ background: '#ffebee', color: '#c62828', padding: '8px 14px', fontSize: '0.88rem' }}>
              Logout
            </button>
          </div>
        </div>

        {statusMsg && (
          <div style={{ background: '#e8f5e9', color: '#1b5e20', padding: '12px 16px', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #c8e6c9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>✓ {statusMsg}</span>
            <X size={16} style={{ cursor: 'pointer' }} onClick={() => setStatusMsg('')} />
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '12px 20px',
              borderRadius: '14px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              background: activeTab === 'products' ? '#1b5e20' : '#ffffff',
              color: activeTab === 'products' ? '#ffffff' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              cursor: 'pointer'
            }}
          >
            <Tag size={18} /> Manage Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 20px',
              borderRadius: '14px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              background: activeTab === 'orders' ? '#1b5e20' : '#ffffff',
              color: activeTab === 'orders' ? '#ffffff' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              cursor: 'pointer'
            }}
          >
            <ShoppingBag size={18} /> Customer Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            style={{
              padding: '12px 20px',
              borderRadius: '14px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              background: activeTab === 'messages' ? '#1b5e20' : '#ffffff',
              color: activeTab === 'messages' ? '#ffffff' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={18} /> Contact Inquiries ({messages.length})
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
                All changes made here update <code>products.json</code> immediately in the backend.
              </p>
              <button onClick={openAddModal} className="btn btn-primary">
                <Plus size={18} /> Add New Product
              </button>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '14px 16px' }}>Product</th>
                      <th style={{ padding: '14px 16px' }}>Category</th>
                      <th style={{ padding: '14px 16px' }}>Retail Price</th>
                      <th style={{ padding: '14px 16px' }}>Wholesale Price</th>
                      <th style={{ padding: '14px 16px' }}>Unit</th>
                      <th style={{ padding: '14px 16px' }}>Status</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', background: '#f8fafc' }}
                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>
                              {p.name}
                              {p.isPlaceholderPrice && (
                                <span style={{ background: '#fff3e0', color: '#e65100', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '8px', marginLeft: '6px', fontWeight: 600 }}>
                                  Placeholder Price
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.description.slice(0, 45)}...</div>
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#475569' }}>
                          {p.category}
                        </td>

                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#1b5e20' }}>
                          ₹{p.retailPrice}
                        </td>

                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#e65100' }}>
                          ₹{p.wholesalePrice}
                        </td>

                        <td style={{ padding: '14px 16px', color: '#64748b' }}>
                          {p.unit}
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${p.inStock ? 'badge-stock' : 'badge-out-stock'}`}>
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>

                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button onClick={() => openEditModal(p)} style={{ background: '#f1f5f9', color: '#334155', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                              <Edit size={16} /> Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id, p.name)} style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.length === 0 ? (
              <div style={{ background: '#ffffff', padding: '3rem', textAlign: 'center', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                No customer orders received yet.
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  padding: '1.8rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'monospace', color: '#1b5e20' }}>
                          {o.id}
                        </span>
                        <span className={`badge ${o.orderType === 'Wholesale' ? 'badge-wholesale' : 'badge-retail'}`}>
                          {o.orderType} Order
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {new Date(o.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
                        {o.customerName} — <a href={`tel:${o.phone}`} style={{ color: '#1b5e20' }}>📞 {o.phone}</a>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '2px' }}>
                        📍 {o.address}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Order Status:</label>
                      <select
                        value={o.status}
                        onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          background: o.status === 'Delivered' ? '#e8f5e9' : o.status === 'Confirmed' ? '#e3f2fd' : '#fff3e0',
                          color: o.status === 'Delivered' ? '#1b5e20' : o.status === 'Confirmed' ? '#1565c0' : '#e65100'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                      ITEMS ORDERED ({o.items?.length || 0}):
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {o.items?.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <span>{item.name} ({item.quantity} × ₹{item.unitPrice}/{item.unit})</span>
                          <strong>₹{item.subtotal}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                    <div>Payment Method: <strong>{o.paymentMethod}</strong></div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1b5e20', fontFamily: "'Outfit', sans-serif" }}>
                      Grand Total: ₹{o.grandTotal}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {messages.length === 0 ? (
              <div style={{ background: '#ffffff', padding: '3rem', textAlign: 'center', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                No contact form messages received yet.
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                      {m.name} — <a href={`tel:${m.phone}`} style={{ color: '#1b5e20' }}>📞 {m.phone}</a>
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', color: '#334155', fontSize: '0.92rem', lineHeight: '1.6' }}>
                    "{m.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {productModalOpen && (
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
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button onClick={() => setProductModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1b5e20', marginBottom: '1.5rem' }}>
              {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Dairy Product'}
            </h2>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Peda, Khova, Ghee"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Sweets">Sweets</option>
                    <option value="Fresh Dairy">Fresh Dairy</option>
                    <option value="Raw Dairy">Raw Dairy</option>
                    <option value="Pure Ghee">Pure Ghee</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 kg, 1 litre, 1 glass"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#1b5e20', marginBottom: '4px' }}>Retail Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="any"
                    placeholder="e.g. 360"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#e65100', marginBottom: '4px' }}>Wholesale Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="any"
                    placeholder="e.g. 330"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Product Image URL or Upload</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="/images/peda.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <label className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <Upload size={16} /> {uploadingImage ? 'Uploading...' : 'Upload File'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Product Description</label>
                <textarea
                  rows="3"
                  placeholder="Traditional fresh milk sweet..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#1b5e20' }}
                  />
                  Item is In Stock
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: '#e65100' }}>
                  <input
                    type="checkbox"
                    checked={formData.isPlaceholderPrice}
                    onChange={(e) => setFormData({ ...formData, isPlaceholderPrice: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#e65100' }}
                  />
                  Flag as Placeholder Price
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '1rem', width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
