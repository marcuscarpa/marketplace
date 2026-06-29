import Link from 'next/link';
import type { ComponentProps } from 'react';

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

/** Clears fixed announcement bar + header + desktop nav (84px mobile / 121px desktop stack). */
export const HEADER_OFFSET_TOP = 'pt-[calc(84px+2.5rem)] lg:pt-[121px]';

/** Section rhythm: 40px mobile / 64px desktop — common luxury retail spacing. */
export const SECTION_PADDING = 'px-5 py-10 lg:py-16';
/** Like SECTION_PADDING but clears the fixed announcement bar + header + desktop nav. */
export const SECTION_PADDING_BELOW_HEADER = `px-5 pb-10 lg:pb-16 ${HEADER_OFFSET_TOP}`;
/** Stacked between two padded sections — vertical spacing comes from neighbors. */
export const SECTION_PADDING_FLUSH = 'px-5 py-0';
export const HEADING_MB = 'mb-6 lg:mb-8';
export const GRID_GAP = 'gap-6 lg:gap-8';
export const PRODUCT_GAP = 'gap-3';

/** Matches Our bestsellers image hover (scale on parent `group` or `group/image`). */
export const PRODUCT_IMAGE_HOVER = 'transition-transform duration-500 group-hover:scale-105';
export const PRODUCT_IMAGE_HOVER_NESTED = 'transition-transform duration-500 group-hover/image:scale-105';

type PageMainProps = ComponentProps<'main'> & {
  /** When false, only header offset — use for pages with their own hero/header band. */
  padded?: boolean;
};

/** Standard storefront page shell; clears the fixed header stack. Home hero is the exception — do not wrap. */
export function PageMain({ padded = true, className = '', children, ...props }: PageMainProps) {
  const spacing = padded ? SECTION_PADDING_BELOW_HEADER : HEADER_OFFSET_TOP;
  return (
    <main className={`min-h-screen bg-white ${spacing} ${className}`} {...props}>
      {children}
    </main>
  );
}
