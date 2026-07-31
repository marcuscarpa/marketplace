'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import type { CategoryCyclerItem } from '@/lib/catalog/data';
import { collectionPath } from '@/lib/catalog/collection-handles';
import { PRODUCT_IMAGE_HOVER_NESTED, SECTION_PADDING } from '@/components/storefront/ui';
import { EntranceView } from '@/components/storefront/entrance-view';

interface ProductCyclerProps {
  locale: string;
  categories: CategoryCyclerItem[];
}

export function ProductCycler({ locale, categories }: ProductCyclerProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <EntranceView className={`mx-auto w-full max-w-[1310px] ${SECTION_PADDING} lg:px-[50px]`}>
      <div className="mx-auto max-w-[1155px] overflow-hidden">
        <ol
          className="flex list-none flex-col gap-6 p-0 lg:flex-row lg:gap-2 min-[1440px]:gap-3"
          onMouseLeave={() => setHovered(null)}
        >
          {categories.map((category, index) => {
            const dimmed = hovered !== null && hovered !== index;
            const isHovered = hovered === index;
            const href = `/${locale}/${collectionPath(category.collectionHandle)}`;

            return (
              <li
                key={category.collectionHandle}
                className="min-w-0 w-full lg:flex-1"
                onMouseEnter={() => setHovered(index)}
              >
                <article className="flex flex-col">
                  <Link
                    href={href}
                    className="group/image relative block aspect-[581/755] w-full overflow-hidden bg-white no-underline"
                  >
                    <div className={`absolute inset-0 ${PRODUCT_IMAGE_HOVER_NESTED}`}>
                      <figure
                        className={`absolute inset-0 m-0 transition-[opacity,filter,transform] duration-500 ease-out ${
                          category.hoverImage ? 'group-hover/image:opacity-0' : ''
                        } ${
                          dimmed
                            ? 'scale-[0.98] opacity-40 blur-[0.5px]'
                            : isHovered
                              ? 'scale-105 opacity-100'
                              : 'opacity-100'
                        }`}
                      >
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 365px"
                          className="block h-full w-full object-contain object-center"
                        />
                      </figure>
                      {category.hoverImage && (
                        <figure
                          className={`absolute inset-0 m-0 opacity-0 transition-[opacity,filter,transform] duration-500 ease-out group-hover/image:opacity-100 ${
                            dimmed ? 'scale-[0.98] blur-[0.5px]' : isHovered ? 'scale-105' : ''
                          }`}
                        >
                          <Image
                            src={category.hoverImage}
                            alt=""
                            fill
                            sizes="(max-width: 1024px) 100vw, 365px"
                            className="block h-full w-full object-contain object-center"
                            aria-hidden
                          />
                        </figure>
                      )}
                    </div>
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/25 to-white transition-opacity duration-700 ease-out ${
                        dimmed ? 'opacity-100' : 'opacity-0'
                      }`}
                      aria-hidden
                    />
                  </Link>
                  <div className="pt-3 text-center">
                    <Link
                      href={href}
                      className={`font-sans-ui text-[14px] font-normal uppercase leading-[100%] tracking-[0.02em] text-ink no-underline transition-opacity duration-700 hover:opacity-60 ${
                        dimmed ? 'opacity-40' : 'opacity-100'
                      }`}
                    >
                      {category.title}
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
