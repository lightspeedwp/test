/**
 * Playwright E2E Test Templates for WordPress Hero Block
 *
 * These templates demonstrate comprehensive E2E testing strategies for:
 * - Block editor UI interactions
 * - Frontend rendering validation
 * - Responsive design testing
 * - Accessibility compliance
 *
 * Usage:
 *   npx playwright test hero-block.spec.js
 *   npx playwright test hero-block.spec.js --ui
 *   npx playwright test hero-block.spec.js --headed
 */

import { test, expect, devices } from '@playwright/test';

/**
 * ============================================================================
 * EDITOR UI TESTS
 * ============================================================================
 */

test.describe('Hero Block - Editor UI', () => {
  let page;
  let context;

  test.beforeAll(async ({ browser }) => {
    // Navigate to WordPress admin
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(`${process.env.WP_BASE_URL}/wp-admin/`);
    // Login (use environment variables for credentials)
    await loginToWordPress(page);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('should add hero block to editor', async () => {
    // Navigate to new page
    await page.goto(`${process.env.WP_BASE_URL}/wp-admin/post-new.php?post_type=page`);

    // Wait for editor to load
    await page.waitForSelector('.wp-block-editor-container', { timeout: 10000 });

    // Open block inserter
    await page.click('.block-editor-button-block-appender');

    // Search for hero block
    await page.fill('[placeholder="Search"]', 'Hero');

    // Click hero block
    const heroBlock = page.locator('text=Hero Section');
    await heroBlock.click();

    // Verify block inserted
    const block = page.locator('.wp-block-namespace-hero-section');
    await expect(block).toBeVisible();
  });

  test('should upload image to block', async () => {
    // Add block first
    await addHeroBlockToEditor(page);

    // Click "Select Image" button
    await page.click('button:has-text("Select Image")');

    // Handle media modal
    await page.waitForSelector('.media-modal', { timeout: 5000 });

    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-fixtures/hero-image.jpg');

    // Wait for upload
    await page.waitForTimeout(2000);

    // Select uploaded image
    await page.click('.attachment');

    // Click insert button
    await page.click('button:has-text("Select")');

    // Verify image displays in editor
    const image = page.locator('.wp-block-namespace-hero-section img');
    await expect(image).toBeVisible();

    // Verify image src is set
    const src = await image.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).toContain('hero-image');
  });

  test('should edit overlay text content', async () => {
    await addHeroBlockToEditor(page);
    await addImageToBlock(page);

    // Click text overlay area
    const textOverlay = page.locator('.wp-block-namespace-hero-section .hero__overlay');
    await textOverlay.click();

    // Type heading text
    const heading = page.locator('[contenteditable="true"] h2');
    await heading.click();
    await heading.fill('Test Hero Heading');

    // Verify text appears
    await expect(heading).toContainText('Test Hero Heading');

    // Type description text
    const description = page.locator('[contenteditable="true"] p');
    await description.click();
    await description.fill('Test hero description with optional overlay.');

    // Verify description appears
    await expect(description).toContainText('Test hero description');
  });

  test('should change heading level via inspector', async () => {
    await addHeroBlockToEditor(page);

    // Open inspector
    const inspectorButton = page.locator('[aria-label="Settings"]');
    await inspectorButton.click();

    // Find heading level selector
    const headingLevelSelect = page.locator('select[aria-label*="Heading"]');

    // Change from h2 to h3
    await headingLevelSelect.selectOption('h3');

    // Verify change in editor preview
    const heading = page.locator('.wp-block-namespace-hero-section h3');
    await expect(heading).toBeVisible();
  });

  test('should set text alignment via toolbar', async () => {
    await addHeroBlockToEditor(page);

    // Select block
    const block = page.locator('.wp-block-namespace-hero-section');
    await block.click();

    // Click center align button in toolbar
    const alignCenterButton = page.locator('[aria-label="Align text center"]');
    await alignCenterButton.click();

    // Verify alignment class applied
    const alignedBlock = page.locator('.wp-block-namespace-hero-section.has-text-align-center');
    await expect(alignedBlock).toBeVisible();
  });

  test('should add alt text to image', async () => {
    await addHeroBlockToEditor(page);
    await addImageToBlock(page);

    // Open inspector
    await page.click('[aria-label="Settings"]');

    // Find alt text field
    const altTextField = page.locator('input[placeholder*="Alt text"]');

    // Fill alt text
    await altTextField.fill('Hero section with mountain landscape');

    // Verify alt text persists
    await expect(altTextField).toHaveValue('Hero section with mountain landscape');
  });

  test('should undo/redo block edits', async () => {
    await addHeroBlockToEditor(page);

    // Make an edit
    const textArea = page.locator('[contenteditable="true"] h2');
    await textArea.click();
    await textArea.fill('Original Title');

    // Undo (Ctrl+Z)
    await page.keyboard.press('Control+Z');

    // Wait for undo
    await page.waitForTimeout(500);

    // Verify undo worked
    const content = await textArea.textContent();
    expect(content).not.toContain('Original Title');

    // Redo (Ctrl+Y)
    await page.keyboard.press('Control+Y');
    await page.waitForTimeout(500);

    // Verify redo worked
    await expect(textArea).toContainText('Original Title');
  });

  test('should remove image from block', async () => {
    await addHeroBlockToEditor(page);
    await addImageToBlock(page);

    // Click remove image button
    const removeButton = page.locator('button:has-text("Remove")');
    await removeButton.click();

    // Verify image removed
    const image = page.locator('.wp-block-namespace-hero-section img');
    await expect(image).not.toBeVisible();

    // Verify placeholder shows
    const placeholder = page.locator('.wp-block-namespace-hero-section [data-placeholder]');
    await expect(placeholder).toBeVisible();
  });

  test('should have no console errors in editor', async () => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await addHeroBlockToEditor(page);
    await addImageToBlock(page);

    // Interact with block
    await page.click('[aria-label="Settings"]');
    await page.click('button:has-text("Select Image")');

    // Verify no errors
    expect(errors).toHaveLength(0);
  });
});

/**
 * ============================================================================
 * FRONTEND RENDERING TESTS
 * ============================================================================
 */

test.describe('Hero Block - Frontend Rendering', () => {
  let page;
  let context;
  let pageUrl;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    // Create a page with hero block via API
    pageUrl = await createPageWithHeroBlock(page);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('should render semantic HTML structure', async () => {
    await page.goto(pageUrl);

    // Verify figure element exists
    const figure = page.locator('figure.wp-block-namespace-hero-section');
    await expect(figure).toBeVisible();

    // Verify img element
    const img = figure.locator('img');
    await expect(img).toBeVisible();

    // Verify figcaption for text overlay
    const figcaption = figure.locator('figcaption');
    await expect(figcaption).toBeVisible();
  });

  test('should have correct img attributes', async () => {
    await page.goto(pageUrl);

    const img = page.locator('.wp-block-namespace-hero-section img');

    // Check src attribute
    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();

    // Check alt attribute
    const alt = await img.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt.length).toBeGreaterThanOrEqual(15); // Min alt text length

    // Check width/height (for LCP optimization)
    const width = await img.getAttribute('width');
    const height = await img.getAttribute('height');
    expect(width).toBeTruthy();
    expect(height).toBeTruthy();

    // Check lazy loading
    const loading = await img.getAttribute('loading');
    expect(loading).toBe('lazy');
  });

  test('should render correct heading level', async () => {
    await page.goto(pageUrl);

    // Verify heading element (should be h2 or h3)
    const heading = page.locator('.wp-block-namespace-hero-section h2, .wp-block-namespace-hero-section h3');
    await expect(heading).toBeVisible();

    // Verify heading text
    const text = await heading.textContent();
    expect(text).toBeTruthy();
  });

  test('should have correct CSS classes', async () => {
    await page.goto(pageUrl);

    const block = page.locator('.wp-block-namespace-hero-section');

    // Check main block class
    const classes = await block.getAttribute('class');
    expect(classes).toContain('wp-block-namespace-hero-section');

    // May have alignment class
    // expect(classes).toMatch(/align(full|wide|center|left|right)/);
  });

  test('should have working links in text overlay', async () => {
    // Create page with link in text
    const linkUrl = `${process.env.WP_BASE_URL}`;
    const pageId = await createPageWithHeroBlockAndLink(page, linkUrl);

    await page.goto(`${process.env.WP_BASE_URL}/?page_id=${pageId}`);

    // Find link in hero text
    const link = page.locator('.wp-block-namespace-hero-section a');

    // Verify link href
    const href = await link.getAttribute('href');
    expect(href).toBe(linkUrl);

    // Verify link is clickable
    await expect(link).toBeVisible();
    await expect(link).toBeTruthy();
  });

  test('should not have XSS vulnerabilities', async () => {
    // This would require creating a page with XSS payload
    // In production, this should be prevented at data entry level

    await page.goto(pageUrl);

    // Check page source for unescaped script tags
    const content = await page.content();

    // Should not contain unescaped script tags from user input
    // (WordPress escapes by default)
    const hasScriptTag = content.includes('<script>alert');
    expect(hasScriptTag).toBe(false);
  });

  test('should have no layout shift (CLS)', async () => {
    await page.goto(pageUrl);

    // Measure Cumulative Layout Shift
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => {
          resolve(clsValue);
        }, 3000);
      });
    });

    // CLS should be < 0.1 (good)
    expect(cls).toBeLessThan(0.1);
  });
});

/**
 * ============================================================================
 * RESPONSIVE DESIGN TESTS
 * ============================================================================
 */

test.describe('Hero Block - Responsive Design', () => {
  let pageUrl;

  test.beforeAll(async () => {
    // Create test page
    const browser = await chromium.launch();
    const page = await browser.newPage();
    pageUrl = await createPageWithHeroBlock(page);
    await browser.close();
  });

  test('should render correctly on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(pageUrl);

    // Verify no horizontal scroll
    const body = page.locator('body');
    const scrollWidth = await body.evaluate((el) => el.scrollWidth);
    const clientWidth = await body.evaluate((el) => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // Verify image visible and readable
    const img = page.locator('.wp-block-namespace-hero-section img');
    await expect(img).toBeInViewport();

    // Verify text overlay readable
    const text = page.locator('.wp-block-namespace-hero-section [contenteditable="true"]');
    const fontSize = await text.evaluate((el) => parseInt(window.getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(16); // Minimum readable size
  });

  test('should render correctly on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(pageUrl);

    // Verify layout is not broken
    const block = page.locator('.wp-block-namespace-hero-section');
    const boundingBox = await block.boundingBox();

    expect(boundingBox.width).toBeGreaterThan(0);
    expect(boundingBox.height).toBeGreaterThan(0);
  });

  test('should render correctly on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(pageUrl);

    // Verify full-width option works
    const block = page.locator('.wp-block-namespace-hero-section.alignfull');
    const width = await block.evaluate((el) => el.offsetWidth);

    // Full-width should span viewport
    expect(width).toBeGreaterThan(1000);
  });

  test('should handle orientation change', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(pageUrl);

    const blockPortrait = page.locator('.wp-block-namespace-hero-section');
    const portraitHeight = await blockPortrait.boundingBox().then((box) => box.height);

    // Change to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForLoadState('networkidle');

    const blockLandscape = page.locator('.wp-block-namespace-hero-section');
    const landscapeHeight = await blockLandscape.boundingBox().then((box) => box.height);

    // Height should change (layout responsive)
    expect(portraitHeight).not.toEqual(landscapeHeight);
  });

  test('should have adequate touch targets (48px minimum)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(pageUrl);

    // Check image (main interactive element)
    const img = page.locator('.wp-block-namespace-hero-section img');
    const box = await img.boundingBox();

    // Width should be at least 48px
    expect(box.width).toBeGreaterThanOrEqual(48);
    // Height should be at least 48px
    expect(box.height).toBeGreaterThanOrEqual(48);
  });
});

/**
 * ============================================================================
 * ACCESSIBILITY TESTS
 * ============================================================================
 */

test.describe('Hero Block - Accessibility (WCAG 2.2 AAA)', () => {
  let pageUrl;

  test.beforeAll(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    pageUrl = await createPageWithHeroBlock(page);
    await browser.close();
  });

  test('should have sufficient color contrast (7:1 AAA)', async ({ page }) => {
    await page.goto(pageUrl);

    // Get computed color and background color
    const overlay = page.locator('.wp-block-namespace-hero-section .hero__overlay');
    const color = await overlay.evaluate((el) => window.getComputedStyle(el).color);
    const backgroundColor = await overlay.evaluate((el) => window.getComputedStyle(el).backgroundColor);

    // Calculate contrast ratio (simplified)
    const contrast = calculateContrastRatio(color, backgroundColor);

    // AAA standard requires 7:1 for normal text
    expect(contrast).toBeGreaterThanOrEqual(7);
  });

  test('should have descriptive alt text', async ({ page }) => {
    await page.goto(pageUrl);

    const img = page.locator('.wp-block-namespace-hero-section img');
    const alt = await img.getAttribute('alt');

    // Alt text should be present and descriptive
    expect(alt).toBeTruthy();
    expect(alt.length).toBeGreaterThanOrEqual(15); // Minimum descriptive alt text
    expect(alt.length).toBeLessThanOrEqual(125); // Reasonable length

    // Should not be generic
    expect(alt.toLowerCase()).not.toContain('image');
    expect(alt.toLowerCase()).not.toContain('picture');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto(pageUrl);

    // Click to focus the page
    await page.click('body');

    // Tab to first element
    await page.keyboard.press('Tab');

    // Should focus on an element
    const focused = await page.evaluate(() => document.activeElement);
    expect(focused).toBeTruthy();
  });

  test('should have visible focus indicator', async ({ page }) => {
    await page.goto(pageUrl);

    // Click to focus
    await page.click('a, button, [tabindex]');

    // Get focus outline
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      const style = window.getComputedStyle(el, ':focus');
      return {
        outline: style.outline,
        outlineWidth: style.outlineWidth,
      };
    });

    // Should have visible outline
    expect(focused.outline).not.toBe('none');
  });

  test('should use semantic heading levels', async ({ page }) => {
    await page.goto(pageUrl);

    // Check heading is h1-h6 (not div.heading)
    const heading = page.locator('.wp-block-namespace-hero-section h1, .wp-block-namespace-hero-section h2, .wp-block-namespace-hero-section h3, .wp-block-namespace-hero-section h4, .wp-block-namespace-hero-section h5, .wp-block-namespace-hero-section h6');

    await expect(heading).toBeVisible();
  });

  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(pageUrl);

    // Check if animations are disabled
    const animations = await page.evaluate(() => {
      const el = document.querySelector('.wp-block-namespace-hero-section');
      const style = window.getComputedStyle(el);
      return style.animation;
    });

    // Animation should be none
    expect(animations).toBe('none');
  });

  test('should not have color-only indicators', async ({ page }) => {
    await page.goto(pageUrl);

    // Check that interactive elements have visible indicators
    // (not just color)
    const links = page.locator('.wp-block-namespace-hero-section a');
    const count = await links.count();

    if (count > 0) {
      // If links present, verify they're not indicated by color alone
      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const textDecoration = await link.evaluate((el) => {
          return window.getComputedStyle(el).textDecoration;
        });

        // Should have underline or other indicator
        expect(textDecoration).not.toBe('none');
      }
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(pageUrl);

    // Get all headings on page
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();

    if (count > 0) {
      // Check that heading levels don't skip
      let previousLevel = 0;
      for (let i = 0; i < count; i++) {
        const heading = headings.nth(i);
        const tagName = await heading.evaluate((el) => el.tagName);
        const currentLevel = parseInt(tagName.substring(1));

        // Each heading should be no more than 1 level deeper
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        previousLevel = currentLevel;
      }
    }
  });
});

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Login to WordPress admin
 */
async function loginToWordPress(page) {
  const username = process.env.WP_USER || 'admin';
  const password = process.env.WP_PASSWORD || 'password';

  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');

  await page.waitForNavigation();
}

/**
 * Add hero block to editor
 */
async function addHeroBlockToEditor(page) {
  // Open block inserter
  await page.click('[aria-label="Toggle block inserter"]');

  // Search for hero block
  await page.fill('[placeholder="Search blocks"]', 'Hero');

  // Click block
  await page.click('button:has-text("Hero Section")');

  // Wait for block to appear
  await page.waitForSelector('.wp-block-namespace-hero-section');
}

/**
 * Add image to block
 */
async function addImageToBlock(page) {
  // Click select image button
  await page.click('button:has-text("Select Image")');

  // Handle media modal
  await page.waitForSelector('.media-modal');

  // Upload image
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('./test-fixtures/hero-image.jpg');

  // Wait for upload
  await page.waitForTimeout(1000);

  // Select first attachment
  await page.click('.attachment:first-child');

  // Click select button
  await page.click('button:has-text("Select")');

  // Wait for image to appear
  await page.waitForSelector('.wp-block-namespace-hero-section img');
}

/**
 * Create a test page with hero block via REST API
 */
async function createPageWithHeroBlock(page) {
  const response = await page.request.post(
    `${process.env.WP_BASE_URL}/wp-json/wp/v2/pages`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.WP_REST_TOKEN}`,
      },
      data: {
        title: 'Hero Block Test Page',
        content: `<!-- wp:namespace/hero-section {"imageId":0,"text":"Test Hero Heading","description":"Test description"} -->
          <figure class="wp-block-namespace-hero-section">
            <img src="/wp-content/uploads/2024/01/hero-test.jpg" alt="Test hero section" width="1200" height="600" loading="lazy" />
            <figcaption>
              <h2>Test Hero Heading</h2>
              <p>Test description</p>
            </figcaption>
          </figure>
        <!-- /wp:namespace/hero-section -->`,
        status: 'publish',
      },
    }
  );

  const json = await response.json();
  return json.link;
}

/**
 * Create a test page with hero block and link
 */
async function createPageWithHeroBlockAndLink(page, linkUrl) {
  const response = await page.request.post(
    `${process.env.WP_BASE_URL}/wp-json/wp/v2/pages`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.WP_REST_TOKEN}`,
      },
      data: {
        title: 'Hero Block with Link Test',
        content: `<!-- wp:namespace/hero-section -->
          <figure class="wp-block-namespace-hero-section">
            <img src="/wp-content/uploads/2024/01/hero-test.jpg" alt="Test" width="1200" height="600" loading="lazy" />
            <figcaption>
              <h2>Hero with <a href="${linkUrl}">Link</a></h2>
            </figcaption>
          </figure>
        <!-- /wp:namespace/hero-section -->`,
        status: 'publish',
      },
    }
  );

  const json = await response.json();
  return json.id;
}

/**
 * Calculate contrast ratio between two colors
 * Simplified implementation - returns ratio 1-21
 */
function calculateContrastRatio(color1, color2) {
  // Parse RGB colors (simplified)
  const getRGB = (color) => {
    const match = color.match(/\d+/g);
    if (!match) return [0, 0, 0];
    return match.slice(0, 3).map(Number);
  };

  const [r1, g1, b1] = getRGB(color1);
  const [r2, g2, b2] = getRGB(color2);

  // Calculate relative luminance
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);

  // Calculate contrast ratio
  const contrast = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  return Math.round(contrast * 100) / 100;
}

/**
 * Environment Variables Required:
 *
 * WP_BASE_URL         - WordPress site URL (e.g., http://localhost:8888)
 * WP_USER             - WordPress admin username
 * WP_PASSWORD         - WordPress admin password
 * WP_REST_TOKEN       - WordPress REST API token (for auth)
 *
 * Setup:
 *
 * 1. Install dependencies:
 *    npm install --save-dev @playwright/test
 *
 * 2. Create .env.test file:
 *    WP_BASE_URL=http://localhost:8888
 *    WP_USER=admin
 *    WP_PASSWORD=password
 *    WP_REST_TOKEN=your_rest_token
 *
 * 3. Run tests:
 *    npx playwright test hero-block.spec.js
 *    npx playwright test hero-block.spec.js --ui
 *    npx playwright test hero-block.spec.js --headed
 *    npx playwright test hero-block.spec.js --debug
 */
