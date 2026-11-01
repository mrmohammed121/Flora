import React, { useEffect } from 'react';
import { X, BookOpen, AlertCircle, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedDiseases } from '../locales/diseaseTranslations';

export default function DiseaseGuideModal({ isOpen, onClose }) {
  const { language, t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const diseases = getLocalizedDiseases(language);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-scale-up text-slate-800 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 mb-1.5">
              📖 {t('guideTitle', 'Field Pathology Guide')}
            </span>
            <h2 id="guide-modal-title" className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('seoDirectoryTitle', 'Comprehensive Plant Disease & Pathogen Directory')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('guideSubtitle', 'Quick Reference Diagnostic Protocols for Agricultural Extension')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={t('guideCloseBtn', 'Close Guide Modal')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-600 dark:text-slate-300 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diseases.map((d, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{d.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{d.title}</h4>
                      <p className="text-xs italic text-slate-500 dark:text-slate-400">{d.scientificName || d.scientific}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${d.typeBadge}`}>
                    {d.category || d.type || 'Pathology'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{d.summary || d.desc}</p>

                <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                  {d.weatherTriggers && (
                    <div>
                      <strong className="text-slate-700 dark:text-slate-300">{t('guideWeather', 'Weather Triggers')}:</strong>
                      <span className="text-slate-500 dark:text-slate-400 ml-1">{d.weatherTriggers}</span>
                    </div>
                  )}
                  {(d.chemicalTreatment || d.treatment) && (
                    <div>
                      <strong className="text-emerald-600 dark:text-emerald-400">{t('guideTreatment', 'Recommended Treatment')}:</strong>
                      <span className="text-slate-700 dark:text-slate-300 ml-1">{d.chemicalTreatment || d.treatment}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {t('menuClose', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
}
