'use client';

import { useEffect, useMemo } from 'react';

export interface MediaPrefetchVideoGroup {
  /** `id` of the section element — videos only prefetch once the section nears the viewport. */
  anchorId: string;
  videos: readonly string[];
}

interface MediaPrefetcherProps {
  /** Below-the-fold images, warmed in small low-priority batches. */
  images?: readonly string[];
  /** Videos grouped by section, fetched only as the user scrolls toward them. */
  videoGroups?: readonly MediaPrefetchVideoGroup[];
}

const NEXT_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const;

/** Keep the connection idle-friendly: 3 images in flight at most. */
const IMAGE_BATCH_SIZE = 3;
/** ~2 viewports ahead — enough to mask latency, small enough not to waste bandwidth. */
const VIDEO_PROXIMITY_MARGIN = '2400px 0px';

/** Replicates the default next/image loader URL so prefetch hits the exact cached variant. */
function nextImageUrl(src: string, width: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

function requestIdle(cb: () => void, timeout = 3000): void {
  const idle = (
    window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => void;
    }
  ).requestIdleCallback;
  if (idle) {
    idle(cb, { timeout });
  } else {
    window.setTimeout(cb, 250);
  }
}

/** Runs after the critical path (LCP) has had a chance to use the network. */
function afterFirstPaint(cb: () => void): void {
  if (typeof window === 'undefined') return;
  if (document.readyState === 'complete') {
    requestIdle(cb);
  } else {
    window.addEventListener('load', () => requestIdle(cb), { once: true });
  }
}

/**
 * Warms the browser cache for below-the-fold media without starving the
 * critical path:
 * - Images are fetched in small batches (3 at a time) during idle time.
 * - Videos are only fetched once their section is ~2 viewports away — the
 *   scroll-proximity pattern used by large sites instead of bulk prefetch.
 */
export function MediaPrefetcher({ images = [], videoGroups = [] }: MediaPrefetcherProps) {
  const imageSrcs = useMemo(() => [...new Set(images)], [images]);
  const groups = useMemo(
    () => videoGroups.map((group) => ({ ...group, videos: [...new Set(group.videos)] })),
    [videoGroups],
  );

  useEffect(() => {
    if (imageSrcs.length > 0) {
      afterFirstPaint(() => {
        const target = Math.ceil(window.innerWidth * (window.devicePixelRatio || 1));
        const width = NEXT_DEVICE_SIZES.find((size) => size >= target) ?? 3840;
        const urls = imageSrcs.map((src) => nextImageUrl(src, width));

        let index = 0;
        const warmBatch = () => {
          for (const src of urls.slice(index, index + IMAGE_BATCH_SIZE)) {
            const img = new Image();
            img.decoding = 'async';
            img.setAttribute('fetchpriority', 'low');
            img.src = src;
          }
          index += IMAGE_BATCH_SIZE;
          if (index < urls.length) requestIdle(warmBatch);
        };
        warmBatch();
      });
    }

    if (groups.length === 0) return undefined;
    const targets = groups
      .map((group) => document.getElementById(group.anchorId))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const group = groups.find((item) => item.anchorId === entry.target.id);
          if (!group) continue;

          let videoIndex = 0;
          const fetchNext = () => {
            if (videoIndex >= group.videos.length) return;
            void fetch(group.videos[videoIndex]!, { priority: 'low' } as RequestInit).catch(
              () => undefined,
            );
            videoIndex += 1;
            requestIdle(fetchNext, 1500);
          };
          fetchNext();

          observer.unobserve(entry.target);
        }
      },
      { rootMargin: VIDEO_PROXIMITY_MARGIN },
    );
    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [imageSrcs, groups]);

  return null;
}
