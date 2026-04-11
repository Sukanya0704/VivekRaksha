import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className="btn btn-outline" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        padding: '8px 16px', 
        borderRadius: '20px',
        transition: 'all 0.3s ease'
      }}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={18} color="#FF9F1C" />
          <span style={{ fontSize: '0.9rem' }}>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={18} color="#3B82F6" />
          <span style={{ fontSize: '0.9rem' }}>Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
