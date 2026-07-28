'use client';

import { AccountLoginWall } from '@/components/storefront/account-login-wall';
import { buildOAuthAuthorizeUrl } from '@/lib/auth/login-hint';

interface AccountLoginFormProps {
  locale: string;
  redirectTo: string;
  error?: string | null;
}

export function AccountLoginForm({ locale, redirectTo, error }: AccountLoginFormProps) {
  const startOAuth = (email: string) => {
    window.location.href = buildOAuthAuthorizeUrl(locale, redirectTo, email);
  };

  return (
    <AccountLoginWall
      locale={locale}
      onSignIn={startOAuth}
      onRegister={startOAuth}
      error={error}
    />
  );
}
