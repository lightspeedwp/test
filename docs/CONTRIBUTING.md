# Contributing to lightspeedwP/test

Welcome! This repository contains the **WordPress Testing & QA Expert Skill** — a comprehensive testing framework for WordPress block themes, plugins, and sites.

## Overview

This repository follows **LightSpeedWP's organization-wide standards** for branching, labeling, issue types, and PR workflows.

**Before contributing:** Read the [README.md](../README.md) to understand the project structure and what's included.

All canonical configurations are maintained in [`lightspeedwp/.github`](https://github.com/lightspeedwp/.github/tree/develop) as the single source of truth.

## Branching Strategy

👉 **Read first:** [BRANCHING_STRATEGY.md](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md)

Branch names must follow this format:
```
<type>/<kebab-case-description>
```

### Valid Branch Types

All valid branch types are defined in [`branch-types.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml). Common examples:

- `feat/` — New feature or enhancement
- `fix/` — Bug fix
- `docs/` — Documentation
- `test/` — Tests or test infrastructure
- `refactor/` — Code refactoring
- `chore/` — Maintenance, dependencies
- `ci/` — CI/CD pipeline changes

### Forbidden Prefixes

These branch prefixes are prohibited organization-wide:
- `claude/`
- `copilot/`
- `openai/`

### Validation

Use the **branch-validation** skill before creating a branch to ensure compliance:
```bash
/branch-validation
```

## Issues & Pull Requests

### Issue Types

Issue types are defined in [`issue-types.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/issue-types.yml).

### PR Templates

PR templates are in [`.github/PULL_REQUEST_TEMPLATE/`](https://github.com/lightspeedwp/.github/tree/develop/.github/PULL_REQUEST_TEMPLATE). The template used depends on your branch type, as defined in `branch-types.yml`.

### Issue Templates

Issue templates are in [`.github/ISSUE_TEMPLATE/`](https://github.com/lightspeedwp/.github/tree/develop/.github/ISSUE_TEMPLATE).

## Labels

All issue and PR labels are defined in [`labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml) and [`branch-labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-labels.yml).

Labels are automatically applied based on:
- **Issue type** (from `issue-types.yml`)
- **Branch type** (from `branch-types.yml`)
- **Labeler rules** (from `labeler.yml`)

Do not create custom labels — use org-wide canonical labels only.

## Changelog

Changelog entries follow [`changelog-rules.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/changelog-rules.yml).

When committing:
```
<type>(<scope>): <description>

<body>

Closes #<issue>
```

Example:
```
feat(test): add Playwright E2E test suite

Implements comprehensive E2E testing using Playwright with support for
multiple browsers (Chromium, Firefox, WebKit, Mobile).

Closes #42
```

## Canonical File References

This repository inherits configuration from [`lightspeedwp/.github/develop`](https://github.com/lightspeedwp/.github/tree/develop):

| File | Purpose |
|------|---------|
| [`branch-types.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml) | Valid branch types and PR template routing |
| [`labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml) | Canonical issue/PR labels |
| [`branch-labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-labels.yml) | Branch-based label automation |
| [`issue-types.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/issue-types.yml) | Issue type definitions |
| [`changelog-rules.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/changelog-rules.yml) | Changelog formatting rules |
| [`labeler.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/labeler.yml) | File-based auto-labeling rules |

## Related Documentation

- [Branch Validation Skill](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md) — Validates branch names before creation
- [LightSpeedWP Organization Docs](https://github.com/lightspeedwp/.github/tree/develop/docs)

## Questions?

For questions about org-wide standards, refer to the [`lightspeedwp/.github`](https://github.com/lightspeedwp/.github) repository or open an issue there.
