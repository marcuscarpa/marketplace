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
}

export function CartRecommendationsCarousel({
  locale,
  prefix,
  items,
  onItemClick,
}: CartRecommendationsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPt = locale === 'pt';

  if (items.length === 0) return null;

  return (
    <div className="border-t border-[#03060714] bg-cream/40">
      <header className="border-b border-[#03060714] bg-muted/60 py-3 text-center">
        <h3 className="font-sans-ui text-[11px] font-normal uppercase tracking-[0.12em] text-ink">
          {isPt ? 'Recomendado para si' : 'Recommended for you'}
        </h3>
      </header>

      <div className="relative px-3 py-4">
        <button
          type="button"
          aria-label={isPt ? 'Anterior' : 'Previous'}
          onClick={() => trackRef.current?.scrollBy({ left: -140, behavior: 'smooth' })}
          className="absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-ink hover:opacity-60"
        >
          <IconChevron direction="left" />
        </button>

        <div
          ref={trackRef}
          data-minicart-carousel
          className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <Link
              key={item.handle}
              href={`${prefix}/products/${item.handle}`}
              onClick={onItemClick}
              className="w-[127px] shrink-0 snap-start text-center"
            >
              <div className="relative mb-2 aspect-[514/668] w-full overflow-hidden bg-white">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill sizes="127px" className="object-contain" />
                ) : null}
              </div>
              <p className="mb-1 line-clamp-2 font-sans-ui text-[10px] uppercase leading-snug tracking-[0.06em] text-ink">
                {item.title}
              </p>
              <p className="font-sans-ui text-[11px] text-ink">{item.price}</p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label={isPt ? 'Seguinte' : 'Next'}
          onClick={() => trackRef.current?.scrollBy({ left: 140, behavior: 'smooth' })}
          className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-ink hover:opacity-60"
        >
          <IconChevron direction="right" />
        </button>
      </div>
    </div>
  );
}
