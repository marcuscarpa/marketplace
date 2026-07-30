import { HelpPageLayout } from '@/components/help/help-page-layout';
import { ContactPageContent } from '@/lib/help/contact-content';
import { m } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Contato | Sinesia Karol' : 'Contact Us | Sinesia Karol',
    description: 'Contact Sinesia Karol customer service.',
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const help = m(locale).help;

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="contact"
      breadcrumbLabel={help.contact}
      title={help.contactPageTitle}
      showContactCta={false}
    >
      <ContactPageContent locale={locale} />
    </HelpPageLayout>
  );
}
