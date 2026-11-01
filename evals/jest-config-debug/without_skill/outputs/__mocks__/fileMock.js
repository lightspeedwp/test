/**
 * Mock for image and font imports in tests
 *
 * Jest can't process binary files. This mock allows:
 *   import logo from './logo.png'
 *   import font from './font.ttf'
 *
 * To work in tests. Returns a string that acts like a file path.
 * In production, webpack/build tool handles these properly.
 */

module.exports = 'test-file-stub';
