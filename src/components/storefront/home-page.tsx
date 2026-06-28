import { AboutSection } from '@/components/storefront/about-section';
import { Bestsellers } from '@/components/storefront/bestsellers';
import { ProductCycler } from '@/components/storefront/product-cycler';
import { CollectionCta } from '@/components/storefront/collection-cta';
import { Hero } from '@/components/storefront/hero';
import { MostPopular } from '@/components/storefront/most-popular';
import { NewArrivals } from '@/components/storefront/new-arrivals';
import { OurValues } from '@/components/storefront/our-values';
import { SocialFeed } from '@/components/storefront/social-feed';
import { isShopifyConfigured } from '@/lib/shopify/client';

interface HomePageProps {
  locale: string;
}

const ORCHID_COLLECTION_HANDLE = 'orchid-collection';

export function HomePage({ locale }: HomePageProps) {
  const valuesCollectionHref = isShopifyConfigured(locale)
    ? `/${locale}/collections/${ORCHID_COLLECTION_HANDLE}`
    : `/${locale}/collections/swimwear`;

  return (
    <>
      <Hero locale={locale} />
      <MostPopular locale={locale} />
      <OurValues collectionHref={valuesCollectionHref} />
      <NewArrivals locale={locale} />
      <CollectionCta locale={locale} />
      <ProductCycler locale={locale} />
      <Bestsellers locale={locale} />
      <AboutSection locale={locale} />
      <SocialFeed />
    </>
  );
}
