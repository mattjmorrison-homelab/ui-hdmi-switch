import { graphql, HttpResponse } from 'msw';
import { DEFAULT_GRAPHQL_ENDPOINT } from '../../apolloClient';

const api = graphql.link(DEFAULT_GRAPHQL_ENDPOINT);

// Matches the real backend's configured order: Apple TV renders as the
// hero row, the rest pair up two-per-row.
export const DEFAULT_INPUTS = [
  { value: 'APPLE_TV', label: 'Apple TV', icon: 'tv', hoverText: 'Apple TV', isActive: false },
  { value: 'PC', label: 'PC', icon: 'monitor', hoverText: 'PC', isActive: false },
  {
    value: 'SWITCH',
    label: 'Switch',
    icon: 'joystick',
    hoverText: 'Nintendo Switch',
    isActive: false,
  },
  { value: 'PS3', label: 'PS3', icon: 'gamepad', hoverText: 'PlayStation 3', isActive: false },
  { value: 'PS4', label: 'PS4', icon: 'gamepad-2', hoverText: 'PlayStation 4', isActive: true },
];

// Default happy-path handlers. Individual tests override these with
// `server.use(...)` to exercise loading/error paths.
export const handlers = [
  api.query('Inputs', () => HttpResponse.json({ data: { inputs: DEFAULT_INPUTS } })),
  api.mutation('SetInput', ({ variables }) =>
    HttpResponse.json({ data: { setInput: variables.input } }),
  ),
];

export { api };
