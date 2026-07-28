import { AboutSection } from '@/components/storefront/about-section';
import { WhyShopSection } from '@/components/storefront/why-shop-section';
import { Bestsellers } from '@/components/storefront/bestsellers';
import { CollectionSpotlight } from '@/components/storefront/collection-spotlight';
import { ProductCycler } from '@/components/storefront/product-cycler';
import { CollectionCta } from '@/components/storefront/collection-cta';
import { Hero } from '@/components/storefront/hero';
import { HeroCurtainStage } from '@/components/storefront/hero-curtain-stage';
import { MostPopular } from '@/components/storefront/most-popular';
import { NewArrivals } from '@/components/storefront/new-arrivals';
import { OurValues } from '@/components/storefront/our-values';
import { SocialFeed } from '@/components/storefront/social-feed';
import type { CatalogProduct } from '@/lib/catalog/data';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';

interface HomePageProps {
  locale: string;
  popularProducts: CatalogProduct[];
  newArrivals: CatalogProduct[];
  cyclerProducts: CatalogProduct[];
  bestsellerProducts: CatalogProduct[];
  spotlightProduct: CatalogProduct;
}

const ORCHID_COLLECTION_HANDLE = SHOPIFY_COLLECTION.featured;

export function HomePage({
  locale,
  popularProducts,
  newArrivals,
  cyclerProducts,
  bestsellerProducts,
  spotlightProduct,
}: HomePageProps) {
  const valuesCollectionHref = `/${locale}/${collectionPath(ORCHID_COLLECTION_HANDLE)}`;

  return (
    <HeroCurtainStage hero={<Hero locale={locale} />}>
      <MostPopular locale={locale} products={popularProducts} />
      <CollectionCta locale={locale} />
      <NewArrivals locale={locale} products={newArrivals} />
      <OurValues collectionHref={valuesCollectionHref} locale={locale} />
      <ProductCycler locale={locale} products={cyclerProducts} />
      <Bestsellers locale={locale} products={bestsellerProducts} />
      <CollectionSpotlight locale={locale} product={spotlightProduct} />
      <AboutSection locale={locale} />
      <WhyShopSection locale={locale} />
      <SocialFeed locale={locale} />
    </HeroCurtainStage>
  );
}
