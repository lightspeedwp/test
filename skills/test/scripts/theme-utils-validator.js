#!/usr/bin/env node

/**
 * Validate theme.json and design tokens for WordPress themes
 * Usage: node scripts/theme-utils-validator.js --theme-json=path/to/theme.json
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const themePath = args.find(arg => arg.startsWith('--theme-json='))?.split('=')[1] || './theme.json';

try {
  const themeContent = fs.readFileSync(themePath, 'utf8');
  const theme = JSON.parse(themeContent);
  
  console.log('✓ theme.json valid JSON');
  
  // Validate structure
  if (!theme.version) console.log('⚠ Missing version field');
  if (!theme.settings) console.log('⚠ Missing settings');
  if (!theme.styles) console.log('⚠ Missing styles');
  
  // Validate design tokens
  const hasColorPalette = theme.settings?.color?.palette?.length > 0;
  const hasTypography = theme.settings?.typography?.fontSizes?.length > 0;
  const hasSpacing = theme.settings?.spacing?.spacingSizes?.length > 0;
  
  if (hasColorPalette) console.log(`✓ Color palette: ${theme.settings.color.palette.length} colors`);
  if (hasTypography) console.log(`✓ Typography: ${theme.settings.typography.fontSizes.length} sizes`);
  if (hasSpacing) console.log(`✓ Spacing: ${theme.settings.spacing.spacingSizes.length} scales`);
  
  if (!hasColorPalette || !hasTypography || !hasSpacing) {
    process.exit(1);
  }
  
  console.log('✓ All validation checks passed');
} catch (error) {
  console.error('✗ Error:', error.message);
  process.exit(1);
}
