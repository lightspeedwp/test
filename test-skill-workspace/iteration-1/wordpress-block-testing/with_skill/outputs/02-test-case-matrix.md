# WordPress Hero Block - Test Case Matrix

## Test Case Format

```
ID: TEST-XXX
Title: Brief description
Category: [Registration | Editor UI | Frontend | Responsive | Accessibility | Attributes | Theme.json]
Priority: [Critical | High | Medium | Low]
Preconditions: Setup steps required
Steps: 
  1. Action
  2. Verify
Expected Result: What should happen
Actual Result: [PASS | FAIL] (filled during testing)
Notes: Additional context
```

---

## Category 1: Block Registration & Lifecycle (8 tests)

### TEST-REG-001: Block Registered with Correct Namespace
- **Priority**: Critical
- **Preconditions**: Block code deployed, WordPress installed
- **Steps**:
  1. Navigate to block inserter
  2. Search for "Hero Section"
  3. Verify block appears with correct namespace badge
- **Expected Result**: Block appears as "Hero Section" in "Custom Blocks" category
- **Test Type**: Manual / Jest
- **Status**: [ ] Pass [ ] Fail

### TEST-REG-002: Block Metadata Loads from block.json
- **Priority**: Critical
- **Preconditions**: block.json present in plugin/theme directory
- **Steps**:
  1. Inspect network requests for block.json
  2. Verify block.json parses without errors
  3. Check block editor console for registration logs
- **Expected Result**: No errors in console, block.json loaded successfully
- **Test Type**: Jest (mock block registration)
- **Status**: [ ] Pass [ ] Fail

### TEST-REG-003: Block Displays Correct Icon in Inserter
- **Priority**: Medium
- **Preconditions**: Icon SVG defined in block.json
- **Steps**:
  1. Open block inserter
  2. Locate Hero Section block
  3. Verify icon displays correctly
- **Expected Result**: Block icon visible and recognizable
- **Test Type**: Manual
- **Status**: [ ] Pass [ ] Fail

### TEST-REG-004: Block Supports Required Features
- **Priority**: High
- **Preconditions**: block.json "supports" section defined
- **Steps**:
  1. Add block to page
  2. Check alignment options in toolbar
  3. Verify custom CSS classes can be added
  4. Check anchor/link options
- **Expected Result**: All supported features available and functional
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-REG-005: Block Renders Edit Component on Select
- **Priority**: Critical
- **Preconditions**: Edit component defined in block.js
- **Steps**:
  1. Add block to page
  2. Verify block edit UI renders (controls visible)
  3. Click on block to select it
  4. Verify edit component remains
- **Expected Result**: Edit UI displays correctly on selection
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-REG-006: Block Save Function Serializes Correctly
- **Priority**: Critical
- **Preconditions**: Save component defined, attributes set
- **Steps**:
  1. Add block with content (image + text)
  2. Publish page
  3. Inspect HTML source
  4. Verify block HTML comment present
- **Expected Result**: Block serializes to valid HTML with attributes
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-REG-007: Block Migrations Handle Old Versions
- **Priority**: High
- **Preconditions**: Migration functions defined in block.json
- **Steps**:
  1. Load page with old block version in HTML
  2. Open in editor
  3. Verify block loads without errors
  4. Check attributes migrated correctly
- **Expected Result**: Old version loads and data migrates without loss
- **Test Type**: Jest (mock deprecated blocks)
- **Status**: [ ] Pass [ ] Fail

### TEST-REG-008: Block Placeholder Renders When Empty
- **Priority**: Medium
- **Preconditions**: Block has placeholder component
- **Steps**:
  1. Add block to page without content
  2. Verify placeholder text displays
  3. Click "Select Image" button
  4. Verify media picker opens
- **Expected Result**: Helpful placeholder with call-to-action
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

---

## Category 2: Editor UI & User Experience (12 tests)

### TEST-EDIT-001: Image Upload Control Works
- **Priority**: Critical
- **Preconditions**: Media upload enabled, test image available
- **Steps**:
  1. Add block to page
  2. Click "Select Image" button
  3. Upload test image from library
  4. Verify image displays in block
- **Expected Result**: Image uploads and displays in editor preview
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-002: Image Replacement Works
- **Priority**: High
- **Preconditions**: Block has image selected
- **Steps**:
  1. Click block to select it
  2. Click "Replace Image" button
  3. Select different image
  4. Verify old image replaced with new
- **Expected Result**: New image displays, old image removed
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-003: Remove Image Button Works
- **Priority**: High
- **Preconditions**: Block has image selected
- **Steps**:
  1. Select block with image
  2. Click "Remove Image" button
  3. Verify image removed
  4. Verify placeholder shows
- **Expected Result**: Image removed, placeholder displays
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-004: Text Overlay Content Editable
- **Priority**: Critical
- **Preconditions**: Image selected in block
- **Steps**:
  1. Click on overlay text area in editor
  2. Type test content
  3. Verify text appears in editor
  4. Verify text persists on click away
- **Expected Result**: Text editable and persists
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-005: Heading Level Selector Works
- **Priority**: High
- **Preconditions**: Block has heading level control in inspector
- **Steps**:
  1. Select block
  2. Open block inspector
  3. Change heading level from H2 to H3
  4. Verify editor preview updates
- **Expected Result**: Heading level selector updates preview correctly
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-006: Text Alignment Controls Work
- **Priority**: High
- **Preconditions**: Text alignment controls in toolbar
- **Steps**:
  1. Select block
  2. Click left align button
  3. Verify preview updates
  4. Repeat for center and right align
- **Expected Result**: All alignment options update preview
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-007: Inspector Controls Have Descriptions
- **Priority**: Medium
- **Preconditions**: Inspector panel visible
- **Steps**:
  1. Hover over each control label
  2. Verify tooltip/description appears
  3. Check label text is clear
- **Expected Result**: All controls have helpful descriptions
- **Test Type**: Manual / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-008: Alt Text Field Editable
- **Priority**: Critical (Accessibility)
- **Preconditions**: Image selected
- **Steps**:
  1. Locate alt text field in inspector
  2. Enter alt text description
  3. Verify alt text appears in editor hint
  4. Save page and reload
  5. Verify alt text persists
- **Expected Result**: Alt text editable, required, and persistent
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-009: Undo Works for All Changes
- **Priority**: High
- **Preconditions**: Block with edits in progress
- **Steps**:
  1. Make multiple edits (image, text, alignment)
  2. Press Ctrl+Z (or Cmd+Z)
  3. Verify each change undoes
- **Expected Result**: All edits undo correctly
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-010: Redo Works for All Changes
- **Priority**: High
- **Preconditions**: Undone changes in history
- **Steps**:
  1. Undo several changes
  2. Press Ctrl+Y (or Cmd+Y)
  3. Verify changes redo
- **Expected Result**: All undone changes redo correctly
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-011: Block Preview Updates in Real-time
- **Priority**: High
- **Preconditions**: Block in editor with inspector open
- **Steps**:
  1. Change inspector control value
  2. Verify block preview updates immediately
  3. Repeat for each control
- **Expected Result**: No delay in preview update
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-EDIT-012: No Console Errors in Block Editor
- **Priority**: Critical
- **Preconditions**: Block added to page
- **Steps**:
  1. Open browser console (F12)
  2. Add block to page
  3. Interact with all controls
  4. Check for JavaScript errors
- **Expected Result**: No errors or warnings in console
- **Test Type**: Playwright (read_console_messages)
- **Status**: [ ] Pass [ ] Fail

---

## Category 3: Frontend Rendering (10 tests)

### TEST-FE-001: Block Outputs Semantic HTML
- **Priority**: Critical
- **Preconditions**: Block published with content
- **Steps**:
  1. Publish page with hero block
  2. View page source
  3. Inspect HTML structure
  4. Verify semantic tags present
- **Expected Result**: `<figure>`, `<img>`, `<figcaption>` or similar semantic HTML
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-FE-002: Image Element Has Alt Text
- **Priority**: Critical (WCAG 2.2 AAA)
- **Preconditions**: Image with alt text added to block
- **Steps**:
  1. Publish page
  2. Inspect HTML
  3. Check img.alt attribute
- **Expected Result**: `alt` attribute contains descriptive text
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-FE-003: Image Has Width and Height Attributes
- **Priority**: High (Performance)
- **Preconditions**: Image uploaded to block
- **Steps**:
  1. Publish page
  2. Inspect img element
  3. Check width and height attributes
- **Expected Result**: Width and height present (prevents layout shift)
- **Test Type**: Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-FE-004: Text Overlay Markup Correct
- **Priority**: High
- **Preconditions**: Block with text content published
- **Steps**:
  1. Publish page
  2. Inspect HTML
  3. Verify heading uses correct level (h2, h3, etc.)
  4. Verify description in <p> tags
- **Expected Result**: Proper heading levels and semantic text elements
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-FE-005: CSS Classes Applied Correctly
- **Priority**: Medium
- **Preconditions**: Block published
- **Steps**:
  1. Inspect block wrapper element
  2. Verify has `wp-block-namespace-hero-section` class
  3. Verify alignment class present if set
  4. Verify custom classes applied
- **Expected Result**: All expected CSS classes present
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-FE-006: Block Renders Without FOUC
- **Priority**: High
- **Preconditions**: Page with hero block
- **Steps**:
  1. Hard refresh page (Ctrl+Shift+R)
  2. Watch for unstyled content flash
  3. Measure time to styled state
- **Expected Result**: Block styled before visible (no flash)
- **Test Type**: Playwright (visual regression)
- **Status**: [ ] Pass [ ] Fail

### TEST-FE-007: Image Lazy Loading Enabled
- **Priority**: Medium (Performance)
- **Preconditions**: Image in block
- **Steps**:
  1. Publish page
  2. Inspect img element
  3. Check for `loading="lazy"` attribute
- **Expected Result**: Lazy loading attribute present
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-FE-008: Responsive Images (srcset)
- **Priority**: Medium (Performance)
- **Preconditions**: Image > 1200px width
- **Steps**:
  1. Publish page
  2. Inspect img element
  3. Check for srcset attribute
  4. Verify multiple image sizes
- **Expected Result**: Srcset contains multiple image sizes
- **Test Type**: Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-FE-009: No Broken Links in Output
- **Priority**: High
- **Preconditions**: Block with any links in text overlay
- **Steps**:
  1. Inspect all <a> elements
  2. Verify href attributes valid
  3. Check no javascript: URLs
  4. Click links to verify they work
- **Expected Result**: All links valid and working
- **Test Type**: Playwright (link validation)
- **Status**: [ ] Pass [ ] Fail

### TEST-FE-010: No XSS Vulnerabilities in Output
- **Priority**: Critical (Security)
- **Preconditions**: Block with user content
- **Steps**:
  1. Test with XSS payload in text: `<script>alert('xss')</script>`
  2. Publish page
  3. View page source
  4. Verify script tags escaped
- **Expected Result**: All user input properly escaped
- **Test Type**: Jest / Playwright (security test)
- **Status**: [ ] Pass [ ] Fail

---

## Category 4: Responsive Design (8 tests)

### TEST-RESP-001: Mobile Layout (≤480px)
- **Priority**: Critical
- **Preconditions**: Block published
- **Steps**:
  1. Open page in mobile viewport (375px)
  2. Verify image scales to 100% width
  3. Check text overlay readable
  4. Scroll horizontally - verify no scroll
- **Expected Result**: Mobile layout works, readable, no horizontal scroll
- **Test Type**: Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-RESP-002: Tablet Layout (481px-1024px)
- **Priority**: High
- **Preconditions**: Block published
- **Steps**:
  1. Open page in tablet viewport (768px)
  2. Verify layout adjusts appropriately
  3. Check spacing and font sizes
- **Expected Result**: Tablet layout optimized, readable
- **Test Type**: Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-RESP-003: Desktop Layout (≥1025px)
- **Priority**: High
- **Preconditions**: Block published
- **Steps**:
  1. Open page in desktop viewport (1440px)
  2. Verify layout displays at design
  3. Check full-width option if enabled
- **Expected Result**: Desktop layout matches design
- **Test Type**: Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-RESP-004: Breakpoint Transitions Smooth
- **Priority**: High
- **Preconditions**: Block published
- **Steps**:
  1. Resize viewport from mobile to desktop
  2. Watch for layout shifts
  3. Verify text stays readable throughout
- **Expected Result**: Smooth transitions, no jumping
- **Test Type**: Playwright (visual regression)
- **Status**: [ ] Pass [ ] Fail

### TEST-RESP-005: Orientation Changes Handled
- **Priority**: Medium
- **Preconditions**: Block published
- **Steps**:
  1. Rotate device from portrait to landscape
  2. Verify layout adjusts
  3. Rotate back to portrait
- **Expected Result**: Layout adjusts correctly on rotate
- **Test Type**: Playwright (rotate action)
- **Status**: [ ] Pass [ ] Fail

### TEST-RESP-006: Font Sizes Fluid and Readable
- **Priority**: High
- **Preconditions**: Block published
- **Steps**:
  1. Check font sizes across breakpoints
  2. Verify minimum 16px at mobile
  3. Verify scales appropriately to 2-3x at desktop
- **Expected Result**: Readable at all breakpoints
- **Test Type**: Playwright (computed styles)
- **Status**: [ ] Pass [ ] Fail

### TEST-RESP-007: Image Aspect Ratio Maintained
- **Priority**: High
- **Preconditions**: Block with image
- **Steps**:
  1. Check image aspect ratio on mobile
  2. Check aspect ratio on tablet
  3. Check aspect ratio on desktop
  4. Verify no distortion
- **Expected Result**: Consistent aspect ratio across all viewports
- **Test Type**: Playwright (calculate dimensions)
- **Status**: [ ] Pass [ ] Fail

### TEST-RESP-008: Touch Targets Adequately Sized
- **Priority**: High (Accessibility)
- **Preconditions**: Block published
- **Steps**:
  1. Inspect all interactive elements
  2. Check minimum 48x48px touch target
  3. Verify 8px spacing between targets
- **Expected Result**: All touch targets meet minimum size
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

---

## Category 5: Accessibility (WCAG 2.2 AAA) (10 tests)

### TEST-A11Y-001: Color Contrast Meets AAA (≥7:1)
- **Priority**: Critical
- **Preconditions**: Block published with color overlay
- **Steps**:
  1. Use Color Contrast Analyzer tool
  2. Check overlay text color vs background
  3. Check heading color vs background
  4. Verify ≥7:1 ratio for all text
- **Expected Result**: All text ≥7:1 contrast ratio
- **Test Type**: Manual (Color Contrast Analyzer)
- **Status**: [ ] Pass [ ] Fail

### TEST-A11Y-002: Image Alt Text Present and Descriptive
- **Priority**: Critical
- **Preconditions**: Image in block
- **Steps**:
  1. Inspect alt text content
  2. Verify 15-125 characters
  3. Verify describes image, not "image of"
  4. Verify unique if multiple images
- **Expected Result**: Descriptive, unique, appropriate length alt text
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-A11Y-003: Keyboard Navigation Works
- **Priority**: Critical
- **Preconditions**: Block on published page
- **Steps**:
  1. Tab to block in editor
  2. Verify focus indicator visible
  3. Tab through all controls
  4. Verify Tab order logical
  5. Press Escape to close any dialogs
- **Expected Result**: Full keyboard navigation, no traps
- **Test Type**: Playwright / Manual
- **Status**: [ ] Pass [ ] Fail

### TEST-A11Y-004: Screen Reader Announces Content Correctly
- **Priority**: Critical
- **Preconditions**: Block published
- **Steps**:
  1. Open NVDA or JAWS screen reader
  2. Navigate to block
  3. Verify heading announced
  4. Verify image alt text announced
  5. Verify text overlay content announced
- **Expected Result**: All content announced correctly
- **Test Type**: Manual (Screen reader testing)
- **Status**: [ ] Pass [ ] Fail

### TEST-A11Y-005: Heading Level Correct (H1-H6)
- **Priority**: High
- **Preconditions**: Block published
- **Steps**:
  1. Inspect heading element
  2. Verify heading level matches content hierarchy
  3. Verify no missing heading levels
- **Expected Result**: Heading level semantically appropriate
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-A11Y-006: Focus Indicator Visible (≥3px)
- **Priority**: High
- **Preconditions**: Block in editor
- **Steps**:
  1. Tab to each control
  2. Verify focus outline visible
  3. Measure focus outline width (≥3px)
  4. Verify focus color has AAA contrast
- **Expected Result**: Clear, visible, high-contrast focus indicator
- **Test Type**: Playwright (visual regression)
- **Status**: [ ] Pass [ ] Fail

### TEST-A11Y-007: Axe DevTools Accessibility Scan Passes
- **Priority**: Critical
- **Preconditions**: Block published, Axe extension installed
- **Steps**:
  1. Install Axe DevTools browser extension
  2. Run axe scan on page
  3. Filter for WCAG 2.2 AAA
  4. Verify 0 violations
- **Expected Result**: No accessibility violations
- **Test Type**: Automated (Axe DevTools)
- **Status**: [ ] Pass [ ] Fail

### TEST-A11Y-008: Text Readability Standards Met
- **Priority**: High
- **Preconditions**: Block published
- **Steps**:
  1. Check line-height: ≥1.5
  2. Check letter-spacing: ≥0.12em
  3. Check word-spacing: ≥0.16em
  4. Check no justified text
- **Expected Result**: All readability standards met
- **Test Type**: Playwright (computed styles)
- **Status**: [ ] Pass [ ] Fail

### TEST-A11Y-009: Motion Respects prefers-reduced-motion
- **Priority**: Medium
- **Preconditions**: Block has animations
- **Steps**:
  1. Enable prefers-reduced-motion in browser
  2. Verify animations removed/disabled
  3. Verify essential motion still works
- **Expected Result**: Animations respect user preference
- **Test Type**: Playwright (emulate media)
- **Status**: [ ] Pass [ ] Fail

### TEST-A11Y-010: WCAG 2.2 AAA Audit Complete
- **Priority**: High
- **Preconditions**: All other a11y tests passed
- **Steps**:
  1. Run WAVE accessibility checker
  2. Run ARC Toolkit
  3. Run manual WCAG 2.2 AAA audit
  4. Document all findings
- **Expected Result**: No unfixed accessibility issues
- **Test Type**: Manual accessibility audit
- **Status**: [ ] Pass [ ] Fail

---

## Category 6: Attributes & Data Persistence (8 tests)

### TEST-ATTR-001: Image Attribute Saves Correctly
- **Priority**: Critical
- **Preconditions**: Block with image
- **Steps**:
  1. Add image to block
  2. Publish page
  3. Reload page
  4. Verify image still present with same src
- **Expected Result**: Image attribute persists across save/reload
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-ATTR-002: Text Content Attribute Saves Correctly
- **Priority**: Critical
- **Preconditions**: Block with text content
- **Steps**:
  1. Add heading and description text
  2. Publish page
  3. Reload page
  4. Verify text content unchanged
- **Expected Result**: Text content persists
- **Test Type**: Playwright E2E
- **Status**: [ ] Pass [ ] Fail

### TEST-ATTR-003: Heading Level Attribute Saves
- **Priority**: High
- **Preconditions**: Block with heading
- **Steps**:
  1. Set heading level to H3
  2. Publish and reload
  3. Inspect HTML
  4. Verify <h3> tag (not h2)
- **Expected Result**: Heading level attribute persists
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-ATTR-004: Alignment Attribute Saves
- **Priority**: High
- **Preconditions**: Block with alignment set
- **Steps**:
  1. Set alignment to center
  2. Publish and reload
  3. Inspect alignment class in HTML
- **Expected Result**: Alignment class persists in HTML
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-ATTR-005: Alt Text Attribute Persists
- **Priority**: Critical
- **Preconditions**: Image with alt text
- **Steps**:
  1. Add image with alt text
  2. Publish and reload
  3. Inspect alt attribute
- **Expected Result**: Alt text persists in HTML
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-ATTR-006: Custom CSS Classes Persist
- **Priority**: Medium
- **Preconditions**: Custom class added to block
- **Steps**:
  1. Add custom CSS class via additional CSS class field
  2. Publish and reload
  3. Inspect block element class attribute
- **Expected Result**: Custom class persists
- **Test Type**: Playwright
- **Status**: [ ] Pass [ ] Fail

### TEST-ATTR-007: Attribute Validation Works
- **Priority**: High
- **Preconditions**: Block attribute schema defined
- **Steps**:
  1. Attempt invalid value for heading level (e.g., h7)
  2. Verify validation error or fallback
  3. Attempt XSS payload in alt text
  4. Verify sanitization
- **Expected Result**: Invalid/malicious data rejected or sanitized
- **Test Type**: Jest (validation tests)
- **Status**: [ ] Pass [ ] Fail

### TEST-ATTR-008: All Attributes Have Default Values
- **Priority**: Medium
- **Preconditions**: Block deployed
- **Steps**:
  1. Add blank block to page
  2. Publish without filling in all fields
  3. Verify block renders with sensible defaults
- **Expected Result**: Block renders even with missing optional attributes
- **Test Type**: Jest / Playwright
- **Status**: [ ] Pass [ ] Fail

---

## Category 7: Theme.json Integration (8 tests)

### TEST-THEME-001: Block Registered in theme.json blockTypes
- **Priority**: High
- **Preconditions**: theme.json updated with block config
- **Steps**:
  1. Inspect theme.json blockTypes
  2. Verify `namespace/hero-section` present
  3. Check block settings defined
- **Expected Result**: Block properly registered in theme.json
- **Test Type**: Jest (JSON schema validation)
- **Status**: [ ] Pass [ ] Fail

### TEST-THEME-002: Color Tokens Used in Block
- **Priority**: High
- **Preconditions**: theme.json has color palette
- **Steps**:
  1. Check block CSS uses CSS custom properties
  2. Verify --wp-preset-color-* variables used
  3. Check fallback colors provided
- **Expected Result**: Block uses theme color tokens
- **Test Type**: Jest / Playwright (computed styles)
- **Status**: [ ] Pass [ ] Fail

### TEST-THEME-003: Typography Tokens Applied
- **Priority**: High
- **Preconditions**: theme.json has typography presets
- **Steps**:
  1. Check heading font-family from typography preset
  2. Check heading font-size from scale
  3. Check description text uses typography preset
- **Expected Result**: Typography follows theme tokens
- **Test Type**: Jest / Playwright (computed styles)
- **Status**: [ ] Pass [ ] Fail

### TEST-THEME-004: Spacing Tokens Used
- **Priority**: Medium
- **Preconditions**: theme.json spacing scale defined
- **Steps**:
  1. Inspect block padding/margin values
  2. Verify values from theme spacing scale
  3. No hardcoded pixel values
- **Expected Result**: All spacing uses theme scale
- **Test Type**: Jest / Playwright (computed styles)
- **Status**: [ ] Pass [ ] Fail

### TEST-THEME-005: Breakpoints from theme.json Used
- **Priority**: High
- **Preconditions**: theme.json has settings.custom.breakpoints
- **Steps**:
  1. Check block media queries match breakpoints
  2. Verify breakpoint names match
  3. No hardcoded viewport widths
- **Expected Result**: Block uses theme breakpoints
- **Test Type**: Jest (CSS parsing)
- **Status**: [ ] Pass [ ] Fail

### TEST-THEME-006: Block Responds to Theme Changes
- **Priority**: High
- **Preconditions**: Two theme.json variations
- **Steps**:
  1. Switch to dark theme variant
  2. Verify block colors update
  3. Switch back to light theme
  4. Verify colors revert
- **Expected Result**: Block updates with theme changes
- **Test Type**: Playwright (theme switching)
- **Status**: [ ] Pass [ ] Fail

### TEST-THEME-007: CSS Custom Properties Defined
- **Priority**: Medium
- **Preconditions**: Block stylesheet references CSS vars
- **Steps**:
  1. Inspect CSS custom properties definitions
  2. Verify fallback values provided
  3. Check vars not undefined
- **Expected Result**: All CSS vars defined with fallbacks
- **Test Type**: Jest / Playwright (CSS analysis)
- **Status**: [ ] Pass [ ] Fail

### TEST-THEME-008: theme.json Schema Validation Passes
- **Priority**: Critical
- **Preconditions**: theme.json file
- **Steps**:
  1. Validate theme.json against WordPress schema
  2. Run JSON Schema validator
  3. Check for schema violations
- **Expected Result**: theme.json passes schema validation
- **Test Type**: Jest (schema validation)
- **Status**: [ ] Pass [ ] Fail

---

## Test Execution Plan

### Phase 1: Unit Testing (Jest)
- TEST-REG-002, TEST-REG-004, TEST-REG-006
- TEST-FE-001, TEST-FE-002, TEST-FE-004, TEST-FE-005
- TEST-ATTR-007, TEST-ATTR-008
- TEST-A11Y-002, TEST-A11Y-005, TEST-A11Y-008
- TEST-THEME-001, TEST-THEME-008
- **Timeline**: Week 1
- **Owner**: Developer

### Phase 2: E2E Testing (Playwright)
- TEST-REG-005, TEST-REG-006, TEST-REG-008
- TEST-EDIT-001 through TEST-EDIT-012
- TEST-FE-003, TEST-FE-006, TEST-FE-007, TEST-FE-008, TEST-FE-009, TEST-FE-010
- TEST-RESP-001 through TEST-RESP-008
- TEST-ATTR-001 through TEST-ATTR-006
- **Timeline**: Week 1-2
- **Owner**: QA Engineer

### Phase 3: Manual Testing
- TEST-REG-001, TEST-REG-003
- TEST-EDIT-007
- TEST-A11Y-001, TEST-A11Y-003, TEST-A11Y-004, TEST-A11Y-006, TEST-A11Y-007, TEST-A11Y-009, TEST-A11Y-010
- TEST-THEME-002 through TEST-THEME-007
- **Timeline**: Week 2
- **Owner**: QA Lead + Accessibility Expert

### Phase 4: Performance & Security
- TEST-FE-003, TEST-FE-007, TEST-FE-008 (performance)
- TEST-FE-010 (security)
- **Timeline**: Week 2
- **Owner**: Performance/Security Specialist

---

## Pass/Fail Criteria

- **CRITICAL**: Must pass before ship (blocks merge)
- **HIGH**: Should pass before ship (blocks merge)
- **MEDIUM**: Should pass before ship (not blocking)
- **LOW**: Nice to have (non-blocking)

**Overall Pass Threshold**: 100% of CRITICAL + HIGH tests pass
