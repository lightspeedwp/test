# Accessibility Audit (WCAG 2.2 AAA)

Comprehensive accessibility compliance testing to WCAG 2.2 Level AAA standards.

## Standard: WCAG 2.2 AAA (Level AAA)

**Decision**: D3 Authority (Ash Shaw, 2026-10-25)  
**Requirement**: All LightSpeedWP projects must meet WCAG 2.2 Level AAA

## Audit Scope

### 1. Keyboard Navigation
- [ ] All functionality available via keyboard
- [ ] Logical tab order (left→right, top→bottom)
- [ ] No keyboard traps
- [ ] Skip links present (jump to main content, navigation)
- [ ] Focus always visible
- [ ] Focus indicator: ≥3px, ≥3:1 contrast
- [ ] Keyboard shortcuts don't conflict with browser/OS
- [ ] Custom keyboard shortcuts documented

### 2. Screen Reader Compatibility
- [ ] Page structure uses semantic HTML (h1-h6, nav, main, section)
- [ ] Headings properly nested (no h1→h3 jumps)
- [ ] List items use semantic lists
- [ ] Links have descriptive text (not "click here")
- [ ] Buttons have accessible names
- [ ] Form fields have associated labels
- [ ] Error messages linked to fields
- [ ] Dynamic content announced (aria-live, aria-atomic)
- [ ] Tables have headers and scope
- [ ] Alt text on images (meaningful, not "image of...")
- [ ] Icons have aria-label if not decorative

### 3. Color & Contrast (AAA = 7:1)
- [ ] Normal text: ≥7:1 contrast ratio
- [ ] Large text (≥18pt or 14pt bold): ≥4.5:1 contrast ratio
- [ ] UI components: ≥3:1 contrast ratio
- [ ] Graphical objects: ≥3:1 contrast ratio
- [ ] No information conveyed by color alone
- [ ] Color is supplement to other indicators

### 4. Form Accessibility
- [ ] All inputs have associated labels
- [ ] Labels positioned appropriately
- [ ] Error messages identified and linked
- [ ] Error messages suggest corrections
- [ ] Form instructions clear and discoverable
- [ ] Required fields marked (not by color alone)
- [ ] Form validation helpful (not just "error")
- [ ] Autocomplete attributes present

### 5. Focus Management
- [ ] Focus visible at all times
- [ ] Focus moves logically after action
- [ ] Focus returned appropriately (dialog close, etc.)
- [ ] No focus on hidden elements
- [ ] Focus trap breaks don't leave user stuck
- [ ] Focus indicator: ≥2px width, ≥3:1 contrast

### 6. Content Structure
- [ ] Meaningful page title (unique per page)
- [ ] Proper heading hierarchy
- [ ] Lists marked as lists (not div+p)
- [ ] Blockquotes marked correctly
- [ ] Code blocks marked correctly
- [ ] Emphasis (b/strong, i/em) marked correctly
- [ ] Abbreviations explained on first use

### 7. Responsive & Zoom
- [ ] Text scalable to 200% without loss
- [ ] Content reflows at different scales
- [ ] Touch targets ≥44×44 CSS pixels (AAA requirement)
- [ ] Zoom functionality preserved
- [ ] Text-to-speech works correctly
- [ ] Mobile keyboard doesn't obscure content

### 8. Motion & Animation
- [ ] Auto-playing content can be paused
- [ ] Animations don't flash more than 3x/second (seizure risk)
- [ ] Parallax effects don't impair readability
- [ ] Motion can be disabled (prefers-reduced-motion)
- [ ] Important info not conveyed by motion alone

### 9. Video & Audio
- [ ] Video has captions (all dialog and sounds)
- [ ] Video has audio description (important visual info)
- [ ] Audio transcript provided
- [ ] Controls keyboard accessible
- [ ] Auto-play disabled (or muted)

## Audit Tools

### Automated Testing
```bash
# Playwright Accessibility Testing
npm run test:e2e -- --project=accessibility

# Lighthouse Audit
npx lighthouse https://example.com --view --emulated-form-factor=mobile

# axe DevTools Browser Extension
# Manual check using browser extension
```

### Manual Testing

**Keyboard Testing**:
1. Disconnect mouse
2. Tab through entire page
3. Verify tab order is logical
4. Test all interactive elements
5. Verify focus always visible

**Screen Reader Testing**:
- Windows: NVDA (free)
- Windows: JAWS (commercial)
- macOS: VoiceOver (built-in)
- iOS: VoiceOver (built-in)
- Android: TalkBack (built-in)

**Color Contrast**:
- Use Contrast Checker tool
- Check normal and large text separately
- Check UI components

## Playwright Test Example

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility Audit', () => {
  test('page structure is semantic', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Check main landmark
    await expect(page.locator('main, [role="main"]')).toBeVisible();
    
    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const levels = await Promise.all(
      headings.map(h => h.evaluate((el: any) => parseInt(el.tagName[1])))
    );
    
    // Verify no level jumps (e.g., h1 → h3)
    for (let i = 1; i < levels.length; i++) {
      const diff = Math.abs(levels[i] - levels[i - 1]);
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focused);
    
    // Verify focus visible
    const focusStyle = await page.locator(':focus').evaluate((el: any) => {
      return window.getComputedStyle(el).outline;
    });
    expect(focusStyle).not.toBe('none');
  });

  test('color contrast meets WCAG AAA', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Inject axe
    await injectAxe(page);
    
    // Check contrast
    await checkA11y(page, null, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  test('form fields are properly labeled', async ({ page }) => {
    await page.goto('https://example.com/form');
    
    // Find all inputs
    const inputs = await page.locator('input').all();
    
    for (const input of inputs) {
      const inputId = await input.getAttribute('id');
      const type = await input.getAttribute('type');
      
      // Skip type="hidden"
      if (type === 'hidden') continue;
      
      // Check for associated label
      if (inputId) {
        const label = await page.locator(`label[for="${inputId}"]`);
        await expect(label).toBeVisible();
      } else {
        // Check for aria-label
        const ariaLabel = await input.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
    }
  });

  test('dynamic content is announced', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Find live regions
    const liveRegions = await page.locator('[aria-live]').all();
    
    for (const region of liveRegions) {
      const ariaLive = await region.getAttribute('aria-live');
      const ariaAtomic = await region.getAttribute('aria-atomic');
      
      expect(['polite', 'assertive']).toContain(ariaLive);
      // aria-atomic should be true for atomic updates
    }
  });
});
```

## Audit Report Template

```markdown
# Accessibility Audit Report

## Executive Summary
- Overall WCAG 2.2 AAA Compliance: [X]%
- Critical Issues: [N]
- Major Issues: [N]
- Minor Issues: [N]

## Detailed Findings

### Critical Issues (Block Access)
- Issue 1
  - Location: [Page/Element]
  - WCAG Criterion: [X.X.X]
  - Impact: [Description]
  - Recommendation: [Fix]

### Major Issues (Significant Barrier)
- Issue 2
  - Location: [Page/Element]
  - WCAG Criterion: [X.X.X]
  - Impact: [Description]
  - Recommendation: [Fix]

### Minor Issues
- Issue 3
  - Location: [Page/Element]
  - WCAG Criterion: [X.X.X]
  - Recommendation: [Fix]

## Test Results
- Keyboard Navigation: [Pass/Fail]
- Screen Reader: [Pass/Fail]
- Color Contrast: [Pass/Fail]
- Form Accessibility: [Pass/Fail]
- Focus Management: [Pass/Fail]
- Content Structure: [Pass/Fail]

## Remediation Roadmap
1. [Critical Issue 1] - Fix by [Date]
2. [Critical Issue 2] - Fix by [Date]
3. [Major Issue 1] - Fix by [Date]

## Next Steps
- Schedule follow-up audit after fixes
- Implement automated accessibility testing
- Train team on accessibility best practices
```

## Checklist

- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Forms properly labeled
- [ ] Focus management validated
- [ ] Content structure semantic
- [ ] Responsive design validated
- [ ] Motion/animation safe
- [ ] Video/audio captioned
- [ ] ARIA roles appropriate
- [ ] Error messages helpful
- [ ] Touch targets sufficient (44×44 min)
- [ ] Zoom works to 200%
- [ ] prefers-reduced-motion respected

## Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WCAG 2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
