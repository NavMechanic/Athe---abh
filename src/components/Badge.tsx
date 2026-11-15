import type { ReactNode } from 'react';
import site from '@content/site.json';

type Tone = 'neutral' | 'teal' | 'risk' | 'onDark';

const tones: Record<Tone, string> = {
  neutral: 'border-slate-300 bg-white text-slate-700',
  teal: 'border-teal-700/30 bg-teal-50 text-teal-800',
  risk: 'border-amber-600/40 bg-amber-50 text-amber-900',
  onDark: 'border-white/30 bg-white/5 text-slate-100',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Mandatory label for any sample figure or sample product detail. */
export function DemoLabel() {
  return <Badge tone="neutral">{site.demoLabel}</Badge>;
}
