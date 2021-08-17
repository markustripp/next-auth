import { useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/client'
import crypto from 'crypto'
import { Provider } from '@shopify/app-bridge-react'
import { AppProvider, Heading, Page } from '@shopify/polaris'
import '@shopify/polaris/dist/styles.css'

const Shopify = ({ shop, host, apiKey }) => {
  const [session, loading] = useSession()

	useEffect(() => {
		if (!loading) {
			if (!session) signIn('shopify-app', {}, { shop: shop })
			if (session && session.user.email !== shop) signOut()
		}
	}, [loading])

	return (session && session.user.email === shop)
		? <ShopifyApp host={ host } apiKey={ apiKey } /> 
		: null
}

const ShopifyApp = ({ host, apiKey}) => (
	<AppProvider>
		<Provider
			config={{
				apiKey: apiKey,
				host: host,
			}}
		>
			<Page>
				<Heading>Hello Mex</Heading>
			</Page>
		</Provider>
	</AppProvider>
)

const verifyHmac = (query) => {
	if (!('hmac' in query)) return null

	const sorted = Object.keys(query).sort((v1, v2) => {
		return v1.localeCompare(v2)
	}).reduce((map, key) => {
		map[key] = query[key]
		return map
	}, {})

	delete sorted.hmac
	delete sorted.signature

	const digest = crypto
    .createHmac("sha256", process.env.SHOPIFY_APP_SECRET)
    .update(new URLSearchParams(sorted).toString())
    .digest("hex")

	console.log('verify hmac', digest, query.hmac, query)

	// return digest === query.hmac ? sorted : null
	return sorted;
}

const getServerSideProps = async (context) => {
  console.log('getServerSideProps query params', context.query)

  const params = verifyHmac(context.query)
  if (!params) return { notFound: true }

  return {
    props: {
      shop: params.shop,
			host: params.host || null,
      apiKey: process.env.SHOPIFY_APP_ID,
    },
  }
}

export default Shopify
export { getServerSideProps }
