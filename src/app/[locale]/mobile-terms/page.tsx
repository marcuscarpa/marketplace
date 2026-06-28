import { HelpPageLayout } from '@/components/help/help-page-layout';
import { MobileTermsContent } from '@/lib/help/mobile-terms-content';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title:
      locale === 'pt'
        ? 'Termos de Serviço Mobile | Sinesia Karol'
        : 'Mobile Terms of Service | Sinesia Karol',
    description: 'SMS and text messaging terms for Sinesia Karol.',
  };
}

export default async function MobileTermsPage({ params }: PageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt';

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="mobile-terms"
      breadcrumbLabel={isPt ? 'Termos de Serviço Mobile' : 'Mobile Terms of Service'}
      title={isPt ? 'Termos de Serviço Mobile' : 'Mobile Terms of Service'}
      showContactCta={false}
    >
      <MobileTermsContent locale={locale} />
    </HelpPageLayout>
  );
}
