import os

# 1. Update translations.js
trans_path = r"c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\translations.js"
with open(trans_path, 'r', encoding='utf-8') as f:
    t_text = f.read()

en_adds = """,
    whichLogicSafe: 'Which logic is safe?',
    option1: 'Option 1',
    option2: 'Option 2',
    tryAnother: 'Try Another Scenario',
    backToDash: 'Back to Dashboard'"""

hi_adds = """,
    whichLogicSafe: 'कौन सा विकल्प सुरक्षित है?',
    option1: 'विकल्प 1',
    option2: 'विकल्प 2',
    tryAnother: 'दूसरा परिदृश्य आज़माएं',
    backToDash: 'डैशबोर्ड पर वापस जाएं'"""

mr_adds = """,
    whichLogicSafe: 'कोणता पर्याय सुरक्षित आहे?',
    option1: 'पर्याय 1',
    option2: 'पर्याय 2',
    tryAnother: 'दुसरा पर्याय निवडा',
    backToDash: 'डॅशबोर्डवर परत जा'"""

t_text = t_text.replace("youSurvived: 'Excellent! You spotted the scam and ignored the fake link. Your money is safe.'", 
               "youSurvived: 'Excellent! You spotted the scam and ignored the fake link. Your money is safe.'" + en_adds)
t_text = t_text.replace("youSurvived: 'बहुत बढ़िया! आपने घोटाले को पहचान लिया और फर्जी लिंक को अनदेखा कर दिया। आपका पैसा सुरक्षित है।'", 
               "youSurvived: 'बहुत बढ़िया! आपने घोटाले को पहचान लिया और फर्जी लिंक को अनदेखा कर दिया। आपका पैसा सुरक्षित है।'" + hi_adds)
t_text = t_text.replace("youSurvived: 'उत्तम! तुम्ही घोटाळा ओळखला आणि खोट्या लिंककडे दुर्लक्ष केले. तुमचे पैसे सुरक्षित आहेत.'", 
               "youSurvived: 'उत्तम! तुम्ही घोटाळा ओळखला आणि खोट्या लिंककडे दुर्लक्ष केले. तुमचे पैसे सुरक्षित आहेत.'" + mr_adds)

with open(trans_path, 'w', encoding='utf-8') as f:
    f.write(t_text)

# 2. Update OtpSimulator.jsx
otp_path = r"c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\pages\modules\OtpSimulator.jsx"
with open(otp_path, 'r', encoding='utf-8') as f:
    otp_text = f.read()

old_speak = '''  const speak = (textToRead, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const voices = window.speechSynthesis.getVoices();

      let targetLang = 'en-IN';
      if (language === 'hi') targetLang = 'hi-IN';
      if (language === 'mr') targetLang = 'mr-IN';

      utterance.lang = targetLang;

      // Force browser to look for a native voice pack
      if (voices.length > 0) {
        const nativeVoice = voices.find(v => v.lang.includes(targetLang) || v.lang.lang?.includes(language));
        if (nativeVoice) utterance.voice = nativeVoice;
      }

      if (seniorMode) utterance.rate = 0.85;

      window.speechSynthesis.speak(utterance);
    }, 50);
  };'''

new_speak = '''  const speak = (textToRead, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    setTimeout(() => {
      // Split text into chunks to prevent TTS silently skipping long text
      const sentences = textToRead.split(/(?<=[.!?])\\s+/);
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
  };'''
otp_text = otp_text.replace(old_speak, new_speak)

old_step7 = '''  const renderStepSevenLinkDetection = () => {
    const data = getActiveData();
    const speakText = `Which logic is safe? Option 1: ${data.fakeLink}. Option 2: ${data.realLink}.`;
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <h3 style={{ fontSize: headingSize, marginBottom: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Which logic is safe?
        </h3>'''

new_step7 = '''  const renderStepSevenLinkDetection = () => {
    const data = getActiveData();
    const speakText = `${t('whichLogicSafe')} ${t('option1')}: ${data.fakeLink}. ${t('option2')}: ${data.realLink}.`;
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <h3 style={{ fontSize: headingSize, marginBottom: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {t('whichLogicSafe')}
        </h3>'''
otp_text = otp_text.replace(old_step7, new_step7)

old_buttons = '''          <button className="btn btn-outline" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => { setStep(2); setInputVal(''); }}>
            Try Another Scenario
          </button>
          <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => navigate('/banking')}>
            Back to Dashboard
          </button>'''
new_buttons = '''          <button className="btn btn-outline" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => { setStep(2); setInputVal(''); }}>
            {t('tryAnother')}
          </button>
          <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => navigate('/banking')}>
            {t('backToDash')}
          </button>'''
otp_text = otp_text.replace(old_buttons, new_buttons)

with open(otp_path, 'w', encoding='utf-8') as f:
    f.write(otp_text)

print("Updates successful")
