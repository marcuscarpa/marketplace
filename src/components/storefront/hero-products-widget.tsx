'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import type { CatalogProduct } from '@/lib/catalog/data';

interface HeroProductsWidgetProps {
  locale: string;
  products: CatalogProduct[];
}

export function HeroProductsWidget({ locale, products }: HeroProductsWidgetProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const maybeRoot = rootRef.current;
    if (!maybeRoot || maybeRoot.dataset.heroInited === 'true') return;

    const root: HTMLDivElement = maybeRoot;
    root.dataset.heroInited = 'true';

    const maybeContent = root.querySelector<HTMLElement>('.js-hero-products-content');
    const openMore = root.querySelector<HTMLElement>('.hero-products__open-more');
    if (!maybeContent) return;

    const content: HTMLElement = maybeContent;

    let initWidth: string | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let pinned = false;

    function open() {
      root.classList.add('active');
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        root.classList.add('active-2');
      }, 50);

      if (initWidth === null) {
        initWidth = `${root.offsetWidth}px`;
      }

      root.style.setProperty('width', `${content.scrollWidth}px`, 'important');
    }

    function close() {
      root.classList.remove('active', 'active-2');
      if (timer) clearTimeout(timer);
      if (initWidth !== null) {
        root.style.setProperty('width', initWidth, 'important');
      }
      content.scrollLeft = 0;
      pinned = false;
    }

    const onMouseEnter = () => {
      if (!pinned) open();
    };

    const onMouseLeave = () => {
      if (!pinned) close();
    };

    const onToggleClick = (event: Event) => {
      if ((event.target as Element | null)?.closest('.js-hero-product-link')) return;

      event.preventDefault();
      event.stopPropagation();

      if (root.classList.contains('active-2')) {
        close();
        return;
      }

      pinned = true;
      open();
    };

    const onWheel = (event: WheelEvent) => {
      if (!root.classList.contains('active-2')) return;
      if (content.scrollWidth <= content.clientWidth) return;

      event.preventDefault();
      event.stopPropagation();
      content.scrollLeft += event.deltaY;
    };

    root.addEventListener('mouseenter', onMouseEnter);
    root.addEventListener('mouseleave', onMouseLeave);
    openMore?.addEventListener('click', onToggleClick);
    content.addEventListener('wheel', onWheel, { passive: false });

    const onProductLinkClick = (event: Event) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('.js-hero-product-link');
      if (!link) return;

      event.preventDefault();
      event.stopPropagation();
      router.push(link.getAttribute('href') ?? link.pathname);
    };

    content.addEventListener('click', onProductLinkClick);

    return () => {
      root.removeEventListener('mouseenter', onMouseEnter);
      root.removeEventListener('mouseleave', onMouseLeave);
      openMore?.removeEventListener('click', onToggleClick);
      content.removeEventListener('wheel', onWheel);
      content.removeEventListener('click', onProductLinkClick);
      if (timer) clearTimeout(timer);
    };
  }, [products.length, router]);

  if (products.length === 0) return null;

  const hasMultiple = products.length > 1;

  return (
    <div
      ref={rootRef}
      className={`hero__products js-hero-products${hasMultiple ? ' hero__products--more-than-one' : ''}`}
      data-lenis-prevent
    >
      <div className="hero__products-absolute-right js-hero-products-content">
        {products.map((product) => {
          const href = `/${locale}/products/${product.handle}`;

          return (
            <div key={`${product.handle}-${product.image}`} className="hero-product">
              <a href={href} className="js-hero-product-link" aria-label={product.title}>
                <Image
                  src={product.image}
                  alt={product.title}
                  width={120}
                  height={180}
                  sizes="60px"
                  loading="lazy"
                  className="fade-in show"
                />
              </a>
            </div>
          );
        })}

        {hasMultiple ? <div className="hero-products__open-more" aria-hidden /> : null}
      </div>
    </div>
  );
}
