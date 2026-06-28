'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { useWishlist } from '@/hooks/use-wishlist';
import { ProductTags, PRODUCT_TAGS_OVERLAY_CLASS } from '@/components/ui/product-tags';
import { formatPrice, type CatalogProduct } from '@/lib/catalog/data';
import { resolveCatalogProductTags, type ProductTagKey } from '@/lib/product-tags';

interface StoreProductCardProps {
  product: CatalogProduct;
  locale: string;
  index?: number;
  layout?: 'default' | 'compact';
  badges?: ProductTagKey[];
}

interface PopularCardProps {
  product: CatalogProduct;
  locale: string;
  badges?: ProductTagKey[];
  index?: number;
}

const ADD_TO_CART_BAR =
  'absolute inset-x-0 bottom-0 z-[5] flex h-12 translate-y-full items-center justify-center bg-cream px-6 pt-0.5 pb-0 font-sans-ui text-[12px] font-normal uppercase leading-[100%] tracking-[0.02em] text-ink no-underline opacity-0 transition duration-700 ease-in-out group-hover/image:translate-y-0 group-hover/image:opacity-100';

function HeartIcon({ filled = false, className = 'h-4 w-4' }: { filled?: boolean; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className} aria-hidden>
      <path
        d={
          filled
            ? 'M240,102c0,66-109,126-109,126S22,168,22,102A54,54,0,0,1,76,48c22.59,0,41.94,12.31,52,32,10.06-19.69,29.41-32,52-32A54,54,0,0,1,240,102Z'
            : 'M178,40c-20.65,0-38.73,8.59-50,23.79C116.73,48.59,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z'
        }
        className="fill-ink"
      />
    </svg>
  );
}

function FavoriteButton({ product }: { product: CatalogProduct }) {
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const saved = isInWishlist(product.handle);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (saved) {
          removeItem(product.handle);
        } else {
          addItem({
            id: product.handle,
            handle: product.handle,
            title: product.title,
            price: product.price,
            image: product.image,
          });
        }
      }}
      aria-label={saved ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={saved}
      className="flex shrink-0 items-center justify-center p-1 transition-opacity hover:opacity-60"
    >
      <HeartIcon filled={saved} />
    </button>
  );
}

/** Most-popular product card (mobile + desktop variants). */
export function PopularCard({ product, locale, badges, index = 0 }: PopularCardProps) {
  const href = `/${locale}/products/${product.handle}`;
  const price = formatPrice(product.price);
  const tags = badges ?? resolveCatalogProductTags(product);
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  useEffect(() => setMounted(true), []);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={mounted && inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex w-full flex-col gap-4"
    >
      <div className="absolute inset-x-0 top-0 z-10 flex h-12 justify-end p-2">
        <FavoriteButton product={product} />
      </div>

      <div className="group/image relative aspect-[171/221] w-full overflow-hidden bg-cream">
        {tags.length > 0 && (
          <ProductTags
            tags={tags}
            locale={locale}
            className={PRODUCT_TAGS_OVERLAY_CLASS}
          />
        )}
        <Link href={href} className="absolute inset-0 z-0 block">
          <figure
            className={`absolute inset-0 m-0 transition-opacity duration-300 ${
              product.hoverImage ? 'group-hover/image:opacity-0' : ''
            }`}
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 34vw, 339px"
              className="block h-full w-full object-cover object-center"
            />
          </figure>
          {product.hoverImage && (
            <figure className="absolute inset-0 m-0 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100">
              <Image
                src={product.hoverImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 34vw, 339px"
                className="block h-full w-full object-cover object-center"
                aria-hidden
              />
            </figure>
          )}
        </Link>
        <Link href={href} className={ADD_TO_CART_BAR}>
          Add to Cart
        </Link>
      </div>

      <Link href={href} className="flex flex-col gap-2 font-sans-ui no-underline">
        <div className="flex flex-col gap-1">
          <p className="text-[14px] font-normal uppercase leading-[100%] tracking-[0.02em] text-ink">
            {product.title}
          </p>
          <p className="text-[12px] font-normal uppercase leading-[100%] tracking-[0.02em] text-ink/60">
            {product.category}
          </p>
        </div>
        <p className="whitespace-nowrap text-[14px] font-medium leading-[100%] tracking-[0.02em] text-ink">
          {price}
        </p>
      </Link>
    </motion.article>
  );
}

export function StoreProductCard({
  product,
  locale,
  index = 0,
  layout = 'default',
  badges,
}: StoreProductCardProps) {
  const href = `/${locale}/products/${product.handle}`;
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const tags = badges ?? resolveCatalogProductTags(product);

  useEffect(() => setMounted(true), []);

  const imageClass =
    layout === 'compact'
      ? 'group/image relative aspect-[171/221] w-full overflow-hidden bg-cream'
      : 'relative aspect-square overflow-hidden bg-muted';

  const textBlock =
    layout === 'compact' ? (
      <Link href={href} className="mt-4 flex flex-col gap-1 font-sans-ui no-underline">
        <p className="text-[14px] font-normal uppercase leading-[100%] tracking-[0.02em] text-ink">
          {product.title}
        </p>
        <p className="text-[12px] font-normal uppercase leading-[100%] tracking-[0.02em] text-ink/60">
          {product.category}
        </p>
        <p className="text-[14px] font-medium leading-[100%] tracking-[0.02em] text-ink">
          {formatPrice(product.price)}
        </p>
      </Link>
    ) : null;

  const imageTags =
    tags.length > 0 ? (
      <ProductTags
        tags={tags}
        locale={locale}
        className={PRODUCT_TAGS_OVERLAY_CLASS}
      />
    ) : null;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={mounted && inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      {layout === 'compact' ? (
        <>
          <div className={imageClass}>
            {imageTags}
            <Link href={href} className="absolute inset-0 block no-underline">
              <figure
                className={`absolute inset-x-[16%] inset-y-[22%] m-0 transition-opacity duration-300 ${
                  product.hoverImage ? 'group-hover/image:opacity-0' : ''
                }`}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 809.98px) calc((100vw - 40px) * 0.68), 339px"
                  className="block h-full w-full object-cover object-center"
                />
              </figure>
              {product.hoverImage && (
                <figure className="absolute inset-0 m-0 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100">
                  <Image
                    src={product.hoverImage}
                    alt=""
                    fill
                    sizes="(max-width: 809.98px) calc(100vw - 40px), 339px"
                    className="block h-full w-full object-cover object-center"
                    aria-hidden
                  />
                </figure>
              )}
            </Link>
            <Link href={href} className={ADD_TO_CART_BAR}>
              Add to Cart
            </Link>
          </div>
          {textBlock}
        </>
      ) : (
        <Link href={href} className="block">
          <div className={imageClass}>
            {imageTags}
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <div className="mt-4 flex items-start justify-between gap-3 font-sans-ui text-[12px]">
            <div>
              <p className="uppercase text-ink">{product.title}</p>
              <p className="uppercase text-ink/60">{product.category}</p>
            </div>
            <p className="shrink-0 text-ink">{formatPrice(product.price)}</p>
          </div>
        </Link>
      )}
    </motion.article>
  );
}
