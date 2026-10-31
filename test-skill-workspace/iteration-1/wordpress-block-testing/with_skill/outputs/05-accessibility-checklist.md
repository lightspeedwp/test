# WordPress Hero Block - Accessibility Validation Checklist

## WCAG 2.2 Level AAA Compliance Guide

This checklist ensures the hero block meets Web Content Accessibility Guidelines (WCAG) 2.2 at the highest conformance level (AAA). All tests are required before shipping.

---

## Section 1: Perceivable - Visual & Sensory Perception

### 1.1 Color Contrast (Minimum 7:1 ratio for AAA)

**Requirement**: Text and background colors must have sufficient contrast for readability.

#### TEST: Color Contrast Measurement

**Tool**: WebAIM Color Contrast Checker or Axe DevTools

**Steps**:
1. Open browser developer tools
2. Inspect overlay text element
3. Note text color (foreground)
4. Note background color (background or overlay background)
5. Use Color Contrast Checker to calculate ratio
6. Record ratio

**Required Color Combinations**:

| Element | Foreground | Background | Min Ratio | Actual | Status |
|---------|-----------|-----------|-----------|--------|--------|
| Heading | #FFFFFF | #000000 | 7:1 | __ | [ ] Pass [ ] Fail |
| Description | #FFFFFF | #333333 | 7:1 | __ | [ ] Pass [ ] Fail |
| Overlay | #FFFFFF | overlay bg | 7:1 | __ | [ ] Pass [ ] Fail |

**Tools**:
- WebAIM: https://webaim.org/resources/contrastchecker/
- Axe DevTools Browser Extension
- Color Contrast Analyzer (downloadable)
- Firefox Accessibility Inspector

**Pass Criteria**: All text ≥ 7:1 contrast ratio

[ ] Pass [ ] Fail

---

### 1.2 Alternative Text (Alt Attributes)

**Requirement**: Images must have descriptive alt text.

#### TEST: Alt Text Presence and Quality

**Steps**:
1. Publish page with hero block
2. Inspect HTML: `<img alt="..." />`
3. Check alt attribute exists
4. Review alt text content

**Alt Text Checklist**:

| Criterion | Result | Notes |
|-----------|--------|-------|
| Alt attribute present | [ ] Yes [ ] No | Required |
| Length: 15-125 characters | [ ] Yes [ ] No | Too short/long? __ |
| Describes image content | [ ] Yes [ ] No | Describes what, not "image of" |
| Unique (if multiple images) | [ ] Yes [ ] No | Previous alt text: __ |
| No jargon/acronyms | [ ] Yes [ ] No | Readable by all users |
| No redundant with caption | [ ] Yes [ ] No | Complements but doesn't duplicate |

**Example Alt Texts**:
- ✓ "Mountain landscape with snow-capped peaks at sunset"
- ✓ "Team collaborating in modern office environment"
- ✓ "Aerial view of city skyline with highway interchange"
- ✗ "Image" (too vague)
- ✗ "hero-section-image-123.jpg" (filename)
- ✗ "Click here to learn more" (instruction, not description)

**Pass Criteria**: Alt text present, descriptive, 15-125 chars

[ ] Pass [ ] Fail

---

### 1.3 Color Not Sole Indicator

**Requirement**: Information cannot be conveyed by color alone.

#### TEST: Non-Color Information Indicators

**Steps**:
1. Print page or convert to grayscale (Chrome DevTools)
2. Can you still understand all information?
3. Are interactive elements still identifiable?

**Checklist**:

| Element | Color Only? | Alt Indicator | Status |
|---------|-----------|---------------|--------|
| Focus state | [ ] Yes [ ] No | Outline width __ px | [ ] Pass |
| Error messages | [ ] Yes [ ] No | Also has text/icon | [ ] Pass |
| Links in overlay | [ ] Yes [ ] No | Underlined or other indicator | [ ] Pass |
| Call-to-action | [ ] Yes [ ] No | Icon + text or other | [ ] Pass |

**Pass Criteria**: No information conveyed by color alone

[ ] Pass [ ] Fail

---

## Section 2: Operable - Keyboard & Navigation

### 2.1 Keyboard Navigation

**Requirement**: All functionality accessible via keyboard.

#### TEST: Full Keyboard Navigation

**Steps**:
1. Open page with hero block
2. Click on page to focus
3. Press Tab key repeatedly
4. Navigate through all block elements
5. Verify Tab order is logical and intuitive

**Navigation Path**:
- [ ] Can tab to hero block
- [ ] Can tab through text elements
- [ ] Can tab to any links in overlay
- [ ] Tab order follows visual flow (left→right, top→bottom)
- [ ] No elements skipped
- [ ] Tab cycles correctly

**Keyboard Shortcuts**:
- [ ] Tab: Move to next element
- [ ] Shift+Tab: Move to previous element
- [ ] Enter: Activate button/link
- [ ] Escape: Close any modals
- [ ] Arrow keys: Navigate within groups (if applicable)

**Pass Criteria**: All functionality keyboard accessible

[ ] Pass [ ] Fail

---

### 2.2 No Keyboard Trap

**Requirement**: Keyboard focus must not be locked.

#### TEST: Escape Keyboard Trap

**Steps**:
1. Use Tab to navigate to each element
2. Try to Tab away from each element
3. Verify you can always move focus away using keyboard
4. Verify Escape key works to close any overlays

**Checklist**:

| Element | Can Tab Away | Escape Works |
|---------|------------|-------------|
| Hero image | [ ] Yes [ ] No | N/A |
| Text overlay | [ ] Yes [ ] No | N/A |
| Links in text | [ ] Yes [ ] No | N/A |

**Pass Criteria**: No elements trap keyboard focus

[ ] Pass [ ] Fail

---

### 2.3 Focus Indicator Visible

**Requirement**: Focus state must be clearly visible (min 3px outline).

#### TEST: Focus Indicator Measurement

**Steps**:
1. Tab to interactive elements
2. Measure focus outline width (pixel size)
3. Check focus outline color contrast
4. Verify indicator always visible

**Focus Outline Checklist**:

| Criterion | Actual | Required | Status |
|-----------|--------|----------|--------|
| Outline width | __ px | ≥3 px | [ ] Pass [ ] Fail |
| Outline visible | [ ] Yes [ ] No | Yes | [ ] Pass [ ] Fail |
| Outline contrast | __ :1 | ≥3:1 | [ ] Pass [ ] Fail |
| Outline color | __ | Contrasts with bg | [ ] Pass [ ] Fail |
| Not removed with CSS | [ ] Yes [ ] No | Keep | [ ] Pass [ ] Fail |

**CSS Check**: Verify no `outline: none !important` or focus:disabled

**Pass Criteria**: Visible, ≥3px, ≥3:1 contrast

[ ] Pass [ ] Fail

---

### 2.4 Focus Order

**Requirement**: Focus order must follow logical flow.

#### TEST: Tab Order Sequence

**Steps**:
1. Open page
2. Tab through elements slowly
3. Number each focused element in visual order
4. Verify numbers correspond to logical reading order

**Expected Order**:
1. Hero block (or elements within if it's a group)
2. Image (or link if image is linked)
3. Heading text (if clickable)
4. Description text (if clickable)
5. Any CTA buttons in overlay
6. Next block content

**Actual Order**:
1. ____________________
2. ____________________
3. ____________________
4. ____________________
5. ____________________
6. ____________________

**Pass Criteria**: Order matches logical/visual flow

[ ] Pass [ ] Fail

---

## Section 3: Understandable - Clarity & Comprehension

### 3.1 Heading Hierarchy

**Requirement**: Headings must follow logical hierarchy (no skipped levels).

#### TEST: Heading Structure

**Steps**:
1. Inspect page HTML
2. Identify all heading elements (h1-h6)
3. Verify no levels skipped
4. Verify heading hierarchy makes sense

**Heading Audit**:

| Level | Present? | Skip? | Text | Status |
|-------|----------|-------|------|--------|
| H1 | [ ] Yes [ ] No | [ ] Skipped | ___ | __ |
| H2 | [ ] Yes [ ] No | [ ] Skipped | ___ | __ |
| H3 | [ ] Yes [ ] No | [ ] Skipped | ___ | __ |
| H4 | [ ] Yes [ ] No | [ ] Skipped | ___ | __ |

**Validation Rules**:
- [ ] No skipped levels (e.g., H1 → H3)
- [ ] Each heading level has content
- [ ] Hero heading is appropriate level (typically H2 if H1 is page title)
- [ ] Only one H1 per page

**Pass Criteria**: Logical hierarchy, no skipped levels

[ ] Pass [ ] Fail

---

### 3.2 Semantic HTML

**Requirement**: Use semantic HTML elements, not divs.

#### TEST: Semantic Element Usage

**Steps**:
1. Inspect HTML of hero block
2. Verify semantic elements used

**Semantic Elements Required**:

| Element | Required? | Found? | Used Correctly? |
|---------|-----------|--------|-----------------|
| `<figure>` | Yes | [ ] Yes [ ] No | [ ] Yes [ ] No |
| `<figcaption>` | Yes | [ ] Yes [ ] No | [ ] Yes [ ] No |
| `<img>` | Yes | [ ] Yes [ ] No | [ ] Yes [ ] No |
| `<h2>` or `<h3>` | Yes | [ ] Yes [ ] No | [ ] Yes [ ] No |
| `<p>` | Yes | [ ] Yes [ ] No | [ ] Yes [ ] No |
| `<a>` for links | If present | [ ] Yes [ ] No | [ ] Yes [ ] No |

**Anti-patterns to avoid**:
- [ ] No `<div class="heading">` (use `<h2>`)
- [ ] No `<div class="paragraph">` (use `<p>`)
- [ ] No `<span role="img">` (use `<img>`)
- [ ] No `<div onclick="">` (use `<button>` or `<a>`)

**Pass Criteria**: Semantic HTML used throughout

[ ] Pass [ ] Fail

---

### 3.3 Text Readability

**Requirement**: Text must be readable for users with dyslexia and visual impairments.

#### TEST: Readability Standards

**Measurements**:

| Metric | Required | Actual | Status |
|--------|----------|--------|--------|
| Line-height | ≥1.5 | __ | [ ] Pass [ ] Fail |
| Letter-spacing | ≥0.12em | __ | [ ] Pass [ ] Fail |
| Word-spacing | ≥0.16em | __ | [ ] Pass [ ] Fail |
| Line length | 30-80 chars | __ | [ ] Pass [ ] Fail |
| Font size (min) | 16px | __ | [ ] Pass [ ] Fail |

**Steps**:
1. Open browser inspector
2. Inspect text elements
3. Check computed styles (right-click → Inspect Element → Computed)
4. Measure each metric

**Additional Checks**:
- [ ] No justified text (creates word rivers)
- [ ] No all-caps text (except logos/acronyms)
- [ ] No blinking/flashing text
- [ ] Font family readable (sans-serif preferred)

**Pass Criteria**: All readability standards met

[ ] Pass [ ] Fail

---

### 3.4 Consistent Navigation

**Requirement**: Navigation patterns must be consistent.

#### TEST: Navigation Consistency

**If block appears on multiple pages**:
- [ ] Hero block appears in same location on each page
- [ ] Controls/buttons in same positions
- [ ] Same keyboard shortcuts work
- [ ] Focus behavior consistent

**Pass Criteria**: Consistent across site

[ ] Pass [ ] Fail

---

## Section 4: Robust - Technology Compatibility

### 4.1 Screen Reader Compatibility

**Requirement**: Content must work with screen readers (NVDA, JAWS, VoiceOver).

#### TEST: Screen Reader Announcement

**Steps**:
1. Download NVDA (free) or use built-in VoiceOver (Mac)
2. Open page with hero block
3. Navigate with screen reader
4. Verify all content announced correctly

**NVDA Instructions** (Windows):
```bash
1. Download from https://www.nvaccess.org/
2. Install and launch
3. Open page in browser
4. Press Insert+1 to start screen reader mode
5. Tab through elements and listen
```

**VoiceOver Instructions** (Mac):
```bash
1. System Preferences → Accessibility → VoiceOver
2. Enable VoiceOver (Cmd+F5)
3. Open page
4. Use VO+Right/Left arrows to navigate
5. Listen to announcements
```

**Screen Reader Announcements Checklist**:

| Element | Should Announce | Does Announce | Status |
|---------|-----------------|---------------|--------|
| Hero block wrapper | Block type or container | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| Image | Alt text | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| Heading | Text + level ("heading 2") | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| Description | Text content | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| Link (if present) | "Link:" + text | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| CTA button (if present) | "Button:" + label | [ ] Yes [ ] No | [ ] Pass [ ] Fail |

**Pass Criteria**: All content announced correctly

[ ] Pass [ ] Fail

---

### 4.2 Aria Labels & Descriptions

**Requirement**: Aria attributes must be correct (when needed).

#### TEST: Aria Attribute Validation

**Steps**:
1. Inspect HTML for aria-* attributes
2. Verify appropriate use

**Aria Checklist**:

| Attribute | Used? | Correct Usage? | Content |
|-----------|-------|----------------|---------|
| aria-label | [ ] Yes [ ] No | [ ] Yes [ ] No | __ |
| aria-labelledby | [ ] Yes [ ] No | [ ] Yes [ ] No | __ |
| aria-describedby | [ ] Yes [ ] No | [ ] Yes [ ] No | __ |
| aria-hidden | [ ] Yes [ ] No | [ ] Yes [ ] No | __ |
| aria-live | [ ] Yes [ ] No | [ ] Yes [ ] No | __ |

**Best Practices**:
- [ ] Use semantic HTML first (no unnecessary aria)
- [ ] Icon-only buttons have aria-label
- [ ] Hidden decorative elements have aria-hidden="true"
- [ ] No aria="false" (should remove element or use aria-hidden)

**Pass Criteria**: Aria used correctly and minimally

[ ] Pass [ ] Fail

---

### 4.3 Motion & Animation

**Requirement**: Animations must respect prefers-reduced-motion preference.

#### TEST: Prefers-Reduced-Motion

**Steps**:
1. Open Chrome DevTools (F12)
2. Menu → More Tools → Rendering → Emulate CSS media feature prefers-reduced-motion
3. Select "prefers-reduced-motion: reduce"
4. Reload page
5. Verify animations removed or significantly reduced

**Animation Checklist**:

| Animation | Type | Respects Preference? | Status |
|-----------|------|---------------------|--------|
| Image fade-in | CSS | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| Text slide | CSS | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| Hover effects | CSS | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| Transitions | CSS | [ ] Yes [ ] No | [ ] Pass [ ] Fail |

**CSS Check**: 
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

**Pass Criteria**: Animations disabled when user prefers reduced motion

[ ] Pass [ ] Fail

---

### 4.4 Responsive Text Sizing

**Requirement**: Users must be able to zoom page text to 200%.

#### TEST: Text Zoom to 200%

**Steps**:
1. Open page
2. Zoom page to 200% (Ctrl/Cmd + +)
3. Verify text still readable
4. Verify no horizontal scroll
5. Verify layout doesn't break

**Zoom Test Checklist**:

| Aspect | 100% Zoom | 200% Zoom | Status |
|--------|-----------|-----------|--------|
| Text readable | [ ] Yes [ ] No | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| No horizontal scroll | [ ] Yes [ ] No | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| Layout intact | [ ] Yes [ ] No | [ ] Yes [ ] No | [ ] Pass [ ] Fail |
| Images visible | [ ] Yes [ ] No | [ ] Yes [ ] No | [ ] Pass [ ] Fail |

**Pass Criteria**: Readable and functional at 200% zoom

[ ] Pass [ ] Fail

---

## Section 5: Automated Accessibility Audit

### 5.1 Axe DevTools Scan

**Tool**: https://www.deque.com/axe/devtools/

**Steps**:
1. Install Axe DevTools browser extension
2. Open page with hero block
3. Click Axe DevTools icon
4. Run scan
5. Filter for WCAG 2.2 AAA
6. Review findings

**Scan Results**:

| Category | Count | Issues | Status |
|----------|-------|--------|--------|
| Violations | __ | [ ] None [ ] Some | [ ] Pass [ ] Fail |
| Warnings | __ | [ ] None [ ] Some | [ ] Pass |
| Passes | __ | Good checks | ✓ |

**Pass Criteria**: 0 Violations (violations block merge)

[ ] Pass [ ] Fail

---

### 5.2 WAVE Accessibility Checker

**Tool**: https://wave.webaim.org/

**Steps**:
1. Visit WAVE website
2. Enter page URL
3. Run scan
4. Review errors and warnings

**Results**:

| Type | Count | Status |
|------|-------|--------|
| Errors | __ | [ ] 0 [ ] >0 |
| Warnings | __ | [ ] 0 [ ] >0 |
| Contrast | __ | [ ] Pass [ ] Fail |
| Structure | __ | [ ] Pass [ ] Fail |

**Pass Criteria**: 0 Errors related to block

[ ] Pass [ ] Fail

---

### 5.3 Lighthouse Accessibility Audit

**Steps**:
1. Open Chrome DevTools
2. Lighthouse tab
3. Audit for Accessibility
4. Run audit
5. Review score

**Lighthouse Results**:

| Metric | Score | Status |
|--------|-------|--------|
| Accessibility | __/100 | [ ] ≥95 [ ] <95 |
| Color contrast | [ ] Pass [ ] Fail | __ |
| ARIA attributes | [ ] Pass [ ] Fail | __ |
| Focus elements | [ ] Pass [ ] Fail | __ |

**Pass Criteria**: Score ≥95/100

[ ] Pass [ ] Fail

---

## Section 6: Manual Accessibility Review

### 6.1 Desktop Testing Checklist

| Aspect | Result | Notes |
|--------|--------|-------|
| Browser: Chrome | [ ] Pass [ ] Fail | Version __ |
| Browser: Firefox | [ ] Pass [ ] Fail | Version __ |
| Browser: Safari | [ ] Pass [ ] Fail | Version __ |
| Browser: Edge | [ ] Pass [ ] Fail | Version __ |
| Screen reader: NVDA | [ ] Pass [ ] Fail | Windows |
| Screen reader: JAWS | [ ] Pass [ ] Fail | Windows (if available) |
| Voice control: Dragon | [ ] Pass [ ] Fail | If available |

---

### 6.2 Mobile Accessibility Testing

| Device | Orientation | Test | Result |
|--------|-----------|------|--------|
| iPhone 12 | Portrait | VoiceOver enabled | [ ] Pass [ ] Fail |
| iPhone 12 | Landscape | VoiceOver enabled | [ ] Pass [ ] Fail |
| iPad | Portrait | VoiceOver enabled | [ ] Pass [ ] Fail |
| Android | Portrait | TalkBack enabled | [ ] Pass [ ] Fail |
| Android | Landscape | TalkBack enabled | [ ] Pass [ ] Fail |

---

### 6.3 Zoom Testing

| Zoom Level | Desktop | Mobile | Status |
|-----------|---------|--------|--------|
| 100% | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | __ |
| 150% | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | __ |
| 200% | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | __ |
| 300% (mobile) | N/A | [ ] Pass [ ] Fail | __ |

---

## Section 7: Accessibility Sign-Off

### Compliance Declaration

**Block Name**: Hero Section  
**Block Namespace**: namespace/hero-section  
**Test Date**: _____________  
**Tested By**: _____________  

### Summary

- [ ] All WCAG 2.2 AAA requirements met
- [ ] 0 violations in Axe/WAVE/Lighthouse
- [ ] Tested with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Keyboard navigation fully functional
- [ ] Color contrast verified (7:1 minimum)
- [ ] Focus indicators visible and logical
- [ ] Responsive design verified
- [ ] Mobile accessibility verified

### Issues Found and Fixed

| Issue | Severity | Fixed | Date |
|-------|----------|-------|------|
| __ | [ ] Critical [ ] High [ ] Medium | [ ] Yes [ ] No | __ |
| __ | [ ] Critical [ ] High [ ] Medium | [ ] Yes [ ] No | __ |
| __ | [ ] Critical [ ] High [ ] Medium | [ ] Yes [ ] No | __ |

### Approval

- **Accessibility Specialist**: _________________ **Date**: _______
- **QA Lead**: _________________ **Date**: _______
- **Product Manager**: _________________ **Date**: _______

### Next Steps

- [ ] Document accessibility features in block documentation
- [ ] Add accessibility notes to block README
- [ ] Set up automated accessibility testing in CI/CD
- [ ] Schedule quarterly accessibility audit
- [ ] Add to accessibility regression testing suite

---

## Resources

### Tools & Checkers
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse (in Chrome DevTools)](https://developers.google.com/web/tools/lighthouse)
- [Accessibility Insights](https://accessibilityinsights.io/)

### Screen Readers
- [NVDA (free, Windows)](https://www.nvaccess.org/)
- [JAWS (commercial, Windows)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (built-in, macOS/iOS)](https://www.apple.com/accessibility/voiceover/)
- [TalkBack (built-in, Android)](https://support.google.com/accessibility/android/answer/6283677)

### Guidelines & Documentation
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/?currentsetting=level:aaa)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)
- [MDN: Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WordPress Accessibility Guide](https://developer.wordpress.org/plugins/security/securing-output/)
- [A11y Project](https://www.a11yproject.com/)

### Training
- [WebAIM Training Materials](https://webaim.org/articles/)
- [TPGi Accessibility Training](https://www.tpgi.com/education/)
- [Level Access Academy](https://www.levelaccess.com/academy/)

---

**Accessibility Testing Complete**: ______________________  
**Overall Status**: [ ] PASS - Ready to Ship [ ] FAIL - Needs Fixes
