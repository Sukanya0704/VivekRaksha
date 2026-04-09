import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Lock, ExternalLink, ShieldAlert, CheckCircle, Info } from 'lucide-react';

const OtpSimulator = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Info, 2: Scenario, 3: Explanation
  const [selectedLink, setSelectedLink] = useState(null);

  const scenarios = [
    {
      id: 1,
      title: "The 'Tax Refund' Link",
      message: "Dear Citizen, your IT refund of ₹12,400 has been approved. Verify your details here to receive it: http://incometax-india-gov.org.in/refund",
      links: [
        { text: "http://incometax-india-gov.org.in/refund", isSafe: false, reason: "Government websites in India always end with '.gov.in'. This fake link uses '.org.in' to trick you." },
        { text: "https://www.incometax.gov.in", isSafe: true, reason: "This is the official government domain with HTTPS security." }
      ]
    }
  ];

  const handleLinkClick = (isSafe) => {
    setSelectedLink(isSafe);
    setStep(3);
  };

  return (
    <div className="module-page" style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-link" onClick={() => navigate('/banking')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="title-lg" style={{ margin: 0 }}>{t('moduleOTP')}</h2>
      </header>

      <div className="container" style={{ maxWidth: '800px' }}>
        {step === 1 && (
          <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
            <Lock size={64} color="#EF4444" style={{ marginBottom: '1.5rem' }} />
            <h3 className="title-lg" style={{ marginBottom: '1rem' }}>The Golden Rule of OTPs</h3>
            <p style={{ fontSize: '1.2rem', color: 'rgba(234, 234, 234, 0.8)', marginBottom: '2rem' }}>
              "An OTP is like the key to your house. You never give it to a stranger who calls you, no matter how official they sound."
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid #10B981' }}>
                    <p style={{ fontWeight: 'bold', color: '#10B981' }}>SAFE ✅</p>
                    <p style={{ fontSize: '0.8rem' }}>Enter OTP only when YOU initiated the transaction on a trusted site.</p>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid #EF4444' }}>
                    <p style={{ fontWeight: 'bold', color: '#EF4444' }}>DANGER ❌</p>
                    <p style={{ fontSize: '0.8rem' }}>Sharing OTP over a call to "verify KYC" or "receive a prize".</p>
                </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: '2.5rem' }} onClick={() => setStep(2)}>Start Identification Test</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
             <h4 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Wait! One of these links is a trap. Can you spot it?</h4>
             <div className="glass-panel" style={{ background: '#e5e7eb', color: '#1a1a1a', padding: '2rem', borderRadius: '24px', marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{scenarios[0].message}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {scenarios[0].links.map((link, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleLinkClick(link.isSafe)}
                            style={{ 
                                background: 'white', 
                                border: '1px solid #d1d5db', 
                                padding: '1rem', 
                                borderRadius: '12px', 
                                textAlign: 'left', 
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ color: '#1d4ed8', fontWeight: 'bold' }}>{link.text}</span>
                            <ExternalLink size={18} color="#9ca3af" />
                        </button>
                    ))}
                </div>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="glass-panel animate-fade-in" style={{ border: `2px solid ${selectedLink ? '#10B981' : '#EF4444'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              {selectedLink ? <CheckCircle color="#10B981" size={48} /> : <ShieldAlert color="#EF4444" size={48} />}
              <h3 style={{ margin: 0 }}>{selectedLink ? "Great Eye! You're Safe." : "Careful! That was a Trap."}</h3>
            </div>
            
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                {selectedLink 
                    ? "You correctly identified the official government domain. Scammers often use '.org' or '.net' to mimic government sites."
                    : "You clicked on a phishing link. Clicking such links can install malware or take you to a fake login page that steals your password."}
            </p>

            <div style={{ background: 'rgba(58, 58, 58, 0.4)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF9F1C', marginBottom: '0.5rem' }}>
                    <Info size={18} /> Pro Tip
                </h5>
                <p style={{ fontSize: '0.9rem' }}>
                    Hover your mouse over a link (or long-press on mobile) to see the **REAL** destination address before clicking. If it looks different from what's written, it's a scam.
                </p>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/banking')}>
              Finish Module
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpSimulator;
