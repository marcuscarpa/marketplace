'use client';

import Image from 'next/image';
import Link from 'next/link';

import { HEADER_OFFSET_TOP } from '@/components/storefront/ui';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';
import { useWishlist } from '@/hooks/use-wishlist';

interface WishlistPageProps {
  locale: string;
}

function IconClose({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function WishlistRow({
  locale,
  prefix,
  handle,
  title,
  price,
  image,
  onRemove,
}: {
  locale: string;
  prefix: string;
  handle: string;
  title: string;
  price: string;
  image: string;
  onRemove: () => void;
}) {
  const isPt = locale === 'pt';
  const href = `${prefix}/products/${handle}`;

  return (
    <article className="grid grid-cols-[88px_1fr_auto] items-start gap-4 border-b border-[#03060714] py-6 md:grid-cols-[120px_1fr_auto] md:gap-8">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-cream">
        {image ? (
          <Image src={image} alt={title} fill sizes="120px" className="object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#f3f3f3] text-[10px] uppercase tracking-[0.06em] text-[#03060766]">
            {isPt ? 'Sem imagem' : 'No image'}
          </div>
        )}
      </Link>

      <div className="min-w-0 pt-1">
        <Link
          href={href}
          className="block text-[12px] font-normal uppercase leading-snug tracking-[0.02em] text-ink hover:opacity-60"
        >
          {title}
        </Link>
        <p className="mt-2 text-[12px] font-medium tracking-[0.02em] text-ink">{price}</p>
        <Link
          href={href}
          className="mt-4 inline-block border-b border-ink pb-px text-[11px] uppercase tracking-[0.02em] text-ink hover:opacity-60"
        >
          {isPt ? 'Ver produto' : 'View product'}
        </Link>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={isPt ? 'Remover dos favoritos' : 'Remove from wishlist'}
        className="flex h-8 w-8 items-center justify-center text-ink transition-opacity hover:opacity-60"
      >
        <IconClose />
      </button>
    </article>
  );
}

export function WishlistPage({ locale }: WishlistPageProps) {
  const { items, removeItem, hydrated } = useWishlist();
  const isPt = locale === 'pt';
  const prefix = `/${locale}`;

  const copy = {
    title: isPt ? 'Lista de desejos' : 'Wishlist',
    empty: isPt ? 'Ainda não tem favoritos.' : 'You have no saved favorites yet.',
    continue: isPt ? 'Continuar a comprar' : 'Continue shopping',
    loading: isPt ? 'A carregar…' : 'Loading…',
    count: (n: number) =>
      isPt ? `${n} ${n === 1 ? 'artigo' : 'artigos'}` : `${n} ${n === 1 ? 'item' : 'items'}`,
  };

  return (
    <div className={`bg-white pb-20 ${HEADER_OFFSET_TOP}`}>
      <div className="mx-auto max-w-[1310px] px-5 font-sans-ui text-[11px] font-light text-ink md:px-8 lg:px-10">
        <h1 className="mb-2 text-center text-[12px] font-normal uppercase tracking-[0.12em] text-ink">
          {copy.title}
        </h1>

        {!hydrated ? (
          <p className="py-12 text-center text-[12px] uppercase tracking-[0.02em] text-[#03060799]">
            {copy.loading}
          </p>
        ) : items.length === 0 ? (
          <div className="py-12 text-center">
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
            <p className="mb-8 text-center text-[11px] uppercase tracking-[0.06em] text-[#03060799]">
              {copy.count(items.length)}
            </p>
            <div>
              {items.map((item) => (
                <WishlistRow
                  key={item.id}
                  locale={locale}
                  prefix={prefix}
                  handle={item.handle}
                  title={item.title}
                  price={item.price}
                  image={item.image}
                  onRemove={() => removeItem(item.handle)}
                />
              ))}
            </div>
            <div className="mt-10 text-center">
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
