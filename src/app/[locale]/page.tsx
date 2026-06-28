import { HomePage } from '@/components/storefront/home-page';
import {
  BESTSELLERS,
  CYCLER_PRODUCTS,
  NEW_ARRIVALS,
  POPULAR_PRODUCTS,
  SPOTLIGHT_PRODUCT,
} from '@/lib/catalog/data';
import { withShopifyHoverImages } from '@/lib/catalog/shopify-images';

export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHomePage({ params }: HomePageProps) {
  const { locale } = await params;

  const [popularProducts, newArrivals, cyclerProducts, bestsellerProducts, spotlightProduct] =
    await Promise.all([
      withShopifyHoverImages(POPULAR_PRODUCTS, locale),
      withShopifyHoverImages(NEW_ARRIVALS, locale),
      withShopifyHoverImages(CYCLER_PRODUCTS, locale),
      withShopifyHoverImages(BESTSELLERS, locale),
      withShopifyHoverImages([SPOTLIGHT_PRODUCT], locale).then((items) => items[0]!),
    ]);

  return (
    <HomePage
      locale={locale}
      popularProducts={popularProducts}
      newArrivals={newArrivals}
      cyclerProducts={cyclerProducts}
      bestsellerProducts={bestsellerProducts}
      spotlightProduct={spotlightProduct}
    />
  );
}
