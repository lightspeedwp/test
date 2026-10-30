# Run All Tests

Execute the complete test suite across all frameworks and report results.

## Prompt

Run all tests in the project:
- Jest unit tests
- Playwright E2E tests
- PHPUnit tests (if PHP project)
- Build validation tests

Generate a summary report including:
- Total tests run
- Pass/fail counts
- Coverage metrics
- Any failures with details

## Execution

```bash
# Install dependencies first
npm install
composer install  # if using PHP

# Run all tests
npm run test
npm run test:e2e
composer test  # if applicable
```

## Success Criteria

- All tests pass
- No console errors or warnings
- Coverage meets minimum thresholds
- No flaky/intermittent failures
