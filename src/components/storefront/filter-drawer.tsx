'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';

import { m } from '@/lib/i18n';
import {
  CATEGORY_FILTERS,
  COLOR_SWATCHES,
  DEFAULT_FILTER_STATE,
  activeFilterCount,
  type FilterableProduct,
  type FilterState,
  type PriceBounds,
  type ProductFacets,
  type SizeGroup,
} from '@/lib/product-filters';

const PANEL_EASE = [0.76, 0, 0.24, 1] as const;

const panelVariants = {
  closed: { x: '100%' },
  open: {
    x: 0,
    transition: { duration: 0.55, ease: PANEL_EASE },
  },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.35 } },
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className={`shrink-0 text-ink/60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M1 3.5L5 7.5L9 3.5" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function FilterSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = useId();

  return (
    <div className="border-b border-[#03060714]">
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
        aria-controls={sectionId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-sans-ui text-[12px] font-normal uppercase tracking-[0.02em] text-ink">
          {title}
        </span>
        <Chevron open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={sectionId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: PANEL_EASE }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RadioControl({ checked }: { checked: boolean }) {
  return (
    <span
      className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[#03060733] ${
        checked ? 'border-ink' : ''
      }`}
    >
      {checked && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
    </span>
  );
}

function CheckboxControl({ checked }: { checked: boolean }) {
  return (
    <span
      className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border border-[#03060733] ${
        checked ? 'border-ink bg-ink' : ''
      }`}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
          <path d="M1.5 4L3.2 5.7L6.5 2.3" fill="none" stroke="#fff" strokeWidth="1" />
        </svg>
      )}
    </span>
  );
}

function ColorSwatch({ name }: { name: string }) {
  const key = name.toLowerCase();
  const fill = COLOR_SWATCHES[key] ?? '#d4d4d4';
  const isGradient = fill.includes('gradient');

  return (
    <span
      className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-[#03060714]"
      style={isGradient ? { background: fill } : { backgroundColor: fill }}
      aria-hidden
    />
  );
}

function PriceRangeFilter({
  bounds,
  priceMin,
  priceMax,
  onChange,
  locale,
}: {
  bounds: PriceBounds;
  priceMin: number | null;
  priceMax: number | null;
  onChange: (min: number | null, max: number | null) => void;
  locale: string;
}) {
  const col = m(locale).collection;
  const floor = bounds.min;
  const ceiling = bounds.max;
  const span = Math.max(ceiling - floor, 1);

  const [low, setLow] = useState(priceMin ?? floor);
  const [high, setHigh] = useState(priceMax ?? ceiling);

  useEffect(() => {
    setLow(priceMin ?? floor);
    setHigh(priceMax ?? ceiling);
  }, [priceMin, priceMax, floor, ceiling]);

  const commit = (nextLow: number, nextHigh: number) => {
    const lo = Math.max(floor, Math.min(nextLow, nextHigh));
    const hi = Math.min(ceiling, Math.max(nextLow, nextHigh));
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return;
    setLow(lo);
    setHigh(hi);
    onChange(
      lo > floor ? lo : null,
      hi < ceiling ? hi : null
    );
  };

  if (floor >= ceiling) {
    return (
      <p className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-[#03060799]">
        ${floor}
      </p>
    );
  }

  const fillLeft = ((low - floor) / span) * 100;
  const fillWidth = ((high - low) / span) * 100;

  return (
    <div className="plp-price-range">
      <div
        className="plp-price-range__slider"
        onPointerUp={() => commit(low, high)}
        onPointerLeave={(e) => {
          if (e.buttons === 0) return;
          commit(low, high);
        }}
      >
        <div className="plp-price-range__track" aria-hidden>
          <div
            className="plp-price-range__fill"
            style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
          />
        </div>
        <input
          type="range"
          className="plp-price-range__input plp-price-range__input--min"
          min={floor}
          max={ceiling}
          step={1}
          value={low}
          aria-label={col.minPrice}
          onChange={(e) => {
            const next = Number(e.target.value);
            setLow(Math.min(next, high));
          }}
        />
        <input
          type="range"
          className="plp-price-range__input plp-price-range__input--max"
          min={floor}
          max={ceiling}
          step={1}
          value={high}
          aria-label={col.maxPrice}
          onChange={(e) => {
            const next = Number(e.target.value);
            setHigh(Math.max(next, low));
          }}
        />
      </div>

      <div className="plp-price-range__fields">
        <label className="plp-price-range__field">
          <span className="plp-price-range__currency">$</span>
          <input
            type="number"
            min={floor}
            max={high}
            step={1}
            value={low}
            aria-label={col.minPriceAmount}
            onChange={(e) => setLow(Number(e.target.value))}
            onBlur={() => commit(low, high)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit(low, high);
            }}
          />
        </label>
        <span className="plp-price-range__dash" aria-hidden>
          –
        </span>
        <label className="plp-price-range__field">
          <span className="plp-price-range__currency">$</span>
          <input
            type="number"
            min={low}
            max={ceiling}
            step={1}
            value={high}
            aria-label={col.maxPriceAmount}
            onChange={(e) => setHigh(Number(e.target.value))}
            onBlur={() => commit(low, high)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit(low, high);
            }}
          />
        </label>
      </div>
    </div>
  );
}

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (next: FilterState) => void;
  facets: ProductFacets;
  filterable: FilterableProduct[];
  collectionTitle: string;
  locale: string;
}

function availableCategoryFilters(products: FilterableProduct[]) {
  return CATEGORY_FILTERS.filter((cat) =>
    products.some((p) => cat.match.some((m) => p.categoryHints.some((h) => h.includes(m))))
  );
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  facets,
  filterable,
  collectionTitle,
  locale,
}: FilterDrawerProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const t = m(locale);
  const col = t.collection;
  const flt = t.filter;
  const sizeGroupLabel = (group: SizeGroup) => flt[group];

  useEffect(() => setMounted(true), []);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  const toggleMulti = (
    key: 'colors' | 'sizes' | 'materials' | 'sleeves',
    value: string
  ) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const clearAll = () => onChange(DEFAULT_FILTER_STATE);

  const count = activeFilterCount(filters, facets.price);
  const categoryOptions = availableCategoryFilters(filterable);
  const hasSizes = Object.values(facets.sizes).some((sizes) => sizes.length > 0);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95]" aria-hidden={!open}>
          <motion.button
            type="button"
            aria-label={col.closeFilters}
            className="absolute inset-0 bg-black/20"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="plp-filter-panel fixed top-0 right-0 flex h-full w-full max-w-[400px] flex-col bg-white"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-[#03060714] px-5 py-5">
              <div>
                <p className="mb-1 font-sans-ui text-[11px] uppercase tracking-[0.02em] text-[#03060799]">
                  {collectionTitle}
                </p>
                <p
                  id={titleId}
                  className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink"
                >
                  {col.filter}{count > 0 ? ` (${count})` : ''}
                </p>
              </div>
              <button
                type="button"
                aria-label={t.common.close}
                onClick={onClose}
                className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink transition-opacity hover:opacity-60"
              >
                {t.common.close}
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5">
              {categoryOptions.length > 0 && (
                <FilterSection title={col.category} defaultOpen>
                  <ul className="space-y-3">
                    {categoryOptions.map((cat) => {
                      const checked = filters.category === cat.handle;
                      return (
                        <li key={cat.handle}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 text-left"
                            onClick={() =>
                              onChange({
                                ...filters,
                                category: checked ? null : cat.handle,
                              })
                            }
                          >
                            <RadioControl checked={checked} />
                            <span className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink">
                              {flt.categories[cat.handle]}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </FilterSection>
              )}

              {facets.colors.length > 0 && (
                <FilterSection title={col.colour}>
                  <ul className="max-h-[280px] space-y-3 overflow-y-auto pr-1">
                    {facets.colors.map((color) => {
                      const checked = filters.colors.some(
                        (c) => c.toLowerCase() === color.toLowerCase()
                      );
                      return (
                        <li key={color}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 text-left"
                            onClick={() => toggleMulti('colors', color)}
                          >
                            <CheckboxControl checked={checked} />
                            <ColorSwatch name={color} />
                            <span className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink">
                              {color}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </FilterSection>
              )}

              {hasSizes && (
                <FilterSection title={col.size}>
                  {(Object.keys(facets.sizes) as SizeGroup[]).map((group) => {
                    const sizes = facets.sizes[group];
                    if (sizes.length === 0) return null;
                    return (
                      <div key={group} className="mb-5 last:mb-0">
                        <p className="mb-3 font-sans-ui text-[11px] uppercase tracking-[0.02em] text-ink">
                          {sizeGroupLabel(group)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((size) => {
                            const checked = filters.sizes.includes(size);
                            return (
                              <button
                                key={size}
                                type="button"
                                aria-pressed={checked}
                                onClick={() => toggleMulti('sizes', size)}
                                className={`min-w-[36px] bg-cream px-2 py-2 font-sans-ui text-[11px] uppercase tracking-[0.02em] text-ink transition-colors ${
                                  checked ? 'ring-1 ring-ink ring-inset' : ''
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </FilterSection>
              )}

              {facets.materials.length > 0 && (
                <FilterSection title={col.material}>
                  <ul className="space-y-3">
                    {facets.materials.map((material) => {
                      const checked = filters.materials.some(
                        (m) => m.toLowerCase() === material.toLowerCase()
                      );
                      return (
                        <li key={material}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 text-left"
                            onClick={() => toggleMulti('materials', material)}
                          >
                            <CheckboxControl checked={checked} />
                            <span className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink">
                              {material}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </FilterSection>
              )}

              {facets.sleeves.length > 0 && (
                <FilterSection title={col.sleeve}>
                  <ul className="space-y-3">
                    {facets.sleeves.map((sleeve) => {
                      const checked = filters.sleeves.some(
                        (s) => s.toLowerCase() === sleeve.toLowerCase()
                      );
                      return (
                        <li key={sleeve}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 text-left"
                            onClick={() => toggleMulti('sleeves', sleeve)}
                          >
                            <CheckboxControl checked={checked} />
                            <span className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink">
                              {sleeve}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </FilterSection>
              )}

              <FilterSection title={col.price}>
                <PriceRangeFilter
                  bounds={facets.price}
                  priceMin={filters.priceMin}
                  priceMax={filters.priceMax}
                  locale={locale}
                  onChange={(priceMin, priceMax) =>
                    onChange({ ...filters, priceMin, priceMax })
                  }
                />
              </FilterSection>

              <FilterSection title={col.availability}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 text-left"
                  onClick={() => onChange({ ...filters, inStock: !filters.inStock })}
                >
                  <CheckboxControl checked={filters.inStock} />
                  <span className="font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink">
                    {t.common.inStock}
                  </span>
                </button>
              </FilterSection>
            </div>

            <footer className="flex shrink-0 gap-3 border-t border-[#03060714] px-5 py-5">
              <button
                type="button"
                onClick={clearAll}
                className="flex-1 border border-[#03060733] py-3 font-sans-ui text-[12px] uppercase tracking-[0.02em] text-ink transition-opacity hover:opacity-60"
              >
                {t.common.clear}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-ink py-3 font-sans-ui text-[12px] uppercase tracking-[0.02em] text-white transition-opacity hover:opacity-90"
              >
                {t.common.viewResults}
              </button>
            </footer>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

interface FilterTriggerProps {
  onClick: () => void;
  count: number;
  locale: string;
}

export function FilterTrigger({ onClick, count, locale }: FilterTriggerProps) {
  const col = m(locale).collection;
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer font-sans-ui text-[12px] font-normal uppercase tracking-[0.02em] text-ink transition-opacity hover:opacity-60"
    >
      {col.filter}{count > 0 ? ` (${count})` : ''}
    </button>
  );
}
