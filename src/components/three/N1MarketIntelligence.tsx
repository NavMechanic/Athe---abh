'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils, Quaternion, Vector3, type Group } from 'three';
import { Box, C, Cyl, Mat, StationModel, type StationProps } from './kit';

const R = 0.6;
const PINS: [number, number][] = [
  [0.9, 0.4],
  [2.1, -0.2],
  [3.3, 0.7],
  [4.4, 0.1],
  [5.5, -0.5],
  [0.3, -0.6],
  [1.5, 1.0],
];

/** N1: rotating low-poly globe with data pins. */
export function N1MarketIntelligence({ active, MODEL_URL }: StationProps) {
  const globe = useRef<Group>(null);
  const pinGroup = useRef<Group>(null);

  const pins = useMemo(() => {
    const up = new Vector3(0, 1, 0);
    return PINS.map(([lon, lat]) => {
      const dir = new Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
      return { position: dir.clone().multiplyScalar(R), quaternion: new Quaternion().setFromUnitVectors(up, dir) };
    });
  }, []);

  useFrame((_, dt) => {
    if (globe.current) globe.current.rotation.y += dt * (active ? 0.9 : 0.25);
    if (pinGroup.current) {
      const s = MathUtils.damp(pinGroup.current.scale.x, active ? 1 : 0.55, 4, dt);
      pinGroup.current.scale.setScalar(s);
    }
  });

  return (
    <StationModel MODEL_URL={MODEL_URL}>
      <group position={[0, 0, -1.6]}>
        <Box size={[1.5, 0.12, 1.2]} color={C.light} position={[0, 0.06, 0]} />
        <Cyl r={0.1} h={1.0} color={C.navy} position={[0, 0.62, 0]} />
        <group position={[0, 1.75, 0]} rotation={[0, 0, 0.35]}>
          <group ref={globe}>
            <mesh>
              <icosahedronGeometry args={[R, 1]} />
              <Mat color={C.navy} />
            </mesh>
            <mesh>
              <icosahedronGeometry args={[R * 1.02, 1]} />
              <meshBasicMaterial color={C.teal} wireframe />
            </mesh>
            <group ref={pinGroup}>
              {pins.map((pin, i) => (
                <group key={i} position={pin.position} quaternion={pin.quaternion}>
                  <Cyl r={0.012} h={0.24} seg={6} color={C.amber} position={[0, 0.12, 0]} />
                  <mesh position={[0, 0.27, 0]}>
                    <sphereGeometry args={[0.05, 8, 6]} />
                    <Mat color={C.amber} emissive={C.amber} glow={0.6} />
                  </mesh>
                </group>
              ))}
            </group>
          </group>
        </group>
      </group>
    </StationModel>
  );
}
