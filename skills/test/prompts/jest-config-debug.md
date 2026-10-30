# Jest Configuration Debugging

Debug common Jest configuration issues and enforce 100% coverage.

## Common Jest Issues

### Issue 1: testMatch Pattern Not Finding Tests

**Problem:** Tests not running, "No tests found"

**Solution:**
```javascript
// jest.config.js
module.exports = {
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/*.test.js',
    '**/*.spec.js'
  ]
};
```

Check file naming:
- Use `.test.js` or `.spec.js` suffix
- Place in `__tests__` folder or alongside source
- Ensure pattern matches actual file paths

### Issue 2: Coverage Thresholds Failing

**Problem:** Coverage below threshold, builds failing

**Solution:**
```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
```

Identify untested:
- Run with coverage report
- Find files below threshold
- Write missing tests
- Update collectCoverageFrom to ignore non-source files

### Issue 3: Module Not Found / Module Mapping

**Problem:** "Cannot find module" in tests

**Solution:**
```javascript
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@fixtures/(.*)$': '<rootDir>/__tests__/fixtures/$1',
    '\\.(css|scss)$': '<rootDir>/__tests__/mocks/styleMock.js'
  }
};
```

Types of mapping:
- **Path aliases:** Map @ or other prefixes to directories
- **Static assets:** Mock images, CSS, fonts
- **External modules:** Mock third-party dependencies

### Issue 4: Async Tests Timing Out

**Problem:** "Jest did not exit one second after the test run"

**Solution:**
```javascript
// Good: Use async/await
test('async operation completes', async () => {
  const result = await asyncFunction();
  expect(result).toBe(expected);
});

// Bad: Forget to return Promise
test('async operation', () => {
  asyncFunction().then(result => {
    expect(result).toBe(expected);
  });
});

// Good: Done callback
test('callback operation', (done) => {
  asyncFunction((result) => {
    expect(result).toBe(expected);
    done();
  });
});
```

Debugging:
- Increase timeout: `jest.setTimeout(10000)`
- Check for unclosed connections
- Verify promises are returned/awaited
- Check for infinite loops

### Issue 5: Mocks Not Working

**Problem:** Mock not being used, real module still imported

**Solution:**
```javascript
// Correct: Mock at module level
jest.mock('../utils', () => ({
  getValue: jest.fn(() => 'mocked value')
}));

// Incorrect: Mock after require
const utils = require('../utils');
jest.mock('../utils'); // Too late!

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

Mock patterns:
- Mock before importing
- Use `jest.fn()` for functions
- Use `jest.spyOn()` for methods
- Clear mocks in `beforeEach()`

## Coverage Gap Analysis

### Finding Untested Code

```bash
npm run test:jest -- --coverage
```

Review coverage report:
- **Lines:** Code not executed by tests
- **Branches:** If/else paths not tested
- **Functions:** Functions not called
- **Statements:** Individual statements not executed

### Test Design for Coverage

For untested branch:
```javascript
// Source
function processUser(user) {
  if (user.admin) {
    return deleteAllData(); // Not tested!
  }
  return user;
}

// Add test
test('admin user triggers deleteAllData', () => {
  const adminUser = { admin: true };
  jest.mock('./data', () => ({ deleteAllData: jest.fn() }));
  const result = processUser(adminUser);
  expect(deleteAllData).toHaveBeenCalled();
});
```

## Configuration Best Practices

```javascript
// jest.config.js - Complete example
module.exports = {
  displayName: 'unit-tests',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  
  // Setup
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  
  // Module mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Transforms
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  
  // Timeouts
  testTimeout: 5000,
  
  // Reporting
  verbose: true
};
```

## Debugging Techniques

### Run single test
```bash
npm run test:jest -- --testNamePattern="test name"
```

### Run with debugging
```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

### Check module resolution
```bash
npm run test:jest -- --showConfig
```

### Clear cache
```bash
npm run test:jest -- --clearCache
```

---

See JEST.md for more Jest patterns and TESTING.md for overall test strategy.
