import { HttpLink } from "@apollo/client"
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from "@apollo/experimental-nextjs-app-support/ssr"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc"

console.log(`${process.env.NEXT_PUBLIC_URL}`)

export const { getClient } = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: `${typeof window === 'undefined' ? `${process.env.NEXT_PUBLIC_URL}` : ''}/graphql`,
      fetchOptions: {
        timeout: 360000, 
        
      },
    }),
  });
});
