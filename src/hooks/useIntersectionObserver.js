import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook for IntersectionObserver with React-friendly API
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  const setRef = useCallback((node) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      });
    }, {
      threshold: options.threshold || 0,
      rootMargin: options.rootMargin || '0px',
      root: options.root || null,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options.threshold, options.rootMargin, options.root]);

  return { ref: setRef, isIntersecting, entry };
}

/**
 * Hook for tracking multiple sections for nav highlighting
 */
export function useSectionObserver(sectionIds = [], options = {}) {
  const [activeSection, setActiveSection] = useState(null);
  const observersRef = useRef(new Map());

  useEffect(() => {
    // Clean up previous observers
    observersRef.current.forEach((observer) => observer.disconnect());
    observersRef.current.clear();

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '-50% 0px -50% 0px',
      ...options,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    observersRef.current.set('main', observer);

    return () => {
      observer.disconnect();
      observersRef.current.clear();
    };
  }, [sectionIds.join(',')]);

  return activeSection;
}