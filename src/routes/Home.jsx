import { useRef } from 'react';
import Hero from '../components/hero/Hero';
import AboutSection from '../components/about/AboutSection';
import LogoLoop from '../components/ui/LogoLoop';
import { techLogos } from '../components/ui/TechLogos';
import ProjectGallery from '../ProjectGallery/ProjectGallery';
import DeliverablesSection from '../components/home/DeliverablesSection';
import Skills from '../components/ui/Skills.jsx';
import ThreeCanvas from '../components/canvas/ThreeCanvas';
import {
  SECTION_NAV,
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
  const projectsRef = useRef(null);
  useSectionFocus(SECTION_IDS);

  return (
    <>
      <ThreeCanvas activeSection="hero" />

      <section id="hero" aria-labelledby="hero-name">
        <Hero />
      </section>

      <Section id="about" title="About">
        <AboutSection />
      </Section>

      <section
        id="projects"
        ref={projectsRef}
        className="relative w-full focus-section"
        style={{ height: '350vh' }}
        aria-labelledby="projects-title"
      >
        <h2 className="sr-only" id="projects-title">Featured Projects</h2>
        <div className="sticky top-0 w-full h-screen min-h-[100dvh] overflow-hidden">
          <ProjectGallery isEmbedded={true} containerRef={projectsRef} />
        </div>
      </section>

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
        <span className="contact-eyebrow font-mono text-xs uppercase tracking-widest text-muted mb-4 block reveal">
          Get In Touch
        </span>
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
          <a
            href="https://github.com/Dhakal009"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-icon-btn"
            aria-label="GitHub profile"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/bikash-dhakal"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-icon-btn"
            aria-label="LinkedIn profile"
            title="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74v-8.37H5.06v8.37h2.8z" />
            </svg>
          </a>
          <a
            href="https://twitter.com/bikash_dhakal"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-icon-btn"
            aria-label="Twitter / X profile"
            title="Twitter / X"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </Section>
    </>
  );
}

export default Home;