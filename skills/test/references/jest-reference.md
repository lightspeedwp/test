# Jest Configuration Reference

Complete Jest setup and configuration guide.

## Minimal Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js'],
  coverageThreshold: {
    global: { lines: 100, functions: 100, branches: 100, statements: 100 }
  }
};
```

## Full Configuration

```javascript
module.exports = {
  // Test environment
  testEnvironment: 'jsdom', // or 'node'
  
  // Test discovery
  testMatch: ['**/__tests__/**/*.test.js', '**/*.spec.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  
  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': '<rootDir>/__tests__/mocks/styleMock.js'
  },
  
  // Transform
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  
  // Coverage
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
  },
  
  // Setup
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  
  // Output
  verbose: true,
  testTimeout: 5000
};
```

---

See jest-config-debug.md for troubleshooting common issues.
