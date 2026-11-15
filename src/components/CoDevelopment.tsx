import site from '@content/site.json';
import { Section } from './Section';

export function CoDevelopment() {
  const { coDevelopment } = site;
  return (
    <Section
      id="co-development"
      tone="dark"
      eyebrow={coDevelopment.eyebrow}
      title={coDevelopment.title}
      intro={coDevelopment.intro}
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {coDevelopment.columns.map((column, i) => (
          <li
            key={column.title}
            className={`rounded-lg border p-6 ${i === 1 ? 'border-teal-300/60 bg-teal-300/10' : 'border-white/15 bg-white/5'}`}
          >
            <h3 className="text-base font-semibold text-white">{column.title}</h3>
            <ul className="mt-4 space-y-2">
              {column.points.map((point) => (
                <li key={point} className="flex gap-2 text-sm leading-relaxed text-slate-200">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300" />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-300">{coDevelopment.note}</p>
    </Section>
  );
}
