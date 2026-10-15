import { useState, useEffect, useRef } from 'react';
import FluidGlass from '../ui/FluidGlass';

const SHAPES = ['lens', 'blob', 'torus', 'prism', 'cube', 'diamond', 'pill'];

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
  const [currentShape, setCurrentShape] = useState('lens');
  const [isGlassHidden, setIsGlassHidden] = useState(false);
  const [glassSize, setGlassSize] = useState(300);
  const [headingMetrics, setHeadingMetrics] = useState({
    fontSize: 280,
    lineHeight: 0.82,
    yRatio: 0.5
  });
  const clickTimerRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) setGlassSize(180);
      else if (w < 768) setGlassSize(230);
      else if (w < 1200) setGlassSize(280);
      else setGlassSize(320);

      if (headingRef.current) {
        const style = window.getComputedStyle(headingRef.current);
        const parsedSize = parseFloat(style.fontSize);
        const parsedLineHeight = parseFloat(style.lineHeight);
        const lhRatio = parsedLineHeight && parsedSize ? parsedLineHeight / parsedSize : 0.82;

        const hRect = headingRef.current.getBoundingClientRect();
        const heroEl = headingRef.current.closest('.hero');
        const heroRect = heroEl ? heroEl.getBoundingClientRect() : { top: 0, height: window.innerHeight };
        const centerY = (hRect.top + hRect.height / 2) - heroRect.top;
        const yRatio = heroRect.height > 0 ? centerY / heroRect.height : 0.5;

        setHeadingMetrics({
          fontSize: parsedSize || 280,
          lineHeight: lhRatio,
          yRatio: Math.max(0.1, Math.min(0.9, yRatio))
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(handleResize);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Single click: change refraction glass engine shape
  // Double click: hide / toggle glass engine
  const handleHeroClick = () => {
    if (clickTimerRef.current) {
      // Second click within 240ms => Double Click detected!
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      setIsGlassHidden((prev) => !prev);
    } else {
      // First click => wait 240ms to differentiate single click vs double click
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        if (isGlassHidden) {
          setIsGlassHidden(false);
        } else {
          setCurrentShape((prevShape) => {
            const nextIndex = (SHAPES.indexOf(prevShape) + 1) % SHAPES.length;
            return SHAPES[nextIndex];
          });
        }
      }, 200);
    }
  };

  return (
    <div
      className="hero relative w-full h-[100dvh] overflow-hidden select-none cursor-pointer"
      onClick={handleHeroClick}
      role="region"
      aria-label="Hero Section"
    >
      <div className="hero-head">
        <div className="hero-composition">
          {/* Background Text: enlarged width and height with staggered rise-in */}
          <h1
            ref={headingRef}
            className={`hero-name transition-opacity duration-300 ${
              isGlassHidden ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            id="hero-name"
            aria-label="Bikash Dhakal"
            style={{ zIndex: 1 }}
          >
            <span className="hero-name-word">
              <SplitWord text="BIKASH" />
            </span>
            <br />
            <span className="hero-name-word">
              <SplitWord text="DHAKAL" offset={6} />
            </span>
          </h1>

          {/* FluidGlass Refraction Engine: sits in front of text and behind the avatar */}
          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              isGlassHidden ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'
            }`}
            style={{ zIndex: 2 }}
          >
            <FluidGlass
              text={'BIKASH\nDHAKAL'}
              textColor="#ffffff"
              fontFamily="'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif"
              fontWeight={800}
              lineHeight={headingMetrics.lineHeight}
              fontSize={headingMetrics.fontSize}
              textYRatio={headingMetrics.yRatio}
              textOffsetY={28}
              shape={currentShape}
              shapes={SHAPES}
              onShapeChange={setCurrentShape}
              size={glassSize}
              refraction={1.15}
              dispersion={0.4}
              reflection={1.25}
              shadow={0.55}
              elevation={0.42}
              interaction="follow"
              wobble={0.55}
              smoothness={0.45}
              spin={0.28}
              idle={true}
              morphOnClick={false}
              className="w-full h-full"
            />
          </div>

          {/* Front Avatar: z-index explicitly in front of the text and glass */}
          <img
            className="hero-avatar-front"
            src="/avatar.png"
            alt="Bikash Dhakal"
            style={{ zIndex: 10 }}
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;