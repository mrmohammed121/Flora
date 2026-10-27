/**
 * scanStorage.js
 * Manages chronological scan history and temporal foliar recovery tracking
 */

const STORAGE_KEY = 'florascan_history';
const MAX_STORED_SCANS = 25;

/**
 * Retrieve all saved scans from localStorage
 * @returns {Array} List of scan records sorted newest first
 */
export function getScanHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to load scan history from localStorage:', err);
    return [];
  }
}

/**
 * Save a new scan record to history
 * @param {Object} scan
 * @returns {Array} Updated history list
 */
export function addScanToHistory(scan) {
  try {
    const history = getScanHistory();
    const newRecord = {
      id: scan.id || `scan_${Date.now()}`,
      timestamp: scan.timestamp || new Date().toISOString(),
      crop: scan.crop || 'Foliar Specimen',
      diseaseName: scan.diseaseName || scan.disease || 'Unknown Pathology',
      scientificName: scan.scientificName || scan.scientific_name || '',
      confidence: Number(scan.confidence) || 0,
      lesionArea: Number(scan.lesionArea || scan.affected_area_pct) || 0,
      severity: scan.severity || 'Moderate',
      status: scan.status || 'Infected',
      thumbnail: scan.thumbnail || scan.previewUrl || null,
      chemicalOverview: scan.chemicalOverview || scan.chemical_overview || '',
      tankMix: scan.tankMix || scan.tank_mix || ''
    };

    // Prepend new scan, deduplicate by ID if needed, and limit length
    const updated = [newRecord, ...history.filter(item => item.id !== newRecord.id)].slice(0, MAX_STORED_SCANS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to add scan to localStorage:', err);
    return getScanHistory();
  }
}

/**
 * Delete a specific scan record
 * @param {string} id
 * @returns {Array} Updated history list
 */
export function deleteScanFromHistory(id) {
  try {
    const history = getScanHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.warn('Failed to delete scan record:', err);
    return getScanHistory();
  }
}

/**
 * Clear all scan records
 */
export function clearAllScanHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.warn('Failed to clear scan history:', err);
    return [];
  }
}

/**
 * Compare current scan with a prior scan of the same disease/plant
 * @param {Object} current
 * @param {Object} previous
 * @returns {Object} Comparison metrics and recovery assessment
 */
export function compareScans(current, previous) {
  if (!current || !previous) return null;

  const currentArea = Number(current.lesionArea ?? current.affected_area_pct ?? 0);
  const prevArea = Number(previous.lesionArea ?? previous.affected_area_pct ?? 0);
  const delta = Number((currentArea - prevArea).toFixed(1));

  // Determine recovery trend
  let trend = 'stable'; // 'recovering' | 'deteriorating' | 'stable'
  let label = 'Stable Foliar Condition';
  let badgeColor = 'emerald';

  if (delta <= -1.5) {
    trend = 'recovering';
    label = `${Math.abs(delta)}% Foliar Recovery`;
    badgeColor = 'emerald';
  } else if (delta >= 1.5) {
    trend = 'deteriorating';
    label = `+${delta}% Lesion Expansion`;
    badgeColor = 'rose';
  } else {
    trend = 'stable';
    label = 'Lesion Margin Stable';
    badgeColor = 'amber';
  }

  // Days elapsed
  const currentDate = new Date(current.timestamp || Date.now());
  const prevDate = new Date(previous.timestamp || Date.now());
  const diffDays = Math.max(0, Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24)));

  return {
    currentArea,
    prevArea,
    delta,
    trend,
    label,
    badgeColor,
    diffDays
  };
}
