'use client';

import Image from 'next/image';

import { SITE_IMAGES } from '@/lib/catalog/data';
import { Button, SectionHeading } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';

interface OurValuesProps {
  collectionHref: string;
}

export function OurValues({ collectionHref }: OurValuesProps) {
  return (
    <EntranceView stagger className="relative h-[900px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={SITE_IMAGES.values}
          alt="Woman in elegant beachwear against a natural backdrop"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-5 pb-16 pt-32">
        <div className="max-w-xl">
          <div data-entrance-step="1">
            <SectionHeading light className="mb-5">
              The Haute Couture of Beachwear
            </SectionHeading>
          </div>
          <p
            data-entrance-step="2"
            className="mb-8 max-w-md font-sans-ui text-base leading-relaxed text-white/90"
          >
            Exclusive collections crafted to drape the silhouette with unparalleled elegance,
            fluidity, and sophistication.
          </p>
          <div data-entrance-step="3">
            <Button href={collectionHref} variant="outline-white">
              Explore the collection
            </Button>
          </div>
        </div>
      </div>
    </EntranceView>
  );
}
