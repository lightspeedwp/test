#!/usr/bin/env node

/**
 * Analyze Jest coverage and identify gaps
 * Usage: node scripts/coverage-analyzer.js --coverage-report=coverage/coverage-final.json
 */

const fs = require('fs');
const path = require('path');

const reportPath = process.argv.find(arg => arg.startsWith('--coverage-report='))?.split('=')[1] || './coverage/coverage-final.json';

try {
  const coverage = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  
  console.log('\n Coverage Analysis\n');
  console.log('Files below 100%:\n');
  
  let allFiles100 = true;
  
  Object.entries(coverage).forEach(([file, data]) => {
    if (data.lines.pct < 100) {
      allFiles100 = false;
      const gap = 100 - data.lines.pct;
      console.log(`  ${file}`);
      console.log(`    Lines: ${data.lines.pct}% (gap: ${gap}%)`);
      console.log(`    Branches: ${data.branches.pct}%`);
      console.log(`    Functions: ${data.functions.pct}%\n`);
    }
  });
  
  if (allFiles100) {
    console.log('✓ All files at 100% coverage\n');
  }
} catch (error) {
  console.error('Error reading coverage report:', error.message);
  process.exit(1);
}
