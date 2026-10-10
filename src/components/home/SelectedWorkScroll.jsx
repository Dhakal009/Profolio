import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLenis } from "../../contexts/LenisContext";

/**
 * ProjectSection / SelectedWorkScroll
 * Premium typographic & architectural design cards that rise through
 * the headline in staggered depth-scaled columns, then clear out to reveal
 * the subtitle and CTA button.
 */

const DEFAULT_PROJECTS = [
  {
    index: "01",
    title: "Aether",
    subtitle: "Kinetic E-Commerce",
    category: "Full Stack & 3D",
    year: "2025",
    tech: "Next.js · Three.js · Stripe",
    href: "/projects",
    stat: "Sub-second 3D",
    accent: "rgba(255, 140, 0, 0.15)",
  },
  {
    index: "02",
    title: "Lumina",
    subtitle: "Streaming Telemetry",
    category: "SaaS Analytics",
    year: "2025",
    tech: "React · Postgres · Framer",
    href: "/projects",
    stat: "120 FPS Live",
    accent: "rgba(99, 102, 241, 0.15)",
  },
  {
    index: "03",
    title: "Vortex",
    subtitle: "Immersive WebGL",
    category: "Creative Dev",
    year: "2024",
    tech: "GLSL · WebGL · Three.js",
    href: "/projects",
    stat: "Fluid Physics",
    accent: "rgba(168, 85, 247, 0.15)",
  },
  {
    index: "04",
    title: "Syntax",
    subtitle: "Browser Desktop OS",
    category: "Virtual WebOS",
    year: "2024",
    tech: "React · WebAssembly",
    href: "/projects",
    stat: "In-Memory FS",
    accent: "rgba(56, 189, 248, 0.15)",
  },
  {
    index: "05",
    title: "Hyperion",
    subtitle: "Autonomous Agent Canvas",
    category: "AI Architecture",
    year: "2025",
    tech: "Next.js · Vector DB · LLM",
    href: "/projects",
    stat: "8ms Latency",
    accent: "rgba(34, 197, 94, 0.15)",
  },
  {
    index: "06",
    title: "Nebula",
    subtitle: "Generative Shader Lab",
    category: "Creative Coding",
    year: "2025",
    tech: "Raymarching · WebGPU",
    href: "/projects",
    stat: "Real-time GLSL",
    accent: "rgba(236, 72, 153, 0.15)",
  },
  {
    index: "07",
    title: "Prism",
    subtitle: "Design Engineering System",
    category: "Token Engine",
    year: "2024",
    tech: "TypeScript · Radix · CSS",
    href: "/projects",
    stat: "Zero-Runtime",
    accent: "rgba(250, 204, 21, 0.15)",
  },
  {
    index: "08",
    title: "Chronos",
    subtitle: "Visual Event Timeline",
    category: "Event Streaming",
    year: "2024",
    tech: "Canvas · Web Workers",
    href: "/projects",
    stat: "1M Data Points",
    accent: "rgba(14, 165, 233, 0.15)",
  },
  {
    index: "09",
    title: "Zenith",
    subtitle: "Micro-Interaction Suite",
    category: "Design System",
    year: "2024",
    tech: "Spring Physics · SVG",
    href: "/projects",
    stat: "60+ Components",
    accent: "rgba(192, 132, 252, 0.15)",
  },
  {
    index: "10",
    title: "Horizon",
    subtitle: "High-Scale Edge Gateway",
    category: "Infrastructure",
    year: "2023",
    tech: "Node.js · Redis · Docker",
    href: "/projects",
    stat: "99.99% Uptime",
    accent: "rgba(244, 63, 94, 0.15)",
  },
];

// Mixed proportions give the columns a staggered rhythm.
const RATIOS = ["4 / 5", "1 / 1", "3 / 4", "5 / 6", "4 / 5", "7 / 8"];

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function useColumnCount() {
  const get = () => {
    if (typeof window === "undefined") return 4;
    const w = window.innerWidth;
    return w >= 1024 ? 4 : w >= 640 ? 3 : 2;
  };
  const [cols, setCols] = useState(get);
  useEffect(() => {
    const onResize = () => setCols(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return cols;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
  }, []);
  return reduced;
}

/* Individual Interactive 3D Card with Tilt & Sheen */
function ProjectCardTile({ project, ratio, onClick }) {
  const tileRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sx: 50, sy: 50, isHovered: false });

  const handleMouseMove = useCallback((e) => {
    if (!tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    // Subtle 3D tilt angles (max ±7 degrees)
    const rx = (py - 0.5) * -14;
    const ry = (px - 0.5) * 14;

    setTilt({
      rx,
      ry,
      sx: px * 100,
      sy: py * 100,
      isHovered: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt((prev) => ({ ...prev, rx: 0, ry: 0, isHovered: false }));
  }, []);

  const dynamicTransform = tilt.isHovered
    ? `perspective(800px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(1.045, 1.045, 1.045)`
    : "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";

  return (
    <a
      ref={tileRef}
      className="ps-tile"
      href={project.href || "/projects"}
      onClick={onClick}
      style={{
        aspectRatio: ratio,
        transform: dynamicTransform,
      }}
      aria-label={`${project.title} — ${project.subtitle || project.category}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(e);
        }
      }}
    >
      {/* Dynamic Cursor Spotlight Sheen */}
      <span
        className="ps-card-sheen"
        style={{
          opacity: tilt.isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, ${project.accent || 'rgba(255,255,255,0.12)'} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Card Minimal Grid Background & Texture */}
      <span className="ps-card-bg" aria-hidden="true" />
      <span className="ps-card-microgrid" aria-hidden="true" />

      {/* Card Content */}
      <div className="ps-card-inner">
        {/* Top Header: Index & Year Pill */}
        <div className="ps-card-top">
          <span className="ps-card-idx">{project.index || "01"}</span>
          <div className="ps-card-pill">
            <span className="ps-card-dot" aria-hidden="true" />
            <span>{project.year || "2025"}</span>
          </div>
        </div>

        {/* Center: Title & Subtitle */}
        <div className="ps-card-main">
          <span className="ps-card-category">{project.category}</span>
          <h3 className="ps-card-title">{project.title}</h3>
          <p className="ps-card-sub">{project.subtitle}</p>
        </div>

        {/* Bottom Footer: Metric/Stat & Arrow Action */}
        <div className="ps-card-bottom">
          <span className="ps-card-stat">{project.stat || project.tech}</span>
          <span className="ps-card-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H9M17 7v8" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

export default function ProjectSection({
  projects = DEFAULT_PROJECTS,
  headline = "Built for what comes next",
  subtitle = "A selection of recent work, from first sketch to shipped product.",
  ctaLabel = "View Works",
  ctaHref = "/projects",
  scrollLength = 440,
  id = "projects-preview",
}) {
  const navigate = useNavigate();
  const { lenis } = useLenis();
  const cols = useColumnCount();
  const reduced = usePrefersReducedMotion();

  const sectionRef = useRef(null);
  const colRefs = useRef([]);
  const groupRef = useRef(null);
  const revealRef = useRef(null);
  const hintRef = useRef(null);
  const glowRef = useRef(null);
  const railRef = useRef(null);

  // Deal projects into columns round-robin, repeating if there are too few.
  const columns = useMemo(() => {
    const need = cols * 2;
    const list = [];
    for (let i = 0; i < Math.max(need, projects.length); i++) {
      list.push(projects[i % projects.length]);
    }
    const out = Array.from({ length: cols }, () => []);
    list.forEach((p, i) => out[i % cols].push(p));
    return out;
  }, [projects, cols]);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    // Per-column parallax speed and start offset (fraction of viewport height).
    const speeds = [1.06, 1.22, 1.0, 1.3, 1.12];
    const starts = [0.0, 0.3, 0.12, 0.42, 0.2];

    let target = 0; // where the scroll position says we should be
    let current = 0; // eased value that is actually drawn
    let raf = 0;

    const measure = () => {
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const total = rect.height - vh;
      target = total > 0 ? clamp(-rect.top / total) : 0;
    };

    const draw = (p) => {
      const vh = window.innerHeight;
      const n = colRefs.current.length;
      const mid = (n - 1) / 2;
      const travel = clamp((p - 0.03) / 0.7);

      colRefs.current.forEach((el, i) => {
        if (!el) return;
        // Outer columns sit further back: smaller and dimmer.
        const dist = mid ? Math.abs(i - mid) / mid : 0;
        const scale = 1 - dist * 0.14;
        const h = el.offsetHeight;
        const startY = vh * (1.05 + starts[i % starts.length]);
        const endY = -h * scale - 60;
        const t = clamp(travel * speeds[i % speeds.length]);
        const y = startY + (endY - startY) * t;

        el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
        el.style.opacity = 1 - dist * 0.32;

        // Off-screen columns should not be reachable by keyboard.
        if ('inert' in el) {
          el.inert = !(y < vh && y + h * scale > 0);
        }
      });

      // Subtitle and button appear once the tiles have cleared.
      const reveal = clamp((p - 0.76) / 0.16);
      if (revealRef.current && groupRef.current) {
        const h = revealRef.current.offsetHeight;
        revealRef.current.style.opacity = reveal;
        revealRef.current.style.transform = `translate3d(0, ${(1 - reveal) * 14}px, 0)`;
        revealRef.current.style.pointerEvents = reveal > 0.5 ? "auto" : "none";
        if ('inert' in revealRef.current) {
          revealRef.current.inert = reveal < 0.5;
        }
        // Headline steps up to make room for what appears below it.
        groupRef.current.style.transform = `translate3d(0, ${-reveal * (h / 2)}px, 0)`;
        if (glowRef.current) glowRef.current.style.opacity = reveal;
      }

      if (hintRef.current) hintRef.current.style.opacity = 1 - clamp(p / 0.05);
      if (railRef.current) railRef.current.style.transform = `scaleY(${p})`;
    };

    // Ease toward the scroll position so motion feels weighted, not twitchy.
    const tick = () => {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.0004) current = target;
      draw(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measure();
      current = target;
      draw(current);
    };

    measure();
    current = target;
    draw(current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let unbindLenis = null;
    if (lenis) {
      lenis.on('scroll', onScroll);
      unbindLenis = () => lenis.off('scroll', onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (unbindLenis) unbindLenis();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, columns, lenis]);

  const handleTileClick = (e, project) => {
    e.preventDefault();
    if (project.href && project.href.startsWith("http")) {
      window.open(project.href, "_blank", "noopener,noreferrer");
    } else {
      navigate(project.href || "/projects");
    }
  };

  const handleCtaClick = (e) => {
    e.preventDefault();
    if (ctaHref && ctaHref.startsWith("http")) {
      window.open(ctaHref, "_blank", "noopener,noreferrer");
    } else {
      navigate(ctaHref || "/projects");
    }
  };

  const words = headline.split(" ");

  /* Reduced motion: no pinning, just a plain headline and a static grid. */
  if (reduced) {
    return (
      <section className="ps ps-static" id={id} aria-label="Selected Work">
        <style>{css}</style>
        <div className="ps-static-head">
          <h2 className="ps-headline">{headline}</h2>
          <p className="ps-sub">{subtitle}</p>
          <a className="ps-cta" href={ctaHref} onClick={handleCtaClick}>{ctaLabel}</a>
        </div>
        <div className="ps-static-grid">
          {projects.map((p, i) => (
            <ProjectCardTile
              key={i}
              project={p}
              ratio={RATIOS[i % RATIOS.length]}
              onClick={(e) => handleTileClick(e, p)}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="ps"
      id={id}
      style={{ height: `${scrollLength}vh` }}
      aria-label="Selected Work"
    >
      <style>{css}</style>
      <div className="ps-stage">
        <div ref={glowRef} className="ps-glow" aria-hidden="true" />

        <div className="ps-grid">
          {columns.map((col, ci) => (
            <div
              key={ci}
              className="ps-col"
              ref={(el) => (colRefs.current[ci] = el)}
            >
              {col.map((p, ti) => (
                <ProjectCardTile
                  key={`${ci}-${ti}`}
                  project={p}
                  ratio={RATIOS[(ci * 2 + ti) % RATIOS.length]}
                  onClick={(e) => handleTileClick(e, p)}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="ps-center">
          <div ref={groupRef} className="ps-group">
            <div className="ps-headline-blur" aria-hidden="true" />
            <h2 className="ps-headline" aria-label={headline}>
              {words.map((w, i) => (
                <span
                  key={i}
                  className="ps-word"
                  aria-hidden="true"
                  style={{ "--i": i }}
                >
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </h2>
            <div ref={revealRef} className="ps-reveal">
              <p className="ps-sub">{subtitle}</p>
              <a className="ps-cta" href={ctaHref} onClick={handleCtaClick}>{ctaLabel}</a>
            </div>
          </div>
        </div>

        <div ref={hintRef} className="ps-hint" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>

        <div className="ps-rail" aria-hidden="true">
          <b ref={railRef} />
        </div>
      </div>
    </section>
  );
}

const css = `
.ps {
  --ps-bg: #09090b;
  --ps-fg: #fafafa;
  --ps-muted: rgba(255,255,255,.62);
  --ps-tile: clamp(140px, 18vw, 220px);
  position: relative;
  background: var(--ps-bg);
  color: var(--ps-fg);
  font-family: var(--font-body, "Ubuntu", system-ui, -apple-system, sans-serif);
}
.ps *, .ps *::before, .ps *::after { box-sizing: border-box; }

[data-theme='light'] .ps {
  --ps-bg: #f4f4f6;
  --ps-fg: #09090b;
  --ps-muted: rgba(0, 0, 0, 0.65);
}

.ps-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

/* Ambient Radial Colour Pool */
.ps-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 90vmin;
  height: 90vmin;
  transform: translate(-50%, -50%);
  background: radial-gradient(closest-side, rgba(139, 92, 246, 0.22), rgba(244, 63, 94, 0.08) 55%, transparent 100%);
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  transition: opacity .4s ease;
}

[data-theme='light'] .ps-glow {
  background: radial-gradient(closest-side, rgba(200, 180, 240, 0.35), rgba(255, 210, 220, 0.15) 55%, transparent 100%);
}

/* Tile columns — Confined to a central stage near the headline */
.ps-grid {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(90vw, 1060px);
  max-width: 1060px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(16px, 2.8vw, 42px);
  z-index: 1;
}
.ps-col {
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 7vh, 64px);
  transform-origin: 50% 0;
  will-change: transform, opacity;
  transform: translate3d(0, 110vh, 0);
}

/* ==========================================================================
   Aesthetic & Clean Typographic Project Card
   ========================================================================== */
.ps-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  width: var(--ps-tile);
  overflow: hidden;
  border-radius: 16px;
  border: none;
  box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.75);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  background: #0e0e13;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  will-change: transform;
  transform-style: preserve-3d;
  transition: transform .22s cubic-bezier(.16,1,.3,1), box-shadow .35s ease;
  user-select: none;
}

[data-theme='light'] .ps-tile {
  background: #ffffff;
  border: none;
  box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.08);
}

.ps-tile:hover,
.ps-tile:focus-visible {
  border: none;
  box-shadow: 0 24px 50px -10px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.05);
}

[data-theme='light'] .ps-tile:hover,
[data-theme='light'] .ps-tile:focus-visible {
  border: none;
  box-shadow: 0 24px 50px -10px rgba(0, 0, 0, 0.16);
}

.ps-tile:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

/* Subtle Background Sheen that tracks cursor */
.ps-card-sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity .3s ease;
  z-index: 1;
}

.ps-card-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}

/* Micro Dot Pattern */
.ps-card-microgrid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 16px 16px;
  opacity: .5;
  pointer-events: none;
  z-index: 0;
}

[data-theme='light'] .ps-card-microgrid {
  background-image: radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px);
}

/* Inner Layout */
.ps-card-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: clamp(14px, 1.8vw, 20px);
  gap: 12px;
}

/* Top Row: Index + Year Pill */
.ps-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ps-card-idx {
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
  transition: color .25s ease;
}

[data-theme='light'] .ps-card-idx {
  color: rgba(0, 0, 0, 0.4);
}

.ps-tile:hover .ps-card-idx {
  color: #fff;
}

[data-theme='light'] .ps-tile:hover .ps-card-idx {
  color: #000;
}

.ps-card-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  font-family: var(--font-mono, monospace);
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.75);
}

[data-theme='light'] .ps-card-pill {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: rgba(0, 0, 0, 0.65);
}

.ps-card-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
  animation: psDotPulse 2s infinite ease-in-out;
}

@keyframes psDotPulse {
  0%, 100% { opacity: 0.5; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.15); box-shadow: 0 0 8px rgba(34, 197, 94, 0.9); }
}

/* Center: Category, Title, Subtitle */
.ps-card-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ps-card-category {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
  transition: color .25s ease;
}

[data-theme='light'] .ps-card-category {
  color: rgba(0, 0, 0, 0.45);
}

.ps-tile:hover .ps-card-category {
  color: #38bdf8;
}

.ps-card-title {
  margin: 0;
  font-family: var(--font-heading, inherit);
  font-size: clamp(1.15rem, 1.6vw, 1.45rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #ffffff;
  transition: transform .25s var(--spring, ease);
}

[data-theme='light'] .ps-card-title {
  color: #09090b;
}

.ps-tile:hover .ps-card-title {
  transform: translateY(-2px);
}

.ps-card-sub {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.6);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

[data-theme='light'] .ps-card-sub {
  color: rgba(0, 0, 0, 0.6);
}

/* Bottom: Metric Stat & Arrow Glyph */
.ps-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: none;
}

[data-theme='light'] .ps-card-bottom {
  border-top: none;
}

.ps-card-stat {
  font-family: var(--font-mono, monospace);
  font-size: 0.66rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-theme='light'] .ps-card-stat {
  color: rgba(0, 0, 0, 0.5);
}

.ps-card-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  transition: transform .3s var(--spring, ease), background-color .25s ease;
}

[data-theme='light'] .ps-card-arrow {
  background: rgba(0, 0, 0, 0.06);
  color: #09090b;
}

.ps-card-arrow svg {
  width: 12px;
  height: 12px;
}

.ps-tile:hover .ps-card-arrow {
  transform: translate(2px, -2px) scale(1.1);
  background: #ffffff;
  color: #09090b;
}

[data-theme='light'] .ps-tile:hover .ps-card-arrow {
  background: #09090b;
  color: #ffffff;
}

/* Dim non-hovered cards on hover */
@media (hover: hover) {
  .ps-grid:has(.ps-tile:hover) .ps-tile:not(:hover) {
    opacity: .35 !important;
    filter: blur(0.4px);
    transition: opacity .35s ease, filter .35s ease;
  }
}

/* Headline Group */
.ps-center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 0 24px;
  z-index: 2;
  pointer-events: none;
}
.ps-group {
  position: relative;
  width: min(100%, 1000px);
  text-align: center;
  will-change: transform;
}

/* Soft feathered backdrop blur behind text without any box or border */
.ps-headline-blur {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(92vw, 860px);
  height: 420px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  mask-image: radial-gradient(ellipse 70% 55% at 50% 50%, #000 25%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 55% at 50% 50%, #000 25%, transparent 100%);
  pointer-events: none;
  z-index: -1;
}

.ps-headline {
  margin: 0 auto;
  max-width: 15ch;
  font-family: var(--font-heading, inherit);
  font-weight: 700;
  font-size: clamp(38px, 6vw, 84px);
  line-height: 1.08;
  letter-spacing: -0.03em;
  text-wrap: balance;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.95), 0 2px 10px rgba(0, 0, 0, 0.85);
  color: var(--ps-fg);
}

[data-theme='light'] .ps-headline {
  text-shadow: 0 4px 40px rgba(255,255,255,.8);
}

.ps-word {
  display: inline-block;
  white-space: pre;
  animation: ps-word .9s cubic-bezier(.2,.7,.2,1) both;
  animation-delay: calc(var(--i) * 80ms + 100ms);
}
@keyframes ps-word {
  from { opacity: 0; transform: translateY(.35em); filter: blur(8px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}

.ps-reveal {
  opacity: 0;
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: calc(min(86vw, 36ch) / -2);
  width: min(86vw, 36ch);
  padding-top: 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}
.ps-sub {
  margin: 0;
  font-weight: 400;
  font-size: clamp(14px, 1.25vw, 17px);
  line-height: 1.55;
  color: var(--ps-muted);
}
.ps-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 30px;
  border: 1px solid rgba(255,255,255,.28);
  border-radius: 999px;
  color: var(--ps-fg);
  font-family: var(--font-heading, inherit);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  background: linear-gradient(#fff, #fff) no-repeat 50% 100% / 100% 0;
  box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.4);
  transition: background-size .35s cubic-bezier(.2,.7,.2,1), color .25s ease, border-color .25s ease, transform .25s ease;
}
.ps-cta:hover,
.ps-cta:focus-visible {
  background-size: 100% 100%;
  color: #0a0a0a;
  border-color: #fff;
  transform: translateY(-2px);
}
.ps-cta:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

[data-theme='light'] .ps-cta {
  border-color: rgba(0, 0, 0, 0.25);
  background: linear-gradient(#000, #000) no-repeat 50% 100% / 100% 0;
}
[data-theme='light'] .ps-cta:hover {
  color: #ffffff;
  border-color: #000;
}

/* Scroll Hint */
.ps-hint {
  position: absolute;
  left: 50%;
  bottom: 6vh;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  font-size: 11px;
  letter-spacing: .24em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--ps-muted);
  pointer-events: none;
  transition: opacity .3s ease;
}
.ps-hint i {
  display: block;
  width: 1px;
  height: 38px;
  background: rgba(255,255,255,.5);
  transform-origin: top;
  animation: ps-line 2s cubic-bezier(.6,0,.3,1) infinite;
}

[data-theme='light'] .ps-hint i {
  background: rgba(0, 0, 0, 0.4);
}

@keyframes ps-line {
  0%   { transform: scaleY(0); transform-origin: top; }
  50%  { transform: scaleY(1); transform-origin: top; }
  51%  { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

/* Progress rail */
.ps-rail {
  position: absolute;
  right: clamp(14px, 2.4vw, 34px);
  top: 50%;
  width: 1px;
  height: 110px;
  margin-top: -55px;
  background: rgba(255,255,255,.14);
  z-index: 2;
}
.ps-rail b {
  display: block;
  width: 100%;
  height: 100%;
  background: #fff;
  transform-origin: top;
  transform: scaleY(0);
}

[data-theme='light'] .ps-rail {
  background: rgba(0, 0, 0, 0.1);
}
[data-theme='light'] .ps-rail b {
  background: #000;
}

@media (max-width: 639px) {
  .ps { --ps-tile: 42vw; }
  .ps-rail { display: none; }
  .ps-headline { font-size: 36px; }
  .ps-card-inner { padding: 12px; gap: 8px; }
  .ps-card-title { font-size: 1.05rem; }
  .ps-card-sub { font-size: 0.7rem; }
}

/* Reduced-motion fallback */
.ps-static { padding: 14vh 24px 12vh; }
.ps-static-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  text-align: center;
  margin-bottom: 10vh;
}
.ps-static-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 22px;
  max-width: 1100px;
  margin: 0 auto;
}
.ps-static .ps-tile { width: 100%; }
.ps-static .ps-sub { max-width: 34ch; }

@media (prefers-reduced-motion: reduce) {
  .ps-word, .ps-hint i { animation: none; }
}
`;
