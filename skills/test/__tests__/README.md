# Jest Unit Tests

JavaScript unit and integration tests using Jest framework.

## Structure

### *.test.js
Jest test files:
- One test file per source file
- Clear test descriptions
- Isolated test execution
- Fast execution

### fixtures/
Test data and constants:
- Mock data objects
- Test fixtures
- Configuration samples

### mocks/
Mock implementations:
- Module mocks
- Function mocks
- Class mocks
- API mocks

## Running Tests

```bash
# Run all Jest tests
npm run test:jest

# Run with coverage
npm run test:jest -- --coverage

# Run in watch mode
npm run test:jest -- --watch

# Run specific test file
npm run test:jest -- src/utils/block.test.js
```

## Coverage Requirements

- **Statements:** 100%
- **Branches:** 100%
- **Functions:** 100%
- **Lines:** 100%

## Test Patterns

- **Unit tests** — Test functions in isolation
- **Snapshot tests** — Capture and compare output
- **Mock tests** — Test with mocked dependencies
- **Integration tests** — Test module interactions

---

See JEST.md for detailed Jest configuration and patterns.
