'use client';

import { SITE_IMAGES } from '@/lib/catalog/data';
import { Button } from '@/components/storefront/ui';
import { useLayoutEffect, useState } from 'react';

interface HeroProps {
  locale: string;
}

const HERO_VIDEO = '/video-banner-hero.mp4';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function Hero({ locale }: HeroProps) {
  const [copyInView, setCopyInView] = useState(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      queueMicrotask(() => setCopyInView(true));
      return undefined;
    }
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setCopyInView(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <section className="relative flex h-[calc(100svh-5.25rem)] min-h-[560px] flex-col min-[768px]:min-h-[640px] min-[1440px]:h-[900px] min-[1440px]:min-h-0">
      <div className="absolute inset-0 overflow-hidden">
        <div className="mkt-hero-bg-zoom absolute inset-0 bg-cover bg-center bg-no-repeat">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${SITE_IMAGES.hero})` }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={SITE_IMAGES.hero}
              className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-[50%_38%] min-[768px]:object-[62%_42%] min-[1440px]:object-center motion-safe:transition-opacity motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]"
            >
              <source src={HERO_VIDEO} type="video/mp4" />
            </video>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
        />
      </div>

      <div className="relative z-10 mt-auto overflow-visible px-5 pb-6 min-[768px]:pb-10 min-[1440px]:pb-[100px]">
        <h1
          className={`hero-headline mkt-headline max-w-[1400px] font-serif font-normal overflow-visible${
            copyInView ? ' mkt-headline--in-view' : ''
          }`}
        >
          <span className="mkt-headline__line text-white">Timeless</span>
          <span className="mkt-headline__line text-white">Sophistication</span>
        </h1>
        <div
          className={`mkt-hero-editorial mt-6 max-w-[1400px] overflow-visible min-[768px]:mt-8 min-[1440px]:mt-10${
            copyInView ? ' mkt-hero-editorial--in-view' : ''
          }`}
        >
          <Button href={`/${locale}/collections/all`} variant="outline-white">
            Shop All
          </Button>
        </div>
      </div>
    </section>
  );
}
