import { useEffect, useRef, useState } from 'react';

/**
 * Hook for scroll-triggered reveal animations
 * Uses IntersectionObserver to add 'is-visible' class when element enters viewport
 */
export function useReveal(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Optionally unobserve after first reveal
            if (options.once !== false) {
              observer.unobserve(element);
            }
          } else if (options.once === false) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once]);

  return { ref: elementRef, isVisible };
}

/**
 * Hook for staggered reveal of multiple elements
 */
export function useStaggeredReveal(itemCount, options = {}) {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reveal items with stagger
            const items = container.querySelectorAll('[data-reveal-item]');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('is-visible');
                setVisibleItems(prev => new Set([...prev, index]));
              }, index * (options.stagger || 100));
            });
            if (options.once !== false) {
              observer.unobserve(container);
            }
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [itemCount, options.threshold, options.rootMargin, options.once]);

  return { ref: containerRef, visibleItems };
}