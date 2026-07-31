'use client';

import { useEffect, useRef } from 'react';

export function useInfiniteScroll(onLoadMore: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore();
        }
      },
      { rootMargin: '320px 0px' }
    );

    observer.observe(node);

    // IntersectionObserver only fires on crossing; if the sentinel stays in view
    // after a load finishes, the next page would never trigger without this check.
    const rootMarginY = 320;
    const rect = node.getBoundingClientRect();
    if (rect.top <= window.innerHeight + rootMarginY) {
      onLoadMore();
    }

    return () => observer.disconnect();
  }, [enabled, onLoadMore]);

  return sentinelRef;
}
