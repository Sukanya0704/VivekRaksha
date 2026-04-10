import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import * as LucideIcons from 'lucide-react';

const { 
  ArrowLeft, PhoneOff, Video, ShieldAlert, User, CheckCircle, Wifi, Signal, Battery
} = LucideIcons;

const TRANSLATIONS = {
  en: {
    step_sms: 'Click the SMS notification to see what happens.',
    step_incoming_call: 'Click the Green "Accept" button to answer the call.',
    step_video_call: "Listen to the voice and look at the video glitches. Click the Scammer's video to analyze it.",
    step_disconnect: 'Never argue with a scammer. Click the Red Phone button to disconnect immediately.',
    complete: 'Tutorial Complete!'
  },
  hi: {
    step_sms: 'यह देखने के लिए कि क्या होता है, SMS सूचना पर क्लिक करें।',
    step_incoming_call: 'कॉल का उत्तर देने के लिए हरे रंग के "Accept" बटन पर क्लिक करें।',
    step_video_call: 'आवाज़ को सुनें और वीडियो के ग्लिच (गड़बड़ियों) पर ध्यान दें। इसका विश्लेषण करने के लिए स्कैमर के वीडियो फ़ीड पर क्लिक करें।',
    step_disconnect: 'स्कैमर से कभी बहस न करें। तुरंत डिस्कनेक्ट करने के लिए लाल फोन बटन पर क्लिक करें।',
    complete: 'ट्यूटोरियल पूरा हुआ!'
  },
  mr: {
    step_sms: 'काय होते ते पाहण्यासाठी SMS सूचनेवर क्लिक करा.',
    step_incoming_call: 'कॉलला उत्तर देण्यासाठी हिरव्या "Accept" बटणावर क्लिक करा.',
    step_video_call: 'आवाज ऐका आणि व्हिडिओमधील त्रुटींकडे लक्ष द्या. विश्लेषण करण्यासाठी स्कॅमरच्या व्हिडिओ फीडवर क्लिक करा.',
    step_disconnect: 'स्कॅमरशी कधीही वाद घालू नका. त्वरित डिस्कनेक्ट करण्यासाठी लाल फोन बटणावर क्लिक करा.',
    complete: 'ट्युटोरियल पूर्ण झाले!'
  }
};

const KNOWLEDGE_BASE = {
  step_sms: "Scammers use URGENCY to make you panic. Real banks will never threaten to freeze your account in 2 hours via SMS.",
  step_incoming_call: "Scammers use official-sounding names and logos (like Police or RBI) to intimidate you into obeying them.",
  step_video_call: "Deepfakes often have glitches: the lip movement doesn't match the audio, the voice sounds robotic, and they NEVER blink naturally.",
  step_disconnect: "If an 'official' asks for an OTP, money, or threatens you with arrest on a video call, it is 100% a scam. HANG UP.",
  complete: "Great job! If you are ever unsure, hang up and dial the bank's official customer care number yourself."
};

const STEPS_SEQ = [
  'step_sms',
  'step_incoming_call',
  'step_video_call',
  'step_disconnect',
  'complete'
];

const OutsideTooltip = ({ stepId, text }) => {
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
               <span>🎓</span> Instructor Guide
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

const StatusBar = ({ isDark }) => {
    return (
        <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, height: '32px', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '0 24px', zIndex: 300, color: isDark ? 'white' : '#0f172a',
            fontSize: '13px', fontWeight: 'bold'
        }}>
            <span>10:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Signal size={14} />
                <Wifi size={14} />
                <Battery size={16} />
            </div>
        </div>
    );
};

const DeepfakeSimulator = ({ language: languageProp }) => {
  const { language: contextLang } = useLanguage();
  const language = languageProp || contextLang || 'en';
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const currentStepId = STEPS_SEQ[stepIndex];
  const isSimulationComplete = currentStepId === 'complete';
  const [activeTab, setActiveTab] = useState('Home');
  const [scamAnalyzed, setScamAnalyzed] = useState(false);

  const speechIntervalRef = useRef(null);

  // Audio Voice-Over Logic - STRICT ROUTING
  useEffect(() => {
    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    window.speechSynthesis.cancel();
    if (!currentStepId || isSimulationComplete) return;

    // Use Instructor Guide Text exclusively for looping voice, NOT Knowledge Base
    const textToSpeak = TRANSLATIONS[language]?.[currentStepId] || TRANSLATIONS['en'][currentStepId] || "";
    
    let scammerPlaying = false;

    const runSpeak = () => {
      if (scammerPlaying) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const langMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };
      utterance.lang = langMap[language] || 'en-IN';
      window.speechSynthesis.speak(utterance);
    };

    if (currentStepId === 'step_video_call' && !scamAnalyzed) {
       scammerPlaying = true;
       window.speechSynthesis.cancel();
       const scammer = new SpeechSynthesisUtterance("You are under digital arrest. Do not disconnect. Give me the OTP sent to your phone.");
       scammer.pitch = 0.4;
       scammer.rate = 0.8;
       scammer.onend = () => {
           scammerPlaying = false;
           runSpeak(); // Trigger instructor loop after Scam voice finishes
       };
       window.speechSynthesis.speak(scammer);
       speechIntervalRef.current = setInterval(runSpeak, 10000);
    } else if (textToSpeak) {
      runSpeak();
      speechIntervalRef.current = setInterval(runSpeak, 9000);
    }

    return () => {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      window.speechSynthesis.cancel();
    };
  }, [currentStepId, language, isSimulationComplete, scamAnalyzed]);

  const handleNext = () => {
    setStepIndex(s => Math.min(s + 1, STEPS_SEQ.length - 1));
  };

  const tryAgain = () => {
    setStepIndex(0);
    setActiveTab('Home');
    setScamAnalyzed(false);
  };

  const instructionText = TRANSLATIONS[language]?.[currentStepId] || TRANSLATIONS['en'][currentStepId] || "";

  useEffect(() => {
    if (currentStepId === 'step_sms') setActiveTab('Home');
    if (currentStepId === 'step_incoming_call') setActiveTab('IncomingCall');
    if (currentStepId === 'step_video_call' || currentStepId === 'step_disconnect') setActiveTab('VideoCall');
    if (currentStepId === 'complete') setActiveTab('CompleteModal');
  }, [currentStepId]);

  return (
    <div className="bg-gray-900" style={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <style>
        {`
            @keyframes bounceTooltipX { 0%, 100% { transform: translate(0, -50%); } 50% { transform: translate(6px, -50%); } }
            @keyframes fadeContent { 0% { opacity: 0; transform: scale(0.98); } 100% { opacity: 1; transform: scale(1); } }
            @keyframes slideDownNav { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
            @keyframes pulseLogo { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
            @keyframes deepfakeGlitch { 
                0% { filter: blur(0px) hue-rotate(0deg) contrast(100%); transform: skew(0deg); } 
                2% { filter: blur(3px) hue-rotate(90deg) contrast(180%); transform: skew(4deg); }
                4% { filter: blur(0px) hue-rotate(0deg) contrast(100%); transform: skew(0deg); } 
                45% { filter: blur(0px) hue-rotate(0deg) contrast(100%); transform: translate(0,0px); }
                47% { filter: blur(1px) hue-rotate(-40deg) contrast(130%); transform: translate(2px, -3px); }
                49% { filter: blur(0px) hue-rotate(0deg) contrast(100%); transform: translate(0,0px); }
                90% { filter: blur(0px); transform: skew(0deg); }
                92% { filter: blur(4px) hue-rotate(180deg) saturate(200%); transform: skew(-5deg); }
                94% { filter: blur(0px); transform: skew(0deg); }
                100% { filter: blur(0px); transform: skew(0deg); }
            }
            @keyframes heavyPulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); box-shadow: 0 0 25px rgba(239,68,68,0.8); } 100% { transform: scale(1); } }
        `}
        </style>

        {/* Universal Disclaimer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#e2e8f0', color: '#0f172a', padding: '12px 24px', fontSize: '14px', fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', zIndex: 100, borderBottom: '1px solid #cbd5e1' }}>
            <span>⚠️</span> Disclaimer: This is a simulated environment to practice safe digital habits. Official agents will never demand money or OTPs.
        </div>

        {/* Outward Walkthrough Tooltip */}
        <OutsideTooltip stepId={currentStepId} text={instructionText} />

        {/* Centered Smartphone Mockup */}
        <div id="smartphone-frame" style={{ width: '100%', maxWidth: '380px', height: '90vh', maxHeight: '760px', background: 'black', borderRadius: '48px', padding: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 8px #1a1a1a', position: 'relative', overflow: 'hidden', marginTop: '40px' }}>
            
            <div style={{ width: '120px', height: '24px', background: '#1a1a1a', position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 400 }}></div>

            <div style={{ background: '#f8fafc', width: '100%', height: '100%', borderRadius: '36px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                
                {/* Simulated Realistic Status Bar */}
                <StatusBar isDark={activeTab !== 'Home'} />

                {activeTab === 'Home' && (
                    <div style={{ flex: 1, background: `url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop') center/cover`, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        {/* Realistic Dock & Grid over wallpaper */}
                        <div style={{ padding: '80px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.7)', borderRadius: '16px', backdropFilter: 'blur(5px)' }}></div>
                            ))}
                        </div>
                        
                        {/* Bottom Phone Dock */}
                        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', height: '80px', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', borderRadius: '24px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 16px' }}>
                            {[LucideIcons.Phone, LucideIcons.MessageSquare, LucideIcons.Camera, LucideIcons.Globe].map((Icon, idx) => (
                                <div key={idx} style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={24} color="#0f172a" />
                                </div>
                            ))}
                        </div>

                        {/* Urgent SMS Trap */}
                        {currentStepId === 'step_sms' && (
                            <div id="target-step_sms" onClick={() => handleNext()} style={{ position: 'absolute', top: '56px', left: '16px', right: '16px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: '16px', padding: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.5)', animation: 'slideDownNav 0.5s ease-out', cursor: 'pointer', zIndex: 100 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontSize: '12px', fontWeight: '900', marginBottom: '8px' }}>
                                    <ShieldAlert size={16} /> ⚠️ SBI Alert
                                </div>
                                <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700', lineHeight: '1.4' }}>
                                    Your account will be frozen in <span style={{ color: '#dc2626' }}>2 hours</span>. Click here to start Video KYC.
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'IncomingCall' && (
                    <div style={{ flex: 1, background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '100px', animation: 'fadeContent 0.3s' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', animation: 'pulseLogo 2s infinite' }}>
                            <ShieldAlert size={64} color="white" />
                        </div>
                        <h2 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '28px', fontWeight: '900', textAlign: 'center' }}>Police Cyber Cell / RBI</h2>
                        <p style={{ color: '#94a3b8', margin: '0 0 40px 0', fontSize: '16px' }}>Incoming Video Call...</p>
                        
                        <div style={{ marginTop: 'auto', marginBottom: '80px', width: '100%', display: 'flex', justifyContent: 'space-around', padding: '0 40px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                                    <PhoneOff size={36} color="white" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <div id="target-step_incoming_call" onClick={() => handleNext()} style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)' }}>
                                    <Video size={36} color="white" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'VideoCall' && (
                    <div style={{ flex: 1, background: '#000', display: 'flex', flexDirection: 'column', position: 'relative', animation: 'fadeContent 0.3s' }}>
                        
                        {/* Split Screen Scammer Top Half Viewport */}
                        <div 
                            id="target-step_video_call" 
                            onClick={() => {
                                if(currentStepId === 'step_video_call') {
                                    setScamAnalyzed(true);
                                    handleNext();
                                }
                            }} 
                            style={{ height: '55%', width: '100%', position: 'relative', overflow: 'hidden', cursor: currentStepId === 'step_video_call' ? 'pointer' : 'default', border: scamAnalyzed ? '6px solid #ef4444' : 'none', transition: 'border 0.3s' }}
                        >
                            <img 
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" 
                                alt="A generic stock photo of a person in formal attire, official looking face"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    animation: scamAnalyzed ? 'none' : 'deepfakeGlitch 6s infinite'
                                }}
                            />
                            
                            {/* Deepfake Analysis Overlay Flag */}
                            {scamAnalyzed && (
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(239,68,68,0.9)', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: '900', fontSize: '20px', border: '3px solid white', textTransform: 'uppercase', letterSpacing: '2px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                    Deepfake Detected
                                </div>
                            )}

                            {/* Robotic AI voice message overlay text */}
                            <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', background: 'rgba(0,0,0,0.85)', color: 'white', padding: '12px', borderRadius: '12px', borderLeft: '6px solid #ef4444', fontSize: '13px', lineHeight: '1.4', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                                <span style={{ color: '#ef4444', fontWeight: '900', display: 'block', marginBottom: '4px' }}>🤖 [Robotic AI Voice]:</span> 
                                You are under digital arrest. Do not disconnect. Give me the OTP sent to your phone.
                            </div>
                            
                            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.6)', padding: '6px 16px', borderRadius: '24px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulseLogo 1.5s infinite' }}></div>
                                <span style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', display: 'flex', gap: '8px' }}>00:43</span>
                            </div>
                        </div>
                        
                        {/* User Camera Bottom Half Viewport */}
                        <div style={{ flex: 1, width: '100%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderTop: '4px solid #334155' }}>
                            <User size={80} color="#475569" />
                            <span style={{ position: 'absolute', bottom: '24px', left: '24px', color: 'white', fontSize: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px' }}>You</span>
                        </div>
                        
                        {/* WhatsApp Controls Overlay */}
                        <div style={{ position: 'absolute', bottom: '32px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', gap: '24px', zIndex: 20 }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(51,65,85,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                                <LucideIcons.Camera size={24} color="white" />
                            </div>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(51,65,85,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                                <LucideIcons.VideoOff size={24} color="white" />
                            </div>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(51,65,85,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                                <LucideIcons.MicOff size={24} color="white" />
                            </div>
                            <div 
                                id="target-step_disconnect" 
                                onClick={() => currentStepId === 'step_disconnect' && handleNext()} 
                                style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentStepId === 'step_disconnect' ? 'pointer' : 'default', border: currentStepId === 'step_disconnect' ? '4px solid white' : 'none', animation: currentStepId === 'step_disconnect' ? 'heavyPulse 1s infinite' : 'none', boxShadow: '0 10px 25px rgba(239,68,68,0.5)', marginLeft: '12px' }}
                            >
                                <PhoneOff size={28} color="white" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Lesson Complete Modal Overlay */}
                {isSimulationComplete && activeTab === 'CompleteModal' && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'fadeContent 0.4s' }}>
                        <div style={{ background: 'white', borderRadius: '24px', padding: '40px 24px', textAlign: 'center', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
                            <div style={{ background: '#10b981', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <ShieldAlert size={48} color="white" />
                            </div>
                            <h2 style={{ margin: '0 0 16px 0', color: '#111', fontSize: '24px', fontWeight: '900' }}>🛡️ Scam Averted!</h2>
                            <p style={{ margin: '0 0 32px 0', color: '#444', lineHeight: '1.5', fontSize: '15px' }}>You successfully identified and disconnected a dangerous deepfake video call.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <button onClick={() => navigate('/banking')} style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}>Go Back</button>
                                <button onClick={tryAgain} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}>Try Again</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>

        {/* Knowledge Card (Persistent Center Right) */}
        {!isSimulationComplete && (
            <div style={{ position: 'fixed', top: '50%', right: '40px', transform: 'translateY(-50%)', width: '420px', zIndex: 50 }}>
                <div style={{ background: 'white', padding: '32px', borderRadius: '24px', borderLeft: '12px solid #5f259f', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#5f259f', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '28px' }}>💡</span> Did You Know?
                    </h2>
                    <div key={currentStepId} style={{ animation: 'fadeContent 0.5s', fontSize: '18px', color: '#334155', lineHeight: '1.6', fontWeight: '600' }}>
                        {KNOWLEDGE_BASE[currentStepId] || "Follow the guided instructions."}
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default DeepfakeSimulator;
