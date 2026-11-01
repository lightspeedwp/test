# Coverage Gap Prioritization & Action Plan

## Executive Summary

When Jest coverage drops from 87% → 72%, you've lost ~150 lines of coverage across validation utilities. This guide prioritizes recovery based on impact, effort, and criticality.

---

## Scoring Matrix: What to Fix First

### Priority Score Formula
```
PRIORITY_SCORE = (
  COVERAGE_REGRESSION_PCT × 10 +      // How much coverage was lost (0-100)
  FILE_CRITICALITY_WEIGHT +            // How critical is this code (1-10)
  (ESTIMATED_EFFORT_HOURS / 2)         // Effort factor (lower effort = higher score)
) ÷ 3
```

### Criticality Weights
```
Email/URL/Phone validators       = 10  (Auth, contact, core flows)
Password validators              =  9  (Security-critical)
Data validation (objects)        =  8  (Business logic)
Format validation (dates, etc)   =  7  (Important but not critical)
Helper functions                 =  3  (Utility functions)
Type guards                      =  1  (Low-level utilities)
```

### Effort Estimates
```
Simple (1-2 cases)           = 0.5 hours
Medium (3-5 cases)           = 2 hours
Complex (6+ cases/branches)  = 4 hours
Very Complex (10+ cases)     = 8+ hours
```

---

## Typical Coverage Gap Pattern: Validation Utils

### What Usually Gets Lost (87% → 72%)

When validation utilities get refactored, you typically lose:

| Gap Type | Frequency | Coverage Impact | Effort to Fix |
|----------|-----------|-----------------|--------------|
| Error paths (null/undefined) | 95% | 5-8% | 0.5 hrs |
| Branch coverage (if/else) | 90% | 8-12% | 1 hr |
| Optional field handling | 85% | 3-5% | 1 hr |
| Boundary conditions | 70% | 2-4% | 1 hr |
| Exception handling | 60% | 3-6% | 1 hr |
| Complex combinations | 50% | 2-3% | 2 hrs |

### Recovery Priority Checklist

**Tier 1 (Restore 87% → 80%, ~1 day)**
- [ ] Test null/undefined/empty inputs across all validators
- [ ] Test both branches (true/false) in decision points
- [ ] Test required field validation
- [ ] Test happy path scenarios

**Tier 2 (Restore 80% → 90%, ~2 days)**
- [ ] Test boundary values (0, -1, min/max)
- [ ] Test optional field handling
- [ ] Test all special characters/edge cases
- [ ] Test error accumulation

**Tier 3 (Restore 90% → 100%, ~1-2 days)**
- [ ] Test exception throwing
- [ ] Test complex multi-field scenarios
- [ ] Test error message content
- [ ] Test type mismatches

---

## File-by-File Recovery Plan

### Most Common Validation Utilities

#### 1. Email Validator (87% → 42%)
**Impact:** High (used in signup, auth, contact)  
**Effort:** 0.5 hours  
**Priority Score:** 95

**Missing Coverage:**
```
- null/undefined input (error path)
- false branch of regex test
- whitespace trimming edge case
- invalid formats (no @, no domain, no TLD)
```

**Test Cases to Add (7 tests):**
```typescript
test('returns false for null');               // 1 line
test('returns false for undefined');          // 1 line
test('returns false for empty string');       // 1 line
test('returns false for invalid email');      // 1 line (else branch)
test('trims whitespace');                     // 1 line (trim path)
test('validates subdomain format');           // 1 line
test('rejects email without TLD');            // 1 line
```

**Estimated Impact:** 7 lines covered, brings email validator from 42% → 100%

---

#### 2. User/Profile Validator (75% → 48%)
**Impact:** High (core business entity)  
**Effort:** 2 hours  
**Priority Score:** 92

**Missing Coverage:**
```
- Null object validation
- Each field validation false path
- Optional fields (age, phone) - null vs missing vs invalid
- Error accumulation logic
```

**Test Cases to Add (15 tests):**
```typescript
// Null/type checks (3 tests)
test('rejects null input');
test('rejects undefined');
test('rejects non-object');

// Required field validation (6 tests)
test('rejects missing name');
test('rejects empty name');
test('rejects invalid email');
test('rejects missing email');
test('rejects empty email');
test('accumulates multiple errors');

// Optional field validation (6 tests)
test('accepts valid age');
test('rejects invalid age');
test('accepts missing age');
test('accepts null age');
test('accepts valid phone');
test('rejects invalid phone');
```

**Estimated Impact:** 15 lines covered, brings validator from 48% → 85%

---

#### 3. Password Validator (82% → 55%)
**Impact:** High (security-critical)  
**Effort:** 1 hour  
**Priority Score:** 94

**Missing Coverage:**
```
- Guard clauses (null, empty string)
- Missing character type validation branches
- Strength calculation logic
```

**Test Cases to Add (12 tests):**
```typescript
// Guard clauses (4 tests)
test('rejects null');
test('rejects undefined');
test('rejects empty string');
test('rejects wrong type');

// Character requirements (5 tests)
test('fails without uppercase');
test('fails without lowercase');
test('fails without numbers');
test('fails without special chars');
test('accepts all required types');

// Strength levels (3 tests)
test('weak for missing elements');
test('medium for no special chars');
test('strong for all elements');
```

**Estimated Impact:** 12 lines covered, brings validator from 55% → 95%

---

#### 4. Array/Collection Validator (78% → 41%)
**Impact:** Medium (batch operations)  
**Effort:** 1.5 hours  
**Priority Score:** 85

**Missing Coverage:**
```
- Empty array rejection
- Single item handling
- Each item validation
- Specific item error reporting
```

**Test Cases to Add (12 tests):**
```typescript
// Input validation (3 tests)
test('rejects non-array');
test('rejects null array');
test('rejects undefined');

// Array length (2 tests)
test('rejects empty array');
test('accepts single item');

// Item validation (7 tests)
test('rejects null item');
test('rejects invalid structure');
test('rejects missing id');
test('rejects missing name');
test('rejects invalid value');
test('validates each item');
test('reports index in error');
```

**Estimated Impact:** 12 lines covered, brings validator from 41% → 85%

---

#### 5. Helper Functions (90% → 45%)
**Impact:** Low-Medium (utilities)  
**Effort:** 0.5-1 hour  
**Priority Score:** 55

**Example: String Normalization Helper**

**Missing Coverage:**
```
- null/undefined input
- empty string
- special character handling
```

**Test Cases to Add (5 tests):**
```typescript
test('handles null input');
test('handles undefined');
test('handles empty string');
test('normalizes whitespace');
test('handles special chars');
```

**Estimated Impact:** 5 lines covered, brings helper from 45% → 90%

---

## Weekly Action Plan

### Week 1: Critical Recovery (87% → 80%)

**Monday (2-3 hours)**
- [ ] Generate coverage reports
- [ ] Identify top 3 files with >20% regression
- [ ] Write email validator tests (7 tests)
- [ ] Write password validator tests (12 tests)

**Tuesday (2-3 hours)**
- [ ] Write user validator tests (15 tests)
- [ ] Write array validator tests (12 tests)
- [ ] Run coverage check: verify 80% reached
- [ ] Document coverage recovery in PR

**Wednesday-Friday: Stabilization**
- [ ] Review coverage report
- [ ] Add missed edge cases
- [ ] Enforce coverage in CI
- [ ] Set up pre-commit hooks

### Week 2: Comprehensive Coverage (80% → 100%)

**Monday (1-2 hours)**
- [ ] Add boundary value tests
- [ ] Add exception handling tests
- [ ] Add optional field variations

**Tuesday-Wednesday (2-3 hours)**
- [ ] Add complex scenario tests
- [ ] Add error message validation
- [ ] Add type mismatch tests

**Thursday-Friday: Enforcement**
- [ ] Update Jest config thresholds
- [ ] Configure CI to enforce 100% on validators
- [ ] Document coverage maintenance process

---

## Recovery Template Checklist

For each validator that lost coverage:

```
[ ] File: ________________
[ ] Coverage Before: ___% | After: ___% | Delta: ___% | Priority: ___

[ ] Missing Test Cases Identified:
    - [ ] Null/undefined tests
    - [ ] Branch coverage (if/else)
    - [ ] Required field tests
    - [ ] Optional field tests
    - [ ] Boundary value tests
    - [ ] Error path tests
    - [ ] Exception handling tests

[ ] Test Implementation:
    - [ ] Happy path tests added
    - [ ] Error path tests added
    - [ ] Edge case tests added
    - [ ] All tests passing
    - [ ] Coverage verified

[ ] Estimate: ___ hours | Actual: ___ hours
[ ] Status: Not Started | In Progress | Complete

[ ] Coverage After Implementation: ___% ✓
```

---

## Coverage Enforcement Setup

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
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

### CI/CD Integration
```yaml
# .github/workflows/test.yml
- name: Test with coverage
  run: npm test -- --coverage --watchAll=false

- name: Report coverage
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    echo "Test coverage: ${COVERAGE}%"
    
    if (( $(echo "$COVERAGE < 85" | bc -l) )); then
      echo "❌ Coverage below threshold"
      exit 1
    fi
    echo "✅ Coverage meets threshold"
```

### Pre-commit Hook
```bash
#!/bin/bash
# .husky/pre-commit

echo "🧪 Running tests with coverage..."
npm test -- --coverage --watchAll=false

if [ $? -ne 0 ]; then
  echo "❌ Tests failed - coverage threshold not met"
  exit 1
fi

echo "✅ Coverage check passed"
```

---

## Metrics & Progress Tracking

### Coverage Recovery Dashboard
```
Week 1 Target: 87% → 80% (7% recovery)
  Mon:  87% → 82% (5% recovered)
  Tue:  82% → 80% (2% recovered) ✓
  
Week 2 Target: 80% → 90% (10% recovery)
  Mon:  80% → 85% (5% recovered)
  Tue:  85% → 88% (3% recovered)
  Wed:  88% → 90% (2% recovered) ✓

Week 3 Target: 90% → 100% (10% recovery)
  Mon:  90% → 94% (4% recovered)
  Tue:  94% → 97% (3% recovered)
  Wed:  97% → 100% (3% recovered) ✓
```

### Success Criteria
```
✓ Lines coverage:     87% (starting 87%, ending 87%+)
✓ Function coverage: 90% (target 90%+)
✓ Branch coverage:   85% (target 85%+)
✓ CI passing:        All checks green
✓ Zero coverage regressions in new PRs
```

---

## Handoff & Documentation

### Coverage Report Template
```markdown
## Coverage Recovery Summary

**Before:** 87% lines, 90% functions, 80% branches
**After:** 88% lines, 92% functions, 85% branches

**Files Fixed:**
- src/validators/email.ts: 42% → 100%
- src/validators/password.ts: 55% → 95%
- src/validators/user.ts: 48% → 85%
- src/validators/array.ts: 41% → 85%

**Tests Added:** 51 new test cases
**Estimated Impact:** +15% lines, +2% functions, +5% branches

**Effort Breakdown:**
- Planning: 1 hour
- Implementation: 8 hours
- Review: 1 hour
- Enforcement setup: 1 hour
- Total: 11 hours

**Next Steps:**
- Enforce coverage in CI/CD
- Add pre-commit hooks
- Document test patterns for team
- Schedule quarterly coverage audits
```

---

## Quick Reference: Test Count by Validator Type

| Validator Type | Test Count | Effort | Coverage Gain |
|----------------|-----------|--------|---------------|
| Simple format (email, URL) | 7-10 | 0.5 hr | 40-50% |
| Object validator | 12-18 | 1.5 hr | 35-40% |
| Password/complex | 12-15 | 1 hr | 35-45% |
| Array/collection | 10-14 | 1.5 hr | 40-45% |
| Helper functions | 5-8 | 0.5 hr | 40-50% |

**Average:** ~50 new tests to recover from 87% → 72% (15 point gap)
**Total Effort:** 8-12 hours
**Timeline:** 1-2 weeks with daily 2-3 hour sprints
