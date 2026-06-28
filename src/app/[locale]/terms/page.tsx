import { HelpPageLayout } from '@/components/help/help-page-layout';
import { TermsContent } from '@/lib/help/terms-content';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Termos e Condições | Sinesia Karol' : 'Terms and Conditions | Sinesia Karol',
    description: 'Terms and conditions for shopping at Sinesia Karol.',
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt';

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="terms"
      breadcrumbLabel={isPt ? 'Termos e Condições' : 'Terms and Conditions'}
      title={isPt ? 'Termos e Condições' : 'Terms and Conditions'}
      showContactCta={false}
    >
      <TermsContent locale={locale} />
    </HelpPageLayout>
  );
}
