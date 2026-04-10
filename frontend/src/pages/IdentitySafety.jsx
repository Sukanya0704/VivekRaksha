import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  User, 
  FileText, 
  AlertTriangle,
  Info,
  Building2,
  Hotel,
  MousePointer2,
  Eye,
  Layout,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const BrowserFrame = ({ children, url, status = 'secure' }) => {
  return (
    <div className="browser-frame" style={{ width: '100%', height: '100%' }}>
      <div className="browser-header">
        <div className="browser-controls">
          <div className="control-dot" style={{ background: '#ff5f56' }}></div>
          <div className="control-dot" style={{ background: '#ffbd2e' }}></div>
          <div className="control-dot" style={{ background: '#27c93f' }}></div>
        </div>
        <div className="url-bar">
          {status === 'secure' ? <Lock size={12} style={{ marginRight: '8px', color: '#107c10' }} /> : <AlertTriangle size={12} style={{ marginRight: '8px', color: '#d93025' }} />}
          {url}
        </div>
      </div>
      <div className="simulated-window" style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

const IdentitySafety = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // module state: null (Menu), 1, 2, 3
  const [activeModule, setActiveModule] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [activeTip, setActiveTip] = useState(null);
  const [sensitivityLevel, setSensitivityLevel] = useState(0); // 0-100
  const [activeField, setActiveField] = useState(null);
  const [shuffledSites, setShuffledSites] = useState([]);
  const [selectedSiteIndex, setSelectedSiteIndex] = useState(null);

  // Module B Refs
  const hotelRef = useRef(null);
  const bankRef = useRef(null);

  const handleLessonSelect = (id) => {
    setActiveModule(id);
    setActiveTip(null);
    setSensitivityLevel(0);
    setActiveField(null);
    setSelectedSiteIndex(null);
    
    if (id === 3) {
      // Shuffle sites for randomization
      const sites = [
        { isReal: true, url: 'https://passportindia.gov.in', title: t('officialSite') },
        { isReal: false, url: 'http://passport-ind1a.gov.net/fees', title: t('scamSite') }
      ];
      setShuffledSites([...sites].sort(() => Math.random() - 0.5));
    }
  };

  const goBackToMenu = () => {
    setActiveModule(null);
    setActiveTip(null);
    setSensitivityLevel(0);
    setActiveField(null);
  };

  const handleFieldFocus = (field) => {
    setActiveField(field);
    let level = 0;
    let category = '';
    if (field === 'name') {
      level = 33;
      category = t('categoryPublic');
    } else if (field === 'phone') {
      level = 66;
      category = t('categoryPrivate');
    } else if (field === 'id') {
      level = 100;
      category = t('categoryCritical');
    }
    setSensitivityLevel(level);
    setActiveTip({
      type: level > 70 ? 'danger' : level > 40 ? 'warning' : 'info',
      message: t('clickedOnField', { field: t(field + 'Field'), category }) + ' ' + (level === 100 ? t('ruleExposure') : '')
    });
  };

  const handleDragEnd = (event, info, type) => {
    const x = info.point.x;
    const y = info.point.y;

    const hotelRect = hotelRef.current?.getBoundingClientRect();
    const bankRect = bankRef.current?.getBoundingClientRect();

    if (hotelRect && x >= hotelRect.left && x <= hotelRect.right && y >= hotelRect.top && y <= hotelRect.bottom) {
      if (type === 'FULL') {
        setMistakes(prev => prev + 1);
        setActiveTip({ type: 'danger', message: t('fullIdMistakeReflection') });
      } else {
        setActiveTip({ type: 'success', message: t('maskedIdSafeReflection') });
      }
    } else if (bankRect && x >= bankRect.left && x <= bankRect.right && y >= bankRect.top && y <= bankRect.bottom) {
      if (type === 'FULL') {
        setActiveTip({ type: 'success', message: 'Correct. Banks usually require full identification for secure transactions.' });
      } else {
        setActiveTip({ type: 'warning', message: 'A bank may reject a masked ID. For trusted official banking, full ID is often needed.' });
      }
    }
  };

  const handleSiteSelection = (index) => {
    const site = shuffledSites[index];
    setSelectedSiteIndex(index);
    if (site.isReal) {
      setActiveTip({ type: 'success', message: t('realSiteReflection') });
    } else {
      setActiveTip({ type: 'danger', message: t('fakeSiteReflection') });
    }
  };

  const getMeterColor = () => {
    if (sensitivityLevel <= 33) return '#4ade80'; // Green
    if (sensitivityLevel <= 66) return '#fbbf24'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="identity-safety-module" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', fontSize: '18.5px', color: 'var(--text-primary)' }}>
      {/* Global Header */}
      <header style={{ padding: '1.25rem 2rem', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button className="btn" onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 15px', minHeight: '48px', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
            <ArrowLeft size={24} /> {t('back')}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 700 }}>{t('idModuleTitle')}</h1>
            {!activeModule && <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{t('startingGateTitle')}</span>}
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <AnimatePresence mode="wait">
          {!activeModule ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              key="menu" 
              style={{ flex: 1, padding: '3rem', maxWidth: '1200px', margin: '0 auto', width: '100%', overflowY: 'auto' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 className="title-lg" style={{ marginBottom: '1rem' }}>{t('selectModule')}</h2>
                <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>{t('startingGateWelcome')}</p>
              </div>

              <div className="grid-cols-2" style={{ gap: '2rem' }}>
                {[
                  { id: 1, title: t('lessonSafeToShare'), icon: <Eye size={32} />, color: '#10B981', desc: 'Identify which personal details are safe to share on social platforms.' },
                  { id: 2, title: t('lessonMaskedID'), icon: <Layout size={32} />, color: '#3B82F6', desc: 'Learn to use Masked IDs for private services like hotels and rentals.' },
                  { id: 3, title: t('lessonFakeSites'), icon: <MousePointer2 size={32} />, color: '#ef4444', desc: 'Expertly spot phishing websites by analyzing URLs and security cues.' }
                ].map((lesson) => (
                  <motion.div 
                    key={lesson.id} 
                    className="glass-panel" 
                    onClick={() => handleLessonSelect(lesson.id)}
                    whileHover={{ scale: 1.02, x: 10 }}
                    style={{ 
                      display: 'flex', 
                      gap: '1.5rem', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      borderLeft: `6px solid ${lesson.color}`,
                      transition: 'border-color 0.3s ease'
                    }}
                  >
                    <div style={{ background: `${lesson.color}22`, color: lesson.color, padding: '1.25rem', borderRadius: '16px' }}>
                      {lesson.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{lesson.title}</h4>
                      <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{lesson.desc}</p>
                      <button className="btn-link" style={{ color: lesson.color, fontSize: '0.9rem', fontWeight: '700', marginTop: '0.8rem', display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        {t('startSimulation')} →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              key="simulation" 
              style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.75fr)', overflow: 'hidden' }}
            >
              {/* Action Zone */}
              <section style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.15)', overflowY: 'auto', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--glass-border)' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px', color: '#FF9F1C' }}>{t('actionZone')}</span>
                   <div style={{ background: '#FF9F1C22', color: '#FF9F1C', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>LIVE SIMULATION</div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                {/* Module A: Exposure Meter */}
                {activeModule === 1 && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <BrowserFrame url="https://face-book.com/profile/setup" status="secure">
                      <div style={{ display: 'flex', height: '100%' }}>
                        <div className="social-sidebar">
                          <div className="social-nav-item active">{t('idStep1')}</div>
                          <div className="social-nav-item" style={{ opacity: 0.5 }}>{t('idStep2')}</div>
                          <div className="social-nav-item" style={{ opacity: 0.5 }}>{t('idStep3')}</div>
                        </div>
                        <div style={{ flex: 1, padding: '2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0f2f5', border: '2px solid #1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               <User size={40} color="#1877f2" />
                            </div>
                            <div>
                               <h3 style={{ margin: 0 }}>SocialProfile <ShieldCheck size={16} color="#1877f2" /></h3>
                               <p style={{ fontSize: '0.85rem', color: '#65676b' }}>Complete your profile to find friends</p>
                            </div>
                          </div>

                          <div style={{ maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                             {['name', 'phone', 'id'].map(field => (
                               <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#444' }}>{t(field + 'Field')}</label>
                                  <input 
                                    className="input-control"
                                    onFocus={() => handleFieldFocus(field)}
                                    style={{ 
                                      background: '#f0f2f5',
                                      borderWidth: '1px', 
                                      borderColor: activeField === field ? getMeterColor() : '#ddd',
                                      fontSize: '0.95rem',
                                      color: '#333'
                                    }}
                                    placeholder={field === 'id' ? 'XXXX-XXXX-XXXX' : ''}
                                  />
                               </div>
                             ))}
                             <button className="btn" style={{ background: '#1877f2', color: 'white', marginTop: '1rem', borderRadius: '8px' }}>
                               Save Profile
                             </button>
                          </div>
                        </div>

                        {/* Sensitivity Meter Integrated */}
                        <div style={{ width: '120px', background: '#f7f8fa', borderLeft: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0.5rem', gap: '15px' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>{t('sensitivityMeter')}</span>
                          <div style={{ width: '12px', height: '180px', background: '#e0e0e0', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
                             <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${sensitivityLevel}%` }}
                                style={{ background: getMeterColor(), width: '100%' }}
                             />
                          </div>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: getMeterColor() }}>{sensitivityLevel}%</span>
                          
                          {/* Legend */}
                          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', padding: '0 10px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></div>
                                <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 600 }}>{t('categoryPublic')}</span>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }}></div>
                                <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 600 }}>{t('categoryPrivate')}</span>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                                <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 600 }}>{t('categoryCritical')}</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    </BrowserFrame>
                  </div>
                )}

                {/* Module B: Masked D&D */}
                {activeModule === 2 && (
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1 }}>
                        <div ref={hotelRef}>
                          <BrowserFrame url="https://urbanstay-hotels.com/checkin" status="secure">
                            <div style={{ padding: '1.5rem', height: '100%', background: '#fff' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <span className="hotel-brand">UrbanStay</span>
                                <div style={{ background: '#fef3f2', color: '#b42318', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>Action Required</div>
                              </div>
                              <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t('hotelApp')}</h4>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>Please provide identity verification to complete your check-in.</p>
                                <div style={{ height: '100px', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                                   <Hotel size={24} color="#ccc" />
                                   <span style={{ fontSize: '0.7rem', color: '#999', marginTop: '5px' }}>Drop ID Image Here</span>
                                </div>
                              </div>
                            </div>
                          </BrowserFrame>
                        </div>

                        <div ref={bankRef}>
                          <BrowserFrame url="https://globaltrust.bank/kyc-verify" status="secure">
                            <div style={{ padding: '1.5rem', height: '100%', background: '#fff' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <span className="bank-brand">GlobalTrust</span>
                                <ShieldCheck size={20} color="#004a99" />
                              </div>
                              <div style={{ background: '#f0f7ff', padding: '1rem', borderRadius: '8px', border: '1px solid #cce4ff' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t('bankApp')}</h4>
                                <p style={{ fontSize: '0.75rem', color: '#004a99', marginBottom: '1rem' }}>Regulatory KYC Requirement: Full Identity Verification</p>
                                <div style={{ height: '100px', border: '2px dashed #004a99', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                                   <Building2 size={24} color="#004a99" />
                                   <span style={{ fontSize: '0.7rem', color: '#004a99', marginTop: '5px' }}>Drop Full ID Here</span>
                                </div>
                              </div>
                            </div>
                          </BrowserFrame>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '1rem' }}>
                        <motion.div drag dragSnapToOrigin onDragEnd={(e, i) => handleDragEnd(e, i, 'FULL')} className="glass-panel" style={{ width: '220px', padding: '1rem', cursor: 'grab', background: 'white', color: '#333', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
                           <p style={{ fontSize: '0.7rem', fontWeight: 800, margin: 0, opacity: 0.6, color: '#666' }}>OFFICIAL ID</p>
                           <p style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '1px', margin: '8px 0', color: '#000' }}>4567 8901 0000</p>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <User size={16} /> <AlertTriangle size={16} color="#ef4444" />
                           </div>
                        </motion.div>
                        <motion.div drag dragSnapToOrigin onDragEnd={(e, i) => handleDragEnd(e, i, 'MASKED')} className="glass-panel" style={{ width: '220px', padding: '1rem', cursor: 'grab', background: 'white', color: '#333', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
                           <p style={{ fontSize: '0.7rem', fontWeight: 800, margin: 0, opacity: 0.6, color: '#666' }}>MASKED ID</p>
                           <p style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '2px', margin: '8px 0', color: '#000' }}>XXXX XXXX 0000</p>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <User size={16} /> <ShieldCheck size={16} color="#4ade80" />
                           </div>
                        </motion.div>
                      </div>
                   </div>
                )}

                {/* Module C: Fake Sites */}
                {activeModule === 3 && (
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('chooseOriginal')}</h2>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1 }}>
                        {shuffledSites.map((site, index) => (
                          <motion.div 
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSiteSelection(index)}
                            style={{ 
                              cursor: 'pointer', 
                              position: 'relative',
                              borderRadius: '16px',
                              overflow: 'hidden',
                              border: selectedSiteIndex === index ? `4px solid ${site.isReal ? '#4ade80' : '#ef4444'}` : '2px solid transparent'
                            }}
                          >
                            <BrowserFrame url={site.url} status={selectedSiteIndex !== null ? (site.isReal ? 'secure' : 'insecure') : 'secure'}>
                               <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                  {site.isReal ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                      <div style={{ background: '#e8f0fe', padding: '15px', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                        <Building2 size={48} color="#1a73e8" />
                                      </div>
                                      <h3 style={{ fontSize: '1.4rem', color: '#1a73e8', marginBottom: '1rem' }}>{t('passportTitle')}</h3>
                                      <p style={{ fontSize: '1rem', color: '#555' }}>Ministry of External Affairs</p>
                                      <div style={{ marginTop: '2rem', padding: '12px 24px', background: '#f8f9fa', borderRadius: '30px', border: '1px solid #ddd', fontSize: '0.9rem', fontWeight: 600 }}>
                                         {t('portalOptionA')}
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                      <div style={{ background: '#fff5f5', padding: '15px', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                        <ShieldAlert size={48} color="#d93025" />
                                      </div>
                                      <h3 style={{ fontSize: '1.4rem', color: '#d93025', marginBottom: '1rem' }}>{t('passportTitle')} (Express)</h3>
                                      <p style={{ fontSize: '1rem', color: '#555' }}>Fast-Track Passport Processing</p>
                                      <button className="btn btn-warning" style={{ marginTop: '1.5rem', borderRadius: '30px', pointerEvents: 'none' }}>
                                         {t('payUpiFee')}
                                      </button>
                                      <div style={{ marginTop: '1.5rem', opacity: 0.6, fontSize: '0.8rem' }}>
                                         {t('portalOptionB')}
                                      </div>
                                    </div>
                                  )}
                               </div>
                            </BrowserFrame>
                          </motion.div>
                        ))}
                      </div>
                   </div>
                )}
                </div>
              </section>

              {/* Reflection Zone */}
              <section style={{ padding: '2.5rem', background: 'var(--glass-bg)', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
                <div style={{ textAlign: 'center' }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px', color: '#10B981' }}>{t('reflectionZone')}</span>
                </div>

                {/* Tutorial Instruction - NEW */}
                <div style={{ background: 'rgba(255,159,28,0.1)', borderLeft: '4px solid #FF9F1C', padding: '1rem', borderRadius: '8px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF9F1C', fontWeight: 800, fontSize: '0.8rem', marginBottom: '5px' }}>
                      <Info size={16} /> TUTORIAL INSTRUCTION
                   </div>
                   <p style={{ fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>
                      {activeModule === 1 && "Click on each field in the social media profile to see its sensitivity level."}
                      {activeModule === 2 && "Drag the correct ID (Full or Masked) to the upload zones in both apps."}
                      {activeModule === 3 && "Review both browser windows and click the website you think is authentic."}
                   </p>
                </div>

                <div style={{ flex: 1 }}>
                   <AnimatePresence mode="wait">
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={activeTip?.message || 'tip'} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                         
                         <button className="btn" onClick={goBackToMenu} style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', color: '#FF9F1C', border: '1px solid #FF9F1C', minHeight: '48px', marginBottom: '1rem' }}>
                            <ChevronLeft size={20} /> {t('backToLessons')}
                         </button>

                         {activeTip ? (
                           <div style={{ 
                             padding: '2rem', 
                             borderRadius: '24px', 
                             background: activeTip.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : activeTip.type === 'warning' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                             border: `2px solid ${activeTip.type === 'danger' ? '#ef4444' : activeTip.type === 'warning' ? '#fbbf24' : '#3B82F6'}`,
                           }}>
                              {activeTip.type === 'danger' ? <ShieldAlert size={40} color="#ef4444" /> : activeTip.type === 'warning' ? <AlertTriangle size={40} color="#fbbf24" /> : <ShieldCheck size={40} color="#4ade80" />}
                              <h4 style={{ fontSize: '1.3rem', marginTop: '1rem', marginBottom: '1rem' }}>{activeTip.type === 'danger' ? t('riskIdentifiedTitle') : 'Insight'}</h4>
                              <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{activeTip.message}</p>
                           </div>
                         ) : (
                           <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '4rem' }}>
                              <MousePointer2 size={48} style={{ margin: 'auto', marginBottom: '1rem' }} />
                              <p>{t('scenariosInstructions') || 'Follow the tutorial instruction above to begin.'}</p>
                           </div>
                         )}
                      </motion.div>
                   </AnimatePresence>
                </div>

                <div style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                    <h5 style={{ margin: '0 0 1rem', fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase' }}>Lesson Status</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                       {[1, 2, 3].map(id => (
                         <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeModule === id ? '#FF9F1C' : 'rgba(255,255,255,0.1)' }}></div>
                            <span style={{ opacity: activeModule === id ? 1 : 0.5 }}>Lesson {id}</span>
                         </div>
                       ))}
                    </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
        <style>{`
          .input-control { transition: all 0.3s ease; }
          .btn:hover { transform: translateY(-2px); }
          .glass-panel { backdrop-filter: blur(10px); }
        `}</style>
      </div>
    </div>
  );
};

export default IdentitySafety;
