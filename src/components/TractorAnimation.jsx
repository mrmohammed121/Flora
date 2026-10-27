import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import tractorData from '../assets/tractorAnimation.json';
import './GlassVideoCard.css';

export default function TractorAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: tractorData,
    });

    return () => {
      anim.destroy();
    };
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto my-6 px-4">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Lottie Animation Display Card (Left Side) */}
        <div className="flex-1 w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-emerald-50/30 to-slate-50 dark:from-slate-900/95 dark:via-slate-850 dark:to-slate-900/95 border border-slate-200 dark:border-emerald-500/30 shadow-md dark:shadow-2xl backdrop-blur-md p-3 sm:p-4 transition-colors">
          <div className="w-full flex justify-center items-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-100 via-white to-emerald-50/60 dark:from-slate-900 dark:via-slate-850 dark:to-emerald-950/20 p-2 sm:p-4 shadow-inner border border-slate-200 dark:border-emerald-500/10">
            <div
              ref={containerRef}
              className="w-full max-w-3xl h-44 sm:h-60 md:h-72 flex items-center justify-center"
              aria-label="Tractor Plowing Animation"
            />
          </div>
        </div>

        {/* Glass Video Card (Right Side) */}
        <div className="flex-shrink-0 flex items-center justify-center py-2">
          <div className="cards">
            <div className="card"></div>
            <div className="card card--glass">
              <div className="card__content">
                <div className="card__video-wrap">
                  <video
                    className="card__video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  >
                    <source src="/repoooooooooooo.mp4" type="video/mp4" />
                    <source src="C:/Users/abhis/Downloads/repoooooooooooo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

