import Link from 'next/link';

type ButtonVariant = 'white' | 'dark' | 'outline-white';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  newTab?: boolean;
}

const bgClass: Record<ButtonVariant, string> = {
  white: 'btn__bg--white',
  dark: 'btn__bg--dark',
  'outline-white': 'btn__bg--transparent',
};

const textClass: Record<ButtonVariant, string> = {
  white: 'btn__text--white',
  dark: 'btn__text--dark',
  'outline-white': 'btn__text--outline-white',
};

function ButtonInner({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: ButtonVariant;
}) {
  return (
    <>
      <div aria-hidden className={`btn__bg ${bgClass[variant]}`} />
      <div className="btn__label">
        <p className={`btn__text ${textClass[variant]}`}>{children}</p>
      </div>
    </>
  );
}

export function Button({
  href,
  children,
  variant = 'white',
  className = '',
  newTab = false,
}: ButtonProps) {
  return (
    <div className={`btn-container ${className}`}>
      <Link
        href={href}
        className={`btn ${variant === 'outline-white' ? 'btn--outline-white' : ''}`}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <ButtonInner variant={variant}>{children}</ButtonInner>
      </Link>
    </div>
  );
}

/** Visual-only button shell (e.g. inside another link). */
export function ButtonShell({
  children,
  variant = 'white',
  className = '',
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <span className={`btn-container inline-block ${className}`}>
      <span
        className={`btn pointer-events-none ${variant === 'outline-white' ? 'btn--outline-white' : ''}`}
      >
        <ButtonInner variant={variant}>{children}</ButtonInner>
      </span>
    </span>
  );
}

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export function SectionHeading({ children, className = '', light = false }: SectionHeadingProps) {
  return (
    <h3
      className={`font-serif text-[clamp(2rem,3.33vw,3rem)] font-normal leading-none tracking-[-0.04em] ${
        light ? 'text-white' : 'text-ink'
      } ${className}`}
    >
      {children}
    </h3>
  );
}

/** catalog design spec: 120px vertical padding, 20px horizontal, sections flush. */
export const SECTION_PADDING = 'px-5 py-[120px]';
export const HEADING_MB = 'mb-10';
export const GRID_GAP = 'gap-10';
export const PRODUCT_GAP = 'gap-3';

/** Matches Our bestsellers image hover (scale on parent `group` or `group/image`). */
export const PRODUCT_IMAGE_HOVER = 'transition-transform duration-500 group-hover:scale-105';
export const PRODUCT_IMAGE_HOVER_NESTED = 'transition-transform duration-500 group-hover/image:scale-105';
