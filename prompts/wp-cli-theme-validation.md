# WordPress Theme Validation (WP-CLI)

Validate WordPress themes using adapted theme-check.

## Theme Validation Checks

**Block attributes:**
- All blocks have valid `block.json`
- Attributes registered correctly
- Supports array complete

**Theme structure:**
- All required files present
- Proper hierarchy
- Valid JSON files

**Design compliance:**
- theme.json valid against schema
- Colors/spacing/typography defined
- Custom properties registered

**Template validation:**
- Templates use block markup
- Patterns registered
- Parts discoverable

## Running Validation

```bash
npm run wp-cli:checks
```

Output:
```
✓ theme.json valid
✓ All blocks registered
✓ Design tokens consistent
✗ Missing color palette (critical)

Fix: Add color palette to theme.json
```

---

See references/wordpress-standards.md for validation rules.
