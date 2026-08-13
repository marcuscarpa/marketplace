'use client';

import dynamic from 'next/dynamic';

import { EntranceView } from '@/components/storefront/entrance-view';
import { SECTION_PADDING } from '@/components/storefront/ui';
import { m } from '@/lib/i18n';

const WhyShopLordIcon = dynamic(
  () => import('@/components/storefront/why-shop-lord-icon').then((mod) => mod.WhyShopLordIcon),
  {
    ssr: false,
    loading: () => <div className="h-[52px] w-[50px] shrink-0" aria-hidden />,
  },
);

interface WhyShopSectionProps {
  locale: string;
}

/** ALIST bloco7 + tipografia SK. */
export function WhyShopSection({ locale }: WhyShopSectionProps) {
  const h = m(locale).home;
  const cards = [
    {
      title: h.priorityShipping,
      description: h.priorityShippingBody,
      lordiconSrc: '/lordicon/b7-priority-shipping.json',
    },
    {
      title: h.hereToHelp,
      description: h.hereToHelpBody,
      lordiconSrc: '/lordicon/b7-here-to-help.json',
    },
    {
      title: h.securePayment,
      description: h.securePaymentBody,
      lordiconSrc: '/lordicon/b7-secure-payment.json',
    },
    {
      title: h.easyReturns,
      description: h.easyReturnsBody,
      lordiconSrc: '/lordicon/b7-return-policy.json',
    },
  ];

  return (
    <EntranceView stagger className={`w-full overflow-hidden bg-cream ${SECTION_PADDING}`}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8 px-5">
        <header data-entrance-step="1" className="flex w-full flex-col items-center gap-4 text-center">
          <h2 className="m-0 max-w-[720px] font-serif text-[clamp(1.75rem,5vw,2.5rem)] font-normal leading-tight tracking-[-0.04em] text-ink lg:text-[40px] lg:leading-[44px]">
            {h.whyShopTitle}
          </h2>
          <p className="m-0 max-w-[720px] text-pretty font-sans-ui text-base font-normal leading-[22px] text-ink/60">
            {h.whyShopSubtitle}
          </p>
        </header>

        <div
          data-entrance-step="2"
          className="grid w-full grid-cols-1 gap-4 max-lg:max-w-[520px] max-lg:justify-items-center lg:grid-cols-4 lg:gap-[10px]"
        >
          {cards.map((card) => (
            <article
              key={card.title}
              className="flex w-full max-w-[360px] min-h-0 flex-col items-center gap-5 rounded-[6px] bg-white px-4 py-8 text-center lg:max-w-none lg:min-h-[253px] lg:justify-center lg:py-10"
            >
              <WhyShopLordIcon src={card.lordiconSrc} />
              <div className="flex flex-col items-center gap-3">
                <h3 className="m-0 text-center font-serif text-[clamp(1.0625rem,2.4vw,1.375rem)] font-normal leading-tight tracking-[-0.02em] text-ink lg:text-[22px] lg:leading-[26px]">
                  {card.title}
                </h3>
                <p className="m-0 max-w-[240px] whitespace-pre-line text-pretty text-center font-sans-ui text-base font-normal leading-[22px] text-ink/70">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </EntranceView>
  );
}
