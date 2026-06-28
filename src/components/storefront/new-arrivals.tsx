import type { CatalogProduct } from '@/lib/catalog/data';
import {
  HEADING_MB,
  PRODUCT_GAP,
  SECTION_PADDING,
  SectionHeading,
} from '@/components/storefront/ui';
import { PopularCard } from '@/components/storefront/product-card';
import { EntranceView } from '@/components/storefront/entrance-view';

interface NewArrivalsProps {
  locale: string;
  products: CatalogProduct[];
}

export function NewArrivals({ locale, products }: NewArrivalsProps) {
  return (
    <EntranceView className={`mx-auto max-w-[1440px] ${SECTION_PADDING}`}>
      <SectionHeading className={HEADING_MB}>New arrivals</SectionHeading>
      <div className={`grid grid-cols-2 ${PRODUCT_GAP} lg:grid-cols-4`}>
        {products.map((product, index) => (
          <PopularCard key={product.handle} product={product} locale={locale} index={index} />
        ))}
      </div>
    </EntranceView>
  );
}
