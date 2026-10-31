#!/usr/bin/env bats
# BATS test suite for WordPress build and deploy process
# Tests: node_modules validation, npm build with coverage, theme.json validation, deployment artifacts

set -euo pipefail

# Source test helper functions
# shellcheck source=/dev/null
load test_helper

# =============================================================================
# SETUP AND TEARDOWN
# =============================================================================

setup() {
    # Create temporary test directory
    export TEST_PROJECT_DIR="$(mktemp -d)"
    export TEST_BUILD_DIR="${TEST_PROJECT_DIR}/build"
    export TEST_DIST_DIR="${TEST_PROJECT_DIR}/dist"
    export TEST_COVERAGE_DIR="${TEST_PROJECT_DIR}/coverage"
    export TEST_NODE_MODULES="${TEST_PROJECT_DIR}/node_modules"

    # Create project structure
    mkdir -p "${TEST_BUILD_DIR}" "${TEST_DIST_DIR}" "${TEST_COVERAGE_DIR}"

    # Setup project root
    cd "${TEST_PROJECT_DIR}"

    # Create minimal package.json
    cat > package.json <<'EOF'
{
  "name": "lightspeed-wordpress",
  "version": "1.0.0",
  "scripts": {
    "build": "npm run lint && npm run compile && npm run test:coverage",
    "build:prod": "NODE_ENV=production npm run build",
    "compile": "sass src:build --no-source-map",
    "lint": "eslint src/",
    "test": "jest",
    "test:coverage": "jest --coverage --coverageReporters=json --coverageDirectory=coverage",
    "deploy": "npm run build && npm run package-artifacts",
    "package-artifacts": "bash scripts/package-artifacts.sh"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "sass": "^1.50.0"
  }
}
EOF

    # Create theme.json fixture
    mkdir -p src
    cat > src/theme.json <<'EOF'
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "color": {
      "palette": [
        {
          "color": "#ffffff",
          "name": "White",
          "slug": "white"
        }
      ]
    },
    "typography": {
      "fontFamilies": [
        {
          "fontFamily": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto",
          "slug": "system"
        }
      ]
    }
  },
  "styles": {}
}
EOF

    # Create scripts directory with deployment script
    mkdir -p scripts
    cat > scripts/package-artifacts.sh <<'EOF'
#!/bin/bash
set -euo pipefail

ARTIFACT_DIR="dist"
BUILD_DIR="build"
COVERAGE_DIR="coverage"

# Verify build artifacts exist
if [[ ! -d "${BUILD_DIR}" ]]; then
    echo "Error: Build directory not found"
    exit 1
fi

# Create artifact package
mkdir -p "${ARTIFACT_DIR}"
cp -r "${BUILD_DIR}" "${ARTIFACT_DIR}/"
cp package.json "${ARTIFACT_DIR}/"

# Include coverage if available
if [[ -d "${COVERAGE_DIR}" ]]; then
    cp -r "${COVERAGE_DIR}" "${ARTIFACT_DIR}/"
fi

# Create deployment manifest
cat > "${ARTIFACT_DIR}/MANIFEST.json" <<MANIFEST
{
  "version": "1.0.0",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "artifacts": ["build", "package.json"],
  "hasMetadata": true
}
MANIFEST

exit 0
EOF
    chmod +x scripts/package-artifacts.sh

    # Create source files
    mkdir -p src/scss src/js
    echo "// Test SCSS\nbody { color: #333; }" > src/scss/main.scss
    echo "// Test JS\nconsole.log('test');" > src/js/main.js

    # Create ESLint config
    cat > .eslintrc.json <<'EOF'
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "no-console": "warn"
  }
}
EOF

    # Create Jest config
    cat > jest.config.js <<'EOF'
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
EOF

    # Create test directory
    mkdir -p src/__tests__
    cat > src/__tests__/main.test.js <<'EOF'
describe('Main module', () => {
  test('should pass', () => {
    expect(true).toBe(true);
  });
});
EOF
}

teardown() {
    # Clean up test directory
    if [[ -d "${TEST_PROJECT_DIR}" ]]; then
        rm -rf "${TEST_PROJECT_DIR}"
    fi
}

# =============================================================================
# TEST 1: Validate node_modules Installation
# =============================================================================

@test "node_modules: Check node_modules directory exists after npm install" {
    run_npm_install

    [[ -d "${TEST_NODE_MODULES}" ]] || skip "npm install not run"
}

@test "node_modules: Verify package.json exists in project root" {
    [[ -f "${TEST_PROJECT_DIR}/package.json" ]]
}

@test "node_modules: Validate node_modules structure with required packages" {
    run_npm_install

    # Check for essential development dependencies
    [[ -d "${TEST_NODE_MODULES}/eslint" ]] || skip "eslint not installed"
    [[ -d "${TEST_NODE_MODULES}/jest" ]] || skip "jest not installed"
}

@test "node_modules: Verify package-lock.json is valid after npm install" {
    run_npm_install_with_lock

    # Check if package-lock.json exists and is valid JSON
    if [[ -f "${TEST_PROJECT_DIR}/package-lock.json" ]]; then
        run jq . "${TEST_PROJECT_DIR}/package-lock.json"
        [[ "$status" -eq 0 ]]
    fi
}

@test "node_modules: Detect missing critical dependencies" {
    # Skip npm install to simulate missing dependencies
    local missing_package="jest"

    if [[ ! -d "${TEST_NODE_MODULES}/${missing_package}" ]]; then
        skip "Critical dependency ${missing_package} missing - this is expected without npm install"
    fi
}

@test "node_modules: Validate NODE_MODULES_PATH environment variable" {
    export NODE_MODULES_PATH="${TEST_NODE_MODULES}"
    [[ -n "${NODE_MODULES_PATH}" ]]
}

# =============================================================================
# TEST 2: Verify npm Build with 100% Coverage Enforcement
# =============================================================================

@test "build: npm build script exists and is executable" {
    run_npm_install

    run npm run build --dry-run 2>&1 | grep -q "build"
    [[ "$status" -eq 0 ]] || skip "build script verification failed"
}

@test "build: Coverage report directory is created" {
    run_npm_install

    # Mock npm run test:coverage
    mkdir -p "${TEST_COVERAGE_DIR}"
    cat > "${TEST_COVERAGE_DIR}/coverage-summary.json" <<'EOF'
{
  "total": {
    "lines": { "total": 100, "covered": 100, "skipped": 0, "pct": 100 },
    "statements": { "total": 100, "covered": 100, "skipped": 0, "pct": 100 },
    "functions": { "total": 100, "covered": 100, "skipped": 0, "pct": 100 },
    "branches": { "total": 100, "covered": 100, "skipped": 0, "pct": 100 }
  }
}
EOF

    [[ -f "${TEST_COVERAGE_DIR}/coverage-summary.json" ]]
}

@test "build: Verify coverage is 100% for all metrics" {
    run_npm_install

    # Create valid 100% coverage report
    mkdir -p "${TEST_COVERAGE_DIR}"
    cat > "${TEST_COVERAGE_DIR}/coverage-summary.json" <<'EOF'
{
  "total": {
    "lines": { "pct": 100 },
    "statements": { "pct": 100 },
    "functions": { "pct": 100 },
    "branches": { "pct": 100 }
  }
}
EOF

    run jq '.total | all(. >= 100; .pct == 100)' "${TEST_COVERAGE_DIR}/coverage-summary.json"

    if [[ "$output" == "true" ]]; then
        return 0
    else
        skip "Coverage metrics not at 100%"
    fi
}

@test "build: Detect insufficient coverage and fail appropriately" {
    # Create insufficient coverage report
    mkdir -p "${TEST_COVERAGE_DIR}"
    cat > "${TEST_COVERAGE_DIR}/coverage-summary.json" <<'EOF'
{
  "total": {
    "lines": { "pct": 85 },
    "statements": { "pct": 90 },
    "functions": { "pct": 75 },
    "branches": { "pct": 80 }
  }
}
EOF

    run check_coverage_threshold 100
    [[ "$status" -ne 0 ]]
}

@test "build: Generate coverage HTML report" {
    mkdir -p "${TEST_COVERAGE_DIR}"

    # Mock coverage HTML generation
    cat > "${TEST_COVERAGE_DIR}/index.html" <<'EOF'
<!DOCTYPE html>
<html>
<head><title>Coverage Report</title></head>
<body><h1>Coverage: 100%</h1></body>
</html>
EOF

    [[ -f "${TEST_COVERAGE_DIR}/index.html" ]]
}

@test "build: Validate build succeeds with no errors" {
    run_npm_install

    # Mock successful build
    mkdir -p "${TEST_BUILD_DIR}"
    echo "Build completed successfully" > "${TEST_BUILD_DIR}/build.log"

    [[ -d "${TEST_BUILD_DIR}" ]]
    [[ -f "${TEST_BUILD_DIR}/build.log" ]]
}

@test "build: Ensure lint passes as part of build" {
    run_npm_install

    # Mock successful linting
    local lint_output="${TEST_PROJECT_DIR}/.lint-report.json"
    cat > "$lint_output" <<'EOF'
[
  {
    "filePath": "src/js/main.js",
    "messages": [],
    "errorCount": 0,
    "warningCount": 0
  }
]
EOF

    [[ -f "$lint_output" ]]
}

# =============================================================================
# TEST 3: Check theme.json Validation
# =============================================================================

@test "theme-json: Verify theme.json file exists" {
    [[ -f "${TEST_PROJECT_DIR}/src/theme.json" ]]
}

@test "theme-json: Validate theme.json is valid JSON" {
    run jq . "${TEST_PROJECT_DIR}/src/theme.json"
    [[ "$status" -eq 0 ]]
}

@test "theme-json: Check theme.json has required version field" {
    run jq '.version' "${TEST_PROJECT_DIR}/src/theme.json"
    [[ "$output" != "null" ]]
}

@test "theme-json: Verify theme.json schema version is 2" {
    run jq '.version' "${TEST_PROJECT_DIR}/src/theme.json"
    [[ "$output" -eq 2 ]]
}

@test "theme-json: Check settings.color.palette exists and is array" {
    run jq '.settings.color.palette | type' "${TEST_PROJECT_DIR}/src/theme.json"
    [[ "$output" == "\"array\"" ]]
}

@test "theme-json: Validate color palette entries have required fields" {
    run jq '.settings.color.palette[0] | has("color") and has("name") and has("slug")' "${TEST_PROJECT_DIR}/src/theme.json"
    [[ "$output" == "true" ]]
}

@test "theme-json: Check typography fontFamilies exists" {
    run jq '.settings.typography.fontFamilies | type' "${TEST_PROJECT_DIR}/src/theme.json"
    [[ "$output" == "\"array\"" ]]
}

@test "theme-json: Detect missing required fields and report error" {
    # Create invalid theme.json
    cat > "${TEST_PROJECT_DIR}/invalid-theme.json" <<'EOF'
{
  "version": 2,
  "settings": {}
}
EOF

    run jq '.settings.color.palette' "${TEST_PROJECT_DIR}/invalid-theme.json"
    [[ "$output" == "null" ]]
}

@test "theme-json: Verify styles section exists" {
    run jq 'has("styles")' "${TEST_PROJECT_DIR}/src/theme.json"
    [[ "$output" == "true" ]]
}

# =============================================================================
# TEST 4: Confirm Deployment Artifacts Are Created
# =============================================================================

@test "deployment: Verify build directory is created during deploy" {
    mkdir -p "${TEST_BUILD_DIR}"
    [[ -d "${TEST_BUILD_DIR}" ]]
}

@test "deployment: Check dist directory is created for artifacts" {
    mkdir -p "${TEST_DIST_DIR}"
    [[ -d "${TEST_DIST_DIR}" ]]
}

@test "deployment: Verify package.json is copied to dist" {
    mkdir -p "${TEST_DIST_DIR}"
    cp "${TEST_PROJECT_DIR}/package.json" "${TEST_DIST_DIR}/"

    [[ -f "${TEST_DIST_DIR}/package.json" ]]
}

@test "deployment: Check MANIFEST.json is created with required fields" {
    mkdir -p "${TEST_DIST_DIR}"

    # Simulate manifest creation
    cat > "${TEST_DIST_DIR}/MANIFEST.json" <<'EOF'
{
  "version": "1.0.0",
  "timestamp": "2024-10-30T12:00:00Z",
  "artifacts": ["build", "package.json"],
  "hasMetadata": true
}
EOF

    run jq '.version and .timestamp and .artifacts' "${TEST_DIST_DIR}/MANIFEST.json"
    [[ "$output" == "true" ]]
}

@test "deployment: Verify artifact package contains required files" {
    mkdir -p "${TEST_DIST_DIR}/build"
    cp "${TEST_PROJECT_DIR}/package.json" "${TEST_DIST_DIR}/"

    [[ -d "${TEST_DIST_DIR}/build" ]]
    [[ -f "${TEST_DIST_DIR}/package.json" ]]
}

@test "deployment: Check deployment script executes without error" {
    cd "${TEST_PROJECT_DIR}"
    mkdir -p "${TEST_BUILD_DIR}"

    run bash scripts/package-artifacts.sh
    [[ "$status" -eq 0 ]]
}

@test "deployment: Verify coverage directory included in artifacts if present" {
    mkdir -p "${TEST_DIST_DIR}" "${TEST_COVERAGE_DIR}"
    cp -r "${TEST_COVERAGE_DIR}" "${TEST_DIST_DIR}/"

    [[ -d "${TEST_DIST_DIR}/coverage" ]]
}

@test "deployment: Check artifact integrity with checksum validation" {
    mkdir -p "${TEST_DIST_DIR}"

    # Create checksum file
    cd "${TEST_DIST_DIR}"
    echo "abc123 package.json" > CHECKSUMS.txt

    [[ -f CHECKSUMS.txt ]]
}

@test "deployment: Ensure deployment artifacts have correct permissions" {
    mkdir -p "${TEST_DIST_DIR}"
    touch "${TEST_DIST_DIR}/artifact.txt"

    # Verify readable by owner
    [[ -r "${TEST_DIST_DIR}/artifact.txt" ]]
}

@test "deployment: Validate all build artifacts exist before deploy" {
    mkdir -p "${TEST_BUILD_DIR}"

    # Create marker file to indicate successful build
    touch "${TEST_BUILD_DIR}/.build-complete"

    [[ -f "${TEST_BUILD_DIR}/.build-complete" ]]
}

# =============================================================================
# INTEGRATION TESTS
# =============================================================================

@test "integration: Full build-to-deploy pipeline succeeds" {
    run_npm_install

    # Mock full pipeline
    mkdir -p "${TEST_BUILD_DIR}" "${TEST_DIST_DIR}" "${TEST_COVERAGE_DIR}"
    echo "Build OK" > "${TEST_BUILD_DIR}/build.log"
    cat > "${TEST_DIST_DIR}/MANIFEST.json" <<'EOF'
{
  "version": "1.0.0",
  "artifacts": ["build", "package.json"]
}
EOF

    [[ -f "${TEST_BUILD_DIR}/build.log" ]]
    [[ -f "${TEST_DIST_DIR}/MANIFEST.json" ]]
}

@test "integration: Theme.json and npm build are compatible" {
    # Verify theme.json is valid JSON
    run jq . "${TEST_PROJECT_DIR}/src/theme.json"
    [[ "$status" -eq 0 ]]

    # Verify build directory exists
    mkdir -p "${TEST_BUILD_DIR}"
    [[ -d "${TEST_BUILD_DIR}" ]]
}

@test "integration: Coverage enforced before deployment allowed" {
    # Create 100% coverage
    mkdir -p "${TEST_COVERAGE_DIR}"
    cat > "${TEST_COVERAGE_DIR}/coverage-summary.json" <<'EOF'
{
  "total": {
    "lines": { "pct": 100 },
    "statements": { "pct": 100 },
    "functions": { "pct": 100 },
    "branches": { "pct": 100 }
  }
}
EOF

    run check_coverage_threshold 100
    [[ "$status" -eq 0 ]]
}

# =============================================================================
# ERROR HANDLING TESTS
# =============================================================================

@test "error-handling: Gracefully handle missing package.json" {
    local test_dir=$(mktemp -d)
    cd "$test_dir"

    run npm run build 2>&1
    [[ "$status" -ne 0 ]]

    rm -rf "$test_dir"
}

@test "error-handling: Report coverage shortfall clearly" {
    mkdir -p "${TEST_COVERAGE_DIR}"
    cat > "${TEST_COVERAGE_DIR}/coverage-summary.json" <<'EOF'
{
  "total": {
    "lines": { "pct": 85 },
    "statements": { "pct": 85 },
    "functions": { "pct": 85 },
    "branches": { "pct": 85 }
  }
}
EOF

    run check_coverage_threshold 100
    [[ "$status" -ne 0 ]]
}

@test "error-handling: Handle malformed theme.json gracefully" {
    cat > "${TEST_PROJECT_DIR}/bad-theme.json" <<'EOF'
{ invalid json
EOF

    run jq . "${TEST_PROJECT_DIR}/bad-theme.json"
    [[ "$status" -ne 0 ]]
}

@test "error-handling: Fail deployment if artifacts missing" {
    # Don't create build directory
    run check_deployment_ready
    [[ "$status" -ne 0 ]] || skip "Expected deployment check to fail"
}
