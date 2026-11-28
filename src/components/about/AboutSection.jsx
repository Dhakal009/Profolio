import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTheme } from "../../contexts/ThemeContext";
import Lanyard from "../ui/Lanyard";
import { createIdCardTextures } from "../../utils/idCardTexture";

// Smooth scroll is owned by LenisProvider in the layout, which also keeps
// ScrollTrigger in sync. This section must NOT create its own Lenis.
// Font: import '@fontsource/inter/800.css' and '900.css' once (done in the layout).

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------ Content ---------------------------------- */

const TEXT =
  "Building full stack products, shipping them with automated pipelines, running them reliably.";

const LINES = [
  "Building full stack products,",
  "shipping them with pipelines,",
  "running them reliably,",
  "end to end.",
];

const BIO = {
  strong: "Computer Science undergraduate",
  rest: " from Kathmandu building full stack web applications and the DevOps pipeline around them: containerised with Docker, tested and deployed through CI/CD, and monitored in production.",
};

const SPECS = [
  { label: "Based in", value: "Kathmandu, Nepal", icon: "pin" },
  { label: "Focus", value: "Full stack & DevOps", icon: "code" },
  { label: "Availability", value: "Open to projects", icon: "live" },
];

const ICON_PROPS = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const ICONS = {
  pin: (
    <svg {...ICON_PROPS}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  code: (
    <svg {...ICON_PROPS}>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
    </svg>
  ),
  live: <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />,
};

// Scrolling facts along the bottom of the card. Edit freely; keep each one short.
const FACTS = [
  { label: "Education", text: "Final-year B.Sc. CSIT at Himalaya College of Engineering" },
  { label: "Role", text: "Full Stack & DevOps Engineer" },
  { label: "Stack", text: "React, Node.js, Express, MongoDB" },
  { label: "Built", text: "A government queue management system" },
  { label: "Also built", text: "Employee, e-commerce and hostel management systems" },
  { label: "DevOps", text: "Docker, GitHub Actions CI/CD, Linux and cloud deployments" },
  { label: "Side project", text: "Jarvis, a Python voice and typing assistant for Windows" },
  { label: "Learning", text: "Kubernetes, Terraform and cloud infrastructure" },
  { label: "Interests", text: "Problem solving and getting the most out of generative AI" },
  { label: "Looking for", text: "Full stack and DevOps roles" },
];

const FONT = "var(--font-heading, 'Inter Tight'), 'Inter', system-ui, sans-serif";

/* ------------------------------ Config ----------------------------------- */

// Must match Tailwind's `md` breakpoint (768px) so CSS layout and JS behaviour
// always switch at the same width.
const DESKTOP_QUERY = "(min-width: 768px)";

const CONFIG = {
  scrollLength: 1.5, // desktop section height in viewports (pinned)
  scrub: 0.2,
  ghost: 0.14, // opacity of words that haven't been revealed yet
  enterStart: "top 88%",
  revealStart: 0.02, // scroll reveal of rows 2+ (0–1 of the scroll)
  revealEnd: 0.68,
  rowOverlap: 0.45,
  wordShare: 0.55,
  fillWidth: 0.96,
  lineBox: 1.0,
  overlap: 0.08,
  marqueeSpeed: 50, // px per second at rest
};

const LINE_SCALE = [1, 0.88, 0.86, 0.7];
const LINE_SCALE_MOBILE = [0.98, 0.74, 0.68, 0.76];

/* ------------------------- Inline styles --------------------------------- */
/* Inline on purpose: can't be purged by Tailwind in production builds.      */

const S = {
  stage: {
    position: "sticky", // switched to "relative" below 768px (see fit)
    top: 0,
    width: "100%",
    height: "100vh",
    minHeight: "100dvh",
    overflow: "hidden",
    contain: "layout paint",
    background: "var(--bg)",
    color: "var(--foam)",
  },
  content: {
    position: "relative",
    zIndex: 10,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    padding: "calc(var(--header-h) + 0.5rem) clamp(1rem, 3vw, 2.5rem) calc(var(--dock-h) + 2.25rem)",
    fontFamily: FONT,
    pointerEvents: "none",
  },
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--line)",
    backgroundImage:
      "linear-gradient(180deg, color-mix(in srgb, var(--foam) 5%, transparent), transparent 38%)",
    boxShadow:
      "inset 0 1px 0 color-mix(in srgb, var(--foam) 10%, transparent), 0 24px 48px -32px rgba(0,0,0,0.6)",
    opacity: 0,
    willChange: "transform, opacity",
  },
  edge: {
    padding: "1px",
    background:
      "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--foam) 45%, transparent), transparent 60%)",
    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
    opacity: 0,
  },
  sheen: {
    width: "45%",
    transform: "translateX(-130%) skewX(-18deg)",
    background:
      "linear-gradient(90deg, transparent, color-mix(in srgb, var(--foam) 14%, transparent) 50%, transparent)",
    opacity: 0,
  },
  aurora: {
    inset: 0,
    background:
      "radial-gradient(45% 40% at 20% 15%, color-mix(in srgb, var(--foam) 7%, transparent), transparent 70%)",
  },
  glow: {
    background:
      "radial-gradient(60% 50% at 50% 45%, color-mix(in srgb, var(--foam) 6%, transparent), transparent 70%)",
  },
  h2: {
    margin: 0,
    width: "100%",
    height: "auto",
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    fontWeight: 800,
    letterSpacing: "-0.055em",
    WebkitFontSmoothing: "antialiased",
    userSelect: "none",
  },
  line: {
    display: "block",
    flexShrink: 0,
    overflow: "hidden", // masks words as they rise
    lineHeight: 0.86,
    padding: "0.08em 0 0.18em",
    whiteSpace: "nowrap",
    fontSize: "10vw", // replaced by the fit function once mounted
  },
  fit: { display: "inline-block" },
  word: {
    display: "inline-block",
    willChange: "transform, opacity",
    backgroundImage:
      "linear-gradient(180deg, var(--foam) 35%, color-mix(in srgb, var(--foam) 62%, transparent))",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    paddingBottom: "0.04em",
  },
  tile: {
    position: "relative",
    overflow: "hidden",
    border: "1px solid var(--line)",
    background: "transparent",
    opacity: 0,
  },
  iconBox: {
    color: "var(--muted)",
  },
  // shown on hover: a brighter edge plus a soft light that follows the cursor
  tileHover: {
    border: "1px solid color-mix(in srgb, var(--foam) 30%, transparent)",
    background:
      "radial-gradient(160px circle at var(--tx, 50%) var(--ty, 50%), color-mix(in srgb, var(--foam) 10%, transparent), transparent 70%)",
    opacity: 0,
  },
  spot: {
    background:
      "radial-gradient(480px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--foam) 6%, transparent), transparent 65%)",
    opacity: 0,
  },
  marquee: {
    opacity: 0,
    borderTop: "1px solid var(--line)",
    maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
    WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
  },
};

// Short desktop windows (landscape laptops, split screens): drop the bio and
// tighten the tiles so the headline keeps its room.
const RESPONSIVE_CSS = `
@media (min-width: 768px) and (max-height: 700px) {
  #about .about-bio { display: none; }
  #about .about-tile { padding-top: 0.625rem; padding-bottom: 0.625rem; }
}
@media (max-width: 380px) {
  #about .about-icon { display: none; }
}
`;

/* ----------------------------- Component --------------------------------- */

export default function AboutSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [cardFaces, setCardFaces] = useState({
    front: "/lanyard-avatar.jpg",
    back: "/lanyard-avatar.jpg",
  });

  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const h2Ref = useRef(null);
  const lanyardRef = useRef(null);

  useEffect(() => {
    let active = true;
    createIdCardTextures("/lanyard-avatar.jpg", isDark).then((faces) => {
      if (active) setCardFaces(faces);
    });
    return () => {
      active = false;
    };
  }, [isDark]);

  useGSAP(
    () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      const card = cardRef.current;
      const h2 = h2Ref.current;
      const lanyard = lanyardRef.current;
      const q = (sel) => track.querySelector(sel);

      const bio = q(".about-bio");
      const tiles = Array.from(track.querySelectorAll(".about-tile"));
      const hint = q(".about-hint");
      const marquee = q(".about-marquee");
      const marqueeInner = q(".about-marquee-inner");

      const lines = Array.from(track.querySelectorAll(".line"));
      const lineWords = lines.map((l) => Array.from(l.querySelectorAll(".word")));
      const allWords = lineWords.flat();
      const mm = gsap.matchMedia();

      /* ===== Fit every row to the full width ============================= */
      // Desktop (>= 768px): pinned stage, rows sized to the card's width AND
      // height. Below that: a normal flowing layout sized to width only.
      const fit = () => {
        const desktop = window.matchMedia(DESKTOP_QUERY).matches;

        if (contentRef.current) {
          contentRef.current.style.height = desktop ? "100%" : "auto";
          contentRef.current.style.paddingBottom = desktop
            ? "calc(var(--dock-h) + 2.25rem)"
            : "1.25rem";
        }
        stage.style.position = desktop ? "sticky" : "relative";
        stage.style.height = desktop ? "100vh" : "auto";
        stage.style.minHeight = desktop ? "100dvh" : "0";

        h2.style.justifyContent = desktop ? "space-between" : "flex-start";
        h2.style.gap = desktop ? "" : "clamp(0.65rem, 2.8vw, 1rem)";
        h2.style.flex = desktop ? "1" : "none";

        const availW = h2.clientWidth * (desktop ? CONFIG.fillWidth : 0.92);
        const availH = h2.clientHeight;

        const sizes = lines.map((line, i) => {
          line.style.fontSize = "100px";
          const w = line.firstElementChild.offsetWidth;
          const scale = desktop ? LINE_SCALE[i] || 1 : LINE_SCALE_MOBILE[i] || 0.72;
          return ((100 * availW) / w) * scale;
        });

        const totalH = sizes.reduce(
          (sum, s, i) => sum + s * (CONFIG.lineBox - (i > 0 ? CONFIG.overlap : 0)),
          0
        );
        const k = desktop && totalH > availH ? availH / totalH : 1;
        lines.forEach((line, i) => {
          line.style.fontSize = `${sizes[i] * k}px`;
        });
      };

      fit();

      // Re-fit whenever the headline's box changes size: window resize,
      // rotation, a font finishing loading, the footer growing or shrinking.
      let lastW = 0;
      let lastH = 0;
      let raf = 0;
      const ro = new ResizeObserver(() => {
        const w = h2.clientWidth;
        const h = h2.clientHeight;
        if (Math.abs(w - lastW) < 1 && Math.abs(h - lastH) < 1) return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          fit();
          lastW = h2.clientWidth;
          lastH = h2.clientHeight;
          ScrollTrigger.refresh();
        });
      });
      ro.observe(h2);

      /* ===== Animations, rebuilt automatically when the breakpoint changes ==
         desktop:  pinned scroll sequence (scrubbed) + entrance, exit, hover
         mobile:   no pinning; simple reveals as each part scrolls into view
         reduce:   everything visible, no motion                              */
      mm.add(
        {
          desktop: DESKTOP_QUERY,
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions;
          const cleanups = [];
          const finish = () => cleanups.forEach((fn) => fn());

          if (reduce) {
            gsap.set(allWords, { opacity: 1 });
            gsap.set([card, bio, hint, marquee, ...tiles].filter(Boolean), { opacity: 1, y: 0 });
            return finish;
          }

          const hover = { slow: 1, slowTarget: 1 }; // marquee eases down while hovered

          if (desktop) {
            /* ================= DESKTOP: pinned sequence ================= */
            track.style.height = `${CONFIG.scrollLength * 100}vh`;
            cleanups.push(() => {
              track.style.height = "";
            });

            /* --- Entrance (by time): card opens from an inset window ---- */
            const intro = gsap.timeline({
              scrollTrigger: { trigger: track, start: CONFIG.enterStart, once: true },
            });

            intro.fromTo(
              card,
              {
                opacity: 0,
                y: 90,
                scale: 0.93,
                transformOrigin: "50% 100%",
                clipPath: "inset(10% 5% 10% 5% round 44px)",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0% round 28px)",
                duration: 1.5,
                ease: "expo.out",
                force3D: true,
                // clip-path would cut off the card's shadow, so drop it once finished
                onComplete: () => gsap.set(card, { clearProps: "clipPath" }),
              },
              0
            );

            intro.fromTo(
              lineWords[0],
              { yPercent: 110, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.07,
                ease: "power3.out",
                force3D: true,
              },
              0.2
            );

            const sheen = card.querySelector(".about-sheen");
            if (sheen) {
              intro.fromTo(
                sheen,
                { xPercent: 0, opacity: 1 },
                { xPercent: 420, duration: 1.8, ease: "power2.inOut" },
                0.35
              );
              intro.set(sheen, { opacity: 0 }, 2.2);
            }

            if (hint) intro.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.9);

            /* --- Scroll: remaining rows light up, then the footer ------- */
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: track,
                start: "top 65%",
                end: "bottom bottom",
                scrub: CONFIG.scrub,
                invalidateOnRefresh: true,
              },
            });

            const rest = lineWords.slice(1);
            const span = CONFIG.revealEnd - CONFIG.revealStart;
            const rowSpan = span / (1 + (rest.length - 1) * (1 - CONFIG.rowOverlap));
            const rowStep = rowSpan * (1 - CONFIG.rowOverlap);

            rest.forEach((words, r) => {
              const wordDur = rowSpan * CONFIG.wordShare;
              const stagger = words.length > 1 ? (rowSpan - wordDur) / (words.length - 1) : 0;
              tl.fromTo(
                words,
                { opacity: CONFIG.ghost, yPercent: 40 },
                { opacity: 1, yPercent: 0, ease: "power3.out", duration: wordDur, stagger, force3D: true },
                CONFIG.revealStart + r * rowStep
              );
            });

            if (bio) {
              tl.fromTo(
                bio,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.2, ease: "power3.out", force3D: true },
                0.4
              );
            }
            if (tiles.length) {
              tl.fromTo(
                tiles,
                { opacity: 0, y: 24, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.24, stagger: 0.07, ease: "back.out(1.4)", force3D: true },
                0.46
              );
            }
            if (marquee) {
              tl.fromTo(marquee, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" }, 0.58);
            }

            // resting hold at the end
            tl.set({}, {}, 1);

            /* --- Exit (scrubbed): as the section leaves, the card recedes */
            // immediateRender is off so these never override the entrance's
            // start state; scrolling back up simply plays it in reverse.
            const exit = gsap.timeline({
              defaults: { ease: "none", immediateRender: false },
              scrollTrigger: {
                trigger: track,
                start: "bottom bottom",
                end: "bottom 30%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            exit.fromTo(
              card,
              { scale: 1, opacity: 1, transformOrigin: "50% 0%" },
              { scale: 0.92, opacity: 0.1, force3D: true },
              0
            );
            exit.fromTo(h2, { yPercent: 0 }, { yPercent: -6 }, 0);
            if (lanyard) exit.fromTo(lanyard, { opacity: 1 }, { opacity: 0 }, 0);

            /* --- Hover (mouse only) ------------------------------------- */
            // The 3D badge canvas sits on top of the card, so hover is
            // hit-tested from pointer position instead of CSS :hover.
            if (window.matchMedia("(hover: hover)").matches) {
              const items = tiles.map((el) => ({
                el,
                ring: el.querySelector(".about-tile-hover"),
                over: false,
                tween: null,
              }));
              const spotEl = card.querySelector(".about-spot");
              const edgeEl = card.querySelector(".about-edge");
              const target = { x: 0, y: 0 };
              const cur = { x: 0, y: 0 };
              let spotSeen = false;
              let overMarquee = false;

              const inside = (r, x, y) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;

              const setTile = (t, on) => {
                t.over = on;
                t.tween?.kill();
                t.tween = gsap.to(t.el, {
                  scale: on ? 1.03 : 1,
                  duration: on ? 0.5 : 0.4,
                  ease: on ? "back.out(2.2)" : "power3.out",
                });
                gsap.to(t.ring, { opacity: on ? 1 : 0, duration: 0.35, ease: "power2.out" });
              };

              // pointer events are coalesced to one pass per frame, and element
              // rects are cached (invalidated on scroll/resize) to avoid layout reads
              let rects = null;
              let pending = null;
              let moveRaf = 0;
              const invalidate = () => {
                rects = null;
              };
              const getRects = () =>
                rects ||
                (rects = {
                  card: card.getBoundingClientRect(),
                  tiles: items.map((t) => t.el.getBoundingClientRect()),
                  marquee: marquee ? marquee.getBoundingClientRect() : null,
                });

              const onMove = (e) => {
                pending = e;
                if (!moveRaf) {
                  moveRaf = requestAnimationFrame(() => {
                    moveRaf = 0;
                    if (pending) handleMove(pending);
                    pending = null;
                  });
                }
              };

              const handleMove = (e) => {
                const { clientX: x, clientY: y } = e;
                const R = getRects();

                const cr = R.card;
                target.x = x - cr.left;
                target.y = y - cr.top;
                if (!spotSeen) {
                  spotSeen = true;
                  cur.x = target.x;
                  cur.y = target.y;
                  gsap.to(spotEl, { opacity: 1, duration: 0.6 });
                  if (edgeEl) gsap.to(edgeEl, { opacity: 1, duration: 0.6 });
                }


                items.forEach((t, ti) => {
                  const r = R.tiles[ti];
                  const on = Number(gsap.getProperty(t.el, "opacity")) > 0.6 && inside(r, x, y);
                  if (on) {
                    t.el.style.setProperty("--tx", `${x - r.left}px`);
                    t.el.style.setProperty("--ty", `${y - r.top}px`);
                  }
                  if (on !== t.over) setTile(t, on);
                });

                if (marquee) {
                  const on = inside(R.marquee, x, y);
                  if (on !== overMarquee) {
                    overMarquee = on;
                    hover.slowTarget = on ? 0.15 : 1;
                  }
                }
              };

              const onLeave = () => {
                pending = null;
                rects = null;
                spotSeen = false;
                gsap.to(spotEl, { opacity: 0, duration: 0.5 });
                if (edgeEl) gsap.to(edgeEl, { opacity: 0, duration: 0.5 });
                items.forEach((t) => t.over && setTile(t, false));
                overMarquee = false;
                hover.slowTarget = 1;
              };

              const tickSpot = () => {
                if (!spotSeen) return;
                cur.x += (target.x - cur.x) * 0.12;
                cur.y += (target.y - cur.y) * 0.12;
                card.style.setProperty("--mx", `${cur.x}px`);
                card.style.setProperty("--my", `${cur.y}px`);
              };

              stage.addEventListener("pointermove", onMove, { passive: true });
              window.addEventListener("scroll", invalidate, { passive: true });
              window.addEventListener("resize", invalidate);
              stage.addEventListener("pointerleave", onLeave);
              gsap.ticker.add(tickSpot);
              cleanups.push(() => {
                stage.removeEventListener("pointermove", onMove);
                window.removeEventListener("scroll", invalidate);
                window.removeEventListener("resize", invalidate);
                cancelAnimationFrame(moveRaf);
                stage.removeEventListener("pointerleave", onLeave);
                gsap.ticker.remove(tickSpot);
              });
            }
          } else {
            /* ================= MOBILE / TABLET: no pinning ============== */
            // Normal document flow. Each part reveals once as it scrolls in.
            const intro = gsap.timeline({
              scrollTrigger: { trigger: track, start: "top 85%", once: true },
            });
            intro.fromTo(
              card,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", force3D: true },
              0
            );
            intro.fromTo(
              allWords,
              { opacity: 0, yPercent: 100 },
              {
                opacity: 1,
                yPercent: 0,
                duration: 0.7,
                stagger: 0.045,
                ease: "power3.out",
                force3D: true,
              },
              0.2
            );

            const footerTargets = [bio, ...tiles, marquee].filter(Boolean);
            if (footerTargets.length) {
              gsap.fromTo(
                footerTargets,
                { opacity: 0, y: 16 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  stagger: 0.08,
                  ease: "power3.out",
                  force3D: true,
                  scrollTrigger: { trigger: bio || marquee, start: "top 92%", once: true },
                }
              );
            }
          }

          /* ============== Facts marquee (all screen sizes) ============== */
          // One ticker loop owns the position. Scroll velocity is damped before
          // it touches the speed, so it accelerates, brakes and even reverses
          // smoothly. It only runs while the section is on screen.
          if (marqueeInner && marqueeInner.firstElementChild) {
            const copy = marqueeInner.firstElementChild;
            const setX = gsap.quickSetter(marqueeInner, "x", "px");
            const wrap = gsap.utils.wrap;
            const clamp = gsap.utils.clamp;

            let period = copy.getBoundingClientRect().width; // width of one full set
            let x = 0;
            let smoothVel = 0;
            let visible = false;

            const mro = new ResizeObserver(() => {
              period = copy.getBoundingClientRect().width;
            });
            mro.observe(copy);

            const st = ScrollTrigger.create({
              trigger: track,
              start: "top bottom",
              end: "bottom top",
              onToggle: (self) => {
                visible = self.isActive;
              },
            });

            marqueeInner.style.willChange = "transform";

            const tick = (time, deltaTime) => {
              if (!visible || !period) return;
              const dt = Math.min(deltaTime, 64) / 1000;
              const target = clamp(-2400, 2400, st.getVelocity());
              smoothVel += (target - smoothVel) * (1 - Math.exp(-dt * 5));
              hover.slow += (hover.slowTarget - hover.slow) * (1 - Math.exp(-dt * 6));
              const speed = (CONFIG.marqueeSpeed + smoothVel * 0.2) * hover.slow;
              x = wrap(-period, 0, x - speed * dt);
              setX(x);
            };

            gsap.ticker.add(tick);
            cleanups.push(() => {
              gsap.ticker.remove(tick);
              mro.disconnect();
              st.kill();
              marqueeInner.style.willChange = "";
              gsap.set(marqueeInner, { clearProps: "transform" });
            });
          }

          return finish;
        }
      );

      /* Re-fit and re-measure once fonts / assets are ready */
      const refresh = () =>
        requestAnimationFrame(() => {
          fit();
          ScrollTrigger.refresh();
        });
      document.fonts?.ready.then(refresh);

      if (document.readyState === "complete") {
        refresh();
      } else {
        window.addEventListener("load", refresh, { once: true });
      }

      return () => {
        window.removeEventListener("load", refresh);
        cancelAnimationFrame(raf);
        ro.disconnect();
        mm.revert();
      };
    },
    { scope: trackRef }
  );

  return (
    <section id="about" ref={trackRef} aria-label="About" className="relative w-full">
      <style>{RESPONSIVE_CSS}</style>

      <div ref={stageRef} style={S.stage}>
        <div ref={contentRef} style={S.content} className="w-full">
          {/* The card */}
          <div
            ref={cardRef}
            className="relative flex flex-col flex-1 min-h-0 rounded-[28px] overflow-hidden"
            style={S.card}
          >
            <div aria-hidden="true" className="pointer-events-none absolute" style={S.aurora} />
            <div aria-hidden="true" className="about-sheen pointer-events-none absolute inset-y-0 left-0" style={S.sheen} />
            <div aria-hidden="true" className="about-edge pointer-events-none absolute inset-0 rounded-[28px]" style={S.edge} />
            <div aria-hidden="true" className="about-spot pointer-events-none absolute inset-0" style={S.spot} />

            <div className="relative flex flex-col md:flex-row flex-1 min-h-0">
              {/* Left (desktop only): space for the 3D ID card */}
              <div className="hidden md:flex md:w-[36%] relative items-end p-6">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-6 bottom-6 w-px"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, var(--line) 20%, var(--line) 80%, transparent)",
                  }}
                />
                <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={S.glow} />
                
              </div>

              {/* Right: headline, bio, details */}
              <div className="w-full md:w-[64%] p-5 sm:p-7 lg:p-10 flex flex-col justify-between gap-6 lg:gap-7 flex-1 min-h-0">
                <h2 ref={h2Ref} aria-label={TEXT} style={S.h2}>
                  {LINES.map((line, r) => {
                    const words = line.split(" ");
                    return (
                      <span
                        key={r}
                        aria-hidden="true"
                        className="line"
                        style={{
                          ...S.line,
                          fontWeight: r === 0 ? 900 : 800,
                          letterSpacing: r === 0 ? "-0.07em" : "-0.045em",
                          marginTop: r > 0 ? `-${CONFIG.overlap}em` : 0,
                        }}
                      >
                        <span style={S.fit}>
                          {words.map((word, i) => (
                            <span
                              key={i}
                              className="word"
                              style={{
                                ...S.word,
                                // row 1 is revealed by the intro, the rest start as faint ghost text
                                opacity: r === 0 ? 0 : CONFIG.ghost,
                                marginRight: i < words.length - 1 ? "0.18em" : 0,
                              }}
                            >
                              {word}
                            </span>
                          ))}
                        </span>
                      </span>
                    );
                  })}
                </h2>

                <div className="flex flex-col gap-4 sm:gap-5">
                  <p
                    className="about-bio text-sm sm:text-base leading-relaxed max-w-2xl"
                    style={{ color: "var(--muted)", opacity: 0 }}
                  >
                    <span style={{ color: "var(--foam)", fontWeight: 500 }}>{BIO.strong}</span>
                    {BIO.rest}
                  </p>

                  {/* 1 column on phones, 3 across on small tablets, 2 in the narrow
                      desktop column, 3 across again once there is room */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                    {SPECS.map((s, i) => (
                      <div
                        key={s.label}
                        className={`about-tile flex flex-col justify-between gap-3 rounded-[18px] px-4 py-3.5 sm:py-4 ${
                          i === 2 ? "sm:col-span-1 md:col-span-2 lg:col-span-1" : ""
                        }`}
                        style={S.tile}
                      >
                        <span
                          aria-hidden="true"
                          className="about-tile-hover pointer-events-none absolute inset-0 rounded-[18px]"
                          style={S.tileHover}
                        />
                        <div className="relative flex items-center gap-2" style={{ color: "var(--muted)" }}>
                          <span className="about-icon grid h-4 w-4 place-items-center" style={S.iconBox}>
                            {ICONS[s.icon]}
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.14em]">{s.label}</span>
                        </div>
                        <div
                          className="relative text-[15px] font-semibold leading-snug tracking-tight"
                          style={{ color: "var(--foam)" }}
                        >
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Facts marquee */}
            <div
              className="about-marquee relative overflow-hidden"
              style={S.marquee}
              aria-label={FACTS.map((f) => `${f.label}: ${f.text}`).join(". ")}
            >
              <div className="about-marquee-inner flex w-max items-center py-3 sm:py-3.5" aria-hidden="true">
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center">
                    {FACTS.map((f) => (
                      <span key={`${copy}-${f.label}`} className="flex items-center">
                        <span
                          className="mx-1.5 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[13px] whitespace-nowrap"
                          style={{
                            border: "1px solid var(--line)",
                            background: "color-mix(in srgb, var(--foam) 4%, transparent)",
                          }}
                        >
                          <span
                            className="text-[10px] uppercase tracking-[0.14em]"
                            style={{ color: "var(--muted)" }}
                          >
                            {f.label}
                          </span>
                          <span className="font-medium" style={{ color: "var(--foam)" }}>
                            {f.text}
                          </span>
                        </span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive 3D Lanyard: below the card on phones/tablets, a full-section
            canvas on desktop so it can be dragged anywhere. touch-pan-y keeps
            vertical page scrolling working when a finger starts on the badge. */}
        <div
          ref={lanyardRef}
          className="relative w-full h-[340px] sm:h-[400px] touch-pan-y md:absolute md:inset-0 md:h-full z-20"
          aria-label="Interactive 3D badge lanyard"
        >
          <Lanyard
            frontImage={cardFaces.front}
            backImage={cardFaces.back}
            imageFit="cover"
            cardColor={isDark ? "#121215" : "#f8fafc"}
            strapColor={isDark ? "#18181b" : "#27272a"}
            finish="matte"
            metal={isDark ? "silver" : "graphite"}
            size={0.54}
            strapLength={0.44}
            anchor={0.18}
            breeze={0}
            interactive={true}
            intro={true}
          />
        </div>
      </div>
    </section>
  );
}