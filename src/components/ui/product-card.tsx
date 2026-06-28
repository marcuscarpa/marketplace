'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ProductTags, PRODUCT_TAGS_OVERLAY_CLASS } from '@/components/ui/product-tags';
import { ProductCardProps } from '@/components/ui/types';
import { resolveShopifyProductTags } from '@/lib/product-tags';

export function ProductCard({ product, locale }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const price = product.priceRange?.minVariantPrice;
  const image = product.images?.nodes?.[0];
  const hoverImage = product.images?.nodes?.[1];
  const tags = product.badges ?? resolveShopifyProductTags(product);
  const href = `/${locale}/products/${product.handle}`;

  useEffect(() => setMounted(true), []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50 group/image">
        {tags.length > 0 && (
          <ProductTags
            tags={tags}
            locale={locale}
            className={PRODUCT_TAGS_OVERLAY_CLASS}
          />
        )}
        <Link href={href} className="absolute inset-0 block">
          <div className="absolute inset-0 transition-transform duration-500 group-hover/image:scale-105">
            {image && (
              <figure
                className={`absolute inset-0 m-0 ${
                  hoverImage ? 'transition-opacity duration-300 group-hover/image:opacity-0' : ''
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.altText || product.title}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </figure>
            )}
            {hoverImage && (
              <figure className="absolute inset-0 m-0 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100">
                <Image
                  src={hoverImage.url}
                  alt={hoverImage.altText || ''}
                  fill
                  className="object-cover"
                  loading="lazy"
                  aria-hidden={!hoverImage.altText}
                />
              </figure>
            )}
          </div>
        </Link>
        {!hoverImage && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
        {product.vendor && (
          <p className="text-sm text-gray-500 mb-2">{product.vendor}</p>
        )}
        {price && (
          <p className="text-xl font-semibold text-gray-900 mt-auto">
            {new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
              style: 'currency',
              currency: price.currencyCode ?? (locale === 'pt' ? 'BRL' : 'USD'),
            }).format(Number(price.amount))}
          </p>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-all duration-300">
        <Link
          href={href}
          className="w-full px-4 py-2 bg-black text-white text-sm font-medium rounded-lg text-center hover:bg-gray-900 transition-colors"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
}
