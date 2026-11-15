'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from './three/ErrorBoundary';
import { use3DSupport } from './three/use3DSupport';
import type { WorkflowSceneProps } from './three/WorkflowScene';
import { ItemList, WorkflowStepper, type WorkflowNode } from './WorkflowStepper';

const WorkflowScene = dynamic<WorkflowSceneProps>(() => import('./three/WorkflowScene'), { ssr: false });

const HEADER = 64; // sticky header height in px
const FALLBACK_IMAGE = '/images/workflow-line.svg';
const FALLBACK_ALT = 'Diagram of the ATHENA production line: a conveyor with eight stations, N1 to N8';

function StaticLine() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={FALLBACK_IMAGE} alt={FALLBACK_ALT} width={1200} height={360} className="h-full w-full object-contain" />
  );
}

/**
 * #workflow: a pinned 3D production line driven by scroll, with the active node's
 * text beside it. Without WebGL or under reduced motion it renders a static image
 * of the line plus the flat stepper.
 */
export function Workflow3D({ nodes, modelUrls }: { nodes: WorkflowNode[]; modelUrls?: (string | undefined)[] }) {
  const support = use3DSupport();
  const track = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const last = nodes.length - 1;
  const pinned = support === 'ok';

  useEffect(() => {
    if (!pinned) return;
    const el = track.current;
    const pin = sticky.current;
    if (!el || !pin) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const span = el.offsetHeight - pin.offsetHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, (HEADER - el.getBoundingClientRect().top) / span)) : 0;
      progress.current = p;
      setActive(Math.round(p * last));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Load the 3D chunk only when the section is getting close.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '800px 0px' },
    );
    io.observe(el);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [pinned, last]);

  const jumpTo = useCallback(
    (index: number) => {
      const el = track.current;
      const pin = sticky.current;
      if (!el || !pin) return;
      const span = el.offsetHeight - pin.offsetHeight;
      const top = window.scrollY + el.getBoundingClientRect().top - HEADER + (index / last) * span;
      window.scrollTo({ top, behavior: 'smooth' });
    },
    [last],
  );

  if (!pinned) {
    return (
      <div>
        <figure className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-200 p-3">
          <StaticLine />
        </figure>
        <WorkflowStepper nodes={nodes} />
      </div>
    );
  }

  const node = nodes[active];

  return (
    <div ref={track} className="relative" style={{ height: `calc(100vh + ${nodes.length * 70}vh)` }}>
      <div
        ref={sticky}
        className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col gap-3 py-3 supports-[height:100svh]:h-[calc(100svh-4rem)] lg:flex-row lg:gap-6 lg:py-6"
      >
        <div className="relative h-[40%] min-h-[170px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-200 lg:h-full lg:flex-[3]">
          {near ? (
            <ErrorBoundary fallback={<StaticLine />}>
              <WorkflowScene progressRef={progress} onSelect={jumpTo} modelUrls={modelUrls} />
            </ErrorBoundary>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-200 bg-white lg:flex-[2]">
          <div className="grid grid-cols-8 gap-1 border-b border-slate-200 p-2" role="group" aria-label="Jump to a station">
            {nodes.map((n, i) => (
              <button
                key={n.id}
                type="button"
                onClick={() => jumpTo(i)}
                aria-current={i === active ? 'step' : undefined}
                aria-label={`${n.id} ${n.name}`}
                className={`min-h-[40px] rounded font-mono text-xs font-semibold transition-colors ${
                  i === active ? 'bg-navy-900 text-white' : 'bg-slate-100 text-navy-900 hover:bg-slate-200'
                }`}
              >
                {n.id}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
            <p className="font-mono text-xs font-semibold text-teal-700">
              {node.id} · Station {active + 1} of {nodes.length}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-navy-900 md:text-2xl">{node.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 md:mt-4">{node.purpose}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 md:mt-6 md:gap-6">
              <ItemList title="Inputs" items={node.inputs} />
              <ItemList title="Outputs" items={node.outputs} />
            </div>
            <p className="mt-4 text-xs text-slate-600 md:mt-6">
              Scroll to move the board along the line, or select a station.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
