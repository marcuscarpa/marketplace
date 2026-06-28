import { HelpPageLayout } from '@/components/help/help-page-layout';
import { DoNotSellContent } from '@/lib/help/do-not-sell-content';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title:
      locale === 'pt'
        ? 'Não vender ou partilhar os meus dados | Sinesia Karol'
        : 'Do Not Sell or Share My Info | Sinesia Karol',
    description:
      locale === 'pt'
        ? 'A Sinesia Karol não vende as suas informações pessoais.'
        : 'Sinesia Karol does not sell your personal information.',
  };
}

export default async function DoNotSellPage({ params }: PageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt';

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="privacy"
      breadcrumbLabel={isPt ? 'Não vender os meus dados' : 'Do Not Sell or Share My Info'}
      title={isPt ? 'Não vender ou partilhar os meus dados' : 'Do Not Sell or Share My Info'}
      subtitle={
        isPt
          ? 'A Sinesia Karol não vende as suas informações pessoais.'
          : 'Sinesia Karol does not sell your personal information.'
      }
      showContactCta={false}
    >
      <DoNotSellContent locale={locale} />
    </HelpPageLayout>
  );
}
