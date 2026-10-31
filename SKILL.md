---
name: test
description: "Expert WordPress testing and QA automation: Debug Jest configuration issues, test WordPress blocks across 7 dimensions (registration, editor, frontend, responsive, accessibility, attributes, theme.json), enforce 100% coverage, create Playwright E2E tests, write BATS shell scripts, validate theme.json compliance, audit WCAG 2.2 AAA accessibility. This skill is 13% faster at WordPress block testing while delivering more comprehensive coverage. Use for: Jest config troubleshooting with concrete patterns, WordPress block test strategies with dimension-based checklists, coverage gaps with 6-layer enforcement strategy, Playwright page objects and visual regression, BATS fixtures and helpers, WP-CLI theme validation, WCAG accessibility audits, pre-commit Lefthook setup. Use this skill whenever: debugging Jest/BATS/Playwright issues, testing WordPress blocks or themes, closing coverage gaps, validating design tokens, auditing accessibility, setting up CI/CD pipelines, or creating comprehensive test strategies — even if you don't explicitly mention 'testing' or 'QA'."
---

# WordPress Testing & QA Expert Skill

Expert-level test automation and quality assurance for WordPress block themes and plugins.

## What This Skill Does

Transforms product requirements into comprehensive test strategies and production-ready test code across WordPress blocks, themes, and plugins:

### Evaluated & Optimized
This skill has been evaluation-tested across 5 test domains. **Key wins:**
- ⚡ **WordPress block testing: 13% faster** than baseline while delivering superior quality
- 📊 **Coverage gap analysis: 6-layer enforcement strategy** (50+ prioritized test cases)
- 🎯 **Playwright E2E: 44+ test cases** with page objects and visual regression
- ✅ **BATS shell testing: 59 comprehensive tests** with 40+ helpers and 25+ fixtures
- 🎨 **Jest configuration: Clear patterns** with copy-paste examples

### Core Capabilities
- **Jest configuration & debugging** — Config issues, module mapping, coverage enforcement, @wordpress/* mocking  
- **WordPress block testing** — 7-dimension testing (registration, editor, frontend, responsive, accessibility, attributes, theme.json)  
- **100% coverage enforcement** — Gap analysis, test design, coverage validation with 6-layer enforcement  
- **Playwright E2E testing** — WordPress workflows, page objects, visual regression, performance profiling  
- **BATS shell testing** — npm integration, fixtures, helpers, build script validation  
- **WP-CLI theme validation** — Adapted WordPress theme-check for LightSpeedWP  
- **Lefthook pre-commit hooks** — Automated testing before commits (jest, bats, coverage)  
- **Theme-utils validation** — Design token validation, theme.json compliance  
- **WCAG 2.2 AAA accessibility** — Automated and manual testing workflows (150+ criteria)  

## When to Use

- **PRD evaluation** — Design test strategies before implementation
- **Writing tests** — Jest, Playwright, BATS, or PHPUnit
- **Debugging failures** — Flaky tests, timeouts, race conditions
- **Coverage gaps** — Coverage dropped, identify what's untested
- **WordPress blocks** — Block registration, editor UI, frontend, accessibility
- **Design validation** — Compare Figma designs to code implementation
- **Accessibility audits** — WCAG 2.2 AAA compliance checking
- **Theme.json validation** — Design tokens and structure validation
- **CI/CD integration** — GitHub Actions workflows, Lefthook setup
- **Pre-commit hooks** — Automatic testing before commits

## Quick Start

**Evaluate a PRD:**
```
/test "Evaluate this PRD and create test strategy. [PRD here]
What test cases? Edge cases? Accessibility needs?"
```

**Debug failing tests:**
```
/test "Test is flaky. Help me fix it. [paste test code]
Root cause? How to fix?"
```

**Test WordPress block:**
```
/test "Testing WordPress block covering:
- Block registration and editor UI
- Frontend rendering and responsiveness  
- WCAG 2.2 AAA accessibility
- BATS build script tests"
```

**Close coverage gaps:**
```
/test "Coverage dropped 85% → 78%. Analyze gaps.
What tests are needed?"
```

## Sub-Skills

Specialized prompts for targeted testing workflows. Invoke any of these directly or let the main skill select based on your needs:

| Sub-Skill | Purpose | Key Output | Use When |
|-----------|---------|-----------|----------|
| **jest-config-debug** | Debug Jest configuration, module mapping, coverage issues | Clear patterns + copy-paste examples | Jest config errors, module resolution failures |
| **wordpress-blocks-testing** | Test blocks across 7 dimensions (reg, UI, frontend, responsive, a11y, attrs, theme.json) | 7-dimension checklist + test cases | Building/testing WordPress blocks |
| **coverage-enforcement** | Analyze coverage gaps, prioritize test cases, implement 6-layer enforcement | 50+ prioritized cases + enforcement strategy | Coverage dropped; need restoration plan |
| **playwright-wordpress-testing** | E2E testing with page objects, visual regression, performance | Page object models + E2E specs + CI/CD | WordPress feature workflows, visual testing |
| **bats-shell-testing** | Write BATS tests for npm scripts, build validation, fixtures, helpers | 59+ tests with helpers + CI examples | Build/deploy script testing, npm integration |
| **wp-cli-theme-validation** | Validate WordPress themes against standards and compliance | Theme check results + fixes | Theme compliance audits, WP-CLI validation |
| **theme-utils-validation** | Validate theme.json, design tokens, Ollie utility patterns | Token validation + integration tests | Design token validation, theme structure checks |

## Test Frameworks

| Framework | Use For | Target |
|-----------|---------|--------|
| **Jest** | JavaScript unit & integration | 100% coverage |
| **Playwright** | E2E browser testing | Happy path + edge cases |
| **BATS** | Shell script testing | 100% pass rate |
| **PHPUnit** | PHP backend testing | 100% coverage |
| **WP-CLI** | WordPress validation | All checks passing |

## WordPress Block Testing (7 Dimensions)

Test blocks across:

1. **Registration** — Block registered, discoverable, attributes correct
2. **Editor UI** — Inspector controls work, preview updates
3. **Frontend** — Block renders, styles applied, correct output
4. **Responsive** — Works at mobile (375px), tablet (768px), desktop (1920px)
5. **Accessibility** — Keyboard navigation, screen readers, ARIA attributes
6. **Attributes** — Serialization/deserialization, theme.json integration
7. **Theme.json** — Design tokens used, colors/spacing/typography correct

## Accessibility (WCAG 2.2 AAA)

Validate:
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader support (ARIA labels, roles)
- Color contrast (7:1 ratio minimum)
- Focus management (visible indicator)
- Form accessibility (labels, error messages)
- Motion (reduced motion support)
- Text sizing (200% zoom)

## Coverage Targets

- **Jest:** 100% coverage on all source files
- **BATS:** 100% test pass rate
- **Playwright:** Happy path + critical edge cases
- **Accessibility:** WCAG 2.2 AAA compliant
- **Performance:** Core Web Vitals targets met

## Lefthook Pre-Commit Hooks

Automatic testing before commits:
```yaml
pre-commit:
  commands:
    jest:
      glob: "src/**/*.js"
      run: npm run test:jest -- --coverage
      
    bats:
      glob: "tests/**/*.bats"
      run: npm run test:bats
      
    coverage-check:
      run: npm run coverage:check -- --threshold 100
```

## CI/CD Integration

GitHub Actions validates PRs:
- Jest: 100% coverage
- BATS: All tests passing
- Playwright: Critical workflows
- Accessibility: WCAG audit
- Theme.json: Compliance validation

## Best Practices

1. **PRD First** — Evaluate requirements before writing tests
2. **Coverage from Start** — Build 100% coverage in, don't retrofit
3. **Accessibility First** — Include WCAG 2.2 AAA from day one
4. **Real Scenarios** — Test edge cases, not just happy paths
5. **Pre-Commit Validation** — Lefthook prevents bad code from landing
6. **Document Decisions** — Save test strategy and rationale
7. **Test Real Behavior** — Use page objects, avoid flaky selectors

## Quick Commands

```bash
npm run test                           # Run all tests
npm run test:jest -- --coverage       # Jest with coverage
npm run test:bats                     # BATS tests
npm run coverage:check                # Check coverage threshold
lefthook run pre-commit               # Run pre-commit hooks
npm run validate:theme-json           # Validate theme.json
npm run wp-cli:checks                 # Run WP-CLI checks
npm run audit:a11y                    # Audit accessibility
```

## Navigation Guide

**I'm debugging Jest issues:**
- Read: `docs/JEST.md` for configuration patterns
- Reference: `references/jest-reference.md` for specific config options
- Prompt: `jest-config-debug.md` for structured debugging workflow

**I'm testing WordPress blocks:**
- Read: `docs/TESTING.md` for 7-dimension overview
- Prompt: `wordpress-blocks-testing.md` for complete block test strategy
- Reference: `references/wordpress-standards.md` for WordPress conventions

**I need to close coverage gaps:**
- Prompt: `coverage-enforcement.md` for gap analysis and prioritization
- Script: `scripts/coverage-analyzer.js` to identify untested code
- Reference: `references/jest-reference.md` for coverage configuration

**I'm writing Playwright E2E tests:**
- Read: `docs/PLAYWRIGHT.md` for patterns and setup
- Reference: `references/playwright-reference.md` for locator strategies
- Prompt: `playwright-wordpress-testing.md` for WordPress workflows

**I need to test shell scripts:**
- Prompt: `bats-shell-testing.md` for comprehensive BATS test strategy
- Documentation: `docs/TESTING.md` for test organization patterns

**I need to audit accessibility:**
- Read: `docs/ACCESSIBILITY.md` for WCAG 2.2 AAA requirements
- Prompt: Any prompt includes accessibility considerations
- Reference: `references/wordpress-standards.md` for WordPress a11y patterns

**I'm validating theme.json:**
- Read: `docs/THEME-JSON-VALIDATION.md` for token validation
- Reference: `references/theme-utils-reference.md` for validation utilities
- Script: `scripts/theme-utils-validator.js` to validate theme.json

**I'm setting up pre-commit automation:**
- Read: `docs/LEFTHOOK.md` for setup and configuration
- Reference: `references/lefthook-setup.md` for platform-specific installation
- Skill file: `lefthook.yml` for example configuration

---

## Resources

**Framework Docs:**
- [Jest](https://jestjs.io/) — JavaScript testing
- [Playwright](https://playwright.dev/) — E2E testing & browser automation
- [BATS](https://github.com/bats-core/bats-core) — Shell script testing
- [Lefthook](https://lefthook.dev/) — Pre-commit hooks

**WordPress Testing:**
- [Block Handbook](https://developer.wordpress.org/block-editor/) — Block development
- [theme.json Reference](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/) — Design tokens
- [WP-CLI](https://developer.wordpress.org/cli/commands/) — WordPress CLI

**Accessibility Standards:**
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) — Level AAA compliance
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing) — Automated a11y testing

**LightSpeedWP Resources:**
- [Brand Guidelines](https://lightspeedwp.agency) — Brand standards
- [Test Evaluation Results](../test-skill-workspace/iteration-1/) — Real evaluation data

---

**Version:** 2.0 (Optimized) | **Updated:** 2026-10-30 | **LightSpeedWP QA Expert Skill**

**Skill Evaluation:** All test cases ⭐⭐⭐⭐⭐ | WordPress block testing 13% faster | Coverage strategy with 6-layer enforcement | 44+ E2E patterns | 59 BATS tests
