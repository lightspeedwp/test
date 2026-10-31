# Coverage Enforcement Strategy
## Prevent Future Regressions & Maintain 100% Coverage

---

## Executive Summary

**Goal:** Restore coverage from 72% to 100% and prevent future regressions  
**Mechanism:** Multi-layered enforcement (config, pre-commit, CI/CD)  
**Timeline:** 13.75 hours to reach 100% + 2 hours to implement enforcement  
**Expected Result:** Continuous 100% coverage on all new code

---

## Layer 1: Jest Configuration Enforcement

### 1.1 Configure Coverage Thresholds

**File:** `jest.config.js`

```javascript
module.exports = {
  // Test discovery
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.spec.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  
  // Coverage collection
  collectCoverageFrom: [
    'src/**/*.js',           // Collect from src/
    '!src/**/*.test.js',     // Exclude test files
    '!src/**/*.spec.js',     // Exclude spec files
    '!src/index.js',         // Exclude entry point (if just re-exports)
    '!src/cli.js'            // Exclude CLI (if applicable)
  ],
  
  // Coverage paths to ignore
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/__tests__/'
  ],
  
  // CRITICAL: Global coverage thresholds (100%)
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    
    // Per-file enforcement for critical modules
    './src/utils/validation.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    
    './src/utils/transform.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    
    './src/utils/format.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    
    './src/handlers/formSubmit.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    
    './src/components/BlockEditor.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  
  // Coverage reporting formats
  coverageReporters: [
    'text',              // Console output
    'text-summary',      // Concise summary
    'json',              // Machine-readable (for parsing)
    'lcov',              // For code coverage tools
    'html',              // Interactive HTML dashboard
    'cobertura'          // For CI/CD integration
  ],
  
  // Fail build if coverage threshold not met
  coverageFailureThreshold: 100,
  
  // Test environment
  testEnvironment: 'node',
  
  // Test timeout (increase if async tests need more time)
  testTimeout: 10000,
  
  // Bail after first test failure (faster feedback)
  bail: false,
  
  // Show coverage even without --coverage flag
  collectCoverage: false,  // Keep false; enable with --coverage flag
  
  // Verbose output for debugging
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Reset modules between tests
  resetModules: true
};
```

### 1.2 Configure Coverage Reporters

**Coverage HTML Report:**

The `html` reporter generates an interactive dashboard at `coverage/index.html`:
- Click files to see line-by-line coverage
- Red = uncovered
- Green = covered
- Yellow = partial (branch not covered)

**Coverage JSON Report:**

The `json` reporter generates machine-readable `coverage/coverage-final.json`:

```json
{
  "src/utils/validation.js": {
    "lines": {
      "total": 125,
      "covered": 125,
      "pct": 100
    },
    "branches": {
      "total": 45,
      "covered": 45,
      "pct": 100
    },
    "functions": {
      "total": 12,
      "covered": 12,
      "pct": 100
    },
    "statements": {
      "total": 132,
      "covered": 132,
      "pct": 100
    }
  }
}
```

**Parse JSON for CI/CD:**

```javascript
// scripts/check-coverage.js
const fs = require('fs');
const coverage = JSON.parse(
  fs.readFileSync('./coverage/coverage-final.json', 'utf8')
);

let allFiles100 = true;
const files = [];

Object.entries(coverage).forEach(([file, data]) => {
  if (data.lines.pct < 100) {
    allFiles100 = false;
    files.push({
      file,
      coverage: data.lines.pct,
      gap: 100 - data.lines.pct,
      uncovered: data.lines.total - data.lines.covered
    });
  }
});

if (!allFiles100) {
  console.error('Coverage Gap Report:\n');
  files.forEach(f => {
    console.error(`  ${f.file}`);
    console.error(`    Coverage: ${f.coverage.toFixed(1)}%`);
    console.error(`    Gap: ${f.gap.toFixed(1)}%`);
    console.error(`    Uncovered: ${f.uncovered} lines\n`);
  });
  process.exit(1);
} else {
  console.log('✓ All files at 100% coverage');
  process.exit(0);
}
```

---

## Layer 2: Pre-commit Hook Enforcement

### 2.1 Lefthook Configuration

**File:** `lefthook.yml`

```yaml
# Pre-commit hooks to enforce coverage before commit

pre-commit:
  commands:
    # Jest coverage check on modified files
    jest-coverage:
      glob: "src/**/*.js"
      run: npm run test:jest -- --coverage --bail --onlyChanged --testPathPattern={{files}}
      stage_fixed: true
      fail_text: "Jest coverage below 100%"
    
    # Lint JavaScript
    eslint:
      glob: "src/**/*.js"
      run: npm run lint:js -- --fix {{files}}
      stage_fixed: true
      fail_text: "ESLint found errors"
    
    # Check test file naming
    test-naming:
      glob: "__tests__/**/*.test.js"
      run: test "$(echo {{files}} | grep -c '__tests__')" -gt 0
      fail_text: "Tests must be in __tests__/ directory"

# Commit message linting
commit-msg:
  commands:
    # Conventional commit format
    commitlint:
      run: npm run commitlint -- --edit
      fail_text: "Commit message must follow Conventional Commits"

# Post-checkout to install new dependencies
post-checkout:
  commands:
    install-deps:
      glob: "package.json"
      run: npm ci --if-present
      stage_fixed: false
      skip:
        - merge
        - rebase
```

### 2.2 Install Lefthook

```bash
# Install lefthook
npm install --save-dev lefthook

# Install git hooks
npx lefthook install

# Verify installation
npx lefthook version
```

### 2.3 Package.json Scripts

**File:** `package.json`

```json
{
  "scripts": {
    "test": "npm run test:jest",
    "test:jest": "jest --colors",
    "test:watch": "jest --watch --colors",
    "test:coverage": "jest --coverage --colors",
    "test:coverage:html": "jest --coverage && open coverage/index.html",
    "test:only-changed": "jest --onlyChanged --coverage",
    "test:ci": "jest --coverage --ci --maxWorkers=2 --colors",
    "test:no-cache": "jest --no-cache --coverage --colors",
    "lint:js": "eslint",
    "commitlint": "commitlint",
    "pretest": "npm run lint:js src/",
    "prepush": "npm run test:coverage"
  }
}
```

---

## Layer 3: CI/CD Pipeline Enforcement

### 3.1 GitHub Actions Workflow

**File:** `.github/workflows/test-coverage.yml`

```yaml
name: Test Coverage Enforcement

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  test-coverage:
    runs-on: ubuntu-latest
    name: Jest Coverage
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      # Check out code
      - name: Checkout
        uses: actions/checkout@v4
      
      # Set up Node
      - name: Setup Node ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      
      # Install dependencies
      - name: Install dependencies
        run: npm ci
      
      # Run tests with coverage
      - name: Run Jest with coverage
        id: test
        run: npm run test:jest -- --coverage --colors
      
      # Parse coverage JSON
      - name: Parse coverage report
        id: coverage
        if: always()
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "Coverage: ${COVERAGE}%"
          echo "coverage_percent=${COVERAGE}" >> $GITHUB_OUTPUT
          
          if (( $(echo "$COVERAGE < 100" | bc -l) )); then
            echo "coverage_ok=false" >> $GITHUB_OUTPUT
          else
            echo "coverage_ok=true" >> $GITHUB_OUTPUT
          fi
      
      # Report coverage to job summary
      - name: Report coverage to job summary
        if: always()
        run: |
          echo "## Coverage Report" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "- **Coverage:** ${{ steps.coverage.outputs.coverage_percent }}%" >> $GITHUB_STEP_SUMMARY
          echo "- **Status:** ${{ steps.coverage.outputs.coverage_ok == 'true' && '✅ PASS' || '❌ FAIL' }}" >> $GITHUB_STEP_SUMMARY
      
      # Fail if coverage below 100%
      - name: Fail if coverage insufficient
        if: steps.coverage.outputs.coverage_ok != 'true'
        run: |
          echo "❌ Coverage below 100%"
          cat coverage/coverage-summary.json | jq '.total | {lines, branches, functions, statements}'
          exit 1
      
      # Upload coverage to Codecov
      - name: Upload coverage to Codecov
        if: matrix.node-version == '20.x' && always()
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: jest
          name: jest-coverage
          fail_ci_if_error: false
          verbose: true
      
      # Comment PR with coverage
      - name: Comment PR with coverage
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const fs = require('fs');
            const coverage = JSON.parse(
              fs.readFileSync('./coverage/coverage-summary.json', 'utf8')
            );
            
            const lines = coverage.total.lines.pct;
            const branches = coverage.total.branches.pct;
            const functions = coverage.total.functions.pct;
            const statements = coverage.total.statements.pct;
            
            const status = lines === 100 ? '✅' : '❌';
            
            const comment = `
            ## Jest Coverage Report ${status}
            
            | Metric | Coverage | Target |
            |--------|----------|--------|
            | Lines | ${lines}% | 100% |
            | Branches | ${branches}% | 100% |
            | Functions | ${functions}% | 100% |
            | Statements | ${statements}% | 100% |
            
            ${lines === 100 ? '✅ All metrics at 100%' : '❌ Coverage below 100%'}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### 3.2 Branch Protection Rules

**GitHub Repository Settings:**

1. Go to **Settings → Branches**
2. Add branch protection rule for `main` and `develop`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
     - Select `test-coverage` (Jest)
   - ✅ Require code reviews
   - ✅ Require conversation resolution before merging
   - ✅ Require branches to be up to date before merging

**Result:** No code can merge without 100% coverage passing

### 3.3 Status Check Configuration

**In .github/workflows/test-coverage.yml:**

The job name `test-coverage` and step `Fail if coverage insufficient` create a required status check. GitHub will show:
- ✅ Green if coverage = 100%
- ❌ Red if coverage < 100%

---

## Layer 4: Code Review Process

### 4.1 Pull Request Template

**File:** `.github/pull_request_template.md`

```markdown
## Description
<!-- What does this PR do? -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation

## Coverage Impact
- [ ] No new code (refactoring/docs only)
- [ ] New code with 100% test coverage
- [ ] Existing code improved with tests
- [ ] Coverage analysis included

## Coverage Report
<!-- Run: npm run test:coverage -->
<!-- Paste output: -->
\`\`\`
[Jest coverage output]
\`\`\`

## Testing
- [ ] Existing tests updated
- [ ] New tests added for new code
- [ ] All tests passing locally
- [ ] Coverage at 100%

## Pre-submission Checklist
- [ ] Tests passing: `npm test`
- [ ] Coverage at 100%: `npm run test:coverage`
- [ ] Lint passing: `npm run lint:js`
- [ ] Commit message follows Conventional Commits

---

**Coverage Before:** X%  
**Coverage After:** Y%  
**Coverage Change:** ±Z%
```

### 4.2 Code Review Checklist

**Checklist for Reviewers:**

```markdown
## Code Review Coverage Checklist

### Test Coverage
- [ ] New functions have tests
- [ ] New branches have tests (if-else, switches, etc.)
- [ ] Error paths are tested
- [ ] Edge cases are covered
- [ ] Async operations are tested
- [ ] Coverage report shows 100%

### Test Quality
- [ ] Tests are specific (not generic)
- [ ] Tests use meaningful names
- [ ] Mocks are appropriate and necessary
- [ ] Fixtures are reusable
- [ ] Tests are isolated and independent
- [ ] No flaky tests

### Documentation
- [ ] Tests document expected behavior
- [ ] Complex test logic is commented
- [ ] Coverage gaps are explained (if any)
- [ ] Test purpose is clear
```

---

## Layer 5: Incremental Coverage Restoration

### 5.1 Phased Approach

**Phase 1 (2 hours): Critical Files (P0)**
- Target: 72% → 85%
- Files: validation.js, transform.js, format.js
- Expected tests: 20 tests
- Effort: Write and validate 20 tests

```bash
# Phase 1 status check
npm run test:coverage -- --collectCoverageFrom="src/utils/validation.js" --collectCoverageFrom="src/utils/transform.js" --collectCoverageFrom="src/utils/format.js"
```

**Phase 2 (2 hours): High Priority (P1)**
- Target: 85% → 92%
- Files: formSubmit.js, BlockEditor.js
- Expected tests: 15 tests

**Phase 3 (1.5 hours): Medium Priority (P2)**
- Target: 92% → 97%
- Files: helpers.js, BlockPreview.js, blockRegistry.js
- Expected tests: 10 tests

**Phase 4 (0.5 hours): Final Polish (P3)**
- Target: 97% → 100%
- Files: constants.js, logger.js
- Expected tests: 5 tests

**Total Effort:** 6 hours test writing + 2 hours enforcement setup = **8 hours**

### 5.2 Daily Progress Tracking

**File:** `coverage-progress.json`

```json
{
  "target": 100,
  "baseline": 72,
  "phases": [
    {
      "name": "P0 - Critical",
      "target": 85,
      "current": 72,
      "files": 3,
      "tests": 20,
      "eta": "2 hours",
      "status": "in-progress"
    },
    {
      "name": "P1 - High",
      "target": 92,
      "current": 0,
      "files": 2,
      "tests": 15,
      "eta": "2 hours",
      "status": "pending"
    },
    {
      "name": "P2 - Medium",
      "target": 97,
      "current": 0,
      "files": 3,
      "tests": 10,
      "eta": "1.5 hours",
      "status": "pending"
    },
    {
      "name": "P3 - Final",
      "target": 100,
      "current": 0,
      "files": 2,
      "tests": 5,
      "eta": "0.5 hours",
      "status": "pending"
    }
  ]
}
```

### 5.3 Automation Script

**File:** `scripts/enforce-coverage.sh`

```bash
#!/bin/bash

# Coverage Enforcement Script
# Runs tests, checks coverage, and reports gaps

set -e

echo "🧪 Running Jest with coverage..."
npm run test:jest -- --coverage --colors

echo ""
echo "📊 Parsing coverage report..."

# Extract coverage from JSON
COVERAGE=$(node -e "
  const fs = require('fs');
  const data = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json', 'utf8'));
  console.log(data.total.lines.pct);
")

echo "Coverage: ${COVERAGE}%"

# Check against threshold
THRESHOLD=100
if (( $(echo "$COVERAGE < $THRESHOLD" | bc -l) )); then
  echo ""
  echo "❌ Coverage ${COVERAGE}% below threshold ${THRESHOLD}%"
  echo ""
  echo "📋 Files below 100%:"
  node -e "
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('./coverage/coverage-final.json', 'utf8'));
    Object.entries(data)
      .filter(([_, f]) => f.lines.pct < 100)
      .sort((a, b) => a[1].lines.pct - b[1].lines.pct)
      .forEach(([file, f]) => {
        console.log(\`  \${file}: \${f.lines.pct}% (gap: \${(100 - f.lines.pct).toFixed(1)}%)\`);
      });
  "
  exit 1
else
  echo "✅ Coverage at ${COVERAGE}% - PASS"
  exit 0
fi
```

### 5.4 Coverage Dashboard (Optional)

Generate HTML coverage dashboard:

```bash
npm run test:jest -- --coverage && open coverage/index.html
```

**What the dashboard shows:**
- Per-file coverage percentages
- Per-function coverage
- Line-by-line coverage visualization
- Branch coverage heat map
- Coverage trends over time

---

## Layer 6: Maintenance & Monitoring

### 6.1 Weekly Coverage Review

**Schedule:** Every Friday  
**Duration:** 15 minutes  
**Checklist:**

```markdown
## Weekly Coverage Review

- [ ] Overall coverage at 100%?
- [ ] No files regressed below 95%?
- [ ] New files added with 100% coverage?
- [ ] PR merge rate with 100% coverage?
- [ ] Any flaky tests reported?
- [ ] Coverage trend improving?
```

### 6.2 Coverage Regression Prevention

**Automated Check:**

```javascript
// scripts/check-regression.js
const fs = require('fs');
const path = require('path');

// Compare current coverage to last good build
const lastGood = JSON.parse(
  fs.readFileSync('./.coverage-baseline.json', 'utf8')
);

const current = JSON.parse(
  fs.readFileSync('./coverage/coverage-final.json', 'utf8')
);

const regressions = [];

Object.entries(current).forEach(([file, data]) => {
  const lastGoodData = lastGood[file];
  if (!lastGoodData) return;  // New file, skip
  
  if (data.lines.pct < lastGoodData.lines.pct) {
    regressions.push({
      file,
      previous: lastGoodData.lines.pct,
      current: data.lines.pct,
      drop: lastGoodData.lines.pct - data.lines.pct
    });
  }
});

if (regressions.length > 0) {
  console.error('⚠️  Coverage Regressions Detected:\n');
  regressions
    .sort((a, b) => b.drop - a.drop)
    .forEach(r => {
      console.error(`  ${r.file}`);
      console.error(`    ${r.previous}% → ${r.current}% (-${r.drop.toFixed(1)}%)\n`);
    });
  
  process.exit(1);
}

console.log('✅ No coverage regressions detected');
process.exit(0);
```

### 6.3 Coverage Baseline Management

**Save good baseline:**
```bash
cp coverage/coverage-final.json .coverage-baseline.json
git add .coverage-baseline.json
git commit -m "chore: update coverage baseline"
```

**Restore on regression:**
```bash
cp .coverage-baseline.json coverage/coverage-final.json
npm run test:jest -- --coverage
```

---

## Summary: Enforcement Strategy

### Multi-Layer Defense

| Layer | Tool | When | Response |
|-------|------|------|----------|
| 1 | Jest Config | Every test run | Fail if < 100% |
| 2 | Pre-commit Hook | Before commit | Block commit if < 100% |
| 3 | CI/CD Pipeline | On push/PR | Block merge if < 100% |
| 4 | Code Review | During review | Require coverage proof |
| 5 | Branch Protection | At merge time | Require CI to pass |
| 6 | Monitoring | Weekly | Detect regressions |

### Timeline to 100%

| Phase | Effort | Current | Target | Status |
|-------|--------|---------|--------|--------|
| P0 - Critical | 2h | 72% | 85% | Now |
| P1 - High | 2h | 85% | 92% | Next |
| P2 - Medium | 1.5h | 92% | 97% | Then |
| P3 - Final | 0.5h | 97% | 100% | Final |
| **Enforcement Setup** | **2h** | **100%** | **Maintained** | **Parallel** |

**Total Time to 100% + Enforcement:** 8 hours

### Success Criteria

✅ **Phase 1 Complete:** All P0 files at 100%  
✅ **Phase 2 Complete:** All P1 files at 100%  
✅ **Phase 3 Complete:** All P2 files at 100%  
✅ **Phase 4 Complete:** All files at 100%  
✅ **Enforcement Active:** Pre-commit + CI/CD blocking non-100% code  
✅ **Baseline Set:** `.coverage-baseline.json` committed  
✅ **Branch Protection:** `main` and `develop` require 100% coverage  
✅ **Monitoring Active:** Weekly coverage reviews scheduled  

---

## Implementation Checklist

- [ ] Update jest.config.js with 100% thresholds
- [ ] Add leftover.yml with pre-commit hooks
- [ ] Install and verify lefthook hooks
- [ ] Create GitHub Actions workflow
- [ ] Configure branch protection rules
- [ ] Add PR template with coverage section
- [ ] Write enforcement scripts (check-coverage.js, check-regression.js)
- [ ] Phase 1: Write P0 tests (20 tests, 2 hours)
- [ ] Phase 2: Write P1 tests (15 tests, 2 hours)
- [ ] Phase 3: Write P2 tests (10 tests, 1.5 hours)
- [ ] Phase 4: Write P3 tests (5 tests, 0.5 hours)
- [ ] Set baseline: `cp coverage/coverage-final.json .coverage-baseline.json`
- [ ] Verify all workflows passing
- [ ] Schedule weekly coverage reviews
- [ ] Document coverage process for team

---

## Appendix: Quick Reference

### Run Coverage Locally
```bash
npm run test:jest -- --coverage
npm run test:coverage:html  # Open interactive dashboard
```

### Check for Gaps
```bash
npm run test:jest -- --coverage && node scripts/check-coverage.js
```

### Enforce Before Commit
```bash
npx lefthook run pre-commit
```

### Run CI/CD Locally
```bash
npm run test:ci
```

### See Coverage Trends
```bash
npm run test:jest -- --coverage --listTests | sort > .tests-list.txt
# Compare over time
```

---

**Next:** Implement layers 1-3 today, execute test writing tomorrow, complete enforcement by end of week.

