import { useNavigate, Link } from 'react-router-dom';
import { PROJECTS as projects } from '../data/projects';

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M17 7H9M17 7v8" />
  </svg>
);

function Projects() {
  const navigate = useNavigate();
  return (
    <>
      <section className="page-hero" aria-label="Selected work header">
        <div className="container page-hero-content">
          <span className="section-index reveal">Selected Work</span>
          <h1 className="page-title reveal">Projects that move<br />ideas forward.</h1>
          <p className="page-desc reveal">
            A focused selection of full-stack products, interfaces, and experiments built with care for clarity, speed, and useful details.
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
                  <Link
                    to={project.link}
                    className="project-link"
                    aria-label={`Launch ${project.title} live demo`}
                  >
                    Live Demo <ArrowUpRight />
                  </Link>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                    aria-label={`View ${project.title} source code on GitHub`}
                  >
                    Source Code <ArrowUpRight />
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
            <button
              type="button"
              onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
              className="btn btn--primary"
            >
              Start a Conversation <ArrowUpRight />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Projects;
