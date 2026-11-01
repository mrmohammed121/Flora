import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onOpenAbout, onOpenTeam, onOpenGuide }) {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur-md text-slate-600 dark:text-slate-400 border-t border-slate-300 dark:border-slate-800 mt-auto transition-colors duration-300">
      {/* Top Accent Gradient Bar */}
      <div className="w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* Column 1: Brand & Agriscience Disclaimer */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]">🌿</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                FloraScan <span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('footerTagline')}
            </p>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border-l-4 border-amber-500 border-t border-r border-b border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-none">
              <span className="block font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1 text-[11px]">
                {t('footerAdvisoryTitle')}
              </span>
              <p className="italic leading-normal">
                "{t('footerDisclaimer')}"
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links & SEO Sitemap */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              {t('footerResourcesTitle')}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="#diagnosticStudio" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {t('footerLinkStudio')}
              </a>
              <a href="#diseaseDirectory" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {t('footerLinkDirectory')}
              </a>
              <a href="#faqSection" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {t('footerLinkFaqs')}
              </a>
              <button type="button" onClick={onOpenGuide} className="text-left hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                {t('footerLinkGuide')}
              </button>
              <button type="button" onClick={onOpenAbout} className="text-left hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                {t('footerLinkArchitecture')}
              </button>
              <button type="button" onClick={onOpenTeam} className="text-left hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                {t('footerLinkTeam')}
              </button>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {t('footerLinkSitemap')}
              </a>
              <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {t('footerLinkRobots')}
              </a>
            </div>
          </div>

          {/* Column 3: Connect & Community */}
          <div id="contact" className="space-y-4 md:col-span-2 lg:col-span-1 scroll-mt-20">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              {t('footerConnect')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footerConnectDesc')}
            </p>
            
            {/* Social Icons with brand hover glows */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-850 hover:bg-[#0a66c2] text-slate-600 dark:text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 border border-slate-300 dark:border-slate-800 hover:shadow-lg hover:shadow-[#0a66c2]/40 hover:-translate-y-1"
                title={t('footerLinkedInTitle')}
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-850 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-slate-600 dark:text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 border border-slate-300 dark:border-slate-800 hover:shadow-lg hover:shadow-pink-500/40 hover:-translate-y-1"
                title={t('footerInstagramTitle')}
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919876543210?text=Hello%20FloraScan%20AI%20Support"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-850 hover:bg-[#25d366] text-slate-600 dark:text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 border border-slate-300 dark:border-slate-800 hover:shadow-lg hover:shadow-[#25d366]/40 hover:-translate-y-1"
                title={t('footerWhatsAppTitle')}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-850 hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 border border-slate-300 dark:border-slate-800 hover:shadow-lg hover:shadow-white/20 hover:-translate-y-1"
                title={t('footerGitHubTitle')}
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
