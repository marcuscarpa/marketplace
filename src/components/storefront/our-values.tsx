'use client';

import Image from 'next/image';

import { HeroProductsWidget } from '@/components/storefront/hero-products-widget';
import { LazyAutoplayVideo } from '@/components/storefront/lazy-autoplay-video';
import type { CatalogProduct } from '@/lib/catalog/data';
import { SITE_IMAGES } from '@/lib/catalog/data';
import { Button, SectionHeading } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';
import { m } from '@/lib/i18n';

interface OurValuesProps {
  collectionHref: string;
  locale: string;
  bannerProducts?: CatalogProduct[];
}

export function OurValues({ collectionHref, locale, bannerProducts = [] }: OurValuesProps) {
  const h = m(locale).home;

  return (
    <section className="our-values our-values__scroll-track">
      <div className="our-values__media-layer">
        <LazyAutoplayVideo
          src={SITE_IMAGES.valuesVideo}
          ariaLabel="Woman in elegant beachwear against a natural backdrop"
          className="absolute inset-0 overflow-hidden bg-neutral-900"
          posterSlot={
            <Image
              src={SITE_IMAGES.values}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      </div>

      {bannerProducts.length > 0 ? (
        <div className="our-values__top-wrapper">
          <div className="our-values__top-sticky">
            <HeroProductsWidget locale={locale} products={bannerProducts} />
          </div>
        </div>
      ) : null}

      <div className="our-values__bottom-wrapper">
        <EntranceView stagger className="our-values__bottom-content">
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
        </EntranceView>
      </div>
    </section>
  );
}
