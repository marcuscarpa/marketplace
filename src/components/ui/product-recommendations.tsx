'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ProductCard } from '@/components/ui/product-card';

interface ProductRecommendationsProps {
  productId: string;
  locale: string;
}

interface RecommendationProduct {
  id: string;
  title: string;
  handle: string;
  images: { nodes: Array<{ url: string; altText: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

export function ProductRecommendations({ productId, locale }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `/api/recommendations?productId=${encodeURIComponent(productId)}&locale=${locale}`
        );
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.results ?? []);
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRecommendations();
  }, [productId, locale]);

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
          <span className="text-gray-500">Loading recommendations...</span>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const isPt = locale === 'pt';

  return (
    <section className="py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-8">
          {isPt ? 'Você Também Pode Gostar' : 'You May Also Like'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}