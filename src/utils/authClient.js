/**
 * authClient.js - Neon Managed Better Auth Client for FloraScan AI
 * Connects frontend to Neon Auth REST API and provides JWT tokens for Flask backend calls.
 */

const NEON_AUTH_URL =
  import.meta.env.VITE_NEON_AUTH_URL ||
  'https://ep-withered-fog-b5l9266p.neonauth.c-7.us-east-2.aws.neon.tech/neondb/auth';

const SESSION_STORAGE_KEY = 'florascan_neon_session';
const TOKEN_STORAGE_KEY = 'florascan_neon_token';

class NeonAuthClient {
  constructor() {
    this.baseUrl = NEON_AUTH_URL;
    this._listeners = new Set();
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify() {
    const state = this.getState();
    this._listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (err) {
        console.error('Auth listener error:', err);
      }
    });
  }

  getState() {
    const rawUser = localStorage.getItem(SESSION_STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    let user = null;
    if (rawUser) {
      try {
        user = JSON.parse(rawUser);
      } catch (_) {
        user = null;
      }
    }
    return {
      user,
      token,
      isAuthenticated: Boolean(user && token)
    };
  }

  getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  }

  getUser() {
    const state = this.getState();
    return state.user;
  }

  async _fetchToken() {
    try {
      const res = await fetch(`${this.baseUrl}/token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Origin': window.location.origin
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.token) {
          localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
          return data.token;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch Neon JWT token:', err);
    }
    return null;
  }

  async signUp({ email, password, name }) {
    const res = await fetch(`${this.baseUrl}/sign-up/email`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
        name: name?.trim() || email.split('@')[0]
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Registration failed');
    }

    if (data.user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
    }
    // Fetch and cache verified JWT token
    const token = await this._fetchToken();
    if (!token && data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    }

    this._notify();
    return { user: data.user, token: this.getToken() };
  }

  async signIn({ email, password }) {
    const res = await fetch(`${this.baseUrl}/sign-in/email`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        email: email.trim(),
        password
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Invalid credentials');
    }

    if (data.user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
    }
    // Fetch and cache verified JWT token
    const token = await this._fetchToken();
    if (!token && data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    }

    this._notify();
    return { user: data.user, token: this.getToken() };
  }

  async signInWithGoogle() {
    const res = await fetch(`${this.baseUrl}/sign-in/social`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        provider: 'google',
        callbackURL: window.location.origin
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Failed to start Google sign-in');
    }

    if (data?.url) {
      window.location.href = data.url;
      return { redirect: true, url: data.url };
    }
    return data;
  }

  async signOut() {
    try {
      await fetch(`${this.baseUrl}/sign-out`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Origin': window.location.origin
        }
      });
    } catch (err) {
      console.warn('Error reporting sign-out to Neon Auth:', err);
    }

    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this._notify();
  }

  async refreshSession() {
    try {
      const res = await fetch(`${this.baseUrl}/get-session`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Origin': window.location.origin
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
          await this._fetchToken();
          this._notify();
          return this.getState();
        }
      }
    } catch (err) {
      console.debug('Session check offline or unauthenticated:', err);
    }
    return this.getState();
  }
}

export const authClient = new NeonAuthClient();
