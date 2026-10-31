/**
 * Visual Regression Tests
 *
 * Automated visual testing for block rendering across viewports,
 * ensuring consistent appearance across browser/device combinations.
 */

import { test, expect, Page } from '@playwright/test';
import { EditorPage } from './pages/editor.page';
import { FrontendPage } from './pages/frontend.page';
import { AdminPage } from './pages/admin.page';
import { VIEWPORTS, getTestScenario } from './fixtures/viewports';
import { visualRegressionConfig } from './fixtures/test-config';

test.describe('Block Visual Regression Tests', () => {
  let editorPage: EditorPage;
  let frontendPage: FrontendPage;
  let adminPage: AdminPage;
  let page: Page;
  let postUrl: string;

  test.beforeAll(async ({ browser, baseURL }) => {
    // Create a test post with block once
    const context = await browser.newContext();
    page = await context.newPage();

    editorPage = new EditorPage(page);
    adminPage = new AdminPage(page);

    await page.goto(`${baseURL}/wp-admin/`);
    await adminPage.ensureLoggedIn();

    // Create post
    postUrl = await editorPage.createAndPublishBlockPost(
      'Visual Regression Test Post',
      'Custom Feature Block'
    ) || '';
  });

  test.beforeEach(async ({ browser, baseURL }) => {
    // Get fresh page for each test
    const context = await browser.newContext();
    page = await context.newPage();
    frontendPage = new FrontendPage(page);

    // Navigate to published post
    await page.goto(postUrl);
    await frontendPage.waitForBlockRender('Custom Feature Block');
  });

  /**
   * Visual regression test for desktop view
   */
  test('should match desktop visual snapshot', async () => {
    await page.setViewportSize(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
    await page.reload();

    // Wait for block to render
    await frontendPage.waitForBlockRender('Custom Feature Block');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('desktop-full-page.png', {
      maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
      threshold: visualRegressionConfig.comparationOptions.threshold,
      fullPage: true,
    });

    // Take block-specific screenshot
    const blockElement = await page.$('[data-block-name="custom-feature-block"]');
    if (blockElement) {
      await expect(blockElement).toHaveScreenshot('desktop-block.png', {
        maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
        threshold: visualRegressionConfig.comparationOptions.threshold,
      });
    }
  });

  /**
   * Visual regression test for mobile view
   */
  test('should match mobile visual snapshot', async () => {
    await page.setViewportSize(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
    await page.reload();

    await frontendPage.waitForBlockRender('Custom Feature Block');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('mobile-full-page.png', {
      maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
      threshold: visualRegressionConfig.comparationOptions.threshold,
      fullPage: true,
    });

    // Take block-specific screenshot
    const blockElement = await page.$('[data-block-name="custom-feature-block"]');
    if (blockElement) {
      await expect(blockElement).toHaveScreenshot('mobile-block.png', {
        maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
        threshold: visualRegressionConfig.comparationOptions.threshold,
      });
    }
  });

  /**
   * Visual regression test for tablet view
   */
  test('should match tablet visual snapshot', async () => {
    await page.setViewportSize(VIEWPORTS.tablet.width, VIEWPORTS.tablet.height);
    await page.reload();

    await frontendPage.waitForBlockRender('Custom Feature Block');

    await expect(page).toHaveScreenshot('tablet-full-page.png', {
      maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
      threshold: visualRegressionConfig.comparationOptions.threshold,
      fullPage: true,
    });
  });

  /**
   * Visual regression with light/dark modes
   */
  test.describe('with color schemes', () => {
    test('should match light mode snapshot', async () => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.reload();

      await frontendPage.waitForBlockRender('Custom Feature Block');

      await expect(page).toHaveScreenshot('light-mode-full-page.png', {
        maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
        threshold: visualRegressionConfig.comparationOptions.threshold,
        fullPage: true,
      });
    });

    test('should match dark mode snapshot', async () => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload();

      await frontendPage.waitForBlockRender('Custom Feature Block');

      await expect(page).toHaveScreenshot('dark-mode-full-page.png', {
        maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
        threshold: visualRegressionConfig.comparationOptions.threshold,
        fullPage: true,
      });
    });
  });

  /**
   * Visual regression for reduced motion preference
   */
  test('should match reduced motion snapshot', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();

    await frontendPage.waitForBlockRender('Custom Feature Block');

    const blockElement = await page.$('[data-block-name="custom-feature-block"]');
    if (blockElement) {
      await expect(blockElement).toHaveScreenshot('reduced-motion-block.png', {
        maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
        threshold: visualRegressionConfig.comparationOptions.threshold,
      });
    }
  });

  /**
   * Visual regression at different zoom levels
   */
  test.describe('zoom levels', () => {
    test('should match at 75% zoom', async () => {
      await page.evaluate(() => {
        document.body.style.zoom = '0.75';
      });

      const blockElement = await page.$('[data-block-name="custom-feature-block"]');
      if (blockElement) {
        await expect(blockElement).toHaveScreenshot('zoom-75-block.png', {
          maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
          threshold: visualRegressionConfig.comparationOptions.threshold,
        });
      }
    });

    test('should match at 125% zoom', async () => {
      await page.evaluate(() => {
        document.body.style.zoom = '1.25';
      });

      const blockElement = await page.$('[data-block-name="custom-feature-block"]');
      if (blockElement) {
        await expect(blockElement).toHaveScreenshot('zoom-125-block.png', {
          maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
          threshold: visualRegressionConfig.comparationOptions.threshold,
        });
      }
    });

    test('should match at 200% zoom', async () => {
      await page.evaluate(() => {
        document.body.style.zoom = '2.0';
      });

      const blockElement = await page.$('[data-block-name="custom-feature-block"]');
      if (blockElement) {
        await expect(blockElement).toHaveScreenshot('zoom-200-block.png', {
          maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
          threshold: visualRegressionConfig.comparationOptions.threshold,
        });
      }
    });
  });

  /**
   * Visual regression across different font sizes
   */
  test('should render correctly with system fonts', async () => {
    // Test with default system fonts
    await page.evaluate(() => {
      document.body.style.fontSize = '16px';
      document.body.style.lineHeight = '1.5';
    });

    const blockElement = await page.$('[data-block-name="custom-feature-block"]');
    if (blockElement) {
      await expect(blockElement).toHaveScreenshot('system-fonts-block.png', {
        maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
        threshold: visualRegressionConfig.comparationOptions.threshold,
      });
    }
  });

  /**
   * Visual regression for block with hover states
   */
  test('should match block hover state', async () => {
    const blockElement = await page.$('[data-block-name="custom-feature-block"]');
    if (blockElement) {
      await blockElement.hover();
      await page.waitForTimeout(300); // Wait for hover animation

      await expect(blockElement).toHaveScreenshot('block-hover-state.png', {
        maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
        threshold: visualRegressionConfig.comparationOptions.threshold,
      });
    }
  });

  /**
   * Visual regression for block with focus state
   */
  test('should match block focus state', async () => {
    const interactive = await page.$('[data-block-name="custom-feature-block"] button');
    if (interactive) {
      await interactive.focus();

      await expect(page).toHaveScreenshot('block-focus-state.png', {
        maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
        threshold: visualRegressionConfig.comparationOptions.threshold,
        fullPage: true,
      });
    }
  });

  /**
   * Visual regression for multiple block instances
   */
  test('should match appearance with multiple blocks', async ({ baseURL }) => {
    // Create post with multiple blocks
    const context = await page.context();
    const adminPage = new AdminPage(page);
    const editorPage = new EditorPage(page);

    await page.goto(`${baseURL}/wp-admin/post-new.php`);
    await page.waitForSelector('.wp-block-post-title');

    await editorPage.createNewPost('Multiple Blocks Test');

    // Insert 3 blocks
    for (let i = 0; i < 3; i++) {
      await editorPage.insertBlock('Custom Feature Block');
      await page.waitForTimeout(300);
    }

    await editorPage.publishPost();

    // Navigate to published post
    const publishedUrl = page.url();
    await page.goto(publishedUrl);

    // Take screenshot
    await expect(page).toHaveScreenshot('multiple-blocks-layout.png', {
      maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
      threshold: visualRegressionConfig.comparationOptions.threshold,
      fullPage: true,
    });
  });
});

/**
 * Visual regression tests for editor
 */
test.describe('Editor Visual Regression Tests', () => {
  test('should match block editor appearance', async ({ baseURL, browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const editorPage = new EditorPage(page);
    const adminPage = new AdminPage(page);

    await page.goto(`${baseURL}/wp-admin/`);
    await adminPage.ensureLoggedIn();

    // Create post with block
    await editorPage.createNewPost('Editor Visual Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Configure block
    await editorPage.configureBlock({
      title: 'Visual Test Block',
      description: 'Testing visual appearance',
    });

    // Take editor screenshot
    await expect(page).toHaveScreenshot('editor-block-view.png', {
      maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
      threshold: visualRegressionConfig.comparationOptions.threshold,
      fullPage: false,
    });

    await context.close();
  });

  test('should match block inspector panel', async ({ baseURL, browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const editorPage = new EditorPage(page);
    const adminPage = new AdminPage(page);

    await page.goto(`${baseURL}/wp-admin/`);
    await adminPage.ensureLoggedIn();

    // Create post with block
    await editorPage.createNewPost('Inspector Visual Test');
    await editorPage.insertBlock('Custom Feature Block');

    // Take inspector panel screenshot
    const inspector = await page.$('.components-panel');
    if (inspector) {
      await expect(inspector).toHaveScreenshot('editor-inspector-panel.png', {
        maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
        threshold: visualRegressionConfig.comparationOptions.threshold,
      });
    }

    await context.close();
  });
});

/**
 * Visual regression for responsive layouts
 */
test.describe('Responsive Visual Regression', () => {
  const testScenarios = [
    { name: 'mobile', viewports: getTestScenario('Mobile Portrait') },
    { name: 'tablet', viewports: getTestScenario('Tablet') },
    { name: 'desktop', viewports: getTestScenario('Desktop') },
  ];

  for (const scenario of testScenarios) {
    test(`should match ${scenario.name} responsive layout`, async ({ baseURL, browser }) => {
      for (const viewport of scenario.viewports.slice(0, 1)) {
        // Test first viewport in scenario
        const context = await browser.newContext();
        const page = await context.newPage();

        const editorPage = new EditorPage(page);
        const adminPage = new AdminPage(page);

        await page.goto(`${baseURL}/wp-admin/`);
        await adminPage.ensureLoggedIn();

        // Get test post
        const postUrl = await editorPage.createAndPublishBlockPost(
          `${scenario.name} Test`,
          'Custom Feature Block'
        ) || '';

        // Test at viewport
        await page.goto(postUrl);
        await page.setViewportSize(viewport.width, viewport.height);

        const blockElement = await page.$('[data-block-name="custom-feature-block"]');
        if (blockElement) {
          await expect(blockElement).toHaveScreenshot(
            `responsive-${scenario.name}-${viewport.width}x${viewport.height}.png`,
            {
              maxDiffPixels: visualRegressionConfig.comparationOptions.maxDiffPixels,
              threshold: visualRegressionConfig.comparationOptions.threshold,
            }
          );
        }

        await context.close();
      }
    });
  }
});
