# Playwright E2E Test Suite - File Index

Complete Playwright test suite for WordPress block plugin release workflow with page objects, accessibility checks, responsive testing, and error scenarios.

## Quick Navigation

### Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide (START HERE!)
- **[README.md](./README.md)** - Comprehensive documentation
- **[package.json](./package.json)** - Dependencies and npm scripts

### Core Test Files
- **[block-release.e2e.spec.ts](./block-release.e2e.spec.ts)** - Main test suite (592 lines)
  - Step 1: Create custom block in editor
  - Step 2: Save and publish post
  - Step 3: Verify frontend rendering
  - Step 4: Responsive design testing
  - Accessibility checks
  - Error scenarios
  - Visual regression testing

- **[advanced.example.spec.ts](./advanced.example.spec.ts)** - Advanced testing patterns (487 lines)
  - Custom block configuration
  - Nested blocks
  - Block variations
  - Frontend rendering
  - Interactive elements
  - Performance testing
  - Advanced accessibility

### Page Object Models
- **[editor.page.ts](./editor.page.ts)** - WordPress editor interactions (252 lines)
  - Block insertion (keyboard/GUI)
  - Post title management
  - Draft/publish workflow
  - Block manipulation
  - Undo/redo
  - Content retrieval

- **[frontend.page.ts](./frontend.page.ts)** - Frontend verification (294 lines)
  - Post navigation
  - Block verification
  - Responsive design checks
  - Performance metrics
  - Interactive element testing
  - Content validation

### Testing Utilities
- **[a11y.utils.ts](./a11y.utils.ts)** - Accessibility testing (293 lines)
  - WCAG 2.2 compliance checks
  - Heading hierarchy validation
  - Keyboard navigation testing
  - Form accessibility
  - Color contrast checking
  - ARIA attribute validation

- **[test.utils.ts](./test.utils.ts)** - Common test helpers (455 lines)
  - Unique post generation
  - Network monitoring
  - Screenshot capture
  - Performance measurement
  - DOM stability checks
  - Form interactions
  - Console/network tracking

### Configuration
- **[playwright.config.ts](./playwright.config.ts)** - Playwright configuration (62 lines)
  - Multi-browser setup (Chrome, Firefox, Safari)
  - Mobile emulation (Pixel 5, iPhone 12)
  - Tablet emulation (iPad Pro)
  - Screenshots/video on failure
  - HTML/JSON/JUnit reporting

- **[.env.example](./.env.example)** - Environment template (25 lines)
  - WordPress URL configuration
  - Credentials template
  - Test settings
  - Performance thresholds
  - Accessibility settings

### Documentation
- **[TESTING_STRATEGY.md](./TESTING_STRATEGY.md)** - Testing approach (535 lines)
  - Test organization hierarchy
  - Execution strategies (quick/standard/comprehensive)
  - Maintenance schedule
  - Debugging procedures
  - Flaky test handling
  - Performance testing
  - Accessibility checklist
  - Cross-browser matrix

- **[VISUAL_REGRESSION_GUIDE.md](./VISUAL_REGRESSION_GUIDE.md)** - Visual testing (437 lines)
  - Visual regression overview
  - Baseline creation/updates
  - Masking dynamic content
  - Screenshot comparison
  - CI/CD integration
  - Troubleshooting
  - Best practices

## File Statistics

| File | Type | Lines | Purpose |
|------|------|-------|---------|
| block-release.e2e.spec.ts | Test | 592 | Main E2E test suite |
| advanced.example.spec.ts | Test | 487 | Advanced patterns |
| editor.page.ts | Page Object | 252 | Editor interactions |
| frontend.page.ts | Page Object | 294 | Frontend verification |
| a11y.utils.ts | Utility | 293 | Accessibility testing |
| test.utils.ts | Utility | 455 | Common helpers |
| README.md | Docs | 478 | Full documentation |
| TESTING_STRATEGY.md | Docs | 535 | Testing approach |
| VISUAL_REGRESSION_GUIDE.md | Docs | 437 | Visual testing guide |
| QUICK_START.md | Docs | 473 | Quick setup (5 min) |
| playwright.config.ts | Config | 62 | Playwright config |
| package.json | Config | 41 | Dependencies |
| .env.example | Config | 25 | Environment template |
| **TOTAL** | | **4,399** | Complete suite |

## Test Coverage

### Editor Tests (Step 1)
- ✅ Editor loads successfully
- ✅ Add post titles
- ✅ Insert blocks via keyboard shortcut
- ✅ Insert blocks via GUI
- ✅ Fill block content
- ✅ Undo/redo functionality
- ✅ Detect unsaved changes

### Publishing Tests (Step 2)
- ✅ Save as draft
- ✅ Publish posts
- ✅ Handle publish errors
- ✅ Verify multi-block posts

### Frontend Tests (Step 3)
- ✅ Block renders correctly
- ✅ Content matches editor
- ✅ No broken images/elements
- ✅ CSS classes applied
- ✅ No console errors

### Responsive Tests (Step 4)
- ✅ Desktop rendering (1920×1080)
- ✅ Tablet rendering (768×1024)
- ✅ Mobile rendering (375×667)
- ✅ Text overflow handling
- ✅ Layout responsiveness
- ✅ Touch interactions

### Accessibility Tests
- ✅ No missing alt text
- ✅ Heading hierarchy
- ✅ Keyboard navigation
- ✅ Form accessibility
- ✅ ARIA attributes
- ✅ Color contrast

### Error Scenarios
- ✅ Network errors
- ✅ Invalid configuration
- ✅ Large content (10k+ chars)
- ✅ Rapid operations
- ✅ Recovery from deletion

### Visual Regression
- ✅ Desktop baseline
- ✅ Mobile baseline
- ✅ Tablet baseline
- ✅ Diff reporting

## Installation Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install browsers
npx playwright install

# 3. Configure environment
cp .env.example .env
# Edit .env with your WordPress URL

# 4. Run tests
npm test

# 5. View report
npm run report
```

## Common Commands

```bash
# Run all tests
npm test

# Watch browser
npm run test:headed

# Interactive debug
npm run test:ui

# Mobile only
npm run test:mobile

# Specific test
npm test -g "pattern"

# View results
npm run report
```

## Page Object Usage

### Editor
```typescript
const editor = new EditorPage(page);
await editor.goto();
await editor.addPostTitle('My Post');
await editor.insertBlock('Paragraph');
await editor.publishPost();
```

### Frontend
```typescript
const frontend = new FrontendPage(page);
await frontend.gotoPost(url);
const hasBlock = await frontend.hasBlock('CustomBlock');
const isResponsive = await frontend.isBlockResponsive('CustomBlock');
```

### Accessibility
```typescript
const issues = await A11yUtils.checkPageAccessibility(page);
await A11yUtils.checkHeadingHierarchy(page);
await A11yUtils.assertNoA11yIssues(page);
```

### Test Utilities
```typescript
const title = TestUtils.generateUniquePostTitle('Test');
await TestUtils.waitForNetworkIdle(page);
const vitals = await TestUtils.measureCoreWebVitals(page);
```

## Test Organization

```
Tests/
├── Step 1: Create Custom Block
│   ├── Editor loads
│   ├── Insert blocks
│   └── Fill content
├── Step 2: Save & Publish
│   ├── Save draft
│   ├── Publish
│   └── Error handling
├── Step 3: Frontend
│   ├── Render verification
│   ├── Content accuracy
│   └── Console errors
├── Step 4: Responsive
│   ├── Desktop
│   ├── Tablet
│   └── Mobile
├── Accessibility
│   ├── WCAG compliance
│   └── Keyboard nav
├── Errors
│   ├── Network issues
│   └── Edge cases
└── Visual Regression
    ├── Baselines
    └── Diff detection
```

## Execution Strategies

### Strategy A: Quick (5 min)
```bash
npm test -- --grep "Step 1|Step 2|Step 3"
```

### Strategy B: Standard (15 min)
```bash
npm test -- --project=chromium
```

### Strategy C: Comprehensive (30 min)
```bash
npm test
npm run report
```

## Browser Support

| Browser | Status | Note |
|---------|--------|------|
| Chrome | ✅ | Primary |
| Firefox | ✅ | Secondary |
| Safari | ✅ | Webkit |
| Mobile Chrome | ✅ | Pixel 5 |
| Mobile Safari | ✅ | iPhone 12 |
| Tablet | ✅ | iPad Pro |

## Accessibility Support

- ✅ WCAG 2.2 Level AA
- ✅ Keyboard navigation
- ✅ Screen reader compatible
- ✅ Color contrast (4.5:1)
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ ARIA attributes

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| INP | < 100ms | Interaction to Next Paint |
| CLS | < 0.1 | Cumulative Layout Shift |
| Memory | < 50MB | Test run overhead |

## Reporting

- HTML reports with screenshots
- JSON format for CI integration
- JUnit XML for test management
- Trace files for debugging
- Video recording on failure
- Network traffic logging

## CI/CD Ready

Includes templates for:
- GitHub Actions
- GitLab CI
- Jenkins
- Other CI systems

## Documentation Map

1. **New to testing?** → Start with [QUICK_START.md](./QUICK_START.md)
2. **Need setup help?** → Read [README.md](./README.md)
3. **Want best practices?** → Check [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
4. **Visual regression?** → See [VISUAL_REGRESSION_GUIDE.md](./VISUAL_REGRESSION_GUIDE.md)
5. **Advanced patterns?** → Explore [advanced.example.spec.ts](./advanced.example.spec.ts)

## Version Information

- **Playwright:** 1.40.0+
- **Node.js:** 18+
- **WordPress:** 6.0+
- **Gutenberg:** 14.0+

## Support Resources

- [Playwright Docs](https://playwright.dev)
- [WordPress Gutenberg](https://developer.wordpress.org/block-editor/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Web Vitals](https://web.dev/vitals/)

## License

MIT

## Summary

This comprehensive E2E test suite provides:
- ✅ 4,399 lines of well-documented test code
- ✅ Page object patterns for maintainability
- ✅ Complete WordPress block workflow coverage
- ✅ Accessibility and WCAG compliance testing
- ✅ Responsive design testing (mobile/tablet/desktop)
- ✅ Error scenario handling
- ✅ Visual regression testing setup
- ✅ Performance monitoring
- ✅ Multi-browser support
- ✅ Production-ready configuration

Ready to ensure your WordPress block plugin works flawlessly across browsers, devices, and accessibility standards!
