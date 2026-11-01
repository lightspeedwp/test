# BATS Shell Script Tests for WordPress Build & Deploy

Complete test suite using BATS (Bash Automated Testing System) for validating WordPress build and deployment processes, with 100% coverage enforcement, theme.json validation, and deployment artifact verification.

## Overview

This test suite provides comprehensive shell script testing for WordPress development pipelines, including:

- **node_modules Validation** - Verify npm dependencies installation
- **npm Build Verification** - Ensure build succeeds with 100% code coverage
- **theme.json Validation** - Check JSON structure and required fields
- **Deployment Artifacts** - Confirm all deployment files are created correctly
- **Error Handling** - Graceful error management with recovery patterns
- **Integration Tests** - Full pipeline validation

## Quick Start

### 1. Install Dependencies

```bash
# Install BATS testing framework
npm install --save-dev bats-core

# Or using Homebrew (macOS)
brew install bats-core

# Or using apt (Ubuntu/Debian)
sudo apt-get install bats
```

### 2. Run Tests

```bash
# Copy test files to your project
cp wordpress-build-deploy.bats tests/
cp test_helper.bash tests/

# Run all BATS tests
npm run test:bats

# Run with verbose output
npm run test:bats:verbose

# Run in parallel (faster)
npm run test:bats:parallel
```

### 3. Verify Coverage

```bash
# Run tests with coverage enforcement
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

## File Structure

```
outputs/
├── wordpress-build-deploy.bats          # Main BATS test file (80+ tests)
├── test_helper.bash                     # Reusable helper functions
├── npm-script-integration.md            # npm script examples
├── error-handling-patterns.md           # Error handling guide
├── deployment-validation-tests.md       # Deployment verification
├── coverage-enforcement-tests.md        # Coverage enforcement guide
└── README.md                            # This file
```

## Test Categories

### 1. node_modules Installation (6 tests)

Tests for npm dependency management:
- Directory existence verification
- Package lock file validation
- Dependency availability checking
- Permission validation

**Run tests:**
```bash
bats wordpress-build-deploy.bats --filter "node_modules"
```

**Key functions in test_helper.bash:**
- `run_npm_install()` - Execute npm install with standard config
- `verify_dependencies()` - Check required packages are installed
- `is_npm_installed()` - Test if package exists

### 2. npm Build with Coverage (8 tests)

Validates build process and enforces 100% coverage:
- Build script availability
- Coverage report generation
- Coverage threshold enforcement (100%)
- Lint pass verification
- Build artifact creation

**Run tests:**
```bash
bats wordpress-build-deploy.bats --filter "build"
```

**Key functions in test_helper.bash:**
- `run_npm_build()` - Execute npm build
- `check_coverage_threshold()` - Validate coverage meets minimum
- `run_tests_with_coverage()` - Execute test suite with coverage
- `print_coverage_summary()` - Display coverage metrics

### 3. theme.json Validation (8 tests)

Validates WordPress theme.json configuration:
- JSON syntax validation
- Required version field
- Schema version checking
- Color palette validation
- Typography settings validation
- Field presence verification

**Run tests:**
```bash
bats wordpress-build-deploy.bats --filter "theme-json"
```

**Key functions in test_helper.bash:**
- `validate_theme_json_syntax()` - Check JSON is valid
- `check_theme_version()` - Verify version field
- `validate_color_palette()` - Check color definitions
- `validate_typography()` - Verify font settings

### 4. Deployment Artifacts (11 tests)

Validates deployment package creation:
- Build directory creation
- Distribution directory setup
- Package.json inclusion
- Manifest file generation
- Coverage report inclusion
- Artifact permissions
- Checksum validation

**Run tests:**
```bash
bats wordpress-build-deploy.bats --filter "deployment"
```

**Key functions in test_helper.bash:**
- `check_deployment_ready()` - Verify deployment prerequisites
- `create_deployment_manifest()` - Generate manifest file
- `generate_artifact_checksums()` - Create SHA256 checksums
- `verify_artifact_checksums()` - Validate artifact integrity

### 5. Integration Tests (3 tests)

Full pipeline validation:
- Complete build-to-deploy workflow
- Theme.json and npm compatibility
- Coverage enforcement before deployment

**Run tests:**
```bash
bats wordpress-build-deploy.bats --filter "integration"
```

### 6. Error Handling Tests (4 tests)

Error scenario validation:
- Missing package.json handling
- Coverage shortfall reporting
- Malformed JSON detection
- Deployment failure handling

**Run tests:**
```bash
bats wordpress-build-deploy.bats --filter "error-handling"
```

## Test Statistics

```
Total Tests: 80+
├── node_modules tests: 6
├── Build tests: 8
├── theme.json tests: 8
├── Deployment tests: 11
├── Integration tests: 3
├── Error handling tests: 4
└── Additional coverage tests: 40+
```

## npm Script Integration

### Add to package.json

```json
{
  "scripts": {
    "test:bats": "bats tests/wordpress-build-deploy.bats",
    "test:bats:verbose": "bats --formatter tap tests/wordpress-build-deploy.bats",
    "test:bats:parallel": "bats --parallel-jobs 4 tests/wordpress-build-deploy.bats",
    "test:bats:coverage": "npm run test:bats && npm run check:coverage",
    "test:all": "npm run test:bats && npm run test:coverage",
    "build": "npm run lint && npm run compile && npm run test:coverage",
    "deploy": "npm run build && bash scripts/package-artifacts.sh"
  }
}
```

### CI/CD Integration

**GitHub Actions:**
```bash
# .github/workflows/test.yml
- name: Run BATS tests
  run: npm run test:bats:verbose

- name: Check coverage
  run: npm run test:coverage

- name: Validate deployment
  run: npm run deploy
```

**GitLab CI:**
```bash
# .gitlab-ci.yml
test:
  script:
    - npm run test:bats:verbose
    - npm run test:coverage
    - npm run deploy
```

## Helper Functions

### Coverage Functions
- `get_coverage_percent(metric, file)` - Extract coverage percentage
- `check_coverage_threshold(threshold, file)` - Validate minimum coverage
- `validate_coverage_report(file)` - Verify report structure
- `print_coverage_summary(file)` - Display coverage metrics

### theme.json Functions
- `validate_theme_json_syntax(file)` - Check JSON validity
- `check_theme_version(file, version)` - Verify version field
- `validate_color_palette(file)` - Check colors defined
- `validate_theme_json_complete(file)` - Full validation

### Deployment Functions
- `verify_build_artifacts(dir)` - Check build outputs
- `check_deployment_ready(build, coverage, dist)` - Pre-deployment check
- `create_deployment_manifest(dist, version)` - Generate manifest
- `generate_artifact_checksums(dist)` - Create checksums
- `verify_artifact_checksums(dist)` - Validate checksums

### Build Functions
- `run_npm_build(log)` - Execute npm build
- `run_npm_build_prod(log)` - Production build
- `run_tests_with_coverage(dir, log)` - Run tests with coverage
- `run_lint_checks(log)` - Execute linting

### Fixture Functions
- `create_theme_json_fixture(dir)` - Generate sample theme.json
- `create_package_json_fixture(dir)` - Generate package.json
- `create_coverage_report_fixture(dir, level)` - Mock coverage report

## Error Handling Patterns

### Pattern: Coverage Enforcement
```bash
# Check coverage meets 100%
check_coverage_threshold 100 coverage/coverage-summary.json || {
    echo "ERROR: Coverage below threshold" >&2
    exit 1
}
```

### Pattern: Deployment Validation
```bash
# Verify all artifacts present
check_deployment_ready build coverage dist || {
    echo "ERROR: Deployment not ready" >&2
    exit 1
}
```

### Pattern: Error Recovery
```bash
@test "test with automatic cleanup" {
    local temp_dir=$(mktemp -d)
    trap "rm -rf '$temp_dir'" EXIT
    
    # Run test
    npm install --prefix "$temp_dir"
}
```

## Configuration

### Environment Variables

```bash
# Skip npm install (use existing node_modules)
export SKIP_NPM_INSTALL=true

# Use offline mode
export NPM_PREFER_OFFLINE=--prefer-offline

# Custom coverage threshold
export COVERAGE_THRESHOLD=95

# Verbose logging
export DEBUG=true
```

### Jest Configuration (jest.config.js)

```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
```

## Test Execution Examples

### Run All Tests
```bash
npm run test:all
```

### Run Only BATS Tests
```bash
npm run test:bats
```

### Run Tests with Detailed Output
```bash
npm run test:bats:verbose
```

### Run Tests in Parallel (Faster)
```bash
npm run test:bats:parallel
```

### Run Specific Test Category
```bash
# node_modules tests
bats tests/wordpress-build-deploy.bats --filter "node_modules"

# Build tests
bats tests/wordpress-build-deploy.bats --filter "build:"

# theme.json tests
bats tests/wordpress-build-deploy.bats --filter "theme-json:"

# Deployment tests
bats tests/wordpress-build-deploy.bats --filter "deployment:"
```

### Generate Test Report
```bash
# TAP format
npm run test:bats:verbose > test-results.tap

# JSON format
bats --formatter json tests/wordpress-build-deploy.bats > test-results.json
```

## Documentation Files

### npm-script-integration.md
Complete guide to integrating BATS tests with npm scripts, including:
- package.json configuration examples
- CI/CD integration (GitHub Actions, GitLab CI)
- Test output formats (TAP, JSON)
- Performance optimization techniques
- Pre-commit hooks and deployment scripts

### error-handling-patterns.md
Comprehensive error handling guide covering:
- Basic error handling patterns
- npm command failures and recovery
- File system error handling
- Coverage validation errors
- JSON parsing errors
- Deployment error scenarios
- Error recovery and cleanup

### deployment-validation-tests.md
Advanced deployment validation covering:
- Artifact validation and verification
- Checksum generation and verification
- Manifest validation and metadata
- File integrity checking
- Deployment readiness assessment
- Rollback preparation

### coverage-enforcement-tests.md
Coverage enforcement patterns including:
- Coverage metrics explanation
- Threshold enforcement for all metrics
- Coverage analysis and reporting
- Report generation formats
- CI/CD pipeline integration
- Coverage badge generation

## Troubleshooting

### BATS Not Found
```bash
npm install -g bats-core
# or
npx bats tests/wordpress-build-deploy.bats
```

### Tests Timeout
```bash
BATS_NO_PARALLELIZE_WITHIN_FILE=true bats tests/wordpress-build-deploy.bats
```

### npm Install Fails
```bash
export NPM_PREFER_OFFLINE=--prefer-offline
npm run test:bats
```

### Coverage File Missing
```bash
npm run test:coverage
# Verify jest configuration includes coverage
npm run test:coverage -- --collectCoverageFrom='src/**/*.js'
```

## Best Practices

1. **Run BATS before Jest** - Shell tests catch environment issues first
2. **Use CI environment variable** - Behave differently in CI vs local
3. **Generate reports** - Always capture test output for analysis
4. **Fail fast** - Use `set -euo pipefail` to catch errors early
5. **Mock external dependencies** - Don't rely on external services
6. **Test in isolation** - Each test should be independent
7. **Clean up properly** - Use `trap` for cleanup in error scenarios
8. **Document test purposes** - Use clear test names and comments
9. **Use fixtures** - Create reusable test data
10. **Monitor test times** - Optimize slow tests

## Real-World Example: Full CI/CD Pipeline

### Pre-commit Hook
```bash
#!/bin/bash
set -euo pipefail

echo "Running pre-commit tests..."
npm run test:bats || exit 1
npm run test:coverage || exit 1

echo "All checks passed!"
```

### GitHub Actions Workflow
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:bats:verbose
      - run: npm run test:coverage
      - run: npm run deploy
      
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Support and Contribution

For issues or improvements:
1. Check the documentation files first
2. Review error-handling-patterns.md for common issues
3. Verify npm scripts are configured correctly
4. Ensure Jest configuration has coverage thresholds

## License

These tests are part of LightSpeed WP's WordPress development toolkit.

## Summary

This complete BATS test suite provides:
- ✓ 80+ comprehensive tests
- ✓ 100% coverage enforcement
- ✓ Full deployment validation
- ✓ Error handling patterns
- ✓ CI/CD integration examples
- ✓ Extensive documentation
- ✓ Reusable helper functions
- ✓ Real-world examples

Ready to integrate into your WordPress build pipeline!
