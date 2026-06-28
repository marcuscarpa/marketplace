'use client';

import Link from 'next/link';

import { SECTION_PADDING, ButtonShell } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';

interface CollectionCtaProps {
  locale: string;
}

const CTAS = [
  {
    label: 'SWIMWEAR',
    title: 'Redefining Resort-Level Luxury',
    cta: 'Shop Now',
    href: 'collections/swimwear',
    video: '/bloco%205-video%201-esquerda.mp4',
    imageAlt: 'Swimwear collection — resort-level luxury',
  },
  {
    label: 'READY-TO-WEAR',
    title: 'From Sunlit Days to Evenings',
    cta: 'Shop Now',
    href: 'collections/ready-to-wear',
    video: '/bloco%205-video%202-direita.mp4',
    imageAlt: 'Ready-to-wear collection — from day to evening',
  },
] as const;

export function CollectionCta({ locale }: CollectionCtaProps) {
  return (
    <EntranceView stagger className={`mx-auto max-w-[1440px] ${SECTION_PADDING}`}>
      <div className="grid gap-5 lg:grid-cols-2">
        {CTAS.map((item, index) => (
          <Link
            key={item.href}
            href={`/${locale}/${item.href}`}
            className="group relative block h-[520px] overflow-hidden lg:h-[900px]"
          >
            <div className="absolute inset-0 overflow-hidden bg-neutral-900">
              <video
                autoPlay
                muted
                loop
                playsInline
                aria-label={item.imageAlt}
                className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-center transition-transform duration-700 group-hover:scale-[1.03] motion-safe:transition-[opacity,transform] motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]"
              >
                <source src={item.video} type="video/mp4" />
              </video>
            </div>
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
