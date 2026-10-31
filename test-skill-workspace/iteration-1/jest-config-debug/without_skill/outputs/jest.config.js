/**
 * Jest Configuration for WordPress Plugin
 *
 * This configuration fixes common issues:
 * 1. testMatch not finding tests - explicit glob patterns covering all locations
 * 2. Coverage showing 0% - collectCoverageFrom configured + coverage reporters
 * 3. @wordpress/* module mapping - moduleNameMapper with path resolution
 *
 * Usage: Place in plugin root, adjust paths to match your structure
 */

const path = require('path');

module.exports = {
  // ============================================================================
  // ISSUE 1 FIX: testMatch - Tell Jest where to find tests
  // ============================================================================

  testMatch: [
    // Standard WordPress block structure
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.jsx',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
    '<rootDir>/src/**/*.spec.js',
    '<rootDir>/src/**/*.spec.jsx',

    // Separate test directories
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.test.jsx',
    '<rootDir>/tests/**/*.spec.js',
    '<rootDir>/tests/**/*.spec.jsx',

    // Alternative: __tests__ folders (WordPress convention)
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/tests/**/__tests__/**/*.js',
  ],

  // Files to exclude from test discovery
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.git/',
    '/build/',
    '/dist/',
    '/coverage/',
  ],

  // File extensions Jest will process
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node',
  ],

  // ============================================================================
  // ISSUE 2 FIX: Coverage - Collect and report coverage properly
  // ============================================================================

  collectCoverage: false, // Set to true in CI or use --coverage flag

  // CRITICAL: Explicitly tell Jest what to measure for coverage
  collectCoverageFrom: [
    // Include all source files
    'src/**/*.{js,jsx,ts,tsx}',

    // Exclude type definitions
    '!src/**/*.d.ts',

    // Exclude test files
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',

    // Exclude Storybook
    '!src/**/*.stories.{js,jsx,ts,tsx}',

    // Exclude config files
    '!src/**/*.config.js',
    '!src/**/index.js',  // Optional: if barrel exports are trivial
  ],

  // Don't measure coverage for these directories
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/build/',
    '/dist/',
  ],

  // Coverage report formats
  coverageReporters: [
    'text',           // Console output
    'text-summary',   // Brief summary
    'html',           // HTML report at coverage/index.html
    'lcov',           // For codecov/Coveralls
    'json',           // Machine-parseable
  ],

  // Coverage thresholds - fails tests if below these percentages
  // Start permissive and increase over time
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    './src/blocks/': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './src/utils/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // ============================================================================
  // ISSUE 3 FIX: Module Mapping - Resolve @wordpress/* imports
  // ============================================================================

  moduleNameMapper: {
    // WordPress Packages - Map to their build output in node_modules
    // Order matters: more specific patterns first, catch-all last

    // WordPress Core Packages (frequently used)
    '^@wordpress/element$': path.resolve(
      __dirname,
      'node_modules/@wordpress/element/build/index.js'
    ),
    '^@wordpress/components$': path.resolve(
      __dirname,
      'node_modules/@wordpress/components/build/index.js'
    ),
    '^@wordpress/blocks$': path.resolve(
      __dirname,
      'node_modules/@wordpress/blocks/build/index.js'
    ),
    '^@wordpress/data$': path.resolve(
      __dirname,
      'node_modules/@wordpress/data/build/index.js'
    ),
    '^@wordpress/editor$': path.resolve(
      __dirname,
      'node_modules/@wordpress/editor/build/index.js'
    ),
    '^@wordpress/hooks$': path.resolve(
      __dirname,
      'node_modules/@wordpress/hooks/build/index.js'
    ),
    '^@wordpress/i18n$': path.resolve(
      __dirname,
      'node_modules/@wordpress/i18n/build/index.js'
    ),
    '^@wordpress/api-fetch$': path.resolve(
      __dirname,
      'node_modules/@wordpress/api-fetch/build/index.js'
    ),

    // Catch-all for other @wordpress/* packages
    // This pattern: ^@wordpress/(.+)$ matches @wordpress/anything
    // Maps to: node_modules/@wordpress/anything/build/index.js
    '^@wordpress/(.+)$': path.resolve(
      __dirname,
      'node_modules/@wordpress/$1/build/index.js'
    ),

    // CSS/SCSS Imports - Jest can't process stylesheets, so mock them
    '\\.(css|scss|less)$': path.resolve(
      __dirname,
      '__mocks__/styleMock.js'
    ),

    // Image/Font Imports - Jest can't process binary files
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': path.resolve(
      __dirname,
      '__mocks__/fileMock.js'
    ),

    // Custom path aliases (adjust to your needs)
    // Allows: import Foo from '@/components/Foo'
    '^@/(.+)$': path.resolve(__dirname, 'src/$1'),

    // Component aliases (adjust to your needs)
    // Allows: import Button from '@blocks/common/Button'
    '^@blocks/(.+)$': path.resolve(__dirname, 'src/blocks/$1'),
    '^@utils/(.+)$': path.resolve(__dirname, 'src/utils/$1'),
  },

  // Where Jest looks for modules
  moduleDirectories: [
    'node_modules',
    'src',
  ],

  // ============================================================================
  // Test Environment & Transformation
  // ============================================================================

  // Use jsdom for WordPress components (they use DOM APIs)
  testEnvironment: 'jsdom',

  // Transform files before testing
  // babel-jest handles .js/.jsx, ts-jest handles .ts/.tsx
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  transformIgnorePatterns: [
    '/node_modules/(?!@wordpress)',  // Process @wordpress packages, skip others
  ],

  // ============================================================================
  // Setup & Globals
  // ============================================================================

  // Optional: Load setup file before tests run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Make these globals available without import
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },

  // ============================================================================
  // Test Execution & Reporting
  // ============================================================================

  testTimeout: 10000, // Allow up to 10 seconds per test

  verbose: true, // Show individual test results

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // ============================================================================
  // Watch Mode (jest --watch)
  // ============================================================================

  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // ============================================================================
  // Snapshot Testing
  // ============================================================================

  snapshotFormat: {
    printBasicPrototype: false,
  },
};
