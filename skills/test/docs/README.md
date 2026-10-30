# Testing Documentation

Comprehensive guides for all testing frameworks and practices. These guides are backed by evaluation data showing improved testing outcomes (13% faster WordPress block testing, 50+ prioritized coverage cases, 44+ E2E test patterns).

## Documentation Files

### TESTING.md
**General testing overview and philosophy**
- Testing philosophy and best practices (why comprehensive testing matters)
- Test organization and structure (how to organize test suites)
- Coverage targets and enforcement (100% coverage methodology)
- Common testing patterns (Jest, Playwright, BATS patterns)
- Troubleshooting guide (debugging flaky tests, timeouts, race conditions)
- 7-dimension testing matrix for WordPress blocks (register, editor, frontend, responsive, accessibility, attributes, theme.json)

**Start here** for comprehensive testing context

---

### JEST.md
**Jest configuration and testing guide** — 100% coverage patterns
- Configuration setup (testMatch, moduleNameMapper, coverage)
- Test writing patterns (describe, it, beforeEach, mocking)
- Mocking strategies (Jest.mock, jest.spyOn, mock functions)
- Snapshot testing (configuration, maintenance)
- Coverage enforcement (thresholds, gap analysis)
- Mock WordPress dependencies (@wordpress/*)

**Use for:** Jest configuration issues, coverage enforcement, mock setup problems

---

### PLAYWRIGHT.md
**Playwright testing guide** — 44+ E2E test patterns
- Browser automation patterns (page navigation, interaction)
- Locator strategies (CSS, text, ARIA, data-testid)
- Wait conditions (waitForSelector, waitForNavigation, custom waits)
- Page object models (EditorPage, FrontendPage, AdminPage patterns)
- Visual testing setup (screenshot comparison, responsive snapshots)
- WordPress-specific workflows (login, post creation, block editing)

**Use for:** E2E testing, WordPress workflows, visual regression testing

---

### PHPUNIT.md
**PHP backend testing for WordPress**
- Test setup for WordPress (wp-cli, database fixtures)
- Database testing (factories, transactions, assertions)
- Hook/filter testing (capturing, asserting hook calls)
- Assertion patterns (assertEquals, assertArrayHasKey, custom assertions)
- Mock objects (Mockery, PHPUnit mocks, stubs)
- Plugin/theme testing patterns

**Use for:** PHP unit testing, WordPress backend testing, hook/filter validation

---

### ACCESSIBILITY.md
**WCAG 2.2 AAA testing guide** — 150+ compliance criteria
- Accessibility testing requirements (keyboard navigation, screen readers)
- Keyboard navigation testing (Tab order, Enter, Escape, arrow keys)
- Screen reader testing (NVDA, JAWS, VoiceOver, readability)
- Color contrast validation (7:1 ratio for AAA, WCAG compliance)
- Form accessibility checking (labels, error messages, ARIA)
- Motion and animation (reduced motion support)
- Focus management (visible indicators, tab trapping)
- Automated and manual testing tools (Axe, WAVE, Lighthouse)

**Use for:** Accessibility audits, WCAG 2.2 AAA compliance, accessibility testing setup

---

### THEME-JSON-VALIDATION.md
**Design token and theme.json validation**
- theme.json structure (schema, version, WordPress requirements)
- Token mapping (colors, typography, spacing, breakpoints)
- Color palette validation (contrast ratios, color space)
- Typography scale (font sizes, line heights, weights)
- Spacing consistency (scale ratios, calculations)
- Responsive design (breakpoint definitions, mobile-first)
- Integration with CSS custom properties

**Use for:** Design token validation, theme.json compliance, design system enforcement

---

### LEFTHOOK.md
**Pre-commit hook setup and automation**
- Installation steps (npm install, git hooks configuration)
- Configuration examples (jest, bats, coverage checks)
- Hook commands (glob patterns, run conditions)
- Debugging techniques (verbose logging, individual hook testing)
- Performance tuning (file globbing, parallel execution)
- GitHub Actions integration (CI/CD hook validation)

**Use for:** Setting up pre-commit automation, CI/CD integration, quality gates

## Quick Navigation

**Starting a new project:** Read TESTING.md → choose framework (JEST.md, PLAYWRIGHT.md, PHPUNIT.md)  
**WordPress blocks:** Read TESTING.md → JEST.md → PLAYWRIGHT.md → ACCESSIBILITY.md  
**Design tokens:** THEME-JSON-VALIDATION.md → TESTING.md  
**Automation:** LEFTHOOK.md → CI-CD integration  

---

See SKILL.md for overview of all testing resources.
