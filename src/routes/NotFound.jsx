import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="container not-found-content">
        <p className="not-found-code">404 / PAGE NOT FOUND</p>
        <h1 id="not-found-title" className="not-found-title">
          This page took a wrong turn.
        </h1>
        <p className="not-found-description">
          The page you are looking for does not exist or may have moved. Let&apos;s get you back on track.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn--primary">
            Back to home
          </Link>
          <Link to="/projects" className="btn btn--ghost">
            Explore projects
          </Link>
        </div>
      </div>
    </section>
  );
}
