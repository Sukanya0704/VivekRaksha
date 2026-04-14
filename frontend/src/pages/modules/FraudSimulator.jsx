import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, ShieldCheck, ShieldX, PhoneIncoming, MessageSquareWarning, ArrowRight, Smartphone, Globe, MessageCircle, AlertTriangle, Info, PlayCircle } from 'lucide-react';
import PageAudioButton from '../../components/PageAudioButton';
import { playAudio } from '../../utils/audio';
import { scenariosData } from '../../data/fraudScenarios';
import { markLevelComplete } from '../../utils/levelProgress';
import LanguageSelector from '../../components/LanguageSelector';

const FraudSimulatorNew = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const scenarios = scenariosData[language] || scenariosData['en'];

  const [step, setStep] = useState('intro'); // intro, quiz, final

  // Localization Helpers
  const tx = {
    en: {
      awarenessTitle: "Digital Banking & Fraud Awareness",
      awarenessBasic: "Modern banking happens on your phone using platforms like UPI (GPay, PhonePe) and NetBanking. They make life easy, but scammers also use technology to steal.",
      awarenessRule1: "Rule 1: Don't trust Caller ID. Scammers spoof numbers to look like your bank.",
      awarenessRule2: "Rule 2: Never install remote apps (AnyDesk) on caller's request.",
      awarenessRule3: "Rule 3: You NEVER need your UPI PIN to 'receive' money.",
      startBtn: "Start Interactive Training",
      sidePanelWait: "Make a decision on the left to see the detailed analysis here.",
      sidePanelTitle: "Result Analysis",
      correctTitle: "Correct Choice!",
      wrongTitle: "Dangerous Mistake!",
      redFlags: "Red Flags Detected:",
      whyWrong: "Consequence of mistake:",
      whyCorrect: "Why you are safe:",
      watchGuide: "Understand How This Scam Works",
      nextScenario: "Next Scenario",
      scoreText: "Training Complete!",
      returnBtn: "Back to Dashboard",
      tryAgainBtn: "Retest Simulation",
      introAudio: "Welcome to Digital Fraud Awareness. Modern banking uses platforms like UPI and NetBanking. They are safe, but scammers try to trick you. Rule 1: Never share OTP or UPI PIN. Rule 2: Never click unknown SMS links. Rule 3: Fake urgency is always a scam. Let's begin the interactive training.",
      perfectScore: "Excellent work, {name}! You scored 100% and are completely secure from cyber frauds!",
      imperfectScore: "You made some dangerous mistakes, {name}. Would you like to retake the test to achieve a perfect score?"
    },
    hi: {
      awarenessTitle: "डिजिटल बैंकिंग और धोखाधड़ी जागरूकता",
      awarenessBasic: "आजकल बैंकिंग आपके फोन पर यूपीआई (जैसे जी-पे, फोन-पे) और नेटबैंकिंग के जरिए होती है। वे जीवन को आसान बनाते हैं, लेकिन ठग भी चोरी करने के लिए तकनीक का उपयोग करते हैं।",
      awarenessRule1: "नियम १: फोन करने वाले के नंबर पर भरोसा न करें। ठग बैंक नंबर की नकल करते हैं।",
      awarenessRule2: "नियम २: कॉल करने वाले के अनुरोध पर स्क्रीन साझा करने वाला ऐप (जैसे एनीडेस्क) कभी इंस्टॉल न करें।",
      awarenessRule3: "नियम ३: पैसा 'प्राप्त' करने के लिए आपको कभी भी यूपीआई पिन की आवश्यकता नहीं होती।",
      startBtn: "इंटरैक्टिव प्रशिक्षण शुरू करें",
      sidePanelWait: "विस्तृत विश्लेषण यहाँ देखने के लिए बाईं ओर निर्णय लें।",
      sidePanelTitle: "परिणाम विश्लेषण",
      correctTitle: "सही विकल्प!",
      wrongTitle: "खतरनाक गलती!",
      redFlags: "खतरे के संकेत:",
      whyWrong: "गलती का परिणाम:",
      whyCorrect: "आप सुरक्षित क्यों हैं:",
      watchGuide: "समझें कि यह घोटाला कैसे काम करता है",
      nextScenario: "अगला परिदृश्य",
      scoreText: "प्रशिक्षण पूर्ण!",
      returnBtn: "डैशबोर्ड पर वापस लौटें",
      tryAgainBtn: "पुनः अभ्यास करें",
      introAudio: "डिजिटल धोखाधड़ी जागरूकता में आपका स्वागत है। आजकल बैंकिंग आपके फोन पर यूपीआई के माध्यम से होती है। वे सुरक्षित हैं, लेकिन ठग आपको बरगलाने की कोशिश करते हैं। नियम १: ओटीपी या यूपीआई पिन कभी साझा न करें। नियम २: अज्ञात एसएमएस लिंक पर कभी क्लिक न करें। नियम ३: झूठी जल्दबाजी हमेशा एक घोटाला है।",
      perfectScore: "बहुत बढ़िया काम, {name}! आपने सभी अंक प्राप्त किए हैं और आप साइबर धोखाधड़ी से पूरी तरह सुरक्षित हैं!",
      imperfectScore: "आपने कुछ खतरनाक गलतियाँ की हैं, {name}। क्या आप पूर्ण अंक प्राप्त करने के लिए फिर से अभ्यास करना चाहेंगे?"
    },
    mr: {
      awarenessTitle: "डिजिटल बँकिंग आणि फसवणूक जागरूकता",
      awarenessBasic: "आधुनिक बँकिंग तुमच्या फोनवर यूपीआय (उदा. जी-पे, फोन-पे) आणि नेटबँकिंग वापरून केली जाते. ते जीवन सोपे करतात, परंतु फसवणूक करणारे चोरी करण्यासाठी तंत्रज्ञानाचा वापर करतात.",
      awarenessRule1: "नियम १: फोन करणाऱ्या व्यक्तीच्या नंबरवर विश्वास ठेवू नका. ठग बँकेच्या नंबरची हुबेहूब कॉपी करतात.",
      awarenessRule2: "नियम २: फोनवरील व्यक्तीच्या सांगण्यावरून स्क्रीन शेअरिंग अॅप (उदा. एनीडेस्क) कधीही स्थापित करू नका.",
      awarenessRule3: "नियम ३: पैसे 'मिळवण्यासाठी' तुम्हाला कधीही यूपीआय पिन टाकण्याची गरज नसते.",
      startBtn: "इंटरॅक्टिव्ह प्रशिक्षण सुरू करा",
      sidePanelWait: "सविस्तर विश्लेषण पाहण्यासाठी डावीकडे निर्णय घ्या.",
      sidePanelTitle: "परिणाम विश्लेषण",
      correctTitle: "प्रचंड बरोबर!",
      wrongTitle: "भयानक चूक!",
      redFlags: "धोक्याची चिन्हे:",
      whyWrong: "चुकीचा परिणाम:",
      whyCorrect: "तुम्ही सुरक्षित का आहात:",
      watchGuide: "हा घोटाळा कसा होतो ते समजून घ्या",
      nextScenario: "पुढील परिदृश्य",
      scoreText: "प्रशिक्षण पूर्ण!",
      returnBtn: "डॅशबोर्डवर परत जा",
      tryAgainBtn: "पुन्हा सराव करा",
      introAudio: "डिजिटल फसवणूक जागरूकता मध्ये आपले स्वागत आहे. अत्याधुनिक बँकिंग तुमच्या फोनवर होते. नियम १: कधीही ओटीपी किंवा यूपीआय पिन देऊ नका. नियम २: मेसेज मधील अनोळखी लिंक उघडू नका. नियम ३: कोणी अति घाई दाखवत असेल तर तो घोटाळा आहे.",
      perfectScore: "उत्कृष्ट काम, {name}! तुम्हाला पूर्ण १००% गुण मिळाले आहेत आणि तुम्ही सायबर फसवणुकीपासून पूर्णपणे सुरक्षित आहात!",
      imperfectScore: "तुम्ही काही धोकादायक चुका केल्या आहेत, {name}. पूर्ण १००% गुण मिळवण्यासाठी तुम्हाला पुन्हा सराव करायला आवडेल का?"
    }
  };
  const ui = tx[language] || tx['en'];

  const handleDecision = (correctDecisionMade) => {
    const scenario = scenarios[currentScenario];
    setIsCorrect(correctDecisionMade);
    if (correctDecisionMade) setScore(score + 1);
    setShowResult(true);

    // Auto-play audio representing the side panel evaluation
    let resultText = correctDecisionMade ? ui.correctTitle : ui.wrongTitle;
    if (!correctDecisionMade && scenario.consequenceWrong) resultText += ". " + ui.whyWrong + " " + scenario.consequenceWrong;
    if (correctDecisionMade && scenario.explanationRight) resultText += ". " + ui.whyCorrect + " " + scenario.explanationRight;
    if (scenario.redFlags && scenario.redFlags.length > 0) resultText += ` ${ui.redFlags} ${scenario.redFlags.join(". ")}.`;
    
    playAudio(resultText, language);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setShowResult(false);
    } else {
      setStep('final');
    }
  };

  const renderIntro = () => {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem 3rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: '1rem', animation: 'slideInLeft 0.5s ease-out' }}>
          <PageAudioButton text={ui.introAudio} />
        </div>
        
        <h2 className="title-xl" style={{ marginBottom: '1rem', color: 'var(--accent-blue)', fontSize: '2.2rem', animation: 'slideInRight 0.5s ease-out' }}>
          <Globe size={36} style={{ verticalAlign: 'middle', marginRight: '15px' }} />
          {ui.awarenessTitle}
        </h2>
        
        <div style={{ 
          background: 'var(--bg-secondary)', 
          padding: '1.5rem 2rem', 
          borderRadius: '1rem', 
          marginBottom: '1.5rem', 
          border: '1px solid var(--glass-border)', 
          animation: 'scaleIn 0.6s ease-out',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            {ui.awarenessBasic}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'left' }}>
            <div style={{ 
              background: theme === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)', 
              border: '1px solid #10B981', 
              padding: '1.2rem', 
              borderRadius: '0.8rem', 
              transform: 'translateY(20px)', 
              opacity: 0, 
              animation: 'slideUpFade 0.5s forwards 0.3s' 
            }}>
              <h3 style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontSize: '1rem' }}><ShieldCheck size={20} /> Advanced</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>{ui.awarenessRule1}</p>
            </div>
            <div style={{ 
              background: theme === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.2)', 
              border: '1px solid #EF4444', 
              padding: '1.2rem', 
              borderRadius: '0.8rem', 
              transform: 'translateY(20px)', 
              opacity: 0, 
              animation: 'slideUpFade 0.5s forwards 0.5s' 
            }}>
              <h3 style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontSize: '1rem' }}><AlertTriangle size={20} /> Critical</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>{ui.awarenessRule2}</p>
            </div>
            <div style={{ 
              background: theme === 'light' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.2)', 
              border: '1px solid #F59E0B', 
              padding: '1.2rem', 
              borderRadius: '0.8rem', 
              transform: 'translateY(20px)', 
              opacity: 0, 
              animation: 'slideUpFade 0.5s forwards 0.7s' 
            }}>
              <h3 style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontSize: '1rem' }}><MessageCircle size={20} /> Important</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>{ui.awarenessRule3}</p>
            </div>
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', fontSize: '1.2rem', padding: '1rem', borderRadius: '3rem', transform: 'translateY(20px)', opacity: 0, animation: 'slideUpFade 0.5s forwards 0.9s', transition: 'all 0.3s ease' }} 
          onClick={() => setStep('quiz')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {ui.startBtn} <ArrowRight size={24} style={{ marginLeft: '10px', animation: 'bounceX 2s infinite' }} />
        </button>

        {/* Dynamic Keyframes for smooth UI entrance */}
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

  const renderQuiz = () => {
    const scenario = scenarios[currentScenario];
    const quizAudioText = `Scenario ${currentScenario + 1}. Sender: ${scenario.sender}. Content: ${scenario.content}. Please select an action. Option 1: ${scenario.actionPositive.text}. Option 2: ${scenario.actionNegative.text}.`;

    return (
      <div className="animate-fade-in" style={{ display: 'flex', gap: '1.5rem', height: '100%', alignItems: 'stretch' }}>
        
        {/* LEFT PANEL: Interactive Center (70%) */}
        <div style={{ flex: '7', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-nav-bg)', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', opacity: 0.7 }}>Progress: {currentScenario + 1} / {scenarios.length}</span>
            <PageAudioButton text={quizAudioText} />
          </div>

          {/* Interactive Simulation Area */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', overflowY: 'auto' }}>
            
            {/* Phone/Message UI Wrapper */}
            {scenario.type === 'sms' ? (
              <div style={{ width: '400px', maxWidth: '100%', background: '#F3F4F6', color: '#111827', borderRadius: '24px', padding: '1rem', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid #D1D5DB', paddingBottom: '12px', marginBottom: '16px', fontSize: '1rem', color: '#4B5563', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={18} /> {scenario.sender}
                </div>
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', fontSize: '1.1rem', lineHeight: '1.5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  {scenario.content}
                </div>
              </div>
            ) : (
              <div style={{ width: '350px', height: '450px', background: '#0F172A', border: '4px solid #1E293B', color: 'white', borderRadius: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: '#10B981', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'inline-block', animation: 'bounce 1s infinite' }}>
                    <PhoneIncoming size={50} color="#FFFFFF" />
                  </div>
                  <p style={{ opacity: 0.7, marginBottom: '0.5rem' }}>Incoming Call...</p>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{scenario.sender}</h4>
                </div>
                <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', fontSize: '1rem', width: '100%', textAlign: 'center', fontStyle: 'italic', color: '#94A3B8' }}>
                  "{scenario.content}"
                </div>
              </div>
            )}

            {/* Action Buttons Layer */}
            <div style={{ marginTop: '3rem', width: '100%', maxWidth: '600px' }}>
              <h4 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)', fontSize: '1.2rem' }}>What action will you take?</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[scenario.actionPositive, scenario.actionNegative]
                  .map((action, idx) => ({ action, idx }))
                  .sort((a, b) => (currentScenario % 2 === 1 ? b.idx - a.idx : a.idx - b.idx))
                  .map(({ action }) => (
                    <button 
                      key={action.text}
                      className="btn" 
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        color: 'var(--text-primary)', 
                        padding: '1.2rem', 
                        borderRadius: '12px', 
                        fontSize: '1.1rem', 
                        textAlign: 'center', 
                        border: '1px solid var(--glass-border)', 
                        transition: 'all 0.2s', 
                        opacity: showResult ? 0.5 : 1, 
                        cursor: showResult ? 'not-allowed' : 'pointer',
                        boxShadow: 'var(--glass-shadow)'
                      }} 
                      onClick={() => handleDecision(action.isCorrect)} 
                      disabled={showResult}
                    >
                      {action.text}
                    </button>
                  ))}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL: Side Pop-out Support Panel (30%) */}
        <div style={{ flex: '3', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--glass-border)', padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {!showResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-primary)', textAlign: 'center', opacity: 0.5 }}>
              <Info size={60} style={{ marginBottom: '1.5rem' }} />
              <p style={{ fontSize: '1.2rem' }}>{ui.sidePanelWait}</p>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
              
              {/* Outcome Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                {isCorrect ? <ShieldCheck color="#10B981" size={48} /> : <ShieldX color="#EF4444" size={48} />}
                <h3 style={{ color: isCorrect ? '#10B981' : '#EF4444', fontSize: '1.6rem', margin: 0 }}>
                  {isCorrect ? ui.correctTitle : ui.wrongTitle}
                </h3>
              </div>

              {/* Detailed Explanation */}
              <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Show what happens if you fall for it (Only if Wrong) */}
                {!isCorrect && scenario.consequenceWrong && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #EF4444' }}>
                    <p style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                      {ui.whyWrong}
                    </p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-line' }}>
                      {scenario.consequenceWrong}
                    </p>
                  </div>
                )}

                {/* Show how to stay safe / identify truth (Only if Correct) */}
                {isCorrect && scenario.explanationRight && (
                  <div style={{ padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid #10B981', background: theme === 'light' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)' }}>
                    <p style={{ color: '#10B981', fontSize: '0.85rem', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                      {ui.whyCorrect}
                    </p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-line' }}>
                      {scenario.explanationRight}
                    </p>
                  </div>
                )}
              </div>

              {/* Red Flags Block */}
              {scenario.redFlags && scenario.redFlags.length > 0 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #EF4444', padding: '1rem 1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', fontWeight: 'bold', marginBottom: '0.8rem' }}>
                    <AlertTriangle size={18} /> {ui.redFlags}
                  </span>
                  <ul style={{ color: 'var(--text-primary)', fontSize: '0.95rem', paddingLeft: '1.5rem', margin: 0, lineHeight: '1.5', opacity: 0.9 }}>
                    {scenario.redFlags.map((flag, idx) => <li key={idx} style={{ marginBottom: '0.4rem' }}>{flag}</li>)}
                  </ul>
                </div>
              )}

              {/* Contextual Video Suggestion (If Wrong or If Configured) */}
              {(!isCorrect && scenario.videoId) && (
                <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--accent-blue)', marginBottom: '2rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', fontWeight: 'bold', marginBottom: '1rem' }}>
                    <PlayCircle size={20} /> {ui.watchGuide}
                  </span>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '0.5rem' }}>
                    <iframe 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                      src={`https://www.youtube.com/embed/${scenario.videoId}`} 
                      title="Contextual Scam Explanation" 
                      frameBorder="0" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Next Button */}
              <button 
                className="btn btn-primary" 
                style={{ marginTop: 'auto', padding: '1.2rem', width: '100%', fontSize: '1.1rem', borderRadius: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} 
                onClick={nextScenario}
              >
                {ui.nextScenario} <ArrowRight size={20} />
              </button>

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
    } catch(e) {}

    const isPerfect = score === scenarios.length;
    let message = isPerfect ? ui.perfectScore : ui.imperfectScore;
    message = message.replace('{name}', userName);

    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <PageAudioButton text={`${ui.scoreText}. ${message}. Your score is ${score} out of ${scenarios.length}.`} />
        
        {isPerfect ? (
          <ShieldCheck size={100} color="#10B981" style={{ marginBottom: '2rem', display: 'inline-block' }} />
        ) : (
          <ShieldX size={100} color="#F59E0B" style={{ marginBottom: '2rem', display: 'inline-block' }} />
        )}
        
        <h2 className="title-lg" style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{ui.scoreText}</h2>
        <p style={{ fontSize: '1.4rem', color: 'var(--text-primary)', opacity: 0.7, marginBottom: '1rem' }}>
          Score: <strong style={{ color: isPerfect ? '#10B981' : '#F59E0B' }}>{score}</strong> out of <strong style={{ color: 'var(--text-primary)' }}>{scenarios.length}</strong>
        </p>

        <div style={{ background: isPerfect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2.5rem' }}>
           <p style={{ fontSize: '1.2rem', color: isPerfect ? '#6EE7B7' : '#FCD34D', margin: 0 }}>
             {message}
           </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexDirection: 'column' }}>
          {!isPerfect && (
            <button className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', borderRadius: '30px' }} onClick={() => { setStep('intro'); setCurrentScenario(0); setScore(0); setShowResult(false); }}>
              {ui.tryAgainBtn}
            </button>
          )}
          <button className={isPerfect ? "btn btn-primary" : "btn btn-outline"} style={{ padding: '1.2rem', fontSize: '1.1rem', borderRadius: '30px' }} onClick={() => markLevelComplete(3, navigate)}>
            {ui.returnBtn}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="module-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary, #020617)', padding: '2rem' }}>
      {/* Header */}
      <header style={{ marginBottom: '2rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-link" onClick={() => navigate('/banking')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
            <ArrowLeft size={24} /> Back
          </button>
          <h2 className="title-lg" style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.6rem' }}>{ui.awarenessTitle}</h2>
        </div>
        <LanguageSelector />
      </header>

      {/* Dynamic Content Area */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {step === 'intro' ? renderIntro() : step === 'quiz' ? renderQuiz() : renderFinal()}
      </div>
    </div>
  );
};

export default FraudSimulatorNew;
