'use client';

import Image from 'next/image';

import { SITE_IMAGES, type CatalogProduct } from '@/lib/catalog/data';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import { PopularCard } from '@/components/storefront/product-card';
import { Button, SECTION_PADDING_FLUSH } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';
import { m } from '@/lib/i18n';

interface CollectionSpotlightProps {
  locale: string;
  product: CatalogProduct;
}

export function CollectionSpotlight({ locale, product }: CollectionSpotlightProps) {
  const h = m(locale).home;
  const c = m(locale).common;
  const collectionHref = `/${locale}/${collectionPath(SHOPIFY_COLLECTION.shopAll)}`;

  return (
    <EntranceView
      stagger
      className={`flex w-full flex-col gap-7 ${SECTION_PADDING_FLUSH} pb-10 lg:pb-16 min-[1440px]:flex-row min-[1440px]:items-center min-[1440px]:gap-8`}
    >
      <div data-entrance-step="1" className="relative w-full min-[1440px]:flex-[3]">
        <article className="relative aspect-[682/1024] w-full overflow-hidden">
          <figure className="absolute inset-0 m-0 min-[1440px]:hidden">
            <Image
              src={SITE_IMAGES.collectionWomenMobile}
              alt={h.womenCollectionImageAlt}
              fill
              sizes="100vw"
              className="block h-full w-full object-cover object-center"
            />
          </figure>
          <figure className="absolute inset-0 m-0 hidden min-[1440px]:block">
            <Image
              src={SITE_IMAGES.collectionWomen}
              alt={h.womenCollectionImageAlt}
              fill
              sizes="(max-width: 1439px) 75vw, 75vw"
              className="block h-full w-full object-cover object-center"
            />
          </figure>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
            <h2 className="mb-6 max-w-sm font-serif text-[clamp(1.75rem,3vw,3rem)] font-normal leading-none tracking-[-0.04em] text-white">
              {h.womenCollectionTitle}
            </h2>
            <Button href={collectionHref} variant="outline-white">
              {c.shopNow}
            </Button>
          </div>
        </article>
      </div>

      <div
        data-entrance-step="2"
        className="flex w-full min-[1440px]:flex-1 min-[1440px]:items-center min-[1440px]:justify-center"
      >
        <div className="mx-auto w-full max-w-[339px]">
          <PopularCard product={product} locale={locale} />
        </div>
      </div>
    </EntranceView>
  );
}
