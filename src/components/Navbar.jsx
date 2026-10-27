import React, { useState, useEffect, useRef } from 'react';
import { Camera, BookOpen, Info, Users, Menu, X, Columns, Clock, User, Database } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  activeTab = 'studio',
  onOpenAbout,
  onOpenTeam,
  onOpenGuide,
  onOpenHistory,
  onOpenAuth = () => {}
}) {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  // Navigation display mode: 'button' (One Button) or 'row' (Full Bar)
  const [navMode, setNavMode] = useState(() => {
    return localStorage.getItem('florascan_nav_mode') || 'button';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [activePill, setActivePill] = useState('home');
  const navRef = useRef(null);
  const dropdownRef = useRef(null);

  const handlePillClick = (key) => {
    setActivePill(key);
    setIsMenuOpen(false);
    if (key === 'home') {
      const el = document.getElementById('home');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (key === 'about') {
      if (onOpenAbout) onOpenAbout();
    } else if (key === 'contact') {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  // Sync internal active tab if prop changes
  useEffect(() => {
    if (activeTab) setCurrentTab(activeTab);
  }, [activeTab]);

  // Persist preference
  useEffect(() => {
    localStorage.setItem('florascan_nav_mode', navMode);
  }, [navMode]);

  // Smooth scroll to Diagnostic Studio
  const scrollToStudio = (e) => {
    if (e) e.preventDefault();
    setCurrentTab('studio');
    setIsMenuOpen(false);
    const el = document.getElementById('diagnosticStudio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };



  const handleNavClick = (tabKey, callback) => {
    setCurrentTab(tabKey);
    setIsMenuOpen(false);
    if (callback) callback();
  };

  // Close mobile drawer / dropdown on outside tap or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  // Navigation Items Specification (Reference: Image 1 & 2)
  const navItems = [
    {
      key: 'studio',
      label: t('navStudio'),
      icon: Camera,
      onClick: scrollToStudio,
      isAnchor: true,
      href: '#diagnosticStudio'
    },
    {
      key: 'guide',
      label: t('navGuide'),
      icon: BookOpen,
      onClick: () => handleNavClick('guide', onOpenGuide),
      isAnchor: false
    },
    {
      key: 'history',
      label: t('historyOpenBtn') || 'Scan History',
      icon: Clock,
      onClick: () => handleNavClick('history', onOpenHistory),
      isAnchor: false
    },
    {
      key: 'about',
      label: t('navAbout'),
      icon: Info,
      onClick: () => handleNavClick('about', onOpenAbout),
      isAnchor: false
    },
    {
      key: 'team',
      label: t('navTeam'),
      icon: Users,
      onClick: () => handleNavClick('team', onOpenTeam),
      isAnchor: false
    },
    {
      key: 'auth',
      label: isAuthenticated ? (user?.name || user?.email || 'Cloud Account') : 'Sign In / Account',
      icon: User,
      onClick: () => handleNavClick('auth', onOpenAuth),
      isAnchor: false
    }
  ];

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-emerald-500/20 text-slate-800 dark:text-white shadow-sm dark:shadow-lg dark:shadow-black/25 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          
          {/* Left Section: Brand Logo */}
          <div className="flex items-center space-x-3">
            <a href="#home" className="flex items-center space-x-2 font-extrabold text-xl tracking-tight group">
              <span className="text-2xl drop-shadow-[0_2px_10px_rgba(16,185,129,0.5)] transform group-hover:scale-105 transition-transform">
                🌿
              </span>
              <span className="font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500 bg-clip-text text-transparent font-heading">
                FloraScan AI
              </span>
            </a>
          </div>

          {/* Center Section: Rounded Pill Navigation Bar (Home, About, Contact Us) */}
          <nav 
            className="hidden md:inline-flex items-center bg-[#f4f4f5] dark:bg-slate-800/95 p-1 rounded-full border border-slate-200/90 dark:border-slate-700/80 shadow-xs"
            aria-label="Top Pill Navigation"
          >
            <button
              type="button"
              onClick={() => handlePillClick('home')}
              className={`px-4 lg:px-5 py-1.5 rounded-full text-xs lg:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                activePill === 'home'
                  ? 'bg-[#3f3f46] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => handlePillClick('about')}
              className={`px-3.5 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium tracking-tight transition-all duration-200 cursor-pointer ${
                activePill === 'about'
                  ? 'bg-[#3f3f46] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              About
            </button>

            <button
              type="button"
              onClick={() => handlePillClick('contact')}
              className={`px-3.5 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium tracking-tight transition-all duration-200 cursor-pointer ${
                activePill === 'contact'
                  ? 'bg-[#3f3f46] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Navigation Controls: Theme Toggle, Multi-Language Switcher & Hamburger Button */}
          <div className="relative flex items-center gap-3">
            {/* Dark / Light Mode Animated Sliding Switch */}
            <ThemeToggle />

            {/* Multi-Language Dropdown Switcher */}
            <div className="language-picker-container">
              <label htmlFor="languageSelect" className="sr-only">Select Language</label>
              <span className="lang-icon">🌐</span>
              <select
                id="languageSelect"
                name="language"
                className="lang-dropdown"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            {/* User Account / Cloud Sync Button */}
            <button
              type="button"
              onClick={onOpenAuth}
              className={`min-h-[44px] px-3 py-1.5 rounded-2xl border transition-all duration-200 flex items-center gap-2 text-xs font-bold shadow-xs cursor-pointer active:scale-95 ${
                isAuthenticated
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-600/40 text-emerald-700 dark:text-emerald-400'
                  : 'bg-[#f0f4f8] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600'
              }`}
              title={isAuthenticated ? `Signed in as ${user?.email}` : 'Sign In to sync with Neon PostgreSQL'}
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline max-w-[120px] truncate">
                {isAuthenticated ? (user?.name || user?.email?.split('@')[0]) : 'Sign In'}
              </span>
              {isAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

            <button
              id="hamburgerBtn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className={`w-11 h-11 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-sm cursor-pointer active:scale-95 ${
                isMenuOpen
                  ? 'border-[#50de68] dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'bg-[#f0f4f8] dark:bg-slate-800 border-[#50de68] dark:border-emerald-400 text-[#334155] dark:text-slate-200 hover:border-emerald-400 hover:bg-[#e4ebf2] dark:hover:bg-slate-700'
              }`}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMenuOpen}
              title="Navigation Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-emerald-600 dark:text-emerald-400 transition-transform duration-200" strokeWidth={2.5} />
              ) : (
                <Menu className="w-6 h-6 text-[#334155] dark:text-slate-200 transition-transform duration-200" strokeWidth={2.5} />
              )}
            </button>

            {/* Desktop Floating Menu Card */}
            {isMenuOpen && (
              <div
                ref={dropdownRef}
                className="hidden md:block absolute right-0 top-full mt-2.5 w-64 bg-white/98 dark:bg-slate-900/98 border border-slate-200 dark:border-emerald-500/30 rounded-2xl shadow-xl dark:shadow-2xl backdrop-blur-xl p-2.5 z-50 animate-scale-up text-slate-800 dark:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800/80 mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <span>{t('navHeader')}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono lowercase">{t('navBadge')}</span>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.key;
                    const itemClass = `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 cursor-pointer ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 font-semibold border-l-2 border-emerald-500 dark:border-emerald-400'
                        : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`;

                    return item.isAnchor ? (
                      <a
                        key={item.key}
                        href={item.href}
                        onClick={item.onClick}
                        className={itemClass}
                      >
                        <Icon className="w-[18px] h-[18px] flex-shrink-0 transition-colors" />
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <button
                        key={item.key}
                        type="button"
                        onClick={item.onClick}
                        className={itemClass}
                      >
                        <Icon className="w-[18px] h-[18px] flex-shrink-0 transition-colors" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/98 dark:bg-slate-900/98 border-b border-slate-200 dark:border-emerald-500/20 px-4 pt-3 pb-5 space-y-3 animate-fade-in shadow-xl dark:shadow-2xl backdrop-blur-md">
          {/* Quick Pill Bar for Mobile */}
          <div className="flex items-center justify-center p-1 bg-[#f4f4f5] dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 w-fit mx-auto mb-2">
            <button
              type="button"
              onClick={() => handlePillClick('home')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activePill === 'home'
                  ? 'bg-[#3f3f46] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handlePillClick('about')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activePill === 'about'
                  ? 'bg-[#3f3f46] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handlePillClick('contact')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activePill === 'contact'
                  ? 'bg-[#3f3f46] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Contact Us
            </button>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.key;
            const mobileClass = `w-full min-h-[48px] flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-left transition-all active:scale-95 cursor-pointer ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800/90 border-l-4 border-emerald-500 dark:border-emerald-400 shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`;

            return item.isAnchor ? (
              <a
                key={item.key}
                href={item.href}
                onClick={item.onClick}
                className={mobileClass}
              >
                <Icon className="w-5 h-5 flex-shrink-0 transition-colors text-emerald-500" />
                <span>{item.label}</span>
              </a>
            ) : (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                className={mobileClass}
              >
                <Icon className="w-5 h-5 flex-shrink-0 transition-colors text-emerald-500" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
