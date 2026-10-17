"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const TEXT =
  "Based in Kathmandu Nepal, studying computer science, focused on full-stack development, building for the web.";

const LINES = TEXT.split(/(?<=,)\s+/);
const USE_LENIS = true;

// same premium timings - not changed
const HOLD = 0.08;
const TRAVEL_BASE = 0.5;
const TRAVEL_PER_WORD = 0.035;
const VERTICAL = 0.68;
const SCROLL_PER_UNIT = 0.30;
const END_HOLD = 0.7;
const DIRECTION = 1;
const TOP_STEP = 0.6;
const MAX_BLUR = 6;
const WORD_BLUR = 0;
const SCRUB = 0.8; // <- 0.6 -> 0.35 for fast scroll response

const wordCount = (line) => line.split(" ").length;

export default function AboutSection() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray(".row");
      const rowWords = rows.map((r) => gsap.utils.toArray(".word", r));
      const track = trackRef.current;
      const stage = stageRef.current;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let lenis;
        let tick;
        if (USE_LENIS) {
          lenis = new Lenis({
            duration: 0.95, // was 1.2 -> faster catch-up
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.15, // more distance per wheel tick
            touchMultiplier: 1.6,
            lerp: 0.12, // was 0.1 -> less lag
            syncTouch: true,
            gestureOrientation: "vertical",
          });
          lenis.on("scroll", ScrollTrigger.update);
          tick = (time) => lenis.raf(time * 1000);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);
        }

        const plan = [];
        let t = 0;
        rows.forEach((_, i) => {
          const travel = TRAVEL_BASE + wordCount(LINES[i]) * TRAVEL_PER_WORD;
          const travelAt = t + HOLD;
          const endAt = travelAt + travel + HOLD;
          plan.push({ travelAt, travel, endAt });
          t = i < rows.length - 1 ? endAt + VERTICAL : endAt;
        });
        const total = t + END_HOLD;

        let dist = rows.map(() => 0);
        let wordX = rowWords.map((ws) => ws.map(() => 0));
        const fontPx = (row) => parseFloat(getComputedStyle(row).fontSize);
        const shift = (row) => fontPx(row) * 1.25;
        const restY = (i) => (i - (rows.length - 1) / 2) * fontPx(rows[i]) * TOP_STEP;

        const layout = () => {
          dist = rows.map((r) => Math.max(0, r.offsetWidth - stage.clientWidth));
          wordX = rowWords.map((ws, i) => {
            const rowLeft = rows[i].getBoundingClientRect().left;
            return ws.map((w) => {
              const r = w.getBoundingClientRect();
              return r.left - rowLeft + r.width / 2;
            });
          });
          const h = stage.offsetHeight;
          track.style.height = `${h + total * h * SCROLL_PER_UNIT}px`;
        };
        layout();

        // FAST SCROLL: skip hidden rows + no getProperty thrash on y/filter
        const updateFocus = () => {
          const vw = stage.clientWidth;
          const falloff = vw * 0.26;
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            // cheap check - opacity is set inline by timeline
            if (row.style.opacity === "0") continue;
            const x = gsap.getProperty(row, "x");
            const p = dist[i] > 0 ? Math.min(1, Math.max(0, -x / dist[i])) : 0;
            const point = vw * (0.22 + 0.62 * p);
            const words = rowWords[i];
            for (let j = 0; j < words.length; j++) {
              const d = (x + wordX[i][j] - point) / falloff;
              const k = Math.min(1, Math.abs(d));
              const smooth = k * k * (3 - 2 * k);
              // direct style write = 2x faster than gsap.set on fast scroll
              words[j].style.opacity = d < 0 ? 1 - smooth * 0.3 : 1 - smooth * 0.65;
            }
          }
        };

        ScrollTrigger.addEventListener("refreshInit", layout);
        ScrollTrigger.addEventListener("refresh", updateFocus);

        gsap.from(textRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: textRef.current, start: "top 85%", once: true },
        });

        const tl = gsap.timeline({
          onUpdate: updateFocus,
          defaults: { force3D: true, overwrite: "auto" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: SCRUB,
            fastScrollEnd: true, // catches up after fast flick
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.set(rows[0], { y: () => restY(0) }, 0);

        rows.forEach((row, i) => {
          const { travelAt, travel, endAt } = plan[i];
          tl.fromTo(row, { x: 0 }, { x: () => -dist[i], ease: "power3.inOut", duration: travel, immediateRender: false }, travelAt);
          if (i < rows.length - 1) {
            const next = rows[i + 1];
            tl.fromTo(row, { y: () => restY(i), opacity: 1, filter: "blur(0px)" },
              { y: () => restY(i) + shift(row) * DIRECTION, opacity: 0, filter: `blur(${MAX_BLUR}px)`, ease: "power3.inOut", duration: VERTICAL, immediateRender: false }, endAt);
            const enterAt = endAt + VERTICAL * 0.1;
            tl.fromTo(next, { y: () => restY(i + 1) - shift(next) * DIRECTION, opacity: 0, filter: `blur(${MAX_BLUR}px)` },
              { y: () => restY(i + 1), opacity: 1, filter: "blur(0px)", ease: "power3.inOut", duration: VERTICAL, immediateRender: true }, enterAt);
          }
        });

        if (tl.duration() < total) tl.to({}, { duration: total - tl.duration() }, tl.duration());
        updateFocus();

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", layout);
          ScrollTrigger.removeEventListener("refresh", updateFocus);
          if (lenis) { gsap.ticker.remove(tick); lenis.destroy(); }
          rowWords.flat().forEach(w => w.style.opacity = "");
          gsap.set(rows, { clearProps: "x,y,opacity,filter" });
          track.style.height = "";
        };
      });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);
      return () => { window.removeEventListener("load", refresh); mm.revert(); };
    },
    { scope: trackRef }
  );

  return (
    <div ref={trackRef} className="relative w-full">
      <div ref={stageRef} className="sticky top-0 flex h-screen min-h-[100dvh] w-full items-center overflow-hidden bg-black text-white">
        <div ref={textRef} className="relative z-10 flex h-full w-full items-center"
          style={{ WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)", maskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)" }}>
          <h2 aria-label={TEXT} className="grid w-full select-none antialiased text-[15vw] font-extrabold leading-[1.05] tracking-[-0.05em] md:text-[10vw]" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 800 }}>
            {LINES.map((line, r) => (
              <span key={r} aria-hidden="true" className="row col-start-1 row-start-1 block w-max self-center whitespace-nowrap px-[9vw] will-change-transform">
                {line.split(" ").map((word, i) => (<span key={i} className="word mr-[0.22em] inline-block will-change-[opacity]">{word}</span>))}
              </span>
            ))}
          </h2>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@800;900&display=swap');`}</style>
    </div>
  );
}