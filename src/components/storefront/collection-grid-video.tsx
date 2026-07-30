'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const messages = m(locale);
  const productHref = `/${locale}/products/${productHandle}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
  }, []);

  return (
    <div className="col-span-1 sm:col-span-2">
      <div className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-50 sm:aspect-[16/10] lg:aspect-[8/5]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        >
          <source src={src} type="video/mp4" />
        </video>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/20"
        />

        <p className="absolute left-4 top-4 z-10 font-serif text-[13px] leading-none tracking-[-0.01em] text-white sm:left-5 sm:top-5 sm:text-[15px]">
          {messages.nav.newCollections}
        </p>

        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-5">
          <Link
            href={productHref}
            className="font-serif text-[clamp(1.75rem,4.5vw,2.75rem)] font-normal italic leading-none tracking-[-0.03em] text-white transition-opacity hover:opacity-85"
          >
            {messages.collection.buyNow}
          </Link>

          <Link
            href={productHref}
            aria-label={messages.collection.buyNow}
            className="shrink-0 overflow-hidden border border-white/90 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform hover:scale-[1.02]"
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
