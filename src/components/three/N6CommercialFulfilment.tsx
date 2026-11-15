'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { Box, C, clamp01, ease, StationModel, useActivationClock, type StationProps } from './kit';

const W = 0.5;
const H = 0.4;
const D = 0.46;
const DECK = 0.15;
const SLOTS: [number, number, number][] = [
  [-0.28, 0, -0.26],
  [0.28, 0, -0.26],
  [-0.28, 0, 0.26],
  [0.28, 0, 0.26],
  [-0.28, 1, 0],
  [0.28, 1, 0],
];

/** N6: shipping boxes stacking onto a pallet. */
export function N6CommercialFulfilment({ active, MODEL_URL }: StationProps) {
  const boxes = useRef<(Group | null)[]>([]);
  const clock = useActivationClock(active);

  useFrame((_, dt) => {
    const t = clock(dt);
    boxes.current.forEach((box, i) => {
      if (!box) return;
      const k = clamp01((t - 0.2 - i * 0.45) / 0.5);
      const rest = DECK + H / 2 + SLOTS[i][1] * H;
      box.visible = k > 0;
      box.position.y = rest + (1 - ease(k)) * 1.3;
    });
  });

  return (
    <StationModel MODEL_URL={MODEL_URL}>
      <group position={[0, 0, -1.6]}>
        {[-0.5, 0, 0.5].map((x) => (
          <Box key={x} size={[0.1, 0.1, 1.1]} color={C.mid} position={[x, 0.05, 0]} />
        ))}
        <Box size={[1.25, 0.05, 1.1]} color={C.mid} position={[0, 0.125, 0]} />
        {SLOTS.map(([x, , z], i) => (
          <group
            key={i}
            ref={(el: Group | null) => {
              boxes.current[i] = el;
            }}
            position={[x, DECK + H / 2, z]}
          >
            <Box size={[W, H, D]} color={C.light} />
            <Box size={[W + 0.01, H + 0.01, 0.07]} color={C.tealDark} />
            <Box size={[0.16, 0.1, 0.01]} color={C.amber} position={[0.1, 0.05, D / 2 + 0.005]} />
          </group>
        ))}
      </group>
    </StationModel>
  );
}
