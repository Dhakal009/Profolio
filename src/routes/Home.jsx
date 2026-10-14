import Hero from '../components/hero/Hero';
import LinuxTerminal from '../components/terminal/LinuxTerminal';
import LogoLoop from '../components/ui/LogoLoop';
import { techLogos } from '../components/ui/TechLogos';
import SelectedWorkScroll from '../components/home/SelectedWorkScroll';
import DeliverablesSection from '../components/home/DeliverablesSection';
import Skills from '../components/ui/Skills.jsx';
import ThreeCanvas from '../components/canvas/ThreeCanvas';
import {
  SECTION_NAV,
  ScrollProgress,
  useSectionFocus,
} from '../components/ui/SectionFocus.jsx';

const SECTION_IDS = SECTION_NAV.map((s) => s.id);

function Section({ id, title, children }) {
  return (
    <section id={id} className="section focus-section" aria-labelledby={`${id}-title`}>
      <div className="container section-centered">
        <h2 className="sr-only" id={`${id}-title`}>{title}</h2>
        <div className="section-content">{children}</div>
      </div>
    </section>
  );
}

function Home() {
  useSectionFocus(SECTION_IDS);

  return (
    <>
      <ThreeCanvas activeSection="hero" />
      <ScrollProgress />

      <section id="hero" aria-labelledby="hero-name">
        <Hero />
      </section>

      <Section id="about" title="About">
        <LinuxTerminal />
      </Section>

      {/* <Section id="experience" title="Experience">
        <Experience />
      </Section> */}

      <SelectedWorkScroll />

      <Section id="skills" title="Skills">
        <Skills />
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
          Whether you have a project in mind, a freelance opportunity, or just want to connect — my inbox is always open. Let&apos;s build something extraordinary together.
        </p>
        <a href="mailto:bikashdhakal546@gmail.com" className="contact-email reveal" aria-label="Email Bikash">
          bikashdhakal546@gmail.com
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M17 7H9M17 7v8" />
          </svg>
        </a>
        <div className="contact-links reveal">
          <a href="https://github.com/Dhakal009" target="_blank" rel="noopener noreferrer" className="btn btn--ghost" aria-label="GitHub profile">GitHub</a>
          <a href="https://linkedin.com/in/bikash-dhakal" target="_blank" rel="noopener noreferrer" className="btn btn--ghost" aria-label="LinkedIn profile">LinkedIn</a>
          <a href="https://twitter.com/bikash_dhakal" target="_blank" rel="noopener noreferrer" className="btn btn--ghost" aria-label="Twitter profile">Twitter</a>
        </div>
      </Section>
    </>
  );
}

export default Home;