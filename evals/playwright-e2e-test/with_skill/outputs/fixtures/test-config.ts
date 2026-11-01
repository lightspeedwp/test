/**
 * Test Configuration
 *
 * Global configuration for E2E tests, including timeouts,
 * retry logic, and test environment setup.
 */

export interface TestConfig {
  baseURL: string;
  timeout: number;
  navigationTimeout: number;
  actionTimeout: number;
  retries: number;
  maxFailures: number;
  workers: number;
  headless: boolean;
  slowMotion: number;
  screenshot: 'only-on-failure' | 'on' | 'off';
  video: 'retain-on-failure' | 'on' | 'off';
  trace: 'on-first-retry' | 'on' | 'off';
}

/**
 * Default test configuration
 */
export const testConfig: TestConfig = {
  baseURL: process.env.BASE_URL || 'http://localhost:8080',
  timeout: parseInt(process.env.TEST_TIMEOUT || '30000'),
  navigationTimeout: parseInt(process.env.NAV_TIMEOUT || '30000'),
  actionTimeout: parseInt(process.env.ACTION_TIMEOUT || '10000'),
  retries: parseInt(process.env.TEST_RETRIES || '2'),
  maxFailures: parseInt(process.env.MAX_FAILURES || '0'),
  workers: parseInt(process.env.WORKERS || '1'),
  headless: process.env.HEADLESS !== 'false',
  slowMotion: parseInt(process.env.SLOW_MOTION || '0'),
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
};

/**
 * Test user credentials
 */
export const testUser = {
  username: process.env.WP_TEST_USERNAME || 'admin',
  password: process.env.WP_TEST_PASSWORD || 'password',
  email: process.env.WP_TEST_EMAIL || 'admin@example.local',
};

/**
 * Block plugin configuration
 */
export const blockPluginConfig = {
  pluginSlug: process.env.PLUGIN_SLUG || 'custom-feature-block',
  pluginName: process.env.PLUGIN_NAME || 'Custom Feature Block',
  blockName: process.env.BLOCK_NAME || 'Custom Feature Block',
  blockNamespace: process.env.BLOCK_NAMESPACE || 'lightspeedwp',
};

/**
 * Accessibility test configuration (WCAG 2.2 AAA)
 */
export const a11yConfig = {
  // Minimum color contrast ratio (7:1 for AAA)
  minContrastRatio: 7,

  // Minimum touch target size (pixels)
  minTouchTargetSize: 44,

  // Minimum text size (pixels)
  minTextSize: 14,

  // Acceptable heading levels (no skips)
  allowHeadingSkips: false,

  // Require alt text on images
  requireAltText: true,

  // Require ARIA labels on controls
  requireAriaLabels: true,

  // Support keyboard navigation
  supportsKeyboard: true,

  // Support screen readers
  supportsScreenReaders: true,

  // Respect prefers-reduced-motion
  respectReducedMotion: true,

  // Support zoom up to 200%
  supportZoom: true,
};

/**
 * Performance test configuration
 */
export const performanceConfig = {
  // Core Web Vitals targets
  lcp: {
    good: 2500,    // milliseconds
    needsImprovement: 4000,
  },

  fid: {
    good: 100,     // milliseconds
    needsImprovement: 300,
  },

  cls: {
    good: 0.1,
    needsImprovement: 0.25,
  },

  fcp: {
    good: 1800,    // milliseconds
    needsImprovement: 3000,
  },

  // Page load time target
  pageLoadTime: 3000, // milliseconds
};

/**
 * Visual regression test configuration
 */
export const visualRegressionConfig = {
  // Threshold for pixel difference (0-1, lower is stricter)
  threshold: 0.2,

  // Threshold in pixels (absolute difference)
  thresholdPixels: 10,

  // Screenshot update mode
  updateSnapshots: process.env.UPDATE_SNAPSHOTS === 'true',

  // Screenshot comparison configuration
  comparationOptions: {
    maxDiffPixels: 100,
    threshold: 0.2,
  },
};

/**
 * Responsive test configuration
 */
export const responsiveConfig = {
  // Viewports to test
  viewports: ['mobile', 'tablet', 'desktop'],

  // Test orientation changes
  testOrientationChanges: true,

  // Minimum width for content to remain readable
  minReadableWidth: 320,

  // Maximum width for content
  maxContentWidth: 1200,
};

/**
 * Retry configuration
 */
export const retryConfig = {
  // Retry flaky tests
  retryFlaky: true,

  // Retry network-related failures
  retryNetwork: true,

  // Retry timeout failures
  retryTimeout: true,

  // Specific retry counts
  retryCount: 2,

  // Delay between retries (ms)
  retryDelay: 1000,
};

/**
 * Environment variables schema
 */
export const envSchema = {
  BASE_URL: 'string',
  WP_TEST_USERNAME: 'string',
  WP_TEST_PASSWORD: 'string',
  WP_TEST_EMAIL: 'string',
  PLUGIN_SLUG: 'string',
  PLUGIN_NAME: 'string',
  BLOCK_NAME: 'string',
  BLOCK_NAMESPACE: 'string',
  TEST_TIMEOUT: 'number',
  NAV_TIMEOUT: 'number',
  ACTION_TIMEOUT: 'number',
  TEST_RETRIES: 'number',
  MAX_FAILURES: 'number',
  WORKERS: 'number',
  HEADLESS: 'boolean',
  SLOW_MOTION: 'number',
  UPDATE_SNAPSHOTS: 'boolean',
};

/**
 * Get test configuration for a specific environment
 */
export function getConfigForEnvironment(env: 'local' | 'ci' | 'staging' | 'production'): Partial<TestConfig> {
  const configs: Record<string, Partial<TestConfig>> = {
    local: {
      baseURL: 'http://localhost:8080',
      headless: false,
      slowMotion: 100,
      retries: 0,
    },
    ci: {
      baseURL: 'http://localhost:3000',
      headless: true,
      workers: 4,
      retries: 2,
      screenshot: 'only-on-failure',
      video: 'on-first-retry',
      trace: 'on-first-retry',
    },
    staging: {
      baseURL: process.env.STAGING_URL || 'https://staging.example.com',
      headless: true,
      workers: 2,
      retries: 1,
      screenshot: 'on',
      video: 'retain-on-failure',
    },
    production: {
      baseURL: process.env.PRODUCTION_URL || 'https://example.com',
      headless: true,
      workers: 1,
      retries: 0,
      screenshot: 'off',
      video: 'off',
    },
  };

  return configs[env] || configs.local;
}

/**
 * Validate environment configuration
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!testConfig.baseURL) {
    errors.push('BASE_URL is required');
  }

  if (!testUser.username || !testUser.password) {
    errors.push('WordPress test credentials are required');
  }

  if (testConfig.timeout < 10000) {
    errors.push('Test timeout must be at least 10 seconds');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get test configuration summary
 */
export function getConfigSummary(): Record<string, any> {
  return {
    environment: process.env.NODE_ENV || 'test',
    baseURL: testConfig.baseURL,
    workers: testConfig.workers,
    retries: testConfig.retries,
    headless: testConfig.headless,
    screenshot: testConfig.screenshot,
    video: testConfig.video,
    trace: testConfig.trace,
    timeout: testConfig.timeout,
    a11y: a11yConfig,
    performance: performanceConfig,
    responsive: responsiveConfig,
  };
}

/**
 * Export all configurations
 */
export const config = {
  test: testConfig,
  user: testUser,
  plugin: blockPluginConfig,
  a11y: a11yConfig,
  performance: performanceConfig,
  visual: visualRegressionConfig,
  responsive: responsiveConfig,
  retry: retryConfig,
};
