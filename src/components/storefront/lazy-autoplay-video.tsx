'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface LazyAutoplayVideoProps {
  src: string;
  /** Native poster URL — skipped when `posterSlot` is provided. */
  poster?: string;
  /** Optimized poster (e.g. next/image) shown until the video plays. */
  posterSlot?: ReactNode;
  className?: string;
  videoClassName?: string;
  ariaLabel?: string;
  /** Above-the-fold: defer one frame, then load (poster wins LCP bandwidth). */
  eager?: boolean;
  rootMargin?: string;
}

export function LazyAutoplayVideo({
  src,
  poster,
  posterSlot,
  className = 'absolute inset-0 overflow-hidden',
  videoClassName = 'absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover',
  ariaLabel,
  eager = false,
  rootMargin = '1000px 0px',
}: LazyAutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    if (eager) {
      const id = window.requestAnimationFrame(() => setShouldLoad(true));
      return () => window.cancelAnimationFrame(id);
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eager, rootMargin]);

  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    video.src = src;
    video.load();

    const onCanPlay = () => {
      void video.play().catch(() => {});
    };
    const onPlaying = () => setVideoReady(true);

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('playing', onPlaying);
    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('playing', onPlaying);
    };
  }, [shouldLoad, src]);

  const showPoster = Boolean(posterSlot || poster);

  return (
    <div ref={containerRef} className={className}>
      {showPoster && (
        <div
          aria-hidden
          className={`absolute inset-0 transition-opacity motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)] ${
            videoReady ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {posterSlot ??
            (poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" className="h-full w-full object-cover" />
            ) : null)}
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-label={ariaLabel}
        className={`${videoClassName} motion-safe:transition-opacity motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)] ${
          videoReady || !showPoster ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
