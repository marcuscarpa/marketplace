import { MENU_SECTIONS } from '@/lib/catalog/menu';

export const POPULAR_SEARCHES = {
  en: ['denim', 'bags', 'bracelets', 'women', 'accessories', 'new', 'sale'],
  pt: ['denim', 'bolsas', 'pulseiras', 'mulheres', 'acessórios', 'novidades', 'sale'],
} as const;

export function getSearchCategories(locale: string) {
  const queries: Record<string, string> = {
    'New Arrivals': 'new',
    All: 'women',
    Women: 'women',
    Swimwear: 'swimwear',
    'Ready-to-Wear': 'ready-to-wear',
    Collections: 'collections',
    Accessories: 'accessories',
  };

  return MENU_SECTIONS.products.links.map((link) => ({
    label: link.label,
    href: `/${locale}/${link.href}`,
    query: queries[link.label] ?? link.label.toLowerCase(),
  }));
}

export function getSearchCopy(locale: string) {
  const isPt = locale === 'pt';
  return {
    placeholder: isPt ? 'Buscar produtos' : 'Search items',
    popular: isPt ? 'Buscas populares' : 'Popular searches',
    category: isPt ? 'Categoria' : 'Category',
    items: isPt ? 'Itens' : 'Items',
    viewAll: isPt ? 'Ver todos' : 'View all',
    was: isPt ? 'Antes' : 'Was',
    now: isPt ? 'Agora' : 'Now',
    noResults: isPt ? 'Nenhum item encontrado' : 'No items found',
    searching: isPt ? 'Buscando…' : 'Searching…',
  };
}
