import { Link } from 'react-router-dom';

const projects = [
  {
    title: 'Aether E-Commerce',
    description: 'A headless e-commerce experience with sub-second page loads. Features custom WebGL product viewers, seamless Stripe integration, and dynamic inventory sync.',
    tech: ['Next.js', 'TypeScript', 'Three.js', 'Stripe'],
    link: '#',
    github: '#',
    status: 'Live',
  },
  {
    title: 'Lumina Dashboard',
    description: 'Enterprise-grade analytics dashboard for SaaS metrics. Includes real-time data visualization, customizable drag-and-drop widgets, and strict role-based access control.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Framer Motion'],
    link: '#',
    github: '#',
    status: 'Live',
  },
  {
    title: 'Vortex Portfolio',
    description: 'Award-winning creative portfolio showcasing advanced CSS and WebGL techniques. Features smooth scroll hijacking, custom cursors, and complex staggering animations.',
    tech: ['HTML/CSS', 'GSAP', 'WebGL', 'Lenis'],
    link: '#',
    github: '#',
    status: 'Live',
  },
  {
    title: 'Syntax OS',
    description: 'A web-based operating system simulation built entirely in the browser. Supports window management, a virtual file system, and custom themes.',
    tech: ['React', 'Redux Toolkit', 'Styled Components'],
    link: '#',
    github: '#',
    status: 'In Development',
  },
];

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M17 7H9M17 7v8" />
  </svg>
);

function Projects() {
  return (
    <>
      <section className="page-hero" aria-labelledby="projects-title">
        <div className="container">
          <span className="section-index reveal">Selected work</span>
          <h1 className="page-title reveal" id="projects-title">Projects</h1>
          <p className="page-desc reveal">
            A curated selection of my most impactful projects, ranging from high-performance web applications and enterprise tools to immersive creative experiences.
          </p>
        </div>
      </section>

      <section className="section" aria-label="Project list">
        <div className="container">
          <div className="projects-list">
            {projects.map((project, i) => (
              <article key={project.title} className="card project-card reveal">
                <div className="project-top">
                  <span className="project-status">
                    <span className={`status-dot ${project.status === 'Live' ? '' : 'status-dot--muted'}`} aria-hidden="true" />
                    {project.status}
                  </span>
                  <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
                </div>

                <h2 className="project-title">{project.title}</h2>
                <p className="project-desc">{project.description}</p>

                <div className="project-tech">
                  {project.tech.map((tech) => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>

                <div className="project-links">
                  <a href={project.link} className="project-link" aria-label={`View ${project.title} live`}>
                    Live <ArrowUpRight />
                  </a>
                  <a href={project.github} className="project-link" aria-label={`View ${project.title} source on GitHub`}>
                    Source <ArrowUpRight />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-block reveal">
            <h2 id="cta-title">Let's build something together</h2>
            <p>
              I'm actively taking on new projects and looking for exciting collaborations. Whether it's a completely new platform or optimizing an existing app, I'm here to help.
            </p>
            <Link to="/#contact" className="btn btn--primary">
              Start a Conversation <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Projects;
