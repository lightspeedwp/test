# Error Handling Patterns for BATS Tests

Comprehensive patterns and best practices for handling errors in BATS shell tests for WordPress build and deploy processes.

## Table of Contents
1. [Basic Error Handling](#basic-error-handling)
2. [npm Command Failures](#npm-command-failures)
3. [File System Errors](#file-system-errors)
4. [Coverage Validation Errors](#coverage-validation-errors)
5. [JSON Validation Errors](#json-validation-errors)
6. [Deployment Errors](#deployment-errors)
7. [Error Recovery](#error-recovery)

## Basic Error Handling

### Pattern: Stop on First Error
```bash
@test "test with error handling" {
    # Set strict mode
    set -euo pipefail
    
    # Command will fail the test if it exits non-zero
    npm run build
}
```

### Pattern: Capture Error Output
```bash
@test "capture error messages" {
    # Capture both stdout and stderr
    run npm run build
    
    # Check status code
    [[ "$status" -ne 0 ]] || skip "Expected command to fail"
    
    # Check error output
    [[ "$output" == *"error"* ]]
}
```

### Pattern: Provide Helpful Error Messages
```bash
@test "descriptive error handling" {
    local required_file="package.json"
    
    if [[ ! -f "$required_file" ]]; then
        echo "ERROR: Required file not found: $required_file" >&2
        echo "Make sure package.json exists in project root" >&2
        return 1
    fi
    
    npm run build
}
```

## npm Command Failures

### Pattern: Handle npm Install Failures
```bash
@test "npm install with error handling" {
    if ! npm install --no-fund --no-audit 2>&1 | tee install.log; then
        echo "npm install failed:" >&2
        tail -n 20 install.log >&2
        return 1
    fi
}
```

### Pattern: npm Script Not Found
```bash
@test "npm script availability check" {
    # Verify script exists before running
    if ! npm run 2>&1 | grep -q "build"; then
        skip "build script not found in package.json"
    fi
    
    npm run build
}
```

### Pattern: Handle npm Permission Errors
```bash
@test "npm permission error handling" {
    # Check if npm cache is accessible
    if ! npm cache verify > /dev/null 2>&1; then
        skip "npm cache not accessible - permission issue"
    fi
    
    npm install
}
```

### Pattern: Retry on Network Failures
```bash
@test "npm install with retry logic" {
    local max_attempts=3
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if npm install --prefer-offline 2>&1 | tee install-attempt-$attempt.log; then
            return 0
        fi
        
        echo "Attempt $attempt failed, retrying..." >&2
        ((attempt++))
        sleep 2
    done
    
    echo "npm install failed after $max_attempts attempts" >&2
    return 1
}
```

## File System Errors

### Pattern: Validate Required Paths
```bash
@test "validate required directories" {
    local -a required_dirs=("src" "build" "scripts")
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            echo "ERROR: Required directory missing: $dir" >&2
            return 1
        fi
    done
}
```

### Pattern: Safe Directory Creation
```bash
@test "create directories safely" {
    local target_dir="dist"
    
    # Create with proper error handling
    if ! mkdir -p "$target_dir" 2>/dev/null; then
        echo "ERROR: Failed to create directory: $target_dir" >&2
        return 1
    fi
    
    [[ -d "$target_dir" ]]
}
```

### Pattern: Handle File Permissions
```bash
@test "validate file permissions" {
    local script="scripts/deploy.sh"
    
    if [[ -f "$script" ]]; then
        if [[ ! -x "$script" ]]; then
            echo "ERROR: Script not executable: $script" >&2
            echo "Run: chmod +x $script" >&2
            return 1
        fi
    fi
}
```

### Pattern: Safe File Operations
```bash
@test "safe file copy with error handling" {
    local source="build/output"
    local dest="dist/"
    
    if [[ ! -e "$source" ]]; then
        echo "ERROR: Source file not found: $source" >&2
        return 1
    fi
    
    if ! cp -r "$source" "$dest" 2>/dev/null; then
        echo "ERROR: Failed to copy $source to $dest" >&2
        return 1
    fi
}
```

## Coverage Validation Errors

### Pattern: Handle Missing Coverage File
```bash
@test "coverage file validation" {
    local coverage_file="coverage/coverage-summary.json"
    
    if [[ ! -f "$coverage_file" ]]; then
        echo "ERROR: Coverage file not generated: $coverage_file" >&2
        echo "Make sure 'npm run test:coverage' was executed" >&2
        return 1
    fi
}
```

### Pattern: Coverage Below Threshold
```bash
@test "coverage threshold enforcement" {
    local coverage_file="coverage/coverage-summary.json"
    local threshold=100
    
    # Parse coverage percentage
    local coverage
    coverage=$(jq '.total.lines.pct' "$coverage_file" 2>/dev/null) || {
        echo "ERROR: Failed to parse coverage file" >&2
        return 1
    }
    
    if (( $(echo "$coverage < $threshold" | bc -l) )); then
        echo "FAIL: Line coverage is ${coverage}% (threshold: ${threshold}%)" >&2
        echo "See coverage report: coverage/lcov-report/index.html" >&2
        return 1
    fi
}
```

### Pattern: Handle Invalid Coverage JSON
```bash
@test "validate coverage JSON structure" {
    local coverage_file="coverage/coverage-summary.json"
    
    # Validate JSON syntax
    if ! jq . "$coverage_file" > /dev/null 2>&1; then
        echo "ERROR: Coverage file is not valid JSON: $coverage_file" >&2
        return 1
    fi
    
    # Validate required fields
    if ! jq -e '.total.lines and .total.statements' "$coverage_file" > /dev/null; then
        echo "ERROR: Coverage file missing required metrics" >&2
        return 1
    fi
}
```

## JSON Validation Errors

### Pattern: Handle Invalid theme.json
```bash
@test "validate theme.json with detailed errors" {
    local theme_file="src/theme.json"
    
    if [[ ! -f "$theme_file" ]]; then
        echo "ERROR: theme.json not found: $theme_file" >&2
        return 1
    fi
    
    # Validate JSON syntax with error details
    if ! jq . "$theme_file" 2>&1; then
        echo "ERROR: theme.json contains invalid JSON" >&2
        echo "Check the file: $theme_file" >&2
        return 1
    fi
}
```

### Pattern: Validate Required theme.json Fields
```bash
@test "theme.json required fields validation" {
    local theme_file="src/theme.json"
    
    # Check each required field
    local missing_fields=()
    
    if ! jq -e '.version' "$theme_file" > /dev/null; then
        missing_fields+=("version")
    fi
    
    if ! jq -e '.settings' "$theme_file" > /dev/null; then
        missing_fields+=("settings")
    fi
    
    if [[ ${#missing_fields[@]} -gt 0 ]]; then
        echo "ERROR: theme.json missing required fields:" >&2
        printf '%s\n' "${missing_fields[@]}" >&2
        return 1
    fi
}
```

### Pattern: Handle package.json Parse Errors
```bash
@test "validate package.json structure" {
    local package_file="package.json"
    
    # Comprehensive validation
    if ! jq -e '.name and .version and .scripts' "$package_file" > /dev/null 2>&1; then
        echo "ERROR: package.json structure is invalid" >&2
        echo "Required fields: name, version, scripts" >&2
        return 1
    fi
    
    # Check specific script
    if ! jq -e '.scripts.build' "$package_file" > /dev/null; then
        echo "ERROR: build script not found in package.json" >&2
        return 1
    fi
}
```

## Deployment Errors

### Pattern: Deployment Artifact Validation
```bash
@test "validate deployment artifacts" {
    local dist_dir="dist"
    local required_files=("package.json" "MANIFEST.json")
    
    if [[ ! -d "$dist_dir" ]]; then
        echo "ERROR: Distribution directory not found: $dist_dir" >&2
        echo "Run 'npm run deploy' to create artifacts" >&2
        return 1
    fi
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$dist_dir/$file" ]]; then
            echo "ERROR: Missing deployment artifact: $dist_dir/$file" >&2
            return 1
        fi
    done
}
```

### Pattern: Manifest Validation Errors
```bash
@test "validate deployment manifest" {
    local manifest="dist/MANIFEST.json"
    
    if [[ ! -f "$manifest" ]]; then
        echo "ERROR: Deployment manifest not found: $manifest" >&2
        return 1
    fi
    
    # Validate manifest structure
    if ! jq -e '.version and .timestamp and .artifacts' "$manifest" > /dev/null 2>&1; then
        echo "ERROR: Manifest has invalid structure" >&2
        echo "Required fields: version, timestamp, artifacts" >&2
        return 1
    fi
    
    # Validate artifact list is not empty
    local artifact_count
    artifact_count=$(jq '.artifacts | length' "$manifest")
    
    if [[ $artifact_count -eq 0 ]]; then
        echo "ERROR: No artifacts listed in manifest" >&2
        return 1
    fi
}
```

### Pattern: Checksum Verification Errors
```bash
@test "verify artifact checksums" {
    local dist_dir="dist"
    local checksum_file="$dist_dir/CHECKSUMS.txt"
    
    if [[ ! -f "$checksum_file" ]]; then
        echo "ERROR: Checksum file not found: $checksum_file" >&2
        return 1
    fi
    
    cd "$dist_dir" || {
        echo "ERROR: Failed to change to $dist_dir" >&2
        return 1
    }
    
    if ! sha256sum -c CHECKSUMS.txt > /dev/null 2>&1; then
        echo "ERROR: Checksum verification failed" >&2
        echo "Artifacts may have been corrupted" >&2
        cd - > /dev/null || return 1
        return 1
    fi
    
    cd - > /dev/null || return 1
}
```

## Error Recovery

### Pattern: Automatic Cleanup
```bash
@test "test with automatic cleanup" {
    local temp_dir=$(mktemp -d)
    
    # Ensure cleanup happens even on error
    trap "rm -rf '$temp_dir'" EXIT
    
    cd "$temp_dir" || return 1
    
    # Run test
    npm install || return 1
    npm run build || return 1
}
```

### Pattern: Graceful Degradation
```bash
@test "test with graceful degradation" {
    # Attempt to run build
    if npm run build > /dev/null 2>&1; then
        echo "Build succeeded"
    else
        echo "Build failed, checking for partial artifacts" >&2
        
        # Use partial artifacts if available
        if [[ -d "build" ]]; then
            echo "Partial build artifacts found, continuing" >&2
        else
            echo "ERROR: No build artifacts found" >&2
            return 1
        fi
    fi
}
```

### Pattern: Logging for Debugging
```bash
@test "comprehensive error logging" {
    local log_file=".test-debug.log"
    
    # Redirect all output to log
    exec 3>&1 4>&2
    exec 1>> "$log_file" 2>&1
    
    {
        echo "=== Test Start: $(date) ==="
        echo "Node version: $(node --version)"
        echo "npm version: $(npm --version)"
        echo "Working directory: $(pwd)"
        echo ""
        
        # Run commands with full logging
        npm install
        npm run build
        npm run test:coverage
        
        echo ""
        echo "=== Test End: $(date) ==="
    } || {
        local exit_code=$?
        
        # Restore output
        exec 1>&3 2>&4
        
        echo "Test failed with exit code $exit_code" >&2
        echo "Debug log: $log_file" >&2
        tail -n 50 "$log_file" >&2
        
        return $exit_code
    }
    
    # Restore output
    exec 1>&3 2>&4
}
```

### Pattern: Stack Trace Capture
```bash
@test "capture full error context" {
    set -o errtrace
    
    # Error handler
    on_error() {
        local line=$1
        echo "ERROR at line $line" >&2
        echo "Call stack:" >&2
        local frame=0
        while caller $frame >&2; do
            ((frame++))
        done
        return 1
    }
    
    trap 'on_error $LINENO' ERR
    
    # Run commands
    npm run build
}
```

## Testing Error Handling

### Pattern: Test Error Scenarios
```bash
@test "test error scenario: missing package.json" {
    local temp_dir=$(mktemp -d)
    trap "rm -rf '$temp_dir'" EXIT
    
    cd "$temp_dir" || return 1
    
    # Verify npm fails without package.json
    run npm install
    [[ "$status" -ne 0 ]]
    [[ "$output" == *"package.json"* ]]
}
```

### Pattern: Test Recovery
```bash
@test "test recovery from error" {
    # Create initial failure scenario
    rm -f src/theme.json
    
    # Verify failure
    run npm run build
    [[ "$status" -ne 0 ]]
    
    # Recover
    mkdir -p src
    cat > src/theme.json <<'EOF'
{"version": 2, "settings": {}, "styles": {}}
EOF
    
    # Verify recovery
    run npm run build
    [[ "$status" -eq 0 ]]
}
```

## Summary Table

| Error Type | Pattern | Command |
|-----------|---------|---------|
| npm install fails | Retry logic | `npm install --prefer-offline` |
| Coverage below threshold | Parse and compare | `jq '.total.lines.pct'` |
| Invalid JSON | Validate syntax | `jq . file.json` |
| Missing files | Check existence | `[[ -f file ]]` |
| Permission denied | Check permissions | `[[ -x script ]]` |
| Deployment artifact missing | Validate artifacts | `[[ -d dist ]]` |
| Checksum mismatch | Verify checksums | `sha256sum -c` |

## Best Practices

1. **Always provide context** - Include file paths and expected values in errors
2. **Use standard error stream** - Redirect errors to `>&2`
3. **Log for debugging** - Capture full command output in logs
4. **Fail fast** - Use `set -euo pipefail` at the start
5. **Clean up properly** - Use `trap` to ensure cleanup on error
6. **Test error paths** - Write tests for error scenarios
7. **Document expected errors** - Add comments explaining error handling
8. **Use skip for unsupported environments** - Skip tests that can't run
9. **Report actionable errors** - Tell users how to fix the issue
10. **Monitor test health** - Track error patterns over time
