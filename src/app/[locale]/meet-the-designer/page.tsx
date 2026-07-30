import { AboutPageLayout } from '@/components/about/about-page-layout';
import { MeetTheDesignerContent } from '@/lib/about/about-content';
import { m } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const nav = m(locale).nav;
  return {
    title: `${nav.meetTheDesigner} | Sinesia Karol`,
    description: 'Meet Sinesia Karol, founder and designer of the eponymous luxury resortwear brand.',
  };
}

export default async function MeetTheDesignerPage({ params }: PageProps) {
  const { locale } = await params;
  const nav = m(locale).nav;

  return (
    <AboutPageLayout locale={locale} breadcrumbLabel={nav.meetTheDesigner} title={nav.meetTheDesigner}>
      <MeetTheDesignerContent locale={locale} />
    </AboutPageLayout>
  );
}
