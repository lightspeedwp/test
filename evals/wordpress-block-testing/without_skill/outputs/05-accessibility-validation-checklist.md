# WCAG 2.2 AAA Accessibility Validation Checklist - Hero Block

## Document Info

**Block Name:** Hero Section with Image and Text Overlay  
**WCAG Target:** WCAG 2.2 Level AAA  
**Conformance Target:** 100% Pass Rate  
**Review Date:** ________________  
**Reviewer:** ________________  
**Tools Used:** axe DevTools, WAVE, Lighthouse, Manual Testing

---

## Part 1: Perceivable (WCAG 1.x)

### 1.1 Text Alternatives

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| 1.1.1 | Images must have alt text describing content | Image has alt attribute | [ ] | Alt text describes image purpose/content |
| 1.1.1 | Alt text should not start with "image of..." | Alt text avoids redundant phrasing | [ ] | Use: "Product showcase" not "image of product" |
| 1.1.1 | Decorative images must have empty alt="" | Decorative images alt="" | [ ] | Logo/separator images marked alt="" |
| 1.1.1 | Alt text length optimal 1-125 characters | Alt text character count | [ ] | Count: _____ characters |
| 1.1.1 | Complex images have long description | Text description available if needed | [ ] | Link to description provided |
| 1.1.1 | SVG icons have title and description | SVG has `<title>` and `<desc>` | [ ] | Both elements present |

**Summary Pass:** [ ] All 1.1.1 requirements met

### 1.2 Time-based Media

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| 1.2.1 | If video exists, provide captions/transcript | Captions present or transcript link | [ ] | N/A (no video in hero) |
| 1.2.2 | If audio exists, provide transcript | Transcript available if audio | [ ] | N/A (no audio in hero) |

**Summary Pass:** [ ] N/A (no media-based content)

### 1.3 Adaptable

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| 1.3.1 | Information not conveyed by layout alone | Structure independent of presentation | [ ] | Reflow to single column readable |
| 1.3.1 | Heading hierarchy is proper | h1-h6 nesting has no skips | [ ] | No h1 -> h3 jumps |
| 1.3.1 | Lists marked with `<ul>/<ol>/<li>` | List markup used if applicable | [ ] | N/A if no lists in block |
| 1.3.2 | Text direction (dir attribute if rtl) | RTL languages supported | [ ] | Content flows right-to-left if enabled |
| 1.3.4 | Avoid orientation lock | Content works portrait and landscape | [ ] | Tested both orientations |
| 1.3.5 | Identify purpose of fields (if forms) | Form labels and purpose clear | [ ] | N/A (hero is not a form) |
| 1.3.6 | Blocks of repeated content (tables) have headers | Table headers identified | [ ] | N/A (no tables) |

**Summary Pass:** [ ] All 1.3 requirements met

### 1.4 Distinguishable

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| 1.4.1 | Color not sole means of conveying info | Information visible without color | [ ] | Contrast checker: minimum 7:1 AAA |
| **1.4.3** | **Text contrast >= 7:1 (AAA)** | **Contrast checked** | [ ] | **Use WebAIM Contrast Checker** |
| **1.4.3** | **Large text contrast >= 4.5:1 (AAA)** | **Large text checked** | [ ] | **18pt+ or bold 14pt+** |
| 1.4.3 | Graphical elements contrast >= 3:1 | Graphics/icons meet 3:1 | [ ] | Borders and icons tested |
| **1.4.11** | **Focus indicator contrast >= 3:1** | **Focus ring visible** | [ ] | **Outline color contrast checked** |
| 1.4.5 | Images of text should use real text | No screenshots of text | [ ] | Text overlay uses actual text |
| 1.4.9 | Large text images OK if necessary | Text rendering scalable | [ ] | Text not in image files |
| 1.4.10 | Text can reflow to single column | Responsive at 320px | [ ] | Tested at mobile width |
| 1.4.12 | Line height >= 1.5 and letter-spacing >= 0.12em | Spacing adequate for readability | [ ] | Measured: line-height _____ letter-spacing _____ |
| 1.4.13 | Hover/focus content doesn't hide input | Tooltips/popups don't obscure | [ ] | No focus traps, content movable |

**Summary Pass:** [ ] All 1.4 requirements met

---

## Part 2: Operable (WCAG 2.x)

### 2.1 Keyboard Accessible

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| **2.1.1** | **All functionality keyboard accessible** | **Tab through all controls** | [ ] | **Use Tab/Shift+Tab only** |
| **2.1.2** | **No keyboard trap** | **Can Tab past all elements** | [ ] | **Escape key exits modals** |
| 2.1.3 | Keyboard shortcuts don't conflict with standard keys | Custom shortcuts don't override system keys | [ ] | Ctrl+S, etc. not captured |

**Test Steps:**
- [ ] Tab through entire block
- [ ] Verify focus order is logical
- [ ] Check Tab reaches all interactive elements
- [ ] Verify Escape exits any overlays
- [ ] Confirm no focus traps (elements you can't Tab out of)

**Summary Pass:** [ ] All 2.1 requirements met

### 2.2 Enough Time

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| 2.2.1 | No time limits (or user can extend) | Block doesn't auto-dismiss | [ ] | No timer on overlay |
| 2.2.2 | No animations that auto-loop > 5 seconds | Animations limited in duration | [ ] | Duration: _____ seconds |
| 2.2.3 | No blinking/flashing > 3 Hz | Flashing frequency < 3/second | [ ] | Checked for seizure-triggering patterns |

**Summary Pass:** [ ] All 2.2 requirements met

### 2.3 Seizure Prevention

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| **2.3.1** | **No flashing 3-39 Hz** | **Animation frequency checked** | [ ] | **Most dangerous frequency range** |
| 2.3.3 | No animation from interactions unless user enabled | Auto-animations respect prefers-reduced-motion | [ ] | Tested with reduced motion enabled |

**Test Steps:**
- [ ] Check CSS animations in DevTools
- [ ] Check for any @keyframe flash patterns
- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Verify animations disabled or significantly reduced

**Summary Pass:** [ ] All 2.3 requirements met

### 2.4 Navigable

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| **2.4.3** | **Focus order is logical** | **Tab order left-to-right, top-to-bottom** | [ ] | **Use Tab to trace path** |
| **2.4.7** | **Focus indicator always visible** | **Outline >= 2px, visible on all elements** | [ ] | **Cannot be outline: none** |
| 2.4.8 | Purpose of link/button is clear from text alone | Link text self-explanatory | [ ] | Not "click here", but "Learn more about X" |
| 2.4.9 | Link purpose clear from context | Links understandable in context | [ ] | Avoid vague "more info" links |

**Focus Indicator Checklist:**
- [ ] Outline visible without browser extensions
- [ ] Outline color contrasts with background >= 3:1
- [ ] Outline width >= 2px
- [ ] Outline not styled away (no `outline: none`)
- [ ] All interactive elements show focus indicator

**Summary Pass:** [ ] All 2.4 requirements met

### 2.5 Input Modalities

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| 2.5.1 | Gestures (swipe, pinch) have key alternatives | All gestures have keyboard equivalents | [ ] | N/A if no gestures used |
| 2.5.2 | Pointer can trigger on release (not just down) | Buttons activate on click, not press | [ ] | Standard browser behavior |
| 2.5.3 | Labels visible for all inputs | Input labels always visible | [ ] | Not hidden placeholder text |
| 2.5.4 | Motion trigger has disable option | Accelerometer/motion events can be disabled | [ ] | N/A if no motion-based features |
| 2.5.5 | Touch targets >= 44x44 CSS pixels (AAA: 44x44) | Button/link size adequate | [ ] | Measured minimum: _____ x _____ |
| 2.5.7 | Hover/focus content remains even without hover | Tooltips stay visible when content appears | [ ] | No auto-hiding tooltips |

**Summary Pass:** [ ] All 2.5 requirements met

---

## Part 3: Understandable (WCAG 3.x)

### 3.1 Readable

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| 3.1.1 | Page language specified | `<html lang="en">` present | [ ] | Language declared in HTML |
| 3.1.2 | Language of text blocks specified if different | Non-English text marked with lang attribute | [ ] | N/A if single language |
| 3.1.3 | Unusual words/abbreviations defined | Tooltips or definitions provided | [ ] | Abbreviations expanded on first use |
| 3.1.4 | Pronunciation provided for ambiguous words | Pronunciation guide if needed | [ ] | Ruby annotations for CJK text |
| 3.1.5 | Reading level appropriate (lower secondary/grade 9) | Flesch Kincaid >= 60 readability score | [ ] | Reading level: _____ |

**Readability Test:**
- [ ] Copy all text from block
- [ ] Paste into Flesch Kincaid calculator
- [ ] Verify score appropriate for audience
- [ ] Simplify overly complex sentences

**Summary Pass:** [ ] All 3.1 requirements met

### 3.2 Predictable

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| 3.2.1 | Change of context only on user request | No auto-redirects or page reloads | [ ] | User controls navigation |
| 3.2.2 | UI components behave consistently | Same controls work the same way | [ ] | Buttons consistently activate |
| 3.2.3 | Navigation consistent across pages | Menu location/order same everywhere | [ ] | N/A for single block |
| 3.2.4 | Components identified consistently | Same element named/identified same way | [ ] | "Save" button always called "Save" |
| 3.2.5 | Automated changes announced | Loading states announced to screen readers | [ ] | ARIA live regions if needed |

**Summary Pass:** [ ] All 3.2 requirements met

### 3.3 Input Assistance

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| 3.3.1 | Error messages identify problem and suggest fix | If errors occur, provide clear guidance | [ ] | N/A (hero block is not a form) |
| 3.3.2 | Labels for input fields | Each input has associated label | [ ] | N/A if no inputs |
| 3.3.3 | Error prevention offered | Users can review before submit | [ ] | N/A if no form submission |
| 3.3.4 | Error prevention for legal/financial/data | Reversible actions, confirmation checks | [ ] | N/A for hero block |
| 3.3.5 | Help and manual available | Documentation accessible | [ ] | Tooltips or help text provided |

**Summary Pass:** [ ] N/A (hero block is not a form)

---

## Part 4: Robust (WCAG 4.x)

### 4.1 Compatible

| Criterion | Requirement | Check | Pass | Notes |
|-----------|-------------|-------|------|-------|
| **4.1.1** | **HTML valid (no parsing errors)** | **W3C Validator shows 0 errors** | [ ] | **Run through https://validator.w3.org/** |
| **4.1.2** | **Name, role, value for UI components** | **ARIA labels present where needed** | [ ] | **Buttons have accessible names** |
| **4.1.3** | **Status messages announced to screen readers** | **ARIA live regions for updates** | [ ] | **Changes announced: aria-live="polite"** |

**HTML Validation:**
- [ ] No mismatched opening/closing tags
- [ ] No duplicate IDs
- [ ] All required attributes present (alt on img, etc.)
- [ ] Proper nesting (no p inside p)

**ARIA Labeling:**
- [ ] Buttons: text content OR aria-label OR title
- [ ] Images: alt attribute
- [ ] Links: descriptive text
- [ ] Form controls: associated labels

**Summary Pass:** [ ] All 4.1 requirements met

---

## Part 5: Automated Testing Results

### Axe DevTools Scan

**Scan Date:** ________________  
**URL Tested:** ________________

| Finding | Count | Severity | Resolution |
|---------|-------|----------|------------|
| Violations | ____ | Must fix | Fixed: [ ] |
| Best Practices | ____ | Should consider | Addressed: [ ] |
| Needs Review | ____ | Manual check needed | Reviewed: [ ] |

**Violations to Fix:**
- [ ] Critical violations resolved
- [ ] High severity issues addressed
- [ ] Medium severity issues triaged

### WAVE Report

**Scan Date:** ________________  
**Errors:** ____ (must fix)  
**Contrast Errors:** ____ (AAA check)  
**Alerts:** ____ (review)

- [ ] All errors resolved
- [ ] Contrast checked and passing
- [ ] Alerts reviewed and documented

### Lighthouse Accessibility Score

**Score:** ____ / 100  
**Target:** >= 90  
- [ ] Accessibility score >= 90
- [ ] No critical issues flagged

---

## Part 6: Screen Reader Testing

### NVDA Testing (Windows)

- [ ] Block announces correctly
- [ ] Image alt text read aloud
- [ ] Heading hierarchy correct
- [ ] Link purposes clear
- [ ] Focus order logical
- [ ] Form labels associated

### JAWS Testing (Windows, if available)

- [ ] Block structure comprehensible
- [ ] All content accessible
- [ ] Proper announcement of interactive elements

### VoiceOver Testing (Mac/iOS)

- [ ] Block navigable with rotor
- [ ] Content announced accurately
- [ ] Focus indicators visible
- [ ] Touch targets adequate

**Screen Reader Pass:** [ ] Block usable with assistive technology

---

## Part 7: Mobile Accessibility

### Touch Target Size

- [ ] All buttons/links >= 44x44 CSS pixels
- [ ] Minimum 24px padding between targets
- [ ] Text input fields >= 44x44 pixels
- [ ] No tiny buttons or links

**Spacing Test:**
```
Measure in browser DevTools:
- Button 1: _____ x _____ px
- Button 2: _____ x _____ px
- Link 1: _____ x _____ px
```

### Mobile Zoom & Reflow

- [ ] Content reflows at 320px width
- [ ] Text doesn't require horizontal scroll
- [ ] Responsive layout works on mobile
- [ ] Touch interactions work (no hover-only)

**Mobile Test Viewport Sizes:**
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 14)
- [ ] 768px (iPad)

**Mobile Pass:** [ ] Block accessible on mobile devices

---

## Part 8: Color & Contrast Testing

### Text Contrast (Foreground vs Background)

Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

| Element | Foreground Color | Background Color | Ratio | AAA Pass (7:1) |
|---------|------------------|------------------|-------|----------------|
| Heading | __________ | __________ | ____:1 | [ ] |
| Body Text | __________ | __________ | ____:1 | [ ] |
| Link | __________ | __________ | ____:1 | [ ] |
| Overlay Text | __________ | __________ | ____:1 | [ ] |
| Button Text | __________ | __________ | ____:1 | [ ] |

**Contrast Calculation:**
1. Use eyedropper to get exact colors (hex)
2. Enter into WebAIM checker
3. Record ratio
4. Verify >= 7:1 for AAA

### Focus Indicator Contrast

| Element | Focus Color | Background | Ratio | Pass (3:1) |
|---------|-------------|------------|-------|-----------|
| Button Focus | __________ | __________ | ____:1 | [ ] |
| Link Focus | __________ | __________ | ____:1 | [ ] |

### Graphical Object Contrast

- [ ] Borders/icons contrast >= 3:1
- [ ] UI components visible
- [ ] Separators distinguish content areas

---

## Part 9: Prefers-Reduced-Motion Testing

**Test in Chrome DevTools:**

1. Open DevTools (F12)
2. Click "..." > More tools > Rendering
3. Find "Emulate CSS media feature prefers-reduced-motion"
4. Select "prefers-reduced-motion: reduce"

**Verification:**
- [ ] Animations disabled or significantly reduced
- [ ] Block still fully functional
- [ ] No essential animations removed
- [ ] User can enable animations if preferred

**Prefers-Reduced-Motion Pass:** [ ] Block respects accessibility preference

---

## Part 10: Manual Accessibility Checklist

### Visual Design

- [ ] Text is not pixelated or blurry
- [ ] Text doesn't use all caps exclusively
- [ ] No animated GIFs (or auto-disabled)
- [ ] No parallax effects as primary feature
- [ ] Sufficient whitespace between elements

### Content Structure

- [ ] Logical reading order
- [ ] Important content first
- [ ] No hidden content (except semantically)
- [ ] Semantic HTML elements used appropriately
- [ ] No empty headings or buttons

### Interactive Elements

- [ ] All interactive elements keyboard accessible
- [ ] Buttons/links clearly identifiable
- [ ] Forms have clear labels
- [ ] Error messages helpful and specific
- [ ] Success feedback provided

### Media Handling

- [ ] Images have descriptive alt text
- [ ] Decorative images have alt=""
- [ ] Video has captions and transcript
- [ ] Audio has transcript
- [ ] Media players keyboard accessible

---

## Part 11: Internationalization & Localization

- [ ] Language declared: `<html lang="en">`
- [ ] RTL languages supported (if applicable)
- [ ] Character encoding UTF-8 specified
- [ ] Translated content maintains accessibility
- [ ] Color meanings not culture-specific

---

## Part 12: Browser & Assistive Technology Compatibility

### Tested Browsers

| Browser | Version | Pass |
|---------|---------|------|
| Chrome | Latest-1 | [ ] |
| Firefox | Latest-1 | [ ] |
| Safari | Latest-1 | [ ] |
| Edge | Latest-1 | [ ] |

### Tested Assistive Technologies

| Technology | Version | Pass |
|-----------|---------|------|
| NVDA | Latest | [ ] |
| JAWS | Latest | [ ] |
| VoiceOver | Built-in | [ ] |
| TalkBack | Android | [ ] |

---

## Final Accessibility Sign-Off

### Summary

**Total Tests:** 150+  
**Critical Issues Found:** _____  
**Major Issues Found:** _____  
**Minor Issues Found:** _____  
**Passed Tests:** _____  

### Issues by Severity

**Critical (Must Fix):**
- [ ] _________________________________
- [ ] _________________________________
- [ ] _________________________________

**Major (Should Fix):**
- [ ] _________________________________
- [ ] _________________________________

**Minor (Nice to Have):**
- [ ] _________________________________
- [ ] _________________________________

### Conformance Statement

I certify that this WordPress hero block has been tested against WCAG 2.2 Level AAA standards and:

- [ ] All critical accessibility issues are resolved
- [ ] Block is fully keyboard navigable
- [ ] Focus indicators are clearly visible
- [ ] Color contrast meets AAA standards (7:1 for normal text)
- [ ] Alt text provided for images
- [ ] Screen reader compatible
- [ ] Mobile accessible with adequate touch targets
- [ ] Animations respect prefers-reduced-motion
- [ ] HTML is valid and semantic
- [ ] ARIA labels used appropriately where needed

**Accessibility Rating:** [ ] AAA Compliant [ ] Mostly Compliant [ ] Needs Work

**Reviewed By:** ________________  
**Date:** ________________  
**Approved By:** ________________  
**Date:** ________________

---

## Remediation Action Items

For any failed tests, create GitHub issues with labels:
- `a11y` - Accessibility issue
- `critical` - Blocks production release
- `wcag-2.2-aaa` - Specific to this standard

Example issue template:
```
## WCAG 2.2 AAA Issue: [Criterion Number] [Criterion Title]

**Issue:** [Description of the problem]
**Impact:** [Who is affected, severity]
**Reproduction:** [Steps to reproduce]
**Requirement:** [Which WCAG criterion not met]
**Solution:** [Proposed fix]
**Test:** [How to verify fix]
```

---

## Resources

- **WCAG 2.2 Specification:** https://www.w3.org/WAI/WCAG22/quickref/
- **WebAIM Color Contrast:** https://webaim.org/resources/contrastchecker/
- **ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **WAVE Browser Extension:** https://wave.webaim.org/
- **Screen Readers:** NVDA (free), JAWS (paid), VoiceOver (built-in macOS)

---

**Document Version:** 1.0  
**Last Updated:** 2026-10-30  
**Next Review:** ________________
