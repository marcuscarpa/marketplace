'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { removeFromCartAction, updateCartLinesAction } from '@/actions/cart';
import { CartQtyStepper } from '@/components/cart/cart-qty-stepper';
import { useCart } from '@/components/providers/cart-provider';
import { trackStartedCheckout } from '@/lib/analytics';
import { formatCartPrice, type CartLineItem } from '@/lib/cart/display';
import {
  lineMaxQuantity,
  lineTotal,
  removeLine,
  subtotalFromLines,
  totalQuantityFromLines,
  updateLineQuantity,
} from '@/lib/cart/totals';
import { useWishlist } from '@/hooks/use-wishlist';
import { HEADER_OFFSET_TOP } from '@/components/storefront/ui';
import { collectionPath, SHOPIFY_COLLECTION } from '@/lib/catalog/collection-handles';

import { CartRecommendationsCarousel } from '@/components/storefront/cart-recommendations-carousel';
import type { CartCarouselItem } from '@/lib/shopify/cart-recommendations';

interface CartBagPageProps {
  locale: string;
  lines: CartLineItem[];
  subtotal: { amount: string; currencyCode: string } | null;
  totalQuantity: number;
  checkoutDisabled: boolean;
  cartDisabled: boolean;
  isMockCart?: boolean;
  recommendations: CartCarouselItem[];
}

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

function lineSize(line: CartLineItem): string {
  const size = line.selectedOptions.find((o) => /size|tamanho/i.test(o.name));
  if (size) return size.value;
  if (line.variantTitle && line.variantTitle !== 'Default Title') return line.variantTitle;
  return 'ONE SIZE';
}

function lineColor(line: CartLineItem): string | null {
  const color = line.selectedOptions.find((o) => /color|cor|colour/i.test(o.name));
  return color?.value ?? null;
}

function CartTableHeader({ locale }: { locale: string }) {
  const isPt = locale === 'pt';
  return (
    <div
      className="hidden border-b border-[#03060714] pb-3 text-[10px] uppercase tracking-[0.08em] text-[#03060799] md:grid md:grid-cols-[minmax(0,1fr)_100px_130px_120px] md:gap-4"
      aria-hidden
    >
      <span>{isPt ? 'Artigo' : 'Item'}</span>
      <span className="text-center">{isPt ? 'Tamanho' : 'Size'}</span>
      <span className="text-center">{isPt ? 'Quantidade' : 'Quantity'}</span>
      <span className="text-right">{isPt ? 'Total artigo' : 'Item total'}</span>
    </div>
  );
}

function CartTableRow({
  line,
  locale,
  prefix,
  onRemove,
  onQuantityChange,
  pending,
}: {
  line: CartLineItem;
  locale: string;
  prefix: string;
  onRemove: (lineId: string) => void;
  onQuantityChange: (lineId: string, quantity: number) => void;
  pending: boolean;
}) {
  const { addItem, isInWishlist } = useWishlist();
  const isPt = locale === 'pt';
  const size = lineSize(line);
  const color = lineColor(line);
  const unitPrice = formatCartPrice(line.price.amount, line.price.currencyCode, locale);
  const totalPrice = formatCartPrice(String(lineTotal(line)), line.price.currencyCode, locale);
  const inWishlist = isInWishlist(line.variantId);

  return (
    <article className="border-b border-[#03060714] py-8">
      <div className="md:grid md:grid-cols-[minmax(0,1fr)_100px_130px_120px] md:items-start md:gap-4">
        <div className="flex gap-5">
          <Link href={`${prefix}/products/${line.handle}`} tabIndex={-1} className="shrink-0">
            <div className="relative h-[127px] w-[100px] bg-muted">
              {line.imageUrl ? (
                <Image
                  src={line.imageUrl}
                  alt={line.imageAlt ?? line.productTitle}
                  fill
                  sizes="100px"
                  className="object-contain"
                />
              ) : null}
            </div>
          </Link>
          <div className="min-w-0 pt-1">
            <h2 className="mb-4 text-[11px] font-normal uppercase leading-snug tracking-[0.06em] text-ink">
              <Link href={`${prefix}/products/${line.handle}`} className="transition-opacity hover:opacity-60">
                {line.productTitle}
              </Link>
            </h2>
            {color && (
              <p className="mb-1 text-[10px] uppercase tracking-[0.04em] text-ink">
                <span className="text-[#03060799]">{isPt ? 'Cor' : 'Colour'}</span>{' '}
                <span>{color}</span>
              </p>
            )}
            <p className="text-[10px] uppercase tracking-[0.04em] text-ink">
              <span className="text-[#03060799]">{isPt ? 'Preço' : 'Price'}</span>{' '}
              <span className="tabular-nums">{unitPrice}</span>
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.04em] text-[#03060799] md:hidden">
              {isPt ? 'Tamanho' : 'Size'}: <span className="text-ink">{size}</span>
            </p>
          </div>
        </div>

        <p className="hidden text-center text-[11px] uppercase tracking-[0.02em] text-ink md:block">{size}</p>

        <div className="mt-4 flex justify-start md:mt-0 md:justify-center">
          <CartQtyStepper
            quantity={line.quantity}
            max={lineMaxQuantity(line)}
            disabled={pending}
            onChange={(next) => onQuantityChange(line.id, next)}
            labels={{
              decrease: isPt ? 'Diminuir quantidade' : 'Decrease quantity',
              increase: isPt ? 'Aumentar quantidade' : 'Increase quantity',
            }}
          />
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-[0.02em] text-ink tabular-nums md:mt-0 md:text-right">
          <span className="text-[#03060799] md:hidden">{isPt ? 'Total' : 'Total'}: </span>
          {totalPrice}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-5">
        <button
          type="button"
          onClick={() => {
            if (inWishlist) return;
            addItem({
              id: line.variantId,
              handle: line.handle,
              title: line.productTitle,
              price: unitPrice,
              image: line.imageUrl ?? '',
            });
          }}
          disabled={inWishlist}
          className="inline-flex items-center gap-1.5 border-b border-ink pb-px text-[10px] uppercase tracking-[0.02em] text-ink transition-opacity hover:opacity-60 disabled:opacity-40"
        >
          <span>{isPt ? 'Mover para wishlist' : 'Move to wishlist'}</span>
          <IconHeart />
        </button>
        <button
          type="button"
          onClick={() => onRemove(line.id)}
          disabled={pending}
          className="inline-flex items-center gap-1.5 border-b border-ink pb-px text-[10px] uppercase tracking-[0.02em] text-ink transition-opacity hover:opacity-60 disabled:opacity-40"
        >
          <span>{isPt ? 'Remover' : 'Remove'}</span>
          <IconClose />
        </button>
      </div>
    </article>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3 text-[11px] uppercase tracking-[0.02em] text-ink md:px-6">
      <span className={bold ? 'font-normal' : 'text-[#03060799]'}>{label}</span>
      <span className={`shrink-0 tabular-nums ${bold ? 'font-normal' : ''}`}>{value}</span>
    </div>
  );
}

function CartTrustSignals({ locale }: { locale: string }) {
  const isPt = locale === 'pt';
  const items = [
    {
      title: isPt ? 'Devoluções grátis*' : 'Free returns*',
      body: isPt
        ? 'Devolva online ou na boutique. Devoluções grátis em pedidos US.'
        : 'Return items with ease online, or in-boutique. Free returns on all US orders.',
    },
    {
      title: isPt ? 'Envio rápido' : 'Fast shipping',
      body: isPt ? 'Entrega em 2–5 dias úteis.' : 'Orders delivered within 2–5 business days.',
    },
    {
      title: isPt ? 'Pagamentos seguros' : 'Secure payments',
      body: isPt
        ? 'Protegemos os seus dados de pagamento e pessoais.'
        : 'We protect your payment and personal information.',
    },
  ];

  return (
    <div className="mt-12 grid gap-8 border-t border-[#03060714] pt-10 md:grid-cols-3 md:gap-6">
      {items.map((item) => (
        <div key={item.title} className="text-center md:text-left">
          <h3 className="mb-2 text-[11px] font-normal uppercase tracking-[0.06em] text-ink">{item.title}</h3>
          <p className="text-[11px] leading-relaxed text-[#03060799]">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export function CartBagPage({
  locale,
  lines,
  subtotal,
  totalQuantity,
  checkoutDisabled,
  cartDisabled,
  isMockCart = false,
  recommendations,
}: CartBagPageProps) {
  const [localLines, setLocalLines] = useState(lines);
  const [pendingLineId, setPendingLineId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const { updateFromAction } = useCart();
  const mutatingRef = useRef(false);

  const linesSignature = lines.map((l) => `${l.id}:${l.quantity}`).join('|');

  useEffect(() => {
    if (mutatingRef.current) return;
    if (linesSignature === localLines.map((l) => `${l.id}:${l.quantity}`).join('|')) return;
    setLocalLines(lines);
  }, [linesSignature, lines, localLines]);

  const isPt = locale === 'pt';
  const prefix = `/${locale}`;
  const displayTotalQuantity = totalQuantityFromLines(localLines);
  const displaySubtotal = subtotalFromLines(localLines) ?? subtotal;

  const copy = {
    title: isPt ? 'Saco' : 'Bag',
    empty: isPt ? 'O seu saco está vazio' : 'You have no items in your bag.',
    continue: isPt ? 'Continuar a comprar' : 'Continue shopping',
    totalItems: isPt ? 'Total artigos' : 'Total items',
    subtotal: isPt ? 'Subtotal s/ impostos' : 'Subtotal excl. taxes',
    shipping: isPt ? 'Envio | Standard' : 'Shipping | Ground',
    grandTotal: isPt ? 'Total geral' : 'Grand total',
    checkout: 'Checkout',
    cartDisabled: isPt ? 'O carrinho está temporariamente indisponível' : 'Cart is temporarily unavailable',
    checkoutDisabled: isPt ? 'Checkout temporariamente indisponível' : 'Checkout temporarily unavailable',
  };

  const handleRemove = useCallback(
    (lineId: string) => {
      if (isMockCart) {
        setLocalLines((prev) => removeLine(prev, lineId));
        return;
      }

      const previous = localLines;
      setLocalLines((prev) => removeLine(prev, lineId));
      mutatingRef.current = true;
      setPendingLineId(lineId);
      startTransition(async () => {
        try {
          const fd = new FormData();
          fd.set('lineId', lineId);
          fd.set('locale', locale);
          const result = await removeFromCartAction({ success: false, message: '' }, fd);
          if (result.success && result.cart) {
            setLocalLines(result.cart.lines ?? []);
            updateFromAction(result);
          } else {
            setLocalLines(previous);
          }
        } finally {
          mutatingRef.current = false;
          setPendingLineId(null);
        }
      });
    },
    [isMockCart, localLines, locale, updateFromAction]
  );

  const handleQuantityChange = useCallback(
    (lineId: string, quantity: number) => {
      const line = localLines.find((l) => l.id === lineId);
      if (!line) return;
      const max = lineMaxQuantity(line);
      const next = Math.max(1, Math.min(quantity, max));
      if (next === line.quantity) return;

      if (isMockCart) {
        setLocalLines((prev) => updateLineQuantity(prev, lineId, next));
        return;
      }

      const previous = localLines;
      setLocalLines((prev) => updateLineQuantity(prev, lineId, next));
      mutatingRef.current = true;
      setPendingLineId(lineId);
      startTransition(async () => {
        try {
          const fd = new FormData();
          fd.set('lineId', lineId);
          fd.set('quantity', String(next));
          fd.set('locale', locale);
          const result = await updateCartLinesAction({ success: false, message: '' }, fd);
          if (result.success && result.cart) {
            setLocalLines(result.cart.lines ?? []);
            updateFromAction(result);
          } else {
            setLocalLines(previous);
          }
        } finally {
          mutatingRef.current = false;
          setPendingLineId(null);
        }
      });
    },
    [isMockCart, localLines, locale, updateFromAction]
  );

  const handleCheckout = () => {
    if (!displaySubtotal) return;
    trackStartedCheckout({
      totalQuantity: displayTotalQuantity,
      totalAmount: displaySubtotal.amount,
      currency: displaySubtotal.currencyCode,
      itemCount: localLines.length,
    });
  };

  const shippingAmount = 0;
  const grandTotal = displaySubtotal ? Number(displaySubtotal.amount) + shippingAmount : 0;

  return (
    <div className={`bg-white pb-20 ${HEADER_OFFSET_TOP}`}>
      <div className="mx-auto max-w-[1310px] px-5 font-sans-ui text-[11px] font-light text-ink md:px-8 lg:px-10">
        <h1 className="mb-10 text-center text-[12px] font-normal uppercase tracking-[0.12em] text-ink">
          {copy.title}
        </h1>

        {cartDisabled && (
          <p className="mb-6 text-center text-[11px] uppercase tracking-[0.02em] text-red-700">{copy.cartDisabled}</p>
        )}

        {localLines.length === 0 ? (
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
            <CartTableHeader locale={locale} />
            {localLines.map((line) => (
              <CartTableRow
                key={line.id}
                line={line}
                locale={locale}
                prefix={prefix}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
                pending={pendingLineId === line.id}
              />
            ))}

            {displaySubtotal && (
              <section className="mt-4">
                <div className="bg-[#f3f3f3]">
                  <SummaryRow label={copy.totalItems} value={String(displayTotalQuantity)} />
                  <SummaryRow
                    label={copy.subtotal}
                    value={formatCartPrice(displaySubtotal.amount, displaySubtotal.currencyCode, locale)}
                  />
                  <SummaryRow
                    label={copy.shipping}
                    value={formatCartPrice(String(shippingAmount), displaySubtotal.currencyCode, locale)}
                  />
                </div>
                <div className="bg-[#e8e8e8]">
                  <SummaryRow
                    label={copy.grandTotal}
                    value={`${displaySubtotal.currencyCode} ${formatCartPrice(String(grandTotal), displaySubtotal.currencyCode, locale)}`}
                    bold
                  />
                </div>

                <div className="mx-auto mt-8 max-w-[640px]">
                  {checkoutDisabled ? (
                    <div className="mb-4 w-full bg-ink/40 py-4 text-center text-[12px] uppercase tracking-[0.02em] text-white">
                      {copy.checkoutDisabled}
                    </div>
                  ) : (
                    <a
                      href={`${prefix}/api/cart/checkout`}
                      onClick={handleCheckout}
                      className="mb-4 block w-full bg-[#4a4a4a] py-4 text-center text-[12px] uppercase tracking-[0.02em] text-white transition-colors hover:bg-[#000000]"
                    >
                      {copy.checkout}
                    </a>
                  )}
                </div>
              </section>
            )}

            <CartTrustSignals locale={locale} />
          </>
        )}

        <CartRecommendationsCarousel
          locale={locale}
          prefix={prefix}
          items={recommendations}
          variant="page"
        />
      </div>
    </div>
  );
}
