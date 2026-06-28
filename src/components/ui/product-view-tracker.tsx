'use client';

import { useEffect } from 'react';

import { trackViewedProduct } from '@/lib/analytics';

interface ProductViewTrackerProps {
  product: {
    id: string;
    title: string;
    handle: string;
    price: string;
    currency: string;
    image?: string;
  };
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  useEffect(() => {
    trackViewedProduct(product);
  }, [product.id, product.handle]);

  return null;
}
