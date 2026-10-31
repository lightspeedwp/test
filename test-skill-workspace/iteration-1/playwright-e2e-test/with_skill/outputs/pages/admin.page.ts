/**
 * Admin Page Object
 *
 * Abstracts WordPress admin panel interactions for authentication,
 * plugin management, block registration, and post type management.
 */

import { Page } from '@playwright/test';

export interface LoginCredentials {
  username: string;
  password: string;
}

export class AdminPage {
  readonly page: Page;
  private baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = this.getBaseUrl();
  }

  /**
   * Ensures user is logged in to WordPress admin
   */
  async ensureLoggedIn(credentials?: LoginCredentials): Promise<void> {
    // Check if already logged in
    const isLoggedIn = await this.page.$('.wp-menu-wrapper');
    if (isLoggedIn) {
      return; // Already logged in
    }

    // Try default test credentials
    const username = credentials?.username || process.env.WP_TEST_USERNAME || 'admin';
    const password = credentials?.password || process.env.WP_TEST_PASSWORD || 'password';

    // Log in
    await this.login(username, password);
  }

  /**
   * Logs in to WordPress
   */
  async login(username: string, password: string): Promise<void> {
    // Navigate to login page
    await this.page.goto(`${this.baseUrl}/wp-admin/`);

    // Check if already on login page
    const loginForm = await this.page.$('form.login');
    if (!loginForm) {
      // Already logged in
      return;
    }

    // Enter credentials
    const userInput = await this.page.$('input[name="log"]') ||
                     await this.page.$('input#user_login');
    const passInput = await this.page.$('input[name="pwd"]') ||
                     await this.page.$('input#user_pass');

    if (userInput && passInput) {
      await userInput.fill(username);
      await passInput.fill(password);

      // Submit form
      const submitBtn = await this.page.$('input[value="Log In"]') ||
                       await this.page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();

        // Wait for redirect to dashboard
        await this.page.waitForNavigation({ timeout: 10000 });
      }
    }
  }

  /**
   * Logs out from WordPress
   */
  async logout(): Promise<void> {
    // Navigate to admin
    await this.page.goto(`${this.baseUrl}/wp-admin/`);

    // Click user menu
    const userMenu = await this.page.$('#wp-admin-bar-my-account');
    if (userMenu) {
      await userMenu.hover();
    }

    // Click logout
    const logoutLink = await this.page.$('a[href*="action=logout"]');
    if (logoutLink) {
      await logoutLink.click();
      await this.page.waitForNavigation();
    }
  }

  /**
   * Navigates to plugins page
   */
  async navigateToPlugins(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/wp-admin/plugins.php`);
    await this.page.waitForSelector('.wp-admin', { timeout: 5000 });
  }

  /**
   * Activates a plugin by slug
   */
  async activatePlugin(pluginSlug: string): Promise<void> {
    await this.navigateToPlugins();

    const activateBtn = await this.page.$(`a[data-plugin="${pluginSlug}/index.php"][class*="activate"]`) ||
                       await this.page.$(`a[href*="action=activate"][href*="${pluginSlug}"]`);

    if (activateBtn) {
      await activateBtn.click();
      await this.page.waitForNavigation({ timeout: 5000 });
    }
  }

  /**
   * Deactivates a plugin by slug
   */
  async deactivatePlugin(pluginSlug: string): Promise<void> {
    await this.navigateToPlugins();

    const deactivateBtn = await this.page.$(`a[data-plugin="${pluginSlug}/index.php"][class*="deactivate"]`) ||
                         await this.page.$(`a[href*="action=deactivate"][href*="${pluginSlug}"]`);

    if (deactivateBtn) {
      await deactivateBtn.click();
      await this.page.waitForNavigation({ timeout: 5000 });
    }
  }

  /**
   * Checks if plugin is active
   */
  async isPluginActive(pluginSlug: string): Promise<boolean> {
    await this.navigateToPlugins();

    const deactivateBtn = await this.page.$(`a[data-plugin="${pluginSlug}/index.php"][class*="deactivate"]`);
    return deactivateBtn !== null;
  }

  /**
   * Navigates to block patterns page
   */
  async navigateToBlockPatterns(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/wp-admin/admin.php?page=patterns`);
    await this.page.waitForSelector('.wp-admin', { timeout: 5000 }).catch(() => {
      // Fallback for different WordPress versions
    });
  }

  /**
   * Creates a new block pattern
   */
  async createNewPattern(patternName: string): Promise<void> {
    const createBtn = await this.page.$('a:has-text("Create"), button:has-text("New")');
    if (createBtn) {
      await createBtn.click();
    }

    // Enter pattern name
    const nameInput = await this.page.$('input[placeholder*="pattern name"]') ||
                     await this.page.$('input[placeholder*="Name"]');
    if (nameInput) {
      await nameInput.fill(patternName);
    }
  }

  /**
   * Saves the current pattern
   */
  async savePattern(): Promise<void> {
    const saveBtn = await this.page.$('button:has-text("Save")') ||
                   await this.page.$('button[aria-label*="Save"]');
    if (saveBtn) {
      await saveBtn.click();
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Navigates to settings page
   */
  async navigateToSettings(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/wp-admin/options-general.php`);
  }

  /**
   * Gets WordPress version
   */
  async getWordPressVersion(): Promise<string> {
    const versionElement = await this.page.$('.wp-version');
    if (versionElement) {
      return versionElement.textContent() || '';
    }

    // Try footer version
    const footerVersion = await this.page.$('#footer-upgrade');
    if (footerVersion) {
      const text = await footerVersion.textContent();
      const match = text?.match(/WordPress (\d+\.\d+)/);
      if (match) {
        return match[1];
      }
    }

    return 'unknown';
  }

  /**
   * Gets list of active plugins
   */
  async getActivePlugins(): Promise<string[]> {
    await this.navigateToPlugins();

    return this.page.evaluate(() => {
      const plugins: string[] = [];
      const deactivateLinks = document.querySelectorAll('a[class*="deactivate"]');

      for (const link of deactivateLinks) {
        const text = link.textContent?.trim() || '';
        if (text) {
          plugins.push(text);
        }
      }

      return plugins;
    });
  }

  /**
   * Navigates to tools page
   */
  async navigateToTools(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/wp-admin/tools.php`);
  }

  /**
   * Runs site health check
   */
  async runSiteHealthCheck(): Promise<{
    status: string;
    issues: string[];
  }> {
    await this.page.goto(`${this.baseUrl}/wp-admin/site-health.php`);
    await this.page.waitForSelector('.site-health', { timeout: 10000 });

    return this.page.evaluate(() => {
      const statusElement = document.querySelector('.site-health-status');
      const issueElements = document.querySelectorAll('.health-check-result');

      const issues: string[] = [];
      for (const issue of issueElements) {
        const text = issue.textContent?.trim();
        if (text) {
          issues.push(text);
        }
      }

      return {
        status: statusElement?.textContent?.trim() || 'unknown',
        issues,
      };
    });
  }

  /**
   * Clears transients/cache
   */
  async clearCache(): Promise<void> {
    // Use WP-CLI if available via local development
    // Otherwise, navigate to cache settings if plugin is installed
    try {
      await this.page.goto(`${this.baseUrl}/wp-admin/?action=clear_cache`);
      await this.page.waitForTimeout(1000);
    } catch {
      // Cache plugin not installed
    }
  }

  /**
   * Navigates to theme customizer
   */
  async navigateToCustomizer(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/wp-admin/customize.php`);
    await this.page.waitForSelector('.wp-customizer', { timeout: 10000 }).catch(() => {});
  }

  /**
   * Gets WordPress admin error messages
   */
  async getErrorMessages(): Promise<string[]> {
    const errors: string[] = [];

    const errorElements = await this.page.$$('.notice-error, .error');
    for (const error of errorElements) {
      const text = await error.textContent();
      if (text) {
        errors.push(text.trim());
      }
    }

    return errors;
  }

  /**
   * Gets WordPress admin success messages
   */
  async getSuccessMessages(): Promise<string[]> {
    const messages: string[] = [];

    const successElements = await this.page.$$('.notice-success, .success, .updated');
    for (const success of successElements) {
      const text = await success.textContent();
      if (text) {
        messages.push(text.trim());
      }
    }

    return messages;
  }

  /**
   * Waits for page to load and be interactive
   */
  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle').catch(() => {
      // Network might not settle
    });

    // Wait for WordPress admin interface
    await this.page.waitForSelector('.wp-admin', { timeout: 10000 }).catch(() => {
      // Custom page load
    });
  }

  /**
   * Gets base URL of WordPress installation
   */
  private getBaseUrl(): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
    return baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }
}
