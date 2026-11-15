'use client';

import { ContactShadows } from '@react-three/drei';
import type { RefObject } from 'react';
import { CanvasShell } from './CanvasShell';
import { SmpsUnit } from './SmpsUnit';

export type HeroSceneProps = {
  /** 0 = assembled, 1 = exploded. */
  explodeRef: RefObject<number>;
  /** Optional glTF to replace the primitive SMPS unit. */
  MODEL_URL?: string;
};

export default function HeroScene({ explodeRef, MODEL_URL }: HeroSceneProps) {
  return (
    <CanvasShell
      label="3D model of a switch-mode power supply: case, heatsink fins, terminals and the circuit board inside"
      camera={{ position: [0, 1.4, 7.2], fov: 32 }}
    >
      <group position={[0, 0.1, 0]}>
        <SmpsUnit explodeRef={explodeRef} MODEL_URL={MODEL_URL} />
      </group>
      <ContactShadows position={[0, -1.25, 0]} scale={8} far={3.2} blur={2.6} opacity={0.35} resolution={512} color="#0B1F3A" />
    </CanvasShell>
  );
}
