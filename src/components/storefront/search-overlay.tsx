'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useDebounce } from '@/hooks/use-debounce';
import {
  POPULAR_SEARCHES,
  getSearchCopy,
} from '@/lib/catalog/search-config';
import type { SearchResultFormatted } from '@/lib/shopify/search';

interface SearchOverlayProps {
  locale: string;
  light?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories?: Array<{ label: string; href: string; query: string }>;
}

const PANEL_EASE = [0.76, 0, 0.24, 1] as const;

const panelVariants = {
  closed: { x: '100%' },
  open: { x: 0, transition: { duration: 0.3, ease: PANEL_EASE } },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.3 } },
};

function IconSearch({ className = 'h-[18px] w-[18px]' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="10.5" cy="10.5" r="6.75" />
      <path d="M16 16l4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCloseSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M0.146468 0.854096C-0.0487939 0.658834 -0.0487939 0.342251 0.146468 0.146989C0.34173 -0.048273 0.658313 -0.0482732 0.853575 0.146989L8.9853 8.27872C9.18056 8.47398 9.18056 8.79056 8.9853 8.98582C8.79004 9.18109 8.47346 9.18109 8.2782 8.98582L0.146468 0.854096Z"
        fill="currentColor"
      />
      <path
        d="M0.853575 8.98582C0.658313 9.18109 0.34173 9.18109 0.146468 8.98582C-0.0487939 8.79056 -0.048794 8.47398 0.146468 8.27872L8.2782 0.146989C8.47346 -0.048273 8.79004 -0.048273 8.9853 0.146989C9.18056 0.342251 9.18056 0.658834 8.9853 0.854096L0.853575 8.98582Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SearchResultRow({
  product,
  locale,
}: {
  product: SearchResultFormatted;
  locale: string;
}) {
  const href = `/${locale}/products/${product.handle}`;

  return (
    <div className="search-result-row">
      <div className="search-result-row__image">
        <Link href={href}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="72px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#f2ede8]" />
          )}
        </Link>
      </div>
      <div className="search-result-row__details">
        <div className="search-result-row__top">
          <div className="search-result-row__title h6">
            <Link href={href}>{product.title}</Link>
          </div>
          <div className="search-result-row__price">
            {product.onSale && product.compareAtPrice ? (
              <span className="search-result-row__price-sale">{product.price}</span>
            ) : (
              product.price
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchDrawer({
  panelId,
  locale,
  copy,
  popularTerms,
  query,
  setQuery,
  results,
  loading,
  effectiveQuery,
  onClose,
  onSubmit,
}: {
  panelId: string;
  locale: string;
  copy: ReturnType<typeof getSearchCopy>;
  popularTerms: readonly string[];
  query: string;
  setQuery: (value: string) => void;
  results: SearchResultFormatted[];
  loading: boolean;
  effectiveQuery: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = query.trim().length >= 2;
  const showResults = hasQuery || loading;

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label={copy.placeholder}
      className="header-search__content"
      variants={panelVariants}
      initial="closed"
      animate="open"
      exit="closed"
    >
      <button type="button" className="header-search__close text-cta" aria-label="Close search" onClick={onClose}>
        <IconCloseSmall />
      </button>

      <form action={`/${locale}/search`} onSubmit={onSubmit}>
        <input type="hidden" name="type" value="product" />
        <input
          ref={inputRef}
          type="text"
          className="header-search__input h5"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.placeholder}
          aria-label={copy.placeholder}
          maxLength={128}
        />
      </form>

      {!showResults && (
        <div className="header-search__popular-searches">
          <div className="header-popular-categories__title text-cta">{copy.popular}</div>
          <ul className="popular-searches">
            {popularTerms.map((term) => (
              <li key={term} className="popular-searches__item">
                <Link href={`/${locale}/search?q=${encodeURIComponent(term)}`} onClick={onClose}>
                  {term}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && (
        <div id="predictive-search" tabIndex={-1}>
          <div className="search-autocomplete">
            <div className="search-autocomplete__tabs">
              <button type="button" className="search-tab text-cta active" disabled>
                {copy.items}
              </button>
            </div>

            <div className="search-panel display show">
              {loading ? (
                <p className="search-autocomplete__status">{copy.searching}</p>
              ) : results.length === 0 ? (
                <p className="search-autocomplete__status">{copy.noResults}</p>
              ) : (
                <div className="search-autocomplete__products">
                  {results.map((product) => (
                    <SearchResultRow key={product.id} product={product} locale={locale} />
                  ))}
                </div>
              )}

              {results.length > 0 && (
                <div className="search-autocomplete__view-all">
                  <Link
                    href={`/${locale}/search?q=${encodeURIComponent(effectiveQuery)}`}
                    onClick={onClose}
                    className="second-button text-cta"
                  >
                    {copy.viewAll}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function SearchOverlay({
  locale,
  light = false,
  open,
  onOpenChange,
}: SearchOverlayProps) {
  const router = useRouter();
  const panelId = useId();
  const [mounted, setMounted] = useState(false);

  const copy = getSearchCopy(locale);
  const popularTerms = POPULAR_SEARCHES[locale === 'pt' ? 'pt' : 'en'];

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultFormatted[]>([]);
  const [loading, setLoading] = useState(false);

  const effectiveQuery = query.trim();
  const debouncedQuery = useDebounce(effectiveQuery, 300);

  const close = useCallback(() => {
    onOpenChange(false);
    setQuery('');
    setResults([]);
  }, [onOpenChange]);

  const fetchResults = useCallback(
    async (term: string) => {
      if (term.trim().length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: term.trim(), locale, first: '8' });
        const response = await fetch(`/${locale}/api/search?${params.toString()}`);
        if (!response.ok) {
          setResults([]);
          return;
        }
        const data = (await response.json()) as { results?: SearchResultFormatted[] };
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [locale]
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    void fetchResults(debouncedQuery);
  }, [open, debouncedQuery, fetchResults]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (term.length < 2) return;
    close();
    router.push(`/${locale}/search?q=${encodeURIComponent(term)}`);
  };

  const ink = light && !open ? 'text-white' : 'text-ink';

  const drawer = mounted
    ? createPortal(
        <AnimatePresence>
          {open && (
            <div key="header-search" className="header-search display active">
              <motion.button
                type="button"
                className="header-search__background-close"
                aria-label="Close search"
                variants={backdropVariants}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={close}
              />
              <SearchDrawer
                panelId={panelId}
                locale={locale}
                copy={copy}
                popularTerms={popularTerms}
                query={query}
                setQuery={setQuery}
                results={results}
                loading={loading}
                effectiveQuery={effectiveQuery}
                onClose={close}
                onSubmit={handleSubmit}
              />
            </div>
          )}
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <>
      <button
        type="button"
        aria-label={copy.placeholder}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(true)}
        className={`flex h-9 w-9 shrink-0 items-center justify-center transition-opacity hover:opacity-60 ${ink}`}
      >
        <IconSearch />
      </button>
      {drawer}
    </>
  );
}
