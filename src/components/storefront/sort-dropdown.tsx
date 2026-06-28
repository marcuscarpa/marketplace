'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ProductCard } from '@/components/ui/product-card';
import { ShopifyProduct } from '@/lib/shopify/types';

interface SortDropdownProps {
  products: ShopifyProduct[];
  locale: string;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  newest: 'Newest',
};

function applySort(products: ShopifyProduct[], sort: SortOption): ShopifyProduct[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) =>
        Number(a.priceRange?.minVariantPrice?.amount ?? 0) - Number(b.priceRange?.minVariantPrice?.amount ?? 0)
      );
    case 'price-desc':
      return sorted.sort((a, b) =>
        Number(b.priceRange?.minVariantPrice?.amount ?? 0) - Number(a.priceRange?.minVariantPrice?.amount ?? 0)
      );
    case 'newest':
      return sorted;
    case 'featured':
    default:
      return sorted;
  }
}

export function SortDropdown({ products, locale }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) ?? 'featured');

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as SortOption;
    setSort(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', next);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const sortedProducts = applySort(products, sort);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <p className="text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          aria-label="Sort products"
          value={sort}
          onChange={handleSort}
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center font-sans-ui text-sm uppercase tracking-[0.02em] text-ink/60">
          No products in this collection yet.
        </p>
      )}
    </>
  );
}