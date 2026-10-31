# Jest Coverage Gap Analysis Methodology
## From 87% to 72% — Validation Utilities Refactoring

**Analysis Date:** 2026-10-30  
**Coverage Drop:** 15% (87% → 72%)  
**Root Cause:** Validation utilities refactoring without corresponding test updates  
**Target:** Restore and enforce 100% coverage  

---

## 1. Coverage Analysis Framework

### Phase 1: Baseline & Gap Discovery

**1.1 Generate Detailed Coverage Report**

```bash
# Generate coverage with all reporters
npm run test:jest -- --coverage \
  --coverageReporters=json \
  --coverageReporters=text \
  --coverageReporters=lcov \
  --coverageReporters=html

# Output files:
# - coverage/coverage-final.json (machine-readable)
# - coverage/index.html (interactive dashboard)
```

**1.2 Parse Coverage Metrics**

```json
{
  "total": {
    "lines": { "total": 1250, "covered": 900, "pct": 72 },
    "branches": { "total": 320, "covered": 230, "pct": 71.9 },
    "functions": { "total": 180, "covered": 128, "pct": 71.1 },
    "statements": { "total": 1280, "covered": 922, "pct": 72 }
  }
}
```

**Gap Analysis:**
- Lines to cover: 350 (1250 - 900)
- Branches to cover: 90 (320 - 230)
- Functions to cover: 52 (180 - 128)
- Statements to cover: 358 (1280 - 922)

### Phase 2: Categorize Gap Types

**Gap Category Matrix:**

| Gap Type | Count | Priority | Effort | Impact |
|----------|-------|----------|--------|--------|
| Uncovered lines | 350 | High | Medium | Critical path |
| Uncovered branches | 90 | High | High | Logic branches |
| Uncovered functions | 52 | High | Low | New functions |
| Error handling paths | ~45 | Critical | High | Reliability |
| Edge cases | ~30 | Critical | Medium | Robustness |
| Conditional logic | ~60 | High | Medium | Branch coverage |
| Return value variations | ~25 | Medium | Low | Output validation |

### Phase 3: Root Cause Analysis

**Common Gap Patterns in Validation Utilities Refactoring:**

1. **New utility functions** — Created during refactoring, no tests written
2. **Restructured error handling** — Error paths not covered in new structure
3. **New conditional logic** — Branch coverage gaps from refactored conditionals
4. **Extracted helper functions** — New functions without callers in tests
5. **Async operations** — Promise handling not tested
6. **Dependency injection changes** — Mock injection not updated

---

## 2. Coverage Gap Analysis Workflow

### Step 1: Identify Files Below 100%

**Script: `analyze-coverage-gaps.js`**

```javascript
const fs = require('fs');
const path = require('path');

// Read coverage-final.json
const coverage = JSON.parse(
  fs.readFileSync('./coverage/coverage-final.json', 'utf8')
);

// Categorize by coverage level
const gapsByLevel = {
  critical: [],    // < 50% coverage
  severe: [],      // 50-75% coverage
  moderate: [],    // 75-90% coverage
  minor: []        // 90-99% coverage
};

Object.entries(coverage).forEach(([file, data]) => {
  const lineCoverage = data.lines.pct;
  
  if (lineCoverage < 100) {
    const gap = { file, lineCoverage, data };
    
    if (lineCoverage < 50) gapsByLevel.critical.push(gap);
    else if (lineCoverage < 75) gapsByLevel.severe.push(gap);
    else if (lineCoverage < 90) gapsByLevel.moderate.push(gap);
    else gapsByLevel.minor.push(gap);
  }
});

console.log('COVERAGE GAP ANALYSIS\n');
console.log(`Critical (< 50%): ${gapsByLevel.critical.length} files`);
console.log(`Severe (50-75%): ${gapsByLevel.severe.length} files`);
console.log(`Moderate (75-90%): ${gapsByLevel.moderate.length} files`);
console.log(`Minor (90-99%): ${gapsByLevel.minor.length} files\n`);

// Prioritize by: coverage % (ascending) × criticality (lines/branches/functions)
gapsByLevel.critical
  .sort((a, b) => a.lineCoverage - b.lineCoverage)
  .forEach(({ file, lineCoverage, data }) => {
    console.log(`${file}`);
    console.log(`  Lines: ${lineCoverage}% (${data.lines.covered}/${data.lines.total})`);
    console.log(`  Branches: ${data.branches.pct}% (${data.branches.covered}/${data.branches.total})`);
    console.log(`  Functions: ${data.functions.pct}% (${data.functions.covered}/${data.functions.total})\n`);
  });
```

### Step 2: Locate Uncovered Lines

**Using Istanbul/NYC instrumentation:**

```bash
# Run with line-by-line display
npm run test:jest -- --coverage --verbose 2>&1 | grep -A 5 "UNCOVERED"

# Interactive coverage viewer
npm run test:jest -- --coverage
open coverage/index.html
```

**HTML Coverage Report shows:**
- Green lines: covered
- Red lines: uncovered
- Yellow lines: partially covered branches

### Step 3: Map Gaps to Functions

**Coverage data structure:**

```json
{
  "src/utils/validation.js": {
    "lines": {
      "total": 125,
      "covered": 78,
      "pct": 62.4,
      "details": [
        { "line": 15, "count": 3 },    // Covered 3 times
        { "line": 16, "count": 0 },    // Uncovered
        { "line": 17, "count": 2 },    // Covered 2 times
      ]
    },
    "functions": {
      "total": 12,
      "covered": 8,
      "pct": 66.7,
      "details": {
        "isValidEmail": 1,       // Covered
        "isValidPhone": 0,       // Uncovered
        "isValidZipCode": 1,     // Covered
        "validateForm": 0,       // Uncovered
      }
    }
  }
}
```

---

## 3. Test Case Prioritization Matrix

### Prioritization Score Calculation

```
Priority Score = (Coverage Gap % × Weight_Coverage) +
                (Function Count × Weight_Function) +
                (Branch Count × Weight_Branch) +
                (Import Count × Weight_Criticality)

Where:
- Weight_Coverage: 0.5 (impact of coverage gap size)
- Weight_Function: 0.2 (number of functions affected)
- Weight_Branch: 0.2 (branch coverage complexity)
- Weight_Criticality: 0.1 (used by other modules)
```

### Priority Queue Example

| Priority | File | Coverage | Functions | Branches | Est. Effort | Est. Tests |
|----------|------|----------|-----------|----------|-------------|-----------|
| **P0** | `src/utils/validation.js` | 62% | 4 uncovered | 12 | 4h | 18 |
| **P1** | `src/utils/transform.js` | 71% | 3 uncovered | 8 | 3h | 12 |
| **P2** | `src/utils/format.js` | 78% | 2 uncovered | 6 | 2h | 8 |
| **P3** | `src/utils/helpers.js` | 85% | 1 uncovered | 4 | 1h | 4 |

---

## 4. Uncovered Code Patterns

### Pattern A: New Utility Functions (No Tests)

**Detection:**
- Functions with 0% coverage
- Export statements with no imports in tests
- New functions added during refactoring

**Example:**

```javascript
// src/utils/validation.js (NEW — no tests)
export function validateBlockAttributes(attrs) {
  if (!attrs || typeof attrs !== 'object') {
    throw new Error('Invalid attributes');
  }
  
  if (!attrs.title || attrs.title.trim().length === 0) {
    return { valid: false, error: 'Title required' };
  }
  
  return { valid: true };  // Uncovered return
}
```

**Coverage Gap:**
- Function: 0% (never called)
- Lines 2-3: Covered (error thrown in test)
- Line 5: Uncovered (missing test case)
- Line 8: Uncovered (missing test case)

### Pattern B: Error Handling Paths

**Detection:**
- Catch blocks with 0% coverage
- Throw statements with 0% count
- Error condition branches untested

**Example:**

```javascript
export function loadConfig(path) {
  try {
    const config = fs.readFileSync(path, 'utf8');
    return JSON.parse(config);
  } catch (e) {      // Uncovered — error path untested
    logger.error(e);
    throw new Error('Config load failed');
  }
}
```

**Coverage Gap:**
- Try block: 100% (happy path tested)
- Catch block: 0% (error path not tested)

### Pattern C: Conditional Branches

**Detection:**
- If/else blocks with branch count > covered
- Ternary operators with one branch untested
- Switch cases with unreached cases

**Example:**

```javascript
export function getValidationLevel(type) {
  if (type === 'strict') return 'strict';       // Covered
  else if (type === 'moderate') return 'moderate';  // Uncovered
  else if (type === 'lenient') return 'lenient';    // Uncovered
  else throw new Error('Invalid type');         // Uncovered
}
```

**Coverage Gap:**
- Lines: 4/5 (80%)
- Branches: 1/4 (25%)
- Missing: 3 branch tests

### Pattern D: Async Operations (Promises/Async-Await)

**Detection:**
- Promise `.catch()` not tested
- Async functions with error path untested
- Timeout scenarios missing

**Example:**

```javascript
export async function fetchValidationRules(url) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch');  // Uncovered
  }
  
  return response.json();
}
```

**Coverage Gap:**
- Happy path (200 response): Covered
- Error path (non-200 response): Uncovered

### Pattern E: Extracted Helper Functions

**Detection:**
- Functions with only 1-2 callers in source
- Functions not called from test files
- Helper functions with complex logic

**Example:**

```javascript
// Extracted during refactoring
function parseValidationRules(text) {
  const rules = [];
  
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;  // Uncovered
    
    const [key, value] = line.split('=');
    rules.push({ key, value });
  }
  
  return rules;  // Uncovered empty case
}

// Only called from here (not from tests)
export function loadRules(path) {
  const text = fs.readFileSync(path, 'utf8');
  return parseValidationRules(text);
}
```

**Coverage Gap:**
- Helper function: 20% (only happy path tested)
- Skip empty line logic: Uncovered
- Return statement: Uncovered (empty input)

---

## 5. Coverage Enforcement Strategy

### 5.1 Jest Configuration

**jest.config.js:**

```javascript
module.exports = {
  // Coverage collection
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js',
    '!src/cli.js'  // Exclude CLI if needed
  ],
  
  // Coverage thresholds (enforce 100%)
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    // Per-file enforcement
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
    }
  },
  
  // Coverage reporting
  coverageReporters: [
    'text',      // Console output
    'json',      // Machine-readable
    'html',      // Interactive dashboard
    'lcov'       // For CI integration
  ],
  
  // Fail on insufficient coverage
  coverageFailureThreshold: 100,
  
  // Show coverage in test output
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ]
};
```

### 5.2 CI/CD Enforcement

**.github/workflows/test.yml:**

```yaml
name: Test Coverage

on: [push, pull_request]

jobs:
  coverage:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm run test:jest -- --coverage
      
      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "Coverage: ${COVERAGE}%"
          
          if (( $(echo "$COVERAGE < 100" | bc -l) )); then
            echo "❌ Coverage below 100%: ${COVERAGE}%"
            exit 1
          fi
          
          echo "✅ Coverage at 100%: ${COVERAGE}%"
      
      - name: Upload coverage report
        if: always()
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: jest
          name: jest-coverage
```

### 5.3 Pre-commit Hook

**lefthook.yml:**

```yaml
pre-commit:
  commands:
    jest-coverage:
      glob: "src/**/*.js"
      run: npm run test:jest -- --coverage --bail --updateSnapshot=false
      fail_text: "Jest coverage below 100%"
```

### 5.4 Incremental Coverage Improvement

**Phase 1: Address Critical Gaps (P0)**
- Start with files at < 50% coverage
- Write tests for uncovered functions
- Expected: Restore to 80%+ in these files

**Phase 2: Fix Severe Gaps (P1)**
- Files at 50-75% coverage
- Complete branch coverage
- Expected: Reach 90%+ in these files

**Phase 3: Eliminate Moderate Gaps (P2)**
- Files at 75-90% coverage
- Edge case testing
- Expected: Achieve 95%+ in these files

**Phase 4: Perfect Coverage (P3)**
- Files at 90-99% coverage
- Final edge cases
- Expected: Achieve 100% in all files

---

## 6. Success Metrics

| Metric | Target | Current | Gap |
|--------|--------|---------|-----|
| Overall line coverage | 100% | 72% | 28% |
| Overall branch coverage | 100% | 71.9% | 28.1% |
| Overall function coverage | 100% | 71.1% | 28.9% |
| Files at 100% coverage | 100% | ~40% | ~60% |
| Test pass rate | 100% | 100% | 0% |
| CI coverage enforcement | Enabled | Partial | Needs hardening |

---

## 7. Timeline & Effort Estimation

**Assuming ~18 uncovered functions and ~90 uncovered branches:**

| Phase | Files | Functions | Time | Tests |
|-------|-------|-----------|------|-------|
| **Phase 1** | 3 files | 4 functions | 4 hours | 18 tests |
| **Phase 2** | 2 files | 3 functions | 3 hours | 12 tests |
| **Phase 3** | 2 files | 2 functions | 2 hours | 8 tests |
| **Phase 4** | 1 file | 1 function | 1 hour | 4 tests |
| **Total** | **8 files** | **10 functions** | **10 hours** | **42 tests** |

---

## 8. Key Takeaways

✅ **Coverage Gap Analysis Methodology:**
1. Generate detailed coverage reports (JSON, HTML)
2. Parse metrics by file and function
3. Categorize gaps (uncovered lines, branches, functions)
4. Identify root causes (new functions, error paths, branches)
5. Prioritize by coverage % × criticality

✅ **Enforcement Approach:**
1. Configure Jest with 100% thresholds
2. Enable CI/CD coverage gates
3. Set up pre-commit hooks
4. Maintain incremental improvements

✅ **Expected Outcome:**
- Return from 72% to 100% coverage
- Enforce 100% on all new code
- Prevent future coverage regressions

---

**Next Steps:**
- See `02-UNCOVERED-FILES-FUNCTIONS.md` for specific files/functions
- See `03-PRIORITIZED-TEST-CASES.md` for test prioritization
- See `04-TEST-CASE-TEMPLATES.md` for test templates
- See `05-COVERAGE-ENFORCEMENT-STRATEGY.md` for CI/CD setup
