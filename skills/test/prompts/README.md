# Expert Testing Prompts

Specialized prompts for WordPress testing scenarios. Use these with the `/test` skill to guide comprehensive test design and validation.

## Prompt Library

### jest-config-debug.md
Debugging Jest configuration issues:
- testMatch and module mapping
- Coverage threshold enforcement
- Mock setup and teardown
- Async test handling
- Transform configuration

**When to use:** Jest tests failing, coverage gaps, configuration errors

### wordpress-blocks-testing.md
Comprehensive WordPress block testing strategy:
- 7-dimension testing matrix (registration, editor, frontend, responsive, accessibility, attributes, theme.json)
- Test case templates for each dimension
- Playwright E2E test examples
- Accessibility testing patterns
- Theme.json validation

**When to use:** Building/testing WordPress blocks, need complete testing strategy

### coverage-enforcement.md
Closing coverage gaps and enforcing 100% coverage:
- Coverage gap analysis methodology
- Identifying untested code paths
- Test design strategies for different scenarios
- Coverage threshold configuration
- Integration with CI/CD

**When to use:** Coverage dropped, need to reach 100%, enforce thresholds

### playwright-wordpress-testing.md
End-to-end testing for WordPress:
- Page object patterns for WordPress
- WordPress-specific workflows (login, post creation, block editing)
- Visual regression testing
- Performance profiling
- Cross-browser testing

**When to use:** Writing E2E tests, testing WordPress workflows, visual validation

### bats-shell-testing.md
Shell script testing with BATS:
- BATS framework setup
- npm script integration
- Fixtures and helper functions
- Error handling and assertions
- Test organization and reporting

**When to use:** Testing build/deploy scripts, shell script validation

### wp-cli-theme-validation.md
WordPress theme validation using WP-CLI and theme-check:
- Adapted theme-check for LightSpeedWP
- Validation rules and checks
- Theme compliance verification
- Automated validation in CI/CD
- Custom check implementation

**When to use:** Theme validation, compliance checking, CI/CD integration

### theme-utils-validation.md
Design token and theme.json validation:
- Theme-utils.mjs patterns
- Design token consistency
- theme.json structure validation
- Token mapping to code
- Responsive design validation

**When to use:** Theme development, design token validation, theme.json compliance

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

See parent skill SKILL.md for overview and when to use each prompt.
