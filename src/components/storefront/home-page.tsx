import { AboutSection } from '@/components/storefront/about-section';
import { Bestsellers } from '@/components/storefront/bestsellers';
import { ProductCycler } from '@/components/storefront/product-cycler';
import { CollectionCta } from '@/components/storefront/collection-cta';
import { Hero } from '@/components/storefront/hero';
import { MostPopular } from '@/components/storefront/most-popular';
import { NewArrivals } from '@/components/storefront/new-arrivals';
import { OurValues } from '@/components/storefront/our-values';
import { SocialFeed } from '@/components/storefront/social-feed';
import type { CatalogProduct } from '@/lib/catalog/data';
import { isShopifyConfigured } from '@/lib/shopify/client';

interface HomePageProps {
  locale: string;
  popularProducts: CatalogProduct[];
  newArrivals: CatalogProduct[];
  cyclerProducts: CatalogProduct[];
  bestsellerProducts: CatalogProduct[];
}

const ORCHID_COLLECTION_HANDLE = 'orchid-collection';

export function HomePage({
  locale,
  popularProducts,
  newArrivals,
  cyclerProducts,
  bestsellerProducts,
}: HomePageProps) {
  const valuesCollectionHref = isShopifyConfigured(locale)
    ? `/${locale}/collections/${ORCHID_COLLECTION_HANDLE}`
    : `/${locale}/collections/swimwear`;

  return (
    <>
      <Hero locale={locale} />
      <MostPopular locale={locale} products={popularProducts} />
      <OurValues collectionHref={valuesCollectionHref} />
      <NewArrivals locale={locale} products={newArrivals} />
      <CollectionCta locale={locale} />
      <ProductCycler locale={locale} products={cyclerProducts} />
      <Bestsellers locale={locale} products={bestsellerProducts} />
      <AboutSection locale={locale} />
      <SocialFeed locale={locale} />
    </>
  );
}
