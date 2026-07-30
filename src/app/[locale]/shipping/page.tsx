import { HelpPageLayout } from '@/components/help/help-page-layout';
import { ShippingPolicyBlock } from '@/components/help/shipping-policy-block';
import { m } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Política de Envio | Sinesia Karol' : 'Shipping Policy | Sinesia Karol',
    description: 'Shipping policy and delivery information for Sinesia Karol.',
  };
}

export default async function ShippingPage({ params }: PageProps) {
  const { locale } = await params;
  const help = m(locale).help;

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="shipping"
      breadcrumbLabel={help.shipping}
      title={help.shippingPageTitle}
    >
      <ShippingPolicyBlock locale={locale} />
    </HelpPageLayout>
  );
}
