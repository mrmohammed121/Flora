/**
 * neonScanApi.js - Authenticated client communication for FloraScan Flask Backend & Neon PostgreSQL
 * Automatically attaches cryptographic Bearer JWT tokens to all requests.
 */

import { authClient } from './authClient';
import { API_BASE_URL } from '../config/api';

const API_BASE = API_BASE_URL;

function getAuthHeaders() {
  const token = authClient.getToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch paginated scan records strictly belonging to the authenticated user
 */
export async function fetchUserScans(page = 1, pageSize = 25) {
  const headers = getAuthHeaders();
  if (!headers['Authorization']) {
    throw new Error('Authentication required to access cloud scan records.');
  }

  const res = await fetch(`${API_BASE}/api/scans?page=${page}&page_size=${pageSize}`, {
    method: 'GET',
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to load cloud scan records.');
  }

  return {
    scans: data.scans || [],
    total: data.total || 0,
    page: data.page || page,
    pageSize: data.page_size || pageSize,
    totalPages: data.total_pages || 1
  };
}

/**
 * Save or update a scan record into Neon PostgreSQL
 */
export async function saveUserScan(scanData) {
  const headers = getAuthHeaders();
  if (!headers['Authorization']) {
    throw new Error('Authentication required to save scan to cloud.');
  }

  const res = await fetch(`${API_BASE}/api/scans`, {
    method: 'POST',
    headers,
    body: JSON.stringify(scanData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to save scan to cloud.');
  }

  return data.scan;
}

/**
 * Delete a user's scan from Neon PostgreSQL
 */
export async function deleteUserScan(scanId) {
  const headers = getAuthHeaders();
  if (!headers['Authorization']) {
    throw new Error('Authentication required to delete cloud scan.');
  }

  const res = await fetch(`${API_BASE}/api/scans/${scanId}`, {
    method: 'DELETE',
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to delete scan.');
  }

  return true;
}

/**
 * Check Neon Database connection health
 */
export async function checkNeonDbHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/db/health`);
    return await res.json();
  } catch (err) {
    return {
      connected: false,
      status: 'error',
      message: 'Flask backend is unreachable.'
    };
  }
}
