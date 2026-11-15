import site from '@content/site.json';
import { ButtonLink } from './Button';
import { HeroVisual } from './HeroVisual';

export function Hero() {
  const { hero, cta } = site;
  return (
    <section aria-labelledby="hero-title" className="on-dark bg-gradient-to-b from-navy-950 to-navy-900">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-300">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 md:text-lg">{hero.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={cta.primary.href} variant="primaryOnDark">
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink href={cta.secondary.href} variant="secondaryOnDark">
              {cta.secondary.label}
            </ButtonLink>
          </div>
        </div>
        <HeroVisual video={hero.video} />
      </div>
    </section>
  );
}
