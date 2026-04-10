import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Landmark, Building2, AlertCircle, Info, LogOut, Navigation } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import bankBg from '../assets/bank_bg.png';
import mncBg from '../assets/mnc_bg.jpg';
import user1 from '../assets/user1.png';
import user2 from '../assets/user2.png';
import user3 from '../assets/user3.png';
import user4 from '../assets/user4.png';

const userImages = [user1, user2, user3, user4];

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };
  
  const [animatingTo, setAnimatingTo] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % userImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleBankEntry = () => {
      setAnimatingTo('bank');
      setTimeout(() => navigate('/banking'), 600);
  };

  const handleMNCEntry = () => {
      setAnimatingTo('mnc');
      setTimeout(() => navigate('/identity'), 600);
  };

  return (
    <div className="dashboard-container" style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header className="glass-nav" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#FF9F1C', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E1E1E', fontWeight: 'bold' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>{t('dashboard')}</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          <button className="btn btn-outline" onClick={() => { localStorage.clear(); navigate('/'); }} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <LogOut size={16} /> {t('login')}
          </button>
        </div>
      </header>

      <main className="container" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h2 className="title-lg" style={{ marginBottom: '0.5rem' }}>{t('welcome')}, {user.name}</h2>
            <p style={{ color: 'var(--text-primary)', opacity: 0.8, fontSize: '1.1rem' }}>{t('selectFacility')}</p>
        </div>

        {/* Building Modules Grid */}
        <div className="grid-cols-2 animate-fade-in-delay-1" style={{ gap: '2rem', position: 'relative' }}>
            {/* The Animated Middle Person */}
            <div style={{
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: animatingTo === 'bank' ? 'translate(calc(-50% - 200px), -50%) scale(0.5)' : 
                          animatingTo === 'mnc' ? 'translate(calc(-50% + 200px), -50%) scale(0.5)' : 
                          'translate(-50%, -50%) scale(1)',
               opacity: animatingTo ? 0 : 1,
               transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease',
               zIndex: 20,
               width: '100px',
               height: '100px',
               border: '4px solid #FF9F1C',
               boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
               borderRadius: '50%',
               overflow: 'hidden',
               pointerEvents: 'none',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               background: 'var(--bg-primary)'
            }}>
               <img 
                 src={userImages[currentImageIndex]} 
                 alt="Simulation Avatar" 
                 style={{ 
                   width: '100%', 
                   height: '100%', 
                   objectFit: 'cover',
                   transition: 'opacity 0.3s ease-in-out'
                 }} 
               />
            </div>

            {/* Bank Building */}
            <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', position: 'relative', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <img src={bankBg} alt="Bank Background" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, objectFit: 'cover', zIndex: 0 }} />
                <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3))', zIndex: 1 }}></div>

                <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', zIndex: 2 }}>
                    <Landmark size={48} color="#FF9F1C" />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', zIndex: 2, color: '#FFFFFF' }}>{t('bankBuilding')}</h3>
                <p style={{ fontSize: '1rem', color: '#EAEAEA', opacity: 0.9, marginBottom: '2rem', flex: 1, zIndex: 2 }}>
                   {t('bankDesc')}
                </p>
                <button className="btn btn-warning" onClick={handleBankEntry} style={{ width: '100%', zIndex: 2, padding: '14px 24px', fontSize: '1.1rem' }}>
                    {t('enterFacility')}
                </button>
            </div>

            {/* MNC Building */}
            <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', position: 'relative', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <img src={mncBg} alt="MNC Background" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, objectFit: 'cover', zIndex: 0 }} />
                <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3))', zIndex: 1 }}></div>

                <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', zIndex: 2 }}>
                    <Building2 size={48} color="#3B82F6" />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', zIndex: 2, color: '#FFFFFF' }}>{t('mncBuilding')}</h3>
                <p style={{ fontSize: '1rem', color: '#EAEAEA', opacity: 0.9, marginBottom: '2rem', flex: 1, zIndex: 2 }}>
                   {t('mncDesc')}
                </p>
                <button className="btn btn-warning" onClick={handleMNCEntry} style={{ width: '100%', zIndex: 2, padding: '14px 24px', fontSize: '1.1rem' }}>
                    {t('enterFacility')}
                </button>
            </div>
        </div>

        {/* Security Notice Board */}
        <div className="glass-panel animate-fade-in-delay-2" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--glass-bg)', position: 'relative', overflow: 'hidden', marginTop: '1rem' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #D64545, #FF9F1C)' }}></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
                <div>
                   <h4 style={{ color: 'var(--color-muted-red)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                      <AlertCircle size={20} /> {t('securityDisclaimer')}
                   </h4>
                   <p style={{ color: 'var(--text-primary)', opacity: 0.85, fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {t('townDisclaimer')}
                   </p>
                </div>

                <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '2rem' }}>
                   <h4 style={{ color: 'var(--color-warning-orange)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                      <Navigation size={20} /> {t('safetyTips')}
                   </h4>
                   <ul style={{ fontSize: '0.95rem', color: 'var(--text-primary)', opacity: 0.85, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <li>{t('tip1')}</li>
                      <li>{t('tip2')}</li>
                      <li>{t('tip3')}</li>
                   </ul>
                </div>
            </div>
        </div>
      </main>

      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
        <button className="glass-panel" style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9F1C', cursor: 'help' }}>
          <Info size={32} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
