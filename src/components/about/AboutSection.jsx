import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Smooth scroll is owned by LenisProvider in the layout, which also keeps
// ScrollTrigger in sync. This section must NOT create its own Lenis.
// Font: import '@fontsource/inter/800.css' and '900.css' once (done in the layout).

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------ Content ---------------------------------- */

const TEXT =
  "Rooted in Kathmandu, Trained in computer science, Driven to build for the web.";

const LINES = [
  "Rooted in Kathmandu,",
  "Trained in computer",
  "science, Driven to",
  "build for the web.",
];

const FONT = "var(--font-heading, 'Inter Tight'), 'Inter', system-ui, sans-serif";

/* ------------------------------ Config ----------------------------------- */

const CONFIG = {
  scrollLength: 2.2, // section height in viewports
  mobileScrollLength: 1.25,
  scrub: 0.8, // higher = smoother, softer follow
  ghost: 0.14, // opacity of rows that haven't been revealed yet
  enterStart: "top 85%", // intro plays when the section reaches this point
  revealStart: 0.04, // scroll reveal of rows 2+ (0–1 of the scroll)
  revealEnd: 0.85, // all rows fully lit here; the rest is a resting hold
  rowOverlap: 0.35, // 0 = rows wait for each other, 0.5 = heavy overlap
  wordShare: 0.6, // share of a row's time that one word takes
  fillWidth: 0.96,
  lineBox: 1.0,
  overlap: 0.08,
};

const LINE_SCALE = [1, 0.82, 0.76, 0.84];

/* ------------------------- Inline styles --------------------------------- */
/* Inline on purpose: can't be purged by Tailwind in production builds.      */

const fill = { position: "absolute", inset: 0, pointerEvents: "none" };

const S = {
  stage: {
    position: "sticky",
    top: 0,
    width: "100%",
    height: "100vh",
    minHeight: "100dvh",
    overflow: "hidden",
    background: "var(--bg)",
    color: "var(--foam)",
  },
  photoWrap: {
    ...fill,
    overflow: "hidden",
    clipPath: "inset(100% 0% 0% 0%)",
    willChange: "clip-path",
  },
  photo: {
    ...fill,
    background:
      "radial-gradient(circle at 72% 28%, var(--foam) 0 1px, transparent 2px), radial-gradient(circle at 72% 28%, transparent 0 11rem, var(--line-strong) 11.05rem 11.1rem, transparent 11.15rem 18rem, var(--line) 18.05rem 18.1rem, transparent 18.15rem), linear-gradient(135deg, transparent 0 49.8%, var(--line) 50%, transparent 50.2%), linear-gradient(45deg, transparent 0 49.8%, var(--line) 50%, transparent 50.2%), var(--bg)",
    backgroundSize: "auto, auto, 100% 100%, 100% 100%, auto",
    opacity: 0.9,
    willChange: "transform",
  },
  shade: {
    ...fill,
    background:
      "var(--media-shade)",
  },
  vignette: {
    ...fill,
    background:
      "var(--media-vignette)",
  },
  content: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    padding: "calc(var(--header-h) + 1rem) clamp(1rem, 3vw, 2.5rem) calc(var(--dock-h) + 3.5rem)",
    fontFamily: FONT,
  },
  h2: {
    margin: 0,
    width: "100%",
    height: "auto",
    flex: 1,
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
  fit: {
    display: "inline-block",
  },
  word: {
    display: "inline-block",
    willChange: "transform, opacity",
  },
};

/* ----------------------------- Component --------------------------------- */

export default function AboutSection() {
  const trackRef = useRef(null);
  const photoWrapRef = useRef(null);
  const photoRef = useRef(null);
  const h2Ref = useRef(null);
  const stageRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const h2 = h2Ref.current;
      const lines = Array.from(track.querySelectorAll(".line"));
      const lineWords = lines.map((l) => Array.from(l.querySelectorAll(".word")));
      const allWords = lineWords.flat();
      const mm = gsap.matchMedia();

      /* ===== Fit every row to the full width ============================= */
      const fit = () => {
        const isMobile = window.innerWidth <= 640;
        const availW = h2.clientWidth * (isMobile ? 0.92 : CONFIG.fillWidth);
        const availH = h2.clientHeight;
        h2.style.justifyContent = isMobile ? "flex-start" : "space-between";
        h2.style.gap = isMobile ? "clamp(0.65rem, 2.8vw, 1rem)" : "";
        h2.style.flex = isMobile ? "none" : "1";
        if (contentRef.current) {
          contentRef.current.style.height = isMobile ? "auto" : "100%";
          contentRef.current.style.paddingBottom = isMobile
            ? "1.25rem"
            : "calc(var(--dock-h) + 3.5rem)";
        }
        if (stageRef.current) {
          stageRef.current.style.height = isMobile ? "auto" : "100vh";
          stageRef.current.style.minHeight = isMobile ? "0" : "100dvh";
        }

        const sizes = lines.map((line, i) => {
          line.style.fontSize = "100px";
          const w = line.firstElementChild.offsetWidth;
          const scale = isMobile
            ? [0.98, 0.74, 0.68, 0.76][i] || 0.72
            : LINE_SCALE[i] || 1;
          return ((100 * availW) / w) * scale;
        });

        const totalH = sizes.reduce(
          (sum, s, i) => sum + s * (CONFIG.lineBox - (i > 0 ? CONFIG.overlap : 0)),
          0
        );
        const k = totalH > availH ? availH / totalH : 1;

        lines.forEach((line, i) => {
          line.style.fontSize = `${sizes[i] * k}px`;
        });
      };

      fit();
      const onResize = () => {
        fit();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      /* ===== Reduced motion: everything visible, no animation ============ */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(allWords, { opacity: 1 });
        gsap.set(photoWrapRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
      });

      /* ===== Full motion ================================================= */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const isMobile = window.innerWidth <= 640;
        track.style.height = `${(isMobile ? CONFIG.mobileScrollLength : CONFIG.scrollLength) * 100}vh`;

        /* --- A. Intro: plays by time as the section enters the screen --- */
        const intro = gsap.timeline({
          scrollTrigger: { trigger: track, start: CONFIG.enterStart, once: true },
        });

        // photo wipes up from the bottom
        intro.to(
          photoWrapRef.current,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" },
          0
        );

        /* --- B. Scroll: remaining rows light up, photo zooms out -------- */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: CONFIG.scrub,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          photoRef.current,
          { scale: 1.25 },
          { scale: 1, duration: 0.95, ease: "power2.out" },
          0
        );

        // Keep the opening line hidden until the section itself begins scrolling.
        tl.fromTo(
          lineWords[0],
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.09,
            ease: "power3.out",
            force3D: true,
          },
          0
        );

        // rows 2+ share the scroll equally and overlap a little
        const rest = lineWords.slice(1);
        const span = CONFIG.revealEnd - CONFIG.revealStart;
        const rowSpan = span / (1 + (rest.length - 1) * (1 - CONFIG.rowOverlap));
        const rowStep = rowSpan * (1 - CONFIG.rowOverlap);

        rest.forEach((words, r) => {
          const wordDur = rowSpan * CONFIG.wordShare;
          const stagger = words.length > 1 ? (rowSpan - wordDur) / (words.length - 1) : 0;

          tl.fromTo(
            words,
            { opacity: CONFIG.ghost, yPercent: 30 },
            {
              opacity: 1,
              yPercent: 0,
              ease: "power3.out",
              duration: wordDur,
              stagger,
              force3D: true,
            },
            CONFIG.revealStart + r * rowStep
          );
        });

        /* Resting hold at the end */
        tl.set({}, {}, 1);

        return () => {
          track.style.height = "";
        };
      });

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
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: trackRef }
  );

  return (
    <section id="about" ref={trackRef} aria-label="About" className="relative w-full">
      <div ref={stageRef} style={S.stage}>
        {/* Abstract background, revealed by the wipe */}
        <div ref={photoWrapRef} aria-hidden="true" style={S.photoWrap}>
          <div ref={photoRef} style={S.photo} />
          <div style={S.shade} />
          <div style={S.vignette} />
        </div>

        {/* Foreground text */}
        <div ref={contentRef} style={S.content}>
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
        </div>
      </div>
    </section>
  );
}