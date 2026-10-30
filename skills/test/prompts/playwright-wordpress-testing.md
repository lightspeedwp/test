# Playwright E2E Testing for WordPress

End-to-end testing patterns for WordPress with Playwright.

## Page Object Pattern

```javascript
// pages/BlockEditor.js
class BlockEditor {
  constructor(page) {
    this.page = page;
    this.addBlockButton = 'button[aria-label="Add block"]';
    this.heroBlockOption = 'button:has-text("Hero")';
  }
  
  async addHeroBlock() {
    await this.page.click(this.addBlockButton);
    await this.page.click(this.heroBlockOption);
  }
  
  async setTitle(title) {
    await this.page.fill('input[aria-label="Title"]', title);
  }
  
  async getPreview() {
    return await this.page.textContent('.block-editor-block-preview');
  }
}
```

## WordPress Workflow Tests

**Test login and post creation:**
```javascript
test('create post with hero block', async ({ page }) => {
  // Login
  await page.goto('/wp-login.php');
  await page.fill('input[name="log"]', 'admin');
  await page.fill('input[name="pwd"]', 'password');
  await page.click('input[type="submit"]');
  await page.waitForNavigation();
  
  // Create post
  await page.goto('/wp-admin/post-new.php');
  await page.fill('input[aria-label="Add title"]', 'Test Post');
  
  // Add hero block
  const editor = new BlockEditor(page);
  await editor.addHeroBlock();
  await editor.setTitle('Welcome');
  
  // Publish
  await page.click('button:has-text("Publish")');
  
  // Verify on frontend
  await page.goto('/test-post/');
  const heroText = await page.textContent('.wp-block-hero h1');
  expect(heroText).toBe('Welcome');
});
```

## Visual Regression Testing

```javascript
test('hero block matches design at all breakpoints', async ({ page }) => {
  const breakpoints = [375, 768, 1920];
  
  for (const width of breakpoints) {
    await page.setViewportSize({ width, height: 800 });
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(`hero-${width}.png`);
  }
});
```

## Accessibility Testing

```javascript
test('block editor is keyboard navigable', async ({ page }) => {
  await page.goto('/wp-admin/post-new.php');
  
  // Tab through controls
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement.tagName);
    expect(focused).not.toBe('BODY');
  }
});
```

---

See PLAYWRIGHT.md for complete Playwright reference and ACCESSIBILITY.md for a11y testing.
