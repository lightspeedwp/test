# Agents

This repository uses specialized agents for quality assurance, testing, and development automation.

## Available Agents

### Test Agent
**Path**: `~/.claude/agents/test.agent.md`

Comprehensive testing and quality assurance agent supporting:
- **Jest** — JavaScript/TypeScript unit tests
- **Playwright** — Browser E2E testing
- **PHPUnit** — PHP unit and integration tests

**Use when**:
- Running tests locally or in CI
- Debugging failing tests
- Generating coverage reports
- Validating accessibility (WCAG 2.2 AAA)
- Setting up test infrastructure

**Commands**:
- Run all tests
- Debug specific test failures
- Generate coverage reports
- Validate accessibility compliance
- Optimize test performance

**Examples**:
```
"Run all tests and generate coverage report"
"Debug why the login E2E test is failing"
"Validate WCAG 2.2 AAA compliance on forms"
```

---

## Invoking Agents

In Claude Code, use the Agent tool or mention the agent by name in your request:

```
"Use the test agent to run all tests"
"Run the test agent with coverage report"
```

---

## Agent Configuration

Agents read configuration from:
- `package.json` — NPM scripts
- `composer.json` — Composer scripts
- `jest.config.js` — Jest configuration
- `playwright.config.ts` — Playwright configuration
- `phpunit.xml` — PHPUnit configuration
- `.github/workflows/` — CI/CD workflows

---

## Creating Agents

To create a new agent for this repository:

1. Define the agent in `~/.claude/agents/<name>.agent.md`
2. Document in this file
3. Reference in project-specific instructions
4. Test agent behavior with sample prompts

See `~/.claude/agents/test.agent.md` as a template.

---

## Related Documentation

- [CLAUDE.md](CLAUDE.md) — Project-specific Claude instructions
- [skills/test/SKILL.md](skills/test/SKILL.md) — Test execution skill
- [docs/TESTING.md](docs/TESTING.md) — Testing guides and best practices
