'use client';

import { useEffect, useRef } from 'react';

const hexToRgb = (hex) => {
  const clean = (hex || '#ffffff').replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return { r: 255, g: 255, b: 255 };
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
};

const mixRgb = (from, to, amount) => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount),
});

const rgbToCss = (rgb) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const resolveFontSize = (value, container) => {
  if (typeof value === 'number') return value;
  try {
    const probe = document.createElement('span');
    probe.textContent = 'M';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    probe.style.fontSize = value;
    (container || document.body).appendChild(probe);
    const size = parseFloat(window.getComputedStyle(probe).fontSize) || 120;
    probe.remove();
    return size;
  } catch {
    return 120;
  }
};

const getFontFamily = (container) => {
  try {
    const computed = window.getComputedStyle(container || document.body);
    const fam = computed.fontFamily;
    if (fam && !fam.includes('var(')) return fam;
  } catch {}
  return "'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif";
};

const ParticleText = ({
  text = 'BIKASH\nDHAKAL',
  particleSize = 2.4,
  density = 3,
  color = '#ededed',
  highlightColor = '#38bdf8',
  scatter = 160,
  gatherDuration = 1400,
  stagger = 320,
  pointerRepel = 45,
  repelRadius = 140,
  idleDrift = 0.6,
  trigger = 'hover',
  fontSize = 'clamp(4rem, 16vw, 13rem)',
  fontWeight = 800,
  fontFamily = 'inherit',
  glow = true,
  className = '',
  style,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let particles = [];
    let animationFrame = null;
    let resizeTimer = null;
    let gathering = true;
    let gatherStart = performance.now();
    let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0,
    };

    const startGather = (fromScatter = true) => {
      if (!particles.length) return;
      const now = performance.now();
      const spread = reducedMotion ? 0 : scatter;

      particles.forEach((particle) => {
        if (fromScatter) {
          const angle = particle.seed * Math.PI * 2;
          const distance = spread * (0.4 + particle.depth * 0.8);
          particle.x = particle.targetX + Math.cos(angle) * distance;
          particle.y = particle.targetY + Math.sin(angle) * distance;
        }
        particle.startX = particle.x;
        particle.startY = particle.y;
        particle.delay = reducedMotion ? 0 : particle.seed * stagger;
      });

      gatherStart = now;
      gathering = true;
    };

    const drawParticle = (particle) => {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = (now) => {
      ctx.clearRect(0, 0, width, height);

      if (glow && !reducedMotion) {
        ctx.shadowBlur = Math.min(12, particleSize * 3);
        ctx.shadowColor = highlightColor;
      } else {
        ctx.shadowBlur = 0;
      }

      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.2;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.2;

      let complete = true;

      particles.forEach((particle) => {
        let baseX = particle.targetX;
        let baseY = particle.targetY;
        let progress = 1;

        if (gathering) {
          const elapsed = now - gatherStart - particle.delay;
          const local = elapsed / Math.max(1, reducedMotion ? 1 : gatherDuration);
          progress = clamp(local, 0, 1);
          const eased = easeOutCubic(progress);
          baseX = particle.startX + (particle.targetX - particle.startX) * eased;
          baseY = particle.startY + (particle.targetY - particle.startY) * eased;
          if (progress < 1) complete = false;
        } else if (!reducedMotion && idleDrift > 0) {
          const driftTime = now * 0.001;
          baseX += Math.sin(driftTime * 0.9 + particle.seed * 10) * idleDrift * particle.depth;
          baseY += Math.cos(driftTime * 0.75 + particle.depth * 10) * idleDrift * particle.depth;
        }

        if (pointer.active && !reducedMotion && pointerRepel > 0 && repelRadius > 0) {
          const dx = baseX - pointer.smoothX;
          const dy = baseY - pointer.smoothY;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < repelRadius) {
            const force = Math.pow(1 - dist / repelRadius, 2) * pointerRepel;
            baseX += (dx / dist) * force;
            baseY += (dy / dist) * force;
          }
        }

        const follow = reducedMotion ? 1 : 0.25;
        particle.x += (baseX - particle.x) * follow;
        particle.y += (baseY - particle.y) * follow;

        ctx.globalAlpha = clamp(0.4 + progress * 0.6, 0, 1);
        drawParticle(particle);
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (gathering && complete) {
        gathering = false;
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const sampleText = () => {
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width) || window.innerWidth || 1200;
      height = Math.floor(rect.height) || window.innerHeight || 800;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const resolvedFamily = getFontFamily(container);
      let resolvedSize = resolveFontSize(fontSize, container);
      let font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;

      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offscreen.width = width;
      offscreen.height = height;

      const lines = String(text || ' ').split('\n');
      const maxTextWidth = width * 0.92;
      offCtx.font = font;

      let widest = 0;
      lines.forEach((l) => {
        const w = offCtx.measureText(l).width;
        if (w > widest) widest = w;
      });

      if (widest > maxTextWidth && widest > 0) {
        resolvedSize = Math.max(24, Math.floor(resolvedSize * (maxTextWidth / widest)));
        font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;
        offCtx.font = font;
      }

      const lineStep = resolvedSize * 0.88;
      const totalBlockHeight = lineStep * (lines.length - 1);
      const startY = height / 2 - totalBlockHeight / 2;

      offCtx.clearRect(0, 0, width, height);
      offCtx.font = font;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#ffffff';

      lines.forEach((line, i) => {
        offCtx.fillText(line, width / 2, startY + i * lineStep);
      });

      const imageData = offCtx.getImageData(0, 0, width, height);
      const targets = [];
      const step = Math.max(2, Math.floor(density));

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const alpha = imageData.data[(y * width + x) * 4 + 3];
          if (alpha > 35) {
            targets.push({
              x,
              y,
              alpha: alpha / 255,
            });
          }
        }
      }

      const maxParticles = 3800;
      const stride = Math.max(1, Math.ceil(targets.length / maxParticles));
      const baseRgb = hexToRgb(color);
      const highlightRgb = hexToRgb(highlightColor);
      const selected = targets.filter((_, idx) => idx % stride === 0);

      particles = selected.map((target, idx) => {
        const seed = ((idx * 9301 + 49297) % 233280) / 233280;
        const depth = 0.5 + (((idx * 233 + 97) % 1000) / 1000) * 0.8;
        const blend = clamp(target.x / Math.max(1, width) + (seed - 0.5) * 0.35, 0, 1);
        const particleColor = rgbToCss(mixRgb(baseRgb, highlightRgb, blend));
        const angle = seed * Math.PI * 2;
        const distance = (reducedMotion ? 0 : scatter) * (0.35 + depth * 0.75);
        const startX = target.x + Math.cos(angle) * distance;
        const startY = target.y + Math.sin(angle) * distance;

        return {
          x: reducedMotion ? target.x : startX,
          y: reducedMotion ? target.y : startY,
          startX,
          startY,
          targetX: target.x,
          targetY: target.y,
          size: Math.max(0.8, particleSize * (0.8 + target.alpha * 0.4)),
          color: particleColor,
          seed,
          depth,
          delay: seed * stagger,
        };
      });

      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;

      if (!reducedMotion) {
        startGather(true);
      }

      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handlePointerEnter = (e) => {
      handlePointerMove(e);
      if (trigger === 'hover') startGather(true);
    };

    const handleClick = () => {
      if (trigger === 'click') startGather(true);
    };

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(sampleText, 80);
    };

    window.addEventListener('resize', onResize);
    canvas.addEventListener('pointerenter', handlePointerEnter);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);

    // Initial synchronous sample, and re-sample when fonts are ready
    sampleText();
    if (document.fonts?.ready) {
      document.fonts.ready.then(sampleText);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('pointerenter', handlePointerEnter);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [
    text,
    particleSize,
    density,
    color,
    highlightColor,
    scatter,
    gatherDuration,
    stagger,
    pointerRepel,
    repelRadius,
    idleDrift,
    trigger,
    fontSize,
    fontWeight,
    fontFamily,
    glow,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative block w-full h-full overflow-hidden touch-none ${className}`}
      style={style}
      aria-label={text}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-auto" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </div>
  );
};

export default ParticleText;
