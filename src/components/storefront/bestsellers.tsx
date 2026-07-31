import Link from 'next/link';

import type { CatalogProduct } from '@/lib/catalog/data';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import { PopularCard } from '@/components/storefront/product-card';
import { PRODUCT_GAP, SECTION_PADDING, SectionHeading } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';
import { m } from '@/lib/i18n';

interface BestsellersProps {
  locale: string;
  products: CatalogProduct[];
}

export function Bestsellers({ locale, products }: BestsellersProps) {
  const h = m(locale).home;
  const c = m(locale).common;

  return (
    <EntranceView stagger className={`w-full overflow-hidden bg-cream ${SECTION_PADDING}`}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5">
        <div data-entrance-step="1" className="flex w-full items-end justify-between">
          <SectionHeading>{h.bestsellers}</SectionHeading>
          <Link
            href={`/${locale}/${collectionPath(SHOPIFY_COLLECTION.shopAll)}`}
            className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink transition-opacity hover:opacity-60"
          >
            {c.seeAll}
          </Link>
        </div>

        <div
          data-entrance-step="2"
          className={`grid w-full grid-cols-2 ${PRODUCT_GAP} lg:grid-cols-5 lg:gap-[10px]`}
        >
          {products.map((product, index) => (
            <PopularCard
              key={product.handle}
              product={product}
              locale={locale}
              index={index}
              priceBottomPadding
            />
          ))}
        </div>
      </div>
    </EntranceView>
  );
}
