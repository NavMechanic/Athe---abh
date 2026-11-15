import site from '@content/site.json';
import { Badge } from './Badge';
import { Section } from './Section';

export function ProjectFlow() {
  const { process } = site;
  return (
    <Section
      id="process"
      eyebrow={process.eyebrow}
      title={process.title}
      intro={process.intro}
      aside={<Badge tone="neutral">{process.status}</Badge>}
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((step, i) => (
          <li key={step.title} className="relative rounded-lg border border-dashed border-slate-300 bg-white p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-semibold text-teal-700">Step {i + 1}</span>
              <Badge tone="neutral">{process.status}</Badge>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-navy-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
            {i < process.steps.length - 1 ? (
              <span aria-hidden="true" className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-xl text-slate-400 lg:block">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
