import { useEffect, useRef } from 'react';

/**
 * Minimalist 3D Ambient Canvas
 * Subtle, luxury particle field and interactive ambient glow that responds to cursor movement.
 * Zero visual noise, whisper-quiet performance (60-120fps).
 */
export default function ThreeCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, currentX: 0.5, currentY: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Subtle ambient dust particles
    const DUST_COUNT = 48;
    const particles = Array.from({ length: DUST_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.6,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      baseAlpha: Math.random() * 0.35 + 0.1,
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const render = () => {
      const m = mouseRef.current;
      m.currentX += (m.x - m.currentX) * 0.04;
      m.currentY += (m.y - m.currentY) * 0.04;

      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const ink = isLight ? '0, 0, 0' : '255, 255, 255';

      // Subtle, neutral radial aura centred around the cursor
      const auraX = m.currentX * width;
      const auraY = m.currentY * height;
      const radius = Math.max(width, height) * 0.45;

      const gradient = ctx.createRadialGradient(auraX, auraY, 0, auraX, auraY, radius);
      gradient.addColorStop(0, `rgba(${ink}, ${isLight ? 0.035 : 0.035})`);
      gradient.addColorStop(0.5, `rgba(${ink}, 0.012)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render delicate floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(${ink}, ${p.baseAlpha * (isLight ? 0.6 : 1)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
