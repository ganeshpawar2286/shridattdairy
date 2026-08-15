import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, User, ArrowRight, Milk, UserPlus, LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FSSAIBadge } from '../components/FSSAIBadge';

export const SingleLoginLanding = () => {
  const { adminLogin, customerLogin, customerRegister, isAdminLoggedIn, isCustomerLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' or 'register'

  // Single Login Form State
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Customer Registration Form State
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regError, setRegError] = useState('');

  // If already logged in, redirect accordingly
  if (isAdminLoggedIn) {
    navigate('/admin');
    return null;
  }

  if (isCustomerLoggedIn) {
    navigate('/shop');
    return null;
  }

  const handleSingleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!mobile || !password) {
      setErrorMsg('Please enter your Mobile Number and Password.');
      return;
    }

    setLoading(true);
    const normalizedMobile = String(mobile).replace(/\D/g, '');

    // 1. Check if entering Admin Mobile (7795687471 or 9999999999)
    if (normalizedMobile === '7795687471' || normalizedMobile === '9999999999') {
      try {
        await adminLogin({ mobile: normalizedMobile, password });
        setLoading(false);
        navigate('/admin');
        return;
      } catch (err) {
        setErrorMsg(err.message || 'Incorrect Admin credentials.');
        setLoading(false);
        return;
      }
    }

    // 2. For All Other Mobile Numbers -> Customer Login
    try {
      await customerLogin({ mobile: normalizedMobile, password });
      setLoading(false);
      navigate('/shop');
    } catch (err) {
      setErrorMsg('Account not found or incorrect password. If you are a new customer, click "Register New Account" below.');
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    if (!regName || !regMobile || !regPassword) {
      setRegError('Name, Mobile Number, and Password are required.');
      return;
    }

    setLoading(true);
    try {
      await customerRegister({ name: regName, mobile: regMobile, password: regPassword, address: regAddress });
      setLoading(false);
      navigate('/shop');
    } catch (err) {
      setRegError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0 5rem 0', minHeight: '85vh', background: '#faf7f2' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        {/* Top Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <FSSAIBadge style={{ marginBottom: '0.8rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1b5e20', marginTop: '4px' }}>
            Shri Datta Krushi Abhivrudhi Sangh, Ingali
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '6px' }}>
            Enter your Mobile Number and Password to access the portal.
          </p>
        </div>

        {/* ONE SINGLE CLEAN LOGIN BOX */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #1b5e20',
          padding: '2.2rem',
          boxShadow: '0 10px 30px rgba(27, 94, 32, 0.08)'
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
              <LogIn size={16} /> Sign In
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setRegError(''); }}
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

          {mode === 'login' ? (
            /* SINGLE LOGIN FORM */
            <form onSubmit={handleSingleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {errorMsg && (
                <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 14px', borderRadius: '12px', fontSize: '0.88rem', border: '1px solid #ffcdd2' }}>
                  {errorMsg}
                </div>
              )}

              {/* Field 1: Mobile Number */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Mobile Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#1b5e20' }} />
                  <input
                    type="tel"
                    required
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontWeight: 600
                    }}
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#1b5e20' }} />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      fontWeight: 600
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1.05rem', justifyContent: 'center', marginTop: '0.4rem' }}
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                New customer?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{ color: '#1b5e20', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Register Account here
                </button>
              </div>
            </form>
          ) : (
            /* NEW CUSTOMER REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {regError && (
                <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 14px', borderRadius: '12px', fontSize: '0.88rem', border: '1px solid #ffcdd2' }}>
                  {regError}
                </div>
              )}

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
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
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
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
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
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
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
                  placeholder="Enter village/city landmark (e.g. Near Bus Stand, Ingali)"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', justifyContent: 'center', marginTop: '0.4rem' }}
              >
                {loading ? 'Creating Account...' : 'Register & Open Shop'} <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{ color: '#1b5e20', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
