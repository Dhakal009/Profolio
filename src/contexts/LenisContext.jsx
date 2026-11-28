import { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LenisContext = createContext(null);

const SMOOTH_EASING = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

function ensureResizeObserver() {
  if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
    class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.ResizeObserver = ResizeObserverMock;
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
    window.matchMedia = () => ({
      matches: false,
      media: '',
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    });
  }
}

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    ensureResizeObserver();

    const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    const reduceMotion = hasMatchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const instance = new Lenis({
      lerp: reduceMotion ? 1 : 0.08,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !reduceMotion,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false,
      autoRaf: false,
      overscroll: false,
    });

    lenisRef.current = instance;
    setLenis(instance);

    if (hasMatchMedia) {
      gsap.registerPlugin(ScrollTrigger);
      instance.on('scroll', ScrollTrigger.update);
    }

    // Drive Lenis from GSAP's single unified ticker so scroll & animations
    // stay phase-locked on the exact same frame with zero double-RAF jitter.
    const onTick = (time) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    setIsReady(true);

    return () => {
      gsap.ticker.remove(onTick);
      if (hasMatchMedia) {
        instance.off('scroll', ScrollTrigger.update);
      }
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      setIsReady(false);
    };
  }, []);

  const scrollTo = useCallback((target, options = {}) => {
    if (lenisRef.current) {
      const defaults = options.immediate
        ? {}
        : { duration: 1.15, easing: SMOOTH_EASING };
      lenisRef.current.scrollTo(target, { ...defaults, ...options });
    }
  }, []);

  const stop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
  }, []);

  const start = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.start();
    }
  }, []);

  const value = {
    lenis,
    scrollTo,
    stop,
    start,
    isReady,
  };

  return (
    <LenisContext.Provider value={value}>
      {children}
    </LenisContext.Provider>
  );
}

export function useOptionalLenis() {
  return useContext(LenisContext);
}

export function useLenis() {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return context;
}
