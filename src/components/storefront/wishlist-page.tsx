'use client';

import Link from 'next/link';

import { WishlistGridCard } from '@/components/storefront/wishlist-grid-card';
import { HEADER_OFFSET_TOP } from '@/components/storefront/ui';
import { useAuth } from '@/hooks/use-auth';
import { useWishlist } from '@/hooks/use-wishlist';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';

interface WishlistPageProps {
  locale: string;
}

export function WishlistPage({ locale }: WishlistPageProps) {
  const { items, removeItem, hydrated } = useWishlist();
  const { customer, isLoading: authLoading, isAuthenticated, login } = useAuth();
  const isPt = locale === 'pt';
  const prefix = `/${locale}`;

  const copy = {
    title: (name: string) =>
      isPt ? `Lista de desejos de ${name}` : `${name}'s Wish List`,
    defaultTitle: isPt ? 'Lista de desejos' : 'Wish List',
    empty: isPt ? 'Ainda não tem favoritos.' : 'You have no saved favorites yet.',
    continue: isPt ? 'Continuar a comprar' : 'Continue shopping',
    loading: isPt ? 'A carregar…' : 'Loading…',
    signInTitle: isPt ? 'Lista de desejos' : 'Wish List',
    signInBody: isPt
      ? 'Inicie sessão para guardar e ver os seus favoritos.'
      : 'Sign in to save and view your favorites.',
    signIn: isPt ? 'Iniciar sessão' : 'Sign in',
    count: (n: number) =>
      isPt ? `${n} ${n === 1 ? 'artigo' : 'artigos'}` : `${n} ${n === 1 ? 'item' : 'items'}`,
    availability: isPt ? 'Disponibilidade' : 'Availability',
  };

  const displayName = customer?.firstName?.trim();
  const pageTitle = displayName ? copy.title(displayName) : copy.defaultTitle;

  if (authLoading || !hydrated) {
    return (
      <div className={`bg-white pb-20 ${HEADER_OFFSET_TOP}`}>
        <div className="mx-auto max-w-[1310px] px-5 py-24 text-center font-sans-ui text-[12px] uppercase tracking-[0.02em] text-[#03060799] md:px-8 lg:px-10">
          {copy.loading}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`bg-white pb-20 ${HEADER_OFFSET_TOP}`}>
        <div className="mx-auto max-w-[640px] px-5 py-20 text-center md:px-8">
          <h1 className="mb-6 font-serif text-[32px] font-normal leading-tight tracking-[-0.02em] text-ink md:text-[40px]">
            {copy.signInTitle}
          </h1>
          <p className="mb-10 font-sans-ui text-[13px] leading-relaxed text-[#03060799]">{copy.signInBody}</p>
          <button
            type="button"
            onClick={() => login(`${prefix}/wishlist`)}
            className="inline-block border border-ink bg-ink px-10 py-3.5 font-sans-ui text-[12px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1a1a1a]"
          >
            {copy.signIn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white pb-20 ${HEADER_OFFSET_TOP}`}>
      <div className="mx-auto max-w-[1310px] px-5 font-sans-ui text-ink md:px-8 lg:px-10">
        <header className="border-b border-[#03060714] pb-6 pt-4">
          <h1 className="text-center font-serif text-[28px] font-normal leading-tight tracking-[-0.02em] text-ink md:text-[36px]">
            {pageTitle}
          </h1>
        </header>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-6 text-[12px] uppercase tracking-[0.02em] text-[#03060799]">{copy.empty}</p>
            <Link
              href={`${prefix}/${collectionPath(SHOPIFY_COLLECTION.shopAll)}`}
              className="border-b border-ink pb-px text-[11px] uppercase tracking-[0.02em] text-ink hover:opacity-60"
            >
              {copy.continue}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#03060714] py-5">
              <p className="text-[11px] uppercase tracking-[0.06em] text-[#03060799]">{copy.count(items.length)}</p>
              <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.06em] text-ink">
                <span className="text-[#03060799]">{copy.availability}</span>
                <select
                  className="cursor-pointer border-0 bg-transparent pr-6 text-[11px] uppercase tracking-[0.06em] text-ink outline-none"
                  defaultValue="all"
                  aria-label={copy.availability}
                >
                  <option value="all">{isPt ? 'Todos' : 'All'}</option>
                  <option value="available">{isPt ? 'Disponível' : 'Available'}</option>
                  <option value="sold-out">{isPt ? 'Esgotado' : 'Sold out'}</option>
                </select>
              </label>
            </div>

            <div
              className="grid grid-cols-2 justify-center gap-x-6 gap-y-8 py-8 lg:grid-cols-4"
            >
              {items.map((item) => (
                <WishlistGridCard
                  key={item.id}
                  item={item}
                  locale={locale}
                  prefix={prefix}
                  onRemove={() => removeItem(item.handle)}
                />
              ))}
            </div>

            <div className="border-t border-[#03060714] pt-10 text-center">
              <Link
                href={`${prefix}/${collectionPath(SHOPIFY_COLLECTION.shopAll)}`}
                className="border-b border-ink pb-px text-[11px] uppercase tracking-[0.02em] text-ink hover:opacity-60"
              >
                {copy.continue}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
