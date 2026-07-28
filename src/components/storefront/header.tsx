'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';

import { useCart } from '@/components/providers/cart-provider';
import { useNewsletterModal } from '@/components/providers/newsletter-modal-provider';
import { CartDrawer } from '@/components/storefront/cart-drawer';
import { useScroll } from '@/components/providers/scroll-provider';
import { SearchOverlay } from '@/components/storefront/search-overlay';
import { useWishlist } from '@/hooks/use-wishlist';
import { getLocaleFromPathname, getMainNav, getMarkets, getMenuSections, replaceLocaleInPath, type MarketId } from '@/lib/catalog/menu';
import { m } from '@/lib/i18n';

interface HeaderProps {
  locale: string;
}

const LOGO_SRC = '/logotipo.png';

const PANEL_EASE = [0.76, 0, 0.24, 1] as const;
const ITEM_EASE = [0.22, 1, 0.36, 1] as const;

const panelVariants = {
  closed: { x: '-100%' },
  open: {
    x: 0,
    transition: { duration: 0.55, ease: PANEL_EASE },
  },
};

const listVariants = {
  closed: {},
  open: {
    transition: { staggerChildren: 0.04, delayChildren: 0.14 },
  },
};

const itemVariants = {
  closed: { opacity: 0, y: 10 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: ITEM_EASE },
  },
};

function HeaderIcon({
  children,
  label,
  href,
  light,
  onClick,
  expanded,
}: {
  children: React.ReactNode;
  label: string;
  href?: string;
  light: boolean;
  onClick?: () => void;
  expanded?: boolean;
}) {
  const className = `flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-60 ${
    light ? 'text-white' : 'text-ink'
  }`;

  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}


function IconAccount() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
    </svg>
  );
}

function IconWishlist() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M12 20.5l-1.1-1C5.5 14.8 2 11.6 2 7.8 2 5 4.2 3 6.8 3c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.6 0 4.8 2 4.8 4.8 0 3.8-3.5 7-8.9 11.7L12 20.5z" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M7 7h13l-1.5 9H8L6 3H3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19" r="1" />
      <circle cx="17" cy="19" r="1" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6.5 4h3l1.5 5-2 1.5a11 11 0 005 5L17 13.5l5 1.5v3a2 2 0 01-2 2C10.8 20 4 13.2 4.5 6.5A2 2 0 016.5 4z" strokeLinejoin="round" />
    </svg>
  );
}

function IconEnvelope() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M3 8l9 6 9-6" strokeLinejoin="round" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function NavSeparator({ light }: { light: boolean }) {
  return (
    <span className={`menu-text px-2 ${light ? 'text-white/50' : 'text-ink/35'}`}>
      |
    </span>
  );
}

function MenuUtilityRow({
  icon,
  label,
  href,
  onClick,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
}) {
  const className =
    'menu-text flex w-full items-center gap-3 -mx-8 px-8 py-2 text-ink transition-colors hover:bg-cream';

  const content = (
    <>
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">{icon}</span>
      <span className="flex-1">{label}</span>
      {trailing}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${className} text-left`}>
      {content}
    </button>
  );
}

function FlagIcon({ market, clipId }: { market: MarketId; clipId: string }) {
  if (market === 'us') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
        <defs>
          <clipPath id={clipId}>
            <circle cx="8" cy="8" r="8" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect width="16" height="16" fill="#B22234" />
          <rect y="1.23" width="16" height="1.23" fill="#fff" />
          <rect y="3.69" width="16" height="1.23" fill="#fff" />
          <rect y="6.15" width="16" height="1.23" fill="#fff" />
          <rect y="8.62" width="16" height="1.23" fill="#fff" />
          <rect y="11.08" width="16" height="1.23" fill="#fff" />
          <rect y="13.54" width="16" height="1.23" fill="#fff" />
          <rect width="6.5" height="7.5" fill="#3C3B6E" />
          <circle cx="1.3" cy="1.2" r="0.35" fill="#fff" />
          <circle cx="2.6" cy="1.2" r="0.35" fill="#fff" />
          <circle cx="3.9" cy="1.2" r="0.35" fill="#fff" />
          <circle cx="5.2" cy="1.2" r="0.35" fill="#fff" />
          <circle cx="1.95" cy="2.2" r="0.35" fill="#fff" />
          <circle cx="3.25" cy="2.2" r="0.35" fill="#fff" />
          <circle cx="4.55" cy="2.2" r="0.35" fill="#fff" />
          <circle cx="1.3" cy="3.2" r="0.35" fill="#fff" />
          <circle cx="2.6" cy="3.2" r="0.35" fill="#fff" />
          <circle cx="3.9" cy="3.2" r="0.35" fill="#fff" />
          <circle cx="5.2" cy="3.2" r="0.35" fill="#fff" />
        </g>
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <defs>
        <clipPath id={clipId}>
          <circle cx="8" cy="8" r="8" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="16" height="16" fill="#009B3A" />
        <path d="M8 2.2L14.2 8 8 13.8 1.8 8 8 2.2Z" fill="#FEDF00" />
        <circle cx="8" cy="8" r="3.1" fill="#002776" />
        <path d="M8 5.4c1.2 0.8 1.9 1.8 2.1 2.6-0.7 0.1-1.6 0.5-2.1 1.1-0.5-0.6-1.4-1-2.1-1.1 0.2-0.8 0.9-1.8 2.1-2.6Z" fill="#fff" />
      </g>
    </svg>
  );
}

function MarketChooser({
  locale,
  light,
  layout = 'compact',
  onSelect,
}: {
  locale: string;
  light: boolean;
  layout?: 'compact' | 'list';
  onSelect?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const clipBase = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const currentLocale = getLocaleFromPathname(pathname) ?? locale;
  const markets = getMarkets(locale);
  const labels = m(locale).header;
  const current = markets.find((market) => market.locale === currentLocale) ?? markets[0]!;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const selectMarket = (marketId: MarketId) => {
    const market = markets.find((item) => item.id === marketId);
    const activeLocale = getLocaleFromPathname(pathname) ?? locale;
    if (!market || market.locale === activeLocale) {
      setOpen(false);
      return;
    }

    const nextPath = replaceLocaleInPath(pathname, market.locale);
    document.cookie = `region=${market.id}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(nextPath);
    router.refresh();
    setOpen(false);
    onSelect?.();
  };

  const textClass = light ? 'text-white' : 'text-ink';

  if (layout === 'list') {
    return (
      <div className="space-y-0">
        {markets.map((market) => (
          <button
            key={market.id}
            type="button"
            onClick={() => selectMarket(market.id)}
            className="menu-text flex w-full items-center gap-2 border-b border-black/8 py-4 text-ink transition-opacity hover:opacity-60"
            aria-current={market.id === current.id ? 'true' : undefined}
          >
            <FlagIcon market={market.id} clipId={`${clipBase}-${market.id}`} />
            <NavSeparator light={false} />
            <span>{market.currencyLabel}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative flex items-center">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-2 transition-opacity hover:opacity-60 ${textClass}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={labels.selectCountry(current.countryLabel, current.currencyLabel)}
      >
        <FlagIcon market={current.id} clipId={`${clipBase}-current`} />
        <NavSeparator light={light} />
        <span className="menu-text">{current.currencyLabel}</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={labels.countryCurrency}
          className="absolute left-0 top-full z-[100] mt-2 min-w-[148px] border border-black/10 bg-white py-1 shadow-sm"
        >
          {markets.map((market) => (
            <button
              key={market.id}
              type="button"
              role="option"
              aria-selected={market.id === current.id}
              onClick={() => selectMarket(market.id)}
              className="menu-text flex w-full items-center gap-2 px-3 py-2 text-left text-ink transition-colors hover:bg-black/4"
            >
              <FlagIcon market={market.id} clipId={`${clipBase}-opt-${market.id}`} />
              <NavSeparator light={false} />
              <span>{market.currencyLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { cart, openCart, isCartOpen } = useCart();
  const { openNewsletter } = useNewsletterModal();
  const { items: wishlistItems, hydrated: wishlistHydrated } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const scrolled = scrollY > 60;
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const heroNav = isHome && scrollY < 60 && !menuOpen;
  const cartCount = mounted ? cart?.totalQuantity ?? 0 : 0;
  const wishlistCount = wishlistHydrated ? wishlistItems.length : 0;
  const blurActive = scrolled && !menuOpen;

  const prefix = `/${locale}`;
  const labels = m(locale).header;
  const mainNav = getMainNav(locale);
  const menuSections = getMenuSections(locale);
  const ink = heroNav && !searchOpen && !blurActive ? 'text-white' : 'text-ink';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[80] flex h-8 items-center justify-center bg-cream px-5 pb-0 pt-0.5 md:h-7">
        <p className="text-center text-[10px] font-normal uppercase leading-[100%] tracking-[0.02em] text-ink font-sans-ui">
          Discounts for new customers until next week!
        </p>
      </div>

      <div
        className={`fixed top-8 left-0 right-0 z-[81] transition-[background-color,backdrop-filter] duration-500 md:top-7 ${
          searchOpen ? 'bg-white' : blurActive ? 'bg-white/20 backdrop-blur-[8px]' : menuOpen ? 'bg-white' : ''
        }`}
      >
        <header className="relative overflow-visible border-b border-transparent">
          <div id="header-inner" className="relative mx-auto flex h-[52px] max-w-[1440px] items-center px-5">
            <div className="flex min-w-0 flex-1 items-center">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className={`flex h-9 w-9 items-center justify-center lg:hidden ${ink}`}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
              >
                {menuOpen ? <IconClose /> : <IconMenu />}
              </button>

              <div className="hidden items-center lg:flex">
                <MarketChooser locale={locale} light={heroNav} />
                <span className="mx-3" />
                <HeaderIcon href={`${prefix}/locations`} label={labels.boutiqueLocator} light={heroNav}>
                  <IconPin />
                </HeaderIcon>
                <HeaderIcon href={`${prefix}/contact`} label={labels.contactUs} light={heroNav}>
                  <IconPhone />
                </HeaderIcon>
                <HeaderIcon href={`${prefix}/contact`} label={labels.emailUs} light={heroNav}>
                  <IconEnvelope />
                </HeaderIcon>
              </div>
            </div>

            <Link
              href={prefix}
              aria-label={labels.home}
              className="absolute left-1/2 shrink-0 -translate-x-1/2 transition-opacity hover:opacity-80"
            >
              <Image
                src={LOGO_SRC}
                alt="Sinesia Karol"
                width={100}
                height={50}
                priority
                className="h-[50px] w-[100px] object-contain"
              />
            </Link>

            <div className="relative flex flex-1 items-center justify-end overflow-visible gap-0.5 sm:gap-1">
              {!searchOpen && (
                <>
                  <div className="hidden items-center lg:flex">
                    <HeaderIcon href={`${prefix}/account`} label={labels.account} light={heroNav}>
                      <IconAccount />
                    </HeaderIcon>
                    <div className="relative">
                      <HeaderIcon href={`${prefix}/wishlist`} label={labels.wishlist} light={heroNav}>
                        <IconWishlist />
                      </HeaderIcon>
                      {wishlistCount > 0 && (
                        <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-ink px-0.5 text-[8px] font-normal text-white">
                          {wishlistCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <SearchOverlay
                    locale={locale}
                    light={heroNav}
                    open={searchOpen}
                    onOpenChange={setSearchOpen}
                  />
                  <div className="relative flex items-center">
                    <HeaderIcon
                      label={cartCount > 0 ? labels.shoppingBagCount(cartCount) : labels.shoppingBag}
                      light={heroNav}
                      onClick={openCart}
                      expanded={isCartOpen}
                    >
                      <IconCart />
                    </HeaderIcon>
                    {cartCount > 0 && (
                      <span
                        className={`pointer-events-none absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-0.5 text-[8px] font-normal tabular-nums ${
                          heroNav ? 'bg-white text-ink' : 'bg-ink text-white'
                        }`}
                      >
                        {cartCount}
                      </span>
                    )}
                  </div>
                </>
              )}
              {searchOpen && (
                <SearchOverlay
                  locale={locale}
                  light={heroNav}
                  open={searchOpen}
                  onOpenChange={setSearchOpen}
                />
              )}
            </div>
          </div>
        </header>

        <nav
          aria-label={labels.mainNav}
          className={`hidden border-t lg:block ${
            heroNav && !blurActive && !searchOpen ? 'border-white/15' : 'border-black/8'
          }`}
        >
          <ul className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center px-5 py-3">
            {mainNav.map((item, index) => (
              <li key={item.href + item.label} className="flex items-center">
                {index > 0 && <NavSeparator light={heroNav} />}
                <Link
                  href={`${prefix}/${item.href}`}
                  className={`menu-text transition-opacity hover:opacity-60 ${
                    'sale' in item && item.sale ? 'text-[#9c4a4a]' : ink
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label={labels.navMenu}
            className="fixed inset-0 z-[70] flex h-[100dvh] lg:hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
          >
            <motion.div
              className="flex h-full min-h-0 w-full max-w-[min(100vw,420px)] flex-col overflow-hidden bg-white"
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="h-[84px] shrink-0" />

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
                <motion.ul
                  variants={listVariants}
                  initial="closed"
                  animate="open"
                  className="px-8 pb-2 pt-0"
                >
                  {mainNav.map((item) => (
                    <motion.li key={item.href + item.label} variants={itemVariants}>
                      <Link
                        href={`${prefix}/${item.href}`}
                        onClick={() => setMenuOpen(false)}
                        className={`menu-text block -mx-8 px-8 py-2 text-ink transition-colors hover:bg-cream ${
                          'sale' in item && item.sale ? 'text-[#9c4a4a]' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  variants={listVariants}
                  initial="closed"
                  animate="open"
                  className="px-8 pb-6 pt-1"
                >
                  {menuSections.brand.links.map((link) => (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        href={`${prefix}/${link.href}`}
                        onClick={() => setMenuOpen(false)}
                        className="menu-text block -mx-8 px-8 py-2 text-ink transition-colors hover:bg-cream"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  className="bg-[#f2f2f2] px-8 py-4 pb-8"
                >
                  <MenuUtilityRow
                    icon={<IconAccount />}
                    label={labels.loginCreateAccount}
                    href={`${prefix}/account/login`}
                    onClick={() => setMenuOpen(false)}
                  />
                  <MenuUtilityRow
                    icon={<IconCart />}
                    label={labels.shoppingBag}
                    onClick={() => {
                      setMenuOpen(false);
                      openCart();
                    }}
                    trailing={
                      cartCount > 0 ? (
                        <span className="menu-text tabular-nums">{cartCount}</span>
                      ) : undefined
                    }
                  />
                  <MenuUtilityRow
                    icon={<IconWishlist />}
                    label={labels.wishlist}
                    href={`${prefix}/wishlist`}
                    onClick={() => setMenuOpen(false)}
                    trailing={
                      wishlistCount > 0 ? (
                        <span className="menu-text tabular-nums">{wishlistCount}</span>
                      ) : undefined
                    }
                  />
                  <MenuUtilityRow
                    icon={<IconEnvelope />}
                    label={labels.newsletter}
                    onClick={() => {
                      setMenuOpen(false);
                      openNewsletter();
                    }}
                  />
                  <MenuUtilityRow
                    icon={<IconPin />}
                    label={labels.boutiqueLocator}
                    href={`${prefix}/locations`}
                    onClick={() => setMenuOpen(false)}
                  />
                  <MenuUtilityRow
                    icon={<IconPhone />}
                    label={labels.contactUs}
                    href={`${prefix}/contact`}
                    onClick={() => setMenuOpen(false)}
                  />

                  <div className="mt-4 border-t border-black/10 pt-4">
                    <MarketChooser
                      locale={locale}
                      light={false}
                      layout="compact"
                      onSelect={() => setMenuOpen(false)}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <button
              type="button"
              aria-label={labels.dismissMenu}
              className="flex-1 cursor-default bg-black/20"
              onClick={() => setMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer locale={locale} />
    </>
  );
}
