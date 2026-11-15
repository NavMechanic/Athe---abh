'use client';

import { ContactShadows } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, type ComponentType, type RefObject } from 'react';
import { MathUtils, type Group } from 'three';
import { BOARD, Box, C, PCB_PARTS, type StationProps } from './kit';
import { N1MarketIntelligence } from './N1MarketIntelligence';
import { N2ProductDefinition } from './N2ProductDefinition';
import { N3DesignEngineering } from './N3DesignEngineering';
import { N4QualityReliability } from './N4QualityReliability';
import { N5SourcingManufacturing } from './N5SourcingManufacturing';
import { N6CommercialFulfilment } from './N6CommercialFulfilment';
import { N7FinanceCosting } from './N7FinanceCosting';
import { N8TelemetryLifecycle } from './N8TelemetryLifecycle';

const STATIONS: ComponentType<StationProps>[] = [
  N1MarketIntelligence,
  N2ProductDefinition,
  N3DesignEngineering,
  N4QualityReliability,
  N5SourcingManufacturing,
  N6CommercialFulfilment,
  N7FinanceCosting,
  N8TelemetryLifecycle,
];

const LAST = STATIONS.length - 1;
const SPACING = 3.4;
const LENGTH = LAST * SPACING + 5;
const CENTRE = (LAST * SPACING) / 2;
const POPULATED_AFTER = 2; // board carries its parts once it leaves N3
const DOCK = 0.04;

/** Scroll position (0..LAST) to belt position, dwelling at each station. */
function dwell(p: number) {
  const f = Math.min(Math.floor(p), LAST - 1);
  const s = MathUtils.clamp((p - f - 0.25) / 0.5, 0, 1);
  return f + s * s * (3 - 2 * s);
}

function Conveyor() {
  const legs = Array.from({ length: 16 }, (_, i) => CENTRE - LENGTH / 2 + 0.5 + (i * (LENGTH - 1)) / 15);
  return (
    <group>
      <Box size={[LENGTH, 0.1, 1.2]} color={C.navyDark} position={[CENTRE, 0.55, 0]} />
      <Box size={[LENGTH, 0.12, 0.06]} color={C.tealDark} position={[CENTRE, 0.58, 0.63]} />
      <Box size={[LENGTH, 0.12, 0.06]} color={C.tealDark} position={[CENTRE, 0.58, -0.63]} />
      {legs.map((x) => (
        <Box key={x} size={[0.1, 0.5, 1.1]} color={C.mid} position={[x, 0.25, 0]} />
      ))}
    </group>
  );
}

export function ProductionLine({
  progressRef,
  onSelect,
  modelUrls,
}: {
  progressRef: RefObject<number>;
  onSelect: (index: number) => void;
  modelUrls?: (string | undefined)[];
}) {
  const pcb = useRef<Group>(null);
  const shadow = useRef<Group>(null);
  const pos = useRef(dwell((progressRef.current ?? 0) * LAST));
  const [docked, setDocked] = useState(-1);
  const [populated, setPopulated] = useState(false);
  const last = useRef({ docked: -1, populated: false });

  useFrame((state, dt) => {
    const step = Math.min(dt, 0.1);
    pos.current = MathUtils.damp(pos.current, dwell((progressRef.current ?? 0) * LAST), 5, step);
    const x = pos.current * SPACING;

    if (pcb.current) pcb.current.position.x = x;
    if (shadow.current) shadow.current.position.x = x;

    const aspect = state.size.width / state.size.height;
    const distance = aspect < 1 ? 13.5 : aspect < 1.5 ? 11 : 9.5;
    state.camera.position.set(x + 1.6, 4.4, distance);
    state.camera.lookAt(x + 0.2, 1.05, -0.5);

    const nearest = Math.round(pos.current);
    const nowDocked = Math.abs(pos.current - nearest) < DOCK ? nearest : -1;
    const nowPopulated = pos.current > POPULATED_AFTER + DOCK;
    if (nowDocked !== last.current.docked) {
      last.current.docked = nowDocked;
      setDocked(nowDocked);
    }
    if (nowPopulated !== last.current.populated) {
      last.current.populated = nowPopulated;
      setPopulated(nowPopulated);
    }
  });

  const setCursor = (value: string) => {
    document.body.style.cursor = value;
  };

  return (
    <>
      <Conveyor />

      {STATIONS.map((Station, i) => (
        <group key={i} position={[i * SPACING, 0, 0]}>
          <Box
            size={[2.5, 0.04, 3.4]}
            color={docked === i ? C.teal : C.light}
            mat={{ opacity: docked === i ? 0.45 : 0.25 }}
            position={[0, 0.02, -0.7]}
          />
          <Station active={docked === i} MODEL_URL={modelUrls?.[i]} />
          <mesh
            position={[0, 1.3, -0.7]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(i);
            }}
            onPointerOver={() => setCursor('pointer')}
            onPointerOut={() => setCursor('auto')}
          >
            <boxGeometry args={[2.6, 2.6, 3.4]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      ))}

      <group ref={pcb} position={[0, BOARD.y, 0]}>
        <Box size={BOARD.size} color={C.tealDark} />
        <group visible={populated}>
          {PCB_PARTS.map((part, i) => (
            <Box key={i} size={part.s} color={part.c} position={[part.p[0], BOARD.size[1] / 2 + part.s[1] / 2, part.p[1]]} />
          ))}
        </group>
      </group>

      <group ref={shadow}>
        <ContactShadows position={[0, 0.001, -0.6]} scale={18} far={3} blur={2.4} opacity={0.38} resolution={512} color="#0B1F3A" />
      </group>
    </>
  );
}
