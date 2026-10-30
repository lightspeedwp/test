# Testing Guide

Comprehensive guide to testing in LightSpeedWP projects.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Testing Frameworks](#testing-frameworks)
3. [Writing Tests](#writing-tests)
4. [Running Tests](#running-tests)
5. [Debugging Tests](#debugging-tests)
6. [Coverage](#coverage)
7. [Accessibility Testing](#accessibility-testing)
8. [Best Practices](#best-practices)
9. [CI/CD Integration](#cicd-integration)

## Quick Start

### Install Dependencies
```bash
npm install          # JavaScript dependencies
composer install     # PHP dependencies (if applicable)
npx playwright install  # Playwright browsers
```

### Run All Tests
```bash
npm run test         # Jest unit tests
npm run test:e2e     # Playwright E2E tests
composer test        # PHPUnit tests (if applicable)
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Debug Failing Tests
```bash
npm run test:unit:watch    # Jest watch mode
npm run test:e2e:debug     # Playwright debug
npm run test:e2e:ui        # Playwright UI mode
```

---

## Testing Frameworks

### Jest (Unit Tests)

**Location**: `src/**/__tests__/`, `*.test.ts`, `*.test.js`  
**Config**: `jest.config.js` or `package.json` jest config  
**Run**: `npm run test:unit` or `npm test`

**Use for**:
- Component logic testing
- Utility function validation
- Snapshot testing
- Mock and spy testing

**Key Commands**:
```bash
npm run test:unit              # Run all Jest tests
npm run test:unit:watch        # Watch mode
npm run test:unit:ui           # Interactive UI
npm run test:coverage          # Coverage report
npm test -- file.test.ts       # Single file
npm test -- --testNamePattern="pattern"  # Match tests by name
```

**Documentation**: See [JEST.md](JEST.md)

---

### Playwright (E2E Tests)

**Location**: `e2e/`, `tests/e2e/` directories  
**Config**: `playwright.config.ts` or `playwright.config.js`  
**Run**: `npm run test:e2e`

**Use for**:
- Full user workflows
- Navigation and routing
- Responsive design testing
- Cross-browser compatibility
- Accessibility validation

**Key Commands**:
```bash
npm run test:e2e               # Run all E2E tests
npm run test:e2e:debug         # Debug mode with inspector
npm run test:e2e:ui            # Interactive UI mode
npx playwright test --headed   # Headed mode (see browser)
npx playwright test --headed --debug  # Headed + debug
npx playwright test e2e/login.spec.ts  # Single file
```

**Documentation**: See [PLAYWRIGHT.md](PLAYWRIGHT.md)

---

### PHPUnit (PHP Tests)

**Location**: `tests/` directory  
**Config**: `phpunit.xml` or `phpunit.xml.dist`  
**Run**: `composer test`

**Use for**:
- PHP backend logic testing
- Database interaction testing
- API endpoint testing
- Integration testing

**Key Commands**:
```bash
composer test                  # Run all tests
./vendor/bin/phpunit -w        # Watch mode
./vendor/bin/phpunit -v tests/Feature/UserTest.php  # Specific file
./vendor/bin/phpunit --coverage-html coverage/  # Coverage
```

**Documentation**: See [PHPUNIT.md](PHPUNIT.md)

---

## Writing Tests

### General Principles

1. **Clear Test Names** — Describe what is tested and expected outcome
2. **Isolate Tests** — Each test should be independent
3. **Single Responsibility** — Test one thing per test
4. **DRY** — Use setup/teardown to avoid duplication
5. **Fast** — Optimize for speed without sacrificing coverage

### Test Structure

```
Test Name: Should [expected behavior] when [condition]

Arrange  → Set up test data and mocks
Act      → Execute the code being tested
Assert   → Verify the expected outcome
```

### Example: Jest Test

```javascript
describe('User', () => {
  describe('create', () => {
    it('should create a new user with valid email', () => {
      // Arrange
      const user = { name: 'John', email: 'john@example.com' };
      
      // Act
      const result = createUser(user);
      
      // Assert
      expect(result.id).toBeDefined();
      expect(result.email).toBe('john@example.com');
    });

    it('should reject invalid email', () => {
      // Arrange
      const user = { name: 'John', email: 'invalid' };
      
      // Act & Assert
      expect(() => createUser(user)).toThrow();
    });
  });
});
```

### Example: Playwright Test

```typescript
test.describe('Checkout Flow', () => {
  test('should complete purchase with valid card', async ({ page }) => {
    // Arrange
    await page.goto('/checkout');
    
    // Act
    await page.fill('[data-testid="card-number"]', '4111 1111 1111 1111');
    await page.click('[data-testid="complete-purchase"]');
    
    // Assert
    await expect(page).toHaveURL('/order-confirmation');
    await expect(page.locator('text=Thank you')).toBeVisible();
  });
});
```

### Example: PHPUnit Test

```php
class UserTest extends TestCase {
  public function test_create_user_with_valid_data() {
    // Arrange
    $data = ['name' => 'John', 'email' => 'john@example.com'];
    
    // Act
    $user = User::create($data);
    
    // Assert
    $this->assertNotNull($user->id);
    $this->assertEquals('john@example.com', $user->email);
  }
}
```

---

## Running Tests

### Local Development

```bash
# Watch mode (re-run on file changes)
npm run test:unit:watch

# Single test file
npm test -- UserComponent.test.ts

# Specific test by name
npm test -- --testNamePattern="should create user"

# With coverage
npm run test:coverage

# Clear cache
npm test -- --clearCache
```

### CI/CD Pipeline

Tests run automatically on:
- Pull request creation/update
- Commit to `develop` branch
- Commit to `main` branch

See `.github/workflows/` for CI configuration.

---

## Debugging Tests

### Jest Debugging

```bash
# Watch mode with verbose output
npm run test:unit:watch -- --verbose

# Interactive UI mode
npm run test:unit:ui

# Debugging in IDE
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

### Playwright Debugging

```bash
# Playwright Inspector
npm run test:e2e:debug

# Headed mode (see browser)
npx playwright test --headed

# Headed + debug
npx playwright test --headed --debug

# Record trace
npx playwright test --trace on

# With screenshots
npx playwright test --screenshot on
```

### PHPUnit Debugging

```bash
# Verbose output
./vendor/bin/phpunit -v

# Stop on first failure
./vendor/bin/phpunit -x

# With debug info
./vendor/bin/phpunit --debug

# Single test with full output
./vendor/bin/phpunit -v tests/Feature/UserTest.php::testCreate
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Test timeout | Increase timeout, check for unresolved promises |
| Flaky tests | Ensure proper async/await, check timing issues |
| Mock not working | Verify mock setup, check import paths |
| Element not found | Use debug mode, check selectors/locators |
| Database state issues | Clear database between tests, use transactions |

---

## Coverage

### Minimum Requirements

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Generate Coverage Report

```bash
# Jest coverage
npm run test:coverage

# Playwright coverage
npx playwright test --coverage

# PHPUnit coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### View Coverage Report

```bash
# Open HTML report
open coverage/index.html   # macOS
xdg-open coverage/index.html  # Linux
start coverage\index.html  # Windows
```

### Coverage Thresholds

Coverage thresholds enforce minimum coverage:
- Prevents merging PRs with insufficient coverage
- Configured in `jest.config.js` or `playwright.config.ts`
- PHPUnit thresholds in `phpunit.xml`

---

## Accessibility Testing

**Standard**: WCAG 2.2 AAA compliance required  
**Decision**: D3 Decision (Ash Shaw, 2026-10-25)

### Automated Accessibility Tests

```bash
# Run with Playwright accessibility checks
npm run test:e2e

# Accessibility-specific tests
npx playwright test --project=accessibility
```

### Manual Accessibility Checks

**Keyboard Navigation**
```bash
npm run test:e2e:ui
# Tab through all interactive elements
# Verify logical tab order and focus management
```

**Screen Reader Testing**
- Use NVDA (Windows), JAWS, or VoiceOver (Mac)
- Test page structure, headings, and labels
- Verify dynamic content announcements

**Color Contrast**
- Use Playwright's accessibility checks
- Verify ratios: 7:1 (normal), 4.5:1 (large), 3:1 (graphics)

### Test Requirements

```typescript
test('form has proper accessibility', async ({ page }) => {
  // Check labels are associated
  expect(await page.locator('label[for="email"]')).toBeDefined();
  
  // Check color contrast
  const contrast = await page.evaluate(() => {
    // Calculate contrast ratio
  });
  expect(contrast).toBeGreaterThan(7);
  
  // Check keyboard navigation
  await page.keyboard.press('Tab');
  // Verify focus moved to next interactive element
});
```

---

## Best Practices

### Do ✅
- Write tests before or alongside code (TDD)
- Use descriptive test names
- Keep tests independent and isolated
- Mock external dependencies
- Run tests locally before pushing
- Aim for high coverage of critical paths
- Use proper test data/fixtures
- Test edge cases and error conditions

### Don't ❌
- Make tests dependent on execution order
- Use real API calls in tests
- Have slow tests
- Write tests that are hard to understand
- Test implementation details instead of behavior
- Ignore test failures
- Use hard-coded data across tests
- Skip accessibility testing

---

## CI/CD Integration

### Automated Testing

Tests run in GitHub Actions on:
- **PR creation/update**: Full test suite
- **Merge to develop**: Full test suite
- **Merge to main**: Full test suite + release

### Test Report Artifacts

- Coverage HTML reports
- Test result summaries
- Performance benchmarks
- Accessibility validation results

### Preventing Merge

PRs cannot be merged if:
- Tests fail
- Coverage drops below thresholds
- Accessibility validation fails
- Linting errors present

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [PHPUnit Documentation](https://phpunit.de/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Testing Library](https://testing-library.com/)
- [Test Agent](../AGENTS.md#test-agent)

---

*Testing Guide v1.0*  
*Last Updated: 2026-10-30*
