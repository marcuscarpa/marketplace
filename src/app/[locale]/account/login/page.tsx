import { Metadata } from 'next';

import { AccountLoginForm } from '@/components/storefront/account-login-form';
import { PageMain } from '@/components/storefront/ui';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; redirect?: string }>;
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Entrar | Luxury Store' : 'Login | Luxury Store',
  };
}

const errorMessages: Record<string, { pt: string; en: string }> = {
  invalid_state: {
    pt: 'Estado de autenticação inválido. Tente novamente.',
    en: 'Invalid authentication state. Please try again.',
  },
  missing_code: {
    pt: 'Falha na autenticação. Tente novamente.',
    en: 'Authentication failed. Please try again.',
  },
  auth_failed: {
    pt: 'Falha na autenticação. Tente novamente.',
    en: 'Authentication failed. Please try again.',
  },
  token_refresh_failed: {
    pt: 'Sessão expirada. Entre novamente.',
    en: 'Session expired. Please log in again.',
  },
};

function resolveRedirect(locale: string, redirect?: string) {
  if (!redirect || typeof redirect !== 'string') return `/${locale}/account`;
  if (redirect.startsWith('//')) return `/${locale}/account`;
  if (/^https?:\/\//i.test(redirect)) return `/${locale}/account`;
  if (!redirect.startsWith('/')) return `/${locale}/account`;
  if (redirect.includes('\n') || redirect.includes('\r')) return `/${locale}/account`;
  return redirect;
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  const { error, redirect } = await searchParams;
  const isPt = locale === 'pt';
  const redirectTo = resolveRedirect(locale, redirect);
  const errorMessage = error && errorMessages[error] ? errorMessages[error][isPt ? 'pt' : 'en'] : null;

  return (
    <PageMain padded={false} className="bg-white">
      <AccountLoginForm locale={locale} redirectTo={redirectTo} error={errorMessage} />
    </PageMain>
  );
}
