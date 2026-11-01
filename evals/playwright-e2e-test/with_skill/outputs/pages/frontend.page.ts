/**
 * Frontend Page Object
 *
 * Abstracts WordPress frontend interactions for verifying block rendering,
 * responsiveness, performance, and accessibility on the public site.
 */

import { Page } from '@playwright/test';

export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  navigationTiming?: PerformanceNavigationTiming;
}

export interface BlockRenderInfo {
  isVisible: boolean;
  elementCount: number;
  hasImages: boolean;
  hasText: boolean;
  computedStyles: Record<string, string>;
}

export class FrontendPage {
  readonly page: Page;
  private baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = page.url();
  }

  /**
   * Navigates to a post URL
   */
  async navigateToPost(postUrl: string): Promise<void> {
    await this.page.goto(postUrl, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Waits for block to be fully rendered
   */
  async waitForBlockRender(blockName: string, timeout: number = 5000): Promise<void> {
    const selector = `[data-block-name="${this.normalizeBlockName(blockName)}"]`;

    await this.page.waitForSelector(selector, { timeout });

    // Wait for images and lazy-loaded content
    await this.page.waitForLoadState('networkidle').catch(() => {
      // Network might not settle, that's okay
    });
  }

  /**
   * Gets block render information
   */
  async getBlockRenderInfo(blockName: string): Promise<BlockRenderInfo> {
    const normalizedName = this.normalizeBlockName(blockName);

    return this.page.evaluate((name) => {
      const block = document.querySelector(`[data-block-name="${name}"]`);

      if (!block) {
        return {
          isVisible: false,
          elementCount: 0,
          hasImages: false,
          hasText: false,
          computedStyles: {},
        };
      }

      const style = window.getComputedStyle(block);
      const computedStyles: Record<string, string> = {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        position: style.position,
      };

      return {
        isVisible: block.offsetHeight > 0 && style.display !== 'none',
        elementCount: block.querySelectorAll('*').length,
        hasImages: block.querySelectorAll('img').length > 0,
        hasText: (block.textContent || '').trim().length > 0,
        computedStyles,
      };
    }, normalizedName);
  }

  /**
   * Verifies block content matches expected values
   */
  async verifyBlockContent(blockName: string, expectedContent: Record<string, string>): Promise<boolean> {
    const normalizedName = this.normalizeBlockName(blockName);

    for (const [selector, expectedText] of Object.entries(expectedContent)) {
      const element = await this.page.$(
        `[data-block-name="${normalizedName}"] ${selector}`
      );

      if (!element) {
        return false;
      }

      const text = await element.textContent();
      if (!text?.includes(expectedText)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Gets all interactive elements in block
   */
  async getBlockInteractiveElements(blockName: string): Promise<Array<{
    tag: string;
    text: string;
    ariaLabel: string | null;
    href?: string;
  }>> {
    const normalizedName = this.normalizeBlockName(blockName);

    return this.page.evaluate((name) => {
      const block = document.querySelector(`[data-block-name="${name}"]`);
      if (!block) return [];

      const elements = block.querySelectorAll('button, a, input, [role="button"]');
      const result = [];

      for (const el of elements) {
        result.push({
          tag: el.tagName.toLowerCase(),
          text: el.textContent || '',
          ariaLabel: el.getAttribute('aria-label'),
          href: el.getAttribute('href') || undefined,
        });
      }

      return result;
    }, normalizedName);
  }

  /**
   * Clicks an element within the block
   */
  async clickBlockElement(blockName: string, selector: string): Promise<void> {
    const normalizedName = this.normalizeBlockName(blockName);
    const fullSelector = `[data-block-name="${normalizedName}"] ${selector}`;

    await this.page.click(fullSelector);
  }

  /**
   * Gets block background image URL
   */
  async getBlockBackgroundImage(blockName: string): Promise<string | null> {
    const normalizedName = this.normalizeBlockName(blockName);

    return this.page.evaluate((name) => {
      const block = document.querySelector(`[data-block-name="${name}"]`);
      if (!block) return null;

      const style = window.getComputedStyle(block);
      const bgImage = style.backgroundImage;

      if (!bgImage || bgImage === 'none') return null;

      const match = bgImage.match(/url\(["']?([^"']+)["']?\)/);
      return match ? match[1] : null;
    }, normalizedName);
  }

  /**
   * Checks if block has custom CSS classes
   */
  async getBlockClasses(blockName: string): Promise<string[]> {
    const normalizedName = this.normalizeBlockName(blockName);

    return this.page.evaluate((name) => {
      const block = document.querySelector(`[data-block-name="${name}"]`);
      if (!block) return [];

      return Array.from(block.classList);
    }, normalizedName);
  }

  /**
   * Measures Core Web Vitals
   */
  async measureCoreWebVitals(): Promise<PerformanceMetrics> {
    return this.page.evaluate(() => {
      const metrics: PerformanceMetrics = {};

      // Navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.navigationTiming = navigation;
      }

      // First Contentful Paint
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcp) {
        metrics.fcp = fcp.startTime;
      }

      // Largest Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      if (paintEntries.length > 0) {
        metrics.fcp = paintEntries[paintEntries.length - 1].startTime;
      }

      // Layout shift score (simplified)
      let clsValue = 0;
      const layoutShifts = performance.getEntriesByType('layout-shift');
      for (const shift of layoutShifts) {
        if (!(shift as any).hadRecentInput) {
          clsValue += (shift as any).value;
        }
      }
      metrics.cls = clsValue;

      return metrics;
    });
  }

  /**
   * Gets all images in block
   */
  async getBlockImages(blockName: string): Promise<Array<{
    src: string;
    alt: string;
    title?: string;
  }>> {
    const normalizedName = this.normalizeBlockName(blockName);

    return this.page.evaluate((name) => {
      const block = document.querySelector(`[data-block-name="${name}"]`);
      if (!block) return [];

      const images = block.querySelectorAll('img');
      const result = [];

      for (const img of images) {
        result.push({
          src: img.src,
          alt: img.alt,
          title: img.title || undefined,
        });
      }

      return result;
    }, normalizedName);
  }

  /**
   * Tests block at specific viewport size
   */
  async testAtViewport(
    blockName: string,
    width: number,
    height: number
  ): Promise<BlockRenderInfo> {
    await this.page.setViewportSize({ width, height });
    await this.page.reload();
    await this.waitForBlockRender(blockName);

    return this.getBlockRenderInfo(blockName);
  }

  /**
   * Gets block scroll position and visibility
   */
  async getBlockScrollInfo(blockName: string): Promise<{
    isInViewport: boolean;
    scrollPercentage: number;
    boundingBox: DOMRect | null;
  }> {
    const normalizedName = this.normalizeBlockName(blockName);

    return this.page.evaluate((name) => {
      const block = document.querySelector(`[data-block-name="${name}"]`);
      if (!block) {
        return {
          isInViewport: false,
          scrollPercentage: 0,
          boundingBox: null,
        };
      }

      const rect = block.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

      const scrollPercentage = Math.max(0, Math.min(100,
        ((rect.top + rect.height) / (window.innerHeight + rect.height)) * 100
      ));

      return {
        isInViewport,
        scrollPercentage,
        boundingBox: rect.toJSON(),
      };
    }, normalizedName);
  }

  /**
   * Checks for console errors
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
   * Validates block HTML structure
   */
  async validateBlockStructure(blockName: string): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    const normalizedName = this.normalizeBlockName(blockName);

    return this.page.evaluate((name) => {
      const block = document.querySelector(`[data-block-name="${name}"]`);
      const issues: string[] = [];

      if (!block) {
        return { valid: false, issues: ['Block not found'] };
      }

      // Check for required block wrapper
      if (!block.classList.contains('wp-block-' + name.replace(/\s/g, '-').toLowerCase())) {
        issues.push('Missing proper block wrapper class');
      }

      // Check for empty content
      if (!block.textContent?.trim()) {
        issues.push('Block has no text content');
      }

      // Check for proper semantic HTML
      const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length > 1 && headings[0].tagName !== 'H1' && headings[0].tagName !== 'H2') {
        issues.push('Improper heading hierarchy');
      }

      // Check for alt text on images
      const images = block.querySelectorAll('img');
      for (const img of images) {
        if (!img.alt && !img.getAttribute('aria-label')) {
          issues.push('Image missing alt text: ' + img.src);
        }
      }

      return {
        valid: issues.length === 0,
        issues,
      };
    }, normalizedName);
  }

  /**
   * Takes a screenshot of the block
   */
  async takeBlockScreenshot(blockName: string, filename?: string): Promise<Buffer> {
    const normalizedName = this.normalizeBlockName(blockName);
    const selector = `[data-block-name="${normalizedName}"]`;

    const element = await this.page.$(selector);
    if (!element) {
      throw new Error(`Block ${blockName} not found`);
    }

    return element.screenshot({
      path: filename,
    });
  }

  /**
   * Measures block size and dimensions
   */
  async measureBlockDimensions(blockName: string): Promise<{
    width: number;
    height: number;
    top: number;
    left: number;
  }> {
    const normalizedName = this.normalizeBlockName(blockName);

    return this.page.evaluate((name) => {
      const block = document.querySelector(`[data-block-name="${name}"]`);
      if (!block) {
        return { width: 0, height: 0, top: 0, left: 0 };
      }

      const rect = block.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      };
    }, normalizedName);
  }

  /**
   * Checks if block is lazy-loaded
   */
  async isBlockLazyLoaded(blockName: string): Promise<boolean> {
    const normalizedName = this.normalizeBlockName(blockName);

    return this.page.evaluate((name) => {
      const block = document.querySelector(`[data-block-name="${name}"]`);
      if (!block) return false;

      return block.hasAttribute('data-lazy') ||
             block.classList.contains('lazy-loaded') ||
             block.parentElement?.hasAttribute('data-lazy');
    }, normalizedName);
  }

  /**
   * Normalizes block name to kebab-case for selectors
   */
  private normalizeBlockName(blockName: string): string {
    return blockName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
