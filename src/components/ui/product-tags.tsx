import { getProductTagLabel } from '@/lib/product-tag-copy';
import type { ProductTagKey } from '@/lib/product-tags';

interface ProductTagsProps {
  tags: ProductTagKey[];
  locale: string;
  className?: string;
}

/** Overlay position for tags on product card images. */
export const PRODUCT_TAGS_OVERLAY_CLASS = 'absolute left-0 top-0 z-10 p-3';

/** Product-card tag pills — white bg, 1px border, 12px uppercase label. */
export function ProductTags({ tags, locale, className = '' }: ProductTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div
      className={`pointer-events-none flex flex-row flex-wrap items-center justify-start gap-1 ${className}`}
      aria-label="Product tags"
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="border border-[var(--btn-ink-8)] bg-white px-1.5 py-1 font-sans-ui text-[12px] font-normal uppercase leading-none tracking-[0.02em] text-ink"
        >
          {getProductTagLabel(locale, tag)}
        </span>
      ))}
    </div>
  );
}
