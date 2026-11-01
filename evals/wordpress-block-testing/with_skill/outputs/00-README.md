# WordPress Hero Block - Comprehensive Test Strategy

## Overview

This directory contains a complete test strategy for a WordPress hero section block (image + text overlay). The strategy covers 7 dimensions of testing and provides production-ready templates for Jest, Playwright, and BATS.

## Strategy Dimensions

1. **Block Registration & Lifecycle** — Gutenberg registration, metadata, versioning
2. **Editor UI & UX** — Block inspector, controls, toolbar, media upload
3. **Frontend Rendering** — DOM output, HTML structure, CSS classes
4. **Responsive Design** — Mobile/tablet/desktop, breakpoints, fluid layout
5. **Accessibility (WCAG 2.2 AAA)** — Color contrast, keyboard navigation, screen readers, semantic HTML
6. **Attributes & Data Persistence** — Block attribute validation, data serialization, migrations
7. **Theme.json Integration** — Design tokens, color/typography usage, responsive breakpoints

## Deliverables

| File | Purpose | Test Framework |
|------|---------|---|
| `01-block-testing-checklist.md` | 7-dimension testing checklist with acceptance criteria | Manual verification guide |
| `02-test-case-matrix.md` | Organized test cases by category with expected outcomes | Test specification |
| `03-playwright-templates.js` | E2E test templates for block editor and frontend | Playwright |
| `04-bats-examples.bats` | Shell script tests for block build and validation | BATS |
| `05-accessibility-checklist.md` | WCAG 2.2 AAA compliance checklist with tools | Accessibility audit |
| `06-theme-json-validation.md` | Theme.json schema requirements and validation | JSON Schema |
| `jest-hero-block.test.js` | Unit tests for block attributes and utilities | Jest |

## Quick Start

### 1. Unit Tests (Jest)
```bash
npm install --save-dev jest @testing-library/react
npm test -- jest-hero-block.test.js --coverage
```

### 2. E2E Tests (Playwright)
```bash
npm install --save-dev @playwright/test
npx playwright test hero-block.spec.js
```

### 3. Shell Tests (BATS)
```bash
npm install --save-dev bats
bats hero-block.bats
```

### 4. Accessibility Validation
- Use WCAG 2.2 AAA checklist (05-accessibility-checklist.md)
- Run axe DevTools in block editor
- Test with keyboard navigation
- Verify with screen reader

### 5. Theme.json Validation
- Validate structure against WordPress schema
- Check color token definitions
- Verify breakpoint definitions
- Test responsive behavior

## Testing Philosophy

✅ **Dimension-Based Testing** — Each dimension has dedicated test cases  
✅ **Multiple Frameworks** — Jest for units, Playwright for E2E, BATS for build  
✅ **100% Coverage** — All code paths, branches, and edge cases  
✅ **Accessibility First** — WCAG 2.2 AAA validation included  
✅ **CI/CD Ready** — All tests suitable for GitHub Actions  

## Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Line Coverage | 100% | — |
| Branch Coverage | 100% | — |
| Function Coverage | 100% | — |
| Statement Coverage | 100% | — |
| WCAG 2.2 AAA | Pass | — |
| Theme.json | Valid | — |

## Directory Structure

```
project/
├── __tests__/
│   └── hero-block/
│       ├── hero-block.test.js          # Jest unit tests
│       └── fixtures/
│           └── theme.json               # Test fixtures
├── tests/
│   ├── hero-block.bats                 # BATS shell tests
│   └── helpers.bash                    # BATS helpers
├── e2e/
│   └── hero-block.spec.js             # Playwright E2E tests
├── blocks/
│   ├── hero/
│   │   ├── block.json
│   │   ├── edit.js
│   │   ├── save.js
│   │   ├── style.scss
│   │   ├── editor.scss
│   │   └── render.php
│   └── ...
├── theme.json                          # WordPress block theme config
└── jest.config.js
```

## Validation Checklist

Before shipping the block:

- [ ] All Jest tests pass (100% coverage)
- [ ] All Playwright E2E tests pass
- [ ] All BATS shell tests pass
- [ ] WCAG 2.2 AAA accessibility audit complete
- [ ] Theme.json validates against schema
- [ ] No console errors in block editor
- [ ] No console errors on frontend
- [ ] Responsive design verified (mobile/tablet/desktop)
- [ ] Screenshot tests passing
- [ ] Performance benchmarks acceptable
- [ ] CI/CD pipeline green

## Next Steps

1. Review the testing checklist (01-block-testing-checklist.md)
2. Study the test case matrix (02-test-case-matrix.md)
3. Set up Jest tests using templates
4. Configure Playwright for E2E testing
5. Add BATS shell tests for build validation
6. Run accessibility audit (05-accessibility-checklist.md)
7. Validate theme.json (06-theme-json-validation.md)
8. Integrate into CI/CD pipeline

## References

- [WordPress Block API](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [Jest Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright WordPress](https://playwright.dev/)
- [WCAG 2.2 AAA Guidelines](https://www.w3.org/WAI/WCAG22/quickref/?currentsetting=level:aaa)
- [Theme.json Specification](https://developer.wordpress.org/themes/block-themes/theme-json-reference/)

---

**Test Strategy Created**: 2026-10-30  
**Block Type**: Hero Section (Image + Text Overlay)  
**Coverage Target**: 100% (Line, Branch, Function, Statement)  
**Accessibility Target**: WCAG 2.2 AAA
