import type { HelpAccordionItem } from '@/components/help/help-accordion';

const BRAND = 'Sinesia Karol';
const SUPPORT_EMAIL = 'hello@sinesiakarol.com';
const SUPPORT_PHONE = '+1 866 688 5656';

export function getContactChannels(locale: string) {
  return [
    { label: 'Call', href: `tel:${SUPPORT_PHONE.replace(/\s/g, '')}`, icon: 'phone' as const },
    { label: 'Email', href: `mailto:${SUPPORT_EMAIL}`, icon: 'email' as const },
    { label: 'Boutiques', href: `/${locale}/locations`, icon: 'pin' as const },
  ] as const;
}

export const CONTACT_SECTIONS: HelpAccordionItem[] = [
  {
    title: 'Client Services',
    content: (
      <>
        <p>Our Client Services Advisors look forward to assisting you.</p>
        <p>
          <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}>{SUPPORT_PHONE}</a>
        </p>
        <p>Our Client Services team is available Monday – Saturday: 9.00 am – 5.30 pm (EDT).</p>
        <p>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </p>
      </>
    ),
  },
  {
    title: 'Personal Shopping',
    content: (
      <>
        <p>Looking for styling advice? Our Client Services experts would be delighted to offer you a personal shopping experience.</p>
        <p>
          Contact us on <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> to arrange an appointment.
        </p>
      </>
    ),
  },
  {
    title: 'Head Office',
    content: (
      <>
        <p>120 Dunning Avenue</p>
        <p>Rosebery NSW 2018</p>
        <p>Australia</p>
        <p>+61 2 9697 9988</p>
      </>
    ),
  },
  {
    title: 'US Head Office',
    content: (
      <>
        <p>601 West 26th Street, Suite 810</p>
        <p>New York, NY 10001</p>
        <p>USA</p>
        <p>+1 212 255 8300</p>
      </>
    ),
  },
  {
    title: 'Europe Head Office',
    content: (
      <>
        <p>7 Rue Barbette</p>
        <p>75003 Paris</p>
        <p>France</p>
        <p>+33 1 88 45 47 40</p>
      </>
    ),
  },
  {
    title: 'Sales And Stockists',
    content: (
      <p>
        Direct all sales and stockists enquiries to <a href="mailto:sales@sinesiakarol.com">sales@sinesiakarol.com</a>.
      </p>
    ),
  },
  {
    title: 'Careers',
    content: <p>If you&apos;re interested in a long-term career at {BRAND} in one of our global boutiques or offices, contact us for current opportunities.</p>,
  },
];
