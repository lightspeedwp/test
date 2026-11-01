/**
 * Fixed Jest Configuration for WordPress Plugin
 *
 * This configuration:
 * - Properly discovers tests with correct testMatch patterns
 * - Collects coverage from source files
 * - Maps @wordpress/* imports correctly
 * - Works with wp-scripts and custom setups
 * - Maintains 100% coverage threshold enforcement
 */

const path = require('path');

module.exports = {
  // ============================================================================
  // TEST DISCOVERY & EXECUTION
  // ============================================================================

  /**
   * Test environment: node vs jsdom
   * - 'node': For unit tests of utilities, helpers, pure JS
   * - 'jsdom': For React component testing (blocks, UI components)
   * WordPress blocks = React components → use 'jsdom'
   */
  testEnvironment: 'jsdom',

  /**
   * Root directory for resolving paths
   * Explicitly set to resolve @wordpress/* and relative imports correctly
   */
  rootDir: process.cwd(),

  /**
   * Test file discovery pattern
   * FIXED: Matches all common WordPress plugin test locations
   * - __tests__/ (modern convention)
   * - src/**/*.test.js (wp-scripts convention)
   * - tests/ (backup convention)
   */
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/test/**/*.test.{js,jsx,ts,tsx}',
  ],

  /**
   * Test path ignore patterns
   * FIXED: Exclude node_modules and build outputs, but not your tests
   */
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/',
  ],

  /**
   * Setup files
   * Run before tests to configure environment (mocks, globals, etc.)
   */
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  /**
   * Test timeout
   * WordPress components can be slow to render
   * 10000ms = 10 seconds (WordPress default)
   */
  testTimeout: 10000,

  /**
   * Verbose output
   * Shows each test that passes/fails
   */
  verbose: true,

  // ============================================================================
  // MODULE RESOLUTION & MAPPING
  // ============================================================================

  /**
   * Module name mapper
   * FIXED: Maps @wordpress/* imports to correct packages
   * This is what was missing!
   */
  moduleNameMapper: {
    // WordPress packages
    '^@wordpress/element$': require.resolve('@wordpress/element'),
    '^@wordpress/components$': require.resolve('@wordpress/components'),
    '^@wordpress/hooks$': require.resolve('@wordpress/hooks'),
    '^@wordpress/data$': require.resolve('@wordpress/data'),
    '^@wordpress/block-editor$': require.resolve('@wordpress/block-editor'),
    '^@wordpress/blocks$': require.resolve('@wordpress/blocks'),
    '^@wordpress/api-fetch$': require.resolve('@wordpress/api-fetch'),
    '^@wordpress/i18n$': require.resolve('@wordpress/i18n'),
    '^@wordpress/icons$': require.resolve('@wordpress/icons'),
    '^@wordpress/.*$': '<rootDir>/node_modules/$0',

    // CSS/SCSS imports (mock them in tests)
    '\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  /**
   * Module file extensions
   * Order matters: tried in this order
   */
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // ============================================================================
  // BABEL TRANSFORM CONFIGURATION
  // ============================================================================

  /**
   * Transform configuration
   * FIXED: Properly transpiles JSX and modern JavaScript
   * Jest uses Babel to transpile files before testing
   */
  transform: {
    // Transform JS/JSX with babel-jest
    '^.+\\.(js|jsx)$': 'babel-jest',

    // Transform TypeScript if used
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },

  /**
   * Transform ignore patterns
   * Don't transform files matching these patterns
   */
  transformIgnorePatterns: [
    'node_modules/(?!((@wordpress|@emotion|lodash-es)/|@?react-icons)/)',
  ],

  // ============================================================================
  // COVERAGE CONFIGURATION
  // ============================================================================

  /**
   * Collect coverage from these files
   * FIXED: Tells Jest which files to measure coverage for
   * This was missing, causing 0% coverage!
   */
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'skill/**/*.{js,jsx,ts,tsx}',
    'blocks/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/index.js',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],

  /**
   * Coverage path ignore patterns
   * Don't collect coverage from these
   */
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/',
    '/vendor/',
    '__tests__',
  ],

  /**
   * Coverage thresholds
   * Enforce minimum coverage requirements
   * CRITICAL: Fails the test suite if not met
   */
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  /**
   * Coverage reporters
   * Formats for coverage output
   */
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
  ],

  /**
   * Coverage directory
   * Where to write coverage reports
   */
  coverageDirectory: '<rootDir>/coverage',

  // ============================================================================
  // ADDITIONAL CONFIGURATION
  // ============================================================================

  /**
   * Globals
   * Variables available in all tests
   */
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },

  /**
   * Bail
   * Stop running tests after first failure (useful for debugging)
   * Set to false to run all tests even if some fail
   */
  bail: false,

  /**
   * Max workers
   * How many test workers to run in parallel
   * Reduce for CI environments
   */
  maxWorkers: '50%',

  /**
   * Notify on completion
   * Show notification when tests finish
   */
  notify: false,

  /**
   * Clear mocks between tests
   * Prevents test pollution
   */
  clearMocks: true,

  /**
   * Reset mocks between tests
   */
  resetMocks: true,

  /**
   * Restore mocks between tests
   */
  restoreMocks: true,
};
