import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

// Small styled primitives. The old stylesheet gave every bare <input> and
// <button> a look via element selectors; Tailwind has no element defaults,
// so these components are where that shared styling now lives.

const inputClasses =
  'rounded-[10px] border border-border bg-surface-2 px-3 py-2.5 ' +
  'font-[inherit] text-text placeholder:text-muted/70';

/** Text input carrying the app's field styling. Numbers render in mono. */
export function Field({
  label,
  optional,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  optional?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-[0.82rem] font-medium text-muted">
      <span>
        {label}
        {optional && (
          <span className="ml-1 font-normal opacity-60">optional</span>
        )}
      </span>
      <input
        className={`${inputClasses} ${
          props.type === 'number' ? 'font-mono' : ''
        } ${className}`}
        {...props}
      />
    </label>
  );
}

/** Primary (violet) and ghost (outlined) buttons. */
export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
}) {
  const base =
    'cursor-pointer rounded-[10px] px-4 py-2.5 font-semibold ' +
    'transition-[filter] disabled:cursor-default disabled:opacity-55';

  const variants = {
    primary: 'bg-accent text-on-accent border-none hover:not-disabled:brightness-110',
    ghost:
      'border border-border bg-transparent text-muted hover:border-muted hover:text-text',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/** Inline red error banner shown above/inside forms. */
export function FormError({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3.5 rounded-[10px] border border-expense/40 bg-expense/12 px-3 py-2 text-[0.85rem] text-expense">
      {children}
    </p>
  );
}

/** Small-caps section heading used inside dashboard panels. */
export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 font-display text-[0.85rem] font-semibold uppercase tracking-[0.08em] text-muted">
      {children}
    </h2>
  );
}

/** The violet wordmark. */
export function Brand() {
  return (
    <p className="font-display text-[0.8rem] font-bold uppercase tracking-[0.14em] text-accent">
      Raven Finance
    </p>
  );
}
