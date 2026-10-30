# WordPress Block Theme & Plugin Testing

Comprehensive testing for WordPress block-based development.

## What to Test

### Block Theme Testing

**Components**:
- Theme templates (index, single, archive, etc.)
- Block patterns
- Theme.json configuration
- Custom blocks
- Typography and spacing
- Color schemes and variants
- Responsive behavior
- Dark mode
- Accessibility

**Test Scenarios**:
1. Theme activation and initialization
2. Block insertion and configuration
3. Template rendering
4. Responsive design (mobile, tablet, desktop)
5. Color scheme switching
6. Dark mode toggle
7. Custom font loading
8. Pattern functionality
9. Fallback behavior
10. Cross-browser compatibility

### Block Plugin Testing

**Components**:
- Block registration
- Block attributes and controls
- Block editing UI
- Block rendering (frontend)
- RichText handling
- Nested blocks
- Reusable blocks
- Block transforms
- Block migrations
- Save/load functionality

**Test Scenarios**:
1. Block appears in inserter
2. Block can be inserted into post
3. Block attributes persist
4. Block controls work correctly
5. Block renders correctly (frontend)
6. Block is responsive
7. Block is keyboard accessible
8. Block is screen reader accessible
9. Block handles missing data gracefully
10. Block migrations work on updates

## Test Types

### Editor Testing
- Block insertion and deletion
- Attribute editing
- Block nesting and grouping
- Undo/redo functionality
- Preview updates
- Save functionality

### Frontend Testing (Playwright)
- Block rendering correctness
- Responsive behavior
- Interaction functionality
- Performance metrics
- Cross-browser compatibility
- Mobile device testing

### Accessibility Testing (WCAG 2.2 AAA)
- Editor UI keyboard navigation
- Block content keyboard navigation
- Screen reader announcements
- Color contrast in UI and content
- Focus indicators
- Error messages
- Form labels and associations

### Code Quality
- PHP linting and standards (PHPCS)
- JavaScript linting (ESLint)
- CSS validation
- Accessibility in markup
- Performance (bundle size)
- Security (sanitization, escaping)

## Playwright Test Example

```typescript
import { test, expect } from '@playwright/test';

test.describe('Custom Block Plugin', () => {
  test.beforeEach(async ({ page }) => {
    // Login to WordPress
    await page.goto('/wp-admin');
    await page.fill('#user_login', 'admin');
    await page.fill('#user_pass', 'password');
    await page.click('#wp-submit');
  });

  test('block appears in inserter', async ({ page }) => {
    // Create new post
    await page.goto('/wp-admin/post-new.php');
    
    // Open block inserter
    await page.click('button[aria-label="Add block"]');
    
    // Search for custom block
    await page.fill('input[placeholder="Search"]', 'Custom Block');
    
    // Verify block appears
    await expect(page.locator('text=Custom Block')).toBeVisible();
  });

  test('block renders correctly on frontend', async ({ page }) => {
    // Navigate to published post with block
    await page.goto('/sample-post');
    
    // Verify block structure
    await expect(page.locator('[data-type="custom/block"]')).toBeVisible();
    
    // Verify block content
    await expect(page.locator('.custom-block__title')).toContainText('Expected Title');
    
    // Test responsiveness
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.custom-block')).toHaveClass(/mobile/);
  });

  test('block is keyboard accessible', async ({ page }) => {
    await page.goto('/sample-post');
    
    // Tab through block interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-role', 'button');
    
    // Test keyboard interaction
    await page.keyboard.press('Enter');
    await expect(page.locator('.expanded')).toBeVisible();
  });

  test('block is accessible to screen readers', async ({ page }) => {
    await page.goto('/sample-post');
    
    // Check accessibility tree
    const heading = page.locator('[role="heading"]');
    await expect(heading).toHaveAttribute('aria-level', '2');
    
    // Verify button labels
    const button = page.locator('[role="button"]');
    await expect(button).toHaveAttribute('aria-label', /not empty/);
  });
});
```

## BATS Shell Script Testing for Build Scripts

```bash
#!/usr/bin/env bats

@test "build script compiles block correctly" {
  run ./build-block.sh my-block
  [ "$status" -eq 0 ]
  [ -f "build/my-block/block.json" ]
  [ -f "build/my-block/index.js" ]
}

@test "build script fails on invalid block" {
  run ./build-block.sh ""
  [ "$status" -ne 0 ]
  [[ "$output" == *"Block name required"* ]]
}

@test "build script generates correct block.json" {
  ./build-block.sh test-block
  content=$(cat build/test-block/block.json)
  [[ "$content" == *"test-block"* ]]
  [[ "$content" == *"title"* ]]
}
```

## Checklist

- [ ] Block is registered correctly
- [ ] Block appears in inserter
- [ ] Block can be inserted
- [ ] Block attributes can be edited
- [ ] Block renders correctly (frontend)
- [ ] Block is responsive
- [ ] Block is keyboard accessible
- [ ] Block works with screen readers
- [ ] Block color contrast valid (WCAG AAA)
- [ ] Block handles edge cases
- [ ] Block error handling works
- [ ] Block performance acceptable
- [ ] Block documentation complete
- [ ] Block tested in different browsers
- [ ] Block accessibility audit passed

## Resources

- [Block Development Handbook](https://developer.wordpress.org/block-editor/)
- [Create Block Tool](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/)
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [Testing WordPress](https://developer.wordpress.org/plugins/testing/)
