/**
 * Jest Setup File for WordPress Plugin Testing
 *
 * Optional: Reference this in jest.config.js with:
 *   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
 *
 * Sets up global WordPress mocks and polyfills that all tests can access.
 */

// ============================================================================
// Mock wp.element (React wrapper)
// ============================================================================

global.wp = global.wp || {};
global.wp.element = jest.requireActual('@wordpress/element');

// ============================================================================
// Mock wp.components (Gutenberg UI components)
// ============================================================================

global.wp.components = jest.requireActual('@wordpress/components');

// ============================================================================
// Mock wp.data (State management)
// ============================================================================

global.wp.data = jest.requireActual('@wordpress/data');

// ============================================================================
// Mock wp.hooks (WordPress Hooks API)
// ============================================================================

global.wp.hooks = {
  addAction: jest.fn(),
  addFilter: jest.fn(),
  removeAction: jest.fn(),
  removeFilter: jest.fn(),
  doAction: jest.fn(),
  applyFilters: (hook, value) => value, // Pass through by default
  currentFilter: jest.fn(),
};

// ============================================================================
// Mock wp.i18n (Internationalization)
// ============================================================================

global.wp.i18n = {
  // Translation function - returns text as-is in tests
  __: (text, domain) => text,

  // Context-specific translation
  _x: (text, context, domain) => text,

  // Plural translation
  _n: (single, plural, count, domain) => count === 1 ? single : plural,

  // Plural with context
  _nx: (single, plural, count, context, domain) => count === 1 ? single : plural,

  // No-op function for extractors
  _noop: (text, domain) => text,

  // Sprintf-like function
  sprintf: (format, ...args) => format,
};

// ============================================================================
// Mock wp.apiFetch (REST API)
// ============================================================================

global.wp.apiFetch = jest.fn((options) => {
  return Promise.resolve({});
});

// ============================================================================
// Mock wp.blocks (Block registration)
// ============================================================================

global.wp.blocks = jest.requireActual('@wordpress/blocks');

// ============================================================================
// Mock wp.blockEditor (Gutenberg editor internals)
// ============================================================================

global.wp.blockEditor = jest.requireActual('@wordpress/block-editor') || {
  InnerBlocks: () => null,
  RichText: () => null,
  useBlockProps: () => ({}),
  BlockControls: () => null,
  InspectorControls: () => null,
};

// ============================================================================
// Mock window.matchMedia (for responsive tests)
// ============================================================================

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
}

// ============================================================================
// Mock window.requestAnimationFrame
// ============================================================================

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id) => clearTimeout(id);
}

// ============================================================================
// Suppress console errors in tests (optional)
// ============================================================================

// Uncomment to silence specific console methods during tests:
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args) => {
//     if (
//       typeof args[0] === 'string' &&
//       (args[0].includes('Warning: ReactDOM.render')
//        || args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
//     ) {
//       return;
//     }
//     originalError.call(console, ...args);
//   };
// });
// afterAll(() => {
//   console.error = originalError;
// });

// ============================================================================
// Test Utilities
// ============================================================================

/**
 * Create a mock WordPress block attributes object
 * Usage in tests: const attrs = mockBlockAttributes({ text: 'Hello' })
 */
global.mockBlockAttributes = (overrides = {}) => ({
  text: '',
  color: '#000000',
  alignment: 'left',
  ...overrides,
});

/**
 * Create a mock WordPress block context
 */
global.mockBlockContext = (overrides = {}) => ({
  setAttributes: jest.fn(),
  attributes: {},
  clientId: 'test-client-id-12345',
  isSelected: false,
  ...overrides,
});
