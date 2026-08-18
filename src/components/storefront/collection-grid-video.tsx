'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { m } from '@/lib/i18n';

interface CollectionGridVideoProps {
  src: string;
  alt: string;
  locale: string;
  productHandle: string;
  posterImage: string;
}

export function CollectionGridVideo({
  src,
  alt,
  locale,
  productHandle,
  posterImage,
}: CollectionGridVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const messages = m(locale);
  const productHref = `/${locale}/products/${productHandle}`;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      if (motionQuery.matches) {
        video.pause();
        return;
      }
      void video.play().catch(() => undefined);
    };

    syncPlayback();
    motionQuery.addEventListener('change', syncPlayback);
    return () => motionQuery.removeEventListener('change', syncPlayback);
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="col-span-1 sm:col-span-2">
      <div className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900 lg:aspect-[8/5]">
        {shouldLoad ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label={alt}
            onPlaying={() => setVideoReady(true)}
            className={`absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover transition-[opacity,transform] duration-700 group-hover:scale-[1.03] motion-safe:duration-[520ms] ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : null}

        <Image
          src={posterImage}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-cover transition-opacity motion-safe:duration-700 ${
            videoReady ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25"
        />

        <p className="absolute left-4 top-4 z-10 font-serif text-[13px] leading-none tracking-[-0.01em] text-white sm:left-5 sm:top-5 sm:text-[15px]">
          {messages.nav.newCollections}
        </p>

        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 sm:gap-4 sm:p-5">
          <Link
            href={productHref}
            className="font-serif text-[clamp(1.5rem,7vw,2.75rem)] font-normal italic leading-none tracking-[-0.03em] text-white transition-opacity hover:opacity-85"
          >
            {messages.collection.buyNow}
          </Link>

          <Link
            href={productHref}
            aria-label={messages.collection.buyNow}
            className="mb-0.5 shrink-0 overflow-hidden border border-white/90 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform hover:scale-[1.02]"
          >
            <Image
              src={posterImage}
              alt=""
              width={70}
              height={94}
              className="block h-[70px] w-[53px] object-cover object-top sm:h-[94px] sm:w-[70px]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
