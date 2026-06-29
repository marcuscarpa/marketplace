import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { PageMain } from '@/components/storefront/ui';

import { getEnv } from '@/lib/env';
import { getRegion } from '@/lib/regions';

interface AccountPageProps {
  params: Promise<{ locale: string }>;
}

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface CustomerResponse {
  customer: Customer | null;
}

export async function generateMetadata({ params }: AccountPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Minha Conta | Luxury Store' : 'My Account | Luxury Store',
  };
}

async function getCustomer(locale: string): Promise<Customer | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) return null;

  try {
    const env = getEnv();
    const region = getRegion(locale);

    const query = `
      query GetCustomer($accessToken: String!) {
        customer(accessToken: $accessToken) {
          id
          email
          firstName
          lastName
          phone
        }
      }
    `;

    const response = await fetch(`https://${region.shopifyDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_US,
      },
      body: JSON.stringify({
        query,
        variables: { accessToken },
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { data?: CustomerResponse };
    return data.data?.customer ?? null;
  } catch {
    return null;
  }
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt';
  const customer = await getCustomer(locale);

  if (!customer) {
    return (
      <PageMain padded={false} className="flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-6 py-12 text-center">
          <h1 className="text-2xl font-light mb-4">
            {isPt ? 'Acesso restrito' : 'Access Restricted'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isPt
              ? 'Por favor, faça login para acessar sua conta'
              : 'Please log in to access your account'}
          </p>
          <a
            href={`/${locale}/account/login`}
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            {isPt ? 'Entrar' : 'Log In'}
          </a>
        </div>
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

        <form action={async () => {
          'use server';
          const { cookies } = await import('next/headers');
          const { redirect } = await import('next/navigation');
          const { getEnv } = await import('@/lib/env');
          const { getRegion } = await import('@/lib/regions');
          const cookieStore = await cookies();
          const refreshToken = cookieStore.get('refresh_token')?.value;
          const locale = cookieStore.get('shopify_locale')?.value || 'en';

          if (refreshToken) {
            try {
              const env = getEnv();
              const region = getRegion(locale);
              await fetch(`https://${region.shopifyDomain}/auth/oauth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                  grant_type: 'refresh_token',
                  client_id: env.SHOPIFY_CLIENT_ID,
                  client_secret: env.SHOPIFY_CLIENT_SECRET,
                  refresh_token: refreshToken,
                  action: 'revoke',
                }),
              });
            } catch {}
          }

          const AUTH_COOKIES = ['access_token', 'refresh_token', 'access_token_hash', 'id_token', 'shopify_customer_id', 'shopify_locale'];
          AUTH_COOKIES.forEach((name) => cookieStore.set(name, '', { path: '/', maxAge: 0 }));
          redirect(`/${locale}`);
        }}>
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