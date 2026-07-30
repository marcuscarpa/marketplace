'use client';

import { useEffect, useRef } from 'react';

interface CollectionGridVideoProps {
  src: string;
  alt: string;
}

export function CollectionGridVideo({ src, alt }: CollectionGridVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-50 sm:aspect-[16/10] lg:aspect-[8/5]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
