import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, XCircle, Truck, ShoppingBag, ArrowRight, RefreshCw, User, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchCustomerOrders } from '../services/api';
import { useCart } from '../context/CartContext';

export const CustomerOrders = () => {
  const { user, isCustomer } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    fetchCustomerOrders({
      phone: user.phone || user.emailOrMobile,
      email: user.email || user.emailOrMobile,
      userId: user.id
    }).then(data => {
      setOrders(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setErrorMsg('Failed to load your orders.');
      setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '3rem 2rem', border: '1px solid #e2e8f0' }}>
          <User size={48} style={{ color: '#1b5e20', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b5e20', marginBottom: '0.8rem' }}>
            Customer Login Required
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Please sign in to your customer account to view your past orders and track delivery status.
          </p>
          <Link to="/login" className="btn btn-primary">
            Sign In / Register
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'delivered') {
      return (
        <span style={{ background: '#e8f5e9', color: '#1b5e20', border: '1px solid #c8e6c9', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={14} /> Delivered
        </span>
      );
    }
    if (s === 'confirmed') {
      return (
        <span style={{ background: '#e3f2fd', color: '#1565c0', border: '1px solid #bbdefb', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Truck size={14} /> Order Confirmed
        </span>
      );
    }
    if (s === 'cancelled') {
      return (
        <span style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <XCircle size={14} /> Cancelled
        </span>
      );
    }
    return (
      <span style={{ background: '#fff3e0', color: '#e65100', border: '1px solid #ffe0b2', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <Clock size={14} /> Pending Confirmation
      </span>
    );
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Customer Header Info */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
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
              Customer Portal • Shri Datta Dairy
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
              Welcome back, {user.name}!
            </h1>
            <div style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>📞 {user.phone || user.emailOrMobile}</span>
              {user.address && <span>📍 {user.address}</span>}
            </div>
          </div>

          <Link to="/shop" className="btn btn-primary">
            Shop Dairy Products <ArrowRight size={18} />
          </Link>
        </div>

        {/* Orders Listing */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.2rem' }}>
          My Order History ({orders.length})
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '4rem 2rem', textAlign: 'center' }}>
            <Package size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#334155', marginBottom: '0.5rem' }}>No orders found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You haven't placed any orders yet. Explore our fresh dairy products!
            </p>
            <Link to="/shop" className="btn btn-primary">
              Browse Shop Products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map(order => (
              <div key={order.id} style={{
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
                        {order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1b5e20', fontFamily: "'Outfit', sans-serif" }}>
                    Total: ₹{order.grandTotal}
                  </div>
                </div>

                {/* Items Breakdown */}
                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Items Ordered:
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {order.items?.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>{item.name} ({item.quantity} × ₹{item.unitPrice}/{item.unit})</span>
                        <strong>₹{item.subtotal}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.88rem', color: '#475569' }}>
                  <div>
                    Payment: <strong>{order.paymentMethod}</strong> • Mode: <strong>{order.orderType}</strong>
                  </div>
                  <div>
                    Delivery to: <strong>{order.address}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
