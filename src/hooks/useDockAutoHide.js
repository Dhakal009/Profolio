import { useEffect, useRef } from 'react';

// Hides the dock only while the user is actively driving the scroll (wheel / finger)
// and shows it again almost immediately after they let go. It does NOT wait for the
// smooth-scroll glide to finish.
//
// It only toggles classes on the element (no React state, no re-render).
// All timing/easing lives in your CSS (.dock and .dock.is-hidden).
//
// Class `dock-ready` is added once the entrance animation has played (or the dock is
// hidden for the first time), so the entrance animation can never replay on re-show.

const MIN_IDLE_MS = 50; // fastest "wheel stopped" detection (continuous trackpad input)
const MAX_IDLE_MS = 150; // slowest, used for slow, notch-by-notch mouse wheels
const TOUCH_END_MS = 0; // finger lifted = show the dock instantly
const SLOW_WHEEL = 12; // wheel deltas below this (trackpad momentum tail) don't hide

export default function useDockAutoHide(dockRef, onScrollY, onHide) {
  const scrollRef = useRef(onScrollY);
  const hideRef = useRef(onHide);
  scrollRef.current = onScrollY;
  hideRef.current = onHide;

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return undefined;

    let hidden = dock.classList.contains('is-hidden');
    let timer = 0;
    let lastWheel = 0;
    let gap = 100; // smoothed time between wheel events

    const markReady = () => dock.classList.add('dock-ready');

    // entrance animation finished: from now on the dock is simply "visible"
    const onAnimationEnd = (event) => {
      if (event.target === dock && event.animationName === 'dockIn') markReady();
    };
    dock.addEventListener('animationend', onAnimationEnd);

    const setHidden = (value) => {
      if (hidden === value) return;
      hidden = value;
      if (value) markReady(); // never replay the entrance animation after a hide
      dock.classList.toggle('is-hidden', value);
      // the cursor is no longer over a moving dock: let the Header clear stale hover state
      if (value) hideRef.current?.();
    };

    const showIn = (ms) => {
      clearTimeout(timer);
      timer = window.setTimeout(() => setHidden(false), ms);
    };

    const onWheel = (event) => {
      const now = performance.now();
      const delta = now - lastWheel;
      lastWheel = now;
      // adapt to how fast input arrives, so slow wheel notches don't make the dock flicker
      gap = delta < 400 ? gap * 0.6 + delta * 0.4 : 100;
      const idle = Math.min(MAX_IDLE_MS, Math.max(MIN_IDLE_MS, gap * 1.6));

      const magnitude = Math.abs(event.deltaY) + Math.abs(event.deltaX);
      if (magnitude > SLOW_WHEEL) setHidden(true);
      showIn(idle);
    };

    const onTouchMove = () => {
      setHidden(true);
      clearTimeout(timer); // stays hidden while the finger is down
    };

    const onTouchEnd = () => showIn(TOUCH_END_MS);

    const onScroll = () => scrollRef.current?.(window.scrollY);

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      dock.removeEventListener('animationend', onAnimationEnd);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
    };
  }, [dockRef]);
}