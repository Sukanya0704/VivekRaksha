import os

# Create components directory
os.makedirs(r"c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\components", exist_ok=True)

audio_component = """import React, { useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PageAudioButton = ({ text }) => {
  const { language, t } = useLanguage();

  useEffect(() => {
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (textToRead, e) => {
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
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
      <button
        onClick={(e) => speak(text, e)}
        className="btn btn-outline"
        style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', padding: '0.8rem 1.5rem', borderRadius: '30px', color: '#60A5FA', borderColor: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)' }}
        title="Listen to this page"
        type="button"
      >
        <Volume2 size={24} /> {t('listenToScreen') || 'Listen to Screen'}
      </button>
    </div>
  );
};

export default PageAudioButton;
"""

with open(r"c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\components\PageAudioButton.jsx", "w", encoding="utf-8") as f:
    f.write(audio_component)

fraud_path = r"c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\pages\modules\FraudSimulator.jsx"
with open(fraud_path, "r", encoding="utf-8") as f:
    f_text = f.read()

# 1. Imports
import_replacement = """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, ShieldCheck, ShieldX, PhoneIncoming, MessageSquareWarning, ArrowRight } from 'lucide-react';
import PageAudioButton from '../../components/PageAudioButton';"""
f_text = f_text.replace("""import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, ShieldCheck, ShieldX, PhoneIncoming, MessageSquareWarning, ArrowRight } from 'lucide-react';""", import_replacement)

# 2. handle back button cancel audio
old_back = "onClick={() => navigate('/banking')}"
new_back = "onClick={() => { if(window.speechSynthesis) window.speechSynthesis.cancel(); navigate('/banking'); }}"
f_text = f_text.replace(old_back, new_back)

# 3. renderIntro audio button
old_intro = """    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 className="title-lg" style={{ marginBottom: '1rem', color: 'var(--color-warning-orange)' }}>{t('fraudIntroTitle')}</h2>"""
new_intro = """    const speakText = `${t('fraudIntroTitle')}. ${t('fraudIntroSubtitle')}. ${t('watchKyc')}. ${t('kycDesc')}. ${t('watchElectricity')}. ${t('electricityDesc')}. ${t('watchTechSupport')}. ${t('techSupportDesc')}. ${t('watchBonus')}. ${t('bonusDesc')}. ${t('keyTakeaways')}. ${t('takeaway1')}. ${t('takeaway2')}. ${t('takeaway3')}.`;

    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <h2 className="title-lg" style={{ marginBottom: '1rem', color: 'var(--color-warning-orange)' }}>{t('fraudIntroTitle')}</h2>"""
f_text = f_text.replace(old_intro, new_intro)

# 4. renderQuiz audio button
old_quiz = """    return (
      <div className="quiz-section animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>"""
new_quiz = """    const baseText = `Progress: ${currentScenario + 1} of ${scenarios.length}. ${scenario.type === 'sms' ? "Message from:" : "Call from:"} ${scenario.sender}. Content: ${scenario.content}. ${t('isScamQuestion')}. Options: ${t('itsAScam')}, or ${t('itsSafe')}.`;
    let resultText = "";
    if (showResult) {
      resultText = `Result: ${isCorrect ? "Correct!" : "Incorrect!"}. `;
      resultText += scenario.isScam ? "This was a malicious attempt to steal your data." : "This was a standard automated notification from a trusted service.";
      if (scenario.redFlags.length > 0) resultText += ` Red Flags Detected: ${scenario.redFlags.join(". ")}.`;
    }
    const finalSpeakText = showResult ? baseText + "  " + resultText : baseText;

    return (
      <div className="quiz-section animate-fade-in">
        <PageAudioButton text={finalSpeakText} />
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>"""
f_text = f_text.replace(old_quiz, new_quiz)

# 5. renderFinal audio button
old_final = """    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <ShieldCheck size={80} color="#FF9F1C" style={{ marginBottom: '2rem' }} />"""
new_final = """    const speakText = `${t('trainingComplete')}. You correctly identified ${score} out of ${scenarios.length} scenarios.`;
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <PageAudioButton text={speakText} />
        <ShieldCheck size={80} color="#FF9F1C" style={{ marginBottom: '2rem' }} />"""
f_text = f_text.replace(old_final, new_final)


with open(fraud_path, "w", encoding="utf-8") as f:
    f.write(f_text)

print("Update to FraudSimulator successful.")
