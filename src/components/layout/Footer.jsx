import { useNavigate, useLocation } from 'react-router-dom';
import { useLenis } from '../../contexts/LenisContext';

const SITEMAP = [
  { label: 'Home', to: '/', targetId: 'hero' },
  { label: 'Works', to: '/#projects', targetId: 'projects' },
  { label: 'About', to: '/#about', targetId: 'about' },
  { label: 'Terminal', to: '/#about', targetId: 'about' },
];

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/bikash-dhakal' },
  { label: 'GitHub', href: 'https://github.com/Dhakal009' },
  { label: 'Twitter / X', href: 'https://twitter.com' },
];

const INFOS = [
  { label: 'Kathmandu, Nepal', href: null },
  { label: 'UTC+05:45 (NPT)', href: null },
  { label: 'Resume (PDF)', href: '/resume.pdf' },
];

function Footer() {
  const { lenis } = useLenis();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (item) => {
    if (location.pathname === '/' && item.targetId) {
      const el = document.getElementById(item.targetId);
      if (el) {
        if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.2 });
        else el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (item.targetId) {
      navigate('/', { state: { scrollTo: item.targetId } });
    } else {
      navigate(item.to);
    }
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-container">
        {/* Top Header Row with Columns & Let's Work Together */}
        <div className="footer-top-row">
          <div className="footer-columns">
            {/* 01 SITEMAP */}
            <div className="footer-col">
              <span className="footer-col-header">
                <span className="footer-col-num">01</span> SITEMAP
              </span>
              <ul className="footer-col-links">
                {SITEMAP.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      className="footer-link-text"
                      onClick={() => handleNav(item)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 02 SOCIALS */}
            <div className="footer-col">
              <span className="footer-col-header">
                <span className="footer-col-num">02</span> SOCIALS
              </span>
              <ul className="footer-col-links">
                {SOCIALS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith('mailto:') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className="footer-link-text"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 03 INFOS */}
            <div className="footer-col">
              <span className="footer-col-header">
                <span className="footer-col-num">03</span> INFOS
              </span>
              <ul className="footer-col-links">
                {INFOS.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('mailto:') ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="footer-link-text"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="footer-info-text">{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Giant Typography Hero Section */}
        <div className="footer-hero-section">
          <div className="footer-eyebrow">
            <span className="footer-eyebrow-left">
              FULL STACK DEVELOPER / CREATIVE TECHNOLOGIST
            </span>
            <span className="footer-eyebrow-right">
              PORTFOLIO 2026
            </span>
          </div>

          <h2 className="footer-giant-name">
            BIKASH DHAKAL
          </h2>
        </div>

        {/* Bottom Credits */}
        <div className="footer-bottom-row">
          <span className="footer-bottom-credits">
            INFOS &amp; CREDITS © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;