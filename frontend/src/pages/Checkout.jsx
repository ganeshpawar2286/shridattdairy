import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, ArrowLeft, Copy, Check, QrCode, MapPin, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder, fetchDeliveryAreas } from '../services/api';
import { LocationPickerMap } from '../components/LocationPickerMap';

export const Checkout = () => {
  const { cart, pricingMode, getUnitPrice, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Delivery Areas
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState('Ingali');
  const [pincode, setPincode] = useState('591242');
  const [streetAddress, setStreetAddress] = useState(user?.address || '');
  const [latitude, setLatitude] = useState(16.5682);
  const [longitude, setLongitude] = useState(74.6534);

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.mobile || user?.phone || '');
  const [orderType, setOrderType] = useState(pricingMode === 'wholesale' ? 'Wholesale' : 'Retail');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationError, setValidationError] = useState('');

  const upiId = '7795687471@rbl';

  useEffect(() => {
    fetchDeliveryAreas().then(areas => {
      setDeliveryAreas(areas);
      // If user has saved village, match it
      if (areas.length > 0) {
        const found = areas.find(a => a.village === 'Ingali') || areas[0];
        setSelectedVillage(found.village);
        setPincode(found.pincode);
      }
    }).catch(err => console.error(err));
  }, []);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleVillageChange = (villageName) => {
    setSelectedVillage(villageName);
    const found = deliveryAreas.find(a => a.village.toLowerCase() === villageName.toLowerCase());
    if (found) {
      setPincode(found.pincode);
      setValidationError('');
    } else {
      setPincode('');
      setValidationError('Selected village is not within Chikkodi Taluka delivery zone.');
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName || !phone || !streetAddress || !selectedVillage || !pincode) {
      setErrorMsg('Please fill in your name, phone number, village, and street address.');
      return;
    }

    // Validate area
    const isValid = deliveryAreas.some(a =>
      a.village.toLowerCase() === selectedVillage.toLowerCase() && a.pincode === pincode
    );

    if (!isValid) {
      setErrorMsg('Sorry, we currently do not deliver to this location. Delivery is available only in Chikkodi Taluka, Belagavi District.');
      return;
    }

    setSubmitting(true);

    const formattedItems = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      unit: item.product.unit,
      quantity: item.quantity,
      unitPrice: getUnitPrice(item.product, pricingMode),
      subtotal: getUnitPrice(item.product, pricingMode) * item.quantity
    }));

    const orderPayload = {
      customerId: user?.id || '',
      customerName,
      phone,
      address: `${streetAddress}, ${selectedVillage}, Chikkodi, Belagavi, Karnataka - ${pincode}`,
      village: selectedVillage,
      pincode: pincode,
      latitude: latitude,
      longitude: longitude,
      deliveryAddress: {
        fullAddress: streetAddress,
        village: selectedVillage,
        taluka: 'Chikkodi',
        district: 'Belagavi',
        state: 'Karnataka',
        pincode: pincode,
        latitude: latitude,
        longitude: longitude
      },
      orderType,
      items: formattedItems,
      subtotal: cartSubtotal,
      grandTotal: cartSubtotal,
      paymentMethod
    };

    try {
      const res = await placeOrder(orderPayload);
      if (res.success) {
        clearCart();
        navigate(`/order-confirmation/${res.orderId}`, { state: { order: res.order } });
      } else {
        setErrorMsg(res.message || 'Failed to submit order');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const upiQrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=ShriDattaDairy&am=${cartSubtotal}&cu=INR`)}&size=200`;

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#1b5e20', fontWeight: 600, marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '2rem' }}>
          Checkout & Place Order
        </h1>

        {errorMsg && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            border: '1px solid #ffcdd2',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Customer Details & Delivery Area Form */}
          <div style={{ gridColumn: 'span 2' }}>
            <form onSubmit={handleSubmit} style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1b5e20' }}>
                  1. Customer & Delivery Information
                </h2>
                <span style={{ background: '#e8f5e9', color: '#1b5e20', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', border: '1px solid #c8e6c9' }}>
                  📍 Delivery Zone: Chikkodi Taluka, Belagavi
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Phone / Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Village & PIN Code Dropdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1b5e20', marginBottom: '6px' }}>
                    Village / Town (Chikkodi Taluka) *
                  </label>
                  <select
                    value={selectedVillage}
                    onChange={(e) => handleVillageChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1.5px solid #1b5e20',
                      fontSize: '0.95rem',
                      background: '#ffffff',
                      outline: 'none',
                      fontWeight: 600
                    }}
                  >
                    {deliveryAreas.map((area, idx) => (
                      <option key={idx} value={area.village}>
                        {area.village} (PIN: {area.pincode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    PIN Code (Auto-Filled) *
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={pincode}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      background: '#f1f5f9',
                      fontWeight: 700,
                      color: '#1b5e20',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Street Address / House No / Landmark *
                </label>
                <textarea
                  required
                  rows="2"
                  placeholder="Enter house number, street name, near landmark"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Phase 2: Google Maps Location Picker */}
              <LocationPickerMap
                village={selectedVillage}
                pincode={pincode}
                latitude={latitude}
                longitude={longitude}
                onChange={({ latitude: lat, longitude: lng }) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Order Classification Type
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setOrderType('Retail')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: orderType === 'Retail' ? '2px solid #1b5e20' : '1px solid #cbd5e1',
                      background: orderType === 'Retail' ? '#e8f5e9' : '#ffffff',
                      color: orderType === 'Retail' ? '#1b5e20' : '#475569',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🥛 Retail Customer Order
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('Wholesale')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: orderType === 'Wholesale' ? '2px solid #e65100' : '1px solid #cbd5e1',
                      background: orderType === 'Wholesale' ? '#fff3e0' : '#ffffff',
                      color: orderType === 'Wholesale' ? '#e65100' : '#475569',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🏷️ Wholesale Bulk Order
                  </button>
                </div>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1b5e20', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem', marginTop: '1rem' }}>
                2. Select Payment Method
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  style={{
                    border: paymentMethod === 'Cash on Delivery' ? '2px solid #1b5e20' : '1px solid #cbd5e1',
                    background: paymentMethod === 'Cash on Delivery' ? '#f4fbf5' : '#ffffff',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Truck size={20} style={{ color: '#1b5e20' }} />
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>Cash on Delivery</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Pay in cash when our delivery team delivers your fresh dairy products.
                  </p>
                </div>

                <div
                  onClick={() => setPaymentMethod('UPI Payment')}
                  style={{
                    border: paymentMethod === 'UPI Payment' ? '2px solid #1b5e20' : '1px solid #cbd5e1',
                    background: paymentMethod === 'UPI Payment' ? '#f4fbf5' : '#ffffff',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <CreditCard size={20} style={{ color: '#1b5e20' }} />
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>UPI Payment (PhonePe / GPay / Paytm)</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Pay instantly using official UPI ID: <strong>{upiId}</strong>
                  </p>
                </div>
              </div>

              {paymentMethod === 'UPI Payment' && (
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #2e7d32',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ fontWeight: 800, color: '#1b5e20', fontSize: '1.1rem' }}>
                    Shri Datta Dairy Official UPI Payment
                  </div>
                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <img src={upiQrUrl} alt="UPI QR Code" style={{ width: '160px', height: '160px' }} />
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Scan with GPay / PhonePe / Paytm</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '12px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.05rem', color: '#1e293b' }}>
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      style={{
                        background: copiedUpi ? '#e8f5e9' : '#f1f5f9',
                        color: copiedUpi ? '#2e7d32' : '#334155',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                      {copiedUpi ? 'Copied!' : 'Copy UPI'}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || Boolean(validationError)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}
              >
                {submitting ? 'Processing Order...' : `Confirm & Place Order (₹${cartSubtotal})`}
              </button>
            </form>
          </div>

          {/* Sidebar Order Summary */}
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem' }}>
                Order Items ({cart.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                {cart.map(item => {
                  const unitPrice = getUnitPrice(item.product, pricingMode);
                  return (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{item.product.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {item.quantity} × ₹{unitPrice} ({item.product.unit})
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#1b5e20' }}>
                        ₹{unitPrice * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>Total Payable:</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b5e20', fontFamily: "'Outfit', sans-serif" }}>
                  ₹{cartSubtotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
