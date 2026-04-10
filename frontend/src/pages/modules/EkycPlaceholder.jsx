import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, ArrowLeft, Clock } from 'lucide-react';
import { markLevelComplete } from '../../utils/levelProgress';

/**
 * Level 6 Placeholder — eKYC Verification Mastery
 * Being implemented by a teammate. Auto-marks complete after 3 sec read.
 */
const EkycPlaceholder = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => markLevelComplete(6, navigate), 3000);
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

      <div style={{
        background: 'rgba(40,40,40,0.8)',
        border: '2px solid rgba(139,92,246,0.45)',
        borderRadius: 24,
        padding: '3rem 2.5rem',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 0 40px rgba(139,92,246,0.15), 0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'rgba(139,92,246,0.15)',
          border: '2px solid rgba(139,92,246,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <BadgeCheck size={40} color="#8B5CF6" />
        </div>

        <span style={{
          display: 'inline-block',
          background: 'rgba(139,92,246,0.15)',
          color: '#8B5CF6',
          borderRadius: 99, padding: '3px 14px',
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1,
          marginBottom: '0.8rem',
        }}>
          LEVEL 6
        </span>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.8rem', fontWeight: 800,
          color: '#EAEAEA', margin: '0 0 1rem',
        }}>
          eKYC Verification Mastery
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'rgba(234,234,234,0.7)', lineHeight: 1.65, marginBottom: '2rem' }}>
          This module is under development. It will teach you how to identify legitimate
          eKYC documents and unmask fraudulent verification agents.
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 12, padding: '0.9rem 1.4rem',
          marginBottom: '1.5rem',
        }}>
          <Clock size={18} color="#8B5CF6" />
          <span style={{ color: '#8B5CF6', fontWeight: 600, fontSize: '0.95rem' }}>
            Marking complete & returning to map in 3 seconds…
          </span>
        </div>

        <button
          onClick={() => markLevelComplete(6, navigate)}
          style={{
            width: '100%',
            background: '#8B5CF6',
            color: '#fff', border: 'none',
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

export default EkycPlaceholder;
