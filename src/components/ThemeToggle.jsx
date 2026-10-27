import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ className = '', onThemeChange }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.warn('Error reading theme from localStorage', e);
    }
    return 'dark';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Error saving theme to localStorage', e);
    }
    if (onThemeChange) {
      onThemeChange(theme);
    }
  }, [theme, isDark, onThemeChange]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={`theme-toggle-btn w-14 h-8 sm:h-7 rounded-full transition-all duration-300 relative cursor-pointer p-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 flex-shrink-0 select-none active:scale-95 ${
        isDark
          ? 'bg-slate-800 border border-slate-700 hover:border-slate-600'
          : 'bg-emerald-100 border border-emerald-300 hover:border-emerald-400'
      } ${className}`}
    >
      {/* Sliding Inner Knob */}
      <span
        className={`w-5 h-5 rounded-full absolute top-1 left-1 transition-transform duration-300 flex items-center justify-center shadow-md ${
          isDark
            ? 'translate-x-0 bg-slate-900 border border-slate-700/80 text-amber-300'
            : 'translate-x-7 bg-white border border-amber-200/80 text-amber-500'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-amber-300 transition-transform duration-200" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500 transition-transform duration-200" />
        )}
      </span>
      <span className="sr-only">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
}
