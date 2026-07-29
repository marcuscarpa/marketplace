import { HomePage } from '@/components/storefront/home-page';
import {
  BESTSELLERS,
  CYCLER_PRODUCTS,
  NEW_ARRIVALS,
  POPULAR_PRODUCTS,
  SPOTLIGHT_PRODUCT,
  type CatalogProduct,
} from '@/lib/catalog/data';
import { withShopifyHoverImages } from '@/lib/catalog/shopify-images';

export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

function pickEnriched(
  products: CatalogProduct[],
  byHandle: Map<string, CatalogProduct>,
): CatalogProduct[] {
  return products.map((product) => byHandle.get(product.handle) ?? product);
}

export default async function LocaleHomePage({ params }: HomePageProps) {
  const { locale } = await params;

  const enriched = await withShopifyHoverImages(
    [
      ...POPULAR_PRODUCTS,
      ...NEW_ARRIVALS,
      ...CYCLER_PRODUCTS,
      ...BESTSELLERS,
      SPOTLIGHT_PRODUCT,
    ],
    locale,
  );
  const byHandle = new Map(enriched.map((product) => [product.handle, product]));

  return (
    <HomePage
      locale={locale}
      popularProducts={pickEnriched(POPULAR_PRODUCTS, byHandle)}
      newArrivals={pickEnriched(NEW_ARRIVALS, byHandle)}
      cyclerProducts={pickEnriched(CYCLER_PRODUCTS, byHandle)}
      bestsellerProducts={pickEnriched(BESTSELLERS, byHandle)}
      spotlightProduct={pickEnriched([SPOTLIGHT_PRODUCT], byHandle)[0]!}
    />
  );
}
