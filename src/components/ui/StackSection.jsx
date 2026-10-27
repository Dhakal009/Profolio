import { useEffect, useRef } from "react";

/**
 * StackSection (fast build) — no framer-motion, no per-frame React work.
 *
 * How it stays cheap:
 *  - ONE shared scroll listener and ONE requestAnimationFrame loop for every
 *    section on the page (instead of ~20 motion values per section).
 *  - Each frame: all layout reads first, then all style writes. Sections that
 *    can't possibly change (still below the fold, or settled under later
 *    sections) are skipped without touching the layout.
 *  - Smoothing is a frame-rate independent ease (no spring solver) and the
 *    loop goes to sleep as soon as everything has settled: 0 work at rest.
 *  - Only transform + opacity are animated. The shadow is a static element
 *    whose opacity moves; the corner radius never animates.
 *  - Style writes are skipped when the value didn't change.
 *  - A section that is fully hidden behind the next one gets
 *    visibility:hidden, so the browser stops painting/compositing it.
 *  - will-change is only set while a section is moving.
 *
 * Needs: no ancestor with overflow hidden/auto/scroll (use `overflow-x: clip`
 * on html/body), sibling sections with no vertical margins, and an OPAQUE
 * `background`.
 */

// [side offset (-1 left, 1 right), starting scale, lockY, delay]
const ENTRANCES = {
  premium: [0, 1, 0, 0],
  left: [-1, 1, 0, 0],
  right: [1, 1, 0, 0],
  bottom: [0, 1, 0, 0],
  zoom: [0, 0.9, 0, 0],
  leftMid: [-1, 1, 1, 0],
  rightMid: [1, 1, 1, 0],
  fadeBottom: [0, 1, 0, 0.3],
};

const FADE_OVERLAP = 0.25;
const SHADOW_UP = "0 -1px 0 rgba(255,255,255,0.14), 0 -28px 70px rgba(0,0,0,0.5)";

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (x) => x * x * (3 - 2 * x);

/* ------------------------------------------------------------------------- */
/* Shared controller                                                         */
/* ------------------------------------------------------------------------- */

const entries = new Set(); // in mount (= DOM) order
const byEl = new WeakMap();
let dirty = true;
let raf = 0;
let last = 0;
let bound = false;
let reduceMQ = null;

function schedule() {
  if (!raf) raf = requestAnimationFrame(tick);
}
function onScroll() {
  dirty = true;
  schedule();
}
function onResize() {
  entries.forEach(measure);
  dirty = true;
  schedule();
}
function bind() {
  if (bound) return;
  bound = true;
  reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("load", onResize);
  reduceMQ.addEventListener?.("change", onScroll);
}
function unbind() {
  if (!bound) return;
  bound = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("load", onResize);
  reduceMQ?.removeEventListener?.("change", onScroll);
  cancelAnimationFrame(raf);
  raf = 0;
  last = 0;
}

// Tall sections stick when their BOTTOM meets the screen bottom; short ones at the top.
function measure(en) {
  en.h = en.el.offsetHeight;
  en.el.style.top = Math.min(0, window.innerHeight - en.h) + "px";
}

// Layout READS only (plus choosing an entrance). No style writes of ours.
function read(en, vh) {
  const nx = byEl.get(en.el.nextElementSibling);
  const pv = byEl.get(en.el.previousElementSibling);

  if (en.ready) {
    // The section before hasn't started arriving, so neither can this one.
    if (pv && pv.enterT === 0 && en.enterT === 0) return;
    // Settled and the next one is settled over it too: nothing can change.
    if (en.enterT === 1 && en.coverT === 1 && nx && nx.coverT === 1) return;
  }

  const reduce = reduceMQ.matches;
  const next = en.el.nextElementSibling;
  let c = next ? clamp01(1 - next.getBoundingClientRect().top / vh) : 0;
  let e = clamp01(1 - en.el.getBoundingClientRect().top / vh);
  if (reduce) {
    c = 0;
    e = 1;
  }

  // (Re)choose the entrance each time it starts arriving from off-screen.
  if (e > 0 && en.enterT <= 0.0001 && !reduce) {
    const P = en.props.current;
    const [x, s, lock, delay] =
      ENTRANCES[P.entrance ?? "premium"] ?? ENTRANCES.premium;
    en.fromX = x;
    en.fromScale = s;
    en.lock = lock;
    en.delay = delay;
    en.shadow.style.boxShadow =
      lock && x !== 0 ? `${-x * 36}px 0 70px rgba(0,0,0,0.5)` : SHADOW_UP;
  }

  en.enterT = e;
  en.coverT = c;
  if (!en.ready) {
    en.ready = true;
    en.enter = e; // snap on first measure: nothing animates on page load
    en.covered = c;
  }
}

function put(en, key, el, prop, val) {
  if (en.w[key] !== val) {
    en.w[key] = val;
    el.style[prop] = val;
  }
}

// Smooth toward the targets and WRITE styles. Returns true while still moving.
function step(en, dt, vh) {
  if (!en.ready) return false;
  const P = en.props.current;
  const nx = byEl.get(en.el.nextElementSibling);

  const k = 1 - Math.exp(-dt * 22 * P.smoothing);
  let busy = false;

  const de = en.enterT - en.enter;
  if (Math.abs(de) < 0.0005) en.enter = en.enterT;
  else {
    en.enter += de * k;
    busy = true;
  }
  const dc = en.coverT - en.covered;
  if (Math.abs(dc) < 0.0005) en.covered = en.coverT;
  else {
    en.covered += dc * k;
    busy = true;
  }

  // Add a small, damped impulse from scroll velocity for tactile feedback.
  const targetVelocity = (en.enterT - en.lastTarget) / Math.max(dt, 0.001);
  const impulse = Math.max(-1, Math.min(1, targetVelocity * 0.24)) * P.bounce;
  en.bounce += (impulse - en.bounce) * (1 - Math.exp(-dt * 14));
  en.lastTarget = en.enterT;
  if (Math.abs(en.bounce) > 0.01) busy = true;

  // Nothing changed since the last write.
  if (
    !busy &&
    en.enter === en.lastE &&
    en.covered === en.lastC &&
    en.enterT === en.lastT
  ) {
    return false;
  }
  en.lastE = en.enter;
  en.lastC = en.covered;
  en.lastT = en.enterT;

  /* ----- progress ----- */
  const dl = en.delay;
  const nd = nx ? nx.delay : 0;
  const a = clamp01((en.enter - dl) / (1 - dl));
  const c = clamp01((en.covered - nd) / (1 - nd));
  const f = nd > 0 ? smooth(clamp01(en.covered / (nd + FADE_OVERLAP))) : 0;
  const d = en.fromX;
  const lock = en.lock;
  const nX = nx ? nx.fromX : 0;
  const nL = nx ? nx.lock : 0;
  const ia = 1 - a;

  /* ----- panel ----- */
  const X = d * (lock ? ia : ia * ia) * 100 - nX * c * P.exit * 38;
  const arriving = lock ? -(1 - en.enterT) * vh : (en.enterT - a) * vh;
  const Y = arriving + (nL ? 0 : -c * 0.4 * vh * P.exit) + en.bounce;
  const S = (1 - c * P.depth) * (1 + (en.fromScale - 1) * ia);
  const R = (ia * ia * 5 + c * 4) * P.tilt;

  const idle =
    Math.abs(X) < 0.005 && Math.abs(Y) < 0.05 && Math.abs(S - 1) < 0.00005 && Math.abs(R) < 0.005;
  const T = idle
    ? "none"
    : (P.tilt > 0 ? `perspective(${P.perspective}px) ` : "") +
      `translate3d(${X.toFixed(2)}%,${Y.toFixed(1)}px,0) scale(${S.toFixed(4)})` +
      (P.tilt > 0 ? ` rotateX(${R.toFixed(2)}deg)` : "");
  put(en, "pt", en.panel, "transform", T);

  const moving = !idle || a < 0.999 || c > 0.001;
  put(en, "pw", en.panel, "willChange", moving ? "transform" : "auto");

  /* ----- surface ----- */
  const rounded = (a < 0.995 || c > 0.005) && P.radius > 0;
  if (en.rounded !== rounded) {
    en.rounded = rounded;
    const r = rounded ? P.radius + "px" : "0px";
    en.clip.style.borderRadius = r;
    en.shadow.style.borderRadius = r;
  }
  put(en, "so", en.shadow, "opacity", ia.toFixed(3));
  put(en, "do", en.dim, "opacity", (c * P.dim).toFixed(3));
  put(en, "eo", en.edge, "opacity", Math.min(0.8, ia * 0.8).toFixed(3));
  put(en, "et", en.edge, "transform", `scaleX(${Math.max(0.18, a).toFixed(3)})`);

  /* ----- content (moves against the panel) ----- */
  const CY = (lock ? 0 : Math.pow(ia, 1.5) * 120 * P.drift) - c * 60 * P.drift - f * 50 * P.drift;
  const CX = lock ? -d * ia * 24 * P.drift : 0;
  const cIdle = Math.abs(CX) < 0.01 && Math.abs(CY) < 0.05;
  put(
    en,
    "ct",
    en.content,
    "transform",
    cIdle ? "none" : `translate3d(${CX.toFixed(2)}%,${CY.toFixed(1)}px,0)`
  );
  const op = (0.3 + 0.7 * smooth(clamp01(a * 1.6))) * (1 - c * 0.25) * (1 - f);
  put(en, "co", en.content, "opacity", op.toFixed(3));

  /* ----- skip painting a section that's fully hidden behind the next ----- */
  const hidden =
    P.hideCovered && nx && nx.ready && c >= 0.999 && nx.enter >= 0.999 && nx.h >= vh - 1;
  put(en, "vis", en.panel, "visibility", hidden ? "hidden" : "visible");

  return busy;
}

function tick(now) {
  raf = 0;
  const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
  last = now;
  const vh = window.innerHeight;

  // Phase 1: reads. Phase 2: writes. Never interleaved.
  if (dirty) {
    dirty = false;
    entries.forEach((en) => read(en, vh));
  }
  let busy = false;
  entries.forEach((en) => {
    if (step(en, dt, vh)) busy = true;
  });

  if (busy) schedule();
  else last = 0; // asleep until the next scroll
}

/* ------------------------------------------------------------------------- */
/* Component                                                                 */
/* ------------------------------------------------------------------------- */

export default function StackSection({
  children,
  entrance = "premium", // consistent fade-and-lift entrance; legacy variants remain supported
  entrances = ["left", "right", "bottom", "zoom"], // random pool if `entrance` isn't set
  depth = 0, // keep the slider flat while the next section arrives
  dim = 0.25, // subtle separation without a heavy overlay
  radius = 0, // clean square-edged section handoff
  drift = 0, // avoid competing content parallax
  exit = 1, // how far the covered section moves out (0 = pinned)
  tilt = 0, // flat slider motion is cheaper and clearer
  perspective = 1400,
  smoothing = 1.15, // responsive slider settling
  bounce = 11, // short magnetic nudge from scroll velocity, in pixels
  hideCovered = true, // stop painting a section once it is fully covered
  background = "var(--bg, #000000)", // must be opaque
  className = "",
  style,
}) {
  const outer = useRef(null);
  const panel = useRef(null);
  const shadow = useRef(null);
  const clip = useRef(null);
  const content = useRef(null);
  const dimEl = useRef(null);
  const edge = useRef(null);

  const props = useRef(null);
  props.current = {
    entrance, entrances, depth, dim, radius, drift, exit,
    tilt, perspective, smoothing, bounce, hideCovered,
  };

  useEffect(() => {
    const en = {
      el: outer.current,
      panel: panel.current,
      shadow: shadow.current,
      clip: clip.current,
      content: content.current,
      dim: dimEl.current,
      edge: edge.current,
      props,
      h: 0,
      ready: false,
      enter: 1, covered: 0, // smoothed
      enterT: 1, coverT: 0, // targets (exact scroll position)
      fromX: 0, fromScale: 1, lock: 0, delay: 0,
      bounce: 0, lastTarget: 1,
      lastE: -1, lastC: -1, lastT: -1,
      rounded: null,
      w: {}, // last written values
    };
    en.shadow.style.boxShadow = SHADOW_UP;

    entries.add(en);
    byEl.set(en.el, en);
    bind();
    measure(en);

    const ro = new ResizeObserver(() => {
      measure(en);
      dirty = true;
      schedule();
    });
    ro.observe(en.el);

    dirty = true;
    schedule();

    return () => {
      ro.disconnect();
      entries.delete(en);
      byEl.delete(en.el);
      if (!entries.size) unbind();
      else {
        dirty = true;
        schedule();
      }
    };
  }, []);

  return (
    <div
      ref={outer}
      className={`stack-section ${className}`}
      style={{ position: "sticky", top: 0, ...style }}
    >
      <div ref={panel} style={{ position: "relative", transformOrigin: "50% 100%" }}>
        {/* static shadow: only its opacity animates */}
        <div
          ref={shadow}
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0 }}
        />
        <div
          ref={clip}
          style={{
            position: "relative",
            overflow: "clip", // `clip` keeps sticky/pinned children working
            background,
          }}
        >
          <div
            ref={edge}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 0 auto",
              height: "1px",
              background: "linear-gradient(90deg, transparent, var(--section-edge), transparent)",
              transformOrigin: "center",
              opacity: 0,
              pointerEvents: "none",
              zIndex: 31,
            }}
          />
          <div ref={content}>{children}</div>
          {/* dim layer while the next section covers this one */}
          <div
            ref={dimEl}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--dim-surface)",
              opacity: 0,
              pointerEvents: "none",
              zIndex: 30,
            }}
          />
        </div>
      </div>
    </div>
  );
}