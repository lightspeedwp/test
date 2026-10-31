# Jest Configuration for WordPress Plugins - Complete Debug Package

This package contains everything you need to fix Jest configuration issues in WordPress plugin testing with wp-scripts.

## The Three Issues Covered

### 1. **testMatch Not Finding Tests**
- **Symptom:** "No tests found" or empty test output
- **Root Cause:** Incorrect glob patterns, file extensions not recognized
- **Solution:** Explicit testMatch patterns with `<rootDir>/` prefix covering all test locations
- **Fix Location:** jest.config.js (testMatch section)

### 2. **Coverage Showing 0% Despite Tests Running**
- **Symptom:** Tests execute successfully but coverage reports 0%
- **Root Cause:** collectCoverageFrom not configured, or coverage reporter missing
- **Solution:** Set collectCoverageFrom to explicitly include source files + configure reporters
- **Fix Location:** jest.config.js (collectCoverageFrom & coverageReporters sections)

### 3. **Module Mapping Fails for @wordpress/* Imports**
- **Symptom:** "Cannot find module '@wordpress/element'" errors
- **Root Cause:** Jest doesn't know how to resolve WordPress scoped packages
- **Solution:** moduleNameMapper pointing to actual node_modules package exports
- **Fix Location:** jest.config.js (moduleNameMapper section)

---

## Files in This Package

### Core Configuration Files

#### `jest.config.js` (MAIN FILE)
Your complete, working Jest configuration for WordPress plugins. Includes:
- Fixed testMatch patterns (Issue 1)
- Coverage collection setup (Issue 2)
- WordPress package mapping (Issue 3)
- CSS/image mocking
- Transform configuration
- TypeScript support

**Action:** Copy directly to your plugin root or review line-by-line for your setup.

#### `jest.setup.js` (OPTIONAL)
Global WordPress mocks available to all tests without importing. Includes:
- wp.element, wp.components, wp.data
- wp.hooks, wp.i18n, wp.apiFetch
- Mock helper functions
- Window polyfills

**Action:** Reference in jest.config.js with `setupFilesAfterEnv: ['<rootDir>/jest.setup.js']`

#### `__mocks__/styleMock.js`
Mock for CSS/SCSS imports. Allows tests to proceed when components import stylesheets.

**Action:** Create this file in your plugin root under `__mocks__/` directory

#### `__mocks__/fileMock.js`
Mock for image/font imports. Allows tests to proceed when components use static assets.

**Action:** Create this file in your plugin root under `__mocks__/` directory

### Documentation

#### `JEST_DEBUG_GUIDE.md` (START HERE)
Deep technical explanation of:
- What causes each issue
- How to diagnose
- Why the fix works
- Best practices for WordPress Jest setup
- Progressive coverage thresholds
- GitHub Actions CI/CD integration

**Read this first** to understand the "why" behind each fix.

#### `QUICK_REFERENCE.md` (CHEAT SHEET)
One-page reference covering:
- All three issues and fixes
- Copy-paste configurations
- Common problems and solutions
- Diagnostic commands
- File organization best practice
- package.json scripts
- CI/CD example

**Use this** when you need fast answers or copy-paste fixes.

#### `TROUBLESHOOTING.md` (STEP-BY-STEP)
Systematic 11-step debugging process:
1. Verify Jest installation
2. Check test file discovery
3. Verify Jest configuration
4. Verify installed dependencies
5. Test module resolution
6. Run simple test
7. Check coverage collection
8. Diagnose CSS/image imports
9. Diagnose React issues
10. Check transform chain
11. Debug individual tests

**Follow this** when tests still don't work after using the fixed config.

#### `EXAMPLE_TESTS.md` (WORKING CODE)
Real test examples demonstrating:
- Testing WordPress blocks (React components)
- Testing utility functions
- Testing WordPress hooks integration
- Integration testing
- Common testing patterns
- Assertions for DOM content
- Async operation testing

**Copy these patterns** into your own test files.

---

## Quick Start (5 Minutes)

### Step 1: Copy Configuration Files
```bash
# Copy the main config
cp jest.config.js /path/to/your/plugin/

# Create mock directory and files
mkdir -p __mocks__
cp __mocks__/styleMock.js __mocks__/
cp __mocks__/fileMock.js __mocks__/

# Optional: Setup file
cp jest.setup.js /path/to/your/plugin/
```

### Step 2: Verify in Your Plugin
```bash
cd /path/to/your/plugin

# List tests Jest finds
npx jest --listTests

# Show configuration
npx jest --showConfig

# Run tests
npm test
```

### Step 3: Check Coverage
```bash
npm run test:coverage
# Opens coverage report at coverage/index.html
```

### Step 4: Read the Docs
- **Want to understand what was wrong?** → Read `JEST_DEBUG_GUIDE.md`
- **Need quick answers?** → Check `QUICK_REFERENCE.md`
- **Tests still failing?** → Follow `TROUBLESHOOTING.md`
- **Want example code?** → See `EXAMPLE_TESTS.md`

---

## Which File to Read?

| Your Question | Read This |
|---|---|
| "I'm new to Jest and WordPress testing" | JEST_DEBUG_GUIDE.md |
| "I just need the fixes NOW" | jest.config.js (inline comments explain each section) |
| "Quick lookup - what was the coverage fix?" | QUICK_REFERENCE.md |
| "My tests still don't work" | TROUBLESHOOTING.md |
| "How do I write tests?" | EXAMPLE_TESTS.md |
| "I need this configured but don't understand Jest" | Follow steps 1-2 of TROUBLESHOOTING.md, then read JEST_DEBUG_GUIDE.md |

---

## Common Scenarios

### "I Have No Tests Running"

1. Copy `jest.config.js` to plugin root
2. Run: `npx jest --listTests`
3. If still empty, read: **TROUBLESHOOTING.md** → **Step 2: Check Test File Discovery**

### "Tests Run but Coverage is 0%"

1. Check jest.config.js has `collectCoverageFrom` section
2. Verify coverage reporters configured
3. Run: `npm run test:coverage`
4. If still 0%, read: **TROUBLESHOOTING.md** → **Step 7: Check Coverage Collection**

### "Errors About @wordpress/element Not Found"

1. Check `jest.config.js` has `moduleNameMapper` section
2. Verify paths use `path.resolve()`
3. Run: `npm ls @wordpress/element`
4. If package missing, install: `npm install --save-dev @wordpress/element`
5. If still erroring, read: **TROUBLESHOOTING.md** → **Step 4: Verify Installed Dependencies**

### "CSS/Image Import Errors"

1. Create `__mocks__/styleMock.js` and `__mocks__/fileMock.js` (provided in this package)
2. Verify jest.config.js has styleSheet and image mappings
3. Run: `npx jest --showConfig | grep -A2 "css\|svg"`
4. If still erroring, read: **TROUBLESHOOTING.md** → **Step 8: Diagnose CSS/Image Import Errors**

---

## Key Points to Remember

✓ Use `<rootDir>/` prefix in all relative paths  
✓ Use `path.resolve()` in moduleNameMapper (not quoted strings)  
✓ Create `__mocks__/` directory for CSS/image mocks  
✓ Set testEnvironment to `jsdom` for WordPress components  
✓ Reference jest.setup.js for global WordPress mocks  
✓ Run `npx jest --showConfig` to verify configuration  
✓ Run `npx jest --listTests` to verify test discovery  

---

## Included Configuration Covers

- ✓ Jest 29.x
- ✓ WordPress @5.x+ block editor packages
- ✓ React testing with @testing-library/react
- ✓ TypeScript and TSX files
- ✓ CSS/SCSS imports
- ✓ Image/font imports
- ✓ Coverage collection and reporting
- ✓ Snapshot testing
- ✓ Watch mode with typeahead
- ✓ jsdom environment for DOM APIs

---

## Installation and Verification

### Install Dependencies
```bash
npm install --save-dev \
  jest \
  babel-jest \
  @wordpress/babel-preset-default \
  @testing-library/react \
  @testing-library/jest-dom \
  jest-environment-jsdom
```

### Optional for TypeScript
```bash
npm install --save-dev ts-jest typescript
```

### Verify Setup
```bash
# Should list test files
npx jest --listTests

# Should show config without errors
npx jest --showConfig

# Should run and pass
npm test
```

---

## Documentation Structure

```
outputs/
├── jest.config.js                    ← Main config (copy to plugin root)
├── jest.setup.js                     ← Optional: global setup
├── __mocks__/
│   ├── styleMock.js                  ← CSS mock
│   └── fileMock.js                   ← Image mock
├── README.md                         ← This file
├── JEST_DEBUG_GUIDE.md               ← Deep technical explanation
├── QUICK_REFERENCE.md                ← Cheat sheet & commands
├── TROUBLESHOOTING.md                ← 11-step debugging process
└── EXAMPLE_TESTS.md                  ← Working code examples
```

---

## Support References

- **Jest Official:** https://jestjs.io/
- **WordPress Block Editor:** https://developer.wordpress.org/block-editor/
- **WordPress JavaScript Packages:** https://developer.wordpress.org/block-editor/reference-guides/packages/
- **Testing Library:** https://testing-library.com/
- **wp-scripts:** https://developer.wordpress.org/block-editor/packages/packages-scripts/

---

## Troubleshooting Chain

1. **Tests not found?** → TROUBLESHOOTING.md Step 2
2. **Module not found?** → TROUBLESHOOTING.md Step 4
3. **CSS/Image errors?** → TROUBLESHOOTING.md Step 8
4. **Coverage 0%?** → TROUBLESHOOTING.md Step 7
5. **Tests timeout?** → QUICK_REFERENCE.md (Common Problems)
6. **Still broken?** → Run diagnostic script in TROUBLESHOOTING.md

---

## Next Steps

1. **Copy jest.config.js** to your plugin root
2. **Create __mocks__/ directory** with styleMock.js and fileMock.js
3. **Run**: `npx jest --listTests` (verify tests found)
4. **Run**: `npm test` (verify tests run)
5. **Run**: `npm run test:coverage` (verify coverage works)
6. **Read**: JEST_DEBUG_GUIDE.md (understand the fixes)

---

## Questions?

- **"Why does this work?"** → JEST_DEBUG_GUIDE.md
- **"How do I do X?"** → QUICK_REFERENCE.md
- **"Something's broken"** → TROUBLESHOOTING.md
- **"Show me examples"** → EXAMPLE_TESTS.md

---

Generated: 2024  
For WordPress plugins using wp-scripts and Jest 29.x+  
Compatible with @wordpress/element 5.x+ and @wordpress/components 20.x+
