import { defineConfig, devices } from '@playwright/test';

// PLAYWRIGHT_BASE_URL lets the post-deploy smoke run point at the real,
// live app instead of a locally-built preview server (see package.json's
// `test:e2e:smoke` script). When it's set, there's nothing local to start.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4173';
const targetingLocalPreview = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['line']] : [['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: targetingLocalPreview
    ? {
        command: 'npm run preview -- --port 4173',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
});
