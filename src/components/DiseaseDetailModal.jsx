// src/components/DiseaseDetailModal.jsx
// Detailed Pathology Guide Modal for Individual Diseases with Rich Schema & Treatment Protocols

import React, { useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  AlertTriangle, 
  ShieldCheck, 
  Leaf, 
  CloudRain, 
  FlaskConical, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export default function DiseaseDetailModal({ disease, isOpen, onClose, onLoadSample }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
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

  if (!isOpen || !disease) return null;

  const handleTestInStudio = () => {
    if (onLoadSample && disease.presetKey) {
      onLoadSample(disease.presetKey);
    }
    onClose();
    setTimeout(() => {
      document.getElementById('diagnosticStudio')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disease-modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up text-slate-800 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between p-6 sm:p-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/90">
          <div className="flex items-start gap-4">
            <span className="text-4xl p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0">
              {disease.icon}
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${disease.typeBadge}`}>
                  {disease.category}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Crops: {disease.crops.join(', ')}
                </span>
              </div>
              <h2 id="disease-modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {disease.title}
              </h2>
              <p className="text-xs sm:text-sm font-mono italic text-emerald-600 dark:text-emerald-400">
                {disease.scientificName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
            aria-label="Close Disease Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          
          {/* Overview Banner */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200">
            <h3 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              Pathology Overview
            </h3>
            <p className="text-sm leading-relaxed">
              {disease.summary}
            </p>
          </div>

          {/* Visual Markers & Diagnostic Identification */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Diagnostic Symptoms & Visual Markers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {disease.symptoms.map((symptom, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{symptom}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <strong className="text-slate-900 dark:text-white block font-bold mb-1">
                Visual Morphology Rule:
              </strong>
              <span>{disease.visualMarkers}</span>
            </div>
          </div>

          {/* Infection Biology & Environmental Triggers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <strong className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-500" />
                Weather Triggers & Microclimate
              </strong>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {disease.weatherTriggers}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <strong className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-purple-500" />
                Pathogen Causes & Overwintering
              </strong>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {disease.causes}
              </p>
            </div>
          </div>

          {/* Cultural Prevention Checklist */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              Cultural Sanitation & Field Prevention
            </h3>
            <ul className="space-y-2">
              {disease.culturalPrevention.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  <span className="text-teal-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certified Organic Remedies */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Certified Organic Remedies & Biologicals
            </h3>
            <ul className="space-y-1.5">
              {disease.organicRemedies.map((remedy, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{remedy}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chemical Action Table */}
          {disease.chemicalProtocols && disease.chemicalProtocols.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-500" />
                Targeted Chemical Active Ingredients (FRAC-Aligned)
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Active Chemistry</th>
                      <th className="p-3">FRAC Group</th>
                      <th className="p-3">Dosage / Dilution</th>
                      <th className="p-3">PHI / REI</th>
                      <th className="p-3">Mode of Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {disease.chemicalProtocols.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          {c.name}
                        </td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {c.fracGroup}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {c.dosage}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {c.phi} / {c.rei}
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          {c.role}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Expert Resistance Warning */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 text-xs text-slate-700 dark:text-slate-300">
            <strong className="text-amber-800 dark:text-amber-400 block font-bold mb-1">
              Agronomic Stewardship Advisory:
            </strong>
            <p>{disease.expertAdvice}</p>
          </div>

          {/* Disease FAQs */}
          {disease.faqs && disease.faqs.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-500" />
                Frequently Asked Questions about {disease.title}
              </h3>
              <div className="space-y-2">
                {disease.faqs.map((f, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <strong className="text-slate-900 dark:text-white block font-bold">
                      {f.q}
                    </strong>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/80 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Pathology Reference: FloraScan AI Knowledge Graph
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            {disease.presetKey && (
              <button
                type="button"
                onClick={handleTestInStudio}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Test {disease.title} in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
