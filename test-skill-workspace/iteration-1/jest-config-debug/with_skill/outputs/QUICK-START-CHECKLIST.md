# Quick Start Checklist: Get Jest Working in 5 Minutes

Use this checklist to implement the fixes immediately.

---

## Step 1: Copy the Fixed jest.config.js (2 min)

```bash
# Copy the fixed configuration file to your project
cp 2-FIXED-JEST-CONFIG.js /your/project/jest.config.js
```

Or manually create `jest.config.js` in your project root with the configuration from **2-FIXED-JEST-CONFIG.js**.

---

## Step 2: Create Supporting Files (2 min)

### A. Create jest.setup.js

```bash
# Copy this to jest.setup.js in project root
cat > jest.setup.js << 'EOF'
import '@testing-library/jest-dom';

// Mock WordPress globals
global.wp = {
  i18n: {
    __: (text) => text,
    _x: (text) => text,
    _n: (singular, plural, count) => count === 1 ? singular : plural,
  },
};

global.fetch = jest.fn();
EOF
```

### B. Create Mock Files

```bash
# Create __mocks__ directory
mkdir -p __mocks__

# Create styleMock.js
echo "module.exports = {};" > __mocks__/styleMock.js

# Create fileMock.js
echo "module.exports = 'test-file-stub';" > __mocks__/fileMock.js
```

### C. Create .babelrc

```bash
cat > .babelrc << 'EOF'
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }],
    "@babel/preset-react"
  ]
}
EOF
```

---

## Step 3: Install Dependencies (1 min)

```bash
npm install --save-dev \
  jest \
  babel-jest \
  @babel/core \
  @babel/preset-env \
  @babel/preset-react \
  @testing-library/react \
  @testing-library/jest-dom \
  jest-environment-jsdom
```

Or add to package.json:

```json
{
  "devDependencies": {
    "jest": "^29.5.0",
    "babel-jest": "^29.5.0",
    "@babel/core": "^7.22.0",
    "@babel/preset-env": "^7.22.0",
    "@babel/preset-react": "^7.22.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest-environment-jsdom": "^29.5.0"
  }
}
```

Then run: `npm install`

---

## Step 4: Verify Tests Are Discovered (30 sec)

```bash
# List all discovered tests
npx jest --listTests

# Should show your test files:
# /project/__tests__/hero.test.js
# /project/src/blocks/hero.test.js
# etc.
```

If no tests found, check:
- [ ] Test file in correct location (src/**/*.test.js or __tests__/**)
- [ ] File is named *.test.js or *.spec.js
- [ ] jest.config.js is in project root

---

## Step 5: Run Tests (30 sec)

```bash
# Run all tests with coverage
npm test

# Expected output:
# PASS  src/blocks/hero.test.js
#   Hero Block
#     ✓ renders without crashing (45ms)
#
# COVERAGE summary
# Statements   : 85.2% (123/145)
# Branches     : 78.5% (32/41)
# Functions    : 90.0% (18/20)
# Lines        : 86.1% (125/145)
```

---

## Verification Results

### ✓ If You See This: SUCCESS

```
PASS  src/blocks/hero.test.js
PASS  src/components/button.test.js
PASS  src/utils/helpers.test.js

COVERAGE summary
Statements   : 100% (145/145)
Branches     : 100% (41/41)
Functions    : 100% (20/20)
Lines        : 100% (145/145)
```

All three issues are fixed!

---

### ✗ If Tests Still Not Found

```bash
# Debugging steps
npx jest --listTests                    # Shows nothing?
ls src/**/*.test.js                     # Files exist?
npx jest --showConfig | grep testMatch  # Pattern correct?

# Check testMatch in jest.config.js has <rootDir> prefix
# Check file is named *.test.js (not *.test.jsx or _test.js)
```

---

### ✗ If Coverage Still 0%

```bash
# Debugging steps
npm test -- --verbose                   # Tests run?
npx jest --showConfig | grep collectCoverageFrom  # Patterns set?

# Make sure:
# - Test file imports source: import { Hero } from '../hero'
# - Source file path matches collectCoverageFrom pattern
# - collectCoverageFrom excludes test files with '!'
```

---

### ✗ If @wordpress/element Import Fails

```bash
# Debugging steps
npm ls @wordpress/element               # Installed?
ls node_modules/@wordpress/element/     # Path exists?
npx jest --showConfig | grep moduleNameMapper | head -3

# Make sure:
# - jest.config.js has moduleNameMapper
# - @wordpress/element is in moduleNameMapper
# - Pattern uses '^@wordpress/element$' (with ^ and $)
```

---

## Common Mistakes to Avoid

### ✗ Wrong: testMatch without `<rootDir>`
```javascript
testMatch: ['__tests__/**/*.js'],  // Won't find files!
```

### ✓ Right: testMatch with `<rootDir>`
```javascript
testMatch: ['<rootDir>/__tests__/**/*.js'],
```

---

### ✗ Wrong: Overriding wp-scripts completely
```javascript
module.exports = {
  testMatch: ['...'],
  // No moduleNameMapper, no transforms = broken
};
```

### ✓ Right: Extending wp-scripts
```javascript
const defaultConfig = require('@wordpress/scripts/config/jest.config');
module.exports = {
  ...defaultConfig,
  testMatch: ['...'],
};
```

---

### ✗ Wrong: collectCoverageFrom pointing to wrong location
```javascript
collectCoverageFrom: ['app/**/*.js'],  // But code is in src/
```

### ✓ Right: collectCoverageFrom matches source structure
```javascript
collectCoverageFrom: ['src/**/*.js', 'blocks/**/*.js'],
```

---

### ✗ Wrong: Missing moduleNameMapper
```javascript
moduleNameMapper: {
  // Forgot to add @wordpress/element!
}
```

### ✓ Right: Include all WordPress packages
```javascript
moduleNameMapper: {
  '^@wordpress/element$': require.resolve('@wordpress/element'),
  '^@wordpress/components$': require.resolve('@wordpress/components'),
  // ... etc
}
```

---

## File Structure Verification

Check that your project has this structure:

```
✓ jest.config.js            (in root)
✓ jest.setup.js             (in root)
✓ .babelrc                  (in root)
✓ __mocks__/
  ✓ styleMock.js
  ✓ fileMock.js
✓ src/
  ✓ blocks/
    ✓ hero.js
    ✓ hero.test.js          (or in __tests__/)
  ✓ components/
  ✓ utils/
✓ package.json (with babel, jest, testing-library)
```

---

## Next Steps

1. **Read 3-SUPPORTING-CONFIG-FILES.md** — For detailed config explanations
2. **Read 4-CONFIGURATION-EXPLANATIONS.md** — To understand why each setting works
3. **Read 5-BEST-PRACTICES.md** — For long-term maintenance and prevention

---

## Support

If issues persist:

1. Check **1-DIAGNOSIS.md** for your specific issue
2. Check **5-BEST-PRACTICES.md** troubleshooting section
3. Run diagnostic commands:
   ```bash
   npm test -- --verbose 2>&1 | head -50
   npx jest --showConfig | grep -A 5 "testMatch\|moduleNameMapper\|collectCoverageFrom"
   ```

---

## Success Criteria

✅ When everything works:
- `npm test` passes
- All tests discovered and run
- Coverage shows 100% (or realistic percentage)
- No import errors from @wordpress/*
- CI/CD passes with coverage gates
