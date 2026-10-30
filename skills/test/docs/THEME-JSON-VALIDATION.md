# theme.json Validation Guide

Design token and theme.json structure validation.

## theme.json Structure

```json
{
  "version": 2,
  "settings": {
    "color": {
      "palette": [
        { "name": "Primary", "slug": "primary", "color": "#3b82f6" }
      ]
    },
    "typography": {
      "fontSizes": [
        { "name": "Small", "slug": "small", "size": "0.875rem" }
      ]
    },
    "spacing": {
      "spacingSizes": [
        { "name": "Small", "slug": "small", "size": "0.5rem" }
      ]
    }
  },
  "styles": {},
  "templateParts": []
}
```

## Validation Steps

1. Check JSON syntax
2. Validate against schema
3. Verify all tokens used
4. Check responsive breakpoints
5. Validate theme variants

---

See theme-utils-validation.md for validation workflow.
