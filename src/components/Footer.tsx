import site from '@content/site.json';

export function Footer() {
  return (
    <footer className="on-dark bg-navy-950 py-12 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-lg font-bold tracking-[0.2em] text-white">{site.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">{site.footer.summary}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="space-y-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-flex min-h-[32px] items-center text-sm hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-1 text-sm">
            <a href={site.cta.primary.href} className="flex min-h-[32px] items-center font-semibold text-teal-300 hover:text-teal-200">
              {site.cta.primary.label}
            </a>
            <a href={site.cta.secondary.href} className="flex min-h-[32px] items-center hover:text-white">
              {site.cta.secondary.label}
            </a>
            <a href={`mailto:${site.contactEmail}`} className="flex min-h-[32px] items-center break-all hover:text-white">
              {site.contactEmail}
            </a>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-300">{site.footer.disclaimer}</p>
        <p className="mt-2 text-xs text-slate-300">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
