# WordPress Block Plugin E2E Tests

Complete Playwright E2E test suite for WordPress block plugin release workflow. Tests block creation, editing, publishing, frontend rendering, responsive behavior, and accessibility compliance.

## Quick Start

```bash
# Install dependencies
npm install -D @playwright/test

# Set up environment
cp .env.example .env

# Run all tests
npm run test

# Run specific test file
npm run test wordpress-block-plugin.spec.ts

# Run with UI mode
npm run test:ui

# Debug specific test
npm run test:debug wordpress-block-plugin.spec.ts
```

## Test Files Overview

### Core Test Files

#### 1. `wordpress-block-plugin.spec.ts` - Main Workflow Tests
Complete end-to-end tests for the full block plugin workflow:

- **Happy path test**: Create block → Configure → Save → Publish → Verify frontend rendering
- **Block configuration**: Test all block attributes and inspector controls
- **Data persistence**: Verify block configuration survives save/reload
- **Block preview**: Test editor preview updates
- **Template patterns**: Test block in pattern templates
- **Responsive behavior**: Test across mobile (375px), tablet (768px), desktop (1920px)
- **Accessibility (WCAG 2.2 AAA)**: Heading hierarchy, color contrast, keyboard navigation, ARIA labels, focus indicators, motion preferences, zoom support

**Key Classes Used:**
- `EditorPage`: WordPress block editor interactions
- `FrontendPage`: Published site verification
- `AdminPage`: WordPress admin operations

#### 2. `error-scenarios.spec.ts` - Edge Cases & Error Handling
Comprehensive error and edge case testing:

- Missing required attributes
- Invalid color values
- Concurrent edits handling
- Broken markup recovery
- Large content handling (100KB+)
- Rapid save operations
- Special characters in titles
- Undo/redo functionality
- Network interruptions
- Multiple blocks performance
- Server-side errors
- Post deletion handling
- Missing dependencies

#### 3. `visual-regression.spec.ts` - Visual Consistency Tests
Automated visual regression testing across viewports:

- **Desktop/Mobile/Tablet snapshots**: Full page and block-specific
- **Color schemes**: Light and dark mode
- **Motion preferences**: Reduced motion testing
- **Zoom levels**: 75%, 125%, 200% zoom support
- **Font sizes**: System font rendering
- **Hover/Focus states**: Interactive element states
- **Multiple blocks**: Layout with multiple block instances
- **Editor appearance**: Block editor and inspector panel
- **Responsive layouts**: Consistency across viewports

#### 4. `playwright.config.ts` - Test Configuration
Comprehensive Playwright configuration:

- Multi-browser testing (Chrome, Firefox, Safari)
- Device emulation (iPhone, iPad, Android)
- Screenshot and video capture on failure
- HTML reporting
- Trace collection for debugging
- Parallel execution
- Custom retries and timeouts

## Page Objects

### EditorPage (`pages/editor.page.ts`)
Abstracts WordPress block editor interactions:

```typescript
// Create new post
await editorPage.createNewPost('Post Title');

// Insert block
await editorPage.insertBlock('Custom Feature Block');

// Configure block attributes
await editorPage.configureBlock({
  title: 'Block Title',
  description: 'Block Description',
  backgroundColor: '#f0f0f0',
  textColor: '#333333',
});

// Get block configuration
const config = await editorPage.getBlockInspectorValues();

// Save and publish
await editorPage.savePost();
const postUrl = await editorPage.publishPost();
```

**Methods:**
- `createNewPost(title)` - Create new post
- `insertBlock(name)` - Insert block by name
- `getBlock(name)` - Get block element
- `configureBlock(config)` - Set block attributes
- `getBlockInspectorValues()` - Read inspector panel
- `savePost()` - Save draft
- `publishPost()` - Publish and get URL
- `getCurrentPostId()` - Get post ID
- `createAndPublishBlockPost()` - Full workflow
- `insertPattern(name)` - Insert pattern

### FrontendPage (`pages/frontend.page.ts`)
Abstracts published site verification:

```typescript
// Navigate to post
await frontendPage.navigateToPost(postUrl);

// Wait for block render
await frontendPage.waitForBlockRender('Custom Feature Block');

// Get render info
const info = await frontendPage.getBlockRenderInfo('Custom Feature Block');

// Verify content
const isValid = await frontendPage.verifyBlockContent('Custom Feature Block', {
  '.title': 'Block Title',
  '.description': 'Block Description',
});

// Get performance metrics
const metrics = await frontendPage.measureCoreWebVitals();

// Test at viewport
const renderInfo = await frontendPage.testAtViewport('Custom Feature Block', 375, 812);
```

**Methods:**
- `navigateToPost(url)` - Navigate to published post
- `waitForBlockRender(name)` - Wait for block to render
- `getBlockRenderInfo()` - Get render information
- `verifyBlockContent()` - Verify content matches
- `getBlockInteractiveElements()` - Get buttons, links, inputs
- `clickBlockElement()` - Click element in block
- `getBlockBackgroundImage()` - Get background image URL
- `getBlockClasses()` - Get CSS classes
- `measureCoreWebVitals()` - Measure LCP, FID, CLS
- `getBlockImages()` - Get all images
- `testAtViewport()` - Test at specific size
- `getBlockScrollInfo()` - Get scroll position
- `validateBlockStructure()` - Validate HTML
- `takeBlockScreenshot()` - Take screenshot
- `measureBlockDimensions()` - Get width/height

### AdminPage (`pages/admin.page.ts`)
Abstracts WordPress admin operations:

```typescript
// Ensure logged in
await adminPage.ensureLoggedIn();

// Activate plugin
await adminPage.activatePlugin('plugin-slug');

// Check if plugin active
const isActive = await adminPage.isPluginActive('plugin-slug');

// Get WordPress version
const version = await adminPage.getWordPressVersion();

// Get error/success messages
const errors = await adminPage.getErrorMessages();
const messages = await adminPage.getSuccessMessages();
```

**Methods:**
- `ensureLoggedIn(credentials?)` - Ensure authenticated
- `login(username, password)` - Log in
- `logout()` - Log out
- `navigateToPlugins()` - Go to plugins page
- `activatePlugin(slug)` - Activate plugin
- `deactivatePlugin(slug)` - Deactivate plugin
- `isPluginActive(slug)` - Check activation status
- `navigateToBlockPatterns()` - Go to patterns page
- `createNewPattern(name)` - Create pattern
- `savePattern()` - Save pattern
- `navigateToSettings()` - Go to settings
- `getWordPressVersion()` - Get WP version
- `getActivePlugins()` - List active plugins
- `runSiteHealthCheck()` - Get site health
- `clearCache()` - Clear cache
- `getErrorMessages()` - Get error notifications
- `getSuccessMessages()` - Get success notifications

## Fixtures

### `fixtures/viewports.ts` - Viewport Configuration
Standard viewport configurations and helpers:

```typescript
// Standard viewports
VIEWPORTS.mobile          // 375x812
VIEWPORTS.tablet          // 768x1024
VIEWPORTS.desktop         // 1920x1080
VIEWPORTS.iphone12        // Device emulation
VIEWPORTS.ipad            // Device emulation
VIEWPORTS.androidPhone    // Device emulation

// Breakpoints
BREAKPOINTS.mobile        // 480px
BREAKPOINTS.tablet        // 1024px
BREAKPOINTS.desktop       // 1280px

// Helper functions
getMobileViewports()      // Get all mobile configs
getDesktopViewports()     // Get all desktop configs
isMobileViewport(width)   // Check if mobile size
isTabletViewport(width)   // Check if tablet size
getTestScenario(name)     // Get scenario viewports
```

### `fixtures/test-config.ts` - Test Configuration
Global test configuration:

```typescript
// Test configuration
testConfig.baseURL        // e.g., http://localhost:8080
testConfig.timeout        // 30 seconds
testConfig.retries        // 2 retries
testConfig.workers        // 1 worker

// Credentials
testUser.username         // admin
testUser.password         // password

// Block plugin config
blockPluginConfig.pluginSlug    // custom-feature-block
blockPluginConfig.blockName     // Custom Feature Block

// A11y targets (WCAG 2.2 AAA)
a11yConfig.minContrastRatio     // 7:1
a11yConfig.minTouchTargetSize   // 44px
a11yConfig.minTextSize          // 14px

// Performance targets
performanceConfig.lcp.good      // 2.5s
performanceConfig.fid.good      // 100ms
performanceConfig.cls.good      // 0.1

// Get environment-specific config
getConfigForEnvironment('ci')   // CI config
getConfigForEnvironment('staging') // Staging config
```

## Environment Setup

### `.env` Configuration

```bash
# WordPress site
BASE_URL=http://localhost:8080

# WordPress credentials
WP_TEST_USERNAME=admin
WP_TEST_PASSWORD=password
WP_TEST_EMAIL=admin@example.local

# Plugin configuration
PLUGIN_SLUG=custom-feature-block
PLUGIN_NAME=Custom Feature Block
BLOCK_NAME=Custom Feature Block
BLOCK_NAMESPACE=lightspeedwp

# Test configuration
TEST_TIMEOUT=30000
NAV_TIMEOUT=30000
ACTION_TIMEOUT=10000
TEST_RETRIES=2
WORKERS=1
HEADLESS=true
SLOW_MOTION=0

# Visual regression
UPDATE_SNAPSHOTS=false
```

## Running Tests

### All Tests
```bash
npm run test
```

### Specific Test File
```bash
npm run test wordpress-block-plugin.spec.ts
```

### Specific Test Suite
```bash
npm run test --grep "should complete full block plugin workflow"
```

### Specific Browser
```bash
npm run test -- --project=chromium
npm run test -- --project=firefox
npm run test -- --project=webkit
```

### Mobile Device Testing
```bash
npm run test -- --project=iphone-12
npm run test -- --project=android-chrome
npm run test -- --project=chromium-tablet
```

### Accessibility Tests Only
```bash
npm run test -- --project=chromium-a11y
```

### Visual Regression Tests
```bash
npm run test -- --project=visual-regression
```

### Error Scenario Tests
```bash
npm run test -- --project=error-scenarios
```

### UI Mode (Interactive)
```bash
npm run test:ui
```

### Debug Mode
```bash
npm run test:debug wordpress-block-plugin.spec.ts
```

### Report
```bash
npm run test:report
```

### Update Visual Snapshots
```bash
UPDATE_SNAPSHOTS=true npm run test -- --project=visual-regression
```

## Test Coverage

### Functionality
- ✅ Block creation in editor
- ✅ Block configuration (attributes)
- ✅ Block serialization/persistence
- ✅ Save and publish workflow
- ✅ Frontend rendering
- ✅ Block template patterns
- ✅ Block preview in editor

### Responsive Design (WCAG 2.2)
- ✅ Mobile (375px)
- ✅ Tablet (768px)
- ✅ Desktop (1920px)
- ✅ Orientation changes
- ✅ Touch target size (44px minimum)
- ✅ Text readability at all sizes
- ✅ Layout adaptation

### Accessibility (WCAG 2.2 AAA)
- ✅ Heading hierarchy (no skips)
- ✅ Color contrast (7:1 ratio)
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support (ARIA labels)
- ✅ Focus indicators (visible)
- ✅ Reduced motion preference
- ✅ 200% zoom support
- ✅ Semantic HTML

### Error Handling
- ✅ Missing attributes
- ✅ Invalid values
- ✅ Concurrent edits
- ✅ Broken markup
- ✅ Large content
- ✅ Network interruptions
- ✅ Server errors
- ✅ Memory/performance

### Visual Regression
- ✅ Desktop screenshots
- ✅ Mobile screenshots
- ✅ Tablet screenshots
- ✅ Light/dark mode
- ✅ Reduced motion
- ✅ Zoom levels (75%, 125%, 200%)
- ✅ Hover/focus states
- ✅ Multiple blocks

### Performance
- ✅ Core Web Vitals (LCP, FID, CLS)
- ✅ Page load time
- ✅ Multiple blocks performance
- ✅ Large content handling

## CI/CD Integration

### GitHub Actions

```yaml
name: Playwright E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test -- --project=chromium --project=firefox
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

## Debugging

### With UI
```bash
npm run test:ui
```

### With Inspector
```bash
npm run test:debug wordpress-block-plugin.spec.ts
```

### View Trace
```bash
npx playwright show-trace test-results/traces/trace.zip
```

### View Report
```bash
npx playwright show-report
```

## Best Practices

1. **Page Objects**: Use page objects for maintainability
2. **Wait Strategies**: Use `waitForSelector` for specific elements
3. **Timeouts**: Configure per-action timeouts
4. **Error Handling**: Test error scenarios explicitly
5. **Accessibility**: Include a11y checks in all tests
6. **Visual Regression**: Update snapshots when intentional
7. **Environment**: Use `.env` for configuration
8. **Parallel**: Run tests in parallel when safe
9. **Retries**: Configure retries for flaky tests
10. **Reporting**: Review HTML reports for failures

## Troubleshooting

### Tests Timing Out
- Increase `timeout` in `.env`
- Check WordPress performance
- Verify plugin is activated
- Check network connectivity

### Block Not Found
- Verify plugin slug in config
- Check block name spelling
- Ensure plugin is activated
- Check block is registered

### Flaky Tests
- Add explicit waits
- Use stable selectors
- Increase retry count
- Check for race conditions

### Screenshot Diffs
- Review expected vs actual
- Update snapshots if intentional
- Check viewport size
- Verify fonts are loaded

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [WordPress Block Handbook](https://developer.wordpress.org/block-editor/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [LightSpeedWP Testing Standards](https://github.com/lightspeedwp/standards)

## Contributing

When adding new tests:

1. Use page objects for interactions
2. Include accessibility checks
3. Test responsive behavior
4. Add error scenarios
5. Document test purpose
6. Update this README

## License

Proprietary - LightSpeedWP
