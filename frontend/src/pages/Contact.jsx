import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { sendContactMessage } from '../services/api';
import { FSSAIBadge } from '../components/FSSAIBadge';

export const Contact = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      setErrorMsg('Please enter your name, phone number, and message.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await sendContactMessage({ name, phone, message });
      if (res.success) {
        setSuccessMsg('Thank you! Your message has been sent successfully. Our team will contact you soon.');
        setName('');
        setPhone('');
        setMessage('');
      } else {
        setErrorMsg(res.message || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: '#1b5e20', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            We'd Love to Hear From You
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
            Contact Us
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Shri Datta Krushi Abhivrudhi Sangh, Ingali, Chikkodi Taluk, Belagavi District, Karnataka.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {/* Contact Details Column */}
          <div>
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1b5e20', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem' }}>
                Get In Touch Directly
              </h2>

              {/* Phone Numbers */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '12px', color: '#1b5e20' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Call Us (Click to Call)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px', fontSize: '0.95rem' }}>
                    <a href="tel:9481327296" style={{ color: '#1b5e20', fontWeight: 700 }}>📞 9481327296</a>
                    <a href="tel:7795687471" style={{ color: '#1b5e20', fontWeight: 700 }}>📞 7795687471</a>
                    <a href="tel:7899507471" style={{ color: '#1b5e20', fontWeight: 700 }}>📞 7899507471</a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '12px', color: '#1565c0' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Email Us (Click to Email)</h4>
                  <a href="mailto:pawarganesh5070@gmail.com" style={{ color: '#1565c0', fontWeight: 600, fontSize: '0.95rem', display: 'block', marginTop: '4px', wordBreak: 'break-all' }}>
                    ✉️ pawarganesh5070@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '12px', color: '#e65100' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Dairy Address</h4>
                  <p style={{ color: '#475569', fontSize: '0.92rem', marginTop: '4px', lineHeight: '1.5' }}>
                    Shri Datta Krushi Abhivrudhi Sangh,<br />
                    Ingali, Chikkodi Taluk,<br />
                    Belagavi District, Karnataka, India
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Box */}
            <div style={{
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Instant WhatsApp Chat</div>
                <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>Chat directly with owner on 7795687471</div>
              </div>
              <a
                href="https://wa.me/917795687471"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ background: '#ffffff', color: '#128C7E', fontWeight: 700, padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Chat Now
              </a>
            </div>
          </div>

          {/* Contact Form Column */}
          <div>
            <form onSubmit={handleSubmit} style={{
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '2.2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>
                  Send a Message
                </h2>
                <FSSAIBadge size="small" />
              </div>

              {successMsg && (
                <div style={{ background: '#e8f5e9', color: '#1b5e20', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', border: '1px solid #c8e6c9', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle2 size={18} />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div style={{ background: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', border: '1px solid #ffcdd2' }}>
                  {errorMsg}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter phone number"
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

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Message / Inquiry Details *
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Inquire about retail prices, wholesale bulk supply, delivery in Ingali/Chikkodi..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '12px', fontSize: '1rem', width: '100%', justifyContent: 'center' }}
              >
                <Send size={18} />
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
