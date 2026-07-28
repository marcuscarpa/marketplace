import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { AccountLoginForm } from '@/components/storefront/account-login-form';
import { PageMain } from '@/components/storefront/ui';

import { getSessionCustomer } from '@/lib/auth/customer';
import { revokeCustomerAccountRefreshToken } from '@/lib/auth/customer-account-tokens';

interface AccountPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AccountPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Minha Conta | Luxury Store' : 'My Account | Luxury Store',
  };
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt';
  const customer = await getSessionCustomer(locale);

  if (!customer) {
    return (
      <PageMain padded={false} className="bg-white">
        <AccountLoginForm locale={locale} redirectTo={`/${locale}/account`} />
      </PageMain>
    );
  }

  return (
    <PageMain padded={false}>
      <header className="bg-gray-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-light tracking-tight">
            {isPt ? 'Minha Conta' : 'My Account'}
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isPt ? 'Informações pessoais' : 'Personal Information'}
          </h2>
          <dl className="space-y-3">
            <div className="flex gap-4">
              <dt className="text-gray-500 w-32">{isPt ? 'Nome' : 'First Name'}</dt>
              <dd className="text-gray-900">{customer.firstName || '—'}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-gray-500 w-32">{isPt ? 'Sobrenome' : 'Last Name'}</dt>
              <dd className="text-gray-900">{customer.lastName || '—'}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-gray-500 w-32">Email</dt>
              <dd className="text-gray-900">{customer.email}</dd>
            </div>
            {customer.phone && (
              <div className="flex gap-4">
                <dt className="text-gray-500 w-32">{isPt ? 'Telefone' : 'Phone'}</dt>
                <dd className="text-gray-900">{customer.phone}</dd>
              </div>
            )}
          </dl>
        </div>

        <form
          action={async () => {
            'use server';
            const { cookies } = await import('next/headers');
            const { redirect } = await import('next/navigation');
            const cookieStore = await cookies();
            const refreshToken = cookieStore.get('refresh_token')?.value;
            const sessionLocale = cookieStore.get('shopify_locale')?.value || 'en';

            if (refreshToken) {
              try {
                await revokeCustomerAccountRefreshToken(sessionLocale, refreshToken);
              } catch {
                // Still clear local session if revoke fails.
              }
            }

            const AUTH_COOKIES = [
              'access_token',
              'refresh_token',
              'access_token_hash',
              'id_token',
              'shopify_customer_id',
              'shopify_locale',
            ];
            AUTH_COOKIES.forEach((name) => cookieStore.set(name, '', { path: '/', maxAge: 0 }));
            redirect(`/${sessionLocale}`);
          }}
        >
          <button
            type="submit"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isPt ? 'Sair da conta' : 'Log Out'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <a
            href={`/${locale}`}
            className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4"
          >
            {isPt ? '← Voltar para página inicial' : '← Back to homepage'}
          </a>
        </div>
      </div>
    </PageMain>
  );
}
