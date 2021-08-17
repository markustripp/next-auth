# NextAuth.js for Shopify app development

NextAuth.js is the default oAuth authentication framework for Next.js. It is also perfect for the oAuth authentication flow for [Shopify apps](https://shopify.dev/apps/auth/oauth).

Differences to standard NextAuth.js oAuth flow:

- Shopify apps authenticate Shopify stores where the app is installed not the individual user. Therefore we store the shop domain as user.email.
- The oAuth authentication is performed for each individual store the app is installed. Therefore the oAuth endpoints for accessTokenUrl, authorizationUrl, profileUrl are shop dependent.
- Shopify API calls pass the access token in a "X-Shopify-Access-Token" header instead of the standard "Bearer".

In addition Shopify requires HMAC to verify the authenticity of requests from Shopify and session tokens (JWT) for communication. Even if I think with this setup JWT authentication could be omitted.

Changes in NextAuth.js required for Shopify app authentication:

**./src/providers/shopify-app.js**
Provider configuration for Shopify app development

**./src/server/lib/signin.js** (line 14 to 16)
Replace authorization url with the shop passed as parameter to `signIn()`
```javascript
if (provider.id === 'shopify-app') {
	provider.authorizationUrl = provider.authorizationUrl.replace('{shop}', params.shop)
}
```

**./src/server/lib/oauth/callback.js** (line 47 to 50)
Replace url to retrieve access token and profile with the shop retrieved as callback from the Shopify oAuth flow.
```javascript
if (provider.id === "shopify-app") {
  provider.accessTokenUrl = provider.accessTokenUrl.replace('{shop}', req.query.shop)
	provider.profileUrl = provider.profileUrl.replace('{shop}', req.query.shop)
}
```

**./src/server/lib/oauth/client.js** (line 243 to 246)
Set Shopify access token header to for authentication to retrieve profile data.
```javascript
if (provider.id === 'shopify-app') {
  headers['X-Shopify-Access-Token'] = accessToken
  accessToken = null
}
```

**./app/pages/shopify.js**
Example workflow. See example on how to add the authentication logic to _app.js.

For a full example see [Github link to example]

I added required modifications to NextAuth.js to this fork as I needed the functionality right now. But I created a [pull request] to NextAuth.js to include the changes to NextAuth.js core. Please give your feedback and comment on the implementation directly on the pull request.

