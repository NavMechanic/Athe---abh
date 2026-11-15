'use client';

import { useEffect, useState } from 'react';

export type Support = 'pending' | 'ok' | 'fallback';

let webgl: boolean | null = null;

function hasWebGL() {
  if (webgl === null) {
    try {
      const canvas = document.createElement('canvas');
      webgl = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

/** 'ok' only when WebGL exists and the visitor has not asked for reduced motion. */
export function use3DSupport(): Support {
  const [support, setSupport] = useState<Support>('pending');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSupport(!mq.matches && hasWebGL() ? 'ok' : 'fallback');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return support;
}
