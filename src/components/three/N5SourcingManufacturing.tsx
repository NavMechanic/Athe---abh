'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, type Group, type MeshStandardMaterial } from 'three';
import { Box, C, Cyl, StationModel, type StationProps } from './kit';

const OVEN_X = 1.45;
const HEATERS = [-0.4, 0, 0.4];

/** N5: pick-and-place gantry over the board, then a reflow oven tunnel on the belt. */
export function N5SourcingManufacturing({ active, MODEL_URL }: StationProps) {
  const head = useRef<Group>(null);
  const nozzle = useRef<Group>(null);
  const heaters = useRef<(MeshStandardMaterial | null)[]>([]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (head.current) {
      const z = active ? Math.sin(t * 1.6) * 0.26 : 0;
      head.current.position.z = MathUtils.damp(head.current.position.z, z, 6, dt);
    }
    if (nozzle.current) {
      const y = active ? -0.32 - Math.abs(Math.sin(t * 3.2)) * 0.28 : -0.25;
      nozzle.current.position.y = MathUtils.damp(nozzle.current.position.y, y, 8, dt);
    }
    const glow = active ? 1.4 + Math.sin(t * 2.4) * 0.5 : 0.35;
    heaters.current.forEach((m) => {
      if (m) m.emissiveIntensity = MathUtils.damp(m.emissiveIntensity, glow, 4, dt);
    });
  });

  return (
    <StationModel MODEL_URL={MODEL_URL}>
      {/* gantry */}
      <Box size={[0.1, 1.9, 0.1]} color={C.navy} position={[0, 0.95, -0.85]} />
      <Box size={[0.1, 1.9, 0.1]} color={C.navy} position={[0, 0.95, 0.85]} />
      <Box size={[0.14, 0.12, 1.9]} color={C.navy} position={[0, 1.9, 0]} />
      <group ref={head} position={[0, 1.75, 0]}>
        <Box size={[0.28, 0.22, 0.28]} color={C.tealDark} />
        <group ref={nozzle} position={[0, -0.25, 0]}>
          <Cyl r={0.03} h={0.4} seg={8} color={C.mid} />
          <Box size={[0.1, 0.06, 0.1]} color={C.amber} position={[0, -0.23, 0]} />
        </group>
      </group>

      {/* reflow oven tunnel: open along the belt so the board passes through */}
      <group position={[OVEN_X, 0, 0]}>
        <Box size={[1.3, 1.25, 0.1]} color={C.navy} position={[0, 0.625, -0.72]} />
        <Box size={[1.3, 1.25, 0.1]} color={C.navy} position={[0, 0.625, 0.72]} />
        <Box size={[1.3, 0.14, 1.54]} color={C.navy} position={[0, 1.32, 0]} />
        <Cyl r={0.1} h={0.4} color={C.mid} position={[0.35, 1.58, -0.4]} />
        {HEATERS.map((x, i) => (
          <mesh key={x} position={[x, 1.22, 0]}>
            <boxGeometry args={[0.08, 0.04, 1.2]} />
            <meshStandardMaterial
              ref={(el: MeshStandardMaterial | null) => {
                heaters.current[i] = el;
              }}
              color={C.amber}
              emissive={C.amber}
              emissiveIntensity={0.35}
            />
          </mesh>
        ))}
      </group>
    </StationModel>
  );
}
