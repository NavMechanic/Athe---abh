import products from '@content/products.json';
import site from '@content/site.json';
import { Badge, DemoLabel } from './Badge';
import { Section } from './Section';

export function ProductConcepts() {
  const levels = products.readinessLevels;
  return (
    <Section id="products" tone="muted" aside={<DemoLabel />} {...site.products}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {products.items.map((product) => {
          const level = levels.indexOf(product.readiness) + 1;
          return (
            <li key={product.id} className="flex flex-col rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="teal">Readiness: {product.readiness}</Badge>
                <DemoLabel />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-navy-900">{product.name}</h3>
              <p className="mt-1 font-mono text-xs text-slate-600">{product.class}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{product.body}</p>
              <div className="mt-5">
                <div aria-hidden="true" className="flex gap-1">
                  {levels.map((name, i) => (
                    <span key={name} className={`h-1.5 flex-1 rounded-full ${i < level ? 'bg-teal-700' : 'bg-slate-200'}`} />
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Stage {level} of {levels.length}: {levels.join(' → ')}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
