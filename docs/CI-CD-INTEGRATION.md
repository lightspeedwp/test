# CI/CD Integration Design

Integrate the expert test skill's recommendations into GitHub Actions workflows for automated testing, accessibility validation, coverage enforcement, and comprehensive reporting.

## Architecture Overview

### Workflow Stages

```
┌─────────────────────────────────────────────────────────────┐
│ Pull Request Created/Updated                                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: Branch Validation & Setup                           │
│ - Validate branch name (org standards)                       │
│ - Setup Node/PHP/BATS environments                           │
│ - Cache dependencies                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: Test Execution (Parallel)                           │
│ - Unit Tests (Jest)                                          │
│ - Integration Tests (Jest + PHPUnit)                         │
│ - E2E Tests (Playwright)                                     │
│ - Shell Script Tests (BATS)                                  │
│ - WordPress Block Tests                                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: Quality Checks (Parallel)                           │
│ - Code Coverage Validation                                   │
│ - Accessibility Audit (Automated)                            │
│ - Performance Benchmarking                                   │
│ - Linting & Code Quality                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 4: Reporting & Artifacts                               │
│ - Coverage HTML Reports                                      │
│ - Accessibility Audit Reports                                │
│ - Test Result Summaries                                      │
│ - Performance Reports                                        │
│ - Playwright Traces & Screenshots                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 5: PR Comments & Status                                │
│ - Post coverage report to PR                                 │
│ - Post accessibility findings to PR                          │
│ - Update commit status (pass/fail)                           │
│ - Block merge if thresholds not met                          │
└─────────────────────────────────────────────────────────────┘
```

## Workflow Files

### 1. `.github/workflows/test.yml` - Main Test Pipeline

```yaml
name: Test Suite

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  # Stage 1: Validation
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Validate Branch Name
        run: |
          BRANCH_NAME=${{ github.head_ref || github.ref_name }}
          # Validate against branch-types.yml from lightspeedwp/.github
          npx branch-validator --branch "$BRANCH_NAME"
      
      - name: Check for Forbidden Prefixes
        run: |
          BRANCH_NAME=${{ github.head_ref || github.ref_name }}
          if [[ $BRANCH_NAME =~ ^(claude|copilot|openai) ]]; then
            echo "Branch prefix not allowed"
            exit 1
          fi

  # Stage 2: Setup & Dependencies
  setup:
    needs: validate
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Setup PHP (if needed)
        uses: shivammathur/setup-php@v2
        if: hashFiles('composer.json') != ''
        with:
          php-version: '8.2'
          tools: composer
      
      - name: Setup BATS
        run: |
          npm install -g bats
          npm install -g bats-support bats-assert
      
      - name: Install Dependencies
        run: |
          npm install
          if [ -f composer.json ]; then composer install; fi

  # Stage 3a: Jest Unit Tests
  test-jest:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Run Jest Tests
        run: npm run test:unit -- --coverage --coverage-reporters=json-summary --coverage-reporters=html
      
      - name: Validate Coverage Thresholds
        run: |
          npm run test:unit -- --coverage --collectCoverageFrom='src/**/*.{js,ts,jsx,tsx}' \
            --coverageThreshold='{"global":{"statements":80,"branches":75,"functions":80,"lines":80}}'
      
      - name: Upload Coverage
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-jest-${{ matrix.node-version }}
          path: coverage/

  # Stage 3b: Playwright E2E Tests
  test-playwright:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Install Playwright Browsers
        run: npx playwright install
      
      - name: Run Playwright Tests
        run: npm run test:e2e -- --reporter=html
      
      - name: Accessibility Audit (Playwright)
        run: npm run test:e2e -- --project=accessibility --reporter=json
      
      - name: Upload Playwright Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
      
      - name: Upload Traces
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-traces
          path: test-results/

  # Stage 3c: PHPUnit Tests
  test-phpunit:
    needs: setup
    runs-on: ubuntu-latest
    if: hashFiles('composer.json') != ''
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          tools: composer
      
      - name: Install Dependencies
        run: composer install
      
      - name: Run PHPUnit Tests
        run: composer test -- --coverage-html coverage/ --coverage-clover coverage.xml
      
      - name: Upload Coverage
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-phpunit
          path: coverage/

  # Stage 3d: BATS Shell Script Tests
  test-bats:
    needs: setup
    runs-on: ubuntu-latest
    if: hashFiles('tests/**/*.bats') != ''
    steps:
      - uses: actions/checkout@v4
      
      - name: Install BATS
        run: |
          npm install -g bats
          npm install -g bats-support bats-assert
      
      - name: Run BATS Tests
        run: bats tests/**/*.bats --formatter json > test-results.json
      
      - name: Upload BATS Results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: bats-results
          path: test-results.json

  # Stage 4a: Coverage Report
  coverage:
    needs: [test-jest, test-phpunit]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Download Jest Coverage
        uses: actions/download-artifact@v4
        with:
          name: coverage-jest-20.x
          path: coverage-jest/
      
      - name: Download PHPUnit Coverage
        uses: actions/download-artifact@v4
        with:
          name: coverage-phpunit
          path: coverage-phpunit/
      
      - name: Merge Coverage Reports
        run: |
          # Combine coverage from multiple frameworks
          # This is framework-specific; adjust as needed
          mkdir -p merged-coverage
          cp -r coverage-jest/* merged-coverage/ || true
          cp -r coverage-phpunit/* merged-coverage/ || true
      
      - name: Upload Merged Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-merged
          path: merged-coverage/
      
      - name: Comment Coverage on PR
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            // Parse coverage reports and post summary to PR
            const fs = require('fs');
            const coverage = JSON.parse(fs.readFileSync('coverage-jest/coverage-summary.json', 'utf8'));
            
            const summary = `## Coverage Report
            | Metric | Coverage |
            |--------|----------|
            | Statements | ${coverage.total.statements.pct}% |
            | Branches | ${coverage.total.branches.pct}% |
            | Functions | ${coverage.total.functions.pct}% |
            | Lines | ${coverage.total.lines.pct}% |`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });

  # Stage 4b: Accessibility Audit
  accessibility-audit:
    needs: test-playwright
    runs-on: ubuntu-latest
    if: always()
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Run Accessibility Audit
        run: npm run test:e2e -- --project=accessibility --reporter=json > a11y-results.json
      
      - name: Comment A11y Findings on PR
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request' && failure()
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('a11y-results.json', 'utf8'));
            
            const comment = `## Accessibility Audit Results
            ⚠️ WCAG 2.2 AAA violations found. See details in artifacts.`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
      
      - name: Upload A11y Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: a11y-audit-report
          path: a11y-results.json

  # Stage 5: Status Check & Merge Gating
  test-status:
    needs: [test-jest, test-playwright, test-phpunit, test-bats, coverage, accessibility-audit]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Check Test Status
        run: |
          if [ "${{ needs.test-jest.result }}" != "success" ] || \
             [ "${{ needs.test-playwright.result }}" != "success" ] || \
             [ "${{ needs.test-phpunit.result }}" != "success" ]; then
            echo "One or more test suites failed"
            exit 1
          fi
      
      - name: Check Coverage Thresholds
        run: |
          # Verify coverage artifacts exist and meet thresholds
          if [ ! -f "coverage/index.html" ]; then
            echo "Coverage report not found"
            exit 1
          fi
      
      - name: Update Commit Status
        uses: actions/github-script@v7
        with:
          script: |
            const status = '${{ job.status }}' === 'success' ? 'success' : 'failure';
            github.rest.repos.createCommitStatus({
              owner: context.repo.owner,
              repo: context.repo.repo,
              sha: context.sha,
              state: status,
              description: 'Test suite and quality checks',
              context: 'test-suite'
            });
```

### 2. `.github/workflows/accessibility.yml` - Dedicated Accessibility Pipeline

```yaml
name: Accessibility Audit

on:
  pull_request:
    paths:
      - 'src/**'
      - 'e2e/**'
      - '.github/workflows/accessibility.yml'
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install Dependencies
        run: |
          npm install
          npx playwright install
      
      - name: Run WCAG 2.2 AAA Audit
        run: npm run test:e2e -- --project=accessibility --reporter=html --reporter=json > audit.json
      
      - name: Generate Audit Report
        run: |
          # Create readable audit report from JSON
          node scripts/generate-a11y-report.js audit.json > ACCESSIBILITY_REPORT.md
      
      - name: Comment Audit on PR
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('ACCESSIBILITY_REPORT.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '## WCAG 2.2 AAA Accessibility Audit\n' + report
            });
      
      - name: Upload Full Report
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-audit-${{ github.run_number }}
          path: |
            ACCESSIBILITY_REPORT.md
            audit.json
```

### 3. `.github/workflows/performance.yml` - Performance Testing

```yaml
name: Performance Benchmarks

on:
  pull_request:
    paths:
      - 'src/**'
      - 'e2e/**'

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install Dependencies
        run: |
          npm install
          npx playwright install
      
      - name: Run Lighthouse Audit
        run: |
          npx lighthouse https://localhost:3000 --chrome-flags="--headless" --output=json > lighthouse.json
      
      - name: Run Playwright Performance Tests
        run: npm run test:e2e -- --project=performance --reporter=json > perf.json
      
      - name: Comment Performance on PR
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('perf.json', 'utf8'));
            // Parse and comment on performance impact
      
      - name: Upload Reports
        uses: actions/upload-artifact@v4
        with:
          name: performance-reports
          path: |
            lighthouse.json
            perf.json
```

## Integration Points

### 1. Slack Notifications

Notify team of test results:

```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "❌ Test suite failed for ${{ github.head_ref }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Test Failure Alert*\nBranch: `${{ github.head_ref }}`\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Details>"
            }
          }
        ]
      }
```

### 2. PR Status Checks

Block merge if tests fail:

```yaml
- name: Require Tests to Pass
  uses: actions/github-script@v7
  with:
    script: |
      const checkRun = await github.rest.checks.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        name: 'Test Suite',
        head_sha: context.sha,
        status: 'completed',
        conclusion: 'success',
        output: {
          title: 'All tests passed',
          summary: 'Coverage: 85% | A11y: Pass | Performance: OK'
        }
      });
```

### 3. Artifact Management

Archive test results:

```yaml
- name: Archive Results
  uses: actions/upload-artifact@v4
  with:
    name: test-results-${{ github.run_number }}
    path: |
      coverage/
      playwright-report/
      test-results/
    retention-days: 30
```

## Quality Gates

### Coverage Enforcement

```bash
# Fail if coverage drops below thresholds
npm run test:unit -- \
  --coverage \
  --coverageThreshold='{"global":{"statements":80,"branches":75,"functions":80,"lines":80}}'
```

### Accessibility Enforcement

```bash
# Fail if accessibility violations found
npm run test:e2e -- --project=accessibility
# Exit code non-zero if violations detected
```

### Performance Thresholds

```bash
# Fail if Lighthouse score < 90 or LCP > 3s
npx lighthouse https://localhost:3000 \
  --chrome-flags="--headless" \
  --threshold=90 \
  --emulated-form-factor=mobile
```

## Secret Management

Required GitHub Action Secrets:

- `SLACK_WEBHOOK` — Slack notification webhook
- `SONARCLOUD_TOKEN` — Code quality reporting (optional)
- `CODECOV_TOKEN` — Coverage tracking (optional)

## Monitoring & Dashboards

### GitHub Dashboard

Track metrics in GitHub using status badges:

```markdown
[![Test Suite](https://github.com/lightspeedwp/test/actions/workflows/test.yml/badge.svg)](https://github.com/lightspeedwp/test/actions/workflows/test.yml)
[![Coverage](https://codecov.io/gh/lightspeedwp/test/branch/main/graph/badge.svg)](https://codecov.io/gh/lightspeedwp/test)
[![Accessibility](https://img.shields.io/badge/a11y-WCAG%202.2%20AAA-brightgreen)](./docs/ACCESSIBILITY.md)
```

### Metrics to Track

- Test pass rate (%)
- Coverage trends (per framework)
- Accessibility violation count
- Performance metrics (LCP, INP, CLS)
- Build time trends
- Flaky test identification

## Maintenance

### Weekly Audit

```yaml
schedule:
  - cron: '0 0 * * 0'  # Sunday midnight
```

### Dependency Updates

```yaml
- name: Check Dependencies
  run: npm audit --audit-level=moderate
```

### Performance Regression Detection

Compare current to baseline:

```bash
# Generate baseline
npm run test:e2e -- --project=performance > baseline.json

# Compare in PR
npm run test:e2e -- --project=performance > current.json
node scripts/compare-perf.js baseline.json current.json
```

## Next Steps

1. Create workflow files in `.github/workflows/`
2. Set up Slack webhook for notifications
3. Configure branch protection rules to require status checks
4. Add coverage badges to README
5. Document per-framework coverage requirements
6. Set up Codecov or similar for coverage tracking
7. Create runbooks for debugging CI failures
