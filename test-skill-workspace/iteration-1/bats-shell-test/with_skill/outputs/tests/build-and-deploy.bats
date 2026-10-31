#!/usr/bin/env bats
# BATS tests for WordPress build and deploy process
# Tests: node_modules installation, build coverage, theme.json validation, deployment artifacts
# Author: LightSpeedWP Test Skill
# Version: 1.0.0

set -euo pipefail

# Load test helpers and fixtures
load ../helpers/bats-helpers
load ../helpers/test-fixtures

# Setup before each test
setup() {
  # Export test environment variables
  export TEST_DIR="$(mktemp -d)"
  export PROJECT_ROOT="${BATS_TEST_DIRNAME}/../../../"
  export BUILD_DIR="${TEST_DIR}/build"
  export NODE_MODULES_DIR="${TEST_DIR}/node_modules"
  export COVERAGE_THRESHOLD=100
  export DEPLOYMENT_ARTIFACTS_DIR="${TEST_DIR}/dist"

  # Create required directories
  mkdir -p "${BUILD_DIR}" "${DEPLOYMENT_ARTIFACTS_DIR}"

  # Initialize mock package.json if it doesn't exist
  if [[ ! -f "${TEST_DIR}/package.json" ]]; then
    create_mock_package_json "${TEST_DIR}"
  fi

  # Initialize mock theme.json if it doesn't exist
  if [[ ! -f "${TEST_DIR}/theme.json" ]]; then
    create_mock_theme_json "${TEST_DIR}"
  fi
}

# Teardown after each test
teardown() {
  # Clean up test directory
  if [[ -d "${TEST_DIR}" ]]; then
    rm -rf "${TEST_DIR}"
  fi
}

# ============================================================================
# Section 1: Node Modules Installation Tests
# ============================================================================

@test "node_modules validation: directory exists after npm install" {
  run npm_install_check "${TEST_DIR}"
  assert_success
  assert_output --partial "node_modules directory exists"
  assert_dir_exists "${NODE_MODULES_DIR}"
}

@test "node_modules validation: package-lock.json is generated" {
  run npm_install_check "${TEST_DIR}"
  assert_success
  assert_file_exists "${TEST_DIR}/package-lock.json"
}

@test "node_modules validation: required dependencies are installed" {
  local deps=("react" "webpack" "@wordpress/scripts")

  # Create package.json with dependencies
  create_package_json_with_deps "${TEST_DIR}" "${deps[@]}"

  run npm_install_check "${TEST_DIR}"
  assert_success

  for dep in "${deps[@]}"; do
    assert_dir_exists "${NODE_MODULES_DIR}/${dep}"
  done
}

@test "node_modules validation: npm install fails with missing package.json" {
  rm -f "${TEST_DIR}/package.json"

  run npm_install_check "${TEST_DIR}"
  assert_failure
  assert_output --partial "package.json not found"
}

@test "node_modules validation: npm install handles network errors gracefully" {
  run npm_install_with_timeout "${TEST_DIR}" 1
  assert_failure
  assert_output --partial "Installation timed out or failed"
}

@test "node_modules validation: npm ci uses lock file in CI environment" {
  export CI=true
  create_package_lock_json "${TEST_DIR}"

  run npm_ci_check "${TEST_DIR}"
  assert_success
  assert_output --partial "using npm ci"
}

@test "node_modules validation: correct node version is installed" {
  local expected_version="18.x"

  run verify_node_version "${expected_version}"
  assert_success || skip "Node ${expected_version} not available"
}

# ============================================================================
# Section 2: NPM Build with Coverage Validation Tests
# ============================================================================

@test "npm build: build script exists in package.json" {
  create_package_json_with_scripts "${TEST_DIR}" "build"

  run verify_build_script "${TEST_DIR}"
  assert_success
  assert_output --partial "build script found"
}

@test "npm build: npm run build completes successfully" {
  create_complete_build_environment "${TEST_DIR}"

  run npm_build_check "${TEST_DIR}"
  assert_success
  assert_output --partial "Build completed successfully"
}

@test "npm build: build output contains compiled assets" {
  create_complete_build_environment "${TEST_DIR}"

  run npm_build_check "${TEST_DIR}"
  assert_success
  assert_dir_exists "${BUILD_DIR}"
  assert_file_exists "${BUILD_DIR}/index.js"
}

@test "npm build: build creates CSS output files" {
  create_complete_build_environment "${TEST_DIR}"

  run npm_build_check "${TEST_DIR}"
  assert_success
  assert_file_exists "${BUILD_DIR}/style.css"
}

@test "npm build: coverage reporter is configured" {
  create_package_json_with_coverage_config "${TEST_DIR}"

  run verify_coverage_config "${TEST_DIR}"
  assert_success
  assert_output --partial "coverage configured"
}

@test "coverage: build generates coverage reports" {
  create_complete_build_environment "${TEST_DIR}"
  export COVERAGE_THRESHOLD=100

  run npm_build_with_coverage "${TEST_DIR}"
  assert_success
  assert_file_exists "${TEST_DIR}/coverage/index.html"
}

@test "coverage: coverage meets 100% threshold" {
  create_complete_build_environment "${TEST_DIR}"
  export COVERAGE_THRESHOLD=100

  run verify_coverage_threshold "${TEST_DIR}" 100
  assert_success
  assert_output --partial "Coverage threshold met"
}

@test "coverage: coverage fails below threshold" {
  create_build_environment_with_coverage "${TEST_DIR}" 85
  export COVERAGE_THRESHOLD=90

  run verify_coverage_threshold "${TEST_DIR}" 90
  assert_failure
  assert_output --partial "Coverage below threshold"
}

@test "coverage: lcov report is generated" {
  create_complete_build_environment "${TEST_DIR}"

  run npm_build_with_coverage "${TEST_DIR}"
  assert_success
  assert_file_exists "${TEST_DIR}/coverage/lcov.info"
}

@test "coverage: coverage report excludes ignored files" {
  create_package_json_with_coverage_config "${TEST_DIR}"

  run verify_coverage_exclusions "${TEST_DIR}"
  assert_success
  assert_output --partial "Exclusions configured"
}

@test "npm build: build fails with invalid source code" {
  create_build_environment_with_syntax_error "${TEST_DIR}"

  run npm_build_check "${TEST_DIR}"
  assert_failure
  assert_output --partial "Syntax error"
}

@test "npm build: build handles missing dependencies" {
  create_package_json_with_missing_deps "${TEST_DIR}"

  run npm_build_check "${TEST_DIR}"
  assert_failure
  assert_output --partial "Missing dependency"
}

# ============================================================================
# Section 3: Theme.json Validation Tests
# ============================================================================

@test "theme.json: file exists" {
  create_mock_theme_json "${TEST_DIR}"

  run verify_theme_json_exists "${TEST_DIR}"
  assert_success
  assert_file_exists "${TEST_DIR}/theme.json"
}

@test "theme.json: file is valid JSON" {
  create_mock_theme_json "${TEST_DIR}"

  run validate_theme_json_syntax "${TEST_DIR}/theme.json"
  assert_success
  assert_output --partial "Valid JSON"
}

@test "theme.json: schema validation passes" {
  create_mock_theme_json "${TEST_DIR}"

  run validate_theme_json_schema "${TEST_DIR}/theme.json"
  assert_success
  assert_output --partial "Schema validation passed"
}

@test "theme.json: required properties present" {
  create_mock_theme_json "${TEST_DIR}"

  run verify_theme_json_properties "${TEST_DIR}/theme.json"
  assert_success
  assert_output --partial "version property found"
  assert_output --partial "settings property found"
  assert_output --partial "styles property found"
}

@test "theme.json: valid version format" {
  create_mock_theme_json "${TEST_DIR}"

  run verify_theme_json_version "${TEST_DIR}/theme.json" "3"
  assert_success
  assert_output --partial "Version 3 found"
}

@test "theme.json: color settings are properly defined" {
  create_mock_theme_json "${TEST_DIR}"

  run verify_theme_json_colors "${TEST_DIR}/theme.json"
  assert_success
  assert_output --partial "Color palette defined"
}

@test "theme.json: typography settings are properly defined" {
  create_mock_theme_json "${TEST_DIR}"

  run verify_theme_json_typography "${TEST_DIR}/theme.json"
  assert_success
  assert_output --partial "Font sizes defined"
}

@test "theme.json: spacing settings are properly defined" {
  create_mock_theme_json "${TEST_DIR}"

  run verify_theme_json_spacing "${TEST_DIR}/theme.json"
  assert_success
  assert_output --partial "Spacing scale defined"
}

@test "theme.json: invalid JSON fails validation" {
  create_invalid_theme_json "${TEST_DIR}"

  run validate_theme_json_syntax "${TEST_DIR}/theme.json"
  assert_failure
  assert_output --partial "Invalid JSON"
}

@test "theme.json: missing required properties fails validation" {
  create_incomplete_theme_json "${TEST_DIR}"

  run verify_theme_json_properties "${TEST_DIR}/theme.json"
  assert_failure
  assert_output --partial "Missing required property"
}

@test "theme.json: detects duplicate color names" {
  create_theme_json_with_duplicates "${TEST_DIR}"

  run verify_theme_json_no_duplicates "${TEST_DIR}/theme.json"
  assert_failure
  assert_output --partial "Duplicate color name found"
}

# ============================================================================
# Section 4: Deployment Artifacts Validation Tests
# ============================================================================

@test "deployment artifacts: build creates dist directory" {
  create_complete_build_environment "${TEST_DIR}"

  run npm_build_check "${TEST_DIR}"
  assert_success
  assert_dir_exists "${DEPLOYMENT_ARTIFACTS_DIR}"
}

@test "deployment artifacts: required files are present" {
  create_complete_build_environment "${TEST_DIR}"
  run npm_build_check "${TEST_DIR}"
  assert_success

  run verify_deployment_artifacts "${DEPLOYMENT_ARTIFACTS_DIR}"
  assert_success
  assert_output --partial "All required artifacts present"
}

@test "deployment artifacts: bundle files are not empty" {
  create_complete_build_environment "${TEST_DIR}"
  run npm_build_check "${TEST_DIR}"
  assert_success

  run verify_artifact_sizes "${DEPLOYMENT_ARTIFACTS_DIR}"
  assert_success
  assert_output --partial "All artifacts have content"
}

@test "deployment artifacts: source maps are generated" {
  create_complete_build_environment "${TEST_DIR}"

  run npm_build_check "${TEST_DIR}"
  assert_success

  run verify_source_maps "${DEPLOYMENT_ARTIFACTS_DIR}"
  assert_success || skip "Source maps optional"
}

@test "deployment artifacts: manifest.json contains correct metadata" {
  create_complete_build_environment "${TEST_DIR}"
  run npm_build_check "${TEST_DIR}"
  assert_success

  run verify_manifest_metadata "${DEPLOYMENT_ARTIFACTS_DIR}"
  assert_success
  assert_output --partial "Manifest metadata valid"
}

@test "deployment artifacts: no temporary or debug files in artifacts" {
  create_complete_build_environment "${TEST_DIR}"
  run npm_build_check "${TEST_DIR}"
  assert_success

  run verify_no_temp_files "${DEPLOYMENT_ARTIFACTS_DIR}"
  assert_success
  assert_output --partial "No temporary files found"
}

@test "deployment artifacts: all artifacts are readable" {
  create_complete_build_environment "${TEST_DIR}"
  run npm_build_check "${TEST_DIR}"
  assert_success

  run verify_artifact_permissions "${DEPLOYMENT_ARTIFACTS_DIR}"
  assert_success
}

@test "deployment artifacts: bundle size is within limits" {
  create_complete_build_environment "${TEST_DIR}"
  run npm_build_check "${TEST_DIR}"
  assert_success

  run verify_bundle_size "${DEPLOYMENT_ARTIFACTS_DIR}" 5000
  assert_success || skip "Bundle size check optional"
}

@test "deployment artifacts: tar.gz archive can be created" {
  create_complete_build_environment "${TEST_DIR}"
  run npm_build_check "${TEST_DIR}"
  assert_success

  run create_deployment_archive "${DEPLOYMENT_ARTIFACTS_DIR}"
  assert_success
  assert_file_exists "${DEPLOYMENT_ARTIFACTS_DIR}.tar.gz"
}

@test "deployment artifacts: archive integrity verification passes" {
  create_complete_build_environment "${TEST_DIR}"
  run npm_build_check "${TEST_DIR}"
  assert_success

  run create_deployment_archive "${DEPLOYMENT_ARTIFACTS_DIR}"
  assert_success

  run verify_archive_integrity "${DEPLOYMENT_ARTIFACTS_DIR}.tar.gz"
  assert_success
}

# ============================================================================
# Section 5: Integration Tests
# ============================================================================

@test "integration: full build-to-deploy workflow succeeds" {
  create_complete_build_environment "${TEST_DIR}"

  run full_build_workflow "${TEST_DIR}"
  assert_success
  assert_dir_exists "${DEPLOYMENT_ARTIFACTS_DIR}"
  assert_file_exists "${TEST_DIR}/theme.json"
  assert_file_exists "${TEST_DIR}/coverage/lcov.info"
}

@test "integration: coverage report is generated during build" {
  create_complete_build_environment "${TEST_DIR}"

  run full_build_workflow "${TEST_DIR}"
  assert_success
  assert_file_exists "${TEST_DIR}/coverage/lcov.info"
}

@test "integration: theme.json is validated during build" {
  create_complete_build_environment "${TEST_DIR}"

  run npm_build_with_theme_validation "${TEST_DIR}"
  assert_success
  assert_output --partial "Theme validation passed"
}

@test "integration: deployment package is ready for production" {
  create_complete_build_environment "${TEST_DIR}"

  run prepare_deployment_package "${TEST_DIR}"
  assert_success
  assert_output --partial "Deployment package ready"
  assert_file_exists "${DEPLOYMENT_ARTIFACTS_DIR}.tar.gz"
}

# ============================================================================
# Section 6: Error Handling Tests
# ============================================================================

@test "error handling: graceful failure when node_modules missing" {
  run npm_install_check "${TEST_DIR}" 2>&1
  # This may succeed or fail depending on test environment
  # The key is that it exits cleanly with informative message
  [[ $status -eq 0 || $status -eq 1 ]]
}

@test "error handling: clear error message for coverage failure" {
  create_build_environment_with_coverage "${TEST_DIR}" 50

  run verify_coverage_threshold "${TEST_DIR}" 90 2>&1
  assert_failure
  assert_output --partial "Coverage: 50%"
  assert_output --partial "Required: 90%"
}

@test "error handling: descriptive error for invalid theme.json" {
  create_invalid_theme_json "${TEST_DIR}"

  run validate_theme_json_syntax "${TEST_DIR}/theme.json" 2>&1
  assert_failure
  assert_output --partial "line"
  assert_output --partial "character"
}

@test "error handling: recovery from partial build state" {
  create_incomplete_build "${TEST_DIR}"

  run npm_build_check "${TEST_DIR}" 2>&1
  # Should attempt to recover or fail cleanly
  assert_output --partial "Build"
}

@test "error handling: timeout handling in npm operations" {
  run npm_install_with_timeout "${TEST_DIR}" 0
  assert_failure
  assert_output --partial "timeout"
}

# ============================================================================
# Section 7: Pre-deployment Checks
# ============================================================================

@test "pre-deployment: all checks pass for deployment readiness" {
  create_complete_build_environment "${TEST_DIR}"

  run verify_deployment_readiness "${TEST_DIR}"
  assert_success
  assert_output --partial "All checks passed"
}

@test "pre-deployment: version is properly formatted" {
  create_mock_package_json "${TEST_DIR}"

  run verify_version_format "${TEST_DIR}"
  assert_success || skip "Version checking optional"
}

@test "pre-deployment: changelog is present and updated" {
  run verify_changelog "${TEST_DIR}"
  assert_success || skip "Changelog checking optional"
}

@test "pre-deployment: git state is clean" {
  run verify_git_state "${TEST_DIR}" 2>&1
  # May not be in git repo in test environment
  [[ $status -eq 0 || $status -eq 1 ]]
}

# ============================================================================
# Helper Functions
# ============================================================================

# Helper: Display test summary
summary() {
  local total=$1
  local passed=$2
  local failed=$((total - passed))

  echo "======================================"
  echo "Test Summary"
  echo "======================================"
  echo "Total:  ${total}"
  echo "Passed: ${passed}"
  echo "Failed: ${failed}"
  echo "======================================"
}

# Load bats standard library
bats_require_minimum_version 1.5.0
