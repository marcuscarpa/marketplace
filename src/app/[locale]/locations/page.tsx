import { HelpPageLayout } from '@/components/help/help-page-layout';
import { LocationsPageContent } from '@/lib/help/locations-content';
import { m } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const nav = m(locale).nav;
  return {
    title: `${nav.locations} | Sinesia Karol`,
    description:
      locale === 'pt'
        ? 'Encontre as nossas boutiques e horários de atendimento.'
        : 'Find our boutiques and client service hours.',
  };
}

export default async function LocationsPage({ params }: PageProps) {
  const { locale } = await params;
  const nav = m(locale).nav;
  const help = m(locale).help;

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="locations"
      breadcrumbLabel={nav.locations}
      title={nav.locations}
      subtitle={help.locationsSubtitle}
    >
      <LocationsPageContent
        locale={locale}
        phoneLabel={help.phone}
        contactLabel={help.contact}
        contactHint={help.locationsContactHint}
      />
    </HelpPageLayout>
  );
}
