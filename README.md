# WordPress Testing & QA Expert Skill

Comprehensive testing and QA automation for WordPress block themes, plugins, and sites. This repository contains a production-ready skill designed to help teams implement consistent, high-quality testing across WordPress projects.

## What's Inside

**48-File Skill Package:**
- 🎯 **Master Skill** — `skills/test/SKILL.md` (500+ lines of expert guidance)
- 🔧 **8 Specialized Prompts** — Jest debugging, WordPress block testing, coverage analysis, Playwright E2E, BATS shell testing, theme validation, design tokens
- 📚 **5 Reference Guides** — Comprehensive guides for Jest, Playwright, WordPress standards, Lefthook, and theme utilities
- 🛠️ **3 Validator Scripts** — Automated tools for coverage analysis, theme validation, and WP-CLI checks
- 📖 **8 Documentation Guides** — Complete testing framework documentation
- ✅ **Pre-Commit Hooks** — Lefthook configuration for automated testing before commits

**Evaluation Workspace:**
- Full results from 10 test runs (5 test domains, with-skill vs baseline)
- Benchmark data showing 13% faster WordPress block testing
- Example outputs from all test scenarios
- Complete timing and token metrics

## Quick Start

**Using the Skill:**
1. **Install**: Copy `skills/test/` to `~/.claude/skills/test/`
2. **Invoke**: Use `/test` in Claude to access WordPress testing expertise
3. **Reference**: See [skills/test/CONTINUATION_PROMPT.md](skills/test/CONTINUATION_PROMPT.md) for session documentation

**Key Capabilities:**
- ⚡ **Jest Configuration** — Debug config issues with clear patterns and examples
- 🧪 **WordPress Block Testing** — 7-dimension testing matrix (registration, editor, frontend, responsive, accessibility, attributes, theme.json)
- 📊 **Coverage Enforcement** — Close gaps with 6-layer enforcement strategy
- 🎭 **Playwright E2E** — WordPress workflows with page objects and visual regression
- 🐚 **BATS Shell Testing** — 59+ shell script tests with helpers and fixtures
- 🔍 **WCAG 2.2 AAA** — Comprehensive accessibility validation
- 🎨 **Theme.json Validation** — Design token and structure validation
- 🔐 **Pre-Commit Automation** — Lefthook hooks prevent bad code from landing

## Repository Structure

```
.
├── skills/test/                  # Main skill (48 files)
│   ├── SKILL.md                  # Master skill definition
│   ├── CONTINUATION_PROMPT.md    # Session documentation
│   ├── prompts/                  # 8 specialized sub-skills
│   ├── references/               # 5 reference guides
│   ├── scripts/                  # 3 validator scripts
│   ├── docs/                     # 8 framework guides
│   ├── evals/                    # 5 test case definitions
│   └── lefthook.yml              # Pre-commit configuration
├── test-skill-workspace/         # Evaluation workspace
│   └── iteration-1/              # Complete test results
│       ├── benchmark.json        # Aggregated metrics
│       └── [5 test domains]/     # Full results per domain
├── README.md                     # This file
├── CHANGELOG.md                  # Release notes
├── CLAUDE.md                     # Claude Code instructions
├── AGENTS.md                     # Available agents
└── docs/
    ├── CONTRIBUTING.md           # Contribution guidelines
    └── [other docs]/
```

## Documentation

**For Skill Users:**
- **[skills/test/SKILL.md](skills/test/SKILL.md)** — Complete skill reference and navigation guide
- **[skills/test/prompts/](skills/test/prompts/)** — Specialized prompts for different testing workflows
- **[skills/test/references/](skills/test/references/)** — Deep-dive reference guides
- **[skills/test/docs/](skills/test/docs/)** — Framework documentation (Jest, Playwright, BATS, PHP, etc.)

**For Contributors:**
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** — How to contribute to this repository
- **[CLAUDE.md](CLAUDE.md)** — Claude Code configuration and instructions
- **[AGENTS.md](AGENTS.md)** — Available agents in this repository

**Evaluation & Reference:**
- **[test-skill-workspace/iteration-1/benchmark.json](test-skill-workspace/iteration-1/benchmark.json)** — Full evaluation results and metrics
- **[skills/test/CONTINUATION_PROMPT.md](skills/test/CONTINUATION_PROMPT.md)** — Complete session documentation

## Evaluation Results

All 5 test domains evaluated successfully (⭐⭐⭐⭐⭐):
- **jest-config-debug** — Excellent — Clear debugging patterns with examples
- **bats-shell-test** — Excellent — 59 comprehensive tests with 40+ helpers
- **coverage-gap-analysis** — Outstanding — 50+ prioritized cases + 6-layer enforcement
- **wordpress-block-testing** — Excellent — **13.2% faster** than baseline
- **playwright-e2e-test** — Comprehensive — 44+ test cases with page objects

**Key Metrics:**
- Tokens: +12.1% (richer output)
- Duration: +33.2% (more comprehensive)
- Quality: Consistent ⭐⭐⭐⭐⭐ across domains

## Getting Started

### Install the Skill
```bash
cp -r skills/test ~/.claude/skills/test
```

### Invoke in Claude Code
```
/test "Debug my Jest configuration. [paste config]"
/test "Test WordPress block across 7 dimensions"
/test "Close coverage gaps in my test suite"
```

### View Evaluation Results
```bash
cat test-skill-workspace/iteration-1/benchmark.json
```

## Organization Standards

This repository follows **LightSpeedWP's organization-wide standards** for:

- ✅ **Branching Strategy** — [Branch naming & types](https://github.com/lightspeedwp/.github/blob/develop/docs/BRANCHING_STRATEGY.md)
- ✅ **Labels** — [Issue & PR labels](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml)
- ✅ **Issue/PR Templates** — [Standardized workflows](https://github.com/lightspeedwp/.github/tree/develop/.github/ISSUE_TEMPLATE)
- ✅ **Changelog Rules** — [Consistent release notes](https://github.com/lightspeedwp/.github/blob/develop/.github/changelog-rules.yml)

All configurations are maintained in [`lightspeedwp/.github`](https://github.com/lightspeedwp/.github) as the single source of truth.

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on contributing to this repository.

## License

This skill is maintained by LightSpeedWP. See CHANGELOG.md for version history and CLAUDE.md for development instructions.