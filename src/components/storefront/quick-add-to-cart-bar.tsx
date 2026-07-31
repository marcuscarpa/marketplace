'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef } from 'react';

import { addToCartByHandleAction, CartActionState } from '@/actions/cart';
import { useCart } from '@/components/providers/cart-provider';
import { trackAddedToCart } from '@/lib/analytics';

interface QuickAddToCartBarProps {
  handle: string;
  productTitle: string;
  locale: string;
  label: string;
  className?: string;
  disabled?: boolean;
  href?: string;
}

const initialState: CartActionState = {
  success: false,
  message: '',
};

export function QuickAddToCartBar({
  handle,
  productTitle,
  locale,
  label,
  className = '',
  disabled,
  href,
}: QuickAddToCartBarProps) {
  const [state, formAction, isPending] = useActionState(addToCartByHandleAction, initialState);
  const { updateFromAction, openCart, refreshCart } = useCart();
  const wasPending = useRef(false);
  const isPt = locale === 'pt';

  useEffect(() => {
    if (state.success) {
      trackAddedToCart({
        productId: handle,
        title: productTitle,
        variantId: handle,
        quantity: 1,
        price: '0',
        currency: 'USD',
      });
    }
  }, [state.success, handle, productTitle]);

  useEffect(() => {
    if (wasPending.current && !isPending && state.success) {
      updateFromAction(state);
      void refreshCart();
      openCart();
    }
    wasPending.current = isPending;
  }, [isPending, state.success, state, updateFromAction, refreshCart, openCart]);

  if (disabled && href) {
    return (
      <Link href={href} className={className} aria-label={label}>
        {label}
      </Link>
    );
  }

  return (
    <form
      action={formAction}
      className={className}
      onClick={(event) => event.stopPropagation()}
      onSubmit={(event) => event.stopPropagation()}
    >
      <input type="hidden" name="handle" value={handle} />
      <input type="hidden" name="quantity" value={1} />
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        disabled={disabled || isPending}
        aria-label={label}
        className="flex h-full w-full items-center justify-center bg-transparent font-inherit uppercase disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (isPt ? 'A adicionar...' : 'Adding...') : label}
      </button>
    </form>
  );
}
