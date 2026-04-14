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
  const [status, setStatus] = useState({ type: '', message: '' });

  // Clear status after 3 seconds
  React.useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignup 
        ? { name: formData.name, phone: formData.phone, pin: formData.pin }
        : { phone: formData.phone, pin: formData.pin };

      if (isSignup && formData.pin !== formData.confirmPin) {
        setStatus({ type: 'error', message: t('pinMismatch') });
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(err => {
        throw new Error('Backend server is not responding. Please ensure the backend is running.');
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      // Sync to LocalStorage for persistence
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      if (isSignup) {
        setStatus({ type: 'success', message: `${t('signupSuccess')} - ${data.message || 'Data stored'}` });
        // After small delay, move to dashboard
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setStatus({ type: 'error', message: err.message });
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

        {status.message && (
          <div className={`animate-fade-in`} style={{ 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '1rem', 
            fontSize: '0.9rem',
            textAlign: 'center',
            background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${status.type === 'error' ? '#ef4444' : '#22c55e'}`,
            color: status.type === 'error' ? '#ef4444' : '#22c55e'
          }}>
            {status.message}
          </div>
        )}

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
