'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

import { CartActionState } from '@/actions/cart';
import type { CartLineItem } from '@/lib/cart/display';

interface CartCost {
  totalAmount: { amount: string; currencyCode: string };
  subtotalAmount: { amount: string; currencyCode: string };
  totalTaxAmount: { amount: string; currencyCode: string } | null;
}

export interface CartState {
  id: string | null;
  totalQuantity: number;
  checkoutUrl: string | null;
  cost: CartCost | null;
  lines: CartLineItem[];
}

interface CartContextType {
  cart: CartState;
  isLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  updateFromAction: (state: CartActionState) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const EMPTY_CART: CartState = {
  id: null,
  totalQuantity: 0,
  checkoutUrl: null,
  cost: null,
  lines: [],
};

function mapActionCart(cart: NonNullable<CartActionState['cart']>): CartState {
  return {
    id: cart.id,
    totalQuantity: cart.totalQuantity,
    checkoutUrl: cart.checkoutUrl ?? null,
    cost: cart.cost ?? null,
    lines: cart.lines ?? [],
  };
}

export function CartProvider({ locale, children }: { locale: string; children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(EMPTY_CART);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/${locale}/api/cart`);
      if (response.ok) {
        setCart((await response.json()) as CartState);
      } else {
        setError('Failed to load cart');
      }
    } catch {
      setError('Network error loading cart');
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  const updateFromAction = useCallback((state: CartActionState) => {
    if (state.success && state.cart) {
      setCart(mapActionCart(state.cart));
    }
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        refreshCart,
        updateFromAction,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
