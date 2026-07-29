import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  CollectionProducts,
  ShopifyCollectionProducts,
} from '@/components/storefront/collection-products';
import { PageMain, SECTION_PADDING_BELOW_HEADER, SectionHeading } from '@/components/storefront/ui';
import { getCatalogCollection } from '@/lib/catalog/catalog';
import {
  combinedCollectionTitle,
  isCombinedCollectionHandle,
  isCombinedCollectionHandleForLocale,
} from '@/lib/catalog/combined-collections';
import { SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import { getSocialShareImageUrl } from '@/lib/site-metadata';
import { withShopifyHoverImages } from '@/lib/catalog/shopify-images';
import { buildFilterState, extractFacets, shopifyToFilterable, type FilterState, type ProductFacets } from '@/lib/product-filters';
import { getBestsellerHandles } from '@/lib/shopify/bestsellers';
import {
  fetchCollectionInitialPayload,
  type CollectionProductsPage,
} from '@/lib/shopify/collection-products';
import { STATIC_BESTSELLER_HANDLES } from '@/lib/product-tags';
import { isShopifyConfigured } from '@/lib/shopify/client';
import { getSaleProducts } from '@/lib/shopify/sale-products';

export const revalidate = 3600;

interface CollectionPageProps {
  params: Promise<{ locale: string; handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface ShopifyCollection {
  id: string;
  title: string;
  description: string;
  handle: string;
  image: { url: string; altText: string | null } | null;
  products: {
    nodes: Array<{
      id: string;
      title: string;
      description: string;
      handle: string;
      vendor: string;
      tags?: string[];
      publishedAt?: string | null;
      totalInventory?: number | null;
      options?: Array<{ name: string; values: string[] }>;
      images: { nodes: Array<{ url: string; altText: string | null }> };
      priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
      variants: {
        nodes: Array<{
          id: string;
          availableForSale?: boolean;
          price: { amount: string; currencyCode?: string };
          compareAtPrice?: { amount: string; currencyCode?: string } | null;
          selectedOptions?: Array<{ name: string; value: string }>;
        }>;
      };
      metafields: Array<{ namespace: string; key: string; value: string; type: string }>;
    }>;
  };
}

type ShopifyCollectionWithMeta = ShopifyCollection & {
  pageInfo: CollectionProductsPage['pageInfo'];
  facets: ProductFacets;
};

type CollectionResult =
  | { source: 'shopify'; collection: ShopifyCollectionWithMeta }
  | { source: 'catalog'; collection: ReturnType<typeof getCatalogCollection> & object };

async function getCollection(handle: string, locale: string): Promise<CollectionResult | null> {
  if (isShopifyConfigured(locale)) {
    try {
      const { page, facets: _facets } = await fetchCollectionInitialPayload(handle, locale);
      const { products, collection, pageInfo } = page;

      if (collection || isCombinedCollectionHandle(handle) || (await isCombinedCollectionHandleForLocale(handle, locale))) {
        const title =
          combinedCollectionTitle(handle, locale) ??
          collection?.title ??
          handle;

        let nodes = products;
        if (handle === SHOPIFY_COLLECTION.sale && nodes.length === 0) {
          nodes = await getSaleProducts(locale);
        }

        const shopifyCollection: ShopifyCollectionWithMeta = {
          id: collection?.id ?? `virtual-${handle}`,
          title,
          description: collection?.description ?? '',
          handle,
          image: collection?.image ?? null,
          products: { nodes },
          pageInfo,
          facets: _facets,
        };

        return { source: 'shopify', collection: shopifyCollection };
      }
    } catch {
      // ponytail: fall through to static catalog when Shopify is unreachable
    }
  }

  const catalog = getCatalogCollection(handle);
  return catalog ? { source: 'catalog', collection: catalog } : null;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const result = await getCollection(handle, locale);
  if (!result) return { title: 'Collection Not Found' };

  const description =
    result.collection.description || `Shop the ${result.collection.title} collection`;
  let image = getSocialShareImageUrl();

  if (result.source === 'shopify') {
    const { collection } = result;
    image =
      collection.image?.url ||
      collection.products.nodes[0]?.images.nodes[0]?.url ||
      getSocialShareImageUrl();
  } else {
    const { collection } = result;
    image = collection.image ?? collection.products[0]?.image ?? getSocialShareImageUrl();
  }

  const { title } = result.collection;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { locale, handle } = await params;
  const query = await searchParams;
  const result = await getCollection(handle, locale);

  if (!result) {
    notFound();
  }

  if (result.source === 'catalog') {
    const { collection } = result;
    const products = await withShopifyHoverImages(collection.products, locale);

    return (
      <section className={`mx-auto max-w-[1440px] ${SECTION_PADDING_BELOW_HEADER}`}>
        <SectionHeading className="mb-4">{collection.title}</SectionHeading>
        {collection.description && (
          <p className="mb-10 max-w-2xl font-sans-ui text-[14px] uppercase leading-[140%] tracking-[0.02em] text-ink/60">
            {collection.description}
          </p>
        )}
        {products.length > 0 ? (
          <CollectionProducts
            products={products}
            locale={locale}
            collectionTitle={collection.title}
          />
        ) : (
          <p className="py-20 text-center font-sans-ui text-sm uppercase tracking-[0.02em] text-ink/60">
            No products in this collection yet.
          </p>
        )}
      </section>
    );
  }

  const collection = result.collection;
  const products = collection.products?.nodes || [];
  const { pageInfo, facets } = collection;
  let bestsellerHandles = STATIC_BESTSELLER_HANDLES;
  try {
    bestsellerHandles = await getBestsellerHandles(locale);
  } catch {
    // ponytail: badges still render without dynamic bestseller list
  }

  const initialFilters: FilterState | undefined = (() => {
    if (Object.keys(query).length === 0) return undefined;
    const filterable = products.map(shopifyToFilterable);
    const facets = extractFacets(filterable);
    return buildFilterState(query, facets, filterable);
  })();

  return (
    <PageMain padded={false}>
      <section className={`mx-auto max-w-[1440px] px-5 pb-10 lg:pb-16`}>
        <SectionHeading className="mb-4">{collection.title}</SectionHeading>
        {collection.description && (
          <p className="mb-10 max-w-2xl font-sans-ui text-[14px] uppercase leading-[140%] tracking-[0.02em] text-ink/60">
            {collection.description}
          </p>
        )}
        <ShopifyCollectionProducts
          collectionHandle={handle}
          products={products}
          pageInfo={pageInfo}
          facets={facets}
          locale={locale}
          collectionTitle={collection.title}
          bestsellerHandles={bestsellerHandles}
          forceSaleBadge={handle === SHOPIFY_COLLECTION.sale}
          initialFilters={initialFilters}
        />
      </section>
    </PageMain>
  );
}
