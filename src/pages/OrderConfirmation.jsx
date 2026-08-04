import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle2, PhoneCall, ShoppingBag, ArrowRight, ShieldCheck, Printer } from 'lucide-react';

export const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', maxWidth: '720px' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        {/* Animated Checkmark */}
        <div style={{
          background: '#e8f5e9',
          color: '#1b5e20',
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <CheckCircle2 size={52} />
        </div>

        <span className="badge badge-fssai" style={{ marginBottom: '1rem' }}>
          <ShieldCheck size={14} /> FSSAI Certified Processing
        </span>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1b5e20', marginBottom: '0.5rem' }}>
          Order Placed Successfully!
        </h1>

        <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '1.8rem' }}>
          Thank you for choosing <strong>Shri Datta Krushi Abhivrudhi Sangh, Ingali</strong>.
        </p>

        {/* Order Reference Box */}
        <div style={{
          background: '#f8fafc',
          border: '1.5px solid #2e7d32',
          borderRadius: '16px',
          padding: '1.2rem',
          marginBottom: '2rem',
          display: 'inline-block',
          minWidth: '280px'
        }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 600 }}>
            Your Order Reference Number
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1b5e20', fontFamily: 'monospace', margin: '4px 0' }}>
            {id || 'SDKAS-SUCCESS'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#2e7d32', fontWeight: 600 }}>
            Status: Order Received & Pending Confirmation
          </div>
        </div>

        {/* Order details summary if available */}
        {order && (
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
            fontSize: '0.92rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              Order Receipt Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
              <div><strong style={{ color: '#64748b' }}>Customer Name:</strong> {order.customerName}</div>
              <div><strong style={{ color: '#64748b' }}>Phone Number:</strong> {order.phone}</div>
              <div><strong style={{ color: '#64748b' }}>Order Mode:</strong> {order.orderType}</div>
              <div><strong style={{ color: '#64748b' }}>Payment Mode:</strong> {order.paymentMethod}</div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#64748b' }}>Delivery Address:</strong> {order.address}
            </div>

            <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '0.8rem', marginTop: '0.8rem' }}>
              <strong style={{ color: '#1e293b' }}>Items Ordered:</strong>
              <ul style={{ listStyle: 'none', marginTop: '6px' }}>
                {order.items?.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f8fafc' }}>
                    <span>{item.name} ({item.quantity} × ₹{item.unitPrice}/{item.unit})</span>
                    <strong>₹{item.subtotal}</strong>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, marginTop: '8px', color: '#1b5e20' }}>
                <span>Total Amount:</span>
                <span>₹{order.grandTotal}</span>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Call Notice */}
        <div style={{
          background: '#fff3e0',
          border: '1px solid #ffe0b2',
          borderRadius: '16px',
          padding: '1.2rem',
          marginBottom: '2rem',
          textAlign: 'left',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <PhoneCall size={24} style={{ color: '#e65100', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.9rem', color: '#e65100', lineHeight: '1.5' }}>
            <strong>What happens next?</strong> Our business team from Ingali will call you on your phone number shortly to confirm order delivery details and estimated dispatch time.
            For urgent inquiries, call us at <strong>9481327296 / 7795687471</strong>.
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => window.print()} className="btn btn-secondary">
            <Printer size={18} /> Print Order Receipt
          </button>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
