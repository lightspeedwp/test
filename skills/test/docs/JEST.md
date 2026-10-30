# Jest Quick Reference

Jest testing patterns for WordPress.

## Basic Test

```javascript
test('function returns expected value', () => {
  const result = myFunction();
  expect(result).toBe(expectedValue);
});
```

## Setup/Teardown

```javascript
beforeAll(() => {
  // Run once before all tests
});

beforeEach(() => {
  // Run before each test
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  // Run once after all tests
});
```

## Mocking

```javascript
jest.mock('module-name', () => ({
  getValue: jest.fn(() => 'mocked')
}));

const { getValue } = require('module-name');
```

## Common Assertions

```javascript
expect(value).toBe(expected);
expect(array).toContain(item);
expect(object).toHaveProperty('key');
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg);
```

---

See jest-config-debug.md for troubleshooting.
