import { getSession, signIn, signOut } from 'next-auth/client'
import { AppProvider, Heading, Page } from '@shopify/polaris'
import { Provider } from '@shopify/app-bridge-react'
import '@shopify/polaris/dist/styles.css'
import { useEffect } from 'react'

const Shopify = ({ host, apiKey, redirect }) => {
	useEffect(() => {
		console.log('useEffect')
		console.log('host', host)
		console.log('apiKey', apiKey)
		console.log('redirect', redirect)
	
		if (redirect === 'signIn') return signIn('shopify-app', {}, { host: host })
		if (redirect === 'signOut') return signOut()
	}, [])

	return <>
		{ !redirect && 
			<AppProvider>
				<Provider config={{
					apiKey: apiKey,
					host: host
				}}>
					<Page>
						<Heading>Hello Mex</Heading>
					</Page>
				</Provider>
			</AppProvider>
		}
	</>
}

const verifyHmac = (query) => {
	console.log('verify hmac', query)

	if (!('hmac' in query)) return null
	
	// verify hmac and return objects, null otherwise
	return {
		host: 'checkout-meilisearch-dev.myshopify.com'
	}
}

const getServerSideProps = async (context) => {
	console.log(context.query);

	const params = verifyHmac(context.query)
	if (!params) return { notFound: true }

	const { host } = params
	const session = await getSession(context)
	
	// if session is empty signIn and go through Shopify oAuth flow
	// Shopify authenticates shops not users. So if session email not equal host browser is authenticated to other shop. Therefore signOut first and then signIn to this shop
	let redirect = null
	if (!session) { redirect = 'signIn' }
	else if (session.user.email !== host) { redirect = 'signOut' }

	return {
		props: {
			host: host,
			redirect: redirect,
			apiKey: redirect ? null : process.env.SHOPIFY_APP_ID
		}
	}

	// API: just call verifyHmac and getSession to retrieve token. JWT decode authenticatedFetch token?
	// Shopify authenticatedFetch: authenticatedFetch shop == session.email!
}

export default Shopify
export { getServerSideProps }