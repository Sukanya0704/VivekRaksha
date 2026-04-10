import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import * as LucideIcons from 'lucide-react';

const { 
  ArrowLeft, ArrowRight, CheckCircle, ShieldAlert, Info, HelpCircle, 
  Scan, Smartphone, Building2, User, Search, X, Bell, History, 
  MoreHorizontal, ChevronRight, CreditCard, Shield, Camera, QrCode, Home
} = LucideIcons;

const UpiSimulator = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Refs
  const lastSpokenText = useRef('');
  const phoneRef = useRef(null);
  const targetRefs = useRef({});

  // State for flow control
  const [flow, setFlow] = useState('home'); // home, qr, mobile, balance, success
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [manualNumber, setManualNumber] = useState('');
  const [guidePos, setGuidePos] = useState({ top: 0, left: 0, show: false, side: 'right' });

  // Audio Instruction logic - Fixed Stutter
  const speak = useCallback((text) => {
    if (!window.speechSynthesis || isMuted || !text) return;
    
    // Stutter fix: Don't repeat if already speaking or if same text was just spoken
    if (window.speechSynthesis.speaking && lastSpokenText.current === text) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      lastSpokenText.current = text;
    };
    
    window.speechSynthesis.speak(utterance);
    lastSpokenText.current = text;
  }, [language, isMuted]);

  // Update Guide Position based on targetId
  const updateGuidePos = useCallback((targetId) => {
    if (!phoneRef.current) return;
    const target = document.getElementById(targetId);
    if (!target) {
      setGuidePos(prev => ({ ...prev, show: false }));
      return;
    }

    const rect = target.getBoundingClientRect();
    const phoneRect = phoneRef.current.getBoundingClientRect();

    // Calculate position relative to phone
    const relativeTop = rect.top + (rect.height / 2) - phoneRect.top;
    
    // Decide side (usually right, but if target is on the right, show left)
    const side = (rect.left - phoneRect.left) > (phoneRect.width / 2) ? 'left' : 'right';
    const leftPos = side === 'right' ? phoneRect.width + 20 : -220;

    setGuidePos({
      top: relativeTop,
      left: leftPos,
      show: true,
      side: side
    });
  }, []);

  // Trigger audio instruction and update guide when step/flow changes
  useEffect(() => {
    let instructionKey = '';
    let targetId = '';

    if (flow === 'home' && step === 1) {
      instructionKey = isTransactionComplete ? 'upiStepSuccessDone' : 'upiStep1';
      targetId = isTransactionComplete ? 'btn-balance' : 'btn-to-mobile';
    }
    else if (flow === 'qr' && step === 1) {
      instructionKey = 'upiStepScan';
      targetId = 'qr-detect-zone';
    }
    else if (flow === 'mobile' && step === 1) {
      instructionKey = 'upiStepMobile';
      targetId = 'input-mobile';
    }
    else if ((flow === 'mobile' || flow === 'qr') && step === 2) {
      instructionKey = 'upiStepAmount';
      targetId = 'input-amount';
    }
    else if ((flow === 'mobile' || flow === 'qr' || flow === 'balance') && step === 3) {
      instructionKey = 'upiStepPin';
      targetId = 'pin-row';
    }
    else if (flow === 'balance' && step === 1) {
      instructionKey = 'upiStepBalance';
      targetId = 'bank-card';
    }
    else if (flow === 'success') {
      instructionKey = 'upiStepSuccess';
      targetId = 'success-screen';
    }

    if (instructionKey) {
      const timer = setTimeout(() => {
        speak(t(instructionKey));
        updateGuidePos(targetId);
      }, 600);

      const repeatInterval = setInterval(() => {
        if (!isSpeaking && !isMuted) {
          speak(t(instructionKey));
        }
      }, 12000);

      return () => {
        clearTimeout(timer);
        clearInterval(repeatInterval);
      };
    }
  }, [flow, step, t, speak, isSpeaking, isTransactionComplete, isMuted, updateGuidePos]);

  // Handle successful payment redirection
  useEffect(() => {
    if (flow === 'success') {
      const timer = setTimeout(() => {
        resetSimulator();
        setFlow('home');
        setIsTransactionComplete(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [flow]);

  // Cleanup speech
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const handlePinInput = (index, value) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const resetSimulator = () => {
    setFlow('home');
    setStep(1);
    setAmount('');
    setPin(['', '', '', '']);
    setShowBalance(false);
    setSelectedContact(null);
    setIsTransactionComplete(false);
    setManualNumber('');
  };

  const handleManualNumberSubmit = () => {
    if (manualNumber.length >= 10) {
      setSelectedContact({ name: manualNumber, initial: '#', color: '#6739b7' });
      setStep(2);
    }
  };

  // UI Components
  const FloatingGuide = () => {
    if (!guidePos.show || isMuted) return null;

    let instructionKey = '';
    if (flow === 'home' && step === 1) instructionKey = isTransactionComplete ? 'upiStepSuccessDone' : 'upiStep1';
    else if (flow === 'qr' && step === 1) instructionKey = 'upiStepScan';
    else if (flow === 'mobile' && step === 1) instructionKey = 'upiStepMobile';
    else if ((flow === 'mobile' || flow === 'qr') && step === 2) instructionKey = 'upiStepAmount';
    else if ((flow === 'mobile' || flow === 'qr' || flow === 'balance') && step === 3) instructionKey = 'upiStepPin';
    else if (flow === 'balance' && step === 1) instructionKey = 'upiStepBalance';
    else if (flow === 'success') instructionKey = 'upiStepSuccess';

    return (
      <div className="floating-guide-container" style={{ top: guidePos.top, left: guidePos.left }}>
        <div className="floating-guide-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
             <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--phonepe-purple)' }}>GUIDE</p>
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSpeaking ? 'var(--phonepe-purple)' : '#ccc', animation: isSpeaking ? 'pulse 1s infinite' : 'none' }}></div>
          </div>
          <p className={`instruction-text ${language !== 'en' ? 'hi-text' : ''}`} style={{ fontSize: '0.9rem', color: '#1a1a1a', margin: 0, lineHeight: '1.3' }}>
            {t(instructionKey)}
          </p>
          <div className={`guide-arrow guide-arrow-${guidePos.side === 'right' ? 'left' : 'right'}`}></div>
        </div>
      </div>
    );
  };

  const PhoneHeader = ({ title, showBack = false }) => (
    <div style={{ 
      background: 'var(--phonepe-purple)', 
      padding: '1.2rem 1rem', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {showBack ? (
        <ArrowLeft size={24} cursor="pointer" onClick={() => {
            if (step > 1) setStep(step - 1);
            else resetSimulator();
        }} />
      ) : (
        <div style={{ width: '32px', height: '32px', background: 'var(--phonepe-gold)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <User size={20} color="var(--phonepe-purple)" />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{title || 'Safety Town, IN'}</p>
        {!showBack && <p style={{ fontSize: '0.65rem', opacity: 0.8 }}>Current Location <LucideIcons.ChevronDown size={10} style={{ display: 'inline' }} /></p>}
      </div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Scan size={20} cursor="pointer" onClick={() => { setFlow('qr'); setStep(1); }} />
        <Bell size={20} />
        <HelpCircle size={20} />
      </div>
    </div>
  );

  const BottomNav = () => (
    <div style={{ 
      position: 'absolute', 
      bottom: 0, 
      width: '100%', 
      height: '60px', 
      background: 'white', 
      borderTop: '1px solid #eee', 
      display: 'flex', 
      justifyContent: 'space-around', 
      alignItems: 'center',
      zIndex: 20
    }}>
      <div onClick={resetSimulator} style={{ textAlign: 'center', color: flow === 'home' ? 'var(--phonepe-purple)' : '#888' }}>
        <Home size={20} />
        <p style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>{t('upiHome')}</p>
      </div>
      <div style={{ textAlign: 'center', color: '#888' }}>
        <History size={20} />
        <p style={{ fontSize: '0.6rem' }}>{t('upiHistory')}</p>
      </div>
      <div style={{ textAlign: 'center', color: '#888' }}>
        <QrCode size={20} />
        <p style={{ fontSize: '0.6rem' }}>{t('upiInsurance')}</p>
      </div>
      <div style={{ textAlign: 'center', color: '#888' }}>
        <Building2 size={20} />
        <p style={{ fontSize: '0.6rem' }}>{t('upiWealth')}</p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (flow === 'success') {
      return (
        <div id="success-screen" style={{ height: '100%', background: '#00b894', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '1.5rem', 
            animation: 'successTick 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
          }}>
             <LucideIcons.Check size={80} color="white" strokeWidth={4} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>{t('upiMoneySent')}</h2>
          <p style={{ fontSize: '1rem', opacity: 0.9 }}>{t('upiStepSuccess').split('!')[0]} to {selectedContact?.name}</p>
          <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '12px', width: '100%' }}>
              <p style={{ fontSize: '0.8rem' }}>{t('upiAmountLabel')}: ₹{amount}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Transaction ID: VR{Math.floor(Math.random() * 10000000000)}</p>
          </div>
        </div>
      );
    }

    if (flow === 'home') {
      return (
        <div style={{ background: '#f5f7fa', height: '100%', overflowY: 'auto', paddingBottom: '70px' }}>
          <PhoneHeader />
          <div style={{ padding: '0.8rem' }}>
            {/* Banner */}
            <div style={{ background: 'linear-gradient(90deg, var(--phonepe-purple), #8e44ad)', borderRadius: '12px', padding: '1rem', color: 'white', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(95, 37, 159, 0.2)' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Safety Shield Active</p>
                <p style={{ fontSize: '0.65rem', opacity: 0.9 }}>You are in a 100% safe sandbox.</p>
            </div>

            {/* Transfer Money Section */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '1.2rem', color: '#333' }}>{t('upiTransferMoney')}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', textAlign: 'center' }}>
                <div 
                  id="btn-to-mobile"
                  className={(!isTransactionComplete) ? "pulsing-target" : ""}
                  onClick={() => { setFlow('mobile'); setStep(1); }} 
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ background: 'var(--phonepe-purple)', color: 'white', width: '45px', height: '45px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}>
                    <Smartphone size={22} />
                  </div>
                  <p style={{ fontSize: '0.6rem', color: '#444', fontWeight: '500' }}>{t('upiToMobile')}</p>
                </div>
                <div>
                  <div style={{ background: 'var(--phonepe-purple)', color: 'white', width: '45px', height: '45px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={22} />
                  </div>
                  <p style={{ fontSize: '0.6rem', color: '#444' }}>{t('upiToBank')}</p>
                </div>
                <div>
                  <div style={{ background: 'var(--phonepe-purple)', color: 'white', width: '45px', height: '45px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={22} />
                  </div>
                  <p style={{ fontSize: '0.6rem', color: '#444' }}>{t('upiToSelf')}</p>
                </div>
                <div 
                  id="btn-balance"
                  className={(isTransactionComplete) ? "pulsing-target" : ""}
                  onClick={() => { setFlow('balance'); setStep(1); }} 
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ background: 'var(--phonepe-purple)', color: 'white', width: '45px', height: '45px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <History size={22} />
                  </div>
                  <p style={{ fontSize: '0.6rem', color: '#444', fontWeight: '500' }}>{t('upiCheckBalance')}</p>
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
               <div style={{ background: '#f0f0ff', color: 'var(--phonepe-purple)', padding: '10px', borderRadius: '10px' }}><CreditCard size={20} /></div>
               <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t('upiWallet')}</p>
                  <p style={{ fontSize: '0.65rem', color: '#888' }}>₹0.00</p>
               </div>
               <button style={{ background: 'transparent', border: '1px solid #ddd', color: 'var(--phonepe-purple)', fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '15px' }}>{t('upiTopup')}</button>
            </div>
            
            <BottomNav />
          </div>
        </div>
      );
    }

    if (flow === 'qr') {
      return (
        <div style={{ height: '100%', background: '#000' }}>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', color: 'white' }}>
            <X size={24} cursor="pointer" onClick={resetSimulator} />
            <p style={{ fontWeight: 'bold' }}>Scan QR Code</p>
            <Camera size={24} />
          </div>
          
          <div style={{ flex: 1, position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div id="qr-detect-zone" className="pulsing-target" style={{ 
                width: '240px', 
                height: '240px', 
                border: '2px solid white', 
                borderRadius: '12px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'var(--phonepe-gold)', animation: 'scanLine 3s linear infinite' }}></div>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                   <QrCode size={80} />
                   <p style={{ fontSize: '0.7rem', marginTop: '10px' }}>Scanning for merchant QR...</p>
                </div>
              </div>

              <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center' }}>
                 <button 
                  onClick={() => { setSelectedContact({ name: 'Local Grocery Store', id: 'upi@localstore', initial: 'L', color: '#5f259f' }); setStep(2); }}
                  style={{ background: 'white', border: 'none', borderRadius: '30px', padding: '10px 24px', fontWeight: 'bold', fontSize: '0.85rem' }}
                 >
                   (Simulate QR Detected)
                 </button>
              </div>
          </div>
        </div>
      );
    }

    if (flow === 'mobile') {
      if (step === 1) {
        return (
          <div style={{ height: '100%', background: '#fff' }}>
            <PhoneHeader title="Send Money" showBack />
            <div style={{ padding: '1rem' }}>
               <div id="input-mobile" className="pulsing-target" style={{ background: '#f5f5f5', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', border: '1px solid #eee' }}>
                  <Search size={18} color="#888" />
                  <input 
                    placeholder={t('enterPhone')} 
                    value={manualNumber}
                    onChange={(e) => setManualNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, fontSize: '0.9rem' }} 
                  />
                  {manualNumber.length >= 10 && (
                    <button onClick={handleManualNumberSubmit} style={{ background: 'var(--phonepe-purple)', color: 'white', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold' }}>{t('upiVerify')}</button>
                  )}
               </div>
               
               <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#888', marginBottom: '1rem', letterSpacing: '0.5px' }}>{t('upiRecents')}</p>
               
               {[
                 { name: 'Rahul Kumar', initial: 'R', color: '#ff6b6b' },
                 { name: 'Amit Sharma', initial: 'A', color: '#4ecdc4' }
               ].map(contact => (
                 <div key={contact.name} onClick={() => { setSelectedContact(contact); setStep(2); }} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: contact.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {contact.initial}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.95rem', fontWeight: '700' }}>{contact.name}</p>
                      <p style={{ fontSize: '0.7rem', color: '#888' }}>+91 98765 43210</p>
                    </div>
                    <ChevronRight size={18} color="#ccc" />
                 </div>
               ))}
            </div>
          </div>
        );
      }
    }

    if ((flow === 'mobile' || flow === 'qr') && step === 2) {
      return (
        <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <PhoneHeader title={selectedContact?.name} showBack />
          <div style={{ flex: 1, padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: selectedContact?.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              {selectedContact?.initial}
            </div>
            <p style={{ fontSize: '1.2rem', fontWeight: '800', color: '#333' }}>{selectedContact?.name}</p>
            <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2rem' }}>UPI ID: {selectedContact?.id || '9876543210@ybl'}</p>
            
            <div id="input-amount" className="pulsing-target" style={{ maxWidth: '200px', margin: '0 auto', borderBottom: '3px solid var(--phonepe-purple)', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--phonepe-purple)' }}>₹</span>
                <input 
                  type="number" 
                  autoFocus
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', color: '#333' }}
                />
              </div>
            </div>
          </div>
          <button 
            disabled={!amount || amount <= 0}
            onClick={() => setStep(3)}
            style={{ 
              background: 'var(--phonepe-purple)', 
              color: 'white', 
              border: 'none', 
              padding: '1.2rem', 
              fontSize: '1.1rem', 
              fontWeight: '800', 
              opacity: amount ? 1 : 0.6,
              cursor: amount ? 'pointer' : 'not-allowed',
              letterSpacing: '1px'
            }}
          >
            {t('upiProceedPay')}
          </button>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
            <X size={24} cursor="pointer" onClick={resetSimulator} />
            <p style={{ fontWeight: '800', fontSize: '0.85rem', color: '#555' }}>{t('upiPinTitle')}</p>
            <div style={{ width: '24px' }}></div>
          </div>
          
          <div style={{ padding: '2rem 1.5rem', textAlign: 'center', flex: 1 }}>
            <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'Bold' }}>{flow === 'balance' ? 'CHECKING BALANCE' : `PAYING ${selectedContact?.name}`}</p>
            <p style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0.5rem 0 2.5rem', color: '#1a1a1a' }}>₹{flow === 'balance' ? 'XXXX' : amount}</p>
            
            <div id="pin-row" className="pulsing-target" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '3rem' }}>
              {pin.map((p, i) => (
                <input 
                  key={i}
                  id={`pin-${i}`}
                  type="password"
                  maxLength={1}
                  value={p}
                  onChange={(e) => handlePinInput(i, e.target.value)}
                  style={{ width: '45px', height: '45px', textAlign: 'center', border: '2px solid var(--phonepe-purple)', borderRadius: '10px', fontSize: '1.5rem', outline: 'none', background: '#fcfaff' }}
                />
              ))}
            </div>

            <div style={{ background: '#fff9f0', border: '1px solid #ffe8cc', padding: '1rem', borderRadius: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e67e22', marginBottom: '10px' }}>
                <ShieldAlert size={20} />
                <span style={{ fontWeight: '800', fontSize: '0.8rem' }}>SAFETY ADVISORY</span>
              </div>
              <p className={language !== 'en' ? 'hi-text' : ''} style={{ fontSize: '0.75rem', color: '#555', lineHeight: '1.5', fontWeight: '500' }}>
                {t('upiStepPin').includes('.') ? t('upiStepPin').split('.')[1] : t('upiStepPin')}
              </p>
              <p style={{ fontSize: '0.65rem', color: '#f39c12', fontWeight: 'bold', marginTop: '10px' }}>
                 {t('upiSafeInfo')}
              </p>
            </div>
          </div>
          
          <button 
            disabled={pin.some(p => p === '')}
            onClick={() => {
              if (flow === 'balance') { setStep(4); setShowBalance(true); }
              else setFlow('success');
            }}
            style={{ background: '#1a1a1a', color: 'white', padding: '1.2rem', border: 'none', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', opacity: pin.every(p => p !== '') ? 1 : 0.6 }}
          >
            {t('upiSubmit')}
          </button>
        </div>
      );
    }

    if (flow === 'balance') {
        if (step === 1) {
            return (
                <div style={{ height: '100%', background: '#fff' }}>
                    <PhoneHeader title={t('upiCheckBalance')} showBack />
                    <div style={{ padding: '1rem' }}>
                        <div id="bank-card" className="pulsing-target" style={{ background: 'white', borderRadius: '16px', padding: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', border: '1px solid #f0f0ff' }} onClick={() => setStep(3)}>
                            <div style={{ background: '#f0f0ff', width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--phonepe-purple)' }}>
                                <Building2 size={26} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '800', fontSize: '1rem', color: '#333' }}>{t('bankBuilding')}</p>
                                <p style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600' }}>Savings Account •• 4589</p>
                            </div>
                            <ChevronRight size={20} color="#bbb" />
                        </div>
                        
                        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed #ddd', borderRadius: '12px', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.7rem', color: '#777' }}>{t('upiSafeInfo')}</p>
                        </div>
                    </div>
                </div>
            );
        }
        if (step === 4) {
            return (
                <div style={{ height: '100%', background: '#fff' }}>
                    <PhoneHeader title={t('bankBuilding')} showBack />
                    <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ background: '#f5f7fa', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Building2 size={40} color="var(--phonepe-purple)" />
                        </div>
                        <h3 style={{ fontSize: '1rem', color: '#666', fontWeight: '700', marginBottom: '0.5rem' }}>{t('upiAvailableBalance')}</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--phonepe-purple)', letterSpacing: '-1px' }}>₹5,240.00</p>
                        
                        <div style={{ marginTop: '3rem', padding: '1.2rem', background: '#fcfaff', borderRadius: '16px', border: '1px solid #e0e0f0', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#888', fontSize: '0.8rem' }}>{t('upiBankNameLabel')}</span>
                                <span style={{ fontWeight: '700', fontSize: '0.8rem' }}>{t('bankBuilding')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888', fontSize: '0.8rem' }}>{t('upiCheckedAt')}</span>
                                <span style={{ fontWeight: '700', fontSize: '0.8rem' }}>{new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>

                        <button 
                          className="btn" 
                          style={{ marginTop: '3rem', width: '100%', padding: '1rem', borderRadius: '30px', fontSize: '1rem', background: 'var(--phonepe-purple)', color: 'white', fontWeight: '800' }} 
                          onClick={resetSimulator}
                        >
                          {t('upiFinish')}
                        </button>
                    </div>
                </div>
            );
        }
    }

    return null;
  };

  return (
    <div className="module-page" style={{ 
      height: '100vh', 
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', 
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Top Header */}
      <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => navigate('/banking')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={e=>e.target.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.target.style.background='rgba(255,255,255,0.1)'}>
          <ArrowLeft size={18} /> {t('back')}
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            {t('moduleUPI')}
          </h1>
          <p style={{ color: 'var(--phonepe-gold)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', marginTop: '4px' }}>IMMERSIVE SANDBOX</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '20px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color="var(--phonepe-gold)" /> SAFE MODE
        </div>
      </div>

      <div className="main-content" style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        display: 'flex', 
        gap: '4rem', 
        justifyContent: 'center', 
        alignItems: 'center',
        flex: 1,
        position: 'relative'
      }}>
        {/* Phone Mockup */}
        <div ref={phoneRef} style={{ 
          width: '320px', 
          height: '660px', 
          background: '#1a1a1a', 
          borderRadius: '50px', 
          padding: '12px', 
          boxShadow: '0 50px 100px rgba(0,0,0,0.5), 0 0 0 4px #333',
          position: 'relative',
          overflow: 'visible',
          flexShrink: 0
        }}>
          {/* Notch */}
          <div style={{ width: '100px', height: '30px', background: '#1a1a1a', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px', zIndex: 100 }}></div>
          
          <div style={{ background: '#fff', width: '100%', height: '100%', borderRadius: '40px', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
            {renderContent()}
            
            {/* Visual Guide Overlay (Inside Phone) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                {/* Additional indicators if needed */}
            </div>
          </div>

          {/* Floating Guide (Relative to Phone) */}
          <FloatingGuide />
        </div>

        {/* Sidebar Info Panel */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--phonepe-gold)', marginBottom: '12px' }}>
                <Shield size={22} />
                <span style={{ fontWeight: '900', fontSize: '1rem', letterSpacing: '0.5px' }}>SAFE SIMULATION</span>
              </div>
              <p className={language !== 'en' ? 'hi-text' : ''} style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: '1.6', fontWeight: '500' }}>
                {t('upiSafeInfo')} {t('townDisclaimer') || "Do not use your actual banking PIN or passwords here."}
              </p>
           </div>

           <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '900', opacity: 0.6 }}>AUDIO CONTROLS</p>
                <div style={{ padding: '4px 8px', borderRadius: '10px', background: isSpeaking ? 'rgba(95, 37, 159, 0.4)' : 'transparent', border: '1px solid rgba(95, 37, 159, 0.5)' }}>
                  <p style={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--phonepe-light-purple)' }}>{isSpeaking ? 'SPEAKING...' : 'IDLE'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  style={{ flex: 1, background: isMuted ? '#666' : 'var(--phonepe-purple)', border: 'none', color: 'white', borderRadius: '15px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {isMuted ? <LucideIcons.VolumeX size={18} /> : <LucideIcons.Volume2 size={18} />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                <button 
                  onClick={() => speak(t(Object.keys(translations.en).find(k=>k.startsWith('upiStep') && t(k).includes(t(flow==='home'?'upiStep1':flow))) || 'upiStep1'))} 
                  style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '15px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Replay
                </button>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes successTick {
          0% { transform: scale(0); }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(1); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default UpiSimulator;
