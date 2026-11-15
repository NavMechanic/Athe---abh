'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, type Group, type Mesh } from 'three';
import { BOARD, Box, C, clamp01, Cyl, ease, PCB_PARTS, StationModel, useActivationClock, type StationProps } from './kit';

const TOP = BOARD.y + BOARD.size[1] / 2;

/** N3: placement head populating the board; parts drop on one by one. */
export function N3DesignEngineering({ active, MODEL_URL }: StationProps) {
  const parts = useRef<(Mesh | null)[]>([]);
  const head = useRef<Group>(null);
  const clock = useActivationClock(active);

  useFrame((state, dt) => {
    const t = clock(dt);
    parts.current.forEach((mesh, i) => {
      if (!mesh) return;
      const k = clamp01((t - 0.3 - i * 0.5) / 0.55);
      const rest = TOP + PCB_PARTS[i].s[1] / 2;
      mesh.visible = active && k > 0;
      mesh.position.y = MathUtils.lerp(1.5, rest, ease(k));
    });
    if (head.current) {
      const busy = active && t < 3.4;
      const y = busy ? 1.78 + Math.sin(state.clock.elapsedTime * 6) * 0.05 : 1.82;
      head.current.position.y = MathUtils.damp(head.current.position.y, y, 6, dt);
    }
  });

  return (
    <StationModel MODEL_URL={MODEL_URL}>
      <Box size={[1.5, 0.12, 0.9]} color={C.light} position={[0, 0.06, -1.5]} />
      <Box size={[0.14, 2.0, 0.14]} color={C.navy} position={[0, 1.0, -1.1]} />
      <Box size={[0.12, 0.12, 1.25]} color={C.navy} position={[0, 1.98, -0.5]} />
      <group ref={head} position={[0, 1.82, 0]}>
        <Box size={[0.3, 0.2, 0.3]} color={C.tealDark} />
        <Cyl r={0.03} h={0.2} seg={8} color={C.amber} position={[0, -0.2, 0]} />
      </group>
      {PCB_PARTS.map((part, i) => (
        <Box
          key={i}
          ref={(el: Mesh | null) => {
            parts.current[i] = el;
          }}
          size={part.s}
          color={part.c}
          position={[part.p[0], 1.5, part.p[1]]}
          visible={false}
        />
      ))}
    </StationModel>
  );
}
