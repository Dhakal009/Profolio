import { createContext, useContext } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Shared progress                                                           */
/* -------------------------------------------------------------------------- */

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
 * Static section container; scroll transitions are handled by StackSection.
 */
export default function ParallaxSection({
  id,
  title,
  children,
  background = null,
  className = "",
}) {
  return (
    <ProgressContext.Provider value={null}>
      <section
        id={id}
        data-transition-section
        className={`section focus-section relative overflow-hidden ${className}`}
        aria-labelledby={`${id}-title`}
      >
        {background && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -inset-y-[20%] -z-10"
          >
            {background}
          </div>
        )}

        <div className="container section-centered">
          <h2 className="sr-only" id={`${id}-title`}>
            {title}
          </h2>
          <div className="section-content">{children}</div>
        </div>
      </section>
    </ProgressContext.Provider>
  );
}