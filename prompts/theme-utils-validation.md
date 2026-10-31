# Theme-Utils & Design Token Validation

Validate design tokens and theme structure using adapted theme-utils.

## Validation Patterns

**theme.json structure:**
```javascript
const schema = {
  settings: {
    color: { palette: [...] },
    typography: { fontSizes: [...] },
    spacing: { spacingSizes: [...] }
  }
};
```

**Token consistency:**
- All tokens used in code
- Code tokens match theme.json
- No hardcoded values

**Responsive validation:**
- Breakpoints consistent
- Mobile-first approach
- All breakpoints tested

---

See scripts/theme-utils-validator.js for validation implementation.
