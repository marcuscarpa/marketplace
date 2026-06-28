import type { HelpIconName } from '@/components/help/help-icons';

export const HELP_MENU = [
  { slug: 'shipping', label: 'Orders & Shipping', icon: 'shipping' as HelpIconName },
  { slug: 'returns', label: 'Returns Policy', icon: 'returns' as HelpIconName },
  { slug: 'faq', label: 'FAQs', icon: 'faq' as HelpIconName },
  { slug: 'contact', label: 'Contact Us', icon: 'contact' as HelpIconName },
  { slug: 'size-chart', label: 'Size Guide', icon: 'size-chart' as HelpIconName },
  { slug: 'privacy', label: 'Privacy', icon: 'privacy' as HelpIconName },
] as const;

export const HELP_QUICK_LINKS = [
  { slug: 'account', label: 'My Account', icon: 'account' as HelpIconName },
  { slug: 'collections/new', label: 'New Arrivals', icon: 'sparkles' as HelpIconName },
] as const;

export type HelpSlug = (typeof HELP_MENU)[number]['slug'];
