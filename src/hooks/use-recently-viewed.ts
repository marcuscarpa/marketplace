'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'recently_viewed';

export interface RecentlyViewedItem {
  productId: string;
  handle: string;
  title: string;
  imageUrl?: string;
  price: string;
  viewedAt: string;
}

const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every((item) => item && typeof item.productId === 'string' && typeof item.handle === 'string')) {
          setItems(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      setItems([]);
    }
  }, []);

  const addItem = (item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.productId !== item.productId);
      return [
        { ...item, viewedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_ITEMS);
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable
    }
  }, [items]);

  const clearItems = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
  };

  return { items, addItem, clearItems };
}