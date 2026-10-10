import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLenis } from '../../contexts/LenisContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';
import SearchModal from '../search/SearchModal';
import { DockMenu, THEMES } from '../ui/Dock';

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

const SPRING_CONFIG = { mass: 0.1, stiffness: 160, damping: 13 };
const HOP_TIME = 0.38;
const REACH = 140;
const MAX_SWELL = 0.22;
const MAX_LIFT = 16;
const MAX_DEPTH = 24;
const MAX_TILT_X = 6;

function Header() {
  const { theme } = useTheme();
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
  const lastUserScrollTimeRef = useRef(0);

  useEffect(() => {
    const showDock = () => {
      setIsDockHidden(false);
    };

    const hideDock = (delay = 60) => {
      setIsDockHidden(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(showDock, delay);
    };

    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
      // If Lenis is actively coasting after user stopped interacting, avoid postponing dock reveal
      if (lenis && lenis.isScrolling) {
        if (Date.now() - lastUserScrollTimeRef.current > 60) {
          return;
        }
      }
      hideDock(60);
    };

    const onWheel = () => {
      lastUserScrollTimeRef.current = Date.now();
      hideDock(60);
    };

    const onTouchMove = () => {
      lastUserScrollTimeRef.current = Date.now();
      hideDock(60);
    };

    const onTouchEnd = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(showDock, 30);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    let unbindLenis = null;
    if (lenis) {
      const onLenisScroll = (e) => {
        const vel = Math.abs(e.velocity);
        // Once user stops active input and deceleration slows, immediately reveal dock without lag
        if (vel < 0.8 && Date.now() - lastUserScrollTimeRef.current > 50) {
          showDock();
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
        } else if (vel >= 0.8) {
          hideDock(60);
        }
      };
      lenis.on('scroll', onLenisScroll);
      unbindLenis = () => lenis.off('scroll', onLenisScroll);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (unbindLenis) unbindLenis();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lenis]);

  // Track which section is in view on the home page
  useEffect(() => {
    if (location.pathname !== '/') return;

    let observer = null;

    const setupObserver = () => {
      if (!('IntersectionObserver' in window)) return;
      if (observer) observer.disconnect();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '-30% 0px -40% 0px' }
      );

      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };

    const onScrollUpdate = () => {
      if (location.pathname !== '/') return;
      if (window.scrollY < 100) {
        setActiveId('hero');
        return;
      }
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let matched = 'hero';
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            matched = id;
          }
        }
      }
      setActiveId(matched);
    };

    if (location.state?.scrollTo) {
      setActiveId(location.state.scrollTo);
    } else if (window.scrollY < 100) {
      setActiveId('hero');
    }

    setupObserver();
    const t1 = setTimeout(setupObserver, 80);
    const t2 = setTimeout(setupObserver, 300);

    window.addEventListener('scroll', onScrollUpdate, { passive: true });
    let unbindLenis = null;
    if (lenis) {
      lenis.on('scroll', onScrollUpdate);
      unbindLenis = () => lenis.off('scroll', onScrollUpdate);
    }

    return () => {
      if (observer) observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('scroll', onScrollUpdate);
      if (unbindLenis) unbindLenis();
    };
  }, [location.pathname, location.state, lenis]);

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
      e?.preventDefault?.();
      if (item.route) {
        navigate(item.route);
        return;
      }
      if (location.pathname === '/') {
        scrollToId(item.id);
      } else {
        navigate('/', { state: { scrollTo: item.id } });
      }
    },
    [location.pathname, navigate, scrollToId]
  );

  const handleHome = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (location.pathname !== '/') {
        navigate('/');
        return;
      }
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [lenis, location.pathname, navigate]
  );

  const isHome = location.pathname === '/';
  const currentId = location.pathname === '/projects' ? 'projects' : isHome ? activeId : null;
  const isActive = (item) =>
    item.id === currentId ||
    (item.id === 'experience' && currentId === 'education') ||
    (item.id === 'skills' && currentId === 'deliver');

  const sectionIdx = sections.findIndex((s) => s.id === activeId);
  const title = isHome ? sections[Math.max(0, sectionIdx)]?.title || 'Home' : routeTitles[location.pathname] || 'Page';

  // React Bits 3D dock magnification & hop physics
  const slotRefs = useRef([]);
  const tileRefs = useRef([]);
  const baseWidthsRef = useRef([]);
  const motionStatesRef = useRef(new Map());
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: 0, inside: false });

  const getMotionState = useCallback((idx) => {
    let state = motionStatesRef.current.get(idx);
    if (!state) {
      state = {
        scale: 1,
        velocity: 0,
        lift: 0,
        rise: 0,
        launch: 0,
        gravity: 0,
        hopping: false,
      };
      motionStatesRef.current.set(idx, state);
    }
    return state;
  }, []);

  const measureWidths = useCallback(() => {
    slotRefs.current.forEach((slot, idx) => {
      if (!slot) return;
      const tile = tileRefs.current[idx];
      if (tile) {
        tile.style.transform = '';
        tile.style.width = '';
        tile.style.boxShadow = '';
      }
      slot.style.width = '';
    });
    slotRefs.current.forEach((slot, idx) => {
      if (!slot) return;
      const tile = tileRefs.current[idx];
      const w = Math.round(slot.getBoundingClientRect().width);
      if (w > 0) {
        baseWidthsRef.current[idx] = w;
        slot.style.width = `${w}px`;
        if (tile) tile.style.width = `${w}px`;
      }
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(measureWidths, 40);
    window.addEventListener('resize', measureWidths);
    if (document.fonts?.ready) {
      document.fonts.ready.then(measureWidths);
    }
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureWidths);
    };
  }, [measureWidths]);

  const startAnimation = useCallback(() => {
    if (rafRef.current) return;
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = Math.min(1 / 30, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      let isMoving = false;

      const ptr = pointerRef.current;
      const k = SPRING_CONFIG.stiffness / SPRING_CONFIG.mass;
      const c = SPRING_CONFIG.damping / SPRING_CONFIG.mass;

      tileRefs.current.forEach((tile, idx) => {
        if (!tile) return;
        const slot = slotRefs.current[idx] || tile;
        const state = getMotionState(idx);
        let targetScale = 1;
        let tiltY = 0;

        if (ptr.inside) {
          const rect = slot.getBoundingClientRect();
          const itemCenterX = rect.left + rect.width / 2;
          const dist = Math.abs(ptr.x - itemCenterX);
          if (dist < REACH) {
            const reachRatio = dist / REACH;
            const swell = Math.cos((reachRatio * Math.PI) / 2) ** 2;
            targetScale = 1 + MAX_SWELL * swell;
            tiltY = ((ptr.x - itemCenterX) / REACH) * -8 * swell;
          }
        }

        // Spring simulation for scale
        state.velocity = (state.velocity + dt * k * (targetScale - state.scale)) / (1 + dt * c + dt * dt * k);
        state.scale += state.velocity * dt;

        // Hopping simulation
        if (state.hopping) {
          state.rise -= state.gravity * dt;
          state.lift += state.rise * dt;
          if (state.lift <= 0) {
            state.lift = 0;
            state.rise *= -0.36;
            if (state.rise < state.launch * 0.2) {
              state.rise = 0;
              state.hopping = false;
            }
          }
        }

        const swellRatio = Math.max(0, (state.scale - 1) / MAX_SWELL);
        const scaleLift = swellRatio * MAX_LIFT;
        const currentTotalLift = scaleLift + state.lift;
        const currentDepth = swellRatio * MAX_DEPTH;
        const currentTiltX = swellRatio * MAX_TILT_X;

        if (Math.abs(state.velocity) > 0.0005 || Math.abs(targetScale - state.scale) > 0.0005 || state.hopping) {
          isMoving = true;
        }

        const baseW = baseWidthsRef.current[idx];
        if (baseW) {
          // Dynamically expand slot width to make room for enlarged tile — zero overlap!
          const currentSlotW = baseW * state.scale;
          slot.style.width = `${currentSlotW.toFixed(1)}px`;
        }

        if (Math.abs(state.scale - 1) > 0.001 || currentTotalLift > 0.01) {
          tile.style.transform = `perspective(700px) translate3d(0, ${-currentTotalLift.toFixed(2)}px, ${currentDepth.toFixed(2)}px) rotateX(${currentTiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) scale(${state.scale.toFixed(3)})`;
          tile.style.zIndex = state.scale > 1.05 || state.hopping ? '30' : '10';

          const shadowY = (currentTotalLift * 1.2 + 4).toFixed(1);
          const shadowBlur = (currentTotalLift * 1.5 + 8).toFixed(1);
          tile.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px -3px rgba(0, 0, 0, 0.75), 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)`;
        } else {
          tile.style.transform = '';
          tile.style.zIndex = '';
          tile.style.boxShadow = '';
          if (baseW) {
            slot.style.width = `${baseW}px`;
          }
        }
      });

      if (isMoving) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [getMotionState]);

  const handlePointerMove = useCallback((e) => {
    pointerRef.current = { x: e.clientX, inside: true };
    startAnimation();
  }, [startAnimation]);

  const handlePointerLeave = useCallback(() => {
    pointerRef.current = { x: 0, inside: false };
    startAnimation();
  }, [startAnimation]);

  const triggerHop = useCallback((idx) => {
    const el = tileRefs.current[idx];
    if (!el) return;
    const state = getMotionState(idx);
    if (state.hopping) return;
    const hopHeight = 16;
    state.gravity = (8 * hopHeight) / (HOP_TIME * HOP_TIME);
    state.launch = (state.gravity * HOP_TIME) / 2;
    state.rise = state.launch;
    state.lift = 0;
    state.hopping = true;
    startAnimation();
  }, [getMotionState, startAnimation]);

  // Context menu state & long-press handling
  const [menu, setMenu] = useState(null);
  const pressTimerRef = useRef(null);

  const openContextMenu = useCallback((e, index, itemData) => {
    e?.preventDefault?.();
    const el = tileRefs.current[index];
    if (!el || !itemData?.menu?.length) return;
    const rect = el.getBoundingClientRect();
    const point = { x: rect.left + rect.width / 2, y: rect.top - 8 };
    setMenu({
      id: Date.now(),
      rows: itemData.menu,
      label: itemData.label,
      point,
      closing: false,
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenu((prev) => (prev ? { ...prev, closing: true } : null));
  }, []);

  const finishMenu = useCallback(() => {
    setMenu(null);
  }, []);

  const handlePointerDown = useCallback((e, index, itemData) => {
    if (e.button !== 0) return;
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    const startX = e.clientX;
    const startY = e.clientY;

    const onMove = (moveEv) => {
      if (Math.hypot(moveEv.clientX - startX, moveEv.clientY - startY) > 8) {
        clearTimeout(pressTimerRef.current);
      }
    };
    const onUp = () => {
      clearTimeout(pressTimerRef.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });

    pressTimerRef.current = setTimeout(() => {
      openContextMenu(e, index, itemData);
    }, 450);
  }, [openContextMenu]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!menu || menu.closing) return;
    const onDown = (e) => {
      if (e.target?.closest?.('[data-dock-menu]')) return;
      closeMenu();
    };
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('scroll', closeMenu, true);
    window.addEventListener('resize', closeMenu);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('scroll', closeMenu, true);
      window.removeEventListener('resize', closeMenu);
    };
  }, [menu, closeMenu]);

  // Context menus for dock items
  const logoMenuData = {
    label: 'Home',
    menu: [
      { label: 'Back to Top', onClick: handleHome },
      { separator: true },
      {
        label: 'Jump to Section',
        items: [
          { label: 'About', onClick: () => scrollToId('about') },
          { label: 'Experience', onClick: () => scrollToId('experience') },
          { label: 'Selected Work', onClick: () => scrollToId('projects-preview') },
          { label: 'Education', onClick: () => scrollToId('education') },
          { label: 'Skills', onClick: () => scrollToId('skills') },
          { label: 'What I Deliver', onClick: () => scrollToId('deliver') },
          { label: 'Contact', onClick: () => scrollToId('contact') },
        ],
      },
    ],
  };

  const navMenuData = {
    about: {
      label: 'About',
      menu: [{ label: 'Interactive Terminal', onClick: () => scrollToId('about') }],
    },
    experience: {
      label: 'Experience',
      menu: [
        { label: 'Work Experience', onClick: () => scrollToId('experience') },
        { label: 'Education & Studies', onClick: () => scrollToId('education') },
      ],
    },
    skills: {
      label: 'Skills',
      menu: [
        { label: 'Skills & Tech Stack', onClick: () => scrollToId('skills') },
        { label: 'What I Deliver', onClick: () => scrollToId('deliver') },
      ],
    },
    projects: {
      label: 'Projects',
      menu: [
        { label: 'All Projects Page', onClick: () => navigate('/projects') },
        {
          label: 'Selected Work (Home)',
          onClick: () => {
            if (location.pathname !== '/') navigate('/#projects-preview');
            else scrollToId('projects-preview');
          },
        },
      ],
    },
    contact: {
      label: 'Contact',
      menu: [
        { label: 'Scroll to Contact Section', onClick: () => scrollToId('contact') },
        {
          label: 'Email: bikashdhakal546@gmail.com',
          onClick: () => {
            window.location.href = 'mailto:bikashdhakal546@gmail.com';
          },
        },
        {
          label: 'Copy Email Address',
          onClick: () => navigator.clipboard?.writeText('bikashdhakal546@gmail.com'),
        },
      ],
    },
  };

  const ctaMenuData = {
    label: "Let's talk",
    menu: [
      {
        label: 'Send Email',
        onClick: () => {
          window.location.href = 'mailto:bikashdhakal546@gmail.com';
        },
      },
      {
        label: 'Copy Email Address',
        onClick: () => navigator.clipboard?.writeText('bikashdhakal546@gmail.com'),
      },
      { separator: true },
      {
        label: 'Social Profiles',
        items: [
          { label: 'GitHub', onClick: () => window.open('https://github.com', '_blank') },
          { label: 'LinkedIn', onClick: () => window.open('https://linkedin.com', '_blank') },
          { label: 'Twitter', onClick: () => window.open('https://twitter.com', '_blank') },
        ],
      },
    ],
  };

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
        <div
          className="dock-inner"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div
            className="dock-slot"
            ref={(el) => (slotRefs.current[0] = el)}
          >
            <button
              type="button"
              className="dock-logo dock-tile"
              aria-label="Home"
              onClick={(e) => {
                triggerHop(0);
                handleHome(e);
              }}
              ref={(el) => (tileRefs.current[0] = el)}
              onContextMenu={(e) => openContextMenu(e, 0, logoMenuData)}
              onPointerDown={(e) => handlePointerDown(e, 0, logoMenuData)}
            >
              B.
            </button>
          </div>
          <ul className="dock-list">
            {navItems.map((item, idx) => {
              const itemIdx = idx + 1;
              return (
                <li
                  key={item.id}
                  className="dock-slot"
                  ref={(el) => (slotRefs.current[itemIdx] = el)}
                >
                  <button
                    type="button"
                    className={`dock-link dock-tile ${isActive(item) ? 'active' : ''}`}
                    aria-current={isActive(item) ? 'true' : undefined}
                    onClick={(e) => {
                      triggerHop(itemIdx);
                      handleNav(e, item);
                    }}
                    ref={(el) => (tileRefs.current[itemIdx] = el)}
                    onContextMenu={(e) => openContextMenu(e, itemIdx, navMenuData[item.id])}
                    onPointerDown={(e) => handlePointerDown(e, itemIdx, navMenuData[item.id])}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <div
            className="dock-slot"
            ref={(el) => (slotRefs.current[navItems.length + 1] = el)}
          >
            <a
              href="mailto:bikashdhakal546@gmail.com"
              className="dock-cta dock-tile"
              onClick={() => triggerHop(navItems.length + 1)}
              ref={(el) => (tileRefs.current[navItems.length + 1] = el)}
              onContextMenu={(e) => openContextMenu(e, navItems.length + 1, ctaMenuData)}
              onPointerDown={(e) => handlePointerDown(e, navItems.length + 1, ctaMenuData)}
            >
              Let&apos;s talk
            </a>
          </div>
        </div>
      </nav>

      {menu && (
        <DockMenu
          key={menu.id}
          rows={menu.rows}
          label={menu.label}
          side="bottom"
          point={menu.point}
          tokens={THEMES[theme] ?? THEMES.dark}
          closing={menu.closing}
          onSelect={(row) => {
            closeMenu();
            row.onClick?.();
          }}
          onDismiss={closeMenu}
          onExited={finishMenu}
        />
      )}
      

    </>
  );
}

export default Header;