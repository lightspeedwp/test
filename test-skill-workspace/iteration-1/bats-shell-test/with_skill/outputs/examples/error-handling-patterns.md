# Error Handling Patterns for BATS Tests

Comprehensive error handling patterns for WordPress build and deployment BATS tests.

## Table of Contents

1. [Basic Error Handling](#basic-error-handling)
2. [Error Recovery](#error-recovery)
3. [Error Logging](#error-logging)
4. [Error Messages](#error-messages)
5. [Test Timeouts](#test-timeouts)
6. [Signal Handling](#signal-handling)
7. [Cleanup on Errors](#cleanup-on-errors)
8. [Testing Error Conditions](#testing-error-conditions)

## Basic Error Handling

### Exit on Error

```bash
# Set error handling at start of script
set -euo pipefail

# Explanation:
# -e: Exit on first error
# -u: Exit on undefined variable
# -o pipefail: Exit if any command in pipe fails
```

### Try-Catch Pattern

```bash
# Simulate try-catch behavior
if npm_build_check "${TEST_DIR}"; then
  echo "Build succeeded"
else
  echo "Build failed"
  return 1
fi
```

### Error Handling in Test

```bash
@test "npm build: handles build failures gracefully" {
  # Create a test environment that will fail
  create_build_environment_with_syntax_error "${TEST_DIR}"
  
  # Run test and expect failure
  run npm_build_check "${TEST_DIR}"
  assert_failure
  assert_output --partial "Syntax error"
}
```

## Error Recovery

### Retry Logic

```bash
# Retry a command with backoff
retry_with_backoff() {
  local max_attempts=3
  local timeout=1
  local attempt=1
  
  while (( attempt <= max_attempts )); do
    if "$@"; then
      return 0
    fi
    
    local exit_code=$?
    
    if (( attempt < max_attempts )); then
      echo "Attempt $attempt failed, retrying in ${timeout}s..." >&2
      sleep "$timeout"
      timeout=$((timeout * 2))
    fi
    
    attempt=$((attempt + 1))
  done
  
  echo "All retry attempts failed" >&2
  return "$exit_code"
}

# Usage in tests
retry_with_backoff npm install
```

### Fallback Logic

```bash
# Try primary approach, fall back to alternative
install_dependencies() {
  local project_dir="${1:-.}"
  
  # Try npm install first
  if npm install --prefix "$project_dir" 2>/dev/null; then
    echo "Dependencies installed with npm"
    return 0
  fi
  
  # Fall back to npm ci
  if npm ci --prefix "$project_dir" 2>/dev/null; then
    echo "Dependencies installed with npm ci"
    return 0
  fi
  
  # Both failed
  echo "Failed to install dependencies" >&2
  return 1
}
```

## Error Logging

### Structured Error Output

```bash
# Log errors with context
log_error() {
  local line_number=$1
  local error_message=$2
  
  cat >&2 <<EOF
ERROR at line $line_number:
  Message: $error_message
  Time: $(date '+%Y-%m-%d %H:%M:%S')
  Command: $BASH_COMMAND
EOF
}

# Set trap to log errors
trap 'log_error ${LINENO} "$BASH_COMMAND"' ERR
```

### Verbose Error Debugging

```bash
@test "npm build with debug output" {
  # Enable verbose output for debugging
  export DEBUG=true
  
  run npm_build_check "${TEST_DIR}"
  
  # Capture both stdout and stderr
  [[ "$output" != *"Error"* ]] || echo "Debug: $output"
}
```

### Error Context Preservation

```bash
# Preserve error context for debugging
run_with_context() {
  local description="${1}"
  shift
  
  echo "Running: $description"
  
  if ! "$@"; then
    local exit_code=$?
    echo "FAILED: $description (exit code: $exit_code)" >&2
    return $exit_code
  fi
  
  echo "SUCCEEDED: $description"
  return 0
}

# Usage
run_with_context "npm install" npm install
```

## Error Messages

### Clear Error Messages

```bash
# Provide clear, actionable error messages
verify_coverage_threshold() {
  local project_dir="${1:-.}"
  local threshold="${2:-100}"
  local coverage_file="${project_dir}/coverage/lcov.info"
  
  if [[ ! -f "$coverage_file" ]]; then
    cat >&2 <<EOF
ERROR: Coverage report not found

To generate coverage report, run:
  npm run test:coverage

Then try again.
EOF
    return 1
  fi
  
  # Check coverage value
  local coverage=85  # Example value
  
  if (( coverage < threshold )); then
    cat >&2 <<EOF
ERROR: Coverage below threshold

Current:  $coverage%
Required: $threshold%
Gap:      $((threshold - coverage))%

To improve coverage:
1. Review coverage report: open coverage/index.html
2. Add tests for uncovered lines
3. Run: npm run test:coverage
EOF
    return 1
  fi
  
  return 0
}
```

### Error Classification

```bash
# Classify errors for better debugging
classify_error() {
  local error_message="${1}"
  
  if [[ "$error_message" =~ "ENOTFOUND" ]]; then
    echo "NETWORK_ERROR"
  elif [[ "$error_message" =~ "EACCES" ]]; then
    echo "PERMISSION_ERROR"
  elif [[ "$error_message" =~ "ENOMEM" ]]; then
    echo "MEMORY_ERROR"
  elif [[ "$error_message" =~ "TIMEOUT" ]]; then
    echo "TIMEOUT_ERROR"
  elif [[ "$error_message" =~ "Syntax" ]]; then
    echo "SYNTAX_ERROR"
  else
    echo "UNKNOWN_ERROR"
  fi
}
```

## Test Timeouts

### Timeout Handling

```bash
# Run command with timeout
run_with_timeout() {
  local timeout_seconds="${1}"
  shift
  
  if ! command -v timeout &>/dev/null; then
    echo "WARNING: timeout command not available" >&2
    "$@"
    return $?
  fi
  
  timeout "$timeout_seconds" "$@"
}

# Usage in tests
@test "npm install with 30 second timeout" {
  run run_with_timeout 30 npm install
  assert_success
}
```

### Timeout Error Handling

```bash
# Handle timeout errors specifically
handle_timeout() {
  local command="${1}"
  local timeout_seconds="${2}"
  
  if run_with_timeout "$timeout_seconds" "$command"; then
    return 0
  fi
  
  local exit_code=$?
  
  # Exit code 124 = timeout
  if (( exit_code == 124 )); then
    echo "Command timed out after ${timeout_seconds}s: $command" >&2
    return 1
  fi
  
  return $exit_code
}
```

## Signal Handling

### Graceful Shutdown

```bash
# Handle interrupts and signals
setup_signal_handlers() {
  trap 'on_exit' EXIT
  trap 'on_interrupt' INT TERM
}

on_exit() {
  echo "Cleaning up..."
  cleanup_fixtures "${TEST_DIR}"
}

on_interrupt() {
  echo "Interrupted. Cleaning up..." >&2
  cleanup_fixtures "${TEST_DIR}"
  exit 130  # Standard exit code for SIGINT
}

# In test setup
setup() {
  setup_signal_handlers
  # ... rest of setup
}
```

## Cleanup on Errors

### Ensure Cleanup Runs

```bash
# Use trap to ensure cleanup
@test "cleanup runs even on failure" {
  setup_cleanup_trap() {
    local temp_file="${1}"
    trap "rm -f '$temp_file'" RETURN
  }
  
  local temp_file=$(mktemp)
  setup_cleanup_trap "$temp_file"
  
  # Even if this fails, cleanup runs
  echo "test" > "$temp_file"
  
  [[ -f "$temp_file" ]]
  # File is cleaned up before test ends
}
```

### Partial Failure Recovery

```bash
# Clean up partial state on failure
safe_build_operation() {
  local project_dir="${1:-.}"
  local backup_dir="${project_dir}.backup"
  
  # Backup current state
  if [[ -d "$project_dir/build" ]]; then
    cp -r "$project_dir/build" "$backup_dir"
  fi
  
  # Attempt build
  if npm_build_check "$project_dir"; then
    # Success, remove backup
    rm -rf "$backup_dir"
    return 0
  fi
  
  # Failure, restore from backup
  local exit_code=$?
  
  if [[ -d "$backup_dir" ]]; then
    rm -rf "$project_dir/build"
    cp -r "$backup_dir" "$project_dir/build"
    rm -rf "$backup_dir"
  fi
  
  return $exit_code
}
```

## Testing Error Conditions

### Testing Error Scenarios

```bash
# Create fixtures for error testing
@test "npm install fails with missing package.json" {
  rm -f "${TEST_DIR}/package.json"
  
  run npm_install_check "${TEST_DIR}"
  assert_failure
  assert_output --partial "package.json not found"
}

@test "npm install fails with network error" {
  run npm_install_with_timeout "${TEST_DIR}" 0
  assert_failure
  assert_output --partial "timed out"
}

@test "theme.json validation fails with invalid JSON" {
  create_invalid_theme_json "${TEST_DIR}"
  
  run validate_theme_json_syntax "${TEST_DIR}/theme.json"
  assert_failure
  assert_output --partial "Invalid JSON"
}
```

### Error Message Validation

```bash
# Verify error messages are helpful
@test "coverage failure shows actual vs required" {
  create_build_environment_with_coverage "${TEST_DIR}" 50
  
  run verify_coverage_threshold "${TEST_DIR}" 90
  assert_failure
  assert_output --partial "Coverage: 50%"
  assert_output --partial "Required: 90%"
  assert_output --partial "Gap:"
}

@test "theme.json error includes line and column info" {
  create_invalid_theme_json "${TEST_DIR}"
  
  run validate_theme_json_syntax "${TEST_DIR}/theme.json" 2>&1
  assert_failure
  # Should show location of error
  assert_output --regexp "line [0-9]+"
  assert_output --regexp "column [0-9]+"
}
```

## Best Practices

### 1. Fail Fast

```bash
# Exit immediately on first error
set -euo pipefail

# Check preconditions early
@test "test requires setup" {
  if [[ ! -d "$TEST_DIR" ]]; then
    skip "Test directory not created"
  fi
  # ... rest of test
}
```

### 2. Provide Context

```bash
# Include relevant context in error messages
echo "ERROR: Failed to build"
echo "Context: NODE_ENV=${NODE_ENV:-not set}"
echo "Working directory: $(pwd)"
echo "Node version: $(node --version)"
```

### 3. Log Important Events

```bash
# Log key events for debugging
print_info "Starting build process..."
print_info "Using ${NODE_VERSION}..."
print_info "Target directory: ${PROJECT_DIR}"
```

### 4. Use Assertions Effectively

```bash
# Make assertions that clearly show what failed
assert_success      # Clear pass
assert_failure      # Clear fail
assert_output --partial "expected text"  # Check output
assert_line_count 5                      # Check line count
```

### 5. Document Error Paths

```bash
# Comment error handling to explain why
@test "optional feature gracefully degraded" {
  # If feature X is missing, test should pass anyway
  run optional_feature || skip "Feature not available"
  assert_success
}
```

## Example: Complete Error Handling

```bash
#!/bin/bash
# Comprehensive error handling example

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly MAX_RETRIES=3
readonly TIMEOUT=60

# Error handling setup
setup_error_handling() {
  trap 'on_error $? $LINENO' ERR
  trap 'on_exit' EXIT
}

on_error() {
  local exit_code=$1
  local line_number=$2
  
  echo "ERROR at line $line_number (exit code: $exit_code)" >&2
  log_error "Build failed" "$exit_code"
  
  # Attempt cleanup
  cleanup_on_error || true
  
  exit "$exit_code"
}

on_exit() {
  # Ensure critical cleanup
  cleanup_fixtures "${TEST_DIR}" || true
}

log_error() {
  local message=$1
  local exit_code=$2
  
  {
    echo "=== ERROR LOG ==="
    echo "Time: $(date)"
    echo "Message: $message"
    echo "Exit Code: $exit_code"
    echo "Working Directory: $(pwd)"
  } >> error.log
}

cleanup_on_error() {
  echo "Cleaning up after error..."
  [[ -d "${TEST_DIR}" ]] && rm -rf "${TEST_DIR}"
  return 0
}

# Main function with error handling
main() {
  setup_error_handling
  
  echo "Starting deployment validation..."
  
  # Run builds with error handling
  if ! run_with_timeout $TIMEOUT npm install; then
    echo "ERROR: npm install failed" >&2
    return 1
  fi
  
  if ! run_with_timeout $TIMEOUT npm run build; then
    echo "ERROR: Build failed" >&2
    return 1
  fi
  
  echo "✓ Deployment validation successful"
  return 0
}

main "$@"
```

This comprehensive error handling ensures robustness and clarity when tests fail.
