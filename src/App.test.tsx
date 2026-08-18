import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApolloProvider } from '@apollo/client';
import { delay, HttpResponse } from 'msw';
import App from './App';
import { apolloClient } from './apolloClient';
import { server } from './test/msw/server';
import { api } from './test/msw/handlers';

function renderApp() {
  return render(
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>,
  );
}

describe('App', () => {
  it('loads and shows the currently active input', async () => {
    renderApp();

    expect(screen.getByText(/loading current input/i)).toBeInTheDocument();

    const ps4Button = await screen.findByRole('button', { name: /ps4/i });
    await waitFor(() => expect(ps4Button).toHaveAttribute('aria-pressed', 'true'));
    expect(screen.getByRole('button', { name: /apple tv/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('switches to a tapped input, showing a pending state before it confirms', async () => {
    server.use(
      api.mutation('SetInput', async ({ variables }) => {
        await delay(50);
        return HttpResponse.json({ data: { setInput: variables.input } });
      }),
    );

    const user = userEvent.setup();
    renderApp();

    const switchButton = await screen.findByRole('button', { name: /switch/i });
    expect(switchButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(switchButton);

    // While the mutation is in flight, the button is disabled to make the
    // pending state visible (rather than silently waiting).
    expect(switchButton).toBeDisabled();

    await waitFor(() => expect(switchButton).toHaveAttribute('aria-pressed', 'true'));
    expect(switchButton).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /ps4/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows a visible error when the initial load fails', async () => {
    server.use(
      api.query('CurrentInput', () =>
        HttpResponse.json({ errors: [{ message: 'device unreachable' }] }),
      ),
    );

    renderApp();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/couldn't reach the hdmi switch/i);
    expect(alert).toHaveTextContent(/device unreachable/i);
    // No stale/placeholder input state should be rendered for a remote control.
    expect(screen.queryByRole('group', { name: /hdmi inputs/i })).not.toBeInTheDocument();
  });

  it('shows a visible error and preserves prior state when switching fails', async () => {
    const user = userEvent.setup();
    renderApp();

    const ps4Button = await screen.findByRole('button', { name: /ps4/i });
    await waitFor(() => expect(ps4Button).toHaveAttribute('aria-pressed', 'true'));

    server.use(
      api.mutation('SetInput', () =>
        HttpResponse.json({ errors: [{ message: 'device unreachable' }] }),
      ),
    );

    await user.click(screen.getByRole('button', { name: /apple tv/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/device unreachable/i);

    // The switch failed, so the UI must not silently claim it succeeded.
    expect(screen.getByRole('button', { name: /ps4/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /apple tv/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('does nothing when tapping the already-active input', async () => {
    let mutationCalled = false;
    server.use(
      api.mutation('SetInput', ({ variables }) => {
        mutationCalled = true;
        return HttpResponse.json({ data: { setInput: variables.input } });
      }),
    );

    const user = userEvent.setup();
    renderApp();

    const ps4Button = await screen.findByRole('button', { name: /ps4/i });
    await waitFor(() => expect(ps4Button).toHaveAttribute('aria-pressed', 'true'));

    await user.click(ps4Button);

    expect(mutationCalled).toBe(false);
    expect(ps4Button).not.toBeDisabled();
  });

  it('lets the user retry after the initial load fails', async () => {
    server.use(
      api.query('CurrentInput', () =>
        HttpResponse.json({ errors: [{ message: 'device unreachable' }] }),
      ),
    );

    const user = userEvent.setup();
    renderApp();

    const retryButton = await screen.findByRole('button', { name: /retry/i });

    server.use(
      api.query('CurrentInput', () => HttpResponse.json({ data: { currentInput: 'PS4' } })),
    );
    await user.click(retryButton);

    const ps4Button = await screen.findByRole('button', { name: /ps4/i });
    await waitFor(() => expect(ps4Button).toHaveAttribute('aria-pressed', 'true'));
  });

  it('shows a visible error when the switch does not confirm the change', async () => {
    server.use(api.mutation('SetInput', () => HttpResponse.json({ data: { setInput: null } })));

    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole('button', { name: /apple tv/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/did not confirm the change/i);
  });
});
