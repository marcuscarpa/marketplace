'use client';

import { SITE_IMAGES } from '@/lib/catalog/data';
import { Button, SectionHeading } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';
import { m } from '@/lib/i18n';

interface OurValuesProps {
  collectionHref: string;
  locale: string;
}

export function OurValues({ collectionHref, locale }: OurValuesProps) {
  const h = m(locale).home;

  return (
    <EntranceView stagger className="relative h-[520px] overflow-hidden lg:h-[900px]">
      <div className="absolute inset-0 overflow-hidden bg-neutral-900">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={SITE_IMAGES.values}
          aria-label="Woman in elegant beachwear against a natural backdrop"
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-center motion-safe:transition-opacity motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]"
        >
          <source src={SITE_IMAGES.valuesVideo} type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-5 pb-8 pt-12 lg:pb-16 lg:pt-32">
        <div className="max-w-xl">
          <div data-entrance-step="1">
            <SectionHeading light className="mb-5">
              {h.valuesTitle}
            </SectionHeading>
          </div>
          <p
            data-entrance-step="2"
            className="mb-8 max-w-md font-sans-ui text-base leading-relaxed text-white/90"
          >
            {h.valuesBody}
          </p>
          <div data-entrance-step="3">
            <Button href={collectionHref} variant="outline-white">
              {h.exploreCollection}
            </Button>
          </div>
        </div>
      </div>
    </EntranceView>
  );
}
