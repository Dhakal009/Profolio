import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Content – edit the names and `level` (0–100) to match your truth.  */
/*  The levels below are sample values.                                */
/* ------------------------------------------------------------------ */
const GROUPS = [
  {
    id: "frontend",
    title: "Frontend Engineering",
    skills: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "Vue", level: 70 },
      { name: "TypeScript", level: 82 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Redux", level: 78 },
      { name: "Zustand", level: 80 },
    ],
  },
  {
    id: "backend",
    title: "Backend & Database",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Python", level: 70 },
      { name: "PostgreSQL", level: 78 },
      { name: "MongoDB", level: 80 },
      { name: "Redis", level: 62 },
      { name: "Prisma", level: 75 },
      { name: "Docker", level: 68 },
    ],
  },
  {
    id: "animation",
    title: "Animation & UI",
    skills: [
      { name: "Framer Motion", level: 88 },
      { name: "GSAP", level: 85 },
      { name: "Three.js", level: 65 },
      { name: "Figma", level: 80 },
      { name: "Adobe Creative Suite", level: 72 },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Tooling",
    skills: [
      { name: "Git", level: 90 },
      { name: "GitHub Actions", level: 72 },
      { name: "AWS", level: 60 },
      { name: "Vercel", level: 88 },
      { name: "CI/CD pipelines", level: 70 },
      { name: "Jest", level: 68 },
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1];
const FLIP_SPRING = { type: "spring", stiffness: 120, damping: 17, mass: 0.9 };

/* ------------------------------------------------------------------ */
/*  A number that counts up once the card has flipped                  */
/* ------------------------------------------------------------------ */
function Percent({ value, open, delay, reduce }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    const controls = animate(
      mv,
      open ? value : 0,
      reduce ? { duration: 0 } : { duration: open ? 1.1 : 0.25, delay: open ? delay : 0, ease: EASE }
    );
    return () => controls.stop();
  }, [open, value, delay, reduce, mv]);

  return <motion.span>{text}</motion.span>;
}

/* ------------------------------------------------------------------ */
/*  One card: a fixed-size 3D flip, so neighbours never move           */
/* ------------------------------------------------------------------ */
function SkillCard({ group, index, open, onToggle, reduce }) {
  const sorted = [...group.skills].sort((a, b) => b.level - a.level);
  const summary = group.skills.map((s) => s.name).join(", ");
  const num = String(index + 1).padStart(2, "0");
  const rows = Math.ceil(sorted.length / 2);

  // pointer position over the card (0–1), drives the tilt
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotX = useSpring(useTransform(py, [0, 1], [9, -9]), { stiffness: 160, damping: 18 });
  const rotY = useSpring(useTransform(px, [0, 1], [-11, 11]), { stiffness: 160, damping: 18 });

  // lie flat while the back is being read
  useEffect(() => {
    if (open) {
      px.set(0.5);
      py.set(0.5);
    }
  }, [open, px, py]);

  const onMove = (e) => {
    if (open || reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <Scene onPointerMove={onMove} onPointerLeave={onLeave} style={{ order: index }}>
      <Tilt style={reduce ? undefined : { rotateX: rotX, rotateY: rotY }}>
        <Flip
          $open={open}
          initial={false}
          animate={{ rotateY: open ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : FLIP_SPRING}
        >
          {/* FRONT */}
          <Front
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-label={`${group.title}. Flip the card to see skill levels.`}
            inert={open ? true : undefined}
          >
            <FrontInner>
              <Top>
                <Num>{num}</Num>
                <Plus aria-hidden="true" />
              </Top>
              <Title>{group.title}</Title>
              <Summary>{summary}</Summary>
            </FrontInner>
          </Front>

          {/* BACK */}
          <Back
            onClick={onToggle}
            aria-hidden={!open}
            inert={open ? undefined : true}
            role="region"
            aria-label={`${group.title} skill levels`}
          >
            <BackInner>
              <BackHead>
                <span>
                  <Num $hot>{num}</Num>
                  <BackTitle>{group.title}</BackTitle>
                </span>
                <Close
                  type="button"
                  aria-label="Flip back"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                >
                  <Plus $cross aria-hidden="true" />
                </Close>
              </BackHead>

              <Rows style={{ "--rows": rows }}>
                {sorted.map((skill, i) => {
                  const delay = 0.4 + i * 0.05; // wait for the flip to land
                  return (
                    <Row key={skill.name}>
                      <Label>
                        <span>{skill.name}</span>
                        <Value>
                          <Percent value={skill.level} open={open} delay={delay} reduce={reduce} />
                        </Value>
                      </Label>
                      <Track
                        role="progressbar"
                        aria-label={`${skill.name} proficiency`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={skill.level}
                      >
                        <Bar
                          initial={false}
                          animate={{ scaleX: open ? skill.level / 100 : 0 }}
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { duration: open ? 1.1 : 0.25, delay: open ? delay : 0, ease: EASE }
                          }
                        />
                      </Track>
                    </Row>
                  );
                })}
              </Rows>
            </BackInner>
          </Back>
        </Flip>
      </Tilt>
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function Skills({ showHeading = true }) {
  const [openId, setOpenId] = useState(null);
  const reduce = useReducedMotion();

  return (
    <Section aria-labelledby={showHeading ? "skills-heading" : undefined}>
      {showHeading && (
        <Head>
          <h2 id="skills-heading">Skills</h2>
          <p>Select a card to flip it and see how comfortable I am with each tool.</p>
        </Head>
      )}

      <Grid>
        {GROUPS.map((g, i) => (
          <SkillCard
            key={g.id}
            group={g}
            index={i}
            open={openId === g.id}
            reduce={reduce}
            onToggle={() => setOpenId((cur) => (cur === g.id ? null : g.id))}
          />
        ))}
      </Grid>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles – map the CSS variables to your site's theme tokens         */
/* ------------------------------------------------------------------ */
const Section = styled.div`
  --sk-fg: var(--fg, #fafafa);
  --sk-muted: var(--muted, #8b8b92);
  --sk-border: var(--border, rgba(255, 255, 255, 0.1));
  --sk-card: var(--card, #121212);
  --sk-mono: var(--font-mono, "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace);

  width: 100%;
  margin: 0 auto;
  padding: 0;
  color: var(--sk-fg);
`;

const Head = styled.header`
  margin-bottom: 40px;

  h2 {
    margin: 0 0 10px;
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.05;
  }
  p {
    margin: 0;
    color: var(--sk-muted);
  }
`;

/* the grid never changes: every card keeps its slot */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  align-items: stretch;

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

/* perspective lives here so the flip looks properly three-dimensional */
const Scene = styled.div`
  display: grid;
  perspective: 1300px;
`;

const Tilt = styled(motion.div)`
  display: grid;
  transform-style: preserve-3d;
`;

const Flip = styled(motion.div)`
  display: grid; /* front and back share one cell, so the card is as tall as the taller face */
  transform-style: preserve-3d;
  border-radius: 16px;
  box-shadow: ${({ $open }) =>
    $open ? "0 40px 70px -28px rgba(0,0,0,0.85)" : "0 0 0 rgba(0,0,0,0)"};
  transition: box-shadow 0.6s ease;
`;

const face = `
  grid-area: 1 / 1;
  box-sizing: border-box;
  position: relative;
  border-radius: 16px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  background: var(--sk-card);
`;

const Front = styled.button`
  all: unset;
  ${face}
  display: block;
  cursor: pointer;
  border: 1px solid var(--sk-border);
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.24);
  }
  &:focus-visible {
    outline: 2px solid #ff9a2e;
    outline-offset: 2px;
  }
`;

const Back = styled.div`
  ${face}
  transform: rotateY(180deg);
  border: 1px solid rgba(255, 154, 46, 0.4);
  cursor: pointer;
`;

/* contents sit slightly above the card surface for a little parallax */
const FrontInner = styled.span`
  position: relative;
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 28px;
  transform: translateZ(24px);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

const BackInner = styled.div`
  height: 100%;
  box-sizing: border-box;
  padding: 26px 28px 28px;
  transform: translateZ(24px);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

const Top = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Num = styled.span`
  font-family: var(--sk-mono);
  font-size: 0.78rem;
  color: ${({ $hot }) => ($hot ? "#ff9a2e" : "var(--sk-fg)")};
`;

/* plus icon; rotated 45° it becomes the close cross on the back */
const Plus = styled.span`
  position: relative;
  display: block;
  width: 14px;
  height: 14px;
  opacity: 0.55;
  transform: rotate(${({ $cross }) => ($cross ? 45 : 0)}deg);
  transition: opacity 0.3s ease;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: var(--sk-fg);
    border-radius: 1px;
  }
  &::before {
    left: 6px;
    top: 0;
    width: 2px;
    height: 14px;
  }
  &::after {
    top: 6px;
    left: 0;
    width: 14px;
    height: 2px;
  }

  button:hover > span > span > & {
    opacity: 1;
  }
`;

const Title = styled.span`
  align-self: center;
  justify-self: center;
  text-align: center;
  font-size: clamp(1.7rem, 3.4vw, 2.6rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
`;

const Summary = styled.span`
  display: block;
  text-align: center;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--sk-muted);
`;

const BackHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;

  > span {
    display: grid;
    gap: 6px;
  }
`;

const BackTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const Close = styled.button`
  all: unset;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  margin: -6px -8px 0 0;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  &:hover span {
    opacity: 1;
  }
  &:focus-visible {
    outline: 2px solid #ff9a2e;
  }
`;

/* two columns of rows, strongest skills first, reading down the columns */
const Rows = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(var(--rows), auto);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 32px;
  row-gap: 16px;

  @media (max-width: 720px) {
    grid-auto-flow: row;
    grid-template-rows: none;
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Row = styled.div`
  display: grid;
  gap: 8px;
`;

const Label = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 0.9rem;
`;

const Value = styled.span`
  font-family: var(--sk-mono);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  color: var(--sk-muted);
`;

const Track = styled.div`
  height: 3px;
  border-radius: 3px;
  background: var(--sk-border);
  overflow: hidden;
`;

const Bar = styled(motion.div)`
  height: 100%;
  width: 100%;
  border-radius: 3px;
  transform-origin: left center;
  background: linear-gradient(90deg, rgba(250, 250, 250, 0.3), var(--sk-fg));
`;