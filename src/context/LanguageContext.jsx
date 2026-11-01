import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { translations } from '../locales/translations';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' }
];

const STORAGE_KEYS = ['florascan_lang', 'florascan_language'];

/**
 * Safely parse language preference from localStorage, handling raw codes and JSON serialization.
 */
function getInitialLanguage() {
  try {
    let saved = null;
    for (const key of STORAGE_KEYS) {
      const val = localStorage.getItem(key);
      if (val) {
        saved = val;
        break;
      }
    }
    if (!saved) return 'en';

    let candidate = saved.trim();
    // Handle JSON serialized strings or objects
    if (candidate.startsWith('{') || candidate.startsWith('"') || candidate.startsWith('[')) {
      try {
        const parsed = JSON.parse(candidate);
        if (typeof parsed === 'string') {
          candidate = parsed;
        } else if (parsed && typeof parsed === 'object') {
          candidate = parsed.code || parsed.language || parsed.lang || 'en';
        }
      } catch (_) {
        // Not valid JSON, keep as plain string
      }
    }

    const validCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
    return validCodes.includes(candidate) ? candidate : 'en';
  } catch (err) {
    console.warn('Failed to read language preference from localStorage:', err);
    return 'en';
  }
}

/**
 * Traverses a dictionary by direct key or dot-notation path, returning undefined if missing.
 */
function resolveTranslation(dict, key) {
  if (!dict || !key || typeof key !== 'string') return undefined;

  // 1. Direct flat key match (e.g., 'navStudio' or exact 'nav.studio')
  if (dict[key] !== undefined && dict[key] !== null) {
    return dict[key];
  }

  // 2. Nested dot-path traversal (e.g., 'nav.studio' inside { nav: { studio: '...' } })
  if (key.includes('.')) {
    const parts = key.split('.');
    let cur = dict;
    for (const part of parts) {
      if (cur === undefined || cur === null || typeof cur !== 'object') {
        return undefined;
      }
      cur = cur[part];
    }
    if (cur !== undefined && cur !== null) {
      return cur;
    }
  }

  return undefined;
}

const defaultTranslate = (key, paramsOrFallback = '', fallback = '') => {
  if (!key || typeof key !== 'string') {
    if (typeof paramsOrFallback === 'string') return paramsOrFallback;
    if (typeof fallback === 'string') return fallback;
    return '';
  }
  if (typeof paramsOrFallback === 'string' && paramsOrFallback) return paramsOrFallback;
  if (typeof fallback === 'string' && fallback) return fallback;
  return key;
};

const LanguageContext = createContext({
  language: 'en',
  currentLanguage: 'en',
  setLanguage: () => {},
  changeLanguage: () => {},
  languages: SUPPORTED_LANGUAGES,
  t: defaultTranslate
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((newLang) => {
    let targetCode = newLang;
    if (newLang && typeof newLang === 'object') {
      targetCode = newLang.code || newLang.language || newLang.lang || newLang.target?.value || 'en';
    }
    const validCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
    const safeLang = validCodes.includes(targetCode) ? targetCode : 'en';

    setLanguageState(safeLang);

    STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.setItem(key, safeLang);
      } catch (e) {
        console.warn(`Failed to save ${key} to localStorage:`, e);
      }
    });

    if (typeof document !== 'undefined') {
      document.documentElement.lang = safeLang;
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.setItem(key, language);
      } catch (_) {}
    });
  }, [language]);

  /**
   * Safe translation helper function.
   * Supports:
   * - Flat dictionary keys: t('navStudio')
   * - Nested dot paths: t('nav.studio')
   * - Fallback string: t('missingKey', 'Default Fallback')
   * - Interpolation params: t('welcomeUser', { name: 'John' })
   * - Params + Fallback: t('welcomeUser', { name: 'John' }, 'Welcome {name}')
   * Safely defaults to English if key is missing in active language.
   * Never throws TypeError: Cannot read properties of undefined.
   */
  const t = useCallback(
    (key, paramsOrFallback = '', fallback = '') => {
      if (!key || typeof key !== 'string') {
        if (typeof paramsOrFallback === 'string') return paramsOrFallback;
        if (typeof fallback === 'string') return fallback;
        return '';
      }

      let params = null;
      let actualFallback = '';

      if (typeof paramsOrFallback === 'object' && paramsOrFallback !== null) {
        params = paramsOrFallback;
        actualFallback = typeof fallback === 'string' ? fallback : '';
      } else if (typeof paramsOrFallback === 'string') {
        actualFallback = paramsOrFallback;
      } else if (typeof fallback === 'string') {
        actualFallback = fallback;
      }

      const activeDict = (translations && translations[language]) ? translations[language] : (translations?.en || {});
      const fallbackDict = translations?.en || {};

      // 1. Try selected language dictionary
      let rawText = resolveTranslation(activeDict, key);

      // 2. Fallback to English dictionary if missing in Kannada / Hindi
      if (rawText === undefined || rawText === null) {
        rawText = resolveTranslation(fallbackDict, key);
      }

      // 3. Fallback to provided default string or key itself
      let text;
      if (rawText !== undefined && rawText !== null) {
        // Prevent returning objects directly to React JSX
        if (typeof rawText === 'object') {
          text = actualFallback || key;
        } else {
          text = String(rawText);
        }
      } else {
        text = actualFallback || key;
      }

      // Variable interpolation: replaces {param} or {{param}} or { param }
      if (params && typeof text === 'string') {
        Object.keys(params).forEach((paramKey) => {
          const val = params[paramKey] !== undefined && params[paramKey] !== null ? params[paramKey] : '';
          const escapedParamKey = paramKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          text = text.replace(new RegExp(`\\{\\{?\\s*${escapedParamKey}\\s*\\}?}`, 'g'), String(val));
        });
      }

      return text;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      currentLanguage: language,
      setLanguage,
      changeLanguage: setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
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
