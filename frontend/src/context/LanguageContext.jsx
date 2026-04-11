import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext(null);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  // Support multi-language based on what is chosen at the beginning (stored in localStorage)
  // Default language state is 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('languageSelected') || 'en';
  });

  // Keep localStorage perfectly synced if setLanguage is somehow called indirectly
  useEffect(() => {
    localStorage.setItem('languageSelected', language);
  }, [language]);

  // Optimized translation function with interpolation support
  const t = useCallback((key, params = {}) => {
    let text = translations[language]?.[key] || translations['en']?.[key] || key;
    
    // Simple interpolation for {variable}
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  }, [language]);

  // Optimized setter for language
  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  // Performance Optimization: Context provider value is memoized to avoid 
  // triggering deep re-renders across the app unless 'language' actually changes.
  const contextValue = useMemo(() => ({
    language,
    changeLanguage,
    t
  }), [language, changeLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
