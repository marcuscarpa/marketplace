'use client';

import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

import { ProductCard } from '@/components/ui/product-card';
import { LuxuryMetafields, ShopifyProduct } from '@/lib/shopify/types';
import {
  defaultSelectedOptions,
  findMatchingVariant,
  isColorOption,
} from '@/lib/shopify/variants';
import { formatPriceForLocale } from '@/lib/locale-currency';
import { isCatalogMockProduct } from '@/lib/shopify/catalog-mock';

import { AddToCartButton } from './add-to-cart-button';
import { ProductPriceExtras } from './product-price-extras';
import { getColorOption, ProductInfoTabs } from './product-info-tabs';
import { ProductTrustBadges } from './product-trust-badges';
import { ProductGallery } from './product-gallery';
import { ProductVariantPicker } from './product-variant-picker';
import { Video360Player } from './video-360-player';

interface RecommendationItem {
  id: string;
  title: string;
  handle: string;
  images: { nodes: Array<{ url: string; altText: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

interface EnrichedProduct extends ShopifyProduct {
  luxury: LuxuryMetafields;
}

interface ProductDetailsLuxuryProps {
  product: EnrichedProduct;
  locale: string;
  recommendations?: RecommendationItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function ProductDetailsLuxury({
  product,
  locale,
  recommendations = [],
}: ProductDetailsLuxuryProps) {
  const [mounted, setMounted] = useState(false);
  const { luxury } = product;
  const options = product.options ?? [];
  const variants = product.variants.nodes;
  const hasVideo = Boolean(luxury.video360Url);
  const colorOption = getColorOption(options);

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    defaultSelectedOptions(options)
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setSelected(defaultSelectedOptions(product.options ?? []));
  }, [product.id, product.options]);

  const selectedVariant = useMemo(
    () => findMatchingVariant(variants, selected),
    [variants, selected]
  );

  const galleryImages = useMemo(() => {
    const baseImages = product.images.nodes;
    const selectedColor = colorOption ? selected[colorOption.name] : undefined;

    if (selectedColor) {
      const colorVariantImages = variants
        .filter(
          (v) =>
            v.image?.url &&
            (v.selectedOptions ?? []).some(
              (opt) => isColorOption(opt.name) && opt.value === selectedColor
            )
        )
        .map((v) => v.image!)
        .filter((img, index, arr) => arr.findIndex((i) => i.url === img.url) === index);

      if (colorVariantImages.length > 0) {
        return colorVariantImages.map((img) => ({
          url: img.url,
          altText: img.altText,
        }));
      }
    }

    if (selectedVariant?.image?.url) {
      const variantImage = selectedVariant.image;
      const rest = baseImages.filter((img) => img.url !== variantImage.url);
      return [{ url: variantImage.url, altText: variantImage.altText }, ...rest];
    }

    return baseImages;
  }, [colorOption, product.images.nodes, selected, selectedVariant, variants]);

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelected((prev) => ({ ...prev, [optionName]: value }));
  };

  const price = selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount;
  const currency =
    selectedVariant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode;

  const isPt = locale === 'pt';
  const catalogOnly = isCatalogMockProduct(product);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate={mounted ? 'show' : 'hidden'}>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div variants={itemVariants} className="lg:sticky lg:top-24">
          <ProductGallery
            key={galleryImages.map((i) => i.url).join('|')}
            images={galleryImages}
            title={product.title}
            layoutId={`product-hero-${product.id}`}
          />
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-8">
          <motion.div variants={itemVariants} className="space-y-3 border-b border-neutral-200 pb-8">
            <h1 className="text-2xl font-normal uppercase tracking-[0.08em] text-neutral-900 md:text-3xl">
              {product.title}
            </h1>
            <p className="text-lg text-neutral-900">
              {formatPriceForLocale(parseFloat(price), locale)}
            </p>
            <ProductPriceExtras
              locale={locale}
              price={parseFloat(price)}
              shopPay={selectedVariant?.shopPayInstallmentsPricing}
            />
          </motion.div>

          {options.length > 0 && (
            <motion.div variants={itemVariants}>
              <ProductVariantPicker
                options={options}
                selected={selected}
                onSelect={handleOptionSelect}
                locale={locale}
              />
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="space-y-3">
            {selectedVariant && !catalogOnly && (
              <AddToCartButton
                variantId={selectedVariant.id}
                productId={product.id}
                productTitle={product.title}
                price={price}
                currency={currency}
                locale={locale}
                disabled={selectedVariant.availableForSale === false}
              />
            )}
            {catalogOnly && (
              <p className="text-sm text-neutral-600">
                {isPt
                  ? 'Este artigo não está disponível para compra online neste momento.'
                  : 'This item is not available for online purchase at the moment.'}
              </p>
            )}
            <ProductTrustBadges locale={locale} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ProductInfoTabs product={product} luxury={luxury} locale={locale} />
          </motion.div>
        </motion.div>
      </div>

      {hasVideo && luxury.video360Url && (
        <motion.div variants={itemVariants} className="mt-24 border-t border-neutral-100 pt-16">
          <h3 className="mb-10 text-center text-xl font-light uppercase tracking-widest text-neutral-800">
            {isPt ? 'Experiência 360°' : 'Interactive 360° Experience'}
          </h3>
          <Video360Player videoUrl={luxury.video360Url} productTitle={product.title} />
        </motion.div>
      )}

      {recommendations.length > 0 && (
        <motion.section variants={itemVariants} className="mt-24 border-t border-neutral-200 pt-16">
          <h2 className="mb-10 text-xs font-medium uppercase tracking-[0.2em] text-neutral-900">
            {isPt ? 'Produtos recomendados' : 'Recommended products'}
          </h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {recommendations.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} locale={locale} />
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
