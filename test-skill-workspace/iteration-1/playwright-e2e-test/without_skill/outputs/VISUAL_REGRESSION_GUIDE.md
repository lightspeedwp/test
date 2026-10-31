# Visual Regression Testing Guide

This guide explains how to use and maintain visual regression tests in the WordPress block plugin E2E test suite.

## Overview

Visual regression testing compares screenshots taken during test execution with baseline screenshots to detect unintended UI changes. This is particularly useful for verifying that CSS updates or block styling changes don't break existing layouts.

## How Visual Regression Works

1. **Baseline Screenshots**: Initial screenshots are taken and stored as reference images
2. **Test Screenshots**: During each test run, new screenshots are captured
3. **Comparison**: Playwright compares pixels between baseline and test screenshots
4. **Reports**: Differences are highlighted and reported

## File Structure

```
playwright-report/
├── index.html                 # Test report
├── data/
│   └── test-results.json     # Test data

__screenshots__/
├── desktop-layout.png        # Baseline screenshots
├── mobile-layout.png
├── tablet-layout.png
└── [test-name]-[hash].png    # Test-run screenshots
```

## Running Visual Regression Tests

### First Run (Create Baselines)

When running tests for the first time, baseline screenshots are created automatically:

```bash
npm run test:visual
```

This creates baseline images in `__screenshots__/` directory.

### Compare Against Baselines

On subsequent runs, test screenshots are compared against baselines:

```bash
npm run test:visual
```

Playwright automatically detects differences and reports them.

### Update Baselines

After intentional UI changes, update baseline screenshots:

```bash
npm test -- --update-snapshots
```

Or for specific tests:

```bash
npm test -- block-release.e2e.spec.ts --update-snapshots
```

## Writing Visual Regression Tests

### Basic Usage

```typescript
import { test, expect } from '@playwright/test';

test('block layout matches baseline', async ({ page }) => {
  // Navigate and load content
  await page.goto('/post-with-block');

  // Capture screenshot
  await expect(page).toHaveScreenshot('block-layout.png');
});
```

### Masking Elements

Some elements change on every test run (timestamps, dynamic content). Mask them to avoid false failures:

```typescript
await expect(page.locator('.main-content')).toHaveScreenshot('layout.png', {
  mask: [
    page.locator('[class*="wp-block-image"]'),      // Mask images
    page.locator('[class*="timestamp"]'),           // Mask timestamps
    page.locator('[class*="wp-block-calendar"]'),   // Mask calendar
  ],
});
```

### Responsive Snapshots

Test different viewports with specific baselines:

```typescript
test('block renders on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/post-with-block');

  await expect(page).toHaveScreenshot('mobile-layout.png');
});

test('block renders on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/post-with-block');

  await expect(page).toHaveScreenshot('desktop-layout.png');
});
```

### Element-Specific Snapshots

Capture only specific elements instead of full page:

```typescript
test('custom block appearance', async ({ page }) => {
  await page.goto('/post-with-block');

  const blockElement = page.locator('[class*="wp-block-custom"]').first();
  await expect(blockElement).toHaveScreenshot('custom-block.png');
});
```

### Snapshot Options

```typescript
await expect(element).toHaveScreenshot('snapshot.png', {
  // Threshold for difference detection (0.0-1.0, default 0.2)
  maxDiffPixels: 100,
  threshold: 0.2,

  // Mask regions (useful for dynamic content)
  mask: [page.locator('.dynamic-region')],

  // Anti-aliasing helps with small rendering differences
  animations: 'disabled',

  // Add additional margin around element
  scale: 'css', // or 'device'
});
```

## Understanding Diff Reports

### Report Structure

```
√ PASS: block renders on desktop
⊘ EXPECTED: Desktop layout looks correct
⊠ RECEIVED: Desktop layout looks correct (diff)
✕ DIFF: 1,234 differing pixels detected
```

### Analyzing Differences

When a test fails with visual differences:

1. **View the report**: `npm run report`
2. **Compare images**: Baseline vs. actual screenshot
3. **Identify cause**:
   - Intentional CSS changes? Update baseline with `--update-snapshots`
   - Unintended changes? Fix the CSS
   - Rendering differences? Adjust mask or threshold

### Common False Failures

**Anti-aliasing differences**
- Occurs on different OS/browser combinations
- Solution: Use `mask` to exclude affected regions

**Font rendering**
- Different systems render fonts slightly differently
- Solution: Set `animations: 'disabled'`

**Timing/dynamic content**
- Timestamps, counters, dynamic elements change
- Solution: Mask these elements

**Resolution differences**
- Screenshots differ on different display scales
- Solution: Use `scale: 'css'` for consistent scaling

## Best Practices

### 1. Atomic Baselines

Create separate snapshots for distinct UI components:

```typescript
// Good: specific, focused snapshots
await expect(page.locator('.wp-block-paragraph')).toHaveScreenshot('paragraph-block.png');
await expect(page.locator('.wp-block-image')).toHaveScreenshot('image-block.png');

// Avoid: full page snapshots are hard to review
await expect(page).toHaveScreenshot('entire-post.png');
```

### 2. Mask Dynamic Content

Always mask elements that change between runs:

```typescript
await expect(page).toHaveScreenshot('post.png', {
  mask: [
    page.locator('time'),                 // Published date
    page.locator('[class*="view-count"]'), // View counters
    page.locator('.ads'),                 // Ad regions
  ],
});
```

### 3. Test Across Browsers

Visual rendering may differ across browsers:

```typescript
test.describe('visual regression @visual', () => {
  test.use({ browserName: 'chromium' });
  
  test('block renders on Chrome', async ({ page }) => {
    // Test setup
  });
});
```

### 4. Document Baseline Changes

When updating baselines, commit with clear messages:

```bash
git add __screenshots__/
git commit -m "chore: update visual baselines after button styling update"
```

### 5. Review Before Updating

Always review changes before updating baselines:

```bash
# See what changed
npm run report

# Then update
npm test -- --update-snapshots
```

### 6. Use Meaningful Names

```typescript
// Good
await expect(page).toHaveScreenshot('block-with-padding.png');

// Bad
await expect(page).toHaveScreenshot('test1.png');
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Visual Regression

on: [pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install --with-deps
      
      - name: Run visual tests
        run: npm run test:visual
      
      - name: Upload report
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-report
          path: playwright-report/
```

### GitLab CI

```yaml
visual-regression:
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  script:
    - npm install
    - npm run test:visual
  artifacts:
    paths:
      - playwright-report/
    expire_in: 30 days
    when: on_failure
```

## Troubleshooting

### Screenshots don't match but look identical

**Cause**: Rendering differences, anti-aliasing, font smoothing

**Solution**:
1. Check pixel-level diff in report
2. Adjust threshold: `maxDiffPixels: 50` (allow small differences)
3. Mask affected regions

### Test passes but expected it to fail

**Cause**: Baseline screenshot may be outdated or incorrect

**Solution**:
1. Delete baseline screenshot
2. Run test to create new baseline
3. Review screenshot carefully

### Can't find baseline file

**Cause**: Playwright stores baselines in `__screenshots__/` by default

**Solution**:
```bash
# Check if directory exists
ls -la __screenshots__/

# Create if missing
mkdir -p __screenshots__/
```

### Performance: Screenshots take too long

**Cause**: Full-page screenshots on large pages

**Solution**:
```typescript
// Instead of full page
await expect(page).toHaveScreenshot('full.png');

// Test specific block
const block = page.locator('[class*="wp-block"]').first();
await expect(block).toHaveScreenshot('block.png');
```

## Advanced Usage

### Custom Comparison Function

```typescript
test('custom comparison', async ({ page }) => {
  const screenshot1 = await page.screenshot({ path: 'before.png' });
  
  // Perform action
  await page.click('button');
  
  const screenshot2 = await page.screenshot({ path: 'after.png' });
  
  // Compare programmatically
  const diff = await page.context().evaluate(() => {
    // Custom comparison logic
  });
  
  expect(diff).toBeLessThan(100); // Less than 100 pixel differences
});
```

### Batch Snapshot Updates

```bash
# Update all visual regression baselines
npm test -- __screenshots__ --update-snapshots

# Update specific test file
npm test -- block-release.e2e.spec.ts --update-snapshots
```

## Storage and Maintenance

### Clean Up Old Baselines

```bash
# Remove old screenshots (keep last 5)
find __screenshots__/ -name "*.png" -type f -mtime +30 -delete
```

### Git Strategy

**Option 1: Commit baselines**
```bash
git add __screenshots__/
git commit -m "chore: update visual regression baselines"
```

**Option 2: Use Git LFS** (for large files)
```bash
git lfs track "__screenshots__/*.png"
```

**Option 3: Use CI artifacts** (don't commit)
```bash
echo "__screenshots__/" >> .gitignore
```

## Performance Metrics

Visual regression tests add overhead. To minimize:

1. **Use element snapshots** instead of full-page
2. **Mask dynamic regions** to reduce false failures
3. **Run on single browser** for baseline, then test cross-browser
4. **Cache baselines** in CI to avoid repeated generation

## Additional Resources

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Screenshot Best Practices](https://playwright.dev/docs/test-snapshots#best-practices)
- [Debugging Snapshots](https://playwright.dev/docs/debug)

## Summary Checklist

- [ ] Understand pixel-based comparison
- [ ] Know how to create baselines
- [ ] Learn to mask dynamic content
- [ ] Review diff reports carefully
- [ ] Test across multiple browsers/viewports
- [ ] Commit baselines with clear messages
- [ ] Use CI to prevent regressions
- [ ] Keep baselines up-to-date
