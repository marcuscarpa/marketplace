'use client';

import Image from 'next/image';
import Link from 'next/link';

import { AddToCartButton } from '@/components/luxury/add-to-cart-button';
import { PRODUCT_IMAGE_HOVER_NESTED } from '@/components/storefront/ui';
import type { WishlistStoredItem } from '@/lib/catalog/wishlist-seed';

function IconClose({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

interface WishlistGridCardProps {
  item: WishlistStoredItem;
  locale: string;
  prefix: string;
  onRemove: () => void;
}

export function WishlistGridCard({ item, locale, prefix, onRemove }: WishlistGridCardProps) {
  const isPt = locale === 'pt';
  const href = `${prefix}/products/${item.handle}`;
  const canAddToBag = Boolean(item.variantId && item.availableForSale !== false);
  const badgeLabel =
    item.badge === 'soldOut'
      ? isPt
        ? 'Esgotado'
        : 'Sold out'
      : item.badge === 'lowStock'
        ? isPt
          ? 'Stock baixo'
          : 'Low stock'
        : null;

  return (
    <article className="group/card flex flex-col">
      <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden bg-white">
        <Link href={href} className="absolute inset-0 z-0 block">
          <div className={`absolute inset-0 ${PRODUCT_IMAGE_HOVER_NESTED}`}>
            {item.image ? (
              <>
                <figure
                  className={`absolute inset-0 m-0 transition-opacity duration-300 ${
                    item.hoverImage ? 'group-hover/card:opacity-0' : ''
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-contain object-center"
                  />
                </figure>
                {item.hoverImage ? (
                  <figure className="absolute inset-0 m-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                    <Image
                      src={item.hoverImage}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-contain object-center"
                      aria-hidden
                    />
                  </figure>
                ) : null}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.06em] text-[#03060766]">
                {isPt ? 'Sem imagem' : 'No image'}
              </div>
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          aria-label={isPt ? 'Remover dos favoritos' : 'Remove from wishlist'}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-opacity hover:opacity-70"
        >
          <IconClose />
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] translate-y-full opacity-0 transition duration-500 ease-in-out group-hover/card:pointer-events-auto group-hover/card:translate-y-0 group-hover/card:opacity-100">
          {canAddToBag && item.variantId && item.productId ? (
            <div className="[&_button]:h-12 [&_button]:border-0 [&_button]:bg-white [&_button]:text-[12px] [&_button]:font-normal [&_button]:tracking-[0.02em] [&_button]:text-ink [&_button]:hover:bg-[#f7f7f7] [&_form]:w-full">
              <AddToCartButton
                variantId={item.variantId}
                productId={item.productId}
                productTitle={item.title}
                price={item.priceAmount}
                currency={item.currencyCode}
                locale={locale}
                label={isPt ? 'Adicionar ao saco' : 'Add to Bag'}
              />
            </div>
          ) : (
            <Link
              href={href}
              className="flex h-12 w-full items-center justify-center bg-white font-sans-ui text-[12px] font-normal uppercase tracking-[0.02em] text-ink no-underline transition-colors hover:bg-[#f7f7f7]"
            >
              {item.badge === 'soldOut'
                ? isPt
                  ? 'Ver recomendações'
                  : 'View Recommendations'
                : isPt
                  ? 'Ver produto'
                  : 'View product'}
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-1.5 font-sans-ui">
        {item.vendor ? (
          <p className="text-[11px] font-normal uppercase tracking-[0.04em] text-ink">{item.vendor}</p>
        ) : null}
        <Link
          href={href}
          className="block text-[11px] font-normal uppercase leading-snug tracking-[0.02em] text-ink hover:opacity-60"
        >
          {item.title}
        </Link>
        {item.variantLabel ? (
          <p className="text-[11px] uppercase tracking-[0.02em] text-[#03060799]">{item.variantLabel}</p>
        ) : null}
        <p className="text-[11px] tabular-nums tracking-[0.02em] text-ink">{item.price}</p>
        {badgeLabel ? (
          <p className="pt-1 text-[10px] uppercase tracking-[0.08em] text-[#03060799]">{badgeLabel}</p>
        ) : null}
      </div>
    </article>
  );
}
