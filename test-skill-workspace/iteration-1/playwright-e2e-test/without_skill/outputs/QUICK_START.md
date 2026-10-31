# Quick Start Guide - WordPress Block Plugin E2E Tests

Get up and running with Playwright E2E tests in 5 minutes.

## Prerequisites

- Node.js 18+ installed (`node --version`)
- npm installed (`npm --version`)
- A WordPress site running locally or accessible at a URL
- WordPress admin access (username/password)

## Installation (2 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Browsers

```bash
npx playwright install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```bash
# Copy from template
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your editor
```

Configure these key values:
```env
BASE_URL=http://localhost:8889
WP_ADMIN_USER=admin
WP_ADMIN_PASSWORD=password
```

## Run Your First Test (1 minute)

### Quick Test

```bash
npm test
```

This runs all tests in headless mode (browser not visible).

### See the Browser

```bash
npm run test:headed
```

Watch the test run in a visible browser window.

### Interactive UI

```bash
npm run test:ui
```

Launch the interactive test UI for easier debugging.

## Test Organization

### Main Test File
- `block-release.e2e.spec.ts` - Complete workflow tests
  - Step 1: Create custom block in editor
  - Step 2: Save and publish post
  - Step 3: Verify frontend rendering
  - Step 4: Test responsive behavior
  - Accessibility checks
  - Error scenarios
  - Visual regression tests

### Supporting Files
- `editor.page.ts` - Page Object for WordPress editor
- `frontend.page.ts` - Page Object for frontend verification
- `a11y.utils.ts` - Accessibility testing utilities
- `test.utils.ts` - Common test helpers
- `advanced.example.spec.ts` - Advanced testing patterns

## Common Commands

### Run Tests

```bash
# All tests
npm test

# Specific test file
npm test block-release.e2e.spec.ts

# Specific test by name
npm test -g "should insert block"

# Tests matching pattern
npm test -g "Step 1"
```

### Browser Selection

```bash
# Chrome only
npm run test:chromium

# Firefox only
npm run test:firefox

# Safari only (WebKit)
npm run test:webkit

# Mobile devices
npm run test:mobile

# All browsers and devices
npm test
```

### Debug & Inspect

```bash
# Debug mode (step through tests)
npm run test:debug

# Interactive UI mode
npm run test:ui

# See browser during test
npm run test:headed

# See test report
npm run report
```

### Update Baselines

```bash
# Update visual regression baselines
npm test -- --update-snapshots
```

## Troubleshooting

### Issue: "Connection refused" Error

**Problem:** Tests fail to connect to WordPress

**Solutions:**
1. Verify WordPress is running:
   ```bash
   curl http://localhost:8889
   ```

2. Update `BASE_URL` in `.env`:
   ```env
   BASE_URL=http://your-wordpress-url.com
   ```

3. Check firewall isn't blocking connection

### Issue: "Timeout waiting for locator"

**Problem:** Test can't find elements

**Solutions:**
1. Verify element selectors are correct:
   ```bash
   npm run test:ui  # Inspect with interactive UI
   ```

2. Increase timeout:
   ```typescript
   await page.waitForSelector('selector', { timeout: 10000 });
   ```

3. Ensure WordPress editor is fully loaded:
   ```bash
   npm run test:headed  # Watch test execution
   ```

### Issue: Tests Pass Locally but Fail in CI

**Problem:** Environmental differences

**Solutions:**
1. Use consistent timeouts:
   ```env
   TEST_TIMEOUT=30000
   ```

2. Set CI mode in CI/CD:
   ```bash
   CI=true npm test
   ```

3. Check server resources in CI environment

### Issue: Visual Regression Screenshot Mismatch

**Problem:** Screenshots don't match baseline

**Solutions:**
1. View the report:
   ```bash
   npm run report
   ```

2. If change is intentional, update baseline:
   ```bash
   npm test -- --update-snapshots
   ```

3. If unintentional, fix the CSS/code

### Issue: "Browser not found"

**Problem:** Playwright browsers not installed

**Solution:**
```bash
npx playwright install
npx playwright install-deps  # For Linux
```

### Issue: Memory/Performance Problems

**Problem:** Tests slow down or crash

**Solutions:**
1. Run fewer workers:
   ```bash
   npm test -- --workers=1
   ```

2. Disable videos/traces:
   ```typescript
   // In playwright.config.ts
   video: 'off',
   trace: 'off',
   ```

3. Increase available memory

## Next Steps

### 1. Verify Installation Works

```bash
# Run a single quick test
npm test -g "Step 1"
```

If this passes, you're ready to go!

### 2. Customize for Your Block

Edit `block-release.e2e.spec.ts`:

```typescript
// Change block name
await editorPage.insertBlock('Your Custom Block Name');

// Update block attributes
await editorPage.setBlockAttribute('Your Attribute', 'value');

// Verify frontend content
await expect(frontendPage.mainContent).toContainText('Your expected content');
```

### 3. Run Full Test Suite

```bash
# Full suite with all browsers/devices
npm test
```

### 4. Review Test Report

```bash
# Open detailed HTML report
npm run report
```

## Key Features at a Glance

### Page Objects
Encapsulate WordPress interactions:
```typescript
const editor = new EditorPage(page);
await editor.insertBlock('Paragraph');
await editor.publishPost();
```

### Accessibility Testing
Check WCAG compliance:
```typescript
const issues = await A11yUtils.checkPageAccessibility(page);
await A11yUtils.assertNoA11yIssues(page);
```

### Responsive Testing
Test multiple viewports:
```bash
npm run test:mobile      # Test on phones
npm run test:tablet      # Test on tablets
npm run test:responsive  # Test all viewports
```

### Visual Regression
Detect unintended UI changes:
```typescript
await expect(page).toHaveScreenshot('block-layout.png');
```

### Error Scenarios
Test error handling:
```typescript
test('should handle network errors', async () => {
  await page.context().setOffline(true);
  // ... test offline behavior
});
```

## File Structure Quick Reference

```
project/
├── playwright.config.ts      # Playwright config
├── editor.page.ts           # Editor page object
├── frontend.page.ts         # Frontend page object
├── a11y.utils.ts           # Accessibility utils
├── test.utils.ts           # Common test helpers
├── block-release.e2e.spec.ts    # Main test suite
├── advanced.example.spec.ts     # Advanced examples
├── package.json            # Dependencies
├── .env.example           # Environment template
├── README.md              # Full documentation
├── QUICK_START.md         # This file
├── TESTING_STRATEGY.md    # Testing approach
├── VISUAL_REGRESSION_GUIDE.md  # Visual tests
└── __screenshots__/       # Baseline screenshots
```

## Tips for Success

### 1. Use Interactive Mode for Debugging

```bash
npm run test:ui
```

This opens a visual debugger where you can:
- Inspect elements
- Step through tests
- See what the browser sees

### 2. Start Simple

Create a simple test first:
```typescript
test('my first test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/WordPress/);
});
```

Then expand from there.

### 3. Use Page Objects

Don't scatter selectors throughout tests:
```typescript
// Good: Encapsulated in page object
await editor.insertBlock('Paragraph');

// Bad: Selectors in test
await page.click('button:has-text("Add block")');
```

### 4. Wait for Conditions, Not Time

```typescript
// Bad: Arbitrary wait
await page.waitForTimeout(5000);

// Good: Wait for actual condition
await page.waitForLoadState('networkidle');
```

### 5. Leverage Test Utils

```typescript
// Use built-in helpers
const title = TestUtils.generateUniquePostTitle('My Post');
await TestUtils.waitForNetworkIdle(page);
const memory = await TestUtils.getMemoryUsage(page);
```

## Getting Help

### Documentation
- [Playwright Docs](https://playwright.dev)
- [Full README](./README.md)
- [Testing Strategy](./TESTING_STRATEGY.md)
- [Visual Regression Guide](./VISUAL_REGRESSION_GUIDE.md)

### Debugging
```bash
# See what test sees
npm run test:headed

# Interactive debugging
npm run test:debug

# View test report
npm run report
```

### Common Test Patterns

See `advanced.example.spec.ts` for:
- Custom block configuration
- Nested block testing
- Rich text handling
- Media insertion
- Performance testing
- Advanced accessibility checks

## Next Run

Once set up, you can run tests anytime with:

```bash
npm test
```

For different scenarios:
```bash
npm run test:headed      # Watch browser
npm run test:ui         # Interactive mode
npm run test:debug      # Step through
npm run test:mobile     # Test on phones
npm test -g "pattern"   # Specific tests
```

## Success Checklist

- [ ] Node.js 18+ installed
- [ ] npm dependencies installed (`npm install`)
- [ ] Playwright browsers installed (`npx playwright install`)
- [ ] `.env` file configured with BASE_URL
- [ ] WordPress site is running
- [ ] First test runs without errors (`npm test -g "Step 1"`)
- [ ] Browser visible during test (`npm run test:headed`)
- [ ] Test report viewable (`npm run report`)

Once all items are checked, you're ready to write and run comprehensive E2E tests!

---

**Need more details?** Read the full [README.md](./README.md)

**Want advanced patterns?** Check [advanced.example.spec.ts](./advanced.example.spec.ts)

**Have questions?** Review [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
