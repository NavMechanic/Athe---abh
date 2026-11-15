'use client';

import { Environment, Lightformer } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Shared canvas: pixel ratio capped at 2, transparent so the CSS white-to-grey
 * backdrop shows through, soft studio lighting, and rendering paused off-screen.
 */
export function CanvasShell({
  label,
  camera,
  children,
}: {
  label: string;
  camera: { position: [number, number, number]; fov: number };
  children: ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} role="img" aria-label={label} className="h-full w-full">
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ ...camera, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <hemisphereLight args={['#ffffff', '#cbd5e1', 0.7]} />
        <directionalLight position={[4, 8, 6]} intensity={1.1} />
        <directionalLight position={[-6, 4, -2]} intensity={0.35} />
        <Environment resolution={64}>
          <Lightformer form="rect" intensity={2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
          <Lightformer form="rect" intensity={1} position={[-6, 2, 4]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
          <Lightformer form="rect" intensity={1} position={[6, 2, 4]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
        </Environment>
        {children}
      </Canvas>
    </div>
  );
}
