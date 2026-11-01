#!/usr/bin/env node

/**
 * Validate prompts/ folder structure and files
 */

const fs = require('fs');
const path = require('path');

const promptsDir = path.join(__dirname, '../prompts');

try {
  const files = fs.readdirSync(promptsDir);
  const markdownFiles = files.filter(f => f.endsWith('.md'));

  if (markdownFiles.length === 0) {
    throw new Error('No markdown files found in prompts/');
  }

  // Check each prompt file
  let totalLines = 0;
  markdownFiles.forEach(file => {
    const filePath = path.join(promptsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    totalLines += lines;
  });

  console.log('✅ Prompts validation passed');
  console.log(`   Files: ${markdownFiles.length}`);
  console.log(`   Total lines: ${totalLines}`);

} catch (error) {
  console.error('❌ Prompts validation failed:', error.message);
  process.exit(1);
}
