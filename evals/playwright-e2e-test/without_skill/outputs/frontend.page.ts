import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for WordPress Frontend
 * Handles interactions with published posts and blocks on the frontend
 */

export class FrontendPage {
  readonly page: Page;
  readonly mainContent: Locator;
  readonly blockContainer: Locator;
  readonly postTitle: Locator;
  readonly postContent: Locator;
  readonly navigationMenu: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContent = page.locator('main, [role="main"], article');
    this.blockContainer = page.locator('[class*="wp-block"], .wp-block-*');
    this.postTitle = page.locator('h1, [role="heading"][aria-level="1"]');
    this.postContent = page.locator('article, [role="article"]');
    this.navigationMenu = page.locator('nav, [role="navigation"]');
    this.footer = page.locator('footer, [role="contentinfo"]');
  }

  /**
   * Navigate to the homepage
   */
  async gotoHome() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to a specific post by URL
   */
  async gotoPost(postUrl: string) {
    await this.page.goto(postUrl);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if a block with specific class exists
   */
  async hasBlock(blockName: string): Promise<boolean> {
    const block = this.page.locator(
      `[class*="${blockName.toLowerCase()}"], [data-wp-block*="${blockName.toLowerCase()}"]`
    ).first();
    return await block.isVisible().catch(() => false);
  }

  /**
   * Get all visible blocks on the page
   */
  async getVisibleBlocks(): Promise<string[]> {
    const blocks = await this.page.locator('[class*="wp-block"]').all();
    const blockNames: string[] = [];

    for (const block of blocks) {
      const className = await block.getAttribute('class');
      if (className) {
        const match = className.match(/wp-block-[\w-]+/);
        if (match) {
          blockNames.push(match[0]);
        }
      }
    }

    return [...new Set(blockNames)]; // Remove duplicates
  }

  /**
   * Get the rendered HTML of a specific block
   */
  async getBlockHTML(blockName: string): Promise<string> {
    const block = this.page.locator(
      `[class*="${blockName.toLowerCase()}"]`
    ).first();
    const html = await block.innerHTML();
    return html;
  }

  /**
   * Verify that a block element is visible and rendered correctly
   */
  async verifyBlockRendered(blockName: string): Promise<boolean> {
    const block = this.page.locator(
      `[class*="${blockName.toLowerCase()}"], [data-wp-block*="${blockName.toLowerCase()}"]`
    ).first();

    try {
      await block.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if an image in the block has proper alt text
   */
  async hasImageAltText(blockName: string): Promise<boolean> {
    const images = await this.page.locator(
      `[class*="${blockName.toLowerCase()}"] img[alt]`
    ).count();
    return images > 0;
  }

  /**
   * Get the responsive width of the viewport
   */
  async getViewportWidth(): Promise<number> {
    return await this.page.evaluate(() => window.innerWidth);
  }

  /**
   * Get the responsive height of the viewport
   */
  async getViewportHeight(): Promise<number> {
    return await this.page.evaluate(() => window.innerHeight);
  }

  /**
   * Verify block content matches expected text
   */
  async verifyBlockContent(blockName: string, expectedContent: string): Promise<boolean> {
    const block = this.page.locator(
      `[class*="${blockName.toLowerCase()}"]`
    ).first();
    const content = await block.textContent();
    return content?.includes(expectedContent) || false;
  }

  /**
   * Scroll to a block and verify it's in viewport
   */
  async scrollToBlock(blockName: string) {
    const block = this.page.locator(
      `[class*="${blockName.toLowerCase()}"]`
    ).first();
    await block.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
  }

  /**
   * Get the computed styles of a block
   */
  async getBlockStyles(blockName: string): Promise<Record<string, string>> {
    const block = this.page.locator(
      `[class*="${blockName.toLowerCase()}"]`
    ).first();

    const styles = await block.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        width: computed.width,
        height: computed.height,
        padding: computed.padding,
        margin: computed.margin,
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });

    return styles;
  }

  /**
   * Verify block is responsive (changes layout on different viewport sizes)
   */
  async isBlockResponsive(blockName: string): Promise<boolean> {
    // Get styles on desktop
    const desktopStyles = await this.getBlockStyles(blockName);

    // Set mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.waitForTimeout(500);

    // Get styles on mobile
    const mobileStyles = await this.getBlockStyles(blockName);

    // Reset to original viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });

    // Compare if any styles changed
    const stylesChanged = Object.keys(desktopStyles).some(
      (key) => desktopStyles[key] !== mobileStyles[key]
    );

    return stylesChanged;
  }

  /**
   * Check if block contains interactive elements
   */
  async hasInteractiveElements(blockName: string): Promise<boolean> {
    const interactiveCount = await this.page.locator(
      `[class*="${blockName.toLowerCase()}"] button, [class*="${blockName.toLowerCase()}"] a, [class*="${blockName.toLowerCase()}"] input`
    ).count();
    return interactiveCount > 0;
  }

  /**
   * Get the performance metrics for the page
   */
  async getPerformanceMetrics() {
    return await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint:
          performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });
  }

  /**
   * Wait for a block to load completely
   */
  async waitForBlockLoad(blockName: string, timeout = 5000) {
    const block = this.page.locator(
      `[class*="${blockName.toLowerCase()}"]`
    ).first();
    await block.waitFor({ state: 'visible', timeout });
    // Wait for any loading indicators to disappear
    await this.page.waitForSelector(
      `[class*="${blockName.toLowerCase()}"] [aria-busy="true"]`,
      { state: 'hidden', timeout: 2000 }
    ).catch(() => {});
  }

  /**
   * Verify the page renders without JavaScript errors
   */
  async getConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }

  /**
   * Check for missing images or broken elements
   */
  async checkForBrokenElements(): Promise<string[]> {
    const issues: string[] = [];

    // Check for images that failed to load
    const brokenImages = await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map((img) => ({
        src: img.src,
        alt: img.alt,
        complete: (img as HTMLImageElement).complete,
        naturalWidth: (img as HTMLImageElement).naturalWidth,
      }));
    });

    for (const img of brokenImages) {
      if (!img.complete || img.naturalWidth === 0) {
        issues.push(`Image failed to load: ${img.src}`);
      }
    }

    // Check for missing stylesheets
    const failedStyles = await this.page.evaluate(() => {
      const styles: string[] = [];
      document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
        const href = link.getAttribute('href');
        // Note: CORS restrictions prevent checking if stylesheet loaded
        styles.push(href || '');
      });
      return styles;
    });

    return issues;
  }

  /**
   * Get text content from a specific block
   */
  async getBlockText(blockName: string): Promise<string> {
    const block = this.page.locator(
      `[class*="${blockName.toLowerCase()}"]`
    ).first();
    const text = await block.textContent();
    return text || '';
  }
}
