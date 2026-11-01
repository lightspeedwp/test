#!/usr/bin/env node

/**
 * Validate all JSON files in the repository
 */

const fs = require('fs');
const path = require('path');

function findJsonFiles(dir, exclude = []) {
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
      files = files.concat(findJsonFiles(fullPath, exclude));
    } else if (item.endsWith('.json')) {
      files.push(fullPath);
    }
  });

  return files;
}

try {
  const repoRoot = path.join(__dirname, '..');
  const jsonFiles = findJsonFiles(repoRoot, ['node_modules', '.git']);

  let allValid = true;

  jsonFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      JSON.parse(content);
      console.log(`✅ ${path.relative(repoRoot, file)}`);
    } catch (error) {
      console.error(`❌ ${path.relative(repoRoot, file)}: ${error.message}`);
      allValid = false;
    }
  });

  if (!allValid) {
    process.exit(1);
  }

  console.log(`\n✅ JSON validation passed (${jsonFiles.length} files)`);

} catch (error) {
  console.error('❌ JSON validation error:', error.message);
  process.exit(1);
}
