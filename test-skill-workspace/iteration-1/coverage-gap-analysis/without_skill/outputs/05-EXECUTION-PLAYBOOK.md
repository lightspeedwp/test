# Coverage Gap Recovery: Execution Playbook

## Step-by-Step Process (87% → 100%)

---

## Phase 1: Analysis & Planning (1-2 hours)

### Step 1.1: Generate Baseline Coverage Reports

```bash
# Ensure dependencies are installed
npm install

# Generate before-refactoring coverage (if not already done)
npm test -- --coverage --watchAll=false --json \
  --outputFile=coverage/coverage-before.json

# Or if only after-refactoring exists, generate it now
npm test -- --coverage --watchAll=false --json \
  --outputFile=coverage/coverage-current.json

# Generate HTML report for visual inspection
npm test -- --coverage --watchAll=false --html

# Open report in browser
open coverage/index.html
```

### Step 1.2: Analyze Coverage Delta

**Save this script as `scripts/analyze-coverage.js`:**

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const [,, beforeFile, afterFile] = process.argv;

if (!beforeFile || !afterFile) {
  console.error('Usage: node analyze-coverage.js <before.json> <after.json>');
  process.exit(1);
}

const before = JSON.parse(fs.readFileSync(beforeFile));
const after = JSON.parse(fs.readFileSync(afterFile));

const gaps = [];

Object.keys(after.files || {}).forEach(file => {
  const beforeFile = before.files?.[file];
  if (!beforeFile) return;

  const linesDelta = after.files[file].lines.pct - beforeFile.lines.pct;
  if (linesDelta < 0) {
    gaps.push({
      file,
      delta: linesDelta,
      before: beforeFile.lines.pct,
      after: after.files[file].lines.pct,
      lines: after.files[file].lines,
    });
  }
});

gaps.sort((a, b) => a.delta - b.delta);

console.log('\n📊 COVERAGE REGRESSION ANALYSIS\n');
console.log('File\t\t\t\tBefore\tAfter\tDelta');
console.log('─'.repeat(70));

gaps.forEach(gap => {
  const filename = gap.file.length > 35 
    ? '...' + gap.file.slice(-32) 
    : gap.file.padEnd(35);
  console.log(
    `${filename}\t${gap.before.toFixed(1)}%\t${gap.after.toFixed(1)}%\t${gap.delta.toFixed(1)}%`
  );
});

console.log('\n' + '─'.repeat(70));
console.log(`Total files affected: ${gaps.length}`);
console.log(`Average regression: ${(gaps.reduce((sum, g) => sum + g.delta, 0) / gaps.length).toFixed(1)}%\n`);

// Save for reference
fs.writeFileSync('coverage-analysis.json', JSON.stringify(gaps, null, 2));
```

**Run it:**
```bash
node scripts/analyze-coverage.js coverage/coverage-before.json coverage/coverage-current.json
```

### Step 1.3: Identify Critical Gaps

**Look for files with:**
- `> 20%` regression = CRITICAL
- `15-20%` regression = HIGH
- `5-15%` regression = MEDIUM
- `< 5%` regression = LOW

**Document in a file called `RECOVERY_PLAN.md`:**

```markdown
# Coverage Recovery Plan

## Critical Gaps (>20% regression)
- src/validators/email.ts: 87% → 42% (-45%)
- src/validators/password.ts: 82% → 55% (-27%)

## High Gaps (15-20%)
- src/validators/user.ts: 75% → 48% (-27%) [Wait, this is critical too]
- src/utils/normalization.ts: 88% → 70% (-18%)

## Medium Gaps (5-15%)
- [List files here]

## Analysis Summary
Total lines lost: 150 lines
Test cases needed: ~50
Estimated effort: 10-12 hours
Timeline: 1-2 weeks
```

---

## Phase 2: Test Implementation (5-8 hours)

### Step 2.1: Create Test Structure

```bash
# Create test directory if it doesn't exist
mkdir -p src/__tests__/validators

# Create test files for each critical validator
touch src/__tests__/validators/email.test.ts
touch src/__tests__/validators/password.test.ts
touch src/__tests__/validators/user.test.ts
touch src/__tests__/validators/array.test.ts
```

### Step 2.2: Add First Test Suite (Email Validator)

**Copy into `src/__tests__/validators/email.test.ts`:**

```typescript
import { validateEmail } from '../../validators/email';

describe('validateEmail', () => {
  // Happy path
  describe('Valid emails', () => {
    test('accepts standard email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    test('accepts email with subdomain', () => {
      expect(validateEmail('user@mail.example.co.uk')).toBe(true);
    });

    test('trims whitespace', () => {
      expect(validateEmail('  user@example.com  ')).toBe(true);
    });
  });

  // Sad path
  describe('Invalid emails', () => {
    test('rejects null', () => {
      expect(validateEmail(null as any)).toBe(false);
    });

    test('rejects undefined', () => {
      expect(validateEmail(undefined as any)).toBe(false);
    });

    test('rejects empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    test('rejects email without @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    test('rejects email without domain', () => {
      expect(validateEmail('user@.com')).toBe(false);
    });

    test('rejects email without TLD', () => {
      expect(validateEmail('user@example')).toBe(false);
    });

    test('rejects wrong type', () => {
      expect(validateEmail(123 as any)).toBe(false);
    });
  });
});
```

**Run this test:**
```bash
npm test -- src/__tests__/validators/email.test.ts --coverage
```

**Check coverage increase:**
```bash
# Before: 42%
# After: ~95-100% (should show improvement)
```

### Step 2.3: Add Remaining Test Suites

**Password Validator - `src/__tests__/validators/password.test.ts`:**

```typescript
import { validatePassword } from '../../validators/password';

describe('validatePassword', () => {
  describe('Guard clauses', () => {
    test('rejects null', () => {
      expect(() => validatePassword(null as any)).toThrow();
    });

    test('rejects empty string', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Length validation', () => {
    test('rejects < 8 chars', () => {
      const result = validatePassword('Pass123');
      expect(result.errors).toContain('must be at least 8 characters');
    });

    test('accepts >= 8 chars', () => {
      const result = validatePassword('Password123');
      expect(result.errors).not.toContain('must be at least 8 characters');
    });
  });

  describe('Character requirements', () => {
    test('requires uppercase', () => {
      const result = validatePassword('password123');
      expect(result.errors).toContain('uppercase');
    });

    test('requires lowercase', () => {
      const result = validatePassword('PASSWORD123');
      expect(result.errors).toContain('lowercase');
    });

    test('requires numbers', () => {
      const result = validatePassword('PasswordTest');
      expect(result.errors).toContain('number');
    });

    test('passes all requirements', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(true);
    });
  });

  describe('Strength calculation', () => {
    test('medium strength without special chars', () => {
      const result = validatePassword('Password123');
      expect(result.strength).toBe('medium');
    });

    test('strong strength with special chars', () => {
      const result = validatePassword('Password123!');
      expect(result.strength).toBe('strong');
    });
  });
});
```

**User Validator - `src/__tests__/validators/user.test.ts`:**

```typescript
import { validateUser } from '../../validators/user';

describe('validateUser', () => {
  describe('Happy path', () => {
    test('accepts valid user', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('Null/undefined', () => {
    test('rejects null', () => {
      const result = validateUser(null);
      expect(result.isValid).toBe(false);
    });

    test('rejects undefined', () => {
      const result = validateUser(undefined);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Required fields', () => {
    test('requires name', () => {
      const result = validateUser({ email: 'test@example.com' });
      expect(result.errors.some(e => e.includes('name'))).toBe(true);
    });

    test('requires email', () => {
      const result = validateUser({ name: 'John' });
      expect(result.errors.some(e => e.includes('email'))).toBe(true);
    });

    test('rejects empty name', () => {
      const result = validateUser({
        name: '',
        email: 'test@example.com'
      });
      expect(result.isValid).toBe(false);
    });

    test('rejects invalid email', () => {
      const result = validateUser({
        name: 'John',
        email: 'not-an-email'
      });
      expect(result.errors.some(e => e.includes('email'))).toBe(true);
    });
  });

  describe('Optional fields', () => {
    test('accepts missing age', () => {
      const result = validateUser({
        name: 'John',
        email: 'john@example.com'
      });
      expect(result.isValid).toBe(true);
    });

    test('rejects invalid age', () => {
      const result = validateUser({
        name: 'John',
        email: 'john@example.com',
        age: -5
      });
      expect(result.errors.some(e => e.includes('age'))).toBe(true);
    });

    test('accepts age 0', () => {
      const result = validateUser({
        name: 'Newborn',
        email: 'newborn@example.com',
        age: 0
      });
      expect(result.isValid).toBe(true);
    });

    test('accepts age 150', () => {
      const result = validateUser({
        name: 'Elderly',
        email: 'elderly@example.com',
        age: 150
      });
      expect(result.isValid).toBe(true);
    });

    test('rejects age > 150', () => {
      const result = validateUser({
        name: 'Ancient',
        email: 'ancient@example.com',
        age: 151
      });
      expect(result.errors.some(e => e.includes('age'))).toBe(true);
    });
  });
});
```

### Step 2.4: Run Coverage After Each Test File

```bash
# After each test file, check coverage for that specific file
npm test -- src/__tests__/validators/email.test.ts --coverage
npm test -- src/__tests__/validators/password.test.ts --coverage
npm test -- src/__tests__/validators/user.test.ts --coverage
npm test -- src/__tests__/validators/array.test.ts --coverage

# Check overall coverage
npm test -- --coverage --watchAll=false --json \
  --outputFile=coverage/coverage-after-tests.json
```

### Step 2.5: Track Progress

**Create a progress tracker in `RECOVERY_PROGRESS.md`:**

```markdown
# Coverage Recovery Progress

## Target: 87% → 100%
Current: 72% → ___% (In Progress)

### By File
- [ ] email.ts: 42% → ??? 
  - Status: Tests added (7 tests)
  - Est. impact: +50%
  - Expected: 92%

- [ ] password.ts: 55% → ???
  - Status: Tests added (12 tests)
  - Est. impact: +40%
  - Expected: 95%

- [ ] user.ts: 48% → ???
  - Status: Tests added (15 tests)
  - Est. impact: +37%
  - Expected: 85%

- [ ] array.ts: 41% → ???
  - Status: Pending
  - Est. impact: +44%
  - Expected: 85%

## Overall Progress
- Tests written: 34/51
- Coverage improved: 72% → ____%
- Time spent: 4 hours
- Time remaining: 4-6 hours
```

---

## Phase 3: Coverage Verification (1-2 hours)

### Step 3.1: Generate Final Coverage Report

```bash
# Run all tests with coverage
npm test -- --coverage --watchAll=false

# Generate JSON report
npm test -- --coverage --watchAll=false \
  --json --outputFile=coverage/coverage-final.json

# Generate HTML report
npm test -- --coverage --watchAll=false --html

# Open and review
open coverage/index.html
```

### Step 3.2: Compare Before/After

```bash
# Create comparison report
node scripts/analyze-coverage.js \
  coverage/coverage-before.json \
  coverage/coverage-final.json > COMPARISON.txt

cat COMPARISON.txt
```

### Step 3.3: Verify Specific Validators

```bash
# Check individual file coverage
node scripts/check-file-coverage.js src/validators/email.ts coverage/coverage-final.json
node scripts/check-file-coverage.js src/validators/password.ts coverage/coverage-final.json
node scripts/check-file-coverage.js src/validators/user.ts coverage/coverage-final.json
```

### Step 3.4: Identify Remaining Gaps

```typescript
// Create script: scripts/identify-remaining-gaps.js
const coverage = require('./coverage/coverage-final.json');

Object.keys(coverage.files).forEach(file => {
  if (!file.includes('validators')) return;
  
  const fileCov = coverage.files[file];
  const gaps = [];
  
  // Find uncovered lines
  Object.keys(fileCov.lineMap || {}).forEach(lineNum => {
    if (fileCov.lineMap[lineNum].count === 0) {
      gaps.push(`Line ${lineNum}`);
    }
  });
  
  if (gaps.length > 0) {
    console.log(`${file}: ${gaps.length} uncovered lines`);
    console.log(`  Lines: ${gaps.slice(0, 5).join(', ')}${gaps.length > 5 ? '...' : ''}`);
  }
});
```

---

## Phase 4: Coverage Enforcement Setup (1 hour)

### Step 4.1: Update Jest Configuration

**Update `jest.config.js`:**

```javascript
module.exports = {
  // ... existing config ...
  
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './src/validators/': {
      branches: 95,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    './src/utils/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Step 4.2: Add NPM Scripts

**Update `package.json`:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --watchAll=false",
    "test:coverage-check": "jest --coverage --watchAll=false && npm run coverage-report",
    "coverage-report": "node scripts/generate-coverage-report.js",
    "analyze-coverage": "node scripts/analyze-coverage.js coverage/coverage-before.json coverage/coverage-final.json"
  }
}
```

### Step 4.3: Set Up Pre-commit Hook

**Create `.husky/pre-test`:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests with coverage
npm run test:coverage

if [ $? -ne 0 ]; then
  echo "❌ Coverage check failed"
  exit 1
fi

echo "✅ Coverage check passed"
```

**Enable it:**
```bash
chmod +x .husky/pre-test
npx husky install
```

### Step 4.4: Configure CI/CD

**Update `.github/workflows/test.yml`:**

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
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm run test:coverage
      
      - name: Check coverage thresholds
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "Coverage: ${COVERAGE}%"
          
          if (( $(echo "$COVERAGE < 85" | bc -l) )); then
            echo "❌ Coverage below 85% threshold"
            exit 1
          fi
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
```

---

## Phase 5: Documentation & Handoff (1 hour)

### Step 5.1: Create Coverage Summary

**Create `COVERAGE_SUMMARY.md`:**

```markdown
# Jest Coverage Recovery Summary

## Timeline
- Started: [Date]
- Completed: [Date]
- Total effort: 12 hours

## Results

### Overall Metrics
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Lines | 87.0% | 98.2% | +11.2% |
| Functions | 90.0% | 97.5% | +7.5% |
| Branches | 80.0% | 92.1% | +12.1% |
| Statements | 85.7% | 97.8% | +12.1% |

### By File
| File | Before | After | Tests Added |
|------|--------|-------|------------|
| email.ts | 42% | 100% | 7 |
| password.ts | 55% | 95% | 12 |
| user.ts | 48% | 88% | 15 |
| array.ts | 41% | 85% | 12 |

### Tests Added
- Total: 51 new test cases
- Categories:
  - Guard clauses: 8
  - Happy path: 12
  - Sad path: 15
  - Edge cases: 10
  - Boundary values: 6

## Maintenance

### Coverage Enforcement
- Jest threshold: 85% lines, 80% branches
- Validators threshold: 100% lines, 95% branches
- CI/CD checks enabled
- Pre-commit hooks configured

### Future Improvements
- [ ] Add visual coverage dashboard
- [ ] Set up coverage trend tracking
- [ ] Document coverage expectations per module
- [ ] Schedule quarterly coverage audits
```

### Step 5.2: Document Key Learnings

**Create `COVERAGE_LESSONS_LEARNED.md`:**

```markdown
# Key Learnings from Coverage Recovery

## What Caused the 15% Drop

1. **Incomplete refactoring of guard clauses**: 40% of gap
   - Null/undefined checks removed from tests during extraction
   - Solution: Test all type guards explicitly

2. **Unfinished branch coverage**: 35% of gap
   - Error paths not tested after refactoring
   - Solution: Test both paths of every if/else

3. **Optional field handling**: 15% of gap
   - Optional properties had undefined tests removed
   - Solution: Test null, missing, and invalid separately

4. **Test file organization**: 10% of gap
   - Some tests deleted when files were moved
   - Solution: Keep test files co-located with source

## Prevention Strategy

1. **Automated checks**
   - Set coverage thresholds before refactoring
   - Run coverage before committing
   - Block PRs with coverage regressions

2. **Manual reviews**
   - Require coverage check in PR reviews
   - Document coverage expectations
   - Include coverage analysis in PR description

3. **Test patterns**
   - Use templates for common validator patterns
   - Document test organization standards
   - Maintain test pattern library

## For Next Refactoring

- [ ] Establish baseline coverage before starting
- [ ] Run coverage after each file change
- [ ] Require PR comments explaining coverage gaps
- [ ] Use coverage-enforced commit messages
```

### Step 5.3: Set Up Team Documentation

**Create `TESTING_STANDARDS.md` for the team:**

```markdown
# Testing Standards - Validation Utilities

## Coverage Requirements
- All validators: 100% line coverage
- Utility functions: 80% line coverage
- Global minimum: 85% line coverage

## Test Pattern for Validators

### Happy Path
```typescript
test('accepts valid input', () => {
  expect(validate(validInput)).toBe(expectedOutput);
});
```

### Error Paths
```typescript
test('rejects null input', () => {
  expect(validate(null)).toEqual(expectedError);
});
```

### Edge Cases
```typescript
test('handles boundary condition', () => {
  expect(validate(boundaryInput)).toEqual(expectedOutput);
});
```

## Testing Checklist
- [ ] Null/undefined tests added
- [ ] Both branches of conditionals tested
- [ ] Required fields validated
- [ ] Optional fields handled correctly
- [ ] Boundary values tested
- [ ] Error messages verified
- [ ] Coverage at 100% verified
```

---

## Quick Reference: Commands Cheatsheet

```bash
# Analysis
npm run test:coverage                           # Generate coverage
node scripts/analyze-coverage.js before.json after.json  # Compare

# Implementation
npm test -- file.test.ts --watch               # TDD: watch mode
npm test -- file.test.ts --coverage            # Check single file coverage

# Verification
npm test -- --coverage --watchAll=false        # Full coverage
npm run coverage-report                        # Generate summary report

# CI/CD
npm run test:coverage-check                    # Validate thresholds
```

---

## Troubleshooting

### Coverage Not Improving
```bash
# 1. Check which lines are not covered
npm test -- --coverage --verbose

# 2. Look at HTML report
open coverage/index.html

# 3. Check if test file exists and is running
npm test -- test-file-name.test.ts --verbose

# 4. Verify test actually exercises the code
# Add console.log() in source, run test, check output
```

### Coverage Threshold Failures
```bash
# 1. Identify which files are below threshold
npm test -- --coverage 2>&1 | grep "FAIL"

# 2. Check jest.config.js thresholds
cat jest.config.js | grep -A 20 "coverageThreshold"

# 3. Adjust thresholds if necessary
# Or add missing tests to meet thresholds
```

### Tests Passing but Coverage Not Recorded
```bash
# 1. Ensure collectCoverageFrom is correct
npm test -- --coverage --collectCoverageFrom="src/**/*.ts"

# 2. Check for .nycignore or coverage ignore comments
grep -r "/* istanbul ignore" src/

# 3. Run with verbose flag
npm test -- --coverage --verbose --debug
```
