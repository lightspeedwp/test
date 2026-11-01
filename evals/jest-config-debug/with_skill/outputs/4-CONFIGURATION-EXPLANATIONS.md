# Why Each Configuration Setting Works

Deep dive into the Jest configuration and how it solves each issue.

---

## Issue #1: testMatch Not Finding Tests

### The Problem
Jest couldn't find tests because the testMatch pattern didn't match your file structure.

### The Solution: Multi-Pattern testMatch

```javascript
testMatch: [
  '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
  '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
  '<rootDir>/tests/**/*.{js,jsx,ts,tsx}',
  '<rootDir>/test/**/*.test.{js,jsx,ts,tsx}',
],
```

### Why This Works

1. **Multiple Patterns**
   - Tests can be located in ANY of these common locations
   - Each pattern looks for test files in different ways
   - Jest combines all matches into one test suite

2. **`<rootDir>` Prefix**
   - Jest resolves `<rootDir>` to your project root
   - Without it, paths are relative to jest.config.js location
   - This ensures paths work regardless of where jest.config.js is

3. **File Extensions**
   - `.{js,jsx,ts,tsx}` matches JavaScript AND TypeScript
   - Works with React (.jsx) and vanilla JS (.js)
   - Future-proof for TypeScript adoption

4. **Glob Pattern Breakdown**
   ```
   <rootDir>/__tests__/**/*.{js,jsx,ts,tsx}
   ├─ <rootDir>/           → Project root
   ├─ __tests__/           → Test folder (modern convention)
   ├─ **                   → Any nested subdirectories
   └─ *.{js,jsx,ts,tsx}    → Any JavaScript/TypeScript file
   ```

### Common WordPress Plugin Structure

```
project/
├── __tests__/              ← Pattern 1 finds these
│   └── hero.test.js
├── src/
│   └── blocks/
│       └── hero.test.js    ← Pattern 2 finds these
├── tests/                  ← Pattern 3 finds these
│   └── hero.test.js
└── test/                   ← Pattern 4 finds these
    └── hero.test.js
```

### How to Verify testMatch Works

```bash
# List all files Jest discovered as tests
npx jest --listTests

# Should output:
# /project/__tests__/hero.test.js
# /project/src/blocks/hero.test.js
# /project/tests/hero.test.js
# /project/test/hero.test.js
```

### If It Still Doesn't Work

1. **Check file naming**
   ```bash
   # ✓ Correct
   hero.test.js
   hero.spec.js
   
   # ✗ Wrong (not matched)
   hero_test.js
   test-hero.js
   heroTest.js
   ```

2. **Check file location**
   ```bash
   # ✓ Correct (pattern 2)
   src/blocks/hero.test.js
   
   # ✗ Wrong (not in any pattern)
   lib/hero.test.js
   ```

3. **Run Jest with verbose output**
   ```bash
   npx jest --verbose --no-coverage
   ```

---

## Issue #2: Coverage Showing 0%

### The Problem
Jest runs tests but reports 0% coverage because it doesn't know which files to measure coverage for.

### The Solution: collectCoverageFrom Patterns

```javascript
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
```

### Why This Works

1. **Positive Patterns (without !)**
   ```javascript
   'src/**/*.{js,jsx,ts,tsx}'
   ```
   - Tells Jest: "I want coverage for these files"
   - Glob pattern matches ALL files recursively
   - Jest will measure line/branch/function coverage for these

2. **Negative Patterns (with !)**
   ```javascript
   '!src/**/*.test.{js,jsx,ts,tsx}'
   ```
   - Exclude test files themselves from coverage
   - Coverage should measure tested code, not test code
   - Improves coverage percentage accuracy

3. **Multiple Source Directories**
   ```javascript
   'src/**/*.{js,jsx,ts,tsx}',      // Most common
   'skill/**/*.{js,jsx,ts,tsx}',    // Alternative structure
   'blocks/**/*.{js,jsx,ts,tsx}',   // Block-specific folder
   ```
   - Customize patterns for your project structure
   - Add directories based on WHERE your code lives

### Coverage Calculation

```javascript
// Without collectCoverageFrom:
Test runs: hero.test.js → imports hero.js
Coverage: only hero.js is measured
         button.js shows 0% (not imported by tests)
         Result: Misleading 50% coverage

// With collectCoverageFrom:
Test runs: hero.test.js → imports hero.js
collectCoverageFrom includes: [src/**/*.js]
Coverage measures: hero.js + button.js + all src files
         Result: Accurate coverage (e.g., 85%)
         shows exactly which files lack tests
```

### Why Exclude Test Files

```javascript
'!src/**/*.test.{js,jsx,ts,tsx}',
```

- Test files shouldn't count toward coverage
- They're not part of the product code
- Including them inflates coverage numbers
- Example:
  ```
  src/hero.js (product code)
  src/hero.test.js (test code)
  
  ✓ Correct: Only hero.js counts toward coverage
  ✗ Wrong: Both hero.js and hero.test.js count (inflated)
  ```

### Why Exclude node_modules

```javascript
'!**/node_modules/**',
```

- Third-party code shouldn't count toward YOUR coverage
- Your tests might import packages, but you don't need to cover them
- Drastically reduces coverage report size and time

### How to Verify Coverage Works

```bash
# Generate coverage report
npm test

# Check coverage directory
ls -la coverage/
# Shows:
# - coverage/index.html (visual report)
# - coverage/lcov-report/ (detailed breakdown)
# - coverage/coverage-final.json (raw data)
```

### Coverage Report Interpretation

```
COVERAGE summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Statements   : 85.2% (123/145)    ← Lines of code executed
Branches     : 78.5% (32/41)      ← if/else branches taken
Functions    : 90.0% (18/20)      ← Functions called
Lines        : 86.1% (125/145)    ← Same as statements

File                       Stmts   Branches  Funcs  Lines
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All files                   85.2      78.5    90.0   86.1
 src/blocks/hero.js         100       100     100    100   ✓ Full coverage
 src/blocks/button.js        65        50      60     68   ✗ Gaps!
 src/utils/helpers.js        90        80      90     90   ~ Close
```

This shows exactly which files need more tests.

### Missing Coverage = Untested Code

```javascript
// src/utils/helpers.js
export function formatPrice(price) {
  if (price < 0) {
    return 'Invalid';  // ✓ Tested
  }
  return `$${price}`;  // ✓ Tested
}

export function formatDate(date) {
  // ✗ NOT TESTED - No test file imports this function
  return new Date(date).toLocaleDateString();
}

// Coverage shows:
// formatPrice(): 100% coverage
// formatDate(): 0% coverage
// helpers.js overall: 50% coverage
```

---

## Issue #3: Module Mapping for @wordpress/element

### The Problem
Jest doesn't understand how to resolve `@wordpress/element` because:
1. Jest uses Node's module resolution
2. Webpack (used by npm start) uses different rules
3. Jest needs explicit moduleNameMapper configuration

### The Solution: moduleNameMapper for WordPress

```javascript
moduleNameMapper: {
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
  '\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
},
```

### Why This Works

1. **Regex Pattern Matching**
   ```javascript
   '^@wordpress/element$'
   ├─ ^ = start of import path
   ├─ @wordpress/element = exact match
   └─ $ = end of import path
   ```

   When Jest sees:
   ```javascript
   import { render } from '@wordpress/element';
   ```
   
   It matches `@wordpress/element` and uses the mapped module.

2. **require.resolve()**
   ```javascript
   '^@wordpress/element$': require.resolve('@wordpress/element')
   ```
   
   - `require.resolve()` finds the exact file path of the module
   - Returns the actual location of @wordpress/element in node_modules
   - Jest uses this exact path when the import is found
   
   Example:
   ```
   Import: import { render } from '@wordpress/element'
   Match: @wordpress/element
   Resolve: /project/node_modules/@wordpress/element/index.js
   Jest uses: /project/node_modules/@wordpress/element/index.js
   ```

3. **Fallback Pattern**
   ```javascript
   '^@wordpress/.*$': '<rootDir>/node_modules/$0',
   ```
   
   - `.*` matches ANY remaining @wordpress/* package
   - `$0` = entire matched pattern
   - If specific mapping doesn't exist, use generic node_modules lookup
   
   Example:
   ```
   Import: import { dispatch } from '@wordpress/data'
   No specific mapping for @wordpress/data
   Fallback: match '^@wordpress/.*$'
   Resolve: <rootDir>/node_modules/@wordpress/data
   ```

4. **CSS/Image Mocking**
   ```javascript
   '\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
   '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
   ```
   
   - Blocks can import CSS: `import './hero.css'`
   - Jest can't process CSS in tests
   - Instead, replace with mock objects
   - Mock returns empty object: `module.exports = {}`

### Why npm start Works But Jest Doesn't

**npm start (Webpack):**
```
Import: @wordpress/element
Webpack resolver:
├─ Check package.json "exports" field
├─ Check "main" field
├─ Try /index.js
└─ Find and load ✓
```

**Jest (Node):**
```
Import: @wordpress/element
Jest resolver:
├─ Look for @wordpress/element in node_modules
├─ Check package.json "exports" field (different than Webpack)
├─ Fail to find ✗
└─ Error: Cannot find module

Solution: moduleNameMapper tells Jest exactly where to look
```

### How to Verify Mapping Works

```bash
# Run Jest with verbose output to see module resolution
npx jest --verbose --no-coverage

# Should show:
# ✓ Successfully imported @wordpress/element
# ✓ Successfully imported @wordpress/components
# etc.
```

### If Module Still Not Found

1. **Check package is installed**
   ```bash
   npm ls @wordpress/element
   # Should show the installed version
   ```

2. **Check node_modules structure**
   ```bash
   ls -la node_modules/@wordpress/element/
   # Should exist
   ```

3. **Verify mapping in jest.config.js**
   ```bash
   # Add debug logging
   # In jest.config.js, add:
   console.log('moduleNameMapper:', module.exports.moduleNameMapper);
   ```

4. **Run with additional debugging**
   ```bash
   npx jest --showConfig 2>&1 | grep -A 20 "moduleNameMapper"
   ```

---

## The Order of Resolution

Jest resolves imports in this order:

1. **moduleNameMapper** (highest priority)
   - Check all patterns
   - First match wins

2. **moduleFileExtensions**
   - Try resolving with .ts, .tsx, .js, .jsx, .json
   - In that order

3. **Node module resolution**
   - Standard node_modules lookup
   - package.json "main" field

4. **Relative paths**
   - ./src/hero.js
   - ../utils/helpers.js

### Example Resolution

```javascript
import { render } from '@wordpress/element';
import Button from '../components/button';
import config from '../config.json';

// 1. '@wordpress/element'
//    → Check moduleNameMapper: '^@wordpress/element$'
//    → Found! Use: /node_modules/@wordpress/element/index.js
//    ✓ Resolved

// 2. '../components/button'
//    → Not in moduleNameMapper
//    → Try relative path with extensions
//    → Try: ../components/button.ts, .tsx, .js, .jsx, .json
//    → Found: ../components/button.jsx
//    ✓ Resolved

// 3. '../config.json'
//    → Not in moduleNameMapper
//    → JSON extension already specified
//    → Found: ../config.json
//    ✓ Resolved
```

---

## Summary: Why It All Works Together

| Setting | Problem | Solution |
|---------|---------|----------|
| testMatch | Tests not found | Multiple patterns with `<rootDir>` |
| collectCoverageFrom | 0% coverage | Explicit file patterns to measure |
| moduleNameMapper | @wordpress/* not resolved | Map patterns to actual module paths |

When all three are configured correctly:

```
Jest starts
  ↓
Finds tests via testMatch ✓
  ↓
Runs tests successfully ✓
  ↓
Imports @wordpress/element via moduleNameMapper ✓
  ↓
Measures coverage via collectCoverageFrom ✓
  ↓
Reports 100% coverage (if all lines tested) ✓
```

---

## Next Steps

See **4-BEST-PRACTICES.md** for:
- How to debug when things still don't work
- Prevention strategies
- WordPress plugin testing patterns
- CI/CD integration
