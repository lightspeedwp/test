# Figma Design-to-Code Validation

Validate that code implementation matches Figma design system and components.

## Workflow

1. **Analyze Figma Design System** — Review components, tokens, variants
2. **Extract Design Specifications** — Document tokens, spacing, typography
3. **Compare to Code** — Map design tokens to code implementation
4. **Write Visual Tests** — Create screenshot/visual regression tests
5. **Validate Responsive** — Test breakpoints and responsive variants
6. **Generate Report** — Document findings and recommendations

## Design System Audit

### Component Library
- [ ] All components documented
- [ ] Variants clearly defined
- [ ] State variations shown (default, hover, active, disabled)
- [ ] Props/options documented
- [ ] Usage guidelines provided
- [ ] Accessibility notes included
- [ ] Component code linked
- [ ] Version info current

### Design Tokens
- [ ] Colors documented with values (hex, RGB, HSL)
- [ ] Naming convention consistent (e.g., color-primary-500)
- [ ] Accessibility verified (contrast ratios)
- [ ] Typography scale defined (sizes, line heights, weights)
- [ ] Spacing scale defined (incremental sizes)
- [ ] Border radius tokens defined
- [ ] Shadow tokens documented
- [ ] Animation timing functions specified
- [ ] Tokens organized by category
- [ ] Export formats available (JSON, CSS, JS)

### Theme Variants
- [ ] Light mode colors specified
- [ ] Dark mode colors specified
- [ ] High contrast mode colors specified
- [ ] Reduced motion variants shown
- [ ] All variants have token values
- [ ] Color contrast verified for each theme

## Design-to-Code Mapping

### Color Tokens
```
Design:              Code:
color-primary-500    --color-primary-500 / $color-primary-500 / primaryColor
color-success-400    --color-success-400 / $color-success-400 / successColor
```

### Typography Tokens
```
Design:              Code:
heading-h1          font-size: 3.5rem / font-size-2xl / fontSize.h1
heading-h2          font-size: 2.5rem / font-size-xl / fontSize.h2
body-base           font-size: 1rem / font-size-base / fontSize.body
```

### Spacing Tokens
```
Design:              Code:
spacing-xs-4        --spacing-xs / $spacing-xs / spacing.xs (4px)
spacing-sm-8        --spacing-sm / $spacing-sm / spacing.sm (8px)
spacing-md-16       --spacing-md / $spacing-md / spacing.md (16px)
spacing-lg-24       --spacing-lg / $spacing-lg / spacing.lg (24px)
```

## Visual Regression Testing

### Screenshot Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('Design System Validation', () => {
  test('button component matches design', async ({ page }) => {
    await page.goto('/components/button');
    
    // Capture screenshot
    await expect(page.locator('[data-testid="button-primary"]'))
      .toHaveScreenshot('button-primary.png');
    
    // Compare to design
    // This creates a baseline and compares future renders
  });

  test('color palette matches design tokens', async ({ page }) => {
    await page.goto('/design-system/colors');
    
    // Get computed colors
    const primary = await page.locator('.color-primary-500')
      .evaluate((el: any) => {
        return window.getComputedStyle(el).backgroundColor;
      });
    
    // Verify hex value matches Figma
    expect(primary).toBe('rgb(59, 130, 246)'); // #3b82f6
  });

  test('typography scale matches design', async ({ page }) => {
    await page.goto('/design-system/typography');
    
    const h1 = await page.locator('h1')
      .evaluate((el: any) => {
        const style = window.getComputedStyle(el);
        return {
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          fontWeight: style.fontWeight,
        };
      });
    
    expect(h1.fontSize).toBe('56px'); // 3.5rem
    expect(h1.lineHeight).toBe('64px'); // 1.14 * 56px
    expect(h1.fontWeight).toBe('700');
  });

  test('spacing consistency', async ({ page }) => {
    await page.goto('/design-system/spacing');
    
    const element = await page.locator('[data-spacing="md"]');
    const computed = await element.evaluate((el: any) => {
      const style = window.getComputedStyle(el);
      return {
        padding: style.padding,
        margin: style.margin,
      };
    });
    
    expect(computed.padding).toBe('16px');
  });

  test('responsive breakpoints match design', async ({ page }) => {
    // Test mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // Verify mobile layout
    const layout = await page.locator('[data-breakpoint]')
      .evaluate((el: any) => el.dataset.breakpoint);
    expect(layout).toBe('mobile');
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletLayout = await page.locator('[data-breakpoint]')
      .evaluate((el: any) => el.dataset.breakpoint);
    expect(tabletLayout).toBe('tablet');
    
    // Test desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopLayout = await page.locator('[data-breakpoint]')
      .evaluate((el: any) => el.dataset.breakpoint);
    expect(desktopLayout).toBe('desktop');
  });

  test('dark mode tokens applied correctly', async ({ page }) => {
    // Enable dark mode
    await page.locator('html').evaluate((el: any) => {
      el.classList.add('dark');
    });
    
    const bgColor = await page.locator('body')
      .evaluate((el: any) => window.getComputedStyle(el).backgroundColor);
    
    expect(bgColor).toBe('rgb(17, 24, 39)'); // dark bg color
  });

  test('component states match design', async ({ page }) => {
    await page.goto('/components/button');
    
    // Default state
    const button = page.locator('button.primary');
    await expect(button).toHaveScreenshot('button-default.png');
    
    // Hover state
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png');
    
    // Active state
    await button.focus();
    await expect(button).toHaveScreenshot('button-active.png');
    
    // Disabled state
    await page.locator('button[disabled]');
    await expect(button).toHaveScreenshot('button-disabled.png');
  });
});
```

## Checklist

- [ ] Design tokens extracted to code
- [ ] Color values match design (hex/RGB verified)
- [ ] Typography sizes and weights match
- [ ] Spacing tokens applied consistently
- [ ] Border radius tokens applied
- [ ] Shadow tokens applied
- [ ] Components match design variants
- [ ] States (hover, active, disabled) match design
- [ ] Responsive breakpoints match design
- [ ] Theme variants work (light/dark)
- [ ] Color contrast meets WCAG AAA
- [ ] Components are keyboard accessible
- [ ] Components work with screen readers
- [ ] Performance acceptable (no layout shifts)
- [ ] Visual regression tests passing

## Audit Report Template

```markdown
# Design-to-Code Validation Report

## Color Tokens
| Token | Design Value | Code Value | Status |
|-------|--------------|-----------|--------|
| primary-500 | #3b82f6 | #3b82f6 | ✓ Pass |
| success-400 | #10b981 | #10b981 | ✓ Pass |

## Typography
| Token | Design | Code | Status |
|-------|--------|------|--------|
| h1 | 56px / 700 | 56px / 700 | ✓ Pass |
| body | 16px / 400 | 16px / 400 | ✓ Pass |

## Spacing
| Token | Design | Code | Status |
|-------|--------|------|--------|
| md | 16px | 16px | ✓ Pass |
| lg | 24px | 24px | ✓ Pass |

## Component Coverage
- Button: ✓ All variants
- Input: ✓ All states
- Card: ✓ All layouts
- ...

## Responsive Design
- Mobile (375px): ✓ Pass
- Tablet (768px): ✓ Pass
- Desktop (1920px): ✓ Pass

## Accessibility
- WCAG AAA Contrast: ✓ Pass
- Keyboard Navigation: ✓ Pass
- Screen Reader: ✓ Pass

## Recommendations
1. Update dark mode primary color (currently #2563eb, design spec #1e40af)
2. Add high contrast theme variants
3. Document animation timing functions

## Summary
- Total Tokens: 120
- Matching: 118 (98.3%)
- Mismatches: 2
- Status: READY WITH MINOR UPDATES
```

## Tools & Resources

- [Figma to Code Plugins](https://www.figma.com/community)
- [Figma Design Plugin](https://www.figma.com/plugin/731260060173340063/Design-Tokens)
- [Storybook Figma Plugin](https://www.figma.com/community/plugin/1018017994040457519/Storybook)
- [Playwright Visual Testing](https://playwright.dev/docs/test-snapshots)
- [Chromatic (Visual Regression)](https://www.chromatic.com/)
