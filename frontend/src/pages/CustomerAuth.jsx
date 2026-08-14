import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Lock, Phone, MapPin, ArrowRight, UserPlus, LogIn, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FSSAIBadge } from '../components/FSSAIBadge';

export const CustomerAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerLogin, customerRegister, customerUser, isCustomerLoggedIn } = useAuth();

  // Mode: /signup or /register -> 'signup', otherwise -> 'login'
  const initialMode = location.pathname.includes('register') || location.pathname.includes('signup') || location.search.includes('tab=signup') ? 'signup' : 'login';
  const [mode, setMode] = useState(initialMode);

  // Form fields
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // If logged in as customer, show active account card
  if (isCustomerLoggedIn) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '3rem 2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ background: '#e8f5e9', color: '#1b5e20', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <User size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b5e20', marginBottom: '0.5rem' }}>
            Welcome, {customerUser.name}!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Mobile Number: {customerUser.mobile}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/my-orders" className="btn btn-primary">
              View My Orders & Profile
            </Link>
            <Link to="/shop" className="btn btn-secondary">
              Shop Dairy Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!mobile || !password) {
          throw new Error('Please enter your Mobile Number and Password.');
        }
        await customerLogin({ mobile, password });
        navigate('/shop');
      } else {
        if (!name || !mobile || !password) {
          throw new Error('Name, Mobile Number, and Password are required.');
        }
        await customerRegister({ name, mobile, password, address });
        setSuccessMsg('Customer account created successfully!');
        setTimeout(() => navigate('/shop'), 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <FSSAIBadge style={{ marginBottom: '0.8rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1b5e20', marginTop: '4px' }}>
            {mode === 'login' ? 'Customer Sign In' : 'New Customer Register'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Sign in with your Mobile Number and Password to place & track orders.
          </p>
        </div>

        {/* Auth Box */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '2.2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          {/* Tabs */}
          <div style={{
            background: '#f1f5f9',
            borderRadius: '14px',
            padding: '4px',
            display: 'flex',
            marginBottom: '1.8rem'
          }}>
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: mode === 'login' ? '#1b5e20' : 'transparent',
                color: mode === 'login' ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogIn size={16} /> Customer Login
            </button>

            <button
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: mode === 'signup' ? '#1b5e20' : 'transparent',
                color: mode === 'signup' ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <UserPlus size={16} /> Register
            </button>
          </div>

          {errorMsg && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 14px', borderRadius: '12px', fontSize: '0.88rem', marginBottom: '1.2rem', border: '1px solid #ffcdd2' }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ background: '#e8f5e9', color: '#1b5e20', padding: '12px 14px', borderRadius: '12px', fontSize: '0.88rem', marginBottom: '1.2rem', border: '1px solid #c8e6c9' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Pawar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Mobile Number *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9481327296"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
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
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    style={{ fontSize: '0.78rem', color: '#1b5e20', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
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
            </div>

            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Delivery Address
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                  <textarea
                    rows="3"
                    placeholder="Enter village/city, landmark (e.g. Near Bus Stand, Ingali)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In & Shop' : 'Create Account & Shop')} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            {mode === 'login' ? (
              <span>Don't have a customer account? <button onClick={() => setMode('signup')} style={{ color: '#1b5e20', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Register here</button></span>
            ) : (
              <span>Already registered? <button onClick={() => setMode('login')} style={{ color: '#1b5e20', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Sign In here</button></span>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Helper Modal */}
      {showForgotModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <HelpCircle size={44} style={{ color: '#1b5e20', marginBottom: '0.8rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
              Password Reset Assistance
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              For password reset, please contact Shri Datta Dairy support or call/WhatsApp us directly at <strong>7795687471</strong> with your registered mobile number.
            </p>
            <button onClick={() => setShowForgotModal(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
