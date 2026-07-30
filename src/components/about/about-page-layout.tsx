import Link from 'next/link';

import { HEADER_OFFSET_TOP } from '@/components/storefront/ui';
import { m } from '@/lib/i18n';

interface AboutPageLayoutProps {
  locale: string;
  breadcrumbLabel: string;
  title: string;
  children: React.ReactNode;
}

export function AboutPageLayout({ locale, breadcrumbLabel, title, children }: AboutPageLayoutProps) {
  const prefix = `/${locale}`;
  const common = m(locale).common;

  return (
    <div className={`bg-white pb-24 ${HEADER_OFFSET_TOP}`}>
      <div className="mx-auto max-w-[800px] px-5 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-10 font-sans-ui text-[11px] text-neutral-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={prefix} className="transition-opacity hover:opacity-60">
                {common.home}
              </Link>
            </li>
            <li aria-hidden className="text-neutral-300">
              /
            </li>
            <li className="text-neutral-900">{breadcrumbLabel}</li>
          </ol>
        </nav>

        <div className="mb-12 text-center">
          <h1 className="font-serif text-[32px] font-normal uppercase tracking-[0.08em] text-neutral-900 md:text-[40px]">
            {title}
          </h1>
        </div>

        {children}
      </div>
    </div>
  );
}
