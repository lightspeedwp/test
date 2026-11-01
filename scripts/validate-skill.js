#!/usr/bin/env node

/**
 * Validate SKILL.md structure and frontmatter
 */

const fs = require('fs');
const path = require('path');

const skillPath = path.join(__dirname, '../docs/SKILL.md');

try {
  const content = fs.readFileSync(skillPath, 'utf8');

  // Check frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    throw new Error('Missing YAML frontmatter in SKILL.md');
  }

  const frontmatter = frontmatterMatch[1];

  // Check required fields
  const nameMatch = frontmatter.match(/name:\s*(\S+)/);
  if (!nameMatch) {
    throw new Error('Missing "name" field in frontmatter');
  }

  const descriptionMatch = frontmatter.match(/description:\s*"(.+)"/s);
  if (!descriptionMatch) {
    throw new Error('Missing "description" field in frontmatter');
  }

  const name = nameMatch[1];
  const description = descriptionMatch[1];

  // Validate
  if (name.length < 3) {
    throw new Error('Skill name too short');
  }

  if (description.length < 50) {
    throw new Error('Skill description too short (should be at least 50 characters)');
  }

  console.log('✅ SKILL.md validation passed');
  console.log(`   Name: ${name}`);
  console.log(`   Description length: ${description.length} characters`);

} catch (error) {
  console.error('❌ SKILL.md validation failed:', error.message);
  process.exit(1);
}
