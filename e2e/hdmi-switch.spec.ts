import { expect, test, type Page, type Route } from '@playwright/test';

const GRAPHQL_URL = 'https://graphql.morrisons.site/';

// Set to "false" for the post-deploy smoke run against the real, live app —
// see the `@smoke` test below, the only one safe to run unmocked (it doesn't
// assume which input is active, and it never switches anything).
const MOCKS_ENABLED = process.env.E2E_MOCK_API !== 'false';

async function mockGraphql(
  page: Page,
  handlers: Record<
    string,
    (route: Route, body: { variables?: Record<string, unknown> }) => Promise<void> | void
  >,
) {
  await page.route(GRAPHQL_URL, async (route) => {
    const body = route.request().postDataJSON() as {
      operationName?: string;
      variables?: Record<string, unknown>;
    };
    const handler = body.operationName ? handlers[body.operationName] : undefined;
    if (!handler) {
      await route.fulfill({
        status: 400,
        json: { errors: [{ message: `no handler for ${body.operationName}` }] },
      });
      return;
    }
    await handler(route, body);
  });
}

test('shows the currently active input on load', async ({ page }) => {
  await mockGraphql(page, {
    CurrentInput: async (route) => {
      await route.fulfill({ json: { data: { currentInput: 'PS3' } } });
    },
  });

  await page.goto('/');

  const ps3Button = page.getByRole('button', { name: /ps3/i });
  await expect(ps3Button).toHaveAttribute('aria-pressed', 'true');
  await expect(ps3Button.getByText('Active')).toBeVisible();
  await expect(page.getByRole('button', { name: /switch/i })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

test('tapping an input switches it, showing a loading state first', async ({ page }) => {
  await mockGraphql(page, {
    CurrentInput: async (route) => {
      await route.fulfill({ json: { data: { currentInput: 'PS3' } } });
    },
    SetInput: async (route, body) => {
      // Slow this down slightly so the pending/disabled state is observable.
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.fulfill({ json: { data: { setInput: body.variables?.input } } });
    },
  });

  await page.goto('/');
  const switchButton = page.getByRole('button', { name: /switch/i });
  await expect(page.getByRole('button', { name: /ps3/i })).toHaveAttribute('aria-pressed', 'true');

  await switchButton.click();

  // Optimistic/loading state: the tapped button (and its siblings) are
  // disabled while the mutation is in flight.
  await expect(switchButton).toBeDisabled();

  await expect(switchButton).toHaveAttribute('aria-pressed', 'true', { timeout: 5000 });
  await expect(page.getByRole('button', { name: /ps3/i })).toHaveAttribute('aria-pressed', 'false');
  await expect(switchButton).toBeEnabled();
});

test('shows a visible error when the backend reports the device is unreachable', async ({
  page,
}) => {
  await mockGraphql(page, {
    CurrentInput: async (route) => {
      await route.fulfill({ json: { errors: [{ message: 'device unreachable' }] } });
    },
  });

  await page.goto('/');

  const alert = page.getByRole('alert');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText(/couldn't reach the hdmi switch/i);
  await expect(alert).toContainText(/device unreachable/i);
  await expect(page.getByRole('group', { name: /hdmi inputs/i })).toHaveCount(0);
});

test('shows a visible error and keeps prior state when switching fails', async ({ page }) => {
  let mutationCalls = 0;
  await mockGraphql(page, {
    CurrentInput: async (route) => {
      await route.fulfill({ json: { data: { currentInput: 'GOOGLE_TV' } } });
    },
    SetInput: async (route) => {
      mutationCalls += 1;
      await route.fulfill({ json: { errors: [{ message: 'device unreachable' }] } });
    },
  });

  await page.goto('/');
  await expect(page.getByRole('button', { name: /google tv/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.getByRole('button', { name: /apple tv/i }).click();

  const alert = page.getByRole('alert');
  await expect(alert).toContainText(/device unreachable/i);
  expect(mutationCalls).toBe(1);

  // The switch failed server-side, so the UI must still reflect the last
  // known-good state rather than silently claiming success.
  await expect(page.getByRole('button', { name: /google tv/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('button', { name: /apple tv/i })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

// The only test in this file that's safe to run against the real, live app:
// it makes no assumption about *which* input is active (that's real, mutable
// hardware state) and never taps a button, so it can never flip the switch.
// Run with E2E_MOCK_API=false to skip mocking and hit the real backend.
test('shows exactly one active input on load', { tag: '@smoke' }, async ({ page }) => {
  if (MOCKS_ENABLED) {
    await mockGraphql(page, {
      CurrentInput: async (route) => {
        await route.fulfill({ json: { data: { currentInput: 'PS4' } } });
      },
    });
  }

  await page.goto('/');

  const inputGroup = page.getByRole('group', { name: /hdmi inputs/i });
  await expect(inputGroup.getByRole('button')).toHaveCount(5);
  await expect(inputGroup.getByRole('button', { pressed: true })).toHaveCount(1);
});
