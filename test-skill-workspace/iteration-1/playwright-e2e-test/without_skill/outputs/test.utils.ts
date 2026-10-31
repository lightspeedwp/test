import { Page, expect } from '@playwright/test';

/**
 * Test utilities and helpers for WordPress block plugin E2E tests
 */

export class TestUtils {
  /**
   * Generate a unique post title with timestamp
   */
  static generateUniquePostTitle(prefix = 'Test Post'): string {
    return `${prefix} - ${Date.now()}`;
  }

  /**
   * Wait for a network request to complete
   */
  static async waitForNetworkIdle(page: Page, timeout = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for DOM to be stable (no loading spinners)
   */
  static async waitForDOMStable(page: Page, timeout = 5000) {
    try {
      await page.waitForSelector('[aria-busy="true"]', { state: 'hidden', timeout });
    } catch {
      // Element might not exist, which is fine
    }
  }

  /**
   * Take a screenshot with automatic naming
   */
  static async takeScreenshot(
    page: Page,
    testName: string,
    timestamp = true
  ): Promise<Buffer> {
    const name = timestamp ? `${testName}-${Date.now()}.png` : `${testName}.png`;
    return await page.screenshot({ path: `screenshots/${name}` });
  }

  /**
   * Get page console messages
   */
  static async getConsoleMessages(
    page: Page,
    type?: 'log' | 'error' | 'warning' | 'info'
  ): Promise<string[]> {
    const messages: string[] = [];

    page.on('console', (msg) => {
      if (!type || msg.type() === type) {
        messages.push(msg.text());
      }
    });

    return messages;
  }

  /**
   * Monitor network requests
   */
  static async monitorNetworkRequests(
    page: Page,
    callback?: (request: any) => void
  ): Promise<any[]> {
    const requests: any[] = [];

    page.on('request', (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
        timestamp: new Date(),
      });

      if (callback) {
        callback(request);
      }
    });

    return requests;
  }

  /**
   * Get all network requests with details
   */
  static async captureNetworkTraffic(
    page: Page,
    callback: () => Promise<void>
  ): Promise<
    {
      url: string;
      status: number;
      resourceType: string;
      timing: number;
    }[]
  > {
    const responses: any[] = [];

    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
        resourceType: response.request().resourceType(),
        timing: response.request().postDataBuffer()?.length || 0,
      });
    });

    await callback();
    return responses;
  }

  /**
   * Login to WordPress admin (if credentials are provided)
   */
  static async loginToWordPress(
    page: Page,
    username: string,
    password: string
  ) {
    await page.goto('/wp-admin');

    // Check if already logged in
    const loginForm = await page.locator('#loginform').isVisible().catch(() => false);

    if (loginForm) {
      // Fill login form
      await page.locator('#user_login').fill(username);
      await page.locator('#user_pass').fill(password);
      await page.locator('#wp-submit').click();

      // Wait for redirect to admin dashboard
      await page.waitForURL('**/wp-admin/**', { timeout: 10000 });
    }
  }

  /**
   * Verify no critical errors on page
   */
  static async verifyCriticalErrorsFree(page: Page): Promise<string[]> {
    const errors: string[] = [];

    // Check for PHP errors
    const phpErrors = await page.locator('[class*="error"], [class*="fatal"]').count();
    if (phpErrors > 0) {
      errors.push(`Found ${phpErrors} error elements on page`);
    }

    // Check for console errors
    let consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Filter out known acceptable errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('Deprecated') &&
        !error.includes('Warning') &&
        !error.includes('Non-Error promise rejection')
    );

    if (criticalErrors.length > 0) {
      errors.push(...criticalErrors);
    }

    return errors;
  }

  /**
   * Measure Core Web Vitals
   */
  static async measureCoreWebVitals(page: Page): Promise<{
    lcp: number; // Largest Contentful Paint
    inp: number; // Interaction to Next Paint
    cls: number; // Cumulative Layout Shift
  }> {
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        let lcp = 0;
        let inp = 0;
        let cls = 0;

        // Largest Contentful Paint
        const observer1 = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          lcp = lastEntry.startTime;
        });

        try {
          observer1.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // Not supported
        }

        // Cumulative Layout Shift
        let clsValue = 0;
        const observer2 = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          cls = clsValue;
        });

        try {
          observer2.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // Not supported
        }

        // Wait a bit for metrics to populate
        setTimeout(
          () => {
            observer1.disconnect();
            observer2.disconnect();
            resolve({ lcp, inp, cls });
          },
          3000
        );
      });
    });

    return vitals as any;
  }

  /**
   * Get memory usage stats
   */
  static async getMemoryUsage(page: Page): Promise<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null> {
    try {
      return await page.evaluate(() => {
        if ((performance as any).memory) {
          return {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          };
        }
        return null;
      });
    } catch {
      return null;
    }
  }

  /**
   * Wait for element and get text
   */
  static async waitAndGetText(
    page: Page,
    selector: string,
    timeout = 5000
  ): Promise<string> {
    await page.waitForSelector(selector, { timeout });
    return (await page.textContent(selector)) || '';
  }

  /**
   * Fill form field with validation
   */
  static async fillFormField(
    page: Page,
    selector: string,
    value: string,
    validate = true
  ) {
    await page.fill(selector, value);

    if (validate) {
      const filledValue = await page.inputValue(selector);
      expect(filledValue).toBe(value);
    }
  }

  /**
   * Click element with error handling
   */
  static async safeClick(page: Page, selector: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await page.click(selector, { timeout: 5000 });
        return;
      } catch (e) {
        if (i === retries - 1) throw e;
        await page.waitForTimeout(500);
      }
    }
  }

  /**
   * Get all form field values as object
   */
  static async getFormValues(
    page: Page,
    selector: string
  ): Promise<Record<string, string>> {
    const values = await page.evaluate((formSelector) => {
      const form = document.querySelector(formSelector) as HTMLFormElement;
      if (!form) return {};

      const result: Record<string, string> = {};

      form.querySelectorAll('input, textarea, select').forEach((field: any) => {
        if (field.name) {
          result[field.name] = field.value || '';
        }
      });

      return result;
    }, selector);

    return values;
  }

  /**
   * Assert element content
   */
  static async assertElementContent(
    page: Page,
    selector: string,
    expectedContent: string,
    partial = false
  ) {
    const element = page.locator(selector).first();
    const content = await element.textContent();

    if (partial) {
      expect(content).toContain(expectedContent);
    } else {
      expect(content?.trim()).toBe(expectedContent.trim());
    }
  }

  /**
   * Wait for URL to match pattern
   */
  static async waitForURLPattern(
    page: Page,
    pattern: string | RegExp,
    timeout = 10000
  ) {
    await page.waitForURL(pattern, { timeout });
  }

  /**
   * Get all data attributes from element
   */
  static async getDataAttributes(page: Page, selector: string): Promise<Record<string, string>> {
    return await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return {};

      const result: Record<string, string> = {};
      for (const attr of element.attributes) {
        if (attr.name.startsWith('data-')) {
          result[attr.name] = attr.value;
        }
      }
      return result;
    }, selector);
  }

  /**
   * Take comparison screenshots for visual regression
   */
  static async compareVisualRegression(
    page: Page,
    testName: string,
    selector?: string
  ) {
    const element = selector ? page.locator(selector).first() : page;

    await expect(element).toHaveScreenshot(`${testName}-${Date.now()}.png`);
  }

  /**
   * Simulate slow network
   */
  static async setSlowNetwork(page: Page) {
    const client = await (page.context() as any).newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (500 * 1024) / 8, // 500 kbps
      uploadThroughput: (20 * 1024) / 8, // 20 kbps
      latency: 400, // 400ms latency
    });
  }

  /**
   * Simulate fast network
   */
  static async setFastNetwork(page: Page) {
    const client = await (page.context() as any).newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0,
    });
  }

  /**
   * Get unique selector for element
   */
  static async getUniqueSelector(page: Page, element: any): Promise<string> {
    return await element.evaluate((el: HTMLElement) => {
      const id = el.id ? `#${el.id}` : '';
      if (id) return id;

      const classes = el.className
        ? `.${el.className.split(' ').join('.')}`
        : '';
      if (classes && !classes.includes('.')) return classes;

      return el.tagName.toLowerCase();
    });
  }

  /**
   * Wait for element count to change
   */
  static async waitForElementCountChange(
    page: Page,
    selector: string,
    initialCount: number,
    timeout = 5000
  ) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const currentCount = await page.locator(selector).count();
      if (currentCount !== initialCount) {
        return currentCount;
      }
      await page.waitForTimeout(100);
    }

    throw new Error(`Element count did not change within ${timeout}ms`);
  }
}
