'use client';

import Image from 'next/image';
import Link from 'next/link';

import { SITE_IMAGES, type CatalogProduct } from '@/lib/catalog/data';
import { PopularCard } from '@/components/storefront/product-card';
import { EntranceView } from '@/components/storefront/entrance-view';
import { m } from '@/lib/i18n';

interface CollectionSpotlightProps {
  locale: string;
  product: CatalogProduct;
}

export function CollectionSpotlight({ locale, product }: CollectionSpotlightProps) {
  const h = m(locale).home;
  const collectionHref = `/${locale}/collections/women`;

  return (
    <EntranceView
      stagger
      className="flex w-full flex-col gap-7 px-5 pb-10 pt-[120px] min-[1440px]:h-screen min-[1440px]:flex-row min-[1440px]:items-stretch"
    >
      <div
        data-entrance-step="1"
        className="relative min-h-0 w-full min-[1440px]:h-full min-[1440px]:flex-[3]"
      >
        <article className="relative aspect-[682/1024] h-full w-full overflow-hidden min-[1440px]:aspect-auto">
          <Link
            href={collectionHref}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-3 font-sans-ui text-[12px] uppercase leading-[100%] tracking-[0.02em] text-ink no-underline transition-opacity hover:opacity-80"
          >
            {h.womenCollectionBadge}
          </Link>
          <figure className="absolute inset-0 m-0">
            <Image
              src={SITE_IMAGES.collectionWomen}
              alt={h.womenCollectionImageAlt}
              fill
              sizes="(max-width: 1439px) 75vw, 75vw"
              className="block h-full w-full object-cover object-center"
            />
          </figure>
        </article>
      </div>

      <div
        data-entrance-step="2"
        className="flex w-full min-[1440px]:h-full min-[1440px]:flex-1 min-[1440px]:items-center min-[1440px]:justify-center"
      >
        <div className="mx-auto w-full max-w-[339px]">
          <PopularCard product={product} locale={locale} />
        </div>
      </div>
    </EntranceView>
  );
}
