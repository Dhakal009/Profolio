import { createContext, useContext, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Shared progress                                                           */
/* -------------------------------------------------------------------------- */

// ParallaxSection publishes its smoothed scroll progress (0 → 1) here so any
// ParallaxLayer inside can move at its own speed, from the same source.
const ProgressContext = createContext(null);

const LAYER_DISTANCE = 120; // px a layer travels each way at speed = 1

/* -------------------------------------------------------------------------- */
/*  ParallaxLayer: wrap any child to give it its own depth                    */
/* -------------------------------------------------------------------------- */

/**
 * speed > 0  → closer to the viewer: moves up faster than the section
 * speed < 0  → further away: lags behind
 * speed = 0  → no extra movement
 */
export function ParallaxLayer({ speed = 0, as = "div", className = "", children, ...rest }) {
  const progress = useContext(ProgressContext);
  const fallback = useMotionValue(0.5); // used outside a ParallaxSection
  const reduce = useReducedMotion();

  const y = useTransform(
    progress ?? fallback,
    [0, 1],
    [speed * LAYER_DISTANCE, -speed * LAYER_DISTANCE]
  );

  const Tag = motion[as] ?? motion.div;

  return (
    <Tag style={reduce ? undefined : { y }} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  ParallaxSection                                                           */
/* -------------------------------------------------------------------------- */

/**
 * @param offset   px the content travels each way while crossing the screen
 * @param background  optional node drawn behind the content that lags the page
 * @param bgSpeed  how far the background lags (0 = none, 1 = same as offset)
 * @param fade     fade/scale content in and out at the section edges
 */
export default function ParallaxSection({
  id,
  title,
  children,
  background = null,
  offset = 80,
  bgSpeed = 0.6,
  fade = true,
  className = "",
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // section entering → leaving
  });

  // One spring for everything: all layers share the same smoothing, so they
  // stay in sync instead of each lagging differently.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
    restDelta: 0.0005,
  });

  // Content: travels up through the section.
  const y = useTransform(progress, [0, 1], [offset, -offset]);
  const opacity = useTransform(progress, [0, 0.15, 0.85, 1], fade ? [0, 1, 1, 0] : [1, 1, 1, 1]);
  const scale = useTransform(progress, [0, 0.15, 0.85, 1], fade ? [0.96, 1, 1, 0.96] : [1, 1, 1, 1]);

  // Background: lags the page, so it reads as further away.
  const bgDistance = offset * bgSpeed * 1.5;
  const bgY = useTransform(progress, [0, 1], [-bgDistance, bgDistance]);

  return (
    <ProgressContext.Provider value={progress}>
      <section
        ref={ref}
        id={id}
        data-transition-section
        className={`section focus-section relative overflow-hidden ${className}`}
        aria-labelledby={`${id}-title`}
      >
        {background && (
          <motion.div
            aria-hidden="true"
            style={reduce ? undefined : { y: bgY }}
            className="pointer-events-none absolute inset-x-0 -inset-y-[20%] -z-10 will-change-transform"
          >
            {background}
          </motion.div>
        )}

        <motion.div
          style={reduce ? undefined : { y, opacity, scale }}
          className="container section-centered will-change-transform"
        >
          <h2 className="sr-only" id={`${id}-title`}>
            {title}
          </h2>
          <div className="section-content">{children}</div>
        </motion.div>
      </section>
    </ProgressContext.Provider>
  );
}