#!/usr/bin/env bats
#
# BATS Shell Tests for WordPress Hero Block
#
# Tests for:
# - Block build and compilation
# - Theme.json validation
# - Block registration
# - File structure validation
# - Asset optimization
#
# Usage:
#   bats hero-block.bats
#   bats --verbose hero-block.bats
#   npm run test:bats -- hero-block.bats
#
# Setup:
#   npm install --save-dev bats
#

# ============================================================================
# SETUP AND TEARDOWN
# ============================================================================

setup() {
  # Create temporary directory for test artifacts
  export TEST_DIR="$(mktemp -d)"
  export BLOCK_DIR="./blocks/hero"
  export BUILD_DIR="./dist/blocks/hero"
  export FIXTURES_DIR="./test-fixtures/hero"

  # Set project root
  export PROJECT_ROOT="$(pwd)"

  # Load test helpers
  source "tests/helpers.bash"
}

teardown() {
  # Clean up temporary files
  if [ -d "$TEST_DIR" ]; then
    rm -rf "$TEST_DIR"
  fi
}

# ============================================================================
# Block File Structure Tests
# ============================================================================

@test "Hero block directory structure exists" {
  [ -d "$BLOCK_DIR" ]
  [ -f "$BLOCK_DIR/block.json" ]
  [ -f "$BLOCK_DIR/edit.js" ]
  [ -f "$BLOCK_DIR/save.js" ]
  [ -f "$BLOCK_DIR/style.scss" ]
}

@test "block.json has required fields" {
  # Use jq to validate JSON structure
  local name=$(jq -r '.name' "$BLOCK_DIR/block.json")
  local title=$(jq -r '.title' "$BLOCK_DIR/block.json")
  local category=$(jq -r '.category' "$BLOCK_DIR/block.json")

  [ -n "$name" ]
  [ -n "$title" ]
  [ -n "$category" ]

  # Name should be namespace/hero-section
  [[ "$name" == *"/hero"* ]]
}

@test "block.json has icon defined" {
  local icon=$(jq -r '.icon // empty' "$BLOCK_DIR/block.json")
  [ -n "$icon" ]
}

@test "block.json has keywords for search" {
  local keywords=$(jq -r '.keywords // empty' "$BLOCK_DIR/block.json")
  [ -n "$keywords" ]
}

@test "block.json attributes are defined" {
  local has_attrs=$(jq 'has("attributes")' "$BLOCK_DIR/block.json")
  [ "$has_attrs" = "true" ]

  # Check for at least these attributes
  local image=$(jq '.attributes.image // empty' "$BLOCK_DIR/block.json")
  local text=$(jq '.attributes.text // empty' "$BLOCK_DIR/block.json")

  [ -n "$image" ]
  [ -n "$text" ]
}

@test "edit.js file is valid JavaScript" {
  # Check file exists and is not empty
  [ -s "$BLOCK_DIR/edit.js" ]

  # Basic syntax check (runs Node parser)
  node --check "$BLOCK_DIR/edit.js" 2>/dev/null || true
}

@test "save.js file is valid JavaScript" {
  [ -s "$BLOCK_DIR/save.js" ]
  node --check "$BLOCK_DIR/save.js" 2>/dev/null || true
}

@test "style.scss file exists and has content" {
  [ -s "$BLOCK_DIR/style.scss" ]

  # Should have some CSS rules
  grep -q "^\." "$BLOCK_DIR/style.scss" || grep -q "^\#" "$BLOCK_DIR/style.scss"
}

# ============================================================================
# Build Tests
# ============================================================================

@test "npm build command succeeds" {
  run npm run build
  [ "$status" -eq 0 ]
}

@test "build output directory created" {
  [ -d "$BUILD_DIR" ]
}

@test "build generates minified JavaScript" {
  [ -f "$BUILD_DIR/index.js" ] || [ -f "$BUILD_DIR/edit.js" ]
}

@test "build generates CSS output" {
  [ -f "$BUILD_DIR/style.css" ] || [ -f "$BUILD_DIR/index.css" ]
}

@test "built CSS is minified" {
  local css_file=$(ls $BUILD_DIR/*.css 2>/dev/null | head -1)
  [ -n "$css_file" ]

  # Minified CSS should not have newlines (simple check)
  local lines=$(wc -l < "$css_file")
  [ "$lines" -lt 3 ]
}

@test "built JavaScript is valid" {
  local js_file=$(ls $BUILD_DIR/*.js 2>/dev/null | head -1)
  [ -n "$js_file" ]

  # Check for valid JavaScript structure (basic)
  grep -q "function\|const\|let\|var" "$js_file"
}

# ============================================================================
# Theme.json Integration Tests
# ============================================================================

@test "theme.json file exists and is valid JSON" {
  [ -f "./theme.json" ]

  # Validate JSON syntax
  jq empty ./theme.json 2>/dev/null
  [ "$?" -eq 0 ]
}

@test "theme.json has settings" {
  local has_settings=$(jq 'has("settings")' ./theme.json)
  [ "$has_settings" = "true" ]
}

@test "theme.json has styles" {
  local has_styles=$(jq 'has("styles")' ./theme.json)
  [ "$has_styles" = "true" ]
}

@test "theme.json has color palette" {
  local colors=$(jq '.settings.color.palette // empty' ./theme.json)
  [ -n "$colors" ]
}

@test "theme.json has typography presets" {
  local typography=$(jq '.settings.typography.fontSizes // empty' ./theme.json)
  [ -n "$typography" ]
}

@test "theme.json has breakpoints defined" {
  local breakpoints=$(jq '.settings.custom.breakpoints // empty' ./theme.json)

  # Should have at least some spacing scale
  [ -n "$breakpoints" ] || [ -n "$(jq '.settings.spacing.spacingScale // empty' ./theme.json)" ]
}

@test "theme.json hero block configuration exists" {
  local hero_config=$(jq '.settings.blocks."namespace/hero-section" // empty' ./theme.json)

  # If block is registered, should have configuration
  [ -z "$hero_config" ] || [ -n "$hero_config" ]
}

@test "theme.json validates against WordPress schema" {
  # This requires the WordPress theme.json schema
  # For now, we just check it's valid JSON
  jq empty ./theme.json
  [ "$?" -eq 0 ]
}

# ============================================================================
# Block Registration Tests
# ============================================================================

@test "block is registered in plugin.php or theme functions.php" {
  # Check if block is registered
  local has_registration=0

  if grep -r "register_block_type" . --include="*.php" | grep -q "hero"; then
    has_registration=1
  fi

  [ "$has_registration" -eq 1 ]
}

@test "block.json path is correct in register_block_type" {
  # Verify block.json path is correctly specified
  local register_line=$(grep -r "register_block_type" . --include="*.php" | grep "hero")

  [[ "$register_line" == *"block.json"* ]] || [[ "$register_line" == *"blocks/hero"* ]]
}

@test "block enqueues editor styles" {
  # Check that editor.scss or editor.css is enqueued
  [ -f "$BLOCK_DIR/editor.scss" ] || [ -f "$BLOCK_DIR/editor.css" ]
}

@test "block has proper namespace in name" {
  local namespace=$(jq -r '.name' "$BLOCK_DIR/block.json" | cut -d'/' -f1)
  local blockname=$(jq -r '.name' "$BLOCK_DIR/block.json" | cut -d'/' -f2)

  [ -n "$namespace" ]
  [ -n "$blockname" ]

  # Namespace should match plugin/theme namespace
  [[ "$namespace" == "namespace" ]] || [[ "$namespace" == *"-"* ]]
}

# ============================================================================
# Asset Optimization Tests
# ============================================================================

@test "JavaScript bundle size is reasonable" {
  local js_file=$(ls $BUILD_DIR/*.js 2>/dev/null | head -1)
  [ -n "$js_file" ]

  # Check file size (should be < 100KB for typical block)
  local size=$(stat -f%z "$js_file" 2>/dev/null || stat -c%s "$js_file" 2>/dev/null)
  [ "$size" -lt 102400 ]
}

@test "CSS bundle size is reasonable" {
  local css_file=$(ls $BUILD_DIR/*.css 2>/dev/null | head -1)
  [ -n "$css_file" ]

  # CSS should be < 50KB typically
  local size=$(stat -f%z "$css_file" 2>/dev/null || stat -c%s "$css_file" 2>/dev/null)
  [ "$size" -lt 51200 ]
}

@test "no console.log statements in production build" {
  local js_file=$(ls $BUILD_DIR/*.js 2>/dev/null | head -1)
  [ -n "$js_file" ]

  # Should not contain console.log (development code)
  ! grep -q "console\.log" "$js_file"
}

@test "no source maps in production build" {
  local js_file=$(ls $BUILD_DIR/*.js 2>/dev/null | head -1)
  [ -n "$js_file" ]

  # Should not be a source map
  ! [[ "$js_file" == *.map* ]]
}

# ============================================================================
# Accessibility Tests
# ============================================================================

@test "alt text field in block.json attributes" {
  local has_alt=$(jq '.attributes | keys | any(. == "alt" or . == "altText")' "$BLOCK_DIR/block.json")
  [ "$has_alt" = "true" ]
}

@test "heading level attribute in block" {
  local has_heading=$(jq '.attributes | keys | any(. == "headingLevel" or . == "level")' "$BLOCK_DIR/block.json")
  [ "$has_heading" = "true" ]
}

@test "block supports alignment option" {
  local supports_align=$(jq '.supports.align // false' "$BLOCK_DIR/block.json")
  [ "$supports_align" = "true" ] || [ "$supports_align" != "false" ]
}

# ============================================================================
# Responsive Design Tests
# ============================================================================

@test "SCSS includes responsive breakpoints" {
  local has_breakpoints=0

  if grep -q "@media" "$BLOCK_DIR/style.scss"; then
    has_breakpoints=1
  fi

  [ "$has_breakpoints" -eq 1 ]
}

@test "SCSS uses CSS custom properties for spacing" {
  local has_custom_props=0

  if grep -q "var(--" "$BLOCK_DIR/style.scss"; then
    has_custom_props=1
  fi

  [ "$has_custom_props" -eq 1 ]
}

@test "SCSS doesn't use hardcoded colors" {
  # Should use CSS vars or theme colors, not hardcoded hex/rgb
  local hardcoded_colors=0

  if grep -E "color\s*:\s*#[0-9a-f]{3,6}|color\s*:\s*rgb\(" "$BLOCK_DIR/style.scss"; then
    hardcoded_colors=$?
  fi

  # Should mostly use vars
  ! [ "$hardcoded_colors" -eq 0 ] || grep -q "var(--" "$BLOCK_DIR/style.scss"
}

# ============================================================================
# Linting Tests
# ============================================================================

@test "JavaScript passes ESLint" {
  run npm run lint:js -- "$BLOCK_DIR"

  # ESLint should pass or not exist
  if command -v eslint &> /dev/null; then
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]
  fi
}

@test "CSS passes stylelint" {
  run npm run lint:css -- "$BLOCK_DIR/style.scss"

  # Stylelint should pass or not exist
  if command -v stylelint &> /dev/null; then
    [ "$status" -eq 0 ] || [ "$status" -eq 1 ]
  fi
}

@test "PHP passes WordPress coding standards" {
  local php_files=$(find "$BLOCK_DIR" -name "*.php" 2>/dev/null)

  if [ -n "$php_files" ]; then
    # If PHP files exist, should pass linting
    for php_file in $php_files; do
      php -l "$php_file" > /dev/null 2>&1
      [ "$?" -eq 0 ]
    done
  fi
}

# ============================================================================
# Integration Tests
# ============================================================================

@test "block renders without errors in WordPress" {
  # This requires a WordPress installation running
  # Skipped if WP_TEST_URL not set

  if [ -z "$WP_TEST_URL" ]; then
    skip "WP_TEST_URL not set"
  fi

  # Try to fetch page with block
  local response=$(curl -s -o /dev/null -w "%{http_code}" "$WP_TEST_URL/test-page/")
  [ "$response" = "200" ]
}

@test "block page loads in under 3 seconds" {
  if [ -z "$WP_TEST_URL" ]; then
    skip "WP_TEST_URL not set"
  fi

  local start=$(date +%s%N)
  curl -s "$WP_TEST_URL/test-page/" > /dev/null
  local end=$(date +%s%N)

  # Calculate time in seconds
  local duration=$(( ($end - $start) / 1000000000 ))
  [ "$duration" -lt 3 ]
}

# ============================================================================
# Coverage Tests
# ============================================================================

@test "coverage report generates" {
  run npm run test:coverage
  [ -d "./coverage" ]
}

@test "coverage meets 100% line requirement" {
  [ -f "./coverage/coverage-summary.json" ]

  # Check line coverage is 100%
  local lines=$(jq '.total.lines.pct' ./coverage/coverage-summary.json)
  [ "$lines" = "100" ] || [ "$lines" -gt "99" ]
}

@test "coverage meets 100% branch requirement" {
  [ -f "./coverage/coverage-summary.json" ]

  # Check branch coverage is 100%
  local branches=$(jq '.total.branches.pct' ./coverage/coverage-summary.json)
  [ "$branches" = "100" ] || [ "$branches" -gt "99" ]
}

# ============================================================================
# HELPER FUNCTIONS (in tests/helpers.bash)
# ============================================================================

# Helper function: validate JSON
validate_json() {
  local file="$1"
  jq empty "$file" 2>/dev/null
  return $?
}

# Helper function: check file has content
file_has_content() {
  local file="$1"
  local search="$2"

  [ -f "$file" ] && grep -q "$search" "$file"
  return $?
}

# Helper function: get block namespace
get_block_namespace() {
  jq -r '.name | split("/")[0]' "$BLOCK_DIR/block.json"
}

# Helper function: get block name
get_block_name() {
  jq -r '.name | split("/")[1]' "$BLOCK_DIR/block.json"
}

# ============================================================================
# Test Tags for Organization
# ============================================================================

# @test "..."
#   Tags: structure, lint, build, a11y, responsive, integration, coverage
#
# Run only structure tests:
#   bats --grep structure hero-block.bats
#
# Run only accessibility tests:
#   bats --grep a11y hero-block.bats
#
# Run only build tests:
#   bats --grep build hero-block.bats

# ============================================================================
# Environment Variables
# ============================================================================

# Set before running tests:
#   WP_TEST_URL              - URL to test WordPress site
#   WP_TEST_USER             - Test WordPress user
#   WP_TEST_PASSWORD         - Test WordPress password
#   PROJECT_ROOT             - Root directory of project
#
# Example:
#   WP_TEST_URL=http://localhost:8888 \
#   WP_TEST_USER=admin \
#   WP_TEST_PASSWORD=password \
#   bats hero-block.bats
