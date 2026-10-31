#!/bin/bash
# Test Fixtures for BATS Tests
# Provides functions to create mock project structures and files
# Usage: load ../helpers/test-fixtures

set -euo pipefail

# ============================================================================
# Package.json Fixtures
# ============================================================================

# Create mock package.json
create_mock_package_json() {
  local dir="${1:-.}"

  cat > "${dir}/package.json" <<'EOF'
{
  "name": "wordpress-theme",
  "version": "1.0.0",
  "description": "WordPress block theme",
  "scripts": {
    "build": "webpack build",
    "test": "jest",
    "coverage": "jest --coverage",
    "start": "webpack serve",
    "lint": "eslint src",
    "validate:theme": "node scripts/validate-theme.js"
  },
  "dependencies": {
    "@wordpress/blocks": "^12.0.0",
    "@wordpress/element": "^5.0.0",
    "@wordpress/components": "^25.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "webpack": "^5.0.0",
    "@babel/preset-react": "^7.0.0"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js",
      "!src/index.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 100,
        "functions": 100,
        "lines": 100,
        "statements": 100
      }
    }
  }
}
EOF
}

# Create package.json with specific dependencies
create_package_json_with_deps() {
  local dir="${1:-.}"
  shift
  local deps=("$@")

  local deps_json=""
  for dep in "${deps[@]}"; do
    deps_json="${deps_json}    \"${dep}\": \"*\",\n"
  done

  cat > "${dir}/package.json" <<EOF
{
  "name": "wordpress-theme",
  "version": "1.0.0",
  "dependencies": {
${deps_json}    "placeholder": "*"
  }
}
EOF
}

# Create package.json with build scripts
create_package_json_with_scripts() {
  local dir="${1:-.}"
  local script="${2:-build}"

  cat > "${dir}/package.json" <<EOF
{
  "name": "wordpress-theme",
  "version": "1.0.0",
  "scripts": {
    "${script}": "echo 'Building...'"
  }
}
EOF
}

# Create package.json with coverage configuration
create_package_json_with_coverage_config() {
  local dir="${1:-.}"

  cat > "${dir}/package.json" <<'EOF'
{
  "name": "wordpress-theme",
  "version": "1.0.0",
  "jest": {
    "collectCoverage": true,
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 100,
        "functions": 100,
        "lines": 100,
        "statements": 100
      }
    }
  }
}
EOF
}

# Create package.json with missing dependencies
create_package_json_with_missing_deps() {
  local dir="${1:-.}"

  cat > "${dir}/package.json" <<'EOF'
{
  "name": "wordpress-theme",
  "version": "1.0.0",
  "dependencies": {
    "nonexistent-package-12345": "^1.0.0"
  }
}
EOF
}

# Create package-lock.json
create_package_lock_json() {
  local dir="${1:-.}"

  cat > "${dir}/package-lock.json" <<'EOF'
{
  "name": "wordpress-theme",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "wordpress-theme",
      "version": "1.0.0"
    }
  }
}
EOF
}

# ============================================================================
# Theme.json Fixtures
# ============================================================================

# Create mock theme.json
create_mock_theme_json() {
  local dir="${1:-.}"

  cat > "${dir}/theme.json" <<'EOF'
{
  "$schema": "https://schemas.wp.org/wp/6.3/theme.json",
  "version": 3,
  "settings": {
    "color": {
      "palette": [
        {
          "color": "#000000",
          "name": "Black",
          "slug": "black"
        },
        {
          "color": "#ffffff",
          "name": "White",
          "slug": "white"
        }
      ]
    },
    "typography": {
      "fontSizes": [
        {
          "size": "1rem",
          "name": "Small",
          "slug": "small"
        },
        {
          "size": "2rem",
          "name": "Large",
          "slug": "large"
        }
      ]
    },
    "spacing": {
      "spacingSizes": [
        {
          "size": "0.5rem",
          "name": "Small",
          "slug": "small"
        },
        {
          "size": "1rem",
          "name": "Medium",
          "slug": "medium"
        }
      ]
    }
  },
  "styles": {
    "color": {
      "background": "#ffffff",
      "text": "#000000"
    },
    "typography": {
      "fontSize": "1rem"
    }
  },
  "templateParts": [
    {
      "name": "header",
      "title": "Header"
    },
    {
      "name": "footer",
      "title": "Footer"
    }
  ]
}
EOF
}

# Create invalid theme.json
create_invalid_theme_json() {
  local dir="${1:-.}"

  cat > "${dir}/theme.json" <<'EOF'
{
  "version": 3,
  "settings": {
    "color": {
      "palette": [
        {
          "color": "#000000",
          "name": "Black"
          "slug": "black"  // Missing comma - invalid JSON
        }
      ]
    }
  }
}
EOF
}

# Create incomplete theme.json
create_incomplete_theme_json() {
  local dir="${1:-.}"

  cat > "${dir}/theme.json" <<'EOF'
{
  "settings": {}
}
EOF
}

# Create theme.json with duplicate entries
create_theme_json_with_duplicates() {
  local dir="${1:-.}"

  cat > "${dir}/theme.json" <<'EOF'
{
  "version": 3,
  "settings": {
    "color": {
      "palette": [
        {
          "color": "#000000",
          "name": "Black",
          "slug": "black"
        },
        {
          "color": "#111111",
          "name": "Black",
          "slug": "black"
        }
      ]
    }
  }
}
EOF
}

# ============================================================================
# Build Environment Fixtures
# ============================================================================

# Create complete build environment
create_complete_build_environment() {
  local dir="${1:-.}"

  # Create package.json
  create_mock_package_json "$dir"

  # Create theme.json
  create_mock_theme_json "$dir"

  # Create source directory
  mkdir -p "${dir}/src"

  # Create sample source files
  cat > "${dir}/src/index.js" <<'EOF'
// Main entry point
console.log('WordPress theme loaded');

export function initializeTheme() {
  console.log('Theme initialized');
}

initializeTheme();
EOF

  cat > "${dir}/src/styles.css" <<'EOF'
:root {
  --color-primary: #000000;
  --color-secondary: #ffffff;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  color: var(--color-primary);
}
EOF

  # Create build directory
  mkdir -p "${dir}/build"

  # Create simulated build output
  cat > "${dir}/build/index.js" <<'EOF'
console.log('WordPress theme loaded');
EOF

  cat > "${dir}/build/style.css" <<'EOF'
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto;color:#000}
EOF

  # Create dist directory
  mkdir -p "${dir}/dist"

  # Copy artifacts to dist
  cp "${dir}/build/"* "${dir}/dist/" 2>/dev/null || true

  # Create manifest
  cat > "${dir}/dist/manifest.json" <<'EOF'
{
  "version": "1.0.0",
  "name": "WordPress Theme",
  "timestamp": "2026-10-30T00:00:00Z",
  "files": ["index.js", "style.css"]
}
EOF
}

# Create build environment with specific coverage
create_build_environment_with_coverage() {
  local dir="${1:-.}"
  local coverage="${2:-100}"

  create_complete_build_environment "$dir"

  # Create coverage report
  mkdir -p "${dir}/coverage"

  local lines_coverage=$coverage
  local branches_coverage=$coverage
  local functions_coverage=$coverage
  local statements_coverage=$coverage

  cat > "${dir}/coverage/lcov.info" <<EOF
TN:
SF:src/index.js
FN:1,(anonymous)
FNDA:1,(anonymous)
FNF:1
FNH:1
DA:1,1
LH:1
LF:1
end_of_record
EOF

  cat > "${dir}/coverage/index.html" <<EOF
<!DOCTYPE html>
<html>
<head><title>Coverage Report</title></head>
<body>
<h1>Coverage: ${coverage}%</h1>
<p>Lines: ${lines_coverage}%</p>
<p>Branches: ${branches_coverage}%</p>
<p>Functions: ${functions_coverage}%</p>
<p>Statements: ${statements_coverage}%</p>
</body>
</html>
EOF
}

# Create build environment with syntax error
create_build_environment_with_syntax_error() {
  local dir="${1:-.}"

  create_mock_package_json "$dir"
  create_mock_theme_json "$dir"

  mkdir -p "${dir}/src"

  # Create invalid JavaScript
  cat > "${dir}/src/index.js" <<'EOF'
// Invalid syntax - missing closing brace
function test() {
  console.log('missing brace')
EOF
}

# Create incomplete build
create_incomplete_build() {
  local dir="${1:-.}"

  create_mock_package_json "$dir"

  # Create partial build output
  mkdir -p "${dir}/build"
  touch "${dir}/build/index.js"
  # Don't create style.css - incomplete build
}

# ============================================================================
# Error Scenario Fixtures
# ============================================================================

# Create fixture for network error simulation
create_network_error_fixture() {
  local dir="${1:-.}"

  cat > "${dir}/simulate-network-error.sh" <<'EOF'
#!/bin/bash
# Simulate network error
echo "npm ERR! code ENOTFOUND"
echo "npm ERR! errno ENOTFOUND"
echo "npm ERR! syscall getaddrinfo"
echo "npm ERR! getaddrinfo ENOTFOUND registry.npmjs.org"
exit 1
EOF

  chmod +x "${dir}/simulate-network-error.sh"
}

# Create fixture for permission error
create_permission_error_fixture() {
  local dir="${1:-.}"

  mkdir -p "${dir}/restricted"
  chmod 000 "${dir}/restricted"
}

# ============================================================================
# Integration Test Fixtures
# ============================================================================

# Create WordPress theme structure
create_wordpress_theme_structure() {
  local dir="${1:-.}"

  # Create theme directories
  mkdir -p "${dir}/"{parts,blocks,patterns,assets/css,assets/js}

  # Create theme.json
  create_mock_theme_json "$dir"

  # Create template files
  cat > "${dir}/index.html" <<'EOF'
<!-- wp:template-part {"slug":"header"} /-->
<!-- wp:template-part {"slug":"footer"} /-->
EOF

  # Create block variations
  mkdir -p "${dir}/blocks/hero-section"
  cat > "${dir}/blocks/hero-section/block.json" <<'EOF'
{
  "apiVersion": 3,
  "name": "custom/hero-section",
  "title": "Hero Section",
  "category": "text",
  "supports": {
    "html": false
  },
  "attributes": {
    "title": {
      "type": "string"
    }
  }
}
EOF
}

# Create WordPress plugin structure
create_wordpress_plugin_structure() {
  local dir="${1:-.}"

  # Create main plugin file
  cat > "${dir}/plugin.php" <<'EOF'
<?php
/**
 * Plugin Name: Test Plugin
 * Plugin URI: https://example.com
 * Description: Test plugin
 * Version: 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

define( 'TEST_PLUGIN_DIR', __DIR__ );
EOF

  # Create WordPress standard directories
  mkdir -p "${dir}/"{includes,admin,public,assets}
}

# ============================================================================
# Mock Script Fixtures
# ============================================================================

# Create mock npm script for testing
create_mock_npm_script() {
  local dir="${1:-.}"
  local script_name="${2:-build}"

  mkdir -p "${dir}/scripts"

  cat > "${dir}/scripts/${script_name}.js" <<'EOF'
#!/usr/bin/env node
console.log('Building...');
process.exit(0);
EOF

  chmod +x "${dir}/scripts/${script_name}.js"
}

# Create mock webpack config
create_mock_webpack_config() {
  local dir="${1:-.}"

  cat > "${dir}/webpack.config.js" <<'EOF'
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
EOF
}

# Create mock jest config
create_mock_jest_config() {
  local dir="${1:-.}"

  cat > "${dir}/jest.config.js" <<'EOF'
module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
EOF
}

# ============================================================================
# Fixture Cleanup Helpers
# ============================================================================

# Remove all test fixtures
cleanup_fixtures() {
  local dir="${1:-.}"

  if [[ -d "$dir" ]]; then
    rm -rf "${dir}"/{node_modules,build,dist,coverage,.git}
    rm -f "${dir}"/{package-lock.json,yarn.lock,.env}
  fi
}

# Restore full permissions (for permission error fixtures)
restore_permissions() {
  local dir="${1:-.}"

  if [[ -d "$dir" ]]; then
    find "$dir" -type d -exec chmod 755 {} \; 2>/dev/null || true
    find "$dir" -type f -exec chmod 644 {} \; 2>/dev/null || true
  fi
}

# Export fixture functions
export -f create_mock_package_json create_package_json_with_deps
export -f create_package_json_with_scripts create_package_json_with_coverage_config
export -f create_package_json_with_missing_deps create_package_lock_json
export -f create_mock_theme_json create_invalid_theme_json create_incomplete_theme_json
export -f create_theme_json_with_duplicates create_complete_build_environment
export -f create_build_environment_with_coverage create_build_environment_with_syntax_error
export -f create_incomplete_build create_network_error_fixture
export -f create_permission_error_fixture create_wordpress_theme_structure
export -f create_wordpress_plugin_structure create_mock_npm_script
export -f create_mock_webpack_config create_mock_jest_config
export -f cleanup_fixtures restore_permissions
