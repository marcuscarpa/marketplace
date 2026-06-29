import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  CollectionProducts,
  ShopifyCollectionProducts,
} from '@/components/storefront/collection-products';
import { PageMain, SECTION_PADDING_BELOW_HEADER, SectionHeading } from '@/components/storefront/ui';
import { getCatalogCollection } from '@/lib/catalog/catalog';
import { getSocialShareImageUrl } from '@/lib/site-metadata';
import { withShopifyHoverImages } from '@/lib/catalog/shopify-images';
import { getBestsellerHandles } from '@/lib/shopify/bestsellers';
import { getShopifyClient, isShopifyConfigured } from '@/lib/shopify/client';
import { GET_COLLECTION_BY_HANDLE } from '@/lib/shopify/queries';

export const revalidate = 3600;

interface CollectionPageProps {
  params: Promise<{ locale: string; handle: string }>;
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

type CollectionResult =
  | { source: 'shopify'; collection: ShopifyCollection }
  | { source: 'catalog'; collection: ReturnType<typeof getCatalogCollection> & object };

async function getCollection(handle: string, locale: string): Promise<CollectionResult | null> {
  if (isShopifyConfigured(locale)) {
    try {
      const client = getShopifyClient(locale);
      const data = await client.execute<{ collection: ShopifyCollection | null }>(
        GET_COLLECTION_BY_HANDLE,
        { handle, first: 24 }
      );
      if (data?.collection) return { source: 'shopify', collection: data.collection };
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

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { locale, handle } = await params;
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

  const { collection } = result;
  const products = collection.products?.nodes || [];
  const bestsellerHandles = await getBestsellerHandles(locale);

  return (
    <PageMain padded={false}>
      <header className="bg-gray-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight mb-4">{collection.title}</h1>
          {collection.description && (
            <p className="text-lg text-gray-300 max-w-2xl">{collection.description}</p>
          )}
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ShopifyCollectionProducts
          products={products}
          locale={locale}
          collectionTitle={collection.title}
          bestsellerHandles={bestsellerHandles}
        />
      </section>
    </PageMain>
  );
}
