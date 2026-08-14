import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, MapPin, ArrowRight, ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FSSAIBadge } from '../components/FSSAIBadge';

export const CustomerAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerLogin, customerRegister, user } = useAuth();

  // If query parameter ?tab=signup or initial mode
  const initialMode = location.search.includes('tab=signup') || location.pathname === '/signup' ? 'signup' : 'login';
  const [mode, setMode] = useState(initialMode);

  // Form fields
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If already logged in as customer, redirect to /my-orders or /shop
  if (user && user.role === 'customer') {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '3rem 2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ background: '#e8f5e9', color: '#1b5e20', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <User size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b5e20', marginBottom: '0.5rem' }}>
            You are logged in as {user.name}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Account Contact: {user.emailOrMobile || user.phone || user.email}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/my-orders" className="btn btn-primary">
              View My Orders
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
        if (!emailOrMobile || !password) {
          throw new Error('Please enter your Email or Mobile Number and Password.');
        }
        await customerLogin({ emailOrMobile, password });
        navigate('/shop');
      } else {
        if (!name || !emailOrMobile || !password) {
          throw new Error('Name, Email or Mobile Number, and Password are required.');
        }
        await customerRegister({ name, emailOrMobile, password, address });
        setSuccessMsg('Account created successfully! Welcome to Shri Datta Dairy.');
        setTimeout(() => navigate('/shop'), 1000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
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
            {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Sign in to track orders, save delivery address, and place fast dairy orders.
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
              <LogIn size={16} /> Sign In
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
                Email or Mobile Number *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210 or ramesh@gmail.com"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
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
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Password *
              </label>
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
                  Default Delivery Address
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                  <textarea
                    rows="3"
                    placeholder="Enter your village/city, landmark (e.g. Near Bus Stand, Ingali)"
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
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')} <ArrowRight size={18} />
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
    </div>
  );
};
