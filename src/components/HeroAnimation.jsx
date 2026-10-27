import React, { useState, useEffect } from 'react';
import { Sparkles, Scan, CheckCircle2, ChevronRight, X } from 'lucide-react';

/**
 * HeroAnimation - Modern Agriculture & AI Scanner Entrance Animation
 * 
 * Features:
 * - Option A Full-Screen Smooth Intro Splash / Preloader (2.2s auto-fade)
 * - Animated Sprouting Leaf with Pulsing Emerald Bio-Aura
 * - High-Precision Laser Scan Sweep across specimen reticle
 * - Dynamic Neural Matrix Calibration Progress & agronomy telemetry
 * - Session Control via sessionStorage with reload detection
 * - Keyboard Escape / Skip button support
 * - Clean hardware-accelerated transitions & prefers-reduced-motion accessibility
 */
export default function HeroAnimation({ onComplete, forceShow = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Computer Vision Core...');

  useEffect(() => {
    // Check if user has already visited in this session
    let shouldPlay = false;
    try {
      const hasVisited = sessionStorage.getItem('hasVisited');
      const navEntry = window.performance?.getEntriesByType?.('navigation')?.[0];
      const isReload = navEntry && navEntry.type === 'reload';

      if (forceShow || !hasVisited || isReload) {
        shouldPlay = true;
      }
    } catch (e) {
      shouldPlay = true;
    }

    if (!shouldPlay) {
      if (onComplete) onComplete();
      return;
    }

    setIsVisible(true);
    setIsExiting(false);
    setProgress(0);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 10;
        const next = Math.min(100, prev + increment);

        if (next > 30 && next <= 70) {
          setStatusText('Scanning Agricultural Pathology Models...');
        } else if (next > 70) {
          setStatusText('✓ Neural Diagnostic Suite Ready');
        }
        return next;
      });
    }, 180);

    // Auto-fade timer: starts exit fade at 2.2s
    const exitTimer = setTimeout(() => {
      triggerExit();
    }, 2200);

    // Keyboard listener: Escape key skips immediately
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        triggerExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [forceShow]);

  const triggerExit = () => {
    setIsExiting(true);
    try {
      sessionStorage.setItem('hasVisited', 'true');
    } catch (e) {}

    // Wait for fade-out duration (700ms) then unmount and notify parent
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 700);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="FloraScan AI Loading Sequence"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-slate-950 transition-all duration-700 ease-out select-none ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 45%, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.85) 45%, rgba(2, 6, 23, 0.98) 85%)'
      }}
    >
      {/* Background Precision Agronomy Field Grid */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating Botanical Sprout Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: '15%', delay: '0s', duration: '3.6s', size: 'text-emerald-400/40 text-lg' },
          { left: '25%', delay: '0.8s', duration: '4.2s', size: 'text-teal-300/30 text-xl' },
          { left: '42%', delay: '1.4s', duration: '3.9s', size: 'text-emerald-500/30 text-sm' },
          { left: '60%', delay: '0.4s', duration: '4.5s', size: 'text-emerald-300/40 text-2xl' },
          { left: '78%', delay: '1.1s', duration: '3.8s', size: 'text-teal-400/30 text-base' },
          { left: '88%', delay: '0.2s', duration: '4.0s', size: 'text-emerald-400/40 text-lg' },
        ].map((particle, idx) => (
          <span
            key={idx}
            className="absolute bottom-10 animate-botanical-float pointer-events-none"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          >
            <span className={particle.size}>🍃</span>
          </span>
        ))}
      </div>

      {/* Top Right Quick Skip Button */}
      <button
        type="button"
        onClick={triggerExit}
        className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 shadow-md backdrop-blur-md transition-all cursor-pointer group"
        title="Skip intro animation (Esc)"
      >
        <span>Skip</span>
        <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 font-mono">ESC</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Center Cinematic Sprout & Laser Scanning Hub */}
      <div className="relative flex flex-col items-center max-w-md w-full px-6 z-10">
        
        {/* Ambient Pulsing Bio-Aura Rings */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-emerald-500/10 animate-pulse-aura blur-xl pointer-events-none" />
          <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-emerald-500/25 animate-ping opacity-20 pointer-events-none" style={{ animationDuration: '3s' }} />
          <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-teal-500/30 animate-pulse pointer-events-none" />

          {/* Central Glassmorphic AI Diagnostic Scanner Reticle */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-slate-900/90 border border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.35)] backdrop-blur-xl flex items-center justify-center overflow-hidden animate-leaf-sprout">
            
            {/* Reticle Corner Brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

            {/* Glowing Sprouting Botanical Icon with illuminated veins */}
            <div className="relative flex items-center justify-center transform scale-110">
              <svg 
                className="w-14 h-14 sm:w-16 sm:h-16 text-emerald-400 filter drop-shadow-[0_2px_12px_rgba(52,211,153,0.7)]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.75" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {/* Stylized Botanical Leaf */}
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="rgba(16, 185, 129, 0.25)" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                <path d="M11 20c0-4 2-7 6-9" strokeWidth="1.25" strokeOpacity="0.75" />
                <path d="M14 15c1-1.5 2.5-2.5 4-3" strokeWidth="1.25" strokeOpacity="0.75" />
              </svg>
            </div>

            {/* Glowing Horizontal Laser Scanning Beam */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-laser-scan pointer-events-none" />

            {/* Micro AI Telemetry Tag */}
            <div className="absolute bottom-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-500/40">
              AI SCAN
            </div>
          </div>
        </div>

        {/* Brand Title with Emerald Glow Gradient */}
        <div className="text-center space-y-1.5 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 shadow-sm mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PRECISION PLANT PATHOLOGY
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
            FloraScan{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              AI
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xs sm:max-w-sm mx-auto font-sans leading-relaxed">
            Autonomous crop pathology diagnostics & computer vision studio
          </p>
        </div>

        {/* Matrix Calibration Progress Bar */}
        <div className="w-full mt-6 space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              {progress >= 100 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
              ) : (
                <Scan className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
              )}
              {statusText}
            </span>
            <span className="text-emerald-400 font-bold">{progress}%</span>
          </div>

          {/* Glowing Track */}
          <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/60 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-200 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Diagnostic Telemetry Sub-labels */}
        <div className="grid grid-cols-3 gap-2 w-full mt-5 text-[10px] font-mono text-center text-slate-500 border-t border-slate-800/80 pt-3">
          <div>
            <span className="block text-slate-400 font-semibold">SOBEL KERNEL</span>
            <span className="text-emerald-400">ACTIVE</span>
          </div>
          <div>
            <span className="block text-slate-400 font-semibold">CONFIDENCE</span>
            <span className="text-emerald-400">99.4%</span>
          </div>
          <div>
            <span className="block text-slate-400 font-semibold">PATHOLOGY DB</span>
            <span className="text-emerald-400">SYNCED</span>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * HeroParticles - Optional subtle floating botanical particles for hero section
 */
export function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {[
        { left: '10%', top: '20%', delay: '0s', duration: '6s', size: '18px' },
        { left: '30%', top: '65%', delay: '2s', duration: '7s', size: '14px' },
        { left: '70%', top: '35%', delay: '1s', duration: '6.5s', size: '20px' },
        { left: '85%', top: '75%', delay: '3s', duration: '8s', size: '16px' },
      ].map((p, i) => (
        <span
          key={i}
          className="absolute animate-botanical-float opacity-30 select-none text-emerald-500"
          style={{
            left: p.left,
            top: p.top,
            fontSize: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration
          }}
        >
          🍃
        </span>
      ))}
    </div>
  );
}
