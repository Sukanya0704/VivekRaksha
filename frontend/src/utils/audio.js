export const playAudio = (textToRead, language, seniorMode = false) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  setTimeout(() => {
    if (typeof textToRead !== 'string') return;
    const sentences = textToRead.split(/(?<=[.!?])\s+/);
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
