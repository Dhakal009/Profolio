import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLenis } from "../../contexts/LenisContext";

/**
 * ProjectSection / SelectedWorkScroll
 *
 * Tile-reveal choreography, fully scrubbed by scroll (plays forwards AND backwards):
 *
 *   1. Rise      The outer columns drift DOWN from above the viewport while the
 *                centre column drifts UP from below. They converge on the
 *                headline and overlap it as a staggered 3-column grid.
 *   2. Zoom      The whole grid flies toward the camera: tiles scale up and the
 *                columns spread apart horizontally.
 *   3. Clear     Tiles nearest the headline dissolve first, then the outer ones,
 *                so the middle "steps aside".
 *   4. Reveal    Headline lifts, subtitle + CTA fade in. A short hold follows
 *                before the section unpins.
 *
 * Why upward scrolling used to stall: a "played" latch froze the finished frame
 * for the whole pinned distance when scrolling back up. That latch is gone, the
 * animation is a pure function of scroll position, so up and down are symmetric.
 *
 * Smoothness: the drawn value chases the scroll position with frame-rate
 * independent damping (not a fixed per-frame lerp), DOM geometry is measured
 * once (not every frame), and only transform/opacity are written per frame.
 */

import { PROJECTS } from "../../data/projects";

const DEFAULT_PROJECTS = PROJECTS.map((p) => ({
  ...p,
  tech: p.techString || (Array.isArray(p.tech) ? p.tech.join(" · ") : p.tech),
  href: p.link || p.href || "/projects",
}));

/* ---------- Choreography tuning (all values are fractions of scroll 0–1) ---------- */
const COLS = 3; // keep odd: the middle column travels the opposite way
const ROWS = 3; // tiles per column strip

const TRAVEL_END = 0.78; // columns finish travelling here
const CENTER_SPEED = 1.12; // centre column moves a touch faster, so rows drift past each other

const ZOOM_START = 0.3; // camera starts flying in
const ZOOM_END = 0.8;
const ZOOM_MAX = 2.5; // final tile scale
const X_SPREAD = 0.45; // extra horizontal spread at full zoom (columns fly apart faster than tiles grow)

const FADE_START = 0.5; // tiles begin to dissolve (nearest the headline first)
const FADE_LEN = 0.28;

const REVEAL_START = 0.72; // subtitle + CTA
const REVEAL_LEN = 0.2; // finishes at 0.92, the rest is a short hold

const GAP_X = 0.14; // gaps between tiles, as a fraction of tile size
const GAP_Y = 0.32;

const DAMP = 13; // higher = snappier follow, lower = floatier

// Mixed ratios are only used by the reduced-motion static grid.
const RATIOS = ["4 / 5", "1 / 1", "3 / 4", "5 / 6", "4 / 5", "7 / 8"];

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smooth = (t) => t * t * (3 - 2 * t);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

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

/* Individual interactive card with tilt & sheen.
   Pointer effects write straight to the DOM (rAF-throttled) so hovering never
   triggers React re-renders while the section is animating. */
function ProjectCardTile({ project, ratio, onClick }) {
  const tileRef = useRef(null);
  const sheenRef = useRef(null);
  const rafRef = useRef(0);
  const ptrRef = useRef({ px: 0.5, py: 0.5 });

  const paint = useCallback(() => {
    rafRef.current = 0;
    const tile = tileRef.current;
    const sheen = sheenRef.current;
    if (!tile || !sheen) return;
    const { px, py } = ptrRef.current;
    // Subtle 3D tilt (max ±7deg)
    const rx = (py - 0.5) * -14;
    const ry = (px - 0.5) * 14;
    tile.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.045, 1.045, 1.045)`;
    sheen.style.setProperty("--sx", `${(px * 100).toFixed(1)}%`);
    sheen.style.setProperty("--sy", `${(py * 100).toFixed(1)}%`);
    sheen.style.opacity = "1";
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      const tile = tileRef.current;
      if (!tile) return;
      const rect = tile.getBoundingClientRect();
      ptrRef.current = {
        px: clamp((e.clientX - rect.left) / rect.width),
        py: clamp((e.clientY - rect.top) / rect.height),
      };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(paint);
    },
    [paint]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    if (tileRef.current) tileRef.current.style.transform = "";
    if (sheenRef.current) sheenRef.current.style.opacity = "0";
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return (
    <a
      ref={tileRef}
      className="ps-tile"
      href={project.href || "/projects"}
      onClick={onClick}
      style={ratio ? { aspectRatio: ratio } : undefined}
      aria-label={`${project.title} — ${project.subtitle || project.category}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(e);
        }
      }}
    >
      {/* Cursor spotlight sheen */}
      <span
        ref={sheenRef}
        className="ps-card-sheen"
        style={{ "--accent": project.accent || "rgba(255,255,255,0.12)" }}
        aria-hidden="true"
      />

      <span className="ps-card-bg" aria-hidden="true" />
      <span className="ps-card-microgrid" aria-hidden="true" />

      <div className="ps-card-inner">
        <div className="ps-card-top">
          <span className="ps-card-idx">{project.index || "01"}</span>
          <div className="ps-card-pill">
            <span className="ps-card-dot" aria-hidden="true" />
            <span>{project.year || "2025"}</span>
          </div>
        </div>

        <div className="ps-card-main">
          <span className="ps-card-category">{project.category}</span>
          <h3 className="ps-card-title">{project.title}</h3>
          <p className="ps-card-sub">{project.subtitle}</p>
        </div>

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
  // Section height in vh. The pinned scroll distance is (scrollLength - 100)vh.
  // Lower = less scrolling, higher = slower and more cinematic.
  scrollLength = 220,
  id = "projects-preview",
}) {
  const navigate = useNavigate();
  const { lenis } = useLenis();
  const reduced = usePrefersReducedMotion();

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cellRefs = useRef([]);
  const groupRef = useRef(null);
  const revealRef = useRef(null);
  const hintRef = useRef(null);
  const glowRef = useRef(null);
  const railRef = useRef(null);

  // One tile per (column, row). Index = column * ROWS + row.
  const cells = useMemo(() => {
    const out = [];
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        const idx =
          projects.length <= COLS
            ? (r + c) % projects.length
            : (r * COLS + c) % projects.length;
        out.push({ c, r, project: projects[idx] });
      }
    }
    return out;
  }, [projects]);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    cellRefs.current.length = cells.length; // drop refs left over from a previous layout
    const cellEls = cellRefs.current;
    const mid = (COLS - 1) / 2;

    // Geometry is measured once (and on resize), never inside the frame loop.
    const g = { vw: 0, vh: 0, tw: 0, th: 0, pitchX: 0, pitchY: 0, revealH: 0 };
    const shown = new Array(cellEls.length).fill(null);

    let current = 0; // value actually drawn
    let target = 0; // where scroll says we should be
    let lastDrawn = -1;
    let raf = 0;
    let last = 0;
    let moving = false;
    let revealInert = null;
    let disposed = false;

    const measureGeo = () => {
      const first = cellEls[0];
      g.vw = stage.clientWidth;
      g.vh = stage.clientHeight;
      if (first) {
        g.tw = first.offsetWidth;
        g.th = first.offsetHeight;
      }
      g.pitchX = g.tw * (1 + GAP_X);
      g.pitchY = g.th * (1 + GAP_Y);
      g.revealH = revealRef.current ? revealRef.current.offsetHeight : 0;
    };

    // Returns true when the section is fully off-screen.
    const read = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - g.vh;
      target = total > 0 ? clamp(-rect.top / total) : 0;
      return rect.bottom <= 0 || rect.top >= g.vh;
    };

    const draw = (p) => {
      const { vw, vh, tw, th, pitchX, pitchY } = g;
      const halfW = vw / 2;
      const halfH = vh / 2;

      const a = clamp(p / TRAVEL_END); // column travel
      const zp = clamp((p - ZOOM_START) / (ZOOM_END - ZOOM_START));
      const zz = zp * zp; // accelerating "flying in" feel
      const z = 1 + (ZOOM_MAX - 1) * zz;
      const spreadX = 1 + X_SPREAD * zz;
      const f = clamp((p - FADE_START) / FADE_LEN);

      // Distance a strip travels so it starts fully above / below the viewport.
      const E = halfH + ((ROWS - 1) / 2) * pitchY + th / 2 + 40;

      for (let i = 0; i < cellEls.length; i++) {
        const el = cellEls[i];
        if (!el) continue;
        const { c, r } = cells[i];
        const isCenter = c === mid;

        // Outer columns travel down, the centre column travels up.
        const dir = isCenter ? -1 : 1;
        const k = isCenter ? CENTER_SPEED : 1;
        const strip = dir * (-E + 2 * E * a * k);
        const rowOffset = (r - (ROWS - 1) / 2) * pitchY + (isCenter ? pitchY * 0.5 : 0);

        const sx = (c - mid) * pitchX * z * spreadX;
        const sy = (strip + rowOffset) * z;

        // Tiles near the headline dissolve first, outer ones fly out and follow.
        const dn = Math.min(1, Math.hypot(sx / halfW, sy / halfH));
        const t = clamp(f * 1.6 - dn * 0.6);
        const op = 1 - smooth(t);

        const onScreen =
          Math.abs(sx) - (tw * z) / 2 < halfW && Math.abs(sy) - (th * z) / 2 < halfH;
        const visible = op > 0.02 && onScreen;

        if (shown[i] !== visible) {
          shown[i] = visible;
          el.style.visibility = visible ? "visible" : "hidden";
        }
        if (visible) {
          el.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0) scale(${z.toFixed(4)}) translate(-50%, -50%)`;
          el.style.opacity = op.toFixed(3);
        }
      }

      // Subtitle + CTA appear once the tiles have cleared.
      const reveal = easeOut(clamp((p - REVEAL_START) / REVEAL_LEN));
      const revealEl = revealRef.current;
      if (revealEl && groupRef.current) {
        revealEl.style.opacity = reveal;
        revealEl.style.transform = `translate3d(0, ${((1 - reveal) * 14).toFixed(2)}px, 0)`;
        revealEl.style.pointerEvents = reveal > 0.5 ? "auto" : "none";
        const shouldInert = reveal < 0.5;
        if (revealInert !== shouldInert && "inert" in revealEl) {
          revealInert = shouldInert;
          revealEl.inert = shouldInert;
        }
        // Headline steps up to make room for what appears below it.
        groupRef.current.style.transform = `translate3d(0, ${(-reveal * (g.revealH / 2)).toFixed(2)}px, 0)`;
        if (glowRef.current) glowRef.current.style.opacity = reveal;
      }

      if (hintRef.current) hintRef.current.style.opacity = 1 - clamp(p / 0.05);
      if (railRef.current) railRef.current.style.transform = `scaleY(${p})`;
    };

    const setMoving = (m) => {
      if (moving === m) return;
      moving = m;
      stage.dataset.moving = m ? "true" : "false";
    };

    // Frame-rate independent easing toward the scroll position.
    const tick = (now) => {
      const dt = Math.min(Math.max((now - last) / 1000, 0.001), 0.05);
      last = now;

      const offscreen = read();
      if (offscreen) {
        // Nothing to animate: be in the right state already when it scrolls in.
        current = target;
      } else {
        current += (target - current) * (1 - Math.exp(-DAMP * dt));
        if (Math.abs(target - current) < 0.0004) current = target;
      }

      if (current !== lastDrawn) {
        draw(current);
        lastDrawn = current;
      }

      const settled = current === target;
      setMoving(!settled);
      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const redraw = () => {
      if (disposed) return;
      measureGeo();
      read();
      current = target;
      draw(current);
      lastDrawn = current;
    };

    redraw();

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", redraw);

    // Webfonts can change the reveal block's height after first paint.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(redraw).catch(() => {});
    }

    let unbindLenis = null;
    if (lenis) {
      lenis.on("scroll", kick);
      unbindLenis = () => lenis.off("scroll", kick);
    }

    return () => {
      disposed = true;
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", redraw);
      if (unbindLenis) unbindLenis();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, lenis, cells]);

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
      <div ref={stageRef} className="ps-stage" data-moving="false">
        <div ref={glowRef} className="ps-glow" aria-hidden="true" />

        <div className="ps-world">
          {cells.map(({ project: p }, i) => (
            <div
              key={i}
              className="ps-cell"
              ref={(el) => (cellRefs.current[i] = el)}
            >
              <ProjectCardTile project={p} onClick={(e) => handleTileClick(e, p)} />
            </div>
          ))}
        </div>

        <div className="ps-center">
          <div ref={groupRef} className="ps-group">
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
  --ps-tile: clamp(160px, 18vw, 270px);
  --ps-ratio: 1 / 1;
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

/* Ambient radial colour pool. Opacity is driven per frame, so no transition. */
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
}

[data-theme='light'] .ps-glow {
  background: radial-gradient(closest-side, rgba(200, 180, 240, 0.35), rgba(255, 210, 220, 0.15) 55%, transparent 100%);
}

/* ==========================================================================
   Tile world. Every cell is anchored at the stage centre and positioned by
   JS with translate + scale (see draw() in the component).
   ========================================================================== */
.ps-world {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.ps-cell {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--ps-tile);
  transform-origin: 0 0;
  visibility: hidden; /* JS reveals it on first draw, avoids a flash at load */
  backface-visibility: hidden;
}

/* ==========================================================================
   Card
   ========================================================================== */
.ps-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  aspect-ratio: var(--ps-ratio, 1 / 1);
  overflow: hidden;
  border-radius: 16px;
  border: none;
  box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.75);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  background: #0e0e13;
  transform: perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
  transform-style: preserve-3d;
  transition: transform .22s cubic-bezier(.16,1,.3,1), box-shadow .35s ease;
  user-select: none;
}

[data-theme='light'] .ps-tile {
  background: #ffffff;
  box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.08);
}

.ps-tile:hover,
.ps-tile:focus-visible {
  box-shadow: 0 24px 50px -10px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.05);
}

[data-theme='light'] .ps-tile:hover,
[data-theme='light'] .ps-tile:focus-visible {
  box-shadow: 0 24px 50px -10px rgba(0, 0, 0, 0.16);
}

.ps-tile:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

/* Cursor-tracking sheen (position set through --sx / --sy) */
.ps-card-sheen {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s ease;
  z-index: 1;
  background: radial-gradient(circle at var(--sx, 50%) var(--sy, 50%), var(--accent) 0%, transparent 70%);
}

.ps-card-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}

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

[data-theme='light'] .ps-card-idx { color: rgba(0, 0, 0, 0.4); }
.ps-tile:hover .ps-card-idx { color: #fff; }
[data-theme='light'] .ps-tile:hover .ps-card-idx { color: #000; }

.ps-card-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  font-family: var(--font-mono, monospace);
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.75);
}

[data-theme='light'] .ps-card-pill {
  background: rgba(0, 0, 0, 0.05);
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

[data-theme='light'] .ps-card-category { color: rgba(0, 0, 0, 0.45); }
.ps-tile:hover .ps-card-category { color: #38bdf8; }

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

[data-theme='light'] .ps-card-title { color: #09090b; }
.ps-tile:hover .ps-card-title { transform: translateY(-2px); }

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

[data-theme='light'] .ps-card-sub { color: rgba(0, 0, 0, 0.6); }

.ps-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
}

.ps-card-stat {
  font-family: var(--font-mono, monospace);
  font-size: 0.66rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-theme='light'] .ps-card-stat { color: rgba(0, 0, 0, 0.5); }

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

.ps-card-arrow svg { width: 12px; height: 12px; }

.ps-tile:hover .ps-card-arrow {
  transform: translate(2px, -2px) scale(1.1);
  background: #ffffff;
  color: #09090b;
}

[data-theme='light'] .ps-tile:hover .ps-card-arrow {
  background: #09090b;
  color: #ffffff;
}

/* Dim the other cards on hover, but only while the section is at rest.
   Doing this mid-scroll would re-run :has() on every moving tile. */
@media (hover: hover) {
  .ps-stage[data-moving="false"] .ps-world:has(.ps-tile:hover) .ps-tile:not(:hover) {
    opacity: .35;
    filter: blur(0.4px);
    transition: opacity .35s ease, filter .35s ease;
  }
}

/* ==========================================================================
   Headline group (sits above the tiles, like the reference)
   ========================================================================== */
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

/* Scroll hint (opacity driven per frame, so no transition) */
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
}
.ps-hint i {
  display: block;
  width: 1px;
  height: 38px;
  background: rgba(255,255,255,.5);
  transform-origin: top;
  animation: ps-line 2s cubic-bezier(.6,0,.3,1) infinite;
}

[data-theme='light'] .ps-hint i { background: rgba(0, 0, 0, 0.4); }

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

[data-theme='light'] .ps-rail { background: rgba(0, 0, 0, 0.1); }
[data-theme='light'] .ps-rail b { background: #000; }

@media (max-width: 1023px) {
  .ps { --ps-tile: 21vw; }
}

@media (max-width: 639px) {
  .ps { --ps-tile: 27vw; --ps-ratio: 4 / 5; }
  .ps-rail { display: none; }
  .ps-headline { font-size: clamp(28px, 8.5vw, 38px); }
  .ps-card-inner { padding: 10px; gap: 6px; }
  .ps-card-title { font-size: clamp(0.75rem, 3.2vw, 0.95rem); overflow-wrap: break-word; }
  .ps-card-category { font-size: 0.56rem; }
  .ps-card-sub, .ps-card-pill { display: none; }
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