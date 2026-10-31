# WordPress Testing & QA Documentation

Complete documentation for the WordPress Testing & QA Expert Skill — testing frameworks, CI/CD integration, accessibility guidelines, and development workflows.

## Core Documentation

### Getting Started
- **[SKILL.md](SKILL.md)** — Master skill definition with the complete navigation guide, testing matrix, and all frameworks
- **[CONTINUATION_PROMPT.md](CONTINUATION_PROMPT.md)** — Session documentation, evaluation results, and how to resume the skill-creator workflow

### Testing Frameworks

**Jest Configuration**
- **[JEST.md](../docs/JEST.md)** — Jest configuration patterns, debugging strategies, and TypeScript/React mocking

**Playwright E2E Testing**
- **[PLAYWRIGHT.md](../docs/PLAYWRIGHT.md)** — End-to-end testing with Playwright, page objects, visual regression, and WordPress workflows

**PHP Unit Testing**
- **[PHPUNIT.md](../docs/PHPUNIT.md)** — PHP unit testing patterns, WordPress testing libraries, and fixture setup

### WordPress & Web Standards

**Testing Domains**
- **[TESTING.md](../docs/TESTING.md)** — Overview of testing domains, 7-dimension block testing, and test strategies
- **[TESTING-DOMAINS-EXTENSION.md](../docs/TESTING-DOMAINS-EXTENSION.md)** — Extended testing patterns and edge cases

**Accessibility & WCAG**
- **[ACCESSIBILITY.md](ACCESSIBILITY.md)** — WCAG 2.2 AAA compliance criteria, audit checklist, and accessibility validation

**Theme & Design Validation**
- **[THEME-JSON-VALIDATION.md](THEME-JSON-VALIDATION.md)** — theme.json structure validation, design tokens, and best practices

**Pre-Commit Hooks**
- **[LEFTHOOK.md](LEFTHOOK.md)** — Lefthook configuration, hook setup, and pre-commit automation

### Team & Project Resources

**Contributing Guidelines**
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — How to contribute to this repository, branch naming, PR workflow, and LightSpeedWP standards

**Usage & Training**
- **[USAGE-GUIDE.md](../docs/USAGE-GUIDE.md)** — How to use the skill effectively in different workflows
- **[TEAM-TRAINING.md](../docs/TEAM-TRAINING.md)** — Training materials for team onboarding and skill development

**CI/CD Integration**
- **[CI-CD-INTEGRATION.md](../docs/CI-CD-INTEGRATION.md)** — GitHub Actions setup, test automation, and deployment pipelines

## Quick Reference

### By Use Case

**I need to debug Jest configuration:**
→ Start with [JEST.md](../docs/JEST.md), then reference the examples in [SKILL.md](SKILL.md)

**I'm testing WordPress blocks:**
→ Read [TESTING.md](../docs/TESTING.md) for the 7-dimension framework, then use prompts in `../prompts/wordpress-block-testing.md`

**I need to validate accessibility:**
→ Use [ACCESSIBILITY.md](ACCESSIBILITY.md) as your WCAG 2.2 AAA checklist

**I'm setting up E2E testing:**
→ Follow [PLAYWRIGHT.md](../docs/PLAYWRIGHT.md) for patterns and page objects

**I want to enforce code quality:**
→ Configure [LEFTHOOK.md](LEFTHOOK.md) for pre-commit hooks

### By Role

**Developers:**
- [SKILL.md](SKILL.md) — Full reference
- [TESTING.md](../docs/TESTING.md) — Understanding the testing matrix
- [JEST.md](../docs/JEST.md), [PLAYWRIGHT.md](../docs/PLAYWRIGHT.md), [PHPUNIT.md](../docs/PHPUNIT.md) — Framework guides

**QA Engineers:**
- [TESTING-DOMAINS-EXTENSION.md](../docs/TESTING-DOMAINS-EXTENSION.md) — Test case design
- [ACCESSIBILITY.md](ACCESSIBILITY.md) — Compliance auditing
- [THEME-JSON-VALIDATION.md](THEME-JSON-VALIDATION.md) — Design validation

**Team Leads:**
- [TEAM-TRAINING.md](../docs/TEAM-TRAINING.md) — Onboarding and training
- [CONTRIBUTING.md](CONTRIBUTING.md) — Standards and workflows
- [CI-CD-INTEGRATION.md](../docs/CI-CD-INTEGRATION.md) — Pipeline setup

**Maintainers:**
- [CONTINUATION_PROMPT.md](CONTINUATION_PROMPT.md) — Resuming development
- [CONTRIBUTING.md](CONTRIBUTING.md) — Contribution workflow
- [CI-CD-INTEGRATION.md](../docs/CI-CD-INTEGRATION.md) — Release process

## File Organization

- **SKILL.md** — Master skill definition (500+ lines)
- **Framework Guides** — Jest, Playwright, PHPUnit (configuration, patterns, examples)
- **Standards & Compliance** — Accessibility (WCAG 2.2 AAA), Testing domains, Theme validation
- **Operational** — Contributing guidelines, CI/CD setup, Team training
- **Session Documentation** — Continuation prompt and evaluation results

## Related Resources

- **[../README.md](../README.md)** — Repository overview and quick start
- **[../CLAUDE.md](../CLAUDE.md)** — Claude Code configuration
- **[../CHANGELOG.md](../CHANGELOG.md)** — Version history and release notes
- **[Prompts](../prompts/)** — 8 specialized sub-skills for specific workflows
- **[References](../references/)** — Deep-dive guides and reference materials
- **[Scripts](../scripts/)** — Validator scripts and CI/CD helpers
- **[Evaluation Results](../test-skill-workspace/)** — Full benchmark data and test outputs

---

**Last Updated:** 2026-10-31  
**Maintained By:** LightSpeedWP  
**License:** See LICENSE file in repository root
