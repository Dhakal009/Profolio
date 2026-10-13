import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import CircularCarousel from '../ui/CircularCarousel';

export const DELIVERABLES = [
  {
    id: 'scalable-architecture',
    index: '01',
    title: 'Scalable Architecture',
    subtitle: 'System Design & Structure',
    tag: 'ARCHITECTURE',
    accent: '#38bdf8', // Sky
    description:
      'I architect scalable web systems designed to grow with your business, prioritizing maintainability, modular component boundaries, and long-term developer velocity.',
    highlights: [
      'Modular Component Hierarchies',
      'Clean State Management (Zustand & Redux)',
      'Strict TypeScript Type Safety',
      'Enterprise-Grade Code Maintainability'
    ]
  },
  {
    id: 'pixel-perfect-ui',
    index: '02',
    title: 'Pixel-Perfect UI',
    subtitle: 'Crafted Design Engineering',
    tag: 'INTERFACE',
    accent: '#a855f7', // Purple
    description:
      'Bridging the gap between design and engineering with obsessive attention to micro-interactions, responsive fluidity, typographic rhythm, and design system fidelity.',
    highlights: [
      'Micro-Interactions & Hover Polish',
      'Design Token Systems & Tailwind CSS',
      'Fluid Responsive Typography',
      'Hardware-Accelerated 60+ FPS Motion'
    ]
  },
  {
    id: 'optimized-performance',
    index: '03',
    title: 'Optimized Performance',
    subtitle: 'Sub-Second Speeds',
    tag: 'PERFORMANCE',
    accent: '#22c55e', // Emerald
    description:
      'Lighthouse-optimized applications engineered for speed: intelligent code-splitting, tree-shaking, SSR/SSG caching, and minimal runtime bundle footprints.',
    highlights: [
      '95+ Lighthouse Score Benchmarks',
      'Sub-Second First Contentful Paint',
      'Core Web Vitals Perfection',
      'Asset Optimization & Intelligent Caching'
    ]
  },
  {
    id: 'accessible-by-default',
    index: '04',
    title: 'Accessible by Default',
    subtitle: 'Universal Usability',
    tag: 'A11Y & WCAG',
    accent: '#f59e0b', // Amber
    description:
      'Inclusive digital experiences strictly adhering to WCAG 2.1 AA guidelines, guaranteeing full keyboard navigation, screen-reader semantics, and high-contrast usability.',
    highlights: [
      'WCAG 2.1 AA Compliance Standards',
      'Complete Keyboard Navigation Flow',
      'Semantic ARIA Landmarks & Labels',
      'Reduced Motion & High Contrast Modes'
    ]
  },
  {
    id: 'creative-motion',
    index: '05',
    title: 'Creative Motion & 3D',
    subtitle: 'Immersive Storytelling',
    tag: 'EXPERIENCE',
    accent: '#ec4899', // Pink
    description:
      'Crafting memorable digital narratives using hardware-accelerated WebGL shaders, GSAP timelines, and tactile physical feedback that delight without sacrificing speed.',
    highlights: [
      'Custom GLSL Shaders & WebGL Canvas',
      'Smooth Scroll Choreography',
      'Spatial & Spring Physics Interactions',
      'Zero-Jank GPU Rendering Pipeline'
    ]
  },
  {
    id: 'resilient-apis',
    index: '06',
    title: 'Resilient APIs & Backend',
    subtitle: 'Solid Foundations',
    tag: 'BACKEND & DATA',
    accent: '#6366f1', // Indigo
    description:
      'Designing type-safe endpoints and resilient backend architectures with Node.js and PostgreSQL/MongoDB, built with strict validation and fault-tolerant caching.',
    highlights: [
      'End-to-End Type Safety',
      'Redis Caching & Low-Latency Responses',
      'Schema Design & Migration Strategies',
      'Fault-Tolerant Error Handling & Logging'
    ]
  }
];

/**
 * Helper to wrap text into multiple lines for Canvas
 */
function wrapCanvasText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Generate a bold black & white minimalist card texture
 * Shows ONLY the title, index, and category - no full description, no glassy effects
 */
/**
 * Generate an ultra-clean, minimal typographic card texture
 * Features:
 * - Pure matte obsidian background with crisp rounded border
 * - Clean index (e.g. 01) and category subtitle (no code words or //)
 * - Large, bold, centered title
 * - Zero clutter, zero garbled chips, zero bottom text
 */
function generateDeliverableTexture(item) {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  const w = 1400;
  const h = 1180;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const padX = 100;
  const contentW = w - padX * 2;

  // 1. Clean Matte Obsidian Background
  ctx.fillStyle = '#08080c';
  ctx.fillRect(0, 0, w, h);

  // 2. Minimal Subtle Inset Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(24, 24, w - 48, h - 48, 36);
  ctx.stroke();

  // 3. Top Header: Clean Index & Subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '600 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText(`${item.index}`, padX, 88);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '600 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const tagText = item.subtitle;
  const tagW = ctx.measureText(tagText).width;
  ctx.fillText(tagText, w - padX - tagW, 92);

  // 4. Center: Bold Pure White Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 122px "Inter Tight", "Space Grotesk", -apple-system, sans-serif';
  ctx.textBaseline = 'middle';

  const titleLines = wrapCanvasText(ctx, item.title, contentW);
  const lineH = 140;
  const totalTitleH = titleLines.length * lineH;
  const startY = h / 2 - totalTitleH / 2 + 12;

  titleLines.forEach((line, i) => {
    ctx.fillText(line, padX, startY + i * lineH + lineH / 2);
  });

  return canvas.toDataURL('image/png');
}

export default function DeliverablesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const carouselApiRef = useRef(null);

  // Check for WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Generate carousel item data with custom canvas textures
  const carouselItems = useMemo(() => {
    return DELIVERABLES.map((d) => ({
      ...d,
      src: generateDeliverableTexture(d, DELIVERABLES.length),
      alt: `${d.title} — ${d.subtitle}`,
      title: d.title,
      subtitle: d.subtitle
    }));
  }, []);

  const activeDeliverable = DELIVERABLES[activeIndex] || DELIVERABLES[0];

  const handleCardClick = useCallback((index) => {
    setActiveIndex(index);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const handlePrev = useCallback(() => {
    const prevIdx = activeIndex > 0 ? activeIndex - 1 : DELIVERABLES.length - 1;
    setActiveIndex(prevIdx);
    carouselApiRef.current?.goTo?.(prevIdx);
  }, [activeIndex]);

  const handleNext = useCallback(() => {
    const nextIdx = activeIndex < DELIVERABLES.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(nextIdx);
    carouselApiRef.current?.goTo?.(nextIdx);
  }, [activeIndex]);

  const handleDotClick = useCallback((index) => {
    setActiveIndex(index);
    carouselApiRef.current?.goTo?.(index);
  }, []);

  // Listen for keyboard navigation in modal
  useEffect(() => {
    const onKey = (e) => {
      if (!isDetailOpen) return;
      if (e.key === 'Escape') handleCloseDetail();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDetailOpen, handleCloseDetail, handlePrev, handleNext]);

  return (
    <div
      className="deliverables-section relative flex h-full min-h-[100dvh] w-full flex-col justify-center overflow-hidden select-none bg-[#050508]"
    >
      {/* 3D CircularCarousel from React Bits — 3D Cylinder Ring with Curvature & Depth */}
      {hasWebGL ? (
        <div className="relative h-screen min-h-[100dvh] w-full overflow-hidden flex items-center justify-center">
          <CircularCarousel
            carouselRef={carouselApiRef}
            items={carouselItems}
            preset="cylinder"
            intro="rise"
            cardWidth={720}
            aspectRatio={1.18}
            gap={42}
            tilt={-4}
            perspective={2400}
            speed={10}
            autoplay="drift"
            pauseOnHover={true}
            focusOnClick={true}
            draggable={true}
            captureWheel={true}
            momentum={0.6}
            snap={true}
            parallax={0.35}
            stretch={0.3}
            depthFade={0.72}
            fadeColor="#000000"
            innerShade={0.9}
            cornerRadius={24}
            captions={false}
            onChange={(idx) => setActiveIndex(idx)}
            onItemClick={(_item, idx) => handleCardClick(idx)}
            className="w-full h-full"
          />

          {/* Floating Left Navigation Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="pointer-events-auto absolute left-3 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/75 backdrop-blur-xl transition hover:border-white/40 hover:bg-black/90 hover:text-white hover:scale-105 active:scale-95 shadow-xl"
            aria-label="Previous deliverable"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Floating Right Navigation Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            className="pointer-events-auto absolute right-3 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/75 backdrop-blur-xl transition hover:border-white/40 hover:bg-black/90 hover:text-white hover:scale-105 active:scale-95 shadow-xl"
            aria-label="Next deliverable"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Minimal Floating Bottom Bar: Pagination Dots positioned clearly above dock */}
          <div className="pointer-events-none absolute bottom-16 sm:bottom-20 inset-x-0 z-20 flex justify-center">
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/50 px-3.5 py-1.5 backdrop-blur-xl">
              {DELIVERABLES.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleDotClick(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-7 bg-white shadow-sm'
                      : 'w-1.5 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`Go to ${item.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Accessible Fallback Grid for Non-WebGL Environments */
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCardClick(idx)}
                className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-[#08080a] p-8 text-left transition hover:border-white/25 hover:bg-[#0e0e13] focus-visible:outline-2 focus-visible:outline-white shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span className="font-semibold text-white/60">{item.index}</span>
                    <span className="text-white/50">{item.subtitle}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-white group-hover:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ultra-Minimal Detailed Modal — ONLY REVEALED ON CARD CLICK */}
      {isDetailOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="deliverable-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={handleCloseDetail}
        >
          <div
            className="relative max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#0c0c12] p-6 shadow-2xl transition sm:p-9"
            style={{
              boxShadow: `0 30px 80px -20px ${activeDeliverable.accent}30`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleCloseDetail}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/15 hover:text-white"
              aria-label="Close details"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2.5 font-mono text-xs text-white/50">
              <span className="font-semibold">{activeDeliverable.index}</span>
              <span>•</span>
              <span
                className="rounded-full px-2.5 py-0.5"
                style={{
                  backgroundColor: `${activeDeliverable.accent}15`,
                  color: activeDeliverable.accent
                }}
              >
                {activeDeliverable.tag}
              </span>
            </div>

            <h3
              id="deliverable-modal-title"
              className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {activeDeliverable.title}
            </h3>
            <p className="mt-1 text-xs text-white/50">{activeDeliverable.subtitle}</p>

            {/* Core Description */}
            <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.025] p-5">
              <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                {activeDeliverable.description}
              </p>
            </div>

            {/* Key Capabilities Pills */}
            <div className="mt-5">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white/40">
                Key Standards & Practices
              </h4>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {activeDeliverable.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-white/75"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: activeDeliverable.accent }}
                    />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer with Carousel Switcher Controls */}
            <div className="mt-7 flex items-center justify-between border-t border-white/5 pt-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Previous deliverable"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Next deliverable"
                >
                  Next →
                </button>
              </div>

              <button
                type="button"
                onClick={handleCloseDetail}
                className="rounded-lg px-4 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: activeDeliverable.accent }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
