# Debug Failing Test

Diagnose and fix a failing test using debugging tools and detailed output.

## Prompt

Debug the failing test:

1. **Identify** which test is failing and why
2. **Run** with verbose output and debugging enabled
3. **Inspect** the error message and stack trace
4. **Check** mocks, fixtures, and test setup
5. **Fix** the underlying issue
6. **Verify** the test now passes

## Debugging Commands

### Jest Tests
```bash
# Verbose output
npm test -- file.test.ts --verbose

# Debug specific test
npm test -- file.test.ts --testNamePattern="test name" --verbose

# Interactive UI
npm run test:unit:ui

# Clear cache
npm test -- --clearCache
```

### Playwright Tests
```bash
# Debug mode with inspector
npm run test:e2e:debug

# Headed mode (see browser)
npx playwright test e2e/test.spec.ts --headed --debug

# View trace
npx playwright test --trace on
```

### PHPUnit Tests
```bash
# Verbose output
./vendor/bin/phpunit -v tests/Feature/UserTest.php::testFails

# Stop on first failure
./vendor/bin/phpunit -x

# Detailed output
./vendor/bin/phpunit --verbose --debug
```

## Success Criteria

- Root cause identified
- Test passes consistently
- No side effects from fix
- Related tests still pass
