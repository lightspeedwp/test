---
name: test
description: Executes and validates tests for ThisOneTimeOnAcidCom portfolio site.
metadata:
  category: quality
  enabled: 'True'
  tags: testing, validation, qa, playwright
---

# Test Execution Skill

## Purpose

Execute tests and validate test coverage for portfolio site functionality and
quality.

## Operation boundary

Inspect `package.json`, runner configuration and relevant tests before choosing
commands. Assessment reads existing evidence; running tests can write caches,
coverage, browser traces or build output and can start services. Obtain the
appropriate task authorisation before executing those operations. A missing
runner or browser is a reported prerequisite, not permission to install it.
Do not install dependencies, repair files, commit or publish results merely
because testing found a failure. Record actual command results and limits.

## Current Test Status

✅ **Test infrastructure is now available.** The following test suites are
configured in `package.json`:

- `npm run test` — Run all tests (unit, build, e2e)
- `npm run test:unit` — Jest unit tests
- `npm run test:build` — BATS build validation tests
- `npm run test:e2e` — Playwright E2E tests
- `npm run test:e2e:debug` — Playwright with debugging UI
- `npm run test:e2e:ui` — Playwright with interactive UI

This skill now supports:

## Available Test Types

### Unit Tests (Jest)

- **Location:** `src/_*tests*_/` and `*.test.ts` files
- **Coverage:** Component logic, hooks, utility functions, data transformations
- **Run:** `npm run test:unit` or `npm run test:unit:watch`

### Build Validation (BATS)

- **Location:** `tests/build.bats`
- **Coverage:** Build process, artifact generation, asset integrity
- **Validates:** _redirects file structure, CSS/JS assets, dist output correctness
- **Run:** `npm run test:build` (includes full build)

### E2E Tests (Playwright)

- **Location:** `e2e/routing.spec.ts`
- **Coverage:** User workflows, navigation paths, portfolio content display
- **Validates:** Route handling, SPA fallback, asset loading, responsive behavior
- **Run:** `npm run test:e2e` (or with debug/UI options)
- **Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Routes tested:** 7 working journal routes + fallback behavior

## When to Use

- **Before PR:** Run `npm run test` locally to validate all tests pass
- **During Development:** Use `npm run test:unit:watch` for rapid feedback
- **Before Commit:** Run build validation `npm run test:build` to ensure dist artifacts are correct
- **E2E Validation:** Run `npm run test:e2e` to verify routing and user workflows
- **After Dependency Updates:** Run full test suite to validate compatibility
- **On PR:** Automated test execution in CI validates the changes

## Accessibility Testing

**Accessibility Target (D3 Decision):** All tests validate WCAG 2.2 AAA compliance per design authority (Ash Shaw, 2026-10-25). Accessibility is not an afterthought; tests that interact with UI must verify:
- Keyboard navigation works for all interactive elements
- Screen reader announcements are correct
- Color contrast meets WCAG 2.2 AAA standards (7:1 for normal text, 4.5:1 for large text)
- Form inputs have proper labels and error messages
- Focus management during navigation

See [Accessibility Checklist](../guidelines/accessibility-checklist.md) for detailed WCAG 2.2 AAA requirements per D3 decision.

## Current Coverage

✅ **Routing & SPA:** E2E tests for 7 working journal routes + fallback behavior
✅ **Build Output:** BATS tests verify _redirects file structure and asset
generation
✅ **Asset Loading:** E2E tests validate CSS, JS, and image asset integrity
✅ **Responsive Design:** E2E tests cover mobile, tablet, and desktop viewports
✅ **Accessibility (D3):** WCAG 2.2 AAA compliance verified in E2E tests
✅ **Performance:** E2E benchmarks measure route load time and navigation speed

## Future Test Expansion

Planned additions to increase coverage:

1. **Component unit tests** – Component logic and state management

1. **Content validation** – Link integrity, image loading, mock data correctness

1. **Accessibility tests** – WCAG compliance, keyboard navigation

1. **Dark mode tests** – Light/dark theme rendering verification

1. **Integration tests** – Component interactions and data flow

## Testing Resources

- [Playwright](https://playwright.dev/) – E2E testing framework
- [Vitest](https://vitest.dev/) – Unit test runner (if added)
- `guidelines/Guidelines.md` – Testing requirements
- `CONTRIBUTING.md` – Testing conventions

## Related Skills

- [Build verification guide](../../../docs/TESTING.md) (`docs/TESTING.md` from the repository root)
- [Validation Skill](../validate/SKILL.md)
- `.github/specs/003-refactor-guidelines/spec.md` – Guidelines Refactor specification (consolidation impacts test coverage)

---

*Test execution guidance; verify current commands and report only checks actually run.*
