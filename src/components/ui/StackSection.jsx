import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

// How a section can arrive: [side offset (-1 left, 1 right), starting scale, lockY, delay].
// By default a section also rises up from the bottom as you scroll.
// lockY = true: it does NOT rise; it stays level and slides in purely sideways.
// delay > 0: the section before it starts dissolving first; this one begins to
// move in after `delay` of the scroll, while the dissolve is still finishing.
const ENTRANCES = {
  left: [-1, 1, false, 0], // sideways + rising from the bottom
  right: [1, 1, false, 0],
  bottom: [0, 1, false, 0],
  zoom: [0, 0.88, false, 0],
  leftMid: [-1, 1, true, 0], // straight in from the left, middle of the screen
  rightMid: [1, 1, true, 0], // straight in from the right, middle of the screen
  fadeBottom: [0, 1, false, 0.3], // previous dissolves first, then this rises from the bottom
};

// The dissolve keeps going this much longer than the wait, so the two overlap.
const FADE_OVERLAP = 0.25;

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (x) => x * x * (3 - 2 * x);

/**
 * Sticky "stacking" section with fixed or random entrances and moving content.
 *
 * Wrap each page section in <StackSection>. Put them all as siblings inside
 * ONE parent element. When a section's bottom reaches the bottom of the screen
 * it sticks in place, and the next section moves in over it.
 *
 *  - The incoming section arrives the way its `entrance` prop says (or a random
 *    one from `entrances` if not set). Its panel looks like a card while moving
 *    and flattens to a clean full-bleed section once it has arrived.
 *  - Its content lags behind the panel and fades up (parallax).
 *  - The section underneath moves out of the viewport, sinks back and dims.
 *    With entrance="fadeBottom" it instead fades its content out first, and
 *    the next section starts moving in only after that.
 *
 * Needs: no ancestor with overflow hidden/auto/scroll. Use `overflow-x: clip`
 * on html/body, which also hides the sideways travel of side entrances.
 */
export default function StackSection({
  children,
  entrance, // fixed entrance: "bottom", "fadeBottom", "rightMid", "leftMid", "left", "right", "zoom"
  entrances = ["left", "right", "bottom", "zoom"], // random pool, used only if `entrance` isn't set
  depth = 0.06, // how much the covered section shrinks (0 = no shrink)
  dim = 0.55, // how dark the covered section gets (0–1)
  radius = 24, // card corner radius while moving (px, 0 = always square)
  drift = 1, // how much the content moves against the panel (0 = content stays put)
  exit = 1, // how far the covered section moves out of the viewport (0 = stays pinned)
  background = "var(--bg, #070708)", // must be opaque to hide the section below
  className = "",
  style,
}) {
  const outerRef = useRef(null);
  const reduce = useReducedMotion();
  const [stickTop, setStickTop] = useState(0);
  const { scrollY } = useScroll();

  const covered = useMotionValue(0); // raw 0 → 1 while the next section covers this one
  const enter = useMotionValue(1); // raw 0 → 1 while this section arrives
  const fromX = useMotionValue(0); // chosen entrance: side (-1, 0, 1)
  const fromScale = useMotionValue(1); // chosen entrance: starting scale
  const lockY = useMotionValue(0); // 1 = hold level with the screen while sliding in
  const fromDelay = useMotionValue(0); // share of the scroll spent waiting (fade first)
  const nextX = useMotionValue(0); // side the NEXT section is coming from
  const nextLock = useMotionValue(0); // 1 if the next section slides in level
  const nextDelay = useMotionValue(0); // next section's wait (this one fades out meanwhile)

  // Tall sections stick when their BOTTOM meets the screen bottom;
  // short ones stick at the top.
  const measure = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;
    setStickTop(Math.min(0, window.innerHeight - el.offsetHeight));
  }, []);

  const update = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;
    const vh = window.innerHeight;

    if (reduce) {
      covered.set(0);
      enter.set(1);
      return;
    }

    // How far the next section has travelled over this one.
    const next = el.nextElementSibling;
    if (next) {
      covered.set(clamp01(1 - next.getBoundingClientRect().top / vh));
      nextX.set(Number(next.dataset.fromx || 0));
      nextLock.set(Number(next.dataset.lock || 0));
      nextDelay.set(Number(next.dataset.delay || 0));
    } else {
      covered.set(0);
    }

    // How far this section has arrived; (re)choose its entrance each time it
    // starts coming in from off-screen.
    const e = clamp01(1 - el.getBoundingClientRect().top / vh);
    if (e > 0 && enter.get() <= 0.0001) {
      const [x, s, lock, delay] =
        ENTRANCES[entrance ?? pick(entrances)] ?? ENTRANCES.bottom;
      fromX.set(x);
      fromScale.set(s);
      lockY.set(lock ? 1 : 0);
      fromDelay.set(delay);
      // Let the section underneath know how to move out.
      el.dataset.fromx = String(x);
      el.dataset.lock = lock ? "1" : "0";
      el.dataset.delay = String(delay);
    }
    enter.set(e);
  }, [
    covered, enter, fromX, fromScale, lockY, fromDelay,
    nextX, nextLock, nextDelay, reduce, entrance, entrances,
  ]);

  useEffect(() => {
    const refresh = () => {
      measure();
      update();
    };
    refresh();

    const el = outerRef.current;
    const ro = new ResizeObserver(refresh);
    if (el) ro.observe(el);
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refresh);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", refresh);
      window.removeEventListener("load", refresh);
    };
  }, [measure, update]);

  useMotionValueEvent(scrollY, "change", update);

  /* ----- Progress values --------------------------------------------------- */

  // This section's arrival, after any initial wait (fade phase of the section before).
  const arrive = useTransform([enter, fromDelay], ([e, dl]) => clamp01((e - dl) / (1 - dl)));
  // How far this section has been covered, after the fade phase (if the next one has it).
  const cov = useTransform([covered, nextDelay], ([c, nd]) => clamp01((c - nd) / (1 - nd)));
  // 0 → 1: this section's content dissolves (fade + drift up + soften + shrink).
  // Starts first and overlaps with the next section moving in.
  const fadeOut = useTransform([covered, nextDelay], ([c, nd]) =>
    nd > 0 ? smooth(clamp01(c / (nd + FADE_OVERLAP))) : 0
  );

  /* ----- Panel ------------------------------------------------------------- */

  // Arriving: rising entrances settle quickly; level (lockY) ones travel evenly.
  // Leaving: pushed out the opposite way the next one comes in, so both
  // sections move through the viewport together.
  const x = useTransform(
    [arrive, fromX, lockY, cov, nextX],
    ([a, d, lock, c, nx]) => {
      const arriving = d * (lock ? 1 - a : Math.pow(1 - a, 2)) * 100;
      const leaving = -nx * c * 38 * exit;
      return `${arriving + leaving}%`;
    }
  );
  const y = useTransform(
    [enter, arrive, lockY, cov, nextLock],
    ([e, a, lock, c, nl]) => {
      const vh = window.innerHeight;
      // level entrance: cancel the natural rise so it stays put on screen
      let arriving = lock ? -(1 - e) * vh : 0;
      // delayed entrance: hold below the screen until the fade phase is over
      if (!lock) arriving += (e - a) * vh;
      // rising entrance: covered section is carried up and out of the screen
      const leaving = nl ? 0 : -c * 0.4 * vh * exit;
      return arriving + leaving;
    }
  );
  const scale = useTransform(
    [cov, arrive, fromScale],
    ([c, a, s]) => (1 - c * depth) * (1 + (s - 1) * (1 - a))
  );
  // Card-like while moving or covered, flat and full-bleed when it owns the screen.
  const corner = useTransform(
    [arrive, cov],
    ([a, c]) => radius * Math.max(1 - smooth(a), c)
  );
  // Shadow falls on the side the section is coming from.
  const shadow = useTransform([arrive, fromX, lockY, cov], ([a, d, lock, c]) => {
    const k = 0.38 * Math.max(1 - a, c);
    if (k < 0.01) return "none";
    return lock && d !== 0
      ? `${-d * 28}px 0 60px rgba(0,0,0,${k})`
      : `0 -24px 60px rgba(0,0,0,${k})`;
  });
  const edge = useTransform(
    [arrive, cov],
    ([a, c]) => `1px solid rgba(255,255,255,${0.09 * Math.max(1 - a, c)})`
  );
  const shade = useTransform(cov, (v) => v * dim);

  /* ----- Content (moves against the panel) --------------------------------- */

  // Incoming: trails the panel a little. Covered: drifts up.
  const contentY = useTransform([arrive, cov, lockY, fadeOut], ([a, c, lock, f]) => {
    const trail = lock ? 0 : Math.pow(1 - a, 1.5) * 140 * drift;
    return trail - c * 70 * drift - f * 60 * drift;
  });
  // Dissolve: content shrinks a touch and softens as it fades.
  const contentScale = useTransform(fadeOut, (f) => 1 - f * 0.05);
  const contentBlur = useTransform(fadeOut, (f) => (f > 0.01 ? `blur(${f * 8}px)` : "none"));
  // Level entrances: content lags behind the panel's sideways travel.
  const contentX = useTransform([arrive, fromX, lockY], ([a, d, lock]) =>
    lock ? `${-d * (1 - a) * 28 * drift}%` : "0%"
  );
  const contentOpacity = useTransform(
    [arrive, cov, fadeOut],
    ([a, c, f]) => (0.3 + 0.7 * smooth(clamp01(a * 1.6))) * (1 - c * 0.25) * (1 - f)
  );

  return (
    <div
      ref={outerRef}
      className={className}
      style={{ position: "sticky", top: stickTop, ...style }}
    >
      <motion.div
        style={{
          x,
          y,
          scale,
          transformOrigin: "50% 100%",
          background,
          position: "relative",
          // `clip` (not `hidden`) so sticky/pinned children inside still work
          overflow: "clip",
          borderRadius: corner,
          boxShadow: shadow,
          border: edge,
          borderBottom: "none",
        }}
      >
        <motion.div
          style={{
            x: contentX,
            y: contentY,
            scale: contentScale,
            filter: contentBlur,
            opacity: contentOpacity,
            transformOrigin: "50% 50%",
          }}
        >
          {children}
        </motion.div>

        {/* dim layer shown while the next section covers this one */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            opacity: shade,
            pointerEvents: "none",
            zIndex: 30,
          }}
        />
      </motion.div>
    </div>
  );
}