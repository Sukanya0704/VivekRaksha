import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, ShieldCheck, ShieldX, PhoneIncoming, MessageSquareWarning, ArrowRight } from 'lucide-react';
import PageAudioButton from '../../components/PageAudioButton';
import { playAudio } from '../../utils/audio';

const FraudSimulator = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const scenariosData = {
    en: [
      { type: 'sms', content: "DEAR CUSTOMER, YOUR BANK ACCOUNT IS LOCKED DUE TO KYC PENDING. CLICK HERE TO UPDATE IMMEDIATELY: http://update-kyc-bank.net/login", sender: "BK-BANKSMS", redFlags: ["Urgent tone (IMMEDIATELY)", "Spelling/Grammar issues", "Suspicious URL"], isScam: true },
      { type: 'call', content: "Hello sir, you have been selected for a lottery prize of ₹25 Lakhs from KBC! To claim it, we just need you to pay a processing fee of ₹10,000 via UPI.", sender: "+91 98765 00000", redFlags: ["Asking for upfront payment", "Too good to be true"], isScam: true },
      { type: 'sms', content: "Your electricity connection will be disconnected tonight at 9:30 PM. Call electricity officer at 9876512345.", sender: "MSEB-ALERT", redFlags: ["Urgent threat", "Personal 10-digit mobile number"], isScam: true },
      { type: 'call', content: "Hello, I am calling from State Bank. Your credit card reward points are expiring today. Please share the 6-digit OTP I just sent you.", sender: "+91 82345 61234", redFlags: ["Asking for OTP", "False urgency"], isScam: true },
      { type: 'sms', content: "Your transaction of ₹2,500 at Amazon.in was successful. If not done by you, report here: 1800-BANK-HELP", sender: "AMAZON", redFlags: [], isScam: false },
      { type: 'call', content: "Sir, your internet banking has been blocked. Please download the 'AnyDesk' app so we can unblock it remotely.", sender: "1800-FAKE-SUPPORT", redFlags: ["Asking to download remote desktop apps (AnyDesk)"], isScam: true }
    ],
    hi: [
      { type: 'sms', content: "प्रिय ग्राहक, KYC पेंडिंग होने के कारण आपका बैंक खाता लॉक कर दिया गया है। तुरंत अपडेट करने के लिए क्लिक करें: http://update-kyc-bank.net/login", sender: "BK-BANKSMS", redFlags: ["अत्यावश्यक स्वर (तुरंत)", "संदिग्ध URL"], isScam: true },
      { type: 'call', content: "नमस्ते सर, आपको KBC से 25 लाख की लॉटरी लगी है! इसे प्राप्त करने के लिए आपको ₹10,000 का टैक्स UPI द्वारा देना होगा।", sender: "+91 98765 00000", redFlags: ["पैसे मांगना", "लॉटरी का लालच"], isScam: true },
      { type: 'sms', content: "आपका पिछली महीने का बिल अपडेट नहीं हुआ है। आज रात 9:30 बजे बिजली काट दी जाएगी। तुरंत इस नंबर पर कॉल करें: 9876512345.", sender: "MSEB-ALERT", redFlags: ["बिजली काटने की धमकी", "मोबाइल नंबर पर कॉल करने को कहना"], isScam: true },
      { type: 'call', content: "स्टेट बैंक से बोल रहा हूँ। आपके रिवॉर्ड पॉइंट्स एक्सपायर हो रहे हैं, कृपया मुझे 6 अंकों का OTP बताएं।", sender: "+91 82345 61234", redFlags: ["OTP मांगना", "झूठी जल्दबाजी"], isScam: true },
      { type: 'sms', content: "Amazon.in पर ₹2,500 का आपका लेन-देन सफल रहा। यदि आपने नहीं किया है, तो यहां रिपोर्ट करें: 1800-BANK-HELP", sender: "AMAZON", redFlags: [], isScam: false },
      { type: 'call', content: "सर, आपका नेट बैंकिंग ब्लॉक हो गया है। मैं टेक सपोर्ट से हूँ, फोन ठीक करने के लिए 'AnyDesk' ऐप डाउनलोड करें।", sender: "1800-FAKE-SUPPORT", redFlags: ["AnyDesk ऐप डाउनलोड करने को कहना"], isScam: true }
    ],
    mr: [
      { type: 'sms', content: "प्रिय ग्राहक, KYC प्रलंबित असल्याने तुमचे बँक खाते लॉक केले आहे. त्वरित अपडेट करण्यासाठी येथे क्लिक करा: http://update-kyc-bank.net/login", sender: "BK-BANKSMS", redFlags: ["अत्यावश्यक स्वर", "संशयास्पद URL"], isScam: true },
      { type: 'call', content: "नमस्ते सर, तुम्हाला KBC कडून २५ लाखांची लॉटरी लागली आहे! ते मिळवण्यासाठी फक्त ₹१०,००० टॅक्स UPI द्वारे भरा.", sender: "+91 98765 00000", redFlags: ["पैसे भरायला सांगणे", "लॉटरीचे आमिष"], isScam: true },
      { type: 'sms', content: "मागील महिन्याचे बिल न भरल्यामुळे आज रात्री 9:30 वाजता तुमची वीज कापली जाईल. ताबडतोब 9876512345 वर कॉल करा.", sender: "MSEB-ALERT", redFlags: ["वीज कापण्याची धमकी", "मोबाईल नंबरवर कॉल करायला सांगणे"], isScam: true },
      { type: 'call', content: "मी स्टेट बँकेतून बोलत आहे. तुमचे रिवॉर्ड पॉईंट्स एक्सपायर होत आहेत, कृपया तुमच्या फोनवर आलेला OTP सांगा.", sender: "+91 82345 61234", redFlags: ["OTP मागणे", "खोटी घाई"], isScam: true },
      { type: 'sms', content: "Amazon.in वर तुमचा ₹2,500 चा व्यवहार यशस्वी झाला. तुम्ही केला नसल्यास, अहवाल द्या: 1800-BANK-HELP", sender: "AMAZON", redFlags: [], isScam: false },
      { type: 'call', content: "सर, तुमचे नेट बँकिंग ब्लॉक झाले आहे. 'AnyDesk' अॅप डाउनलोड करा म्हणजे आम्ही इथून ते अनब्लॉक करू.", sender: "1800-FAKE-SUPPORT", redFlags: ["AnyDesk अॅप डाउनलोड करायला सांगणे"], isScam: true }
    ]
  };

  const scenarios = scenariosData[language] || scenariosData['en'];

  const handleDecision = (decision) => {
    const scenario = scenarios[currentScenario];
    const correct = decision === scenario.isScam;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setShowResult(true);

    // Auto-play translation based result
    let resultText = correct ? t('fraudCorrect') : t('fraudIncorrect');
    resultText += scenario.isScam ? t('fraudMalicious') : t('fraudStandard');
    if (scenario.redFlags.length > 0) resultText += ` ${t('fraudRedFlags')} ${scenario.redFlags.join(". ")}.`;
    
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

  const [step, setStep] = useState('intro'); // intro, quiz, final

  const renderIntro = () => {
    // 12 Video Links: 4 for English, 4 for Hindi, 4 for Marathi
    const dynamicVideos = {
      en: ["FY8KDB0WRvI", "flbRef8Vktk", "7CZReZ24-to", "3Mso9F7HccU"],
      hi: ["FY8KDB0WRvI", "flbRef8Vktk", "7CZReZ24-to", "3Mso9F7HccU"],
      mr: ["FY8KDB0WRvI", "flbRef8Vktk", "7CZReZ24-to", "3Mso9F7HccU"]
    };

    const currentLangVideos = dynamicVideos[language] || dynamicVideos['en'];

    const speakText = `${t('fraudIntroTitle')}. ${t('fraudIntroSubtitle')}. ${t('watchKyc')}. ${t('kycDesc')}. ${t('watchElectricity')}. ${t('electricityDesc')}. ${t('watchTechSupport')}. ${t('techSupportDesc')}. ${t('watchBonus')}. ${t('bonusDesc')}. ${t('keyTakeaways')}. ${t('takeaway1')}. ${t('takeaway2')}. ${t('takeaway3')}.`;

    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <h2 className="title-lg" style={{ marginBottom: '1rem', color: 'var(--color-warning-orange)' }}>{t('fraudIntroTitle')}</h2>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#ccc' }}>
          {t('fraudIntroSubtitle')}
        </p>

        {/* Senior-Friendly Video Scenarios List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
          
          {/* Case Study 1 */}
          <div style={{ background: '#2A2A2A', padding: '2rem', borderRadius: '24px', border: '3px solid #3A3A3A', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <h3 style={{ textAlign: 'center', color: '#FF9F1C', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              {t('watchKyc')}
            </h3>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '4px solid #1E1E1E', backgroundColor: '#000' }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                src={`https://www.youtube.com/embed/${currentLangVideos[0]}`}
                title="KYC Scam Awareness Video" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '1.2rem', color: '#EAEAEA', textAlign: 'center', lineHeight: '1.6' }}>
              {t('kycDesc')}
            </p>
          </div>

          {/* Case Study 2 */}
          <div style={{ background: '#2A2A2A', padding: '2rem', borderRadius: '24px', border: '3px solid #3A3A3A', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <h3 style={{ textAlign: 'center', color: '#D64545', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              {t('watchElectricity')}
            </h3>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '4px solid #1E1E1E', backgroundColor: '#000' }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                src={`https://www.youtube.com/embed/${currentLangVideos[1]}`} 
                title="Electricity Scam Awareness Video" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '1.2rem', color: '#EAEAEA', textAlign: 'center', lineHeight: '1.6' }}>
              {t('electricityDesc')}
            </p>
          </div>

          {/* Case Study 3 */}
          <div style={{ background: '#2A2A2A', padding: '2rem', borderRadius: '24px', border: '3px solid #3A3A3A', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <h3 style={{ textAlign: 'center', color: '#10B981', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              {t('watchTechSupport')}
            </h3>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '4px solid #1E1E1E', backgroundColor: '#000' }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                src={`https://www.youtube.com/embed/${currentLangVideos[2]}`} 
                title="Fake Tech Support Scam Video" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '1.2rem', color: '#EAEAEA', textAlign: 'center', lineHeight: '1.6' }}>
              {t('techSupportDesc')}
            </p>
          </div>

          {/* Case Study 4 */}
          <div style={{ background: '#2A2A2A', padding: '2rem', borderRadius: '24px', border: '3px solid #3A3A3A', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <h3 style={{ textAlign: 'center', color: '#3B82F6', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              {t('watchBonus')}
            </h3>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '4px solid #1E1E1E', backgroundColor: '#000' }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                src={`https://www.youtube.com/embed/${currentLangVideos[3]}`} 
                title="Bonus Case Study Video" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '1.2rem', color: '#EAEAEA', textAlign: 'center', lineHeight: '1.6' }}>
              {t('bonusDesc')}
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(58, 58, 58, 0.4)', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-muted-red)' }}><MessageSquareWarning size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {t('keyTakeaways')}</h4>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>{t('takeaway1')}</li>
            <li>{t('takeaway2')}</li>
            <li>{t('takeaway3')}</li>
          </ul>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }} onClick={() => setStep('quiz')}>
          {t('readyStartSimulation')} <ArrowRight size={20} style={{ marginLeft: '10px' }} />
        </button>
      </div>
    );
  };

  const renderQuiz = () => {
    const scenario = scenarios[currentScenario];

    const baseText = `Progress: ${currentScenario + 1} of ${scenarios.length}. ${scenario.type === 'sms' ? "Message from:" : "Call from:"} ${scenario.sender}. Content: ${scenario.content}. ${t('isScamQuestion')}. Options: ${t('itsAScam')}, or ${t('itsSafe')}.`;
    let resultText = "";
    if (showResult) {
      resultText = `${isCorrect ? t('fraudCorrect') : t('fraudIncorrect')} `;
      resultText += scenario.isScam ? t('fraudMalicious') : t('fraudStandard');
      if (scenario.redFlags.length > 0) resultText += ` ${t('fraudRedFlags')} ${scenario.redFlags.join(". ")}.`;
    }
    const finalSpeakText = showResult ? baseText + "  " + resultText : baseText;

    return (
      <div className="quiz-section animate-fade-in">
        <PageAudioButton text={finalSpeakText} />
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--color-warning-orange)', fontWeight: 'bold' }}>Progress: {currentScenario + 1} / {scenarios.length}</span>
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
          <h4 style={{ marginBottom: '1.5rem' }}>{t('isScamQuestion')}</h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button className="btn btn-warning" onClick={() => handleDecision(true)} disabled={showResult}>
              <ShieldX /> {t('itsAScam')}
            </button>
            <button className="btn btn-primary" onClick={() => handleDecision(false)} disabled={showResult}>
              <ShieldCheck /> {t('itsSafe')}
            </button>
          </div>
        </div>

        {showResult && (
          <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem', background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {isCorrect ? <ShieldCheck color="#10B981" size={32} /> : <MessageSquareWarning color="#EF4444" size={32} />}
              <h4 style={{ color: isCorrect ? '#10B981' : '#EF4444' }}>{isCorrect ? t('fraudCorrect') : t('fraudIncorrect')}</h4>
            </div>
            <p style={{ marginBottom: '1rem' }}>
              {scenario.isScam ? t('fraudMalicious') : t('fraudStandard')}
            </p>
            {scenario.redFlags.length > 0 && (
              <div style={{ background: 'rgba(58, 58, 58, 0.4)', padding: '1rem', borderRadius: '12px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{t('fraudRedFlags')}</p>
                <ul style={{ fontSize: '0.8rem', paddingLeft: '1.2rem' }}>
                  {scenario.redFlags.map((flag, i) => <li key={i}>{flag}</li>)}
                </ul>
              </div>
            )}
            <button className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }} onClick={nextScenario}>
              Next Scenario <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderFinal = () => {
    const speakText = `${t('trainingComplete')}. You correctly identified ${score} out of ${scenarios.length} scenarios.`;
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <PageAudioButton text={speakText} />
        <ShieldCheck size={80} color="#FF9F1C" style={{ marginBottom: '2rem' }} />
        <h2 className="title-lg">{t('trainingComplete')}</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>You correctly identified {score} out of {scenarios.length} scenarios.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => { if(window.speechSynthesis) window.speechSynthesis.cancel(); navigate('/banking'); }}>Back to Portals</button>
          <button className="btn btn-outline" onClick={() => { setStep('intro'); setCurrentScenario(0); setScore(0); setShowResult(false); }}>Try Again</button>
        </div>
      </div>
    );
  };

  return (
    <div className="module-page" style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-link" onClick={() => { if(window.speechSynthesis) window.speechSynthesis.cancel(); navigate('/banking'); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="title-lg" style={{ margin: 0 }}>{t('moduleFraud')}</h2>
      </header>

      <div className="container" style={{ maxWidth: '800px' }}>
        {step === 'intro' ? renderIntro() : step === 'quiz' ? renderQuiz() : renderFinal()}
      </div>
    </div>
  );
};

export default FraudSimulator;
