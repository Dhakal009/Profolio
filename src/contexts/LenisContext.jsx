import { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LenisContext = createContext(null);

function ensureResizeObserver() {
  if (typeof window === 'undefined' || 'ResizeObserver' in window) {
    return;
  }

  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserverMock;
}

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    ensureResizeObserver();

    const instance = new Lenis({
      lerp: 0.14,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.0,
      infinite: false,
    });

    lenisRef.current = instance;
    setLenis(instance);
    const hasScrollTriggerEnv = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    if (hasScrollTriggerEnv) {
      gsap.registerPlugin(ScrollTrigger);
      instance.on('scroll', ScrollTrigger.update);
    }

    let frameId = 0;
    function raf(time) {
      instance.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    setIsReady(true);

    return () => {
      cancelAnimationFrame(frameId);
      if (hasScrollTriggerEnv) {
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
      lenisRef.current.scrollTo(target, options);
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