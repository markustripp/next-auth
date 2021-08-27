export default function ShopifyApp(options) {
  return {
    id: "shopify-app",
    name: "Shopify App",
    type: "oauth",
    version: "2.0",
    scope: "read_products,write_products",
    useAuthTokenHeader: false,
    accessTokenUrl: "https://{shop}/admin/oauth/access_token",
    authorizationUrl: "https://{shop}/admin/oauth/authorize",
    profileUrl: "https://{shop}/admin/api/2021-07/shop.json",
    profile(profile, tokens) {
      return {
        id: profile.shop.id,
        name: profile.shop.name,
        email: profile.shop.domain
      }
    },
    protection: "state",
    ...options,
  }
}
