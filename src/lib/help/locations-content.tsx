export interface BoutiqueLocation {
  id: string;
  city: string;
  country?: string;
  lines: string[];
  phone?: { display: string; href: string };
}

export const BOUTIQUE_LOCATIONS: BoutiqueLocation[] = [
  {
    id: 'newport',
    city: 'Newport',
    lines: ['135 Spring Street', 'Newport - RI', '02840'],
  },
  {
    id: 'vila-velha',
    city: 'Vila Velha',
    country: 'Brazil',
    lines: ['Rua Antônio Ataíde, 462', 'Centro, Vila Velha - ES', '29.100-290'],
    phone: { display: '(27) 99929-8844', href: 'tel:+5527999298844' },
  },
  {
    id: 'angra-dos-reis',
    city: 'Angra dos Reis',
    country: 'Brazil',
    lines: [
      'Rodovia Governador Mario Covas, SN',
      'KM:513, loja 5 e 6',
      'Frade (cunhambebe), Angra dos Reis - RJ',
      '23.946-017',
    ],
    phone: { display: '(24) 99819-6050', href: 'tel:+5524998196050' },
  },
  {
    id: 'trancoso',
    city: 'Trancoso',
    country: 'Brazil',
    lines: ['Rua Carlos Alberto Parracho, 515', 'Trancoso, Porto Seguro - BA', '45818-000'],
    phone: { display: '(73) 99950-4425', href: 'tel:+5573999504425' },
  },
];

interface LocationsPageContentProps {
  locale: string;
  phoneLabel: string;
  contactHint: string;
  contactLabel: string;
}

export function LocationsPageContent({
  locale,
  phoneLabel,
  contactHint,
  contactLabel,
}: LocationsPageContentProps) {
  const prefix = `/${locale}`;

  return (
    <>
      <ul className="divide-y divide-neutral-200 border-t border-neutral-200">
        {BOUTIQUE_LOCATIONS.map((boutique) => (
          <li key={boutique.id} className="py-8 first:pt-0">
            <h2 className="font-serif text-xl text-neutral-900">
              {boutique.city}
              {boutique.country ? ` — ${boutique.country}` : ''}
            </h2>
            <address className="mt-3 space-y-1 font-sans-ui text-sm not-italic leading-relaxed text-neutral-600">
              {boutique.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              {boutique.phone && (
                <span className="block pt-2">
                  {phoneLabel}:{' '}
                  <a
                    href={boutique.phone.href}
                    className="text-neutral-900 underline underline-offset-4 transition-opacity hover:opacity-60"
                  >
                    {boutique.phone.display}
                  </a>
                </span>
              )}
            </address>
          </li>
        ))}
      </ul>
      <p className="mt-10 font-sans-ui text-sm text-neutral-600">
        <a href={`${prefix}/contact`} className="text-neutral-900 underline underline-offset-4 transition-opacity hover:opacity-60">
          {contactLabel}
        </a>{' '}
        {contactHint}
      </p>
    </>
  );
}
