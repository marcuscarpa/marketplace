export type HelpIconName =
  | 'shipping'
  | 'returns'
  | 'faq'
  | 'contact'
  | 'size-chart'
  | 'privacy'
  | 'account'
  | 'sparkles'
  | 'order'
  | 'process'
  | 'courier'
  | 'track'
  | 'receive'
  | 'return-request'
  | 'pack'
  | 'return-ship'
  | 'phone'
  | 'email'
  | 'pin';

const ICONS: Record<HelpIconName, React.ReactNode> = {
  shipping: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" strokeLinejoin="round" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" strokeLinejoin="round" />
    </>
  ),
  returns: (
    <>
      <path d="M4 10h10v4M14 14l3-3-3-3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6" y="14" width="12" height="7" rx="1" />
    </>
  ),
  faq: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 014.5 1.5c0 2-2.5 2.2-2.5 4" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M3 8l9 6 9-6" strokeLinejoin="round" />
    </>
  ),
  'size-chart': (
    <>
      <path d="M5 6h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z" />
      <path d="M8 9v2M11 9v3M14 9v2M17 9v3" strokeLinecap="round" />
    </>
  ),
  privacy: (
    <>
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  account: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" strokeLinecap="round" />
      <path d="M7 7l2.5 2.5M14.5 14.5L17 17M17 7l-2.5 2.5M9.5 14.5L7 17" strokeLinecap="round" />
    </>
  ),
  order: (
    <>
      <path d="M6 6h15l-1.5 9H7.5L6 6z" strokeLinejoin="round" />
      <path d="M6 6L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="19" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="17" cy="19" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),
  process: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="1" />
      <path d="M9 9h6M9 13h6M9 17h4" strokeLinecap="round" />
    </>
  ),
  courier: (
    <>
      <rect x="2" y="8" width="13" height="9" rx="1" />
      <path d="M15 11h3l2 3v3h-5v-6z" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </>
  ),
  track: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" strokeLinecap="round" />
    </>
  ),
  receive: (
    <>
      <path d="M12 3l8 4.5v5" strokeLinejoin="round" />
      <path d="M4 7.5l8 4.5 8-4.5" strokeLinejoin="round" />
      <path d="M9 14l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'return-request': (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
    </>
  ),
  pack: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" strokeLinejoin="round" />
      <path d="M12 12v9" />
    </>
  ),
  'return-ship': (
    <>
      <path d="M3 10h11v4M14 14l3-3-3-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 18h12" strokeLinecap="round" />
    </>
  ),
  phone: (
    <path d="M6.5 4h3l1.5 5-2 1.5a11 11 0 005 5L17 13.5l5 1.5v3a2 2 0 01-2 2C10.8 20 4 13.2 4.5 6.5A2 2 0 016.5 4z" strokeLinejoin="round" />
  ),
  email: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M3 8l9 6 9-6" strokeLinejoin="round" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
    </>
  ),
};

interface HelpIconProps {
  name: HelpIconName;
  className?: string;
}

export function HelpIcon({ name, className = 'h-5 w-5' }: HelpIconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      {ICONS[name]}
    </svg>
  );
}
