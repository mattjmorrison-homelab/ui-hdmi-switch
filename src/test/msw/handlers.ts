import { graphql, HttpResponse } from 'msw';
import { DEFAULT_GRAPHQL_ENDPOINT } from '../../apolloClient';

const api = graphql.link(DEFAULT_GRAPHQL_ENDPOINT);

// Default happy-path handlers. Individual tests override these with
// `server.use(...)` to exercise loading/error paths.
export const handlers = [
  api.query('CurrentInput', () => HttpResponse.json({ data: { currentInput: 'PS4' } })),
  api.mutation('SetInput', ({ variables }) =>
    HttpResponse.json({ data: { setInput: variables.input } }),
  ),
];

export { api };
