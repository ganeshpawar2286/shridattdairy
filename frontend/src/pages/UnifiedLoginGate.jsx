import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Phone, User, ArrowRight, ShieldAlert, Milk, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FSSAIBadge } from '../components/FSSAIBadge';

export const UnifiedLoginGate = () => {
  const { adminLogin, customerLogin, customerRegister, isAdminLoggedIn, isCustomerLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' or 'register'

  // Form Fields
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect accordingly
  if (isAdminLoggedIn) {
    navigate('/admin');
    return null;
  }

  if (isCustomerLoggedIn) {
    navigate('/shop');
    return null;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!mobile || !password) {
      setErrorMsg('Please enter your Mobile Number and Password.');
      return;
    }

    setLoading(true);

    // 1. Try Admin Login First
    try {
      const adminRes = await adminLogin({ mobile, password });
      if (adminRes.token) {
        setLoading(false);
        navigate('/admin');
        return;
      }
    } catch (adminErr) {
      // Not admin credentials, proceed to try Customer Login
    }

    // 2. Try Customer Login
    try {
      const custRes = await customerLogin({ mobile, password });
      if (custRes.token) {
        setLoading(false);
        navigate('/shop');
        return;
      }
    } catch (custErr) {
      setErrorMsg('Invalid Mobile Number or Password. If you are a new customer, click Register below.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !mobile || !password) {
      setErrorMsg('Name, Mobile Number, and Password are required.');
      return;
    }

    setLoading(true);
    try {
      await customerRegister({ name, mobile, password, address });
      setLoading(false);
      navigate('/shop');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem 0', minHeight: '82vh' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <FSSAIBadge style={{ marginBottom: '0.8rem' }} />
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1b5e20', marginTop: '4px' }}>
            Shri Datta Krushi Abhivrudhi Sangh, Ingali
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '6px' }}>
            Enter your Mobile Number and Password to access the portal.
          </p>
        </div>

        {/* Single Login Gateway Box */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '2.2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
        }}>
          {/* Mode Switcher */}
          <div style={{
            background: '#f1f5f9',
            borderRadius: '14px',
            padding: '4px',
            display: 'flex',
            marginBottom: '1.8rem'
          }}>
            <button
              type="button"
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
                cursor: 'pointer'
              }}
            >
              <LogIn size={16} /> Portal Sign In
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: mode === 'register' ? '#1b5e20' : 'transparent',
                color: mode === 'register' ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <UserPlus size={16} /> Customer Register
            </button>
          </div>

          {errorMsg && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 14px', borderRadius: '12px', fontSize: '0.88rem', marginBottom: '1.2rem', border: '1px solid #ffcdd2' }}>
              {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            /* SINGLE UNIFIED LOGIN FORM */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Mobile Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    required
                    placeholder="Enter mobile number"
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', justifyContent: 'center', marginTop: '0.4rem' }}
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* NEW CUSTOMER REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Mobile Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    required
                    placeholder=""
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Create Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="password"
                    required
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Delivery Address
                </label>
                <textarea
                  rows="2"
                  placeholder="Enter village/city/landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', justifyContent: 'center', marginTop: '0.4rem' }}
              >
                {loading ? 'Creating Account...' : 'Register Customer Account'} <ArrowRight size={18} />
              </button>
            </form>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            {mode === 'login' ? (
              <span>New customer? <button onClick={() => setMode('register')} style={{ color: '#1b5e20', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Register Customer Account</button></span>
            ) : (
              <span>Already registered? <button onClick={() => setMode('login')} style={{ color: '#1b5e20', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Back to Sign In</button></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
