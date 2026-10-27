import React, { useState } from 'react';
import { X, Lock, Mail, User, LogIn, UserPlus, LogOut, CheckCircle2, AlertCircle, Loader2, Leaf, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal({ isOpen = false, onClose = () => {} }) {
  const { user, isAuthenticated, login, register, logout, signInWithGoogle } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err?.message || 'Failed to initialize Google Sign In');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both email and password.');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long.');
        }
        await register(email, password, name);
        setSuccessMsg('Account created successfully! Your cloud scan sync is now active.');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        if (!email.trim() || !password) {
          throw new Error('Please enter your email and password.');
        }
        await login(email, password);
        setSuccessMsg('Signed in successfully! Synced with your Neon PostgreSQL cloud storage.');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logout();
      onClose();
    } catch (err) {
      setError(err?.message || 'Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Accent Header */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 border border-emerald-400/40 group">
              <Leaf className="w-5 h-5 text-white drop-shadow-md transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-white dark:border-slate-900"></span>
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {isAuthenticated ? 'Cloud Account' : mode === 'signin' ? 'Sign In to FloraScan' : 'Create Account'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAuthenticated ? 'Syncing with Neon PostgreSQL' : 'Save & access your plant scans anywhere'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Already Authenticated: Profile & Sign Out View */}
        {isAuthenticated ? (
          <div className="space-y-5 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Verified Agronomist'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Neon Cloud Synced</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">🔒 Data Privacy Guarantee:</p>
              <p>Your foliar pathology scans and diagnosis reports are encrypted and strictly bound to your user ID.</p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 active:scale-98 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="space-y-4">
            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-750 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-750 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Continue with Google */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Clean Divider */}
              <div className="relative flex items-center justify-center my-1.5">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  or continue with email
                </span>
                <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
              </div>
            </div>

            {/* Error & Success Banners */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Farmer Green"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@florascan.ai"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                {mode === 'signup' && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    At least 8 characters. Managed by Neon Auth.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 active:scale-98 transition-all cursor-pointer mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : mode === 'signin' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
