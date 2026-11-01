# WordPress Hero Block - Testing Checklist (7 Dimensions)

## Dimension 1: Block Registration & Lifecycle

### Block Registration
- [ ] Block is registered via `registerBlockType()` with correct namespace
- [ ] Block metadata loaded from `block.json` correctly
- [ ] Block name follows pattern: `namespace/hero-section` (kebab-case)
- [ ] Editor and save scripts loaded correctly
- [ ] Styles applied correctly (frontend + editor)
- [ ] Icon defined and displays in block inserter
- [ ] Block category correct (`common`, `media`, etc.)
- [ ] Keywords present for block search/discovery
- [ ] Description present for block inserter tooltip

### Supported Features
- [ ] `supports.html: false` if block is not meant to have custom HTML
- [ ] `supports.className` set appropriately
- [ ] `supports.align` configured for alignment options
- [ ] `supports.anchor` enabled for link targeting
- [ ] `supports.customClassName` for custom CSS class injection
- [ ] `supports.multiple` set (allow multiple instances)

### Block Versioning
- [ ] `version` field matches package.json
- [ ] Migrations defined if attributes changed
- [ ] Deprecated versions handled gracefully
- [ ] Old saved content renders without errors

### Lifecycle Hooks
- [ ] Edit function renders correctly on block select
- [ ] Save function serializes data correctly
- [ ] Block validates on save
- [ ] Placeholder renders before content selection

---

## Dimension 2: Editor UI & User Experience

### Inspector Controls
- [ ] Image upload control works (media library integration)
- [ ] Image upload validation (file type, size limits)
- [ ] Remove image button works
- [ ] Text overlay content editable (title + description)
- [ ] Heading level selector (h1-h6) for title
- [ ] Text alignment controls (left, center, right)
- [ ] All controls update block preview in real-time
- [ ] Controls have proper labels and descriptions

### Visual Preview
- [ ] Block shows preview image and text in editor
- [ ] Overlay text color visible and readable
- [ ] Image cropping preview accurate
- [ ] Responsive preview shows mobile/tablet/desktop
- [ ] Aspect ratio maintained in editor

### Block Controls Toolbar
- [ ] Toolbar buttons appear above block (alignment, text style)
- [ ] Toolbar controls update preview correctly
- [ ] Toolbar disabled/enabled based on selection state
- [ ] Keyboard shortcuts work for toolbar actions

### Media Upload Integration
- [ ] Media library opens on "Select Image" button click
- [ ] Cropping tool works in media picker
- [ ] Image focal point selector works
- [ ] Replaces image correctly when new image selected
- [ ] Shows image alt text field
- [ ] Shows image caption field
- [ ] Image load indicator shows during upload

### Nested Block Support
- [ ] Text overlay supports rich text (bold, italic, link)
- [ ] Lists work in text content
- [ ] Links insertable in text overlay
- [ ] Inline formatting toolbar appears on text selection

### Undo/Redo
- [ ] Undo works for all inspector changes
- [ ] Redo works for all inspector changes
- [ ] History stack maintains correct state

### Keyboard Navigation
- [ ] Tab navigates between controls
- [ ] Enter activates buttons
- [ ] Escape closes dialogs/pickers
- [ ] Arrow keys work in number inputs
- [ ] No keyboard traps

---

## Dimension 3: Frontend Rendering & HTML Output

### HTML Structure
- [ ] Block outputs semantic HTML (`figure`, `figcaption`, etc.)
- [ ] Image element: `<img src="" alt="" />`
- [ ] Alt text populated from block attribute
- [ ] Image has proper width/height attributes
- [ ] Text overlay wrapped in appropriate element
- [ ] Heading uses correct level (h1-h6)
- [ ] Description in `<p>` tags
- [ ] No extra wrapper divs
- [ ] Classes applied correctly for styling

### CSS Classes
- [ ] Block wrapper has `wp-block-namespace-hero-section` class
- [ ] Alignment class applied (e.g., `alignfull`, `alignwide`)
- [ ] Custom CSS classes applied if defined
- [ ] No generated class names in HTML
- [ ] Theme token classes used (color, typography)

### Image Rendering
- [ ] Image renders with correct src
- [ ] Image dimensions: width/height set correctly
- [ ] Lazy loading attribute present (`loading="lazy"`)
- [ ] Responsive images: srcset generated if width > 1200px
- [ ] Image alt text required and present
- [ ] Image loading fallback (no flash of unstyled)

### Text Overlay Rendering
- [ ] Heading text renders correctly
- [ ] Heading level respected in HTML output
- [ ] Description text renders correctly
- [ ] Text formatting (bold, italic) preserved
- [ ] Links in text overlay render as real links
- [ ] Text has proper `line-height` and `font-size`

### Link Handling
- [ ] Hero section can be linked as whole block
- [ ] Links in text overlay work independently
- [ ] No double-linking issues
- [ ] Link target/rel attributes handled correctly

### Empty States
- [ ] Block renders placeholder when no image selected
- [ ] Placeholder text is descriptive
- [ ] Placeholder disappears on publish if content added

---

## Dimension 4: Responsive Design & Breakpoints

### Mobile (≤480px)
- [ ] Image scales properly (100% width)
- [ ] Text overlay readable at mobile size
- [ ] Font sizes scale appropriately
- [ ] Touch targets at least 48px
- [ ] No horizontal scroll
- [ ] Overlay text visible over image

### Tablet (481px - 1024px)
- [ ] Image scales to container width
- [ ] Text overlay positioned correctly
- [ ] Font sizes appropriate for tablet
- [ ] Layout stable (no reflow)
- [ ] Touch targets accessible

### Desktop (≥1025px)
- [ ] Image displays at full resolution
- [ ] Text overlay positioned as designed
- [ ] Font sizes scale correctly
- [ ] Full-width option works
- [ ] Wide alignment option works

### Breakpoint Media Queries
- [ ] Media queries from theme.json breakpoints used
- [ ] Breakpoint switching is smooth
- [ ] No FOUC (Flash of Unstyled Content)
- [ ] Landscape/portrait orientation handled

### Fluid Sizing
- [ ] Font sizes use fluid scale (clamp() or calc())
- [ ] Spacing uses relative units
- [ ] Image aspect ratio maintained across breakpoints
- [ ] Text overlay scales with container

### Container Queries
- [ ] Block uses CSS container queries where applicable
- [ ] Responsive to container size, not viewport
- [ ] Container class defined properly

### Orientation
- [ ] Landscape orientation displays correctly
- [ ] Portrait orientation displays correctly
- [ ] No layout issues on rotate
- [ ] Sticky position (if used) works on all orientations

---

## Dimension 5: Accessibility (WCAG 2.2 AAA)

### Color Contrast
- [ ] Text overlay: ≥7:1 contrast ratio (AAA standard)
- [ ] Heading color: ≥7:1 contrast against background
- [ ] Description color: ≥7:1 contrast against background
- [ ] No contrast errors in axe DevTools scan
- [ ] Verified with color contrast analyzer

### Keyboard Navigation
- [ ] All block controls keyboard accessible
- [ ] Tab order logical and intuitive
- [ ] No keyboard traps
- [ ] Focus indicator visible (3px minimum)
- [ ] Can tab to block and navigate content

### Screen Reader Support
- [ ] Image has descriptive alt text (min 15 chars, max 125 chars)
- [ ] Alt text is unique if multiple images on page
- [ ] Alt text describes image content, not "image of"
- [ ] Heading marked with proper semantic level
- [ ] Description content announced correctly
- [ ] Links in overlay announced as links
- [ ] No screen reader only text needed

### Semantic HTML
- [ ] `<figure>` used for image + caption
- [ ] `<figcaption>` used for text overlay if appropriate
- [ ] `<img>` element has alt attribute
- [ ] Headings use `<h1>` through `<h6>` (not div.heading)
- [ ] Text in `<p>` tags
- [ ] Links are `<a>` elements

### Focus Management
- [ ] Focus outline clearly visible (min 3px)
- [ ] Focus outline color AAA contrast ratio
- [ ] Focus order matches visual order
- [ ] Focus indicator not removed with CSS
- [ ] No invisible focus elements

### ARIA Labels
- [ ] Buttons have aria-labels if text not visible
- [ ] Icon-only buttons have descriptive aria-labels
- [ ] aria-describedby used for additional context
- [ ] aria-live regions for dynamic updates (if applicable)
- [ ] No redundant aria attributes

### Text Readability
- [ ] Line height: 1.5 minimum
- [ ] Letter spacing: 0.12em minimum
- [ ] Word spacing: 0.16em minimum
- [ ] No justified text (prevent rivers)
- [ ] Font size: 16px minimum for body text
- [ ] No all-caps text (use text-transform only for styling)

### Motion & Animation
- [ ] No auto-playing animations
- [ ] Animations respect prefers-reduced-motion
- [ ] Animations can be paused
- [ ] No seizure-inducing content (flash < 3/sec)

### Color Not Only Indicator
- [ ] Information not conveyed by color alone
- [ ] Links identifiable without color (underline, etc.)
- [ ] Form errors indicated with text + icon, not color

### Touch Targets
- [ ] Interactive elements: 48px × 48px minimum
- [ ] Spacing between targets: 8px minimum
- [ ] Mobile touch targets are adequately sized

---

## Dimension 6: Attributes & Data Persistence

### Block Attributes Definition
- [ ] Block defines all attributes in block.json
- [ ] Image attribute type: `object` with `url`, `id`, `alt`, `title`
- [ ] Text attribute type: `string` (rich text)
- [ ] Heading level attribute type: `string` (enum: h1-h6)
- [ ] Alignment attribute type: `string` (enum: left, center, right)
- [ ] Custom CSS class attribute type: `string`
- [ ] All attributes have default values

### Attribute Validation
- [ ] Image URL validation (must be valid URL)
- [ ] Image ID validation (must be numeric)
- [ ] Text content validation (no XSS potential)
- [ ] Heading level validation (must be h1-h6)
- [ ] Alignment validation (enum values only)
- [ ] CSS class validation (no special characters)

### Data Serialization
- [ ] Block attributes serialize correctly to HTML comment
- [ ] JSON attributes properly escaped
- [ ] Nested objects serialize correctly
- [ ] Array attributes serialize correctly
- [ ] Special characters handled correctly

### Data Persistence
- [ ] Attributes saved on block save
- [ ] Attributes loaded from saved HTML on block load
- [ ] Attributes persist across page save/reload
- [ ] Attributes persist across block move
- [ ] Attributes persist across undo/redo

### Content Lock
- [ ] Block can be locked (if supports.lock enabled)
- [ ] Locked blocks not editable
- [ ] Locked blocks not deletable
- [ ] Lock state persists

### Migrations
- [ ] Old block versions migrate data correctly
- [ ] Deprecated attributes mapped to new attributes
- [ ] No data loss during migration
- [ ] Migration functions idempotent
- [ ] Fallback values for missing attributes

### Custom Post Meta
- [ ] If using custom meta, registered in block.json
- [ ] Meta values save correctly
- [ ] Meta values load correctly
- [ ] Meta sanitized on save
- [ ] Meta escaped on output

---

## Dimension 7: Theme.json Integration

### Color Tokens
- [ ] Overlay text color uses theme.json color token
- [ ] Background overlay color uses theme color token
- [ ] Fallback color defined if token not found
- [ ] Color variations respect theme palette
- [ ] Custom colors can be applied if enabled

### Typography Tokens
- [ ] Heading font-family from theme.json typography
- [ ] Heading font-size from theme.json scale
- [ ] Heading font-weight from theme.json preset
- [ ] Description font-family from theme.json
- [ ] Description font-size from theme.json scale
- [ ] Line-height follows theme preset

### Spacing Tokens
- [ ] Padding uses theme.json spacing scale
- [ ] Margin uses theme.json spacing scale
- [ ] Gap (between elements) uses spacing scale
- [ ] No hardcoded pixel values for spacing

### Breakpoints
- [ ] Breakpoints defined in theme.json used in block
- [ ] Media queries reference theme breakpoints
- [ ] Responsive behavior matches theme definitions
- [ ] Mobile-first approach followed

### Responsive Settings
- [ ] Font sizes responsive (mobile to desktop)
- [ ] Spacing responsive across breakpoints
- [ ] Image sizes responsive based on container

### CSS Custom Properties
- [ ] CSS variables defined in theme.json used
- [ ] Fallback values provided
- [ ] No duplicated styles outside vars
- [ ] Color inheritance through CSS vars

### Block Variations
- [ ] Block registered in theme.json blockTypes
- [ ] Variations defined in block.json or theme.json
- [ ] Default variation set correctly
- [ ] Variation attributes merge correctly

### Preset Usage
- [ ] Color presets available in inspector
- [ ] Typography presets available in inspector
- [ ] Spacing presets available in inspector
- [ ] Custom value override allowed (if enabled)

### Style Inheritance
- [ ] Global styles applied to block
- [ ] Block-level styles override global
- [ ] Nested element styles work correctly
- [ ] Style specificity handled correctly

### Duotone Filters
- [ ] If image has duotone, theme.json filter used
- [ ] Duotone filter applies correctly
- [ ] Duotone updates when theme changes
- [ ] Fallback if duotone not supported

---

## Test Execution Summary

### Before Shipping
- [ ] All 7 dimensions tested and verified
- [ ] No blockers or critical issues
- [ ] Performance acceptable (LCP < 2.5s)
- [ ] Lighthouse score ≥ 90
- [ ] All tests passing in CI/CD
- [ ] Zero console errors
- [ ] Reviewed by QA team

### Sign-Off
- **Developer**: _______________  **Date**: ___________
- **QA**: _______________  **Date**: ___________
- **Product**: _______________  **Date**: ___________

---

## Coverage Metrics

Track these metrics during testing:

| Metric | Target | Status |
|--------|--------|--------|
| Jest Coverage (Lines) | 100% | __ |
| Jest Coverage (Branches) | 100% | __ |
| Jest Coverage (Functions) | 100% | __ |
| Playwright E2E Tests | 100% Pass | __ |
| BATS Shell Tests | 100% Pass | __ |
| WCAG 2.2 AAA Audit | 0 Failures | __ |
| Lighthouse Score | ≥90 | __ |
| Performance (LCP) | <2.5s | __ |
