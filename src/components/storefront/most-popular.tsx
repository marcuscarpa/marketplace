'use client';

import Image from 'next/image';

import { SITE_IMAGES, type CatalogProduct } from '@/lib/catalog/data';
import { PopularCard } from '@/components/storefront/product-card';
import { EntranceView } from '@/components/storefront/entrance-view';

interface MostPopularProps {
  locale: string;
  products: CatalogProduct[];
}

export function MostPopular({ locale, products }: MostPopularProps) {
  return (
    <EntranceView
      id="most-popular"
      stagger
      className="flex w-full flex-col gap-8 px-5 py-[60px] min-[1440px]:gap-10 min-[1440px]:py-[120px]"
    >
      <h3
        data-entrance-step="1"
        className="font-serif text-[32px] font-normal leading-none tracking-[-0.04em] text-ink min-[1440px]:text-[48px]"
      >
        Most popular
      </h3>

      <div
        data-entrance-step="2"
        className="relative flex w-full flex-col gap-[60px] min-[1440px]:flex-row min-[1440px]:items-start min-[1440px]:gap-5"
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
          className="relative h-[840px] w-full overflow-hidden min-[1440px]:h-[900px] min-[1440px]:w-[690px] min-[1440px]:shrink-0"
        >
          <div className="absolute inset-0 min-[1440px]:hidden">
            <Image
              src={SITE_IMAGES.popularSideMobile}
              alt="Woman in a tropical-print swimsuit seated on coastal rocks by the sea"
              fill
              sizes="100vw"
              className="block h-full w-full object-cover object-center"
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
