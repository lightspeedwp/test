#!/bin/bash
# Fixture data generators for BATS tests
# Creates sample data files for testing without needing real npm/build processes

set -euo pipefail

# =============================================================================
# FIXTURE: package.json
# =============================================================================

create_package_json() {
    local output_dir="${1:-.}"
    local package_file="${output_dir}/package.json"

    mkdir -p "$output_dir"

    cat > "$package_file" <<'EOF'
{
  "name": "lightspeed-wordpress",
  "version": "1.0.0",
  "description": "WordPress development toolkit",
  "repository": {
    "type": "git",
    "url": "git@github.com:lightspeedwp/project.git"
  },
  "scripts": {
    "build": "npm run lint && npm run compile && npm run test:coverage",
    "build:prod": "NODE_ENV=production npm run build",
    "compile": "sass src:build --no-source-map",
    "lint": "eslint src/",
    "test": "jest",
    "test:coverage": "jest --coverage --coverageDirectory=coverage --coverageReporters=json,lcov,text",
    "test:watch": "jest --watch",
    "deploy": "npm run build && bash scripts/package-artifacts.sh",
    "validate": "npm run test && npm run test:coverage && npm run deploy"
  },
  "keywords": ["wordpress", "build", "deploy"],
  "author": "LightSpeed WP",
  "license": "MIT",
  "devDependencies": {
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "sass": "^1.50.0"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": ["src/**/*.js"],
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

# =============================================================================
# FIXTURE: theme.json
# =============================================================================

create_theme_json() {
    local output_dir="${1:-.}"
    local theme_file="${output_dir}/theme.json"

    mkdir -p "$output_dir"

    cat > "$theme_file" <<'EOF'
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "color": {
      "custom": true,
      "customDuotone": true,
      "customGradient": true,
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
        },
        {
          "color": "#3B82F6",
          "name": "Primary",
          "slug": "primary"
        }
      ]
    },
    "typography": {
      "customLineHeight": true,
      "dropCap": true,
      "fontFamilies": [
        {
          "fontFamily": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          "name": "System Font",
          "slug": "system"
        },
        {
          "fontFamily": "Georgia, Palantino, \"Book Antiqua\", serif",
          "name": "Serif",
          "slug": "serif"
        }
      ],
      "fontSizes": [
        {
          "name": "Small",
          "size": "0.875rem",
          "slug": "small"
        },
        {
          "name": "Medium",
          "size": "1rem",
          "slug": "medium"
        },
        {
          "name": "Large",
          "size": "1.5rem",
          "slug": "large"
        }
      ]
    },
    "spacing": {
      "spacingSizes": [
        {
          "name": "Small",
          "size": "0.5rem",
          "slug": "small"
        },
        {
          "name": "Medium",
          "size": "1rem",
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
      "fontFamily": "var(--wp--preset--font-family--system)",
      "fontSize": "var(--wp--preset--font-size--medium)"
    }
  },
  "templateParts": [
    {
      "name": "header",
      "title": "Header",
      "area": "header"
    },
    {
      "name": "footer",
      "title": "Footer",
      "area": "footer"
    }
  ]
}
EOF
}

# =============================================================================
# FIXTURE: Coverage Report (100%)
# =============================================================================

create_coverage_report_100() {
    local output_dir="${1:-coverage}"

    mkdir -p "$output_dir"

    cat > "$output_dir/coverage-summary.json" <<'EOF'
{
  "total": {
    "lines": {
      "total": 100,
      "covered": 100,
      "skipped": 0,
      "pct": 100
    },
    "statements": {
      "total": 100,
      "covered": 100,
      "skipped": 0,
      "pct": 100
    },
    "functions": {
      "total": 50,
      "covered": 50,
      "skipped": 0,
      "pct": 100
    },
    "branches": {
      "total": 25,
      "covered": 25,
      "skipped": 0,
      "pct": 100
    }
  }
}
EOF
}

# =============================================================================
# FIXTURE: Coverage Report (85% - Below Threshold)
# =============================================================================

create_coverage_report_85() {
    local output_dir="${1:-coverage}"

    mkdir -p "$output_dir"

    cat > "$output_dir/coverage-summary.json" <<'EOF'
{
  "total": {
    "lines": {
      "total": 100,
      "covered": 85,
      "skipped": 0,
      "pct": 85
    },
    "statements": {
      "total": 100,
      "covered": 85,
      "skipped": 0,
      "pct": 85
    },
    "functions": {
      "total": 50,
      "covered": 42,
      "skipped": 0,
      "pct": 85
    },
    "branches": {
      "total": 25,
      "covered": 20,
      "skipped": 0,
      "pct": 80
    }
  }
}
EOF
}

# =============================================================================
# FIXTURE: Deployment Manifest
# =============================================================================

create_deployment_manifest() {
    local output_dir="${1:-dist}"
    local version="${2:-1.0.0}"

    mkdir -p "$output_dir"

    cat > "$output_dir/MANIFEST.json" <<EOF
{
  "version": "${version}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "artifacts": [
    "build",
    "package.json",
    "coverage"
  ],
  "checksumAlgorithm": "sha256",
  "buildTime": "45 seconds",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)",
  "deploymentReady": true,
  "hasMetadata": true
}
EOF
}

# =============================================================================
# FIXTURE: ESLint Configuration
# =============================================================================

create_eslint_config() {
    local output_dir="${1:-.}"
    local eslint_file="${output_dir}/.eslintrc.json"

    mkdir -p "$output_dir"

    cat > "$eslint_file" <<'EOF'
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "no-var": "error",
    "prefer-const": "error",
    "semi": "error",
    "indent": ["error", 2]
  }
}
EOF
}

# =============================================================================
# FIXTURE: Jest Configuration
# =============================================================================

create_jest_config() {
    local output_dir="${1:-.}"
    local jest_file="${output_dir}/jest.config.js"

    mkdir -p "$output_dir"

    cat > "$jest_file" <<'EOF'
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
  },
  testTimeout: 10000
};
EOF
}

# =============================================================================
# FIXTURE: npm script with build
# =============================================================================

create_package_artifacts_script() {
    local output_dir="${1:-.}"
    local scripts_dir="${output_dir}/scripts"
    local script_file="${scripts_dir}/package-artifacts.sh"

    mkdir -p "$scripts_dir"

    cat > "$script_file" <<'EOF'
#!/bin/bash
set -euo pipefail

# Deployment artifact packaging script
# Creates deployment package with build artifacts, coverage, and manifests

ARTIFACT_DIR="dist"
BUILD_DIR="build"
COVERAGE_DIR="coverage"

echo "Packaging deployment artifacts..."

# Verify build artifacts exist
if [[ ! -d "${BUILD_DIR}" ]]; then
    echo "ERROR: Build directory not found: ${BUILD_DIR}" >&2
    exit 1
fi

# Create artifact directory
mkdir -p "${ARTIFACT_DIR}"

# Copy build artifacts
echo "  ✓ Copying build artifacts"
cp -r "${BUILD_DIR}" "${ARTIFACT_DIR}/"

# Copy package.json
echo "  ✓ Copying package.json"
cp package.json "${ARTIFACT_DIR}/"

# Include coverage if available
if [[ -d "${COVERAGE_DIR}" ]]; then
    echo "  ✓ Including coverage report"
    cp -r "${COVERAGE_DIR}" "${ARTIFACT_DIR}/"
fi

# Create deployment manifest
echo "  ✓ Creating deployment manifest"
cat > "${ARTIFACT_DIR}/MANIFEST.json" <<MANIFEST
{
  "version": "1.0.0",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "artifacts": ["build", "package.json", "coverage"],
  "checksumAlgorithm": "sha256",
  "deploymentReady": true
}
MANIFEST

# Generate checksums
echo "  ✓ Generating checksums"
cd "${ARTIFACT_DIR}" || exit 1
find . -type f ! -name "CHECKSUMS.sha256" -exec sha256sum {} \; > CHECKSUMS.sha256
cd - > /dev/null || exit 1

echo "Deployment artifacts packaged successfully in ${ARTIFACT_DIR}/"
exit 0
EOF

    chmod +x "$script_file"
}

# =============================================================================
# FIXTURE: Sample Source Files
# =============================================================================

create_sample_source_files() {
    local output_dir="${1:-.}"
    local src_dir="${output_dir}/src"

    mkdir -p "${src_dir}/scss"
    mkdir -p "${src_dir}/js"
    mkdir -p "${src_dir}/__tests__"

    # SCSS file
    cat > "${src_dir}/scss/main.scss" <<'EOF'
// Main stylesheet
$primary-color: #3B82F6;
$text-color: #000000;
$bg-color: #ffffff;

body {
  background-color: $bg-color;
  color: $text-color;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
}

a {
  color: $primary-color;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
EOF

    # JavaScript file
    cat > "${src_dir}/js/main.js" <<'EOF'
/**
 * Main application script
 */

// Utility function
function initializeApp() {
  console.log('Application initialized');
  return true;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeApp };
}
EOF

    # Test file
    cat > "${src_dir}/__tests__/main.test.js" <<'EOF'
describe('Main module', () => {
  test('should initialize application', () => {
    const { initializeApp } = require('../js/main.js');
    expect(initializeApp()).toBe(true);
  });

  test('should handle edge cases', () => {
    const { initializeApp } = require('../js/main.js');

    // Test 1
    expect(typeof initializeApp).toBe('function');

    // Test 2
    expect(initializeApp()).not.toBeNull();
  });
});
EOF
}

# =============================================================================
# MAIN: Create all fixtures
# =============================================================================

create_all_fixtures() {
    local test_dir="${1:-.}"

    echo "Creating test fixtures in: $test_dir"

    create_package_json "$test_dir"
    create_theme_json "$test_dir/src"
    create_coverage_report_100 "$test_dir/coverage"
    create_deployment_manifest "$test_dir/dist" "1.0.0"
    create_eslint_config "$test_dir"
    create_jest_config "$test_dir"
    create_package_artifacts_script "$test_dir"
    create_sample_source_files "$test_dir"

    echo "✓ All fixtures created successfully"
}

# =============================================================================
# CLI INTERFACE
# =============================================================================

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-all}" in
        package.json)
            create_package_json "${2:-.}"
            ;;
        theme.json)
            create_theme_json "${2:-.}"
            ;;
        coverage-100)
            create_coverage_report_100 "${2:-coverage}"
            ;;
        coverage-85)
            create_coverage_report_85 "${2:-coverage}"
            ;;
        manifest)
            create_deployment_manifest "${2:-dist}" "${3:-1.0.0}"
            ;;
        eslint)
            create_eslint_config "${2:-.}"
            ;;
        jest)
            create_jest_config "${2:-.}"
            ;;
        deploy-script)
            create_package_artifacts_script "${2:-.}"
            ;;
        sources)
            create_sample_source_files "${2:-.}"
            ;;
        all)
            create_all_fixtures "${2:-.}"
            ;;
        *)
            echo "Usage: $0 {all|package.json|theme.json|coverage-100|coverage-85|manifest|eslint|jest|deploy-script|sources} [directory]"
            exit 1
            ;;
    esac
fi

export -f create_package_json
export -f create_theme_json
export -f create_coverage_report_100
export -f create_coverage_report_85
export -f create_deployment_manifest
export -f create_eslint_config
export -f create_jest_config
export -f create_package_artifacts_script
export -f create_sample_source_files
export -f create_all_fixtures
