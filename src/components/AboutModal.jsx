import React, { useEffect } from 'react';
import { X, Target, Cpu, Activity, Camera, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
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

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-scale-up text-slate-800 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <span className="text-2xl drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)]">🌿</span>
            <div>
              <h2 id="about-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                About FloraScan AI
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Visual pathology AI & agronomic prescription studio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
            aria-label="Close About Us Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          
          {/* Core Mission Banner */}
          <div className="flex gap-4 p-5 rounded-xl bg-gradient-to-br from-emerald-950/60 via-slate-850 to-slate-900 border border-emerald-500/30">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0 h-fit">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Core Mission
              </span>
              <p className="text-slate-200 text-sm sm:text-base font-medium leading-snug">
                "Empowering smallholder farmers and agronomists with instantaneous, accessible visual AI diagnostics to safeguard crop yields and minimize indiscriminate agrochemical overuse."
              </p>
            </div>
          </div>

          {/* Engineering Pipeline (3-Card Feature Row) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Engineering Pipeline Architecture
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-2.5">
                  🧠
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">Deep Learning Engine</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  MobileNetV2 transfer learning trained on multi-class foliar pathology datasets for rapid, edge-optimized classification.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-lg mb-2.5">
                  🔬
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">Digital Image Processing</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  OpenCV HSV color-space thresholding to isolate chlorosis and necrosis lesions from healthy green foliage.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-2.5">
                  🌱
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">Dual Remediation Engine</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Actionable, verified organic bio-controls alongside chemical fungicides/bactericides with safety intervals.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Specifications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              Platform Specifications & Key Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-0.5">&lt; 200ms</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-300">Local Inference Capability</span>
                <span className="text-[11px] text-slate-500 mt-1">Near zero latency evaluation</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center">
                <span className="text-xl font-extrabold text-teal-600 dark:text-teal-400 mb-0.5">Camera / Upload</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-300">Duality Architecture</span>
                <span className="text-[11px] text-slate-500 mt-1">Live WebRTC & high-res files</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-0.5">Zero Cloud</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-300">Mandatory Overhead</span>
                <span className="text-[11px] text-slate-500 mt-1">Private, in-field deployment</span>
              </div>
            </div>
          </div>

          {/* Key Capabilities */}
          <div className="space-y-2 pt-1">
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Rapid leaf chlorosis/necrosis surface area estimation computed per scan</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Confidence-rated classification identifying Early Blight, Late Blight, Bacterial Spot, and Healthy states</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Pre-Harvest (PHI) and Re-Entry (REI) safety parameters mapped directly to FRAC modes of action</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
