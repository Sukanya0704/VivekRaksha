import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, Lock as LockIcon, CreditCard, ArrowLeft, Eye, EyeOff, Info, LogOut, Minus, Square, X as CloseIcon, ChevronDown, CheckCircle, User, FileText, Smartphone } from 'lucide-react';
import { markLevelComplete } from '../../utils/levelProgress';
import LanguageSelector from '../../components/LanguageSelector';

const TRANSLATIONS = {
  en: {
    dash_eye: 'Click here to view your balance securely.',
    dash_date_start: 'Select a start date for your account statement.',
    dash_date_end: 'Select an end date for your statement.',
    dash_download: 'Click here to download your statement.',
    dash_interstitial: 'Great job! Click to continue.',
    nav_mobile: 'Great! Now click here to try a Mobile Recharge.',
    mob_account: 'Select the account to debit.',
    mob_phone: 'Type your 10-digit mobile number.',
    mob_operator: 'Select your mobile operator.',
    mob_amount: 'Enter the recharge amount (e.g. 499).',
    mob_proceed: 'Click Proceed to Pay.',
    mob_otp: 'Type the simulated 4-digit OTP from your phone notification.',
    mob_interstitial: 'Excellent! Click to continue.',
    nav_bill: 'Recharge successful! Next, click Bill Payments.',
    bill_account: 'Select the account to debit for your bill.',
    bill_provider: 'Select your bill provider (e.g., Electricity).',
    bill_consumer: 'Enter your 10-digit consumer number.',
    bill_fetch: 'Click here to fetch your bill details.',
    bill_pay: 'Review the bill and click Pay Now.',
    bill_interstitial: 'Excellent! Click to continue.',
    nav_payee: 'Bill paid! Finally, let\'s Add a Payee securely.',
    payee_acc: 'Enter a 10-digit Account Number.',
    payee_confirm: 'Re-enter the 10-digit Account Number to confirm.',
    payee_ifsc: 'Enter the 11-character bank branch IFSC code.',
    payee_verify: 'Click Verify Branch to ensure it is correct.',
    payee_save: 'Everything looks good. Click Save.',
    pop_ack: 'Read this important security notice and click Acknowledge.',
    complete: 'Tutorial Complete!'
  },
  hi: { dash_eye: 'यहाँ क्लिक करें...' },
  mr: { dash_eye: 'येथे क्लिक करा...' }
};

const KNOWLEDGE_BASE = {
  dash_eye: "Why is the balance hidden (****)? This prevents 'shoulder surfing'—so someone standing behind you cannot see your money.",
  dash_date_start: "Banks let you choose specific date ranges so you don't have to download years of history at once, saving space and making it easier to read.",
  dash_date_end: "Always ensure the end date covers the exact period you want to review for unauthorized transactions.",
  dash_download: "Safety Tip: Never download bank statements on public computers (like cyber cafes). Only do this on your personal PC.",
  dash_interstitial: "Reviewing and securely downloading statements is key to maintaining healthy financial vigilance.",
  nav_mobile: "Recharging directly through your bank portal is safer than third-party apps because your payment details never leave the bank's secure system.",
  mob_account: "Always verify which account you are paying from, especially if you have multiple accounts like a joint account or a business account.",
  mob_phone: "Double-check the number! Recharges sent to the wrong phone number usually cannot be reversed by the bank.",
  mob_operator: "Selecting the correct operator ensures the bank's system connects to the right telecom network instantly.",
  mob_amount: "Count the zeros! ₹299 is very different from ₹2990. The bank will process exactly what you type.",
  mob_proceed: "When you click proceed, the bank creates a temporary, highly encrypted tunnel for your transaction.",
  mob_otp: "Scammers send FAKE OTP messages that look exactly like this. The real bank will NEVER call you to ask for this number. If you get an OTP you didn't request, ignore it!",
  mob_interstitial: "You have securely passed out of the mobile recharge segment without exposing any secondary payment tools.",
  nav_bill: "Paying utility bills safely inside your bank avoids falling for fake SMS payment links sent by scammers.",
  bill_account: "Always verify which account you are paying from, especially if you have multiple accounts like a joint account or a business account.",
  bill_provider: "Always choose the exact official name of your electricity board to avoid imposter listings.",
  bill_consumer: "Your consumer number uniquely identifies your home's meter. Keep it handy!",
  bill_fetch: "Why 'Fetch'? This connects directly to the biller. If it shows your correct name and exact bill amount, you know it's safe to pay!",
  bill_pay: "Once paid, you'll receive a transaction reference number. Always note it down in case of disputes.",
  bill_interstitial: "Excellent! You actively proved the safety of verifying biller connections securely from the bank site.",
  nav_payee: "Adding a payee means you are formally authorizing this person's account to receive funds from you in the future.",
  payee_acc: "Think of the Account Number as the specific 'House Number' of the person receiving the money.",
  payee_confirm: "Typing it twice ensures there are no mistakes. If you make a typo and send money to the wrong person, it is very difficult to get back.",
  payee_ifsc: "What is an IFSC code? It acts like a 'City Pincode'. It tells the money exactly which specific bank branch in the country to go to.",
  payee_verify: "Verifying the branch acts as a safety check to ensure the IFSC code you typed is actually valid and active.",
  payee_save: "The 30-minute cooling period is a vital security net. If a scammer hacks your account and adds themselves as a payee, you have 30 minutes to stop them!",
  pop_ack: "The 30-minute cooling period is a vital security net. If a scammer hacks your account and adds themselves as a payee, you have 30 minutes to stop them!"
};

const STEPS_SEQ = Object.keys(TRANSLATIONS.en);

const TargetWrapper = ({ id, children, position = 'bottom', onAction, currentStepId, isSimulationComplete, text, currentIndex, thisIndex }) => {
  const isCurrent = id === currentStepId;
  const isPast = thisIndex < currentIndex;
  const opacity = isSimulationComplete || isCurrent || isPast ? 1 : 0.4;
  const pointerEvents = isSimulationComplete ? 'auto' : (isCurrent ? 'auto' : 'none');
  const targetWrapRef = useRef(null);
  const [fixedStyle, setFixedStyle] = useState({ display: 'none' });
  const [arrowStyle, setArrowStyle] = useState({});

  useEffect(() => {
    if (!isCurrent || isSimulationComplete || !targetWrapRef.current) return;

    const calculatePosition = () => {
      const GAP = 70; 
      const tooltipWidth = 250;
      const tooltipHeight = 100; 
      const targetRect = targetWrapRef.current.getBoundingClientRect();

      const criticalElements = Array.from(document.querySelectorAll('input, select, button, h2, h3, h4, label, .critical-ui'));
      const criticalRects = criticalElements
        .filter(el => el !== targetWrapRef.current && !targetWrapRef.current.contains(el))
        .map(el => el.getBoundingClientRect());

      const rectIntersect = (r1, r2) => !(r2.left >= r1.right || r2.right <= r1.left || r2.top >= r1.bottom || r2.bottom <= r1.top);

      const positionsPreference = ['right', 'bottom', 'left', 'top'];
      let bestPos = position; 
      let finalTop = -9999;
      let finalLeft = -9999;
      
      for (const attemptPos of positionsPreference) {
        let tTop, tLeft;
        
        if (attemptPos === 'top') {
            tTop = targetRect.top - tooltipHeight - GAP;
            tLeft = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        } else if (attemptPos === 'bottom') {
            tTop = targetRect.bottom + GAP;
            tLeft = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        } else if (attemptPos === 'left') {
            tTop = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
            tLeft = targetRect.left - tooltipWidth - GAP;
        } else if (attemptPos === 'right') {
            tTop = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
            tLeft = targetRect.right + GAP;
        }

        const testBox = { top: tTop, left: tLeft, right: tLeft + tooltipWidth, bottom: tTop + tooltipHeight };

        if (testBox.top < 0 || testBox.left < 0 || testBox.right > window.innerWidth || testBox.bottom > window.innerHeight) continue;

        let collide = false;
        for (const crit of criticalRects) {
            if (rectIntersect(testBox, crit)) { collide = true; break; }
        }

        if (!collide) { bestPos = attemptPos; finalTop = tTop; finalLeft = tLeft; break; }
      }

      if (finalTop === -9999) {
          bestPos = position;
          if (bestPos === 'bottom') { finalTop = targetRect.bottom + GAP; finalLeft = targetRect.left; }
          else if (bestPos === 'top') { finalTop = targetRect.top - tooltipHeight - GAP; finalLeft = targetRect.left; }
          else if (bestPos === 'right') { finalTop = targetRect.top; finalLeft = targetRect.right + GAP; }
          else if (bestPos === 'left') { finalTop = targetRect.top; finalLeft = targetRect.left - tooltipWidth - GAP; }
      }

      setFixedStyle({ position: 'fixed', top: finalTop + 'px', left: finalLeft + 'px', zIndex: 999999, pointerEvents: 'none' });

      const baseArrow = { position: 'absolute', borderWidth: '12px', borderStyle: 'solid' };
      if (bestPos === 'bottom') setArrowStyle({ ...baseArrow, top: '-24px', left: '50%', transform: 'translateX(-50%)', borderColor: 'transparent transparent #15803d transparent' });
      else if (bestPos === 'top') setArrowStyle({ ...baseArrow, bottom: '-24px', left: '50%', transform: 'translateX(-50%)', borderColor: '#15803d transparent transparent transparent' });
      else if (bestPos === 'right') setArrowStyle({ ...baseArrow, left: '-24px', top: '50%', transform: 'translateY(-50%)', borderColor: 'transparent #15803d transparent transparent' });
      else if (bestPos === 'left') setArrowStyle({ ...baseArrow, right: '-24px', top: '50%', transform: 'translateY(-50%)', borderColor: 'transparent transparent transparent #15803d' });
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);

    return () => { window.removeEventListener('resize', calculatePosition); window.removeEventListener('scroll', calculatePosition, true); };
  }, [isCurrent, isSimulationComplete, position]);

  return (
    <>
      <div ref={targetWrapRef} onClick={onAction && ((!isSimulationComplete && isCurrent) || isSimulationComplete) ? onAction : undefined} style={{ position: 'relative', display: 'inline-block', opacity, pointerEvents, transition: 'all 0.3s', width: '100%', cursor: pointerEvents==='auto' && onAction ? 'pointer': 'default' }}>
         {children}
      </div>
      {isCurrent && !isSimulationComplete && (
         <div style={fixedStyle}>
             <div style={{ animation: 'bounceTooltip 1.5s infinite', backgroundColor: '#15803d', color: 'white', padding: '12px 16px', borderRadius: '8px', width: '250px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', color: '#bbf7d0' }}>
                   <span>🎓</span> Instructor Guide
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.4', textAlign: 'left' }}>{text}</div>
                <div style={arrowStyle} />
             </div>
         </div>
      )}
    </>
  );
};

const NavItem = ({ label, isActive, icon }) => (
  <div style={{ padding: '16px 24px', backgroundColor: isActive ? '#f0f4f8' : 'transparent', borderRight: isActive ? '4px solid #00356b' : '4px solid transparent', color: isActive ? '#00356b' : '#64748b', fontWeight: isActive ? 'bold' : 'normal', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
     {icon}
     {label}
  </div>
);

const NetBankingSimulator = ({ language: languageProp }) => {
  const { t, language: contextLang } = useLanguage();
  const language = languageProp || contextLang || 'en';
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const currentStepId = STEPS_SEQ[stepIndex];
  const isSimulationComplete = currentStepId === 'complete';

  const [dates, setDates] = useState({ start: '', end: '' });
  const [balVisible, setBalVisible] = useState(false);
  const [mobileData, setMobileData] = useState({ account: '', phone: '', operator: '', amount: '', otp: '' });
  const [billData, setBillData] = useState({ account: '', provider: '', consumer: '' });
  const [billVisible, setBillVisible] = useState(false);
  const [payeeData, setPayeeData] = useState({ acc: '', confirm: '', ifsc: '', branch: '' });
  
  const [payeeError, setPayeeError] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [showSecurityPop, setShowSecurityPop] = useState(false);
  const [showDownloadShelf, setShowDownloadShelf] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const speechIntervalRef = useRef(null);

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };
    utterance.lang = langMap[language] || 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    window.speechSynthesis.cancel();

    if (!currentStepId || isSimulationComplete) return;

    const textToSpeak = TRANSLATIONS[language]?.[currentStepId] || TRANSLATIONS['en'][currentStepId];
    if (textToSpeak) {
      speakText(textToSpeak);
      speechIntervalRef.current = setInterval(() => speakText(textToSpeak), 8000);
    }

    return () => {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      window.speechSynthesis.cancel();
    };
  }, [currentStepId, language, isSimulationComplete]);

  const handleNext = () => {
    if (stepIndex < STEPS_SEQ.length - 1) setStepIndex(s => s + 1);
  };

  const restartTutorial = () => {
    setStepIndex(0); setDates({ start: '', end: '' }); setBalVisible(false);
    setMobileData({ account: '', phone: '', operator: '', amount: '', otp: '' });
    setBillData({ account: '', provider: '', consumer: '' }); setBillVisible(false);
    setPayeeData({ acc: '', confirm: '', ifsc: '', branch: '' }); setPayeeError(false);
    setShowOtpScreen(false); setShowSecurityPop(false); setShowDownloadShelf(false);
    setActiveTab('Dashboard');
  };

  const getStepProps = (id) => ({
    id, currentStepId, isSimulationComplete,
    text: TRANSLATIONS[language]?.[id] || TRANSLATIONS['en'][id],
    currentIndex: stepIndex, thisIndex: STEPS_SEQ.indexOf(id)
  });

  const isInterstitial = currentStepId.includes('_interstitial');
  const activeKnowledge = payeeError ? "This error is a safety net. Sending money to a typed-in account by mistake is very hard to reverse. Always double-check!" : (KNOWLEDGE_BASE[currentStepId] || "Follow the guided instructions in the Banking Practice tool to uncover safe browsing secrets. Focus on the learning targets!");

  const clickDashEye = () => { setBalVisible(true); handleNext(); };
  const handleDateStart = (e) => { setDates(d => ({ ...d, start: e.target.value })); if (currentStepId === 'dash_date_start' && e.target.value !== '') handleNext(); };
  const handleDateEnd = (e) => { setDates(d => ({ ...d, end: e.target.value })); if (currentStepId === 'dash_date_end' && e.target.value !== '') handleNext(); };
  const clickDownload = () => { setShowDownloadShelf(true); handleNext(); };

  const clickNavMobile = () => { setShowDownloadShelf(false); setActiveTab('Mobile Recharge'); handleNext(); };
  const clickNavBill = () => { setActiveTab('Bill Payments'); handleNext(); };
  const clickNavPayee = () => { setActiveTab('Add Payee'); handleNext(); };

  const handleMobAcc = (e) => { setMobileData(d => ({ ...d, account: e.target.value })); if (currentStepId === 'mob_account' && e.target.value !== '') handleNext(); };
  const handlePhone = (e) => { const val = e.target.value.replace(/\\D/g, '').slice(0, 10); setMobileData(d => ({ ...d, phone: val })); if (currentStepId === 'mob_phone' && val.length === 10) handleNext(); };
  const handleOper = (e) => { setMobileData(d => ({ ...d, operator: e.target.value })); if (currentStepId === 'mob_operator' && e.target.value !== '') handleNext(); };
  const handleAmt = (e) => { const val = e.target.value.replace(/\\D/g, ''); setMobileData(d => ({ ...d, amount: val })); if (currentStepId === 'mob_amount' && val.length >= 2) handleNext(); };
  const clickMobProc = () => { setShowOtpScreen(true); handleNext(); };
  const handleOtp = (e) => {
    const val = e.target.value.replace(/\\D/g, '').slice(0, 4);
    setMobileData(d => ({ ...d, otp: val }));
    if (currentStepId === 'mob_otp' && val === '4512') { setTimeout(() => { setShowOtpScreen(false); handleNext(); }, 600); }
  };

  const handleBillAcc = (e) => { setBillData(d => ({ ...d, account: e.target.value })); if (currentStepId === 'bill_account' && e.target.value !== '') handleNext(); };
  const handleProv = (e) => { setBillData(d => ({ ...d, provider: e.target.value })); if (currentStepId === 'bill_provider' && e.target.value !== '') handleNext(); };
  const handleCons = (e) => { const val = e.target.value.replace(/\\D/g, '').slice(0, 10); setBillData(d => ({ ...d, consumer: val })); if (currentStepId === 'bill_consumer' && val.length === 10) handleNext(); };
  const clickBillFetch = () => { setBillVisible(true); handleNext(); };
  const clickBillPay = () => { setBillVisible(false); handleNext(); };

  const handleAcc = (e) => { const val = e.target.value.replace(/\\D/g, '').slice(0, 10); setPayeeData(d => ({ ...d, acc: val })); if (currentStepId === 'payee_acc' && val.length === 10) handleNext(); };
  const handleConf = (e) => {
    const val = e.target.value.replace(/\\D/g, '').slice(0, 10);
    setPayeeData(d => ({ ...d, confirm: val }));
    if (currentStepId === 'payee_confirm' && val.length === 10) {
        if (val !== payeeData.acc) setPayeeError(true);
        else { setPayeeError(false); handleNext(); }
    } else { setPayeeError(false); }
  };
  const handleIfsc = (e) => { const val = e.target.value.toUpperCase().slice(0, 11); setPayeeData(d => ({ ...d, ifsc: val })); if (currentStepId === 'payee_ifsc' && val.length === 11) handleNext(); };
  const clickPayeeVerify = () => { setPayeeData(d => ({ ...d, branch: 'Mumbai Main Branch' })); handleNext(); };
  const clickPayeeSave = () => { setShowSecurityPop(true); handleNext(); };
  const clickPopAck = () => { setShowSecurityPop(false); handleNext(); };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <style>
      {`
        @keyframes bounceTooltip { 0%, 100% { margin-top: 0px; margin-left: 0px;} 50% { margin-top: -6px; } }
        @keyframes scaleIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slideUp { 0% { transform: translateY(100%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes fadeContent { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes highlightFlash { 0% { transform: scale(1); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); } 30% { transform: scale(1.02); box-shadow: 0 0 25px rgba(67, 56, 202, 0.6); } 100% { transform: scale(1); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); } }
        .demo-input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; color: #1e293b; background: white; transition: border-color 0.2s;}
        .demo-input:focus { outline: 2px solid #00356b; border-color: transparent; }
        .demo-btn { width: 100%; padding: 12px; background: #00356b; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; transition: background 0.2s;}
        .demo-btn:hover { background: #002244; }
      `}
      </style>

      {/* Universal Disclaimer Banner */}
      <div style={{ width: '100%', background: '#fffbeb', borderBottom: '1px solid #fde68a', color: '#92400e', padding: '12px 24px', fontSize: '14px', fontWeight: '500', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', zIndex: 100, flexShrink: 0 }}>
         <span>⚠️</span> Disclaimer: Every bank's website looks different. This is a basic simulation to practice secure digital habits. Never enter your real bank details here.
      </div>

      {/* Main Simulator Container */}
      <div style={{ width: '100%', flex: 1, padding: '2rem 3rem', paddingRight: '450px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
         <header className="critical-ui" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
           <button className="btn-link" onClick={() => navigate('/banking')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
             <ArrowLeft size={24} />
           </button>
           <h2 className="title-lg" style={{ margin: 0, color: 'white' }}>Online Banking Practice</h2>
         </header>

         {/* Outer Windows Browser Frame */}
         <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif' }}>
           
           <div style={{ backgroundColor: '#dde1e5', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', border: '1px solid #7a7b7c', display: 'flex', flexDirection: 'column' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px' }}>
                  <div style={{ fontSize: '12px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={14}/> State Bank of India - Personal Banking</div>
                  <div style={{ display: 'flex', gap: '12px', color: '#4b5563' }}><Minus size={16} /><Square size={14} /><CloseIcon size={16} /></div>
               </div>
               <div style={{ backgroundColor: '#f1f3f4', padding: '8px 16px', display: 'flex', borderBottom: '1px solid #ccc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '16px', padding: '6px 16px', flex: 1, border: '1px solid #ddd' }}>
                     <LockIcon size={14} color="#15803d" style={{ marginRight: '8px' }} />
                     <span style={{ fontSize: '14px', color: '#1a1a1a' }}>https://retail.onlinesbi.sbi/retail/login.htm</span>
               </div>
            </div>
           </div>
            
           <div style={{ border: '1px solid #ccc', borderTop: 'none', backgroundColor: '#f8fafc', minHeight: '650px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
               
               <div style={{ backgroundColor: '#00356b', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="critical-ui" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ background: '#fff', color: '#00356b', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px' }}>SBI</div>
                     <h2 style={{ margin: 0, fontSize: '1.4rem' }}>State Bank of India</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px' }}>
                     <LanguageSelector />
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> Welcome, Demo User</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#93c5fd' }}><LogOut size={18} /> Logout</div>
                  </div>
               </div>

               <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
                  
                  <div style={{ width: '25%', backgroundColor: 'white', borderRight: '1px solid #e2e8f0', padding: '24px 0', minWidth: '220px' }}>
                     <div style={{ opacity: activeTab === 'Dashboard' ? 1 : 0.4 }}><NavItem label="Dashboard" isActive={activeTab === 'Dashboard'} icon={<Square size={18}/>} /></div>
                     <TargetWrapper {...getStepProps('nav_mobile')} onAction={clickNavMobile} position="right"><NavItem label="Mobile Recharge" isActive={activeTab === 'Mobile Recharge'} icon={<Smartphone size={18}/>} /></TargetWrapper>
                     <TargetWrapper {...getStepProps('nav_bill')} onAction={clickNavBill} position="right"><NavItem label="Bill Payments" isActive={activeTab === 'Bill Payments'} icon={<FileText size={18}/>} /></TargetWrapper>
                     <TargetWrapper {...getStepProps('nav_payee')} onAction={clickNavPayee} position="right"><NavItem label="Add Payee" isActive={activeTab === 'Add Payee'} icon={<User size={18}/>} /></TargetWrapper>
                  </div>

                  <div style={{ width: '75%', padding: '40px', backgroundColor: '#f8fafc', position: 'relative' }}>
                     
                     {/* Interstitial Success Override */}
                     {isInterstitial && (
                         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.95)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                            <CheckCircle size={64} color="#10b981" style={{ marginBottom: '24px', animation: 'scaleIn 0.5s' }} />
                            <h2 style={{ marginTop: 0, fontSize: '28px', color: '#065f46', marginBottom: '16px' }}>Module Complete!</h2>
                            <p style={{ fontSize: '18px', color: '#334155', marginBottom: '32px', textAlign: 'center', maxWidth: '400px' }}>
                                {currentStepId === 'dash_interstitial' && "Great job! You have securely downloaded your statement."}
                                {currentStepId === 'mob_interstitial' && "Excellent! You successfully recharged securely."}
                                {currentStepId === 'bill_interstitial' && "Excellent! You successfully paid a bill directly through your bank."}
                            </p>
                            <TargetWrapper {...getStepProps(currentStepId)} position="bottom" onAction={handleNext}>
                                <button className="demo-btn critical-ui" style={{ background: '#10b981', padding: '16px 32px', fontSize: '16px', borderRadius: '8px', width: 'auto' }}>Continue to Next Lesson</button>
                            </TargetWrapper>
                         </div>
                     )}

                     {activeTab === 'Dashboard' && (
                        <div>
                           <h3 className="critical-ui" style={{ marginTop: 0, color: '#1e293b', fontSize: '20px' }}>Account Overview</h3>
                           <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
                              <div className="critical-ui">
                                 <div style={{ color: '#64748b', fontSize: '15px', marginBottom: '8px' }}>Savings Account (**** 1234)</div>
                                 <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00356b' }}>{balVisible ? '₹ 50,000.00' : '₹ * * * *'}</div>
                              </div>
                              <TargetWrapper {...getStepProps('dash_eye')} onAction={clickDashEye} position="left">
                                 <button className="critical-ui" style={{ padding: '12px', borderRadius: '50%', background: '#f0f4f8', border: 'none', cursor: 'pointer' }}>
                                    {balVisible ? <Eye size={28} color="#00356b"/> : <EyeOff size={28} color="#64748b"/>}
                                 </button>
                              </TargetWrapper>
                           </div>

                           <h4 className="critical-ui" style={{ color: '#1e293b', marginBottom: '16px', fontSize: '18px' }}>Recent Statements</h4>
                           <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '20px', alignItems: 'flex-end', border: '1px solid #e2e8f0' }}>
                              <div style={{ flex: 1 }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Start Date</label>
                                 <TargetWrapper {...getStepProps('dash_date_start')} position="top">
                                    <input type="date" value={dates.start} onChange={handleDateStart} className="demo-input critical-ui" />
                                 </TargetWrapper>
                              </div>
                              <div style={{ flex: 1 }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>End Date</label>
                                 <TargetWrapper {...getStepProps('dash_date_end')} position="top">
                                    <input type="date" value={dates.end} onChange={handleDateEnd} className="demo-input critical-ui" />
                                 </TargetWrapper>
                              </div>
                              <div style={{ width: '220px' }}>
                                 <TargetWrapper {...getStepProps('dash_download')} onAction={clickDownload} position="top">
                                    <button className="demo-btn critical-ui">Download Statement</button>
                                 </TargetWrapper>
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === 'Mobile Recharge' && (
                        <div>
                           <h3 className="critical-ui" style={{ marginTop: 0, color: '#1e293b', fontSize: '20px' }}>Mobile Recharge</h3>
                           <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '450px', border: '1px solid #e2e8f0' }}>
                              <div style={{ marginBottom: '20px' }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Select Account to Debit</label>
                                 <TargetWrapper {...getStepProps('mob_account')} position="right">
                                    <select className="demo-input critical-ui" value={mobileData.account} onChange={handleMobAcc}>
                                       <option value="">Select Account</option>
                                       <option value="Savings">Savings Account (**** 1234)</option>
                                       <option value="Current">Current Account (**** 5678)</option>
                                    </select>
                                 </TargetWrapper>
                              </div>
                              <div style={{ marginBottom: '20px' }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Mobile Number</label>
                                 <TargetWrapper {...getStepProps('mob_phone')} position="right">
                                    <input type="text" placeholder="Enter 10-digit number" value={mobileData.phone} onChange={handlePhone} className="demo-input critical-ui" />
                                 </TargetWrapper>
                              </div>
                              <div style={{ marginBottom: '20px' }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Operator</label>
                                 <TargetWrapper {...getStepProps('mob_operator')} position="right">
                                    <select className="demo-input critical-ui" value={mobileData.operator} onChange={handleOper}>
                                       <option value="">Select Operator</option>
                                       <option value="Airtel">Airtel</option><option value="Jio">Jio</option><option value="VI">VI</option><option value="BSNL">BSNL</option>
                                    </select>
                                 </TargetWrapper>
                              </div>
                              <div style={{ marginBottom: '32px' }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Amount (₹)</label>
                                 <TargetWrapper {...getStepProps('mob_amount')} position="right">
                                    <input type="text" placeholder="Enter Amount" value={mobileData.amount} onChange={handleAmt} className="demo-input critical-ui" />
                                 </TargetWrapper>
                              </div>
                              <TargetWrapper {...getStepProps('mob_proceed')} onAction={clickMobProc} position="top">
                                 <button className="demo-btn critical-ui">Proceed to Pay</button>
                              </TargetWrapper>
                           </div>
                        </div>
                     )}

                     {activeTab === 'Bill Payments' && (
                        <div>
                           <h3 className="critical-ui" style={{ marginTop: 0, color: '#1e293b', fontSize: '20px' }}>Bill Payments</h3>
                           <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '450px', border: '1px solid #e2e8f0' }}>
                              <div style={{ marginBottom: '20px' }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Select Account to Debit</label>
                                 <TargetWrapper {...getStepProps('bill_account')} position="right">
                                    <select className="demo-input critical-ui" value={billData.account} onChange={handleBillAcc}>
                                       <option value="">Select Account</option>
                                       <option value="Savings">Savings Account (**** 1234)</option>
                                       <option value="Current">Current Account (**** 5678)</option>
                                    </select>
                                 </TargetWrapper>
                              </div>
                              <div style={{ marginBottom: '20px' }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Biller Category</label>
                                 <TargetWrapper {...getStepProps('bill_provider')} position="right">
                                    <select className="demo-input critical-ui" value={billData.provider} onChange={handleProv}>
                                       <option value="">Select Category</option>
                                       <option value="Electricity">Electricity</option><option value="Water">Water</option><option value="Gas">Gas</option><option value="Broadband">Broadband</option>
                                    </select>
                                 </TargetWrapper>
                              </div>
                              <div style={{ marginBottom: '32px' }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Consumer Number</label>
                                 <TargetWrapper {...getStepProps('bill_consumer')} position="right">
                                    <input type="text" placeholder="Enter 10-digit Consumer No." value={billData.consumer} onChange={handleCons} className="demo-input critical-ui" />
                                 </TargetWrapper>
                              </div>
                              <TargetWrapper {...getStepProps('bill_fetch')} onAction={clickBillFetch} position="top">
                                 <button className="demo-btn critical-ui">Fetch Bill Details</button>
                              </TargetWrapper>

                              {billVisible && (
                                 <div className="critical-ui" style={{ marginTop: '24px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', animation: 'scaleIn 0.3s' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                       <span style={{ color: '#64748b', fontSize: '14px' }}>Due Date</span>
                                       <span style={{ fontWeight: 'bold', color: '#0f172a' }}>15 Nov 2026</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                       <span style={{ color: '#64748b', fontSize: '14px' }}>Amount Due</span>
                                       <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#dc2626' }}>₹ 1,250.00</span>
                                    </div>
                                    <TargetWrapper {...getStepProps('bill_pay')} onAction={clickBillPay} position="top">
                                       <button className="demo-btn critical-ui">Pay Now</button>
                                    </TargetWrapper>
                                 </div>
                              )}
                           </div>
                        </div>
                     )}

                     {activeTab === 'Add Payee' && (
                        <div>
                           <h3 className="critical-ui" style={{ marginTop: 0, color: '#1e293b', fontSize: '20px' }}>Add Beneficiary / Payee</h3>
                           <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '550px', border: '1px solid #e2e8f0' }}>
                              <div style={{ marginBottom: '20px' }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Account Number</label>
                                 <TargetWrapper {...getStepProps('payee_acc')} position="right">
                                    <input type="text" placeholder="Enter 10-digit Account Number" value={payeeData.acc} onChange={handleAcc} className="demo-input critical-ui" />
                                 </TargetWrapper>
                              </div>
                              <div style={{ marginBottom: '20px' }}>
                                 <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>Confirm Account Number</label>
                                 <TargetWrapper {...getStepProps('payee_confirm')} position="right">
                                    <input type="text" placeholder="Re-enter 10-digit Account Number" value={payeeData.confirm} onChange={handleConf} className="demo-input critical-ui" style={payeeError ? { borderColor: '#ef4444', outline: '2px solid #ef4444' } : {}} />
                                 </TargetWrapper>
                                 {payeeError && (
                                     <div className="critical-ui" style={{ color: '#ef4444', fontSize: '13.5px', fontWeight: 'bold', marginTop: '8px', animation: 'scaleIn 0.2s' }}>
                                        ❌ Account numbers do not match. Please re-enter carefully.
                                     </div>
                                 )}
                              </div>
                              <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'flex-end' }}>
                                 <div style={{ flex: 1 }}>
                                    <label className="critical-ui" style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>IFSC Code</label>
                                    <TargetWrapper {...getStepProps('payee_ifsc')} position="top">
                                       <input type="text" placeholder="e.g. SBIN0001234" value={payeeData.ifsc} onChange={handleIfsc} className="demo-input critical-ui" />
                                    </TargetWrapper>
                                 </div>
                                 <div style={{ width: '150px' }}>
                                    <TargetWrapper {...getStepProps('payee_verify')} onAction={clickPayeeVerify} position="top">
                                       <button className="demo-btn critical-ui" style={{ background: '#00356b' }}>Verify Branch</button>
                                    </TargetWrapper>
                                 </div>
                              </div>
                              {payeeData.branch && (
                                 <div className="critical-ui" style={{ padding: '16px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '32px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'scaleIn 0.3s' }}>
                                    <CheckCircle size={18} /> Verified Branch: <strong>{payeeData.branch}</strong>
                                 </div>
                              )}
                              <TargetWrapper {...getStepProps('payee_save')} onAction={clickPayeeSave} position="top">
                                 <button className="demo-btn critical-ui">Save Payee securely</button>
                              </TargetWrapper>
                           </div>
                        </div>
                     )}

                  </div>
               </div>
               
               {showDownloadShelf && (
                  <div className="critical-ui" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#f8fafc', borderTop: '1px solid #cbd5e1', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'slideUp 0.3s ease-out', zIndex: 10 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ background: '#e2e8f0', padding: '12px', borderRadius: '8px' }}><FileText size={24} color="#00356b" /></div>
                        <div><div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>Account_Statement.pdf</div><div style={{ fontSize: '12px', color: '#64748b' }}>45 KB • Download complete</div></div>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => setShowDownloadShelf(false)} style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#0f172a' }}>Open file</button>
                     </div>
                  </div>
               )}

               {showOtpScreen && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                     <div className="critical-ui" style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '350px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', animation: 'scaleIn 0.3s' }}>
                        <LockIcon size={40} color="#00356b" style={{ marginBottom: '16px' }} />
                        <h3 style={{ marginTop: 0, color: '#0f172a', fontSize: '22px' }}>Enter OTP</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>Check the simulated notification on your phone.</p>
                        <TargetWrapper {...getStepProps('mob_otp')} position="bottom">
                           <input type="text" placeholder="- - - -" value={mobileData.otp} onChange={handleOtp} className="demo-input critical-ui" style={{ width: '200px', letterSpacing: '12px', textAlign: 'center', fontSize: '28px', padding: '12px', border: '2px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: 'bold' }} />
                        </TargetWrapper>
                     </div>
                  </div>
               )}

               {showSecurityPop && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                     <div className="critical-ui" style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '450px', textAlign: 'center', borderTop: '8px solid #f59e0b', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', animation: 'scaleIn 0.3s' }}>
                        <h2 style={{ mt: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#b45309', fontSize: '24px' }}>
                           <Shield size={32} /> Beneficiary Added!
                        </h2>
                        <div style={{ background: '#fffbeb', padding: '24px', borderRadius: '8px', margin: '32px 0', textAlign: 'left', color: '#92400e', fontSize: '15px', border: '1px solid #fde68a', lineHeight: '1.6' }}>
                           <strong>Security Protection Active:</strong> Banks enforce a mandatory <strong>30-minute cooling period</strong> for any newly added payee before you can transfer funds to them.
                        </div>
                        <TargetWrapper {...getStepProps('pop_ack')} onAction={clickPopAck} position="bottom">
                           <button className="demo-btn critical-ui" style={{ background: '#f59e0b' }}>Acknowledge Notice</button>
                        </TargetWrapper>
                     </div>
                  </div>
               )}

               {isSimulationComplete && (
                  <div className="critical-ui" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                     <div style={{ background: 'white', padding: '48px', borderRadius: '16px', width: '500px', textAlign: 'center', animation: 'scaleIn 0.5s', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <CheckCircle size={72} color="#10b981" style={{ margin: '0 auto 24px' }} />
                        <h2 style={{ marginTop: 0, color: '#065f46', fontSize: '32px' }}>Tutorial Complete!</h2>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
                           <button onClick={restartTutorial} className="demo-btn critical-ui" style={{ padding: '14px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                              Restart Sandbox
                           </button>
                           <button onClick={() => markLevelComplete(5, navigate)} className="demo-btn critical-ui" style={{ padding: '14px 24px', background: '#00356b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                              Return to Safety Road &rarr;
                           </button>
                        </div>
                     </div>
                  </div>
               )}

           </div>
         </div>
      </div>

      {/* Simulated SMS Notification Popup */}
      {showOtpScreen && (
         <div className="critical-ui" style={{ position: 'fixed', top: '32px', right: '440px', width: '320px', background: '#f8fafc', borderRadius: '16px', boxShadow: '0 15px 30px rgba(0,0,0,0.3)', border: '1px solid #cbd5e1', zIndex: 99999, padding: '16px', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748b', fontSize: '13px', fontWeight: 'bold' }}>
               <span style={{ fontSize: '16px' }}>💬</span> Messages • Just Now
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>State Bank</div>
            <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.4' }}>
               Your OTP for a transaction of ₹{mobileData.amount || '299'} is <strong style={{color: '#000'}}>4512</strong>. Do NOT share this with anyone, even bank staff.
            </div>
         </div>
      )}

      {/* Floating Educational Guide Box */}
      <div className="critical-ui" style={{ position: 'fixed', right: '32px', top: '50%', transform: 'translateY(-50%)', width: '380px', zIndex: 50 }}>
          <div key={currentStepId} style={{ animation: 'fadeContent 0.4s ease-in-out, highlightFlash 0.8s ease-out', background: '#e0e7ff', padding: '32px 24px', borderRadius: '16px', border: '2px solid #a5b4fc', borderTop: '8px solid #4338ca', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#312e81', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '2px solid #c7d2fe' }}>
                  <span>💡</span> Did You Know?
              </h2>
              <div style={{ fontSize: '20px', color: '#1e1b4b', lineHeight: '1.6', fontWeight: '500' }}>
                  {activeKnowledge}
              </div>
          </div>
       </div>
    </div>
  );
};

export default NetBankingSimulator;
