import { HelpAccordion } from '@/components/help/help-accordion';
import { HelpPageLayout } from '@/components/help/help-page-layout';
import { getFaqSections } from '@/lib/help/faq-content';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'FAQ | Sinesia Karol' : 'FAQ | Sinesia Karol',
    description: 'Frequently asked questions about orders, shipping, returns, and products.',
  };
}

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params;
  const sections = getFaqSections(locale);

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="faq"
      breadcrumbLabel="FAQ"
      title="FAQ"
      subtitle="Explore our frequently asked questions"
    >
      <div className="space-y-12">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="mb-6 font-serif text-lg uppercase tracking-[0.08em] text-neutral-900">
              {section.heading}
            </h2>
            <HelpAccordion items={section.items} />
          </div>
        ))}
      </div>
    </HelpPageLayout>
  );
}
