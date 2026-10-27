import React, { useState, useEffect } from 'react';
import { X, Clock, Trash2, ArrowUpRight, ArrowDownRight, Minus, ExternalLink, Calendar, CheckCircle2, AlertTriangle, Layers, FileDown } from 'lucide-react';
import { getScanHistory, deleteScanFromHistory, clearAllScanHistory, compareScans } from '../utils/scanStorage';
import { fetchUserScans, deleteUserScan } from '../utils/neonScanApi';
import { useAuth } from '../context/AuthContext';
import { generatePdfReport } from '../utils/generatePdfReport';
import { useLanguage } from '../context/LanguageContext';

export default function ScanHistoryModal({
  isOpen = false,
  onClose = () => {},
  onSelectScan = () => {},
  currentScan = null
}) {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [history, setHistory] = useState([]);
  const [selectedScanForComparison, setSelectedScanForComparison] = useState(null);
  const [cloudLoading, setCloudLoading] = useState(false);

  const refreshHistory = async () => {
    if (isAuthenticated) {
      setCloudLoading(true);
      try {
        const res = await fetchUserScans(1, 50);
        const cloudRecords = res.scans || [];
        setHistory(cloudRecords);
        if (cloudRecords.length > 0 && !selectedScanForComparison) {
          setSelectedScanForComparison(cloudRecords[0]);
        }
        setCloudLoading(false);
        return;
      } catch (err) {
        console.warn('Could not fetch from Neon cloud, falling back to local:', err);
      } finally {
        setCloudLoading(false);
      }
    }

    // Local storage fallback for guest mode
    const records = getScanHistory();
    setHistory(records);
    if (records.length > 0 && !selectedScanForComparison) {
      setSelectedScanForComparison(records[0]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshHistory();
    }
  }, [isOpen, isAuthenticated]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      try {
        await deleteUserScan(id);
      } catch (err) {
        console.warn('Failed to delete on Neon cloud:', err);
      }
    }
    const updated = deleteScanFromHistory(id);
    setHistory(prev => prev.filter(item => item.id !== id));
    if (selectedScanForComparison?.id === id) {
      setSelectedScanForComparison(history.find(item => item.id !== id) || null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm(t('historyClearConfirm') || 'Are you sure you want to clear all foliar scan history?')) {
      clearAllScanHistory();
      setHistory([]);
      setSelectedScanForComparison(null);
    }
  };

  const handleDownloadPdf = async (scan, e) => {
    e.stopPropagation();
    try {
      await generatePdfReport(
        {
          disease: scan.diseaseName || scan.disease,
          scientific_name: scan.scientificName || 'Botanical Pathogen Specimen',
          confidence: scan.confidence,
          affected_area_pct: scan.lesionArea,
          severity: scan.severity,
          status: scan.status || 'Infected',
          chemical_overview: scan.chemicalOverview || 'Standard protective treatment schedule.',
          tank_mix: scan.tankMix || 'Apply systemic fungicide with multi-site contact protectant.'
        },
        scan.thumbnail,
        {
          scanId: scan.id,
          timestamp: new Date(scan.timestamp).toLocaleString()
        }
      );
    } catch (err) {
      console.error('PDF generation error from history:', err);
    }
  };

  if (!isOpen) return null;

  // Comparison metrics between currentScan and selectedScanForComparison
  const comparison = currentScan && selectedScanForComparison && currentScan.id !== selectedScanForComparison.id
    ? compareScans(currentScan, selectedScanForComparison)
    : history.length >= 2
    ? compareScans(history[0], history[1])
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl my-6 transition-all max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Scan History & Recovery Tracker"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {t('historyTitle') || 'Foliar Scan History & Recovery Tracker'}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t('historySubtitle') || 'Chronological recovery tracking across 7–14 day treatment windows'}
                </span>
                {isAuthenticated ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Neon Cloud Synced ({user?.email || 'User'})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    Guest Mode (Local Only)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-300 dark:hover:border-rose-800 transition-all cursor-pointer flex items-center gap-1.5"
                title="Clear all stored records"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('historyClearAll') || 'Clear All'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Temporal Recovery Delta Indicator Banner */}
        {comparison && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-850 dark:via-slate-800 dark:to-slate-850 border border-slate-200 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs flex-shrink-0 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
                comparison.trend === 'recovering'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40'
                  : comparison.trend === 'deteriorating'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-500/40'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/40'
              }`}>
                {comparison.trend === 'recovering' && <ArrowDownRight className="w-5 h-5" />}
                {comparison.trend === 'deteriorating' && <ArrowUpRight className="w-5 h-5" />}
                {comparison.trend === 'stable' && <Minus className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('historyCompareTitle') || 'Temporal Recovery Assessment'} ({comparison.diffDays} Days Interval)
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{comparison.label}</span>
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">Baseline Lesion</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{comparison.prevArea}%</span>
              </div>
              <span className="text-slate-400">→</span>
              <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">Current Lesion</span>
                <span className={`font-bold ${comparison.trend === 'recovering' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {comparison.currentArea}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Records Content Area */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                📂
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {t('historyEmpty') || 'No Past Scans Recorded Yet'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {t('historyEmptyDesc') || 'Completed scans will automatically be logged here to track foliar recovery trends over time.'}
              </p>
            </div>
          ) : (
            history.map((scan, idx) => {
              const formattedDate = new Date(scan.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={scan.id || idx}
                  onClick={() => {
                    onSelectScan(scan);
                    onClose();
                  }}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs cursor-pointer group"
                >
                  {/* Left: Thumbnail & Disease Title */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {scan.thumbnail ? (
                      <img
                        src={scan.thumbnail}
                        alt={`${scan.crop || 'Plant'} leaf scan showing symptoms of ${scan.diseaseName || scan.disease || 'foliar condition'}`}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                        🍃
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          scan.status === 'Healthy'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                        }`}>
                          {scan.status || 'Infected'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formattedDate}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {scan.diseaseName || scan.disease}
                      </h4>
                      {scan.scientificName && (
                        <p className="text-xs italic text-slate-400 truncate">
                          {scan.scientificName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Metrics & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-right">
                      <div className="bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Lesion Area</span>
                        <span className="text-sm font-black font-mono text-slate-800 dark:text-slate-200">
                          {scan.lesionArea}%
                        </span>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Confidence</span>
                        <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {scan.confidence}%
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleDownloadPdf(scan, e)}
                        className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/50 text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                        title="Download PDF Prescription"
                        aria-label="Download PDF"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(scan.id, e)}
                        className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                        title="Delete record"
                        aria-label="Delete scan record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
