# npm Script Integration for BATS Tests

This guide shows how to integrate BATS shell tests with npm scripts for WordPress build and deploy processes.

## Quick Start

### 1. Install BATS Framework

```bash
# Using npm
npm install --save-dev bats-core

# Or using Homebrew on macOS
brew install bats-core

# Or using apt on Ubuntu/Debian
sudo apt-get install bats
```

### 2. Add Test Scripts to package.json

```json
{
  "scripts": {
    "test:bats": "bats tests/*.bats",
    "test:bats:verbose": "bats --formatter tap tests/*.bats",
    "test:bats:parallel": "bats --parallel-jobs 4 tests/*.bats",
    "test:all": "npm run test:bats && npm run test:jest",
    "test:ci": "npm run test:bats --reporter json > test-results.json"
  }
}
```

## Full package.json Integration Example

```json
{
  "name": "lightspeed-wordpress",
  "version": "1.0.0",
  "scripts": {
    "build": "npm run lint && npm run compile && npm run test:coverage",
    "build:prod": "NODE_ENV=production npm run build",
    "compile": "sass src:build --no-source-map",
    "lint": "eslint src/ --max-warnings 0",
    "test": "jest",
    "test:coverage": "jest --coverage --collectCoverageFrom='src/**/*.js' --coverageDirectory=coverage --coverageReporters=json --coverageThreshold='{\"global\":{\"branches\":100,\"functions\":100,\"lines\":100,\"statements\":100}}'",
    "test:bats": "bats tests/wordpress-build-deploy.bats",
    "test:bats:verbose": "bats --formatter tap tests/wordpress-build-deploy.bats",
    "test:bats:watch": "watch 'npm run test:bats' src tests",
    "test:bats:parallel": "bats --parallel-jobs 4 tests/wordpress-build-deploy.bats",
    "test:all": "npm run test:bats && npm run test",
    "test:integration": "npm run build && npm run test:bats && npm run deploy",
    "test:ci": "npm run lint && npm run test:bats && npm run test:coverage && npm run deploy",
    "deploy": "npm run build && bash scripts/package-artifacts.sh",
    "validate": "npm run test:all && npm run deploy"
  },
  "devDependencies": {
    "bats-core": "^1.8.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "sass": "^1.50.0",
    "watch": "^1.15.0"
  }
}
```

## Test Scenarios

### Running Unit Tests Only
```bash
npm run test
```

### Running BATS Shell Tests Only
```bash
npm run test:bats
```

### Running All Tests
```bash
npm run test:all
```

### Running Tests with Detailed Output
```bash
npm run test:bats:verbose
```

### Running Tests in Parallel (for faster CI)
```bash
npm run test:bats:parallel
```

### Running Full Integration Pipeline
```bash
npm run test:integration
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: BATS and npm Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install BATS
        run: npm install --save-dev bats-core
      
      - name: Run BATS tests
        run: npm run test:bats:verbose
      
      - name: Run npm tests with coverage
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
      
      - name: Run deployment validation
        run: npm run deploy
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
test:
  image: node:20
  script:
    - npm ci
    - npm install --save-dev bats-core
    - npm run test:bats:verbose
    - npm run test:coverage
    - npm run deploy
  artifacts:
    paths:
      - coverage/
      - dist/
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
```

## Test Output Formats

### TAP (Test Anything Protocol) Format
```bash
npm run test:bats:verbose
```

Output:
```
1..15
ok 1 node_modules: Check node_modules directory exists after npm install
ok 2 node_modules: Verify package.json exists in project root
ok 3 build: npm build script exists and is executable
...
```

### JSON Format (for CI parsers)
```bash
bats --formatter json tests/wordpress-build-deploy.bats > test-results.json
```

## Environment Variables for Tests

Set these when running tests to customize behavior:

```bash
# Skip npm install (use existing node_modules)
export SKIP_NPM_INSTALL=true

# Use offline mode
export NPM_PREFER_OFFLINE=--prefer-offline

# Custom coverage threshold
export COVERAGE_THRESHOLD=95

# Verbose logging
export DEBUG=true

# Run tests
npm run test:bats:verbose
```

## Test Execution Pipeline

### 1. Linting Stage
```bash
npm run lint
```
Validates code quality before build.

### 2. Compilation Stage
```bash
npm run compile
```
Compiles SCSS and JavaScript.

### 3. Testing Stage
```bash
npm run test:bats
npm run test
```
Runs BATS shell tests and Jest unit tests.

### 4. Coverage Enforcement
```bash
npm run test:coverage
```
Verifies 100% code coverage and generates reports.

### 5. Deployment Packaging
```bash
npm run deploy
```
Creates deployment artifacts and manifests.

## Troubleshooting

### BATS Not Found
```bash
# Install globally
npm install -g bats-core

# Or use npx
npx bats tests/wordpress-build-deploy.bats
```

### Test Timeouts
```bash
# Increase BATS timeout
BATS_NO_PARALLELIZE_WITHIN_FILE=true bats tests/wordpress-build-deploy.bats
```

### npm Install Fails in Tests
```bash
# Use offline mode
export NPM_PREFER_OFFLINE=--prefer-offline
npm run test:bats
```

### Coverage Report Missing
```bash
# Ensure jest coverage is configured
npm run test:coverage -- --collectCoverageFrom='src/**/*.js'
```

## Real-World Script Examples

### Pre-commit Hook
Create `scripts/pre-commit.sh`:

```bash
#!/bin/bash
set -euo pipefail

echo "Running pre-commit checks..."
npm run lint || exit 1
npm run test:bats || exit 1
npm run test:coverage || exit 1

echo "All checks passed!"
```

Make it executable:
```bash
chmod +x scripts/pre-commit.sh
```

Add to git hooks:
```bash
git config core.hooksPath scripts
# Or copy to .git/hooks/pre-commit
```

### Deployment Script with Tests
Create `scripts/deploy-with-tests.sh`:

```bash
#!/bin/bash
set -euo pipefail

echo "Starting deployment process..."

# Run all tests
echo "1. Running BATS tests..."
npm run test:bats || exit 1

# Run coverage tests
echo "2. Running coverage tests..."
npm run test:coverage || exit 1

# Build
echo "3. Building artifacts..."
npm run build || exit 1

# Package
echo "4. Packaging for deployment..."
npm run deploy || exit 1

# Verify
echo "5. Verifying deployment artifacts..."
if [[ -f dist/MANIFEST.json ]]; then
    cat dist/MANIFEST.json
    echo "Deployment ready!"
else
    echo "Error: Deployment manifest not found"
    exit 1
fi
```

### Watch Mode for Development
```bash
# Install watch
npm install --save-dev watch

# Add to package.json
"test:watch": "watch 'npm run test:bats' src tests"

# Run in development
npm run test:watch
```

## Performance Optimization

### Parallel Execution
```bash
npm run test:bats:parallel --jobs 4
```

### Skip Slow Tests
```bash
bats tests/wordpress-build-deploy.bats --filter "not integration"
```

### Cache npm Modules
```bash
npm ci --prefer-offline --no-audit
```

## Integration with Code Coverage

### Combining BATS and Jest Coverage
```bash
#!/bin/bash
# Run all tests and merge coverage
npm run test:bats
npm run test:coverage

# View combined report
open coverage/lcov-report/index.html
```

## Best Practices

1. **Run BATS tests before npm tests** - Shell integration tests catch environment issues first
2. **Use CI environment variable** - Different behavior for CI vs local
3. **Generate reports** - Always capture test output for analysis
4. **Fail fast** - Use `set -euo pipefail` to catch errors early
5. **Mock external dependencies** - Don't rely on external services in tests
6. **Test in isolation** - Each test should be independent
7. **Clean up after tests** - Remove temporary files in teardown
8. **Document test purposes** - Use clear test names
9. **Use fixtures** - Create reusable test data
10. **Monitor test times** - Slow tests need optimization
