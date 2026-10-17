import { useRef } from 'react';
import Hero from '../components/hero/Hero';
import AboutSection from '../components/about/AboutSection';
import LogoLoop from '../components/ui/LogoLoop';
import { techLogos } from '../components/ui/TechLogos';
import ProjectGallery from '../ProjectGallery/ProjectGallery';
import DeliverablesSection from '../components/home/DeliverablesSection';
import Skills from '../components/ui/Skills.jsx';
import ParallaxSection from '../components/ui/ParallaxSection.jsx';
import StackSection from '../components/ui/StackSection.jsx';

import { ReactLenis, useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  SECTION_NAV,
  useSectionFocus,
} from '../components/ui/SectionFocus.jsx';

const SECTION_IDS = SECTION_NAV.map((s) => s.id);

// Keeps GSAP ScrollTrigger (used in AboutSection) in step with the one Lenis
// instance that ReactLenis provides. Must render inside <ReactLenis>.
function LenisScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

function Home() {
  const projectsRef = useRef(null);
  useSectionFocus(SECTION_IDS);

  return (
    <ReactLenis root options={{
      lerp: 0.07,
      duration: 1.5,
      smoothWheel: true,
      smoothTouch: false,
      gestureOrientation: "vertical"
    }}>
      <LenisScrollTriggerSync />

      {/* All stacked sections must be siblings inside this one wrapper */}
      <div className="stack-root">
        {/* Hero with reveal animation */}
        <StackSection radius={0}>
          <motion.section
            id="hero"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            aria-labelledby="hero-name"
          >
            <Hero />
          </motion.section>
        </StackSection>

        {/* 1. rises from the bottom */}
        <StackSection entrance="bottom">
          <AboutSection />
        </StackSection>

        {/* 2. right → left (straight in from the right) */}
        <StackSection entrance="rightMid">
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
        </StackSection>

        {/* 3. Projects fades out first, then Skills rises from the bottom */}
        <StackSection entrance="fadeBottom">
          <ParallaxSection id="skills" title="Skills" offset={80}>
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
          </ParallaxSection>
        </StackSection>

        {/* 4. rises from the bottom */}
        <StackSection entrance="bottom">
          <ParallaxSection id="deliver" title="What I Deliver" offset={60}>
            <DeliverablesSection />
          </ParallaxSection>
        </StackSection>

        {/* 5. rises from the bottom */}
        <StackSection entrance="bottom">
          <ParallaxSection id="contact" title="Contact" offset={70}>
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
              {/* your github/linkedin/x icons ... keep same */}
            </div>
          </ParallaxSection>
        </StackSection>
      </div>
    </ReactLenis>
  );
}

export default Home;