import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} Bikash Dhakal</p>
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;