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