import { useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/client'
import { Provider } from '@shopify/app-bridge-react'
import { AppProvider, Heading, Page } from '@shopify/polaris'
import '@shopify/polaris/dist/styles.css'

const verifyHmac = (query) => {
	console.log('verify hmac', query)

	if (!('hmac' in query)) return null
	
	// verify hmac and return objects, null otherwise
	return {
		host: 'checkout-meilisearch-dev.myshopify.com'
	}
}

const Shopify2 = ({ host, apiKey}) => {
	const [session, loading] = useSession()

	useEffect(() => {
		if (loading) return
		if (!session) return signIn('shopify-app', {}, { host: host })
		if (session.user.email !== host) return signOut()
	}, [loading])

	return <>
		{ session && 
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

const getServerSideProps = async (context) => {
	const params = verifyHmac(context.query)
	if (!params) return { notFound: true }

	return {
		props: {
			host: params.host,
			apiKey: process.env.SHOPIFY_APP_ID
		}
	}
}

export default Shopify2
export { getServerSideProps }