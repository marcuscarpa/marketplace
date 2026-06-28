'use client';

import Image from 'next/image';

import { SITE_IMAGES, type CatalogProduct } from '@/lib/catalog/data';
import { PopularCard } from '@/components/storefront/product-card';
import { EntranceView } from '@/components/storefront/entrance-view';
import { m } from '@/lib/i18n';

interface MostPopularProps {
  locale: string;
  products: CatalogProduct[];
}

export function MostPopular({ locale, products }: MostPopularProps) {
  const h = m(locale).home;

  return (
    <EntranceView
      id="most-popular"
      stagger
      className="flex w-full flex-col gap-6 px-5 py-10 min-[1440px]:gap-8 min-[1440px]:py-16"
    >
      <h3
        data-entrance-step="1"
        className="font-serif text-[32px] font-normal leading-none tracking-[-0.04em] text-ink min-[1440px]:text-[48px]"
      >
        {h.mostPopular}
      </h3>

      <div
        data-entrance-step="2"
        className="relative flex w-full flex-col gap-8 min-[1440px]:flex-row min-[1440px]:items-start min-[1440px]:gap-5"
      >
        <ol className="flex w-full flex-row gap-2 min-[1440px]:sticky min-[1440px]:top-[100px] min-[1440px]:w-[690px] min-[1440px]:shrink-0 min-[1440px]:gap-3">
          {products.map((product, index) => (
            <li key={product.handle} className="min-w-0 flex-1">
              <PopularCard product={product} locale={locale} index={index} />
            </li>
          ))}
        </ol>

        <div
          data-entrance-step="3"
          className="relative hidden h-[520px] w-full shrink-0 overflow-hidden min-[768px]:block min-[1440px]:h-[900px] min-[1440px]:w-[690px]"
        >
          <Image
            src={SITE_IMAGES.popularSide}
            alt="Woman in a tropical-print swimsuit seated on coastal rocks by the sea"
            fill
            sizes="(max-width: 1439px) 100vw, 690px"
            className="block h-full w-full object-contain object-center min-[1440px]:scale-110 min-[1440px]:object-cover"
          />
        </div>
      </div>
    </EntranceView>
  );
}
