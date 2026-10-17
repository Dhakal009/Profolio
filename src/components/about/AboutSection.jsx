"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const TEXT =
  "Based in Kathmandu Nepal, studying computer science, focused on full-stack development.";

// Giant outlined word in the background. Keep it short and tied to the copy.
const BACKDROP_WORD = "Who I Am";

// Split after each comma so every phrase gets its own scrolling row.
const LINES = TEXT.split(/(?<=,)\s+/);

/* -------------------------------------------------------------------------- */
/*  Config (timeline units are relative; scroll length is derived from them)  */
/* -------------------------------------------------------------------------- */

const CONFIG = {
  // Timeline
  hold: 0.06, // pause before/after each row travels
  travelBase: 0.5, // minimum travel time per row
  travelPerWord: 0.03, // extra travel time per word
  transition: 0.55, // time to swap one row for the next
  endHold: 0.35, // pause after the last row

  // Scroll length: viewport heights of scrolling per timeline unit.
  // Higher = more scrolling needed to finish the section.
  scrollPerUnit: 0.6,
  scrub: 0.6, // smoothing between scroll position and animation

  // Row layout
  rowStep: 0.55, // vertical spacing multiplier between stacked rows
  rowShift: 1.25, // how far (in em) a row drifts while fading
  maxBlur: 6, // px of blur while a row fades in/out

  // Parallax (percent / px travelled over the whole section)
  parallax: {
    backWordStart: 0.08, // giant word starts this fraction of its width to the right
    backWordEndPad: 0.05, // gap (fraction of viewport width) left after its last letter
    midGlowY: -18, // % of stage height
    frontGlowY: -42, // % of stage height (faster = feels closer)
    gridY: -8, // % of stage height
  },

  // Smooth scroll
  lenis: {
    duration: 1,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    touchMultiplier: 1.5,
    syncTouch: true,
    gestureOrientation: "vertical",
  },
};

const wordCount = (line) => line.split(" ").length;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function AboutSection() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const textRef = useRef(null);
  const backWordRef = useRef(null);
  const midGlowRef = useRef(null);
  const frontGlowRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray(".row");
      const rowWords = rows.map((row) => gsap.utils.toArray(".word", row));
      const track = trackRef.current;
      const stage = stageRef.current;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ----- Smooth scroll ---------------------------------------------- */
        const lenis = new Lenis(CONFIG.lenis);
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        /* ----- Timeline plan: when each row travels / leaves -------------- */
        const plan = [];
        let cursor = 0;
        rows.forEach((_, i) => {
          const travel = CONFIG.travelBase + wordCount(LINES[i]) * CONFIG.travelPerWord;
          const travelAt = cursor + CONFIG.hold;
          const endAt = travelAt + travel + CONFIG.hold;
          plan.push({ travelAt, travel, endAt });
          cursor = i < rows.length - 1 ? endAt + CONFIG.transition : endAt;
        });
        const total = cursor + CONFIG.endHold;

        /* ----- Measurements (re-run on every ScrollTrigger refresh) ------- */
        let dist = rows.map(() => 0); // how far each row must slide
        let wordX = rowWords.map((ws) => ws.map(() => 0)); // word centres in row

        const fontPx = (row) => parseFloat(getComputedStyle(row).fontSize);
        const shift = (row) => fontPx(row) * CONFIG.rowShift;
        const restY = (i) => (i - (rows.length - 1) / 2) * fontPx(rows[i]) * CONFIG.rowStep;

        const measure = () => {
          dist = rows.map((r) => Math.max(0, r.offsetWidth - stage.clientWidth));
          wordX = rowWords.map((ws, i) => {
            const rowLeft = rows[i].getBoundingClientRect().left;
            return ws.map((w) => {
              const r = w.getBoundingClientRect();
              return r.left - rowLeft + r.width / 2;
            });
          });
          track.style.height = `${stage.offsetHeight * (1 + total * CONFIG.scrollPerUnit)}px`;
        };
        measure();

        /* ----- Word focus: the word under the "reading point" is brightest -- */
        const updateFocus = () => {
          const vw = stage.clientWidth;
          const falloff = vw * 0.26;

          rows.forEach((row, i) => {
            if (row.style.opacity === "0") return; // hidden row, skip work

            const x = gsap.getProperty(row, "x");
            const progress = dist[i] > 0 ? gsap.utils.clamp(0, 1, -x / dist[i]) : 0;
            const point = vw * (0.22 + 0.62 * progress);

            rowWords[i].forEach((word, j) => {
              const d = Math.min(1, Math.abs((x + wordX[i][j] - point) / falloff));
              const smooth = d * d * (3 - 2 * d); // smoothstep
              word.style.opacity = (0.35 + (1 - smooth * 0.65) * 0.65).toFixed(3);
            });
          });
        };

        ScrollTrigger.addEventListener("refreshInit", measure);
        ScrollTrigger.addEventListener("refresh", updateFocus);

        /* ----- Intro reveal (plays once) ---------------------------------- */
        gsap.from(textRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: textRef.current, start: "top 85%", once: true },
        });

        /* ----- Master timeline, scrubbed by scroll ------------------------ */
        const tl = gsap.timeline({
          onUpdate: updateFocus,
          defaults: { force3D: true, overwrite: "auto" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: CONFIG.scrub,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });

        // Text rows
        tl.set(rows[0], { y: () => restY(0) }, 0);

        rows.forEach((row, i) => {
          const { travelAt, travel, endAt } = plan[i];

          tl.fromTo(
            row,
            { x: 0 },
            { x: () => -dist[i], ease: "power3.inOut", duration: travel, immediateRender: false },
            travelAt
          );

          if (i === rows.length - 1) return;
          const next = rows[i + 1];

          // current row drifts away
          tl.fromTo(
            row,
            { y: () => restY(i), opacity: 1, filter: "blur(0px)" },
            {
              y: () => restY(i) + shift(row),
              opacity: 0,
              filter: `blur(${CONFIG.maxBlur}px)`,
              ease: "power3.inOut",
              duration: CONFIG.transition,
              immediateRender: false,
            },
            endAt
          );

          // next row drifts in
          tl.fromTo(
            next,
            { y: () => restY(i + 1) - shift(next), opacity: 0, filter: `blur(${CONFIG.maxBlur}px)` },
            {
              y: () => restY(i + 1),
              opacity: 1,
              filter: "blur(0px)",
              ease: "power3.inOut",
              duration: CONFIG.transition,
              immediateRender: true,
            },
            endAt + CONFIG.transition * 0.1
          );
        });

        // Parallax layers: each moves a different distance across the same
        // scroll range, so they read as different depths.
        const p = CONFIG.parallax;
        const span = { ease: "none", duration: total };

        // "Who I Am" travels exactly far enough to reveal its whole width,
        // and finishes together with the last text row (before the end hold),
        // so every letter has been on screen by the time the text is done.
        const backWord = backWordRef.current;
        tl.fromTo(
          backWord,
          { x: () => backWord.offsetWidth * p.backWordStart },
          {
            x: () =>
              Math.min(
                0,
                -(backWord.offsetWidth - stage.clientWidth + stage.clientWidth * p.backWordEndPad)
              ),
            ease: "none",
            duration: total - CONFIG.endHold,
          },
          0
        );

        tl.fromTo(gridRef.current, { yPercent: 0 }, { yPercent: p.gridY, ...span }, 0);
        tl.fromTo(midGlowRef.current, { yPercent: 20 }, { yPercent: p.midGlowY, ...span }, 0);
        tl.fromTo(frontGlowRef.current, { yPercent: 60 }, { yPercent: p.frontGlowY, ...span }, 0);

        updateFocus();

        /* ----- Cleanup ---------------------------------------------------- */
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", measure);
          ScrollTrigger.removeEventListener("refresh", updateFocus);
          gsap.ticker.remove(tick);
          lenis.destroy();

          rowWords.flat().forEach((w) => (w.style.opacity = ""));
          gsap.set(
            [
              ...rows,
              backWordRef.current,
              gridRef.current,
              midGlowRef.current,
              frontGlowRef.current,
            ],
            { clearProps: "all" }
          );
          track.style.height = "";
        };
      });

      // Re-measure once fonts and assets are ready.
      const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh());
      document.fonts?.ready.then(refresh);

      if (document.readyState === "complete") {
        refresh();
      } else {
        window.addEventListener("load", refresh, { once: true });
      }

      return () => window.removeEventListener("load", refresh);
    },
    { scope: trackRef }
  );

  return (
    <section ref={trackRef} aria-label="About" className="relative w-full">
      <div
        ref={stageRef}
        className="sticky top-0 flex h-screen min-h-[100dvh] w-full items-center overflow-hidden bg-[#050507] text-white"
      >
        {/* ---- Parallax background layers (back to front) ---- */}

        {/* Faint grid, slowest */}
        <div
          ref={gridRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-[10%] h-[120%] opacity-[0.07] will-change-transform"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            WebkitMaskImage: "radial-gradient(ellipse at center, #000 20%, transparent 70%)",
            maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 70%)",
          }}
        />

        {/* Giant outlined word, drifts sideways */}
        <span
          ref={backWordRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[42vw] font-black leading-none tracking-[-0.06em] will-change-transform"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.09)",
          }}
        >
          {BACKDROP_WORD}
        </span>

        {/* Soft light, medium speed */}
        <div
          ref={midGlowRef}
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10%] top-[30%] h-[60vmin] w-[60vmin] rounded-full opacity-40 blur-3xl will-change-transform"
          style={{ background: "radial-gradient(circle, #3b4cff 0%, transparent 65%)" }}
        />

        {/* Soft light, fastest (feels closest) */}
        <div
          ref={frontGlowRef}
          aria-hidden="true"
          className="pointer-events-none absolute -right-[8%] top-[40%] h-[45vmin] w-[45vmin] rounded-full opacity-30 blur-3xl will-change-transform"
          style={{ background: "radial-gradient(circle, #ff4d6d 0%, transparent 65%)" }}
        />

        {/* ---- Foreground text ---- */}
        <div
          ref={textRef}
          className="relative z-10 flex h-full w-full items-center"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
            maskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          }}
        >
          <h2
            aria-label={TEXT}
            className="grid w-full select-none text-[12vw] font-extrabold leading-[1.05] tracking-[-0.07em] antialiased md:text-[10vw]"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            {LINES.map((line, r) => (
              <span
                key={r}
                aria-hidden="true"
                className="row col-start-1 row-start-1 block w-max self-center whitespace-nowrap px-[9vw] will-change-transform"
              >
                {line.split(" ").map((word, i) => (
                  <span key={i} className="word mr-[0.22em] inline-block will-change-[opacity]">
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* Prefer next/font in your layout; this is a fallback. */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@800;900&display=swap');`}</style>
    </section>
  );
}