/**
 * Playwright Configuration for WordPress Block Plugin E2E Tests
 *
 * Complete configuration for testing WordPress block plugin releases
 * across multiple browsers, devices, and viewport sizes.
 */

import { defineConfig, devices } from '@playwright/test';
import { testConfig, getConfigForEnvironment } from './fixtures/test-config';

const env = (process.env.TEST_ENV || 'local') as 'local' | 'ci' | 'staging' | 'production';
const envConfig = getConfigForEnvironment(env);
const finalConfig = { ...testConfig, ...envConfig };

export default defineConfig({
  testDir: './tests',

  // Test file patterns
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],

  // Timeout configuration
  timeout: finalConfig.timeout,
  expect: {
    timeout: 5000,
  },

  // Global timeout
  globalTimeout: 30 * 60 * 1000, // 30 minutes

  // Assertion timeout
  navigationTimeout: finalConfig.navigationTimeout,
  actionTimeout: finalConfig.actionTimeout,

  // Parallel workers
  workers: finalConfig.workers,

  // Retry failed tests
  retries: finalConfig.retries,

  // Stop after max failures
  maxFailures: finalConfig.maxFailures,

  // Output directory
  outputDir: 'test-results',

  // Use built-in test reporter
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for all requests
    baseURL: finalConfig.baseURL,

    // Screenshot settings
    screenshot: finalConfig.screenshot,

    // Video settings
    video: finalConfig.video,

    // Trace settings
    trace: finalConfig.trace,

    // Browser context settings
    locale: 'en-US',
    timezoneId: 'America/Chicago',

    // Geolocation (optional)
    geolocation: { latitude: 37.7749, longitude: -122.4194 },
    permissions: ['geolocation'],

    // Offline mode
    offline: false,

    // Accept downloads in directory
    acceptDownloads: true,

    // Emulate network conditions
    bypassCSP: false,

    // Strict mode
    strictSelectors: true,

    // Extra HTTP headers
    extraHTTPHeaders: {
      'User-Agent': 'Playwright Test Bot/1.0',
    },

    // HTTP auth (if needed)
    httpCredentials: process.env.HTTP_USER ? {
      username: process.env.HTTP_USER,
      password: process.env.HTTP_PASSWORD || '',
    } : undefined,

    // Proxy (if needed)
    proxy: process.env.HTTP_PROXY ? {
      server: process.env.HTTP_PROXY,
    } : undefined,
  },

  // Shared web server settings
  webServer: process.env.SKIP_SERVER ? undefined : {
    command: 'npm run start',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 120000,
  },

  // Projects for different browsers and configurations
  projects: [
    // Chromium desktop
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Chromium mobile
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 412, height: 915 },
      },
    },

    // Chromium tablet
    {
      name: 'chromium-tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
      },
    },

    // Firefox desktop
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Firefox mobile
    {
      name: 'firefox-mobile',
      use: {
        ...devices['Pixel 4'],
        viewport: { width: 353, height: 745 },
      },
    },

    // WebKit (Safari)
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // WebKit iPad
    {
      name: 'webkit-ipad',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
      },
    },

    // iPhone 12
    {
      name: 'iphone-12',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 },
      },
    },

    // Android Chrome
    {
      name: 'android-chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
      },
    },

    // Accessibility testing with Chromium
    {
      name: 'chromium-a11y',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: ['**/accessibility/**/*.spec.ts', '**/wcag/**/*.spec.ts'],
    },

    // Visual regression testing (Chromium only for consistency)
    {
      name: 'visual-regression',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: ['**/*visual*.spec.ts', '**/visual-regression/**/*.spec.ts'],
    },

    // Performance testing
    {
      name: 'performance',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: ['**/performance/**/*.spec.ts', '**/*performance*.spec.ts'],
    },

    // Error scenario testing
    {
      name: 'error-scenarios',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: ['**/*error*.spec.ts', '**/error-scenarios/**/*.spec.ts'],
    },

    // Responsive testing
    {
      name: 'responsive',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: ['**/*responsive*.spec.ts', '**/responsive/**/*.spec.ts'],
    },
  ],

  // Global setup/teardown
  globalSetup: process.env.SKIP_GLOBAL_SETUP ? undefined : require.resolve('./global-setup.ts'),
  globalTeardown: process.env.SKIP_GLOBAL_TEARDOWN ? undefined : require.resolve('./global-teardown.ts'),

  // Slow motion for debugging
  use: {
    slowMo: finalConfig.slowMotion,
  },

  // Custom settings for verbose output
  fullyParallel: true,
  forbidOnly: process.env.CI ? true : false,
  updateSnapshots: process.env.UPDATE_SNAPSHOTS === 'true' ? 'all' : undefined,
});
