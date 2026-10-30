# Jest Testing Guide

Quick reference guide for Jest unit testing.

## Quick Start

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Watch mode
npm run test:unit:watch

# Coverage
npm run test:coverage
```

## Configuration

**jest.config.js**:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: ['src/**/*.{js,ts,jsx,tsx}'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
};
```

## Writing Tests

### Basic Test

```javascript
test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});
```

### Describe Blocks (Grouping)

```javascript
describe('Math', () => {
  describe('add', () => {
    test('should return sum', () => {
      expect(1 + 2).toBe(3);
    });
  });
});
```

### Setup and Teardown

```javascript
describe('Database', () => {
  beforeEach(() => {
    // Setup before each test
    initDB();
  });

  afterEach(() => {
    // Cleanup after each test
    clearDB();
  });

  test('should save user', () => {
    // Test code
  });
});
```

### Mocking

```javascript
// Mock a module
jest.mock('./api', () => ({
  fetchUser: jest.fn(() => ({ id: 1, name: 'John' })),
}));

// Mock a function
const mockCallback = jest.fn();
mockCallback('test');
expect(mockCallback).toHaveBeenCalledWith('test');

// Spy on method
const spy = jest.spyOn(obj, 'method');
obj.method();
expect(spy).toHaveBeenCalled();
spy.mockRestore();
```

### Async Testing

```javascript
// Using async/await
test('async test', async () => {
  const data = await fetchUser();
  expect(data.id).toBe(1);
});

// Using then
test('returns promise', () => {
  return fetchUser().then(data => {
    expect(data.id).toBe(1);
  });
});

// Using resolves/rejects
test('resolves', () => {
  return expect(fetchUser()).resolves.toHaveProperty('id');
});
```

### Component Testing (React)

```javascript
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';

test('renders user name', () => {
  render(<UserCard name="John" />);
  expect(screen.getByText('John')).toBeInTheDocument();
});

test('handles click', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  screen.getByText('Click me').click();
  expect(handleClick).toHaveBeenCalled();
});
```

## Common Matchers

| Matcher | Usage |
|---------|-------|
| `toBe()` | Exact match (===) |
| `toEqual()` | Deep equality |
| `toMatch()` | String regex match |
| `toContain()` | Array/string contains |
| `toBeNull()` | Is null |
| `toBeDefined()` | Is defined |
| `toBeFalsy()` | Is falsy |
| `toBeGreaterThan()` | Numeric comparison |
| `toThrow()` | Throws error |
| `toHaveBeenCalled()` | Mock called |
| `toHaveBeenCalledWith()` | Mock called with args |

## Running Tests

```bash
npm test                    # Run all tests
npm test -- file.test.ts    # Single file
npm test -- --watch         # Watch mode
npm test -- --coverage      # Coverage report
npm test -- --updateSnapshot  # Update snapshots
npm test -- --no-coverage   # Skip coverage
npm test -- --testNamePattern="pattern"  # Match test names
npm test -- --maxWorkers=1  # Single worker (slower, helps with state issues)
```

## Debugging

```bash
# Debug mode (Inspector available)
node --inspect-brk ./node_modules/.bin/jest --runInBand

# Interactive UI (Jest 27+)
npm test -- --ui

# Watch + verbose
npm test -- --watch --verbose

# Only failed tests
npm test -- --onlyChanged
```

## Snapshot Testing

```javascript
test('renders correctly', () => {
  const tree = render(<Component />).asFragment();
  expect(tree).toMatchSnapshot();
});

// Update snapshots after intentional changes
npm test -- --updateSnapshot
```

## Tips & Tricks

- Use `screen` queries instead of `container` (Testing Library best practice)
- Mock heavy dependencies, test behavior not implementation
- Use `jest.useFakeTimers()` for time-based testing
- Use `waitFor()` for async updates in components
- Keep tests fast with proper mocking

---

*Jest Reference Guide v1.0*
