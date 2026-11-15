'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, type RefObject } from 'react';
import { MathUtils, type Group } from 'three';
import { Box, C, Cyl, Mat, StationModel } from './kit';

const METAL = { metal: 0.6 };
const FINS = [-0.21, -0.14, -0.07, 0, 0.07, 0.14, 0.21];
const SLOTS = [-0.6, -0.36, -0.12, 0.12, 0.36, 0.6];
const SCREWS = [-0.36, -0.18, 0, 0.18, 0.36];

/** How far each part moves in the exploded view. */
const OFFSET: Record<'lid' | 'heatsink' | 'pcb' | 'chassis' | 'terminals', [number, number, number]> = {
  lid: [0, 1.0, 0.25],
  heatsink: [0, 0.5, 0],
  pcb: [0, 0, 0],
  chassis: [0, -0.5, 0],
  terminals: [0.65, 0, 0],
};

/**
 * Illustrative SMPS unit: chassis, lid, heatsink fins, terminals and a PCB inside.
 * explodeRef.current (0..1) separates the parts. MODEL_URL swaps in a glTF.
 */
export function SmpsUnit({ explodeRef, MODEL_URL }: { explodeRef: RefObject<number>; MODEL_URL?: string }) {
  const root = useRef<Group>(null);
  const parts = useRef<Partial<Record<keyof typeof OFFSET, Group | null>>>({});
  const amount = useRef(0);

  useFrame((state, dt) => {
    if (root.current) {
      root.current.rotation.y += dt * 0.25;
      root.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    }
    amount.current = MathUtils.damp(amount.current, explodeRef.current ?? 0, 4, Math.min(dt, 0.1));
    (Object.keys(OFFSET) as (keyof typeof OFFSET)[]).forEach((key) => {
      const group = parts.current[key];
      const [x, y, z] = OFFSET[key];
      if (group) group.position.set(x * amount.current, y * amount.current, z * amount.current);
    });
  });

  const bind = (key: keyof typeof OFFSET) => (el: Group | null) => {
    parts.current[key] = el;
  };

  return (
    <group rotation={[0.28, 0, 0]}>
      <group ref={root} rotation={[0, -0.6, 0]}>
        <StationModel MODEL_URL={MODEL_URL}>
          <group ref={bind('chassis')}>
            <Box size={[2.0, 0.05, 1.2]} color={C.light} mat={METAL} position={[0, -0.35, 0]} />
            <Box size={[2.0, 0.7, 0.05]} color={C.light} mat={METAL} position={[0, 0, -0.6]} />
            <Box size={[0.05, 0.7, 1.2]} color={C.light} mat={METAL} position={[-1.0, 0, 0]} />
          </group>

          <group ref={bind('lid')}>
            <Box size={[2.0, 0.05, 1.2]} color={C.navy} mat={METAL} position={[0, 0.35, 0]} />
            <Box size={[2.0, 0.7, 0.05]} color={C.navy} mat={METAL} position={[0, 0, 0.6]} />
            {SLOTS.map((x) => (
              <Box key={x} size={[0.14, 0.32, 0.02]} color={C.navyDark} position={[x, 0.02, 0.63]} />
            ))}
            <Box size={[0.3, 0.08, 0.02]} color={C.amber} position={[-0.75, -0.26, 0.63]} />
          </group>

          <group ref={bind('pcb')}>
            <Box size={[1.7, 0.04, 1.0]} color={C.tealDark} position={[0, -0.27, 0]} />
            <Box size={[0.42, 0.36, 0.42]} color={C.navyDark} position={[0.35, -0.07, 0.15]} />
            <Box size={[0.44, 0.1, 0.44]} color={C.amber} position={[0.35, -0.07, 0.15]} />
            <Cyl r={0.11} h={0.36} color={C.navy} position={[-0.1, -0.07, 0.28]} />
            <Cyl r={0.11} h={0.36} color={C.navy} position={[-0.38, -0.07, 0.28]} />
            <mesh position={[0.62, -0.17, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.1, 0.045, 6, 14]} />
              <Mat color={C.amber} />
            </mesh>
            <Box size={[0.2, 0.06, 0.14]} color={C.navyDark} position={[-0.65, -0.22, 0.25]} />
            <Box size={[0.12, 0.05, 0.2]} color={C.mid} position={[0.1, -0.225, -0.3]} />
          </group>

          <group ref={bind('heatsink')}>
            <Box size={[0.9, 0.05, 0.5]} color={C.mid} mat={METAL} position={[-0.3, -0.2, -0.28]} />
            {FINS.map((z) => (
              <Box key={z} size={[0.9, 0.34, 0.025]} color={C.mid} mat={METAL} position={[-0.3, -0.01, -0.28 + z]} />
            ))}
          </group>

          <group ref={bind('terminals')}>
            <Box size={[0.16, 0.2, 1.0]} color={C.navyDark} position={[0.95, -0.15, 0]} />
            {SCREWS.map((z) => (
              <Cyl key={z} r={0.05} h={0.05} seg={8} color={C.light} mat={METAL} position={[0.95, -0.03, z]} />
            ))}
          </group>
        </StationModel>
      </group>
    </group>
  );
}
