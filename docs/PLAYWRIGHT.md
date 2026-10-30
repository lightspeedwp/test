# Playwright Testing Guide

Quick reference guide for Playwright E2E testing.

## Quick Start

```bash
npm install -D @playwright/test

# Run tests
npm run test:e2e

# Debug mode (Inspector)
npm run test:e2e:debug

# UI mode (Interactive)
npm run test:e2e:ui

# Headed mode (see browser)
npx playwright test --headed
```

## Configuration

**playwright.config.ts**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Writing Tests

### Basic Test

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
```

### Page Navigation

```typescript
test('navigates and checks URL', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveURL('/login');
});
```

### Locating Elements

```typescript
// By CSS selector
await page.locator('button.submit').click();

// By text
await page.locator('text=Click me').click();

// By test ID (preferred)
await page.locator('[data-testid="submit-button"]').click();

// By role
await page.locator('role=button[name="Submit"]').click();

// By XPath
await page.locator('xpath=//button[@type="submit"]').click();
```

### Interacting with Elements

```typescript
// Click
await page.locator('#button').click();

// Fill input
await page.locator('#email').fill('test@example.com');

// Select option
await page.locator('select').selectOption('value');

// Check checkbox
await page.locator('#agree').check();

// Type (character by character)
await page.locator('#search').type('query', { delay: 100 });

// Press key
await page.locator('#email').press('Enter');
```

### Assertions

```typescript
// Text content
await expect(page.locator('h1')).toContainText('Welcome');

// Visibility
await expect(page.locator('#modal')).toBeVisible();

// Disabled state
await expect(page.locator('button')).toBeDisabled();

// Count elements
await expect(page.locator('li')).toHaveCount(3);

// Value
await expect(page.locator('input')).toHaveValue('test@example.com');

// Attribute
await expect(page.locator('a')).toHaveAttribute('href', '/about');
```

### Waiting & Timeouts

```typescript
// Wait for element
await page.locator('#modal').waitFor();

// Wait for condition
await expect(page.locator('#data')).toBeVisible();

// Wait for navigation
await Promise.all([
  page.waitForNavigation(),
  page.locator('button').click(),
]);

// Wait for API response
const response = await page.waitForResponse(
  response => response.url().includes('/api/users')
);

// Custom wait
await page.waitForFunction(() => {
  return document.querySelectorAll('li').length === 3;
});
```

### Forms

```typescript
test('fills and submits form', async ({ page }) => {
  await page.goto('/contact');
  await page.locator('#name').fill('John Doe');
  await page.locator('#email').fill('john@example.com');
  await page.locator('#message').fill('Hello!');
  await page.locator('button[type="submit"]').click();
  
  await expect(page.locator('.success')).toBeVisible();
});
```

### Keyboard Input

```typescript
await page.keyboard.press('Enter');
await page.keyboard.press('Escape');
await page.keyboard.type('hello world');
await page.keyboard.down('Shift');
await page.keyboard.press('KeyA');
await page.keyboard.up('Shift');
```

### Multiple Browsers/Devices

```typescript
test.describe('Cross-browser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Runs in all configured browsers
  test('renders correctly', async ({ page }) => {
    await expect(page).toHaveScreenshot();
  });
});

// Mobile-specific test
test('mobile layout', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  
  await expect(page.locator('.mobile-menu')).toBeVisible();
});
```

### Accessibility Testing

```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test('checks accessibility', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
});
```

## Running Tests

```bash
npm run test:e2e                           # All tests
npx playwright test e2e/login.spec.ts      # Single file
npx playwright test --headed                # See browser
npx playwright test --headed --debug        # With Inspector
npm run test:e2e:ui                        # Interactive UI
npx playwright test --project=firefox       # Specific browser
npx playwright test --grep="search"         # Match pattern
npx playwright test --repeat=3              # Repeat each test
```

## Debugging

```bash
# Debug mode (Inspector)
npm run test:e2e:debug

# Headed mode
npx playwright test --headed

# UI mode (watch, step through)
npm run test:e2e:ui

# Generate trace on failure
npx playwright test --trace on
npx playwright show-trace trace.zip

# Screenshots on failure
npx playwright test --screenshot on

# Video on failure
npx playwright test --video on
```

## Tips & Tricks

- Use `data-testid` attributes for stable selectors
- Prefer role-based selectors (more resilient to UI changes)
- Use `waitFor()` instead of hardcoded `wait()`
- Set `baseURL` in config to avoid repeating URLs
- Use fixtures for common setup
- Keep tests fast with proper parallelization
- Isolate tests (no dependencies between tests)

---

*Playwright Reference Guide v1.0*
