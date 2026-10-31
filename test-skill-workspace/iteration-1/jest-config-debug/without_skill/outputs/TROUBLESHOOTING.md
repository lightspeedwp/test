# Jest Configuration Troubleshooting Guide

## Systematic Debugging Process

This guide walks through diagnosing and fixing Jest issues step-by-step.

---

## Step 1: Verify Jest Installation

### Command
```bash
npx jest --version
npm ls jest
```

### Expected Output
```
29.5.0
jest@29.5.0
```

### If Error: "jest not found"
```bash
npm install --save-dev jest babel-jest @testing-library/react
```

### If Error: "Not compatible with this version of Jest"
Update to compatible versions:
```bash
npm install --save-dev jest@29 @wordpress/element@5 @wordpress/components@20
```

---

## Step 2: Check Test File Discovery

### Command
```bash
npx jest --listTests
```

### Expected Output
```
/Users/ash/plugin/src/blocks/my-block/edit.test.js
/Users/ash/plugin/src/utils/helpers.test.js
/Users/ash/plugin/tests/integration/startup.test.js
```

### If Empty List: "No tests found"

**Diagnosis:** Jest can't find your test files. Run:
```bash
# Check file existence
ls -la src/**/*.test.js
ls -la tests/**/*.test.js

# Check Jest's test patterns
npx jest --showConfig | grep -A 10 testMatch

# Verify file extensions
file src/blocks/my-block/edit.test.js
```

**Fix Checklist:**

1. **File naming**: Must end in `.test.js`, `.test.jsx`, `.spec.js`, or `.spec.jsx`
   - ✓ `edit.test.js`
   - ✓ `helpers.spec.js`
   - ✗ `edit_test.js` (underscore, not recognized)
   - ✗ `edit-test.js` (hyphen, not recognized)

2. **Path patterns**: Check your jest.config.js testMatch
   ```javascript
   // If your tests are in src/, pattern must include it:
   testMatch: ['<rootDir>/src/**/*.test.js']
   
   // If tests are in tests/, pattern must include it:
   testMatch: ['<rootDir>/tests/**/*.test.js']
   ```

3. **Excluded paths**: Check testPathIgnorePatterns isn't blocking tests
   ```javascript
   // BAD: Blocks everything
   testPathIgnorePatterns: ['/src/']
   
   // GOOD: Only blocks node_modules
   testPathIgnorePatterns: ['/node_modules/', '/build/']
   ```

4. **File extensions**: Check moduleFileExtensions
   ```javascript
   // If tests use .tsx, must include:
   moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx']
   ```

5. **Use <rootDir>**: Patterns must use `<rootDir>` prefix
   ```javascript
   // GOOD
   testMatch: ['<rootDir>/src/**/*.test.js']
   
   // BAD - relative paths fail in CI
   testMatch: ['src/**/*.test.js']
   ```

---

## Step 3: Check Jest Configuration

### Command
```bash
npx jest --showConfig
```

### What to Look For

**1. testMatch patterns are correct:**
```
"testMatch": [
  "<rootDir>/src/**/*.test.js",
  "<rootDir>/tests/**/*.test.js"
]
```

**2. moduleFileExtensions includes all types:**
```
"moduleFileExtensions": ["js", "jsx", "ts", "tsx", "json"]
```

**3. testEnvironment is jsdom (for WordPress):**
```
"testEnvironment": "jsdom"
```

**4. moduleNameMapper includes @wordpress packages:**
```
"moduleNameMapper": {
  "^@wordpress/element$": "<rootDir>/node_modules/@wordpress/element/build/index.js"
}
```

### If Configuration is Wrong

Edit `jest.config.js` and recheck:
```bash
npx jest --showConfig | grep -A 20 moduleNameMapper
```

---

## Step 4: Verify Installed Dependencies

### Command
```bash
npm ls @wordpress/element @wordpress/components @wordpress/blocks
```

### Expected Output
```
├── @wordpress/blocks@11.18.0
├── @wordpress/components@21.8.0
└── @wordpress/element@5.4.1
```

### If Missing
```bash
npm install --save-dev \
  @wordpress/element \
  @wordpress/components \
  @wordpress/blocks
```

### If Wrong Version
```bash
# Check package.json
cat package.json | grep @wordpress

# Update to specific version
npm install --save-dev "@wordpress/element@^5.4.1"
```

### If in node_modules but still errors

**Check path resolution:**
```bash
ls -la node_modules/@wordpress/element/
ls -la node_modules/@wordpress/element/build/
ls -la node_modules/@wordpress/element/build/index.js
```

**Should see:**
```
.../node_modules/@wordpress/element/
  ├── package.json
  ├── build/
  │   ├── index.js
  │   ├── index.js.map
  │   └── ...
  └── ...
```

---

## Step 5: Test Module Resolution

### Command
```bash
# Test if Node.js can require the package
node -e "require('@wordpress/element')"

# Should succeed silently (no error)
```

### If Error: "Cannot find module"

**Diagnosis:** The package isn't in node_modules.

**Fix:**
```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

### If Still Failing

**Check npm cache:**
```bash
npm cache clean --force
npm install
```

**Verify package.json has dependency:**
```bash
cat package.json | grep "@wordpress/element"
# Should show in devDependencies or dependencies
```

---

## Step 6: Run a Simple Test

### Create Minimal Test

Create `src/__tests__/simple.test.js`:
```javascript
describe('Jest Setup', () => {
  it('basic test works', () => {
    expect(true).toBe(true);
  });
});
```

### Run It
```bash
npx jest src/__tests__/simple.test.js
```

### Expected Output
```
 PASS  src/__tests__/simple.test.js
  Jest Setup
    ✓ basic test works (2 ms)

Tests:       1 passed, 1 total
Time:        1.234 s
```

### If FAIL: "Cannot find module @wordpress/element"

**Add import test:**
```javascript
describe('Module Resolution', () => {
  it('resolves @wordpress/element', () => {
    const element = require('@wordpress/element');
    expect(element).toBeDefined();
  });
});
```

Run and see which package fails:
```bash
npx jest src/__tests__/simple.test.js
```

**Fix:** Add to jest.config.js moduleNameMapper:
```javascript
moduleNameMapper: {
  '^@wordpress/element$': path.resolve(
    __dirname,
    'node_modules/@wordpress/element/build/index.js'
  ),
}
```

---

## Step 7: Check Coverage Collection

### Command
```bash
npx jest --coverage
```

### Expected Output
```
 PASS  src/utils/helpers.test.js
 PASS  src/blocks/my-block/edit.test.js

-------------|---------|---------|---------|---------|
File         | % Stmts | % Branch| % Funcs | % Lines |
-------------|---------|---------|---------|---------|
All files    |  45.23  |  32.15  |  50.00  |  44.56  |
 src/        |  45.23  |  32.15  |  50.00  |  44.56  |
  helpers.js |  75.00  |  60.00  |  80.00  |  75.00  |
  index.js   |  20.00  |  10.00  |  25.00  |  20.00  |
-------------|---------|---------|---------|---------|
```

### If Coverage Shows 0%

**Diagnosis:** collectCoverageFrom not configured or transform not working.

**Check 1: Are files collected?**
```bash
npx jest --coverage --collectCoverageFrom='src/**/*.js'
```

**Check 2: Is transform configured?**
```bash
npx jest --showConfig | grep -A 10 "transform"
```

Should show:
```
"transform": {
  "^.+\\.jsx?$": "babel-jest"
}
```

**Check 3: Verify .babelrc exists**
```bash
ls -la .babelrc package.json

# One of these should have babel config:
cat .babelrc
cat package.json | grep -A 5 '"babel"'
```

**Fix:** Add to jest.config.js:
```javascript
collectCoverageFrom: [
  'src/**/*.js',
  '!src/**/*.test.js',
],
coverageReporters: ['text', 'html', 'lcov'],
```

### If Coverage Reports Empty

**Check directory was created:**
```bash
ls -la coverage/
```

**If missing:**
```bash
# Permissions issue, try:
chmod -R 755 .

# Or clear and retry:
rm -rf coverage/
npx jest --coverage
```

---

## Step 8: Diagnose CSS/Image Import Errors

### Symptom: "SyntaxError: Unexpected token ."

Example full error:
```
SyntaxError: Unexpected token '.'
    at MyComponent (src/blocks/my-block/edit.js:5)
```

This means Jest tried to run `import './style.scss'` as JavaScript.

**Fix:**

1. **Verify mock files exist:**
   ```bash
   ls -la __mocks__/styleMock.js
   ls -la __mocks__/fileMock.js
   ```

2. **Add to jest.config.js:**
   ```javascript
   moduleNameMapper: {
     '\\.(css|scss|less)$': '<rootDir>/__mocks__/styleMock.js',
     '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
   }
   ```

3. **Create the mock files:**
   
   `__mocks__/styleMock.js`:
   ```javascript
   module.exports = {};
   ```
   
   `__mocks__/fileMock.js`:
   ```javascript
   module.exports = 'test-file-stub';
   ```

4. **Verify in jest.config.js:**
   ```bash
   npx jest --showConfig | grep -A 2 'scss\|css'
   ```

---

## Step 9: Diagnose React Component Issues

### Symptom: "React is not defined" or "Cannot find module 'react'"

**Fix 1: Ensure React is installed**
```bash
npm ls react
# Should show: react@18.x.x
```

**Fix 2: Add setupFilesAfterEnv**

Create `jest.setup.js`:
```javascript
import '@testing-library/jest-dom';
```

Add to jest.config.js:
```javascript
setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
```

**Fix 3: Use testing-library/react**
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

it('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText(/test/i)).toBeInTheDocument();
});
```

---

## Step 10: Check Transform Chain

### Command
```bash
npx jest --showConfig | grep -A 15 '"transform"'
```

### Expected for WordPress

```
"transform": {
  "^.+\\.jsx?$": "babel-jest",
  "^.+\\.tsx?$": "ts-jest"
}
```

### If Missing babel-jest

```bash
npm install --save-dev babel-jest @babel/preset-env
```

### If Using TypeScript

**Install ts-jest:**
```bash
npm install --save-dev ts-jest ts-loader typescript
```

**Add to jest.config.js:**
```javascript
transform: {
  '^.+\\.tsx?$': 'ts-jest',
  '^.+\\.jsx?$': 'babel-jest',
},
```

---

## Step 11: Debug Individual Test

### Enable Verbose Output

```bash
npx jest --verbose src/blocks/my-block/edit.test.js
```

**Shows:** Each test name and result

### Enable Stack Traces

```bash
npx jest --verbose --no-coverage src/blocks/my-block/edit.test.js 2>&1 | head -100
```

### Debug in Browser

```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand src/blocks/my-block/edit.test.js
```

Then open `chrome://inspect` in Chrome.

### Add Debug Logging

In your test file:
```javascript
describe('MyComponent', () => {
  it('renders', () => {
    const setAttributes = jest.fn();
    console.log('BEFORE RENDER:', { setAttributes });
    
    const { container } = render(
      <MyComponent setAttributes={setAttributes} />
    );
    
    console.log('AFTER RENDER:', container.innerHTML);
    expect(container).toBeInTheDocument();
  });
});
```

Run:
```bash
npx jest --verbose --no-coverage --silent=false
```

---

## Comprehensive Diagnosis Script

Save as `diagnose-jest.sh`:

```bash
#!/bin/bash

echo "=== Jest Configuration Diagnostic ==="
echo ""

echo "1. Jest Version:"
npx jest --version
echo ""

echo "2. Test Files Found:"
npx jest --listTests
echo ""

echo "3. Configuration Check:"
npx jest --showConfig 2>&1 | grep -A 5 testMatch
echo ""

echo "4. Dependencies Installed:"
npm ls jest @wordpress/element @wordpress/components | grep -E "jest|@wordpress"
echo ""

echo "5. Node Modules Check:"
ls -la node_modules/@wordpress/element/build/index.js 2>/dev/null || echo "MISSING!"
echo ""

echo "6. Babel Config:"
cat .babelrc 2>/dev/null || cat package.json | grep -A 5 '"babel"'
echo ""

echo "7. Mock Files:"
ls -la __mocks__/
echo ""

echo "8. Try Running Simple Test:"
npx jest --testNamePattern="basic" --no-coverage --forceExit
```

Run:
```bash
chmod +x diagnose-jest.sh
./diagnose-jest.sh
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot find module '@wordpress/element'" | moduleNameMapper missing | Add path mapping |
| "No tests found" | testMatch pattern wrong | Use `<rootDir>/` prefix |
| "SyntaxError: Unexpected token '.'" | CSS import not mocked | Create styleMock.js |
| "Tests timeout after 5000ms" | Slow operation | Add jest.setTimeout(10000) |
| "0% coverage" | collectCoverageFrom not set | Configure collection patterns |
| "Cannot find module 'react'" | React not installed | npm install react react-dom |
| "jest: command not found" | Jest not installed globally | Use npx jest or npm run test |
| "Babel syntax error" | Babel preset missing | Add @wordpress/babel-preset-default |

---

## Performance Debugging

### Slow Tests

```bash
# Show slowest tests
npx jest --logHeapUsage --detectOpenHandles
```

### High Memory Usage

```bash
# Run one test at a time
npx jest --runInBand

# Increase Node.js heap
NODE_OPTIONS=--max-old-space-size=4096 npx jest
```

### Watch Mode Not Detecting Changes

```bash
# Increase file watcher limit (macOS)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Or run with polling
jest --watch --watchPathIgnorePatterns=/node_modules
```

---

## Quick Fix Checklist

When tests fail, go through this:

- [ ] `npx jest --listTests` shows your test files
- [ ] `npx jest --showConfig` displays correct testMatch
- [ ] `npm ls @wordpress/element` shows package installed
- [ ] `node -e "require('@wordpress/element')"` doesn't error
- [ ] `__mocks__/styleMock.js` exists (for CSS tests)
- [ ] `__mocks__/fileMock.js` exists (for image tests)
- [ ] moduleNameMapper uses `path.resolve()` not strings
- [ ] testEnvironment is `jsdom` (not `node`)
- [ ] collectCoverageFrom configured (for coverage tests)
- [ ] Babel configured (usually via @wordpress preset)
- [ ] No spaces or hyphens in test file names (use .test.js)

---

## When All Else Fails

```bash
# Nuclear option: Clean and reinstall
rm -rf node_modules package-lock.json coverage/
npm cache clean --force
npm install
npx jest --clearCache
npx jest
```

---

## See Also

- Main guide: JEST_DEBUG_GUIDE.md
- Quick ref: QUICK_REFERENCE.md
- Examples: EXAMPLE_TESTS.md
- Config file: jest.config.js
