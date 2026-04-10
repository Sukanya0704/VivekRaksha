import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, Lock as LockIcon, CreditCard, ArrowLeft, Eye, EyeOff, Info, LogOut, Minus, Square, X as CloseIcon, ChevronDown, CheckCircle, User, FileText, Smartphone } from 'lucide-react';

const TRANSLATIONS = {
  en: {
    dash_eye: 'Click here to view your balance securely.',
    dash_date_start: 'Select a start date for your account statement.',
    dash_date_end: 'Select an end date for your statement.',
    dash_download: 'Click here to download your statement.',
    nav_mobile: 'Great! Now click here to try a Mobile Recharge.',
    mob_phone: 'Type your 10-digit mobile number.',
    mob_operator: 'Select your mobile operator.',
    mob_amount: 'Enter the recharge amount (e.g. 499).',
    mob_proceed: 'Click Proceed to Pay.',
    mob_otp: 'Type the 4-digit OTP sent to your phone.',
    nav_bill: 'Recharge successful! Next, click Bill Payments.',
    bill_provider: 'Select your bill provider (e.g., Electricity).',
    bill_consumer: 'Enter your 10-digit consumer number.',
    bill_fetch: 'Click here to fetch your bill details.',
    bill_pay: 'Review the bill and click Pay Now.',
    nav_payee: 'Bill paid! Finally, let\'s Add a Payee securely.',
    payee_acc: 'Enter a 10-digit Account Number.',
    payee_confirm: 'Re-enter the 10-digit Account Number to confirm.',
    payee_ifsc: 'Enter the 11-character bank branch IFSC code.',
    payee_verify: 'Click Verify Branch to ensure it is correct.',
    payee_save: 'Everything looks good. Click Save.',
    pop_ack: 'Read this important security notice and click Acknowledge.',
    complete: 'Tutorial Complete!'
  },
  hi: {
    dash_eye: 'अपना बैलेंस सुरक्षित रूप से देखने के लिए यहाँ क्लिक करें।',
    dash_date_start: 'अपने खाते के विवरण के लिए प्रारंभ तिथि चुनें।',
    dash_date_end: 'अंतिम तिथि चुनें।',
    dash_download: 'अपना स्टेटमेंट डाउनलोड करने के लिए यहाँ क्लिक करें।',
    nav_mobile: 'बहुत बढ़िया! अब मोबाइल रिचार्ज करने के लिए यहाँ क्लिक करें।',
    mob_phone: 'अपना 10-अंकों का मोबाइल नंबर दर्ज करें।',
    mob_operator: 'अपना मोबाइल ऑपरेटर चुनें।',
    mob_amount: 'रिचार्ज राशि दर्ज करें।',
    mob_proceed: 'प्रोसीड टू पे पर क्लिक करें।',
    mob_otp: 'आपके फोन पर भेजा गया 4-अंकों का OTP दर्ज करें।',
    nav_bill: 'रिचार्ज सफल रहा! अब, बिल पेमेंट पर क्लिक करें।',
    bill_provider: 'अपना बिल प्रदाता चुनें (जैसे, बिजली)।',
    bill_consumer: 'अपना 10-अंकों का कंज्यूमर नंबर दर्ज करें।',
    bill_fetch: 'अपने बिल का विवरण प्राप्त करने के लिए यहाँ क्लिक करें।',
    bill_pay: 'बिल की समीक्षा करें और पे नाउ पर क्लिक करें।',
    nav_payee: 'बिल का भुगतान हो गया! अंत में, सुरक्षित रूप से एक लाभार्थी जोड़ें।',
    payee_acc: '10-अंकों का खाता संख्या दर्ज करें।',
    payee_confirm: 'पुष्टि करने के लिए 10-अंकों का खाता संख्या दोबारा दर्ज करें।',
    payee_ifsc: '11-वर्णों का बैंक शाखा IFSC कोड दर्ज करें।',
    payee_verify: 'शाखा सत्यापित करने के लिए यहाँ क्लिक करें।',
    payee_save: 'सेव पर क्लिक करें।',
    pop_ack: 'यह महत्वपूर्ण सुरक्षा सूचना पढ़ें और स्वीकार करें।',
    complete: 'ट्यूटोरियल पूरा हुआ!'
  },
  mr: {
    dash_eye: 'आपला बॅलन्स सुरक्षितपणे पाहण्यासाठी येथे क्लिक करा.',
    dash_date_start: 'तुमच्या अकाउंट स्टेटमेंटसाठी सुरुवातीची तारीख निवडा.',
    dash_date_end: 'शेवटची तारीख निवडा.',
    dash_download: 'तुमचे स्टेटमेंट डाउनलोड करण्यासाठी येथे क्लिक करा.',
    nav_mobile: 'उत्तम! आता मोबाईल रिचार्ज करून पाहण्यासाठी येथे क्लिक करा.',
    mob_phone: 'तुमचा 10-अंकी मोबाईल नंबर टाका.',
    mob_operator: 'तुमचा मोबाईल ऑपरेटर निवडा.',
    mob_amount: 'रिचार्जची रक्कम टाका.',
    mob_proceed: 'प्रोसीड टू पे वर क्लिक करा.',
    mob_otp: 'तुमच्या फोनवर पाठवलेला 4-अंकी OTP टाका.',
    nav_bill: 'रिचार्ज यशस्वी! आता, बिल पेमेंट्स वर क्लिक करा.',
    bill_provider: 'तुमचा बिल प्रदाता निवडा (उदा. वीज).',
    bill_consumer: 'तुमचा 10-अंकी कन्झ्युमर नंबर टाका.',
    bill_fetch: 'तुमच्या बिलाचा तपशील मिळवण्यासाठी येथे क्लिक करा.',
    bill_pay: 'बिलाचे पुनरावलोकन करा आणि पे नाऊ वर क्लिक करा.',
    nav_payee: 'बिल भरले! शेवटी, सुरक्षितपणे एक लाभार्थी जोडूया.',
    payee_acc: '10-अंकी खाते क्रमांक टाका.',
    payee_confirm: 'खात्री करण्यासाठी 10-अंकी खाते क्रमांक पुन्हा टाका.',
    payee_ifsc: '11-अक्षरी बँक शाखा IFSC कोड टाका.',
    payee_verify: 'शाखा सत्यापित करण्यासाठी येथे क्लिक करा.',
    payee_save: 'सेव्ह वर क्लिक करा.',
    pop_ack: 'ही महत्त्वाची सुरक्षा सूचना वाचा आणि स्वीकार करा.',
    complete: 'ट्युटोरियल पूर्ण झाले!'
  }
};

const STEPS_SEQ = Object.keys(TRANSLATIONS.en);

const TargetWrapper = ({ 
  id, 
  children, 
  position = 'bottom', 
  onAction, 
  currentStepId, 
  isSimulationComplete, 
  text, 
  currentIndex, 
  thisIndex 
}) => {
  const isCurrent = id === currentStepId;
  const isPast = thisIndex < currentIndex;

  const opacity = isSimulationComplete || isCurrent || isPast ? 1 : 0.4;
  const pointerEvents = isSimulationComplete ? 'auto' : (isCurrent ? 'auto' : 'none');

  const targetWrapRef = useRef(null);
  const [fixedStyle, setFixedStyle] = useState({ display: 'none' });
  const [arrowStyle, setArrowStyle] = useState({});

  useEffect(() => {
    if (!isCurrent || isSimulationComplete || !targetWrapRef.current) return;

    const calculatePosition = () => {
      const GAP = 70; // 70px absolute non-occluding gap
      const tooltipWidth = 250;
      const tooltipHeight = 100; // Expected max height
      const targetRect = targetWrapRef.current.getBoundingClientRect();

      const criticalElements = Array.from(document.querySelectorAll('input, select, button, h2, h3, h4, label, .critical-ui'));
      const criticalRects = criticalElements
        .filter(el => el !== targetWrapRef.current && !targetWrapRef.current.contains(el))
        .map(el => el.getBoundingClientRect());

      const rectIntersect = (r1, r2) => {
        return !(r2.left >= r1.right || r2.right <= r1.left || r2.top >= r1.bottom || r2.bottom <= r1.top);
      };

      const positionsPreference = ['right', 'bottom', 'left', 'top'];
      
      let bestPos = position; // Default preference
      let finalTop = -9999;
      let finalLeft = -9999;
      
      for (const attemptPos of positionsPreference) {
        let tTop, tLeft;
        
        if (attemptPos === 'top') {
            tTop = targetRect.top - tooltipHeight - GAP;
            tLeft = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        } else if (attemptPos === 'bottom') {
            tTop = targetRect.bottom + GAP;
            tLeft = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        } else if (attemptPos === 'left') {
            tTop = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
            tLeft = targetRect.left - tooltipWidth - GAP;
        } else if (attemptPos === 'right') {
            tTop = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
            tLeft = targetRect.right + GAP;
        }

        const testBox = {
            top: tTop,
            left: tLeft,
            right: tLeft + tooltipWidth,
            bottom: tTop + tooltipHeight
        };

        // Screen bounds check
        if (testBox.top < 0 || testBox.left < 0 || testBox.right > window.innerWidth || testBox.bottom > window.innerHeight) {
            continue;
        }

        // Exact occlusion collision detection
        let collide = false;
        for (const crit of criticalRects) {
            if (rectIntersect(testBox, crit)) {
                collide = true;
                break;
            }
        }

        if (!collide) {
            bestPos = attemptPos;
            finalTop = tTop;
            finalLeft = tLeft;
            break;
        }
      }

      // If exhaustive collision logic somehow fails perfectly safe bounds (e.g., highly compressed screen), force a fallback placement focusing on gap
      if (finalTop === -9999) {
          bestPos = position;
          if (bestPos === 'bottom') { finalTop = targetRect.bottom + GAP; finalLeft = targetRect.left; }
          else if (bestPos === 'top') { finalTop = targetRect.top - tooltipHeight - GAP; finalLeft = targetRect.left; }
          else if (bestPos === 'right') { finalTop = targetRect.top; finalLeft = targetRect.right + GAP; }
          else if (bestPos === 'left') { finalTop = targetRect.top; finalLeft = targetRect.left - tooltipWidth - GAP; }
      }

      setFixedStyle({
          position: 'fixed',
          top: finalTop + 'px',
          left: finalLeft + 'px',
          zIndex: 999999,
          pointerEvents: 'none'
      });

      const baseArrow = { position: 'absolute', borderWidth: '12px', borderStyle: 'solid' };
      if (bestPos === 'bottom') setArrowStyle({ ...baseArrow, top: '-24px', left: '50%', transform: 'translateX(-50%)', borderColor: 'transparent transparent #15803d transparent' });
      else if (bestPos === 'top') setArrowStyle({ ...baseArrow, bottom: '-24px', left: '50%', transform: 'translateX(-50%)', borderColor: '#15803d transparent transparent transparent' });
      else if (bestPos === 'right') setArrowStyle({ ...baseArrow, left: '-24px', top: '50%', transform: 'translateY(-50%)', borderColor: 'transparent #15803d transparent transparent' });
      else if (bestPos === 'left') setArrowStyle({ ...baseArrow, right: '-24px', top: '50%', transform: 'translateY(-50%)', borderColor: 'transparent transparent transparent #15803d' });
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isCurrent, isSimulationComplete, position]);

  return (
    <>
      <div 
         ref={targetWrapRef}
         onClick={onAction && ((!isSimulationComplete && isCurrent) || isSimulationComplete) ? onAction : undefined}
         style={{ position: 'relative', display: 'inline-block', opacity, pointerEvents, transition: 'all 0.3s', width: '100%', cursor: pointerEvents==='auto' && onAction ? 'pointer': 'default' }}>
         {children}
      </div>

      {isCurrent && !isSimulationComplete && (
         <div style={fixedStyle}>
             <div style={{ animation: 'bounceTooltip 1.5s infinite', backgroundColor: '#15803d', color: 'white', padding: '12px 16px', borderRadius: '8px', width: '250px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', color: '#bbf7d0' }}>
                   <span>🎓</span> Instructor Guide
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.4', textAlign: 'left' }}>{text}</div>
                <div style={arrowStyle} />
             </div>
         </div>
      )}
    </>
  );
};

const NavItem = ({ label, isActive, icon }) => (
  <div style={{ padding: '16px 24px', backgroundColor: isActive ? '#f0f4f8' : 'transparent', borderRight: isActive ? '4px solid #00356b' : '4px solid transparent', color: isActive ? '#00356b' : '#64748b', fontWeight: isActive ? 'bold' : 'normal', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
     {icon}
     {label}
  </div>
);

const NetBankingSimulator = ({ language: languageProp }) => {
  const { t, language: contextLang } = useLanguage();
  const language = languageProp || contextLang || 'en';
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const currentStepId = STEPS_SEQ[stepIndex];
  const isSimulationComplete = currentStepId === 'complete';

  const [dates, setDates] = useState({ start: '', end: '' });
  const [balVisible, setBalVisible] = useState(false);
  const [mobileData, setMobileData] = useState({ phone: '', operator: '', amount: '', otp: '' });
  const [billData, setBillData] = useState({ provider: '', consumer: '' });
  const [billVisible, setBillVisible] = useState(false);
  const [payeeData, setPayeeData] = useState({ acc: '', confirm: '', ifsc: '', branch: '' });
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [showSecurityPop, setShowSecurityPop] = useState(false);
  const [showDownloadShelf, setShowDownloadShelf] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const speechIntervalRef = useRef(null);

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };
    utterance.lang = langMap[language] || 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  // Trigger TTS whenever the step changes and loop it
  useEffect(() => {
    if (speechIntervalRef.current) {
      clearInterval(speechIntervalRef.current);
    }
    window.speechSynthesis.cancel();

    if (!currentStepId || isSimulationComplete) return;

    const textToSpeak = TRANSLATIONS[language]?.[currentStepId] || TRANSLATIONS['en'][currentStepId];
    if (textToSpeak) {
      speakText(textToSpeak);
      speechIntervalRef.current = setInterval(() => {
        speakText(textToSpeak);
      }, 8000);
    }

    return () => {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      window.speechSynthesis.cancel();
    };
  }, [currentStepId, language, isSimulationComplete]);

  const handleNext = () => {
    if (stepIndex < STEPS_SEQ.length - 1) {
      setStepIndex(s => s + 1);
    }
  };

  const restartTutorial = () => {
    setStepIndex(0);
    setDates({ start: '', end: '' });
    setBalVisible(false);
    setMobileData({ phone: '', operator: '', amount: '', otp: '' });
    setBillData({ provider: '', consumer: '' });
    setBillVisible(false);
    setPayeeData({ acc: '', confirm: '', ifsc: '', branch: '' });
    setShowOtpScreen(false);
    setShowSecurityPop(false);
    setShowDownloadShelf(false);
    setActiveTab('Dashboard');
  };

  const getStepProps = (id) => ({
    id,
    currentStepId,
    isSimulationComplete,
    text: TRANSLATIONS[language]?.[id] || TRANSLATIONS['en'][id],
    currentIndex: stepIndex,
    thisIndex: STEPS_SEQ.indexOf(id)
  });

  // Dashboard Actions
  const clickDashEye = () => { setBalVisible(true); handleNext(); };
  
  const handleDateStart = (e) => {
    setDates(d => ({ ...d, start: e.target.value }));
    if (currentStepId === 'dash_date_start' && e.target.value !== '') handleNext();
  };
  const handleDateEnd = (e) => {
    setDates(d => ({ ...d, end: e.target.value }));
    if (currentStepId === 'dash_date_end' && e.target.value !== '') handleNext();
  };

  const clickDownload = () => { setShowDownloadShelf(true); handleNext(); };

  // Nav Actions
  const clickNavMobile = () => { setActiveTab('Mobile Recharge'); handleNext(); };
  const clickNavBill = () => { setActiveTab('Bill Payments'); handleNext(); };
  const clickNavPayee = () => { setActiveTab('Add Payee'); handleNext(); };

  // Mobile Recharge Actions
  const handlePhone = (e) => {
    const val = e.target.value.replace(/\\D/g, '').slice(0, 10);
    setMobileData(d => ({ ...d, phone: val }));
    if (currentStepId === 'mob_phone' && val.length === 10) handleNext();
  };
  const handleOper = (e) => {
    setMobileData(d => ({ ...d, operator: e.target.value }));
    if (currentStepId === 'mob_operator' && e.target.value !== '') handleNext();
  };
  const handleAmt = (e) => {
    const val = e.target.value.replace(/\\D/g, '');
    setMobileData(d => ({ ...d, amount: val }));
    if (currentStepId === 'mob_amount' && val.length >= 2) handleNext();
  };
  const clickMobProc = () => { setShowOtpScreen(true); handleNext(); };
  const handleOtp = (e) => {
    const val = e.target.value.replace(/\\D/g, '').slice(0, 4);
    setMobileData(d => ({ ...d, otp: val }));
    if (currentStepId === 'mob_otp' && val.length === 4) {
      setTimeout(() => { setShowOtpScreen(false); handleNext(); }, 600);
    }
  };

  // Bill Actions
  const handleProv = (e) => {
    setBillData(d => ({ ...d, provider: e.target.value }));
    if (currentStepId === 'bill_provider' && e.target.value !== '') handleNext();
  };
  const handleCons = (e) => {
    const val = e.target.value.replace(/\\D/g, '').slice(0, 10);
    setBillData(d => ({ ...d, consumer: val }));
    if (currentStepId === 'bill_consumer' && val.length === 10) handleNext();
  };
  const clickBillFetch = () => { setBillVisible(true); handleNext(); };
  const clickBillPay = () => { setBillVisible(false); handleNext(); };

  // Payee Actions
  const handleAcc = (e) => {
    const val = e.target.value.replace(/\\D/g, '').slice(0, 10);
    setPayeeData(d => ({ ...d, acc: val }));
    if (currentStepId === 'payee_acc' && val.length === 10) handleNext();
  };
  const handleConf = (e) => {
    const val = e.target.value.replace(/\\D/g, '').slice(0, 10);
    setPayeeData(d => ({ ...d, confirm: val }));
    if (currentStepId === 'payee_confirm' && val.length === 10 && val === payeeData.acc) handleNext();
  };
  const handleIfsc = (e) => {
    const val = e.target.value.toUpperCase().slice(0, 11);
    setPayeeData(d => ({ ...d, ifsc: val }));
    if (currentStepId === 'payee_ifsc' && val.length === 11) handleNext();
  };
  const clickPayeeVerify = () => { setPayeeData(d => ({ ...d, branch: 'Mumbai Main Branch' })); handleNext(); };
  const clickPayeeSave = () => { setShowSecurityPop(true); handleNext(); };
  const clickPopAck = () => { setShowSecurityPop(false); handleNext(); };

  return (
    <div className="module-page" style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
      <style>
      {`
        @keyframes bounceTooltip {
           0%, 100% { margin-top: 0px; margin-left: 0px;}
           50% { margin-top: -6px; }
        }
        @keyframes scaleIn {
           0% { transform: scale(0.9); opacity: 0; }
           100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
           0% { transform: translateY(100%); opacity: 0; }
           100% { transform: translateY(0); opacity: 1; }
        }
        .demo-input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; color: #1e293b; background: white; transition: border-color 0.2s;}
        .demo-input:focus { outline: 2px solid #00356b; border-color: transparent; }
        .demo-btn { width: 100%; padding: 12px; background: #00356b; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; transition: background 0.2s;}
        .demo-btn:hover { background: #002244; }
      `}
      </style>

      <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }} className="critical-ui">
        <button className="btn-link" onClick={() => navigate('/banking')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="title-lg" style={{ margin: 0, color: 'white' }}>{t('moduleNetBank') || 'Net Banking Simulator'}</h2>
      </header>

      {/* Outer Windows Browser Frame */}
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif' }}>
        
        {/* Windows Browser Header */}
        <div style={{ backgroundColor: '#dde1e5', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', border: '1px solid #7a7b7c', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px' }}>
               <div style={{ fontSize: '12px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={14}/> State Bank of India - Personal Banking
               </div>
               <div style={{ display: 'flex', gap: '12px', color: '#4b5563' }}>
                  <Minus size={16} />
                  <Square size={14} />
                  <CloseIcon size={16} />
               </div>
            </div>
            
            <div style={{ backgroundColor: '#f1f3f4', padding: '8px 16px', display: 'flex', borderBottom: '1px solid #ccc' }}>
               <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '16px', padding: '6px 16px', flex: 1, border: '1px solid #ddd' }}>
                  <LockIcon size={14} color="#15803d" style={{ marginRight: '8px' }} />
                  <span style={{ fontSize: '14px', color: '#1a1a1a' }}>https://retail.onlinesbi.sbi/retail/login.htm</span>
               </div>
            </div>
        </div>

        {/* Bank Interface Container */}
        <div style={{ border: '1px solid #ccc', borderTop: 'none', backgroundColor: '#f8fafc', minHeight: '650px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            
            {/* Top Header */}
            <div style={{ backgroundColor: '#00356b', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div className="critical-ui" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#fff', color: '#00356b', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px' }}>SBI</div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>State Bank of India</h2>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> Welcome, Demo User</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#93c5fd' }}><LogOut size={18} /> Logout</div>
               </div>
            </div>

            {/* Layout Split */}
            <div style={{ display: 'flex', flex: 1 }}>
               {/* Left Sidebar Navigation */}
               <div style={{ width: '25%', backgroundColor: 'white', borderRight: '1px solid #e2e8f0', padding: '24px 0', minWidth: '220px' }}>
                  <div style={{ opacity: activeTab === 'Dashboard' ? 1 : 0.4 }}>
                     <NavItem label="Dashboard" isActive={activeTab === 'Dashboard'} icon={<Square size={18}/>} />
                  </div>
                  <TargetWrapper {...getStepProps('nav_mobile')} onAction={clickNavMobile} position="right">
                     <NavItem label="Mobile Recharge" isActive={activeTab === 'Mobile Recharge'} icon={<Smartphone size={18}/>} />
                  </TargetWrapper>
                  <TargetWrapper {...getStepProps('nav_bill')} onAction={clickNavBill} position="right">
                     <NavItem label="Bill Payments" isActive={activeTab === 'Bill Payments'} icon={<FileText size={18}/>} />
                  </TargetWrapper>
                  <TargetWrapper {...getStepProps('nav_payee')} onAction={clickNavPayee} position="right">
                     <NavItem label="Add Payee" isActive={activeTab === 'Add Payee'} icon={<User size={18}/>} />
                  </TargetWrapper>
               </div>

               {/* Main Content Area */}
               <div style={{ width: '75%', padding: '40px', backgroundColor: '#f8fafc' }}>
                  
                  {activeTab === 'Dashboard' && (
                     <div>
                        <h3 className="critical-ui" style={{ marginTop: 0, color: '#1e293b', fontSize: '20px' }}>Account Overview</h3>
                        <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
                           <div className="critical-ui">
                              <div style={{ color: '#64748b', fontSize: '15px', marginBottom: '8px' }}>Savings Account (**** 1234)</div>
                              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00356b' }}>
                                 {balVisible ? '₹ 50,000.00' : '₹ * * * *'}
                              </div>
                           </div>
                           <TargetWrapper {...getStepProps('dash_eye')} onAction={clickDashEye} position="left">
                              <button className="critical-ui" style={{ padding: '12px', borderRadius: '50%', background: '#f0f4f8', border: 'none', cursor: 'pointer' }}>
                                 {balVisible ? <Eye size={28} color="#00356b"/> : <EyeOff size={28} color="#64748b"/>}
                              </button>
                           </TargetWrapper>
                        </div>

                        <h4 className="critical-ui" style={{ color: '#1e293b', marginBottom: '16px', fontSize: '18px' }}>Recent Statements</h4>
                        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '20px', alignItems: 'flex-end', border: '1px solid #e2e8f0' }}>
                           <div style={{ flex: 1 }}>
                              <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Start Date</label>
                              <TargetWrapper {...getStepProps('dash_date_start')} position="top">
                                 <input type="date" value={dates.start} onChange={handleDateStart} className="demo-input critical-ui" />
                              </TargetWrapper>
                           </div>
                           <div style={{ flex: 1 }}>
                              <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>End Date</label>
                              <TargetWrapper {...getStepProps('dash_date_end')} position="top">
                                 <input type="date" value={dates.end} onChange={handleDateEnd} className="demo-input critical-ui" />
                              </TargetWrapper>
                           </div>
                           <div style={{ width: '220px' }}>
                              <TargetWrapper {...getStepProps('dash_download')} onAction={clickDownload} position="top">
                                 <button className="demo-btn critical-ui">Download Statement</button>
                              </TargetWrapper>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'Mobile Recharge' && (
                     <div>
                        <h3 className="critical-ui" style={{ marginTop: 0, color: '#1e293b', fontSize: '20px' }}>Mobile Recharge</h3>
                        <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '450px', border: '1px solid #e2e8f0' }}>
                           <div style={{ marginBottom: '20px' }}>
                              <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Mobile Number</label>
                              <TargetWrapper {...getStepProps('mob_phone')} position="right">
                                 <input type="text" placeholder="Enter 10-digit number" value={mobileData.phone} onChange={handlePhone} className="demo-input critical-ui" />
                              </TargetWrapper>
                           </div>
                           <div style={{ marginBottom: '20px' }}>
                              <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Operator</label>
                              <TargetWrapper {...getStepProps('mob_operator')} position="right">
                                 <select className="demo-input critical-ui" value={mobileData.operator} onChange={handleOper}>
                                    <option value="">Select Operator</option>
                                    <option value="Airtel">Airtel</option>
                                    <option value="Jio">Jio</option>
                                    <option value="VI">VI</option>
                                    <option value="BSNL">BSNL</option>
                                 </select>
                              </TargetWrapper>
                           </div>
                           <div style={{ marginBottom: '32px' }}>
                              <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Amount (₹)</label>
                              <TargetWrapper {...getStepProps('mob_amount')} position="right">
                                 <input type="text" placeholder="Enter Amount" value={mobileData.amount} onChange={handleAmt} className="demo-input critical-ui" />
                              </TargetWrapper>
                           </div>
                           <TargetWrapper {...getStepProps('mob_proceed')} onAction={clickMobProc} position="top">
                              <button className="demo-btn critical-ui">Proceed to Pay</button>
                           </TargetWrapper>
                        </div>
                     </div>
                  )}

                  {activeTab === 'Bill Payments' && (
                     <div>
                        <h3 className="critical-ui" style={{ marginTop: 0, color: '#1e293b', fontSize: '20px' }}>Bill Payments</h3>
                        <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '450px', border: '1px solid #e2e8f0' }}>
                           <div style={{ marginBottom: '20px' }}>
                              <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Biller Category</label>
                              <TargetWrapper {...getStepProps('bill_provider')} position="right">
                                 <select className="demo-input critical-ui" value={billData.provider} onChange={handleProv}>
                                    <option value="">Select Category</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Water">Water</option>
                                    <option value="Gas">Gas</option>
                                    <option value="Broadband">Broadband</option>
                                 </select>
                              </TargetWrapper>
                           </div>
                           <div style={{ marginBottom: '32px' }}>
                              <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Consumer Number</label>
                              <TargetWrapper {...getStepProps('bill_consumer')} position="right">
                                 <input type="text" placeholder="Enter 10-digit Consumer No." value={billData.consumer} onChange={handleCons} className="demo-input critical-ui" />
                              </TargetWrapper>
                           </div>
                           <TargetWrapper {...getStepProps('bill_fetch')} onAction={clickBillFetch} position="top">
                              <button className="demo-btn critical-ui">Fetch Bill Details</button>
                           </TargetWrapper>

                           {billVisible && (
                              <div className="critical-ui" style={{ marginTop: '24px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', animation: 'scaleIn 0.3s' }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: '#64748b', fontSize: '14px' }}>Due Date</span>
                                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>15 Nov 2026</span>
                                 </div>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <span style={{ color: '#64748b', fontSize: '14px' }}>Amount Due</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#dc2626' }}>₹ 1,250.00</span>
                                 </div>
                                 <TargetWrapper {...getStepProps('bill_pay')} onAction={clickBillPay} position="top">
                                    <button className="demo-btn critical-ui">Pay Now</button>
                                 </TargetWrapper>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {activeTab === 'Add Payee' && (
                     <div>
                        <h3 className="critical-ui" style={{ marginTop: 0, color: '#1e293b', fontSize: '20px' }}>Add Beneficiary / Payee</h3>
                        <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '550px', border: '1px solid #e2e8f0' }}>
                           <div style={{ marginBottom: '20px' }}>
                              <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Account Number</label>
                              <TargetWrapper {...getStepProps('payee_acc')} position="right">
                                 <input type="text" placeholder="Enter 10-digit Account Number" value={payeeData.acc} onChange={handleAcc} className="demo-input critical-ui" />
                              </TargetWrapper>
                           </div>
                           <div style={{ marginBottom: '20px' }}>
                              <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Confirm Account Number</label>
                              <TargetWrapper {...getStepProps('payee_confirm')} position="right">
                                 <input type="text" placeholder="Re-enter 10-digit Account Number" value={payeeData.confirm} onChange={handleConf} className="demo-input critical-ui" />
                              </TargetWrapper>
                           </div>
                           <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'flex-end' }}>
                              <div style={{ flex: 1 }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>IFSC Code</label>
                                 <TargetWrapper {...getStepProps('payee_ifsc')} position="top">
                                    <input type="text" placeholder="e.g. SBIN0001234" value={payeeData.ifsc} onChange={handleIfsc} className="demo-input critical-ui" />
                                 </TargetWrapper>
                              </div>
                              <div style={{ width: '150px' }}>
                                 <TargetWrapper {...getStepProps('payee_verify')} onAction={clickPayeeVerify} position="top">
                                    <button className="demo-btn critical-ui" style={{ background: '#00356b' }}>Verify Branch</button>
                                 </TargetWrapper>
                              </div>
                           </div>
                           
                           {payeeData.branch && (
                              <div className="critical-ui" style={{ padding: '16px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '32px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'scaleIn 0.3s' }}>
                                 <CheckCircle size={18} /> Verified Branch: <strong>{payeeData.branch}</strong>
                              </div>
                           )}
                           
                           <TargetWrapper {...getStepProps('payee_save')} onAction={clickPayeeSave} position="top">
                              <button className="demo-btn critical-ui">Save Payee securely</button>
                           </TargetWrapper>
                        </div>
                     </div>
                  )}

               </div>
            </div>
            
            {/* Download Shelf Modal Simulation */}
            {showDownloadShelf && (
               <div className="critical-ui" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#f8fafc', borderTop: '1px solid #cbd5e1', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'slideUp 0.3s ease-out', zIndex: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <div style={{ background: '#e2e8f0', padding: '12px', borderRadius: '8px' }}>
                        <FileText size={24} color="#00356b" />
                     </div>
                     <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>Account_Statement.pdf</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>45 KB • Download complete</div>
                     </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <button onClick={() => setShowDownloadShelf(false)} style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#0f172a' }}>Open file</button>
                     <button onClick={() => setShowDownloadShelf(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><CloseIcon size={20} color="#64748b" /></button>
                  </div>
               </div>
            )}

            {/* Overlay Modals */}
            {showOtpScreen && (
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                  <div className="critical-ui" style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '350px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', animation: 'scaleIn 0.3s' }}>
                     <LockIcon size={40} color="#00356b" style={{ marginBottom: '16px' }} />
                     <h3 style={{ marginTop: 0, color: '#0f172a', fontSize: '22px' }}>Enter OTP</h3>
                     <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>A One-Time Password has been sent to your mobile number.</p>
                     <TargetWrapper {...getStepProps('mob_otp')} position="bottom">
                        <input type="text" placeholder="- - - -" value={mobileData.otp} onChange={handleOtp} className="demo-input critical-ui" style={{ width: '200px', letterSpacing: '12px', textAlign: 'center', fontSize: '28px', padding: '12px', border: '2px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: 'bold' }} />
                     </TargetWrapper>
                  </div>
               </div>
            )}

            {showSecurityPop && (
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                  <div className="critical-ui" style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '450px', textAlign: 'center', borderTop: '8px solid #f59e0b', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', animation: 'scaleIn 0.3s' }}>
                     <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#b45309', fontSize: '24px' }}>
                        <Shield size={32} /> Beneficiary Added!
                     </h2>
                     <div style={{ background: '#fffbeb', padding: '24px', borderRadius: '8px', margin: '32px 0', textAlign: 'left', color: '#92400e', fontSize: '15px', border: '1px solid #fde68a', lineHeight: '1.6' }}>
                        <strong>Security Protection Active:</strong> Banks enforce a mandatory <strong>30-minute cooling period</strong> for any newly added payee before you can transfer funds to them. 
                        <br/><br/>
                        This feature protects you from scammers who create false urgency, attempting to coerce you into adding their account and transferring money immediately.
                     </div>
                     <TargetWrapper {...getStepProps('pop_ack')} onAction={clickPopAck} position="bottom">
                        <button className="demo-btn critical-ui" style={{ background: '#f59e0b' }}>Acknowledge Notice</button>
                     </TargetWrapper>
                  </div>
               </div>
            )}

            {isSimulationComplete && (
               <div className="critical-ui" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                  <div style={{ background: 'white', padding: '48px', borderRadius: '16px', width: '500px', textAlign: 'center', animation: 'scaleIn 0.5s', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                     <CheckCircle size={72} color="#10b981" style={{ margin: '0 auto 24px' }} />
                     <h2 style={{ marginTop: 0, color: '#065f46', fontSize: '32px' }}>Tutorial Complete!</h2>
                     <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '40px', lineHeight: '1.6' }}>
                        🎉 You have successfully learned how to check your balance, recharge your mobile, pay bills, and add a payee safely.
                     </p>
                     <button onClick={restartTutorial} className="demo-btn critical-ui" style={{ padding: '16px 40px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)' }}>
                        Restart Sandbox
                     </button>
                  </div>
               </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default NetBankingSimulator;
