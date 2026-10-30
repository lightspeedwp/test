#!/usr/bin/env node

/**
 * Run WordPress theme validation checks
 * Usage: node scripts/wp-cli-checks.js --theme=path/to/theme
 */

const fs = require('fs');
const path = require('path');

const themePath = process.argv.find(arg => arg.startsWith('--theme='))?.split('=')[1] || './';

console.log('Validating WordPress theme...\n');

// Check required files
const requiredFiles = ['theme.json', 'style.css', 'functions.php', 'index.php'];
const missingFiles = [];

requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(themePath, file))) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('✗ Missing required files:', missingFiles.join(', '));
} else {
  console.log('✓ All required files present');
}

// Check theme.json
try {
  const themeJson = JSON.parse(fs.readFileSync(path.join(themePath, 'theme.json'), 'utf8'));
  console.log('✓ theme.json valid');
} catch (e) {
  console.log('✗ theme.json invalid:', e.message);
}

console.log('\n✓ Theme validation complete');
