# Coverage Enforcement Tests

Patterns and strategies for enforcing 100% code coverage in WordPress build processes with detailed test examples.

## Table of Contents
1. [Coverage Metrics](#coverage-metrics)
2. [Threshold Enforcement](#threshold-enforcement)
3. [Coverage Analysis](#coverage-analysis)
4. [Report Generation](#report-generation)
5. [Integration with CI/CD](#integration-with-cicd)

## Coverage Metrics

### Understanding Coverage Types

```
- Lines: Percentage of code lines executed
- Statements: Percentage of individual statements executed
- Functions: Percentage of functions called
- Branches: Percentage of conditional branches taken
```

### Test: Validate All Coverage Metrics

```bash
@test "coverage: verify all metrics are present" {
    local coverage_file="coverage/coverage-summary.json"
    
    [[ -f "$coverage_file" ]] || {
        echo "ERROR: Coverage file not found" >&2
        return 1
    }
    
    # Check all required metrics exist
    local required_metrics=(
        "lines"
        "statements"
        "functions"
        "branches"
    )
    
    for metric in "${required_metrics[@]}"; do
        if ! jq -e ".total.${metric}" "$coverage_file" > /dev/null; then
            echo "ERROR: Missing coverage metric: $metric" >&2
            return 1
        fi
    done
}
```

### Test: Extract Coverage Percentages

```bash
@test "coverage: extract coverage percentages" {
    local coverage_file="coverage/coverage-summary.json"
    
    echo "Coverage Summary:"
    echo "=================="
    
    # Extract and display each metric
    jq -r '.total | to_entries[] | 
        "\(.key): \(.value.covered)/\(.value.total) (\(.value.pct)%)"' \
        "$coverage_file"
    
    # Store values for threshold checking
    local lines_pct statements_pct functions_pct branches_pct
    lines_pct=$(jq '.total.lines.pct' "$coverage_file")
    statements_pct=$(jq '.total.statements.pct' "$coverage_file")
    functions_pct=$(jq '.total.functions.pct' "$coverage_file")
    branches_pct=$(jq '.total.branches.pct' "$coverage_file")
    
    echo ""
    echo "Metrics for threshold validation:"
    echo "Lines: $lines_pct%"
    echo "Statements: $statements_pct%"
    echo "Functions: $functions_pct%"
    echo "Branches: $branches_pct%"
}
```

## Threshold Enforcement

### Test: Enforce 100% Line Coverage

```bash
@test "coverage: enforce 100% line coverage" {
    local coverage_file="coverage/coverage-summary.json"
    local threshold=100
    
    local lines_pct
    lines_pct=$(jq '.total.lines.pct' "$coverage_file")
    
    if (( $(echo "$lines_pct < $threshold" | bc -l) )); then
        echo "FAIL: Line coverage is ${lines_pct}% (required: ${threshold}%)" >&2
        echo "Uncovered lines: $(jq '.total.lines.total - .total.lines.covered' "$coverage_file")" >&2
        return 1
    fi
}
```

### Test: Enforce 100% Statement Coverage

```bash
@test "coverage: enforce 100% statement coverage" {
    local coverage_file="coverage/coverage-summary.json"
    local threshold=100
    
    local statements_pct
    statements_pct=$(jq '.total.statements.pct' "$coverage_file")
    
    if (( $(echo "$statements_pct < $threshold" | bc -l) )); then
        echo "FAIL: Statement coverage is ${statements_pct}% (required: ${threshold}%)" >&2
        echo "Uncovered statements: $(jq '.total.statements.total - .total.statements.covered' "$coverage_file")" >&2
        return 1
    fi
}
```

### Test: Enforce 100% Function Coverage

```bash
@test "coverage: enforce 100% function coverage" {
    local coverage_file="coverage/coverage-summary.json"
    local threshold=100
    
    local functions_pct
    functions_pct=$(jq '.total.functions.pct' "$coverage_file")
    
    if (( $(echo "$functions_pct < $threshold" | bc -l) )); then
        echo "FAIL: Function coverage is ${functions_pct}% (required: ${threshold}%)" >&2
        echo "Uncovered functions: $(jq '.total.functions.total - .total.functions.covered' "$coverage_file")" >&2
        return 1
    fi
}
```

### Test: Enforce 100% Branch Coverage

```bash
@test "coverage: enforce 100% branch coverage" {
    local coverage_file="coverage/coverage-summary.json"
    local threshold=100
    
    local branches_pct
    branches_pct=$(jq '.total.branches.pct' "$coverage_file")
    
    if (( $(echo "$branches_pct < $threshold" | bc -l) )); then
        echo "FAIL: Branch coverage is ${branches_pct}% (required: ${threshold}%)" >&2
        echo "Uncovered branches: $(jq '.total.branches.total - .total.branches.covered' "$coverage_file")" >&2
        return 1
    fi
}
```

### Test: Comprehensive Threshold Validation

```bash
@test "coverage: all metrics meet 100% threshold" {
    local coverage_file="coverage/coverage-summary.json"
    local threshold=100
    local failed=0
    
    # Define metrics to check
    local -a metrics=("lines" "statements" "functions" "branches")
    local -a metric_names=("Lines" "Statements" "Functions" "Branches")
    
    echo "Coverage Threshold Validation (Minimum: ${threshold}%)"
    echo "====================================================="
    
    for i in "${!metrics[@]}"; do
        local metric="${metrics[$i]}"
        local name="${metric_names[$i]}"
        
        local pct
        pct=$(jq ".total.${metric}.pct" "$coverage_file")
        
        if (( $(echo "$pct < $threshold" | bc -l) )); then
            printf "FAIL: %-15s %3.0f%% (required: %d%%)\n" "$name:" "$pct" "$threshold" >&2
            ((failed++))
        else
            printf "PASS: %-15s %3.0f%%\n" "$name:" "$pct"
        fi
    done
    
    echo ""
    
    if [[ $failed -gt 0 ]]; then
        echo "Coverage check FAILED: $failed metric(s) below threshold" >&2
        return 1
    else
        echo "Coverage check PASSED: All metrics at 100%"
    fi
}
```

## Coverage Analysis

### Test: Identify Uncovered Code

```bash
@test "coverage: identify uncovered code sections" {
    local coverage_json="coverage/coverage-final.json"
    
    [[ -f "$coverage_json" ]] || {
        echo "ERROR: Detailed coverage report not found" >&2
        return 1
    }
    
    echo "Files with Incomplete Coverage:"
    echo "================================"
    
    # Parse JSON and find files below 100%
    jq -r '.[] | 
        select(.lines.pct < 100) | 
        "\(.path): \(.lines.pct)% (\(.lines.covered)/\(.lines.total) lines)"' \
        "$coverage_json" | while read -r file_info; do
        
        echo "$file_info"
    done
    
    # Count affected files
    local affected_count
    affected_count=$(jq '[.[] | select(.lines.pct < 100)] | length' "$coverage_json")
    
    if [[ $affected_count -gt 0 ]]; then
        echo ""
        echo "Total files with incomplete coverage: $affected_count"
        return 1
    fi
}
```

### Test: Find Uncovered Lines

```bash
@test "coverage: locate specific uncovered lines" {
    local coverage_json="coverage/coverage-final.json"
    
    [[ -f "$coverage_json" ]] || return 1
    
    # Find first file with uncovered lines
    jq -r 'to_entries[] | 
        select(.value.lines | any(.count == 0)) | 
        "\(.value.path)"' \
        "$coverage_json" | head -1 | while read -r uncovered_file; do
        
        if [[ -n "$uncovered_file" ]]; then
            echo "Uncovered code found in: $uncovered_file"
            echo ""
            echo "Uncovered lines:"
            
            # Show line numbers that are uncovered
            jq -r ".[] | 
                select(.path == \"$uncovered_file\") | 
                .lines | 
                to_entries[] | 
                select(.value.count == 0) | 
                \"Line \(.key)\"" "$coverage_json" | head -10
        fi
    done
}
```

### Test: Identify Unreachable Code

```bash
@test "coverage: detect potentially unreachable code" {
    local coverage_json="coverage/coverage-final.json"
    
    [[ -f "$coverage_json" ]] || return 1
    
    echo "Files with Unreachable Code:"
    echo "============================="
    
    # Find files where uncovered code exists
    local unreachable_count=0
    
    jq -r '.[] | select(.lines.covered < .lines.total) | .path' \
        "$coverage_json" | while read -r file; do
        
        ((unreachable_count++))
        
        # Get line counts
        local uncovered
        uncovered=$(jq "[.[] | select(.path == \"$file\") | .lines | .total - .covered] | .[0]" "$coverage_json")
        
        echo "  $file ($uncovered uncovered lines)"
    done
    
    if [[ $unreachable_count -gt 0 ]]; then
        echo ""
        echo "Action Items:"
        echo "1. Add tests to cover the code"
        echo "2. Or remove unreachable/dead code"
        echo "3. Or document why code is unreachable"
        return 1
    fi
}
```

## Report Generation

### Test: Generate Human-Readable Coverage Report

```bash
@test "coverage: generate text coverage report" {
    local coverage_file="coverage/coverage-summary.json"
    local report_file="coverage/COVERAGE_REPORT.txt"
    
    {
        echo "Code Coverage Report"
        echo "===================="
        echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
        echo ""
        
        echo "Overall Coverage:"
        echo "----------------"
        jq -r '.total | 
            "Lines:       \(.lines.covered)/\(.lines.total) (\(.lines.pct)%)\n" +
            "Statements:  \(.statements.covered)/\(.statements.total) (\(.statements.pct)%)\n" +
            "Functions:   \(.functions.covered)/\(.functions.total) (\(.functions.pct)%)\n" +
            "Branches:    \(.branches.covered)/\(.branches.total) (\(.branches.pct)%)"' \
            "$coverage_file"
        
        echo ""
        echo "Status: $(jq '.total.lines.pct' "$coverage_file" | xargs -I {} sh -c '[[ {} -eq 100 ]] && echo "✓ PASS" || echo "✗ FAIL"')"
        
    } > "$report_file"
    
    cat "$report_file"
    [[ -f "$report_file" ]] || return 1
}
```

### Test: Generate Coverage Summary JSON

```bash
@test "coverage: generate coverage summary JSON" {
    local coverage_file="coverage/coverage-summary.json"
    local summary_file="coverage/COVERAGE_SUMMARY.json"
    
    jq '{
        timestamp: now | strftime("%Y-%m-%dT%H:%M:%SZ"),
        passed: (.total.lines.pct >= 100 and .total.statements.pct >= 100 and 
                 .total.functions.pct >= 100 and .total.branches.pct >= 100),
        coverage: .total,
        percentage: (.total.lines.pct + .total.statements.pct + .total.functions.pct + .total.branches.pct) / 4
    }' "$coverage_file" > "$summary_file"
    
    cat "$summary_file"
    [[ -f "$summary_file" ]] || return 1
}
```

### Test: Generate Coverage Trend Report

```bash
@test "coverage: track coverage trend" {
    local coverage_file="coverage/coverage-summary.json"
    local trend_file="coverage/.coverage_history.json"
    
    local current_coverage
    current_coverage=$(jq '{
        date: now | strftime("%Y-%m-%d"),
        lines: .total.lines.pct,
        statements: .total.statements.pct,
        functions: .total.functions.pct,
        branches: .total.branches.pct
    }' "$coverage_file")
    
    # Initialize trend file if it doesn't exist
    if [[ ! -f "$trend_file" ]]; then
        echo "[]" > "$trend_file"
    fi
    
    # Append current coverage to trend
    jq ". += [$current_coverage]" "$trend_file" > "$trend_file.tmp"
    mv "$trend_file.tmp" "$trend_file"
    
    echo "Coverage history updated"
    tail -n 5 "$trend_file" | jq .
}
```

## Integration with CI/CD

### Test: Pre-Commit Coverage Check

```bash
@test "coverage: pre-commit coverage validation" {
    # Run tests with coverage
    if ! npm run test:coverage > /dev/null 2>&1; then
        echo "ERROR: Tests failed" >&2
        return 1
    fi
    
    # Check coverage
    if ! npm run test:bats:coverage > /dev/null 2>&1; then
        echo "ERROR: Coverage check failed" >&2
        echo "Your code does not meet the 100% coverage requirement" >&2
        echo "Run: npm run test:coverage to see details" >&2
        return 1
    fi
}
```

### Test: CI/CD Coverage Gate

```bash
@test "coverage: ci/cd pipeline gate" {
    local coverage_file="coverage/coverage-summary.json"
    
    if [[ -z "${CI:-}" ]]; then
        skip "Not running in CI environment"
    fi
    
    echo "Running CI/CD Coverage Gate..."
    echo "==============================="
    
    # Require 100% coverage in CI
    local lines
    lines=$(jq '.total.lines.pct' "$coverage_file")
    
    if (( $(echo "$lines < 100" | bc -l) )); then
        echo "ERROR: CI/CD gate FAILED" >&2
        echo "Coverage is ${lines}% - must be 100% for merge" >&2
        return 1
    fi
    
    echo "✓ CI/CD gate PASSED: Coverage is at 100%"
}
```

### Test: Generate Coverage Badge

```bash
@test "coverage: generate coverage badge" {
    local coverage_file="coverage/coverage-summary.json"
    local badge_file="coverage/badge.svg"
    
    local percentage
    percentage=$(jq '.total.lines.pct | floor' "$coverage_file")
    
    # Determine color based on percentage
    local color
    if [[ $percentage -eq 100 ]]; then
        color="brightgreen"
    elif [[ $percentage -ge 90 ]]; then
        color="green"
    elif [[ $percentage -ge 80 ]]; then
        color="yellow"
    else
        color="red"
    fi
    
    # Create SVG badge
    cat > "$badge_file" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="170" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <g>
    <rect rx="3" width="130" height="20" fill="#555"/>
    <rect rx="3" x="130" width="40" height="20" fill="${color}"/>
    <rect rx="3" width="170" height="20" fill="url(#b)"/>
    <text x="655" y="150" fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110" fill-opacity=".9" text-anchor="end" transform="scale(.1)" textLength="1300">coverage</text>
    <text x="1485" y="150" fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110" fill-opacity=".9" text-anchor="end" transform="scale(.1)" textLength="300">${percentage}%</text>
  </g>
</svg>
EOF
    
    [[ -f "$badge_file" ]] || return 1
}
```

## Example Jest Configuration

### Jest Config with 100% Coverage Threshold

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/index.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'json',
    'json-summary'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    each: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
```

## npm Scripts for Coverage

### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:coverage:check": "jest --coverage --passWithNoTests",
    "test:coverage:watch": "jest --coverage --watch",
    "coverage:report": "open coverage/lcov-report/index.html",
    "coverage:verify": "npm run test:coverage && npm run test:bats:coverage",
    "ci:coverage": "npm run test:coverage && cat coverage/lcov.info | codecov"
  }
}
```

## Best Practices

1. **Enforce 100% Everywhere** - Lines, statements, functions, and branches
2. **Fail Fast** - Reject code that doesn't meet threshold
3. **Track Trends** - Monitor coverage over time
4. **Generate Reports** - Create readable coverage reports
5. **Automate Checks** - Integrate with CI/CD pipeline
6. **Document Exclusions** - If excluding code, document why
7. **Test Edge Cases** - Ensure branch coverage includes all paths
8. **Review Uncovered Code** - Either test it or remove it
9. **Make Coverage Required** - Prevent merging without 100%
10. **Celebrate Success** - Acknowledge coverage achievements
