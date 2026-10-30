# CLAUDE.md — Project Instructions

Project-specific instructions for Claude Code when working on the lightspeedwp/test repository.

## Project Overview

**Repository**: lightspeedwp/test  
**Purpose**: Comprehensive testing skill and infrastructure for LightSpeedWP projects  
**Frameworks**: Jest (JavaScript), Playwright (E2E), PHPUnit (PHP)  
**Owner**: Ashley (ashley@lightspeedwp.agency)

## Standards & Conventions

### Branching Strategy

Follow LightSpeedWP's organization-wide strategy:
- See: [BRANCHING_STRATEGY.md](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md)
- See: [branch-types.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml)
- Use `/branch-validation` skill before creating branches

**Branch Format**: `<type>/<kebab-case-description>`

**Valid Types**:
- `feat/` — New feature or enhancement
- `fix/` — Bug fix
- `docs/` — Documentation
- `test/` — Tests or testing infrastructure
- `refactor/` — Code refactoring
- `chore/` — Maintenance, dependencies

**Forbidden Prefixes**: `claude/`, `copilot/`, `openai/`

### Labels & Issues

- Use org-wide canonical labels from [labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml)
- Follow issue templates from [.github/ISSUE_TEMPLATE/](https://github.com/lightspeedwp/.github/tree/develop/.github/ISSUE_TEMPLATE)
- Apply labels via branch type automation or labeling skill

### Testing Requirements

**Minimum Coverage**: 80% statements, 75% branches, 80% functions, 80% lines

**Test Types**:
1. **Unit Tests** — Jest for JavaScript/TypeScript logic
2. **Integration Tests** — Jest + PHPUnit for system interactions
3. **E2E Tests** — Playwright for user workflows
4. **Accessibility** — WCAG 2.2 AAA compliance via Playwright

**Before Committing**:
```bash
npm run test               # Jest unit tests
npm run test:e2e           # Playwright E2E tests
npm run test:coverage      # Coverage validation
composer test              # PHPUnit (if PHP project)
```

### Accessibility (A11y)

**Standard**: WCAG 2.2 AAA (Level AAA compliance required)  
**Decision**: D3 Decision (Ash Shaw, 2026-10-25)  
**Validation**: All tests include accessibility checks

Tests must verify:
- ✅ Keyboard navigation for all interactive elements
- ✅ Screen reader announcements (ARIA labels)
- ✅ Color contrast: 7:1 normal text, 4.5:1 large text
- ✅ Form inputs with proper labels and error messages
- ✅ Focus management during navigation

## Workflow

### Creating a Feature

1. Create branch: `feat/feature-name`
   ```bash
   git checkout -b feat/feature-name
   ```
2. Make changes
3. Write/update tests
4. Validate coverage: `npm run test:coverage`
5. Commit with clear message
6. Push and create PR

### Writing Tests

**Jest Tests**:
- Location: `src/**/__tests__/`, `*.test.ts`
- Run: `npm run test:unit:watch`
- Coverage: `npm run test:coverage`

**Playwright E2E Tests**:
- Location: `e2e/`, `tests/e2e/`
- Run: `npm run test:e2e` or `npm run test:e2e:debug`
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Safari

**PHPUnit Tests**:
- Location: `tests/`
- Run: `composer test`
- Coverage: `./vendor/bin/phpunit --coverage-html coverage/`

### Debugging Tests

Use the Test Agent:
```
"Debug the failing checkout flow E2E test"
"Run jest in watch mode for this component"
"Check coverage for authentication module"
```

Or run directly:
```bash
npm run test:unit:watch              # Jest watch
npm run test:e2e:debug               # Playwright debug
npm run test:e2e:ui                  # Playwright UI
./vendor/bin/phpunit -v tests/...   # PHPUnit verbose
```

### Before Pushing

```bash
npm run test                # Run all tests
npm run test:coverage       # Generate coverage report
npm run lint                # Lint check (if configured)
git status                  # Verify clean working tree
```

## Repository Structure

```
lightspeedwp/test/
├── AGENTS.md                      # This file + agent documentation
├── CLAUDE.md                      # Project-specific instructions (this file)
├── CHANGELOG.md                   # Release notes and changes
├── CONTRIBUTING.md                # Contribution guidelines (org standards)
├── README.md                       # Project overview
│
├── skills/test/                   # Test execution skill
│   ├── SKILL.md                   # Skill definition
│   ├── prompts/                   # Skill prompts for testing scenarios
│   │   ├── run-all-tests.md
│   │   ├── debug-failing-test.md
│   │   ├── coverage-report.md
│   │   └── a11y-validation.md
│   ├── scripts/                   # Helper scripts
│   └── references/                # Documentation references
│
├── docs/                          # Project documentation
│   ├── TESTING.md                 # Testing guides and best practices
│   ├── JEST.md                    # Jest-specific documentation
│   ├── PLAYWRIGHT.md              # Playwright-specific documentation
│   └── PHPUNIT.md                 # PHPUnit-specific documentation
│
├── .github/
│   ├── README.md                  # Explanation of org standards
│   ├── CANONICAL_FILES.md         # Quick reference to canonical configs
│   ├── ISSUE_TEMPLATE/            # (inherited from lightspeedwp/.github)
│   └── PULL_REQUEST_TEMPLATE/     # (inherited from lightspeedwp/.github)
│
├── LICENSE
└── package.json (or composer.json for PHP)
```

## Key Files

| File | Purpose |
|------|---------|
| [CLAUDE.md](CLAUDE.md) | Project instructions (this file) |
| [AGENTS.md](AGENTS.md) | Available agents documentation |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution & org standards |
| [skills/test/SKILL.md](skills/test/SKILL.md) | Test execution skill definition |
| [docs/TESTING.md](docs/TESTING.md) | Testing guides (create if needed) |

## Org-Wide Canonical References

This repo inherits from `lightspeedwp/.github/develop`:

- **Branching Strategy**: [docs/BRANCHING_STRATEGY.md](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md)
- **Branch Types**: [.github/branch-types.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml)
- **Labels**: [.github/labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml)
- **PR Templates**: [.github/PULL_REQUEST_TEMPLATE/](https://github.com/lightspeedwp/.github/tree/develop/.github/PULL_REQUEST_TEMPLATE)

## Attribution

All commits include:
```
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

All PRs include:
```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Questions or Issues?

- **Testing questions**: Check [skills/test/SKILL.md](skills/test/SKILL.md)
- **Org-wide standards**: See [lightspeedwp/.github](https://github.com/lightspeedwp/.github)
- **Branch validation**: Use `/branch-validation` skill
- **Branching help**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

*Last Updated: 2026-10-30*  
*Owner: ashley@lightspeedwp.agency*
