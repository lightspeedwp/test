/**
 * Global Setup for Playwright Tests
 *
 * Runs once before all tests to prepare the environment,
 * install plugins, create test data, etc.
 */

import { chromium, FullConfig } from '@playwright/test';
import { AdminPage } from './pages/admin.page';
import { testUser, blockPluginConfig } from './fixtures/test-config';

async function globalSetup(config: FullConfig) {
  console.log('Running global setup...');

  const baseURL = config.use.baseURL || 'http://localhost:8080';
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Initialize admin page
    const adminPage = new AdminPage(page);

    // Navigate to WordPress
    await page.goto(`${baseURL}/wp-admin/`);

    // Ensure logged in
    await adminPage.ensureLoggedIn(testUser as any);

    // Activate plugin if needed
    const isActive = await adminPage.isPluginActive(blockPluginConfig.pluginSlug);
    if (!isActive) {
      console.log(`Activating plugin: ${blockPluginConfig.pluginName}`);
      await adminPage.activatePlugin(blockPluginConfig.pluginSlug);
    }

    // Clear any existing test data (optional)
    console.log('Global setup complete');

    // Get WordPress version for logging
    const wpVersion = await adminPage.getWordPressVersion();
    console.log(`WordPress version: ${wpVersion}`);

    // Check site health
    const siteHealth = await adminPage.runSiteHealthCheck();
    console.log(`Site health status: ${siteHealth.status}`);

    if (siteHealth.issues.length > 0) {
      console.warn('Site health issues:');
      siteHealth.issues.forEach((issue) => console.warn(`  - ${issue}`));
    }

  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
