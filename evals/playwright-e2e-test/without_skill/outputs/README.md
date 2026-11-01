# WordPress Block Plugin Release E2E Test Suite

A comprehensive Playwright end-to-end test suite for testing WordPress block plugin release workflows, including page object patterns, error scenarios, accessibility checks, and responsive design testing.

## Overview

This test suite covers the complete WordPress block plugin release workflow:

1. **User creates custom block in editor** - Tests block insertion and configuration
2. **Saves and publishes post with block** - Tests draft/publish functionality
3. **Visits frontend and verifies block renders** - Tests frontend rendering and display
4. **Tests responsive behavior** - Tests mobile, tablet, and desktop viewports
5. **Accessibility checks** - Tests WCAG compliance and accessibility best practices
6. **Error scenarios** - Tests error handling and edge cases
7. **Visual regression testing** - Tests visual consistency across updates

## Project Structure

```
├── playwright.config.ts           # Playwright configuration (multi-browser, multi-viewport)
├── a11y.utils.ts                  # Accessibility testing utilities
├── editor.page.ts                 # Page Object Model for WordPress editor
├── frontend.page.ts               # Page Object Model for frontend
├── block-release.e2e.spec.ts      # Main E2E test file
├── package.json                   # Dependencies and scripts
└── README.md                       # This file
```

## Installation

### Prerequisites

- Node.js 18+ (check with `node --version`)
- npm or yarn
- WordPress site running locally or on staging server
- WordPress admin access

### Setup Steps

1. **Clone or copy this test suite to your project:**

```bash
npm install
```

2. **Install Playwright browsers:**

```bash
npx playwright install
```

3. **Configure environment variables:**

Create a `.env` file in the project root:

```env
# WordPress site URL (default: http://localhost:8889)
BASE_URL=http://localhost:8889

# WordPress admin credentials (for automation if needed)
WP_ADMIN_USER=admin
WP_ADMIN_PASSWORD=password

# Test settings
CI=false  # Set to true in CI/CD environments
HEADED=false  # Set to true to see browser during tests
```

4. **Ensure WordPress is running:**

Tests will attempt to start a dev server based on `playwright.config.ts` configuration. You can also start your WordPress site manually and update the `baseURL` in `playwright.config.ts`.

## Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Run tests with interactive UI
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

### Browser-Specific Testing

```bash
# Test on Chrome only
npm run test:chromium

# Test on Firefox
npm run test:firefox

# Test on Safari (WebKit)
npm run test:webkit

# Test across all browsers
npm test
```

### Viewport-Specific Testing

```bash
# Test mobile viewports (Pixel 5, iPhone 12)
npm run test:mobile

# Test tablet viewport (iPad Pro)
npm run test:tablet

# Test responsive behavior (all viewports)
npm run test:responsive
```

### Accessibility Testing

```bash
# Run only accessibility tests
npm run test:a11y
```

### Error Scenario Testing

```bash
# Run only error scenario tests
npm run test:error-scenarios
```

### Visual Regression Testing

```bash
# Run visual regression tests
npm run test:visual
```

## Test File Structure

### playwright.config.ts

Configures Playwright with:
- Multi-browser testing (Chrome, Firefox, Safari)
- Mobile device emulation (Pixel 5, iPhone 12)
- Tablet emulation (iPad Pro)
- Automatic test retries and failure screenshots
- HTML and JSON test reports
- Video recording for failures

### a11y.utils.ts

Provides accessibility testing utilities:

```typescript
// Check for all accessibility issues
const issues = await A11yUtils.checkPageAccessibility(page);

// Check specific aspects
await A11yUtils.checkHeadingHierarchy(page);
await A11yUtils.checkKeyboardNavigation(page);
await A11yUtils.checkFormAccessibility(page);
await A11yUtils.checkAriaAttributes(page);

// Assert no errors
await A11yUtils.assertNoA11yIssues(page, 'error');
```

### editor.page.ts (Page Object Model)

Abstracts WordPress editor interactions:

```typescript
const editor = new EditorPage(page);

// Navigate and setup
await editor.goto();
await editor.waitForEditorReady();

// Content creation
await editor.addPostTitle('My Post');
await editor.insertBlock('Paragraph');
await editor.fillBlockContent(0, 'Block content');

// Publishing
await editor.saveDraft();
await editor.publishPost();
const url = await editor.getPublishedPostUrl();

// Block management
await editor.deleteBlock(0);
await editor.undo();
await editor.redo();
```

### frontend.page.ts (Page Object Model)

Abstracts frontend interactions and verification:

```typescript
const frontend = new FrontendPage(page);

// Navigation
await frontend.gotoPost(postUrl);
await frontend.gotoHome();

// Block verification
const hasBlock = await frontend.hasBlock('CustomBlock');
const visibleBlocks = await frontend.getVisibleBlocks();

// Responsive testing
await frontend.getViewportWidth();
await frontend.getViewportHeight();
const isResponsive = await frontend.isBlockResponsive('CustomBlock');

// Performance
const metrics = await frontend.getPerformanceMetrics();

// Issues
const brokenElements = await frontend.checkForBrokenElements();
```

### block-release.e2e.spec.ts

Complete test suite with test groups:

```typescript
test.describe('Step 1: Create Custom Block in Editor') { ... }
test.describe('Step 2: Save and Publish Post with Block') { ... }
test.describe('Step 3: Verify Block Renders on Frontend') { ... }
test.describe('Step 4: Responsive Design Testing') { ... }
test.describe('Accessibility Checks') { ... }
test.describe('Error Scenarios') { ... }
test.describe('Visual Regression Testing') { ... }
```

## Test Coverage

### Editor Tests (Step 1)
- ✅ Editor loads successfully
- ✅ Adding post titles
- ✅ Inserting blocks via keyboard shortcut
- ✅ Inserting blocks via GUI
- ✅ Filling block content
- ✅ Undo/redo functionality
- ✅ Unsaved changes detection

### Publishing Tests (Step 2)
- ✅ Saving as draft
- ✅ Publishing posts
- ✅ Publish error handling
- ✅ Multi-block verification

### Frontend Rendering Tests (Step 3)
- ✅ Block renders on frontend
- ✅ Content matches editor
- ✅ No broken images
- ✅ CSS classes applied correctly
- ✅ No console errors

### Responsive Tests (Step 4)
- ✅ Desktop rendering (1920x1080)
- ✅ Tablet rendering (768x1024, iPad)
- ✅ Mobile rendering (375x667, 390x844)
- ✅ Text overflow handling
- ✅ Layout responsiveness
- ✅ Touch interaction support

### Accessibility Tests
- ✅ No alt text missing
- ✅ Proper heading hierarchy
- ✅ Keyboard navigation
- ✅ Form accessibility
- ✅ ARIA attribute validation
- ✅ Color contrast checking

### Error Scenario Tests
- ✅ Network error handling
- ✅ Invalid block configuration
- ✅ Large content handling (10k+ characters)
- ✅ Rapid operation handling
- ✅ Recovery from deletion

### Visual Regression Tests
- ✅ Desktop layout baseline
- ✅ Mobile layout baseline
- ✅ Tablet layout baseline

## Customization

### Adding Custom Blocks

Modify the test to use your custom block name:

```typescript
test('should insert custom block', async () => {
  await editorPage.insertBlock('My Custom Block Name');
});
```

### Custom Page Object Methods

Extend the page objects for block-specific functionality:

```typescript
// In editor.page.ts or frontend.page.ts
async customBlockAction() {
  const element = this.page.locator('[class*="my-custom-class"]');
  // Custom interaction logic
}
```

### WordPress Credentials

For automated login to WordPress admin:

1. Create a `.env` file with credentials
2. Add a login method to EditorPage if needed
3. Use credentials in `test.beforeEach()`

### Custom Viewports

Modify `playwright.config.ts` to test different devices:

```typescript
projects: [
  {
    name: 'Samsung Galaxy',
    use: { ...devices['Galaxy S5'] },
  },
  // Add more custom viewports
]
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### GitLab CI Example

```yaml
e2e_tests:
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  script:
    - npm install
    - npm test
  artifacts:
    paths:
      - playwright-report/
    expire_in: 30 days
```

## Troubleshooting

### Tests fail with "Timeout waiting for locator"

**Solution:** Increase timeout or ensure WordPress is fully loaded
```typescript
await page.waitForTimeout(2000); // Add explicit wait
```

### Editor not loading

**Solution:** Verify WordPress URL and admin access:
```bash
# Check if WordPress is running
curl http://localhost:8889/wp-admin
```

### Screenshot mismatches in visual regression

**Solution:** Update baseline screenshots after intentional UI changes:
```bash
npm test -- --update-snapshots
```

### Tests run but don't interact with blocks

**Solution:** Verify block naming and selectors:
```typescript
// Debug: Print all blocks on page
const blocks = await page.locator('[data-type]').count();
console.log(`Found ${blocks} blocks`);
```

### Mobile tests fail

**Solution:** Ensure Playwright has proper device definition:
```bash
npx playwright install
```

## Performance Considerations

- Tests run in parallel by default (configurable in `playwright.config.ts`)
- Mobile tests are slower due to emulation
- Visual regression baseline screenshots are stored in `__screenshots__` directory
- Test videos/traces only recorded on failure to save disk space

## Best Practices

1. **Use page objects** - Encapsulate selectors and interactions
2. **Keep tests focused** - One assertion per test when possible
3. **Use proper waits** - Prefer `waitFor()` over `setTimeout()`
4. **Test user journeys** - Test complete workflows, not individual components
5. **Handle flakiness** - Use retries for network-dependent tests
6. **Accessibility first** - Always include a11y checks
7. **Document custom blocks** - Add comments for block-specific test logic

## Maintenance

### Updating Selectors

If WordPress UI changes:

1. Run test in debug mode: `npm run test:debug`
2. Use inspector to find new selectors
3. Update `editor.page.ts` or `frontend.page.ts`
4. Re-run tests

### Adding New Test Groups

1. Add new `test.describe()` block in `block-release.e2e.spec.ts`
2. Follow existing pattern with `test.beforeEach()` setup
3. Write descriptive test names
4. Include error handling

### Updating Visual Baselines

After intentional UI changes:

```bash
npm test -- --update-snapshots
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [WordPress Gutenberg Docs](https://developer.wordpress.org/block-editor/)
- [WCAG 2.2 Accessibility Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)

## Support

For issues or questions:
1. Check Playwright documentation
2. Review existing test examples
3. Run tests in debug mode to inspect behavior
4. Check console output for detailed error messages

## License

MIT
