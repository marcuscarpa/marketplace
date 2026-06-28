export interface LuxuryMetafields {
  certificateHash?: string;
  materials?: string[];
  madeIn?: string;
  video360Url?: string;
  limitedEditionNumber?: number;
  careInstructions?: string;
  averageRating?: number;
  totalReviews?: number;
}

export interface ShopifyProductOption {
  name: string;
  values: string[];
}

export interface ShopPayInstallmentsPricing {
  eligible?: boolean;
  installmentsCount?: { count?: number } | null;
  pricePerTerm?: { amount: string; currencyCode: string };
  fullPrice?: { amount: string; currencyCode: string };
}

export interface ShopifyProductVariant {
  id: string;
  availableForSale?: boolean;
  quantityAvailable?: number | null;
  shopPayInstallmentsPricing?: ShopPayInstallmentsPricing | null;
  price: { amount: string; currencyCode?: string };
  selectedOptions?: Array<{ name: string; value: string }>;
  image?: { url: string; altText: string | null } | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor: string;
  tags?: string[];
  publishedAt?: string | null;
  totalInventory?: number | null;
  images: { nodes: Array<{ url: string; altText: string | null }> };
  options?: ShopifyProductOption[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  variants: {
    nodes: ShopifyProductVariant[];
  };
  metafields: Array<{
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions?: Array<{ name: string; value: string }>;
    product: {
      id: string;
      title: string;
      handle: string;
      images: { nodes: Array<{ url: string; altText: string | null }> };
    };
    quantityAvailable?: number | null;
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    nodes: CartLine[];
  };
  cost: {
    totalAmount: { amount: string; currencyCode: string };
    subtotalAmount: { amount: string; currencyCode: string };
    totalTaxAmount: { amount: string; currencyCode: string } | null;
  };
}
