// src/components/CustomCursor.jsx
// Smooth Cursor Animation with Elastic LERP Trailing Ring
import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  useEffect(() => {
    // Only enable custom cursor for devices with mouse/pointer
    if (typeof window === 'undefined') return;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const outline = outlineRef.current;
    if (!dot || !outline) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    let animationFrameId = null;
    let isVisible = false;

    // Track real mouse position
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.classList.remove('cursor-hidden');
        outline.classList.remove('cursor-hidden');
      }

      // Small dot snaps directly to mouse coordinates
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    // Smooth animation loop using linear interpolation (LERP)
    const animate = () => {
      // 0.15 creates a smooth elastic trailing delay
      const speed = 0.15;
      outlineX += (mouseX - outlineX) * speed;
      outlineY += (mouseY - outlineY) * speed;

      outline.style.left = `${outlineX}px`;
      outline.style.top = `${outlineY}px`;

      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    // Interactive element detection via event delegation (works with dynamically rendered modals & buttons)
    const onMouseOver = (e) => {
      const interactive = e.target.closest(
        'button, a, input, select, textarea, [role="button"], label, [data-hover], .interactive-btn'
      );
      if (interactive) {
        outline.classList.add('hovered');
      } else {
        outline.classList.remove('hovered');
      }
    };

    // Click effect (scale feedback)
    const onMouseDown = () => {
      dot.classList.add('clicked');
      outline.classList.add('clicked');
    };

    const onMouseUp = () => {
      dot.classList.remove('clicked');
      outline.classList.remove('clicked');
    };

    // Hide cursor when leaving the window
    const onMouseLeave = () => {
      isVisible = false;
      dot.classList.add('cursor-hidden');
      outline.classList.add('cursor-hidden');
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.classList.remove('cursor-hidden');
      outline.classList.remove('cursor-hidden');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot cursor-hidden" aria-hidden="true" />
      <div ref={outlineRef} className="cursor-outline cursor-hidden" aria-hidden="true" />
    </>
  );
}
