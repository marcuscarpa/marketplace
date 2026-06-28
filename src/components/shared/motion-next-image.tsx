'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';


interface MotionNextImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export function MotionNextImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
}: MotionNextImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center"
          >
            <motion.div
              className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
        {!hasError && (
          <Image
            key="image"
            src={src}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            sizes={sizes}
            priority={priority}
            className={`duration-500 ease-out ${
              isLoading ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
          />
        )}
        {hasError && (
          <div key="error" className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            Failed to load image
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}