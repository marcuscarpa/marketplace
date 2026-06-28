'use client';

import Image from 'next/image';

import { SITE_IMAGES, instagramHref } from '@/lib/catalog/data';
import { SECTION_PADDING, Button } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';
import { m } from '@/lib/i18n';

const SOCIAL_IMAGES = [
  SITE_IMAGES.social1,
  SITE_IMAGES.social2,
  SITE_IMAGES.social3,
  SITE_IMAGES.social4,
  SITE_IMAGES.social5,
];

function SocialSlide({ src }: { src: string }) {
  return (
    <div className="relative aspect-square w-[72vw] shrink-0 overflow-hidden bg-muted sm:w-[44vw] lg:w-[264px]">
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 264px"
        className="object-cover"
      />
    </div>
  );
}

interface SocialFeedProps {
  locale: string;
}

export function SocialFeed({ locale }: SocialFeedProps) {
  const h = m(locale).home;

  return (
    <EntranceView stagger className={SECTION_PADDING}>
      <div
        data-entrance-step="1"
        className="mx-auto mb-6 flex max-w-[1440px] flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
      >
        <h6 className="font-serif text-2xl tracking-[-0.04em] text-ink">{h.socialTitle}</h6>
        <Button href={instagramHref(locale)} variant="dark" className="self-start" newTab>
          {h.ourInstagram}
        </Button>
      </div>
      <div
        data-entrance-step="2"
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
      >
        <div className="social-marquee-track">
          {[0, 1].map((pass) => (
            <div
              key={pass}
              className="flex shrink-0 gap-3 lg:gap-4"
              aria-hidden={pass === 1 ? true : undefined}
            >
              {SOCIAL_IMAGES.map((src, i) => (
                <SocialSlide key={i} src={src} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </EntranceView>
  );
}
