import { HelpAccordion } from '@/components/help/help-accordion';
import { HelpPageLayout } from '@/components/help/help-page-layout';
import { ShippingPolicyBlock } from '@/components/help/shipping-policy-block';
import { getShippingSections, getShippingSteps } from '@/lib/help/shipping-content';
import { m } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Encomendas e Envio | Sinesia Karol' : 'Orders & Shipping | Sinesia Karol',
    description: 'Shipping policy and delivery information for Sinesia Karol Online Boutique.',
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
      title={help.shipping}
      subtitle={help.shippingSubtitle}
      steps={getShippingSteps(locale)}
    >
      <ShippingPolicyBlock locale={locale} />
      <HelpAccordion items={getShippingSections(locale)} />
    </HelpPageLayout>
  );
}
