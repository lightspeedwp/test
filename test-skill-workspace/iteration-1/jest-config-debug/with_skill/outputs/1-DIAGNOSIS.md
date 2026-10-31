# Jest Configuration Debugging Report
## WordPress Plugin Setup Issues

**Project Context**: WordPress plugin with wp-scripts, custom Jest setup  
**Diagnosis Date**: 2026-10-30  
**Issues Found**: 3 Critical Configuration Problems

---

## Issue 1: testMatch Not Finding Tests

### Symptoms
- Tests exist in the project but Jest reports "No tests found"
- Running `npm test` produces: `No tests found related to files changed since git head`
- Test files are being ignored by Jest

### Root Causes

1. **Incorrect testMatch Pattern**
   - Common mistake: Using glob patterns that don't match WordPress test file conventions
   - Pattern `**/__tests__/**/*.js` won't match `__tests__/*.test.js` at root level
   - Paths must start with `<rootDir>` for relative resolution

2. **testPathIgnorePatterns Conflict**
   - Default patterns may exclude your test directory
   - node_modules filter too broad, catching test files
   - dist/ and build/ patterns interfering with tests/

3. **Test File Location Mismatch**
   - testMatch expects files in certain locations (e.g., `__tests__/`)
   - Your tests might be in `tests/`, `test/`, or scattered in src/
   - Jest doesn't find tests outside the configured pattern

4. **testRegex Override**
   - If testRegex is set, it overrides testMatch
   - Incorrect regex like `test\\.js$` misses `*.test.js` files
   - wp-scripts default may conflict with your custom pattern

### Why It Happens in WordPress Projects

- **wp-scripts defaults** are designed for WordPress blocks in `src/` with `*.test.js`
- **Custom setups** may use different structures
- **Monorepos** and plugin folders add complexity
- Mix of PHP and JavaScript test patterns

### Impact
- Tests never run → CI passes even with broken code
- Zero visibility into test health
- Regressions introduced silently

---

## Issue 2: Coverage Showing 0% Even Though Tests Run

### Symptoms
- Jest runs tests successfully: ✓ All tests pass
- Coverage report: 0% coverage on all files
- Coverage table shows: lines: 0%, functions: 0%, branches: 0%
- Or selective 0% coverage (only some files at 0%)

### Root Causes

1. **collectCoverageFrom Missing or Misconfigured**
   - Coverage requires explicit file patterns to collect coverage from
   - Jest only covers files run during tests by default
   - collectCoverageFrom is needed for untested files
   - Pattern doesn't match your source file structure

2. **Coverage Path Ignore Patterns Excluding Source**
   - coveragePathIgnorePatterns blocking src/ files
   - `**/node_modules/**` pattern too broad
   - Ignoring entire source directories accidentally
   - WordPress plugin source file structure not recognized

3. **Files Not Actually Imported in Tests**
   - Coverage = files touched by running tests
   - If test only imports 1 file, only that file is covered
   - Unused files show 0% coverage (correctly)
   - Tests not comprehensive enough

4. **Wrong Test Environment**
   - testEnvironment: 'jsdom' doesn't match browser imports
   - testEnvironment: 'node' doesn't handle DOM APIs
   - WordPress components need correct environment setup
   - Custom test environment not configured

5. **Transform/Babel Configuration Missing**
   - TypeScript/JSX not transpiled → coverage can't collect
   - wp-scripts has built-in transforms that custom config overrides
   - Import statements not being processed correctly
   - Module resolution failing silently

### Why It Happens with wp-scripts

- **wp-scripts provides transforms** for JSX, CSS modules, etc.
- **Custom jest.config.js might override** or disable them
- **WordPress components use JSX** which needs proper transpilation
- **Babel config inheritance** from wp-scripts may be lost

### Example: The 0% Gap

```javascript
// My test file (runs successfully)
import { render } from '@testing-library/react';
import { Hero } from './hero';

test('renders hero', () => {
  render(<Hero title="Test" />);
  // Test passes ✓
});

// But coverage report shows:
// src/hero.js: 0% coverage
// src/components/button.js: 0% coverage  (not imported by test)
```

**Why?** `collectCoverageFrom` isn't set, so only hero.js is covered. button.js shows 0%.

### Impact
- False confidence: Tests pass but coverage is invisible
- CI gates that check coverage can't work properly
- Untested code goes undetected
- Coverage reports are meaningless

---

## Issue 3: Module Mapping Not Working for @wordpress/element

### Symptoms
- Error: `Cannot find module '@wordpress/element'`
- Error: `Cannot resolve '@wordpress/element' in '...'`
- Tests fail immediately on import
- Works in browser (npm start) but fails in Jest

### Root Causes

1. **moduleNameMapper Missing or Incorrect**
   - Jest doesn't know how to resolve @wordpress/* packages
   - wp-scripts provides default mapping that custom config overwrites
   - Mapping pattern syntax incorrect: `@wordpress/(.*)` vs `@wordpress\\/(.*)`
   - Incorrect replacement path (e.g., pointing to wrong package folder)

2. **Node Resolution Failing**
   - @wordpress packages may not have proper exports field
   - Webpack handles resolution differently than Node/Jest
   - WordPress plugin in monorepo may have incorrect paths
   - Local @wordpress packages not in node_modules

3. **WordPress Package Not Installed**
   - `npm install` incomplete or @wordpress/element not in package.json
   - node_modules corrupted or missing @wordpress packages
   - Lock file (yarn.lock, package-lock.json) out of sync
   - Different npm/yarn versions with different resolutions

4. **Jest Transform Not Configured**
   - Files importing @wordpress packages aren't being transpiled
   - Babel not configured for WordPress module patterns
   - transform pattern doesn't match test files
   - babel.config.js or .babelrc missing WordPress preset

5. **wp-scripts Default Overrides**
   - Custom jest.config.js overrides wp-scripts defaults
   - wp-scripts provides @wordpress mapping but custom config clears it
   - Resolutions spread across jest.config.js and babel.config.js

### Why It's Critical for WordPress

- **@wordpress/element** is React re-export used in all blocks
- **@wordpress/components** has UI components blocks depend on
- **@wordpress/data** is the state management layer
- **If these fail, ALL WordPress block tests fail**

### Example: The @wordpress/element Chain

```javascript
// This fails in Jest but works in npm start
import { render, useState } from '@wordpress/element';

// Jest tries to resolve:
// 1. Look in node_modules/@wordpress/element/ → Not found
// 2. Look in project root → Not found
// 3. Check moduleNameMapper → Missing
// 4. Error: Cannot find module
```

### Impact
- No WordPress block tests can run
- Cannot test block registration, editor UI, frontend rendering
- CI fails with import errors
- Plugin development blocked

---

## Why These Issues Occur Together

### The wp-scripts Inheritance Problem

When you use wp-scripts:
```bash
wp-scripts start      # Uses webpack.config.js
wp-scripts test       # Uses jest.config.js (via wp-scripts)
```

**wp-scripts provides default jest.config.js** that includes:
- ✅ Correct testMatch for `src/**/*.test.js`
- ✅ Correct moduleNameMapper for @wordpress/*
- ✅ Correct transform for JSX/CSS
- ✅ Correct collectCoverageFrom patterns

**When you create custom jest.config.js:**
```javascript
module.exports = {
  testMatch: ['**/__tests__/**/*.js'],  // Overrides wp-scripts!
  // Missing moduleNameMapper
  // Missing collectCoverageFrom
  // Missing transforms
};
```

You lose all wp-scripts defaults. Jest now:
- ❌ Uses your testMatch (no __tests__ pattern)
- ❌ Can't resolve @wordpress/* (no mapping)
- ❌ Can't transpile JSX (no transform)
- ❌ Can't collect coverage (no patterns)

### Cascading Failures

1. testMatch doesn't find tests → tests never run
2. If tests do run, coverage can't collect → 0% coverage
3. If coverage could collect, @wordpress/element fails → tests don't run anyway

---

## Summary

| Issue | Root Cause | Severity | Impact |
|-------|-----------|----------|---------|
| testMatch failing | Pattern doesn't match file locations | CRITICAL | Tests never run |
| Coverage at 0% | collectCoverageFrom not set | CRITICAL | No coverage visibility |
| @wordpress/* failing | moduleNameMapper missing | CRITICAL | Block tests impossible |

**All three issues stem from: Custom jest.config.js overriding wp-scripts defaults**

---

## Next Steps

See:
- **2-FIXED-JEST-CONFIG.md** — Complete working configuration
- **3-CONFIGURATION-EXPLANATIONS.md** — Why each setting works
- **4-BEST-PRACTICES.md** — Prevention and maintenance
