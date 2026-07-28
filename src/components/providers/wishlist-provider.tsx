'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { getWishlistItems, toggleWishlist } from '@/actions/wishlist';
import { useAuth } from '@/hooks/use-auth';
import { type WishlistStoredItem } from '@/lib/catalog/wishlist-seed';

interface WishlistContextType {
  items: WishlistStoredItem[];
  addItem: (item: WishlistStoredItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  hydrated: boolean;
  requiresAuth: boolean;
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
  const [requiresAuth, setRequiresAuth] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems(EMPTY_WISHLIST);
      setRequiresAuth(true);
      setHydrated(true);
      return;
    }

    try {
      const loaded = await getWishlistItems(locale);
      setItems(loaded);
      setRequiresAuth(false);
    } catch {
      setItems(EMPTY_WISHLIST);
    } finally {
      setHydrated(true);
    }
  }, [isAuthenticated, locale]);

  useEffect(() => {
    if (authLoading) return;
    setHydrated(false);
    void refresh();
  }, [authLoading, refresh]);

  const syncToggle = useCallback(
    async (productId: string) => {
      const formData = new FormData();
      formData.set('productId', productId);
      formData.set('locale', locale);
      const result = await toggleWishlist({ success: false, message: '' }, formData);
      if (result.requiresAuth) {
        setRequiresAuth(true);
        setItems(EMPTY_WISHLIST);
        return false;
      }
      if (result.success) {
        const loaded = await getWishlistItems(locale);
        setItems(loaded);
        return true;
      }
      return false;
    },
    [locale]
  );

  const addItem = useCallback(
    (item: WishlistStoredItem) => {
      if (!isAuthenticated || items.some((i) => i.id === item.id || i.handle === item.handle)) return;
      setItems((prev) => [...prev, item]);
      void syncToggle(item.handle).then((ok) => {
        if (!ok) {
          setItems((prev) => prev.filter((i) => i.handle !== item.handle));
        }
      });
    },
    [isAuthenticated, items, syncToggle]
  );

  const removeItem = useCallback(
    (id: string) => {
      if (!isAuthenticated || !items.some((i) => i.id === id || i.handle === id)) return;
      setItems((prev) => prev.filter((i) => i.id !== id && i.handle !== id));
      void syncToggle(id).then((ok) => {
        if (!ok) void refresh();
      });
    },
    [isAuthenticated, items, refresh, syncToggle]
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
      value={{ items, addItem, removeItem, isInWishlist, clearWishlist, hydrated, requiresAuth }}
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
