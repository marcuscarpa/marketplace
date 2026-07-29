export const SEARCH_PRODUCTS = `
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      nodes {
        ... on Product {
          id
          title
          handle
          description
          images(first: 2) { nodes { url altText } }
          priceRange { minVariantPrice { amount currencyCode } }
          variants(first: 1) {
            nodes {
              id
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }
          }
          vendor
          tags
          metafields(namespace: "luxury") {
            key
            value
            type
            namespace
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      vendor
      images(first: 8) { nodes { url altText } }
      options { name values }
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 100) {
        nodes {
          id
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          selectedOptions { name value }
          image { url altText }
        }
      }
      metafields(identifiers: [
        { namespace: "luxury", key: "certificate_hash" }
        { namespace: "luxury", key: "materials" }
        { namespace: "luxury", key: "made_in" }
        { namespace: "luxury", key: "video_360_url" }
        { namespace: "luxury", key: "limited_edition_number" }
        { namespace: "luxury", key: "care_instructions" }
        { namespace: "reviews", key: "average_rating" }
        { namespace: "reviews", key: "total_reviews" }
      ]) {
        key
        value
        type
        namespace
      }
    }
  }
`;

export const PRODUCT_RECOMMENDATIONS = `
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      images(first: 2) { nodes { url altText } }
      priceRange { minVariantPrice { amount currencyCode } }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      image { url altText }
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          description
          handle
          vendor
          productType
          tags
          publishedAt
          totalInventory
          images(first: 2) { nodes { url altText } }
          options { name values }
          priceRange { minVariantPrice { amount currencyCode } }
          variants(first: 50) {
            nodes {
              id
              availableForSale
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              selectedOptions { name value }
            }
          }
          metafields(identifiers: [
            { namespace: "luxury", key: "certificate_hash" }
            { namespace: "luxury", key: "materials" }
            { namespace: "luxury", key: "made_in" }
            { namespace: "luxury", key: "video_360_url" }
            { namespace: "luxury", key: "limited_edition_number" }
            { namespace: "luxury", key: "care_instructions" }
            { namespace: "reviews", key: "average_rating" }
            { namespace: "reviews", key: "total_reviews" }
          ]) {
            key
            value
            type
            namespace
          }
        }
      }
    }
  }
`;

export const GET_SALE_PRODUCTS = `
  query GetSaleProducts($first: Int!, $query: String!) {
    products(first: $first, query: $query) {
      nodes {
        id
        title
        description
        handle
        vendor
        tags
        publishedAt
        totalInventory
        images(first: 2) { nodes { url altText } }
        options { name values }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 50) {
          nodes {
            id
            availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
          }
        }
        metafields(identifiers: [
          { namespace: "luxury", key: "certificate_hash" }
          { namespace: "luxury", key: "materials" }
          { namespace: "luxury", key: "made_in" }
          { namespace: "luxury", key: "video_360_url" }
          { namespace: "luxury", key: "limited_edition_number" }
          { namespace: "luxury", key: "care_instructions" }
          { namespace: "reviews", key: "average_rating" }
          { namespace: "reviews", key: "total_reviews" }
        ]) {
          key
          value
          type
          namespace
        }
      }
    }
  }
`;

export const GET_COLLECTIONS = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        description
        image { url altText }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_COLLECTION = `
  query GetProductsByCollection($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      products(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          title
          handle
          vendor
          images(first: 2) { nodes { url altText } }
          priceRange { minVariantPrice { amount currencyCode } }
          variants(first: 1) { nodes { id price { amount } } }
        }
      }
    }
  }
`;

export const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText }
            selectedOptions { name value }
            product {
              id
              title
              handle
              featuredImage { url altText }
              images(first: 2) { nodes { url altText } }
            }
            quantityAvailable
            price { amount currencyCode }
          }
        }
      }
    }
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
  }
`;

export const CART_CREATE = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_ADD = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_UPDATE = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_REMOVE = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;