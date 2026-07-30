import { Metadata } from 'next';

import { SearchResultsGrid } from '@/components/storefront/search-results-grid';
import { SearchResultsHeading } from '@/components/storefront/search-results-heading';
import { Button, PageMain } from '@/components/storefront/ui';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import { m } from '@/lib/i18n';
import { resolveShopifyProductTags, STATIC_BESTSELLER_HANDLES } from '@/lib/product-tags';
import { getBestsellerHandles } from '@/lib/shopify/bestsellers';
import { productCardToCatalogProduct, searchProductsForDisplay } from '@/lib/shopify/search';

export const revalidate = 300;

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  const copy = m(locale).search;

  return {
    title: q ? `${q.substring(0, 100)} | ${copy.title}` : copy.title,
    description: copy.metaDescription,
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const copy = m(locale).search;

  if (!query || query.length < 2) {
    return (
      <PageMain padded={false}>
        <section className="mx-auto max-w-[1440px] px-5 pb-10 lg:pb-16">
          <div className="py-20 text-center">
            <p className="mb-3 font-sans-ui text-[14px] uppercase leading-[140%] tracking-[0.02em] text-ink/60">
              {copy.placeholder}
            </p>
            <p className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink/40">
              {copy.minChars}
            </p>
          </div>
        </section>
      </PageMain>
    );
  }

  const { products, totalCount } = await searchProductsForDisplay(query, locale, 50);
  const catalogProducts = products.map((product) => productCardToCatalogProduct(product, locale));

  let bestsellerHandles = STATIC_BESTSELLER_HANDLES;
  try {
    bestsellerHandles = await getBestsellerHandles(locale);
  } catch {
    // ponytail: badges still render without dynamic bestseller list
  }

  const badgesByHandle = Object.fromEntries(
    products.map((product) => [
      product.handle,
      resolveShopifyProductTags(product, { bestsellerHandles }),
    ])
  );

  return (
    <PageMain padded={false}>
      <section className="mx-auto max-w-[1440px] px-5 pb-10 lg:pb-16">
        <SearchResultsHeading locale={locale} query={query} totalCount={totalCount} />

        {catalogProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-3 font-sans-ui text-[14px] uppercase leading-[140%] tracking-[0.02em] text-ink/60">
              {copy.empty}
            </p>
            <p className="mb-8 font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink/40">
              {copy.emptyHint}
            </p>
            <Button href={`/${locale}/${collectionPath(SHOPIFY_COLLECTION.shopAll)}`} variant="dark">
              {copy.browseCollections}
            </Button>
          </div>
        ) : (
          <SearchResultsGrid
            products={catalogProducts}
            locale={locale}
            badgesByHandle={badgesByHandle}
          />
        )}
      </section>
    </PageMain>
  );
}
