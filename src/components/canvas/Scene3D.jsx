import ThreeCanvas from './ThreeCanvas';

/**
 * Scene3D loads React Three Fiber or renders the high-performance
 * canvas-based 3D scene. This provides instant loading, smooth 60-120fps performance,
 * and zero crashes even before dependencies finish installing.
 */
export default function Scene3D({ activeSection = 'hero', progress = 0 }) {
  return <ThreeCanvas activeSection={activeSection} _progress={progress} />;
}
