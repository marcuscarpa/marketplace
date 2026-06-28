import { HelpPageLayout } from '@/components/help/help-page-layout';
import { m } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const BOUTIQUES = [
  {
    city: 'New York',
    lines: ['601 West 26th Street, Suite 810', 'New York, NY 10001', 'USA', '+1 212 255 8300'],
  },
  {
    city: 'Sydney',
    lines: ['120 Dunning Avenue', 'Rosebery NSW 2018', 'Australia', '+61 2 9697 9988'],
  },
] as const;

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const nav = m(locale).nav;
  return {
    title: `${nav.locations} | Sinesia Karol`,
    description:
      locale === 'pt'
        ? 'Encontre as nossas boutiques e horários de atendimento.'
        : 'Find our boutiques and client service hours.',
  };
}

export default async function LocationsPage({ params }: PageProps) {
  const { locale } = await params;
  const nav = m(locale).nav;
  const help = m(locale).help;

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="locations"
      breadcrumbLabel={nav.locations}
      title={nav.locations}
      subtitle={
        locale === 'pt'
          ? 'As nossas equipas de boutique aguardam a sua visita.'
          : 'Our boutique teams look forward to welcoming you.'
      }
    >
      <ul className="divide-y divide-neutral-200 border-t border-neutral-200">
        {BOUTIQUES.map((boutique) => (
          <li key={boutique.city} className="py-8 first:pt-0">
            <h2 className="font-serif text-xl text-neutral-900">{boutique.city}</h2>
            <address className="mt-3 space-y-1 font-sans-ui text-sm not-italic leading-relaxed text-neutral-600">
              {boutique.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </li>
        ))}
      </ul>
      <p className="mt-10 font-sans-ui text-sm text-neutral-600">
        {help.contactSubtitle}{' '}
        <a href={`/${locale}/contact`} className="text-neutral-900 underline underline-offset-4">
          {help.contact}
        </a>
      </p>
    </HelpPageLayout>
  );
}
