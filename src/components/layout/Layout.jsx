import { Suspense, useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'framer-motion';
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

// Freezes the exiting route element during AnimatePresence transitions
// so the old page never flashes the incoming route's content while fading out.
function AnimatedOutlet() {
  const outlet = useOutlet();
  const isPresent = useIsPresent();
  const frozenOutletRef = useRef(outlet);
  if (isPresent) {
    frozenOutletRef.current = outlet;
  }
  return frozenOutletRef.current;
}

// Adds `is-visible` to `.reveal` elements as they enter the viewport.
function useGlobalReveal(pathname, readyTick) {
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
  }, [pathname, readyTick]);
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
function useRouteScroll(pathname, hash, state, readyTick) {
  const { lenis } = useLenis();
  const isInitialLoadRef = useRef(true);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      prevPathRef.current = pathname;
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

    // Defer scroll reset/jump on pathname change until AnimatePresence finishes
    // exiting the previous page so it doesn't snap to top mid-fade-out.
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      return;
    }

    const targetId = state?.scrollTo || (hash ? hash.slice(1) : null);

    const tryScroll = () => {
      if (!targetId) return false;
      const target = document.getElementById(targetId);
      if (!target) return false;
      if (lenis) lenis.resize();
      const destination = getScrollTarget(target);
      if (lenis) lenis.scrollTo(destination, { offset: -40, duration: 0.9, force: true });
      else target.scrollIntoView({ behavior: 'smooth' });
      return true;
    };

    if (targetId) {
      if (tryScroll()) return;
      let t2;
      let t3;
      const t1 = setTimeout(() => {
        if (!tryScroll()) {
          t2 = setTimeout(() => {
            if (!tryScroll()) {
              t3 = setTimeout(tryScroll, 260);
            }
          }, 160);
        }
      }, 80);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
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
  }, [pathname, hash, state, readyTick, lenis]);
}

function Shell() {
  const { pathname, hash, state } = useLocation();
  const { lenis } = useLenis();
  const reduceMotion = useReducedMotion();
  const [readyTick, setReadyTick] = useState(0);
  const isProjects = pathname.startsWith('/projects');
  useGlobalReveal(pathname, readyTick);
  useLenisScrollTrigger();
  useRouteScroll(pathname, hash, state, readyTick);

  // Re-measure once fonts are ready (fixes wrong scroll lengths in production)
  useEffect(() => {
    document.fonts?.ready.then(() => {
      lenis?.resize();
      ScrollTrigger.refresh();
    });
  }, [lenis]);

  const handleExitComplete = () => {
    if (!hash && !state?.scrollTo) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
    lenis?.resize();
    ScrollTrigger.refresh();
    setReadyTick((n) => n + 1);
  };

  return (
    <>
      <SkipLink />
      <Preloader />
      <Header />
      <main id="pageMain" role="main">
        <AnimatePresence initial={false} mode="wait" onExitComplete={handleExitComplete}>
          <motion.div
            key={pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.01 } }
                : { opacity: 0, y: -12, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }
            }
            transition={{ duration: reduceMotion ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={(definition) => {
              if (definition && definition.opacity === 0) return;
              // Page is now at its final size: re-measure Lenis and every ScrollTrigger
              lenis?.resize();
              ScrollTrigger.refresh();
            }}
            className="page"
          >
            <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
              <AnimatedOutlet />
            </Suspense>
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