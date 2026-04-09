import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import * as LucideIcons from 'lucide-react';

const { ArrowLeft, ArrowRight, CheckCircle, ShieldAlert, Info, Shield, HelpCircle } = LucideIcons;

const UpiSimulator = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("UPI Simulator Mounted");
  }, []);

  const renderPhonePeUI = () => {
    switch(step) {
      case 1:
        return (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Purple Header */}
            <div style={{ background: '#5f259f', padding: '1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Your Location</p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Safety Town, IN</p>
              </div>
              <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {HelpCircle && <HelpCircle size={20} />}
              </div>
            </div>
            
            <div style={{ padding: '1.2rem', flex: 1, background: '#f5f5f5', color: '#333' }}>
              <div style={{ background: 'white', padding: '1.2rem', color: '#1a1a1a', marginBottom: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <p style={{ fontWeight: '700', marginBottom: '1.2rem', fontSize: '1rem' }}>Transfer Money</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.7rem' }}>
                  <div onClick={() => setStep(2)} style={{ cursor: 'pointer' }}>
                    <div style={{ background: '#5f259f', width: '48px', height: '48px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      {ArrowRight && <ArrowRight size={24} />}
                    </div>
                    To Contact
                  </div>
                  <div>
                    <div style={{ background: '#5f259f', width: '48px', height: '48px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      {Shield && <Shield size={24} />}
                    </div>
                    To Bank
                  </div>
                  <div>
                    <div style={{ background: '#5f259f', width: '48px', height: '48px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      {ArrowLeft && <ArrowLeft size={24} />}
                    </div>
                    Self A/c
                  </div>
                  <div>
                    <div style={{ background: '#5f259f', width: '48px', height: '48px', borderRadius: '16px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      {CheckCircle && <CheckCircle size={24} />}
                    </div>
                    Check Bal
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '1.2rem', borderRadius: '16px', border: '1px solid #e0e0e0', borderLeft: '4px solid #5f259f' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {Info && <Info size={16} color="#5f259f" />}
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#5f259f' }}>TUTORIAL TIP</p>
                </div>
                <p style={{ fontSize: '0.75rem', lineHeight: '1.4', color: '#444' }}>
                  In apps like PhonePe, click <strong>"To Contact"</strong> to start. Warning: Never trust links from unknown people!
                </p>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white', color: '#333' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee' }}>
              <div onClick={() => setStep(1)} style={{ cursor: 'pointer', marginRight: '1rem', padding: '4px' }}>
                {ArrowLeft && <ArrowLeft size={24} />}
              </div>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>Simulated User</p>
                <p style={{ fontSize: '0.75rem', color: '#888' }}>+91 99887 76655</p>
              </div>
            </div>
            <div style={{ flex: 1, padding: '2.5rem 1.5rem', textAlign: 'center' }}>
              <div style={{ background: '#f5f5f5', width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', border: '2px solid #5f259f' }}>
                SU
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '2rem' }}>Enter Amount</p>
              <div style={{ position: 'relative', maxWidth: '200px', margin: '0 auto' }}>
                <span style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.8rem', fontWeight: 'bold' }}>₹</span>
                <input 
                  autoFocus
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #5f259f', textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', outline: 'none', padding: '10px' }} 
                  placeholder="0"
                />
              </div>
            </div>
            <button 
              disabled={!amount}
              onClick={() => setStep(3)}
              style={{ background: '#5f259f', color: 'white', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 'bold', border: 'none', cursor: amount ? 'pointer' : 'not-allowed', opacity: amount ? 1 : 0.6 }}
            >
              PROCEED TO PAY
            </button>
          </div>
        );

      case 3:
        return (
          <div style={{ height: '100%', background: '#fff', color: '#333', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>ENTER 4-DIGIT UPI PIN</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2.5rem' }}>Paying ₹{amount}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '3rem' }}>
                {[1,2,3,4].map(i => <div key={i} style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #5f259f', background: 'transparent' }}></div>)}
              </div>

              <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '1.2rem', borderRadius: '16px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#d64545' }}>
                   {ShieldAlert && <ShieldAlert size={24} />}
                   <span style={{ fontWeight: 'bold' }}>IMPORTANT SAFETY</span>
                </div>
                <p style={{ fontSize: '0.8rem', lineHeight: '1.5', color: '#444' }}>
                  If you are <strong>RECEIVING</strong> money, you never need to enter your PIN. Scammers will try to trick you into entering your PIN to steal your money!
                </p>
              </div>
            </div>
            <button onClick={() => setStep(4)} style={{ background: '#1a1a1a', color: 'white', padding: '1.2rem', border: 'none', fontWeight: 'bold', fontSize: '1rem' }}>SUBMIT PIN</button>
          </div>
        );

      case 4:
        return (
          <div style={{ height: '100%', background: '#10b981', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                {CheckCircle && <CheckCircle size={80} color="white" />}
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Payment Successful</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>₹{amount} sent</p>
            <button className="btn btn-primary" style={{ marginTop: '2.5rem', background: 'white', color: '#10b981' }} onClick={() => navigate('/banking')}>
              Finish Training
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="module-page" style={{ minHeight: '100vh', background: '#1a1a1a', padding: '2rem' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="title-lg" style={{ color: 'white', marginBottom: '2rem' }}>{t('moduleUPI')}</h2>
        
        {/* Mobile Mockup */}
        <div style={{ 
          width: '320px', 
          height: '650px', 
          background: '#000', 
          borderRadius: '45px', 
          padding: '12px', 
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          border: '4px solid #444',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Notch */}
          <div style={{ width: '120px', height: '24px', background: '#000', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 100 }}></div>
          
          <div style={{ background: '#fff', width: '100%', height: '100%', borderRadius: '35px', overflow: 'hidden' }}>
            {renderPhonePeUI()}
          </div>
        </div>

        <div style={{ marginTop: '2rem', maxWidth: '400px', textAlign: 'center' }}>
             <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Note: This is a safe simulation. No real money is involved.</p>
        </div>
      </div>
    </div>
  );
};

export default UpiSimulator;
