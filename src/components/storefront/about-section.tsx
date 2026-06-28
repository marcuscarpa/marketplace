'use client';

import Image from 'next/image';
import Link from 'next/link';

import { SITE_IMAGES } from '@/lib/catalog/data';
import { EntranceView } from '@/components/storefront/entrance-view';

interface AboutSectionProps {
  locale: string;
}

export function AboutSection({ locale }: AboutSectionProps) {
  return (
    <EntranceView stagger className="flex w-full flex-col overflow-hidden rounded-[6px]">
      <div
        data-entrance-step="1"
        className="mkt-image-reveal relative h-[513px] w-full md:h-[677px] min-[1440px]:h-[730px]"
      >
        <Image
          src={SITE_IMAGES.about}
          alt="Minimal black leather belt with gold buckle wrapped around beige draped fabric"
          fill
          priority={false}
          sizes="100vw"
          className="block h-full w-full object-cover object-center motion-safe:transition-[opacity,transform] motion-safe:duration-[680ms] motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]"
        />
      </div>

      <div data-entrance-step="2" className="flex flex-col gap-5 bg-white px-5 pt-8 min-[1440px]:gap-7 min-[1440px]:pt-10">
        <div className="flex max-w-lg flex-col gap-4">
          <h3 className="font-serif text-[32px] font-normal leading-none tracking-[-0.04em] text-ink min-[1440px]:text-[48px]">
            About us
          </h3>
          <p className="font-sans-ui text-base leading-normal text-ink/60">
            We design with care — balancing function, emotion, and beauty.
          </p>
        </div>

        <Link
          href={`/${locale}/about`}
          className="inline-flex w-min flex-col gap-1 font-sans-ui text-[12px] font-normal uppercase leading-[100%] tracking-[0.02em] text-ink no-underline transition-opacity hover:opacity-60"
        >
          Our story
          <span className="block h-px w-full bg-ink" aria-hidden />
        </Link>
      </div>
    </EntranceView>
  );
}
