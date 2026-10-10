import Hero from '../components/hero/Hero';
import LinuxTerminal from '../components/terminal/LinuxTerminal';
import LogoLoop from '../components/ui/LogoLoop';
import { techLogos } from '../components/ui/TechLogos';
import SelectedWorkScroll from '../components/home/SelectedWorkScroll';
import DeliverablesSection from '../components/home/DeliverablesSection';

const highlights = [
  { title: 'Frontend Architecture', text: 'Building scalable React applications with TypeScript, modern state management, and optimized asset delivery.' },
  { title: 'Backend & APIs', text: 'Designing robust RESTful and GraphQL APIs using Node.js, Express, and PostgreSQL/MongoDB.' },
  { title: 'Creative Development', text: 'Crafting immersive digital experiences with WebGL, GSAP, and advanced CSS animations.' },
];

const education = [
  { years: '2019 — 2023', title: 'B.Sc in Computer Science & Information Technology', text: 'Specialized in Software Engineering, Advanced Web Technologies, and Human-Computer Interaction.' },
  { years: '2023 — Present', title: 'Continuous Learning & Open Source', text: 'Actively contributing to open-source UI libraries and exploring AI-driven development workflows.' },
];

const skills = [
  { title: 'Frontend Engineering', desc: 'React, Next.js, Vue, TypeScript, Tailwind CSS, Redux, Zustand' },
  { title: 'Backend & Database', desc: 'Node.js, Python, PostgreSQL, MongoDB, Redis, Prisma, Docker' },
  { title: 'Animation & UI', desc: 'Framer Motion, GSAP, Three.js, Figma, Adobe Creative Suite' },
  { title: 'DevOps & Tooling', desc: 'Git, GitHub Actions, AWS, Vercel, CI/CD pipelines, Jest' },
];


const pad = (n) => String(n).padStart(2, '0');

function Section({ id, title, children }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container section-centered">
        <h2 className="sr-only" id={`${id}-title`}>{title}</h2>
        <div className="section-content">{children}</div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <section id="hero" aria-labelledby="hero-name">
        <Hero />
      </section>

      <Section id="about" title="About">
        <LinuxTerminal />
      </Section>

      <Section id="experience" title="Experience">
        <article className="card exp-card reveal">
          <div className="exp-head">
            <h3 className="exp-role">Independent Freelance Developer</h3>
            <span className="exp-meta">
              <span className="status-dot" aria-hidden="true" /> Open to opportunities
            </span>
          </div>
          <p className="exp-desc">
            Collaborating with global clients and agencies to deliver high-performance web applications, from interactive marketing sites to complex SaaS dashboards.
          </p>
        </article>
        <div className="highlights reveal">
          {highlights.map((h) => (
            <article key={h.title} className="highlight">
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <SelectedWorkScroll />

      <Section id="education" title="Education">
        <ol className="timeline">
          {education.map((e) => (
            <li key={e.title} className="timeline-item reveal">
              <span className="timeline-year">{e.years}</span>
              <div className="timeline-body">
                <h3>{e.title}</h3>
                <p>{e.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="skills" title="Skills">
        <div className="skills-grid">
          {skills.map((s, i) => (
            <article key={s.title} className="card skill-card reveal">
              <span className="skill-num">{pad(i + 1)}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
        <div className="reveal" style={{ marginTop: '2.5rem' }}>
          <LogoLoop
            logos={techLogos}
            speed={60}
            direction="left"
            logoHeight={40}
            gap={20}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="var(--bg)"
            ariaLabel="Technology stack and developer tools"
          />
        </div>
      </Section>

      <section
        id="deliver"
        className="relative w-full h-screen min-h-[100dvh] overflow-hidden"
        aria-label="What I Deliver"
      >
        <h2 className="sr-only">What I Deliver</h2>
        <DeliverablesSection />
      </section>

      <Section id="contact" title="Contact">
        <p className="contact-lead reveal">
          Whether you have a project in mind, a freelance opportunity, or just want to connect — my inbox is always open. Let's build something extraordinary together.
        </p>
        <a href="mailto:bikashdhakal546@gmail.com" className="contact-email reveal" aria-label="Email Bikash">
          bikashdhakal546@gmail.com
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M17 7H9M17 7v8" />
          </svg>
        </a>
        <div className="contact-links reveal">
          <a href="#" className="btn btn--ghost" aria-label="GitHub profile">GitHub</a>
          <a href="#" className="btn btn--ghost" aria-label="LinkedIn profile">LinkedIn</a>
          <a href="#" className="btn btn--ghost" aria-label="Twitter profile">Twitter</a>
        </div>
      </Section>
    </>
  );
}

export default Home;
