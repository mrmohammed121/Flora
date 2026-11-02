/**
 * src/config/api.js
 * Centralized API base URL configuration for FloraScan AI.
 * Uses Vite environment variable `VITE_API_BASE_URL` for production (e.g. Render / Railway),
 * falling back to local Flask server `http://127.0.0.1:5000` during local development.
 */

export const API_BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://127.0.0.1:5000'
).replace(/\/+$/, '');

// Free instances on Render or Railway spin down / sleep after periods of inactivity.
// Cold starts can take 25 to 50 seconds to boot up.
// A 60-second timeout ensures requests are not aborted prematurely.
export const PREDICTION_TIMEOUT_MS = 60000; // 60 seconds

export default API_BASE_URL;
