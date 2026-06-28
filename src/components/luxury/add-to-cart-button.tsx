'use client';

import { useActionState, useEffect, useRef } from 'react';

import { addToCartAction, CartActionState } from '@/actions/cart';
import { useCart } from '@/components/providers/cart-provider';
import { trackAddedToCart } from '@/lib/analytics';

interface AddToCartButtonProps {
  variantId?: string;
  productId?: string;
  productTitle: string;
  price?: string;
  currency?: string;
  locale: string;
  quantity?: number;
  disabled?: boolean;
  label?: string;
}

const initialState: CartActionState = {
  success: false,
  message: '',
};

export function AddToCartButton({
  variantId,
  productId,
  productTitle,
  price,
  currency,
  locale,
  quantity = 1,
  disabled,
  label,
}: AddToCartButtonProps) {
  const [state, formAction, isPending] = useActionState(addToCartAction, initialState);
  const { updateFromAction, openCart, refreshCart } = useCart();
  const wasPending = useRef(false);

  useEffect(() => {
    if (state.success && variantId && productId) {
      trackAddedToCart({
        productId,
        title: productTitle,
        variantId,
        quantity,
        price: price ?? '0',
        currency: currency ?? 'USD',
      });
    }
  }, [state.success, state.message, productId, productTitle, variantId, price, currency, quantity]);

  useEffect(() => {
    if (wasPending.current && !isPending && state.success) {
      updateFromAction(state);
      void refreshCart();
      openCart();
    }
    wasPending.current = isPending;
  }, [isPending, state.success, state, updateFromAction, refreshCart, openCart]);

  const isPt = locale === 'pt';

  return (
    <div className="flex flex-col gap-2">
      <form action={formAction} className="w-full">
        <input type="hidden" name="variantId" value={variantId ?? ''} />
        <input type="hidden" name="quantity" value={quantity} />
        <input type="hidden" name="locale" value={locale} />
        <button
          id="product-add-to-cart"
          type="submit"
          disabled={disabled || !variantId || isPending}
          className="flex h-[52px] w-full items-center justify-center bg-neutral-800 px-6 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isPt ? 'A adicionar...' : 'Adding...'}
            </span>
          ) : (
            label ?? (isPt ? 'Adicionar ao carrinho' : 'Add to cart')
          )}
        </button>
      </form>
      {state.message && !state.success && (
        <p className="text-sm text-red-600" role="alert">{state.message}</p>
      )}
    </div>
  );
}
