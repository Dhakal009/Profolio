import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Content – edit here. `end: null` means "present / still going".    */
/* ------------------------------------------------------------------ */
const ITEMS = [
  {
    id: "bsc",
    start: 2019,
    end: 2023,
    title: "B.Sc in Computer Science & Information Technology",
    text: "Specialized in Software Engineering, Advanced Web Technologies, and Human-Computer Interaction.",
    tags: ["Software Engineering", "Advanced Web Technologies", "Human-Computer Interaction"],
  },
  {
    id: "learning",
    start: 2023,
    end: null,
    title: "Continuous Learning & Open Source",
    text: "Actively contributing to open-source UI libraries and exploring AI-driven development workflows.",
    tags: ["Open source", "UI libraries", "AI-driven workflows"],
  },
];

const ROW_PAD_Y = 28; // keep in sync with Row padding
const DOT_Y = ROW_PAD_Y + 14; // vertical centre of the timeline dot inside a row

const durationLabel = (item) => {
  const years = (item.end ?? new Date().getFullYear()) - item.start;
  if (item.end == null) return years > 0 ? `${years} year${years > 1 ? "s" : ""} and counting` : "Just started";
  return `${years} year${years > 1 ? "s" : ""}`;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Education({ showHeading = true }) {
  const listRef = useRef(null);
  const rowRefs = useRef([]);
  const reduce = useReducedMotion();
  const [lit, setLit] = useState(() => ITEMS.map(() => false));

  // 0 when the list's top reaches 60% of the viewport, 1 when its bottom does
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.6", "end 0.6"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const fillHeight = useTransform(progress, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);

  // light a dot once the glowing rail has reached it
  const update = useCallback((v) => {
    const list = listRef.current;
    if (!list) return;
    const y = Math.max(0, Math.min(1, v)) * list.offsetHeight;
    setLit((prev) => {
      const next = rowRefs.current.map((row) => !!row && row.offsetTop + DOT_Y <= y);
      return next.length === prev.length && next.every((n, i) => n === prev[i]) ? prev : next;
    });
  }, []);

  useMotionValueEvent(progress, "change", update);

  useEffect(() => {
    if (reduce) setLit(ITEMS.map(() => true));
    else update(progress.get());
  }, [reduce, update, progress]);

  return (
    <Section id="education" aria-labelledby={showHeading ? "education-title" : undefined}>
      {showHeading && (
        <Head>
          <h2 id="education-title">Education</h2>
          <p>The foundation, and what I keep adding to it.</p>
          <HeatLine
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </Head>
      )}

      <List ref={listRef}>
        <Rail aria-hidden="true">
          <Fill style={{ height: reduce ? "100%" : fillHeight }} />
        </Rail>

        <ol>
          {ITEMS.map((item, i) => {
            const ongoing = item.end == null;
            const isLit = lit[i];
            return (
              <Row key={item.id} ref={(el) => (rowRefs.current[i] = el)}>
                <Years $lit={isLit}>
                  {item.start} — {ongoing ? "Present" : item.end}
                </Years>

                <Node>
                  <Dot $lit={isLit} $ongoing={ongoing} />
                  {isLit && (
                    <Ignite
                      aria-hidden="true"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 3.4, opacity: 0 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  )}
                </Node>

                <Body
                  initial={false}
                  animate={isLit ? { opacity: 1, y: 0 } : { opacity: 0.38, y: 8 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <YearsInline $lit={isLit}>
                    {item.start} — {ongoing ? "Present" : item.end}
                  </YearsInline>
                  <h3>{item.title}</h3>
                  <Duration $ongoing={ongoing}>
                    {ongoing && <i aria-hidden="true" />}
                    {durationLabel(item)}
                  </Duration>
                  <p>{item.text}</p>
                  <Tags>
                    {item.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </Tags>
                </Body>
              </Row>
            );
          })}
        </ol>
      </List>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles – map the CSS variables to your site's theme tokens         */
/* ------------------------------------------------------------------ */
const pulse = keyframes`
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(2.8); opacity: 0; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.35; }
`;

const Section = styled.section`
  --edu-fg: var(--fg, #fafafa);
  --edu-muted: var(--muted, #8b8b92);
  --edu-border: var(--border, rgba(255, 255, 255, 0.1));
  --edu-bg: var(--bg, #0c0c0c);
  --edu-mono: var(--font-mono, "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace);

  width: min(1200px, 100% - 48px);
  margin: 0 auto;
  padding: 96px 0;
  color: var(--edu-fg);
`;

const Head = styled.header`
  margin-bottom: 48px;

  h2 {
    margin: 0 0 10px;
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.05;
  }
  p {
    margin: 0 0 20px;
    color: var(--edu-muted);
  }
`;

const HeatLine = styled(motion.div)`
  width: 96px;
  height: 2px;
  border-radius: 2px;
  transform-origin: left;
  background: linear-gradient(90deg, #ff5a00, #ffd27a);
  box-shadow: 0 0 12px rgba(255, 140, 40, 0.55);
`;

const List = styled.div`
  --pad: 16px;
  --yw: 150px;
  --node: 28px;

  position: relative;
  padding-bottom: 64px; /* the rail keeps going and fades out: the story isn't finished */

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  @media (max-width: 640px) {
    --yw: 0px;
  }
`;

/* the rail: a cold track with a white-hot fill that follows your scroll */
const Rail = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--pad) + var(--yw) + var(--node) / 2 - 1px);
  width: 2px;
  border-radius: 2px;
  background: var(--edu-border);
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 72px), transparent);
  mask-image: linear-gradient(to bottom, #000 calc(100% - 72px), transparent);
`;

const Fill = styled(motion.div)`
  position: relative;
  width: 100%;
  border-radius: 2px;
  background: linear-gradient(to bottom, #ff4d00, #ff9a2e 70%, #ffe3a0);
  box-shadow: 0 0 14px rgba(255, 130, 30, 0.55);

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transform: translateX(-50%);
    background: #fff4d6;
    box-shadow: 0 0 12px 3px rgba(255, 170, 60, 0.9);
  }
`;

const Row = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: var(--yw) var(--node) 1fr;
  padding: ${ROW_PAD_Y}px var(--pad);
  border-radius: 14px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.025);
  }

  @media (max-width: 640px) {
    grid-template-columns: var(--node) 1fr;
  }
`;

const Years = styled.span`
  font-family: var(--edu-mono);
  font-size: 0.85rem;
  line-height: 28px;
  white-space: nowrap;
  color: ${({ $lit }) => ($lit ? "var(--edu-fg)" : "var(--edu-muted)")};
  transition: color 0.5s ease;

  @media (max-width: 640px) {
    display: none;
  }
`;

const YearsInline = styled.span`
  display: none;
  margin-bottom: 4px;
  font-family: var(--edu-mono);
  font-size: 0.8rem;
  color: ${({ $lit }) => ($lit ? "var(--edu-fg)" : "var(--edu-muted)")};

  @media (max-width: 640px) {
    display: block;
  }
`;

const Node = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 7px; /* centres the 14px dot on the title's first line */
`;

const Dot = styled.span`
  position: relative;
  z-index: 1;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid ${({ $lit }) => ($lit ? "#ffd9a0" : "rgba(255,255,255,0.22)")};
  background: ${({ $lit }) => ($lit ? "#ff9a2e" : "var(--edu-bg)")};
  box-shadow: ${({ $lit }) => ($lit ? "0 0 14px 2px rgba(255,140,40,0.75)" : "none")};
  transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;

  /* the dot for what's still going keeps breathing */
  ${({ $lit, $ongoing }) =>
    $lit && $ongoing
      ? css`
          &::after {
            content: "";
            position: absolute;
            inset: -2px;
            border-radius: 50%;
            border: 2px solid rgba(255, 154, 46, 0.7);
            animation: ${pulse} 2s ease-out infinite;
          }
        `
      : ""}
`;

const Ignite = styled(motion.span)`
  position: absolute;
  top: 7px;
  left: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border-radius: 50%;
  border: 2px solid #ffb15c;
  pointer-events: none;
`;

const Body = styled(motion.div)`
  padding-left: 12px;
  min-width: 0;

  h3 {
    margin: 0 0 6px;
    font-size: 1.35rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 28px;
  }
  p {
    margin: 12px 0 0;
    max-width: 62ch;
    line-height: 1.65;
    color: var(--edu-muted);
  }
`;

const Duration = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: ${({ $ongoing }) => ($ongoing ? "#ffb15c" : "var(--edu-muted)")};

  i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ff9a2e;
    box-shadow: 0 0 8px rgba(255, 140, 40, 0.9);
    animation: ${blink} 1.8s ease-in-out infinite;
  }
`;

const Tags = styled.ul`
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  li {
    padding: 5px 11px;
    border-radius: 999px;
    border: 1px solid var(--edu-border);
    font-size: 0.78rem;
    color: var(--edu-muted);
    transition: border-color 0.2s ease, color 0.2s ease;
  }
  li:hover {
    border-color: rgba(255, 154, 46, 0.5);
    color: var(--edu-fg);
  }
`;