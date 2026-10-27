import React, { useEffect } from 'react';
import { X, BookOpen, AlertCircle, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

export default function DiseaseGuideModal({ isOpen, onClose }) {
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

  const diseases = [
    {
      title: 'Early Blight',
      scientific: 'Alternaria solani',
      type: 'Fungal',
      typeBadge: 'bg-amber-950 text-amber-400 border-amber-500/30',
      icon: '🎯',
      desc: 'Concentric target rings developing on mature lower leaves surrounded by chlorotic yellow halos. Defoliation progresses upwards through the canopy.',
      weather: 'Warm, humid spells (24–29°C) with alternating wet/dry cycles.',
      treatment: 'Apply Chlorothalonil or Azoxystrobin; mulch soil to halt rain-splash spores.'
    },
    {
      title: 'Late Blight',
      scientific: 'Phytophthora infestans',
      type: 'Oomycete',
      typeBadge: 'bg-rose-950 text-rose-400 border-rose-500/30',
      icon: '🥀',
      desc: 'Large, irregular water-soaked pale-green to dark brown lesions. Under high humidity, white velvet-like fungal down emerges on leaf undersides.',
      weather: 'Cool, foggy, saturated moisture (15–20°C, >90% RH).',
      treatment: 'Emergency spray of Metalaxyl-M + Mancozeb; quarantine infected vines immediately.'
    },
    {
      title: 'Bacterial Spot',
      scientific: 'Xanthomonas perforans',
      type: 'Bacterial',
      typeBadge: 'bg-orange-950 text-orange-400 border-orange-500/30',
      icon: '🍂',
      desc: 'Small, angular, greasy water-soaked specks (1–3mm) turning dark purplish-brown. Centers often tear and drop out, creating a "shot-hole" pattern.',
      weather: 'Heavy rains, overhead sprinkler irrigation, temperature 25–30°C.',
      treatment: 'Copper Hydroxide + Mancozeb synergy; avoid field traffic when foliage is wet.'
    },
    {
      title: 'Rose Black Spot',
      scientific: 'Diplocarpon rosae',
      type: 'Ornamental Fungal',
      typeBadge: 'bg-purple-950 text-purple-400 border-purple-500/30',
      icon: '🌹',
      desc: 'Circular to irregular dark purple-brown to pitch-black spots with characteristic feathery, fringed, fibrillose margins. Yellow chlorotic halos coalesce into leaflet drop. Never exhibits concentric target rings.',
      weather: 'Extended leaf wetness (6–7 hours) at 18–24°C in garden and ornamental plantings.',
      treatment: 'Systemic DMI Tebuconazole or Trifloxystrobin. CRITICAL: Do NOT spray open flower petals (prevents petal scorch). Rake and burn fallen leaf litter in winter.'
    },
    {
      title: 'Citrus Greening (HLB)',
      scientific: 'Candidatus Liberibacter asiaticus',
      type: 'Bacterial / Vector',
      typeBadge: 'bg-amber-950 text-amber-400 border-amber-500/30',
      icon: '🍊',
      desc: 'Asymmetric blotchy mottle on citrus leaves crossing leaf veins unevenly, yellow shoots, and stunted bitter fruit with dark aborted seeds.',
      weather: 'Spread by Asian Citrus Psyllid (Diaphorina citri) in commercial and backyard citrus groves.',
      treatment: 'Rigorous psyllid insect vector control (systemic imidacloprid / horticultural mineral oils), nutritional foliar sprays, and removal of infected trees.'
    },
    {
      title: 'Healthy Foliage',
      scientific: 'Optimal Foliage (Healthy Specimen)',
      type: 'Optimal',
      typeBadge: 'bg-emerald-950 text-emerald-400 border-emerald-500/30',
      icon: '🌿',
      desc: 'Uniform rich green lamina with intact vascular venation. Normal photosynthetic leaf turgidity without necrotic spotting or bacterial water-soaking.',
      weather: 'Well-ventilated conditions with balanced soil nutrition.',
      treatment: 'Prophylactic Bacillus subtilis bio-spray every 14 days and drip irrigation.'
    }
  ];

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
              📖 Plant Pathology Reference
            </span>
            <h2 id="guide-modal-title" className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Crop Disease Field Encyclopedia
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Visual diagnostic indicators, causal pathogens, and weather triggers for calibrated crop diseases.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close Guide Modal"
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
                      <p className="text-xs italic text-slate-500 dark:text-slate-400">{d.scientific}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${d.typeBadge}`}>
                    {d.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{d.desc}</p>

                <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <strong className="text-slate-700 dark:text-slate-300">High-Risk Climate:</strong>
                    <span className="text-slate-500 dark:text-slate-400 ml-1">{d.weather}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-600 dark:text-emerald-400">Primary Agronomic Action:</strong>
                    <span className="text-slate-700 dark:text-slate-300 ml-1">{d.treatment}</span>
                  </div>
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
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
