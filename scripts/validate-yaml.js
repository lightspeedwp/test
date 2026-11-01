#!/usr/bin/env node

/**
 * Validate YAML files in the repository
 */

const fs = require('fs');
const path = require('path');

function findYamlFiles(dir, exclude = []) {
  let files = [];

  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    // Skip excluded directories
    if (exclude.some(ex => fullPath.includes(ex))) {
      return;
    }

    if (stat.isDirectory()) {
      files = files.concat(findYamlFiles(fullPath, exclude));
    } else if (item.endsWith('.yml') || item.endsWith('.yaml')) {
      files.push(fullPath);
    }
  });

  return files;
}

function validateYaml(content) {
  // Simple YAML validation - check for common issues
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for valid indentation
    if (line.match(/^\t/)) {
      throw new Error(`Line ${i + 1}: Tabs not allowed in YAML (use spaces)`);
    }

    // Check for invalid characters
    if (line.match(/[^\x20-\x7E\n\r\t]/)) {
      // Allow some special characters but flag suspicious ones
      if (line.match(/[^\x20-\x7E\n\r\tÀ-ſ]/)) {
        throw new Error(`Line ${i + 1}: Invalid character detected`);
      }
    }
  }
}

try {
  const repoRoot = path.join(__dirname, '..');
  const yamlFiles = findYamlFiles(repoRoot, ['node_modules', '.git']);

  let allValid = true;

  yamlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      validateYaml(content);
      console.log(`✅ ${path.relative(repoRoot, file)}`);
    } catch (error) {
      console.error(`❌ ${path.relative(repoRoot, file)}: ${error.message}`);
      allValid = false;
    }
  });

  if (!allValid) {
    process.exit(1);
  }

  console.log(`\n✅ YAML validation passed (${yamlFiles.length} files)`);

} catch (error) {
  console.error('❌ YAML validation error:', error.message);
  process.exit(1);
}
