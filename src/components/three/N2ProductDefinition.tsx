'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import { Box, C, clamp01, StationModel, useActivationClock, type StationProps } from './kit';

/** Outline strokes on the sheet: centre x/z, length, vertical flag, colour. */
const STROKES: { x: number; z: number; len: number; v?: boolean; c: string }[] = [
  { x: 0, z: -0.3, len: 1.0, c: C.white },
  { x: 0.5, z: 0, len: 0.6, v: true, c: C.white },
  { x: 0, z: 0.3, len: 1.0, c: C.white },
  { x: -0.5, z: 0, len: 0.6, v: true, c: C.white },
  { x: -0.15, z: 0, len: 0.6, v: true, c: C.teal },
  { x: 0.18, z: -0.05, len: 0.65, c: C.teal },
  { x: 0, z: 0.4, len: 1.0, c: C.amber },
];

/** N2: blueprint sheet on a drafting table, outlines drawn stroke by stroke. */
export function N2ProductDefinition({ active, MODEL_URL }: StationProps) {
  const strokes = useRef<(Mesh | null)[]>([]);
  const ring = useRef<Mesh>(null);
  const clock = useActivationClock(active);

  useFrame((_, dt) => {
    const t = clock(dt) * 2.4;
    strokes.current.forEach((mesh, i) => {
      if (mesh) mesh.scale.x = Math.max(0.001, clamp01(t - i));
    });
    if (ring.current) ring.current.scale.setScalar(Math.max(0.001, clamp01(t - STROKES.length)));
  });

  return (
    <StationModel MODEL_URL={MODEL_URL}>
      <group position={[0, 0, -1.6]}>
        <Box size={[1.5, 0.12, 1.2]} color={C.light} position={[0, 0.06, 0]} />
        <Box size={[0.08, 1.1, 0.08]} color={C.navy} position={[-0.6, 0.65, -0.2]} />
        <Box size={[0.08, 1.1, 0.08]} color={C.navy} position={[0.6, 0.65, -0.2]} />
        <group position={[0, 1.35, 0]} rotation={[1.0, 0, 0]}>
          <Box size={[1.6, 0.06, 1.15]} color={C.light} />
          <Box size={[1.42, 0.012, 1.0]} color={C.navyMid} position={[0, 0.036, 0]} />
          {STROKES.map((s, i) => (
            <Box
              key={i}
              ref={(el: Mesh | null) => {
                strokes.current[i] = el;
              }}
              size={[s.len, 0.012, 0.022]}
              color={s.c}
              position={[s.x, 0.05, s.z]}
              rotation={[0, s.v ? Math.PI / 2 : 0, 0]}
            />
          ))}
          <mesh ref={ring} position={[0.2, 0.05, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1, 0.011, 6, 24]} />
            <meshBasicMaterial color={C.white} />
          </mesh>
        </group>
      </group>
    </StationModel>
  );
}
