import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  const [intensity, setIntensity] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('intensity')) || 1;
    }
    return 1;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply intensity to document
  useEffect(() => {
    document.documentElement.style.setProperty('--intensity', intensity);
    localStorage.setItem('intensity', intensity.toString());
  }, [intensity]);

  const toggleTheme = useCallback((event) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const apply = () => {
      // Update the DOM synchronously so the "new" snapshot is already themed.
      root.setAttribute('data-theme', next);
      flushSync(() => setTheme(next));
    };

    if (!document.startViewTransition || reduce) {
      root.classList.add('theme-fade');
      apply();
      setTimeout(() => root.classList.remove('theme-fade'), 500);
      return;
    }

    // Reveal circle grows from the clicked button (or screen centre).
    const el = event?.currentTarget;
    const rect = el?.getBoundingClientRect?.();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    setIsTransitioning(true);
    root.classList.add('theme-vt');
    const transition = document.startViewTransition(apply);

    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 700,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {});

    transition.finished.finally(() => {
      root.classList.remove('theme-vt');
      setIsTransitioning(false);
    });
  }, [theme]);

  const setIntensityValue = useCallback((value) => {
    const clamped = Math.max(0.7, Math.min(1.4, value));
    setIntensity(clamped);
  }, []);

  const value = {
    theme,
    setTheme,
    intensity,
    setIntensity: setIntensityValue,
    toggleTheme,
    isTransitioning,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}