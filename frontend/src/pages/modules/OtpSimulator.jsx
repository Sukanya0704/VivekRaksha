import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, ShieldCheck, ShieldX, Wallet, Landmark, ShieldAlert, ArrowRight, Smartphone, MessageCircle, AlertTriangle, Info, PlayCircle, ExternalLink, Lock, Globe } from 'lucide-react';
import PageAudioButton from '../../components/PageAudioButton';
import { playAudio } from '../../utils/audio';
import { otpScenariosData } from '../../data/otpScenarios';
import { markLevelComplete } from '../../utils/levelProgress';
import LanguageSelector from '../../components/LanguageSelector';

const OtpSimulator = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // App State Navigation
  const [step, setStep] = useState('intro'); // intro, hub, quiz, final
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Quiz State
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [subStep, setSubStep] = useState('sms'); // 'sms' (showing message), 'sandbox' (showing input)
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [inputVal2, setInputVal2] = useState('');
  const [inputVal3, setInputVal3] = useState('');

  // 1. Get complete language data
  const fullData = otpScenariosData[language] || otpScenariosData['en'];
  
  // 2. Filter data for the active category
  const activeScenarios = activeCategory 
    ? fullData.filter(s => s.category === activeCategory) 
    : [];

  // Localization Dictionary (Hardcoded UI elements)
  const tx = {
    en: {
      title: "OTP & Link Scams Simulator",
      introBasic: "Link and OTP scams are the most common way Indians lose money daily. Scammers send fake SMS alerts causing panic, forcing you to click malicious links and enter your hidden OTPs.",
      rule1: "Rule 1: Never forward SMS starting with 'V' or 'F' - it redirects your OTPs.",
      rule2: "Rule 2: Don't trust domains that look real (e.g. sbi-update.in). Look for exact spelling.",
      rule3: "Rule 3: Scammers already know your PAN. Don't trust callers just because they recite it.",
      startBtn: "Start Interactive Training",
      hubTitle: "Select a Fraud Category to Practice",
      hubTax: "Income Tax Refunds",
      hubKYC: "Bank KYC & Wallets",
      hubUPI: "UPI Payment Reversals",
      sidePanelWait: "Make a decision on the left to see the detailed analysis here.",
      sidePanelTitle: "Result Analysis",
      correctTitle: "Correct Choice!",
      wrongTitle: "Dangerous Mistake!",
      redFlags: "Red Flags Detected:",
      whyWrong: "Consequence of mistake:",
      whyCorrect: "Why you are safe:",
      nextScenario: "Next Scenario",
      scoreText: "Training Complete!",
      returnBtn: "Back to Dashboard",
      tryAgainBtn: "Retest Category",
      perfectScore: "Excellent work, {name}! You scored 100% and are completely secure from cyber frauds!",
      imperfectScore: "You made some dangerous mistakes, {name}. Would you like to retake the test to achieve a perfect 100% score?",
      actionQuestion: "New Message Received",
      btnIgnore: "Delete Message",
      btnOpen: "Tap Link",
      sandboxWarning: "⚠️ SIMULATION MODE",
      introAudio: "Welcome to the OTP and Link Simulator. Let's learn how to spot dangerous web pages and protect your passwords.",
      hubAudio: "Select a module to begin interacting with real world scams. Tax, KYC, or UPI."
    },
    hi: {
      title: "ओटीपी और लिंक घोटाला सिम्युलेटर",
      introBasic: "लिंक और ओटीपी घोटाले सबसे आम तरीके हैं जिनसे भारतीय रोजाना पैसे खोते हैं। ठग फर्जी एसएमएस भेजकर घबराहट पैदा करते हैं, ताकि आप खतरनाक लिंक पर क्लिक करें और अपना छिपा हुआ ओटीपी दर्ज करें।",
      rule1: "नियम १: 'वी' या 'एफ' से शुरू होने वाले एसएमएस को कभी आगे न भेजें (फॉरवर्ड न करें) - यह आपके ओटीपी को उनके पास भेज देता है।",
      rule2: "नियम २: असली दिखने वाले वेबसाइट लिंक (जैसे sbi-update.in) पर भरोसा न करें। सटीक स्पेलिंग देखें।",
      rule3: "नियम ३: ठग पहले से ही आपका पैन कार्ड नंबर जानते हैं। इसके आधार पर कभी ओटीपी साझा न करें।",
      startBtn: "इंटरैक्टिव प्रशिक्षण शुरू करें",
      hubTitle: "अभ्यास करने के लिए धोखाधड़ी की श्रेणी चुनें",
      hubTax: "आयकर रिफंड घोटाले",
      hubKYC: "बैंक केवाईसी और वॉलेट घोटाले",
      hubUPI: "यूपीआई भुगतान घोटाले",
      sidePanelWait: "विस्तृत विश्लेषण यहाँ देखने के लिए बाईं ओर निर्णय लें।",
      sidePanelTitle: "परिणाम विश्लेषण",
      correctTitle: "सही विकल्प!",
      wrongTitle: "खतरनाक गलती!",
      redFlags: "खतरे के संकेत:",
      whyWrong: "गलती का परिणाम:",
      whyCorrect: "आप सुरक्षित क्यों हैं:",
      nextScenario: "अगला परिदृश्य",
      scoreText: "प्रशिक्षण पूर्ण!",
      returnBtn: "डैशबोर्ड पर वापस लौटें",
      tryAgainBtn: "पुनः परीक्षा दें",
      perfectScore: "बहुत बढ़िया काम, {name}! आपने सभी अंक प्राप्त किए हैं और आप साइबर धोखाधड़ी से पूरी तरह सुरक्षित हैं!",
      imperfectScore: "आपने कुछ खतरनाक गलतियाँ की हैं, {name}। क्या आप पूरे अंक प्राप्त करने के लिए फिर से परीक्षा देना चाहेंगे?",
      actionQuestion: "नया संदेश प्राप्त हुआ",
      btnIgnore: "संदेश हटाएं",
      btnOpen: "लिंक पर क्लिक करें",
      sandboxWarning: "⚠️ सिमुलेशन मोड",
      introAudio: "ओटीपी और लिंक सिम्युलेटर में आपका स्वागत है। आइए जानें कि खतरनाक वेबसाइट को कैसे पहचानें।",
      hubAudio: "वास्तविक दुनिया के घोटालों के साथ अभ्यास शुरू करने के लिए एक मॉड्यूल चुनें। टैक्स, केवाईसी, या यूपीआई।"
    },
    mr: {
      title: "ओटीपी आणि लिंक घोटाळे सिम्युलेटर",
      introBasic: "भारतीयांचे दररोज पैसे बुडण्याचा सर्वात सामान्य मार्ग म्हणजे लिंक आणि ओटीपी ची फसवणूक. फसवणूक करणारे खोटे एसएमएस पाठवून भीती निर्माण करतात, जेणेकरून तुम्ही धोकादायक लिंकवर क्लिक करा आणि तुमचे ओटीपी टाकावे.",
      rule1: "नियम १: 'व्ही' किंवा 'एफ' ने सुरू होणारे एसएमएस कधीही पुढे पाठवू नका (फॉरवर्ड करू नका) - यामुळे तुमचे ओटीपी त्यांच्याकडे जातात.",
      rule2: "नियम २: खऱ्या वाटणाऱ्या वेबसाइट लिंकवर (उदा. sbi-update.in) विश्वास ठेवू नका. स्पेलिंग नीट तपासा.",
      rule3: "नियम ३: ठगांना तुमचे पॅन कार्ड नंबर आधीच माहीत असतात. त्यामुळे घाबरून ओटीपी देऊ नका.",
      startBtn: "इंटरॅक्टिव्ह प्रशिक्षण सुरू करा",
      hubTitle: "सराव करण्यासाठी श्रेणी निवडा",
      hubTax: "आयकर रिफंड घोटाळे",
      hubKYC: "बँक केवायसी आणि वॉलेट घोटाळे",
      hubUPI: "यूपीआय पेमेंट घोटाळे",
      sidePanelWait: "सविस्तर विश्लेषण पाहण्यासाठी डावीकडे निर्णय घ्या.",
      sidePanelTitle: "परिणाम विश्लेषण",
      correctTitle: "प्रचंड बरोबर!",
      wrongTitle: "भयानक चूक!",
      redFlags: "धोक्याची चिन्हे:",
      whyWrong: "चुकीचा परिणाम:",
      whyCorrect: "तुम्ही सुरक्षित का आहात:",
      nextScenario: "पुढील परिदृश्य",
      scoreText: "प्रशिक्षण पूर्ण!",
      returnBtn: "डॅशबोर्डवर परत जा",
      tryAgainBtn: "पुन्हा परीक्षा द्या",
      perfectScore: "उत्कृष्ट काम, {name}! तुम्हाला पूर्ण १००% गुण मिळाले आहेत आणि तुम्ही सायबर फसवणुकीपासून पूर्णपणे सुरक्षित आहात!",
      imperfectScore: "तुम्ही काही धोकादायक चुका केल्या आहेत, {name}. पूर्ण शून्य चुकांसोबत १००% गुण मिळवण्यासाठी तुम्हाला पुन्हा परीक्षा द्यायला आवडेल का?",
      actionQuestion: "नवीन संदेश प्राप्त झाला",
      btnIgnore: "संदेश हटवा",
      btnOpen: "लिंकवर क्लिक करा",
      sandboxWarning: "⚠️ सिम्युलेशन मोड",
      introAudio: "ओटीपी सिम्युलेटरमध्ये आपले स्वागत आहे. चला खतरनाक वेबसाइट कशा ओळखाव्या आणि आपला पासवर्ड कसा सुरक्षित ठेवावा हे शिकूया.",
      hubAudio: "सराव करण्यासाठी श्रेणी निवडा. टॅक्स, बँक केवायसी, किंवा यूपीआय."
    }
  };
  const ui = tx[language] || tx['en'];

  // --- LOGIC HANDLERS ---
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setCurrentScenarioIdx(0);
    setScore(0);
    setStep('quiz');
    setSubStep('sms');
    setShowResult(false);
    setInputVal('');
    setInputVal2('');
    setInputVal3('');
  };

  const handleDecisionSecure = () => {
    const scenario = activeScenarios[currentScenarioIdx];
    if (scenario.isLegitimate) {
      setIsCorrect(false);
      let audioText = `${ui.wrongTitle}. ${ui.whyWrong} ${scenario.consequenceWrong}`;
      playAudio(audioText, language);
    } else {
      setIsCorrect(true);
      setScore(score + 1);
      let audioText = `${ui.correctTitle}. ${ui.whyCorrect} ${scenario.explanationRight}`;
      playAudio(audioText, language);
    }
    setShowResult(true);
  };

  const handleDecisionOpenLink = () => {
    setSubStep('sandbox');
    setInputVal('');
    setInputVal2('');
    setInputVal3('');
  };

  const handleSandboxSubmit = () => {
    const scenario = activeScenarios[currentScenarioIdx];
    if (scenario.isLegitimate) {
      setIsCorrect(true);
      setScore(score + 1);
      let audioText = `${ui.correctTitle}. ${ui.whyCorrect} ${scenario.explanationRight}`;
      playAudio(audioText, language);
    } else {
      setIsCorrect(false);
      let audioText = `${ui.wrongTitle}. ${ui.whyWrong} ${scenario.consequenceWrong}`;
      playAudio(audioText, language);
    }
    setShowResult(true);
  };

  const nextScenario = () => {
    if (currentScenarioIdx < activeScenarios.length - 1) {
      setCurrentScenarioIdx(currentScenarioIdx + 1);
      setSubStep('sms');
      setShowResult(false);
      setInputVal('');
      setInputVal2('');
      setInputVal3('');
    } else {
      setStep('final');
    }
  };


  // --- VIEWS ---

  const renderIntro = () => {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem 3rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: '1rem', animation: 'slideInLeft 0.5s ease-out' }}>
          <PageAudioButton text={ui.introAudio} />
        </div>
        <Lock size={48} color="#EF4444" style={{ marginBottom: '0.8rem', display: 'inline-block', animation: 'scaleIn 0.5s ease-out' }} />
        <h2 className="title-xl" style={{ marginBottom: '1rem', color: 'var(--accent-blue)', fontSize: '2.2rem', animation: 'slideInRight 0.5s ease-out' }}>{ui.title}</h2>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem 2rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid var(--glass-border)', animation: 'scaleIn 0.6s ease-out', boxShadow: 'var(--glass-shadow)' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>{ui.introBasic}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'left' }}>
            <div style={{ background: theme === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', padding: '1.2rem', borderRadius: '0.8rem', transform: 'translateY(20px)', opacity: 0, animation: 'slideUpFade 0.5s forwards 0.3s' }}>
              <h3 style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontSize: '1rem' }}><ShieldCheck size={20} /> Advanced</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>{ui.rule1}</p>
            </div>
            <div style={{ background: theme === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.15)', border: '1px solid #3B82F6', padding: '1.2rem', borderRadius: '0.8rem', transform: 'translateY(20px)', opacity: 0, animation: 'slideUpFade 0.5s forwards 0.5s' }}>
              <h3 style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontSize: '1rem' }}><Globe size={20} /> Identity</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>{ui.rule2}</p>
            </div>
            <div style={{ background: theme === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', padding: '1.2rem', borderRadius: '0.8rem', transform: 'translateY(20px)', opacity: 0, animation: 'slideUpFade 0.5s forwards 0.7s' }}>
              <h3 style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontSize: '1rem' }}><AlertTriangle size={20} /> Critical</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>{ui.rule3}</p>
            </div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', fontSize: '1.2rem', padding: '1rem', borderRadius: '3rem', transform: 'translateY(20px)', opacity: 0, animation: 'slideUpFade 0.5s forwards 0.9s', transition: 'all 0.3s ease' }} onClick={() => setStep('hub')}>
          {ui.startBtn} <ArrowRight size={24} style={{ marginLeft: '10px', animation: 'bounceX 2s infinite' }} />
        </button>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideUpFade { to { opacity: 1; transform: translateY(0); } }
          @keyframes bounceX { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
          @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        `}} />
      </div>
    );
  };

  const renderHub = () => {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <PageAudioButton text={ui.hubAudio} />
        <h3 style={{ fontSize: '2rem', marginBottom: '3rem', color: 'var(--text-primary)' }}>{ui.hubTitle}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div onClick={() => handleCategorySelect('tax')} style={{ background: 'var(--bg-secondary)', borderRadius: '24px', padding: '2rem', cursor: 'pointer', border: '2px solid var(--glass-border)', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: 'var(--glass-shadow)' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.transform = 'translateY(-10px)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <Landmark size={60} color="#10B981" />
            <h4 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{ui.hubTax}</h4>
          </div>
          <div onClick={() => handleCategorySelect('kyc')} style={{ background: 'var(--bg-secondary)', borderRadius: '24px', padding: '2rem', cursor: 'pointer', border: '2px solid var(--glass-border)', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: 'var(--glass-shadow)' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.transform = 'translateY(-10px)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <ShieldAlert size={60} color="#EF4444" />
            <h4 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{ui.hubKYC}</h4>
          </div>
          <div onClick={() => handleCategorySelect('upi')} style={{ background: 'var(--bg-secondary)', borderRadius: '24px', padding: '2rem', cursor: 'pointer', border: '2px solid var(--glass-border)', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: 'var(--glass-shadow)' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.transform = 'translateY(-10px)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <Wallet size={60} color="#F59E0B" />
            <h4 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{ui.hubUPI}</h4>
          </div>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    const scenario = activeScenarios[currentScenarioIdx];
    const quizAudioText = subStep === 'sms' 
      ? `Scenario ${currentScenarioIdx + 1}. Sender: ${scenario.sender}. Message: ${scenario.content}. ${ui.actionQuestion}.` 
      : `${scenario.sandbox.title}. ${scenario.sandbox.inputLabel}`;

    return (
      <div className="animate-fade-in" style={{ display: 'flex', gap: '1.5rem', height: '100%', alignItems: 'stretch' }}>
        <div style={{ flex: '7', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-nav-bg)', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7 }}>{activeCategory} : {currentScenarioIdx + 1} / {activeScenarios.length}</span>
            <PageAudioButton text={quizAudioText} />
          </div>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', overflowY: 'auto', position: 'relative' }}>
            <div style={{ width: '100%', maxWidth: '360px', flex: 1, minHeight: '500px', maxHeight: '720px', background: '#000000', borderRadius: '40px', border: '12px solid var(--bg-primary)', position: 'relative', boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.4)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: subStep === 'sms' ? '#F3F4F6' : '#FFFFFF', color: '#000000', padding: '10px 20px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 10, flexShrink: 0 }}>
                 <span>11:42 AM</span>
                 <div style={{ width: '80px', height: '20px', background: '#000000', borderRadius: '15px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '10px' }}></div>
                 <span>5G 🔋</span>
              </div>
              {subStep === 'sms' ? (
                <div className="animate-fade-in" style={{ flex: 1, background: '#F3F4F6', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  <div style={{ background: '#F3F4F6', padding: '15px', textAlign: 'center', borderBottom: '1px solid #D1D5DB', flexShrink: 0 }}>
                    <div style={{ width: '40px', height: '40px', background: '#9CA3AF', borderRadius: '50%', margin: '0 auto 8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FFF' }}>
                      <MessageCircle size={20} />
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#111827', fontWeight: 'bold' }}>{scenario.sender}</span>
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    <div style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.8rem', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase' }}>{ui.actionQuestion || "New Message Received"}</div>
                    <div style={{ background: '#E5E7EB', padding: '15px', borderRadius: '18px 18px 18px 4px', fontSize: '1rem', lineHeight: '1.5', color: '#111827', maxWidth: '85%', marginBottom: '20px', position: 'relative' }}>{scenario.content}</div>
                  </div>
                  <div style={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', flexShrink: 0, paddingBottom: '20px', padding: '20px', gap: '10px' }}>
                    <button 
                      style={{ 
                        padding: '16px', 
                        background: '#3B82F6', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#FFFFFF', 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold', 
                        cursor: showResult ? 'not-allowed' : 'pointer', 
                        opacity: showResult ? 0.5 : 1, 
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                      }} 
                      onMouseOver={(e) => { if(!showResult) e.currentTarget.style.transform = 'scale(1.02)' }} 
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }} 
                      onClick={handleDecisionOpenLink} 
                      disabled={showResult}
                    >
                      {ui.btnOpen}
                    </button>
                    <button 
                      style={{ 
                        padding: '16px', 
                        background: '#EF4444', 
                        border: 'none', 
                        borderRadius: '12px',
                        color: '#FFFFFF', 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold', 
                        cursor: showResult ? 'not-allowed' : 'pointer', 
                        opacity: showResult ? 0.5 : 1, 
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)'
                      }} 
                      onMouseOver={(e) => { if(!showResult) e.currentTarget.style.transform = 'scale(1.02)' }} 
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }} 
                      onClick={handleDecisionSecure} 
                      disabled={showResult}
                    >
                      {ui.btnIgnore}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in" style={{ flex: 1, background: '#FFFFFF', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  <div style={{ background: '#F8FAFC', padding: '15px 15px 10px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ background: '#E2E8F0', flex: 1, padding: '8px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                         <Lock size={14} color="#64748B" /> 
                         <span style={{ fontSize: '0.9rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scenario.sandbox.fakeUrl}</span>
                      </div>
                  </div>
                  <div style={{ padding: '30px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
                    <h4 style={{ color: '#0F172A', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>{scenario.sandbox.title}</h4>
                    {(() => {
                      const delimiters = [", ", " & ", " और ", " आणि "];
                      let labelText = scenario.sandbox.inputLabel;
                      delimiters.forEach(d => { labelText = labelText.split(d).join("###"); });
                      let fieldLabels = labelText.split("###").filter(l => l.trim().length > 0);
                      fieldLabels = fieldLabels.map(l => l.trim().replace(/^Enter\s+/i, '').replace(/^दर्ज करें\s+/i, ''));
                      const inputs = [inputVal, inputVal2, inputVal3];
                      const setters = [setInputVal, setInputVal2, setInputVal3];
                      const allFieldsFilled = fieldLabels.every((_, i) => (inputs[i] || "").trim() !== '');
                      return (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', flexShrink: 0 }}>
                          {fieldLabels.map((lbl, idx) => (
                            <div key={idx} style={{ width: '100%' }}>
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', color: '#334155', fontWeight: '500' }}>{lbl.endsWith(':') ? lbl : lbl + ':'}</label>
                              <input type={(lbl.toLowerCase().includes('password') || lbl.toLowerCase().includes('pin') || scenario.category === 'upi') ? "password" : "text"} value={inputs[idx] || ""} onChange={(e) => setters[idx](e.target.value)} placeholder="..." disabled={showResult} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1.2rem', background: showResult ? '#F8FAFC' : '#FFFFFF', outline: 'none' }} />
                            </div>
                          ))}
                          <button style={{ width: '100%', background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '10px', opacity: (showResult || !allFieldsFilled) ? 0.5 : 1, cursor: (showResult || !allFieldsFilled) ? 'not-allowed' : 'pointer', flexShrink: 0 }} onClick={handleSandboxSubmit} disabled={showResult || !allFieldsFilled}>{scenario.sandbox.btnText}</button>
                        </div>
                      );
                    })()}
                    <p style={{ marginTop: 'auto', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 'bold', padding: '20px 0' }}>{ui.sandboxWarning}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ flex: '3', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--glass-border)', padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {!showResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-primary)', textAlign: 'center', opacity: 0.5 }}>
              <Info size={60} style={{ marginBottom: '1.5rem' }} />
              <p style={{ fontSize: '1.2rem' }}>{ui.sidePanelWait}</p>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                {isCorrect ? <ShieldCheck color="#10B981" size={48} style={{ flexShrink: 0 }} /> : <ShieldX color="#EF4444" size={48} style={{ flexShrink: 0, animation: 'bounce 1s infinite' }} />}
                <h3 style={{ color: isCorrect ? '#10B981' : '#EF4444', fontSize: '1.6rem', margin: 0 }}>{isCorrect ? ui.correctTitle : ui.wrongTitle}</h3>
              </div>
              <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {!isCorrect && scenario.consequenceWrong && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #EF4444' }}>
                    <p style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{ui.whyWrong}</p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-line' }}>{scenario.consequenceWrong}</p>
                  </div>
                )}
                {isCorrect && scenario.explanationRight && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #10B981' }}>
                    <p style={{ color: '#10B981', fontSize: '0.85rem', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{ui.whyCorrect}</p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-line' }}>{scenario.explanationRight}</p>
                  </div>
                )}
              </div>
              {scenario.redFlags && scenario.redFlags.length > 0 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #EF4444', padding: '1rem 1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', fontWeight: 'bold', marginBottom: '0.8rem' }}><AlertTriangle size={18} /> {ui.redFlags}</span>
                  <ul style={{ color: 'var(--text-primary)', fontSize: '0.95rem', paddingLeft: '1.5rem', margin: 0, lineHeight: '1.5', opacity: 0.9 }}>
                    {scenario.redFlags.map((flag, idx) => <li key={idx} style={{ marginBottom: '0.4rem' }}>{flag}</li>)}
                  </ul>
                </div>
              )}
              <button className="btn btn-primary" style={{ marginTop: 'auto', padding: '1.2rem', width: '100%', fontSize: '1.1rem', borderRadius: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={nextScenario}>{ui.nextScenario} <ArrowRight size={20} /></button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFinal = () => {
    let userName = 'User';
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.name) userName = storedUser.name;
    } catch { /* ignore */ }
    const isPerfect = score === activeScenarios.length;
    let message = isPerfect ? ui.perfectScore : ui.imperfectScore;
    message = message.replace('{name}', userName);
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <PageAudioButton text={`${ui.scoreText}. ${message}. Your score is ${score} out of ${activeScenarios.length}.`} />
        {isPerfect ? <ShieldCheck size={100} color="#10B981" style={{ marginBottom: '2rem', display: 'inline-block' }} /> : <ShieldX size={100} color="#F59E0B" style={{ marginBottom: '2rem', display: 'inline-block' }} />}
        <h2 className="title-lg" style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{ui.scoreText}</h2>
        <p style={{ fontSize: '1.4rem', color: 'var(--text-primary)', opacity: 0.7, marginBottom: '1rem' }}>Score: <strong style={{ color: isPerfect ? '#10B981' : '#F59E0B' }}>{score}</strong> out of <strong style={{ color: 'var(--text-primary)' }}>{activeScenarios.length}</strong></p>
        <div style={{ background: isPerfect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2.5rem' }}>
           <p style={{ fontSize: '1.2rem', color: isPerfect ? '#6EE7B7' : '#FCD34D', margin: 0 }}>{message}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexDirection: 'column' }}>
          {!isPerfect && (
             <button className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', borderRadius: '30px' }} onClick={() => { setCurrentScenarioIdx(0); setScore(0); setSubStep('sms'); setShowResult(false); setStep('quiz') }}>{ui.tryAgainBtn}</button>
          )}
          <button className={isPerfect ? "btn btn-primary" : "btn btn-outline"} style={{ padding: '1.2rem', fontSize: '1.1rem', borderRadius: '30px' }} onClick={() => markLevelComplete(4, navigate)}>{ui.returnBtn}</button>
        </div>
      </div>
    );
  };

  return (
    <div className="module-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary, #020617)', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-link" onClick={() => { if(step === 'quiz') setStep('hub'); else if(step === 'hub') setStep('intro'); else navigate('/banking'); }} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}><ArrowLeft size={24} /> Back</button>
          <h2 className="title-lg" style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.6rem' }}>{ui.title}</h2>
        </div>
        <LanguageSelector />
      </header>
      <div style={{ flex: 1, minHeight: 0 }}>{step === 'intro' ? renderIntro() : step === 'hub' ? renderHub() : step === 'quiz' ? renderQuiz() : renderFinal()}</div>
    </div>
  );
};

export default OtpSimulator;
