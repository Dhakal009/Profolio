import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LenisProvider, useLenis } from '../../contexts/LenisContext';
import Header from './Header';
import Footer from './Footer';
import SkipLink from '../ui/SkipLink';
import BackToTop from '../ui/BackToTop';
import Preloader from '../hero/Preloader';
import FloatingFolder from '../ui/FloatingFolder';
import { getScrollTarget } from '../../utils/scrollTarget';

// Self-hosted font (npm i @fontsource/inter). Works the same in dev and production.
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';

// Adds `is-visible` to `.reveal` elements as they enter the viewport.
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
    const timers = [50, 250, 550].map((ms) => setTimeout(observeUnrevealed, ms));

    const mutationObserver = new MutationObserver(observeUnrevealed);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      timers.forEach(clearTimeout);
      mutationObserver.disconnect();
      if (observer) observer.disconnect();
    };
  }, [pathname]);
}

// Keeps GSAP ScrollTrigger in step with the app's single Lenis instance.
function useLenisScrollTrigger() {
  const { lenis } = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  }, [lenis]);
}

// Scroll to top (or to the #hash target) whenever the route changes
function useRouteScroll(pathname, hash, state) {
  const { lenis } = useLenis();
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
      return;
    }

    const targetId = state?.scrollTo || (hash ? hash.slice(1) : null);

    const tryScroll = () => {
      if (!targetId) return false;
      const target = document.getElementById(targetId);
      if (!target) return false;
      const destination = getScrollTarget(target);
      if (lenis) lenis.scrollTo(destination, { offset: -40, duration: 0.9, force: true });
      else target.scrollIntoView({ behavior: 'smooth' });
      return true;
    };

    if (targetId) {
      if (tryScroll()) return;
      let t2;
      const t1 = setTimeout(() => {
        if (!tryScroll()) t2 = setTimeout(tryScroll, 200);
      }, 80);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    const frame = requestAnimationFrame(() => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
        lenis.resize();
      } else {
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, state, lenis]);
}

function Shell() {
  const { pathname, hash, state } = useLocation();
  const { lenis } = useLenis();
  const isProjects = pathname.startsWith('/projects');
  useGlobalReveal(pathname);
  useLenisScrollTrigger();
  useRouteScroll(pathname, hash, state);

  // Re-measure once fonts are ready (fixes wrong scroll lengths in production)
  useEffect(() => {
    document.fonts?.ready.then(() => {
      lenis?.resize();
      ScrollTrigger.refresh();
    });
  }, [lenis]);

  return (
    <>
      <SkipLink />
      <Preloader />
      <Header />
      <main id="pageMain" role="main">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => {
              // Page is now at its final size: re-measure Lenis and every ScrollTrigger
              lenis?.resize();
              ScrollTrigger.refresh();
            }}
            className="page"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {!isProjects && <Footer />}
      {!isProjects && <BackToTop />}
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