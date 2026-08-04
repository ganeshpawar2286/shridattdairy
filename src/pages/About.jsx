import React from 'react';
import { Link } from 'react-router-dom';
import { Milk, ShieldCheck, Award, MapPin, Phone, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { FSSAIBadge } from '../components/FSSAIBadge';

export const About = () => {
  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Banner */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <FSSAIBadge style={{ marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#1b5e20', marginBottom: '0.8rem' }}>
            About Shri Datta Krushi Abhivrudhi Sangh
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
            Delivering authentic, 100% pure milk products directly from rural dairy farms in Ingali, Chikkodi Taluk, Belagavi District to homes and businesses across Karnataka.
          </p>
        </div>

        {/* Grid story */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.2rem' }}>
              Our Heritage & Mission
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
              Established in Ingali, <strong>Shri Datta Krushi Abhivrudhi Sangh</strong> was founded with a mission to empower local dairy farmers while supplying consumers and commercial businesses with clean, pure, unadulterated dairy products.
            </p>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              We take extreme pride in producing traditional milk sweets like Peda, Khova, Basundi, Kalakand, Kunda, Shrikhand, Milk Cake, along with fresh staples like pure Desi Ghee, Paneer, Curd (Dahi), Butter, and fresh Milk daily.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#ffffff', padding: '1.2rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1b5e20', fontFamily: "'Outfit', sans-serif" }}>100%</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>Pure Farm Milk</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Zero artificial preservatives</div>
              </div>

              <div style={{ background: '#ffffff', padding: '1.2rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e65100', fontFamily: "'Outfit', sans-serif" }}>FSSAI</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>Approved Quality</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Certified hygiene standards</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
              borderRadius: '24px',
              padding: '2.5rem',
              color: '#ffffff',
              boxShadow: '0 20px 40px rgba(27, 94, 32, 0.2)'
            }}>
              <Milk size={48} style={{ color: '#ffd54f', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1rem' }}>
                Wholesale & Bulk Supply Specialist
              </h3>
              <p style={{ color: '#e8f5e9', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Whether you run a sweet shop, hotel, catering business, or are organizing a grand wedding or festival in Belagavi district, we offer competitive wholesale pricing on bulk orders of Khova, Paneer, Peda, Basundi, and Ghee.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: '#81c784' }} /> Custom bulk packaging available
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: '#81c784' }} /> Dedicated customer support & delivery
                </div>
              </div>

              <Link to="/contact" className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                Inquire For Wholesale <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Business Address & Info Box */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '2.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', textAlign: 'center' }}>
            Official Business Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ background: '#e8f5e9', padding: '10px', borderRadius: '12px', color: '#1b5e20' }}>
                <MapPin size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Registered Location</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px' }}>
                  Ingali, Chikkodi Taluk,<br />Belagavi District, Karnataka, India
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ background: '#fff3e0', padding: '10px', borderRadius: '12px', color: '#e65100' }}>
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Direct Contact Lines</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px' }}>
                  9481327296<br />
                  7795687471<br />
                  7899507471
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '12px', color: '#1565c0' }}>
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Email Address</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>
                  pawarganesh5070@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
