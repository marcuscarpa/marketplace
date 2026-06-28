'use client';

import Image from 'next/image';

import { SITE_IMAGES } from '@/lib/catalog/data';
import { SECTION_PADDING, Button } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';

const SOCIAL_IMAGES = [
  SITE_IMAGES.social1,
  SITE_IMAGES.social2,
  SITE_IMAGES.social3,
  SITE_IMAGES.social1,
  SITE_IMAGES.social2,
];

export function SocialFeed() {
  return (
    <EntranceView stagger className={`mx-auto max-w-[1440px] ${SECTION_PADDING}`}>
      <div
        data-entrance-step="1"
        className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <h6 className="font-serif text-2xl tracking-[-0.04em] text-ink">Follow us on socials</h6>
        <Button href="https://www.instagram.com/mesco/" variant="dark" className="self-start">
          Our Instagram
        </Button>
      </div>
      <div data-entrance-step="2" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {SOCIAL_IMAGES.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={src}
              alt=""
              fill
              sizes="20vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>
        ))}
      </div>
    </EntranceView>
  );
}
