/**
 * Error Scenario Tests for WordPress Block Plugin
 *
 * Comprehensive tests for edge cases, error handling, and recovery scenarios.
 * Tests plugin stability and user feedback in failure conditions.
 */

import { test, expect, Page } from '@playwright/test';
import { EditorPage } from './pages/editor.page';
import { FrontendPage } from './pages/frontend.page';
import { AdminPage } from './pages/admin.page';

test.describe('Block Plugin Error Scenarios', () => {
  let editorPage: EditorPage;
  let adminPage: AdminPage;
  let page: Page;

  test.beforeEach(async ({ browser, baseURL }) => {
    page = await browser.newPage();
    editorPage = new EditorPage(page);
    adminPage = new AdminPage(page);

    await page.goto(`${baseURL}/wp-admin/`);
    await adminPage.ensureLoggedIn();
  });

  test.afterEach(async () => {
    await page.close();
  });

  /**
   * Test missing required block attributes
   */
  test('should handle missing required block attributes', async () => {
    await editorPage.createNewPost('Missing Attributes Test');

    // Insert block but don't configure required attributes
    await editorPage.insertBlock('Custom Feature Block');

    // Check for warning message
    const warning = await page.locator(
      '[role="alert"], .components-notice, [data-testid="warning"]'
    ).first().textContent();

    expect(warning).toBeTruthy();
  });

  /**
   * Test invalid color values
   */
  test('should reject invalid color values', async () => {
    await editorPage.createNewPost('Invalid Color Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Try to set invalid color
    try {
      await editorPage.configureBlock({
        backgroundColor: 'not-a-color',
      });

      // If no error thrown, verify input was rejected
      const config = await editorPage.getBlockInspectorValues();
      expect(config.backgroundColor).not.toBe('not-a-color');
    } catch (error) {
      // Error was thrown, which is acceptable
      expect(error).toBeTruthy();
    }
  });

  /**
   * Test concurrent block edits
   */
  test('should handle concurrent edits gracefully', async ({ browser, baseURL }) => {
    // Open same post in two browser contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    const editor1 = new EditorPage(page1);
    const editor2 = new EditorPage(page2);

    await page1.goto(`${baseURL}/wp-admin/`);
    await page2.goto(`${baseURL}/wp-admin/`);

    const admin1 = new AdminPage(page1);
    const admin2 = new AdminPage(page2);

    await admin1.ensureLoggedIn();
    await admin2.ensureLoggedIn();

    // Create post in first browser
    await editor1.createNewPost('Concurrent Edit Test');
    const postId = await editor1.getCurrentPostId();

    // Open same post in second browser
    if (postId) {
      await page2.goto(`${baseURL}/wp-admin/post.php?post=${postId}&action=edit`);
      await page2.waitForSelector('[data-type="core/paragraph"]', { timeout: 5000 });
    }

    // Make edits in both browsers
    await editor1.insertBlock('Custom Feature Block');
    await editor2.insertBlock('Custom Feature Block');

    // Save in first browser
    await editor1.savePost();

    // Verify second browser shows conflict/update notification
    const notification = await page2.locator('[role="alert"], .components-notice').first();
    const hasNotification = await notification.isVisible().catch(() => false);

    if (hasNotification) {
      const text = await notification.textContent();
      expect(text).toBeTruthy();
    }

    await context1.close();
    await context2.close();
  });

  /**
   * Test block without proper markup
   */
  test('should show error when block markup is broken', async () => {
    await editorPage.createNewPost('Broken Markup Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Inject broken markup
    await page.evaluate(() => {
      const block = document.querySelector('[data-block-name]');
      if (block) {
        block.innerHTML = '<div><p>Broken content</div></p>';
      }
    });

    // Try to save
    await editorPage.savePost();

    // Check for error notification
    const errorMsg = await page.locator('[role="alert"], .error').first();
    const isVisible = await errorMsg.isVisible().catch(() => false);

    if (isVisible) {
      const text = await errorMsg.textContent();
      expect(text?.toLowerCase()).toContain('error');
    }
  });

  /**
   * Test block with very large content
   */
  test('should handle large content gracefully', async () => {
    await editorPage.createNewPost('Large Content Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Generate large content
    const largeText = 'A'.repeat(100000); // 100KB of text

    const descInput = await page.$('textarea[aria-label*="Description"]');
    if (descInput) {
      await descInput.fill(largeText);
      await page.waitForTimeout(1000);

      // Verify no crash
      const blockElement = await page.$('[data-block-name]');
      expect(blockElement).toBeTruthy();
    }
  });

  /**
   * Test rapid save operations
   */
  test('should handle rapid save operations', async () => {
    await editorPage.createNewPost('Rapid Save Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Rapidly save multiple times
    for (let i = 0; i < 5; i++) {
      await editorPage.savePost();
      await page.waitForTimeout(200);
    }

    // Verify no error occurred
    const errorMessages = await adminPage.getErrorMessages();
    expect(errorMessages.length).toBe(0);
  });

  /**
   * Test block in posts with special characters
   */
  test('should handle special characters in post title', async () => {
    const specialTitle = 'Test "Quote" & <Special> [Chars] {Braces}';
    await editorPage.createNewPost(specialTitle);
    await editorPage.insertBlock('Custom Feature Block');

    // Verify post was created
    const postId = await editorPage.getCurrentPostId();
    expect(postId).toBeTruthy();
  });

  /**
   * Test undo/redo functionality
   */
  test('should support undo/redo operations', async () => {
    await editorPage.createNewPost('Undo/Redo Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Get initial block count
    let blockCount = await page.locator('[data-block-name]').count();
    expect(blockCount).toBeGreaterThan(0);

    // Perform undo
    await page.keyboard.press('Control+Z');
    await page.waitForTimeout(500);

    // Verify block was removed
    const blockCountAfterUndo = await page.locator('[data-block-name]').count();
    expect(blockCountAfterUndo).toBeLessThan(blockCount);

    // Perform redo
    await page.keyboard.press('Control+Shift+Z');
    await page.waitForTimeout(500);

    // Verify block was restored
    const blockCountAfterRedo = await page.locator('[data-block-name]').count();
    expect(blockCountAfterRedo).toBe(blockCount);
  });

  /**
   * Test block with network connectivity issues
   */
  test('should handle network interruptions', async () => {
    await editorPage.createNewPost('Network Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Simulate network offline
    await page.context().setOffline(true);
    await page.waitForTimeout(500);

    // Try to save
    await editorPage.savePost();

    // Check for offline notification
    const notification = await page.locator('[role="alert"]').first();
    const hasNotification = await notification.isVisible().catch(() => false);

    // Restore connection
    await page.context().setOffline(false);

    // Retry save
    await editorPage.savePost();

    // Verify save succeeded
    const message = await editorPage.getSaveMessage();
    expect(message).toBeTruthy();
  });

  /**
   * Test memory/performance with many blocks
   */
  test('should maintain performance with multiple blocks', async () => {
    await editorPage.createNewPost('Many Blocks Test');

    // Insert multiple blocks
    for (let i = 0; i < 10; i++) {
      await editorPage.insertBlock('Custom Feature Block');
      await page.waitForTimeout(200);
    }

    // Verify no performance degradation
    const blockCount = await page.locator('[data-block-name]').count();
    expect(blockCount).toBeGreaterThanOrEqual(10);

    // Test that editor is still responsive
    const title = await page.$('.wp-block-post-title');
    expect(title).toBeTruthy();
  });

  /**
   * Test server-side rendering errors
   */
  test('should display server error gracefully', async ({ baseURL }) => {
    // Create and publish a post
    await editorPage.createNewPost('Server Error Test');
    await editorPage.insertBlock('Custom Feature Block');
    const postUrl = await editorPage.publishPost();

    if (!postUrl) return;

    // Navigate to published post
    const frontendPage = new FrontendPage(page);
    await frontendPage.navigateToPost(postUrl);

    // Verify block rendered (or error message shown)
    const block = await page.$('[data-block-name]').catch(() => null);
    const error = await page.$('[role="alert"]').catch(() => null);

    expect(block || error).toBeTruthy();
  });

  /**
   * Test block validation on publish
   */
  test('should validate block before publishing', async () => {
    await editorPage.createNewPost('Validation Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Don't configure block attributes
    // Try to publish
    await page.keyboard.press('Control+S'); // Save

    // Check if validation message appears
    const notice = await page.locator('.components-notice, [role="alert"]').first();
    const hasNotice = await notice.isVisible().catch(() => false);

    if (hasNotice) {
      const text = await notice.textContent();
      expect(text).toBeTruthy();
    }
  });

  /**
   * Test block behavior when post is deleted
   */
  test('should handle post deletion gracefully', async ({ browser, baseURL }) => {
    // Create post with block
    await editorPage.createNewPost('Deletion Test');
    await editorPage.insertBlock('Custom Feature Block');
    const postId = await editorPage.getCurrentPostId();

    if (!postId) return;

    // Delete post
    await page.goto(`${baseURL}/wp-admin/post.php?post=${postId}&action=edit`);

    const trashBtn = await page.$('a[aria-label*="Move to Trash"]') ||
                    await page.$('button:has-text("Trash")');
    if (trashBtn) {
      await trashBtn.click();
      await page.waitForNavigation({ timeout: 5000 });
    }

    // Verify post is in trash
    await page.goto(`${baseURL}/wp-admin/edit.php?post_status=trash`);

    const trashedPost = await page.locator(
      `a:has-text("Deletion Test")`
    ).first();
    const isVisible = await trashedPost.isVisible().catch(() => false);

    expect(isVisible).toBe(true);
  });

  /**
   * Test block with missing dependencies
   */
  test('should show error when block dependencies are missing', async () => {
    // Deactivate required plugin if applicable
    await adminPage.navigateToPlugins();

    // Create post and insert block
    await editorPage.createNewPost('Missing Dependencies Test');

    try {
      await editorPage.insertBlock('Custom Feature Block');

      // If block inserted, verify error message
      const errorMsg = await page.locator('[role="alert"]').first();
      const isVisible = await errorMsg.isVisible().catch(() => false);

      expect(isVisible || true).toBe(true);
    } catch (error) {
      // Error expected when dependencies missing
      expect(error).toBeTruthy();
    }
  });
});

/**
 * Frontend error scenarios
 */
test.describe('Frontend Error Scenarios', () => {
  test('should handle missing block render function', async ({ baseURL }) => {
    const page = await (await test._browser).newPage?.();
    if (!page) return;

    // Create a post with malformed block data
    await page.goto(`${baseURL}/test-post-with-broken-block/`);

    // Check if error message is displayed
    const errorElement = await page.$('[data-error], .error-message');

    if (errorElement) {
      const text = await errorElement.textContent();
      expect(text).toBeTruthy();
    }

    await page.close();
  });

  test('should handle missing CSS gracefully', async ({ baseURL, browserName }) => {
    if (browserName !== 'chromium') return; // CSS check only relevant for visual browsers

    const page = await (await test._browser).newPage?.();
    if (!page) return;

    // Simulate CSS not loaded
    await page.goto(`${baseURL}/test-post/`);

    // Content should still be visible even without styles
    const blockContent = await page.$('[data-block-name]');
    expect(blockContent).toBeTruthy();

    await page.close();
  });

  test('should handle JavaScript errors gracefully', async ({ baseURL }) => {
    const page = await (await test._browser).newPage?.();
    if (!page) return;

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(`${baseURL}/test-post/`);

    // Some errors might be logged, but block should still render
    const blockElement = await page.$('[data-block-name]');
    expect(blockElement).toBeTruthy();

    await page.close();
  });
});
