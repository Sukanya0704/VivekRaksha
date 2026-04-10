import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Clock } from 'lucide-react';
import { markLevelComplete } from '../../utils/levelProgress';

/**
 * Level 1 Placeholder — Secure Your UPI PIN
 * Being implemented by a teammate. Auto-marks complete after 3 sec read.
 */
const UpiPinPlaceholder = () => {
  const navigate = useNavigate();

  // Auto-complete after a short delay so the flow still works
  useEffect(() => {
    const t = setTimeout(() => markLevelComplete(1, navigate), 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      padding: '2rem',
    }}>
      {/* Back */}
      <button
        onClick={() => navigate('/banking')}
        style={{
          position: 'absolute', top: '1.5rem', left: '1.5rem',
          background: 'none', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 10, color: 'var(--text-primary)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
          fontSize: '0.9rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Map
      </button>

      {/* Card */}
      <div style={{
        background: 'rgba(40,40,40,0.8)',
        border: '2px solid rgba(255,159,28,0.45)',
        borderRadius: 24,
        padding: '3rem 2.5rem',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 0 40px rgba(255,159,28,0.15), 0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'rgba(255,159,28,0.15)',
          border: '2px solid rgba(255,159,28,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <Shield size={40} color="#FF9F1C" />
        </div>

        <span style={{
          display: 'inline-block',
          background: 'rgba(255,159,28,0.15)',
          color: '#FF9F1C',
          borderRadius: 99, padding: '3px 14px',
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1,
          marginBottom: '0.8rem',
        }}>
          LEVEL 1
        </span>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.8rem', fontWeight: 800,
          color: '#EAEAEA', margin: '0 0 1rem',
        }}>
          Secure Your UPI PIN
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'rgba(234,234,234,0.7)', lineHeight: 1.65, marginBottom: '2rem' }}>
          This module is currently under development by our team.
          It will teach you how to set a strong UPI PIN and protect it from attackers.
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          background: 'rgba(255,159,28,0.1)',
          border: '1px solid rgba(255,159,28,0.3)',
          borderRadius: 12, padding: '0.9rem 1.4rem',
          marginBottom: '1.5rem',
        }}>
          <Clock size={18} color="#FF9F1C" />
          <span style={{ color: '#FF9F1C', fontWeight: 600, fontSize: '0.95rem' }}>
            Marking complete & returning to map in 3 seconds…
          </span>
        </div>

        <button
          onClick={() => markLevelComplete(1, navigate)}
          style={{
            width: '100%',
            background: '#FF9F1C',
            color: '#1E1E1E', border: 'none',
            borderRadius: 14, padding: '14px',
            fontSize: '1rem', fontWeight: 800,
            cursor: 'pointer', fontFamily: 'var(--font-heading)',
          }}
        >
          Mark Complete & Continue →
        </button>
      </div>
    </div>
  );
};

export default UpiPinPlaceholder;
