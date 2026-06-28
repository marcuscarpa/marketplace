interface ProductTrustBadgesProps {
  locale: string;
}

function IconRecycle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path d="M21.168 8A10.003 10.003 0 0 0 12 2c-5.185 0-9.45 3.947-9.95 9" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M17 8h4.4a.6.6 0 0 0 .6-.6V3M2.881 16c1.544 3.532 5.068 6 9.168 6 5.186 0 9.45-3.947 9.951-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.05 16h-4.4a.6.6 0 0 0-.6.6V21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTruck({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
        strokeMiterlimit={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 17V6.6a.6.6 0 0 0-.6-.6H2.6a.6.6 0 0 0-.6.6v9.8a.6.6 0 0 0 .6.6h2.05M14 17H9.05M14 9h5.61a.6.6 0 0 1 .548.356l1.79 4.028a.6.6 0 0 1 .052.243V16.4a.6.6 0 0 1-.6.6h-1.9M14 17h1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDonation({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        d="M16 6.28a2.28 2.28 0 0 1-.662 1.606c-.976.984-1.923 2.01-2.936 2.958a.597.597 0 0 1-.822-.017l-2.918-2.94a2.281 2.281 0 0 1 0-3.214 2.277 2.277 0 0 1 3.232 0L12 4.78l.106-.107A2.276 2.276 0 0 1 16 6.28z"
        strokeLinejoin="round"
      />
      <path
        d="m18 20 3.824-3.824a.6.6 0 0 0 .176-.424V10.5A1.5 1.5 0 0 0 20.5 9v0a1.5 1.5 0 0 0-1.5 1.5V15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m18 16 .858-.858a.484.484 0 0 0 .142-.343v0a.485.485 0 0 0-.268-.433l-.443-.221a2 2 0 0 0-2.308.374l-.895.895a2 2 0 0 0-.586 1.414V20M6 20l-3.824-3.824A.6.6 0 0 1 2 15.752V10.5A1.5 1.5 0 0 1 3.5 9v0A1.5 1.5 0 0 1 5 10.5V15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m6 16-.858-.858A.485.485 0 0 1 5 14.799v0c0-.183.104-.35.268-.433l.443-.221a2 2 0 0 1 2.308.374l.895.895a2 2 0 0 1 .586 1.414V20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BADGES = [
  {
    icon: IconRecycle,
    en: '7 days for a full refund — shop with confidence.',
    pt: '7 dias para reembolso total — compre com confiança.',
  },
  {
    icon: IconTruck,
    en: 'Free shipping on orders over $300',
    pt: 'Envio grátis em pedidos acima de $300',
  },
  {
    icon: IconDonation,
    en: 'Exchange for store credit within 30 days.',
    pt: 'Troca por crédito na loja em até 30 dias.',
  },
] as const;

export function ProductTrustBadges({ locale }: ProductTrustBadgesProps) {
  const isPt = locale === 'pt';

  return (
    <ul className="space-y-3 pt-1" aria-label={isPt ? 'Benefícios da compra' : 'Purchase benefits'}>
      {BADGES.map(({ icon: Icon, en, pt }) => (
        <li key={en} className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-neutral-800">
            <Icon className="h-5 w-5" />
          </span>
          <p className="text-[13px] leading-relaxed text-neutral-600">{isPt ? pt : en}</p>
        </li>
      ))}
    </ul>
  );
}
