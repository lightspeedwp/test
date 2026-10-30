---
name: test
description: "Expert WordPress testing and QA automation for comprehensive test coverage, configuration debugging, and production-ready quality assurance. Specializes in Jest & BATS configuration, WordPress block theme/plugin testing, 100% coverage enforcement, Playwright E2E testing, WP-CLI theme validation, and WCAG 2.2 AAA accessibility. Debug failing tests, enforce 100% pass rates and coverage thresholds, validate theme.json specs, integrate GitHub Actions CI/CD. Use this skill whenever debugging Jest/BATS configs, testing WordPress blocks, enforcing coverage, creating Playwright tests, validating designs, auditing accessibility, or running comprehensive test strategies with Lefthook pre-commit hooks."
---

# WordPress Testing & QA Expert Skill

Expert-level test automation and quality assurance for WordPress block themes and plugins.

## What This Skill Does

Transforms product requirements into comprehensive test strategies and production-ready test code:

- **Jest configuration & debugging** — Config issues, module mapping, coverage enforcement  
- **WordPress block testing** — 7-dimension testing (registration, editor, frontend, responsive, accessibility, attributes, theme.json)  
- **100% coverage enforcement** — Gap analysis, test design, coverage validation  
- **Playwright E2E testing** — WordPress workflows, page objects, visual regression, performance  
- **BATS shell testing** — npm integration, fixtures, helpers, build script validation  
- **WP-CLI theme validation** — Adapted WordPress theme-check for LightSpeedWP  
- **Lefthook pre-commit hooks** — Automated testing before commits  
- **Theme-utils validation** — Design token validation, theme.json compliance  
- **WCAG 2.2 AAA accessibility** — Automated and manual testing workflows  

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

| Sub-Skill | Purpose | Use When |
|-----------|---------|----------|
| **test:jest-config** | Debug Jest setup, enforce coverage | Jest issues, coverage gaps |
| **test:wordpress-blocks** | Block development & testing | Building/testing blocks |
| **test:coverage-validation** | Coverage analysis & enforcement | Coverage dropped or below target |
| **test:playwright-wordpress** | E2E & visual regression | WordPress feature testing |
| **test:bats-shell** | Shell script testing | Testing build/deploy scripts |
| **test:wp-cli-checks** | WordPress theme validation | Theme compliance checking |

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

## Resources

**Framework Docs:**
- [Jest](https://jestjs.io/) — JavaScript testing
- [Playwright](https://playwright.dev/) — E2E testing
- [BATS](https://github.com/bats-core/bats-core) — Shell script testing
- [Lefthook](https://lefthook.dev/) — Pre-commit hooks

**WordPress:**
- [Block Handbook](https://developer.wordpress.org/block-editor/)
- [theme.json Reference](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/)
- [WP-CLI](https://developer.wordpress.org/cli/commands/)

**Accessibility:**
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [Playwright a11y](https://playwright.dev/docs/accessibility-testing)

---

**Version:** 2.0 | **Updated:** 2026-10-30 | **LightSpeedWP QA Expert Skill**
