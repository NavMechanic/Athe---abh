import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'primaryOnDark' | 'secondaryOnDark';

const base =
  'inline-flex min-h-[44px] items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors';

const variants: Record<Variant, string> = {
  primary: 'bg-teal-700 text-white hover:bg-teal-800',
  secondary: 'border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white',
  primaryOnDark: 'bg-teal-300 text-navy-950 hover:bg-teal-200',
  secondaryOnDark: 'border border-white/70 text-white hover:bg-white hover:text-navy-950',
};

export function buttonClass(variant: Variant = 'primary', extra = '') {
  return `${base} ${variants[variant]} ${extra}`.trim();
}

export function ButtonLink({
  href,
  variant = 'primary',
  className = '',
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={buttonClass(variant, className)}>
      {children}
    </a>
  );
}
