# Jest Configuration Debugging for WordPress Plugins

## Overview
This guide addresses three common Jest setup issues when testing WordPress plugins with wp-scripts:
1. testMatch not finding tests
2. Coverage showing 0% despite tests running
3. Module mapping issues with @wordpress/element imports

---

## Issue 1: testMatch Not Finding Tests

### Symptoms
- Tests defined and named correctly
- Jest runs but finds 0 test suites
- Error: "No tests found related to files changed since last commit" or empty test output

### Root Causes

**Problem 1A: Incorrect glob patterns**
- Default Jest pattern `**/__tests__/**/*.js` is strict
- Pattern doesn't match `.test.js` or `.spec.js` files in loose organization
- Escaping issues with `**/` patterns across different shells and OS

**Problem 1B: Tests outside moduleFileExtensions**
- Jest configured to only recognize certain file extensions
- `.test.tsx` files ignored if only `.js` listed
- TypeScript files skipped if ts-jest not configured

**Problem 1C: testPathIgnorePatterns blocking tests**
- `node_modules` commonly excluded (correct)
- BUT pattern might accidentally exclude test directories
- Example: `<rootDir>/build/` pattern using regex instead of glob

### Diagnosis Steps

```bash
# 1. Check what files Jest sees
npx jest --listTests

# 2. Verify glob patterns expand correctly
npx jest --showConfig | grep -A 10 testMatch

# 3. Check if files exist and are readable
ls -la tests/unit/ src/**/*.test.js
```

### The Fix

**Before (Problematic):**
```javascript
module.exports = {
  testMatch: ['**/__tests__/**/*.js'],  // Too strict, misses standard patterns
  testPathIgnorePatterns: ['/node_modules/'],  // OK but incomplete
};
```

**After (Correct):**
```javascript
module.exports = {
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/tests/**/*.spec.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.git/',
    '/build/',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
};
```

### Why This Works

1. **Multiple patterns** cover all common test locations:
   - WordPress blocks often use `src/index.test.js`
   - Functional tests in `tests/` directory
   - Both `.test.js` and `.spec.js` naming conventions
   - `__tests__` folders with descriptive filenames

2. **`<rootDir>` prefix** ensures:
   - Patterns are relative to project root, not pwd
   - Works consistently across CI/CD environments
   - No issues with symlinks or workspace nesting

3. **Explicit ignores** prevent Jest from scanning:
   - Build outputs that might have `.test.js` artifacts
   - Git metadata
   - Compiled output directories

4. **moduleFileExtensions** includes TypeScript:
   - Modern WordPress blocks use TypeScript
   - wp-scripts uses `@babel/preset-typescript`
   - Must list all extensions Jest should process

---

## Issue 2: Coverage Showing 0% Despite Tests Running

### Symptoms
- Tests execute successfully
- Coverage report shows 0% for all files
- No `.coverage/` or `coverage/` directory created
- Or coverage directory exists but is empty

### Root Causes

**Problem 2A: collectCoverageFrom not configured**
- Jest only measures coverage for files actually imported by tests
- If no imports, coverage remains 0%
- WordPress plugins often have unused entry points

**Problem 2B: Coverage reporter configuration missing**
- Default reporter may not display results properly
- No HTML report generated for inspection
- Coverage thresholds not enforced

**Problem 2C: collectCoverageFrom glob patterns incorrect**
- Patterns don't match actual source files
- Exclude patterns too broad
- Relative path issues (same as testMatch)

**Problem 2D: Transform configuration missing ts/tsx**
- TypeScript files not transpiled for coverage
- Coverage collector can't analyze untransformed code
- Shows 0% for type-heavy files

### Diagnosis Steps

```bash
# 1. Run with explicit coverage collection
npx jest --coverage --verbose

# 2. Check coverage configuration
npx jest --showConfig | grep -A 15 collectCoverageFrom

# 3. Verify file transform chain
npx jest --showConfig | grep -A 10 "^transform"

# 4. Check coverage report location
ls -la coverage/
cat coverage/coverage-summary.json
```

### The Fix

**Before (Problematic):**
```javascript
module.exports = {
  collectCoverage: true,
  // Missing collectCoverageFrom - only measures imported files
};
```

**After (Correct):**
```javascript
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',                    // Ignore type definitions
    '!src/**/index.js',                  // Ignore barrel exports if desired
    '!src/**/__tests__/**',               // Ignore test files
    '!src/**/*.stories.js',              // Ignore Storybook files
    '!src/**/*.config.js',               // Ignore config files
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'dist/',
    'build/',
  ],
  coverageReporters: ['text', 'text-summary', 'html', 'lcov', 'json'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/src/**/*.test.js'],
};
```

### Why This Works

1. **collectCoverageFrom** explicitly tells Jest what to measure:
   - Includes all source files (not just imported ones)
   - WordPress plugins have many utility functions
   - Covers dead code that tests don't exercise

2. **Ignore patterns** remove noise:
   - `.d.ts` files are TypeScript types, not JS
   - Barrel exports (index.js) are often trivial
   - Test files shouldn't count toward coverage
   - Storybook files are UI-only

3. **Multiple reporters** provide different views:
   - `text-summary`: CI/CD console output
   - `html`: Browse results at `coverage/index.html`
   - `lcov`: Integration with GitHub, codecov, Coveralls
   - `json`: Machine parsing

4. **coverageThreshold** enforces standards:
   - Prevents coverage regression
   - Catches tests that aren't actually running
   - Blocks merges below threshold

5. **Transform chain** handles all file types:
   - babel-jest handles .js/.jsx
   - ts-jest handles .ts/.tsx
   - Both needed for modern WordPress setups

---

## Issue 3: Module Mapping Not Working for @wordpress/element

### Symptoms
- Error: "Cannot find module '@wordpress/element'"
- Error: "Cannot find module '@wordpress/components'"
- Other @wordpress scoped packages fail to import
- Tests fail even though `npm install` succeeded

### Root Causes

**Problem 3A: moduleNameMapper not configured**
- Jest doesn't know how to resolve `@wordpress/*` packages
- Webpack/build tool uses different resolution
- Tests can't import what the browser can

**Problem 3B: wp-scripts external bundles issue**
- WordPress packages are "externals" in wp-scripts build
- They're not bundled, expected at runtime
- Jest needs explicit mapping to node_modules versions

**Problem 3C: Incorrect mock implementation**
- Mocking @wordpress/element but using wrong API
- Default export vs named exports mismatch
- Shallow mock doesn't provide required functions

**Problem 3D: Missing dependencies**
- `@wordpress/element` not in package.json
- Or installed in wrong location (workspace deps)
- Jest resolves from node_modules, not from build output

### Diagnosis Steps

```bash
# 1. Verify package is installed
npm ls @wordpress/element
npm ls @wordpress/components

# 2. Check Jest's module resolution
npx jest --showConfig | grep -A 20 moduleNameMapper

# 3. Test direct require
node -e "require('@wordpress/element')"

# 4. Check node_modules structure
ls -la node_modules/@wordpress/element/
ls -la node_modules/@wordpress/components/
```

### The Fix

**Before (Problematic):**
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  // No moduleNameMapper - Jest can't find @wordpress packages
};
```

**After (Correct):**
```javascript
const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  
  // Critical: Map @wordpress packages to actual node_modules versions
  moduleNameMapper: {
    // WordPress packages - must resolve to installed versions
    '^@wordpress/element$': path.resolve(
      __dirname,
      'node_modules/@wordpress/element/build/index.js'
    ),
    '^@wordpress/components$': path.resolve(
      __dirname,
      'node_modules/@wordpress/components/build/index.js'
    ),
    '^@wordpress/hooks$': path.resolve(
      __dirname,
      'node_modules/@wordpress/hooks/build/index.js'
    ),
    '^@wordpress/data$': path.resolve(
      __dirname,
      'node_modules/@wordpress/data/build/index.js'
    ),
    '^@wordpress/i18n$': path.resolve(
      __dirname,
      'node_modules/@wordpress/i18n/build/index.js'
    ),
    '^@wordpress/(.+)$': path.resolve(
      __dirname,
      'node_modules/@wordpress/$1/build/index.js'
    ),
    
    // CSS/SCSS imports (common in WordPress components)
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    
    // Image imports
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
    
    // Fallback for other @-namespaced packages
    '^@/(.+)$': path.resolve(__dirname, 'src/$1'),
  },
  
  // Transform rules (if using babel-jest + wp-scripts)
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  
  // Ensure Jest looks in right places
  moduleDirectories: ['node_modules', 'src'],
  
  testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/src/**/*.test.js'],
};
```

**Create mock files for assets:**

`__mocks__/styleMock.js`:
```javascript
module.exports = {};
```

`__mocks__/fileMock.js`:
```javascript
module.exports = 'test-file-stub';
```

### Why This Works

1. **Direct path resolution** ensures Jest finds WordPress packages:
   - Points to actual `.js` files (not index.json)
   - WordPress packages provide `/build` output for Node.js
   - `path.resolve()` is immune to cwd issues
   - Regex `^@wordpress/(.+)$` catches all scoped packages

2. **Fallback pattern** handles unpredicted packages:
   - `^@wordpress/(.+)$` = $1 resolves to /build/index.js
   - Doesn't need explicit entry for every WP package
   - Self-documenting: shows the pattern

3. **CSS/SCSS mocks** prevent import errors:
   - WordPress components use CSS-in-JS + CSS imports
   - Can't run CSS in jsdom test environment
   - Mock returns empty object, allowing tests to proceed
   - Could return styled-components snapshot if needed

4. **File mocks** handle static assets:
   - Images in markdown, SVG icons, fonts
   - Jest can't process binary files
   - Return placeholder string for tests
   - Sufficient for most test scenarios

5. **testEnvironment: 'jsdom'** provides:
   - Browser-like environment for React testing
   - Required for WordPress components (uses DOM APIs)
   - Needed for Gutenberg block testing

### WordPress Package Resolution Patterns

Different WordPress packages use different export patterns:

```javascript
// @wordpress/element - React wrapper
moduleNameMapper: {
  '^@wordpress/element$': path.resolve(
    __dirname,
    'node_modules/@wordpress/element/build/index.js'
  ),
}

// @wordpress/components - Gutenberg UI components
moduleNameMapper: {
  '^@wordpress/components$': path.resolve(
    __dirname,
    'node_modules/@wordpress/components/build/index.js'
  ),
}

// @wordpress/data - State management
moduleNameMapper: {
  '^@wordpress/data$': path.resolve(
    __dirname,
    'node_modules/@wordpress/data/build/index.js'
  ),
}
```

---

## Complete Fixed Configuration

See `jest.config.js` in this output directory for a fully working example that:
- ✓ Finds all test files (Issue 1)
- ✓ Reports full coverage (Issue 2)
- ✓ Resolves WordPress imports (Issue 3)
- ✓ Handles TypeScript
- ✓ Mocks CSS/assets
- ✓ Integrates with wp-scripts

---

## WordPress Plugin Jest Best Practices

### 1. Project Structure
```
plugin-name/
├── src/
│   ├── blocks/
│   │   ├── my-block/
│   │   │   ├── index.js
│   │   │   ├── edit.js
│   │   │   ├── save.js
│   │   │   ├── edit.test.js
│   │   │   └── style.scss
│   │   └── ...
│   ├── utils/
│   │   ├── helpers.js
│   │   └── helpers.test.js
│   └── index.js
├── tests/
│   ├── integration/
│   │   └── plugin-loads.test.js
│   └── unit/
│       └── admin-features.test.js
├── jest.config.js
├── package.json
└── __mocks__/
    ├── styleMock.js
    └── fileMock.js
```

### 2. Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk ./node_modules/.bin/jest --runInBand"
  }
}
```

### 3. .babelrc for WordPress Testing
```json
{
  "presets": [
    ["@wordpress/babel-preset-default", {
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}
```

### 4. Jest Setup File (optional)
Create `jest.setup.js`:
```javascript
// Setup global mocks
global.wp = {
  element: jest.requireActual('@wordpress/element'),
  components: jest.requireActual('@wordpress/components'),
  data: jest.requireActual('@wordpress/data'),
  i18n: {
    __: (text) => text,
    _x: (text) => text,
    _n: (single, plural, count) => count === 1 ? single : plural,
  },
};

// Mock window.wp.hooks if needed
if (!global.wp.hooks) {
  global.wp.hooks = {
    addAction: jest.fn(),
    addFilter: jest.fn(),
    doAction: jest.fn(),
    applyFilters: jest.fn(),
  };
}
```

Reference in jest.config.js:
```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // ... rest of config
};
```

### 5. Testing WordPress Block (Example)
```javascript
// src/blocks/example/edit.test.js
import { render, screen } from '@testing-library/react';
import { EditComponent } from './edit';

describe('Example Block - Edit', () => {
  it('renders without crashing', () => {
    render(<EditComponent />);
    expect(screen.getByText(/example/i)).toBeInTheDocument();
  });

  it('updates on attribute change', () => {
    const setAttributes = jest.fn();
    const { rerender } = render(
      <EditComponent attributes={{ text: 'old' }} setAttributes={setAttributes} />
    );
    
    // Simulate change
    expect(setAttributes).not.toHaveBeenCalled();
  });
});
```

### 6. Coverage Thresholds (Progressive)
```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 50,       // Start permissive
      functions: 50,
      lines: 50,
      statements: 50,
    },
    './src/blocks/': {    // Stricter for core logic
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/utils/': {     // Very strict for utilities
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

### 7. CI/CD Integration
For GitHub Actions:
```yaml
- name: Run tests
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    flags: unittests
```

---

## Debugging Checklist

When tests still don't work:

- [ ] `npm ls @wordpress/element` shows package installed
- [ ] `npx jest --listTests` includes your test files
- [ ] `npx jest --showConfig` displays correct testMatch patterns
- [ ] Mock files exist: `__mocks__/styleMock.js`, `__mocks__/fileMock.js`
- [ ] `.babelrc` or babel config in `package.json` includes WordPress preset
- [ ] `node_modules/@wordpress/*/build/index.js` files exist
- [ ] `moduleNameMapper` uses `path.resolve(__dirname, ...)` not relative paths
- [ ] `testEnvironment` is `jsdom` (not `node`) for WordPress components
- [ ] No `testPathIgnorePatterns` accidentally excluding test directories
- [ ] `collectCoverageFrom` includes source files
- [ ] No errors in `npx jest --verbose` output (shows file paths)

---

## References

- [Jest Configuration Reference](https://jestjs.io/docs/configuration)
- [WordPress JavaScript Packages](https://developer.wordpress.org/block-editor/reference-guides/packages/)
- [wp-scripts](https://developer.wordpress.org/block-editor/packages/packages-scripts/)
- [Testing WordPress Blocks](https://developer.wordpress.org/block-editor/packages/packages-jest-preset/)
- [Jest Module Name Mapping](https://jestjs.io/docs/module-name-mapper)
- [Testing Library (React)](https://testing-library.com/docs/react-testing-library/intro/)
