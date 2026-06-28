'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { LuxuryMetafields } from '@/lib/shopify/types';
import { isColorOption } from '@/lib/shopify/variants';

type TabId = 'details' | 'size-fit' | 'care' | 'shipping';

interface ProductInfoTabsProps {
  product: {
    title: string;
    description: string;
    handle: string;
  };
  luxury: LuxuryMetafields;
  locale: string;
  styleCode?: string;
}

const ALIGHT_WEDGE_DETAILS = {
  intro:
    'The Alight Wedge 100 in Pecan from our Spring 2026 Collection, Kindred Spirit. Crafted in Italy, Alight features sculptural wooden platforms and finely crafted leather uppers. Accented with delicate gold studs and custom buckle hardware, this wedge sandal achieves a harmonious balance of relaxed refinement and sophisticated detail.',
  features: [
    'Calf leather platform sandal',
    'Round toe',
    'Double custom signature buckles',
    'Sculptural wooden platform heel',
    'Gold stud detailing throughout',
    '100mm block heel',
    'Made in Italy',
  ],
  styleCode: '6791FS26A1',
  sizeFit: 'This shoe fits true to size.',
  care:
    'Upper: calf leather; lining: calf leather; platform: wood; outsole: 100% thermoplastic polyurethane (tpu). This item is handcrafted from high-quality leather. Natural variations in the leather are to be expected. Color may fade or transfer with wear. Protect from water, oils, and cosmetics. Store in the original dust bag when not in use. Always check the label or care card for specific care instructions.',
};

export function ProductInfoTabs({
  product,
  luxury,
  locale,
  styleCode,
}: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const isPt = locale === 'pt';

  const tabs: { id: TabId; label: string }[] = [
    { id: 'details', label: isPt ? 'Detalhes' : 'Details' },
    { id: 'size-fit', label: isPt ? 'Tamanho & caimento' : 'Size & fit' },
    { id: 'care', label: isPt ? 'Cuidados' : 'Care' },
    { id: 'shipping', label: isPt ? 'Envio' : 'Shipping' },
  ];

  const isAlight = product.handle === 'alight-wedge-100';
  const detailsIntro = isAlight ? ALIGHT_WEDGE_DETAILS.intro : product.description;
  const features = isAlight
    ? ALIGHT_WEDGE_DETAILS.features
    : luxury.materials ?? [];
  const resolvedStyleCode = styleCode ?? (isAlight ? ALIGHT_WEDGE_DETAILS.styleCode : undefined);
  const sizeFitText = isAlight
    ? ALIGHT_WEDGE_DETAILS.sizeFit
    : isPt
      ? 'Este produto veste ao tamanho indicado.'
      : 'This item fits true to size.';
  const careText =
    luxury.careInstructions ??
    (isAlight
      ? ALIGHT_WEDGE_DETAILS.care
      : isPt
        ? 'Consulte a etiqueta do produto para instruções específicas de cuidado.'
        : 'Refer to the product label for specific care instructions.');

  return (
    <div className="border-t border-neutral-200 pt-8">
      <div className="flex gap-6 overflow-x-auto border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 pb-3 text-xs uppercase tracking-[0.15em] transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-neutral-900 text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6 py-8 text-sm leading-relaxed text-neutral-700">
        {activeTab === 'details' && (
          <>
            <p>{detailsIntro}</p>
            {features.length > 0 && (
              <ul className="list-disc space-y-2 pl-5">
                {features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {luxury.madeIn && !isAlight && (
              <p>
                {isPt ? 'Feito na' : 'Made in'} {luxury.madeIn}
              </p>
            )}
            {resolvedStyleCode && (
              <p className="text-neutral-900">
                {isPt ? 'Código de estilo' : 'Style code'}: {resolvedStyleCode}
              </p>
            )}
          </>
        )}

        {activeTab === 'size-fit' && <p>{sizeFitText}</p>}

        {activeTab === 'care' && <p>{careText}</p>}

        {activeTab === 'shipping' && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-900">
                {isPt ? 'Envio' : 'Shipping'}
              </h4>
              <p>
                {isPt
                  ? 'Os pedidos são enviados em até 1 dia útil. A entrega demora 2–5 dias úteis (internacional pode demorar mais).'
                  : 'Orders are shipped within 1 business day. Deliveries take 2–5 business days (international may take longer).'}
              </p>
              <Link
                href={`/${locale}/shipping`}
                className="text-xs uppercase tracking-[0.15em] underline underline-offset-4"
              >
                {isPt ? 'Ver política de envio' : 'View shipping policy'}
              </Link>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-900">
                {isPt ? 'Devoluções' : 'Returns'}
              </h4>
              <p>
                {isPt
                  ? 'Devoluções gratuitas em 14 dias via courier ou nas nossas boutiques.'
                  : 'Free returns within 14 days via courier or at our boutiques.'}
              </p>
              <Link
                href={`/${locale}/returns`}
                className="text-xs uppercase tracking-[0.15em] underline underline-offset-4"
              >
                {isPt ? 'Ver política de devoluções' : 'View returns policy'}
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-3 border-t border-neutral-200 pt-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
            {isPt ? 'Precisa de ajuda?' : 'Need assistance?'}
          </p>
          <div className="inline-flex w-full max-w-xs overflow-hidden rounded border border-neutral-300 bg-neutral-200">
            <a
              href={`/${locale}/contact`}
              className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] uppercase tracking-[0.12em] text-neutral-600 transition-colors hover:bg-neutral-300 hover:text-neutral-800"
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {isPt ? 'Email' : 'Email us'}
            </a>
            <span className="w-px self-stretch bg-neutral-300" aria-hidden="true" />
            <a
              href={`/${locale}/contact`}
              className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] uppercase tracking-[0.12em] text-neutral-600 transition-colors hover:bg-neutral-300 hover:text-neutral-800"
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {isPt ? 'Contacte-nos' : 'Contact us'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function getColorOption(options: { name: string; values: string[] }[]) {
  return options.find((o) => isColorOption(o.name));
}
