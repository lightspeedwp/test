# Theme-Utils Reference

Adapted from WordPress core and Twenty Twenty-Five themes.

## Design Token Validation

```javascript
const utils = {
  // Validate theme.json structure
  validateThemeJson(theme) {},
  
  // Check color palette consistency
  validateColorPalette(palette) {},
  
  // Check typography scale
  validateTypography(typography) {},
  
  // Check spacing scale
  validateSpacing(spacing) {}
};
```

## Token Patterns

- **Colors:** 50-900 scale (light to dark)
- **Spacing:** 4px increments (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- **Typography:** Scale from 12px to 48px base

---

See theme-utils-validation.md for validation workflow.
