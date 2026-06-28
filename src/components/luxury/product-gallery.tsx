'use client';

import { useState } from 'react';

import { MotionNextImage } from '@/components/shared/motion-next-image';

interface ProductGalleryProps {
  images: Array<{ url: string; altText: string | null }>;
  title: string;
  layoutId?: string;
}

export function ProductGallery({ images, title, layoutId }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeImages = images.length > 0 ? images : [];
  const active = safeImages[activeIndex] ?? safeImages[0];

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div
        {...(layoutId ? { 'data-layout-id': layoutId } : {})}
        className="aspect-[4/5] overflow-hidden bg-neutral-50"
      >
        <MotionNextImage
          src={active.url}
          alt={active.altText ?? title}
          width={1000}
          height={1250}
          priority
          className="h-full w-full object-cover object-center"
        />
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${title} — image ${index + 1}`}
                aria-pressed={isActive}
                className={`relative h-20 w-16 shrink-0 overflow-hidden border transition-colors ${
                  isActive ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <MotionNextImage
                  src={image.url}
                  alt={image.altText ?? `${title} thumbnail ${index + 1}`}
                  width={64}
                  height={80}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
