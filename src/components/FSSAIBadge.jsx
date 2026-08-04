import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const FSSAIBadge = ({ size = 'medium', className = '' }) => {
  if (size === 'small') {
    return (
      <div className={`inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold ${className}`} style={{ background: '#e8f5e9', color: '#1b5e20', border: '1px solid #c8e6c9', borderRadius: '20px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <ShieldCheck size={14} style={{ color: '#2e7d32' }} />
        <span>FSSAI Approved</span>
      </div>
    );
  }

  return (
    <div className={`fssai-card ${className}`} style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f4fbf5 100%)',
      border: '1.5px solid #2e7d32',
      borderRadius: '12px',
      padding: '8px 16px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 2px 8px rgba(46, 125, 50, 0.1)'
    }}>
      <div style={{
        background: '#1b5e20',
        color: '#ffffff',
        padding: '6px 10px',
        borderRadius: '8px',
        fontWeight: 800,
        fontSize: '0.9rem',
        letterSpacing: '0.5px'
      }}>
        fssai
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1b5e20', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          ✓ FSSAI Approved Dairy
        </div>
        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
          Quality & Safety Certified
        </div>
      </div>
    </div>
  );
};
