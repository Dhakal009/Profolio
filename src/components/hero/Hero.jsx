import { useEffect, useRef } from 'react';

// Split a word into masked characters for the staggered rise-in
function SplitWord({ text, offset = 0 }) {
  return text.split('').map((ch, i) => (
    <span className="hero-char-mask" key={i} aria-hidden="true">
      <span className="hero-char" style={{ '--ci': i + offset }}>
        {ch}
      </span>
    </span>
  ));
}

function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    let raf = 0;
    const target = { mx: 0, my: 0 };
    const current = { mx: 0, my: 0, sp: -1 };

    const onPointer = (e) => {
      target.mx = e.clientX / window.innerWidth - 0.5;
      target.my = e.clientY / window.innerHeight - 0.5;
    };

    const tick = () => {
      current.mx += (target.mx - current.mx) * 0.06;
      current.my += (target.my - current.my) * 0.06;
      const h = el.offsetHeight || window.innerHeight;
      const sp = Math.min(1, Math.max(0, window.scrollY / h));

      el.style.setProperty('--hx', current.mx.toFixed(4));
      el.style.setProperty('--hy', current.my.toFixed(4));
      if (Math.abs(sp - current.sp) > 0.0005) {
        el.style.setProperty('--hs', sp.toFixed(4));
        current.sp = sp;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div ref={heroRef} className="hero relative w-full h-[100dvh] overflow-hidden select-none bg-[#070708]" role="region" aria-label="Hero Section">
      <div className="hero-head">
        <div className="hero-composition">
          {/* Soft ambient glow behind the portrait */}
          <div className="hero-glow opacity-40" aria-hidden="true" />

          {/* Background name - CLEAN WHITE TEXT */}
          <h1 className="hero-name text-white" id="hero-name" aria-label="Bikash Dhakal">
            <span className="hero-name-word hero-name-word--top">
              <span className="hero-name-shine" data-text="BIKASH">
                <SplitWord text="BIKASH" />
              </span>
            </span>
            <br />
            <span className="hero-name-word hero-name-word--bottom">
              <span className="hero-name-shine" data-text="DHAKAL">
                <SplitWord text="DHAKAL" offset={6} />
              </span>
            </span>
          </h1>

          {/* Portrait */}
          <img className="hero-avatar-front" src="/avatar.png" alt="Bikash Dhakal" />

          {/* Fade into the next section - black fade */}
          <div className="hero-fade !from-[#070708] !to-transparent" aria-hidden="true" />
        </div>

      </div>
    </div>
  );
}

export default Hero;