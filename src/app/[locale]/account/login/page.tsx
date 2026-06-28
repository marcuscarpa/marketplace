import { Metadata } from 'next';
import Link from 'next/link';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'pt' ? 'Entrar | Luxury Store' : 'Login | Luxury Store',
  };
}

const errorMessages: Record<string, string> = {
  invalid_state: 'Invalid authentication state. Please try again.',
  missing_code: 'Authentication failed. Please try again.',
  auth_failed: 'Authentication failed. Please try again.',
  token_refresh_failed: 'Session expired. Please log in again.',
};

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  const { error } = await searchParams;
  const isPt = locale === 'pt';

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight text-gray-900">
            {isPt ? 'Bem-vindo' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isPt ? 'Entre na sua conta Luxury Store' : 'Sign in to your Luxury Store account'}
          </p>
        </div>

        {error && errorMessages[error] && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errorMessages[error]}
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl p-8">
          <a
            href={`/${locale}/api/auth/oauth/authorize?redirect=/${locale}/account`}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white font-medium rounded-xl hover:bg-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {isPt ? 'Entrar com Shopify' : 'Continue with Shopify'}
          </a>

          <p className="mt-6 text-center text-sm text-gray-500">
            {isPt
              ? 'Você será redirecionado para autenticação segura da Shopify'
              : 'You will be redirected to secure Shopify authentication'}
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link href={`/${locale}`} className="text-gray-600 hover:text-gray-900 underline underline-offset-4">
            {isPt ? 'Voltar para página inicial' : 'Back to homepage'}
          </Link>
        </p>
      </div>
    </main>
  );
}