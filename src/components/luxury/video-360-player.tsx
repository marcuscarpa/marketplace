'use client';

import { useState } from 'react';

interface Video360PlayerProps {
  videoUrl?: string;
  productTitle: string;
}

export function Video360Player({ videoUrl, productTitle }: Video360PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoUrl || !videoUrl.startsWith('https://')) return null;

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
      {isPlaying ? (
        <iframe
          src={videoUrl}
          title={`${productTitle} 360° View`}
          className="h-full w-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setIsPlaying(true)}
          className="flex h-full w-full items-center justify-center"
          aria-label="Play 360° video"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/10 backdrop-blur-sm">
            <svg className="h-8 w-8 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
