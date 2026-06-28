'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

import { BESTSELLERS, formatPrice } from '@/lib/catalog/data';
import { resolveCatalogProductTags } from '@/lib/product-tags';
import { ProductTags, PRODUCT_TAGS_OVERLAY_CLASS } from '@/components/ui/product-tags';
import { SECTION_PADDING, SectionHeading } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';

interface BestsellersProps {
  locale: string;
}

export function Bestsellers({ locale }: BestsellersProps) {
  const items = [...BESTSELLERS, ...BESTSELLERS];

  return (
    <EntranceView className={`bg-cream ${SECTION_PADDING}`}>
      <div className="mx-auto mb-10 flex max-w-[1440px] items-end justify-between">
        <SectionHeading>Our bestsellers</SectionHeading>
        <Link
          href={`/${locale}/collections/all`}
          className="text-[12px] uppercase tracking-[0.02em] text-ink font-sans-ui transition-opacity hover:opacity-60"
        >
          See all
        </Link>
      </div>

      <div className="overflow-x-clip">
        <motion.div
          className="mx-auto flex max-w-[1440px] cursor-grab gap-8 active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -800, right: 0 }}
          dragElastic={0.08}
        >
          {items.map((product, i) => (
            <Link
              key={`${product.handle}-${i}`}
              href={`/${locale}/products/${product.handle}`}
              className="group shrink-0"
            >
              <div className="relative h-56 w-56 overflow-hidden bg-white lg:h-72 lg:w-72">
                <ProductTags
                  tags={resolveCatalogProductTags(product)}
                  locale={locale}
                  className={PRODUCT_TAGS_OVERLAY_CLASS}
                />
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="288px"
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex justify-between gap-4 font-sans-ui text-[12px]">
                <div>
                  <p className="uppercase text-ink">{product.title}</p>
                  <p className="uppercase text-ink/60">{product.category}</p>
                </div>
                <p className="text-ink">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </EntranceView>
  );
}
