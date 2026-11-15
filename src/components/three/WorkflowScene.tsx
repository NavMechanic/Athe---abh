'use client';

import type { RefObject } from 'react';
import { CanvasShell } from './CanvasShell';
import { ProductionLine } from './ProductionLine';

export type WorkflowSceneProps = {
  /** Scroll progress through the pinned section, 0..1. */
  progressRef: RefObject<number>;
  onSelect: (index: number) => void;
  /** Optional glTF URL per station (index 0 = N1) to replace the primitives. */
  modelUrls?: (string | undefined)[];
};

export default function WorkflowScene({ progressRef, onSelect, modelUrls }: WorkflowSceneProps) {
  return (
    <CanvasShell
      label="3D production line: a circuit board travels along a conveyor through eight stations, one per ATHENA node"
      camera={{ position: [1.6, 4.4, 11], fov: 35 }}
    >
      <ProductionLine progressRef={progressRef} onSelect={onSelect} modelUrls={modelUrls} />
    </CanvasShell>
  );
}
