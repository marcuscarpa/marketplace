import Link from 'next/link';

import { HelpIcon, type HelpIconName } from '@/components/help/help-icons';
import { HELP_MENU, HELP_QUICK_LINKS } from '@/lib/help/nav';

interface HelpPageLayoutProps {
  locale: string;
  currentSlug: string;
  breadcrumbLabel: string;
  title: string;
  subtitle?: string;
  steps?: readonly { label: string; icon?: HelpIconName }[];
  children: React.ReactNode;
  showContactCta?: boolean;
}

export function HelpPageLayout({
  locale,
  currentSlug,
  breadcrumbLabel,
  title,
  subtitle,
  steps,
  children,
  showContactCta = true,
}: HelpPageLayoutProps) {
  const prefix = `/${locale}`;

  return (
    <div className="bg-white pb-24 pt-[calc(84px+50px)] lg:pt-[calc(121px+50px)]">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-10 font-sans-ui text-[11px] text-neutral-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={prefix} className="transition-opacity hover:opacity-60">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-neutral-300">
              /
            </li>
            <li className="text-neutral-900">{breadcrumbLabel}</li>
          </ol>
        </nav>

        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="font-serif text-[32px] font-normal uppercase tracking-[0.08em] text-neutral-900 md:text-[40px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-xl font-sans-ui text-sm text-neutral-600">{subtitle}</p>
          )}
        </div>

        {steps && steps.length > 0 && (
          <div className="mb-14 grid grid-cols-2 gap-6 border-b border-neutral-200 pb-14 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 text-neutral-500">
                  {step.icon ? <HelpIcon name={step.icon} className="h-5 w-5" /> : null}
                </div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-700">{step.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.16em] text-neutral-500">Help Menu</p>
              <ul className="space-y-3">
                {HELP_MENU.map((link) => (
                  <li key={link.slug}>
                    <Link
                      href={`${prefix}/${link.slug}`}
                      className={`flex items-center gap-2.5 font-sans-ui text-[12px] transition-opacity hover:opacity-60 ${
                        link.slug === currentSlug ? 'text-neutral-900 underline underline-offset-4' : 'text-neutral-600'
                      }`}
                      aria-current={link.slug === currentSlug ? 'page' : undefined}
                    >
                      <HelpIcon name={link.icon} className="h-4 w-4 shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.16em] text-neutral-500">Quick Links</p>
              <ul className="space-y-3">
                {HELP_QUICK_LINKS.map((link) => (
                  <li key={link.slug}>
                    <Link
                      href={`${prefix}/${link.slug}`}
                      className="flex items-center gap-2.5 font-sans-ui text-[12px] text-neutral-600 transition-opacity hover:opacity-60"
                    >
                      <HelpIcon name={link.icon} className="h-4 w-4 shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div>{children}</div>
        </div>

        {showContactCta && (
          <div className="mt-20 border-t border-neutral-200 pt-12 text-center">
            <p className="font-serif text-lg text-neutral-900">Questions we have not answered?</p>
            <Link
              href={`${prefix}/contact`}
              className="mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-neutral-900 underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Contact us
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
