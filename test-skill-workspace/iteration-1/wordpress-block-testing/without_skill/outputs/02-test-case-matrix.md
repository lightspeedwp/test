# Test Case Matrix: WordPress Hero Block

## Overview

This document provides a structured matrix of test cases organized by functional area, covering registration, UI, rendering, responsiveness, accessibility, and integration.

---

## TC1: Block Registration Tests

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC1.1 | Block loads without errors | 1. Activate plugin 2. Check admin console 3. Check debug.log | Block registered, no PHP errors | P0 | |
| TC1.2 | Block appears in inserter | 1. Open post editor 2. Click + button 3. Search block name | Block found in search results | P0 | |
| TC1.3 | Block.json validation | 1. Parse block.json 2. Validate schema | Schema valid, no missing required fields | P0 | |
| TC1.4 | Block attributes initialize | 1. Insert block 2. Log attributes to console | All attributes present with default values | P1 | |
| TC1.5 | Render callback exists | 1. Call block render function 2. Verify output | Function returns valid HTML string | P0 | |
| TC1.6 | Script handles load | 1. Open page source 2. Search for script handles | Scripts enqueued with correct versions | P1 | |

---

## TC2: Editor UI Tests

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC2.1 | Block inserts with example | 1. Click block in inserter 2. Observe | Block appears with default example content | P0 | |
| TC2.2 | Image upload works | 1. Click upload button 2. Select image 3. Confirm | Image shows in preview and inspector | P0 | |
| TC2.3 | Image alt text editable | 1. Upload image 2. Click alt text field 3. Type text | Alt text saves to block attributes | P1 | |
| TC2.4 | Text overlay editable | 1. Click text area 2. Type content | Text edits and displays in real-time | P0 | |
| TC2.5 | Color picker works | 1. Click color control 2. Select color 3. Confirm | Color applies to overlay background | P1 | |
| TC2.6 | Font size changes | 1. Adjust font size slider 2. Observe | Font size updates in editor canvas | P1 | |
| TC2.7 | Opacity slider works | 1. Drag opacity slider 2. Set to 50% | Overlay opacity changes visibly | P1 | |
| TC2.8 | Alignment buttons functional | 1. Click left/center/right align 2. Verify | Text alignment changes in canvas | P1 | |
| TC2.9 | Inspector updates reflect | 1. Change multiple settings 2. Watch canvas | All changes appear instantly in preview | P2 | |
| TC2.10 | Block deletion works | 1. Select block 2. Press Delete 3. Confirm | Block removed, undo restores | P1 | |

---

## TC3: Frontend Rendering Tests

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC3.1 | Block renders on frontend | 1. Save post 2. View on frontend 3. Check source | Block HTML present, valid markup | P0 | |
| TC3.2 | Image displays correctly | 1. Check frontend 2. Verify image loads | Image visible, correct dimensions | P0 | |
| TC3.3 | Text overlay displays | 1. Check frontend 2. Verify text visible | Overlay text readable, positioned | P0 | |
| TC3.4 | Colors applied correctly | 1. Set colors in editor 2. Check frontend | Colors match inspector settings | P1 | |
| TC3.5 | Alt text present in HTML | 1. View page source 2. Search for alt | Alt text in img tag | P0 | |
| TC3.6 | No console errors | 1. Open DevTools Console 2. View frontend | No errors or warnings | P1 | |
| TC3.7 | Overlay opacity applied | 1. Set opacity to 50% 2. Check frontend | Overlay semi-transparent as set | P1 | |
| TC3.8 | Block margin/padding correct | 1. Inspect CSS 2. Check spacing | Spacing matches theme.json values | P2 | |

---

## TC4: Responsive Tests

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC4.1 | Mobile: 375px layout | 1. Set viewport 375x667 2. View block 3. Check layout | Block stacks, no horizontal scroll | P0 | |
| TC4.2 | Mobile: Image scales | 1. Set viewport 375x667 2. Check image | Image full width, height proportional | P0 | |
| TC4.3 | Mobile: Text readable | 1. Set viewport 375x667 2. Check font size | Font >= 16px, readable without zoom | P0 | |
| TC4.4 | Mobile: Touch targets | 1. Identify buttons/interactive elements 2. Measure | Minimum 48x48px | P1 | |
| TC4.5 | Tablet: 768px layout | 1. Set viewport 768x1024 2. View block | Layout intermediate, image scales | P1 | |
| TC4.6 | Desktop: 1024px layout | 1. Set viewport 1024x768+ 2. View block | Full layout displays correctly | P0 | |
| TC4.7 | Portrait/landscape switch | 1. Rotate device simulator 2. Check layout | Layout adapts to orientation | P1 | |
| TC4.8 | Image aspect ratio maintained | 1. View on different viewports 2. Measure | Aspect ratio consistent | P1 | |

---

## TC5: Accessibility - Semantic HTML

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC5.1 | Alt text present | 1. Inspect img element 2. Check alt attribute | Alt attribute exists and meaningful | P0 | |
| TC5.2 | Alt text quality | 1. Read alt text 2. Evaluate description | Describes image content (not "image of...") | P0 | |
| TC5.3 | Alt text length | 1. Measure alt text characters | Length 1-125 characters | P1 | |
| TC5.4 | Heading hierarchy | 1. Check heading tags in text | Proper h1-h6 nesting, no skips | P1 | |
| TC5.5 | Figure element if image caption | 1. View block source | Image in `<figure>` with `<figcaption>` if needed | P2 | |
| TC5.6 | Semantic text markup | 1. Inspect text elements 2. Check HTML | No div soup, proper p/span/strong usage | P1 | |

---

## TC6: Accessibility - Color & Contrast

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC6.1 | Text contrast ratio >= 7:1 | 1. Use contrast checker tool 2. Measure foreground/background | WCAG AAA pass (7:1 minimum) | P0 | |
| TC6.2 | Focus indicator visible | 1. Tab to element 2. Check focus ring | Focus outline >= 2px, color visible | P0 | |
| TC6.3 | Focus indicator contrast >= 3:1 | 1. Measure focus ring color contrast | 3:1 minimum against background | P0 | |
| TC6.4 | No color-only conveyance | 1. Disable colors 2. Test conveyance | Information not lost without color | P1 | |
| TC6.5 | Overlay ensures readable text | 1. Check text over image 2. Measure contrast | Text readable regardless of image | P0 | |

---

## TC7: Accessibility - Text & Typography

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC7.1 | Font size >= 16px | 1. Inspect computed font-size | Min 16px (or 12px with line-height 1.5) | P0 | |
| TC7.2 | Line height >= 1.5 | 1. Inspect computed line-height | 1.5 or greater | P0 | |
| TC7.3 | Letter spacing >= 0.12em | 1. Inspect letter-spacing | 0.12em or greater | P1 | |
| TC7.4 | Word spacing >= 0.16em | 1. Inspect word-spacing | 0.16em or greater | P1 | |
| TC7.5 | Line length <= 80 characters | 1. Count characters per line | 80 chars max (ideal 60) | P1 | |
| TC7.6 | Text not justified | 1. Inspect text-align property | text-align NOT "justify" | P1 | |

---

## TC8: Accessibility - Keyboard & Focus

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC8.1 | Tab order logical | 1. Tab through page 2. Note order | Order flows left-to-right, top-to-bottom | P0 | |
| TC8.2 | No keyboard trap | 1. Tab through all elements 2. Escape with keyboard | Can tab past all elements, none trap focus | P0 | |
| TC8.3 | All controls keyboard accessible | 1. Use keyboard only 2. Activate all controls | Every interactive element keyboard reachable | P0 | |
| TC8.4 | Focus visible on all controls | 1. Tab through controls 2. Check focus ring | Visible focus indicator on every control | P0 | |
| TC8.5 | Enter activates buttons | 1. Focus button 2. Press Enter | Button activates, expected action occurs | P1 | |
| TC8.6 | Space activates buttons/checkboxes | 1. Focus element 2. Press Space | Element activates appropriately | P1 | |

---

## TC9: Accessibility - ARIA & Labels

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC9.1 | Buttons have labels | 1. Inspect button elements 2. Check text/aria-label | Every button has accessible name | P0 | |
| TC9.2 | Form inputs have labels | 1. Check input elements 2. Find associated label | label tag or aria-label present | P1 | |
| TC9.3 | aria-label clear | 1. Read aria-labels 2. Evaluate text | Label describes purpose clearly | P1 | |
| TC9.4 | Decorative images have alt="" | 1. Find decorative images 2. Check alt | alt="" (empty string) for purely decorative | P1 | |
| TC9.5 | ARIA roles semantic | 1. Check role attributes 2. Validate against spec | Roles match ARIA spec, no misuse | P2 | |

---

## TC10: Accessibility - Motion & Animation

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC10.1 | No auto-loop animations > 5s | 1. Check CSS animations 2. Check JS animations | Auto-play duration <= 5 seconds | P1 | |
| TC10.2 | Animations respect prefers-reduced-motion | 1. Enable reduced motion 2. View block | Animations disabled/simplified | P0 | |
| TC10.3 | No flashing > 3Hz | 1. Check for flickering elements 2. Count flashes | Flash frequency < 3 per second | P0 | |
| TC10.4 | Parallax effects optional | 1. Disable JavaScript 2. View block | Block still functional without parallax | P2 | |

---

## TC11: Theme.json Integration

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC11.1 | Block registered in theme.json | 1. Open theme.json 2. Search block slug | Block in blocks.*.*.blockname path | P1 | |
| TC11.2 | Inherits theme colors | 1. Change theme color palette 2. View block | Block uses theme colors | P1 | |
| TC11.3 | Inherits theme typography | 1. Change theme fonts 2. View block | Block uses theme fonts | P1 | |
| TC11.4 | Custom color palette limited | 1. Check block color controls 2. Verify | Colors limited to theme palette | P2 | |
| TC11.5 | CSS custom properties work | 1. Inspect computed styles 2. Check --wp-* vars | Colors resolve from CSS variables | P2 | |
| TC11.6 | Responsive breakpoints respected | 1. Change theme breakpoints 2. Test block | Block adapts to new breakpoints | P2 | |

---

## TC12: Data Persistence & Serialization

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC12.1 | Attributes save on publish | 1. Set attributes 2. Publish post | Attributes in post_content | P0 | |
| TC12.2 | Attributes persist on reload | 1. Set attributes 2. Reload page | Same attributes still present | P0 | |
| TC12.3 | Undo/Redo works | 1. Change attribute 2. Undo 3. Redo | Previous/future states restored | P1 | |
| TC12.4 | REST API returns attributes | 1. Call /wp/v2/posts/ID endpoint 2. Parse JSON | Block attributes in response | P1 | |
| TC12.5 | No data loss on block update | 1. Update plugin 2. View old post | Attributes still present, no loss | P1 | |

---

## TC13: Browser Compatibility

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC13.1 | Chrome latest | 1. Test in Chrome | Block works, no errors | P0 | |
| TC13.2 | Firefox latest | 1. Test in Firefox | Block works, no errors | P0 | |
| TC13.3 | Safari latest | 1. Test in Safari | Block works, no errors | P0 | |
| TC13.4 | Edge latest | 1. Test in Edge | Block works, no errors | P0 | |
| TC13.5 | Mobile Chrome | 1. Test on Android Chrome | Block responsive, works | P1 | |
| TC13.6 | Mobile Safari | 1. Test on iOS Safari | Block responsive, works | P1 | |

---

## TC14: Performance

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC14.1 | Block JS size < 50KB | 1. Check minified JS size | Gzipped <= 50KB | P2 | |
| TC14.2 | Block CSS size < 20KB | 1. Check minified CSS size | Gzipped <= 20KB | P2 | |
| TC14.3 | Image lazy loading | 1. Check img tag 2. Look for loading="lazy" | Lazy loading enabled | P2 | |
| TC14.4 | CLS < 0.1 | 1. Run Lighthouse 2. Check CLS metric | Layout shift minimal | P1 | |
| TC14.5 | Paint time < 100ms | 1. Use DevTools Performance 2. Measure | Paint completes quickly | P2 | |

---

## TC15: Security

| ID | Test Case | Steps | Expected Result | Priority | Status |
|---|-----------|-------|-----------------|----------|--------|
| TC15.1 | User input sanitized | 1. Inject malicious input 2. Check | Input rejected or sanitized | P0 | |
| TC15.2 | Output escaped | 1. View HTML source 2. Check escaping | HTML entities escaped | P0 | |
| TC15.3 | No eval() usage | 1. Search code for eval | No eval, Function constructor, etc. | P0 | |
| TC15.4 | URLs validated | 1. Test link attribute 2. Inject javascript: URI | XSS attempt blocked | P0 | |
| TC15.5 | Nonce verification | 1. Check REST endpoints 2. Inspect | Nonces present where needed | P1 | |

---

## Test Execution Notes

- **Pass Criteria**: All P0 tests must pass before production
- **Release Criteria**: P0 + P1 tests pass
- **Nice-to-Have**: P2 tests should pass but not blockers
- **Regression**: Full matrix run before each release
- **Exploratory**: Use checklist (01-block-testing-checklist.md) for exploratory testing

---

## Sign-Off

**Total Tests**: 115  
**Tests Planned**: ___  
**Tests Passed**: ___  
**Tests Failed**: ___  
**Pass Rate**: ___  

**Tester**: ________________  
**Date**: ________________  
**Approved**: ________________
