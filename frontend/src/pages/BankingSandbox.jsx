import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CreditCard, Smartphone, PhoneOff, Lock, ArrowLeft } from 'lucide-react';

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
      desc: 'Simulate UPI payments using a PhonePe-style interface.'
    },
    {
      id: 'netbanking',
      title: t('moduleNetBank'),
      icon: <CreditCard size={40} />,
      color: '#3B82F6', // Blue for Banking
      path: '/banking/netbanking',
      desc: 'Learn how to securely use traditional Net Banking portals.'
    },
    {
      id: 'fraud',
      title: t('moduleFraud'),
      icon: <PhoneOff size={40} />,
      color: '#F59E0B', // Orange for Warning
      path: '/banking/fraud',
      desc: 'Learn to spot fake calls and SMS from scammers.'
    },
    {
      id: 'otp',
      title: t('moduleOTP'),
      icon: <Lock size={40} />,
      color: '#EF4444', // Red for Risk
      path: '/banking/otp',
      desc: 'Identify dangerous links and protect your OTPs.'
    }
  ];

  return (
    <div className="banking-page-container" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header className="glass-nav" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-link" onClick={() => navigate('/dashboard')} style={{ color: 'var(--color-soft-white)', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} /> {t('back')}
        </button>
        <h2 style={{ fontSize: '1.2rem', margin: 0, marginLeft: '1rem' }}>{t('bankBuilding')}</h2>
      </header>

      <main className="container" style={{ padding: '3rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="title-lg">Select a Learning Module</h2>
          <p style={{ color: 'rgba(234, 234, 234, 0.6)' }}>Choose a simulation to start your training.</p>
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
                e.currentTarget.style.background = 'rgba(58, 58, 58, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.background = 'rgba(58, 58, 58, 0.4)';
              }}
            >
              <div style={{ background: `${module.color}22`, color: module.color, padding: '1rem', borderRadius: '16px' }}>
                {module.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{module.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(234, 234, 234, 0.5)' }}>{module.desc}</p>
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
