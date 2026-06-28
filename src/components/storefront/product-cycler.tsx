'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { CYCLER_PRODUCTS } from '@/lib/catalog/data';
import { EntranceView } from '@/components/storefront/entrance-view';

interface ProductCyclerProps {
  locale: string;
}

export function ProductCycler({ locale }: ProductCyclerProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <EntranceView className="mx-auto w-full max-w-[1310px] px-5 lg:px-[50px]">
      <div className="mx-auto mb-[82px] max-w-[1155px] overflow-hidden pt-[41px]">
        <ol
          className="flex list-none flex-row gap-2 p-0 min-[1440px]:gap-3"
          onMouseLeave={() => setHovered(null)}
        >
          {CYCLER_PRODUCTS.map((product, index) => {
            const dimmed = hovered !== null && hovered !== index;

            return (
              <li
                key={product.handle}
                className="min-w-0 flex-1"
                onMouseEnter={() => setHovered(index)}
              >
                <article className="flex flex-col">
                  <Link
                    href={`/${locale}/products/${product.handle}`}
                    className="group/image relative block aspect-[581/755] w-full overflow-hidden bg-white no-underline"
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 33vw, 365px"
                      className={`block h-full w-full object-contain object-center transition-[opacity,filter,transform] duration-700 ease-out ${
                        dimmed ? 'scale-[0.98] opacity-40 blur-[0.5px]' : 'opacity-100'
                      }`}
                    />
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/25 to-white transition-opacity duration-700 ease-out ${
                        dimmed ? 'opacity-100' : 'opacity-0'
                      }`}
                      aria-hidden
                    />
                  </Link>
                  <div className="pt-3 text-center">
                    <Link
                      href={`/${locale}/products/${product.handle}`}
                      className={`font-sans-ui text-[14px] font-normal uppercase leading-[100%] tracking-[0.02em] text-ink no-underline transition-opacity duration-700 hover:opacity-60 ${
                        dimmed ? 'opacity-40' : 'opacity-100'
                      }`}
                    >
                      {product.title}
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </EntranceView>
  );
}
