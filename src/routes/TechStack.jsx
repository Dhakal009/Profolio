import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import './tech-stack.css';

const EASE = [0.16, 1, 0.3, 1];

// [name, badge, description, where it is used, official url]
const GROUPS = [
  {
    title: 'Core',
    items: [
      ['React 19', 'Re', 'Component-based UI library powering every part of the site.', ['Sections', 'Dock', 'Search', 'Folder'], 'https://react.dev/'],
      ['Vite', 'Vi', 'Dev server and production bundler: instant hot reload, code-splitting and optimised builds.', ['Dev server', 'Build', 'Chunks'], 'https://vite.dev/'],
      ['React Router', 'Rr', 'Client-side routing with lazy-loaded pages.', ['Home', 'Projects', 'Resume', 'Demos'], 'https://reactrouter.com/'],
      ['JavaScript (ES2023)', 'JS', 'Modern JavaScript modules across the whole codebase.', ['ES modules'], 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'],
    ],
  },
  {
    title: 'Styling',
    items: [
      ['Tailwind CSS', 'Tw', 'Utility classes for layout and spacing, alongside a hand-written token stylesheet.', ['Layout', 'Spacing'], 'https://tailwindcss.com/'],
      ['CSS design tokens', 'Cs', 'CSS variables drive the dark/light themes, colours, easing and spacing.', ['Themes', 'Colours', 'Easing'], 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties'],
      ['styled-components', 'Sc', 'Scoped styles for the 3D project gallery and its overlay.', ['Gallery', 'Overlay'], 'https://styled-components.com/'],
      ['PostCSS + Autoprefixer', 'Pc', 'Processes Tailwind and adds vendor prefixes for browser compatibility.', ['Build step'], 'https://postcss.org/'],
      ['Fontsource Inter', 'Aa', 'Self-hosted Inter font weights, with Google Fonts for the rest.', ['Headings', 'Body'], 'https://fontsource.org/fonts/inter'],
    ],
  },
  {
    title: 'Animation & Scroll',
    items: [
      ['Framer Motion', 'Fm', 'Page transitions, scroll-linked parallax sections and reveal effects.', ['Page transitions', 'Parallax', 'This page'], 'https://motion.dev/'],
      ['GSAP + ScrollTrigger', 'Gs', 'Timeline animation and scroll-driven effects.', ['About section', 'Gallery rewind'], 'https://gsap.com/'],
      ['Lenis', 'Ln', 'Smooth, inertia-based scrolling shared by the whole site.', ['Page scroll', 'Anchor jumps'], 'https://lenis.darkroom.engineering/'],
      ['View Transitions API', 'Vt', 'The circular reveal when switching between dark and light theme.', ['Theme toggle'], 'https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API'],
    ],
  },
  {
    title: '3D & WebGL',
    items: [
      ['Three.js', '3D', 'The WebGL engine behind the 3D project tunnel.', ['Project tunnel'], 'https://threejs.org/'],
      ['React Three Fiber', 'Fb', 'React renderer for Three.js: tunnel, tiles and camera rig are declarative components.', ['Tunnel', 'Tiles', 'Camera rig'], 'https://r3f.docs.pmnd.rs/'],
      ['Drei', 'Dr', 'Helpers for Three.js such as asset preloading.', ['Preload'], 'https://drei.docs.pmnd.rs/'],
      ['OGL', 'Og', 'Lightweight WebGL library for small visual effects.', ['Effects'], 'https://github.com/oframe/ogl'],
      ['WebGL2 shaders (GLSL)', 'Gl', 'Custom glass, blur and lighting shaders.', ['Folder component'], 'https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext'],
    ],
  },
  {
    title: 'Performance & Delivery',
    items: [
      ['Code splitting', 'Cx', 'Routes and the 3D gallery load on demand; heavy libraries sit in separate chunks.', ['Routes', 'three.js chunk'], 'https://vite.dev/guide/features.html#async-chunk-loading-optimization'],
      ['Service worker', 'Sw', 'Caches the site for fast repeat visits and flaky or offline connections.', ['Offline', 'Repeat visits'], 'https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API'],
      ['Adaptive performance', 'Ap', 'Reduces effects on slow networks, data-saver mode and low-end devices.', ['Data saver', 'Low-end devices'], 'https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API'],
    ],
  },
  {
    title: 'Tooling & Testing',
    items: [
      ['Vitest', 'Vt', 'Fast unit test runner that shares Vite\u2019s configuration.', ['Unit tests'], 'https://vitest.dev/'],
      ['Testing Library', 'Tl', 'Component tests that exercise the UI the way users do.', ['Header', 'Footer', 'Projects'], 'https://testing-library.com/'],
      ['jsdom', 'Jd', 'Browser-like environment for running tests in Node.', ['Test env'], 'https://github.com/jsdom/jsdom'],
      ['Oxlint', 'Ox', 'Very fast linter that keeps the code clean.', ['npm run lint'], 'https://oxc.rs/docs/guide/usage/linter'],
    ],
  },
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const total = GROUPS.reduce((n, g) => n + g.items.length, 0);

function buildAgentSpec() {
  const sections = GROUPS.map((group, idx) => {
    const lines = group.items.map(
      ([name, , desc, tags]) => `- **${name}**: ${desc} *(Used in: ${tags.join(', ')})*`
    );
    return `## ${String(idx + 1).padStart(2, '0')}. ${group.title}\n\n${lines.join('\n')}`;
  }).join('\n\n');

  return `# Portfolio Website — Tech Stack & Architecture Guide for AI Agents

Use this specification to scaffold and build a similar interactive developer portfolio website.

## Project Summary
- **Stack**: React 19 + Vite (ES2023 modules) + React Router v6
- **Styling**: Tailwind CSS + custom CSS design tokens (\`data-theme="dark" | "light"\`) + styled-components
- **Motion**: Framer Motion + GSAP ScrollTrigger + Lenis smooth scroll + View Transitions API
- **3D / WebGL**: Three.js + React Three Fiber + Drei + OGL + custom WebGL2 GLSL shaders
- **Delivery**: Route/chunk code-splitting, offline-first Service Worker, adaptive performance profile

${sections}

## Key Implementation Patterns
1. **Theme Switching**: Toggle \`data-theme\` synchronously inside \`document.startViewTransition()\` and animate \`::view-transition-new(root)\` with an expanding \`clip-path: circle(...)\` from the toggle button.
2. **Smooth Scroll Sync**: Provide a single \`Lenis\` instance via context and call \`ScrollTrigger.update()\` on Lenis scroll events.
3. **3D Project Tunnel**: Render with \`@react-three/fiber\` \`<Canvas>\` and pause \`frameloop\` via \`IntersectionObserver\` when off-screen.
4. **Adaptive Performance**: Inspect \`navigator.connection\` (\`saveData\`, \`effectiveType\`) and \`deviceMemory\` to toggle a \`perf-lite\` class and skip heavy 3D on low-end/2G connections.
5. **SPA Routing**: Configure \`vercel.json\` / \`_redirects\` to rewrite all routes to \`/index.html\`.

## Suggested \`package.json\` Dependencies
\`\`\`json
{
  "dependencies": {
    "@fontsource/inter": "^5.3.0",
    "@gsap/react": "^2.1.2",
    "@react-three/drei": "^10.7.9",
    "@react-three/fiber": "^9.8.1",
    "@studio-freight/lenis": "^1.0.42",
    "framer-motion": "^14.3.0",
    "gsap": "^3.15.0",
    "lenis": "^1.3.27",
    "ogl": "^1.0.11",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^6.26.2",
    "styled-components": "^6.5.3",
    "three": "^0.186.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^7.0.1",
    "@testing-library/react": "^16.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "autoprefixer": "^10.4.0",
    "jsdom": "^30.1.2",
    "oxlint": "^1.81.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^8.3.4",
    "vitest": "^5.0.3"
  }
}
\`\`\`
`;
}

function Leaf({ item, index, reduce }) {
  const [name, badge, description, tags, url] = item;
  // Spotlight and subtle 3D tilt follow the cursor via CSS variables (no re-render).
  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((x / r.width) - 0.5) * 7;
    const ry = ((y / r.height) - 0.5) * -7;
    e.currentTarget.style.setProperty('--mx', `${x}px`);
    e.currentTarget.style.setProperty('--my', `${y}px`);
    e.currentTarget.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };
  return (
    <motion.li
      className="ts-leaf-wrap"
      initial={reduce ? false : { opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.06 }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="ts-leaf"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        aria-label={`${name} — open official website`}
      >
        <div className="ts-leaf-top">
          <span className="ts-badge" aria-hidden="true">{badge}</span>
          <h3 className="ts-name">{name}</h3>
          <svg className="ts-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M17 7H9M17 7v8" />
          </svg>
        </div>
        <p className="ts-desc">{description}</p>
        <ul className="ts-tags" aria-label={`${name} is used in`}>
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </a>
    </motion.li>
  );
}

function Branch({ group, index, reduce }) {
  return (
    <motion.section
      id={slug(group.title)}
      data-group
      className="ts-branch"
      aria-labelledby={`h-${slug(group.title)}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: EASE }}
      onViewportEnter={(entry) => entry?.target?.classList.add('is-in')}
    >
      <div className="ts-node">
        <span className="ts-node-num">{String(index + 1).padStart(2, '0')}</span>
        <h2 className="ts-node-title" id={`h-${slug(group.title)}`}>{group.title}</h2>
        <span className="ts-node-count">{group.items.length}</span>
      </div>
      <ul className="ts-leaves">
        {group.items.map((item, i) => (
          <Leaf key={item[0]} item={item} index={i} reduce={reduce} />
        ))}
      </ul>
    </motion.section>
  );
}

export default function TechStack() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(slug(GROUPS[0].title));
  const [railOpen, setRailOpen] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  const downloadSpec = () => {
    const blob = new Blob([buildAgentSpec()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-tech-stack-ai-guide.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2200);
  };

  // Highlight the category currently in view in the index rail.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = document.querySelectorAll('[data-group]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-25% 0px -60% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (title) => {
    document.getElementById(slug(title))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="ts-page">
      <div className="ts-glow" aria-hidden="true" />

      <div className="ts-shell">
        <motion.header
          className="ts-topbar"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="ts-crumb">
            <Link to="/">Home</Link> / <b>Tech Stack</b>
            <span className="ts-crumb-meta"> · {GROUPS.length} layers · {total} technologies</span>
          </div>

          <button
            type="button"
            className={`ts-download${downloaded ? ' is-done' : ''}`}
            onClick={downloadSpec}
            title="Download tech stack guide for an AI agent"
          >
            {downloaded ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            <span>{downloaded ? 'Downloaded AI Guide' : 'AI Agent Guide (.md)'}</span>
          </button>
        </motion.header>

        <div className={`ts-layout${railOpen ? '' : ' is-collapsed'}`}>
          <nav className="ts-rail" aria-label="Stack layers">
            <div className="ts-rail-head">
              <button
                type="button"
                className={`ts-rail-toggle${railOpen ? ' is-open' : ''}`}
                onClick={() => setRailOpen((v) => !v)}
                aria-expanded={railOpen}
                aria-label={railOpen ? 'Hide layers panel' : 'Unhide layers panel'}
                title={railOpen ? 'Hide layers' : 'Unhide layers'}
              >
                <span className="ts-burger" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
              <div className="ts-rail-title">Layers</div>
            </div>
            <ol>
              {GROUPS.map((g, i) => (
                <li key={g.title} className={active === slug(g.title) ? 'is-active' : ''}>
                  <button type="button" className="ts-rail-link" onClick={() => jump(g.title)}>
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    {g.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div>
            <motion.div
              className="ts-root"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            >
              <span className="ts-root-badge" aria-hidden="true">B.</span>
              <div>
                <div className="ts-root-name">Portfolio Website</div>
                <div className="ts-root-sub">{GROUPS.length} layers · {total} technologies</div>
              </div>
            </motion.div>

            <div className="ts-trunk">
              {GROUPS.map((group, i) => (
                <Branch key={group.title} group={group} index={i} reduce={reduce} />
              ))}
            </div>

            <div className="ts-cta">
              <Link to="/" className="ts-btn">Back to home</Link>
              <Link to="/projects" className="ts-btn">See projects</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
