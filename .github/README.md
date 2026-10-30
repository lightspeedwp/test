# .github — Organization Standards Configuration

This directory contains GitHub configuration for the `lightspeedwp/test` repository.

## Canonical Files

This repository **inherits all configuration from [`lightspeedwp/.github/develop`](https://github.com/lightspeedwp/.github/tree/develop)** as the single source of truth.

- **Branch Strategy**: [`branch-types.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-types.yml)
- **Labels**: [`labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml)
- **Branch Labels**: [`branch-labels.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/branch-labels.yml)
- **Issue Types**: [`issue-types.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/issue-types.yml)
- **Changelog Rules**: [`changelog-rules.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/changelog-rules.yml)
- **Labeler Rules**: [`labeler.yml`](https://github.com/lightspeedwp/.github/blob/develop/.github/labeler.yml)

## PR Templates

Pull request templates are inherited from:
- [`lightspeedwp/.github/PULL_REQUEST_TEMPLATE/`](https://github.com/lightspeedwp/.github/tree/develop/.github/PULL_REQUEST_TEMPLATE)

The template used depends on your branch type (as defined in `branch-types.yml`).

## Issue Templates

Issue templates are inherited from:
- [`lightspeedwp/.github/ISSUE_TEMPLATE/`](https://github.com/lightspeedwp/.github/tree/develop/.github/ISSUE_TEMPLATE)

## Workflows

GitHub Actions workflows should reference canonical workflow definitions when available.

See [`lightspeedwp/.github/blob/develop/.github/workflows/`](https://github.com/lightspeedwp/.github/tree/develop/.github/workflows) for organization-wide workflows.

## Local Overrides

**Do not create local copies of canonical files.** If you need to override organization defaults for this specific repository, document the reason in an issue at [`lightspeedwp/.github`](https://github.com/lightspeedwp/.github/issues).

## Contributing

Refer to [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for contribution guidelines and standards.
