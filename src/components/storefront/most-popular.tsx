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
          className="relative hidden h-[520px] shrink-0 overflow-hidden min-[768px]:block min-[768px]:max-[1439px]:left-1/2 min-[768px]:max-[1439px]:w-screen min-[768px]:max-[1439px]:-translate-x-1/2 min-[1440px]:left-auto min-[1440px]:h-[900px] min-[1440px]:w-[690px] min-[1440px]:translate-x-0"
        >
          <div className="absolute inset-0 min-[768px]:max-[1439px]:block max-[767px]:hidden min-[1440px]:hidden">
            <Image
              src={SITE_IMAGES.popularSideIpad}
              alt="Woman in a tropical-print swimsuit seated on coastal rocks by the sea"
              fill
              sizes="100vw"
              className="block h-full w-full object-cover object-top"
            />
          </div>
          <div className="absolute inset-0 hidden min-[1440px]:block">
            <Image
              src={SITE_IMAGES.popularSide}
              alt="Woman in a tropical-print swimsuit seated on coastal rocks by the sea"
              fill
              sizes="690px"
              className="block h-full w-full scale-110 object-cover object-center"
            />
          </div>
        </div>
      </div>
    </EntranceView>
  );
}
