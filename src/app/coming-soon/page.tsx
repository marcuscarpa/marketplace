import type { Metadata } from 'next';

import { ComingSoon } from '@/components/storefront/coming-soon';

export const metadata: Metadata = {
  title: 'Coming Soon | Sinesia Karol',
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}
