'use client';

import Image from 'next/image';

import { SITE_IMAGES } from '@/lib/catalog/data';
import { EntranceView } from '@/components/storefront/entrance-view';

export function AboutSection() {
  return (
    <EntranceView className="flex w-full flex-col overflow-hidden rounded-[6px]">
      <div className="mkt-image-reveal relative h-[513px] w-full md:h-[677px] min-[1440px]:h-[730px]">
        <Image
          src={SITE_IMAGES.about}
          alt="Minimal black leather belt with gold buckle wrapped around beige draped fabric"
          fill
          priority={false}
          sizes="100vw"
          className="block h-full w-full object-cover object-center motion-safe:transition-[opacity,transform] motion-safe:duration-[680ms] motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]"
        />
      </div>
    </EntranceView>
  );
}
