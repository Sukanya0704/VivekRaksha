import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, Lock, CreditCard, ArrowLeft, Eye, EyeOff, Info, LogOut } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const NetBankingSimulator = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Login, 2: Dashboard/Accounts
  const [showPin, setShowPin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const renderContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="net-bank-login" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ background: '#fff', color: '#333', padding: 0, overflow: 'hidden', border: 'none' }}>
              <div style={{ background: '#111827', color: 'white', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Shield color="#FF9F1C" />
                <h3 style={{ margin: 0 }}>{t('secureBank')}</h3>
              </div>
              <div style={{ padding: '3rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('loginLink')}</h4>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#666', marginBottom: '6px' }}>{t('customerId')}</label>
                    <input 
                      className="input-control" 
                      style={{ color: '#1a1a1a', border: '1px solid #ccc' }} 
                      placeholder={t('enterCustomerId')} 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#666', marginBottom: '6px' }}>{t('password')}</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showPin ? "text" : "password"} 
                        className="input-control" 
                        style={{ color: '#1a1a1a', border: '1px solid #ccc' }} 
                        placeholder={t('enterPassword')} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div 
                        onClick={() => setShowPin(!showPin)} 
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                      >
                        {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="btn" 
                    style={{ width: '100%', background: '#111827', color: 'white' }}
                    onClick={() => {
                        if(username && password) setStep(2);
                        else alert(t('errorOccurred'));
                    }}
                  >
                    {t('secureLogin')}
                  </button>
                  <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#4B5563', textAlign: 'center' }}>
                    {t('notHaveId')} <span style={{ color: '#1e40af', cursor: 'pointer' }}>{t('registerNow')}</span>
                  </p>
                </div>
                
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1.5rem', border: '1px dashed #d1d5db' }}>
                  <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C', marginBottom: '1rem' }}>
                    <Lock size={16} /> {t('netBankSecurityTipsKey')}
                  </h5>
                  <ul style={{ fontSize: '0.85rem', color: '#374151', paddingLeft: '1.2rem' }}>
                    <li style={{ marginBottom: '10px' }}>{t('lockerIconTip')}</li>
                    <li style={{ marginBottom: '10px' }}>{t('noShareOtpTip')}</li>
                    <li>{t('avoidPublicWifiTip')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ width: '100%', background: '#f3f4f6', minHeight: '600px', padding: '2rem', color: '#1a1a1a' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Shield size={32} color="#111827" />
                <div>
                   <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t('welcome')}, {username}</h3>
                   <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Last login: Today, 10:24 AM</span>
                </div>
              </div>
              <button 
                onClick={() => setStep(1)}
                style={{ background: 'none', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div className="glass-panel" style={{ background: '#111827', color: 'white', border: 'none' }}>
                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>{t('primarySavings')}</p>
                <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1.5rem' }}>₹45,230.00</h2>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>A/c: **** 2390</span>
                  <button style={{ background: 'none', border: 'none', color: '#FF9F1C', cursor: 'pointer', fontWeight: 'bold' }}>{t('viewMiniStatement')}</button>
                </div>
              </div>

              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
                <h4 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>{t('quickActions')}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                        { icon: <CreditCard />, label: t('fundTransfer') },
                        { icon: <Lock />, label: t('changePin') },
                        { icon: <Info />, label: t('applyLoan') }
                    ].map((item, id) => (
                        <div key={id} style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid #f3f4f6', borderRadius: '12px', cursor: 'pointer' }}>
                            <div style={{ color: '#111827', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{item.label}</span>
                        </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ background: 'rgba(255, 159, 28, 0.1)', border: '1px solid var(--color-warning-orange)', marginTop: '2rem', color: '#1a1a1a' }}>
              <p>{t('safeBankingPractice')}</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="module-page" style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-link" onClick={() => navigate('/banking')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="title-lg" style={{ margin: 0, color: 'var(--text-primary)' }}>{t('moduleNetBank')}</h2>
        </div>
        <ThemeToggle />
      </header>

      <div className="container" style={{ position: 'relative' }}>
          {renderContent()}
      </div>
    </div>
  );
};

export default NetBankingSimulator;
