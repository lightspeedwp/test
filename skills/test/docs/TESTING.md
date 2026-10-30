# WordPress Testing Guide

Comprehensive testing overview and best practices.

## Testing Framework Hierarchy

```
Tests (by level)
├── Unit Tests (Jest)
│   ├── Business logic
│   ├── Utilities
│   └── Components (isolated)
├── Integration Tests (Jest)
│   ├── Component interactions
│   ├── Block rendering
│   └── Database operations
├── E2E Tests (Playwright)
│   ├── User workflows
│   ├── Block editing
│   └── Frontend rendering
└── Accessibility Tests
    ├── WCAG 2.2 AAA
    ├── Keyboard navigation
    └── Screen reader support
```

## Coverage Requirements

- **Unit:** 100% coverage
- **Integration:** Happy path + edge cases
- **E2E:** Critical user workflows
- **Accessibility:** All interactive elements

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm run test

# Run specific framework
npm run test:jest
npm run test:bats
npm run test:playwright

# Check coverage
npm run coverage:check
```

---

See JEST.md, PLAYWRIGHT.md, PHPUNIT.md, ACCESSIBILITY.md, and THEME-JSON-VALIDATION.md for framework specifics.
