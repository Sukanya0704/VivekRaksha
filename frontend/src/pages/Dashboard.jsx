import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Landmark, Building2, AlertCircle, Info, LogOut, Navigation } from 'lucide-react';

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

  // Note: Using the generated town image as a visual reference
  const townImageUrl = "/town.png";

  return (
    <div className="dashboard-container" style={{ 
      minHeight: '100vh', 
      background: '#1E1E1E',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header className="glass-nav" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#FF9F1C', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E1E1E', fontWeight: 'bold' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#EAEAEA' }}>{t('dashboard')}</h2>
        </div>
        
        <button className="btn btn-outline" onClick={() => { localStorage.clear(); navigate('/'); }} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="container" style={{ padding: '2rem', flex: 1 }}>
        <div className="glass-panel" style={{ background: 'rgba(214, 69, 69, 0.1)', border: '1px solid rgba(214, 69, 69, 0.2)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <AlertCircle color="#D64545" size={24} />
          <p style={{ color: '#EAEAEA', fontSize: '0.85rem' }}>{t('townDisclaimer')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          {/* Left: Interactive 3D Town Visual */}
          <div className="glass-panel" style={{ padding: '1rem', overflow: 'hidden', position: 'relative', height: '500px' }}>
            <h3 style={{ marginBottom: '1rem', color: '#FF9F1C' }}>Welcome to Safety Town, {user.name}</h3>
            <img 
              src={townImageUrl} 
              alt="Isometric Town" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', opacity: 0.9 }}
            />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', textAlign: 'center' }}>
                <p style={{ background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}>
                    Navigate to buildings to start your training.
                </p>
            </div>
          </div>

          {/* Right: Quick Access Buildings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div 
                className="glass-panel" 
                onClick={() => navigate('/banking')}
                style={{ 
                  cursor: 'pointer', 
                  transition: 'transform 0.3s ease',
                  borderLeft: '6px solid #FF9F1C'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(10px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255, 159, 28, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                        <Landmark size={40} color="#FF9F1C" />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1.3rem' }}>{t('bankBuilding')}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(234, 234, 234, 0.6)' }}>Learn UPI, Net Banking, and Scams.</p>
                    </div>
                </div>
              </div>

              <div 
                className="glass-panel" 
                style={{ 
                  opacity: 0.6,
                  cursor: 'not-allowed',
                  borderLeft: '6px solid #3B82F6'
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                        <Building2 size={40} color="#3B82F6" />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1.3rem' }}>{t('mncBuilding')}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(234, 234, 234, 0.6)' }}>Govt IDs & Civic Safety (Coming Soon).</p>
                    </div>
                </div>
              </div>

              <div className="glass-panel" style={{ flex: 1, background: 'rgba(255, 159, 28, 0.05)', border: '1px dashed #FF9F1C' }}>
                 <h5 style={{ color: '#FF9F1C', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Navigation size={18} /> Safety Tips
                 </h5>
                 <ul style={{ fontSize: '0.85rem', color: 'rgba(234, 234, 234, 0.7)', paddingLeft: '1.2rem' }}>
                    <li style={{ marginBottom: '8px' }}>Always verify the website URL before entering your PIN.</li>
                    <li>Banks never ask for your password over a phone call.</li>
                 </ul>
              </div>
          </div>
        </div>
      </main>

      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
        <button className="glass-panel" style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9F1C', cursor: 'help' }}>
          <Info size={32} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
