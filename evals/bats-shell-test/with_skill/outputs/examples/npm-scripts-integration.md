# NPM Scripts Integration Guide

This guide explains how to integrate npm scripts with BATS shell tests for WordPress build and deployment validation.

## Overview

The BATS test suite validates:
1. Node modules installation
2. NPM build with 100% coverage
3. Theme.json validation
4. Deployment artifacts creation

## npm Scripts Configuration

### Build Scripts

```bash
# Main build script - runs all validation
npm run build

# Theme validation
npm run build:theme

# Webpack bundle
npm run build:webpack

# Watch mode for development
npm run watch
```

### Test Scripts

```bash
# Run all tests (Jest + BATS)
npm test

# Jest tests with coverage report
npm run test:jest

# BATS shell tests
npm run test:bats

# Generate coverage report
npm run test:coverage

# Verify coverage meets threshold
npm run coverage:check
```

### Validation Scripts

```bash
# Validate theme.json structure
npm run validate:theme

# Check coverage threshold
npm run coverage:check

# Run all validations
npm run validate:all

# Lint code
npm run lint
npm run lint:fix
```

## Integration Points

### Pre-Build Validation

The `prebuild` script runs before `npm run build`:

```bash
npm run prebuild
# Runs: lint + test:coverage
```

This ensures code quality before building.

### Pre-Deployment Checks

The `predeploy` script runs before deployment:

```bash
npm run predeploy
# Runs: build + test + coverage:check
```

This ensures all validation passes before deploying.

## BATS Test Integration

### Test Structure

```bash
# Tests are organized in tests/build-and-deploy.bats

# Run specific test section
bats tests/build-and-deploy.bats --filter "node_modules"

# Run with verbose output
bats tests/build-and-deploy.bats --verbose
```

### Testing npm Scripts

```bash
# Test that build script runs successfully
@test "npm build: npm run build completes successfully" {
  run npm_build_check "${TEST_DIR}"
  assert_success
  assert_output --partial "Build completed successfully"
}

# Test coverage validation
@test "coverage: coverage meets 100% threshold" {
  run verify_coverage_threshold "${TEST_DIR}" 100
  assert_success
  assert_output --partial "Coverage threshold met"
}

# Test theme validation
@test "theme.json: file is valid JSON" {
  run validate_theme_json_syntax "${TEST_DIR}/theme.json"
  assert_success
  assert_output --partial "Valid JSON"
}
```

## Script Hooks

### Lefthook Pre-Commit Integration

Create `lefthook.yml` to run tests before commits:

```yaml
pre-commit:
  commands:
    lint:
      glob: "src/**/*.js"
      run: npm run lint
      
    jest:
      glob: "src/**/*.js"
      run: npm run test:jest -- --coverage
      
    bats:
      glob: "tests/**/*.bats"
      run: npm run test:bats
      
    coverage:
      glob: "src/**/*.js"
      run: npm run coverage:check -- --threshold=100
      
    validate:
      run: npm run validate:all
```

### GitHub Actions CI/CD

Create `.github/workflows/test.yml`:

```yaml
name: Test & Build

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run Jest tests
        run: npm run test:jest
      
      - name: Run BATS tests
        run: npm run test:bats
      
      - name: Check coverage threshold
        run: npm run coverage:check -- --threshold=100
      
      - name: Validate theme.json
        run: npm run validate:theme
      
      - name: Build artifacts
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Script Examples

### 1. Validate Theme Script

File: `scripts/validate-theme.js`

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const themeJsonPath = path.join(__dirname, '../theme.json');

try {
  const themeJson = JSON.parse(fs.readFileSync(themeJsonPath, 'utf-8'));
  
  // Validate required properties
  const required = ['version', 'settings', 'styles'];
  for (const prop of required) {
    if (!themeJson[prop]) {
      throw new Error(`Missing required property: ${prop}`);
    }
  }
  
  console.log('✓ theme.json is valid');
  process.exit(0);
} catch (error) {
  console.error('✗ theme.json validation failed:', error.message);
  process.exit(1);
}
```

### 2. Coverage Check Script

File: `scripts/check-coverage.js`

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const thresholdArg = args.find(arg => arg.startsWith('--threshold='));
const threshold = thresholdArg 
  ? parseInt(thresholdArg.split('=')[1]) 
  : 100;

const coveragePath = path.join(__dirname, '../coverage/coverage-summary.json');

try {
  if (!fs.existsSync(coveragePath)) {
    console.error('✗ Coverage report not found. Run: npm run test:coverage');
    process.exit(1);
  }
  
  const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf-8'));
  const { total } = coverage;
  
  console.log(`Coverage Summary:`);
  console.log(`  Lines:      ${total.lines.pct}%`);
  console.log(`  Statements: ${total.statements.pct}%`);
  console.log(`  Functions:  ${total.functions.pct}%`);
  console.log(`  Branches:   ${total.branches.pct}%`);
  
  const minCoverage = Math.min(
    total.lines.pct,
    total.statements.pct,
    total.functions.pct,
    total.branches.pct
  );
  
  if (minCoverage >= threshold) {
    console.log(`✓ Coverage threshold met: ${minCoverage}% >= ${threshold}%`);
    process.exit(0);
  } else {
    console.error(`✗ Coverage below threshold: ${minCoverage}% < ${threshold}%`);
    process.exit(1);
  }
} catch (error) {
  console.error('✗ Coverage check failed:', error.message);
  process.exit(1);
}
```

### 3. Deploy Script

File: `scripts/deploy.js`

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function deploy() {
  try {
    console.log('Starting deployment...');
    
    // 1. Check all tests pass
    console.log('Running tests...');
    execSync('npm test', { stdio: 'inherit' });
    
    // 2. Verify coverage
    console.log('Checking coverage...');
    execSync('npm run coverage:check', { stdio: 'inherit' });
    
    // 3. Validate theme
    console.log('Validating theme.json...');
    execSync('npm run validate:theme', { stdio: 'inherit' });
    
    // 4. Build artifacts
    console.log('Building artifacts...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // 5. Verify deployment artifacts
    const distPath = path.join(__dirname, '../dist');
    if (!fs.existsSync(distPath)) {
      throw new Error('Deployment artifacts not created');
    }
    
    console.log('✓ Deployment successful!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy();
```

## Running Tests

### Local Testing

```bash
# Run all tests
npm test

# Run specific test file
npm run test:bats tests/build-and-deploy.bats

# Run tests matching pattern
bats tests/build-and-deploy.bats --filter "coverage"

# Watch mode (Jest only)
npm run test:watch
```

### CI/CD Testing

Tests are automatically run in CI via GitHub Actions:

```bash
# Simulate CI environment
export CI=true
npm ci          # Use npm ci instead of npm install
npm test        # Run tests
npm run coverage:check
```

## Troubleshooting

### Coverage Not 100%

```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/index.html

# Find uncovered lines
grep -r "CLNC" coverage/lcov.info
```

### theme.json Validation Fails

```bash
# Validate syntax
jq empty theme.json

# Check schema
npm run validate:theme

# Pretty print for inspection
jq . theme.json
```

### Build Fails

```bash
# Clean and rebuild
npm run clean
npm install
npm run build

# Debug build
npm run build -- --debug
```

## Performance Optimization

### Parallel Testing

```bash
# Run Jest and BATS in parallel
npm run test:jest &
npm run test:bats &
wait
```

### Coverage Report Optimization

```bash
# Generate coverage only for changed files
npm run test:jest -- --coverage --changedSince=main
```

### Caching Dependencies

```bash
# Use npm ci for faster CI builds
npm ci --prefer-offline

# Cache node_modules in CI
- uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
```

## Best Practices

1. **Run validation before commits** - Use Lefthook pre-commit hooks
2. **Enforce coverage in CI** - Fail builds when coverage drops
3. **Validate theme.json early** - Catch issues before build
4. **Cache dependencies** - Reduce build time in CI
5. **Parallel testing** - Run Jest and BATS simultaneously
6. **Document scripts** - Keep npm scripts simple and well-named
7. **Use predeploy hooks** - Ensure all checks pass before deployment

## Integration Checklist

- [x] Configure npm build scripts
- [x] Setup Jest with 100% coverage threshold
- [x] Create BATS test file
- [x] Create validation scripts
- [x] Setup GitHub Actions workflow
- [x] Configure Lefthook pre-commit
- [x] Document npm scripts
- [x] Test locally before CI
