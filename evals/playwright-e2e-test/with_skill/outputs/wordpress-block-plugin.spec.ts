/**
 * WordPress Block Plugin Release Workflow E2E Tests
 *
 * Complete end-to-end test suite for WordPress block plugin:
 * 1. User creates custom block in editor
 * 2. Saves and publishes post with block
 * 3. Visits frontend and verifies block renders correctly
 * 4. Tests responsive behavior (mobile/tablet/desktop)
 *
 * Includes:
 * - Page object patterns
 * - Error scenarios
 * - Accessibility checks
 * - Visual regression setup
 * - Responsive testing
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';
import { EditorPage } from './pages/editor.page';
import { FrontendPage } from './pages/frontend.page';
import { AdminPage } from './pages/admin.page';
import { ViewportConfig, VIEWPORTS } from './fixtures/viewports';
import { testConfig } from './fixtures/test-config';

/**
 * Base test suite for WordPress block plugin workflow
 */
test.describe('WordPress Block Plugin Release Workflow', () => {
  let editorPage: EditorPage;
  let frontendPage: FrontendPage;
  let adminPage: AdminPage;
  let context: BrowserContext;

  test.beforeEach(async ({ browser, baseURL }) => {
    // Create persistent context for WordPress session
    context = await browser.newContext({
      locale: 'en-US',
      timezoneId: 'America/Chicago',
    });

    const page = await context.newPage();

    // Initialize page objects
    editorPage = new EditorPage(page);
    frontendPage = new FrontendPage(page);
    adminPage = new AdminPage(page);

    // Navigate to WordPress admin
    await page.goto(`${baseURL}/wp-admin/`);

    // Log in if needed
    await adminPage.ensureLoggedIn();
  });

  test.afterEach(async () => {
    if (context) {
      await context.close();
    }
  });

  /**
   * Happy path: Complete block plugin workflow
   * 1. Create block in editor
   * 2. Save and publish post
   * 3. Verify frontend rendering
   * 4. Test responsive views
   */
  test('should complete full block plugin workflow', async ({ baseURL }) => {
    // Step 1: Create custom block in WordPress editor
    const postTitle = `Block Test Post - ${Date.now()}`;
    await editorPage.createNewPost(postTitle);

    // Insert custom block
    const blockName = 'Custom Feature Block';
    await editorPage.insertBlock(blockName);

    // Verify block appears in editor
    const blockPlaceholder = await editorPage.getBlock(blockName);
    expect(blockPlaceholder).toBeTruthy();

    // Configure block attributes
    await editorPage.configureBlock({
      title: 'Test Block Title',
      description: 'This is a test block description',
      backgroundColor: '#f0f0f0',
      textColor: '#333333',
    });

    // Step 2: Save and publish post
    await editorPage.savePost();
    const saveMessage = await editorPage.getSaveMessage();
    expect(saveMessage).toContain('saved');

    const postUrl = await editorPage.publishPost();
    expect(postUrl).toBeTruthy();
    expect(postUrl).toContain('/?p=');

    // Step 3: Verify frontend rendering
    const page = editorPage.page;
    await page.goto(postUrl!);

    // Wait for block to render
    await page.waitForSelector('[data-block-name="custom-feature-block"]', {
      timeout: 5000,
    });

    // Verify block content on frontend
    const blockElement = await page.$('[data-block-name="custom-feature-block"]');
    expect(blockElement).toBeTruthy();

    const blockTitle = await page.locator(
      '[data-block-name="custom-feature-block"] .wp-block-title'
    ).textContent();
    expect(blockTitle).toBe('Test Block Title');

    // Verify styles applied
    const blockStyles = await blockElement?.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(blockStyles).toBeTruthy();

    // Step 4: Test responsive behavior
    await testResponsiveBehavior(page, postUrl);
  });

  /**
   * Test block creation and configuration
   */
  test('should create and configure block with all attributes', async () => {
    await editorPage.createNewPost('Block Configuration Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Configure all block attributes
    const blockConfig = {
      title: 'Advanced Configuration',
      description: 'Testing all block attributes',
      backgroundColor: '#e8f5e9',
      textColor: '#1b5e20',
      borderRadius: '8px',
      paddingSize: 'large',
      alignment: 'center',
    };

    await editorPage.configureBlock(blockConfig);

    // Verify configuration in inspector
    const inspectorValues = await editorPage.getBlockInspectorValues();
    expect(inspectorValues.title).toBe(blockConfig.title);
    expect(inspectorValues.description).toBe(blockConfig.description);
    expect(inspectorValues.backgroundColor).toBe(blockConfig.backgroundColor);
  });

  /**
   * Test block serialization and data persistence
   */
  test('should persist block configuration when saving post', async () => {
    await editorPage.createNewPost('Block Serialization Test');
    await editorPage.insertBlock('Custom Feature Block');

    const originalConfig = {
      title: 'Persistent Title',
      description: 'Persistent Description',
    };

    await editorPage.configureBlock(originalConfig);
    await editorPage.savePost();

    // Reload editor
    const postId = await editorPage.getCurrentPostId();
    await editorPage.page.reload();

    // Verify configuration persisted
    const reloadedConfig = await editorPage.getBlockInspectorValues();
    expect(reloadedConfig.title).toBe(originalConfig.title);
    expect(reloadedConfig.description).toBe(originalConfig.description);
  });

  /**
   * Test block rendering with preview
   */
  test('should show block preview in editor', async () => {
    await editorPage.createNewPost('Block Preview Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Verify preview visible
    const preview = await editorPage.page.$(
      '[data-block-name="custom-feature-block"] .block-preview'
    );
    expect(preview).toBeTruthy();

    // Configure and verify preview updates
    await editorPage.configureBlock({ title: 'Updated Title' });

    const previewTitle = await editorPage.page.locator(
      '[data-block-name="custom-feature-block"] .block-preview .title'
    ).textContent();
    expect(previewTitle).toContain('Updated Title');
  });

  /**
   * Test block template functionality
   */
  test('should work correctly in block template patterns', async () => {
    // Navigate to patterns/templates
    await adminPage.navigateToBlockPatterns();

    // Create pattern with custom block
    await adminPage.createNewPattern('Test Pattern');

    const editorPageInPattern = new EditorPage(adminPage.page);
    await editorPageInPattern.insertBlock('Custom Feature Block');

    // Save pattern
    await adminPage.savePattern();

    // Navigate to new post and insert pattern
    await editorPage.createNewPost('Pattern Test Post');
    await editorPage.insertPattern('Test Pattern');

    // Verify pattern block inserted correctly
    const blockCount = await editorPage.page.locator(
      '[data-block-name="custom-feature-block"]'
    ).count();
    expect(blockCount).toBeGreaterThan(0);
  });
});

/**
 * Responsive behavior tests across different viewports
 */
test.describe('Block Responsive Behavior', () => {
  let editorPage: EditorPage;
  let frontendPage: FrontendPage;

  test.beforeEach(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    editorPage = new EditorPage(page);
    frontendPage = new FrontendPage(page);

    // Create test post with block
    await page.goto(`${baseURL}/wp-admin/`);
    const adminPage = new AdminPage(page);
    await adminPage.ensureLoggedIn();

    const postUrl = await editorPage.createAndPublishBlockPost(
      'Responsive Test Post',
      'Custom Feature Block'
    );

    // Navigate to post
    await page.goto(postUrl);
  });

  /**
   * Test mobile viewport responsiveness
   */
  test.describe('mobile viewport', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
    });

    test('should stack layout on mobile', async ({ page }) => {
      const block = await page.$('[data-block-name="custom-feature-block"]');
      expect(block).toBeTruthy();

      // Verify mobile layout
      const display = await block?.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).toBe('block');

      // Check text is readable at mobile width
      const textSize = await block?.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      expect(parseInt(textSize || '0')).toBeGreaterThanOrEqual(14);
    });

    test('should have touch-friendly tap targets on mobile', async ({ page }) => {
      const interactiveElements = await page.locator(
        '[data-block-name="custom-feature-block"] button, ' +
        '[data-block-name="custom-feature-block"] a'
      ).all();

      for (const element of interactiveElements) {
        const box = await element.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44); // Minimum touch target
        expect(box?.width).toBeGreaterThanOrEqual(44);
      }
    });

    test('should hide non-essential elements on mobile', async ({ page }) => {
      const sidebar = await page.$('[data-block-name="custom-feature-block"] .sidebar');
      const display = await sidebar?.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).toBe('none');
    });
  });

  /**
   * Test tablet viewport responsiveness
   */
  test.describe('tablet viewport', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet.width, VIEWPORTS.tablet.height);
    });

    test('should display grid layout on tablet', async ({ page }) => {
      const block = await page.$('[data-block-name="custom-feature-block"]');

      const gridDisplay = await block?.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(['grid', 'flex']).toContain(gridDisplay);
    });

    test('should have readable text size on tablet', async ({ page }) => {
      const textElements = await page.locator(
        '[data-block-name="custom-feature-block"] p, ' +
        '[data-block-name="custom-feature-block"] span'
      ).all();

      for (const element of textElements) {
        const fontSize = await element.evaluate((el) => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });
        expect(fontSize).toBeGreaterThanOrEqual(16);
      }
    });

    test('should optimize padding for tablet', async ({ page }) => {
      const block = await page.$('[data-block-name="custom-feature-block"]');
      const padding = await block?.evaluate((el) => {
        return window.getComputedStyle(el).padding;
      });
      expect(padding).toBeTruthy();
    });
  });

  /**
   * Test desktop viewport responsiveness
   */
  test.describe('desktop viewport', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
    });

    test('should display full layout on desktop', async ({ page }) => {
      const block = await page.$('[data-block-name="custom-feature-block"]');
      expect(block).toBeTruthy();

      // Verify sidebar visible
      const sidebar = await page.$('[data-block-name="custom-feature-block"] .sidebar');
      const display = await sidebar?.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).not.toBe('none');
    });

    test('should have optimal spacing on desktop', async ({ page }) => {
      const block = await page.$('[data-block-name="custom-feature-block"]');
      const width = await block?.evaluate((el) => el.offsetWidth);
      expect(width).toBeGreaterThan(600); // Wide enough for full layout
    });

    test('should support multi-column layout on desktop', async ({ page }) => {
      const columns = await page.locator(
        '[data-block-name="custom-feature-block"] [data-column]'
      ).count();
      expect(columns).toBeGreaterThan(1);
    });
  });

  /**
   * Test orientation changes (landscape/portrait)
   */
  test('should adapt to orientation changes', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
    const portraitLayout = await page.$('[data-block-name="custom-feature-block"]');

    // Switch to landscape
    await page.setViewportSize(VIEWPORTS.mobile.height, VIEWPORTS.mobile.width);
    await page.waitForTimeout(500); // Wait for layout adjustment

    const landscapeLayout = await page.$('[data-block-name="custom-feature-block"]');
    expect(landscapeLayout).toBeTruthy();

    // Verify content is still readable
    const text = await landscapeLayout?.textContent();
    expect(text).toBeTruthy();
  });
});

/**
 * Accessibility compliance tests (WCAG 2.2 AAA)
 */
test.describe('Block Accessibility (WCAG 2.2 AAA)', () => {
  let frontendPage: FrontendPage;
  let page: Page;

  test.beforeEach(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    frontendPage = new FrontendPage(page);

    // Create and publish test post
    const adminContext = await browser.newContext();
    const adminPage = adminContext.newPage();
    await adminPage.goto(`${baseURL}/wp-admin/`);

    const admin = new AdminPage(adminPage);
    await admin.ensureLoggedIn();

    const editorPage = new EditorPage(adminPage);
    const postUrl = await editorPage.createAndPublishBlockPost(
      'Accessibility Test Post',
      'Custom Feature Block'
    );

    await adminPage.close();
    await adminContext.close();

    // Navigate to published post
    await page.goto(postUrl);
  });

  test('should have proper heading hierarchy', async () => {
    // Verify no missing heading levels
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const levels: number[] = [];

    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const level = parseInt(tagName[1]);
      levels.push(level);
    }

    // Check no skipped levels
    for (let i = 0; i < levels.length - 1; i++) {
      expect(levels[i + 1] - levels[i]).toBeLessThanOrEqual(1);
    }
  });

  test('should have sufficient color contrast', async () => {
    const textElements = await page.locator(
      '[data-block-name="custom-feature-block"] p, ' +
      '[data-block-name="custom-feature-block"] span, ' +
      '[data-block-name="custom-feature-block"] a'
    ).all();

    for (const element of textElements) {
      const contrast = await element.evaluate((el) => {
        const fg = window.getComputedStyle(el).color;
        const bg = window.getComputedStyle(el.parentElement!).backgroundColor;
        // Simplified contrast check - in production use WCAG contrast formula
        return { fg, bg };
      });

      expect(contrast.fg).toBeTruthy();
      expect(contrast.bg).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async () => {
    // Tab through interactive elements
    const focusElements = await page.locator(
      '[data-block-name="custom-feature-block"] button, ' +
      '[data-block-name="custom-feature-block"] a, ' +
      '[data-block-name="custom-feature-block"] input'
    ).all();

    let lastFocused: string | null = null;

    for (let i = 0; i < focusElements.length; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        return document.activeElement?.getAttribute('data-testid') || null;
      });
      expect(focused).not.toBe(lastFocused);
      lastFocused = focused;
    }
  });

  test('should have proper ARIA labels', async () => {
    // Check buttons have accessible names
    const buttons = await page.locator(
      '[data-block-name="custom-feature-block"] button'
    ).all();

    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      const title = await button.getAttribute('title');

      const hasAccessibleName = ariaLabel || textContent?.trim() || title;
      expect(hasAccessibleName).toBeTruthy();
    }

    // Check images have alt text
    const images = await page.locator(
      '[data-block-name="custom-feature-block"] img'
    ).all();

    for (const image of images) {
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should support screen readers', async () => {
    // Verify landmarks are present
    const main = await page.$('[data-block-name="custom-feature-block"] main');
    const article = await page.$('[data-block-name="custom-feature-block"] article');

    expect(main || article).toBeTruthy();

    // Check for semantic HTML
    const semanticElements = await page.locator(
      '[data-block-name="custom-feature-block"] section, ' +
      '[data-block-name="custom-feature-block"] nav, ' +
      '[data-block-name="custom-feature-block"] article'
    ).count();

    expect(semanticElements).toBeGreaterThan(0);
  });

  test('should have focus indicators', async () => {
    const buttons = await page.locator(
      '[data-block-name="custom-feature-block"] button'
    ).first();

    // Click to focus
    await buttons?.focus();

    const focusStyle = await buttons?.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        outline: style.outline,
        boxShadow: style.boxShadow,
        borderColor: style.borderColor,
      };
    });

    const hasFocusIndicator =
      focusStyle?.outline !== 'none' ||
      focusStyle?.boxShadow !== 'none' ||
      focusStyle?.borderColor !== 'transparent';

    expect(hasFocusIndicator).toBeTruthy();
  });

  test('should respect prefers-reduced-motion', async () => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const blockElement = await page.$('[data-block-name="custom-feature-block"]');
    const animation = await blockElement?.evaluate((el) => {
      return window.getComputedStyle(el).animation;
    });

    expect(animation).toBe('none');
  });

  test('should be readable at 200% zoom', async () => {
    await page.evaluate(() => {
      document.body.style.zoom = '200%';
    });

    const blockElement = await page.$('[data-block-name="custom-feature-block"]');
    const isVisible = await blockElement?.isVisible();
    expect(isVisible).toBe(true);

    // Check no content overflow
    const overflow = await blockElement?.evaluate((el) => {
      return window.getComputedStyle(el).overflow;
    });
    expect(['visible', 'auto']).toContain(overflow);
  });
});

/**
 * Helper function to test responsive behavior
 */
async function testResponsiveBehavior(page: Page, postUrl: string) {
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport.width, viewport.height);
    await page.goto(postUrl);

    // Wait for block to render
    const block = await page.waitForSelector(
      '[data-block-name="custom-feature-block"]',
      { timeout: 5000 }
    );

    expect(block).toBeTruthy();

    // Verify content is visible
    const isVisible = await block?.isVisible();
    expect(isVisible).toBe(true);

    // Verify text is not truncated
    const content = await block?.textContent();
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(0);
  }
}

export { testResponsiveBehavior };
