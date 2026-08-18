import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const DEFAULT_GRAPHQL_ENDPOINT = 'https://graphql.morrisons.site/';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT ?? DEFAULT_GRAPHQL_ENDPOINT;

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_ENDPOINT }),
  cache: new InMemoryCache(),
  // This is a remote control for a live device: a cached/stale answer to
  // "what input is active right now" is actively misleading, so always hit
  // the network instead of trusting the cache for reads.
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});
