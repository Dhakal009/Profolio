import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useOptionalLenis } from '../../contexts/LenisContext';
import Folder from './Folder';

const PAGES = [
  {
    id: 'all-projects',
    num: '01 / Work',
    title: 'All Projects',
    subtitle: 'Explore selected work',
    path: '/projects',
    rotate: -2,
  },
  {
    id: 'resume',
    num: '02 / Profile',
    title: 'Resume',
    subtitle: 'Experience & skills',
    path: '/resume',
    rotate: 0,
  },
  {
    id: 'tech-stack',
    num: '03 / Stack',
    title: 'Tech Stack',
    subtitle: 'Tools powering this site',
    path: '/tech-stack',
    rotate: 2,
  },
];

function PickerModal({ isDark, currentPath, onClose, onSelect }) {
  const isPresent = useIsPresent();
  const backdropRef = useRef(null);

  useEffect(() => {
    const el = backdropRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      const canScroll = el.scrollHeight > el.clientHeight + 1;
      if (!canScroll) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const atTop = el.scrollTop <= 0 && e.deltaY < 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) {
        e.preventDefault();
      }
      e.stopPropagation();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <motion.div
      ref={backdropRef}
      className={`fixed inset-0 z-[110] flex overflow-y-auto overscroll-contain p-5 sm:p-8 ${
        isPresent ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Quick navigation pages"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, transition: { duration: 0.22, delay: 0.06, ease: [0.22, 1, 0.36, 1] } }}
      onClick={() => {
        if (isPresent) onClose();
      }}
      style={{
        background: isDark ? 'rgba(9, 9, 11, 0.68)' : 'rgba(244, 244, 246, 0.68)',
        backdropFilter: 'blur(18px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
        perspective: '1200px',
      }}
    >
      <div
        className="relative m-auto w-full max-w-3xl py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
          className="mb-5 flex items-center justify-between px-1"
        >
          <span
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: isDark ? 'rgba(255,255,255,0.62)' : 'rgba(24,24,27,0.62)' }}
          >
            Select a page
          </span>
          <button
            type="button"
            onClick={() => {
              if (isPresent) onClose();
            }}
            aria-label="Close quick navigation"
            className="flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95 cursor-pointer"
            style={{
              color: isDark ? '#ffffff' : '#18181b',
              borderColor: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(24,24,27,0.16)',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(24,24,27,0.05)',
            }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 [transform-style:preserve-3d]">
          {PAGES.map((page, index) => (
            <motion.button
              key={page.id}
              type="button"
              aria-current={currentPath === page.path ? 'page' : undefined}
              onClick={() => {
                if (isPresent) onSelect(page);
              }}
              onPointerMove={(e) => {
                if (!isPresent || e.pointerType === 'touch') return;
                const r = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                const rx = ((x / r.width) - 0.5) * 8;
                const ry = ((y / r.height) - 0.5) * -8;
                e.currentTarget.style.setProperty('--mx', `${x}px`);
                e.currentTarget.style.setProperty('--my', `${y}px`);
                e.currentTarget.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
                e.currentTarget.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.setProperty('--rx', '0deg');
                e.currentTarget.style.setProperty('--ry', '0deg');
              }}
              initial={{
                opacity: 0,
                x: 90,
                y: 110,
                scale: 0.52,
                rotate: 8,
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotate: page.rotate,
                transition: {
                  duration: 0.42,
                  delay: index * 0.045,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              exit={{
                opacity: 0,
                x: 120,
                y: 140,
                scale: 0.36,
                rotate: 10,
                transition: {
                  duration: 0.24,
                  delay: (PAGES.length - 1 - index) * 0.025,
                  ease: [0.32, 0.72, 0, 1],
                },
              }}
              whileHover={
                isPresent
                  ? { y: -12, scale: 1.035, rotate: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }
                  : undefined
              }
              whileTap={
                isPresent
                  ? { scale: 0.97, transition: { duration: 0.1 } }
                  : undefined
              }
              className="group relative flex flex-col justify-between text-left rounded-2xl p-6 sm:p-7 min-h-[11rem] sm:min-h-[16.5rem] cursor-pointer overflow-hidden border border-black/10 shadow-[0_18px_42px_rgba(0,0,0,0.22)] hover:shadow-[0_32px_68px_rgba(0,0,0,0.36)] transition-shadow"
              style={{
                background: '#ffffff',
                color: '#18181b',
                '--mx': '50%',
                '--my': '50%',
                '--rx': '0deg',
                '--ry': '0deg',
              }}
            >
              {/* Cursor-reactive 3D tilt wrapper */}
              <div
                className="relative z-10 flex flex-1 w-full flex-col justify-between transition-transform duration-300 ease-out group-hover:[transform:perspective(600px)_rotateX(var(--ry))_rotateY(var(--rx))]"
              >
                {/* Subtle cursor spotlight */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-7 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(15rem circle at var(--mx) var(--my), rgba(24,24,27,0.07), transparent 62%)',
                  }}
                />

                <div className="relative z-10 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-0.5 rounded-full transition-colors duration-300 group-hover:bg-zinc-900 group-hover:text-white"
                      style={{ background: '#f4f4f5', color: '#52525b' }}
                    >
                      {page.num}
                    </span>
                    <svg
                      className="h-4 w-4 text-zinc-400 transition-all duration-300 group-hover:text-zinc-900 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7M17 7H9M17 7v8" />
                    </svg>
                  </div>

                  <div className="mt-4 text-xl sm:text-2xl font-semibold tracking-tight leading-snug transition-transform duration-300 group-hover:translate-x-0.5" style={{ color: '#18181b' }}>
                    {page.title}
                  </div>

                  {/* Subtle document lines */}
                  <div className="mt-4 hidden sm:flex flex-col gap-1.5 opacity-45 group-hover:opacity-80 transition-opacity duration-300">
                    <span className="h-1 w-4/5 rounded-full bg-zinc-200 transition-all duration-300 group-hover:w-full" />
                    <span className="h-1 w-3/5 rounded-full bg-zinc-200 transition-all duration-300 group-hover:w-4/5" />
                  </div>
                </div>

                <div className="relative z-10 pt-4 w-full">
                  <div className="h-px w-full mb-3 transition-colors duration-300 group-hover:bg-zinc-300" style={{ background: '#e4e4e7' }} />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                    <span className="text-xs leading-snug" style={{ color: '#52525b' }}>
                      {page.subtitle}
                    </span>
                    <span className="font-mono text-[10px] whitespace-nowrap shrink-0 text-zinc-400 group-hover:text-zinc-900 transition-colors">
                      {page.path}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function FloatingFolder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { lenis } = useOptionalLenis() || {};
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 640 ? 0.3 : 0.36));
  const releaseScrollRef = useRef(() => {});

  // Responsive scale: compact and proportional
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScale(0.3);
      } else {
        setScale(0.36);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close folder if route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Lock background scroll while picker modal is open
  useEffect(() => {
    if (!isOpen) return undefined;

    lenis?.stop();
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      lenis?.start();
    };
    releaseScrollRef.current = release;

    return () => {
      release();
    };
  }, [isOpen, lenis]);

  const isDark = theme === 'dark';
  const folderColor = isDark ? '#1a1a1c' : '#ffffff';
  const paperColor = '#ffffff';

  const items = useMemo(() => [
    {
      id: 'all-projects',
      title: 'All Projects',
      path: '/projects',
      content: (
        <div
          className="h-full w-full flex flex-col justify-between select-none text-left"
          style={{
            background: '#ffffff',
            color: '#18181b',
            padding: 'calc(13px * var(--folder-scale))'
          }}
        >
          <div>
            <div className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 'calc(7px * var(--folder-scale))', color: '#71717a' }}>
              01 / Work
            </div>
            <div className="mt-1 font-semibold leading-tight" style={{ fontSize: 'calc(11px * var(--folder-scale))' }}>
              All Projects
            </div>
          </div>
          <div>
            <div style={{ height: '1px', background: '#e4e4e7', marginBottom: 'calc(6px * var(--folder-scale))' }} />
            <div className="leading-tight" style={{ fontSize: 'calc(7px * var(--folder-scale))', color: '#71717a' }}>
              Explore selected work
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'resume',
      title: 'Resume',
      path: '/resume',
      content: (
        <div
          className="h-full w-full flex flex-col justify-between select-none text-left"
          style={{
            background: '#ffffff',
            color: '#18181b',
            padding: 'calc(13px * var(--folder-scale))'
          }}
        >
          <div>
            <div className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: 'calc(7px * var(--folder-scale))', color: '#71717a' }}>
              02 / Profile
            </div>
            <div className="mt-1 font-semibold leading-tight" style={{ fontSize: 'calc(11px * var(--folder-scale))' }}>
              Resume
            </div>
          </div>
          <div>
            <div style={{ height: '1px', background: '#e4e4e7', marginBottom: 'calc(6px * var(--folder-scale))' }} />
            <div className="leading-tight" style={{ fontSize: 'calc(7px * var(--folder-scale))', color: '#71717a' }}>
              Experience &amp; skills
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tech-stack',
      title: 'Tech Stack',
      path: '/tech-stack',
      content: (
        <div
          className="h-full w-full flex items-center justify-center select-none text-center"
          style={{
            background: '#ffffff',
            color: '#18181b',
            padding: 'calc(13px * var(--folder-scale))'
          }}
        >
          <div className="font-semibold leading-tight" style={{ fontSize: 'calc(13px * var(--folder-scale))' }}>
            Tech Stack
          </div>
        </div>
      )
    }
  ], []);

  const handleItemClick = useCallback((item) => {
    releaseScrollRef.current();
    setIsOpen(false);
    if (!item?.path) return;
    if (item.path !== location.pathname) {
      navigate(item.path);
    } else if (lenis) {
      lenis.scrollTo(0, { duration: 0.7, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lenis, location.pathname, navigate]);

  return (
    <>
      <div
        className="floating-folder fixed bottom-[6.75rem] right-3 sm:bottom-5 sm:right-10 z-[88] flex flex-col items-end pointer-events-none"
        aria-label="Floating quick navigation folder"
      >
        <motion.div
          className="pointer-events-auto"
          animate={{
            scale: isOpen ? 0.92 : 1,
            opacity: isOpen ? 0.5 : 1,
            y: isOpen ? 4 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Folder
            size={scale}
            mode="flap"
            variant="solid"
            color={folderColor}
            paperColor={paperColor}
            items={items}
            open={false}
            onOpenChange={() => setIsOpen((v) => !v)}
            onItemClick={handleItemClick}
            zoomOnClick={false}
            draggable={false}
            peek={true}
            theme={isDark ? 'dark' : 'light'}
            closeOnOutsideClick={false}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <PickerModal
            key="folder-picker-modal"
            isDark={isDark}
            currentPath={location.pathname}
            onClose={() => setIsOpen(false)}
            onSelect={handleItemClick}
          />
        )}
      </AnimatePresence>
    </>
  );
}
