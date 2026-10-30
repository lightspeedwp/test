# Testing References & Tool Guides

Comprehensive reference guides for testing tools, WordPress standards, and LightSpeedWP conventions. Use these for deep dives into specific topics while working through test strategies.

## Reference Files

### jest-reference.md
**Jest configuration and best practices** — Complete configuration reference
- Configuration options (testMatch, collectCoverageFrom, moduleNameMapper)
- Coverage thresholds and enforcement (100% targets)
- Mock setup patterns (@wordpress/*, async functions)
- Async test handling (jest.useFakeTimers, waitFor)
- Transform configuration (Babel, TypeScript)
- Common issues and solutions (MODULE_NOT_FOUND, timeout, etc.)
- Copy-paste ready configurations

**Use for:** Troubleshooting Jest issues, understanding moduleNameMapper, setting up mocks for @wordpress packages

---

### playwright-reference.md
**Playwright testing patterns** — Complete browser automation reference
- Locator strategies (CSS, text, ARIA, data-testid, best practices)
- Wait conditions and assertions (waitForSelector, toHaveText, etc.)
- Page object model pattern (reusable page classes)
- Visual testing setup (screenshot, toHaveScreenshot)
- Performance profiling (navigation timing, Core Web Vitals)
- Cross-browser configuration (Chrome, Firefox, Safari, mobile)
- WordPress-specific workflow patterns (block editing, login)

**Use for:** Writing Playwright tests, page object setup, visual regression testing, performance monitoring

---

### wordpress-standards.md
**WordPress testing conventions** — WordPress and LightSpeedWP standards
- Block development standards (attributes, registration, naming)
- Plugin testing requirements (activation, dependencies, hooks)
- Theme testing checklist (structure, assets, compatibility)
- Hook and filter testing (testing hook calls and outputs)
- Database testing patterns (factories, fixtures, cleanup)
- WordPress-specific test utilities (wp.data, wp.blockEditor)
- LightSpeedWP custom conventions (brand guidelines, performance)

**Use for:** Understanding WordPress testing conventions, testing blocks/plugins/themes, hook/filter validation

---

### lefthook-setup.md
**Lefthook pre-commit hook configuration** — Complete setup and deployment guide
- Installation per platform (macOS `brew install lefthook`, Linux, Windows)
- Configuration structure (YAML, glob patterns, run conditions)
- Hook commands and globs (glob matching, conditional runs)
- Failure handling (fail-on-required, skip-on-missing)
- Performance optimization (parallel execution, globbing)
- Debugging hooks (verbose logging, individual hook testing)
- GitHub Actions integration (validating hooks in CI)

**Use for:** Setting up pre-commit hooks, debugging hook issues, CI/CD integration

---

### theme-utils-reference.md
**Theme-utils.mjs validation utilities** — Design token validation patterns
- Adapted from WordPress core and Twenty Twenty-Five
- Theme attribute structure (colors, typography, spacing, breakpoints)
- Block attribute validation (schema, required, serialization)
- Design token consistency checking (naming, scale ratios)
- Template hierarchy validation (index, singular, archive)
- Custom validator implementation (extending validation)
- Token mapping to CSS custom properties

**Use for:** Theme.json validation, design token validation, theme structure checking

## How to Use

1. Choose the reference relevant to your tool/topic
2. Find the section addressing your question
3. Reference examples and patterns
4. Apply to your project

## Tool Documentation Links

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Lefthook Docs](https://lefthook.dev/usage/configuration)
- [WordPress Block Handbook](https://developer.wordpress.org/block-editor/)
- [theme.json Reference](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/)

---

See SKILL.md for when to consult these references.
