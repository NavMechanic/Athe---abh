import services from '@content/services.json';
import site from '@content/site.json';
import { Section } from './Section';

export function Services() {
  return (
    <Section id="services" {...site.services}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id} className="flex flex-col rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-navy-900">{service.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.body}</p>
            <p className="mt-4 font-mono text-xs text-teal-800">
              <span className="sr-only">Workflow nodes: </span>
              {service.nodes.join(' · ')}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
