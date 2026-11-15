import site from '@content/site.json';
import { Badge } from './Badge';
import { Reveal } from './Reveal';
import { SectionHeading } from './Section';

export function ProblemProposition() {
  const { problem, proposition } = site;
  return (
    <>
      <section id="problem" aria-labelledby="problem-title" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <SectionHeading id="problem-title" {...problem} />
          </Reveal>
          <Reveal className="mt-10">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {problem.items.map((item) => (
                <li key={item.title} className="rounded-lg border border-slate-200 border-l-4 border-l-amber-500 bg-white p-5">
                  <Badge tone="risk">Risk</Badge>
                  <h3 className="mt-3 text-base font-semibold text-navy-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="proposition" aria-labelledby="proposition-title" className="on-dark bg-navy-900 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <SectionHeading id="proposition-title" tone="dark" {...proposition} />
          </Reveal>
          <Reveal className="mt-10">
            <ul className="grid gap-4 sm:grid-cols-2">
              {proposition.items.map((item) => (
                <li key={item.title} className="rounded-lg border border-white/15 bg-white/5 p-6">
                  <h3 className="text-base font-semibold text-teal-300">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
