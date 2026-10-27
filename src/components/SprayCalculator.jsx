import React, { useState, useMemo } from 'react';
import { X, Droplets, AlertTriangle, ShieldCheck, Calculator, Check, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SprayCalculator({
  isOpen = false,
  onClose = () => {},
  diagnosisData = null,
  activeIngredients = null,
  isInline = false
}) {
  const { t } = useLanguage();

  // Extract chemicals list
  const chemicals = useMemo(() => {
    if (activeIngredients && Array.isArray(activeIngredients) && activeIngredients.length > 0) {
      return activeIngredients;
    }
    if (diagnosisData?.active_ingredients && Array.isArray(diagnosisData.active_ingredients) && diagnosisData.active_ingredients.length > 0) {
      return diagnosisData.active_ingredients;
    }
    // Default fallback chemical if none provided
    return [
      {
        name: "Chlorothalonil 720 SC (e.g. Bravo)",
        type: "Multi-site Contact Protectant",
        dosage_knapsack: "2.0 – 2.5 g per 1 L of water",
        phi: "0 days",
        rei: "12 hours"
      },
      {
        name: "Azoxystrobin (e.g. Quadris 250 SC)",
        type: "Systemic Curative",
        dosage_knapsack: "0.8 – 1.0 ml per 1 L of water",
        phi: "1 day",
        rei: "4 hours"
      }
    ];
  }, [activeIngredients, diagnosisData]);

  const [selectedChemicalIdx, setSelectedChemicalIdx] = useState(0);
  const [tankPreset, setTankPreset] = useState(16); // 16 | 20 | 200 | 'custom'
  const [customVolume, setCustomVolume] = useState(100);

  const selectedChemical = chemicals[selectedChemicalIdx] || chemicals[0];

  // Helper to extract numeric dosage and unit from text like "2.0 – 2.5 g per 1 L" or "0.5 ml per 1 L"
  const parseDosageRate = (dosageStr) => {
    if (!dosageStr) return { min: 2.0, max: 2.5, unit: 'g' };
    
    const isLiquid = /ml|lit|fl/i.test(dosageStr);
    const unit = isLiquid ? 'ml' : 'g';

    // Match numbers with optional decimal
    const matches = dosageStr.match(/(\d+(?:\.\d+)?)/g);
    if (!matches || matches.length === 0) {
      return { min: 2.0, max: 2.5, unit };
    }

    if (matches.length === 1) {
      const val = parseFloat(matches[0]);
      return { min: val, max: val, unit };
    }

    // Usually first two numbers are min and max dosage rate per 1L
    const val1 = parseFloat(matches[0]);
    const val2 = parseFloat(matches[1]);
    const min = Math.min(val1, val2);
    const max = Math.max(val1, val2);
    return { min, max, unit };
  };

  const dosageRate = useMemo(() => {
    return parseDosageRate(selectedChemical?.dosage_knapsack);
  }, [selectedChemical]);

  const activeVolume = tankPreset === 'custom' ? Math.max(1, Number(customVolume) || 1) : tankPreset;

  // Total Chemical Calculations
  const calcResults = useMemo(() => {
    const minChemical = (dosageRate.min * activeVolume);
    const maxChemical = (dosageRate.max * activeVolume);
    const unit = dosageRate.unit;

    const formatChemical = (val) => {
      if (unit === 'g' && val >= 1000) {
        return `${(val / 1000).toFixed(2)} kg (${val.toFixed(0)} g)`;
      }
      if (unit === 'ml' && val >= 1000) {
        return `${(val / 1000).toFixed(2)} L (${val.toFixed(0)} ml)`;
      }
      return `${Number(val.toFixed(1))} ${unit}`;
    };

    const isRange = Math.abs(minChemical - maxChemical) > 0.05;

    return {
      waterVolume: `${activeVolume} Liters`,
      minChemical,
      maxChemical,
      chemicalDisplay: isRange
        ? `${formatChemical(minChemical)} – ${formatChemical(maxChemical)}`
        : formatChemical(minChemical),
      rawRate: `${dosageRate.min === dosageRate.max ? dosageRate.min : `${dosageRate.min} – ${dosageRate.max}`} ${dosageRate.unit} / Liter`
    };
  }, [dosageRate, activeVolume]);

  const content = (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      {/* Header bar if inline */}
      {!isInline && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {t('sprayCalcTitle') || 'Spray Tank-Mix Dosage Calculator'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('sprayCalcSubtitle') || 'Convert laboratory dilution rates into field tank quantities'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Chemical Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          1. Select Prescribed Chemical / Formulation:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {chemicals.map((chem, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedChemicalIdx(idx)}
              className={`p-3 rounded-xl border text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between ${
                selectedChemicalIdx === idx
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold leading-snug line-clamp-2">{chem.name}</span>
                {selectedChemicalIdx === idx && (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                )}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{chem.dosage_knapsack}</span>
                {chem.phi && <span>PHI: {chem.phi}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Spray Tank Volume Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            2. Choose Agricultural Spray Tank Capacity:
          </label>
          <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {activeVolume} L Volume
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Preset 1: 16 L Knapsack */}
          <button
            type="button"
            onClick={() => setTankPreset(16)}
            className={`min-h-[48px] p-2.5 rounded-xl border text-center transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center ${
              tankPreset === 16
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span className="text-sm font-black font-mono">16 L</span>
            <span className="text-[10px] opacity-90 truncate max-w-full">Knapsack Sprayer</span>
          </button>

          {/* Preset 2: 20 L Motorized */}
          <button
            type="button"
            onClick={() => setTankPreset(20)}
            className={`min-h-[48px] p-2.5 rounded-xl border text-center transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center ${
              tankPreset === 20
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span className="text-sm font-black font-mono">20 L</span>
            <span className="text-[10px] opacity-90 truncate max-w-full">Motorized / Battery</span>
          </button>

          {/* Preset 3: 200 L Tractor Barrel */}
          <button
            type="button"
            onClick={() => setTankPreset(200)}
            className={`min-h-[48px] p-2.5 rounded-xl border text-center transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center ${
              tankPreset === 200
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span className="text-sm font-black font-mono">200 L</span>
            <span className="text-[10px] opacity-90 truncate max-w-full">Tractor Drum / Barrel</span>
          </button>

          {/* Preset 4: Custom */}
          <button
            type="button"
            onClick={() => setTankPreset('custom')}
            className={`min-h-[48px] p-2.5 rounded-xl border text-center transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center ${
              tankPreset === 'custom'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span className="text-sm font-black font-mono">Custom</span>
            <span className="text-[10px] opacity-90 truncate max-w-full">Field Volume</span>
          </button>
        </div>

        {/* Custom Input Field */}
        {tankPreset === 'custom' && (
          <div className="pt-2 flex items-center gap-3 animate-fade-in">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Custom Tank Volume:</span>
            <div className="relative flex-1 max-w-[180px]">
              <input
                type="number"
                min="1"
                max="5000"
                value={customVolume}
                onChange={(e) => setCustomVolume(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Volume in Liters"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">Liters</span>
            </div>
          </div>
        )}
      </div>

      {/* Calculated Results Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-emerald-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Tank-Mix Batch Prescription
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            Rate: {calcResults.rawRate}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Chemical Quantity Card */}
          <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/20 shadow-xs">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              🧪 Total Chemical Required:
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
              {calcResults.chemicalDisplay}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Pour active formulation into clean bucket first to pre-mix slurry
            </span>
          </div>

          {/* Water Quantity Card */}
          <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/20 shadow-xs">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              💧 Clean Water Required:
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
              {calcResults.waterVolume}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Use clean neutral water (pH 6.5–7.0) to prevent chemical degradation
            </span>
          </div>
        </div>

        {/* Dynamic Formula Explanation */}
        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 pt-1 font-mono">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            Formula: {dosageRate.min === dosageRate.max ? dosageRate.min : `${dosageRate.min}–${dosageRate.max}`} {dosageRate.unit}/L × {activeVolume} L = {calcResults.chemicalDisplay}
          </span>
        </div>
      </div>

      {/* Safety & Pre-Harvest Interval (PHI) Warning Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-bold block text-amber-800 dark:text-amber-300">
            ⚠️ Safety & Regulatory Advisory:
          </strong>
          <p className="leading-relaxed">
            {t('spraySafetyWarning') || 'Always wear protective gloves/mask and verify Pre-Harvest Interval (PHI) before spraying.'}
          </p>
          <div className="pt-1 flex flex-wrap gap-4 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
            {selectedChemical.phi && <span>• Pre-Harvest Interval (PHI): {selectedChemical.phi}</span>}
            {selectedChemical.rei && <span>• Restricted-Entry Interval (REI): {selectedChemical.rei}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {content}
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl my-8 transition-all max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {content}
      </div>
    </div>
  );
}
