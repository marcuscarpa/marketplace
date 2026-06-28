'use client';

import { usePathname } from 'next/navigation';

export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="mkt-page-enter">
      {children}
    </div>
  );
}
