import { HelpPageLayout } from '@/components/help/help-page-layout';
import { CookieContent } from '@/lib/help/cookie-content';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Política de Cookies | Sinesia Karol' : 'Cookie Policy | Sinesia Karol',
    description: 'How Sinesia Karol uses cookies, web beacons and similar technologies.',
  };
}

export default async function CookiesPage({ params }: PageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt';

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="cookies"
      breadcrumbLabel={isPt ? 'Política de Cookies' : 'Cookie Policy'}
      title={isPt ? 'Política de Cookies' : 'Cookie Policy'}
      showContactCta={false}
    >
      <CookieContent locale={locale} />
    </HelpPageLayout>
  );
}
