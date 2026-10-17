import { useEffect, useRef } from 'react';
import './hero-parallax.css';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

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
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const finePointer = window.matchMedia?.('(pointer: fine)').matches;

    // target = where the value should be, cur = eased value actually shown
    const target = { mx: 0, my: 0, sp: 0 };
    const cur = { mx: 0, my: 0, sp: 0 };
    const EPS = 0.0004;

    let height = el.offsetHeight || window.innerHeight;
    let raf = 0;

    // Scroll progress of the hero: 0 = fully in view, 1 = scrolled past.
    const readScroll = () => {
      target.sp = clamp(-el.getBoundingClientRect().top / height, 0, 1);
    };

    const write = () => {
      el.style.setProperty('--hx', cur.mx.toFixed(4));
      el.style.setProperty('--hy', cur.my.toFixed(4));
      el.style.setProperty('--hs', cur.sp.toFixed(4));
    };

    // Runs only while something is still easing, then stops by itself.
    const frame = () => {
      cur.mx += (target.mx - cur.mx) * 0.06;
      cur.my += (target.my - cur.my) * 0.06;
      cur.sp += (target.sp - cur.sp) * 0.12;

      const settled =
        Math.abs(target.mx - cur.mx) < EPS &&
        Math.abs(target.my - cur.my) < EPS &&
        Math.abs(target.sp - cur.sp) < EPS;

      if (settled) {
        cur.mx = target.mx;
        cur.my = target.my;
        cur.sp = target.sp;
        write();
        raf = 0;
        return;
      }
      write();
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      readScroll();
      wake();
    };

    const onPointer = (e) => {
      target.mx = e.clientX / window.innerWidth - 0.5;
      target.my = e.clientY / window.innerHeight - 0.5;
      wake();
    };

    const onLeave = () => {
      target.mx = 0;
      target.my = 0;
      wake();
    };

    const ro = new ResizeObserver(() => {
      height = el.offsetHeight || window.innerHeight;
      onScroll();
    });
    ro.observe(el);

    window.addEventListener('scroll', onScroll, { passive: true });
    if (finePointer) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }

    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
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