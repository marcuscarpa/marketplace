'use client';

import { Header } from '@/components/storefront/header';

interface ShellProps {
  locale: string;
  children: React.ReactNode;
}

export function Shell({ locale, children }: ShellProps) {
  return (
    <>
      <Header locale={locale} />
      {children}
    </>
  );
}
