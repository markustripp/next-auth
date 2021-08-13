export default function ShopifyApp(options) {
  return {
	id: 'shopify-app',
	name: 'Shopify App',
	type: 'oauth',
	version: '2.0',
	scope: 'read_products,write_products',
	useAuthTokenHeader: false,
	accessTokenUrl: 'https://{host}/admin/oauth/access_token',
	authorizationUrl: 'https://{host}/admin/oauth/authorize',
	profileUrl: 'https://{host}/admin/api/2021-04/shop.json',
	profile(profile) {
		return {
			id: profile.shop.id,
			name: profile.shop.name,
			email: profile.shop.name
		  }
	},
	protection: 'state',
	...options,
  }
}
