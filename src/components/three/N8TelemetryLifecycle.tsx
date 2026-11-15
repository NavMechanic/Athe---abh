'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh, MeshBasicMaterial } from 'three';
import { Box, C, Cyl, Mat, StationModel, type StationProps } from './kit';

const RINGS = [0, 1, 2];
const FINS = [-0.3, -0.15, 0, 0.15, 0.3];

/** N8: installed unit on a wall panel, emitting signal pulses from its antenna. */
export function N8TelemetryLifecycle({ active, MODEL_URL }: StationProps) {
  const rings = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * (active ? 0.7 : 0.3);
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t + i / RINGS.length) % 1;
      ring.scale.setScalar(0.25 + phase * 1.7);
      (ring.material as MeshBasicMaterial).opacity = (1 - phase) * (active ? 0.9 : 0.25);
    });
  });

  return (
    <StationModel MODEL_URL={MODEL_URL}>
      <group position={[0, 0, -1.7]}>
        <Box size={[1.8, 0.12, 0.9]} color={C.light} position={[0, 0.06, 0.1]} />
        <Box size={[1.7, 1.9, 0.1]} color={C.light} position={[0, 1.07, -0.2]} />
        <Box size={[0.95, 0.6, 0.35]} color={C.navy} position={[0, 1.15, 0.02]} />
        {FINS.map((x) => (
          <Box key={x} size={[0.03, 0.44, 0.06]} color={C.navyDark} position={[x, 1.15, 0.22]} />
        ))}
        <mesh position={[0.4, 1.36, 0.21]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <Mat color={C.teal} emissive={C.teal} glow={1.2} />
        </mesh>
        <Cyl r={0.015} h={0.5} seg={6} color={C.mid} position={[0.32, 1.7, 0.02]} />
        <mesh position={[0.32, 1.97, 0.02]}>
          <sphereGeometry args={[0.04, 8, 6]} />
          <Mat color={C.amber} emissive={C.amber} glow={0.8} />
        </mesh>
        {RINGS.map((i) => (
          <mesh
            key={i}
            ref={(el: Mesh | null) => {
              rings.current[i] = el;
            }}
            position={[0.32, 1.97, 0.06]}
          >
            <torusGeometry args={[0.3, 0.012, 6, 32]} />
            <meshBasicMaterial color={C.teal} transparent opacity={0.3} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </StationModel>
  );
}
