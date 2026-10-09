import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLenis } from '../../contexts/LenisContext';
import ThemeToggle from '../ui/ThemeToggle';

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
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'deliver', title: 'What I Deliver' },
  { id: 'contact', title: 'Contact' },
];

const routeTitles = { '/projects': 'Projects' };

/* Rolling title: the old label slides up & blurs out while the new one rises in */
function PageTitle({ title, index }) {
  const [items, setItems] = useState([{ title, index, key: 0 }]);
  const keyRef = useRef(0);

  useEffect(() => {
    setItems((prev) => {
      const last = prev[prev.length - 1];
      if (last.title === title) return prev;
      keyRef.current += 1;
      return [{ ...last, leaving: true }, { title, index, key: keyRef.current }];
    });
  }, [title, index]);

  return (
    <div className="page-title-pill" aria-live="polite">
      <span className="page-title-dot" aria-hidden="true" />
      <span className="page-title-track">
        {items.map((it) => (
          <span
            key={it.key}
            className={`page-title-label ${it.leaving ? 'is-leaving' : 'is-entering'}`}
            aria-hidden={it.leaving ? 'true' : undefined}
            onAnimationEnd={() => {
              if (it.leaving) setItems((prev) => prev.filter((p) => p.key !== it.key));
            }}
          >
            {it.index && <span className="page-title-index">{it.index}</span>}
            {it.title}
          </span>
        ))}
      </span>
    </div>
  );
}

function Header() {
  const { lenis } = useLenis();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState('hero');
  const [isDockHidden, setIsDockHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which section is in view (home page only)
  useEffect(() => {
    if (location.pathname !== '/') return;
    setActiveId('hero');
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
  const index = isHome && sectionIdx > 0 ? String(sectionIdx).padStart(2, '0') : null;

  return (
    <>
      {/* ---------- Top bar: mark · page title · theme ---------- */}
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} role="banner">
        <div className="header-inner">
          <Link to="/" className="site-mark" aria-label="Bikash Dhakal — Home" onClick={handleHome}>
            B<span className="site-mark-dot">.</span>
          </Link>

          <PageTitle title={title} index={index} />

          <div className="nav-actions">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ---------- Bottom dock navigation ---------- */}
      <nav className={`dock ${isDockHidden ? 'is-hidden' : ''}`} aria-label="Main navigation">
        <div className="dock-inner">
          <Link to="/" className="dock-logo" aria-label="Home" onClick={handleHome}>
            B.
          </Link>
          <ul className="dock-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.route || `/#${item.id}`}
                  className={`dock-link ${isActive(item) ? 'active' : ''}`}
                  aria-current={isActive(item) ? 'true' : undefined}
                  onClick={(e) => handleNav(e, item)}
                >
                  {item.label}
                </a>
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