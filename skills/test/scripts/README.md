# Testing Utility Scripts

Reusable JavaScript scripts for testing validation and analysis.

## Scripts

### theme-utils-validator.js
Validate theme.json and design tokens:
```bash
node scripts/theme-utils-validator.js --theme-json=path/to/theme.json
```

Checks:
- Theme structure validity
- Design token consistency
- Color palette validation
- Typography scale checks
- Spacing consistency

### wp-cli-checks.js
Run WordPress theme validation:
```bash
node scripts/wp-cli-checks.js --theme=path/to/theme
```

Validates:
- Theme compliance
- Block registration
- Plugin standards
- Custom checks for LightSpeedWP

### coverage-analyzer.js
Analyze Jest coverage gaps:
```bash
node scripts/coverage-analyzer.js --coverage-report=coverage/coverage-final.json
```

Identifies:
- Files below coverage threshold
- Untested functions
- Missing test cases
- Coverage trends

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
