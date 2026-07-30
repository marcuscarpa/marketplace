import { HelpPageLayout } from '@/components/help/help-page-layout';
import { ReturnsContent } from '@/lib/help/returns-content';
import { m } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const title = m(locale).help.returns;
  return {
    title: `${title} | Sinesia Karol`,
    description: 'Returns, exchanges and refund policy for Sinesia Karol.',
  };
}

export default async function ReturnsPage({ params }: PageProps) {
  const { locale } = await params;
  const title = m(locale).help.returns;

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="returns"
      breadcrumbLabel={title}
      title={title}
      showContactCta={false}
    >
      <ReturnsContent locale={locale} />
    </HelpPageLayout>
  );
}
