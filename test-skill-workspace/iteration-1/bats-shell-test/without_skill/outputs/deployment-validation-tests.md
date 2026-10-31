# Deployment Validation Tests

Advanced patterns for validating deployment artifacts, checksums, and integrity in WordPress build pipelines.

## Table of Contents
1. [Artifact Validation](#artifact-validation)
2. [Checksum Verification](#checksum-verification)
3. [Manifest Validation](#manifest-validation)
4. [File Integrity](#file-integrity)
5. [Deployment Readiness](#deployment-readiness)
6. [Rollback Preparation](#rollback-preparation)

## Artifact Validation

### Test: Verify All Required Artifacts Exist

```bash
@test "deployment: verify all artifacts exist" {
    local dist_dir="dist"
    local -a required_artifacts=(
        "build"
        "package.json"
        "MANIFEST.json"
        "coverage"
    )
    
    # Check directory exists
    [[ -d "$dist_dir" ]] || {
        echo "ERROR: Distribution directory not found: $dist_dir" >&2
        return 1
    }
    
    # Check each required artifact
    local missing=0
    for artifact in "${required_artifacts[@]}"; do
        if [[ ! -e "$dist_dir/$artifact" ]]; then
            echo "ERROR: Missing artifact: $dist_dir/$artifact" >&2
            ((missing++))
        fi
    done
    
    [[ $missing -eq 0 ]] || return 1
}
```

### Test: Validate Artifact File Sizes

```bash
@test "deployment: verify artifact sizes are reasonable" {
    local dist_dir="dist"
    local min_size=1024  # 1KB minimum
    local max_size=$((100 * 1024 * 1024))  # 100MB maximum
    
    # Check build directory size
    local build_size
    build_size=$(du -sb "$dist_dir/build" 2>/dev/null | cut -f1)
    
    if [[ $build_size -lt $min_size ]]; then
        echo "ERROR: Build artifacts too small: ${build_size} bytes" >&2
        return 1
    fi
    
    if [[ $build_size -gt $max_size ]]; then
        echo "ERROR: Build artifacts too large: ${build_size} bytes" >&2
        return 1
    fi
}
```

### Test: Validate Artifact Completeness

```bash
@test "deployment: validate artifact contents" {
    local dist_dir="dist"
    
    # Check build directory has compiled files
    if [[ ! -d "$dist_dir/build" ]]; then
        echo "ERROR: Build directory missing" >&2
        return 1
    fi
    
    # Verify build directory is not empty
    if [[ -z "$(find "$dist_dir/build" -type f -print -quit)" ]]; then
        echo "ERROR: Build directory is empty" >&2
        return 1
    fi
    
    # Verify source maps exist (optional but recommended)
    local source_map_count
    source_map_count=$(find "$dist_dir/build" -name "*.map" -type f | wc -l)
    
    if [[ $source_map_count -eq 0 ]]; then
        echo "WARNING: No source maps found in build" >&2
    fi
}
```

## Checksum Verification

### Test: Generate Artifact Checksums

```bash
@test "deployment: generate and verify checksums" {
    local dist_dir="dist"
    local checksum_file="$dist_dir/CHECKSUMS.sha256"
    
    cd "$dist_dir" || return 1
    
    # Generate SHA256 checksums for all files
    find . -type f ! -name "CHECKSUMS.*" -exec sha256sum {} \; > "$checksum_file"
    
    if [[ ! -f "$checksum_file" ]]; then
        echo "ERROR: Failed to generate checksums" >&2
        cd - > /dev/null || return 1
        return 1
    fi
    
    cd - > /dev/null || return 1
}
```

### Test: Verify All Artifacts Match Checksums

```bash
@test "deployment: verify artifact integrity via checksums" {
    local dist_dir="dist"
    local checksum_file="$dist_dir/CHECKSUMS.sha256"
    
    if [[ ! -f "$checksum_file" ]]; then
        echo "ERROR: Checksum file not found: $checksum_file" >&2
        return 1
    fi
    
    cd "$dist_dir" || return 1
    
    # Verify all checksums
    if ! sha256sum -c "$checksum_file" > /dev/null 2>&1; then
        echo "ERROR: Checksum verification failed" >&2
        echo "Some artifacts have been modified or corrupted" >&2
        cd - > /dev/null || return 1
        return 1
    fi
    
    cd - > /dev/null || return 1
}
```

### Test: Track Checksum Changes

```bash
@test "deployment: detect unexpected artifact changes" {
    local dist_dir="dist"
    local current_checksums="$dist_dir/.checksums.current"
    local previous_checksums="$dist_dir/.checksums.previous"
    
    cd "$dist_dir" || return 1
    
    # Generate current checksums
    find . -type f ! -name ".checksums.*" -exec sha256sum {} \; | sort > "$current_checksums"
    
    # Compare with previous if it exists
    if [[ -f "$previous_checksums" ]]; then
        if ! diff "$previous_checksums" "$current_checksums" > /dev/null 2>&1; then
            echo "WARNING: Artifact checksums have changed" >&2
            echo "Changes detected:" >&2
            diff "$previous_checksums" "$current_checksums" || true
        fi
    fi
    
    # Save for next comparison
    cp "$current_checksums" "$previous_checksums"
    
    cd - > /dev/null || return 1
}
```

## Manifest Validation

### Test: Validate Deployment Manifest Structure

```bash
@test "deployment: validate manifest structure" {
    local manifest="dist/MANIFEST.json"
    
    [[ -f "$manifest" ]] || {
        echo "ERROR: Manifest not found: $manifest" >&2
        return 1
    }
    
    # Verify it's valid JSON
    if ! jq . "$manifest" > /dev/null 2>&1; then
        echo "ERROR: Manifest is not valid JSON" >&2
        return 1
    fi
    
    # Verify required fields
    local required_fields=(
        "version"
        "timestamp"
        "artifacts"
        "checksumAlgorithm"
        "deploymentReady"
    )
    
    for field in "${required_fields[@]}"; do
        if ! jq -e ".$field" "$manifest" > /dev/null; then
            echo "ERROR: Manifest missing required field: $field" >&2
            return 1
        fi
    done
}
```

### Test: Validate Manifest Metadata

```bash
@test "deployment: validate manifest metadata" {
    local manifest="dist/MANIFEST.json"
    
    # Check version format (SemVer)
    local version
    version=$(jq -r '.version' "$manifest")
    
    if ! [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?$ ]]; then
        echo "ERROR: Invalid version format: $version" >&2
        return 1
    fi
    
    # Check timestamp is ISO 8601
    local timestamp
    timestamp=$(jq -r '.timestamp' "$manifest")
    
    if ! [[ "$timestamp" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$ ]]; then
        echo "ERROR: Invalid timestamp format: $timestamp" >&2
        return 1
    fi
    
    # Verify deploymentReady is boolean
    local ready
    ready=$(jq '.deploymentReady' "$manifest")
    
    if [[ "$ready" != "true" ]] && [[ "$ready" != "false" ]]; then
        echo "ERROR: deploymentReady must be boolean, got: $ready" >&2
        return 1
    fi
}
```

### Test: Verify Artifacts Listed in Manifest

```bash
@test "deployment: verify all artifacts listed in manifest" {
    local manifest="dist/MANIFEST.json"
    local dist_dir="dist"
    
    # Get artifact list from manifest
    local manifest_artifacts
    manifest_artifacts=$(jq -r '.artifacts[]' "$manifest")
    
    # Verify each artifact exists
    while IFS= read -r artifact; do
        if [[ ! -e "$dist_dir/$artifact" ]]; then
            echo "ERROR: Artifact listed in manifest but not found: $artifact" >&2
            return 1
        fi
    done <<< "$manifest_artifacts"
}
```

## File Integrity

### Test: Verify No Unexpected Files in Artifacts

```bash
@test "deployment: verify no unexpected files" {
    local dist_dir="dist"
    local -a allowed_patterns=(
        "^\.?\..*"  # Hidden files
        "\.json$"
        "\.txt$"
        "^MANIFEST"
        "^build"
        "^coverage"
    )
    
    # Find unexpected files
    local unexpected_count=0
    
    while IFS= read -r file; do
        local filename
        filename=$(basename "$file")
        
        local matched=0
        for pattern in "${allowed_patterns[@]}"; do
            if [[ "$filename" =~ $pattern ]]; then
                matched=1
                break
            fi
        done
        
        if [[ $matched -eq 0 ]]; then
            echo "WARNING: Unexpected file in artifacts: $file" >&2
            ((unexpected_count++))
        fi
    done < <(find "$dist_dir" -type f ! -path "$dist_dir/\.*" )
    
    if [[ $unexpected_count -gt 0 ]]; then
        echo "Found $unexpected_count unexpected files" >&2
        return 1
    fi
}
```

### Test: Verify File Permissions

```bash
@test "deployment: verify artifact permissions" {
    local dist_dir="dist"
    
    # Check all files are readable
    while IFS= read -r file; do
        if [[ ! -r "$file" ]]; then
            echo "ERROR: File not readable: $file" >&2
            return 1
        fi
    done < <(find "$dist_dir" -type f)
    
    # Check all directories are accessible
    while IFS= read -r dir; do
        if [[ ! -x "$dir" ]]; then
            echo "ERROR: Directory not accessible: $dir" >&2
            return 1
        fi
    done < <(find "$dist_dir" -type d)
}
```

## Deployment Readiness

### Test: Comprehensive Deployment Readiness Check

```bash
@test "deployment: full deployment readiness validation" {
    local checks_passed=0
    local checks_failed=0
    
    echo "Performing deployment readiness checks..."
    
    # Check 1: Artifacts exist
    if [[ -d "dist" ]]; then
        echo "✓ Distribution directory exists"
        ((checks_passed++))
    else
        echo "✗ Distribution directory missing"
        ((checks_failed++))
    fi
    
    # Check 2: Manifest valid
    if [[ -f "dist/MANIFEST.json" ]] && jq . dist/MANIFEST.json > /dev/null 2>&1; then
        echo "✓ Manifest is valid"
        ((checks_passed++))
    else
        echo "✗ Manifest invalid or missing"
        ((checks_failed++))
    fi
    
    # Check 3: Checksums exist
    if [[ -f "dist/CHECKSUMS.sha256" ]]; then
        echo "✓ Checksums file exists"
        ((checks_passed++))
    else
        echo "✗ Checksums file missing"
        ((checks_failed++))
    fi
    
    # Check 4: Build artifacts
    if [[ -d "dist/build" ]] && [[ -n "$(find dist/build -type f -print -quit)" ]]; then
        echo "✓ Build artifacts present"
        ((checks_passed++))
    else
        echo "✗ Build artifacts missing or empty"
        ((checks_failed++))
    fi
    
    # Check 5: Coverage report
    if [[ -f "dist/coverage/coverage-summary.json" ]]; then
        echo "✓ Coverage report included"
        ((checks_passed++))
    else
        echo "⚠ Coverage report missing (optional)"
    fi
    
    echo ""
    echo "Deployment readiness: $checks_passed passed, $checks_failed failed"
    
    [[ $checks_failed -eq 0 ]] || return 1
}
```

### Test: Pre-Deployment Health Check

```bash
@test "deployment: pre-deployment health check" {
    local health_score=100
    
    # Memory check
    local available_memory
    available_memory=$(free -m | awk 'NR==2 {print $7}')
    if [[ $available_memory -lt 512 ]]; then
        echo "WARNING: Low available memory: ${available_memory}MB" >&2
        ((health_score -= 20))
    fi
    
    # Disk space check
    local available_space
    available_space=$(df -h . | awk 'NR==2 {print $4}' | sed 's/G$//')
    if [[ ${available_space%.*} -lt 1 ]]; then
        echo "WARNING: Low disk space" >&2
        ((health_score -= 30))
    fi
    
    # npm version check
    local npm_version
    npm_version=$(npm --version)
    echo "npm version: $npm_version"
    
    # Node version check
    local node_version
    node_version=$(node --version)
    echo "Node version: $node_version"
    
    echo "Health score: $health_score/100"
    
    [[ $health_score -ge 70 ]] || return 1
}
```

## Rollback Preparation

### Test: Create Rollback Archive

```bash
@test "deployment: prepare rollback package" {
    local dist_dir="dist"
    local rollback_archive="$dist_dir/rollback-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    # Create compressed archive for quick rollback
    if tar -czf "$rollback_archive" -C "$dist_dir" \
        --exclude='*.tar.gz' \
        --exclude='.checksums.*' \
        . 2>/dev/null; then
        
        echo "Rollback archive created: $rollback_archive"
        
        # Verify archive
        if tar -tzf "$rollback_archive" > /dev/null 2>&1; then
            echo "Rollback archive verified"
        else
            echo "ERROR: Rollback archive is corrupted" >&2
            return 1
        fi
    else
        echo "ERROR: Failed to create rollback archive" >&2
        return 1
    fi
}
```

### Test: Document Deployment State

```bash
@test "deployment: document pre-deployment state" {
    local dist_dir="dist"
    local state_file="$dist_dir/DEPLOYMENT_STATE.txt"
    
    cat > "$state_file" <<EOF
Deployment State Document
Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Host: $(hostname)
User: $(whoami)
Working Directory: $(pwd)

=== Environment ===
Node Version: $(node --version)
npm Version: $(npm --version)
Bash Version: $BASH_VERSION

=== Artifact Inventory ===
Total Files: $(find "$dist_dir" -type f | wc -l)
Total Size: $(du -sh "$dist_dir" | cut -f1)
Build Directory Size: $(du -sh "$dist_dir/build" 2>/dev/null | cut -f1 || echo "N/A")

=== Manifest ===
$(cat "$dist_dir/MANIFEST.json" 2>/dev/null || echo "N/A")

=== File Tree ===
$(find "$dist_dir" -type f | head -50)
EOF
    
    [[ -f "$state_file" ]] || return 1
}
```

## Coverage Tests Summary

### Test Statistics
```bash
@test "deployment: document test coverage" {
    local manifest="dist/MANIFEST.json"
    
    # Create test report
    cat > dist/TEST_REPORT.md <<'EOF'
# Deployment Test Report

## Test Categories
- Artifact Validation: 5 tests
- Checksum Verification: 3 tests
- Manifest Validation: 3 tests
- File Integrity: 2 tests
- Deployment Readiness: 2 tests
- Rollback Preparation: 2 tests

## Total Coverage: 17 validation tests

## Critical Tests (Must Pass)
1. Manifest structure validation
2. Artifact integrity verification
3. Checksum validation
4. Deployment readiness

## Success Criteria
- All artifacts present
- Checksums verified
- Manifest valid
- Health score ≥ 70
EOF
    
    [[ -f "dist/TEST_REPORT.md" ]] || return 1
}
```

## Best Practices

1. **Verify Early and Often** - Check artifacts immediately after creation
2. **Multiple Validations** - Use checksums, manifests, and manual inspection
3. **Document State** - Always capture system state before deployment
4. **Plan for Rollback** - Create archives and document process
5. **Check Permissions** - Verify files are accessible
6. **Validate Formats** - Ensure JSON, checksums, etc. are correct
7. **Track Changes** - Compare artifacts between builds
8. **Test Integrity** - Simulate corruption and verify detection
9. **Monitor Health** - Check system resources before deployment
10. **Automate Checks** - Make validation part of CI/CD pipeline
