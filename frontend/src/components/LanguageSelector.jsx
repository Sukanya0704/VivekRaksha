import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [showModal, setShowModal] = useState(() => !sessionStorage.getItem('languageSelected'));

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
    sessionStorage.setItem('languageSelected', 'true');
    setShowModal(false);
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        className="btn btn-outline" 
        title="Change Language" 
        style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Globe size={18} />
      </button>

      {/* Language Selection Modal */}
      {showModal && createPortal(
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem' }}>
            <Globe size={48} color="#FF9F1C" style={{ marginBottom: '1.5rem', display: 'inline-block' }} />
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{t('chooseLanguage') || 'Choose Language'}</h2>
            <p style={{ marginBottom: '2.5rem', color: 'var(--text-primary)', opacity: 0.8 }}>{t('selectLangTitle') || 'Please select your preferred language for learning.'}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['en', 'hi', 'mr'].map(lang => (
                <button
                  key={lang}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '1rem', border: language === lang ? '2px solid #FF9F1C' : '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                  onClick={() => handleLanguageSelect(lang)}
                >
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी (Hindi)' : 'मराठी (Marathi)'}
                </button>
              ))}
            </div>
            {/* Optional dismiss button if they just wanted to check */}
            {sessionStorage.getItem('languageSelected') && (
              <button 
                className="btn-link" 
                onClick={() => setShowModal(false)}
                style={{ marginTop: '1.5rem', color: 'var(--text-primary)', opacity: 0.6 }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default LanguageSelector;
