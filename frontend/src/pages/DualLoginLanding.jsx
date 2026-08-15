import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, User, ArrowRight, ShieldAlert, Milk, UserPlus, LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FSSAIBadge } from '../components/FSSAIBadge';

export const DualLoginLanding = () => {
  const { adminLogin, customerLogin, customerRegister, isAdminLoggedIn, isCustomerLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Admin Form State
  const [adminMobile, setAdminMobile] = useState('9999999999');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Customer Form State
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerError, setCustomerError] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);

  // Registration Modal / Mode State
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regError, setRegError] = useState('');

  // If already logged in, redirect to respective pages
  if (isAdminLoggedIn) {
    navigate('/admin');
    return null;
  }

  if (isCustomerLoggedIn) {
    navigate('/shop');
    return null;
  }

  // Handle Admin Login Box Submission
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    try {
      await adminLogin({ mobile: adminMobile, password: adminPassword });
      setAdminLoading(false);
      navigate('/admin');
    } catch (err) {
      setAdminError(err.message || 'Invalid admin mobile or password.');
      setAdminLoading(false);
    }
  };

  // Handle Customer Login Box Submission
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setCustomerError('');
    setCustomerLoading(true);

    try {
      await customerLogin({ mobile: customerMobile, password: customerPassword });
      setCustomerLoading(false);
      navigate('/shop');
    } catch (err) {
      setCustomerError(err.message || 'Invalid customer mobile or password. Click Register if new.');
      setCustomerLoading(false);
    }
  };

  // Handle Customer Registration Submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    try {
      await customerRegister({ name: regName, mobile: regMobile, password: regPassword, address: regAddress });
      setIsRegistering(false);
      navigate('/shop');
    } catch (err) {
      setRegError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem 0', minHeight: '85vh', background: '#faf7f2' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Top Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <FSSAIBadge style={{ marginBottom: '0.8rem' }} />
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1b5e20', marginTop: '4px' }}>
            Shri Datta Krushi Abhivrudhi Sangh, Ingali
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '4px' }}>
            Please log in using your account credentials below to enter the portal.
          </p>
        </div>

        {/* 2 DISTINCT LOGIN BOXES EXACTLY LIKE HANDWRITTEN DIAGRAM */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* BOX 1: ADMIN PAGE LOGIN (Top/Left Box in Diagram) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #e65100',
            padding: '2.2rem',
            boxShadow: '0 10px 25px rgba(230, 81, 0, 0.08)',
            position: 'relative'
          }}>
            <div style={{
              background: '#fff3e0',
              color: '#e65100',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '1rem'
            }}>
              <ShieldAlert size={16} /> ADMIN PAGE LOGIN
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem' }}>
              Owner / Admin Login
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Enter admin mobile number & password to open the Admin Control Dashboard.
            </p>

            {adminError && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #ffcdd2' }}>
                {adminError}
              </div>
            )}

            <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Field 1: Admin Mobile / Username */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Admin Mobile / Username *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#e65100' }} />
                  <input
                    type="text"
                    required
                    placeholder="admin (e.g. 9999999999 / 7795687471)"
                    value={adminMobile}
                    onChange={(e) => setAdminMobile(e.target.value)}
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

              {/* Field 2: Admin Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Admin Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#e65100' }} />
                  <input
                    type="password"
                    required
                    placeholder="admin123"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
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
                disabled={adminLoading}
                className="btn btn-accent"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                {adminLoading ? 'Logging into Admin...' : 'Login to Admin Page'} <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* BOX 2: CUSTOMER PAGE LOGIN (Bottom/Right Box in Diagram) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #1b5e20',
            padding: '2.2rem',
            boxShadow: '0 10px 25px rgba(27, 94, 32, 0.08)',
            position: 'relative'
          }}>
            <div style={{
              background: '#e8f5e9',
              color: '#1b5e20',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '1rem'
            }}>
              <Milk size={16} /> CUSTOMER PAGE LOGIN
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem' }}>
              Customer Login
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Enter customer mobile number & password to open the Customer Shop & Home Page.
            </p>

            {customerError && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #ffcdd2' }}>
                {customerError}
              </div>
            )}

            <form onSubmit={handleCustomerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Field 1: Customer Mobile */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Customer Mobile Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#1b5e20' }} />
                  <input
                    type="tel"
                    required
                    placeholder="Enter customer mobile (e.g. 9481327296)"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
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

              {/* Field 2: Customer Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Customer Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#1b5e20' }} />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
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
                disabled={customerLoading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                {customerLoading ? 'Logging into Shop...' : 'Login to Customer Page'} <ArrowRight size={18} />
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
              New customer?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                style={{ color: '#1b5e20', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Register New Customer Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOMER REGISTRATION MODAL */}
      {isRegistering && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', maxWidth: '460px', width: '100%', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1b5e20', marginBottom: '1.2rem' }}>
              🥛 Register New Customer Account
            </h3>

            {regError && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {regError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Full Name *</label>
                <input type="text" required placeholder="" value={regName} onChange={(e) => setRegName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Mobile Number *</label>
                <input type="tel" required placeholder="" value={regMobile} onChange={(e) => setRegMobile(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Create Password *</label>
                <input type="password" required placeholder="Create password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Delivery Address</label>
                <textarea rows="2" placeholder="Village / Landmark" value={regAddress} onChange={(e) => setRegAddress(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsRegistering(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Register & Open Shop</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
