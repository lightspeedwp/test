#!/usr/bin/env node

/**
 * Validate references/ folder structure and files
 */

const fs = require('fs');
const path = require('path');

const referencesDir = path.join(__dirname, '../references');

try {
  const files = fs.readdirSync(referencesDir);
  const markdownFiles = files.filter(f => f.endsWith('.md'));

  if (markdownFiles.length === 0) {
    throw new Error('No markdown files found in references/');
  }

  // Check each reference file
  let totalLines = 0;
  markdownFiles.forEach(file => {
    const filePath = path.join(referencesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    totalLines += lines;
  });

  console.log('✅ References validation passed');
  console.log(`   Files: ${markdownFiles.length}`);
  console.log(`   Total lines: ${totalLines}`);
  console.log(`   Files: ${markdownFiles.join(', ')}`);

} catch (error) {
  console.error('❌ References validation failed:', error.message);
  process.exit(1);
}
