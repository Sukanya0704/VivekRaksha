import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Globe, ArrowRight } from 'lucide-react';

const Home = () => {
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(() => !localStorage.getItem('languageSelected'));

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
    localStorage.setItem('languageSelected', 'true');
    setShowModal(false);
  };

  return (
    <div className="home-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Language Selection Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem' }}>
            <Globe size={48} color="#FF9F1C" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ marginBottom: '1.5rem' }}>{t('chooseLanguage')}</h2>
            <p style={{ marginBottom: '2.5rem', opacity: 0.8 }}>{t('selectLangTitle')}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', padding: '1rem', border: language === 'en' ? '2px solid #FF9F1C' : '1px solid rgba(234,234,234,0.2)' }}
                onClick={() => handleLanguageSelect('en')}
              >
                English
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', padding: '1rem', border: language === 'hi' ? '2px solid #FF9F1C' : '1px solid rgba(234,234,234,0.2)' }}
                onClick={() => handleLanguageSelect('hi')}
              >
                हिन्दी (Hindi)
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', padding: '1rem', border: language === 'mr' ? '2px solid #FF9F1C' : '1px solid rgba(234,234,234,0.2)' }}
                onClick={() => handleLanguageSelect('mr')}
              >
                मराठी (Marathi)
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="glass-nav" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={32} color="#FF9F1C" />
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{t('appTitle')}</h1>
        </div>
        
        <div className="language-selector" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Globe size={20} />
          <select 
            value={language} 
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ 
              background: 'rgba(58, 58, 58, 0.8)', 
              color: '#EAEAEA', 
              border: '1px solid rgba(234, 234, 234, 0.2)',
              borderRadius: '8px',
              padding: '4px 8px',
              cursor: 'pointer'
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
      </header>

      <main className="container flex-center" style={{ flex: 1, padding: '2rem 0' }}>
        <div className="glass-panel animate-fade-in" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h2 className="title-xl" style={{ marginBottom: '1.5rem' }}>{t('appTitle')}</h2>
          <h3 style={{ color: '#FF9F1C', marginBottom: '1rem' }}>{t('appSubtitle')}</h3>
          <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: 'rgba(234, 234, 234, 0.8)' }}>
            {t('infoText')}
          </p>
          
          <div className="cta-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              {t('login')}
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>
              {t('signup')}
            </button>
          </div>
        </div>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: 'rgba(234, 234, 234, 0.4)', fontSize: '0.9rem' }}>
        &copy; 2024 Vivek Rakhsha - The Guardian Path
      </footer>
    </div>
  );
};

export default Home;
