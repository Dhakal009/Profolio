import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLenis } from '../../contexts/LenisContext';

const SEARCH_DATABASE = [
  // Pages & Sections
  {
    id: 'page-home',
    category: 'page',
    title: 'Home Page',
    desc: 'Main portfolio homepage, hero, full stack developer profile.',
    route: '/',
    keywords: ['home', 'hero', 'start', 'bikash', 'dhakal'],
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
    keywords: ['experience', 'work', 'freelance', 'clients', 'history', 'architecture', 'jobs'],
  },
  {
    id: 'sec-projects-prev',
    category: 'section',
    title: 'Selected Work Preview',
    desc: 'Featured portfolio projects: Aether E-Commerce, Lumina Dashboard, Vortex Portfolio.',
    target: 'projects-preview',
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

  // Skills & Tools
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

  // Linux Terminal Commands
  {
    id: 'term-neofetch',
    category: 'terminal',
    title: 'neofetch (Linux Terminal)',
    desc: 'Displays system specifications, OS edition, tech stack, and ASCII logo inside the About terminal.',
    target: 'about',
    keywords: ['neofetch', 'fastfetch', 'terminal', 'ascii', 'specs', 'specs', 'system'],
  },
  {
    id: 'term-bio',
    category: 'terminal',
    title: 'cat bio.txt (Linux Terminal)',
    desc: 'Reads Bikash’s developer bio and engineering philosophy inside the terminal.',
    target: 'about',
    keywords: ['bio', 'terminal', 'cat', 'txt', 'story', 'philosophy'],
  },
  {
    id: 'term-skills',
    category: 'terminal',
    title: 'cat skills.txt (Linux Terminal)',
    desc: 'Lists technical proficiencies categorized by frontend, backend, devops, and animation.',
    target: 'about',
    keywords: ['skills', 'terminal', 'cat', 'tech', 'list'],
  },
  {
    id: 'term-nav',
    category: 'terminal',
    title: 'cd projects (Terminal Navigation)',
    desc: 'Command line shortcut to navigate directly to the Projects page.',
    target: 'about',
    keywords: ['cd', 'projects', 'navigate', 'goto', 'terminal'],
  },

  // Contact & Socials
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
    href: 'https://twitter.com',
    keywords: ['twitter', 'x', 'social', 'tweet'],
  },
];

function highlightMatch(text, query) {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="search-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { lenis } = useLenis();

  // Focus input immediately on open and prevent background scrolling
  useEffect(() => {
    if (!isOpen) return;

    setQuery('');
    setSelectedIndex(0);

    if (lenis) lenis.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    focusInput();
    const frameId = requestAnimationFrame(focusInput);
    const timer = setTimeout(focusInput, 40);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      if (lenis) lenis.start();
    };
  }, [isOpen, lenis]);

  // Filter items based on query
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    // If query is empty, show top suggested quick destinations
    if (!q) {
      return SEARCH_DATABASE.slice(0, 7);
    }

    return SEARCH_DATABASE.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.desc.toLowerCase().includes(q);
      const keywordMatch = item.keywords.some((k) => k.toLowerCase().includes(q));

      return titleMatch || descMatch || keywordMatch;
    });
  }, [query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Ensure active keyboard item stays visible in scroll container
  useEffect(() => {
    if (resultsRef.current && resultsRef.current.children[selectedIndex]) {
      resultsRef.current.children[selectedIndex].scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // Scroll to section helper
  const scrollToTarget = useCallback(
    (targetId) => {
      const el = document.getElementById(targetId);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, { offset: -40, duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [lenis]
  );

  // Navigate on selection
  const handleSelect = useCallback(
    (item) => {
      onClose();

      if (item.href) {
        if (item.href.startsWith('mailto:')) {
          window.location.href = item.href;
        } else {
          window.open(item.href, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      if (item.route) {
        navigate(item.route);
        return;
      }

      if (item.target) {
        if (location.pathname === '/') {
          scrollToTarget(item.target);
        } else {
          navigate(`/#${item.target}`);
        }
      }
    },
    [location.pathname, navigate, onClose, scrollToTarget]
  );

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="search-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Website search"
    >
      <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
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
            placeholder="Type to search projects, skills, terminal, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
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
            <button
              type="button"
              className="search-esc-btn"
              onClick={onClose}
              aria-label="Close search"
            >
              ESC
            </button>
          )}
        </div>

        {/* Section Header */}
        <div className="search-section-header">
          <span>{query ? 'Results' : 'Quick Links'}</span>
          <span className="search-results-count">
            {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}
          </span>
        </div>

        {/* Search Results List */}
        <div className="search-results-list" ref={resultsRef} role="listbox">
          {filteredResults.length > 0 ? (
            filteredResults.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`search-result-item ${idx === selectedIndex ? 'is-selected' : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                role="option"
                aria-selected={idx === selectedIndex}
              >
                <div className="search-result-main">
                  <div className="search-result-title-row">
                    <span className="search-result-title">
                      {highlightMatch(item.title, query)}
                    </span>
                    <span className="search-result-category">{item.category}</span>
                  </div>
                  <span className="search-result-desc">
                    {highlightMatch(item.desc, query)}
                  </span>
                </div>

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
            ))
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
              <span className="search-empty-title">No matching results found</span>
              <span className="search-empty-desc">
                Try searching for keywords like &ldquo;Terminal&rdquo;, &ldquo;React&rdquo;, &ldquo;Projects&rdquo;, or &ldquo;Contact&rdquo;.
              </span>
            </div>
          )}
        </div>

        {/* Minimal Footer with Shortcut Hints */}
        <div className="search-modal-footer">
          <div className="search-footer-shortcuts">
            <span className="search-footer-key">
              <kbd>↑</kbd><kbd>↓</kbd> Navigate
            </span>
            <span className="search-footer-key">
              <kbd>↵</kbd> Select
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
