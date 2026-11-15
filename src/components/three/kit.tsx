'use client';

import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { Suspense, useMemo, useRef, type ReactNode } from 'react';

/** Scene palette: navy / teal, amber accents only. */
export const C = {
  navy: '#12305A',
  navyDark: '#0B1F3A',
  navyMid: '#1B4079',
  teal: '#14B8A6',
  tealDark: '#0F766E',
  amber: '#F59E0B',
  light: '#E2E8F0',
  mid: '#94A3B8',
  white: '#F8FAFC',
} as const;

/** Every station takes these. MODEL_URL swaps the primitives for a glTF file. */
export type StationProps = { active: boolean; MODEL_URL?: string };

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ease = (x: number) => x * x * (3 - 2 * x);

/** Travelling board: shared by the conveyor PCB and the N3 placement station. */
export const BOARD = { size: [1.0, 0.05, 0.7] as [number, number, number], y: 0.63 };
export const PCB_PARTS: { p: [number, number]; s: [number, number, number]; c: string }[] = [
  { p: [-0.3, -0.15], s: [0.22, 0.08, 0.22], c: C.navyDark },
  { p: [0.1, -0.12], s: [0.3, 0.14, 0.2], c: C.navy },
  { p: [0.32, 0.18], s: [0.12, 0.16, 0.12], c: C.amber },
  { p: [-0.1, 0.2], s: [0.16, 0.06, 0.1], c: C.mid },
  { p: [-0.36, 0.2], s: [0.1, 0.1, 0.1], c: C.teal },
];

type MatProps = { color: string; emissive?: string; glow?: number; opacity?: number; metal?: number };

export function Mat({ color, emissive, glow = 0, opacity, metal = 0.15 }: MatProps) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.6}
      metalness={metal}
      flatShading
      emissive={emissive ?? '#000000'}
      emissiveIntensity={glow}
      transparent={opacity !== undefined}
      opacity={opacity ?? 1}
    />
  );
}

type MeshProps = Omit<ThreeElements['mesh'], 'args'>;
type Extra = { color: string; mat?: Omit<MatProps, 'color'> };

export function Box({ size, color, mat, ...props }: MeshProps & Extra & { size: [number, number, number] }) {
  return (
    <mesh {...props}>
      <boxGeometry args={size} />
      <Mat color={color} {...mat} />
    </mesh>
  );
}

export function Cyl({ r, h, seg = 12, color, mat, ...props }: MeshProps & Extra & { r: number; h: number; seg?: number }) {
  return (
    <mesh {...props}>
      <cylinderGeometry args={[r, r, h, seg]} />
      <Mat color={color} {...mat} />
    </mesh>
  );
}

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={object} />;
}

/** Renders the glTF at MODEL_URL when given, otherwise (and while loading) the primitives. */
export function StationModel({ MODEL_URL, children }: { MODEL_URL?: string; children: ReactNode }) {
  if (!MODEL_URL) return <>{children}</>;
  return (
    <Suspense fallback={children}>
      <GltfModel url={MODEL_URL} />
    </Suspense>
  );
}

/**
 * Clock that restarts each time the station becomes active and only runs while active.
 * Starts "finished" so idle stations show their completed state.
 */
export function useActivationClock(active: boolean, initial = 99) {
  const t = useRef(initial);
  const prev = useRef(false);
  return (dt: number) => {
    if (active && !prev.current) t.current = 0;
    prev.current = active;
    if (active) t.current += dt;
    return t.current;
  };
}
