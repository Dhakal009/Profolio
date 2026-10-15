import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LenisProvider, useLenis } from '../../contexts/LenisContext';
import Header from './Header';
import Footer from './Footer';
import SkipLink from '../ui/SkipLink';
import BackToTop from '../ui/BackToTop';
import Preloader from '../hero/Preloader';
import FloatingFolder from '../ui/FloatingFolder';

// Adds `is-visible` to `.reveal` elements as they enter the viewport.
// Elements entering together are staggered for a smooth cascade.
function useGlobalReveal(pathname) {
  useEffect(() => {
    let observer = null;

    const observeUnrevealed = () => {
      const elements = document.querySelectorAll('.reveal:not(.is-visible)');
      if (!elements.length) return;

      if (!('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('is-visible'));
        return;
      }

      if (!observer) {
        observer = new IntersectionObserver(
          (entries) => {
            let i = 0;
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 35}ms`);
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
              i += 1;
            });
          },
          { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
        );
      }

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-visible');
        } else {
          observer.observe(el);
        }
      });
    };

    observeUnrevealed();
    const t1 = setTimeout(observeUnrevealed, 50);
    const t2 = setTimeout(observeUnrevealed, 250);
    const t3 = setTimeout(observeUnrevealed, 550);

    const mutationObserver = new MutationObserver(() => {
      observeUnrevealed();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      mutationObserver.disconnect();
      if (observer) observer.disconnect();
    };
  }, [pathname]);
}

// Scroll to top (or to the #hash target) whenever the route changes
function useRouteScroll(pathname, hash, state) {
  const { lenis } = useLenis();
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    // On fresh page reload/load, disable automatic browser scroll jump and scroll to top
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      if (typeof window !== 'undefined') {
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        window.scrollTo(0, 0);
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        }
      }
      return;
    }

    const targetId = state?.scrollTo || (hash ? hash.slice(1) : null);

    const tryScroll = () => {
      if (!targetId) return false;
      const target = document.getElementById(targetId);
      if (target) {
        if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.2 });
        else target.scrollIntoView({ behavior: 'smooth' });
        return true;
      }
      return false;
    };

    if (targetId) {
      if (!tryScroll()) {
        const t1 = setTimeout(() => {
          if (!tryScroll()) {
            const t2 = setTimeout(tryScroll, 200);
            return () => clearTimeout(t2);
          }
        }, 80);
        return () => clearTimeout(t1);
      }
    } else {
      const frame = requestAnimationFrame(() => {
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
          lenis.resize();
        } else {
          window.scrollTo(0, 0);
        }
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [pathname, hash, state, lenis]);
}

function Shell() {
  const { pathname, hash, state } = useLocation();
  const { lenis } = useLenis();
  useGlobalReveal(pathname);
  useRouteScroll(pathname, hash, state);

  return (
    <>
      <SkipLink />
      <Preloader />
      <Header />
      <main id="pageMain" role="main">
        {/* Keyed wrapper re-mounts on navigation to play the page fade-in */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={pathname}
            initial={{ opacity: 0, y: pathname.startsWith('/projects') ? 0 : 8, filter: pathname.startsWith('/projects') ? 'none' : 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'none' }}
            exit={{ opacity: 0, y: pathname.startsWith('/projects') ? 0 : -6, filter: pathname.startsWith('/projects') ? 'none' : 'blur(2px)' }}
            transition={{ duration: pathname.startsWith('/projects') ? 0.15 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => {
              if (lenis) lenis.resize();
            }}
            className="page"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {!pathname.startsWith('/projects') && <Footer />}
      {!pathname.startsWith('/projects') && <BackToTop />}
      <FloatingFolder />
    </>
  );
}

function Layout() {
  return (
    <ThemeProvider>
      <LenisProvider>
        <Shell />
      </LenisProvider>
    </ThemeProvider>
  );
}

export default Layout;