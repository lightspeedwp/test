# 100% Coverage Enforcement & Gap Analysis

Achieve and maintain 100% Jest test coverage.

## Coverage Gap Analysis Methodology

### Step 1: Generate Coverage Report

```bash
npm run test:jest -- --coverage --coverageReporters=json
```

Opens `coverage/coverage-final.json` with detailed file-by-file breakdown.

### Step 2: Identify Coverage Gaps

**Gap types:**
- **Uncovered lines:** Code never executed
- **Uncovered branches:** If/else paths untested
- **Uncovered functions:** Functions never called
- **Uncovered statements:** Individual statements

**Analyze gaps:**
```json
{
  "src/utils/block.js": {
    "lines": { "total": 50, "covered": 45, "pct": 90 },
    "statements": { "total": 52, "covered": 48, "pct": 92.3 },
    "functions": { "total": 8, "covered": 7, "pct": 87.5 },
    "branches": { "total": 12, "covered": 10, "pct": 83.3 }
  }
}
```

Gap findings:
- 5 lines uncovered (90% → 100% gap)
- 2 functions untested (87.5% → 100% gap)
- 2 branches untested (83.3% → 100% gap)

### Step 3: Locate Uncovered Code

```bash
npm run test:jest -- --coverage --verbose
```

Output shows line-by-line coverage:
```
|  1 | export function getValue() {
|  2 |   const x = fetchData();  // Uncovered
|  3 |   if (x > 10) {          // Uncovered branch
|  4 |     return x * 2;        // Uncovered line
|  5 |   }
```

### Step 4: Design Test Cases

For each gap, create targeted test:

**Uncovered line:**
```javascript
// Source
function getValue() {
  return Math.random() > 0.5 ? 'high' : 'low'; // Low branch untested
}

// Add test
test('getValue returns low when random < 0.5', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.3);
  expect(getValue()).toBe('low');
});
```

**Uncovered branch:**
```javascript
// Source
function processData(data) {
  if (data.admin) {           // admin=true untested
    deleteEverything();
  }
  return data;
}

// Add test
test('admin user triggers deleteEverything', () => {
  const deleteSpy = jest.spyOn(db, 'deleteEverything');
  processData({ admin: true });
  expect(deleteSpy).toHaveBeenCalled();
});
```

**Uncovered function:**
```javascript
// Source
export function rareLy UsedUtility() {
  return 'rarely used';
}

// Add test
test('rarely used utility returns expected string', () => {
  expect(rarelyUsedUtility()).toBe('rarely used');
});
```

## Coverage Configuration

**Enforce 100% in jest.config.js:**
```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js'
  ],
  
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    './src/critical.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
```

**Fail build if coverage drops:**
```bash
npm run test:jest -- --coverage --coverageFailureThreshold=100
```

## Common Gap Patterns

### Pattern 1: Error Handling Paths

**Source:**
```javascript
function loadFile(path) {
  try {
    return readFile(path);
  } catch (e) {     // Uncovered - error path untested
    logger.error(e);
    throw new Error('Failed to load');
  }
}
```

**Test:**
```javascript
test('loadFile throws on read error', () => {
  jest.spyOn(fs, 'readFile').mockImplementation(() => {
    throw new Error('ENOENT');
  });
  
  expect(() => loadFile('missing.txt')).toThrow('Failed to load');
  expect(logger.error).toHaveBeenCalled();
});
```

### Pattern 2: Edge Cases

**Source:**
```javascript
function divide(a, b) {
  if (b === 0) {    // Edge case untested
    throw new Error('Division by zero');
  }
  return a / b;
}
```

**Test:**
```javascript
test('divide throws on zero divisor', () => {
  expect(() => divide(10, 0)).toThrow('Division by zero');
});
```

### Pattern 3: Conditional Branches

**Source:**
```javascript
function status(code) {
  if (code === 200) return 'ok';
  else if (code === 404) return 'not found';
  else return 'error';      // Untested branch
}
```

**Test:**
```javascript
test('status returns error for unknown codes', () => {
  expect(status(500)).toBe('error');
  expect(status(301)).toBe('error');
});
```

## Maintaining 100% Coverage

### Pre-commit Hook

```yaml
# lefthook.yml
pre-commit:
  commands:
    coverage:
      glob: "src/**/*.js"
      run: npm run test:jest -- --coverage --bail
      fail_text: "Coverage below 100%"
```

### CI/CD Check

```yaml
# .github/workflows/test.yml
- name: Check coverage
  run: npm run test:jest -- --coverage
  
- name: Fail if coverage insufficient
  run: |
    if [ $COVERAGE -lt 100 ]; then
      echo "Coverage: $COVERAGE% (required 100%)"
      exit 1
    fi
```

### Coverage Reporting

Generate HTML report:
```bash
npm run test:jest -- --coverage --coverageReporters=html
```

Opens `coverage/index.html` in browser with interactive coverage visualization.

## Best Practices

1. **Write tests alongside code** — Easier to reach 100% before submitting
2. **Test error paths** — Most uncovered code is error handling
3. **Test edge cases** — Boundary conditions often untested
4. **Document gaps** — If gap is intentional, document why
5. **Use coverage tools** — IDE plugins show coverage inline
6. **Enforce in CI** — Prevent merge without 100% coverage

---

See JEST.md for test writing patterns and TESTING.md for overall strategy.
