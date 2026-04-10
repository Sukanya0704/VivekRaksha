import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import * as LucideIcons from 'lucide-react';
import { markLevelComplete } from '../../utils/levelProgress';

const { 
  ArrowLeft, CheckCircle, Smartphone, Building2, User, History, Search
} = LucideIcons;

const TRANSLATIONS = {
  en: {
    upi_dash_mobile: 'Click "To Mobile" to start.',
    upi_mobile_select: 'Type a 10-digit number in the search box OR click a Recent Contact.',
    upi_mobile_amount: 'Enter the amount you wish to send, then click Pay.',
    upi_mobile_pin: 'Enter your 4-digit PIN to authorize.',
    upi_mobile_success: 'Review your success screen, then click Done.',
    upi_dash_balance: 'Click "Check Balance".',
    upi_balance_pin: 'Enter your 4-digit PIN to authorize.',
    upi_balance_success: 'Review your available balance, then click Done.',
    complete: 'Tutorial Complete!'
  },
  hi: {
    upi_dash_mobile: '"To Mobile" पर क्लिक करें।',
    upi_mobile_select: 'सर्च बॉक्स में 10-अंकों का नंबर टाइप करें या कोई कॉन्टैक्ट चुनें।',
    upi_mobile_amount: 'जितनी राशि भेजनी है, उसे दर्ज करें और Pay पर क्लिक करें।',
    upi_mobile_pin: 'अपना 4-अंकों का पिन दर्ज करें।',
    upi_mobile_success: 'सक्सेस स्क्रीन की जाँच करें, और Done पर क्लिक करें।',
    upi_dash_balance: '"Check Balance" पर क्लिक करें।',
    upi_balance_pin: 'अपना पिन दर्ज करें।',
    upi_balance_success: 'अपना बैलेंस जांचें और Done पर क्लिक करें।',
    complete: 'ट्यूटोरियल पूरा हुआ!'
  },
  mr: {
    upi_dash_mobile: '"To Mobile" वर क्लिक करा.',
    upi_mobile_select: 'शोध बॉक्समध्ये 10-अंकी मोबाइल नंबर टाइप करा किंवा संपर्क निवडा.',
    upi_mobile_amount: 'रक्कम टाइप करून Pay वर क्लिक करा.',
    upi_mobile_pin: 'तुमचा 4-अंकी UPI पिन टाका.',
    upi_mobile_success: 'सक्सेस स्क्रीन तपासा आणि Done वर क्लिक करा.',
    upi_dash_balance: '"Check Balance" वर क्लिक करा.',
    upi_balance_pin: 'तुमचा पिन टाका.',
    upi_balance_success: 'बॅलन्स तपासा आणि Done वर क्लिक करा.',
    complete: 'ट्युटोरियल पूर्ण झाले!'
  }
};

const KNOWLEDGE_BASE = {
  upi_dash_mobile: "UPI uses virtual IDs so you don't have to share your sensitive bank account number.",
  upi_mobile_select: "Scammers often use numbers that look familiar. Always verify the name that pops up before paying!",
  upi_mobile_amount: "Count the zeros! ₹299 vs ₹2990 is a big difference, and UPI transfers are instant and hard to reverse.",
  upi_mobile_pin: "🚨 CRITICAL: NEVER enter your PIN to receive money. You only use a PIN to SEND money or check your balance.",
  upi_mobile_success: "Always take a screenshot of the success screen or note the Reference ID for your records.",
  upi_dash_balance: "Checking your balance connects directly to your secure bank servers, which is why it requires a PIN.",
  upi_balance_pin: "🚨 CRITICAL: NEVER share your UPI PIN. It is your final secret key.",
  upi_balance_success: "Checking your balance directly within the banking module is the only safe way to verify.",
  complete: "You are now equipped with safe habits for UPI payments!"
};

const STEPS_SEQ = [
  'upi_dash_mobile',
  'upi_mobile_select',
  'upi_mobile_amount',
  'upi_mobile_pin',
  'upi_mobile_success',
  'upi_dash_balance',
  'upi_balance_pin',
  'upi_balance_success',
  'complete'
];

const OutsideTooltip = ({ stepId, text }) => {
    const [pos, setPos] = useState(null);

    useEffect(() => {
        const updatePos = () => {
            const phoneEl = document.getElementById('smartphone-frame');
            const targetEl = document.getElementById(`target-${stepId}`);
            
            if (!phoneEl || !targetEl) {
                setPos(null);
                return;
            }

            const phoneRect = phoneEl.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();

            // Set to Left of Phone Frame strictly
            const gap = 30;
            const tooltipWidth = 260;
            const left = phoneRect.left - tooltipWidth - gap;
            let top = targetRect.top + (targetRect.height / 2);

            // Avoid tooltip clipping top/bottom screen edges
            if (top < 100) top = 100;
            if (top > window.innerHeight - 100) top = window.innerHeight - 100;

            setPos({ top, left });
        };

        updatePos();
        window.addEventListener('resize', updatePos);
        window.addEventListener('scroll', updatePos, true);
        
        let interval = setInterval(updatePos, 300);

        return () => {
            window.removeEventListener('resize', updatePos);
            window.removeEventListener('scroll', updatePos, true);
            clearInterval(interval);
        };
    }, [stepId]);

    if (!pos || !text || stepId === 'complete') return null;

    return (
        <div style={{
            position: 'fixed',
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            transform: 'translateY(-50%)',
            zIndex: 9999,
            animation: 'bounceTooltipX 1.5s infinite',
            backgroundColor: '#15803d',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            width: '260px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
            border: '2px solid #bbf7d0',
            pointerEvents: 'none'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#bbf7d0' }}>
               <span>🎓</span> Instructor Guide
            </div>
            <div style={{ fontSize: '15px', lineHeight: '1.4', textAlign: 'left', fontWeight: '600' }}>{text}</div>
            
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '-14px',
                transform: 'translateY(-50%)',
                borderWidth: '14px 0 14px 14px',
                borderStyle: 'solid',
                borderColor: 'transparent transparent transparent #15803d'
            }}></div>
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '-17px',
                transform: 'translateY(-50%)',
                borderWidth: '16px 0 16px 16px',
                borderStyle: 'solid',
                borderColor: 'transparent transparent transparent #bbf7d0',
                zIndex: -1
            }}></div>
        </div>
    );
};

const UpiSimulator = ({ language: languageProp }) => {
  const { language: contextLang } = useLanguage();
  const language = languageProp || contextLang || 'en';
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const currentStepId = STEPS_SEQ[stepIndex];
  const isSimulationComplete = currentStepId === 'complete';

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mobileNum, setMobileNum] = useState('');
  const [savedContact, setSavedContact] = useState('');
  const [amount, setAmount] = useState('');
  const [mockPin, setMockPin] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [transactionId] = useState(() => `T${Math.floor(Math.random() * 1000000000000)}`);

  const speechIntervalRef = useRef(null);

  useEffect(() => {
    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    window.speechSynthesis.cancel();
    if (!currentStepId || isSimulationComplete) return;

    const textToSpeak = TRANSLATIONS[language]?.[currentStepId] || TRANSLATIONS['en'][currentStepId];
    
    const runSpeak = () => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const langMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };
      utterance.lang = langMap[language] || 'en-IN';
      window.speechSynthesis.speak(utterance);
    };

    if (textToSpeak) {
      runSpeak();
      speechIntervalRef.current = setInterval(runSpeak, 8000);
    }
    return () => {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      window.speechSynthesis.cancel();
    };
  }, [currentStepId, language, isSimulationComplete]);

  const handleNext = () => {
    setStepIndex(s => Math.min(s + 1, STEPS_SEQ.length - 1));
  };

  const tryAgain = () => {
    setStepIndex(0);
    setActiveTab('Dashboard');
    setMobileNum('');
    setSavedContact('');
    setAmount('');
    setMockPin([]);
    setShowNotification(false);
  };

  const dashSelectMobile = () => {
    if (currentStepId === 'upi_dash_mobile' || isSimulationComplete) {
       setActiveTab('MobileSelect');
       handleNext();
    }
  };

  const dashCheckBalance = () => {
    if (currentStepId === 'upi_dash_balance' || isSimulationComplete) {
       setActiveTab('BalancePIN');
       handleNext();
    }
  };

  const handleSavedContact = (val) => {
    setSavedContact(val);
    if (currentStepId === 'upi_mobile_select' && val !== '' || isSimulationComplete) {
       setActiveTab('MobileAmount');
       handleNext();
    }
  };

  const handleMobileSubmit = (val) => {
    setMobileNum(val);
    if (currentStepId === 'upi_mobile_select' && val.length === 10 || isSimulationComplete) {
       setActiveTab('MobileAmount');
       handleNext();
    }
  };

  const clickPay = () => {
    if (currentStepId === 'upi_mobile_amount' || isSimulationComplete) {
        setActiveTab('MobilePIN');
        handleNext();
    }
  };

  const submitPin = () => {
    if (currentStepId === 'upi_mobile_pin' || isSimulationComplete) {
       setActiveTab('MobileSuccess');
       setShowNotification(true);
       handleNext();
    } else if (currentStepId === 'upi_balance_pin' || isSimulationComplete) {
       setActiveTab('BalanceSuccess');
       setShowNotification(false);
       handleNext();
    }
  };

  const clickDone = () => {
    setShowNotification(false);
    setMockPin([]);
    if (currentStepId === 'upi_mobile_success' || (isSimulationComplete && activeTab === 'MobileSuccess')) {
       setActiveTab('Dashboard');
       setMobileNum(''); setSavedContact(''); setAmount('');
       if (!isSimulationComplete) handleNext();
    } else if (currentStepId === 'upi_balance_success' || (isSimulationComplete && activeTab === 'BalanceSuccess')) {
       setActiveTab('CompleteModal'); 
       if (!isSimulationComplete) handleNext();
    }
  };

  const instructionText = TRANSLATIONS[language]?.[currentStepId] || TRANSLATIONS['en'][currentStepId] || "";

  return (
    <div className="bg-gray-900" style={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <style>
        {`
            @keyframes bounceTooltipX { 0%, 100% { transform: translate(0, -50%); } 50% { transform: translate(6px, -50%); } }
            @keyframes fadeContent { 0% { opacity: 0; transform: scale(0.98); } 100% { opacity: 1; transform: scale(1); } }
            @keyframes slideDownNav { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
        `}
        </style>

        {/* Universal Disclaimer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#e2e8f0', color: '#0f172a', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', zIndex: 100, borderBottom: '1px solid #cbd5e1' }}>
            <span>⚠️</span> Disclaimer: All UPI payment apps look different. This is just a basic demonstration. Never enter your real PIN here.
        </div>

        {/* Outward Walkthrough Tooltip */}
        <OutsideTooltip stepId={currentStepId} text={instructionText} />

        {/* Centered Smartphone Mockup */}
        <div id="smartphone-frame" style={{ width: '100%', maxWidth: '380px', height: '90vh', maxHeight: '760px', background: 'white', borderRadius: '48px', padding: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 8px #1a1a1a', position: 'relative', overflow: 'hidden', marginTop: '40px' }}>
            
            <div style={{ width: '120px', height: '24px', background: '#1a1a1a', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 200 }}></div>

            <div style={{ background: '#f8fafc', width: '100%', height: '100%', borderRadius: '36px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                
                {/* Simulated SMS Dropdown Notification */}
                {showNotification && activeTab === 'MobileSuccess' && (
                    <div style={{ position: 'absolute', top: '32px', left: '16px', right: '16px', background: 'rgba(255,255,255,0.98)', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '12px', zIndex: 99, animation: 'slideDownNav 0.4s ease-out', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                            <span>💬</span> Messages • Just Now
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0f172a', marginBottom: '2px' }}>Your Bank</div>
                        <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.3' }}>Rs.{amount} debited from A/c XX1234. Ref {transactionId}.</div>
                    </div>
                )}

                {/* Dashboard Mode */}
                {activeTab === 'Dashboard' && (
                    <div style={{ animation: 'fadeContent 0.2s', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ background: 'var(--phonepe-purple, #5f259f)', padding: '40px 16px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'normal', opacity: 0.9 }}>Add Address</h3>
                                    <h2 style={{ margin: '4px 0 0 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>Safety Town, IN</h2>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
                            <div style={{ padding: '16px', background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <h4 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '15px' }}>Transfer Money</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                                    
                                    <div id="target-upi_dash_mobile" onClick={dashSelectMobile} style={{ cursor: (currentStepId === 'upi_dash_mobile' || isSimulationComplete) ? 'pointer' : 'default', border: currentStepId === 'upi_dash_mobile' ? '2px solid #15803d' : '2px solid transparent', borderRadius: '18px', padding: '4px' }}>
                                        <div style={{ background: '#5f259f', color: 'white', width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Smartphone size={28} />
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#444', fontWeight: 'bold', margin: 0 }}>To Mobile</p>
                                    </div>

                                    <div style={{ padding: '6px' }}>
                                        <div style={{ background: '#5f259f', color: 'white', width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}><User size={28} /></div>
                                        <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>To Self</p>
                                    </div>
                                    
                                    <div style={{ padding: '6px' }}>
                                        <div style={{ background: '#5f259f', color: 'white', width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}><Building2 size={28} /></div>
                                        <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>To Bank</p>
                                    </div>

                                    <div id="target-upi_dash_balance" onClick={dashCheckBalance} style={{ cursor: (currentStepId === 'upi_dash_balance' || isSimulationComplete) ? 'pointer' : 'default', border: currentStepId === 'upi_dash_balance' ? '2px solid #15803d' : '2px solid transparent', borderRadius: '18px', padding: '4px' }}>
                                        <div style={{ background: '#5f259f', color: 'white', width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <History size={28} />
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#444', fontWeight: 'bold', margin: 0 }}>Check Balance</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Visual App Filling - Recharge & Utilities */}
                            <div style={{ padding: '16px', background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <h4 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '15px' }}>Recharge & Pay Bills</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                                    <div style={{ opacity: 0.5 }}>
                                        <div style={{ background: '#f1f5f9', color: '#5f259f', width: '48px', height: '48px', borderRadius: '12px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Smartphone size={24} />
                                        </div>
                                        <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>Mobile</p>
                                    </div>
                                    <div style={{ opacity: 0.5 }}>
                                        <div style={{ background: '#f1f5f9', color: '#5f259f', width: '48px', height: '48px', borderRadius: '12px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <LucideIcons.Tv size={24} />
                                        </div>
                                        <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>DTH</p>
                                    </div>
                                    <div style={{ opacity: 0.5 }}>
                                        <div style={{ background: '#f1f5f9', color: '#5f259f', width: '48px', height: '48px', borderRadius: '12px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <LucideIcons.Lightbulb size={24} />
                                        </div>
                                        <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>Electricity</p>
                                    </div>
                                    <div style={{ opacity: 0.5 }}>
                                        <div style={{ background: '#f1f5f9', color: '#5f259f', width: '48px', height: '48px', borderRadius: '12px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <LucideIcons.CreditCard size={24} />
                                        </div>
                                        <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>Credit Card</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '100%', height: '80px', borderRadius: '16px', background: 'linear-gradient(90deg, #fce7f3, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#831843', fontWeight: 'bold' }}>
                                <LucideIcons.Gift size={24} style={{ marginRight: '12px' }} /> Win Scratch Cards Weekly!
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Selection Flow Mode */}
                {activeTab === 'MobileSelect' && (
                    <div style={{ flex: 1, background: '#f8fafc', display: 'flex', flexDirection: 'column', animation: 'fadeContent 0.2s' }}>
                        <div style={{ background: '#5f259f', color: 'white', padding: '40px 16px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <ArrowLeft size={24} onClick={() => setActiveTab('Dashboard')} style={{ cursor: 'pointer' }} />
                            <h2 style={{ margin: 0, fontSize: '18px' }}>Send Money</h2>
                        </div>
                        <div style={{ padding: '16px', flex: 1 }}>
                            <div id="target-upi_mobile_select" style={{ border: currentStepId === 'upi_mobile_select' ? '2px solid #15803d' : '2px solid transparent', borderRadius: '12px', padding: '4px', background: currentStepId === 'upi_mobile_select' ? 'rgba(21, 128, 61, 0.05)' : 'none' }}>
                                <div style={{ position: 'relative', marginBottom: '24px' }}>
                                    <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Search any mobile number..." 
                                        value={mobileNum}
                                        onChange={(e) => handleMobileSubmit(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '32px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', outline: 'none' }}
                                    />
                                </div>
                                <h4 style={{ margin: '0 0 12px 4px', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Recent Contacts</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                                    {[
                                      { name: 'House Rent', phone: '+91 87654 32109', initial: 'H', color: '#8b5cf6' },
                                      { name: 'Rakesh Plumber', phone: '+91 76543 21098', initial: 'R', color: '#10b981' },
                                      { name: 'Mom', phone: '+91 98765 43210', initial: 'M', color: '#f43f5e' }
                                    ].map((item) => (
                                        <div 
                                            key={item.name} 
                                            onClick={() => handleSavedContact(item.name)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'white', cursor: 'pointer', transition: 'background 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                        >
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: item.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>{item.initial}</div>
                                            <div>
                                                <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>{item.name}</p>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{item.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Amount Entry Mode */}
                {activeTab === 'MobileAmount' && (
                    <div style={{ flex: 1, background: '#f8fafc', display: 'flex', flexDirection: 'column', animation: 'fadeContent 0.2s' }}>
                        <div style={{ background: 'white', padding: '40px 16px 16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <ArrowLeft size={24} onClick={() => { setActiveTab('MobileSelect'); setStepIndex(1); setAmount(''); }} style={{ cursor: 'pointer', color: '#0f172a' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#5f259f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {(savedContact || mobileNum || "U")[0].toUpperCase()}
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{savedContact || mobileNum}</h2>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Banking Name: {savedContact || mobileNum}</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '40px 16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div id="target-upi_mobile_amount" style={{ width: '100%', maxWidth: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: currentStepId === 'upi_mobile_amount' ? '2px solid #15803d' : '2px solid transparent', borderRadius: '16px', padding: '16px', background: currentStepId === 'upi_mobile_amount' ? 'rgba(21, 128, 61, 0.05)' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
                                    <span style={{ fontSize: '32px', color: '#0f172a' }}>₹</span>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        style={{ width: '160px', padding: '0', border: 'none', borderBottom: '2px solid #cbd5e1', fontSize: '48px', fontWeight: 'bold', background: 'transparent', color: '#0f172a', textAlign: 'center', outline: 'none' }}
                                    />
                                </div>
                                <button 
                                    onClick={clickPay} 
                                    disabled={!amount || amount <= 0}
                                    style={{ width: '100%', padding: '16px', background: '#5f259f', color: 'white', border: 'none', borderRadius: '32px', fontWeight: 'bold', fontSize: '18px', cursor: amount ? 'pointer' : 'default', opacity: amount ? 1 : 0.6, boxShadow: '0 4px 12px rgba(95, 37, 159, 0.3)' }}
                                >
                                    Pay
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Simulated PhonePe-Style PIN Pad Screen */}
                {(activeTab === 'MobilePIN' || activeTab === 'BalancePIN') && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fafafa', paddingTop: '24px', animation: 'fadeContent 0.2s' }}>
                        <div style={{ padding: '16px', background: 'white', borderBottom: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: '#111', fontSize: '15px' }}>State Bank of India</span>
                            <Building2 size={24} color="#64748b" />
                        </div>
                        <div style={{ padding: '32px 16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{activeTab === 'MobilePIN' ? `Sending to ${savedContact || mobileNum}` : `Checking Balance`}</p>
                            {activeTab === 'MobilePIN' && <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#111', margin: '0 0 32px 0' }}>₹{amount}</p>}
                            <p style={{ margin: '0 0 24px 0', color: '#444', fontWeight: 'bold', fontSize: '13px' }}>ENTER 4-DIGIT UPI PIN</p>
                            
                            <div style={{ display: 'flex', gap: '20px', marginBottom: 'auto' }}>
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: mockPin.length > i ? '#111' : 'transparent', border: '2px solid #111' }}></div>
                                ))}
                            </div>

                            <div id={`target-${activeTab === 'MobilePIN' ? 'upi_mobile_pin' : 'upi_balance_pin'}`} style={{ width: '100%', maxWidth: '300px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: 'auto', justifyItems: 'center', border: (currentStepId === 'upi_mobile_pin' || currentStepId === 'upi_balance_pin') ? '2px solid #15803d' : '2px solid transparent', borderRadius: '16px', padding: '8px' }}>
                                {[1,2,3,4,5,6,7,8,9].map(num => (
                                    <button key={num} onClick={() => { if(mockPin.length < 4) setMockPin([...mockPin, num]) }} style={{ background: '#f1f5f9', border: 'none', width: '64px', height: '64px', fontSize: '24px', borderRadius: '50%', cursor: 'pointer', outline: 'none' }}>{num}</button>
                                ))}
                                <button onClick={() => setMockPin([])} style={{ background: 'transparent', border: 'none', width: '64px', height: '64px', fontSize: '14px', fontWeight: 'bold', color: '#ef4444', borderRadius: '50%', cursor: 'pointer', outline: 'none' }}>CLEAR</button>
                                <button onClick={() => { if(mockPin.length < 4) setMockPin([...mockPin, 0]) }} style={{ background: '#f1f5f9', border: 'none', width: '64px', height: '64px', fontSize: '24px', borderRadius: '50%', cursor: 'pointer', outline: 'none' }}>0</button>
                                <button disabled={mockPin.length !== 4} onClick={submitPin} style={{ background: mockPin.length === 4 ? '#10b981' : '#e2e8f0', color: 'white', border: 'none', width: '64px', height: '64px', borderRadius: '50%', cursor: mockPin.length===4 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none', transition: 'background 0.3s' }}>
                                    <CheckCircle size={32} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Simulated Full-Screen Distinct Success Modal Inside Phone */}
                {(activeTab === 'MobileSuccess' || activeTab === 'BalanceSuccess') && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#f0fdf4', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeContent 0.3s', padding: '24px', border: '8px solid #bbf7d0', textAlign: 'center' }}>
                        <div style={{ background: '#16a34a', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 10px 25px rgba(22, 163, 74, 0.4)' }}>
                           <CheckCircle size={56} color="white" />
                        </div>
                        {activeTab === 'MobileSuccess' ? (
                            <>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#166534', fontWeight: '900' }}>Payment Successful</h3>
                            <p style={{ margin: '0 0 8px 0', color: '#15803d', fontWeight: 'bold' }}>To {savedContact || mobileNum}</p>
                            <p style={{ margin: '0 0 32px 0', fontSize: '40px', fontWeight: '900', color: '#14532d' }}>₹{amount}</p>
                            </>
                        ) : (
                            <>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '22px', color: '#166534', fontWeight: '900' }}>Balance Retrieved</h3>
                            <p style={{ margin: '0 0 8px 0', color: '#15803d', fontWeight: 'bold' }}>Savings Account •• 4589</p>
                            <p style={{ margin: '0 0 32px 0', fontSize: '36px', fontWeight: '900', color: '#14532d' }}>₹5,240.00</p>
                            </>
                        )}
                        
                        <div style={{ marginTop: 'auto', width: '100%' }}>
                            <div id={`target-${activeTab === 'MobileSuccess' ? 'upi_mobile_success' : 'upi_balance_success'}`} style={{ border: (currentStepId === 'upi_mobile_success' || currentStepId === 'upi_balance_success') ? '2px solid #166534' : '2px solid transparent', borderRadius: '34px', padding: '4px' }}>
                                <button onClick={clickDone} style={{ width: '100%', background: '#16a34a', color: 'white', border: 'none', padding: '16px', borderRadius: '32px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}>Done</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lesson Complete Modal Overlay */}
                {isSimulationComplete && activeTab === 'CompleteModal' && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'fadeContent 0.4s' }}>
                        <div style={{ background: 'white', borderRadius: '24px', padding: '40px 24px', textAlign: 'center', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
                            <span style={{ fontSize: '56px', display: 'block', marginBottom: '16px' }}>🎉</span>
                            <h2 style={{ margin: '0 0 16px 0', color: '#111', fontSize: '24px', fontWeight: '900' }}>Lesson Complete!</h2>
                            <p style={{ margin: '0 0 32px 0', color: '#444', lineHeight: '1.5', fontSize: '15px' }}>You have successfully learned how to send money to saved contacts and check your balance safely using UPI.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <button onClick={() => markLevelComplete(2, navigate)} style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}>Return to Safety Road</button>
                                <button onClick={tryAgain} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}>Try Again</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>

        {/* Separated Did You Know Card (Persistent Center Right) */}
        {!isSimulationComplete && (
            <div style={{ position: 'fixed', top: '50%', right: '40px', transform: 'translateY(-50%)', width: '420px', zIndex: 50 }}>
                <div style={{ background: 'white', padding: '32px', borderRadius: '24px', borderLeft: '12px solid #5f259f', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#5f259f', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '28px' }}>💡</span> Did You Know?
                    </h2>
                    <div key={currentStepId} style={{ animation: 'fadeContent 0.5s', fontSize: '18px', color: '#334155', lineHeight: '1.6', fontWeight: '600' }}>
                        {KNOWLEDGE_BASE[currentStepId] || "Follow the guided instructions."}
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default UpiSimulator;
