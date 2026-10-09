import { Link } from 'react-router-dom';

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M17 7H9M17 7v8" />
  </svg>
);

// Split a word into masked characters for the staggered rise-in
function SplitWord({ text, offset = 0 }) {
  return text.split('').map((ch, i) => (
    <span className="hero-char-mask" key={i} aria-hidden="true">
      <span className="hero-char" style={{ '--ci': i + offset }}>{ch}</span>
    </span>
  ));
}

function Hero() {
  return (
    <div className="hero">
      <div className="hero-head">
        <p className="hero-meta" data-hero style={{ '--d': '0.05s' }}>
          <span>Full Stack Developer</span>
          <span className="hero-chip">Kathmandu, Nepal</span>
          <span className="hero-meta-status">
            <span className="status-dot" aria-hidden="true" /> Available <em>for</em> Work
          </span>
        </p>
        
        <div className="hero-composition">
          <h1 className="hero-name" id="hero-name" aria-label="Bikash Dhakal">
            <span className="hero-name-word">
              <SplitWord text="BIKASH" />
            </span>
            <br />
            <span className="hero-name-word">
              <SplitWord text="DHAKAL" offset={6} />
            </span>
          </h1>
          <img className="hero-avatar-front" src="/avatar.png" alt="Bikash Dhakal" />
        </div>
      </div>
    </div>
  );
}

export default Hero;