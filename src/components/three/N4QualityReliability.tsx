'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, type Group, type MeshStandardMaterial } from 'three';
import { BOARD, Box, C, Cyl, StationModel, type StationProps } from './kit';

const PIN = 0.26;
const CONTACT = BOARD.y + BOARD.size[1] / 2 + PIN + 0.04;
const RAISED = 1.5;
const POSTS: [number, number][] = [
  [-0.75, -0.8],
  [0.75, -0.8],
  [-0.75, 0.8],
  [0.75, 0.8],
];
const PROBES: [number, number][] = [
  [-0.28, -0.14],
  [0.28, -0.14],
  [-0.28, 0.14],
  [0.28, 0.14],
];

/** N4: test chamber straddling the belt; the probe head drops onto the board. */
export function N4QualityReliability({ active, MODEL_URL }: StationProps) {
  const head = useRef<Group>(null);
  const lamp = useRef<MeshStandardMaterial>(null);

  useFrame((state, dt) => {
    if (!head.current) return;
    const retest = Math.sin(state.clock.elapsedTime * 1.1) > 0.9;
    const target = active ? (retest ? CONTACT + 0.22 : CONTACT) : RAISED;
    head.current.position.y = MathUtils.damp(head.current.position.y, target, 5, dt);
    if (lamp.current) {
      const inContact = head.current.position.y - CONTACT < 0.02;
      lamp.current.color.set(inContact ? C.teal : C.amber);
      lamp.current.emissive.set(inContact ? C.teal : C.amber);
    }
  });

  return (
    <StationModel MODEL_URL={MODEL_URL}>
      {POSTS.map(([x, z]) => (
        <Box key={`${x}${z}`} size={[0.08, 1.8, 0.08]} color={C.navy} position={[x, 0.9, z]} />
      ))}
      <Box size={[1.7, 0.1, 1.8]} color={C.navy} position={[0, 1.85, 0]} />
      <Box size={[1.5, 1.15, 0.03]} color={C.teal} mat={{ opacity: 0.22 }} position={[0, 1.22, -0.8]} />
      <mesh position={[0.6, 1.98, 0.7]}>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshStandardMaterial ref={lamp} color={C.amber} emissive={C.amber} emissiveIntensity={0.9} flatShading />
      </mesh>
      <group ref={head} position={[0, RAISED, 0]}>
        <Box size={[0.8, 0.08, 0.5]} color={C.tealDark} />
        <Cyl r={0.04} h={0.9} seg={8} color={C.mid} position={[0, 0.49, 0]} />
        {PROBES.map(([x, z]) => (
          <group key={`${x}${z}`} position={[x, -PIN / 2 - 0.04, z]}>
            <Cyl r={0.014} h={PIN} seg={6} color={C.mid} />
            <Cyl r={0.022} h={0.05} seg={6} color={C.amber} position={[0, -PIN / 2 + 0.025, 0]} />
          </group>
        ))}
      </group>
    </StationModel>
  );
}
