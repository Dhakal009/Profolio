import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLenis } from '../../contexts/LenisContext';
import ThemeToggle from '../ui/ThemeToggle';
import SearchModal from '../search/SearchModal';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects', route: '/projects' },
  { id: 'contact', label: 'Contact' },
];

// Sections on the home page, in order, with the title shown in the top bar
const sections = [
  { id: 'hero', title: 'Home' },
  { id: 'about', title: 'About' },
  { id: 'experience', title: 'Experience' },
  { id: 'projects-preview', title: 'Selected Work' },
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'deliver', title: 'What I Deliver' },
  { id: 'contact', title: 'Contact' },
];

const routeTitles = { '/projects': 'Projects' };

function Header() {
  const { lenis } = useLenis();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState('hero');
  const [isDockHidden, setIsDockHidden] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut to open search modal (Cmd+K, Ctrl+K, or /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) &&
        !document.activeElement?.isContentEditable
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const showDock = () => {
      setIsDockHidden(false);
    };

    const hideDock = () => {
      setIsDockHidden(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(showDock, 35);
    };

    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
      hideDock();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', hideDock, { passive: true });
    window.addEventListener('touchmove', hideDock, { passive: true });
    window.addEventListener('touchend', () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(showDock, 15);
    }, { passive: true });

    let unbindLenis = null;
    if (lenis) {
      const onLenisScroll = (e) => {
        // If smooth-scroll velocity slows down to near stop, reveal dock immediately
        if (Math.abs(e.velocity) < 0.25) {
          showDock();
        } else {
          hideDock();
        }
      };
      lenis.on('scroll', onLenisScroll);
      unbindLenis = () => lenis.off('scroll', onLenisScroll);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', hideDock);
      window.removeEventListener('touchmove', hideDock);
      if (unbindLenis) unbindLenis();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lenis]);

  // Track which section is in view (home page only)
  useEffect(() => {
    if (location.pathname !== '/') return;
    setActiveId('hero');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const scrollToId = useCallback(
    (id) => {
      const target = document.getElementById(id);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.2 });
      else target.scrollIntoView({ behavior: 'smooth' });
    },
    [lenis]
  );

  const handleNav = useCallback(
    (e, item) => {
      e.preventDefault();
      if (item.route) {
        navigate(item.route);
        return;
      }
      if (location.pathname === '/') scrollToId(item.id);
      else navigate(`/#${item.id}`);
    },
    [location.pathname, navigate, scrollToId]
  );

  const handleHome = useCallback(
    (e) => {
      if (location.pathname !== '/') return; // let <Link> navigate
      e.preventDefault();
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [lenis, location.pathname]
  );

  const isHome = location.pathname === '/';
  const currentId = location.pathname === '/projects' ? 'projects' : isHome ? activeId : null;
  const isActive = (item) =>
    item.id === currentId ||
    (item.id === 'experience' && currentId === 'education') ||
    (item.id === 'skills' && currentId === 'deliver');

  const sectionIdx = sections.findIndex((s) => s.id === activeId);
  const title = isHome ? sections[Math.max(0, sectionIdx)].title : routeTitles[location.pathname] || 'Page';

  return (
    <>
      {/* ---------- Top bar: mark · page title · search · theme ---------- */}
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} role="banner">
        <div className="header-inner">
          <div className="header-left">
            <button
              type="button"
              className="site-mark"
              aria-label="Bikash Dhakal — Home"
              onClick={handleHome}
            >
              B<span className="site-mark-dot">.</span>
            </button>

            {/* Home button & page title on other pages (e.g. /projects) */}
            {!isHome && (
              <div className="header-page-group">
                <button
                  type="button"
                  className="header-home-btn"
                  aria-label="Back to Home"
                  onClick={handleHome}
                >
                  <svg
                    className="header-home-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Home
                </button>
                <span className="header-page-sep" aria-hidden="true">/</span>
                <span className="header-page-title" key={title}>
                  {title}
                </span>
              </div>
            )}

            {/* Active section title on home page only when scrolled past hero */}
            {isHome && activeId !== 'hero' && (
              <div className="header-page-group">
                <span className="header-page-sep" aria-hidden="true">/</span>
                <span className="header-page-title" key={title}>
                  {title}
                </span>
              </div>
            )}
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="search-toggle-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search website (Ctrl+K)"
              title="Search website (Ctrl+K)"
            >
              <svg
                className="search-toggle-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* ---------- Bottom dock navigation ---------- */}
      <nav className={`dock ${isDockHidden ? 'is-hidden' : ''}`} aria-label="Main navigation">
        <div className="dock-inner">
          <button
            type="button"
            className="dock-logo"
            aria-label="Home"
            onClick={handleHome}
          >
            B.
          </button>
          <ul className="dock-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`dock-link ${isActive(item) ? 'active' : ''}`}
                  aria-current={isActive(item) ? 'true' : undefined}
                  onClick={(e) => handleNav(e, item)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <a href="mailto:bikash@example.com" className="dock-cta">
            Let&apos;s talk
          </a>

        </div>
      </nav>
      

    </>
  );
}

export default Header;