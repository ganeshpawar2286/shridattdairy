import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, XCircle, Truck, ArrowRight, User, MapPin, Tag, Save, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchCustomerOrders } from '../services/api';
import { useCart } from '../context/CartContext';

export const CustomerOrders = () => {
  const { customerUser, isCustomerLoggedIn, logoutCustomer, updateCustomerAddress } = useAuth();
  const { pricingMode, setPricingMode } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(customerUser?.address || '');
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressMsg, setAddressMsg] = useState('');

  useEffect(() => {
    if (!customerUser) return;
    setLoading(true);

    fetchCustomerOrders({
      phone: customerUser.mobile,
      userId: customerUser.id
    }).then(data => {
      setOrders(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [customerUser]);

  if (!isCustomerLoggedIn) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '3rem 2rem', border: '1px solid #e2e8f0' }}>
          <User size={48} style={{ color: '#1b5e20', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b5e20', marginBottom: '0.8rem' }}>
            Customer Sign In Required
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Please sign in with your mobile number and password to view your past orders and profile.
          </p>
          <Link to="/login" className="btn btn-primary">
            Customer Login / Register
          </Link>
        </div>
      </div>
    );
  }

  const handleAddressSave = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressMsg('');
    try {
      await updateCustomerAddress(address);
      setAddressMsg('Delivery address saved successfully!');
    } catch (err) {
      setAddressMsg(err.message || 'Failed to update address');
    } finally {
      setSavingAddress(false);
    }
  };

  const STATUS_STAGES = ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

  const renderStatusTracker = (order) => {
    const currentStatus = order.deliveryStatus || order.status || 'Placed';
    if (currentStatus === 'Cancelled') {
      return (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.2rem', border: '1px solid #ffcdd2', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <XCircle size={18} /> Order Cancelled
        </div>
      );
    }

    const currentIndex = STATUS_STAGES.indexOf(currentStatus);
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;

    return (
      <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.2rem', marginBottom: '1.2rem', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1b5e20', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🚚 Live Delivery Tracker:
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', flexWrap: 'wrap', gap: '10px' }}>
          {STATUS_STAGES.map((stage, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            // Find history timestamp for this stage
            const historyObj = order.deliveryHistory?.find(h => h.status === stage);

            return (
              <div key={idx} style={{ flex: 1, minWidth: '100px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCompleted ? '#1b5e20' : '#ffffff',
                  color: isCompleted ? '#ffffff' : '#94a3b8',
                  border: isCompleted ? '2px solid #1b5e20' : '2px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(27, 94, 32, 0.2)' : 'none',
                  marginBottom: '6px'
                }}>
                  {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500, color: isCurrent ? '#1b5e20' : isCompleted ? '#334155' : '#94a3b8' }}>
                  {stage}
                </div>

                {historyObj && (
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                    {new Date(historyObj.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'delivered') {
      return (
        <span style={{ background: '#e8f5e9', color: '#1b5e20', border: '1px solid #c8e6c9', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={14} /> Delivered
        </span>
      );
    }
    if (s === 'out for delivery') {
      return (
        <span style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Truck size={14} /> Out for Delivery
        </span>
      );
    }
    if (s === 'preparing') {
      return (
        <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={14} /> Preparing
        </span>
      );
    }
    if (s === 'confirmed') {
      return (
        <span style={{ background: '#e3f2fd', color: '#1565c0', border: '1px solid #bbdefb', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={14} /> Confirmed
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
        <Clock size={14} /> Placed
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
              Welcome back, {customerUser.name}!
            </h1>
            <div style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>📞 Mobile: <strong>{customerUser.mobile}</strong></span>
              <span>🏷️ Pricing Mode: <strong>{pricingMode.toUpperCase()}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-primary">
              Shop Products <ArrowRight size={18} />
            </Link>
            <button onClick={logoutCustomer} className="btn" style={{ background: '#ffebee', color: '#c62828' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Grid Layout: Address Management & Past Orders */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Column A: Save Delivery Address */}
          <div>
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.8rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem' }}>
                📍 Saved Delivery Address
              </h3>

              {addressMsg && (
                <div style={{ background: '#e8f5e9', color: '#1b5e20', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {addressMsg}
                </div>
              )}

              <form onSubmit={handleAddressSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                  rows="4"
                  placeholder="Enter full street, village/city, landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', outline: 'none', fontFamily: 'inherit' }}
                />

                <button type="submit" disabled={savingAddress} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  <Save size={16} /> {savingAddress ? 'Saving...' : 'Save Updated Address'}
                </button>
              </form>
            </div>
          </div>

          {/* Column B: Orders Listing */}
          <div style={{ gridColumn: 'span 2' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.2rem' }}>
              My Past Orders ({orders.length})
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

                    {/* Order Status Delivery Tracker */}
                    {renderStatusTracker(order)}

                    {/* Track Order Location Map Section */}
                    {(() => {
                      const lat = order.deliveryAddress?.latitude || 16.5682;
                      const lng = order.deliveryAddress?.longitude || 74.6534;
                      const villageName = order.deliveryAddress?.village || 'Ingali';
                      const pincodeVal = order.deliveryAddress?.pincode || '591242';

                      return (
                        <div style={{
                          background: '#f8fafc',
                          borderRadius: '16px',
                          border: '1px solid #cbd5e1',
                          padding: '1.2rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1b5e20', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MapPin size={16} /> Track Delivery Location Map
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                Village: <strong>{villageName}</strong> | PIN Code: <strong>{pincodeVal}</strong> (Chikkodi Taluka, Belagavi)
                              </div>
                            </div>

                            <a
                              href={`https://www.google.com/maps?q=${lat},${lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: '#e8f5e9',
                                color: '#1b5e20',
                                border: '1px solid #c8e6c9',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              📍 View Pin in Google Maps ({lat.toFixed(4)}, {lng.toFixed(4)})
                            </a>
                          </div>

                          <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                            <iframe
                              title={`Customer Map ${order.id}`}
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                              allowFullScreen
                            />
                          </div>
                        </div>
                      );
                    })()}

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
      </div>
    </div>
  );
};
