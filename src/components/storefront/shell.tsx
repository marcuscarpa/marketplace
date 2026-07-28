'use client';

import type { SiteNavigation } from '@/lib/catalog/navigation-types';
import { Header } from '@/components/storefront/header';

interface ShellProps {
  locale: string;
  navigation: SiteNavigation;
  children: React.ReactNode;
}

export function Shell({ locale, navigation, children }: ShellProps) {
  return (
    <>
      <Header locale={locale} navigation={navigation} />
      {children}
    </>
  );
}
