import type { CatalogProduct } from '@/lib/catalog/data';
import { parseLuxuryMetafields } from '@/lib/shopify/metafields';
import { isColorOption, isSizeOption } from '@/lib/shopify/variants';
import type { ShopifyProduct } from '@/lib/shopify/types';

export const CATEGORY_FILTERS = [
  { label: 'Ready to Wear', handle: 'ready-to-wear', match: ['ready-to-wear', 'ready to wear'] },
  { label: 'Swim & Resort', handle: 'swimwear', match: ['swimwear', 'swim', 'resort'] },
  { label: 'New This Week', handle: 'new', match: ['new', 'new arrival'] },
  { label: 'Accessories', handle: 'accessories', match: ['accessories', 'accessory'] },
  { label: 'Jewellery', handle: 'bracelets', match: ['jewellery', 'jewelry', 'bracelets'] },
  { label: 'Dresses', handle: 'dresses', match: ['dresses', 'dress'] },
  { label: 'Denim', handle: 'denim', match: ['denim', 'jean', 'jeans'] },
  { label: 'Bags', handle: 'bags', match: ['bags', 'bag'] },
] as const;

export const COLOR_SWATCHES: Record<string, string> = {
  white: '#f5f5f5',
  'animal print': '#c4a574',
  black: '#1a1a1a',
  blue: '#a8c4d4',
  brown: '#5c3d2e',
  cream: '#f0e8dc',
  floral: '#d4a574',
  gold: '#c9a227',
  green: '#8a9a7b',
  multi: 'linear-gradient(135deg, #c9a227 0%, #a8c4d4 50%, #8a9a7b 100%)',
  paisley: '#8b4513',
  pink: '#d4a5a5',
  purple: '#9a8a9a',
  red: '#8b2635',
  stripe: 'repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 2px, #fff 2px, #fff 4px)',
  natural: '#d4c4a8',
  pecan: '#9B6B4F',
  milk: '#F5F0E8',
  navy: '#1e3a5f',
  beige: '#d4c4a8',
};

export const MATERIAL_OPTIONS = [
  'Linen',
  'Silk',
  'Cotton',
  'Leather',
  'Jersey',
  'Straw Raffia',
  'Brass',
  'Other',
  'Ramie',
] as const;

export const SLEEVE_OPTIONS = ['Long Sleeve', 'Short Sleeve', 'Sleeveless'] as const;

export type SizeGroup = 'clothing' | 'accessories' | 'shoes';

export interface PriceBounds {
  min: number;
  max: number;
}

export interface FilterState {
  category: string | null;
  colors: string[];
  sizes: string[];
  materials: string[];
  sleeves: string[];
  inStock: boolean;
  priceMin: number | null;
  priceMax: number | null;
  sort: 'featured' | 'price-asc' | 'price-desc';
}

export interface FilterableProduct {
  id: string;
  handle: string;
  title: string;
  price: number;
  available: boolean;
  colors: string[];
  sizes: string[];
  materials: string[];
  sleeves: string[];
  categoryHints: string[];
}

export interface ProductFacets {
  colors: string[];
  sizes: Record<SizeGroup, string[]>;
  materials: string[];
  sleeves: string[];
  price: PriceBounds;
}

export function priceBoundsFromProducts(products: FilterableProduct[]): PriceBounds {
  if (products.length === 0) return { min: 0, max: 1000 };
  let min = Infinity;
  let max = -Infinity;
  for (const p of products) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  return {
    min: Math.floor(min),
    max: Math.ceil(max),
  };
}

export function isPriceFilterActive(filters: FilterState, bounds: PriceBounds): boolean {
  if (filters.priceMin != null && filters.priceMin > bounds.min) return true;
  if (filters.priceMax != null && filters.priceMax < bounds.max) return true;
  return false;
}

export function clampPriceFilters(filters: FilterState, bounds: PriceBounds): FilterState {
  if (bounds.min >= bounds.max) {
    return { ...filters, priceMin: null, priceMax: null };
  }

  let priceMin = filters.priceMin;
  let priceMax = filters.priceMax;

  if (priceMin != null) {
    if (priceMin < bounds.min || priceMin > bounds.max) priceMin = null;
  }
  if (priceMax != null) {
    if (priceMax > bounds.max || priceMax < bounds.min) priceMax = null;
  }
  if (priceMin != null && priceMax != null && priceMin > priceMax) {
    priceMin = null;
    priceMax = null;
  }

  return { ...filters, priceMin, priceMax };
}

export const DEFAULT_FILTER_STATE: FilterState = {
  category: null,
  colors: [],
  sizes: [],
  materials: [],
  sleeves: [],
  inStock: false,
  priceMin: null,
  priceMax: null,
  sort: 'featured',
};

const CLOTHING_SIZE_RE = /^(0P?|[0-4]|XS|S|M|L|XL|XXL)$/i;
const SHOE_SIZE_RE = /^(3[4-9]|4[0-9]|5[0-2])$/;
const ACCESSORY_SIZE_RE = /^(S|M|L|ONE\s*SIZE)$/i;

export function classifySize(value: string): SizeGroup {
  const v = value.trim();
  if (SHOE_SIZE_RE.test(v)) return 'shoes';
  if (ACCESSORY_SIZE_RE.test(v)) return 'accessories';
  if (CLOTHING_SIZE_RE.test(v)) return 'clothing';
  return 'clothing';
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function tagHints(tags: string[] | undefined): string[] {
  return (tags ?? []).map(norm);
}

function materialsFromMetafields(
  metafields: ShopifyProduct['metafields']
): string[] {
  const luxury = parseLuxuryMetafields(metafields);
  return (luxury.materials ?? []).map((m) => m.trim()).filter(Boolean);
}

function hintsFromTagsAndTitle(tags: string[], title: string): string[] {
  return [...tags, norm(title)];
}

export function shopifyToFilterable(product: ShopifyProduct): FilterableProduct {
  const variantNodes = product.variants?.nodes ?? [];
  const tags = tagHints(product.tags);
  const colors = new Set<string>();
  const sizes = new Set<string>();
  const materials = new Set<string>(materialsFromMetafields(product.metafields));
  const sleeves = new Set<string>();

  for (const opt of product.options ?? []) {
    if (isColorOption(opt.name)) opt.values.forEach((v) => colors.add(v));
    if (isSizeOption(opt.name)) opt.values.forEach((v) => sizes.add(v));
  }

  for (const variant of variantNodes) {
    for (const opt of variant.selectedOptions ?? []) {
      if (isColorOption(opt.name)) colors.add(opt.value);
      if (isSizeOption(opt.name)) sizes.add(opt.value);
    }
  }

  for (const tag of tags) {
    for (const mat of MATERIAL_OPTIONS) {
      if (tag.includes(norm(mat))) materials.add(mat);
    }
    for (const sl of SLEEVE_OPTIONS) {
      if (tag.includes(norm(sl)) || tag.includes(norm(sl).replace(' ', '-'))) sleeves.add(sl);
    }
  }

  const available = variantNodes.some((v) => v.availableForSale !== false);

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    price: Number(product.priceRange?.minVariantPrice?.amount ?? 0),
    available,
    colors: [...colors],
    sizes: [...sizes],
    materials: [...materials],
    sleeves: [...sleeves],
    categoryHints: hintsFromTagsAndTitle(tags, product.title),
  };
}

export function catalogToFilterable(product: CatalogProduct): FilterableProduct {
  const category = norm(product.category);
  const title = norm(product.title);
  const hints = [category, title, ...title.split(/\s+/)];

  const sizes = /wedge|shoe|sandal|boot|heel/i.test(product.title)
    ? ['36', '37', '38', '39', '40', '41']
    : ['0P', '0', '1', '2', '3', '4'];

  return {
    id: product.handle,
    handle: product.handle,
    title: product.title,
    price: Number(product.price.replace(/[^\d.]/g, '')) || 0,
    available: !product.soldOut,
    colors: ['Black', 'Natural'],
    sizes,
    materials: [],
    sleeves: [],
    categoryHints: hints,
  };
}

export function extractFacets(products: FilterableProduct[]): ProductFacets {
  const colors = new Set<string>();
  const sizes: Record<SizeGroup, Set<string>> = {
    clothing: new Set(),
    accessories: new Set(),
    shoes: new Set(),
  };
  const materials = new Set<string>();
  const sleeves = new Set<string>();

  for (const p of products) {
    p.colors.forEach((c) => colors.add(c));
    p.sizes.forEach((s) => sizes[classifySize(s)].add(s));
    p.materials.forEach((m) => materials.add(m));
    p.sleeves.forEach((s) => sleeves.add(s));
  }

  const sortAlpha = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' });

  return {
    colors: [...colors].sort(sortAlpha),
    sizes: {
      clothing: [...sizes.clothing].sort(sortAlpha),
      accessories: [...sizes.accessories].sort(sortAlpha),
      shoes: [...sizes.shoes].sort(sortAlpha),
    },
    materials: [...materials].sort(sortAlpha),
    sleeves: [...sleeves].sort(sortAlpha),
    price: priceBoundsFromProducts(products),
  };
}

function matchesCategory(product: FilterableProduct, handle: string | null): boolean {
  if (!handle) return true;
  const cat = CATEGORY_FILTERS.find((c) => c.handle === handle);
  if (!cat) return true;
  return cat.match.some((m) => product.categoryHints.some((h) => h.includes(m)));
}

function matchesList(values: string[], selected: string[]): boolean {
  if (selected.length === 0) return true;
  const set = new Set(values.map(norm));
  return selected.some((s) => set.has(norm(s)));
}

export function applyFilters(products: FilterableProduct[], filters: FilterState): FilterableProduct[] {
  return products.filter((p) => {
    if (!matchesCategory(p, filters.category)) return false;
    if (!matchesList(p.colors, filters.colors)) return false;
    if (!matchesList(p.sizes, filters.sizes)) return false;
    if (!matchesList(p.materials, filters.materials)) return false;
    if (!matchesList(p.sleeves, filters.sleeves)) return false;
    if (filters.inStock && !p.available) return false;
    if (filters.priceMin != null && p.price < filters.priceMin) return false;
    if (filters.priceMax != null && p.price > filters.priceMax) return false;
    return true;
  });
}

export function applySort<T extends { price: number }>(
  products: T[],
  sort: FilterState['sort']
): T[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted;
  }
}

/** When price range is narrowed, show results lowest → highest. */
export function resolveEffectiveSort(
  filters: FilterState,
  bounds: PriceBounds
): FilterState['sort'] {
  if (isPriceFilterActive(filters, bounds)) return 'price-asc';
  return filters.sort;
}

export function filterAndSortProducts(
  products: FilterableProduct[],
  filters: FilterState,
  bounds: PriceBounds
): FilterableProduct[] {
  return applySort(applyFilters(products, filters), resolveEffectiveSort(filters, bounds));
}

export function toURLSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, v);
    } else {
      params.set(key, value);
    }
  }
  return params;
}

function categoryHandlesForProducts(products: FilterableProduct[]): Set<string> {
  const handles = new Set<string>();
  for (const cat of CATEGORY_FILTERS) {
    if (products.some((p) => cat.match.some((m) => p.categoryHints.some((h) => h.includes(m))))) {
      handles.add(cat.handle);
    }
  }
  return handles;
}

/** Drop URL/filter selections that match zero products in this collection. */
export function sanitizeFilters(
  filters: FilterState,
  facets: ProductFacets,
  products: FilterableProduct[]
): FilterState {
  const categories = categoryHandlesForProducts(products);
  const allSizes = new Set(Object.values(facets.sizes).flat());
  const normSet = (items: string[]) => new Set(items.map(norm));

  return clampPriceFilters(
    {
      ...filters,
      category: filters.category && categories.has(filters.category) ? filters.category : null,
      colors: filters.colors.filter((c) => normSet(facets.colors).has(norm(c))),
      sizes: filters.sizes.filter((s) => allSizes.has(s)),
      materials: filters.materials.filter((m) => normSet(facets.materials).has(norm(m))),
      sleeves: filters.sleeves.filter((s) => normSet(facets.sleeves).has(norm(s))),
    },
    facets.price
  );
}

export function buildFilterState(
  searchParams: Record<string, string | string[] | undefined>,
  facets: ProductFacets,
  products: FilterableProduct[]
): FilterState {
  return sanitizeFilters(parseFilterState(toURLSearchParams(searchParams)), facets, products);
}

function parsePriceParam(value: string | null): number | null {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseFilterState(params: URLSearchParams): FilterState {
  const sort = params.get('sort');
  return {
    category: params.get('category'),
    colors: params.get('color')?.split(',').filter(Boolean) ?? [],
    sizes: params.get('size')?.split(',').filter(Boolean) ?? [],
    materials: params.get('material')?.split(',').filter(Boolean) ?? [],
    sleeves: params.get('sleeve')?.split(',').filter(Boolean) ?? [],
    inStock: params.get('inStock') === '1',
    priceMin: parsePriceParam(params.get('priceMin')),
    priceMax: parsePriceParam(params.get('priceMax')),
    sort: sort === 'price-asc' || sort === 'price-desc' ? sort : 'featured',
  };
}

export function filterStateToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.colors.length) params.set('color', filters.colors.join(','));
  if (filters.sizes.length) params.set('size', filters.sizes.join(','));
  if (filters.materials.length) params.set('material', filters.materials.join(','));
  if (filters.sleeves.length) params.set('sleeve', filters.sleeves.join(','));
  if (filters.inStock) params.set('inStock', '1');
  if (filters.priceMin != null) params.set('priceMin', String(filters.priceMin));
  if (filters.priceMax != null) params.set('priceMax', String(filters.priceMax));
  if (filters.sort !== 'featured') params.set('sort', filters.sort);
  return params;
}

export function activeFilterCount(filters: FilterState, bounds?: PriceBounds): number {
  let n = 0;
  if (filters.category) n++;
  n += filters.colors.length;
  n += filters.sizes.length;
  n += filters.materials.length;
  n += filters.sleeves.length;
  if (filters.inStock) n++;
  if (bounds ? isPriceFilterActive(filters, bounds) : filters.priceMin != null || filters.priceMax != null) n++;
  if (filters.sort !== 'featured') n++;
  return n;
}

// ponytail: dev-only sanity check
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  const sample: FilterableProduct[] = [
    {
      id: '1',
      handle: 'x',
      title: 'Denim Jean',
      price: 100,
      available: true,
      colors: ['Blue'],
      sizes: ['2', '4'],
      materials: ['Cotton'],
      sleeves: [],
      categoryHints: ['denim', 'jean'],
    },
    {
      id: '2',
      handle: 'y',
      title: 'Silk Dress',
      price: 200,
      available: false,
      colors: ['Black'],
      sizes: ['S'],
      materials: ['Silk'],
      sleeves: ['Long Sleeve'],
      categoryHints: ['dress'],
    },
  ];
  const filtered = applyFilters(sample, {
    category: 'denim',
    colors: [],
    sizes: [],
    materials: [],
    sleeves: [],
    inStock: true,
    priceMin: null,
    priceMax: null,
    sort: 'featured',
  });
  const priced = applyFilters(sample, {
    category: null,
    colors: [],
    sizes: [],
    materials: [],
    sleeves: [],
    inStock: false,
    priceMin: 150,
    priceMax: 250,
    sort: 'featured',
  });
  if (filtered.length !== 1 || filtered[0]?.handle !== 'x' || priced.length !== 1 || priced[0]?.handle !== 'y') {
    console.error('[product-filters] self-check failed');
  }
  if (resolveEffectiveSort(
    {
      category: null,
      colors: [],
      sizes: [],
      materials: [],
      sleeves: [],
      inStock: false,
      priceMin: 150,
      priceMax: 250,
      sort: 'featured',
    },
    { min: 100, max: 300 }
  ) !== 'price-asc') {
    console.error('[product-filters] resolveEffectiveSort self-check failed');
  }
}
