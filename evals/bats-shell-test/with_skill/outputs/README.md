# WordPress Build & Deploy BATS Test Suite

Comprehensive BATS (Bash Automated Testing System) test suite for WordPress build and deployment validation with 100% coverage enforcement.

## Overview

This test suite provides production-ready shell script tests for:

- **Node Modules Validation** — Verify npm install succeeds and dependencies are present
- **NPM Build Testing** — Ensure build process completes with full coverage
- **Theme.json Validation** — Validate theme configuration against WordPress schema
- **Deployment Artifacts** — Confirm all required artifacts are created and ready for production
- **Error Handling** — Graceful handling of common failure scenarios
- **Integration Testing** — Full workflow validation from install to deployment

## Directory Structure

```
outputs/
├── tests/
│   ├── build-and-deploy.bats          # Main test file (59 comprehensive tests)
│   └── README.md                      # Test documentation
├── helpers/
│   ├── bats-helpers.sh                # Test helper functions
│   ├── test-fixtures.sh               # Mock data and project fixtures
│   └── README.md                      # Helper function documentation
├── fixtures/
│   ├── package.json                   # Mock package.json
│   ├── theme.json                     # Mock theme.json
│   ├── webpack.config.js              # Mock webpack config
│   └── jest.config.js                 # Mock Jest config
├── examples/
│   ├── package.json.example           # Real-world package.json template
│   ├── npm-scripts-integration.md     # npm scripts guide
│   ├── error-handling-patterns.md     # Error handling best practices
│   ├── lefthook.yml.example           # Pre-commit hook configuration
│   └── github-workflow.yml            # GitHub Actions CI/CD
└── README.md                          # This file
```

## Quick Start

### Prerequisites

```bash
# Install BATS
npm install --save-dev bats

# Install jq for JSON validation
brew install jq  # macOS
apt-get install jq  # Linux

# Requires: Node.js 18+, npm 8+
```

### Running Tests

```bash
# Run all tests
bats tests/build-and-deploy.bats

# Run tests matching pattern
bats tests/build-and-deploy.bats --filter "coverage"

# Run with verbose output
bats tests/build-and-deploy.bats --verbose

# Run specific test
bats tests/build-and-deploy.bats --match "coverage meets 100%"
```

### Integration with npm

```bash
# Add to package.json scripts
"test:bats": "bats tests/build-and-deploy.bats",
"test": "npm run test:jest && npm run test:bats"

# Run via npm
npm run test:bats
```

## Test Coverage

### 59 Comprehensive Tests

#### Node Modules Installation (7 tests)
- ✓ directory exists after npm install
- ✓ package-lock.json is generated
- ✓ required dependencies are installed
- ✓ npm install fails with missing package.json
- ✓ npm install handles network errors gracefully
- ✓ npm ci uses lock file in CI environment
- ✓ correct node version is installed

#### NPM Build Validation (10 tests)
- ✓ build script exists in package.json
- ✓ npm run build completes successfully
- ✓ build output contains compiled assets
- ✓ build creates CSS output files
- ✓ coverage reporter is configured
- ✓ build generates coverage reports
- ✓ coverage meets 100% threshold
- ✓ coverage fails below threshold
- ✓ lcov report is generated
- ✓ coverage excludes ignored files

#### Theme.json Validation (12 tests)
- ✓ file exists
- ✓ file is valid JSON
- ✓ schema validation passes
- ✓ required properties present
- ✓ valid version format
- ✓ color settings properly defined
- ✓ typography settings properly defined
- ✓ spacing settings properly defined
- ✓ invalid JSON fails validation
- ✓ missing required properties fails validation
- ✓ detects duplicate color names

#### Deployment Artifacts (10 tests)
- ✓ build creates dist directory
- ✓ required files are present
- ✓ bundle files are not empty
- ✓ source maps are generated
- ✓ manifest.json contains correct metadata
- ✓ no temporary or debug files in artifacts
- ✓ all artifacts are readable
- ✓ bundle size is within limits
- ✓ tar.gz archive can be created
- ✓ archive integrity verification passes

#### Integration Tests (4 tests)
- ✓ full build-to-deploy workflow succeeds
- ✓ coverage report generated during build
- ✓ theme.json validated during build
- ✓ deployment package ready for production

#### Error Handling (5 tests)
- ✓ graceful failure when node_modules missing
- ✓ clear error message for coverage failure
- ✓ descriptive error for invalid theme.json
- ✓ recovery from partial build state
- ✓ timeout handling in npm operations

#### Pre-deployment Checks (4 tests)
- ✓ all checks pass for deployment readiness
- ✓ version is properly formatted
- ✓ changelog is present and updated
- ✓ git state is clean

## Key Features

### 1. Comprehensive Test Coverage

- 59 tests covering all aspects of build and deployment
- Tests for success paths AND error scenarios
- Integration tests validating full workflows
- Error handling and recovery testing

### 2. Fixture Management

```bash
# Pre-built fixtures for common scenarios
create_complete_build_environment      # Full working environment
create_build_environment_with_coverage # With coverage data
create_build_environment_with_syntax_error  # For error testing
create_wordpress_theme_structure       # WordPress theme structure
```

### 3. Helper Functions

```bash
# 40+ reusable test helper functions
npm_install_check                      # Validate npm install
npm_build_check                        # Test build process
verify_coverage_threshold              # Check coverage met
validate_theme_json_syntax             # Validate JSON
verify_deployment_artifacts            # Check artifacts
create_deployment_archive              # Create tar.gz
verify_archive_integrity               # Test archive
```

### 4. Error Handling

- Graceful failure messages
- Clear error context
- Recovery patterns
- Timeout handling
- Detailed debugging output

### 5. npm Script Integration

- Works with standard npm workflows
- Integrates with Jest and Webpack
- Compatible with GitHub Actions
- Pre-commit hook support (Lefthook)

## Using Helper Functions

### Installation Validation

```bash
@test "validate npm installation" {
  run npm_install_check "${TEST_DIR}"
  assert_success
  assert_file_exists "${TEST_DIR}/package-lock.json"
}
```

### Build Testing

```bash
@test "build creates artifacts" {
  create_complete_build_environment "${TEST_DIR}"
  run npm_build_check "${TEST_DIR}"
  assert_success
  assert_dir_exists "${TEST_DIR}/build"
}
```

### Coverage Validation

```bash
@test "coverage meets threshold" {
  run npm_build_with_coverage "${TEST_DIR}"
  run verify_coverage_threshold "${TEST_DIR}" 100
  assert_success
}
```

### Theme.json Validation

```bash
@test "theme.json is valid" {
  create_mock_theme_json "${TEST_DIR}"
  run validate_theme_json_schema "${TEST_DIR}/theme.json"
  assert_success
}
```

### Deployment Verification

```bash
@test "artifacts ready for deployment" {
  run verify_deployment_artifacts "${TEST_DIR}/dist"
  assert_success
  run create_deployment_archive "${TEST_DIR}/dist"
  assert_file_exists "${TEST_DIR}/dist.tar.gz"
}
```

## npm Scripts Integration

### Example package.json

```json
{
  "scripts": {
    "build": "npm run build:theme && webpack",
    "test": "npm run test:jest && npm run test:bats",
    "test:jest": "jest --coverage",
    "test:bats": "bats tests/build-and-deploy.bats",
    "coverage:check": "node scripts/check-coverage.js --threshold=100",
    "validate:theme": "node scripts/validate-theme.json",
    "predeploy": "npm run build && npm test && npm run coverage:check"
  }
}
```

### Pre-commit Hooks (Lefthook)

```yaml
pre-commit:
  commands:
    jest:
      glob: "src/**/*.js"
      run: npm run test:jest -- --coverage
    
    bats:
      glob: "tests/**/*.bats"
      run: npm run test:bats
    
    coverage:
      run: npm run coverage:check -- --threshold=100
```

### GitHub Actions CI/CD

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
      
      - run: npm ci
      - run: npm run test:jest
      - run: npm run test:bats
      - run: npm run coverage:check
      - run: npm run build
```

## Error Handling Patterns

### Common Errors and Solutions

#### Build Fails with Missing Dependencies

```bash
# Error message:
# "ERROR: Failed to install dependencies"

# Solution:
npm ci --prefer-offline
npm run build
```

#### Coverage Below Threshold

```bash
# Error shows:
# "Coverage: 50% < Required: 100%"

# Solution:
npm run test:coverage  # Generate coverage report
open coverage/index.html  # Review uncovered lines
# Add tests for uncovered code
npm run test:bats
```

#### Invalid theme.json

```bash
# Error shows line and character:
# "Invalid JSON at line 42, character 15"

# Solution:
jq . theme.json  # Validate and format
npm run validate:theme
```

#### Deployment Archive Failed

```bash
# Error:
# "Archive is corrupted"

# Solution:
tar -tzf dist.tar.gz  # Test archive
rm -rf dist.tar.gz
npm run build  # Rebuild
```

## Performance Optimization

### Faster Test Execution

```bash
# Run Jest and BATS in parallel
npm run test:jest &
npm run test:bats &
wait

# Cache dependencies for CI
npm ci --prefer-offline
```

### Reducing Build Time

```bash
# Skip unnecessary steps in watch mode
npm run build -- --mode=development

# Use incremental builds
npm run build -- --cache
```

## Troubleshooting

### Tests Won't Run

```bash
# Check BATS is installed
npm list bats

# Check test file is executable
chmod +x tests/build-and-deploy.bats

# Run with debug output
bats tests/build-and-deploy.bats --verbose
```

### Coverage Calculation Wrong

```bash
# Clean and rebuild coverage
npm run clean
npm run test:coverage

# Verify coverage config
npm run coverage:check
```

### Theme.json Validation Fails

```bash
# Check syntax
jq empty theme.json

# Validate against schema
npm run validate:theme

# Compare with example
diff theme.json examples/theme.json.example
```

## Documentation

### Files

| File | Purpose |
|------|---------|
| `tests/build-and-deploy.bats` | Main test file with 59 tests |
| `helpers/bats-helpers.sh` | 40+ reusable test functions |
| `helpers/test-fixtures.sh` | Mock project structures |
| `examples/package.json.example` | Real-world configuration |
| `examples/npm-scripts-integration.md` | npm scripts guide |
| `examples/error-handling-patterns.md` | Error handling best practices |

### Reading Guide

1. **Start here** — `README.md` (this file)
2. **Understand tests** — `tests/build-and-deploy.bats`
3. **Learn helpers** — `helpers/bats-helpers.sh`
4. **Integrate npm** — `examples/npm-scripts-integration.md`
5. **Handle errors** — `examples/error-handling-patterns.md`

## Best Practices

1. **Run tests before commits** — Use Lefthook pre-commit hooks
2. **Enforce coverage in CI** — Fail builds when coverage drops below 100%
3. **Validate theme.json early** — Catch issues before building
4. **Cache dependencies** — Reduce CI build time
5. **Parallel testing** — Run Jest and BATS simultaneously
6. **Document failures** — Capture error context for debugging
7. **Test error paths** — Include failure scenarios

## Contributing

When adding new tests:

1. Follow existing test naming convention: `@test "category: description"`
2. Include setup/teardown for test isolation
3. Use helper functions for common operations
4. Document error handling
5. Add to README test list

## License

GPL-2.0-or-later

## Support

For issues or questions:

1. Check `examples/error-handling-patterns.md`
2. Review `examples/npm-scripts-integration.md`
3. See troubleshooting section above
4. Check BATS documentation: https://github.com/bats-core/bats-core

## Version

- **Version:** 1.0.0
- **Created:** 2026-10-30
- **LightSpeedWP Test Skill**
