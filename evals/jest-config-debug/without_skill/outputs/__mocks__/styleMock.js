/**
 * Mock for CSS/SCSS imports in tests
 *
 * Jest can't process stylesheets. This mock allows:
 *   import './style.scss'
 *
 * To work in tests without errors. Returns empty object so tests can proceed.
 * This doesn't test styling, but allows components to load.
 */

module.exports = {};
