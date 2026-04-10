import os

# 1. Create util/audio.js
os.makedirs(r"c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\utils", exist_ok=True)
audio_util = """export const playAudio = (textToRead, language, seniorMode = false) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  setTimeout(() => {
    if (typeof textToRead !== 'string') return;
    const sentences = textToRead.split(/(?<=[.!?])\\s+/);
    const voices = window.speechSynthesis.getVoices();

    let targetLang = 'en-IN';
    if (language === 'hi') targetLang = 'hi-IN';
    if (language === 'mr') targetLang = 'mr-IN';

    const nativeVoice = voices.find(v => 
      (v.lang && v.lang.includes(targetLang)) || 
      (v.lang && v.lang.includes(language))
    );

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
"""
with open(r"c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\utils\audio.js", "w", encoding="utf-8") as f:
    f.write(audio_util)


# 2. Update PageAudioButton.jsx to use audio_util
audio_btn_path = r"c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\components\PageAudioButton.jsx"
with open(audio_btn_path, 'r', encoding='utf-8') as f:
    ab_text = f.read()

ab_text = ab_text.replace("import { useLanguage } from '../context/LanguageContext';", "import { useLanguage } from '../context/LanguageContext';\nimport { playAudio } from '../utils/audio';")

old_speak = """  const speak = (textToRead, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    setTimeout(() => {
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
        window.speechSynthesis.speak(utterance);
      });
    }, 50);
  };"""
new_speak = """  const speak = (textToRead, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    playAudio(textToRead, language);
  };"""
ab_text = ab_text.replace(old_speak, new_speak)

with open(audio_btn_path, 'w', encoding='utf-8') as f:
    f.write(ab_text)


# 3. Update translations.js
trans_path = r"c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\translations.js"
with open(trans_path, 'r', encoding='utf-8') as f:
    t_text = f.read()

en_adds = """,
    fraudCorrect: 'Correct! ',
    fraudIncorrect: 'Incorrect! ',
    fraudMalicious: 'This was a malicious attempt to steal your data.',
    fraudStandard: 'This was a standard automated notification from a trusted service.',
    fraudRedFlags: 'Red Flags Detected:'"""

hi_adds = """,
    fraudCorrect: 'सही! ',
    fraudIncorrect: 'गलत! ',
    fraudMalicious: 'यह आपका डेटा चुराने का एक दुर्भावनापूर्ण प्रयास था।',
    fraudStandard: 'यह एक विश्वसनीय सेवा से एक मानक अधिसूचना थी।',
    fraudRedFlags: 'खतरे के संकेत:'"""

mr_adds = """,
    fraudCorrect: 'बरोबर! ',
    fraudIncorrect: 'चूक! ',
    fraudMalicious: 'हा तुमचा डेटा चोरण्याचा एक दुर्भावनापूर्ण प्रयत्न होता.',
    fraudStandard: 'ही एका विश्वसनीय सेवेवरून आलेली मानक सूचना होती.',
    fraudRedFlags: 'धोक्याची चिन्हे ओळखली:'"""

t_text = t_text.replace("backToDash: 'Back to Dashboard'", "backToDash: 'Back to Dashboard'" + en_adds)
t_text = t_text.replace("backToDash: 'डैशबोर्ड पर वापस जाएं'", "backToDash: 'डैशबोर्ड पर वापस जाएं'" + hi_adds)
t_text = t_text.replace("backToDash: 'डॅशबोर्डवर परत जा'", "backToDash: 'डॅशबोर्डवर परत जा'" + mr_adds)

with open(trans_path, 'w', encoding='utf-8') as f:
    f.write(t_text)


# 4. Update FraudSimulator.jsx
fraud_path = r"c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\pages\modules\FraudSimulator.jsx"
with open(fraud_path, 'r', encoding='utf-8') as f:
    f_text = f.read()

import_replacement = """import { ArrowLeft, ShieldCheck, ShieldX, PhoneIncoming, MessageSquareWarning, ArrowRight } from 'lucide-react';
import PageAudioButton from '../../components/PageAudioButton';
import { playAudio } from '../../utils/audio';"""

f_text = f_text.replace("""import { ArrowLeft, ShieldCheck, ShieldX, PhoneIncoming, MessageSquareWarning, ArrowRight } from 'lucide-react';
import PageAudioButton from '../../components/PageAudioButton';""", import_replacement)

old_handle = """  const handleDecision = (decision) => {
    const scenario = scenarios[currentScenario];
    const correct = decision === scenario.isScam;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setShowResult(true);
  };"""

new_handle = """  const handleDecision = (decision) => {
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
  };"""
f_text = f_text.replace(old_handle, new_handle)


old_quiz_speakText = """      resultText = `Result: ${isCorrect ? "Correct!" : "Incorrect!"}. `;
      resultText += scenario.isScam ? "This was a malicious attempt to steal your data." : "This was a standard automated notification from a trusted service.";
      if (scenario.redFlags.length > 0) resultText += ` Red Flags Detected: ${scenario.redFlags.join(". ")}.`;"""
new_quiz_speakText = """      resultText = `${isCorrect ? t('fraudCorrect') : t('fraudIncorrect')} `;
      resultText += scenario.isScam ? t('fraudMalicious') : t('fraudStandard');
      if (scenario.redFlags.length > 0) resultText += ` ${t('fraudRedFlags')} ${scenario.redFlags.join(". ")}.`;"""
f_text = f_text.replace(old_quiz_speakText, new_quiz_speakText)


old_html_result = """              <h4 style={{ color: isCorrect ? '#10B981' : '#EF4444' }}>{isCorrect ? "Correct!" : "Incorrect!"}</h4>
            </div>
            <p style={{ marginBottom: '1rem' }}>
              {scenario.isScam
                ? "This was a malicious attempt to steal your data."
                : "This was a standard automated notification from a trusted service."}
            </p>
            {scenario.redFlags.length > 0 && (
              <div style={{ background: 'rgba(58, 58, 58, 0.4)', padding: '1rem', borderRadius: '12px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Red Flags Detected:</p>"""

new_html_result = """              <h4 style={{ color: isCorrect ? '#10B981' : '#EF4444' }}>{isCorrect ? t('fraudCorrect') : t('fraudIncorrect')}</h4>
            </div>
            <p style={{ marginBottom: '1rem' }}>
              {scenario.isScam ? t('fraudMalicious') : t('fraudStandard')}
            </p>
            {scenario.redFlags.length > 0 && (
              <div style={{ background: 'rgba(58, 58, 58, 0.4)', padding: '1rem', borderRadius: '12px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{t('fraudRedFlags')}</p>"""

f_text = f_text.replace(old_html_result, new_html_result)

with open(fraud_path, 'w', encoding='utf-8') as f:
    f.write(f_text)

print("success run")
