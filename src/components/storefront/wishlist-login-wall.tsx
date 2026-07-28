'use client';

import { AccountLoginWall } from '@/components/storefront/account-login-wall';

interface WishlistLoginWallProps {
  locale: string;
  onSignIn: (email: string) => void;
  onRegister: (email: string) => void;
}

export function WishlistLoginWall({ locale, onSignIn, onRegister }: WishlistLoginWallProps) {
  const isPt = locale === 'pt';
  const guestHint = isPt
    ? 'Pode ver os seus favoritos abaixo sem iniciar sessão.'
    : 'You can view your saved items below without signing in.';

  return (
    <AccountLoginWall
      locale={locale}
      onSignIn={onSignIn}
      onRegister={onRegister}
      guestHint={guestHint}
    />
  );
}
