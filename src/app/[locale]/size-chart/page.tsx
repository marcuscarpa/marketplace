import { HelpPageLayout } from '@/components/help/help-page-layout';
import { SizeChartTables } from '@/lib/help/size-chart-content';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Guia de Tamanhos | Sinesia Karol' : 'Size Guide | Sinesia Karol',
    description: 'Item size measurements and international conversions.',
  };
}

export default async function SizeChartPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="size-chart"
      breadcrumbLabel="Size Guide"
      title="Size Guide"
      showContactCta={false}
    >
      <SizeChartTables />
    </HelpPageLayout>
  );
}
