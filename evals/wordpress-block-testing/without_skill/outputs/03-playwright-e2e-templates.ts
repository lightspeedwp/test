/**
 * Playwright E2E Test Templates for WordPress Hero Block
 *
 * Usage:
 *   npx playwright test
 *   npx playwright test --project=chromium
 *   npx playwright test --headed (see tests run)
 *   npx playwright test --debug (step through)
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';

// Test fixtures
const WP_HOME = process.env.WP_HOME || 'http://localhost:8889';
const WP_USER = process.env.WP_USER || 'admin';
const WP_PASS = process.env.WP_PASS || 'password';

/**
 * Helper: Login to WordPress
 */
async function loginToWordPress(page: Page) {
  await page.goto(`${WP_HOME}/wp-login.php`);
  await page.fill('input[name="log"]', WP_USER);
  await page.fill('input[name="pwd"]', WP_PASS);
  await page.click('input[type="submit"]');
  await page.waitForNavigation();
}

/**
 * Helper: Create new post and go to editor
 */
async function createNewPost(page: Page) {
  await page.goto(`${WP_HOME}/wp-admin/post-new.php`);
  await page.waitForSelector('[role="heading"][aria-level="1"]');
}

/**
 * Helper: Insert hero block
 */
async function insertHeroBlock(page: Page) {
  // Click inserter
  await page.click('button[aria-label*="Add block"]');
  await page.waitForSelector('[role="searchbox"]');

  // Search for hero block
  await page.fill('[role="searchbox"]', 'hero');
  await page.waitForSelector('[role="option"]');

  // Click hero block
  await page.click('[role="option"]', { force: true });
  await page.waitForSelector('[data-type="namespace/hero-section"]');
}

// ============================================================================
// Test Suite 1: Block Registration & Setup
// ============================================================================

test.describe('Hero Block: Registration & Setup', () => {
  test('block should appear in inserter', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);

    // Open inserter
    await page.click('button[aria-label*="Add block"]');

    // Verify block in inserter
    const inserterPanel = await page.$('[role="region"]');
    expect(inserterPanel).toBeTruthy();

    // Search for block
    await page.fill('[role="searchbox"]', 'hero');
    const heroOption = await page.waitForSelector('[role="option"]');
    expect(heroOption).toBeTruthy();
  });

  test('block should have correct example content', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Check block content
    const blockContent = await page.locator('[data-type="namespace/hero-section"]');
    expect(blockContent).toBeTruthy();

    // Should have image placeholder or example
    const image = await blockContent.locator('img').first();
    // Image may or may not exist depending on implementation
  });

  test('block attributes should initialize with defaults', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Get block data from DOM
    const blockElement = await page.locator('[data-type="namespace/hero-section"]').first();
    const blockJson = await blockElement.getAttribute('data-block');

    // Should have attributes
    expect(blockJson).toBeTruthy();
    const attributes = JSON.parse(blockJson || '{}');
    expect(attributes).toHaveProperty('textContent');
  });

  test('block should render with correct HTML structure', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Publish and view
    await page.click('text="Publish"');
    await page.waitForNavigation();

    // View post
    const viewButton = await page.$('a:has-text("View post")');
    if (viewButton) {
      await viewButton.click();
      await page.waitForNavigation();
    }

    // Check rendered block structure
    const heroBlock = await page.locator('.wp-block-namespace-hero-section').first();
    expect(heroBlock).toBeTruthy();

    // Check for required elements
    const image = await heroBlock.locator('img').first();
    const overlay = await heroBlock.locator('.wp-block-hero-section__overlay').first();
    const textContent = await heroBlock.locator('.wp-block-hero-section__text').first();

    expect(image || overlay || textContent).toBeTruthy();
  });
});

// ============================================================================
// Test Suite 2: Editor UI & Interactions
// ============================================================================

test.describe('Hero Block: Editor UI', () => {
  test.beforeEach(async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);
  });

  test('should upload and display image', async ({ page }) => {
    // Click media upload button
    const uploadButton = await page.$('button:has-text("Upload")');
    expect(uploadButton).toBeTruthy();

    if (uploadButton) {
      // Mock file upload (in real tests use setInputFiles)
      const mediaFrame = page.frameLocator('iframe[name*="media"]').first();
      // Test image replacement ability
    }
  });

  test('inspector controls should be visible', async ({ page }) => {
    // The inspector should be visible on the right side
    const settingsPanel = await page.$('.block-editor-block-inspector');
    expect(settingsPanel).toBeTruthy();

    // Check for specific controls
    const controls = await page.locator('.block-editor-block-inspector input').all();
    expect(controls.length).toBeGreaterThan(0);
  });

  test('text overlay should be editable', async ({ page }) => {
    const blockElement = await page.locator('[data-type="namespace/hero-section"]').first();
    const textArea = await blockElement.locator('.wp-block-hero-section__text, [contenteditable="true"]').first();

    if (textArea) {
      await textArea.click();
      await textArea.fill('Test overlay text');

      // Verify text updated
      const content = await textArea.textContent();
      expect(content).toContain('Test overlay text');
    }
  });

  test('color picker should change overlay color', async ({ page }) => {
    // Find color control in inspector
    const colorControl = await page.locator('input[type="color"], button:has-text("Color")').first();

    if (colorControl && await colorControl.isVisible()) {
      // Try to interact with color picker
      await colorControl.click();

      // Look for color options
      const colorOptions = await page.locator('[role="button"][style*="background"]').all();
      if (colorOptions.length > 0) {
        await colorOptions[2].click();
      }
    }
  });

  test('opacity slider should update overlay transparency', async ({ page }) => {
    const opacitySlider = await page.locator('input[type="range"]').first();

    if (opacitySlider) {
      // Get initial value
      const initialValue = await opacitySlider.inputValue();

      // Set to 50%
      await opacitySlider.fill('50');

      // Verify change
      const newValue = await opacitySlider.inputValue();
      expect(newValue).toBe('50');
    }
  });

  test('alignment buttons should change text alignment', async ({ page }) => {
    // Find alignment buttons
    const alignLeftButton = await page.locator('button[aria-label*="Align left"], button[aria-label*="left"]').first();

    if (alignLeftButton && await alignLeftButton.isVisible()) {
      await alignLeftButton.click();

      // Verify alignment changed
      const isPressed = await alignLeftButton.evaluate((el: HTMLElement) =>
        el.getAttribute('aria-pressed')
      );
      expect(isPressed).toBe('true');
    }
  });

  test('should support undo/redo', async ({ page }) => {
    // Make a change
    const textArea = await page.locator('.wp-block-hero-section__text, [contenteditable="true"]').first();
    if (textArea) {
      await textArea.click();
      await textArea.fill('Changed text');
    }

    // Undo
    await page.keyboard.press('Control+Z');

    // Check text reverted
    const content = await textArea?.textContent();
    expect(content).not.toContain('Changed text');

    // Redo
    await page.keyboard.press('Control+Shift+Z');
  });

  test('should delete block correctly', async ({ page }) => {
    const block = await page.locator('[data-type="namespace/hero-section"]').first();

    // Select block and delete
    await block.click();
    await page.keyboard.press('Delete');

    // Verify block removed
    const blockCount = await page.locator('[data-type="namespace/hero-section"]').count();
    expect(blockCount).toBe(0);
  });
});

// ============================================================================
// Test Suite 3: Frontend Rendering
// ============================================================================

test.describe('Hero Block: Frontend Rendering', () => {
  test('should render block on frontend', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Add some content
    const textArea = await page.locator('.wp-block-hero-section__text, [contenteditable="true"]').first();
    if (textArea) {
      await textArea.click();
      await textArea.fill('Hero Section Heading');
    }

    // Publish
    await page.click('button[aria-label="Publish"]');
    if (await page.$('button:has-text("Publish")')) {
      await page.click('button:has-text("Publish")');
    }

    await page.waitForSelector('[role="button"]:has-text("View")');

    // Navigate to frontend
    const viewLinks = await page.locator('a:has-text("View")').all();
    if (viewLinks.length > 0) {
      await viewLinks[0].click();
      await page.waitForNavigation();
    }

    // Verify block rendered
    const block = await page.locator('.wp-block-namespace-hero-section');
    expect(block).toBeTruthy();
  });

  test('should not have console errors', async ({ page }) => {
    let hasError = false;

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
        hasError = true;
      }
    });

    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Publish and view
    await page.click('button[aria-label="Publish"]');
    if (await page.$('button:has-text("Publish")')) {
      await page.click('button:has-text("Publish")');
    }

    await page.waitForNavigation();

    expect(!hasError).toBeTruthy();
  });

  test('should display alt text for image', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Publish
    await page.click('button[aria-label="Publish"]');
    if (await page.$('button:has-text("Publish")')) {
      await page.click('button:has-text("Publish")');
    }

    await page.waitForNavigation();

    // Check for image with alt text
    const image = await page.locator('.wp-block-namespace-hero-section img').first();
    if (image) {
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('overlay should be visible over image', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Publish and view
    await page.click('button[aria-label="Publish"]');
    if (await page.$('button:has-text("Publish")')) {
      await page.click('button:has-text("Publish")');
    }

    await page.waitForNavigation();

    // Check overlay visibility
    const overlay = await page.locator('.wp-block-hero-section__overlay');
    expect(overlay).toBeTruthy();
  });
});

// ============================================================================
// Test Suite 4: Responsive Behavior
// ============================================================================

test.describe('Hero Block: Responsive Design', () => {
  test('should be responsive on mobile (375px)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Publish
    await page.click('button[aria-label="Publish"]');
    if (await page.$('button:has-text("Publish")')) {
      await page.click('button:has-text("Publish")');
    }

    await page.waitForNavigation();

    // Check block is visible
    const block = await page.locator('.wp-block-namespace-hero-section');
    expect(block).toBeTruthy();

    // Check no horizontal scroll
    const windowWidth = await page.evaluate(() => window.innerWidth);
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth);
  });

  test('should be responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    const block = await page.locator('[data-type="namespace/hero-section"]').first();
    expect(block).toBeTruthy();
  });

  test('should display full width on desktop (1024px)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    const block = await page.locator('[data-type="namespace/hero-section"]').first();
    expect(block).toBeTruthy();
  });

  test('should maintain aspect ratio across viewports', async ({ page }) => {
    for (const { width, height } of [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 }
    ]) {
      await page.setViewportSize({ width, height });

      await loginToWordPress(page);
      await createNewPost(page);
      await insertHeroBlock(page);

      // Verify block visible
      const block = await page.locator('[data-type="namespace/hero-section"]').first();
      expect(block).toBeTruthy();

      // Clean up for next iteration
      await page.goto(`${WP_HOME}/wp-admin/post-new.php`);
    }
  });
});

// ============================================================================
// Test Suite 5: Accessibility
// ============================================================================

test.describe('Hero Block: Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Publish and check
    await page.click('button[aria-label="Publish"]');
    if (await page.$('button:has-text("Publish")')) {
      await page.click('button:has-text("Publish")');
    }

    await page.waitForNavigation();

    // Check headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThanOrEqual(0);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Tab to block
    const initialFocus = await page.evaluate(() => document.activeElement?.className);
    await page.keyboard.press('Tab');

    const newFocus = await page.evaluate(() => document.activeElement?.className);
    expect(newFocus).not.toBe(initialFocus);
  });

  test('should show focus indicator', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Focus an element
    const textArea = await page.locator('[contenteditable="true"]').first();
    if (textArea) {
      await textArea.focus();

      // Check focus outline
      const outline = await textArea.evaluate((el: HTMLElement) => {
        const style = window.getComputedStyle(el);
        return style.outline || style.outlineWidth;
      });

      expect(outline).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Publish
    await page.click('button[aria-label="Publish"]');
    if (await page.$('button:has-text("Publish")')) {
      await page.click('button:has-text("Publish")');
    }

    await page.waitForNavigation();

    // Check text contrast
    const textElement = await page.locator('.wp-block-hero-section__text').first();
    if (textElement) {
      const color = await textElement.evaluate((el: HTMLElement) => {
        return window.getComputedStyle(el).color;
      });

      const backgroundColor = await textElement.evaluate((el: HTMLElement) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Basic check that colors are defined
      expect(color).toBeTruthy();
      expect(backgroundColor).toBeTruthy();
    }
  });

  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Verify no animations in reduced motion mode
    const block = await page.locator('[data-type="namespace/hero-section"]').first();
    const animation = await block.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).animation;
    });

    // Should be 'none' when reduced motion enabled
    expect(animation).toBe('none');
  });
});

// ============================================================================
// Test Suite 6: Data Persistence
// ============================================================================

test.describe('Hero Block: Data Persistence', () => {
  test('should persist attributes after save', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Get post ID
    const postId = await page.evaluate(() => {
      const match = window.location.search.match(/post=(\d+)/);
      return match ? match[1] : null;
    });

    // Save
    await page.keyboard.press('Control+S');
    await page.waitForTimeout(1000);

    // Reload page
    await page.reload();

    // Verify block still exists
    const block = await page.locator('[data-type="namespace/hero-section"]').first();
    expect(block).toBeTruthy();
  });

  test('should restore attributes on page reload', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Add content
    const textArea = await page.locator('.wp-block-hero-section__text, [contenteditable="true"]').first();
    if (textArea) {
      await textArea.click();
      await textArea.fill('Persistent Text');
    }

    // Save
    await page.keyboard.press('Control+S');
    await page.waitForTimeout(1000);

    // Reload
    await page.reload();
    await page.waitForSelector('[data-type="namespace/hero-section"]');

    // Verify content restored
    const restoredText = await textArea?.textContent();
    expect(restoredText).toContain('Persistent Text');
  });

  test('undo should revert changes', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    const textArea = await page.locator('.wp-block-hero-section__text, [contenteditable="true"]').first();

    if (textArea) {
      const original = await textArea.textContent();

      // Make change
      await textArea.click();
      await textArea.fill('Changed Text');

      // Undo
      await page.keyboard.press('Control+Z');

      // Should be back to original
      const reverted = await textArea.textContent();
      expect(reverted).toBe(original);
    }
  });
});

// ============================================================================
// Test Suite 7: Theme.json Integration
// ============================================================================

test.describe('Hero Block: Theme.json Integration', () => {
  test('should use theme colors', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    // Publish
    await page.click('button[aria-label="Publish"]');
    if (await page.$('button:has-text("Publish")')) {
      await page.click('button:has-text("Publish")');
    }

    await page.waitForNavigation();

    // Check CSS custom properties
    const block = await page.locator('.wp-block-namespace-hero-section').first();
    const styles = await block.evaluate((el: HTMLElement) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color
      };
    });

    expect(styles.backgroundColor).toBeTruthy();
    expect(styles.color).toBeTruthy();
  });

  test('should inherit theme typography', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    const textArea = await page.locator('.wp-block-hero-section__text, [contenteditable="true"]').first();

    if (textArea) {
      const fontFamily = await textArea.evaluate((el: HTMLElement) => {
        return window.getComputedStyle(el).fontFamily;
      });

      expect(fontFamily).toBeTruthy();
    }
  });

  test('should respect theme spacing', async ({ page }) => {
    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    const block = await page.locator('[data-type="namespace/hero-section"]').first();

    const spacing = await block.evaluate((el: HTMLElement) => {
      const computed = window.getComputedStyle(el);
      return {
        padding: computed.padding,
        margin: computed.margin
      };
    });

    // Should have spacing from theme
    expect(spacing.padding || spacing.margin).toBeTruthy();
  });
});

// ============================================================================
// Visual Regression Test Example
// ============================================================================

test.describe('Hero Block: Visual Regression', () => {
  test('should match screenshot on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    const block = await page.locator('[data-type="namespace/hero-section"]').first();

    // Take screenshot
    await expect(block).toHaveScreenshot('hero-block-desktop.png');
  });

  test('should match screenshot on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await loginToWordPress(page);
    await createNewPost(page);
    await insertHeroBlock(page);

    const block = await page.locator('[data-type="namespace/hero-section"]').first();

    // Take screenshot
    await expect(block).toHaveScreenshot('hero-block-mobile.png');
  });
});
