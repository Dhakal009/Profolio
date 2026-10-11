import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLenis } from '../../contexts/LenisContext';
import './search-modal-extras.css';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/*    target  – section id(s) on the home page (array = fallbacks)     */
/*    route   – a page route                                           */
/*    href    – external link                                          */
/*    command – terminal command to run after jumping to #about        */
/* ------------------------------------------------------------------ */
const SEARCH_DATABASE = [
  // Pages & sections
  {
    id: 'page-home',
    category: 'page',
    title: 'Home Page',
    desc: 'Main portfolio homepage, hero, full stack developer profile.',
    route: '/',
    keywords: ['home', 'hero', 'start', 'top', 'bikash', 'dhakal'],
  },
  {
    id: 'sec-about',
    category: 'section',
    title: 'About Section (Linux Terminal)',
    desc: 'Interactive Linux terminal shell, bio, facts, background, Kathmandu Nepal.',
    target: 'about',
    keywords: ['about', 'bio', 'terminal', 'linux', 'bash', 'developer', 'kathmandu', 'nepal', 'whoami'],
  },
  {
    id: 'sec-experience',
    category: 'section',
    title: 'Experience',
    desc: 'Independent freelance developer, client collaborations, frontend architecture, backend APIs.',
    target: 'experience',
    keywords: ['experience', 'work', 'freelance', 'clients', 'history', 'architecture', 'jobs', 'career'],
  },
  {
    id: 'sec-projects-prev',
    category: 'section',
    title: 'Selected Work Preview',
    desc: 'Featured portfolio projects: Aether E-Commerce, Lumina Dashboard, Vortex Portfolio.',
    target: ['projects-preview', 'projects', 'work'],
    keywords: ['selected', 'work', 'preview', 'featured', 'portfolio', 'showcase'],
  },
  {
    id: 'page-projects',
    category: 'page',
    title: 'All Projects Page',
    desc: 'Complete collection of web applications, SaaS dashboards, and creative WebGL builds.',
    route: '/projects',
    keywords: ['projects', 'apps', 'all', 'works', 'showcase', 'saas', 'webgl'],
  },
  {
    id: 'sec-education',
    category: 'section',
    title: 'Education',
    desc: 'B.Sc in Computer Science & Information Technology (2019 — 2023), specialized coursework.',
    target: 'education',
    keywords: ['education', 'degree', 'bsc', 'csit', 'university', 'college', 'studies'],
  },
  {
    id: 'sec-skills',
    category: 'section',
    title: 'Skills & Tech Stack',
    desc: 'React 19, TypeScript, Node.js, Next.js, PostgreSQL, Tailwind CSS, Framer Motion, Docker.',
    target: 'skills',
    keywords: ['skills', 'tech', 'stack', 'technologies', 'tools', 'languages', 'frameworks'],
  },
  {
    id: 'sec-deliver',
    category: 'section',
    title: 'What I Deliver',
    desc: 'Scalable architecture, pixel-perfect UI, performance optimization, WCAG accessibility.',
    target: 'deliver',
    keywords: ['deliver', 'deliverables', 'performance', 'ui', 'architecture', 'lighthouse', 'accessibility'],
  },
  {
    id: 'sec-contact',
    category: 'section',
    title: 'Contact & Let’s Talk',
    desc: 'Reach out for freelance projects or full-time roles: bikashdhakal546@gmail.com.',
    target: 'contact',
    keywords: ['contact', 'email', 'hire', 'talk', 'message', 'inbox', 'collaborate', 'freelance'],
  },

  // Projects
  {
    id: 'proj-aether',
    category: 'project',
    title: 'Aether E-Commerce (2025)',
    desc: 'Headless e-commerce platform with WebGL product viewers, Stripe checkout, dynamic inventory.',
    route: '/projects',
    keywords: ['aether', 'ecommerce', 'shop', 'stripe', 'threejs', 'webgl', 'nextjs', 'cart'],
  },
  {
    id: 'proj-lumina',
    category: 'project',
    title: 'Lumina Dashboard (2024)',
    desc: 'SaaS analytics platform with live telemetry, drag-and-drop widgets, React, Node.js, PostgreSQL.',
    route: '/projects',
    keywords: ['lumina', 'dashboard', 'analytics', 'saas', 'metrics', 'charts', 'postgresql'],
  },
  {
    id: 'proj-vortex',
    category: 'project',
    title: 'Vortex Portfolio (2024)',
    desc: 'Creative WebGL experience featuring procedural particle shaders, GSAP, and smooth scrolling.',
    route: '/projects',
    keywords: ['vortex', 'webgl', 'threejs', 'gsap', 'creative', 'shaders', 'particles', '3d'],
  },
  {
    id: 'proj-syntax',
    category: 'project',
    title: 'Syntax OS (Browser OS)',
    desc: 'Web-based operating system simulation with virtual file system, React, and Redux Toolkit.',
    route: '/projects',
    keywords: ['syntax', 'os', 'operating', 'system', 'desktop', 'redux', 'simulation'],
  },

  // Skills & tools
  {
    id: 'skill-react',
    category: 'skill',
    title: 'React 19 & Next.js',
    desc: 'Component architecture, SSR/SSG, Server Actions, modern state management (Zustand, Redux).',
    target: 'skills',
    keywords: ['react', 'nextjs', 'frontend', 'javascript', 'jsx', 'zustand', 'redux'],
  },
  {
    id: 'skill-ts',
    category: 'skill',
    title: 'TypeScript',
    desc: 'Strict type safety, generics, modern design patterns, and maintainable large codebases.',
    target: 'skills',
    keywords: ['typescript', 'ts', 'types', 'javascript', 'interfaces'],
  },
  {
    id: 'skill-node',
    category: 'skill',
    title: 'Node.js & Backend APIs',
    desc: 'Express, RESTful endpoints, GraphQL, authentication, microservices architecture.',
    target: 'skills',
    keywords: ['nodejs', 'node', 'express', 'backend', 'api', 'graphql', 'rest'],
  },
  {
    id: 'skill-db',
    category: 'skill',
    title: 'PostgreSQL & Prisma & Redis',
    desc: 'Relational data modeling, Prisma ORM, MongoDB, fast caching with Redis.',
    target: 'skills',
    keywords: ['database', 'postgres', 'postgresql', 'prisma', 'redis', 'mongodb', 'sql'],
  },
  {
    id: 'skill-anim',
    category: 'skill',
    title: 'GSAP & Framer Motion',
    desc: 'Fluid 60fps micro-interactions, scroll triggers, staggered reveals, page transitions.',
    target: 'skills',
    keywords: ['animation', 'gsap', 'framer', 'motion', 'creative', 'transitions', 'scroll'],
  },
  {
    id: 'skill-tailwind',
    category: 'skill',
    title: 'Tailwind CSS & Design Tokens',
    desc: 'Design system tokens, custom resets, responsive layouts, dark and light theme tokens.',
    target: 'skills',
    keywords: ['tailwind', 'css', 'design', 'tokens', 'styles', 'responsive', 'themes'],
  },
  {
    id: 'skill-devops',
    category: 'skill',
    title: 'Docker & Git & CI/CD',
    desc: 'Automated GitHub Actions, containerization with Docker, AWS, and Vercel deployments.',
    target: 'skills',
    keywords: ['docker', 'git', 'github', 'actions', 'cicd', 'aws', 'vercel', 'devops'],
  },

  // Terminal commands (jump to the terminal AND run the command)
  {
    id: 'term-facts',
    category: 'terminal',
    title: 'cat facts.json (Linux Terminal)',
    desc: 'Prints quick profile facts as syntax-highlighted JSON.',
    target: 'about',
    command: 'cat facts.json',
    keywords: ['facts', 'json', 'profile', 'terminal', 'cat', 'summary'],
  },
  {
    id: 'term-neofetch',
    category: 'terminal',
    title: 'neofetch (Linux Terminal)',
    desc: 'Displays system specifications, OS edition, tech stack, and ASCII logo inside the About terminal.',
    target: 'about',
    command: 'neofetch',
    keywords: ['neofetch', 'fastfetch', 'terminal', 'ascii', 'specs', 'system'],
  },
  {
    id: 'term-bio',
    category: 'terminal',
    title: 'cat bio.txt (Linux Terminal)',
    desc: 'Reads Bikash’s developer bio and engineering philosophy inside the terminal.',
    target: 'about',
    command: 'cat bio.txt',
    keywords: ['bio', 'terminal', 'cat', 'txt', 'story', 'philosophy'],
  },
  {
    id: 'term-skills',
    category: 'terminal',
    title: 'skills (Linux Terminal)',
    desc: 'Shows proficiency levels as bars, grouped by frontend, backend, animation, and devops.',
    target: 'about',
    command: 'skills',
    keywords: ['skills', 'terminal', 'bars', 'levels', 'proficiency', 'tech', 'list'],
  },
  {
    id: 'term-help',
    category: 'terminal',
    title: 'help (Linux Terminal)',
    desc: 'Lists every command the portfolio terminal understands.',
    target: 'about',
    command: 'help',
    keywords: ['help', 'commands', 'terminal', 'man', 'usage'],
  },
  {
    id: 'term-theme',
    category: 'terminal',
    title: 'theme toggle (Linux Terminal)',
    desc: 'Switches the whole portfolio between dark and light mode.',
    target: 'about',
    command: 'theme toggle',
    keywords: ['theme', 'dark', 'light', 'mode', 'toggle', 'terminal', 'colors'],
  },
  {
    id: 'term-nav',
    category: 'terminal',
    title: 'cd projects (Terminal Navigation)',
    desc: 'Command line shortcut to navigate directly to the Projects page.',
    target: 'about',
    command: 'cd projects',
    keywords: ['cd', 'projects', 'navigate', 'goto', 'terminal'],
  },

  // Contact & socials
  {
    id: 'contact-mail',
    category: 'contact',
    title: 'Email (bikashdhakal546@gmail.com)',
    desc: 'Direct email link: bikashdhakal546@gmail.com. Always open for projects.',
    href: 'mailto:bikashdhakal546@gmail.com',
    keywords: ['email', 'mail', 'gmail', 'contact', 'write', 'inbox'],
  },
  {
    id: 'contact-github',
    category: 'contact',
    title: 'GitHub Profile (@Dhakal009)',
    desc: 'github.com/Dhakal009 — Open source contributions, projects, and repositories.',
    href: 'https://github.com/Dhakal009',
    keywords: ['github', 'code', 'git', 'repo', 'source', 'profile'],
  },
  {
    id: 'contact-linkedin',
    category: 'contact',
    title: 'LinkedIn Profile',
    desc: 'linkedin.com/in/bikash-dhakal — Connect professionally on LinkedIn.',
    href: 'https://linkedin.com/in/bikash-dhakal',
    keywords: ['linkedin', 'social', 'network', 'connect', 'career'],
  },
  {
    id: 'contact-twitter',
    category: 'contact',
    title: 'Twitter / X Profile',
    desc: 'twitter.com/bikash_dhakal — Thoughts on web development and creative code.',
    href: 'https://twitter.com/bikash_dhakal',
    keywords: ['twitter', 'x', 'social', 'tweet'],
  },
];

const BY_ID = Object.fromEntries(SEARCH_DATABASE.map((item) => [item.id, item]));

const QUICK_IDS = [
  'page-home',
  'sec-about',
  'sec-experience',
  'page-projects',
  'sec-skills',
  'sec-contact',
  'contact-github',
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'page', label: 'Pages' },
  { id: 'section', label: 'Sections' },
  { id: 'project', label: 'Projects' },
  { id: 'skill', label: 'Skills' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'contact', label: 'Contact' },
];
const CATEGORY_TITLE = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

const TERMINAL_EVENT = 'portfolio:terminal-run';
const RECENT_KEY = 'portfolio-search-recent';
const MAX_RECENT = 4;

/* ------------------------------------------------------------------ */
/*  Search engine: tokenised AND-match, weighted, with typo tolerance  */
/* ------------------------------------------------------------------ */
const words = (text) => text.toLowerCase().split(/[^a-z0-9+#]+/).filter(Boolean);
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const INDEX = SEARCH_DATABASE.map((item, order) => ({
  item,
  order,
  title: item.title.toLowerCase(),
  titleWords: words(item.title),
  kws: [...item.keywords.map((k) => k.toLowerCase()), item.category, `${item.category}s`],
  desc: item.desc.toLowerCase(),
  descWords: words(item.desc),
}));

function withinOneEdit(a, b) {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (la > lb) i++;
    else if (lb > la) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (la - i) + (lb - j) <= 1;
}

function isSubsequence(needle, hay) {
  let i = 0;
  for (const ch of hay) {
    if (ch === needle[i]) i++;
    if (i === needle.length) return true;
  }
  return false;
}

function scoreToken(token, e) {
  let best = 0;

  if (e.title.startsWith(token)) best = 100;
  else if (e.titleWords.some((w) => w.startsWith(token))) best = 80;
  else if (e.title.includes(token)) best = 55;

  for (const k of e.kws) {
    if (k === token) best = Math.max(best, 90);
    else if (k.startsWith(token)) best = Math.max(best, 65);
    else if (token.length >= 2 && k.includes(token)) best = Math.max(best, 30);
  }

  if (best < 30) {
    if (e.descWords.some((w) => w.startsWith(token))) best = Math.max(best, 22);
    else if (e.desc.includes(token)) best = Math.max(best, 12);
  }

  // Typo tolerance (one edit) and loose subsequence ("rct" → react)
  if (best === 0 && token.length >= 4) {
    if ([...e.titleWords, ...e.kws].some((w) => withinOneEdit(token, w))) best = 18;
  }
  if (best === 0 && token.length >= 3 && isSubsequence(token, e.title)) best = 8;

  return best;
}

function runSearch(query, filter) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const rows = [];
  for (const entry of INDEX) {
    if (filter !== 'all' && entry.item.category !== filter) continue;
    let total = 0;
    let ok = true;
    for (const t of tokens) {
      const s = scoreToken(t, entry);
      if (!s) {
        ok = false;
        break;
      }
      total += s;
    }
    if (ok) rows.push({ item: entry.item, score: total, order: entry.order });
  }
  rows.sort((a, b) => b.score - a.score || a.order - b.order);
  return rows.map((r) => r.item);
}

function highlightMatch(text, tokens) {
  if (!tokens.length || !text) return text;
  const pattern = tokens
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|');
  return text.split(new RegExp(`(${pattern})`, 'gi')).map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="search-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

const actionLabel = (item) => {
  if (item.href) return 'Open link';
  if (item.command) return 'Run command';
  if (item.route && !item.target) return 'Go to page';
  return 'Jump to section';
};

function readRecents() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((id) => BY_ID[id]).slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function writeRecents(ids) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable: recents just won't persist */
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recents, setRecents] = useState([]);

  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const releaseRef = useRef(() => {});
  const fromKeyboard = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { lenis } = useLenis();

  // Always read the latest instances from async callbacks
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  /* ---------- Open: reset state, lock page scroll (releasable) ---------- */
  useEffect(() => {
    if (!isOpen) return undefined;

    setQuery('');
    setFilter('all');
    setSelectedIndex(0);
    setRecents(readRecents());

    const l = lenis;
    l?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Idempotent: handleSelect calls this BEFORE navigating, otherwise the
    // paused Lenis / hidden overflow swallows the scroll we are about to start.
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      document.body.style.overflow = prevOverflow;
      l?.start();
    };
    releaseRef.current = release;

    const focusInput = () => inputRef.current?.focus();
    focusInput();
    const frameId = requestAnimationFrame(focusInput);
    const timer = setTimeout(focusInput, 40);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
      release();
    };
  }, [isOpen, lenis]);

  /* ---------- Results ---------- */
  const tokens = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);

  const entries = useMemo(() => {
    if (tokens.length) {
      return runSearch(query, filter).map((item) => ({ item }));
    }
    if (filter !== 'all') {
      return SEARCH_DATABASE.filter((i) => i.category === filter).map((item) => ({
        item,
        group: CATEGORY_TITLE[filter],
      }));
    }
    const recentItems = recents.map((id) => BY_ID[id]).filter(Boolean);
    const quick = QUICK_IDS.map((id) => BY_ID[id]).filter((i) => i && !recents.includes(i.id));
    return [
      ...recentItems.map((item) => ({ item, group: 'Recent' })),
      ...quick.map((item) => ({ item, group: 'Quick links' })),
    ];
  }, [query, tokens, filter, recents]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [entries]);

  // Keep the keyboard-selected row visible (not on mouse hover, which would jitter)
  useEffect(() => {
    if (!fromKeyboard.current) return;
    fromKeyboard.current = false;
    const id = entries[selectedIndex]?.item.id;
    if (id) document.getElementById(`search-opt-${id}`)?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, entries]);

  /* ---------- Navigation ---------- */
  // Waits for the target to exist (route change / lazy sections), then scrolls.
  const goToSection = useCallback((targets, { wait = 60, onArrive } = {}) => {
    const ids = [].concat(targets);
    let attempts = 0;

    const attempt = () => {
      const el = ids.map((id) => document.getElementById(id)).find(Boolean);
      if (!el) {
        if (attempts++ < 60) setTimeout(attempt, 50);
        return;
      }
      const l = lenisRef.current;
      if (l) {
        l.start();
        l.scrollTo(el, { offset: -40, duration: 1.2, force: true });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      onArrive?.();
    };

    setTimeout(attempt, wait);
  }, []);

  const scrollToTop = useCallback((immediate) => {
    const l = lenisRef.current;
    if (l) {
      l.start();
      l.scrollTo(0, immediate ? { immediate: true, force: true } : { duration: 1, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
    }
  }, []);

  const rememberRecent = useCallback((id) => {
    const next = [id, ...readRecents().filter((x) => x !== id)].slice(0, MAX_RECENT);
    writeRecents(next);
  }, []);

  const handleSelect = useCallback(
    (item) => {
      releaseRef.current(); // restore scrolling first
      rememberRecent(item.id);
      onClose();

      if (item.href) {
        if (item.href.startsWith('mailto:')) window.location.href = item.href;
        else window.open(item.href, '_blank', 'noopener,noreferrer');
        return;
      }

      const here = location.pathname;
      const runCommand = item.command
        ? () =>
            setTimeout(
              () => window.dispatchEvent(new CustomEvent(TERMINAL_EVENT, { detail: { command: item.command } })),
              900
            )
        : undefined;

      if (item.target) {
        const needsNav = here !== '/';
        if (needsNav) navigate(`/#${[].concat(item.target)[0]}`);
        goToSection(item.target, { wait: needsNav ? 350 : 60, onArrive: runCommand });
        return;
      }

      if (item.route) {
        if (item.route !== here) {
          navigate(item.route);
          setTimeout(() => scrollToTop(true), 80);
        } else {
          scrollToTop(false);
        }
      }
    },
    [goToSection, location.pathname, navigate, onClose, rememberRecent, scrollToTop]
  );

  const clearRecents = () => {
    writeRecents([]);
    setRecents([]);
    inputRef.current?.focus();
  };

  /* ---------- Keyboard ---------- */
  const handleInputKeyDown = (e) => {
    const total = entries.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      fromKeyboard.current = true;
      setSelectedIndex((prev) => (total ? (prev + 1) % total : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      fromKeyboard.current = true;
      setSelectedIndex((prev) => (total ? (prev - 1 + total) % total : 0));
    } else if (e.key === 'PageDown') {
      e.preventDefault();
      fromKeyboard.current = true;
      setSelectedIndex((prev) => Math.min(total - 1, prev + 5));
    } else if (e.key === 'PageUp') {
      e.preventDefault();
      fromKeyboard.current = true;
      setSelectedIndex((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (entries[selectedIndex]) handleSelect(entries[selectedIndex].item);
    }
  };

  // Dialog-wide: Escape closes from anywhere; Tab stays inside the dialog
  const handleDialogKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = [
      ...dialogRef.current.querySelectorAll('input, button:not([tabindex="-1"])'),
    ].filter((el) => !el.disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  const activeId = entries[selectedIndex] ? `search-opt-${entries[selectedIndex].item.id}` : undefined;
  const heading = query ? 'Results' : filter === 'all' ? 'Suggestions' : CATEGORY_TITLE[filter];
  const showClearRecents = !query && filter === 'all' && recents.length > 0;

  return (
    <div
      className="search-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Website search"
    >
      <div className="search-dialog" ref={dialogRef} onClick={(e) => e.stopPropagation()} onKeyDown={handleDialogKeyDown}>
        {/* Input */}
        <div className="search-input-wrapper">
          <svg
            className="search-input-icon"
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

          <input
            ref={inputRef}
            type="text"
            className="search-input-field"
            placeholder="Search projects, skills, terminal commands, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="search-listbox"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Search site content"
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />

          {query ? (
            <button
              type="button"
              className="search-input-clear"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search query"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <button type="button" className="search-esc-btn" onClick={onClose} aria-label="Close search">
              ESC
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="search-filters" role="tablist" aria-label="Filter results by type">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={filter === c.id}
              className={`search-filter ${filter === c.id ? 'is-active' : ''}`}
              onClick={() => {
                setFilter(c.id);
                inputRef.current?.focus();
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="search-section-header">
          <span>{heading}</span>
          <span className="search-header-right">
            {showClearRecents && (
              <button type="button" className="search-recent-clear" onClick={clearRecents}>
                Clear recent
              </button>
            )}
            <span className="search-results-count">
              {entries.length} {entries.length === 1 ? 'match' : 'matches'}
            </span>
          </span>
        </div>

        {/* Results */}
        <div className="search-results-list" id="search-listbox" role="listbox" data-lenis-prevent>
          {entries.length > 0 ? (
            entries.map(({ item, group }, idx) => {
              const showGroup = group && group !== entries[idx - 1]?.group;
              return (
                <div key={item.id} role="presentation" className="search-result-row">
                  {showGroup && <div className="search-group-label">{group}</div>}
                  <button
                    id={`search-opt-${item.id}`}
                    type="button"
                    tabIndex={-1}
                    className={`search-result-item ${idx === selectedIndex ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(item)}
                    onMouseMove={() => idx !== selectedIndex && setSelectedIndex(idx)}
                    role="option"
                    aria-selected={idx === selectedIndex}
                  >
                    <div className="search-result-main">
                      <div className="search-result-title-row">
                        <span className="search-result-title">{highlightMatch(item.title, tokens)}</span>
                        <span className="search-result-category">{item.category}</span>
                      </div>
                      <span className="search-result-desc">{highlightMatch(item.desc, tokens)}</span>
                      {item.command && <code className="search-result-cmd">$ {item.command}</code>}
                    </div>

                    <span className="search-result-action">{actionLabel(item)}</span>
                    <svg
                      className="search-result-arrow"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="search-empty-state">
              <svg
                className="search-empty-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <path d="M8 11h6" />
              </svg>
              <span className="search-empty-title">
                No results for &ldquo;{query.trim()}&rdquo;
                {filter !== 'all' ? ` in ${CATEGORY_TITLE[filter]}` : ''}
              </span>
              <span className="search-empty-desc">
                {filter !== 'all'
                  ? 'Try the “All” filter, or search for '
                  : 'Try shorter words, or search for '}
                &ldquo;terminal&rdquo;, &ldquo;react&rdquo;, &ldquo;projects&rdquo; or &ldquo;contact&rdquo;.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="search-modal-footer">
          <div className="search-footer-shortcuts">
            <span className="search-footer-key">
              <kbd>↑</kbd>
              <kbd>↓</kbd> Navigate
            </span>
            <span className="search-footer-key">
              <kbd>↵</kbd> Select
            </span>
            <span className="search-footer-key">
              <kbd>Tab</kbd> Filters
            </span>
            <span className="search-footer-key">
              <kbd>ESC</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}