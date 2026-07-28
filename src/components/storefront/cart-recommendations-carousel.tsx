'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import type { CartCarouselItem } from '@/lib/shopify/cart-recommendations';

function IconChevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg aria-hidden width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
      {direction === 'left' ? (
        <path d="M6.5 1.5L3 5l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M3.5 1.5L7 5l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

interface CartRecommendationsCarouselProps {
  locale: string;
  prefix: string;
  items: CartCarouselItem[];
  onItemClick?: () => void;
  variant?: 'compact' | 'page';
}

export function CartRecommendationsCarousel({
  locale,
  prefix,
  items,
  onItemClick,
  variant = 'compact',
}: CartRecommendationsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPt = locale === 'pt';
  const isPage = variant === 'page';

  const scrollStep = isPage ? 320 : 140;

  if (items.length === 0) return null;

  return (
    <div className="border-t border-[#03060714] bg-cream/40">
      <header className="border-b border-[#03060714] bg-muted/60 py-3 text-center">
        <h3 className="font-sans-ui text-[11px] font-normal uppercase tracking-[0.12em] text-ink">
          {isPt ? 'Recomendado para si' : 'Recommended for you'}
        </h3>
      </header>

      <div className={`relative py-4 ${isPage ? '' : 'px-3'}`}>
        <button
          type="button"
          aria-label={isPt ? 'Anterior' : 'Previous'}
          onClick={() => trackRef.current?.scrollBy({ left: -scrollStep, behavior: 'smooth' })}
          className={`absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-ink hover:opacity-60 ${isPage ? '-left-1' : 'left-1'}`}
        >
          <IconChevron direction="left" />
        </button>

        <div
          ref={trackRef}
          data-minicart-carousel
          className={
            isPage
              ? 'flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              : 'flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          }
        >
          {items.map((item) => (
            <Link
              key={item.handle}
              href={`${prefix}/products/${item.handle}`}
              onClick={onItemClick}
              className={
                isPage
                  ? 'w-[calc((100%-3rem)/4)] min-w-[160px] shrink-0 snap-start text-center md:min-w-0'
                  : 'w-[127px] shrink-0 snap-start text-center'
              }
            >
              <div className="relative mb-2 aspect-[514/668] w-full overflow-hidden bg-white">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={isPage ? '(max-width: 768px) 160px, 25vw' : '127px'}
                    className="object-contain"
                  />
                ) : null}
              </div>
              <p
                className={`mb-1 line-clamp-2 font-sans-ui uppercase leading-snug tracking-[0.06em] text-ink ${
                  isPage ? 'text-[11px]' : 'text-[10px]'
                }`}
              >
                {item.title}
              </p>
              <p className={`font-sans-ui text-ink ${isPage ? 'text-[12px]' : 'text-[11px]'}`}>{item.price}</p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label={isPt ? 'Seguinte' : 'Next'}
          onClick={() => trackRef.current?.scrollBy({ left: scrollStep, behavior: 'smooth' })}
          className={`absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-ink hover:opacity-60 ${isPage ? '-right-1' : 'right-1'}`}
        >
          <IconChevron direction="right" />
        </button>
      </div>
    </div>
  );
}
