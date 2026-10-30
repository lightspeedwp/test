# WordPress Block Testing Strategy

Comprehensive testing strategy for WordPress block themes and plugins across 7 dimensions.

## 7-Dimension Block Testing Framework

### Dimension 1: Block Registration

Tests that block is properly registered and discoverable.

**Checklist:**
- [ ] Block registered with `registerBlockType()`
- [ ] Block appears in editor inserter
- [ ] Category assigned correctly
- [ ] Block icon displays
- [ ] Block supports required attributes

**Test Template:**
```javascript
test('block is registered and discoverable', () => {
  const blocks = wp.blocks.getBlockTypes();
  const heroBlock = blocks.find(b => b.name === 'namespace/hero');
  
  expect(heroBlock).toBeDefined();
  expect(heroBlock.title).toBe('Hero');
  expect(heroBlock.category).toBe('text');
  expect(heroBlock.icon).toBeDefined();
});
```

### Dimension 2: Editor UI

Tests that inspector controls work and preview updates.

**Checklist:**
- [ ] Inspector panel displays controls
- [ ] Text controls accept input
- [ ] Media picker opens
- [ ] Select dropdowns work
- [ ] Toggle switches toggle
- [ ] Preview updates on control change
- [ ] Undo/redo works with changes

**Playwright Test:**
```javascript
test('editor controls update preview', async ({ page }) => {
  await page.goto('/wp-admin/');
  
  // Add block
  await page.click('[aria-label="Add block"]');
  await page.click('button:has-text("Hero")');
  
  // Modify control
  await page.fill('input[aria-label="Title"]', 'New Title');
  
  // Verify preview updated
  const preview = await page.textContent('.block-editor-block-preview');
  expect(preview).toContain('New Title');
});
```

### Dimension 3: Frontend Rendering

Tests that block renders correctly on frontend with proper output.

**Checklist:**
- [ ] Block HTML structure correct
- [ ] CSS classes applied
- [ ] Media rendered properly
- [ ] Text content displays
- [ ] Links functional
- [ ] No editor markup in output

**Test Template:**
```javascript
test('block renders correct HTML on frontend', () => {
  const block = {
    name: 'namespace/hero',
    attributes: {
      title: 'Welcome',
      imageId: 123
    }
  };
  
  const html = render(Hero, { attributes: block.attributes });
  
  expect(html).toContain('<div class="wp-block-hero">');
  expect(html).toContain('<h1>Welcome</h1>');
  expect(html).toContain('<img');
});
```

### Dimension 4: Responsive Behavior

Tests that block responds correctly at different viewport sizes.

**Checklist:**
- [ ] Mobile layout (375px) - optimized
- [ ] Tablet layout (768px) - intermediate
- [ ] Desktop layout (1920px) - full
- [ ] Touch targets 48px minimum
- [ ] Text readable at all sizes
- [ ] Images scale appropriately

**Playwright Test:**
```javascript
test('block is responsive across breakpoints', async ({ page }) => {
  const breakpoints = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];
  
  for (const bp of breakpoints) {
    await page.setViewportSize(bp);
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot(`hero-${bp.name}`);
  }
});
```

### Dimension 5: Accessibility (WCAG 2.2 AAA)

Tests that block is accessible and keyboard navigable.

**Checklist:**
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces content properly
- [ ] Color contrast meets 7:1 ratio
- [ ] Focus indicators visible
- [ ] Form labels associated
- [ ] ARIA roles correct
- [ ] Motion respects prefers-reduced-motion

**Accessibility Test:**
```javascript
test('block meets WCAG 2.2 AAA requirements', async ({ page }) => {
  const results = await page.evaluate(() => {
    // Check keyboard navigation
    const interactive = document.querySelectorAll('button, a, input');
    return Array.from(interactive).every(el => {
      const style = window.getComputedStyle(el);
      return style.outline !== 'none' || el.classList.contains('focused');
    });
  });
  
  expect(results).toBe(true);
  
  // Check color contrast
  const contrast = await checkColorContrast(page, '.wp-block-hero');
  expect(contrast.ratio).toBeGreaterThanOrEqual(7);
});
```

### Dimension 6: Attributes & Serialization

Tests that block attributes save, load, and serialize correctly.

**Checklist:**
- [ ] All attributes save to post content
- [ ] Attributes persist on page reload
- [ ] Serialization produces valid JSON
- [ ] Deserialization restores attributes
- [ ] Backward compatibility maintained
- [ ] theme.json attributes respected

**Test Template:**
```javascript
test('block attributes serialize and deserialize', () => {
  const attributes = {
    title: 'Welcome',
    subtitle: 'To our site',
    imageId: 123,
    showButton: true
  };
  
  // Serialize
  const serialized = wp.blocks.serialize(block);
  expect(serialized).toContain('data-title="Welcome"');
  
  // Deserialize
  const deserialized = wp.blocks.parse(serialized)[0];
  expect(deserialized.attributes).toEqual(attributes);
});
```

### Dimension 7: theme.json Integration

Tests that block respects and uses theme.json design tokens.

**Checklist:**
- [ ] Uses color palette from theme.json
- [ ] Respects typography settings
- [ ] Spacing aligns with theme scale
- [ ] Border radius uses theme tokens
- [ ] Shadow tokens applied
- [ ] Custom properties registered
- [ ] Light/dark theme variants work

**Validation Test:**
```javascript
test('block uses theme.json design tokens', () => {
  const themeJson = require('./theme.json');
  const blockStyle = getComputedStyle(block);
  
  // Verify color uses palette
  const color = blockStyle.color;
  const inPalette = themeJson.settings.color.palette.some(
    c => c.color === color
  );
  expect(inPalette).toBe(true);
  
  // Verify spacing
  const padding = blockStyle.padding;
  const spacingScale = themeJson.settings.spacing.spacingSizes;
  expect(spacingScale.some(s => s.size === padding)).toBe(true);
});
```

## Test Coverage Matrix

| Aspect | Unit | Integration | E2E | A11y |
|--------|------|-------------|-----|------|
| Registration | ✓ | | | |
| Editor UI | ✓ | ✓ | ✓ | ✓ |
| Frontend | ✓ | ✓ | ✓ | ✓ |
| Responsive | | | ✓ | ✓ |
| Accessibility | ✓ | ✓ | ✓ | ✓ |
| Attributes | ✓ | ✓ | ✓ | |
| theme.json | ✓ | ✓ | ✓ | |

## Test Organization

```
__tests__/
├── blocks/
│   └── hero/
│       ├── hero.registration.test.js
│       ├── hero.editor.test.js
│       ├── hero.frontend.test.js
│       ├── hero.responsive.test.js
│       └── hero.accessibility.test.js
```

## CI/CD Integration

```yaml
# .github/workflows/block-tests.yml
- name: Test block dimensions
  run: |
    npm run test:jest -- __tests__/blocks/
    npm run test:e2e -- --grep="block"
    npm run audit:a11y
    npm run validate:theme-json
```

---

See TESTING.md for overall strategy and JEST.md / PLAYWRIGHT.md for framework specifics.
