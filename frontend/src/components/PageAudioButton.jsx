import React, { useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { playAudio } from '../utils/audio';

const PageAudioButton = ({ text }) => {
  const { language, t } = useLanguage();

  useEffect(() => {
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (textToRead, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    playAudio(textToRead, language);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
      <button
        onClick={(e) => speak(text, e)}
        className="btn btn-outline"
        style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', padding: '0.8rem 1.5rem', borderRadius: '30px', color: '#60A5FA', borderColor: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)' }}
        title="Listen to this page"
        type="button"
      >
        {t('listenToScreen') || 'Listen to Screen'}
      </button>
    </div>
  );
};

export default PageAudioButton;
