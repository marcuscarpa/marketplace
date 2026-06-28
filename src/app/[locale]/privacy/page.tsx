import { HelpPageLayout } from '@/components/help/help-page-layout';
import { PrivacyContent } from '@/lib/help/privacy-content';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Política de Privacidade | Sinesia Karol' : 'Privacy Policy | Sinesia Karol',
    description: 'Privacy policy for sinesiakarol.us.',
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt';

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="privacy"
      breadcrumbLabel={isPt ? 'Política de Privacidade' : 'Privacy Policy'}
      title={isPt ? 'Política de Privacidade' : 'Privacy Policy'}
      showContactCta={false}
    >
      <PrivacyContent locale={locale} />
    </HelpPageLayout>
  );
}
