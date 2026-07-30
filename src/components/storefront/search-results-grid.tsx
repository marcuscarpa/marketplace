'use client';

import { PopularCard } from '@/components/storefront/product-card';
import { PRODUCT_GAP } from '@/components/storefront/ui';
import type { CatalogProduct } from '@/lib/catalog/data';
import type { ProductTagKey } from '@/lib/product-tags';

interface SearchResultsGridProps {
  products: CatalogProduct[];
  locale: string;
  badgesByHandle?: Record<string, ProductTagKey[]>;
}

export function SearchResultsGrid({ products, locale, badgesByHandle }: SearchResultsGridProps) {
  return (
    <div className={`grid grid-cols-2 ${PRODUCT_GAP} lg:grid-cols-4`}>
      {products.map((product, index) => (
        <PopularCard
          key={product.handle}
          product={product}
          locale={locale}
          index={index}
          badges={badgesByHandle?.[product.handle]}
        />
      ))}
    </div>
  );
}
