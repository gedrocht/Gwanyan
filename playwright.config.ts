import { defineConfig, devices } from '@playwright/test';

/**
 * Browser tests run against the local Vite development server because this
 * exercise is a purely client-side application. The same configuration is
 * used in GitHub Actions to keep local and remote behavior aligned.
 */
export default defineConfig({
  testDir: './tests/end-to-end',
  timeout: 60_000,
  fullyParallel: true,
  outputDir: './test-results/browser-artifacts',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'test-results/playwright-report' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 4173,
    reuseExistingServer: process.env.CI === undefined,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
