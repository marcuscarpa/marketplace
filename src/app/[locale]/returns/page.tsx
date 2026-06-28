import { HelpPageLayout } from '@/components/help/help-page-layout';
import { ReturnsContent } from '@/lib/help/returns-content';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title:
      locale === 'pt' ? 'Devoluções e Trocas | Sinesia Karol' : 'Returns and Exchanges | Sinesia Karol',
    description: 'Returns, exchanges and refund policy for Sinesia Karol.',
  };
}

export default async function ReturnsPage({ params }: PageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt';

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="returns"
      breadcrumbLabel={isPt ? 'Devoluções e Trocas' : 'Returns and Exchanges'}
      title={isPt ? 'Devoluções e Trocas' : 'Returns and Exchanges'}
      showContactCta={false}
    >
      <ReturnsContent locale={locale} />
    </HelpPageLayout>
  );
}
