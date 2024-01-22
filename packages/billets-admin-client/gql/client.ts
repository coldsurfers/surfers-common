import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import storage from '../utils/storage/storage'
import { onError } from '@apollo/client/link/error'

const NON_AUTH_PATH_WHITE_LIST = ['/auth/signin', '/auth/request']

console.log('NEXT_PUBLIC_GRAPHQL_URI', process.env.NEXT_PUBLIC_GRAPHQL_URI)

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
})

const authLink = setContext((_, { headers }) => {
  const token = storage.get<string>('@fstvllife/token')
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, forward, operation }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        // Apollo Server sets code to UNAUTHENTICATED
        // when an AuthenticationError is thrown in a resolver
        case 401:
          if (storage.get<string>('@fstvllife/token')) {
            storage.remove('@fstvllife/token')
          }
          if (
            NON_AUTH_PATH_WHITE_LIST.every(
              (value) => document.location.pathname !== value
            )
          ) {
            document.location.href = '/auth/signin'
          }
          // Modify the operation context with a new token
          // const oldHeaders = operation.getContext().headers;
          // operation.setContext({
          //   headers: {
          //     ...oldHeaders,
          //     authorization: getNewToken(),
          //   },
          // });
          // Retry the request, returning the new observable
          // return forward(operation);
          return forward(operation)
      }
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
})

export default client
