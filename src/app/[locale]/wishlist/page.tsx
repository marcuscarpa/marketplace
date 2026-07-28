import { notFound } from 'next/navigation';

import { WishlistPage } from '@/components/storefront/wishlist-page';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Lista de desejos | Sinesia Karol' : 'Wishlist | Sinesia Karol',
    description:
      locale === 'pt'
        ? 'Os seus produtos favoritos'
        : 'Your saved favorites',
  };
}

export default async function WishlistRoute({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'pt') notFound();

  return <WishlistPage locale={locale} />;
}
