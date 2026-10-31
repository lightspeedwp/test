# WordPress Jest Setup: Best Practices & Prevention

Essential practices to prevent configuration issues and maintain a healthy test suite.

---

## Best Practice 1: Inherit from wp-scripts, Don't Replace

### ✗ Wrong: Complete Override

```javascript
// jest.config.js - LOSES ALL wp-scripts DEFAULTS
module.exports = {
  testMatch: ['**/__tests__/**/*.js'],
  // ❌ Missing moduleNameMapper
  // ❌ Missing transforms
  // ❌ Missing collectCoverageFrom
};
```

Problems:
- No @wordpress/* module mapping
- No JSX transpilation
- No coverage collection
- Overrides wp-scripts defaults completely

### ✓ Right: Extend wp-scripts Config

```javascript
// jest.config.js - EXTENDS wp-scripts
const defaultConfig = require('@wordpress/scripts/config/jest.config');

module.exports = {
  ...defaultConfig,
  // Only override what you need
  testMatch: [
    ...defaultConfig.testMatch,
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    ...defaultConfig.collectCoverageFrom,
    'skill/**/*.{js,jsx,ts,tsx}',
  ],
};
```

Benefits:
- ✅ Keeps all wp-scripts defaults (transforms, mappings, etc.)
- ✅ Only adds/overrides what's needed
- ✅ Future-proof if wp-scripts changes
- ✅ Works with WordPress updates

### How to Check wp-scripts Defaults

```bash
# See what wp-scripts provides
npx wp-scripts --version

# Look at the default config
node -e "console.log(JSON.stringify(require('@wordpress/scripts/config/jest.config'), null, 2))"
```

---

## Best Practice 2: Organize Tests by Type, Not Location

### Project Structure: By Type (Recommended)

```
project/
├── src/
│   ├── blocks/
│   │   ├── hero/
│   │   │   ├── index.js          (Block registration)
│   │   │   ├── edit.js           (Editor component)
│   │   │   ├── save.js           (Frontend render)
│   │   │   ├── edit.test.js      (Jest: Editor UI)
│   │   │   └── save.test.js      (Jest: Frontend)
│   ├── components/
│   │   ├── button/
│   │   │   ├── index.js
│   │   │   ├── index.test.js     (Jest: Component testing)
│   │   └── card/
│   ├── utils/
│   │   ├── helpers.js
│   │   └── helpers.test.js       (Jest: Utility testing)
│   └── index.js
└── jest.config.js

Test Discovery:
  ✓ src/blocks/hero/edit.test.js      (Jest)
  ✓ src/blocks/hero/save.test.js      (Jest)
  ✓ src/components/button/index.test.js (Jest)
  ✓ src/utils/helpers.test.js          (Jest)
```

Benefits:
- ✅ Test lives next to code it tests
- ✅ Easy to see test coverage at a glance
- ✅ Tests are automatically discovered
- ✅ No separate test folder to maintain

### Less Ideal: Centralized Tests

```
project/
├── src/
│   ├── blocks/hero/index.js
│   ├── components/button.js
│   └── utils/helpers.js
├── __tests__/                        # Separate test folder
│   ├── blocks/hero.test.js
│   ├── components/button.test.js
│   └── utils/helpers.test.js
└── jest.config.js
```

Problems:
- ✗ Tests are far from code
- ✗ Hard to see what's tested
- ✗ Requires parallel file structure
- ✗ Harder to maintain

Use centralized tests only for:
- Integration tests (multiple components)
- End-to-end tests with Playwright
- Setup/configuration tests

---

## Best Practice 3: Use Consistent Test File Naming

### ✓ Recommended Naming

```javascript
// .test.js (Jest convention - RECOMMENDED)
src/blocks/hero.test.js
src/components/button.test.js
src/utils/helpers.test.js

// .spec.js (Angular convention - also works)
src/blocks/hero.spec.js

// ✗ Avoid these
src/blocks/hero_test.js           (underscore)
src/blocks/test_hero.js           (test prefix)
src/blocks/heroTest.js            (camelCase)
src/blocks/hero-test.js           (kebab-case)
```

### Configure in jest.config.js

```javascript
testMatch: [
  // Only *.test.js and *.spec.js
  '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
],
```

Benefits:
- ✅ Consistent with industry standards
- ✅ Easy to spot test files
- ✅ Clear intent (this file tests something)

---

## Best Practice 4: Enforce 100% Coverage Thresholds

### Coverage Threshold Configuration

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 100,      // All if/else paths tested
    functions: 100,     // All functions called
    lines: 100,         // All lines executed
    statements: 100,    // All statements run
  },
  // Per-file thresholds (optional)
  './src/critical/': {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  },
},
```

### Why 100% Coverage

1. **Catches Untested Paths**
   ```javascript
   function handleError(error) {
     if (error.code === 'TIMEOUT') {
       console.error('Timeout');     // ← This path untested?
     } else {
       console.error('Unknown');
     }
   }
   ```
   Coverage shows: 75% (one branch missing)

2. **Forces Better Test Design**
   - You must test error cases
   - You must test edge cases
   - You must test all logical branches

3. **Prevents Regression**
   - Future changes can't reduce coverage
   - Tests fail if coverage drops
   - CI blocks merges below 100%

### Enforce in CI/CD

```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: npm test -- --coverage

- name: Fail if Coverage < 100%
  run: npx jest --coverage --coverageReporters=text --bail
```

### Handling Unavoidable Gaps

```javascript
// Only use sparingly:
function logAnalytics(event) {
  // pragma: no coverage - Production-only telemetry
  if (typeof window !== 'undefined') {
    window.analytics?.track(event);
  }
}
```

```javascript
// In test:
// Don't cover browser-specific code when testing in Node
if (process.env.NODE_ENV === 'test') {
  return;
}
```

---

## Best Practice 5: Test WordPress Blocks Comprehensively

### The 7 Dimensions of Block Testing

```javascript
// 1. REGISTRATION - Block is registered and discoverable
test('block is registered', () => {
  expect(wp.blocks.getBlockType('namespace/hero')).toBeDefined();
});

// 2. EDITOR UI - Inspector controls work
test('inspector controls render', () => {
  const { getByText } = render(<Edit attributes={{}} setAttributes={() => {}} />);
  expect(getByText('Title')).toBeInTheDocument();
});

// 3. FRONTEND - Block renders correctly
test('block renders on frontend', () => {
  const { container } = render(<Save attributes={{ title: 'Test' }} />);
  expect(container.querySelector('.wp-block-hero')).toBeInTheDocument();
});

// 4. RESPONSIVE - Works at all breakpoints
test('block is responsive', () => {
  render(<Hero attributes={{ title: 'Test' }} />);
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query === '(max-width: 768px)',
  }));
  // Test mobile layout
});

// 5. ACCESSIBILITY - WCAG 2.2 AAA compliant
test('block has accessible button', () => {
  const { getByRole } = render(<Hero />);
  const button = getByRole('button', { name: /save/i });
  expect(button).toBeVisible();
});

// 6. ATTRIBUTES - Properties serialize/deserialize correctly
test('block attributes are correct', () => {
  const { getByLabelText } = render(
    <Edit attributes={{ title: 'Test' }} setAttributes={setAttributes} />
  );
  fireEvent.change(getByLabelText('Title'), { target: { value: 'New' } });
  expect(setAttributes).toHaveBeenCalledWith({ title: 'New' });
});

// 7. THEME.JSON - Design tokens are applied
test('block uses theme.json colors', () => {
  const { container } = render(<Hero attributes={{ color: 'primary' }} />);
  const element = container.querySelector('.wp-block-hero');
  expect(element).toHaveStyle('color: var(--wp--preset--color--primary)');
});
```

### Test File Template

```javascript
/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import { Hero } from './edit';
import { HeroSave } from './save';

describe('Hero Block', () => {
  // 1. Registration
  describe('Registration', () => {
    test('block is registered', () => {
      // ...
    });
  });

  // 2. Editor UI
  describe('Editor UI', () => {
    test('renders without crashing', () => {
      const { container } = render(
        <Hero attributes={{}} setAttributes={() => {}} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  // 3. Frontend
  describe('Frontend Rendering', () => {
    test('renders content', () => {
      const { getByText } = render(
        <HeroSave attributes={{ title: 'Test' }} />
      );
      expect(getByText('Test')).toBeInTheDocument();
    });
  });

  // 4. Responsive
  describe('Responsive Behavior', () => {
    test('adapts to mobile', () => {
      // ...
    });
  });

  // 5. Accessibility
  describe('Accessibility', () => {
    test('keyboard navigation works', () => {
      // ...
    });
  });

  // 6. Attributes
  describe('Attributes', () => {
    test('attributes update correctly', () => {
      // ...
    });
  });

  // 7. Theme.json
  describe('Design Tokens', () => {
    test('applies color tokens', () => {
      // ...
    });
  });
});
```

---

## Best Practice 6: Troubleshooting Checklist

### "Tests not found" Debugging

```bash
# 1. List discovered tests
npx jest --listTests

# 2. Check test file naming
find . -name "*.test.js" -o -name "*.spec.js" | head -10

# 3. Verify testMatch pattern
npx jest --showConfig 2>&1 | grep -A 5 testMatch

# 4. Check file is in testMatch location
ls -la src/blocks/*.test.js

# 5. Run specific test file
npx jest src/blocks/hero.test.js
```

### "Coverage 0%" Debugging

```bash
# 1. Check collectCoverageFrom
npx jest --showConfig 2>&1 | grep -A 10 collectCoverageFrom

# 2. Check source file location
ls -la src/**/*.js

# 3. Verify test imports source
grep "import.*from" src/blocks/hero.test.js

# 4. Run with coverage verbose
npx jest --coverage --verbose

# 5. Check coverage report
open coverage/index.html
```

### "@wordpress/element" Import Error Debugging

```bash
# 1. Check @wordpress/element is installed
npm ls @wordpress/element

# 2. Verify module path
ls -la node_modules/@wordpress/element/

# 3. Check moduleNameMapper
npx jest --showConfig 2>&1 | grep -A 20 moduleNameMapper

# 4. Test module resolution
node -e "console.log(require.resolve('@wordpress/element'))"

# 5. Run with detailed error
npx jest --verbose 2>&1 | head -50
```

---

## Best Practice 7: CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Jest Tests
        run: npm run test:ci

      - name: Coverage Report
        if: always()
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests

      - name: Comment Coverage
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Package.json Scripts for CI

```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --coverage --ci --maxWorkers=2",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "coverage:check": "jest --coverage --coverageReporters=text --bail"
  }
}
```

---

## Best Practice 8: Pre-commit Hooks with Lefthook

### lefthook.yml Configuration

```yaml
pre-commit:
  commands:
    jest:
      glob: "src/**/*.{js,jsx}"
      run: npm test -- --bail --findRelatedTests {staged_files}
      
    coverage:
      run: npm run coverage:check
      fail: exit
```

Benefits:
- ✅ Tests run before commit
- ✅ Catches issues locally
- ✅ Prevents broken code from being committed
- ✅ Only tests changed files (faster)

### Installation

```bash
npm install --save-dev lefthook
npx lefthook install
```

---

## Quick Reference: Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| No tests found | testMatch doesn't match file location | Add pattern: `<rootDir>/src/**/*.test.js` |
| Coverage 0% | collectCoverageFrom not set | Add: `collectCoverageFrom: ['src/**/*.js']` |
| @wordpress/* error | moduleNameMapper missing | Add mapping: `'^@wordpress/element$': require.resolve('@wordpress/element')` |
| JSX not transpiled | No babel-jest | Install: `npm install --save-dev babel-jest @babel/preset-react` |
| Tests timeout | testTimeout too short | Increase: `testTimeout: 10000` |
| Flaky tests | Async code not awaited | Use: `waitFor`, `findByRole`, etc. from @testing-library/react |
| Import from src fails | Module resolution | Check moduleFileExtensions and ts/js order |

---

## Summary: Prevention Checklist

Before committing your jest.config.js:

- [ ] Extending wp-scripts defaults (not replacing)
- [ ] testMatch includes multiple patterns with `<rootDir>`
- [ ] collectCoverageFrom matches your source structure
- [ ] moduleNameMapper includes @wordpress/* packages
- [ ] jest.setup.js exists and is referenced
- [ ] .babelrc or babel.config.js exists with React preset
- [ ] __mocks__/ folder exists with styleMock.js and fileMock.js
- [ ] npm run test passes with 100% coverage
- [ ] Tests organized by type (*.test.js next to source)
- [ ] Coverage threshold is 100% across all metrics
- [ ] CI/CD runs: npm run test:ci with coverage gates

---

## Resources

- Jest Documentation: https://jestjs.io/docs/getting-started
- WordPress Block Handbook: https://developer.wordpress.org/block-editor/
- @wordpress/element: https://www.npmjs.com/package/@wordpress/element
- Testing Library Docs: https://testing-library.com/docs/react-testing-library/intro/
- wp-scripts: https://www.npmjs.com/package/@wordpress/scripts
