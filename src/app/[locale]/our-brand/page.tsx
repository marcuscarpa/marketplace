import { AboutPageLayout } from '@/components/about/about-page-layout';
import { OurBrandContent } from '@/lib/about/about-content';
import { m } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const nav = m(locale).nav;
  return {
    title: `${nav.ourBrand} | Sinesia Karol`,
    description: 'Discover the Sinesia Karol brand story, atelier, and Brazilian craftsmanship.',
  };
}

export default async function OurBrandPage({ params }: PageProps) {
  const { locale } = await params;
  const nav = m(locale).nav;

  return (
    <AboutPageLayout locale={locale} breadcrumbLabel={nav.ourBrand} title={nav.ourBrand}>
      <OurBrandContent locale={locale} />
    </AboutPageLayout>
  );
}
