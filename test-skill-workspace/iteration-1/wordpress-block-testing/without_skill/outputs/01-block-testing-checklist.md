# WordPress Hero Block Testing Checklist

## Block: Hero Section with Image and Text Overlay

A comprehensive testing checklist covering all aspects of block development, registration, and quality assurance.

---

## Phase 1: Block Registration & Setup

### Block Manifest (block.json)
- [ ] Block name follows namespace convention (e.g., `namespace/hero-section`)
- [ ] Block slug is unique and not conflicting with Core or other plugins
- [ ] Title and description are clear and user-facing
- [ ] Icon is properly defined (dashicon or custom SVG)
- [ ] Category is appropriate (common, embed, text, media, etc.)
- [ ] Keywords are relevant for block discovery
- [ ] Supports array includes required features:
  - [ ] `align` - full width capability
  - [ ] `anchor` - custom HTML ID
  - [ ] `className` - custom CSS classes
  - [ ] `html` - false (if not needed)
- [ ] Example object provides default content preview
- [ ] renderCallback (if dynamic) points to valid PHP function
- [ ] Script handles enqueued correctly
- [ ] Style handles enqueued for editor and frontend
- [ ] Editable props defined in attributes

### Block Attributes
- [ ] All attributes defined with correct types (string, boolean, object, array)
- [ ] Default values provided for each attribute
- [ ] Image attribute has proper source configuration
- [ ] Text overlay attributes support rich text editing
- [ ] Alignment attributes defined
- [ ] Dimension attributes (width, height) defined
- [ ] Opacity/overlay settings defined
- [ ] Animation/effect toggles if applicable

### PHP Registration (register_block_type)
- [ ] Block registered in correct hook (init)
- [ ] Block.json path resolves correctly
- [ ] Render callback function exists and is accessible
- [ ] Script/style dependencies are minimal and correct
- [ ] No PHP warnings or notices during registration

---

## Phase 2: Editor UI & UX

### Block Selection & Insertion
- [ ] Block appears in inserter with correct icon
- [ ] Block can be searched by name and keywords
- [ ] Block inserts with default content/example
- [ ] Block name and description visible in inserter
- [ ] Category grouping is logical
- [ ] Block can be inserted via `/` slash command (if applicable)

### Editor Inspector Controls
- [ ] Inspector panel loads without errors
- [ ] Image upload control functional:
  - [ ] Media upload button works
  - [ ] Image preview shows in inspector
  - [ ] Alt text field editable
  - [ ] Image removal works
  - [ ] Image replacement works
- [ ] Text overlay controls present:
  - [ ] Text content editable
  - [ ] Font size adjustable
  - [ ] Color picker works for text
  - [ ] Color picker works for overlay background
- [ ] Alignment controls functional
- [ ] Opacity slider works (0-100%)
- [ ] Position controls (if applicable)

### Editor Canvas
- [ ] Block renders in editor
- [ ] Image displays in editor
- [ ] Text overlay visible in editor
- [ ] Inspector changes reflect immediately in editor
- [ ] Block can be selected/deselected
- [ ] Block toolbar shows correct options
- [ ] Drag-and-drop reordering works
- [ ] Block deletion/undo/redo works
- [ ] No layout shifts during editing

### Block Controls & Toolbar
- [ ] Block toolbar displays in editor
- [ ] Alignment buttons present and functional
- [ ] More options button reveals inspector controls
- [ ] Toolbar matches block functionality
- [ ] Edit button focus management correct

---

## Phase 3: Frontend Rendering & Display

### Static Block Rendering
- [ ] Block renders without `<script>` errors on frontend
- [ ] Image displays correctly
- [ ] Text overlay positioned correctly
- [ ] Background overlay applies
- [ ] Colors render as configured
- [ ] No console errors in browser
- [ ] Block HTML structure is semantic

### Content Display
- [ ] Image alt text displays correctly
- [ ] Text overlay content readable
- [ ] Line breaks preserved in text
- [ ] Special characters render correctly
- [ ] Links in text work (if enabled)
- [ ] Emphasis (bold, italic) renders

### Dynamic Block Rendering (if applicable)
- [ ] Server-side rendering works
- [ ] PHP render callback executed
- [ ] Context/attributes passed correctly
- [ ] Output matches static version
- [ ] No PHP errors in output
- [ ] HTML escaping prevents XSS

---

## Phase 4: Responsiveness

### Mobile (375px)
- [ ] Block layout reflows correctly
- [ ] Image scales without distortion
- [ ] Text overlay remains readable
- [ ] Font sizes scale appropriately
- [ ] Touch targets adequate (48px+)
- [ ] Overflow handled (no horizontal scroll)
- [ ] Padding/margins scale

### Tablet (768px)
- [ ] Block layout intermediate
- [ ] Image scales proportionally
- [ ] Text overlay positioned correctly
- [ ] Font sizes readable
- [ ] Layout works both portrait and landscape

### Desktop (1024px+)
- [ ] Full width layout if enabled
- [ ] Alignment options work
- [ ] Spacing/padding correct
- [ ] Image aspect ratio maintained
- [ ] Text overlay positioned as designed

### Multi-Column Layouts
- [ ] Block works in column layouts
- [ ] Block works when nested in containers
- [ ] Flex/grid constraints respected
- [ ] Width constraints honored

---

## Phase 5: WCAG 2.2 AAA Accessibility

### Semantic HTML
- [ ] Block uses appropriate heading levels
- [ ] Image wrapped in `<figure>` if needed
- [ ] Text semantically marked up
- [ ] List items marked with `<li>` if applicable
- [ ] No divs used for semantic elements

### Images & Alt Text
- [ ] Image has alt attribute
- [ ] Alt text is descriptive (not "image of...")
- [ ] Alt text under 125 characters (optimal)
- [ ] Decorative images marked with `alt=""`
- [ ] Long descriptions available if needed
- [ ] Image dimensions specified (prevents CLS)

### Color & Contrast
- [ ] Text contrast >= 7:1 (AAA for normal text)
- [ ] Text contrast >= 4.5:1 (AAA minimum)
- [ ] Heading contrast >= 7:1 (AAA)
- [ ] Link contrast >= 7:1
- [ ] Color not sole means of conveying info
- [ ] Overlay ensures text contrast over image

### Text & Typography
- [ ] Font size >= 12px (ideally >= 16px)
- [ ] Line height >= 1.5
- [ ] Letter spacing >= 0.12em
- [ ] Word spacing >= 0.16em
- [ ] Text not justified (unless CJK)
- [ ] Line length <= 80 characters (optimal)

### Focus Management
- [ ] Focus ring visible (outline >= 2px)
- [ ] Focus order logical (tabindex managed)
- [ ] Focus not trapped
- [ ] Focus indicator meets contrast >= 3:1
- [ ] Focus visible on interactive elements

### Keyboard Navigation
- [ ] All controls keyboard accessible
- [ ] No keyboard traps
- [ ] Tab order logical
- [ ] Shift+Tab works for reverse navigation
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals (if applicable)

### ARIA Labels & Roles
- [ ] Buttons have accessible labels
- [ ] Images have alt text (alt is ARIA)
- [ ] Custom roles only if necessary
- [ ] aria-label clear and concise
- [ ] aria-describedby for complex elements
- [ ] aria-hidden="true" on decorative elements

### Motion & Animation
- [ ] No auto-playing animations > 5 seconds
- [ ] Animations respect prefers-reduced-motion
- [ ] Flashing frequency < 3Hz
- [ ] Parallax effects optional (not required)
- [ ] Animation duration adjustable

### Language & Readability
- [ ] Page language declared in HTML
- [ ] Reading level appropriate
- [ ] Abbreviations expanded on first use
- [ ] Jargon minimized or explained
- [ ] Readability score >= 60 (Flesch Kincaid)

---

## Phase 6: Theme.json Integration

### Block Styling
- [ ] Block registered in theme.json blocks array
- [ ] Block inherits theme colors correctly
- [ ] Block inherits theme typography
- [ ] Custom color palettes applied
- [ ] Custom font selections work
- [ ] Border radius from theme applied
- [ ] Spacing presets from theme available

### Theme Tokens
- [ ] Block uses CSS custom properties from theme.json
- [ ] Color slugs map to theme palette
- [ ] Font family slugs work
- [ ] Font size slugs respected
- [ ] Spacing scales from theme

### Design System Compliance
- [ ] Block aligns with theme design tokens
- [ ] Block color palette subset of theme
- [ ] Block typography matches theme
- [ ] Block spacing consistent with theme
- [ ] Border styles consistent

### Responsive Design
- [ ] theme.json breakpoints work in block
- [ ] Block adapts to defined breakpoints
- [ ] Fluid typography if enabled
- [ ] Container queries if supported

---

## Phase 7: Attributes & Data Persistence

### Attribute Storage
- [ ] All inspector changes saved to attributes
- [ ] Attributes persist on save
- [ ] Attributes restore on page reload
- [ ] No data loss on block update
- [ ] Version migration if schema changes

### Serialization
- [ ] Block saves valid JSON in post_content
- [ ] Markup valid after parsing
- [ ] Attributes extractable from HTML
- [ ] No attribute data in random attributes
- [ ] Clean HTML comments for block wrap

### Database
- [ ] Post content queryable
- [ ] Attributes accessible via REST API
- [ ] No bloated post_content
- [ ] Efficient storage (no redundancy)

---

## Phase 8: Browser Compatibility

### Desktop Browsers
- [ ] Chrome/Edge (latest -1)
- [ ] Firefox (latest -1)
- [ ] Safari (latest -1)
- [ ] No console errors
- [ ] No visual regressions

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Touch interactions work

### Legacy Fallbacks
- [ ] Flexbox support (no CSS Grid only)
- [ ] CSS custom properties with fallbacks
- [ ] Graceful degradation for unsupported features

---

## Phase 9: Performance

### Load Time
- [ ] Block JS < 50KB (gzipped)
- [ ] Block CSS < 20KB (gzipped)
- [ ] Image lazy loading implemented
- [ ] Script defer/async optimized
- [ ] No blocking resources

### Rendering
- [ ] Block paints in < 100ms
- [ ] No layout shifts (CLS < 0.1)
- [ ] No jank on scroll/interaction
- [ ] Smooth animations (60fps)
- [ ] Memory usage stable

### Editor Performance
- [ ] Editor loads block in < 1s
- [ ] Inspector updates smooth
- [ ] No lag during typing
- [ ] Block selection instant
- [ ] Undo/redo responsive

---

## Phase 10: Documentation & Examples

### Code Documentation
- [ ] README.md exists in block folder
- [ ] Block purpose documented
- [ ] Attributes documented
- [ ] PHP render function documented
- [ ] Examples provided (markup, PHP)

### User Documentation
- [ ] Block settings explained
- [ ] Use cases described
- [ ] Screenshot of block included
- [ ] Common issues listed
- [ ] Troubleshooting guide included

### Development Documentation
- [ ] Build process documented
- [ ] Dependencies listed
- [ ] Development environment setup
- [ ] Testing instructions provided
- [ ] Contribution guidelines

---

## Phase 11: Regression Testing

### After Updates
- [ ] Block still registers
- [ ] Existing blocks render
- [ ] Inspector still works
- [ ] Frontend display unchanged
- [ ] No new console errors
- [ ] No broken attributes
- [ ] Old posts compatible

### Version Compatibility
- [ ] Works with supported WordPress versions
- [ ] Handles older data gracefully
- [ ] Deprecations documented
- [ ] Migration path clear

---

## Phase 12: Security

### Input Validation
- [ ] User input sanitized
- [ ] URLs validated
- [ ] Attributes type-checked
- [ ] File uploads restricted
- [ ] No eval() or similar

### Output Escaping
- [ ] HTML escaped in editor
- [ ] HTML escaped on frontend
- [ ] Attributes properly escaped
- [ ] No XSS vulnerabilities
- [ ] No SQL injection vectors

### Permissions
- [ ] Only editors can modify
- [ ] Proper user capability checks
- [ ] REST endpoints authenticated
- [ ] Nonce verification if needed

### Dependencies
- [ ] No vulnerable dependencies
- [ ] Dependencies up to date
- [ ] No unused dependencies
- [ ] Minimal external scripts

---

## Test Completion Sign-Off

- [ ] All checklist items reviewed
- [ ] Failing items documented in issues
- [ ] Known limitations noted
- [ ] Block ready for production
- [ ] Documentation complete
- [ ] Team approval obtained

**Tester Name:** ________________  
**Date:** ________________  
**Notes:** _______________________________________
