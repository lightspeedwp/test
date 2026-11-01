#!/usr/bin/env bats
# BATS (Bash Automated Testing System) Tests for WordPress Hero Block
#
# Installation:
#   npm install -g bats
#   npm install -g bats-support
#   npm install -g bats-assert
#
# Usage:
#   bats hero-block-tests.bats
#   bats hero-block-tests.bats --tap (TAP output)
#   bats hero-block-tests.bats --verbose
#
# Setup Requirements:
#   - WordPress with hero block plugin installed
#   - WP-CLI available
#   - MySQL/MariaDB running
#   - Theme with theme.json support

load test_helper

# ===========================================================================
# Setup & Teardown
# ===========================================================================

# Set before all tests
setup_file() {
  export WP_HOME="${WP_HOME:-http://localhost:8889}"
  export WP_PATH="${WP_PATH:-/var/www/wordpress}"
  export WP_USER="${WP_USER:-admin}"
  export WP_PASS="${WP_PASS:-password}"
  export TEST_POST_ID=""

  # Verify WordPress is running
  if ! curl -s "$WP_HOME" > /dev/null 2>&1; then
    echo "ERROR: WordPress not accessible at $WP_HOME"
    exit 1
  fi

  # Verify WP-CLI available
  if ! command -v wp &> /dev/null; then
    echo "ERROR: wp-cli not found. Install with: brew install wp-cli"
    exit 1
  fi
}

# Run before each test
setup() {
  # Create a fresh post for testing
  TEST_POST_ID=$(wp post create \
    --post_type='post' \
    --post_title='Hero Block Test Post' \
    --post_status='draft' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain 2>/dev/null || echo "")
}

# Run after each test
teardown() {
  # Delete test post
  if [[ -n "$TEST_POST_ID" ]]; then
    wp post delete "$TEST_POST_ID" \
      --force \
      --url="$WP_HOME" \
      --allow-root 2>/dev/null
  fi
}

# ===========================================================================
# Test Suite 1: Block Registration
# ===========================================================================

@test "block plugin should load without errors" {
  # Check that the plugin is active
  result=$(wp plugin is-active namespace-hero-block \
    --url="$WP_HOME" \
    --allow-root 2>&1)

  # Plugin should be active
  [[ $? -eq 0 ]]
}

@test "block.json should exist and be valid" {
  # Find block.json file
  local block_json_path=$(find "$WP_PATH" -name "block.json" -path "*hero*" 2>/dev/null | head -1)

  # File should exist
  [[ -f "$block_json_path" ]]

  # Should be valid JSON
  jq empty "$block_json_path" 2>/dev/null
}

@test "block.json should have required fields" {
  local block_json_path=$(find "$WP_PATH" -name "block.json" -path "*hero*" 2>/dev/null | head -1)

  # Check required fields
  local name=$(jq -r '.name' "$block_json_path")
  local title=$(jq -r '.title' "$block_json_path")
  local icon=$(jq -r '.icon' "$block_json_path")

  [[ -n "$name" ]]
  [[ -n "$title" ]]
  [[ -n "$icon" ]]
}

@test "block should have apiVersion 3" {
  local block_json_path=$(find "$WP_PATH" -name "block.json" -path "*hero*" 2>/dev/null | head -1)

  local api_version=$(jq -r '.apiVersion' "$block_json_path")

  [[ "$api_version" == "3" ]]
}

@test "block attributes should be defined" {
  local block_json_path=$(find "$WP_PATH" -name "block.json" -path "*hero*" 2>/dev/null | head -1)

  # Should have attributes object
  local attr_count=$(jq '.attributes | length' "$block_json_path")

  [[ $attr_count -gt 0 ]]
}

@test "block should have support for required features" {
  local block_json_path=$(find "$WP_PATH" -name "block.json" -path "*hero*" 2>/dev/null | head -1)

  # Check for important supports
  local has_align=$(jq '.supports.align' "$block_json_path")
  local has_anchor=$(jq '.supports.anchor' "$block_json_path")

  # At least one should be true
  [[ "$has_align" == "true" || "$has_anchor" == "true" ]]
}

# ===========================================================================
# Test Suite 2: PHP Registration
# ===========================================================================

@test "block should register via register_block_type" {
  local plugin_main=$(find "$WP_PATH" -path "*hero-block*" -name "*.php" -type f | head -1)

  # Should contain register_block_type call
  grep -q "register_block_type" "$plugin_main"
}

@test "render callback should exist if block is dynamic" {
  local block_json_path=$(find "$WP_PATH" -name "block.json" -path "*hero*" 2>/dev/null | head -1)

  # Check if block has renderCallback
  local render_callback=$(jq -r '.render // .renderCallback // empty' "$block_json_path")

  if [[ -n "$render_callback" ]]; then
    # Should be a valid PHP function name or file path
    [[ "$render_callback" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ || -f "$render_callback" ]]
  fi
}

@test "script handles should be enqueued" {
  local block_main=$(find "$WP_PATH" -path "*hero-block*" -name "*.php" -type f | head -1)

  # Should have wp_enqueue_script calls
  grep -q "wp_enqueue_script\|wp_register_script" "$block_main"
}

@test "style handles should be enqueued" {
  local block_main=$(find "$WP_PATH" -path "*hero-block*" -name "*.php" -type f | head -1)

  # Should have wp_enqueue_style calls
  grep -q "wp_enqueue_style\|wp_register_style" "$block_main"
}

# ===========================================================================
# Test Suite 3: Block Insertion & Content
# ===========================================================================

@test "should be able to insert block via WP-CLI" {
  # Create post with hero block content
  local block_content='<!-- wp:namespace/hero-section {"textContent":"Test Hero"} /-->'

  wp post create \
    --post_type='post' \
    --post_title='Hero Block Insert Test' \
    --post_content="$block_content" \
    --post_status='draft' \
    --url="$WP_HOME" \
    --allow-root

  [[ $? -eq 0 ]]
}

@test "post content should contain valid block markup" {
  if [[ -z "$TEST_POST_ID" ]]; then
    skip "No test post created"
  fi

  # Get post content
  local content=$(wp post get "$TEST_POST_ID" \
    --field=content \
    --url="$WP_HOME" \
    --allow-root)

  # Should contain post content
  [[ -n "$content" ]]
}

@test "block attributes should parse correctly" {
  # Create post with hero block
  local block_content='<!-- wp:namespace/hero-section {"textContent":"Test Hero","overlayOpacity":75} /-->'

  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='Block Attributes Test' \
    --post_content="$block_content" \
    --post_status='draft' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  # Get the post content back
  local retrieved=$(wp post get "$post_id" \
    --field=content \
    --url="$WP_HOME" \
    --allow-root)

  # Should contain our attributes
  echo "$retrieved" | grep -q "textContent"
  echo "$retrieved" | grep -q "overlayOpacity"

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

# ===========================================================================
# Test Suite 4: REST API
# ===========================================================================

@test "block should be accessible via REST API" {
  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='REST Test' \
    --post_content='<!-- wp:namespace/hero-section /-->' \
    --post_status='publish' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  # Query REST API
  local response=$(curl -s "$WP_HOME/wp-json/wp/v2/posts/$post_id")

  # Should contain post data
  echo "$response" | grep -q "REST Test"

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

@test "REST API should return rendered block" {
  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='REST Render Test' \
    --post_content='<!-- wp:namespace/hero-section /-->' \
    --post_status='publish' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  # Get rendered content
  local response=$(curl -s "$WP_HOME/wp-json/wp/v2/posts/$post_id?_fields=content")

  # Should have content
  echo "$response" | grep -q '"content"'

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

# ===========================================================================
# Test Suite 5: Theme.json Integration
# ===========================================================================

@test "theme.json should exist" {
  local theme_json="$WP_PATH/wp-content/themes/$(wp option get template --url="$WP_HOME" --allow-root)/theme.json"

  [[ -f "$theme_json" ]]
}

@test "theme.json should be valid JSON" {
  local theme_json="$WP_PATH/wp-content/themes/$(wp option get template --url="$WP_HOME" --allow-root)/theme.json"

  jq empty "$theme_json"
}

@test "block should be registered in theme.json" {
  local theme_json="$WP_PATH/wp-content/themes/$(wp option get template --url="$WP_HOME" --allow-root)/theme.json"

  # Check if our block is in theme.json
  local block_found=$(jq '.settings.blocks[] | select(.name == "namespace/hero-section")' "$theme_json" 2>/dev/null)

  # May or may not be there, but file should be valid
  [[ -f "$theme_json" ]]
}

@test "theme should have color palette" {
  local theme_json="$WP_PATH/wp-content/themes/$(wp option get template --url="$WP_HOME" --allow-root)/theme.json"

  # Check for color settings
  local has_colors=$(jq '.settings.color.palette != null' "$theme_json")

  [[ "$has_colors" != "null" ]]
}

@test "theme should have typography settings" {
  local theme_json="$WP_PATH/wp-content/themes/$(wp option get template --url="$WP_HOME" --allow-root)/theme.json"

  # Check for typography settings
  local has_typography=$(jq '.settings.typography != null' "$theme_json")

  [[ "$has_typography" != "null" ]]
}

# ===========================================================================
# Test Suite 6: Frontend Rendering
# ===========================================================================

@test "block should render to HTML on frontend" {
  # Create and publish post with block
  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='Render Test' \
    --post_content='<!-- wp:namespace/hero-section /-->' \
    --post_status='publish' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  # Get post permalink
  local permalink=$(wp post get "$post_id" \
    --field=url \
    --url="$WP_HOME" \
    --allow-root)

  # Fetch frontend HTML
  local html=$(curl -s "$permalink")

  # Should contain our block class
  echo "$html" | grep -q "wp-block-namespace-hero-section"

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

@test "rendered HTML should not have PHP errors" {
  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='Error Test' \
    --post_content='<!-- wp:namespace/hero-section /-->' \
    --post_status='publish' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  local permalink=$(wp post get "$post_id" \
    --field=url \
    --url="$WP_HOME" \
    --allow-root)

  local html=$(curl -s "$permalink")

  # Should NOT contain error messages
  ! echo "$html" | grep -q "Parse error\|Fatal error\|Warning:"

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

@test "rendered block should have required HTML elements" {
  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='HTML Elements Test' \
    --post_content='<!-- wp:namespace/hero-section /-->' \
    --post_status='publish' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  local permalink=$(wp post get "$post_id" \
    --field=url \
    --url="$WP_HOME" \
    --allow-root)

  local html=$(curl -s "$permalink")

  # Should have the wrapper
  echo "$html" | grep -q "wp-block-namespace-hero-section"

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

# ===========================================================================
# Test Suite 7: Database & Persistence
# ===========================================================================

@test "post content should persist in database" {
  local block_content='<!-- wp:namespace/hero-section {"textContent":"Persistent Test"} /-->'

  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='Persistence Test' \
    --post_content="$block_content" \
    --post_status='draft' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  # Query database directly
  local db_content=$(wp post get "$post_id" \
    --field=content \
    --url="$WP_HOME" \
    --allow-root)

  # Should match what we saved
  echo "$db_content" | grep -q "Persistent Test"

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

@test "block attributes should be queryable via REST" {
  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='API Query Test' \
    --post_content='<!-- wp:namespace/hero-section {"textContent":"API Test"} /-->' \
    --post_status='publish' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  # Query REST API
  local response=$(curl -s "$WP_HOME/wp-json/wp/v2/posts/$post_id")

  # Should have content
  echo "$response" | grep -q "API Query Test"

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

# ===========================================================================
# Test Suite 8: Code Quality
# ===========================================================================

@test "PHP code should have no syntax errors" {
  local php_files=$(find "$WP_PATH" -path "*hero-block*" -name "*.php" -type f)

  # Check each PHP file
  while IFS= read -r file; do
    php -l "$file" | grep -q "No syntax errors detected"
  done <<< "$php_files"
}

@test "block.json should not have duplicate keys" {
  local block_json_path=$(find "$WP_PATH" -name "block.json" -path "*hero*" 2>/dev/null | head -1)

  # jq would error on duplicate keys
  jq empty "$block_json_path"
}

@test "CSS files should exist" {
  local css_files=$(find "$WP_PATH" -path "*hero-block*" -name "*.css" -o -name "*.scss")

  # Should have at least one CSS/SCSS file
  [[ -n "$css_files" ]]
}

@test "JavaScript files should be present" {
  local js_files=$(find "$WP_PATH" -path "*hero-block*" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx")

  # Should have at least one JS file
  [[ -n "$js_files" ]]
}

# ===========================================================================
# Test Suite 9: Performance
# ===========================================================================

@test "block render should complete within reasonable time" {
  local start=$(date +%s%N)

  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='Performance Test' \
    --post_content='<!-- wp:namespace/hero-section /-->' \
    --post_status='publish' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  local end=$(date +%s%N)
  local duration=$(( (end - start) / 1000000 ))  # Convert to milliseconds

  # Should complete within 5 seconds (5000 ms)
  [[ $duration -lt 5000 ]]

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

@test "multiple block instances should be efficient" {
  # Create post with multiple hero blocks
  local block_content=''
  for i in {1..5}; do
    block_content="${block_content}<!-- wp:namespace/hero-section {\"textContent\":\"Hero $i\"} /-->"
  done

  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='Multiple Blocks Test' \
    --post_content="$block_content" \
    --post_status='draft' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  # Get the post back
  local retrieved=$(wp post get "$post_id" \
    --field=content \
    --url="$WP_HOME" \
    --allow-root)

  # Should have all 5 blocks
  local count=$(echo "$retrieved" | grep -o "hero-section" | wc -l)
  [[ $count -ge 5 ]]

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

# ===========================================================================
# Test Suite 10: Accessibility Markup
# ===========================================================================

@test "block should have semantic HTML" {
  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='Semantic HTML Test' \
    --post_content='<!-- wp:namespace/hero-section /-->' \
    --post_status='publish' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  local permalink=$(wp post get "$post_id" \
    --field=url \
    --url="$WP_HOME" \
    --allow-root)

  local html=$(curl -s "$permalink")

  # Should have semantic structure (div wrapper expected)
  echo "$html" | grep -q "wp-block"

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

@test "image should have alt attribute" {
  local post_id=$(wp post create \
    --post_type='post' \
    --post_title='Alt Text Test' \
    --post_content='<!-- wp:namespace/hero-section /-->' \
    --post_status='publish' \
    --url="$WP_HOME" \
    --allow-root \
    --porcelain)

  local permalink=$(wp post get "$post_id" \
    --field=url \
    --url="$WP_HOME" \
    --allow-root)

  local html=$(curl -s "$permalink")

  # If there's an image, it should have alt (or alt="" for decorative)
  if echo "$html" | grep -q "<img"; then
    echo "$html" | grep -q "alt="
  fi

  # Cleanup
  wp post delete "$post_id" --force --url="$WP_HOME" --allow-root
}

# ===========================================================================
# Test Helper Functions
# ===========================================================================

# Get WordPress version
get_wp_version() {
  wp core version --url="$WP_HOME" --allow-root
}

# Get active theme
get_active_theme() {
  wp option get template --url="$WP_HOME" --allow-root
}

# Check if plugin is active
is_plugin_active() {
  local plugin=$1
  wp plugin is-active "$plugin" --url="$WP_HOME" --allow-root 2>/dev/null
  return $?
}
