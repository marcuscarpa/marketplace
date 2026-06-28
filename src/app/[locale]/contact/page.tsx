import Link from 'next/link';

import { HelpAccordion } from '@/components/help/help-accordion';
import { HelpIcon } from '@/components/help/help-icons';
import { HelpPageLayout } from '@/components/help/help-page-layout';
import { CONTACT_SECTIONS, getContactChannels } from '@/lib/help/contact-content';
import { m } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Contacto | Sinesia Karol' : 'Contact Us | Sinesia Karol',
    description: 'Contact information for client and business enquiries.',
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const channels = getContactChannels(locale);
  const help = m(locale).help;

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="contact"
      breadcrumbLabel={help.contact}
      title={help.contact}
      subtitle={help.contactSubtitle}
      showContactCta={false}
    >
      <div className="mb-10 grid grid-cols-3 gap-4 border-b border-neutral-200 pb-10">
        {channels.map((channel) => (
          <Link
            key={channel.label}
            href={channel.href}
            className="flex flex-col items-center gap-2 py-4 text-center text-[10px] uppercase tracking-[0.14em] text-neutral-700 transition-opacity hover:opacity-60"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-500">
              <HelpIcon name={channel.icon} className="h-5 w-5" />
            </span>
            {channel.label}
          </Link>
        ))}
      </div>
      <HelpAccordion items={CONTACT_SECTIONS} />
    </HelpPageLayout>
  );
}
