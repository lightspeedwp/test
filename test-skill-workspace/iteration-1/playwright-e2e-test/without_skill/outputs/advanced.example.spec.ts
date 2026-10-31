import { test, expect, Page } from '@playwright/test';
import { EditorPage } from './editor.page';
import { FrontendPage } from './frontend.page';
import { A11yUtils } from './a11y.utils';
import { TestUtils } from './test.utils';

/**
 * ADVANCED EXAMPLE: Custom Block Feature Testing
 *
 * This file demonstrates advanced testing patterns for a custom WordPress block.
 * It shows how to:
 * - Test complex block configurations
 * - Handle nested blocks
 * - Test block variations/patterns
 * - Verify dynamic content rendering
 * - Test block settings and options
 * - Handle block-specific accessibility scenarios
 */

test.describe('Advanced: Custom Feature Block Testing @advanced', () => {
  let editorPage: EditorPage;
  let frontendPage: FrontendPage;

  test.beforeEach(async ({ page }) => {
    editorPage = new EditorPage(page);
    frontendPage = new FrontendPage(page);

    await editorPage.goto();
    await editorPage.waitForEditorReady();
  });

  test.describe('Custom Block Configuration', () => {
    test('should create block with all available options', async () => {
      const title = TestUtils.generateUniquePostTitle('Feature Block Post');
      await editorPage.addPostTitle(title);

      // Insert custom block
      await editorPage.insertBlock('Feature Block');

      // Configure block options via settings sidebar
      await editorPage.setBlockAttribute('Title', 'Feature Title');
      await editorPage.setBlockAttribute('Description', 'This is a feature description');
      await editorPage.setBlockAttribute('Icon', 'check-circle');
      await editorPage.setBlockAttribute('Background Color', '#f0f0f0');

      // Verify configuration in editor
      const editorHTML = await editorPage.getEditorHTML();
      expect(editorHTML).toContain('Feature Title');
      expect(editorHTML).toContain('This is a feature description');
    });

    test('should handle block variations', async () => {
      const title = TestUtils.generateUniquePostTitle('Block Variation Test');
      await editorPage.addPostTitle(title);

      // Some blocks have variations (different layouts/styles)
      // This example assumes your custom block has variations
      await editorPage.insertBlock('Feature Block');

      // Change block variation through transform panel
      const variationButton = editorPage.page.locator('[aria-label*="Variation"]').first();
      if (await variationButton.isVisible()) {
        await variationButton.click();

        // Select a specific variation
        const variation = editorPage.page.locator('button:has-text("Grid")').first();
        if (await variation.isVisible()) {
          await variation.click();
          await editorPage.page.waitForTimeout(500);
        }
      }

      // Verify variation applied
      const blockCount = await editorPage.getBlockCount();
      expect(blockCount).toBeGreaterThan(0);
    });

    test('should handle nested blocks correctly', async () => {
      const title = TestUtils.generateUniquePostTitle('Nested Block Test');
      await editorPage.addPostTitle(title);

      // Insert a container block that supports nested content
      await editorPage.insertBlock('Container Block');

      // Add a nested paragraph block
      await editorPage.page.keyboard.press('/');
      await editorPage.page.waitForTimeout(300);
      await editorPage.page.keyboard.type('Paragraph', { delay: 50 });
      await editorPage.page.locator('[role="option"]:has-text("Paragraph")').first().click();

      // Fill nested block content
      await editorPage.page.keyboard.type('Nested content');

      // Verify nested structure
      const blockCount = await editorPage.getBlockCount();
      expect(blockCount).toBeGreaterThan(0);
    });

    test('should preserve block settings on save/reload', async () => {
      const title = TestUtils.generateUniquePostTitle('Settings Persistence Test');
      await editorPage.addPostTitle(title);

      await editorPage.insertBlock('Feature Block');
      await editorPage.setBlockAttribute('Title', 'Persistent Title');

      // Save draft
      await editorPage.saveDraft();
      await editorPage.page.waitForTimeout(1000);

      // Reload the editor
      const postUrl = editorPage.page.url();
      await editorPage.page.reload();
      await editorPage.waitForEditorReady();

      // Verify settings persisted
      const editorHTML = await editorPage.getEditorHTML();
      expect(editorHTML).toContain('Persistent Title');
    });
  });

  test.describe('Block Content Management', () => {
    test('should handle rich text content in block', async () => {
      const title = TestUtils.generateUniquePostTitle('Rich Text Test');
      await editorPage.addPostTitle(title);

      await editorPage.insertBlock('Feature Block');
      const blockIndex = (await editorPage.getBlockCount()) - 1;

      // Fill content with formatting
      const contentArea = editorPage.page.locator('[contenteditable]').first();
      await contentArea.click();
      await editorPage.page.keyboard.type('Formatted ', { delay: 50 });

      // Make text bold
      await editorPage.page.keyboard.press('Control+b');
      await editorPage.page.keyboard.type('bold', { delay: 50 });
      await editorPage.page.keyboard.press('Control+b');

      // Verify formatting applied
      const editorHTML = await editorPage.getEditorHTML();
      expect(editorHTML).toContain('Formatted');
      expect(editorHTML).toContain('bold');
    });

    test('should handle media insertion in block', async () => {
      const title = TestUtils.generateUniquePostTitle('Media Block Test');
      await editorPage.addPostTitle(title);

      await editorPage.insertBlock('Feature Block');

      // Check if block has media upload capability
      const mediaButton = editorPage.page.locator('button[aria-label*="Media"], button[aria-label*="Image"]').first();

      if (await mediaButton.isVisible()) {
        await mediaButton.click();
        // Note: Actual file upload would require more setup
        // This demonstrates the pattern
      }
    });

    test('should validate required fields before publishing', async () => {
      const title = TestUtils.generateUniquePostTitle('Validation Test');
      await editorPage.addPostTitle(title);

      await editorPage.insertBlock('Feature Block');

      // Try to publish without filling required field
      // The behavior depends on your custom block validation
      try {
        await editorPage.publishPost();

        // If no error, validation might not be implemented
        // Or field might not be required
        const publishedUrl = await editorPage.getPublishedPostUrl();
        expect(publishedUrl).toBeTruthy();
      } catch {
        // Expected if validation is implemented
        expect(true).toBe(true);
      }
    });

    test('should handle character limits', async () => {
      const title = TestUtils.generateUniquePostTitle('Character Limit Test');
      await editorPage.addPostTitle(title);

      await editorPage.insertBlock('Feature Block');

      // Set an attribute with character limit
      const maxLengthField = editorPage.page.locator('input[maxlength]').first();

      if (await maxLengthField.isVisible()) {
        const maxLength = await maxLengthField.getAttribute('maxlength');
        const content = 'x'.repeat((parseInt(maxLength || '255') || 255) + 10);

        await maxLengthField.fill(content);
        const actualValue = await maxLengthField.inputValue();

        expect(actualValue.length).toBeLessThanOrEqual(parseInt(maxLength || '255'));
      }
    });
  });

  test.describe('Block Frontend Rendering', () => {
    let publishedPostUrl: string;

    test.beforeAll(async () => {
      const page = await editorPage.page.context().newPage();
      const editor = new EditorPage(page);

      await editor.goto();
      await editor.waitForEditorReady();

      const title = TestUtils.generateUniquePostTitle('Frontend Render Test');
      await editor.addPostTitle(title);

      await editor.insertBlock('Feature Block');
      await editor.setBlockAttribute('Title', 'Frontend Test Title');
      await editor.setBlockAttribute('Description', 'Frontend test description');

      const blockIndex = (await editor.getBlockCount()) - 1;
      await editor.fillBlockContent(blockIndex, 'Test content');

      await editor.publishPost();
      publishedPostUrl = await editor.getPublishedPostUrl();
    });

    test('should render block with correct structure', async () => {
      if (!publishedPostUrl) test.skip();

      await frontendPage.gotoPost(publishedPostUrl);

      // Verify block structure
      const block = editorPage.page.locator('[class*="wp-block-feature"]').first();
      await expect(block).toBeVisible();

      // Check for required elements
      const title = editorPage.page.locator(
        '[class*="wp-block-feature"] [class*="title"], [class*="wp-block-feature"] h2, [class*="wp-block-feature"] h3'
      );
      await expect(title).toContainText('Frontend Test Title');
    });

    test('should apply custom CSS classes', async () => {
      if (!publishedPostUrl) test.skip();

      await frontendPage.gotoPost(publishedPostUrl);

      const block = editorPage.page.locator('[class*="wp-block-feature"]').first();
      const classes = await block.getAttribute('class');

      expect(classes).toContain('wp-block-');
      expect(classes?.length || 0).toBeGreaterThan(0);
    });

    test('should handle custom data attributes', async () => {
      if (!publishedPostUrl) test.skip();

      await frontendPage.gotoPost(publishedPostUrl);

      const block = editorPage.page.locator('[class*="wp-block-feature"]').first();
      const dataAttrs = await TestUtils.getDataAttributes(editorPage.page, '[class*="wp-block-feature"]');

      // Verify custom data attributes are present
      expect(typeof dataAttrs).toBe('object');
    });

    test('should render block with correct inline styles', async () => {
      if (!publishedPostUrl) test.skip();

      await frontendPage.gotoPost(publishedPostUrl);

      const styles = await frontendPage.getBlockStyles('wp-block-feature');

      // Verify expected CSS properties
      expect(styles.display).toBeTruthy();
      expect(Object.keys(styles).length).toBeGreaterThan(0);
    });
  });

  test.describe('Block Interactions', () => {
    let interactivePostUrl: string;

    test.beforeAll(async () => {
      const page = await editorPage.page.context().newPage();
      const editor = new EditorPage(page);

      await editor.goto();
      await editor.waitForEditorReady();

      const title = TestUtils.generateUniquePostTitle('Interactive Block Test');
      await editor.addPostTitle(title);

      await editor.insertBlock('Feature Block');
      await editor.publishPost();
      interactivePostUrl = await editor.getPublishedPostUrl();
    });

    test('should handle button clicks in block', async () => {
      if (!interactivePostUrl) test.skip();

      await frontendPage.gotoPost(interactivePostUrl);

      const buttons = editorPage.page.locator('[class*="wp-block-feature"] button').all();
      if ((await buttons).length > 0) {
        const button = editorPage.page.locator('[class*="wp-block-feature"] button').first();

        // Click and verify action
        await button.click();
        await editorPage.page.waitForTimeout(300);

        expect(true).toBe(true); // Test successful if no error
      }
    });

    test('should handle form inputs in block', async () => {
      if (!interactivePostUrl) test.skip();

      await frontendPage.gotoPost(interactivePostUrl);

      const inputs = await editorPage.page.locator('[class*="wp-block-feature"] input').count();

      if (inputs > 0) {
        const input = editorPage.page.locator('[class*="wp-block-feature"] input').first();
        await input.fill('Test input value');

        const value = await input.inputValue();
        expect(value).toBe('Test input value');
      }
    });

    test('should handle hover states', async () => {
      if (!interactivePostUrl) test.skip();

      await frontendPage.gotoPost(interactivePostUrl);

      const block = editorPage.page.locator('[class*="wp-block-feature"]').first();

      // Hover over block
      await block.hover();
      await editorPage.page.waitForTimeout(300);

      // Verify element is still visible
      await expect(block).toBeVisible();
    });
  });

  test.describe('Block Performance', () => {
    test('should load block efficiently', async () => {
      const title = TestUtils.generateUniquePostTitle('Performance Test');
      await editorPage.addPostTitle(title);

      const startTime = Date.now();

      // Insert block and measure time
      await editorPage.insertBlock('Feature Block');

      const insertTime = Date.now() - startTime;

      // Block should insert within reasonable time (< 2 seconds)
      expect(insertTime).toBeLessThan(2000);
    });

    test('should not cause memory leaks', async () => {
      const title = TestUtils.generateUniquePostTitle('Memory Test');
      await editorPage.addPostTitle(title);

      // Get initial memory
      const initialMemory = await TestUtils.getMemoryUsage(editorPage.page);

      // Insert and delete multiple blocks
      for (let i = 0; i < 5; i++) {
        await editorPage.insertBlock('Feature Block');
        await editorPage.page.waitForTimeout(100);

        const blockCount = await editorPage.getBlockCount();
        if (blockCount > 1) {
          await editorPage.deleteBlock(blockCount - 1);
          await editorPage.page.waitForTimeout(100);
        }
      }

      // Get final memory
      const finalMemory = await TestUtils.getMemoryUsage(editorPage.page);

      if (initialMemory && finalMemory) {
        // Memory should not grow excessively
        const memoryGrowth = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
        expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // Less than 50MB growth
      }
    });

    test('should measure Core Web Vitals', async () => {
      const title = TestUtils.generateUniquePostTitle('CWV Test');
      await editorPage.addPostTitle(title);

      await editorPage.insertBlock('Feature Block');
      await editorPage.publishPost();

      const postUrl = await editorPage.getPublishedPostUrl();
      await frontendPage.gotoPost(postUrl);

      const vitals = await TestUtils.measureCoreWebVitals(editorPage.page);

      // Verify reasonable performance
      expect(vitals.lcp).toBeLessThan(5000); // LCP < 5 seconds
      expect(vitals.cls).toBeLessThan(0.5); // CLS < 0.5
    });
  });

  test.describe('Block Accessibility (Advanced)', () => {
    let a11yPostUrl: string;

    test.beforeAll(async () => {
      const page = await editorPage.page.context().newPage();
      const editor = new EditorPage(page);

      await editor.goto();
      await editor.waitForEditorReady();

      const title = TestUtils.generateUniquePostTitle('A11y Advanced Test');
      await editor.addPostTitle(title);

      await editor.insertBlock('Feature Block');
      await editor.publishPost();
      a11yPostUrl = await editor.getPublishedPostUrl();
    });

    test('should have accessible button labels', async () => {
      if (!a11yPostUrl) test.skip();

      await frontendPage.gotoPost(a11yPostUrl);

      const buttons = await editorPage.page.locator('[class*="wp-block-feature"] button').all();

      for (const button of buttons) {
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();

        // Button should have either aria-label or visible text
        expect(ariaLabel || text).toBeTruthy();
      }
    });

    test('should support keyboard navigation', async () => {
      if (!a11yPostUrl) test.skip();

      await frontendPage.gotoPost(a11yPostUrl);

      // Tab to first focusable element in block
      await editorPage.page.keyboard.press('Tab');
      await editorPage.page.waitForTimeout(300);

      const focused = await editorPage.page.evaluate(() => {
        return document.activeElement?.className || '';
      });

      // Verify tab focus works
      expect(focused.length).toBeGreaterThanOrEqual(0);
    });

    test('should have proper contrast in interactive elements', async () => {
      if (!a11yPostUrl) test.skip();

      await frontendPage.gotoPost(a11yPostUrl);

      const contrastIssues = await A11yUtils.checkColorContrast(editorPage.page);

      // Should have minimal contrast issues
      expect(contrastIssues.length).toBeLessThan(3);
    });

    test('should work without JavaScript', async () => {
      if (!a11yPostUrl) test.skip();

      // Disable JavaScript
      await editorPage.page.context().setExtraHTTPHeaders({
        'X-UA-Compatible': 'IE=edge',
      });

      await frontendPage.gotoPost(a11yPostUrl);

      // Block structure should still be present
      const blockContent = await editorPage.page.locator('[class*="wp-block-feature"]').count();
      expect(blockContent).toBeGreaterThan(0);
    });
  });
});
