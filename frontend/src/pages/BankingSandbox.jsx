import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CreditCard, Smartphone, PhoneOff, Lock, ArrowLeft, Map, Trophy } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const BankingSandbox = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const modules = [
    {
      id: 'upi',
      title: t('moduleUPI'),
      icon: <Smartphone size={40} />,
      color: '#10B981', // Green for UPI
      path: '/banking/upi',
      desc: t('moduleUPIDesc')
    },
    {
      id: 'netbanking',
      title: t('moduleNetBank'),
      icon: <CreditCard size={40} />,
      color: '#3B82F6', // Blue for Banking
      path: '/banking/netbanking',
      desc: t('moduleNetBankDesc')
    },
    {
      id: 'fraud',
      title: t('moduleFraud'),
      icon: <PhoneOff size={40} />,
      color: '#F59E0B', // Orange for Warning
      path: '/banking/fraud',
      desc: t('moduleFraudDesc')
    },
    {
      id: 'otp',
      title: t('moduleOTP'),
      icon: <Lock size={40} />,
      color: '#EF4444', // Red for Risk
      path: '/banking/otp',
      desc: t('moduleOTPDesc')
    }
  ];

  return (
    <div className="banking-page-container" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header className="glass-nav" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-link" onClick={() => navigate('/dashboard')} style={{ color: 'var(--color-soft-white)', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} /> {t('back')}
          </button>
          <h2 style={{ fontSize: '1.2rem', margin: 0, marginLeft: '1rem' }}>{t('bankBuilding')}</h2>
        </div>
        <ThemeToggle />
      </header>

      <main className="container" style={{ padding: '3rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="title-lg">{t('selectModule')}</h2>
          <p style={{ color: 'var(--text-primary)', opacity: 0.85 }}>{t('chooseSimulation')}</p>
        </div>

        {/* Level Map CTA */}
        <div
          onClick={() => navigate('/banking')}
          style={{
            background: 'linear-gradient(135deg, rgba(255,159,28,0.18), rgba(214,69,69,0.12))',
            border: '2px solid rgba(255,159,28,0.45)',
            borderRadius: 22,
            padding: '2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            cursor: 'pointer',
            marginBottom: '2.5rem',
            transition: 'transform 0.3s, box-shadow 0.3s',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 50px rgba(255,159,28,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.3)'; }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #FF9F1C, #D64545)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 0 24px rgba(255,159,28,0.4)',
          }}>
            <Map size={36} color="#1E1E1E" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#FF9F1C', fontWeight: 700, letterSpacing: 1.2, marginBottom: 4 }}>🏅 GAMIFIED LEARNING PATH</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', marginBottom: 4 }}>Safety Road – Level Map</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', opacity: 0.75 }}>Follow the winding path, earn badges, and master banking security step by step.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FF9F1C', flexShrink: 0 }}>
            <Trophy size={22} />
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>Start</span>
          </div>
        </div>

        <div className="grid-cols-2" style={{ gap: '2rem' }}>
          {modules.map((module) => (
            <div 
              key={module.id} 
              className="glass-panel" 
              onClick={() => navigate(module.path)}
              style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                alignItems: 'center', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderLeft: `6px solid ${module.color}`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateX(10px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ background: `${module.color}22`, color: module.color, padding: '1rem', borderRadius: '16px' }}>
                {module.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{module.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', opacity: 0.8 }}>{module.desc}</p>
                <button className="btn-link" style={{ color: module.color, fontSize: '0.9rem', fontWeight: '700', marginTop: '0.5rem', display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {t('startSimulation')} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BankingSandbox;
