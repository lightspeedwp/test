# Playwright Reference

Playwright E2E testing patterns.

## Basic Test

```javascript
test('navigate to page and verify content', async ({ page }) => {
  await page.goto('https://example.com');
  const title = await page.title();
  expect(title).toContain('Example');
});
```

## Locators

```javascript
// By class
await page.click('.button');

// By text
await page.click('button:has-text("Click me")');

// By data-testid
await page.click('[data-testid="submit-button"]');

// By ARIA label
await page.click('[aria-label="Close"]');
```

## Interactions

```javascript
await page.fill('input', 'value');
await page.click('button');
await page.select('select', 'option-value');
await page.keyboard.press('Enter');
```

## Assertions

```javascript
await expect(page.locator('.message')).toBeVisible();
await expect(page).toHaveTitle('Title');
await expect(page.locator('input')).toHaveValue('text');
```

---

See playwright-wordpress-testing.md for WordPress-specific patterns.
