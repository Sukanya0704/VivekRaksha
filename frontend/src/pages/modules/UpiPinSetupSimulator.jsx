import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getUnifiedVoice } from '../../utils/audio';
import * as LucideIcons from 'lucide-react';
import { markLevelComplete } from '../../utils/levelProgress';

const { 
  ArrowLeft, CheckCircle, Building2, User, CreditCard, ShieldCheck, CreditCard: DebitCardIcon, IdentificationCard
} = LucideIcons;

const TRANSLATIONS = {
  en: {
    pin_setup_dash: 'Click "Add Bank Account" to begin the setup process.',
    pin_setup_select_bank: 'Select your bank from the list (e.g. State Bank of India).',
    pin_setup_method: 'Choose to verify using your Debit Card or Aadhaar Number.',
    pin_setup_details: 'Enter the required details correctly to proceed.',
    pin_setup_otp: 'Enter the 6-digit OTP sent to your mobile, then click the Check mark.',
    pin_setup_new_pin: 'Set a new secure 4-digit UPI PIN. Avoid easy numbers like 1234.',
    pin_setup_confirm_pin: 'Re-enter your 4-digit UPI PIN to confirm.',
    pin_setup_success: 'Review your success screen, then click Done.',
    complete: 'Tutorial Complete!'
  },
  hi: {
    pin_setup_dash: 'प्रक्रिया शुरू करने के लिए बँक खाते जोड़ने वाले विकल्प पर क्लिक करें।',
    pin_setup_select_bank: 'सूची से अपना बैंक चुनें (जैसे भारतीय स्टेट बैंक)।',
    pin_setup_method: 'सत्यापित करने के लिए डेबिट कार्ड या आधार का उपयोग करना चुनें।',
    pin_setup_details: 'आगे बढ़ने के लिए आवश्यक जानकारी सही ढंग से भरें।',
    pin_setup_otp: 'अपने मोबाइल पर भेजा गया ६-अंकों का ओटीपी डालें, फिर सही के निशान पर क्लिक करें।',
    pin_setup_new_pin: 'एक नया और सुरक्षित ४-अंकों का यूपीआई पिन बनाएं। १२३४ जैसे आसान पिन से बचें।',
    pin_setup_confirm_pin: 'पुष्टि करने के लिए अपना ४-अंकों का यूपीआई पिन दोबारा डालें।',
    pin_setup_success: 'सफलता की जानकारी जांचें, और फिर पूर्ण बटन दबाएं।',
    complete: 'प्रशिक्षण पूरा हुआ!'
  },
  mr: {
    pin_setup_dash: 'प्रक्रिया सुरू करण्यासाठी बँक खाते जोडण्याच्या पर्यायावर क्लिक करा.',
    pin_setup_select_bank: 'यादीतून तुमची बँक निवडा (उदा. स्टेट बँक ऑफ इंडिया).',
    pin_setup_method: 'पडताळणी करण्यासाठी डेबिट कार्ड किंवा आधार निवडण्याचे ठरवा.',
    pin_setup_details: 'पुढे जाण्यासाठी आवश्यक माहिती अचूकपणे भरा.',
    pin_setup_otp: 'तुमच्या मोबाईलवर आलेला ६-अंकी ओटीपी टाका, त्यानंतर बरोबरच्या खुणेवर क्लिक करा.',
    pin_setup_new_pin: 'नवा आणि सुरक्षित ४-अंकी यूपीआय पिन तयार करा. १२३४ सारखे सोपे पिन टाळा.',
    pin_setup_confirm_pin: 'खात्री करण्यासाठी तुमचा ४-अंकी यूपीआय पिन पुन्हा टाका.',
    pin_setup_success: 'यशस्वी झाल्याची माहिती तपासा आणि त्यानंतर पूर्ण बटण दाबा.',
    complete: 'प्रशिक्षण पूर्ण झाले!'
  }
};

const KNOWLEDGE_BASE = {
  en: {
    pin_setup_dash: "To use UPI, you must link your bank account to the app.",
    pin_setup_select_bank: "The app uses your phone number to securely find matching bank accounts.",
    pin_setup_method: "Aadhaar verification is a highly requested standard for users who don't have a physical Debit Card but have linked their Aadhaar to the Bank.",
    pin_setup_details: "Never share your debit card or Aadhaar details with anyone. The app needs this only ONCE to verify your true identity over encrypted channels.",
    pin_setup_otp: "The OTP proves you have the phone linked to the bank account. If using Aadhaar, two OTPs are typically required (UIDAI & Bank), but apps often auto-detect them. NEVER share an OTP.",
    pin_setup_new_pin: "This is your secret key to authorize payments. Choose a strong PIN, avoid easy ones like '1234' or your birth year.",
    pin_setup_confirm_pin: "Confirming limits typing mistakes that could permanently lock you out.",
    pin_setup_success: "Your UPI ID is now active! You can send and receive payments seamlessly.",
    complete: "You are now equipped with safe habits for UPI PIN setup!"
  },
  hi: {
    pin_setup_dash: "यूपीआई का उपयोग करने के लिए, आपको अपने बैंक खाते को ऐप से जोड़ना होगा।",
    pin_setup_select_bank: "ऐप आपके फोन नंबर का उपयोग करके सुरक्षित रूप से आपके बैंक खातों को ढूंढता है।",
    pin_setup_method: "आधार सत्यापन उन उपयोगकर्ताओं के लिए बहुत उपयोगी है जिनके पास डेबिट कार्ड नहीं है लेकिन आधार बैंक खाते से जुड़ा है।",
    pin_setup_details: "अपना डेबिट कार्ड या आधार विवरण किसी के साथ साझा न करें। आपकी पहचान जांचने के लिए ऐप को इसकी केवल एक बार आवश्यकता होती है।",
    pin_setup_otp: "ओटीपी यह साबित करता है कि आपके पास फोन है जो बैंक से जुड़ा है। आधार उपयोग करने पर अक्सर दो ओटीपी की आवश्यकता होती है। ओटीपी कभी साक्षा न करें।",
    pin_setup_new_pin: "यह भुगतान करने के लिए आपकी गुप्त कुंजी है। एक मजबूत पिन चुनें। '१२३४' या अपने जन्म के वर्ष जैसे आसान पिन से बचें।",
    pin_setup_confirm_pin: "पुष्टि करने से टाइपिंग की गलतियां बचती हैं, जो आपको हमेशा के लिए ऐप के बाहर कर सकती हैं।",
    pin_setup_success: "आपकी यूपीआई आईडी अब सक्रिय है! अब आप आसानी से पैसे भेज और प्राप्त कर सकते हैं।",
    complete: "अब आप यूपीआई पिन बनाने के सुरक्षित तरीकों से पूरी तरह परिचित हैं!"
  },
  mr: {
    pin_setup_dash: "यूपीआय वापरण्यासाठी, तुम्हाला तुमचे बँक खाते अॅपशी जोडावे लागेल.",
    pin_setup_select_bank: "अॅप तुमच्या फोन नंबरचा वापर करून सुरक्षितपणे तुमचे बँक खाते शोधते.",
    pin_setup_method: "आधार पडताळणी अशा वापरकर्त्यांसाठी खूप उपयुक्त आहे ज्यांच्याकडे डेबिट कार्ड नाही परंतु आधार बँकेशी जोडलेले आहे.",
    pin_setup_details: "तुमचे डेबिट कार्ड किंवा आधारची माहिती कोणाशीही शेअर करू नका. ओळख पटवण्यासाठी अॅपला त्याची फक्त एकदाच आवश्यकता असते.",
    pin_setup_otp: "ओटीपी हे सिद्ध करतो की तुमच्याकडे बँक खात्याशी जोडलेला फोन आहे. आधार कार्ड वापरताना सहसा दोन ओटीपी लागतात. ओटीपी कधीही कोणाला सांगू नका.",
    pin_setup_new_pin: "पैसे पाठवण्यासाठी ही तुमची गुप्त चावी आहे. नेहमी मजबूत पिन निवडा. '१२३४' किंवा तुमच्या जन्माचे वर्ष यासारखे सोपे पिन टाळा.",
    pin_setup_confirm_pin: "पुन्हा खात्री केल्यामुळे टायपिंगच्या चुका टळतात, ज्या तुम्हाला कायमचे अॅपच्या बाहेर करू शकतात.",
    pin_setup_success: "तुमचा युपीआय आयडी आता सक्रिय आहे! आता तुम्ही सहजपणे पैसे पाठवू आणि मिळवू शकता.",
    complete: "आता तुम्ही यूपीआय पिन सेट करण्याच्या सुरक्षित पद्धतींबद्दल सर्व माहिती मिळवली आहे!"
  }
};

const STEPS_SEQ = [
  'pin_setup_dash',
  'pin_setup_select_bank',
  'pin_setup_method',
  'pin_setup_details',
  'pin_setup_otp',
  'pin_setup_new_pin',
  'pin_setup_confirm_pin',
  'pin_setup_success',
  'complete'
];

const OutsideTooltip = ({ stepId, text, language }) => {
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

            const gap = 30;
            const tooltipWidth = 260;
            const left = phoneRect.left - tooltipWidth - gap;
            let top = targetRect.top + (targetRect.height / 2);

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
               <span>🎓</span> {language === 'hi' ? 'शिक्षक मार्गदर्शक' : language === 'mr' ? 'मार्गदर्शक' : 'Instructor Guide'}
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

const UpiPinSetupSimulator = ({ language: languageProp }) => {
  const { language: contextLang } = useLanguage();
  const language = languageProp || contextLang || 'en';
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const currentStepId = STEPS_SEQ[stepIndex];
  const isSimulationComplete = currentStepId === 'complete';

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [bankName, setBankName] = useState('');
  
  const [verificationMethod, setVerificationMethod] = useState(''); // 'debit' or 'aadhaar'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  
  const [mockOtp, setMockOtp] = useState([]);
  const [mockPin, setMockPin] = useState([]);
  const [mockConfirmPin, setMockConfirmPin] = useState([]);
  const [pinError, setPinError] = useState(false);

  const speechIntervalRef = useRef(null);

  useEffect(() => {
    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    window.speechSynthesis.cancel();
    if (!currentStepId || isSimulationComplete) return;

    const textToSpeak = TRANSLATIONS[language]?.[currentStepId] || TRANSLATIONS['en'][currentStepId];
    
    const runSpeak = () => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const unifiedVoice = getUnifiedVoice();
      if (unifiedVoice) utterance.voice = unifiedVoice;
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
    setBankName('');
    setVerificationMethod('');
    setCardNumber('');
    setCardExpiry('');
    setAadhaarNumber('');
    setMockOtp([]);
    setMockPin([]);
    setMockConfirmPin([]);
    setPinError(false);
  };

  const dashAddBank = () => {
    if (currentStepId === 'pin_setup_dash' || isSimulationComplete) {
       setActiveTab('SelectBank');
       handleNext();
    }
  };

  const handleBankSelect = (name) => {
    setBankName(name);
    if (currentStepId === 'pin_setup_select_bank' || isSimulationComplete) {
       setActiveTab('ChooseMethod');
       handleNext();
    }
  };

  const handleMethodSelect = (method) => {
      setVerificationMethod(method);
      if (currentStepId === 'pin_setup_method' || isSimulationComplete) {
         setActiveTab('DetailsEntry');
         handleNext();
      }
  };

  const verifyDetails = () => {
      if (currentStepId === 'pin_setup_details' || isSimulationComplete) {
          let isValid = false;
          if (verificationMethod === 'debit') {
              isValid = cardNumber.length === 6 && cardExpiry.length === 5;
          } else {
              isValid = aadhaarNumber.length === 6;
          }
          if (isValid) {
              setActiveTab('PINSetup_OTP');
              handleNext();
          }
      }
  }

  const submitOtp = () => {
      if (currentStepId === 'pin_setup_otp' || isSimulationComplete) {
          if (mockOtp.length === 6) {
              setActiveTab('PINSetup_NewPIN');
              handleNext();
          }
      }
  }

  const submitNewPin = () => {
      if (currentStepId === 'pin_setup_new_pin' || isSimulationComplete) {
          if (mockPin.length === 4) {
              setActiveTab('PINSetup_ConfirmPIN');
              handleNext();
          }
      }
  }

  const submitConfirmPin = () => {
      if (currentStepId === 'pin_setup_confirm_pin' || isSimulationComplete) {
          if (mockConfirmPin.length === 4) {
              if (mockConfirmPin.join('') === mockPin.join('')) {
                  setPinError(false);
                  setActiveTab('Success');
                  handleNext();
              } else {
                  setPinError(true);
                  setMockConfirmPin([]);
              }
          }
      }
  }

  const clickDone = () => {
    if (currentStepId === 'pin_setup_success' || isSimulationComplete) {
       setActiveTab('CompleteModal'); 
       handleNext();
    }
  };

  const handleExpiryChange = (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length === 1 && parseInt(val, 10) > 1) {
          val = '0' + val;
      }
      if (val.length >= 2) {
         let m = parseInt(val.substring(0, 2), 10);
         if (m > 12) val = '12' + val.substring(2);
         if (m === 0) val = '01' + val.substring(2); // If they type 00
      }
      if (val.length > 2) {
         setCardExpiry(val.substring(0, 2) + '/' + val.substring(2, 4));
      } else {
         setCardExpiry(val);
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
            <span>⚠️</span> Disclaimer: All UPI payment apps look different. This is just a basic demonstration. Never enter your real PIN or card details here.
        </div>

        {/* Outward Walkthrough Tooltip */}
        <OutsideTooltip stepId={currentStepId} text={instructionText} language={language} />

        {/* Centered Smartphone Mockup */}
        <div id="smartphone-frame" style={{ width: '100%', maxWidth: '380px', height: '90vh', maxHeight: '760px', background: 'white', borderRadius: '48px', padding: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 8px #1a1a1a', position: 'relative', overflow: 'hidden', marginTop: '40px' }}>
            
            <div style={{ width: '120px', height: '24px', background: '#1a1a1a', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 200 }}></div>

            <div style={{ background: '#f8fafc', width: '100%', height: '100%', borderRadius: '36px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>

                {/* Dashboard Mode */}
                {activeTab === 'Dashboard' && (
                    <div style={{ animation: 'fadeContent 0.2s', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ background: '#5f259f', padding: '40px 16px 16px', display: 'flex', alignItems: 'center', color: 'white', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={24} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '18px' }}>Profile & Settings</h2>
                        </div>

                        <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
                            <div style={{ padding: '16px', background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <h4 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '15px' }}>Payment Methods</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    
                                    <div id="target-pin_setup_dash" onClick={dashAddBank} style={{ cursor: 'pointer', border: currentStepId === 'pin_setup_dash' ? '2px solid #15803d' : '2px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', background: currentStepId === 'pin_setup_dash' ? 'rgba(21, 128, 61, 0.05)' : 'white' }}>
                                        <div style={{ background: '#db2777', color: 'white', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>Add Bank Account</h3>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Link bank for UPI payments</p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.6 }}>
                                        <div style={{ background: '#64748b', color: 'white', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>Add Credit/Debit Card</h3>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>For app purchases</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bank Selection Mode */}
                {activeTab === 'SelectBank' && (
                    <div style={{ flex: 1, background: '#f8fafc', display: 'flex', flexDirection: 'column', animation: 'fadeContent 0.2s' }}>
                        <div style={{ background: '#5f259f', color: 'white', padding: '40px 16px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <ArrowLeft size={24} onClick={() => setActiveTab('Dashboard')} style={{ cursor: 'pointer' }} />
                            <h2 style={{ margin: 0, fontSize: '18px' }}>Select Bank</h2>
                        </div>
                        <div style={{ padding: '16px', flex: 1 }}>
                            <div id="target-pin_setup_select_bank" style={{ border: currentStepId === 'pin_setup_select_bank' ? '2px solid #15803d' : '2px solid transparent', borderRadius: '12px', padding: '4px', background: currentStepId === 'pin_setup_select_bank' ? 'rgba(21, 128, 61, 0.05)' : 'none' }}>
                                <h4 style={{ margin: '0 0 12px 4px', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Popular Banks</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                    {[
                                      { name: 'State Bank of India', color: '#0284c7', initial: 'SBI' },
                                      { name: 'HDFC Bank', color: '#1d4ed8', initial: 'HDFC' },
                                      { name: 'ICICI Bank', color: '#ea580c', initial: 'ICICI' },
                                      { name: 'Axis Bank', color: '#9333ea', initial: 'AXIS' },
                                      { name: 'Kotak Bank', color: '#dc2626', initial: 'KOTAK' },
                                      { name: 'Bank of Baroda', color: '#f59e0b', initial: 'BOB' }
                                    ].map((bank) => (
                                        <div 
                                            key={bank.name} 
                                            onClick={() => handleBankSelect(bank.name)}
                                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px', background: 'white', cursor: 'pointer', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}
                                        >
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: bank.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px' }}>{bank.initial}</div>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#0f172a', fontSize: '11px', textAlign: 'center' }}>{bank.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Verification Method Mode */}
                {activeTab === 'ChooseMethod' && (
                    <div style={{ flex: 1, background: '#f8fafc', display: 'flex', flexDirection: 'column', animation: 'fadeContent 0.2s' }}>
                        <div style={{ background: '#5f259f', color: 'white', padding: '40px 16px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <ArrowLeft size={24} onClick={() => setActiveTab('SelectBank')} style={{ cursor: 'pointer' }} />
                            <h2 style={{ margin: 0, fontSize: '18px' }}>Verify {bankName}</h2>
                        </div>
                        <div style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Choose a method to set up your UPI PIN securely.</p>
                            
                            <div id="target-pin_setup_method" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: currentStepId === 'pin_setup_method' ? '2px solid #15803d' : '2px solid transparent', borderRadius: '16px', padding: '4px', background: currentStepId === 'pin_setup_method' ? 'rgba(21, 128, 61, 0.05)' : 'none' }}>
                                
                                <div onClick={() => handleMethodSelect('debit')} style={{ cursor: 'pointer', background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                    <div style={{ background: '#f0fdf4', color: '#16a34a', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <DebitCardIcon size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a' }}>Debit Card</h3>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Use 6 digits of Debit Card</p>
                                    </div>
                                </div>

                                <div onClick={() => handleMethodSelect('aadhaar')} style={{ cursor: 'pointer', background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                    <div style={{ background: '#fef2f2', color: '#dc2626', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <LucideIcons.Fingerprint size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a' }}>Aadhaar Card</h3>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>If supported by your bank</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Entry Mode (Debit or Aadhaar) */}
                {activeTab === 'DetailsEntry' && (
                    <div style={{ flex: 1, background: '#f8fafc', display: 'flex', flexDirection: 'column', animation: 'fadeContent 0.2s' }}>
                        <div style={{ background: '#5f259f', padding: '40px 16px 16px', display: 'flex', alignItems: 'center', gap: '16px', color: 'white' }}>
                            <ArrowLeft size={24} onClick={() => { setActiveTab('ChooseMethod'); }} style={{ cursor: 'pointer' }} />
                            <h2 style={{ margin: 0, fontSize: '18px' }}>Verify {bankName}</h2>
                        </div>
                        <div style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Check your physical card for these details. Provide them below to proceed.</p>
                            
                            <div id="target-pin_setup_details" style={{ width: '100%', display: 'flex', flexDirection: 'column', border: currentStepId === 'pin_setup_details' ? '2px solid #15803d' : '2px solid transparent', borderRadius: '16px', padding: '16px', background: currentStepId === 'pin_setup_details' ? 'rgba(21, 128, 61, 0.05)' : 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                
                                {verificationMethod === 'debit' && (
                                    <>
                                        {/* CSS Dummy Card Visualizer */}
                                        <div style={{ width: '100%', height: '140px', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', borderRadius: '16px', padding: '16px', color: 'white', position: 'relative', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)', marginBottom: '24px', boxSizing: 'border-box' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                <span style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: '14px' }}>{bankName}</span>
                                                <DebitCardIcon size={20} />
                                            </div>
                                            <div style={{ fontSize: '16px', letterSpacing: '2px', marginBottom: '12px', fontFamily: 'monospace' }}>
                                                XXXX XXXX <span style={{ border: '2px solid #fbbf24', padding: '0 4px', borderRadius: '4px', color: '#fbbf24' }}>{cardNumber || 'XXXXXX'}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                <div>
                                                    <div style={{ fontSize: '7px', opacity: 0.8, marginBottom: '2px' }}>VALID THRU</div>
                                                    <div style={{ fontFamily: 'monospace', fontSize: '12px', border: '2px solid #fbbf24', padding: '2px 4px', borderRadius: '4px', display: 'inline-block', color: '#fbbf24' }}>{cardExpiry || 'MM/YY'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontSize: '12px', color: '#1e293b', fontWeight: 'bold', marginBottom: '8px' }}>LAST 6 DIGITS OF CARD NUMBER</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '18px', color: '#64748b', letterSpacing: '2px' }}>XXXX-XXXX-</span>
                                                <input 
                                                    type="text" 
                                                    value={cardNumber} 
                                                    maxLength={6}
                                                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                                                    placeholder="123456"
                                                    style={{ width: '100px', padding: '8px', border: 'none', borderBottom: '2px solid #cbd5e1', fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', background: 'transparent', color: '#0f172a', outline: 'none' }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '32px' }}>
                                            <label style={{ display: 'block', fontSize: '12px', color: '#1e293b', fontWeight: 'bold', marginBottom: '8px' }}>EXPIRY DATE</label>
                                            <input 
                                                type="text" 
                                                value={cardExpiry} 
                                                maxLength={5}
                                                onChange={handleExpiryChange}
                                                placeholder="MM/YY"
                                                style={{ width: '80px', padding: '8px', border: 'none', borderBottom: '2px solid #cbd5e1', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', background: 'transparent', color: '#0f172a', outline: 'none' }}
                                            />
                                        </div>
                                    </>
                                )}

                                {verificationMethod === 'aadhaar' && (
                                    <>
                                        {/* CSS Dummy Aadhaar Visualizer */}
                                        <div style={{ width: '100%', height: '140px', background: 'white', borderRadius: '16px', padding: '16px', color: '#0f172a', position: 'relative', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginBottom: '24px', boxSizing: 'border-box', borderTop: '6px solid #dc2626' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#b91c1c' }}>Aadhaar</span>
                                            </div>
                                            <div style={{ fontSize: '16px', letterSpacing: '4px', marginBottom: '12px', fontFamily: 'monospace', textAlign: 'center', marginTop: '16px' }}>
                                                <span style={{ border: '2px solid #fbbf24', padding: '4px', borderRadius: '4px', color: '#d97706', background: '#fef3c7' }}>{aadhaarNumber || 'XXXXXX'}</span> XXXX XX
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '32px' }}>
                                            <label style={{ display: 'block', fontSize: '12px', color: '#1e293b', fontWeight: 'bold', marginBottom: '8px' }}>FIRST 6 DIGITS OF AADHAAR</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input 
                                                    type="text" 
                                                    value={aadhaarNumber} 
                                                    maxLength={6}
                                                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                                                    placeholder="123456"
                                                    style={{ width: '100px', padding: '8px', border: 'none', borderBottom: '2px solid #cbd5e1', fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', background: 'transparent', color: '#0f172a', outline: 'none' }}
                                                />
                                                <span style={{ fontSize: '18px', color: '#64748b', letterSpacing: '2px' }}>-XXXX-XX</span>
                                            </div>
                                        </div>

                                        <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #3b82f6' }}>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#1e3a8a', lineHeight: '1.4' }}>
                                                <LucideIcons.Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>
                                                You will receive two OTPs: one from UIDAI and one from your Bank. The app usually detects these automatically.
                                            </p>
                                        </div>
                                    </>
                                )}

                                <button 
                                    onClick={verifyDetails} 
                                    disabled={verificationMethod === 'debit' ? (cardNumber.length !== 6 || cardExpiry.length !== 5) : (aadhaarNumber.length !== 6)}
                                    style={{ width: '100%', padding: '16px', background: '#5f259f', color: 'white', border: 'none', borderRadius: '32px', fontWeight: 'bold', fontSize: '16px', cursor: (verificationMethod === 'debit' ? (cardNumber.length === 6 && cardExpiry.length === 5) : (aadhaarNumber.length === 6)) ? 'pointer' : 'default', opacity: (verificationMethod === 'debit' ? (cardNumber.length === 6 && cardExpiry.length === 5) : (aadhaarNumber.length === 6)) ? 1 : 0.6 }}
                                >
                                    Proceed
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Simulated Bank PIN Flow: OTP, New PIN, Confirm PIN */}
                {['PINSetup_OTP', 'PINSetup_NewPIN', 'PINSetup_ConfirmPIN'].includes(activeTab) && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1e3a8a', color: 'white', paddingTop: '24px', animation: 'fadeContent 0.2s' }}>
                        <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase' }}>{bankName} UPI PIN SETUP</span>
                        </div>
                        <div style={{ padding: '32px 16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f8fafc', color: '#0f172a', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', marginTop: '16px' }}>

                            {activeTab === 'PINSetup_OTP' && (
                                <>
                                    <p style={{ margin: '0 0 24px 0', color: '#444', fontWeight: 'bold', fontSize: '14px' }}>ENTER 6-DIGIT OTP</p>
                                    <div style={{ display: 'flex', gap: '16px', marginBottom: 'auto' }}>
                                        {[0, 1, 2, 3, 4, 5].map(i => (
                                            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: mockOtp.length > i ? '#111' : 'transparent', border: '2px solid #111' }}></div>
                                        ))}
                                    </div>
                                    <p style={{ margin: '16px 0 auto 0', color: '#64748b', fontSize: '12px', textAlign: 'center' }}>Sent to your mobile. The app often auto-fills this.</p>
                                </>
                            )}

                            {activeTab === 'PINSetup_NewPIN' && (
                                <>
                                    <p style={{ margin: '0 0 24px 0', color: '#444', fontWeight: 'bold', fontSize: '14px' }}>SET 4-DIGIT UPI PIN</p>
                                    <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: mockPin.length > i ? '#111' : 'transparent', border: '2px solid #111' }}></div>
                                        ))}
                                    </div>
                                    <p style={{ margin: '0 0 auto 0', color: '#64748b', fontSize: '12px', textAlign: 'center' }}>Tip: Avoid easy numbers like 1234 or your birth year.</p>
                                </>
                            )}

                            {activeTab === 'PINSetup_ConfirmPIN' && (
                                <>
                                    <p style={{ margin: '0 0 24px 0', color: '#444', fontWeight: 'bold', fontSize: '14px' }}>CONFIRM 4-DIGIT UPI PIN</p>
                                    <div style={{ display: 'flex', gap: '20px', marginBottom: pinError ? '16px' : 'auto' }}>
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: mockConfirmPin.length > i ? '#111' : 'transparent', border: '2px solid #111' }}></div>
                                        ))}
                                    </div>
                                    {pinError && <p style={{ margin: '0 0 auto 0', color: '#ef4444', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>PINs do not match. Try again.</p>}
                                </>
                            )}

                            <div 
                                id={`target-${activeTab === 'PINSetup_OTP' ? 'pin_setup_otp' : activeTab === 'PINSetup_NewPIN' ? 'pin_setup_new_pin' : 'pin_setup_confirm_pin'}`} 
                                style={{ width: '100%', maxWidth: '300px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: 'auto', justifyItems: 'center', border: (['pin_setup_otp', 'pin_setup_new_pin', 'pin_setup_confirm_pin'].includes(currentStepId)) ? '2px solid #15803d' : '2px solid transparent', borderRadius: '16px', padding: '8px' }}
                            >
                                {[1,2,3,4,5,6,7,8,9].map(num => (
                                    <button 
                                        key={num} 
                                        onClick={() => { 
                                            if(activeTab === 'PINSetup_OTP' && mockOtp.length < 6) setMockOtp([...mockOtp, num]);
                                            if(activeTab === 'PINSetup_NewPIN' && mockPin.length < 4) setMockPin([...mockPin, num]);
                                            if(activeTab === 'PINSetup_ConfirmPIN' && mockConfirmPin.length < 4) setMockConfirmPin([...mockConfirmPin, num]);
                                        }} 
                                        style={{ background: '#e2e8f0', border: 'none', width: '64px', height: '64px', fontSize: '24px', borderRadius: '50%', cursor: 'pointer', outline: 'none' }}
                                    >{num}</button>
                                ))}
                                <button 
                                    onClick={() => {
                                        if(activeTab === 'PINSetup_OTP') setMockOtp([]);
                                        if(activeTab === 'PINSetup_NewPIN') setMockPin([]);
                                        if(activeTab === 'PINSetup_ConfirmPIN') setMockConfirmPin([]);
                                    }} 
                                    style={{ background: 'transparent', border: 'none', width: '64px', height: '64px', fontSize: '14px', fontWeight: 'bold', color: '#ef4444', borderRadius: '50%', cursor: 'pointer', outline: 'none' }}
                                >CLEAR</button>
                                <button 
                                    onClick={() => { 
                                        if(activeTab === 'PINSetup_OTP' && mockOtp.length < 6) setMockOtp([...mockOtp, 0]);
                                        if(activeTab === 'PINSetup_NewPIN' && mockPin.length < 4) setMockPin([...mockPin, 0]);
                                        if(activeTab === 'PINSetup_ConfirmPIN' && mockConfirmPin.length < 4) setMockConfirmPin([...mockConfirmPin, 0]);
                                    }} 
                                    style={{ background: '#e2e8f0', border: 'none', width: '64px', height: '64px', fontSize: '24px', borderRadius: '50%', cursor: 'pointer', outline: 'none' }}
                                >0</button>
                                <button 
                                    disabled={
                                        (activeTab === 'PINSetup_OTP' && mockOtp.length !== 6) ||
                                        (activeTab === 'PINSetup_NewPIN' && mockPin.length !== 4) ||
                                        (activeTab === 'PINSetup_ConfirmPIN' && mockConfirmPin.length !== 4)
                                    } 
                                    onClick={() => {
                                        if(activeTab === 'PINSetup_OTP') submitOtp();
                                        if(activeTab === 'PINSetup_NewPIN') submitNewPin();
                                        if(activeTab === 'PINSetup_ConfirmPIN') submitConfirmPin();
                                    }} 
                                    style={{ 
                                        background: ((activeTab === 'PINSetup_OTP' && mockOtp.length === 6) || (activeTab === 'PINSetup_NewPIN' && mockPin.length === 4) || (activeTab === 'PINSetup_ConfirmPIN' && mockConfirmPin.length === 4)) ? '#10b981' : '#cbd5e1', 
                                        color: 'white', border: 'none', width: '64px', height: '64px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none', transition: 'background 0.3s' 
                                    }}
                                >
                                    <CheckCircle size={32} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Full-Screen Distinct Success Modal Inside Phone */}
                {activeTab === 'Success' && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#f0fdf4', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeContent 0.3s', padding: '24px', border: '8px solid #bbf7d0', textAlign: 'center' }}>
                        <div style={{ background: '#16a34a', width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 10px 25px rgba(22, 163, 74, 0.4)' }}>
                           <CheckCircle size={56} color="white" />
                        </div>
                        
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#166534', fontWeight: '900' }}>UPI PIN Set Successfully!</h3>
                        <p style={{ margin: '0 0 32px 0', color: '#15803d', fontWeight: 'bold' }}>For {bankName}</p>
                        
                        <div style={{ marginTop: 'auto', width: '100%' }}>
                            <div id="target-pin_setup_success" style={{ border: currentStepId === 'pin_setup_success' ? '2px solid #166534' : '2px solid transparent', borderRadius: '34px', padding: '4px' }}>
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
                            <p style={{ margin: '0 0 32px 0', color: '#444', lineHeight: '1.5', fontSize: '15px' }}>You have successfully linked your bank account and secured it with a UPI PIN.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <button onClick={() => markLevelComplete(1, navigate)} style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}>Complete Module</button>
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
                        <span style={{ fontSize: '28px' }}>💡</span> {language === 'hi' ? 'क्या आप जानते हैं?' : language === 'mr' ? 'तुम्हाला माहित आहे का?' : 'Did You Know?'}
                    </h2>
                    <div key={currentStepId} style={{ animation: 'fadeContent 0.5s', fontSize: '18px', color: '#334155', lineHeight: '1.6', fontWeight: '600' }}>
                        {(KNOWLEDGE_BASE[language] && KNOWLEDGE_BASE[language][currentStepId]) || KNOWLEDGE_BASE['en'][currentStepId] || "Follow the guided instructions."}
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default UpiPinSetupSimulator;
