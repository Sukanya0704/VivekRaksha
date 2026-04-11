export const getUnifiedVoice = () => {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  // Provide a single, consistent Hindi voice that can natively read Devanagari and English with an Indian accent
  return voices.find(v => v.lang === 'hi-IN') || voices.find(v => v.lang.includes('hi')) || voices[0] || null;
};

export const playAudio = (textToRead, language, seniorMode = false) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  setTimeout(() => {
    if (typeof textToRead !== 'string') return;
    const sentences = textToRead.split(/(?<=[.!?])\s+/);
    const unifiedVoice = getUnifiedVoice();

    sentences.forEach((sentence) => {
      if (!sentence.trim()) return;
      const utterance = new SpeechSynthesisUtterance(sentence.trim());
      
      const langMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };
      utterance.lang = langMap[language] || 'hi-IN';
      
      if (unifiedVoice) utterance.voice = unifiedVoice;
      if (seniorMode) utterance.rate = 0.85;
      
      window.speechSynthesis.speak(utterance);
    });
  }, 50);
};
