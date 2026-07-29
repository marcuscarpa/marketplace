import { getShopifyClient, isShopifyConfigured } from '@/lib/shopify/client';

export const FOOTER_CATALOG_MENU_HANDLE = 'footer';

export interface ShopifyMenuItem {
  title: string;
  url: string;
  type: string;
  items?: ShopifyMenuItem[];
}

export interface ShopifyMenu {
  id: string;
  title: string;
  items: ShopifyMenuItem[];
}

export const GET_MENU_BY_HANDLE = `
  query GetMenuByHandle($handle: String!) {
    menu(handle: $handle) {
      id
      title
      items {
        title
        url
        type
        items {
          title
          url
          type
        }
      }
    }
  }
`;

export async function fetchFooterCatalogMenu(locale: string): Promise<ShopifyMenu | null> {
  if (!isShopifyConfigured(locale)) return null;

  try {
    const client = getShopifyClient(locale);
    const data = await client.execute<{ menu: ShopifyMenu | null }>(
      GET_MENU_BY_HANDLE,
      { handle: FOOTER_CATALOG_MENU_HANDLE },
      `shopify:menu:${FOOTER_CATALOG_MENU_HANDLE}:${locale}`
    );
    return data.menu;
  } catch {
    return null;
  }
}
