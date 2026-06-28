import { HomePage } from '@/components/storefront/home-page';

export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return <HomePage locale={locale} />;
}
