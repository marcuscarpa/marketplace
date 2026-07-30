'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { getWishlistItems, hydrateGuestWishlistItems, toggleWishlist } from '@/actions/wishlist';
import { normalizeWishlistItems } from '@/lib/catalog/wishlist-seed';
import { useAuth } from '@/hooks/use-auth';
import { type WishlistStoredItem } from '@/lib/catalog/wishlist-seed';
import { clearGuestWishlist, readGuestWishlist, writeGuestWishlist } from '@/lib/wishlist/guest-storage';

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const mergedGuestRef = useRef(false);

  const refreshServer = useCallback(async () => {
    try {
      const loaded = await getWishlistItems(locale);
      setItems(loaded);
    } catch {
      setItems(EMPTY_WISHLIST);
    } finally {
      setHydrated(true);
    }
  }, [locale]);

  const refreshGuest = useCallback(async () => {
    const stored = readGuestWishlist();
    const normalized = normalizeWishlistItems(stored);
    const needsShopify = normalized.some((item) => !item.image);

    try {
      const hydrated = needsShopify
        ? await hydrateGuestWishlistItems(normalized, locale)
        : normalized;

      if (hydrated.length !== stored.length || JSON.stringify(hydrated) !== JSON.stringify(stored)) {
        writeGuestWishlist(hydrated);
      }
      setItems(hydrated);
    } catch {
      if (normalized.length !== stored.length || JSON.stringify(normalized) !== JSON.stringify(stored)) {
        writeGuestWishlist(normalized);
      }
      setItems(normalized);
    } finally {
      setHydrated(true);
    }
  }, [locale]);

  const syncToggle = useCallback(
    async (productId: string) => {
      const formData = new FormData();
      formData.set('productId', productId);
      formData.set('locale', locale);
      const result = await toggleWishlist({ success: false, message: '' }, formData);
      if (result.success) {
        const loaded = await getWishlistItems(locale);
        setItems(loaded);
        return true;
      }
      return false;
    },
    [locale]
  );

  useEffect(() => {
    void refreshGuest();
  }, [refreshGuest]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      mergedGuestRef.current = false;
      return;
    }

    void refreshServer();
  }, [authLoading, isAuthenticated, refreshServer]);

  useEffect(() => {
    if (authLoading || !isAuthenticated || mergedGuestRef.current) return;

    const guestItems = readGuestWishlist();
    if (guestItems.length === 0) {
      mergedGuestRef.current = true;
      return;
    }

    mergedGuestRef.current = true;
    void (async () => {
      for (const item of guestItems) {
        await syncToggle(item.handle);
      }
      clearGuestWishlist();
      await refreshServer();
    })();
  }, [authLoading, isAuthenticated, refreshServer, syncToggle]);

  const addItem = useCallback(
    (item: WishlistStoredItem) => {
      if (items.some((i) => i.id === item.id || i.handle === item.handle)) return;

      if (!isAuthenticated) {
        setItems((prev) => {
          const next = [...prev, item];
          writeGuestWishlist(next);
          return next;
        });
        return;
      }

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
      if (!items.some((i) => i.id === id || i.handle === id)) return;

      if (!isAuthenticated) {
        setItems((prev) => {
          const next = prev.filter((i) => i.id !== id && i.handle !== id);
          writeGuestWishlist(next);
          return next;
        });
        return;
      }

      setItems((prev) => prev.filter((i) => i.id !== id && i.handle !== id));
      void syncToggle(id).then((ok) => {
        if (!ok) void refreshServer();
      });
    },
    [isAuthenticated, items, refreshServer, syncToggle]
  );

  const isInWishlist = useCallback(
    (id: string) => items.some((i) => i.id === id || i.handle === id),
    [items]
  );

  const clearWishlist = useCallback(() => {
    const snapshot = [...items];
    setItems(EMPTY_WISHLIST);
    if (!isAuthenticated) {
      clearGuestWishlist();
      return;
    }
    void (async () => {
      for (const item of snapshot) {
        await syncToggle(item.handle);
      }
    })();
  }, [isAuthenticated, items, syncToggle]);

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
