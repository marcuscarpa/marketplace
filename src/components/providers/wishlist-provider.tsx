'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { getWishlistItems, toggleWishlist } from '@/actions/wishlist';
import { type WishlistStoredItem } from '@/lib/catalog/wishlist-seed';

interface WishlistContextType {
  items: WishlistStoredItem[];
  addItem: (item: WishlistStoredItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  hydrated: boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const EMPTY_WISHLIST: WishlistStoredItem[] = [];

export function WishlistProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const [items, setItems] = useState<WishlistStoredItem[]>(EMPTY_WISHLIST);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const loaded = await getWishlistItems(locale);
      setItems(loaded);
    } catch {
      setItems(EMPTY_WISHLIST);
    } finally {
      setHydrated(true);
    }
  }, [locale]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const syncToggle = useCallback(
    async (productId: string) => {
      const formData = new FormData();
      formData.set('productId', productId);
      formData.set('locale', locale);
      const result = await toggleWishlist({ success: false, message: '' }, formData);
      if (result.success) {
        const loaded = await getWishlistItems(locale);
        setItems(loaded);
      }
    },
    [locale]
  );

  const addItem = useCallback(
    (item: WishlistStoredItem) => {
      if (items.some((i) => i.id === item.id || i.handle === item.handle)) return;
      setItems((prev) => [...prev, item]);
      void syncToggle(item.handle);
    },
    [items, syncToggle]
  );

  const removeItem = useCallback(
    (id: string) => {
      if (!items.some((i) => i.id === id || i.handle === id)) return;
      setItems((prev) => prev.filter((i) => i.id !== id && i.handle !== id));
      void syncToggle(id);
    },
    [items, syncToggle]
  );

  const isInWishlist = useCallback(
    (id: string) => items.some((i) => i.id === id || i.handle === id),
    [items]
  );

  const clearWishlist = useCallback(() => {
    const snapshot = [...items];
    setItems(EMPTY_WISHLIST);
    void (async () => {
      for (const item of snapshot) {
        await syncToggle(item.handle);
      }
    })();
  }, [items, syncToggle]);

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, isInWishlist, clearWishlist, hydrated }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
