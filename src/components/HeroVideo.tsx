'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hero video slot. Shows the poster until the video can play; if the file is missing
 * the poster simply stays. Autoplays muted only when reduced motion is not requested,
 * and always offers a pause control.
 */
export function HeroVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const onReady = () => {
      setAvailable(true);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.play().catch(() => undefined);
      }
    };
    if (video.readyState >= 2) onReady();
    video.addEventListener('loadeddata', onReady);
    return () => video.removeEventListener('loadeddata', onReady);
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl border border-white/15 bg-navy-950 shadow-2xl lg:max-w-md">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      {available ? (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-3 right-3 inline-flex min-h-[44px] items-center rounded-md bg-navy-950/85 px-3 text-xs font-semibold text-white ring-1 ring-white/40"
        >
          {playing ? 'Pause video' : 'Play video'}
        </button>
      ) : null}
    </div>
  );
}
