import type { HelpAccordionItem } from '@/components/help/help-accordion';

const BRAND = 'Sinesia Karol';
const SUPPORT_EMAIL = 'hello@sinesiakarol.com';

export function getFaqSections(locale: string): { heading: string; items: HelpAccordionItem[] }[] {
  const p = `/${locale}`;
  return FAQ_SECTIONS(locale, p);
}

function FAQ_SECTIONS(_locale: string, p: string): { heading: string; items: HelpAccordionItem[] }[] {
  return [
  {
    heading: 'Orders and Shipping',
    items: [
      {
        title: 'What delivery option does the Online Boutique offer?',
        content: (
          <>
            <p>
              <strong>UNITED STATES</strong> — Ground (free, 2–5 business days), Express (USD $15, 1–3 days), Next Day (USD $30), and Collect In Boutique (complimentary, ready within 1 business day).
            </p>
            <p>
              <strong>INTERNATIONAL</strong> (Puerto Rico) — Express: free over USD $500, otherwise USD $15; delivery within 2–4 business days.
            </p>
            <p>
              All orders are processed within 1 business day. Explore more on our{' '}
              <a href={`${p}/shipping`}>delivery options page</a>.
            </p>
          </>
        ),
      },
      {
        title: 'Can I collect my order in boutique?',
        content: (
          <p>
            We offer a complimentary Collect In Boutique service. Purchase items online and collect from your selected {BRAND} boutique, subject to item and boutique eligibility.
          </p>
        ),
      },
      {
        title: 'Can I have my order delivered to my PO box or Parcel Locker?',
        content: <p>We cannot deliver to PO Box, Parcel Locker or Freight Forwarding addresses. Orders to these addresses may be subject to cancellation.</p>,
      },
      {
        title: 'Can I make changes to my order?',
        content: (
          <p>
            Contact Client Services immediately at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We cannot guarantee amendments once an order has been placed.
          </p>
        ),
      },
      {
        title: 'How can I check the status of my order?',
        content: (
          <p>
            You will receive a confirmation email upon placing your order and again once your order has been packed, with a delivery tracking link. Contact Client Services for further enquiries.
          </p>
        ),
      },
      {
        title: 'What payment methods does the Online Boutique offer?',
        content: <p>We accept payments via Apple Pay, American Express, Visa, Mastercard and PayPal.</p>,
      },
      {
        title: 'How many units can I purchase per style?',
        content: (
          <p>
            Boutiques and Online: no more than three (3) units per style and colour. Outlets: no more than three (3) units per style and colour.
          </p>
        ),
      },
    ],
  },
  {
    heading: 'Returns',
    items: [
      {
        title: "What is Sinesia Karol's Online return policy?",
        content: (
          <p>
            You may return your {BRAND} Online order within 14 days from the date of delivery for a refund. Read more on our{' '}
            <a href={`${p}/returns`}>returns policy</a>.
          </p>
        ),
      },
      {
        title: 'How do I return my Online Order?',
        content: (
          <p>
            Contact Client Services at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> to submit a return request. A return request must be submitted to receive your refund within normal processing times.
          </p>
        ),
      },
      {
        title: 'How long will it take for my return to be processed?',
        content: <p>You will receive email notification once your return is processed, within 5 business days of receiving your return.</p>,
      },
    ],
  },
  {
    heading: 'Product Information',
    items: [
      {
        title: 'What is the product sizing?',
        content: (
          <p>
            We offer Ready-to-Wear and Swim &amp; Resort pieces in sizes ranging between 0P and 4. Find out more on our{' '}
            <a href={`${p}/size-chart`}>size guide</a>.
          </p>
        ),
      },
      {
        title: 'How do I find out if an item will come back in stock?',
        content: (
          <p>
            Use the &quot;Notify Me&quot; feature on the product page to be notified if the item comes back in stock. Our boutique and Client Services experts are happy to assist if you are looking for a particular product.
          </p>
        ),
      },
      {
        title: 'How do I wash and care for my pieces?',
        content: <p>Each individual item has its own care instructions. Refer to the item product page or the care tag in the garment for all care instructions.</p>,
      },
    ],
  },
  {
    heading: 'Corporate Responsibility',
    items: [
      {
        title: "What is Sinesia Karol's commitment to sustainability?",
        content: (
          <p>
            {BRAND} takes sustainability seriously. Our teams are constantly evaluating the best options in this fast-changing space, and we are committed to being transparent about our journey.
          </p>
        ),
      },
      {
        title: 'How is my data and privacy managed?',
        content: (
          <p>
            Your privacy and data protection are incredibly important to us. Your personal data is handled in accordance with {BRAND}&apos;s{' '}
            <a href={`${p}/privacy`}>privacy policy</a>.
          </p>
        ),
      },
    ],
  },
  {
    heading: 'Visit Us',
    items: [
      {
        title: 'Where is my closest boutique?',
        content: <p>Contact Client Services at {SUPPORT_EMAIL} for boutique locations. Our boutique teams look forward to warmly welcoming you.</p>,
      },
    ],
  },
  ];
}
