'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, type Mesh } from 'three';
import { Box, C, Mat, StationModel, type StationProps } from './kit';

/** Relative heights only: an illustrative shape, not real cost data. */
const BARS: { h: number; c: string }[] = [
  { h: 0.5, c: C.navy },
  { h: 0.8, c: C.tealDark },
  { h: 0.65, c: C.navy },
  { h: 1.1, c: C.teal },
  { h: 1.5, c: C.amber },
];
const BASE = 0.1;

/** N7: 3D cost bars rising in sequence. */
export function N7FinanceCosting({ active, MODEL_URL }: StationProps) {
  const bars = useRef<(Mesh | null)[]>([]);

  useFrame((_, dt) => {
    bars.current.forEach((bar, i) => {
      if (!bar) return;
      const target = BARS[i].h * (active ? 1 : 0.3);
      const h = MathUtils.damp(bar.scale.y, target, 3.4 - i * 0.45, dt);
      bar.scale.y = h;
      bar.position.y = BASE + h / 2;
    });
  });

  return (
    <StationModel MODEL_URL={MODEL_URL}>
      <group position={[0, 0, -1.6]}>
        <Box size={[1.8, BASE, 0.9]} color={C.light} position={[0, BASE / 2, 0]} />
        {BARS.map((bar, i) => (
          <mesh
            key={i}
            ref={(el: Mesh | null) => {
              bars.current[i] = el;
            }}
            position={[-0.64 + i * 0.32, BASE + bar.h * 0.15, 0]}
            scale={[1, bar.h * 0.3, 1]}
          >
            <boxGeometry args={[0.22, 1, 0.22]} />
            <Mat color={bar.c} />
          </mesh>
        ))}
      </group>
    </StationModel>
  );
}
