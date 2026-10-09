import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * Custom hook for GSAP animations with automatic cleanup
 * Uses gsap.context() for proper React component scoping
 */
export function useGSAP(callback, dependencies = [], scopeRef = null) {
  const contextRef = useRef(null);

  useEffect(() => {
    // Create a new GSAP context for this component
    // The context is passed as the first argument to the callback function
    // Only pass scopeRef if it has a current value (to avoid "Invalid scope" error)
    const scope = scopeRef?.current;
    contextRef.current = gsap.context((ctx) => {
      // Call the user's callback with the context
      return callback(ctx);
    }, scope);

    // Return cleanup function
    return () => {
      if (contextRef.current) {
        contextRef.current.revert();
      }
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Hook for ScrollTrigger with automatic cleanup
 */
export function useScrollTrigger(config, dependencies = [], scopeRef = null) {
  const triggerRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef?.current;
    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        ...config,
        // Ensure trigger is scoped to this component
      });
    }, scope);

    return () => {
      ctx.revert();
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return triggerRef.current;
}

/**
 * Hook for creating GSAP timelines with automatic cleanup
 */
export function useTimeline(dependencies = [], scopeRef = null) {
  const timelineRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef?.current;
    contextRef.current = gsap.context(() => {
      timelineRef.current = gsap.timeline();
    }, scope);

    return () => {
      if (contextRef.current) {
        contextRef.current.revert();
      }
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return timelineRef.current;
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}