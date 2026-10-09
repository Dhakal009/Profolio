import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LenisProvider, useLenis } from '../../contexts/LenisContext';
import Header from './Header';
import Footer from './Footer';
import SkipLink from '../ui/SkipLink';
import BackToTop from '../ui/BackToTop';
import Preloader from '../hero/Preloader';

// Adds `is-visible` to `.reveal` elements as they enter the viewport.
// Elements entering together are staggered for a smooth cascade.
function useGlobalReveal(pathname) {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let i = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 80}ms`);
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
          i += 1;
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
}

// Scroll to top (or to the #hash target) whenever the route changes
function useRouteScroll(pathname, hash) {
  const { lenis } = useLenis();

  useEffect(() => {
    const id = hash ? hash.slice(1) : null;
    const frame = requestAnimationFrame(() => {
      const target = id ? document.getElementById(id) : null;
      if (target) {
        if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.2 });
        else target.scrollIntoView({ behavior: 'smooth' });
      } else if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, lenis]);
}

function Shell() {
  const { pathname, hash } = useLocation();
  useGlobalReveal(pathname);
  useRouteScroll(pathname, hash);

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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="page"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
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