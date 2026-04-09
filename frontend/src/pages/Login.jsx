import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Key, Phone, User, AlertTriangle, Loader2 } from 'lucide-react';

const Login = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isCompact = language === 'hi' || language === 'mr';
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pin: '',
    confirmPin: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (formData.pin !== formData.confirmPin) {
          alert("PINs do not match!");
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            pin: formData.pin
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        alert("Sign up successful! Please log in with your PIN.");
        setIsSignup(false);
      } else {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: formData.phone,
            pin: formData.pin
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container flex-center" style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: isCompact ? '24px' : '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: isCompact ? '1rem' : '2rem' }}>
          <Shield size={48} color="#FF9F1C" style={{ marginBottom: '1rem' }} />
          <h2 className="title-lg">{isSignup ? t('signup') : t('login')}</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isCompact ? '0.8rem' : '1.2rem' }}>
          {isSignup && (
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'rgba(234, 234, 234, 0.7)' }}>
                <User size={18} /> Name
              </label>
              <input 
                type="text" 
                name="name" 
                className="input-control" 
                placeholder="Enter your name" 
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'rgba(234, 234, 234, 0.7)' }}>
              <Phone size={18} /> {t('phoneNum')}
            </label>
            <input 
              type="tel" 
              name="phone" 
              className="input-control" 
              placeholder={t('enterPhone')} 
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'rgba(234, 234, 234, 0.7)' }}>
              <Key size={18} /> {t('pin')}
            </label>
            <input 
              type="password" 
              name="pin" 
              className="input-control" 
              placeholder={t('enterPin')} 
              value={formData.pin}
              onChange={handleInputChange}
              required
              maxLength={4}
            />
          </div>

          {isSignup && (
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'rgba(234, 234, 234, 0.7)' }}>
                <Key size={18} /> {t('confirmPin')}
              </label>
              <input 
                type="password" 
                name="confirmPin" 
                className="input-control" 
                placeholder={t('confirmPin')} 
                value={formData.confirmPin}
                onChange={handleInputChange}
                required
                maxLength={4}
              />
            </div>
          )}

          {isSignup && (
            <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255, 159, 28, 0.1)', border: '1px dashed var(--color-warning-orange)', color: 'var(--color-warning-orange)', fontSize: '0.85rem', display: 'flex', gap: '8px' }}>
              <AlertTriangle size={32} />
              <p>{t('savePinInfo')}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', gap: '12px' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignup ? t('signup') : t('login'))}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'rgba(234, 234, 234, 0.6)' }}>
              {isSignup ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button 
              type="button" 
              className="btn-link" 
              onClick={() => setIsSignup(!isSignup)}
              style={{ background: 'none', border: 'none', color: 'var(--color-warning-orange)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
            >
              {isSignup ? t('login') : t('signup')}
            </button>
          </div>
          
          {!isSignup && (
            <button type="button" style={{ background: 'none', border: 'none', color: 'rgba(234, 234, 234, 0.4)', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              {t('forgotPassword')}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
