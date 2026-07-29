import { HomePage } from '@/components/storefront/home-page';
import {
  BESTSELLERS,
  CYCLER_PRODUCTS,
  NEW_ARRIVALS,
  POPULAR_PRODUCTS,
  SPOTLIGHT_PRODUCT,
} from '@/lib/catalog/data';

export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <HomePage
      locale={locale}
      popularProducts={POPULAR_PRODUCTS}
      newArrivals={NEW_ARRIVALS}
      cyclerProducts={CYCLER_PRODUCTS}
      bestsellerProducts={BESTSELLERS}
      spotlightProduct={SPOTLIGHT_PRODUCT}
    />
  );
}
