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
import type { CatalogProduct, CategoryCyclerItem } from '@/lib/catalog/data';
import { VALUES_BANNER_PRODUCTS } from '@/lib/catalog/banner-hero-products';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';

interface HomePageProps {
  locale: string;
  popularProducts: CatalogProduct[];
  newArrivals: CatalogProduct[];
  cyclerCategories: CategoryCyclerItem[];
  bestsellerProducts: CatalogProduct[];
  spotlightProduct: CatalogProduct;
}

const ORCHID_COLLECTION_HANDLE = SHOPIFY_COLLECTION.featured;

export function HomePage({
  locale,
  popularProducts,
  newArrivals,
  cyclerCategories,
  bestsellerProducts,
  spotlightProduct,
}: HomePageProps) {
  const valuesCollectionHref = `/${locale}/${collectionPath(ORCHID_COLLECTION_HANDLE)}`;

  return (
    <HeroCurtainStage hero={<Hero locale={locale} />}>
      <MostPopular locale={locale} products={popularProducts} />
      <CollectionCta locale={locale} />
      <NewArrivals locale={locale} products={newArrivals} />
      <OurValues
        bannerProducts={VALUES_BANNER_PRODUCTS}
        collectionHref={valuesCollectionHref}
        locale={locale}
      />
      <ProductCycler locale={locale} categories={cyclerCategories} />
      <Bestsellers locale={locale} products={bestsellerProducts} />
      <CollectionSpotlight locale={locale} product={spotlightProduct} />
      <WhyShopSection locale={locale} />
      <SocialFeed locale={locale} />
    </HeroCurtainStage>
  );
}
