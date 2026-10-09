import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

  const toggleTheme = useCallback(() => {
    setIsTransitioning(true);

    // Use View Transition API if available
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      }).finished.then(() => {
        setIsTransitioning(false);
      }).catch(() => {
        setIsTransitioning(false);
      });
    } else {
      // Fallback for browsers without View Transitions
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      // Small delay to allow CSS transition
      setTimeout(() => setIsTransitioning(false), 650);
    }
  }, []);

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