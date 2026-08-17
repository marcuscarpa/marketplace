'use client';

import { useEffect, useMemo } from 'react';

interface MediaPrefetcherProps {
  videos?: readonly string[];
  images?: readonly string[];
}

const NEXT_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const;

/** Replicates the default next/image loader URL so prefetch hits the exact cached variant. */
function nextImageUrl(src: string, width: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

function schedulePrefetch(cb: () => void): void {
  if (typeof window === 'undefined') return;
  const run = () => {
    const requestIdle = (
      window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => void;
      }
    ).requestIdleCallback;
    if (requestIdle) {
      requestIdle(cb, { timeout: 4000 });
    } else {
      window.setTimeout(cb, 1500);
    }
  };
  if (document.readyState === 'complete') {
    run();
  } else {
    window.addEventListener('load', run, { once: true });
  }
}

/**
 * Warms the browser cache for below-the-fold media as soon as the page has
 * finished loading (idle time, low priority). By the time the user scrolls to
 * a section, its video/image is already downloaded.
 */
export function MediaPrefetcher({ videos = [], images = [] }: MediaPrefetcherProps) {
  const videoSrcs = useMemo(() => [...new Set(videos)], [videos]);
  const imageSrcs = useMemo(() => [...new Set(images)], [images]);

  useEffect(() => {
    schedulePrefetch(() => {
      // Videos: fetch into the HTTP cache so <video> playback is instant on scroll.
      for (const src of videoSrcs) {
        void fetch(src, { priority: 'low' } as RequestInit).catch(() => undefined);
      }

      // Images: warm the optimized next/image variant for the current viewport.
      const target = Math.ceil(window.innerWidth * (window.devicePixelRatio || 1));
      const width = NEXT_DEVICE_SIZES.find((size) => size >= target) ?? 3840;
      for (const src of imageSrcs) {
        const img = new Image();
        img.decoding = 'async';
        img.setAttribute('fetchpriority', 'low');
        img.src = nextImageUrl(src, width);
      }
    });
  }, [videoSrcs, imageSrcs]);

  return null;
}
