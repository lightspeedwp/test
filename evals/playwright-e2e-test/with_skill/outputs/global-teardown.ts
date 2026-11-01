/**
 * Global Teardown for Playwright Tests
 *
 * Runs once after all tests complete to clean up,
 * remove test data, collect results, etc.
 */

import { chromium, FullConfig } from '@playwright/test';
import { AdminPage } from './pages/admin.page';
import { testUser } from './fixtures/test-config';

async function globalTeardown(config: FullConfig) {
  console.log('Running global teardown...');

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

    // Clean up test posts (optional - delete all posts with "Test" in title)
    console.log('Cleaning up test data...');

    // Clear cache if cache plugin installed
    await adminPage.clearCache();

    // Get final site health
    const siteHealth = await adminPage.runSiteHealthCheck();
    console.log(`Final site health status: ${siteHealth.status}`);

    // Log active plugins for verification
    const activePlugins = await adminPage.getActivePlugins();
    console.log(`Active plugins (${activePlugins.length}):`);
    activePlugins.slice(0, 5).forEach((plugin) => console.log(`  - ${plugin}`));
    if (activePlugins.length > 5) {
      console.log(`  ... and ${activePlugins.length - 5} more`);
    }

    // Log out
    await adminPage.logout();

    console.log('Global teardown complete');

  } catch (error) {
    console.error('Global teardown error:', error);
    // Don't throw in teardown - tests have already finished
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalTeardown;
