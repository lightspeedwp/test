---
name: test
description: |
  Comprehensive test execution and validation skill for multiple testing frameworks.
  Supports PHPUnit, Jest, and Playwright testing with coverage reporting, debugging,
  and CI integration. Use this whenever you need to run tests, debug test failures,
  validate test coverage, or set up testing infrastructure. Handles unit tests,
  integration tests, E2E tests, and accessibility validation.
metadata:
  category: quality
  enabled: 'True'
  tags: testing, validation, qa, phpunit, jest, playwright, ci, coverage
  subskills:
    - test:phpunit
    - test:jest
    - test:playwright
    - test:coverage
    - test:debug
---

# Test Execution & Validation Skill

Comprehensive testing skill for LightSpeedWP projects supporting multiple frameworks and testing scenarios.

## Quick Start

### Run All Tests
```bash
npm run test                    # Jest unit tests
npm run test:e2e                # Playwright E2E tests
composer test                   # PHPUnit tests
```

### Run Tests by Type
- **Unit Tests**: `npm run test:unit` (Jest)
- **Integration Tests**: `npm run test:integration` (Jest + PHPUnit)
- **E2E Tests**: `npm run test:e2e` (Playwright)
- **Build Tests**: `npm run test:build` (BATS)
- **Coverage**: `npm run test:coverage` (generates report)

### Debug Tests
- **Jest Debug**: `npm run test:unit:watch`
- **Jest Debug UI**: `npm run test:unit:ui`
- **Playwright Debug**: `npm run test:e2e:debug`
- **Playwright UI**: `npm run test:e2e:ui`

## Testing Frameworks

### PHPUnit (Backend/PHP Testing)

**Location**: `tests/` and `*/tests/` directories  
**Configuration**: `phpunit.xml` or `phpunit.xml.dist`  
**Run**: `composer test` or `./vendor/bin/phpunit`

#### Test Types
- **Unit Tests**: Isolated component logic
- **Integration Tests**: Database and API interactions
- **Feature Tests**: Full workflow validation

#### Coverage
```bash
./vendor/bin/phpunit --coverage-html coverage/
./vendor/bin/phpunit --coverage-text
```

#### Debugging
```bash
# Verbose output
./vendor/bin/phpunit -v

# Stop on first failure
./vendor/bin/phpunit -x

# Run specific test
./vendor/bin/phpunit tests/Feature/UserTest.php::testCreateUser
```

**References**:
- [PHPUnit Docs](https://phpunit.de/)
- [PHPUnit Best Practices](https://phpunit.de/manual/current/en/writing-tests-for-phpunit.html)

---

### Jest (JavaScript/TypeScript Testing)

**Location**: `src/**/__tests__/`, `*.test.ts`, `*.test.js` files  
**Configuration**: `jest.config.js` or `package.json` jest config  
**Run**: `npm run test:unit` or `npm test`

#### Test Types
- **Unit Tests**: Component logic and utility functions
- **Snapshot Tests**: UI component output verification
- **DOM Tests**: React/component interaction testing
- **Mock Tests**: Dependency and API mocking

#### Coverage
```bash
npm run test:coverage
npm run test:coverage -- --watch
```

#### Debugging
```bash
# Watch mode
npm run test:unit:watch

# Interactive UI (newest Jest versions)
npm run test:unit:ui

# Single file
npm test -- file.test.ts

# Match pattern
npm test -- --testNamePattern="creates user"

# Verbose
npm test -- --verbose
```

**Configuration Reference**:
- [Jest Docs](https://jestjs.io/)
- [Jest Configuration](https://jestjs.io/docs/configuration)
- [Testing Library](https://testing-library.com/)

---

### Playwright (E2E & Browser Testing)

**Location**: `e2e/`, `tests/e2e/` directories  
**Configuration**: `playwright.config.ts`  
**Run**: `npm run test:e2e`

#### Test Types
- **User Workflows**: Full user journeys through the app
- **Navigation**: Route handling and SPA functionality
- **Responsive Design**: Mobile, tablet, desktop viewports
- **Accessibility**: WCAG 2.2 compliance validation
- **Performance**: Load time and rendering benchmarks
- **Cross-browser**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

#### Coverage
- Route coverage: All public routes and fallback behavior
- Component coverage: Forms, navigation, modals
- Integration coverage: API interactions and data loading
- Accessibility coverage: Keyboard, screen reader, color contrast

#### Debugging
```bash
# Debug mode with inspector
npm run test:e2e:debug

# Interactive UI (watch, step through)
npm run test:e2e:ui

# Single file
npx playwright test e2e/login.spec.ts

# Headed mode (see browser)
npx playwright test --headed

# Specific browser
npx playwright test --project=chromium

# Verbose
npx playwright test --verbose
```

**References**:
- [Playwright Docs](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)

---

## Testing Scenarios & Sub-skills

### 1. **test:phpunit** — PHPUnit Test Execution
Run PHP tests with various configurations and report formats.

**When to use**:
- Testing backend logic, models, services
- Database interaction testing
- API endpoint validation
- Integration testing

**Examples**:
```bash
# Run all tests
composer test

# Run specific test suite
./vendor/bin/phpunit tests/Feature/

# Generate coverage
./vendor/bin/phpunit --coverage-html coverage/

# Stop on first failure
./vendor/bin/phpunit -x
```

---

### 2. **test:jest** — Jest Unit Test Execution
Run JavaScript/TypeScript unit and component tests.

**When to use**:
- Component logic testing
- Utility function validation
- Snapshot testing
- Mock and spy testing

**Examples**:
```bash
# Run all unit tests
npm run test:unit

# Watch mode for development
npm run test:unit:watch

# Interactive UI
npm run test:unit:ui

# Coverage report
npm run test:coverage
```

---

### 3. **test:playwright** — Playwright E2E Test Execution
Run browser-based end-to-end tests across multiple browsers.

**When to use**:
- Full user workflow validation
- Navigation and routing tests
- Responsive design testing
- Accessibility compliance validation
- Cross-browser compatibility

**Examples**:
```bash
# Run all E2E tests
npm run test:e2e

# Debug mode
npm run test:e2e:debug

# Interactive UI mode
npm run test:e2e:ui

# Specific browser
npx playwright test --project=firefox

# Single test file
npx playwright test e2e/checkout.spec.ts
```

---

### 4. **test:coverage** — Coverage Report Generation
Generate and analyze test coverage across all frameworks.

**When to use**:
- Pre-release coverage validation
- Coverage threshold checks
- Identifying untested code paths
- Coverage trend analysis

**Output**:
- HTML coverage reports in `coverage/`
- Coverage thresholds verification
- Per-file and per-function metrics
- Coverage badges for README

---

### 5. **test:debug** — Test Debugging & Troubleshooting
Debug failing tests with detailed output, source maps, and browser inspection.

**When to use**:
- Test failures need investigation
- Flaky test diagnosis
- Mock/spy issues
- Browser automation issues

**Tools**:
- Jest watch + verbose
- Playwright Inspector
- Network request inspection
- DOM breakpoints and inspection
- Source map debugging

---

## Accessibility Testing (WCAG 2.2 AAA)

Per D3 decision (Ash Shaw, 2026-10-25), all tests validate WCAG 2.2 AAA compliance.

### Playwright Accessibility Tests
```bash
npm run test:e2e -- --project=accessibility
```

### Validation Includes
- ✅ Keyboard navigation for all interactive elements
- ✅ Screen reader announcements and ARIA labels
- ✅ Color contrast: 7:1 normal text, 4.5:1 large text
- ✅ Form inputs with proper labels and error messages
- ✅ Focus management during navigation
- ✅ Page structure with semantic HTML

### Resources
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Accessibility Checklist](../guidelines/accessibility-checklist.md)

---

## Coverage Requirements

### Minimum Coverage Thresholds
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Pre-Release Validation
```bash
npm run test:coverage -- --threshold
```

---

## Test Configuration Files

### Jest
- `jest.config.js` — Jest configuration
- `jest.setup.js` — Test environment setup
- `.babelrc` or `babel.config.js` — Transpiler config

### Playwright
- `playwright.config.ts` — Playwright configuration
- `playwright.env.ts` — Environment variables

### PHPUnit
- `phpunit.xml` — PHPUnit configuration
- `.env.testing` — Test environment variables

---

## CI/CD Integration

Tests are automatically run in GitHub Actions on:
- Pull request creation/update
- Commit to `develop` or `main`
- Release branch creation

### Test Result Reports
- Coverage reports in artifacts
- Failure details in PR comments
- Performance benchmarks in build logs

---

## When Tests Fail

### Common Issues & Solutions

**Jest Tests Fail**
1. Check for changed snapshots: `npm test -- -u` (review changes first!)
2. Clear cache: `npm test -- --clearCache`
3. Check node version: `node -v` (should match `.nvmrc`)
4. Run single test: `npm test -- file.test.ts --verbose`

**Playwright Tests Fail**
1. Check browser versions: `npx playwright install`
2. Run headed: `npx playwright test --headed` (see what's happening)
3. Use debug mode: `npx playwright test --debug`
4. Check network/API mock config
5. Verify selector/element exists

**PHPUnit Tests Fail**
1. Check database setup: `php artisan migrate:refresh --seed`
2. Verify PHP version: `php -v`
3. Check dependencies: `composer install`
4. Run single test: `./vendor/bin/phpunit tests/Feature/UserTest.php::testCreate`
5. Clear test cache/database

---

## Related Skills & Resources

- [Build Verification](./SKILL.md#build-verification) — Validate build artifacts
- [Validation Skill](../validate/SKILL.md) — General validation patterns
- [Quality Assurance Plugin](https://github.com/lightspeedwp/.github/tree/develop/plugins/lightspeed-quality-assurance)
- [Playwright Testing Plugin](https://github.com/lightspeedwp/.github/tree/develop/plugins/lightspeed-playwright-testing)

---

## Best Practices

1. **Write Tests First** — Test-driven development catches issues early
2. **Isolate Tests** — Tests should be independent and repeatable
3. **Mock External Services** — Don't make real API calls in tests
4. **Clear Test Names** — Describe what is being tested and expected outcome
5. **Keep Tests Fast** — Optimize database fixtures and network mocks
6. **Test Edge Cases** — Don't just test the happy path
7. **Review Coverage** — Aim for high coverage of critical paths
8. **Automate Testing** — Run tests locally before committing

---

## Quick Reference

| Framework | Run All | Watch Mode | Coverage | Debug |
|-----------|---------|-----------|----------|-------|
| Jest | `npm test` | `npm run test:watch` | `npm run test:coverage` | `npm run test:ui` |
| Playwright | `npm run test:e2e` | N/A | Built-in | `npm run test:e2e:debug` |
| PHPUnit | `composer test` | `./vendor/bin/phpunit -w` | `--coverage-html` | `-v --stop-on-failure` |

---

*Test execution skill; verify current commands in package.json, composer.json, and playwright.config before running.*
