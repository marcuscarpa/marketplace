export const WISHLIST_METAFIELD_NAMESPACE = 'custom';
export const WISHLIST_METAFIELD_KEY = 'wishlist';
export const WISHLIST_METAFIELD_TYPE = 'json';

export const GET_CUSTOMER_WISHLIST_METAFIELD = `
  query GetCustomerWishlistMetafield {
    customer {
      id
      metafield(namespace: "${WISHLIST_METAFIELD_NAMESPACE}", key: "${WISHLIST_METAFIELD_KEY}") {
        value
      }
    }
  }
`;

export const SET_CUSTOMER_METAFIELDS = `
  mutation SetCustomerMetafields($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        namespace
        key
        value
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;
