import { HelpPageLayout } from '@/components/help/help-page-layout';
import { TermsOfUseContent } from '@/lib/help/terms-of-use-content';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Termos de Uso | Sinesia Karol' : 'Terms of Use | Sinesia Karol',
    description: 'Terms of use for sinesiakarol.com.',
  };
}

export default async function TermsOfUsePage({ params }: PageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt';

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="terms-of-use"
      breadcrumbLabel={isPt ? 'Termos de Uso' : 'Terms of Use'}
      title={isPt ? 'Termos de Uso' : 'Terms of Use'}
      showContactCta={false}
    >
      <TermsOfUseContent locale={locale} />
    </HelpPageLayout>
  );
}
