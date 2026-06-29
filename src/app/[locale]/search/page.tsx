import { Metadata } from 'next';
import Image from 'next/image';

import { ProductCard } from '@/components/ui/product-card';
import { SearchBar } from '@/components/ui/search-bar';
import { PageMain } from '@/components/storefront/ui';
import { searchProducts } from '@/lib/shopify/search';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  return {
    title: q
      ? `${q.substring(0, 100)} | ${locale === 'pt' ? 'Busca' : 'Search'} | Luxury Store`
      : `${locale === 'pt' ? 'Busca' : 'Search'} | Luxury Store`,
    description: locale === 'pt' ? 'Buscar produtos de luxo' : 'Search luxury products',
  };
}

async function getSearchResults(query: string, locale: string) {
  if (!query || query.trim().length < 2) return [];
  return searchProducts(query, locale, 24);
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q: query } = await searchParams;
  const isPt = locale === 'pt';
  const results = await getSearchResults(query ?? '', locale);

  return (
    <PageMain padded={false}>
      <header className="bg-gray-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-light tracking-tight mb-6">
            {isPt ? 'Buscar Produtos' : 'Search Products'}
          </h1>
          <SearchBar locale={locale} initialQuery={query ?? ''} />
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {query && (
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
            </p>
          </div>
        )}

        {query && results.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-4">
              {isPt ? 'Nenhum resultado encontrado' : 'No results found'}
            </p>
            <p className="text-gray-400 text-sm">
              {isPt
                ? 'Tente buscar por outros termos ou navegue pelas coleções'
                : 'Try searching for different terms or browse our collections'}
            </p>
            <a
              href={`/${locale}/collections/all`}
              className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              {isPt ? 'Ver Todas as Coleções' : 'View All Collections'}
            </a>
          </div>
        ) : !query ? (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-4">
              {isPt ? 'Busque por produtos de luxo' : 'Search for luxury products'}
            </p>
            <p className="text-gray-400 text-sm">
              {isPt
                ? 'Digite pelo menos 2 caracteres para buscar'
                : 'Enter at least 2 characters to search'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </PageMain>
  );
}