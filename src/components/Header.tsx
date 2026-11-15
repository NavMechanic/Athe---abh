'use client';

import { useState } from 'react';
import site from '@content/site.json';
import { ButtonLink } from './Button';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="on-dark sticky top-0 z-40 border-b border-white/10 bg-navy-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <a href="#main" className="text-lg font-bold tracking-[0.2em] text-white">
          {site.name}
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="py-2 text-sm text-slate-200 hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={site.cta.primary.href} variant="primaryOnDark" className="hidden sm:inline-flex">
            {site.cta.primary.label}
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/30 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
            </svg>
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Primary mobile" hidden={!open} className="border-t border-white/10 lg:hidden">
        <ul className="mx-auto max-w-6xl px-4 py-2 md:px-8">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex min-h-[44px] items-center text-sm text-slate-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="py-3 sm:hidden">
            <a
              href={site.cta.primary.href}
              className="flex min-h-[44px] items-center justify-center rounded-md bg-teal-300 text-sm font-semibold text-navy-950"
              onClick={() => setOpen(false)}
            >
              {site.cta.primary.label}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
