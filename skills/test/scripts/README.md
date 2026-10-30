# Testing Utility Scripts

Production-ready JavaScript scripts for testing validation and analysis. Each script is designed to run in CI/CD pipelines, pre-commit hooks, or locally during development.

## Scripts

### theme-utils-validator.js
**Validate theme.json and design tokens against LightSpeedWP standards**
```bash
node scripts/theme-utils-validator.js --theme-json=path/to/theme.json --strict
```

**Validates:**
- Theme structure (schema compliance)
- Design token consistency (colors, spacing, typography)
- Color palette validation (7:1 contrast ratios for WCAG 2.2 AAA)
- Typography scale (font size ratios, line heights)
- Spacing consistency (scale ratios)
- Breakpoint definitions (responsive design)

**Output:** JSON report with validation results, violations, and recommendations

**When to use:**
- Design token validation in PR workflows
- Theme.json compliance checks
- Design system enforcement
- CI/CD quality gates

---

### wp-cli-checks.js
**Run WordPress theme validation and compliance checks**
```bash
node scripts/wp-cli-checks.js --theme=path/to/theme --wp-version=6.5
```

**Validates:**
- Theme compliance (WordPress.org standards)
- Block registration (discoverable, attributes correct)
- Plugin standards (activation, dependencies)
- LightSpeedWP custom checks (brand guidelines, performance)
- Security best practices (input validation, escaping)

**Output:** Report with pass/fail status, violations, remediation steps

**When to use:**
- Pre-release theme validation
- Block theme compliance checking
- Security audits
- CI/CD release gates

---

### coverage-analyzer.js
**Analyze Jest coverage gaps and identify untested code**
```bash
node scripts/coverage-analyzer.js --coverage-report=coverage/coverage-final.json --threshold=100
```

**Identifies:**
- Files below coverage threshold (with file paths and line numbers)
- Untested functions (prioritized by criticality)
- Missing test cases (edge cases, error paths, async)
- Coverage trends (week-over-week improvement/regression)
- Recommendations (which tests to write first)

**Output:** Structured JSON + markdown report with actionable recommendations

**When to use:**
- Coverage gap analysis (evaluation workflow)
- Enforcing 100% coverage targets
- Prioritizing test writing (what to test first)
- Weekly coverage trend tracking
- Pre-commit coverage validation

## Usage

Each script includes:
- Required arguments
- Output format
- Exit codes
- Example output

Run with `--help` for detailed usage:
```bash
node scripts/theme-utils-validator.js --help
```

## Integration

Use in package.json scripts:
```json
{
  "scripts": {
    "validate:theme-json": "node scripts/theme-utils-validator.js",
    "wp-cli:checks": "node scripts/wp-cli-checks.js",
    "coverage:analyze": "node scripts/coverage-analyzer.js"
  }
}
```

---

See individual script files for detailed documentation.
