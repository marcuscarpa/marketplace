import { HelpAccordion } from '@/components/help/help-accordion';
import { HelpPageLayout } from '@/components/help/help-page-layout';
import { ShippingPolicyBlock } from '@/components/help/shipping-policy-block';
import { SHIPPING_SECTIONS, SHIPPING_STEPS } from '@/lib/help/shipping-content';

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

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="shipping"
      breadcrumbLabel="Orders & Shipping"
      title="Orders & Shipping"
      subtitle="The Online Boutique policy and processes"
      steps={SHIPPING_STEPS}
    >
      <ShippingPolicyBlock />
      <HelpAccordion items={SHIPPING_SECTIONS} />
    </HelpPageLayout>
  );
}
