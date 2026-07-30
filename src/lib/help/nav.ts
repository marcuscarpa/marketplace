import type { HelpIconName } from '@/components/help/help-icons';
import { SHOPIFY_COLLECTION, collectionPath } from '@/lib/catalog/collection-handles';
import { m } from '@/lib/i18n';

export function getHelpMenu(locale: string) {
  const h = m(locale).help;
  return [
    { slug: 'shipping', label: h.shipping, icon: 'shipping' as HelpIconName },
    { slug: 'returns', label: h.returns, icon: 'returns' as HelpIconName },
    { slug: 'contact', label: h.contact, icon: 'contact' as HelpIconName },
    { slug: 'size-chart', label: h.sizeChart, icon: 'size-chart' as HelpIconName },
    { slug: 'privacy', label: h.privacy, icon: 'privacy' as HelpIconName },
  ] as const;
}

export function getHelpQuickLinks(locale: string) {
  const h = m(locale).help;
  const n = m(locale).nav;
  return [
    { slug: 'account', label: h.myAccount, icon: 'account' as HelpIconName },
    { slug: collectionPath(SHOPIFY_COLLECTION.newArrivals), label: n.newArrivals, icon: 'sparkles' as HelpIconName },
  ] as const;
}

/** @deprecated use getHelpMenu(locale) */
export const HELP_MENU = getHelpMenu('en');

/** @deprecated use getHelpQuickLinks(locale) */
export const HELP_QUICK_LINKS = getHelpQuickLinks('en');

export type HelpSlug = ReturnType<typeof getHelpMenu>[number]['slug'];
