import { createHash } from 'node:crypto';
import { defineConfig, devices } from '@playwright/test';

// Derived from the checkout path so parallel worktrees do not share a port.
const port =
  Number(process.env.BROWSER_TEST_PORT) ||
  4100 + (createHash('sha1').update(__dirname).digest().readUInt16BE(0) % 800);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.browser.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  outputDir: './test-results',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'yarn vite --config tests/browser/vite.config.ts',
    url: baseURL,
    env: { BROWSER_TEST_PORT: String(port) },
    reuseExistingServer: false,
  },
});
