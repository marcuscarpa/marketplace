'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useId, useRef, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';

import { removeFromCartAction, type CartActionState } from '@/actions/cart';
import { useCart } from '@/components/providers/cart-provider';
import { useWishlist } from '@/hooks/use-wishlist';
import { formatCartPrice, type CartLineItem } from '@/lib/cart/display';
import { currencyForLocale } from '@/lib/locale-currency';
import { isMockCartId, MINICART_RECOMMENDATIONS } from '@/lib/catalog/minicart-mock';

const PANEL_EASE = [0.76, 0, 0.24, 1] as const;

const panelVariants = {
  closed: { x: '100%' },
  open: { x: 0, transition: { duration: 0.35, ease: PANEL_EASE } },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.25 } },
};

function IconClose({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg aria-hidden width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M12 20.5l-1.1-1C5.5 14.8 2 11.6 2 7.8 2 5 4.2 3 6.8 3c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.6 0 4.8 2 4.8 4.8 0 3.8-3.5 7-8.9 11.7L12 20.5z" />
    </svg>
  );
}

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

function lineSize(line: CartLineItem): string | null {
  const size = line.selectedOptions.find((o) => o.name.toLowerCase() === 'size');
  if (size) return size.value;
  if (line.variantTitle && line.variantTitle !== 'Default Title') return line.variantTitle;
  return null;
}

function CartLineRow({
  line,
  locale,
  prefix,
  onRemove,
  removing,
}: {
  line: CartLineItem;
  locale: string;
  prefix: string;
  onRemove: (lineId: string) => void;
  removing: boolean;
}) {
  const { addItem, isInWishlist } = useWishlist();
  const isPt = locale === 'pt';
  const size = lineSize(line);
  const inWishlist = isInWishlist(line.variantId);

  return (
    <div className="flex gap-4 border-b border-[#03060714] py-5">
      <div className="shrink-0">
        <Link href={`${prefix}/products/${line.handle}`} tabIndex={-1} className="block">
          <div className="relative h-[91px] w-[72px] shrink-0 bg-muted">
            {line.imageUrl ? (
              <Image
                src={line.imageUrl}
                alt={line.imageAlt ?? line.productTitle}
                fill
                sizes="72px"
                className="object-contain"
              />
            ) : null}
          </div>
        </Link>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="mb-3 font-sans-ui text-[12px] font-normal uppercase tracking-[0.1em] text-ink">
          <Link href={`${prefix}/products/${line.handle}`} className="transition-opacity hover:opacity-60">
            {line.productTitle}
          </Link>
        </h3>

        <div className="space-y-1.5 pr-1">
          <div className="flex items-baseline justify-between gap-3 font-sans-ui text-[11px] uppercase tracking-[0.02em] text-ink">
            <span className="shrink-0 text-[#03060799]">{isPt ? 'Preço' : 'Price'}</span>
            <span className="shrink-0 tabular-nums">{formatCartPrice(line.price.amount, line.price.currencyCode, locale)}</span>
          </div>
          {size && (
            <div className="flex items-baseline justify-between gap-3 font-sans-ui text-[11px] uppercase tracking-[0.02em] text-ink">
              <span className="shrink-0 text-[#03060799]">{isPt ? 'Tamanho' : 'Size'}</span>
              <span className="shrink-0 tabular-nums">{size}</span>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-3 font-sans-ui text-[11px] uppercase tracking-[0.02em] text-ink">
            <span className="shrink-0 text-[#03060799]">{isPt ? 'Quantidade' : 'Quantity'}</span>
            <span className="shrink-0 tabular-nums">{line.quantity}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              if (inWishlist) return;
              addItem({
                id: line.variantId,
                handle: line.handle,
                title: line.productTitle,
                price: formatCartPrice(line.price.amount, line.price.currencyCode, locale),
                image: line.imageUrl ?? '',
              });
            }}
            disabled={inWishlist}
            className="inline-flex items-center gap-1.5 border-b border-ink pb-px font-sans-ui text-[11px] uppercase tracking-[0.02em] text-ink transition-opacity hover:opacity-60 disabled:opacity-40"
          >
            <span>{isPt ? 'Mover para wishlist' : 'Move to wishlist'}</span>
            <IconHeart />
          </button>
          <button
            type="button"
            onClick={() => onRemove(line.id)}
            disabled={removing}
            className="inline-flex items-center gap-1.5 border-b border-ink pb-px font-sans-ui text-[11px] uppercase tracking-[0.02em] text-ink transition-opacity hover:opacity-60 disabled:opacity-40"
          >
            <span>{isPt ? 'Remover' : 'Remove'}</span>
            <IconClose />
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendationsCarousel({ locale, prefix }: { locale: string; prefix: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPt = locale === 'pt';

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
          {MINICART_RECOMMENDATIONS.map((item) => (
            <Link
              key={item.handle}
              href={`${prefix}/products/${item.handle}`}
              className="w-[127px] shrink-0 snap-start text-center"
            >
              <div className="relative mb-2 aspect-[514/668] w-full overflow-hidden bg-white">
                <Image src={item.image} alt={item.title} fill sizes="127px" className="object-contain" />
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

interface CartDrawerProps {
  locale: string;
}

export function CartDrawer({ locale }: CartDrawerProps) {
  const titleId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pendingLineId, setPendingLineId] = useState<string | null>(null);
  const [mockLines, setMockLines] = useState<CartLineItem[] | null>(null);
  const [, startTransition] = useTransition();

  const { cart, isLoading, isCartOpen, closeCart, updateFromAction, refreshCart } = useCart();

  const isPt = locale === 'pt';
  const prefix = `/${locale}`;
  const isMockCart = isMockCartId(cart.id);

  useEffect(() => {
    if (isMockCart) setMockLines(cart.lines);
    else setMockLines(null);
  }, [isMockCart, cart.lines]);

  const lines = isMockCart && mockLines ? mockLines : cart.lines;
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal =
    isMockCart && mockLines && mockLines.length > 0
      ? {
          currencyCode: currencyForLocale(locale),
          amount: mockLines
            .reduce((sum, line) => sum + Number(line.price.amount) * line.quantity, 0)
            .toFixed(2),
        }
      : cart.cost?.subtotalAmount;

  useEffect(() => setMounted(true), []);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    },
    [closeCart]
  );

  useEffect(() => {
    if (!isCartOpen) return;

    document.addEventListener('keydown', handleEscape);

    const html = document.documentElement;
    const scrollY = window.scrollY;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyLeft = document.body.style.left;
    const prevBodyRight = document.body.style.right;
    const prevBodyWidth = document.body.style.width;

    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    const onWheel = (event: WheelEvent) => {
      const root = document.querySelector('[data-minicart-root]');
      if (!root?.contains(event.target as Node)) {
        event.preventDefault();
        return;
      }

      const scrollEl = scrollRef.current;
      if (!scrollEl) {
        event.preventDefault();
        return;
      }

      const carousel = (event.target as Element).closest('[data-minicart-carousel]');
      if (carousel && Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      // ponytail: body is position:fixed — native wheel on overflow-y div is unreliable on Windows
      const maxScroll = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);
      scrollEl.scrollTop = Math.max(0, Math.min(maxScroll, scrollEl.scrollTop + event.deltaY));
      event.preventDefault();
    };

    const onTouchMove = (event: TouchEvent) => {
      const scrollEl = scrollRef.current;
      if (scrollEl?.contains(event.target as Node)) return;
      if ((event.target as Element).closest('[data-minicart-root]')) {
        event.preventDefault();
      }
    };

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('touchmove', onTouchMove);
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.left = prevBodyLeft;
      document.body.style.right = prevBodyRight;
      document.body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isCartOpen, handleEscape]);

  const handleRemove = (lineId: string) => {
    if (isMockCart) {
      setMockLines((prev) => (prev ?? cart.lines).filter((line) => line.id !== lineId));
      return;
    }
    setPendingLineId(lineId);
    startTransition(async () => {
      const fd = new FormData();
      fd.set('lineId', lineId);
      fd.set('locale', locale);
      const result = await removeFromCartAction({ success: false, message: '' }, fd);
      updateFromAction(result);
      if (result.success) await refreshCart();
      setPendingLineId(null);
    });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-x-0 bottom-0 top-8 z-[95] overscroll-none md:top-7" data-minicart-root>
          <motion.button
            type="button"
            aria-label={isPt ? 'Fechar' : 'Close'}
            className="absolute inset-0 bg-black/20"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-minicart-panel
            className="absolute right-0 top-0 flex h-full w-full max-w-[504px] flex-col border border-[#ddd] bg-white pl-[13px] pr-[10px] font-sans-ui text-[11px] font-light text-ink"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <button
              type="button"
              aria-label={isPt ? 'Fechar' : 'Close'}
              onClick={closeCart}
              className="absolute right-0 top-4 z-10 flex h-8 w-8 items-center justify-center text-ink hover:opacity-60"
            >
              <IconClose />
            </button>

            <header className="shrink-0 border-b border-[#03060714] py-5 text-center">
              <h2 id={titleId} className="font-sans-ui text-[12px] uppercase tracking-[0.12em] text-ink">
                {isPt ? 'Saco' : 'Bag'}
                {count > 0 ? ` (${count})` : ''}
              </h2>
            </header>

            <div
              ref={scrollRef}
              className="minicart-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5"
            >
              {isLoading ? (
                <p className="py-12 text-center font-sans-ui text-[11px] uppercase tracking-[0.02em] text-[#03060799]">
                  {isPt ? 'A carregar…' : 'Loading…'}
                </p>
              ) : lines.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="mb-6 font-sans-ui text-[12px] uppercase tracking-[0.02em] text-[#03060799]">
                    {isPt ? 'O seu saco está vazio' : 'Your bag is empty'}
                  </p>
                  <Link
                    href={`${prefix}/collections/all`}
                    onClick={closeCart}
                    className="border-b border-ink pb-px font-sans-ui text-[11px] uppercase tracking-[0.02em] text-ink"
                  >
                    {isPt ? 'Continuar a comprar' : 'Continue shopping'}
                  </Link>
                </div>
              ) : (
                lines.map((line) => (
                  <CartLineRow
                    key={line.id}
                    line={line}
                    locale={locale}
                    prefix={prefix}
                    onRemove={handleRemove}
                    removing={pendingLineId === line.id}
                  />
                ))
              )}

              {lines.length > 0 && subtotal && (
                <footer className="border-t border-[#03060714] py-5 pr-1">
                  <div className="mb-5 flex items-baseline justify-between gap-3 font-sans-ui text-[11px] uppercase tracking-[0.02em] text-ink">
                    <span className="shrink-0">{isPt ? 'Subtotal s/ impostos' : 'Subtotal excl. taxes'}</span>
                    <span className="shrink-0 text-right tabular-nums">
                      {subtotal.currencyCode} {formatCartPrice(subtotal.amount, subtotal.currencyCode, locale)}
                    </span>
                  </div>
                  {lines.length > 0 ? (
                    <a
                      href={`${prefix}/api/cart/checkout`}
                      className="mb-3 block w-full bg-[#4a4a4a] py-3.5 text-center font-sans-ui text-[12px] uppercase tracking-[0.02em] text-white transition-colors hover:bg-[#000000]"
                    >
                      Checkout
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mb-3 w-full bg-ink/40 py-3.5 font-sans-ui text-[12px] uppercase tracking-[0.02em] text-white"
                    >
                      Checkout
                    </button>
                  )}
                  <div className="text-center">
                    <Link
                      href={`${prefix}/cart`}
                      onClick={closeCart}
                      className="border-b border-ink pb-px font-sans-ui text-[11px] uppercase tracking-[0.02em] text-ink hover:opacity-60"
                    >
                      {isPt ? 'Ver saco' : 'View bag'}
                    </Link>
                  </div>
                </footer>
              )}

              <RecommendationsCarousel locale={locale} prefix={prefix} />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
