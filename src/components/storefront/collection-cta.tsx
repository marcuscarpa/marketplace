'use client';

import Link from 'next/link';

import { LazyAutoplayVideo } from '@/components/storefront/lazy-autoplay-video';
import { SECTION_PADDING_FLUSH, ButtonShell } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import { m } from '@/lib/i18n';

interface CollectionCtaProps {
  locale: string;
}

export function CollectionCta({ locale }: CollectionCtaProps) {
  const h = m(locale).home;
  const c = m(locale).common;
  const ctas = [
    {
      label: h.swimwearLabel,
      title: h.swimwearTitle,
      cta: c.shopNow,
      href: collectionPath(SHOPIFY_COLLECTION.swimwear),
      video: '/bloco%205-video%201-esquerda.mp4',
      imageAlt: h.swimwearTitle,
    },
    {
      label: h.rtwLabel,
      title: h.rtwTitle,
      cta: c.shopNow,
      href: collectionPath(SHOPIFY_COLLECTION.readyToWear),
      video: '/bloco%205-video%202-direita.mp4',
      imageAlt: h.rtwTitle,
    },
  ] as const;

  return (
    <EntranceView stagger className={`mx-auto max-w-[1440px] ${SECTION_PADDING_FLUSH}`}>
      <div className="grid gap-5 lg:grid-cols-2">
        {ctas.map((item, index) => (
          <Link
            key={item.href}
            href={`/${locale}/${item.href}`}
            className="group relative block h-[520px] overflow-hidden lg:h-[900px]"
          >
            <LazyAutoplayVideo
              src={item.video}
              ariaLabel={item.imageAlt}
              className="absolute inset-0 overflow-hidden bg-neutral-900"
              videoClassName="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-center transition-transform duration-700 group-hover:scale-[1.03] motion-safe:transition-[opacity,transform] motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div
              data-entrance-step={String(index + 1)}
              className="absolute inset-x-0 bottom-0 p-8 lg:p-10"
            >
              <p className="mb-3 text-[12px] uppercase tracking-[0.02em] text-white/80 font-sans-ui">
                {item.label}
              </p>
              <h2 className="mb-6 max-w-sm font-serif text-[clamp(1.75rem,3vw,3rem)] font-normal leading-none tracking-[-0.04em] text-white">
                {item.title}
              </h2>
              <ButtonShell>{item.cta}</ButtonShell>
            </div>
          </Link>
        ))}
      </div>
    </EntranceView>
  );
}
