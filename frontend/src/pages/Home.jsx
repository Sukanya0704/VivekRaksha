//import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Sun, Moon, Smartphone, Lock, CreditCard, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import logo from '../assets/logo.png';
import homeUser1 from '../assets/home_user1.jpg';
import homeUser2 from '../assets/home_user2.jpg';
import homeUser3 from '../assets/home_user3.jpg';
import homeUser4 from '../assets/home_user4.jpg';

const homeImages = [homeUser1, homeUser2, homeUser3, homeUser4];

const Home = () => {
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(() => !sessionStorage.getItem('languageSelected'));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Modal will now show every time the component mounts
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % homeImages.length);
    }, 3500); // Shuffle every 3.5 seconds
    return () => clearInterval(timer);
  }, []);



  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
    sessionStorage.setItem('languageSelected', 'true');
    setShowModal(false);
  };

  return (
    <div className="home-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* Background blobs for premium look */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(255,159,28,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* Language Selection Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem' }}>
            <Globe size={48} color="#FF9F1C" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ marginBottom: '1.5rem', color: '#EAEAEA' }}>{t('chooseLanguage')}</h2>
            <p style={{ marginBottom: '2.5rem', color: 'rgba(234,234,234,0.8)' }}>{t('selectLangTitle')}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['en', 'hi', 'mr'].map(lang => (
                <button
                  key={lang}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '1rem', border: language === lang ? '2px solid #FF9F1C' : '1px solid rgba(234,234,234,0.2)' }}
                  onClick={() => handleLanguageSelect(lang)}
                >
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी (Hindi)' : 'मराठी (Marathi)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <header className="glass-nav" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
        <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logo} alt="Vivek Rakhsha Logo" style={{ height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800, background: 'linear-gradient(90deg, #FF9F1C, #D64545)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('appTitle')}
          </h1>
        </div>

        <div className="theme-toggle" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setShowModal(true)} className="btn btn-outline" title="Change Language" style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={18} />
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: '4rem 0', display: 'flex', alignItems: 'center', zIndex: 10 }}>
        <div className="grid-cols-2" style={{ gap: '4rem', alignItems: 'center' }}>
          {/* Left Text Content */}
          <div className="animate-fade-in" style={{ paddingRight: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '20px', marginBottom: '1.5rem', color: '#3B82F6', fontWeight: 600, fontSize: '0.85rem' }}>
              <ShieldCheck size={16} /> {t('riskFreeLearning')}
            </div>

            <h2 className="title-xl" style={{ marginBottom: '1rem' }}>
              {t('masterDigital')} <br /><span style={{ color: '#FF9F1C' }}>{t('trustSafety')}</span>
            </h2>

            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.7 }}>
              {t('infoText')}
            </p>

            <div className="cta-buttons" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-warning" style={{ padding: '14px 32px', fontSize: '1.1rem' }} onClick={() => navigate('/login')}>
                {t('startSimulation')}
              </button>
              <button className="btn btn-outline" style={{ padding: '14px 32px', fontSize: '1.1rem' }} onClick={() => navigate('/login', { state: { isSignup: true } })}>
                {t('signup')}
              </button>
            </div>
          </div>

          {/* Right Visual Content */}
          <div className="animate-fade-in-delay-1" style={{ position: 'relative', height: '100%', minHeight: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              height: '450px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
              position: 'relative'
            }}>
              <img
                key={currentImageIndex}
                src={homeImages[currentImageIndex]}
                alt="Digital Empowerment"
                className="animate-fade-in"
                style={{
                  width: '100%',
                  height: '110%', // Make it taller to crop the bottom
                  objectFit: 'cover',
                  objectPosition: 'top', // Focus on the top/center to push the bottom out
                  opacity: 1,
                  zIndex: 1,
                  transition: 'opacity 0.8s ease-in-out'
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', zIndex: 50 }}>
        &copy; {t('footerText')}
      </footer>
    </div>
  );
};

export default Home;
