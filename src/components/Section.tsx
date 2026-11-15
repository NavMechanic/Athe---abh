import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type Tone = 'light' | 'muted' | 'dark';

const tones: Record<Tone, { wrap: string; eyebrow: string; title: string; intro: string }> = {
  light: { wrap: 'bg-white', eyebrow: 'text-teal-700', title: 'text-navy-900', intro: 'text-slate-600' },
  muted: { wrap: 'bg-slate-50', eyebrow: 'text-teal-700', title: 'text-navy-900', intro: 'text-slate-600' },
  dark: { wrap: 'on-dark bg-navy-900', eyebrow: 'text-teal-300', title: 'text-white', intro: 'text-slate-300' },
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  tone = 'light',
  aside,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: Tone;
  aside?: ReactNode;
}) {
  const t = tones[tone];
  return (
    <div className="max-w-3xl">
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${t.eyebrow}`}>{eyebrow}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h2 id={id} className={`text-2xl font-semibold tracking-tight md:text-3xl ${t.title}`}>
          {title}
        </h2>
        {aside}
      </div>
      {intro ? <p className={`mt-4 text-base leading-relaxed ${t.intro}`}>{intro}</p> : null}
    </div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  tone = 'light',
  aside,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: Tone;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${tones[tone].wrap} py-16 md:py-24`}>
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} intro={intro} tone={tone} aside={aside} />
        </Reveal>
        <Reveal className="mt-10 md:mt-12">{children}</Reveal>
      </div>
    </section>
  );
}
