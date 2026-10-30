# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive test execution skill supporting Jest, Playwright, and PHPUnit
- Test agent for automated testing, debugging, and coverage validation
- Skill prompts for common testing scenarios
- AGENTS.md documentation for agent usage
- CLAUDE.md with project-specific instructions
- docs/ folder with testing guides

### Changed
- Reorganized repository to follow org-wide standards
- Updated README with skill overview and quick start

### Fixed
- Initial repository setup

---

## [0.1.0] - 2026-10-30

### Added
- Initial repository structure
- Test skill foundation
- Organization standards inheritance
- Branching strategy documentation
- Contributing guidelines

---

## Versioning

This project uses [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes to skill API or functionality
- **MINOR**: New features, new testing frameworks, new sub-skills
- **PATCH**: Bug fixes, documentation updates, minor improvements

## Release Process

1. Update version in relevant files
2. Add release notes to CHANGELOG.md
3. Create git tag: `git tag v<version>`
4. Push tag: `git push origin v<version>`
5. Create GitHub Release from tag

---

*Changelog maintained per [Keep a Changelog](https://keepachangelog.com/)*
