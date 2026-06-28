'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useDebounce } from '@/hooks/use-debounce';
import {
  POPULAR_SEARCHES,
  getSearchCategories,
  getSearchCopy,
} from '@/lib/catalog/search-config';
import type { SearchResultFormatted } from '@/lib/shopify/search';

interface SearchOverlayProps {
  locale: string;
  light?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function IconSearch({ className = 'h-[18px] w-[18px]' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="10.5" cy="10.5" r="6.75" />
      <path d="M16 16l4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

function IconClose({ className = 'h-[18px] w-[18px]' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchResultCard({
  product,
  locale,
  copy,
}: {
  product: SearchResultFormatted;
  locale: string;
  copy: ReturnType<typeof getSearchCopy>;
}) {
  const href = `/${locale}/products/${product.handle}`;

  return (
    <article className="group">
      <Link href={href} className="search-autocomplete__product-image block">
        {product.image ? (
          <>
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 900px) 28vw, 128px"
              className="object-cover object-top transition-opacity duration-300 group-hover:opacity-0"
            />
            {product.hoverImage && (
              <Image
                src={product.hoverImage}
                alt=""
                fill
                sizes="(max-width: 900px) 28vw, 128px"
                className="object-cover object-top opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-[#f7f7f7]" />
        )}
      </Link>
      <Link href={href} className="search-autocomplete__product-title">
        {product.title}
      </Link>
      {product.onSale && product.compareAtPrice ? (
        <div className="mt-1 flex gap-4 text-[9px] uppercase tracking-[0.02em]">
          <div>
            <p className="text-[#303030]/45">{copy.was}</p>
            <p className="text-[#303030]/60">{product.compareAtPrice}</p>
          </div>
          <div>
            <p className="text-[#9c4a4a]">{copy.now}</p>
            <p className="text-[#9c4a4a]">{product.price}</p>
          </div>
        </div>
      ) : (
        <p className="search-autocomplete__product-price">{product.price}</p>
      )}
    </article>
  );
}

function SearchDropdownPanel({
  panelId,
  panelRef,
  locale,
  copy,
  categories,
  popularTerms,
  query,
  activeTerm,
  effectiveQuery,
  results,
  loading,
  position,
  onTermSelect,
  onClose,
}: {
  panelId: string;
  panelRef: React.RefObject<HTMLDivElement | null>;
  locale: string;
  copy: ReturnType<typeof getSearchCopy>;
  categories: ReturnType<typeof getSearchCategories>;
  popularTerms: readonly string[];
  query: string;
  activeTerm: string;
  effectiveQuery: string;
  results: SearchResultFormatted[];
  loading: boolean;
  position: { top: number; right: number };
  onTermSelect: (term: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      ref={panelRef}
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label={copy.placeholder}
      className="search-autocomplete"
      style={{ top: position.top, right: position.right }}
    >
      <aside className="search-autocomplete__sidebar">
        <div className="search-autocomplete__section">
          <h2 className="search-autocomplete__heading">{copy.popular}</h2>
          <ul role="list" aria-label={copy.popular} className="mt-3">
            {popularTerms.map((term) => {
              const active = !query.trim() && activeTerm === term;
              return (
                <li key={term}>
                  <button
                    type="button"
                    onClick={() => onTermSelect(term)}
                    className={`search-autocomplete__term${active ? ' search-autocomplete__term--active' : ''}`}
                  >
                    <em className="not-italic">{term}</em>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="search-autocomplete__section search-autocomplete__facets">
          <h2 className="search-autocomplete__heading">{copy.category}</h2>
          <ul role="list" aria-label={copy.category} className="mt-3">
            {categories.map((category) => {
              const active = !query.trim() && activeTerm === category.query;
              return (
                <li key={category.href}>
                  <button
                    type="button"
                    onClick={() => onTermSelect(category.query)}
                    className={`search-autocomplete__term search-autocomplete__category-link${active ? ' search-autocomplete__term--active' : ''}`}
                  >
                    {category.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="search-autocomplete__content">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="search-autocomplete__heading">{copy.items}</h2>
          <Link
            href={`/${locale}/search?q=${encodeURIComponent(effectiveQuery)}`}
            onClick={onClose}
            className="inline-flex items-center gap-0.5 text-[8px] uppercase tracking-[0.08em] text-black no-underline transition-opacity hover:opacity-60"
          >
            {copy.viewAll}
            <IconChevron />
          </Link>
        </div>

        {loading ? (
          <p className="py-12 text-center uppercase tracking-[0.02em] text-black/45">{copy.searching}</p>
        ) : results.length === 0 ? (
          <p className="py-12 text-center uppercase tracking-[0.02em] text-black/45">{copy.noResults}</p>
        ) : (
          <div className="search-autocomplete__products">
            {results.map((product) => (
              <SearchResultCard key={product.id} product={product} locale={locale} copy={copy} />
            ))}
          </div>
        )}
      </div>
    </div>
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
  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 20 });

  const copy = getSearchCopy(locale);
  const categories = getSearchCategories(locale);
  const popularTerms = POPULAR_SEARCHES[locale === 'pt' ? 'pt' : 'en'];

  const [query, setQuery] = useState('');
  const [activeTerm, setActiveTerm] = useState<string>(popularTerms[0]);
  const [results, setResults] = useState<SearchResultFormatted[]>([]);
  const [loading, setLoading] = useState(false);

  const effectiveQuery = query.trim() || activeTerm;
  const debouncedQuery = useDebounce(effectiveQuery, 300);

  const close = useCallback(() => {
    onOpenChange(false);
    setQuery('');
    setActiveTerm(popularTerms[0]);
  }, [onOpenChange, popularTerms]);

  const updatePanelPos = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    setPanelPos({
      top: rect.top + 40,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, []);

  const fetchResults = useCallback(
    async (term: string) => {
      if (term.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: term.trim(), locale, first: '6' });
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

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPos();
    window.addEventListener('resize', updatePanelPos);
    window.addEventListener('scroll', updatePanelPos, true);
    return () => {
      window.removeEventListener('resize', updatePanelPos);
      window.removeEventListener('scroll', updatePanelPos, true);
    };
  }, [open, updatePanelPos]);

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

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open, close]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim() || activeTerm;
    if (term.length < 2) return;
    close();
    router.push(`/${locale}/search?q=${encodeURIComponent(term)}`);
  };

  const ink = light && !open ? 'text-white' : 'text-ink';

  const dropdown =
    open && mounted
      ? createPortal(
          <SearchDropdownPanel
            panelId={panelId}
            panelRef={panelRef}
            locale={locale}
            copy={copy}
            categories={categories}
            popularTerms={popularTerms}
            query={query}
            activeTerm={activeTerm}
            effectiveQuery={effectiveQuery}
            results={results}
            loading={loading}
            position={panelPos}
            onTermSelect={(term) => {
              setQuery('');
              setActiveTerm(term);
            }}
            onClose={close}
          />,
          document.body
        )
      : null;

  return (
    <div
      ref={rootRef}
      className={`relative z-[200] shrink-0 ${open ? 'w-[min(300px,calc(100vw-96px))]' : 'w-9'}`}
    >
      {!open ? (
        <button
          type="button"
          aria-label={copy.placeholder}
          aria-expanded={false}
          aria-controls={panelId}
          onClick={() => onOpenChange(true)}
          className={`flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-60 ${ink}`}
        >
          <IconSearch />
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div ref={anchorRef} className="flex w-full items-center justify-end">
            <button
              type="submit"
              aria-label={copy.placeholder}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-ink transition-opacity hover:opacity-60"
            >
              <IconSearch />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.placeholder}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={128}
              aria-label={copy.placeholder}
              aria-controls={panelId}
              aria-expanded={true}
              className="min-w-0 flex-1 border-0 bg-transparent py-2 font-sans-ui text-[11px] font-light uppercase tracking-[0.08em] text-ink outline-none placeholder:text-ink/35"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={close}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-ink transition-opacity hover:opacity-60"
            >
              <IconClose />
            </button>
          </div>
        </form>
      )}
      {dropdown}
    </div>
  );
}
