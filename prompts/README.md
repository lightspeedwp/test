# Expert Testing Prompts

Specialized prompts for WordPress testing scenarios. Each prompt is evaluation-tested and delivers production-ready test strategies, patterns, and implementation guides.

**Evaluation Results:** All 5 prompts tested against baselines. WordPress block testing is **13% faster** with this skill while delivering superior quality. Coverage analysis provides **6-layer enforcement strategy**. See evaluation workspace for detailed results.

## Prompt Library

### jest-config-debug.md
**Debugging Jest configuration issues** — Configuration troubleshooting with clear patterns and copy-paste examples
- testMatch and module mapping (with mock setup patterns)
- Coverage threshold enforcement (100% target)
- Mock setup and teardown (best practices)
- Async test handling (race conditions, timeouts)
- Transform configuration (Babel, TypeScript)

**Evaluation Result:** ✓ Exceptional — Clear debugging strategy with configuration examples

**When to use:** Jest tests failing, module resolution errors, coverage configuration issues, mock setup problems

---

### wordpress-blocks-testing.md
**WordPress block testing across 7 dimensions** — Fastest comprehensive block testing strategy (13% faster than baseline)
- 7-dimension testing matrix (registration, editor, frontend, responsive, accessibility, attributes, theme.json)
- Test case templates for each dimension (150+ test scenarios)
- Playwright E2E test examples (50+ templates)
- Accessibility testing patterns (WCAG 2.2 AAA)
- Theme.json validation (design tokens, colors, typography)

**Evaluation Result:** ✓ Excellent — 7-dimension testing matrix, WCAG 2.2 AAA compliance, **13% faster** than baseline

**When to use:** Building/testing WordPress blocks, need complete testing strategy, responsive design validation needed, accessibility audit required

---

### coverage-enforcement.md
**Closing coverage gaps with 6-layer enforcement** — Comprehensive coverage analysis with restoration strategy
- Coverage gap analysis methodology (systematic identification)
- Identifying untested code paths (edge cases, error handling, async)
- Test design strategies (50+ prioritized test cases)
- Coverage threshold configuration (100% enforcement)
- 6-layer enforcement strategy (jest, hooks, CI/CD, review, phased, monitoring)

**Evaluation Result:** ✓ Outstanding — 50+ prioritized test cases with 6-layer enforcement strategy

**When to use:** Coverage dropped, need to reach 100%, enforce thresholds, design coverage restoration plan, implement CI/CD coverage gates

---

### playwright-wordpress-testing.md
**End-to-end testing for WordPress** — 44+ comprehensive test cases with page objects and visual regression
- Page object patterns for WordPress (EditorPage, FrontendPage, AdminPage)
- WordPress-specific workflows (login, post creation, block editing)
- Visual regression testing (responsive snapshots, zoom levels)
- Performance profiling (Core Web Vitals collection)
- Cross-browser testing (Chrome, Firefox, Safari, mobile)

**Evaluation Result:** ✓ Comprehensive — 44+ test cases, page objects, visual regression, responsive testing

**When to use:** Writing E2E tests, testing WordPress workflows, visual validation, responsive design testing, performance monitoring

---

### bats-shell-testing.md
**Shell script testing with BATS** — 59 comprehensive tests with helpers and fixtures
- BATS framework setup (installation, configuration)
- npm script integration (pre-commit, pre-deploy hooks)
- Fixtures and helper functions (40+ reusable helpers, 25+ fixtures)
- Error handling and assertions (graceful failures)
- Test organization and reporting (CI/CD ready)

**Evaluation Result:** ✓ Excellent — 59 comprehensive tests across 7 categories with helpers

**When to use:** Testing build/deploy scripts, shell script validation, npm integration validation, CI/CD build verification

---

### wp-cli-theme-validation.md
**WordPress theme validation** — WP-CLI and theme-check adapted for LightSpeedWP
- Adapted theme-check for LightSpeedWP standards
- Validation rules and checks (comprehensive checklist)
- Theme compliance verification (automated checks)
- Automated validation in CI/CD (GitHub Actions examples)
- Custom check implementation (extending validation)

**When to use:** Theme validation, compliance checking, CI/CD integration, quality gates for releases

---

### theme-utils-validation.md
**Design token and theme.json validation** — Token consistency and structure validation
- Theme-utils.mjs patterns (Ollie framework integration)
- Design token consistency (color, spacing, typography)
- theme.json structure validation (schema compliance)
- Token mapping to code (CSS custom properties)
- Responsive design validation (breakpoint usage)

**When to use:** Theme development, design token validation, theme.json compliance checks, design system integration

## How to Use

1. Read the relevant prompt file
2. Apply the workflow to your testing scenario
3. Follow the templates and examples
4. Adapt for your specific context

## Structure

Each prompt includes:
- **Purpose** — What this prompt addresses
- **Workflow** — Step-by-step process
- **Templates** — Copy-paste ready examples
- **Checklists** — Validation criteria
- **Tools & Resources** — Required tools and documentation

---

See the [master skill definition](../docs/SKILL.md) for a complete overview and when to use each prompt.
