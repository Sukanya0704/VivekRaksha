import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, ShieldCheck, ShieldX, PhoneIncoming, MessageSquareWarning, ArrowRight } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const FraudSimulator = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const scenarios = [
    {
      type: 'sms',
      content: t('fraudS1Content'),
      sender: "BK-BANKSMS",
      redFlags: [t('fraudS1Flag1'), t('fraudS1Flag2'), t('fraudS1Flag3')],
      isScam: true
    },
    {
      type: 'call',
      content: t('fraudS2Content'),
      sender: "+91 82345 61234",
      redFlags: [t('fraudS2Flag1'), t('fraudS2Flag2')],
      isScam: true
    },
    {
      type: 'sms',
      content: t('fraudS3Content'),
      sender: "AMAZON",
      redFlags: [],
      isScam: false
    }
  ];

  const handleDecision = (decision) => {
    const scenario = scenarios[currentScenario];
    const correct = decision === scenario.isScam;
    setIsCorrect(correct);
    if(correct) setScore(score + 1);
    setShowResult(true);
  };

  const nextScenario = () => {
    if(currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setShowResult(false);
    } else {
        setStep('final');
    }
  };

  const [step, setStep] = useState('quiz'); // quiz, final

  const renderQuiz = () => {
    const scenario = scenarios[currentScenario];
    
    return (
      <div className="quiz-section animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--color-warning-orange)', fontWeight: 'bold' }}>{t('progress')}: {currentScenario + 1} / {scenarios.length}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {scenario.type === 'sms' ? (
            <div className="glass-panel" style={{ width: '350px', background: '#e5e7eb', color: '#1a1a1a', borderRadius: '24px', padding: '1rem', position: 'relative' }}>
              <div style={{ textAlign: 'center', borderBottom: '1px solid #d1d5db', paddingBottom: '8px', marginBottom: '12px', fontSize: '0.8rem', color: '#6b7280' }}>
                {scenario.sender}
              </div>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                {scenario.content}
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ width: '300px', height: '400px', background: '#111827', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '3rem 2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <PhoneIncoming size={60} color="#10B981" style={{ marginBottom: '1rem', animation: 'bounce 1s infinite' }} />
                <p style={{ opacity: 0.6 }}>Incoming Call...</p>
                <h4 style={{ fontSize: '1.2rem' }}>{scenario.sender}</h4>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', width: '100%' }}>
                "{scenario.content}"
              </div>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ background: '#ef4444', height: '40px', width: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldX size={20} /></div>
                <div style={{ background: '#10b981', height: '40px', width: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={20} /></div>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>{t('scamOrLegit')}</h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button className="btn btn-warning" onClick={() => handleDecision(true)} disabled={showResult}>
              <ShieldX /> {t('scamButton')}
            </button>
            <button className="btn btn-primary" onClick={() => handleDecision(false)} disabled={showResult}>
              <ShieldCheck /> {t('safeButton')}
            </button>
          </div>
        </div>

        {showResult && (
          <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem', background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {isCorrect ? <ShieldCheck color="#10B981" size={32} /> : <MessageSquareWarning color="#EF4444" size={32} />}
              <h4 style={{ color: isCorrect ? '#10B981' : '#EF4444' }}>{isCorrect ? t('correct') : t('incorrect')}</h4>
            </div>
            <p style={{ marginBottom: '1rem' }}>
              {scenario.isScam 
                ? t('scamResult') 
                : t('safeResult')}
            </p>
            {scenario.redFlags.length > 0 && (
              <div style={{ background: 'rgba(58, 58, 58, 0.4)', padding: '1rem', borderRadius: '12px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{t('redFlagsDetected')}</p>
                <ul style={{ fontSize: '0.8rem', paddingLeft: '1.2rem' }}>
                  {scenario.redFlags.map((flag, i) => <li key={i}>{flag}</li>)}
                </ul>
              </div>
            )}
            <button className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }} onClick={nextScenario}>
               {t('nextScenario')} <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderFinal = () => {
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <ShieldCheck size={80} color="#FF9F1C" style={{ marginBottom: '2rem' }} />
        <h2 className="title-lg">{t('trainingComplete')}</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{t('scoreSummary', { score, total: scenarios.length }).replace('{score}', score).replace('{total}', scenarios.length)}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/banking')}>{t('backToPortals')}</button>
            <button className="btn btn-outline" onClick={() => { setStep('quiz'); setCurrentScenario(0); setScore(0); setShowResult(false); }}>{t('tryAgain')}</button>
        </div>
      </div>
    );
  };

  return (
    <div className="module-page" style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-link" onClick={() => navigate('/banking')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="title-lg" style={{ margin: 0, color: 'var(--text-primary)' }}>{t('moduleFraud')}</h2>
        </div>
        <ThemeToggle />
      </header>

      <div className="container" style={{ maxWidth: '800px' }}>
        {step === 'quiz' ? renderQuiz() : renderFinal()}
      </div>
    </div>
  );
};

export default FraudSimulator;
