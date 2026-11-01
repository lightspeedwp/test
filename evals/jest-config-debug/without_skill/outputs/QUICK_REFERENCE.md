# Jest Configuration Quick Reference

## Three Issues & Fixes

| Issue | Symptom | Root Cause | Fix |
|-------|---------|-----------|-----|
| **testMatch** | Tests not found | Incorrect glob patterns, file extensions not listed | Add multiple patterns with `<rootDir>/` prefix covering all locations |
| **Coverage 0%** | Tests run but coverage empty | collectCoverageFrom not set, wrong transform | Configure collectCoverageFrom + coverage reporters |
| **@wordpress/** modules | "Cannot find module" errors | moduleNameMapper missing, wrong paths | Map packages to `/build/index.js` using path.resolve() |

---

## Copy-Paste Fixes

### Fix 1: testMatch (Find Your Tests)
```javascript
testMatch: [
  '<rootDir>/src/**/*.test.js',
  '<rootDir>/tests/**/*.test.js',
  '<rootDir>/src/**/__tests__/**/*.js',
],
testPathIgnorePatterns: ['/node_modules/', '/build/'],
```

### Fix 2: Coverage Collection
```javascript
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}',
  '!src/**/*.d.ts',
  '!src/**/*.test.{js,jsx,ts,tsx}',
  '!src/**/__tests__/**',
],
coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
```

### Fix 3: WordPress Module Mapping
```javascript
const path = require('path');

moduleNameMapper: {
  '^@wordpress/element$': path.resolve(__dirname, 'node_modules/@wordpress/element/build/index.js'),
  '^@wordpress/components$': path.resolve(__dirname, 'node_modules/@wordpress/components/build/index.js'),
  '^@wordpress/(.+)$': path.resolve(__dirname, 'node_modules/@wordpress/$1/build/index.js'),
  '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
},
```

---

## Setup Files Needed

### 1. jest.config.js (PROVIDED)
Your main Jest configuration file.

### 2. __mocks__/styleMock.js (PROVIDED)
```javascript
module.exports = {};
```

### 3. __mocks__/fileMock.js (PROVIDED)
```javascript
module.exports = 'test-file-stub';
```

### 4. jest.setup.js (OPTIONAL)
Global WordPress mocks. Add to jest.config.js:
```javascript
setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
```

---

## Diagnostic Commands

```bash
# See what tests Jest finds
npx jest --listTests

# Show the configuration Jest is using
npx jest --showConfig

# Run tests with verbose output (shows file paths)
npx jest --verbose

# Run with coverage collection
npx jest --coverage

# Run in debug mode (browser devtools)
npm run test:debug  # requires: "test:debug": "node --inspect-brk ./node_modules/.bin/jest --runInBand"
```

---

## Common Problems & Solutions

### "Cannot find module '@wordpress/element'"

**Check:**
```bash
npm ls @wordpress/element          # Should show installed
ls -la node_modules/@wordpress/element/  # Should exist
node -e "require('@wordpress/element')"  # Should not error
```

**Fix in jest.config.js:**
```javascript
moduleNameMapper: {
  '^@wordpress/element$': path.resolve(
    __dirname,
    'node_modules/@wordpress/element/build/index.js'
  ),
}
```

### "No tests found"

**Check:**
```bash
npx jest --listTests  # Should show your test files
ls -la src/**/*.test.js  # Should exist
npx jest --showConfig | grep testMatch  # Check patterns
```

**Fix in jest.config.js:**
```javascript
testMatch: [
  '<rootDir>/src/**/*.test.js',
  '<rootDir>/tests/**/*.test.js',
],
```

### "Coverage is 0%"

**Check:**
```bash
npx jest --coverage --verbose  # Should create coverage/ directory
cat coverage/coverage-summary.json  # Should show file stats
```

**Fix in jest.config.js:**
```javascript
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}',
  '!src/**/*.test.{js,jsx,ts,tsx}',
  '!src/**/__tests__/**',
],
coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
```

### "CSS import errors"

**Check:**
```bash
npx jest --showConfig | grep -A5 'css'  # Check moduleNameMapper
ls __mocks__/styleMock.js  # Should exist
```

**Fix:** Create `__mocks__/styleMock.js`:
```javascript
module.exports = {};
```

And add to jest.config.js:
```javascript
moduleNameMapper: {
  '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
}
```

### "Image import errors"

**Check:**
```bash
npx jest --showConfig | grep -A2 'svg\|png\|jpg'
ls __mocks__/fileMock.js  # Should exist
```

**Fix:** Create `__mocks__/fileMock.js`:
```javascript
module.exports = 'test-file-stub';
```

And add to jest.config.js:
```javascript
moduleNameMapper: {
  '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
}
```

### "Tests timeout"

**Add to jest.config.js:**
```javascript
testTimeout: 10000,  // Increase from default 5000ms
```

Or per test:
```javascript
jest.setTimeout(10000);

it('slow test', () => {
  // ...
});
```

### "Can't find @wordpress/data or other packages"

**Quick fix** - add individual mapping:
```javascript
moduleNameMapper: {
  '^@wordpress/data$': path.resolve(
    __dirname,
    'node_modules/@wordpress/data/build/index.js'
  ),
  // ... more specific mappings
  '^@wordpress/(.+)$': path.resolve(  // Catch-all
    __dirname,
    'node_modules/@wordpress/$1/build/index.js'
  ),
}
```

The catch-all pattern handles any `@wordpress/*` package automatically.

---

## File Organization Best Practice

```
plugin-name/
├── src/
│   ├── blocks/
│   │   ├── my-block/
│   │   │   ├── index.js
│   │   │   ├── edit.js
│   │   │   ├── edit.test.js        ← Test next to source
│   │   │   ├── save.js
│   │   │   ├── save.test.js
│   │   │   └── style.scss
│   │   └── another-block/
│   │       ├── index.js
│   │       └── index.test.js       ← Alt: one test per block
│   ├── utils/
│   │   ├── helpers.js
│   │   └── helpers.test.js         ← Test next to source
│   └── index.js
├── tests/                          ← Integration/e2e tests
│   ├── integration/
│   │   └── plugin-startup.test.js
│   └── unit/
│       └── admin-features.test.js
├── __mocks__/                      ← Mocks for assets
│   ├── styleMock.js
│   └── fileMock.js
├── jest.config.js                  ← Main config
├── jest.setup.js                   ← Optional: global setup
├── .babelrc                        ← Babel config for WordPress
├── package.json
└── README.md
```

---

## package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk ./node_modules/.bin/jest --runInBand",
    "test:ci": "jest --coverage --watchAll=false"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@wordpress/babel-preset-default": "^6.25.0",
    "@wordpress/element": "^5.x.x",
    "babel-jest": "^29.5.0",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "jest-watch-typeahead": "^2.2.2",
    "ts-jest": "^29.1.0"
  }
}
```

---

## CI/CD Configuration Example (GitHub Actions)

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Version Checklist

Ensure compatible versions:

```
jest: ^29.x
babel-jest: ^29.x
ts-jest: ^29.x (if using TypeScript)
@wordpress/element: ^5.x or ^6.x
@wordpress/components: ^20.x or newer
@wordpress/blocks: ^11.x or newer
@testing-library/react: ^13.x or ^14.x
```

---

## Key Points to Remember

1. ✓ Use `<rootDir>/` prefix in testMatch and moduleNameMapper
2. ✓ Use `path.resolve()` for moduleNameMapper paths (not strings)
3. ✓ Create mock files in `__mocks__/` for CSS/images
4. ✓ Set testEnvironment to `jsdom` for WordPress components
5. ✓ Configure collectCoverageFrom to measure all source files
6. ✓ Use coverage reporters for different views (text, html, lcov)
7. ✓ Reference jest.setup.js for global WordPress mocks (optional)
8. ✓ Test files next to source or in separate `tests/` directory
9. ✓ Run `npx jest --showConfig` to verify configuration
10. ✓ Use `npx jest --listTests` to verify test discovery

---

## Resources

- **Main Debug Guide:** JEST_DEBUG_GUIDE.md
- **Example Tests:** EXAMPLE_TESTS.md
- **Jest Docs:** https://jestjs.io/
- **WordPress Testing:** https://developer.wordpress.org/block-editor/packages/packages-jest-preset/
- **Testing Library:** https://testing-library.com/
