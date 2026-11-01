#!/bin/bash
# Test helper functions for BATS WordPress build and deploy tests
# Provides fixtures, setup utilities, and common validation functions

set -euo pipefail

# =============================================================================
# ENVIRONMENT AND PATHS
# =============================================================================

# Test directories (set in setup)
export TEST_PROJECT_DIR="${TEST_PROJECT_DIR:-.}"
export TEST_BUILD_DIR="${TEST_BUILD_DIR:-.}"
export TEST_DIST_DIR="${TEST_DIST_DIR:-.}"
export TEST_COVERAGE_DIR="${TEST_COVERAGE_DIR:-.}"
export TEST_NODE_MODULES="${TEST_NODE_MODULES:-.}"

# npm configuration
export NPM_SILENT="${NPM_SILENT:---silent}"
export NPM_PREFER_OFFLINE="${NPM_PREFER_OFFLINE:---prefer-offline}"

# =============================================================================
# NPM INSTALLATION HELPERS
# =============================================================================

# Run npm install with standard configuration
run_npm_install() {
    local install_dir="${1:-.}"

    if ! command -v npm &> /dev/null; then
        echo "npm not found in PATH" >&2
        return 1
    fi

    cd "$install_dir" || return 1

    # Use --no-fund to avoid warnings in test output
    npm install \
        ${NPM_SILENT} \
        --no-fund \
        --no-audit \
        --prefer-offline \
        --no-optional 2>&1 | tail -n 5

    return $?
}

# Run npm install and generate lock file
run_npm_install_with_lock() {
    local install_dir="${1:-.}"

    cd "$install_dir" || return 1

    npm install \
        ${NPM_SILENT} \
        --no-fund \
        --no-audit \
        --package-lock-only 2>&1 || return 1

    # Verify lock file was created
    [[ -f "package-lock.json" ]] || return 1
}

# Check if npm modules are installed
is_npm_installed() {
    local module_name="${1:-}"

    if [[ -z "$module_name" ]]; then
        [[ -d "node_modules" ]]
    else
        [[ -d "node_modules/${module_name}" ]]
    fi
}

# Verify all required dependencies are installed
verify_dependencies() {
    local -a required_deps=(
        "eslint"
        "jest"
        "sass"
    )

    local -i missing=0

    for dep in "${required_deps[@]}"; do
        if ! is_npm_installed "$dep"; then
            echo "ERROR: Required dependency '${dep}' not found" >&2
            ((missing++))
        fi
    done

    return $missing
}

# =============================================================================
# COVERAGE VALIDATION HELPERS
# =============================================================================

# Parse coverage summary JSON and return percentage for given metric
get_coverage_percent() {
    local metric="${1:-lines}"
    local coverage_file="${2:-coverage/coverage-summary.json}"

    if [[ ! -f "$coverage_file" ]]; then
        echo "ERROR: Coverage file not found: $coverage_file" >&2
        return 1
    fi

    # Extract percentage for metric from coverage report
    local percent
    percent=$(jq -r ".total.${metric}.pct // 0" "$coverage_file" 2>/dev/null)

    echo "$percent"
}

# Check if coverage meets minimum threshold
check_coverage_threshold() {
    local threshold="${1:-100}"
    local coverage_file="${2:-coverage/coverage-summary.json}"

    if [[ ! -f "$coverage_file" ]]; then
        echo "ERROR: Coverage file not found" >&2
        return 1
    fi

    # Check all metrics meet threshold
    local -a metrics=("lines" "statements" "functions" "branches")
    local failed=0

    for metric in "${metrics[@]}"; do
        local percent
        percent=$(get_coverage_percent "$metric" "$coverage_file")

        if (( $(echo "$percent < $threshold" | bc -l) )); then
            echo "FAIL: ${metric} coverage ${percent}% is below threshold ${threshold}%" >&2
            ((failed++))
        fi
    done

    return $failed
}

# Validate coverage report structure
validate_coverage_report() {
    local coverage_file="${1:-coverage/coverage-summary.json}"

    if [[ ! -f "$coverage_file" ]]; then
        echo "ERROR: Coverage file not found: $coverage_file" >&2
        return 1
    fi

    # Verify coverage JSON is valid and has required structure
    jq -e '.total | has("lines") and has("statements") and has("functions") and has("branches")' "$coverage_file" > /dev/null 2>&1
}

# Generate coverage report summary
print_coverage_summary() {
    local coverage_file="${1:-coverage/coverage-summary.json}"

    if [[ ! -f "$coverage_file" ]]; then
        echo "ERROR: Coverage file not found" >&2
        return 1
    fi

    echo "Coverage Summary:"
    jq '.total | to_entries[] | "\(.key): \(.value.pct)%"' -r "$coverage_file" 2>/dev/null || return 1
}

# =============================================================================
# THEME.JSON VALIDATION HELPERS
# =============================================================================

# Validate theme.json is valid JSON
validate_theme_json_syntax() {
    local theme_file="${1:-src/theme.json}"

    if [[ ! -f "$theme_file" ]]; then
        echo "ERROR: theme.json not found: $theme_file" >&2
        return 1
    fi

    jq . "$theme_file" > /dev/null 2>&1
}

# Check theme.json has required version
check_theme_version() {
    local theme_file="${1:-src/theme.json}"
    local required_version="${2:-2}"

    if [[ ! -f "$theme_file" ]]; then
        echo "ERROR: theme.json not found: $theme_file" >&2
        return 1
    fi

    local version
    version=$(jq -r '.version // empty' "$theme_file" 2>/dev/null)

    if [[ -z "$version" ]]; then
        echo "ERROR: No version field in theme.json" >&2
        return 1
    fi

    if [[ "$version" != "$required_version" ]]; then
        echo "ERROR: theme.json version ${version} does not match required ${required_version}" >&2
        return 1
    fi
}

# Validate theme.json color palette
validate_color_palette() {
    local theme_file="${1:-src/theme.json}"

    if [[ ! -f "$theme_file" ]]; then
        echo "ERROR: theme.json not found: $theme_file" >&2
        return 1
    fi

    # Check if palette exists and is array
    local has_palette
    has_palette=$(jq '.settings.color.palette | type == "array"' "$theme_file" 2>/dev/null)

    if [[ "$has_palette" != "true" ]]; then
        echo "ERROR: Color palette not found or invalid" >&2
        return 1
    fi

    # Validate each palette entry has required fields
    local invalid_entries
    invalid_entries=$(jq '.settings.color.palette | map(select(has("color") and has("name") and has("slug") | not)) | length' "$theme_file" 2>/dev/null)

    if [[ "$invalid_entries" -gt 0 ]]; then
        echo "ERROR: ${invalid_entries} palette entries missing required fields (color, name, slug)" >&2
        return 1
    fi
}

# Validate theme.json typography settings
validate_typography() {
    local theme_file="${1:-src/theme.json}"

    if [[ ! -f "$theme_file" ]]; then
        echo "ERROR: theme.json not found: $theme_file" >&2
        return 1
    fi

    # Check if typography exists and fontFamilies is array
    local has_typography
    has_typography=$(jq '.settings.typography.fontFamilies | type == "array"' "$theme_file" 2>/dev/null)

    if [[ "$has_typography" != "true" ]]; then
        echo "WARNING: Typography fontFamilies not found or invalid" >&2
        return 1
    fi
}

# Comprehensive theme.json validation
validate_theme_json_complete() {
    local theme_file="${1:-src/theme.json}"

    local failed=0

    echo "Validating theme.json: $theme_file"

    # Check syntax
    if ! validate_theme_json_syntax "$theme_file"; then
        ((failed++))
    fi

    # Check version
    if ! check_theme_version "$theme_file" 2; then
        ((failed++))
    fi

    # Check color palette
    if ! validate_color_palette "$theme_file"; then
        ((failed++))
    fi

    # Check typography (warning only)
    validate_typography "$theme_file" || true

    return $failed
}

# =============================================================================
# DEPLOYMENT ARTIFACT HELPERS
# =============================================================================

# Verify build artifacts exist
verify_build_artifacts() {
    local build_dir="${1:-build}"

    if [[ ! -d "$build_dir" ]]; then
        echo "ERROR: Build directory not found: $build_dir" >&2
        return 1
    fi

    # Check for expected output files
    [[ -n "$(find "$build_dir" -type f -print -quit)" ]] || {
        echo "ERROR: Build directory is empty" >&2
        return 1
    }
}

# Verify deployment artifacts are ready
check_deployment_ready() {
    local build_dir="${1:-build}"
    local coverage_dir="${2:-coverage}"
    local dist_dir="${3:-dist}"

    local failed=0

    # Check build directory exists and has files
    if [[ ! -d "$build_dir" ]] || [[ -z "$(find "$build_dir" -type f -print -quit)" ]]; then
        echo "ERROR: Build artifacts not found" >&2
        ((failed++))
    fi

    # Check package.json exists
    if [[ ! -f "package.json" ]]; then
        echo "ERROR: package.json not found" >&2
        ((failed++))
    fi

    # Check coverage exists (optional but recommended)
    if [[ -d "$coverage_dir" ]]; then
        if [[ ! -f "$coverage_dir/coverage-summary.json" ]]; then
            echo "WARNING: Coverage summary not found" >&2
        fi
    fi

    return $failed
}

# Create deployment manifest
create_deployment_manifest() {
    local dist_dir="${1:-dist}"
    local version="${2:-1.0.0}"

    mkdir -p "$dist_dir"

    cat > "$dist_dir/MANIFEST.json" <<EOF
{
  "version": "${version}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "artifacts": ["build", "package.json", "coverage"],
  "checksumAlgorithm": "sha256",
  "hasMetadata": true,
  "deploymentReady": true
}
EOF
}

# Generate checksums for deployment artifacts
generate_artifact_checksums() {
    local dist_dir="${1:-dist}"

    if [[ ! -d "$dist_dir" ]]; then
        echo "ERROR: Distribution directory not found: $dist_dir" >&2
        return 1
    fi

    cd "$dist_dir" || return 1

    # Generate SHA256 checksums for all files
    find . -type f ! -name "CHECKSUMS.txt" -exec sha256sum {} \; > CHECKSUMS.txt

    cd - > /dev/null || return 1
}

# Verify artifact checksums
verify_artifact_checksums() {
    local dist_dir="${1:-dist}"

    if [[ ! -d "$dist_dir" ]]; then
        echo "ERROR: Distribution directory not found: $dist_dir" >&2
        return 1
    fi

    if [[ ! -f "$dist_dir/CHECKSUMS.txt" ]]; then
        echo "ERROR: CHECKSUMS.txt not found" >&2
        return 1
    fi

    cd "$dist_dir" || return 1
    sha256sum -c CHECKSUMS.txt > /dev/null 2>&1
    local result=$?
    cd - > /dev/null || return 1

    return $result
}

# =============================================================================
# BUILD EXECUTION HELPERS
# =============================================================================

# Execute npm build with error capture
run_npm_build() {
    local build_log="${1:-.build.log}"

    if ! npm run build > "$build_log" 2>&1; then
        echo "ERROR: Build failed (see $build_log)" >&2
        tail -n 20 "$build_log" >&2
        return 1
    fi
}

# Execute npm build in production mode
run_npm_build_prod() {
    local build_log="${1:-.build-prod.log}"

    if ! npm run build:prod > "$build_log" 2>&1; then
        echo "ERROR: Production build failed (see $build_log)" >&2
        tail -n 20 "$build_log" >&2
        return 1
    fi
}

# Run test suite with coverage
run_tests_with_coverage() {
    local coverage_dir="${1:-coverage}"
    local coverage_log="${2:-.test-coverage.log}"

    if ! npm run test:coverage > "$coverage_log" 2>&1; then
        echo "ERROR: Tests with coverage failed (see $coverage_log)" >&2
        tail -n 20 "$coverage_log" >&2
        return 1
    fi

    # Verify coverage report was generated
    [[ -f "$coverage_dir/coverage-summary.json" ]] || {
        echo "ERROR: Coverage report not generated" >&2
        return 1
    }
}

# Run linting checks
run_lint_checks() {
    local lint_log="${1:-.lint.log}"

    if ! npm run lint > "$lint_log" 2>&1; then
        echo "WARNING: Linting found issues (see $lint_log)" >&2
        tail -n 10 "$lint_log" >&2
        return 1
    fi
}

# =============================================================================
# DEPLOYMENT SCRIPT HELPERS
# =============================================================================

# Execute deployment package script
run_deployment_script() {
    local script_path="${1:-scripts/package-artifacts.sh}"
    local deploy_log="${2:-.deploy.log}"

    if [[ ! -f "$script_path" ]]; then
        echo "ERROR: Deployment script not found: $script_path" >&2
        return 1
    fi

    if ! bash "$script_path" > "$deploy_log" 2>&1; then
        echo "ERROR: Deployment packaging failed (see $deploy_log)" >&2
        tail -n 20 "$deploy_log" >&2
        return 1
    fi
}

# Validate deployment manifest
validate_deployment_manifest() {
    local manifest_file="${1:-dist/MANIFEST.json}"

    if [[ ! -f "$manifest_file" ]]; then
        echo "ERROR: Deployment manifest not found: $manifest_file" >&2
        return 1
    fi

    # Verify manifest is valid JSON
    if ! jq . "$manifest_file" > /dev/null 2>&1; then
        echo "ERROR: Manifest is not valid JSON" >&2
        return 1
    fi

    # Verify required fields
    if ! jq -e '.version and .timestamp and .artifacts' "$manifest_file" > /dev/null; then
        echo "ERROR: Manifest missing required fields" >&2
        return 1
    fi
}

# =============================================================================
# FIXTURE GENERATORS
# =============================================================================

# Create minimal theme.json fixture
create_theme_json_fixture() {
    local output_dir="${1:-.}"
    local theme_file="${output_dir}/theme.json"

    mkdir -p "$output_dir"

    cat > "$theme_file" <<'EOF'
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
        },
        {
          "color": "#000000",
          "name": "Black",
          "slug": "black"
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
}

# Create package.json fixture
create_package_json_fixture() {
    local output_dir="${1:-.}"
    local package_file="${output_dir}/package.json"

    mkdir -p "$output_dir"

    cat > "$package_file" <<'EOF'
{
  "name": "lightspeed-wordpress",
  "version": "1.0.0",
  "scripts": {
    "build": "npm run compile && npm run test:coverage",
    "compile": "sass src:build --no-source-map",
    "lint": "eslint src/",
    "test": "jest",
    "test:coverage": "jest --coverage --coverageDirectory=coverage",
    "deploy": "npm run build && bash scripts/package-artifacts.sh"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "sass": "^1.50.0"
  }
}
EOF
}

# Create mock coverage report
create_coverage_report_fixture() {
    local output_dir="${1:-coverage}"
    local coverage_level="${2:-100}"

    mkdir -p "$output_dir"

    cat > "$output_dir/coverage-summary.json" <<EOF
{
  "total": {
    "lines": { "total": 100, "covered": 100, "skipped": 0, "pct": $coverage_level },
    "statements": { "total": 100, "covered": 100, "skipped": 0, "pct": $coverage_level },
    "functions": { "total": 100, "covered": 100, "skipped": 0, "pct": $coverage_level },
    "branches": { "total": 100, "covered": 100, "skipped": 0, "pct": $coverage_level }
  }
}
EOF
}

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Print colored test output
print_test_header() {
    local message="$1"
    echo ""
    echo "=========================================="
    echo "  $message"
    echo "=========================================="
}

# Check if command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Get current test metrics
get_test_metrics() {
    local test_file="${1:-wordpress-build-deploy.bats}"

    echo "Test Metrics for $test_file:"
    echo "Total tests: $(grep -c '^@test' "$test_file")"
    echo "Setup tests: $(grep -c 'setup()' "$test_file")"
    echo "Integration tests: $(grep -c 'integration:' "$test_file")"
    echo "Error handling tests: $(grep -c 'error-handling:' "$test_file")"
}

# Cleanup function for test directory
cleanup_test_dir() {
    local test_dir="$1"

    if [[ -d "$test_dir" ]]; then
        rm -rf "$test_dir"
    fi
}

export -f run_npm_install
export -f run_npm_install_with_lock
export -f is_npm_installed
export -f verify_dependencies
export -f get_coverage_percent
export -f check_coverage_threshold
export -f validate_coverage_report
export -f print_coverage_summary
export -f validate_theme_json_syntax
export -f check_theme_version
export -f validate_color_palette
export -f validate_typography
export -f validate_theme_json_complete
export -f verify_build_artifacts
export -f check_deployment_ready
export -f create_deployment_manifest
export -f generate_artifact_checksums
export -f verify_artifact_checksums
export -f run_npm_build
export -f run_npm_build_prod
export -f run_tests_with_coverage
export -f run_lint_checks
export -f run_deployment_script
export -f validate_deployment_manifest
export -f create_theme_json_fixture
export -f create_package_json_fixture
export -f create_coverage_report_fixture
export -f print_test_header
export -f command_exists
export -f get_test_metrics
export -f cleanup_test_dir
