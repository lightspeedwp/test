# Jest Coverage Gap Analysis Methodology

## Overview
This document outlines a systematic approach to identify, analyze, and remediate coverage gaps from a 87% → 72% regression in Jest test coverage after validation utilities refactoring.

## Phase 1: Coverage Baseline & Delta Analysis

### 1.1 Collect Coverage Data
```bash
# Generate baseline coverage before refactoring
npm test -- --coverage --coverageReporters=json > coverage-before.json

# Generate current coverage after refactoring
npm test -- --coverage --coverageReporters=json > coverage-after.json

# Generate HTML report for visual inspection
npm test -- --coverage --coverageReporters=html
# Open coverage/index.html
```

### 1.2 Parse Coverage JSON Structure
Coverage JSON follows this structure:
```json
{
  "total": {
    "lines": { "total": 1000, "covered": 870, "skipped": 0, "pct": 87.0 },
    "statements": { "total": 1050, "covered": 900, "skipped": 0, "pct": 85.7 },
    "functions": { "total": 200, "covered": 180, "skipped": 0, "pct": 90.0 },
    "branches": { "total": 300, "covered": 240, "skipped": 0, "pct": 80.0 }
  },
  "files": {
    "src/validators/email.ts": {
      "lines": { "total": 45, "covered": 38, "skipped": 0, "pct": 84.4 },
      "statements": { "total": 50, "covered": 42, "skipped": 0, "pct": 84.0 },
      "functions": { "total": 8, "covered": 7, "skipped": 0, "pct": 87.5 },
      "branches": { "total": 15, "covered": 12, "skipped": 0, "pct": 80.0 }
    }
  }
}
```

### 1.3 Calculate Coverage Deltas
Compare before/after by file:
```
File: src/validators/email.ts
  Lines:       38/45 (84.4%) → 30/45 (66.7%) | -7 lines | -17.7%
  Functions:    7/8  (87.5%) → 6/8   (75.0%) | -1 func  | -12.5%
  Branches:    12/15 (80.0%) → 9/15  (60.0%) | -3 branch| -20.0%
  
PRIORITY: HIGH (>15% regression)
```

## Phase 2: Coverage Gap Identification

### 2.1 File-Level Analysis
1. **Sort files by coverage delta** (highest regression first)
2. **Categorize by impact**:
   - **Critical**: >20% regression in >10 lines
   - **High**: 15-20% regression
   - **Medium**: 5-15% regression
   - **Low**: <5% regression

### 2.2 Function-Level Gaps
Use coverage HTML report to identify:
- **Uncovered functions** (red highlighting)
- **Partially covered functions** (yellow highlighting)
- **Untested branches** within functions

### 2.3 Branch Coverage Analysis
Identify decision points with low coverage:
```
// Example: Only true path tested
if (isValidEmail(value)) {      // ✓ Covered
  return true;
} else {
  return false;                  // ✗ Uncovered (false branch)
}
```

## Phase 3: Root Cause Analysis

### 3.1 Refactoring Impact Assessment
For each gap, determine:
1. **Was the code deleted?** (legitimate gap if old tests remain)
2. **Was the code renamed?** (tests may need path updates)
3. **Was the signature changed?** (tests need updating)
4. **Was new logic added?** (tests genuinely missing)

### 3.2 Test Removal Analysis
Check git diff for removed tests:
```bash
git diff HEAD^ -- **/*.test.ts **/*.spec.ts | grep "^-"
```

### 3.3 Import/Export Changes
Verify re-exported or moved functions are still testable:
```bash
# Check for missing test files
git diff HEAD^ -- src | grep "^+++ b/src" | while read line; do
  FILE=$(echo $line | cut -d' ' -f2)
  TEST_FILE="${FILE%.ts}.test.ts"
  [ ! -f "$TEST_FILE" ] && echo "MISSING: $TEST_FILE"
done
```

## Phase 4: Prioritization Framework

### 4.1 Scoring Matrix
```
Priority = (Coverage Regression % × File Criticality) ÷ Estimated Test Effort

Coverage Regression: Delta percentage (0-100)
File Criticality:
  - Core validators: 5.0
  - Utility functions: 3.0
  - Helpers: 1.5
  - Type definitions: 0.5

Estimated Test Effort:
  - Simple functions (1-2 inputs): 0.5 hours
  - Medium functions (3-5 inputs, 1-3 branches): 2 hours
  - Complex functions (6+ inputs, 4+ branches): 4+ hours
```

### 4.2 Priority Tiers
```
TIER 1 (START HERE): Score > 30
  - Most critical functions with highest regression
  - Likely in core validation paths
  
TIER 2: Score 15-30
  - Important functions with moderate gaps
  - Secondary validation logic
  
TIER 3: Score 5-15
  - Nice-to-have coverage improvements
  - Edge case handling
  
TIER 4: Score < 5
  - Low-impact utility coverage
  - Type guards and assertions
```

## Phase 5: Test Case Design

### 5.1 Coverage Categories by Code Type

#### Decision Points (if/else, switch)
- **Test both paths**: true and false branches
- **Edge cases**: null, undefined, empty values
- **Boundary values**: min/max limits

#### Loops
- **Zero iterations**: empty array/collection
- **Single iteration**: array with one item
- **Multiple iterations**: normal case

#### Exception Handling
- **Happy path**: normal inputs, expected output
- **Error path**: invalid inputs, exception thrown
- **Edge cases**: boundary conditions

#### Functions with Multiple Parameters
- **Combination testing**: different parameter combinations
- **Optional parameters**: with and without values
- **Type variations**: different input types

### 5.2 Test Case Naming Convention
```typescript
// ✓ Good - describes input and expected output
test('validateEmail returns true for valid email format', () => {})

test('validateEmail returns false for missing domain', () => {})

test('validateEmail throws error for null input', () => {})

// ✗ Avoid - vague or incomplete
test('email validation works', () => {})
test('test 5', () => {})
```

## Phase 6: Coverage Enforcement

### 6.1 Jest Configuration
```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      lines: 85,
      functions: 85,
      branches: 80,
      statements: 85
    },
    './src/validators/': {
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100
    }
  }
};
```

### 6.2 CI/CD Integration
```yaml
# GitHub Actions example
- name: Run tests with coverage
  run: npm test -- --coverage --watchAll=false

- name: Check coverage thresholds
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 85" | bc -l) )); then
      echo "Coverage below 85%: $COVERAGE%"
      exit 1
    fi
```

### 6.3 Pre-commit Hook
```bash
#!/bin/bash
# .husky/pre-commit
npm test -- --coverage --watchAll=false
if [ $? -ne 0 ]; then
  echo "Coverage check failed"
  exit 1
fi
```

## Phase 7: Metrics & Reporting

### 7.1 Coverage Report Template
```
Coverage Analysis Report
========================

Overall Metrics:
  Lines:       870/1000 (87.0%) → 720/1000 (72.0%) | -15.0%
  Functions:   180/200  (90.0%) → 144/200  (72.0%) | -18.0%
  Branches:    240/300  (80.0%) → 216/300  (72.0%) | -8.0%
  Statements:  900/1050 (85.7%) → 810/1050 (77.1%) | -8.6%

File Regression Analysis:
  CRITICAL (>20% regression):
    - src/validators/email.ts: 84.4% → 66.7% (-17.7%)
    - src/validators/phone.ts: 88.0% → 62.0% (-26.0%)
  
  HIGH (15-20% regression):
    - src/validators/url.ts: 90.0% → 75.0% (-15.0%)
  
  MEDIUM (5-15% regression):
    - src/utils/normalization.ts: 85.0% → 78.0% (-7.0%)

Estimated Effort to Restore:
  New tests required: 23 test cases
  Estimated time: 18 hours
  Complexity breakdown:
    - Simple cases (30%): 6.5 hours
    - Medium cases (50%): 9 hours
    - Complex cases (20%): 2.5 hours
```

## Summary Checklist

- [ ] Generated before/after coverage JSON
- [ ] Identified all files with >5% regression
- [ ] Analyzed root causes for each gap
- [ ] Categorized gaps by priority tier
- [ ] Created test case list for critical functions
- [ ] Estimated effort and timeline
- [ ] Set up coverage enforcement thresholds
- [ ] Configured CI/CD checks
- [ ] Documented test naming conventions
- [ ] Scheduled test implementation sprint
