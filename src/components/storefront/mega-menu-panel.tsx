import Image from 'next/image';
import Link from 'next/link';

import type { NavLink } from '@/lib/catalog/navigation-types';

interface MegaMenuPanelProps {
  item: NavLink;
  prefix: string;
  sectionTitle: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MegaMenuPanel({
  item,
  prefix,
  sectionTitle,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuPanelProps) {
  const children = item.children ?? [];
  const banner = item.banner;

  if (children.length === 0) return null;

  return (
    <div
      className="mega-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="region"
      aria-label={item.label}
    >
      <div className="mega-menu__inner">
        <div className="mega-menu__links">
          <p className="mega-menu__heading">{item.sectionTitle ?? sectionTitle}</p>
          <ul className="mega-menu__list">
            {children.map((child) => (
              <li key={child.href + child.label} className="mega-menu__list-item">
                <Link href={`${prefix}/${child.href}`} className="mega-menu__link">
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {banner && (
          <div className="mega-menu__banner">
            <Link href={`${prefix}/${item.href}`} className="mega-menu__banner-link">
              <div className="mega-menu__banner-image">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  sizes="(min-width: 1024px) 1020px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Link>
            {banner.caption && <p className="mega-menu__caption">{banner.caption}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
