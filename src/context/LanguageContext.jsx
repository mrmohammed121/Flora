import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return (
        localStorage.getItem('florascan_lang') ||
        localStorage.getItem('florascan_language') ||
        'en'
      );
    } catch (_) {
      return 'en';
    }
  });

  const setLanguage = useCallback((newLang) => {
    const validLangs = ['en', 'kn', 'hi'];
    const safeLang = validLangs.includes(newLang) ? newLang : 'en';
    setLanguageState(safeLang);
    try {
      localStorage.setItem('florascan_lang', safeLang);
      localStorage.setItem('florascan_language', safeLang);
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = safeLang;
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    try {
      localStorage.setItem('florascan_lang', language);
      localStorage.setItem('florascan_language', language);
    } catch (_) {}
  }, [language]);

  const t = useCallback(
    (key, fallback = '') => {
      const activeDict = translations[language] || translations.en;
      if (activeDict && activeDict[key] !== undefined) {
        return activeDict[key];
      }
      // Fallback to English dictionary if key missing in chosen dialect
      if (translations.en && translations.en[key] !== undefined) {
        return translations.en[key];
      }
      return fallback || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
