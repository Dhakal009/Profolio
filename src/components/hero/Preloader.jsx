import { useEffect, useState } from 'react';

/*
 * Full-screen preloader.
 * Sequence: "BIKASH" letters fill (outline -> solid, bottom to top, staggered),
 * the word slides up and "DHAKAL" fills in, then the whole curtain lifts.
 * Phases: 'first' -> 'second' -> 'exit' -> unmounted.
 */
const WORDS = ['BIKASH', 'DHAKAL'];

const TIMING = {
  second: 1500, // first word finished, swap to second
  exit: 3000, // second word finished, lift curtain
  done: 3900, // curtain fully gone
};

function Word({ text, state }) {
  return (
    <span className={`pl-word pl-word--${state}`} aria-hidden="true">
      {text.split('').map((ch, i) => (
        <span className="pl-char" key={i} style={{ '--i': i }}>
          <span className="pl-char-outline">{ch}</span>
          <span className="pl-char-fill">{ch}</span>
        </span>
      ))}
    </span>
  );
}

function Preloader() {
  const [phase, setPhase] = useState('first');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = reduce ? { second: 150, exit: 300, done: 500 } : TIMING;

    document.body.classList.add('is-preloading');

    // Progress counter 0 → 100 synced to the fill sequence
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / t.exit);
      setCount(Math.round((1 - Math.pow(1 - p, 2)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const timers = [
      setTimeout(() => setPhase('second'), t.second),
      setTimeout(() => {
        setPhase('exit');
        document.body.classList.remove('is-preloading');
        document.body.classList.add('is-loaded');
      }, t.exit),
      setTimeout(() => setPhase('done'), t.done),
    ];

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.body.classList.remove('is-preloading');
    };
  }, []);

  if (phase === 'done') return null;

  const firstState = phase === 'first' ? 'active' : 'out';
  const secondState = phase === 'first' ? 'idle' : 'active';

  return (
    <div className={`preloader preloader--${phase}`} role="status" aria-label="Loading Bikash Dhakal">
      <div className="pl-top">
        <span>Portfolio</span>
        <span>©{new Date().getFullYear()}</span>
      </div>

      <div className="pl-stage">
        <Word text={WORDS[0]} state={firstState} />
        <Word text={WORDS[1]} state={secondState} />
      </div>

      <div className="pl-bottom">
        <span>Full Stack Developer</span>
        <span className="pl-count">
          {String(count).padStart(3, '0')}
          <small>%</small>
        </span>
      </div>

      <span className="pl-bar" style={{ transform: `scaleX(${count / 100})` }} aria-hidden="true" />
    </div>
  );
}

export default Preloader;