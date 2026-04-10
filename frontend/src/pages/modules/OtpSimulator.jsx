import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Lock, ExternalLink, ShieldAlert, CheckCircle, Volume2, Search, Smartphone, AlertTriangle, PhoneCall, CreditCard, Globe, Shield, Wallet, Landmark } from 'lucide-react';

const OtpSimulator = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [seniorMode] = useState(false);
  const [activeScenario, setActiveScenario] = useState('tax');
  const [inputVal, setInputVal] = useState('');

  // 🔊 Helper for explicit text-to-speech
  const speak = (textToRead, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    setTimeout(() => {
      // Split text into chunks to prevent TTS silently skipping long text
      const sentences = textToRead.split(/(?<=[.!?])\s+/);
      const voices = window.speechSynthesis.getVoices();

      let targetLang = 'en-IN';
      if (language === 'hi') targetLang = 'hi-IN';
      if (language === 'mr') targetLang = 'mr-IN';

      const nativeVoice = voices.find(v => v.lang.includes(targetLang) || v.lang.lang?.includes(language));

      sentences.forEach((sentence) => {
        if (!sentence.trim()) return;
        const utterance = new SpeechSynthesisUtterance(sentence.trim());
        utterance.lang = targetLang;
        if (nativeVoice) utterance.voice = nativeVoice;
        if (seniorMode) utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      });
    }, 50);
  };

  useEffect(() => {
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const handleNextStep = (newStep, autoSpeakText = null) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setStep(newStep);
    if (seniorMode && autoSpeakText) speak(autoSpeakText);
  };

  const currentFontSize = seniorMode ? '1.3rem' : '1.1rem';
  const headingSize = seniorMode ? '2rem' : '1.5rem';

  // Top-Level Audio Component
  const PageAudioButton = ({ text }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
      <button
        onClick={(e) => speak(text, e)}
        className="btn btn-outline"
        style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: currentFontSize, padding: '0.8rem 1.5rem', borderRadius: '30px', color: '#60A5FA', borderColor: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)' }}
        title="Listen to this page"
        type="button"
      >
        <Volume2 size={24} /> {t('listenToPage') || 'Listen to Screen'}
      </button>
    </div>
  );

  // SCENARIO DATA WITH DYNAMIC QUESTIONS
  const scenariosData = {
    en: {
      tax: {
        id: 'tax',
        title: "Income Tax Refund Scam",
        icon: <Landmark size={48} color="#10B981" />,
        smsText: ["Dear Citizen", " your IT refund of ₹12,400 has been ", "approved", ". Verify your details here to receive it: ", "http://incometax-india-gov.org.in/refund"],
        breakdown: [
          { text: "Dear Citizen", explanation: "Generic greeting (Scammers rarely use your real name)" },
          { text: "approved", explanation: "Creates false urgency and excitement" },
          { text: "http://incometax-india-gov.org.in", explanation: "Fake link! Real government sites use '.gov.in'" }
        ],
        decision: {
          question: "You received this Tax SMS. What do you do?",
          options: [
            { isDanger: true, text: "Click the link immediately to claim my refund.", nextStep: 5 },
            { isSafe: true, text: "Wait and log into the official Income Tax portal later.", nextStep: 7 }
          ]
        },
        sandboxMsg: "Income Tax Verification",
        sandboxDetail: "Enter your PAN Number to receive refund:",
        btnText: "Submit to get ₹12,400",
        realLink: "https://www.incometax.gov.in",
        fakeLink: "http://incometax-india-gov.org.in/refund"
      },
      kyc: {
        id: 'kyc',
        title: "Bank KYC Blocked Scam",
        icon: <ShieldAlert size={48} color="#EF4444" />,
        smsText: ["Dear Customer", " your bank account will be ", "BLOCKED today", ". Complete your KYC immediately to avoid suspension: ", "http://update-kyc-hdfc.net/verify"],
        breakdown: [
          { text: "Dear Customer", explanation: "Banks usually address you by your real name." },
          { text: "BLOCKED today", explanation: "Creates extreme panic so you don't think straight." },
          { text: "http://update-kyc-hdfc.net", explanation: "Fake link! Never update KYC through an SMS link." }
        ],
        decision: {
          question: "The SMS claims your account is blocked TODAY. You are panicking. What do you do?",
          options: [
            { isDanger: true, text: "Quickly click the link to update my PAN so I can buy groceries.", nextStep: 5 },
            { isSafe: true, text: "Ignore the SMS and call the official Customer Care number on my debit card.", nextStep: 7 }
          ]
        },
        sandboxMsg: "Bank KYC Portal",
        sandboxDetail: "Enter Account Number & OTP:",
        btnText: "Verify KYC Now",
        realLink: "Log in via Official App",
        fakeLink: "http://update-kyc-hdfc.net/verify"
      },
      upi: {
        id: 'upi',
        title: "UPI Mistake Payment Scam",
        icon: <Wallet size={48} color="#FF9F1C" />,
        smsText: ["Hello sir", " I mistakenly sent you ", "₹50,000", ". My mother is in the hospital, please click here to return the money: ", "pay-refund-upi@ybl"],
        breakdown: [
          { text: "Hello sir", explanation: "Strangers using emotional manipulation." },
          { text: "₹50,000", explanation: "They send a fake SMS saying money was credited." },
          { text: "pay-refund-upi@ybl", explanation: "Clicking this and entering your PIN actually DEDUCTS money from your account." }
        ],
        decision: {
          question: "A stranger is begging you to return ₹50,000 they accidentally transferred. What do you do?",
          options: [
            { isDanger: true, text: "Click the link they sent and enter my UPI PIN to reverse the payment.", nextStep: 5 },
            { isSafe: true, text: "Tell them to contact their bank to initiate a formal RBI chargeback. Do nothing.", nextStep: 8 }
          ]
        },
        sandboxMsg: "UPI App Payment Request",
        sandboxDetail: "Enter UPI PIN to process refund:",
        btnText: "Pay ₹50,000",
        realLink: "Check your actual Bank Balance via app",
        fakeLink: "Click the SMS payment link"
      }
    },
    hi: {
      tax: {
        id: 'tax',
        title: "इनकम टैक्स रिफंड घोटाला",
        icon: <Landmark size={48} color="#10B981" />,
        smsText: ["प्रिय नागरिक", " आपका ₹12,400 का IT रिफंड ", "स्वीकृत", " हो गया है। इसे प्राप्त करने के लिए यहां सत्यापित करें: ", "http://incometax-india-gov.org.in/refund"],
        breakdown: [
          { text: "प्रिय नागरिक", explanation: "सामान्य संबोधन (ठग शायद ही कभी आपके असली नाम का उपयोग करते हैं)" },
          { text: "स्वीकृत", explanation: "झूठी जल्दबाजी और उत्साह पैदा करता है" },
          { text: "http://incometax-india-gov.org.in", explanation: "फर्जी लिंक! असली साइटें .gov.in पर समाप्त होती हैं" }
        ],
        decision: {
          question: "आपको यह टैक्स SMS प्राप्त हुआ। आप क्या करते हैं?",
          options: [
            { isDanger: true, text: "अपना रिफंड तुरंत प्राप्त करने के लिए लिंक पर क्लिक करें।", nextStep: 5 },
            { isSafe: true, text: "प्रतीक्षा करें और बाद में आधिकारिक आयकर पोर्टल पर लॉग इन करें।", nextStep: 7 }
          ]
        },
        sandboxMsg: "आयकर सत्यापन",
        sandboxDetail: "रिफंड प्राप्त करने के लिए अपना PAN दर्ज करें:",
        btnText: "रिफंड प्राप्त करने के लिए सबमिट करें",
        realLink: "https://www.incometax.gov.in",
        fakeLink: "http://incometax-india-gov.org.in/refund"
      },
      kyc: {
        id: 'kyc',
        title: "बैंक KYC ब्लॉक घोटाला",
        icon: <ShieldAlert size={48} color="#EF4444" />,
        smsText: ["प्रिय ग्राहक", " आपका बैंक खाता ", "आज ब्लॉक", " कर दिया जाएगा। इसे बचने के लिए तुरंत अपनी KYC पूरी करें: ", "http://update-kyc-hdfc.net/verify"],
        breakdown: [
          { text: "प्रिय ग्राहक", explanation: "बैंक आमतौर पर आपको आपके असली नाम से संबोधित करते हैं।" },
          { text: "आज ब्लॉक", explanation: "अत्यधिक दहशत पैदा करता है।" },
          { text: "http://update-kyc-hdfc.net", explanation: "फर्जी लिंक! कभी भी SMS लिंक के जरिए KYC अपडेट न करें।" }
        ],
        decision: {
          question: "SMS का दावा है कि आपका खाता आज ही ब्लॉक कर दिया गया है। आप घबरा रहे हैं। आप क्या करते हैं?",
          options: [
            { isDanger: true, text: "अपना पैन अपडेट करने के लिए जल्दी से लिंक पर क्लिक करें ताकि आप किराने का सामान खरीद सकें।", nextStep: 5 },
            { isSafe: true, text: "SMS को अनदेखा करें और अपने डेबिट कार्ड के पीछे आधिकारिक कस्टमर केयर नंबर पर कॉल करें।", nextStep: 7 }
          ]
        },
        sandboxMsg: "बैंक KYC पोर्टल",
        sandboxDetail: "खाता नंबर और OTP दर्ज करें:",
        btnText: "अभी KYC सत्यापित करें",
        realLink: "आधिकारिक ऐप के माध्यम से लॉग इन करें",
        fakeLink: "http://update-kyc-hdfc.net/verify"
      },
      upi: {
        id: 'upi',
        title: "UPI गलत पेमेंट घोटाला",
        icon: <Wallet size={48} color="#FF9F1C" />,
        smsText: ["नमस्ते सर", " मैंने गलती से आपको ", "₹50,000", " भेज दिए हैं। मेरी माँ अस्पताल में है, कृपया पैसे वापस करने के लिए यहाँ क्लिक करें: ", "pay-refund-upi@ybl"],
        breakdown: [
          { text: "नमस्ते सर", explanation: "भावनात्मक हेरफेर का उपयोग करने वाले अजनबी।" },
          { text: "₹50,000", explanation: "वे पैसा प्राप्त होने का झूठा SMS भेजते हैं।" },
          { text: "pay-refund-upi@ybl", explanation: "इस पर क्लिक करने और अपना पिन दर्ज करने से वास्तव में आपके खाते से पैसे कट जाते हैं।" }
        ],
        decision: {
          question: "एक अजनबी आपसे ₹50,000 वापस करने की भीख मांग रहा है जो उसने गलती से ट्रांसफर कर दिए हैं। आप क्या करते हैं?",
          options: [
            { isDanger: true, text: "उनके द्वारा भेजे गए लिंक पर क्लिक करें और भुगतान वापस करने के लिए अपना UPI पिन दर्ज करें।", nextStep: 5 },
            { isSafe: true, text: "उन्हें अपने बैंक से संपर्क करके औपचारिक RBI चार्जबैक शुरू करने को कहें। कुछ न करें।", nextStep: 8 }
          ]
        },
        sandboxMsg: "UPI ऐप भुगतान अनुरोध",
        sandboxDetail: "पैसे वापस करने के लिए UPI पिन दर्ज करें:",
        btnText: "₹50,000 का भुगतान करें",
        realLink: "ऐप के माध्यम से अपना वास्तविक बैंक बैलेंस जांचें",
        fakeLink: "SMS भुगतान लिंक पर क्लिक करना"
      }
    },
    mr: {
      tax: {
        id: 'tax',
        title: "इन्कम टॅक्स रिफंड घोटाळा",
        icon: <Landmark size={48} color="#10B981" />,
        smsText: ["प्रिय नागरिक", " तुमचा ₹12,400 चा IT रिफंड ", "मंजूर", " झाला आहे. तो मिळवण्यासाठी येथे पडताळणी करा: ", "http://incometax-india-gov.org.in/refund"],
        breakdown: [
          { text: "प्रिय नागरिक", explanation: "सामान्य ग्रीटिंग (खरे नाव वापरत नाहीत)" },
          { text: "मंजूर", explanation: "खोटी घाई आणि उत्साह निर्माण करते" },
          { text: "http://incometax-india-gov.org.in", explanation: "खोटी लिंक! खऱ्या साइट्स .gov.in ने संपतात" }
        ],
        decision: {
          question: "तुम्हाला हा टॅक्स SMS प्राप्त झाला. तुम्ही काय करता?",
          options: [
            { isDanger: true, text: "रिफंड त्वरित मिळवण्यासाठी त्वरित लिंकवर क्लिक करा.", nextStep: 5 },
            { isSafe: true, text: "थांबा आणि नंतर अधिकृत इन्कम टॅक्स पोर्टलवर लॉग इन करा.", nextStep: 7 }
          ]
        },
        sandboxMsg: "इन्कम टॅक्स पडताळणी",
        sandboxDetail: "रिफंड मिळवण्यासाठी तुमचा पॅन (PAN) नंबर टाका:",
        btnText: "रिफंड मिळवण्यासाठी सबमिट करा",
        realLink: "https://www.incometax.gov.in",
        fakeLink: "http://incometax-india-gov.org.in/refund"
      },
      kyc: {
        id: 'kyc',
        title: "बँक KYC ब्लॉक घोटाळा",
        icon: <ShieldAlert size={48} color="#EF4444" />,
        smsText: ["प्रिय ग्राहक", " तुमचे बँक खाते ", "आज ब्लॉक", " केले जाईल. हे टाळण्यासाठी त्वरित तुमची KYC पूर्ण करा: ", "http://update-kyc-hdfc.net/verify"],
        breakdown: [
          { text: "प्रिय ग्राहक", explanation: "बँका सहसा तुम्हाला तुमच्या खऱ्या नावाने बोलावतात." },
          { text: "आज ब्लॉक", explanation: "भीती निर्माण करते जेणेकरून तुम्ही विचार करणार नाही." },
          { text: "http://update-kyc-hdfc.net", explanation: "खोटी लिंक! कधीही SMS लिंकद्वारे KYC अपडेट करू नका." }
        ],
        decision: {
          question: "SMS चा दावा आहे की तुमचे खाते आजच ब्लॉक केले गेले आहे. तुम्ही घाबरलेले आहात. तुम्ही काय करता?",
          options: [
            { isDanger: true, text: "तुमचा पॅन अपडेट करण्यासाठी पटकन लिंकवर क्लिक करा जेणेकरून तुम्ही किराणा सामान खरेदी करू शकाल.", nextStep: 5 },
            { isSafe: true, text: "SMS कडे दुर्लक्ष करा आणि तुमच्या डेबिट कार्डच्या मागे असलेल्या अधिकृत कस्टमर केअर नंबरवर कॉल करा.", nextStep: 7 }
          ]
        },
        sandboxMsg: "बँक KYC पोर्टल",
        sandboxDetail: "खाते नंबर आणि OTP टाका:",
        btnText: "आत्ता KYC सत्यापित करा",
        realLink: "अधिकृत अॅपद्वारे लॉग इन करा",
        fakeLink: "http://update-kyc-hdfc.net/verify"
      },
      upi: {
        id: 'upi',
        title: "UPI चुकीचे पेमेंट घोटाळा",
        icon: <Wallet size={48} color="#FF9F1C" />,
        smsText: ["नमस्ते सर", " मी चुकून तुम्हाला ", "₹50,000", " पाठवले आहेत. माझी आई रुग्णालयात आहे, कृपया पैसे परत करण्यासाठी येथे क्लिक करा: ", "pay-refund-upi@ybl"],
        breakdown: [
          { text: "नमस्ते सर", explanation: "भावनिक हाताळणी करणारे अनोळखी लोक." },
          { text: "₹50,000", explanation: "ते पैसे जमा झाल्याचा खोटा SMS पाठवतात." },
          { text: "pay-refund-upi@ybl", explanation: "यावर क्लिक करून तुमचा पिन टाकल्यास तुमच्या खात्यातून पैसे दुप्पट कापले जातात." }
        ],
        decision: {
          question: "एक अनोळखी व्यक्ती चुकून ट्रान्सफर झालेले ₹50,000 परत करण्याची विनंती करत आहे. तुम्ही काय करता?",
          options: [
            { isDanger: true, text: "त्यांनी पाठवलेल्या लिंकवर क्लिक करा आणि पेमेंट उलट करण्यासाठी तुमचा UPI पिन टाका.", nextStep: 5 },
            { isSafe: true, text: "त्यांना त्यांच्या बँकेशी संपर्क साधून औपचारिक RBI चार्जबॅक सुरू करण्यास सांगा. काहीही करू नका.", nextStep: 8 }
          ]
        },
        sandboxMsg: "UPI अॅप पेमेंट विनंती",
        sandboxDetail: "पैसे परत करण्यासाठी UPI पिन टाका:",
        btnText: "₹50,000 भरा",
        realLink: "अॅपद्वारे तुमचे वास्तविक बँक बॅलन्स तपासा",
        fakeLink: "SMS पेमेंट लिंकवर क्लिक करणे"
      }
    }
  };

  const getActiveData = () => {
    const langData = scenariosData[language] || scenariosData['en'];
    return langData[activeScenario];
  };

  // VIEWS
  const renderStepOne = () => (
    <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
      <PageAudioButton text={`${t('otpGoldenRule')}. ${t('otpGoldenRuleDesc')}. ${t('otpSafe')}. ${t('otpSafeDesc')}. ${t('otpDanger')}. ${t('otpDangerDesc')}`} />
      <Lock size={64} color="#EF4444" style={{ marginBottom: '1.5rem', marginTop: '1rem' }} />
      <h3 style={{ fontSize: headingSize, marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {t('otpGoldenRule')}
      </h3>
      <p style={{ fontSize: currentFontSize, color: 'rgba(234, 234, 234, 0.9)', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        "{t('otpGoldenRuleDesc')}"
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: seniorMode ? '1fr' : 'repeat(2, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '5px solid #10B981' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#10B981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            {t('otpSafe')}
          </p>
          <p style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'center' }}>
            {t('otpSafeDesc')}
          </p>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '5px solid #EF4444' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#EF4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            {t('otpDanger')}
          </p>
          <p style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'center' }}>
            {t('otpDangerDesc')}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', justifyContent: 'center' }}>
        <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: '1.2rem' }} onClick={() => handleNextStep(2, t('scenarioHubTitle'))}>
          {t('readyStartSimulation')}
        </button>
      </div>
    </div>
  );

  const renderStepTwoHub = () => {
    const langData = scenariosData[language] || scenariosData['en'];
    const speakText = `${t('scenarioHubTitle')}. ` + Object.keys(langData).map(k => langData[k].title).join('. ');
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <h3 style={{ fontSize: headingSize, marginBottom: '3rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {t('scenarioHubTitle')}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {Object.keys(langData).map((key) => (
            <div
              key={key}
              onClick={() => { setActiveScenario(key); handleNextStep(3); }}
              style={{
                background: '#2A2A2A',
                borderRadius: '24px',
                padding: '2rem',
                cursor: 'pointer',
                border: '3px solid #4B5563',
                transition: 'transform 0.2s, borderColor 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#4B5563'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {langData[key].icon}
              <h4 style={{ fontSize: currentFontSize, fontWeight: 'bold' }}>{langData[key].title}</h4>
            </div>
          ))}
        </div>
      </div>
    )
  };

  const renderStepThreeBreakdown = () => {
    const data = getActiveData();
    const speakText = `${t('spotTheScam')}. ${data.smsText.join("")}. ` + data.breakdown.map(i => `${i.text}. ${i.explanation}`).join('. ');
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
        <PageAudioButton text={speakText} />
        <h3 style={{ fontSize: headingSize, textAlign: 'center', marginBottom: '2rem', color: '#FF9F1C', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Search size={28} style={{ marginRight: '10px' }} />
          {t('spotTheScam')}
        </h3>

        <div style={{ background: '#e5e7eb', color: '#1a1a1a', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', fontSize: currentFontSize, display: 'flex', alignItems: 'center' }}>
          <div>
            <span style={{ backgroundColor: '#FCA5A5', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{data.smsText[0]}</span>
            {data.smsText[1]}
            <span style={{ backgroundColor: '#FCA5A5', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{data.smsText[2]}</span>
            {data.smsText[3]}
            <span style={{ backgroundColor: '#FCA5A5', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', wordBreak: 'break-all' }}>{data.smsText[4]}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.breakdown.map((item, index) => (
            <div key={index} style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '6px solid #EF4444', padding: '1.5rem', borderRadius: '0 8px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 'bold', color: '#EF4444', marginBottom: '0.5rem', fontSize: currentFontSize }}>"{item.text}"</p>
                <p style={{ fontSize: currentFontSize }}>{item.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1.5rem', fontSize: '1.3rem' }} onClick={() => handleNextStep(4)}>
          {t('nextStep') || 'Continue'}
        </button>
      </div>
    )
  };

  const renderStepFourDecision = () => {
    const data = getActiveData().decision;
    const speakText = `${data.question}. ` + data.options.map(o => o.text).join('. ');
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <Smartphone size={80} color="#3B82F6" style={{ margin: '2rem auto 1.5rem' }} />
        <h3 style={{ fontSize: headingSize, marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          {data.question}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
          {data.options.map((opt, i) => (
            <button
              key={i}
              className={`btn ${opt.isDanger ? 'btn-warning' : 'btn-outline'}`}
              style={{ fontSize: currentFontSize, padding: '1.5rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: opt.isSafe ? '3px solid #10B981' : undefined }}
              onClick={() => {
                handleNextStep(opt.nextStep);
              }}
            >
              <span>{opt.isDanger ? "❌" : "✅"} {opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderStepFiveSandbox = () => {
    const data = getActiveData();
    const speakText = `${data.sandboxMsg}. ${data.fakeLink}. ${data.sandboxDetail}. ${data.btnText}`;
    return (
      <div className="animate-fade-in" style={{ background: '#ffffff', color: '#000000', padding: '2rem', borderRadius: '12px', maxWidth: '500px', margin: '0 auto', borderTop: '8px solid #EF4444', position: 'relative' }}>
        <PageAudioButton text={speakText} />
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h4 style={{ marginTop: '1rem', color: '#1a1a1a', fontWeight: 'bold', fontSize: '2rem' }}>
            {data.sandboxMsg}
          </h4>
          <p style={{ color: '#EF4444', fontSize: '1.1rem', wordBreak: 'break-all' }}>{data.fakeLink}</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 'bold', fontSize: '1.3rem' }}>{data.sandboxDetail}</label>
          <input
            type={activeScenario === 'upi' ? "password" : "text"}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="*** ***"
            style={{ width: '100%', padding: '1.2rem', borderRadius: '8px', border: '3px solid #ccc', fontSize: '1.5rem' }}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ width: '100%', background: '#EF4444', padding: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}
          onClick={() => handleNextStep(6)}
        >
          {data.btnText}
        </button>

        <p style={{ marginTop: '2rem', fontSize: '1.2rem', textAlign: 'center', color: '#EF4444', fontWeight: 'bold' }}>⚠️ SIMULATION MODE</p>
      </div>
    );
  };

  const renderStepSixConsequence = () => {
    const speakText = `${t('consequenceTitle')}. ${t('consequenceText')}. ${t('debitAlert')}. ${t('recoverySteps')}. ${t('recovery1')}. ${t('recovery2')}. ${t('recovery3')}`;
    return (
      <div className="glass-panel animate-fade-in" style={{ border: `5px solid #EF4444`, padding: '3rem' }}>
        <PageAudioButton text={speakText} />

        <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
          <AlertTriangle size={100} color="#EF4444" style={{ margin: '0 auto 1.5rem', animation: 'bounce 1s infinite' }} />
          <h2 style={{ fontSize: headingSize, color: '#EF4444', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {t('consequenceTitle')}
          </h2>
          <p style={{ fontSize: currentFontSize, color: 'rgba(234, 234, 234, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {t('consequenceText')}
          </p>
        </div>

        {/* The Shocking SMS Alert */}
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '2rem', borderRadius: '16px', borderLeft: '10px solid #EF4444', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: headingSize, fontWeight: 'bold', color: '#FFA0A0', lineHeight: '1.6' }}>
            {t('debitAlert')}
          </p>
        </div>

        {/* Recovery Solutions Section */}
        <div style={{ background: '#2C2C2C', padding: '3rem', borderRadius: '16px', border: '2px solid #3A3A3A' }}>
          <h4 style={{ color: '#10B981', fontSize: headingSize, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={36} /> {t('recoverySteps')}
          </h4>
          <ul style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <li style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <PhoneCall size={32} color="#3B82F6" style={{ marginTop: '4px' }} />
              <span>{t('recovery1')}</span>
            </li>
            <li style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <CreditCard size={32} color="#FF9F1C" style={{ marginTop: '4px' }} />
              <span>{t('recovery2')}</span>
            </li>
            <li style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <Globe size={32} color="#10B981" style={{ marginTop: '4px' }} />
              <span>{t('recovery3')}</span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => { setStep(2); setInputVal(''); }}>
            {t('tryAnother')}
          </button>
          <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => navigate('/banking')}>
            {t('backToDash')}
          </button>
        </div>
      </div>
    );
  };

  const renderStepSevenLinkDetection = () => {
    const data = getActiveData();
    const speakText = `${t('whichLogicSafe')} ${t('option1')}: ${data.fakeLink}. ${t('option2')}: ${data.realLink}.`;
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <h3 style={{ fontSize: headingSize, marginBottom: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {t('whichLogicSafe')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <button
            className="btn btn-outline"
            style={{ padding: '2rem', fontSize: currentFontSize, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => {
              handleNextStep(6);
            }}
          >
            <span style={{ color: '#EF4444' }}>{data.fakeLink}</span>
            <ExternalLink size={24} />
          </button>

          <button
            className="btn btn-outline"
            style={{ padding: '2rem', fontSize: currentFontSize, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => {
              handleNextStep(8);
            }}
          >
            <span style={{ color: '#10B981' }}>{data.realLink}</span>
            <ExternalLink size={24} />
          </button>
        </div>
      </div>
    );
  };

  const renderStepEightSafeResult = () => {
    const speakText = `${t('riskSafe')}. ${t('youSurvived')}`;
    return (
      <div className="glass-panel animate-fade-in" style={{ border: `5px solid #10B981`, padding: '4rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <CheckCircle size={100} color="#10B981" style={{ margin: '0 auto 2rem' }} />
        <h2 style={{ fontSize: headingSize, color: '#10B981', marginBottom: '2rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {t('riskSafe')}
        </h2>

        <p style={{ fontSize: currentFontSize, marginBottom: '3rem', lineHeight: '1.8', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {t('youSurvived')}
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => { setStep(2); setInputVal(''); }}>
            {t('tryAnother')}
          </button>
          <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => navigate('/banking')}>
            {t('backToDash')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="module-page" style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-link" onClick={() => { window.speechSynthesis?.cancel(); navigate('/banking'); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="title-lg" style={{ margin: 0 }}>{t('moduleOTP')}</h2>
      </header>

      <div className="container" style={{ maxWidth: '900px' }}>
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwoHub()}
        {step === 3 && renderStepThreeBreakdown()}
        {step === 4 && renderStepFourDecision()}
        {step === 5 && renderStepFiveSandbox()}
        {step === 6 && renderStepSixConsequence()}
        {step === 7 && renderStepSevenLinkDetection()}
        {step === 8 && renderStepEightSafeResult()}
      </div>
    </div>
  );
};

export default OtpSimulator;
