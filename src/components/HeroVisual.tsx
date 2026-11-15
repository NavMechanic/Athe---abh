'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { HeroVideo } from './HeroVideo';
import { ErrorBoundary } from './three/ErrorBoundary';
import type { HeroSceneProps } from './three/HeroScene';
import { use3DSupport } from './three/use3DSupport';

const HeroScene = dynamic<HeroSceneProps>(() => import('./three/HeroScene'), { ssr: false });

const frame =
  'relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl border border-white/15 shadow-2xl lg:max-w-md';

/**
 * Hero visual: real-time SMPS model that opens into an exploded view on hover or scroll.
 * Falls back to the video slot (and its poster) without WebGL or under reduced motion.
 */
export function HeroVisual({ video, MODEL_URL }: { video: { src: string; poster: string; label: string }; MODEL_URL?: string }) {
  const support = use3DSupport();
  const explode = useRef(0);
  const hover = useRef(false);
  const scroll = useRef(0);

  const sync = () => {
    explode.current = Math.max(hover.current ? 1 : 0, scroll.current);
  };

  useEffect(() => {
    if (support !== 'ok') return;
    const onScroll = () => {
      scroll.current = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.45)));
      sync();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [support]);

  if (support === 'fallback') return <HeroVideo {...video} />;

  if (support === 'pending') {
    return (
      <div className={`${frame} bg-navy-950`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={video.poster} alt={video.label} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<HeroVideo {...video} />}>
      <div>
        <div
          className={`${frame} bg-gradient-to-b from-white to-slate-200`}
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') {
              hover.current = true;
              sync();
            }
          }}
          onPointerLeave={() => {
            hover.current = false;
            sync();
          }}
        >
          <HeroScene explodeRef={explode} MODEL_URL={MODEL_URL} />
        </div>
        <p className="mx-auto mt-3 max-w-sm text-center text-xs text-slate-300 lg:max-w-md">
          Hover or scroll to open the unit. Illustrative model, not a product drawing.
        </p>
      </div>
    </ErrorBoundary>
  );
}
