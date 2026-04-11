import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Key, Phone, User, AlertTriangle, Loader2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import logo from '../assets/logo.png';

const Login = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isCompact = language === 'hi' || language === 'mr';
  const [isSignup, setIsSignup] = useState(location.state?.isSignup || false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (location.state?.isSignup !== undefined) {
      setIsSignup(location.state.isSignup);
    }
  }, [location.state]);
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
          alert(t('pinMismatch'));
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

        alert(t('signupSuccess'));
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
      alert(err.message || t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container flex-center" style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '20px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <LanguageSelector />
        <ThemeToggle />
      </div>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: isCompact ? '24px' : '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: isCompact ? '1rem' : '2rem' }}>
          <img src={logo} alt="Logo" style={{ height: '48px', marginBottom: '1rem' }} />
          <h2 className="title-lg" style={{ color: 'var(--text-primary)' }}>{isSignup ? t('signup') : t('login')}</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isCompact ? '0.8rem' : '1.2rem' }}>
          {isSignup && (
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-primary)', opacity: 0.85 }}>
                <User size={18} /> {t('name')}
              </label>
              <input 
                type="text" 
                name="name" 
                className="input-control" 
                placeholder={t('enterName')} 
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-primary)', opacity: 0.85 }}>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-primary)', opacity: 0.85 }}>
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-primary)', opacity: 0.85 }}>
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
            <span style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
              {isSignup ? t('alreadyHaveAccount') : t('dontHaveAccount')}
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
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', opacity: 0.65, fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              {t('forgotPassword')}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
