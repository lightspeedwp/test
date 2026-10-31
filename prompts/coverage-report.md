# Generate Coverage Report

Generate test coverage reports and identify untested code paths.

## Prompt

Generate comprehensive coverage reports:

1. Run all tests with coverage tracking
2. Generate HTML coverage report
3. Report coverage metrics (statements, branches, functions, lines)
4. Identify uncovered code paths
5. List coverage by file
6. Check against minimum thresholds

## Commands

### Jest Coverage
```bash
# Generate coverage
npm run test:coverage

# Coverage with threshold check
npm run test:coverage -- --coverage-threshold

# Watch mode coverage
npm run test:coverage -- --watch
```

### Playwright Coverage
```bash
# With coverage tracking
npx playwright test --coverage

# View coverage report
open coverage/index.html
```

### PHPUnit Coverage
```bash
# Generate HTML coverage
./vendor/bin/phpunit --coverage-html coverage/

# Text coverage report
./vendor/bin/phpunit --coverage-text

# Minimum coverage check
./vendor/bin/phpunit --coverage-text --coverage-clover coverage.xml
```

## Output

- HTML coverage reports in `coverage/` folder
- Coverage percentage per file
- Coverage breakdown: statements, branches, functions, lines
- Uncovered lines highlighted
- Summary of coverage gaps

## Success Criteria

- Coverage meets minimum thresholds:
  - Statements: 80%
  - Branches: 75%
  - Functions: 80%
  - Lines: 80%
- HTML report is viewable and accurate
- Coverage trends are documented
