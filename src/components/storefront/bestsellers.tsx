import Link from 'next/link';

import type { CatalogProduct } from '@/lib/catalog/data';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import { PopularCard } from '@/components/storefront/product-card';
import { PRODUCT_GAP, SECTION_PADDING_FLUSH, SectionHeading } from '@/components/storefront/ui';
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
    <EntranceView className={`mx-auto max-w-[1440px] bg-cream ${SECTION_PADDING_FLUSH} pt-10 lg:pt-16`}>
      <div className="mx-auto mb-6 flex max-w-[1440px] items-end justify-between lg:mb-8">
        <SectionHeading>{h.bestsellers}</SectionHeading>
        <Link
          href={`/${locale}/${collectionPath(SHOPIFY_COLLECTION.shopAll)}`}
          className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink transition-opacity hover:opacity-60"
        >
          {c.seeAll}
        </Link>
      </div>

      <div className={`mx-auto grid max-w-[1440px] grid-cols-2 ${PRODUCT_GAP} lg:grid-cols-5`}>
        {products.map((product, index) => (
          <PopularCard key={product.handle} product={product} locale={locale} index={index} />
        ))}
      </div>
    </EntranceView>
  );
}
