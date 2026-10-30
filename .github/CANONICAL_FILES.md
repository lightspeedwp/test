# Canonical Files Reference

This repository inherits configuration from the organization-wide canonical files.

## Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| `branch-types.yml` | [`.github/branch-types.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml) | Branch type → PR template mapping, branch naming rules |
| `labels.yml` | [`.github/labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml) | Canonical labels for issues and PRs |
| `branch-labels.yml` | [`.github/branch-labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-labels.yml) | Automatic labels based on branch type |
| `issue-types.yml` | [`.github/issue-types.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/issue-types.yml) | Issue type definitions and workflows |
| `changelog-rules.yml` | [`.github/changelog-rules.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/changelog-rules.yml) | Changelog entry format and rules |
| `labeler.yml` | [`.github/labeler.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/labeler.yml) | File-based auto-labeling rules |

## Templates

| Template | Location | Trigger |
|----------|----------|---------|
| PR Templates | [`.github/PULL_REQUEST_TEMPLATE/`](https://github.com/lightspeedwp/.github/tree/develop/.github/PULL_REQUEST_TEMPLATE) | Branch type (from `branch-types.yml`) |
| Issue Templates | [`.github/ISSUE_TEMPLATE/`](https://github.com/lightspeedwp/.github/tree/develop/.github/ISSUE_TEMPLATE) | Issue creation |

## Strategy Documents

| Document | Location |
|----------|----------|
| Branching Strategy | [`docs/BRANCHING_STRATEGY.md`](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md) |
| Organization Guidelines | [`docs/GUIDELINES.md`](https://github.com/lightspeedwp/.github/blob/develop/docs/GUIDELINES.md) |
| Contributing Guide | [`CONTRIBUTING.md`](../CONTRIBUTING.md) (local) |

## How to Use

### Creating a Branch

1. Read the [Branching Strategy](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md)
2. Choose a valid type from [`branch-types.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml)
3. Use the **branch-validation** skill to validate your branch name:
   ```bash
   /branch-validation
   ```
4. Create your branch following the format: `<type>/<kebab-case-description>`

### Creating an Issue

1. Check the issue type at [`issue-types.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/issue-types.yml)
2. Select the matching issue template
3. Follow the template structure

### Creating a PR

1. Your branch type (from `branch-types.yml`) determines which template is used
2. Complete the template as instructed
3. Labels from [`branch-labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-labels.yml) are automatically applied

### Writing Changelog Entries

Follow [`changelog-rules.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/changelog-rules.yml) for format and structure.

## Requesting Changes

To request changes to canonical files:

1. Open an issue at [`lightspeedwp/.github`](https://github.com/lightspeedwp/.github/issues)
2. Use title: `[LABEL-UPDATE-REQUEST]` or similar prefix
3. Describe the change needed and why

**Do not** create local copies of canonical files in this repository.
