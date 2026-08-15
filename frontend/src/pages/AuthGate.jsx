import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Lock, Mail, KeyRound, ArrowRight, UserCheck, ShieldAlert, Milk, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FSSAIBadge } from '../components/FSSAIBadge';

export const AuthGate = () => {
  const { user, customerLogin, customerRegister, adminLogin } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState('customer'); // 'customer' or 'admin'
  const [customerMode, setCustomerMode] = useState('login'); // 'login' or 'register'

  // Customer Form State
  const [custIdentifier, setCustIdentifier] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custName, setCustName] = useState('');
  const [custAddress, setCustAddress] = useState('');

  // Admin Form State
  const [adminIdentifier, setAdminIdentifier] = useState('7795687471');
  const [adminPassword, setAdminPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect to respective pages
  if (user) {
    if (user.role === 'admin') {
      navigate('/admin');
      return null;
    }
    if (user.role === 'customer') {
      navigate('/shop');
      return null;
    }
  }

  // Handle Customer Form Submission
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (customerMode === 'login') {
        await customerLogin({ emailOrMobile: custIdentifier, password: custPassword });
        navigate('/shop');
      } else {
        await customerRegister({
          name: custName,
          emailOrMobile: custIdentifier,
          password: custPassword,
          address: custAddress
        });
        navigate('/shop');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Form Submission
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await adminLogin({ emailOrMobile: adminIdentifier, password: adminPassword });
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Incorrect admin password or credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0 5rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <FSSAIBadge style={{ marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1b5e20', marginTop: '6px' }}>
            Shri Datta Krushi Abhivrudhi Sangh, Ingali
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '600px', margin: '0.4rem auto 0 auto' }}>
            Please log in to enter the portal. Select whether you are a Customer or Store Owner.
          </p>
        </div>

        {/* Role Selector Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Option A: Customer Portal Card */}
          <div
            onClick={() => { setActiveRole('customer'); setErrorMsg(''); }}
            style={{
              background: activeRole === 'customer' ? '#e8f5e9' : '#ffffff',
              border: activeRole === 'customer' ? '2.5px solid #1b5e20' : '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '1.8rem',
              cursor: 'pointer',
              boxShadow: activeRole === 'customer' ? '0 8px 24px rgba(27, 94, 32, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{
              background: activeRole === 'customer' ? '#1b5e20' : '#f1f5f9',
              color: activeRole === 'customer' ? '#ffffff' : '#64748b',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Milk size={30} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                🥛 Customer Login
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Shop fresh milk sweets, khova, ghee & track orders
              </div>
            </div>
          </div>

          {/* Option B: Admin Portal Card */}
          <div
            onClick={() => { setActiveRole('admin'); setErrorMsg(''); }}
            style={{
              background: activeRole === 'admin' ? '#fff3e0' : '#ffffff',
              border: activeRole === 'admin' ? '2.5px solid #e65100' : '1px solid #cbd5e1',
              borderRadius: '20px',
              padding: '1.8rem',
              cursor: 'pointer',
              boxShadow: activeRole === 'admin' ? '0 8px 24px rgba(230, 81, 0, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{
              background: activeRole === 'admin' ? '#e65100' : '#f1f5f9',
              color: activeRole === 'admin' ? '#ffffff' : '#64748b',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldAlert size={30} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                🛡️ Store Owner / Admin
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Manage products, update prices, view orders & messages
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Form Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '2.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          maxWidth: '540px',
          margin: '0 auto'
        }}>
          {errorMsg && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '12px', fontSize: '0.88rem', marginBottom: '1.5rem', border: '1px solid #ffcdd2' }}>
              {errorMsg}
            </div>
          )}

          {/* CUSTOMER FORM */}
          {activeRole === 'customer' ? (
            <div>
              {/* Customer Mode Tabs */}
              <div style={{ background: '#f1f5f9', borderRadius: '14px', padding: '4px', display: 'flex', marginBottom: '1.8rem' }}>
                <button
                  type="button"
                  onClick={() => { setCustomerMode('login'); setErrorMsg(''); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    background: customerMode === 'login' ? '#1b5e20' : 'transparent',
                    color: customerMode === 'login' ? '#ffffff' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomerMode('register'); setErrorMsg(''); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    background: customerMode === 'register' ? '#1b5e20' : 'transparent',
                    color: customerMode === 'register' ? '#ffffff' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleCustomerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {customerMode === 'register' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Email or Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={custIdentifier}
                    onChange={(e) => setCustIdentifier(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={custPassword}
                    onChange={(e) => setCustPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>

                {customerMode === 'register' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Delivery Address
                    </label>
                    <textarea
                      rows="2"
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  {loading ? 'Processing...' : (customerMode === 'login' ? 'Sign In & Open Shop' : 'Register & Open Shop')} <ArrowRight size={18} />
                </button>
              </form>
            </div>
          ) : (
            /* ADMIN FORM */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e65100' }}>
                  Store Owner Login
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                  Enter your admin credentials to access the Owner Control Dashboard
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Admin Mobile or Email *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7795687471 or admin@sdkas.com"
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Admin Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter admin password (default: admin123)"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-accent"
                  style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  {loading ? 'Authenticating...' : 'Sign In as Owner & Open Admin Page'} <ArrowRight size={18} />
                </button>
              </form>

              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '1.2rem', textAlign: 'center' }}>
                Default Admin Login: <strong>7795687471</strong> / <strong>admin123</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
