# Theme.json Validation Requirements - WordPress Hero Block

## Overview

This document specifies how the Hero Block integrates with WordPress theme.json for design token management, styling, and customization through the Site Editor.

---

## Part 1: Block Registration in theme.json

### 1.1 Block Entry Structure

The hero block must be registered in `theme.json` at the following path:

```json
{
  "version": 2,
  "settings": {
    "blocks": {
      "namespace/hero-section": {
        // Block settings here
      }
    }
  }
}
```

### 1.2 Required Block Metadata

**Validation Checklist:**

```json
{
  "version": 2,
  "$schema": "https://schemas.wp.org/wp/6.8/theme.json",
  "settings": {
    "blocks": {
      "namespace/hero-section": {
        "color": {
          "palette": [],
          "duotone": [],
          "text": true,
          "background": true,
          "defaultPalette": false
        },
        "spacing": {
          "padding": true,
          "margin": true,
          "units": ["px", "%", "em", "rem", "vw", "vh"]
        },
        "typography": {
          "fontSize": true,
          "fontFamily": true,
          "fontStyle": true,
          "fontWeight": true,
          "letterSpacing": true,
          "lineHeight": true,
          "textTransform": true,
          "textDecoration": true
        }
      }
    }
  }
}
```

**Validation Tests:**

| Field | Required | Type | Valid | Notes |
|-------|----------|------|-------|-------|
| `version` | Yes | Number | 2 | Schema version |
| `$schema` | No | String | Valid URI | Optional but recommended |
| `settings.blocks.namespace/hero-section` | Yes | Object | { } | Block configuration |
| `settings.blocks.*.color` | Yes | Object | { } | Color settings |
| `settings.blocks.*.spacing` | No | Object | { } | Spacing settings |
| `settings.blocks.*.typography` | Yes | Object | { } | Typography settings |

---

## Part 2: Color System Integration

### 2.1 Color Palette Configuration

**Validation Requirement:**

```json
{
  "settings": {
    "blocks": {
      "namespace/hero-section": {
        "color": {
          "palette": [
            {
              "color": "#FFFFFF",
              "name": "White",
              "slug": "white"
            },
            {
              "color": "#000000",
              "name": "Black",
              "slug": "black"
            },
            {
              "color": "#0073AA",
              "name": "Primary",
              "slug": "primary"
            }
          ],
          "defaultPalette": false
        }
      }
    }
  }
}
```

**Color Validation Checklist:**

- [ ] `color` object present under block settings
- [ ] `palette` array defined (can be empty to use global)
- [ ] Each palette item has: `color` (hex), `name` (string), `slug` (kebab-case)
- [ ] Color values are valid hex codes (#RRGGBB format)
- [ ] Color slugs are unique within palette
- [ ] Color names are user-friendly
- [ ] `defaultPalette` set to false to disable Core palette
- [ ] At least 1 color for text, 1 for backgrounds
- [ ] Overlay color (semi-transparent) supported

**Color Test Cases:**

```javascript
// Test: Colors are valid hex
const colorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
palette.forEach(item => {
  assert(colorRegex.test(item.color), `Invalid color: ${item.color}`);
});

// Test: Slugs are unique
const slugs = palette.map(item => item.slug);
const uniqueSlugs = new Set(slugs);
assert(slugs.length === uniqueSlugs.size, "Duplicate color slugs");

// Test: Slugs are kebab-case
palette.forEach(item => {
  assert(/^[a-z0-9-]+$/.test(item.slug), `Invalid slug: ${item.slug}`);
});
```

### 2.2 Color Application in Block CSS

**Validation Requirement:**

Block CSS must use CSS custom properties from theme.json:

```css
.wp-block-namespace-hero-section {
  background-color: var(--wp--preset--color--primary);
  color: var(--wp--preset--color--white);
}

.wp-block-namespace-hero-section__overlay {
  background-color: var(--wp--preset--color--primary);
  opacity: 0.7;
}
```

**CSS Variable Validation:**

- [ ] Color values reference `var(--wp--preset--color--{slug})`
- [ ] Variables match theme.json color slugs
- [ ] Fallback colors provided: `var(--wp--preset--color--primary, #0073AA)`
- [ ] No hardcoded color values (except for specific effects)
- [ ] Opacity/alpha handled separately from color variable

### 2.3 Color Customization in Site Editor

**Validation Checklist:**

- [ ] Colors editable in Appearance > Colors
- [ ] Block color controls visible in Site Editor
- [ ] Text color picker works
- [ ] Background color picker works
- [ ] Overlay color picker available
- [ ] Color changes reflect immediately
- [ ] Custom colors saved to post/block attributes

---

## Part 3: Typography System Integration

### 3.1 Font Family Configuration

**Validation Requirement:**

```json
{
  "settings": {
    "typography": {
      "fontFamilies": [
        {
          "fontFamily": "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          "name": "System",
          "slug": "system"
        },
        {
          "fontFamily": "'Georgia', 'Times New Roman', serif",
          "name": "Serif",
          "slug": "serif"
        }
      ]
    },
    "blocks": {
      "namespace/hero-section": {
        "typography": {
          "fontFamily": true
        }
      }
    }
  }
}
```

**Font Family Validation:**

- [ ] `fontFamilies` array present in theme settings
- [ ] Each item has: `fontFamily` (string), `name` (string), `slug` (kebab-case)
- [ ] Font families are valid CSS (quoted, comma-separated)
- [ ] Fallback font stack included (e.g., `sans-serif` at end)
- [ ] Font URLs use HTTPS if external
- [ ] Font display strategy defined: `font-display: swap`
- [ ] Limited to 2-3 font families for performance
- [ ] Block can select from available fonts

**Font Family Test Cases:**

```javascript
// Test: Valid CSS font-family
const fontFamilyRegex = /^[^,]+(,[^,]+)*$/;
fontFamilies.forEach(item => {
  assert(fontFamilyRegex.test(item.fontFamily), `Invalid: ${item.fontFamily}`);
});

// Test: Fallback stack present
fontFamilies.forEach(item => {
  assert(
    item.fontFamily.includes('serif') || 
    item.fontFamily.includes('sans-serif') ||
    item.fontFamily.includes('monospace'),
    `No fallback in: ${item.fontFamily}`
  );
});
```

### 3.2 Font Size Configuration

**Validation Requirement:**

```json
{
  "settings": {
    "typography": {
      "fontSizes": [
        {
          "fontSize": "0.875rem",
          "name": "Small",
          "slug": "small"
        },
        {
          "fontSize": "1rem",
          "name": "Normal",
          "slug": "normal"
        },
        {
          "fontSize": "1.5rem",
          "name": "Large",
          "slug": "large"
        },
        {
          "fontSize": "2.5rem",
          "name": "Extra Large",
          "slug": "x-large"
        }
      ]
    },
    "blocks": {
      "namespace/hero-section": {
        "typography": {
          "fontSize": true
        }
      }
    }
  }
}
```

**Font Size Validation:**

- [ ] `fontSizes` array contains 3-7 sizes
- [ ] Each size has: `fontSize` (string), `name` (string), `slug` (kebab-case)
- [ ] Font sizes use relative units (rem, em) or pixels
- [ ] Minimum 14px for body text (1rem base)
- [ ] Heading sizes >= 24px for AAA accessibility
- [ ] Sizes progress logically (small -> large)
- [ ] Block can override font sizes

**Font Size Test Cases:**

```javascript
// Test: Valid CSS values
fontSizes.forEach(item => {
  const value = item.fontSize;
  assert(
    /^\d+(\.\d+)?(rem|em|px|%)$/.test(value),
    `Invalid fontSize: ${value}`
  );
});

// Test: Minimum size >= 14px
fontSizes.forEach(item => {
  const pxValue = convertToPixels(item.fontSize);
  assert(pxValue >= 12, `Font too small: ${item.fontSize}`);
});

// Test: Heading sizes readable
const largeSizes = fontSizes.filter(s => s.slug.includes('large'));
largeSizes.forEach(item => {
  const pxValue = convertToPixels(item.fontSize);
  assert(pxValue >= 20, `Heading too small: ${item.fontSize}`);
});
```

### 3.3 Line Height & Letter Spacing

**Validation Requirement:**

```json
{
  "settings": {
    "typography": {
      "lineHeight": true,
      "letterSpacing": true
    },
    "blocks": {
      "namespace/hero-section": {
        "typography": {
          "lineHeight": true,
          "letterSpacing": true
        }
      }
    }
  }
}
```

**Typography Spacing Validation:**

- [ ] `lineHeight` enabled (true)
- [ ] `letterSpacing` enabled (true)
- [ ] Default line-height >= 1.5
- [ ] Default letter-spacing >= 0.12em
- [ ] CSS includes: `line-height: 1.5; letter-spacing: 0.12em;`

---

## Part 4: Spacing System Integration

### 4.1 Spacing Scale Configuration

**Validation Requirement:**

```json
{
  "settings": {
    "spacing": {
      "padding": true,
      "margin": true,
      "spacingScale": {
        "operator": "*",
        "increment": 1.5,
        "steps": 7,
        "medianStep": 4,
        "unit": "rem"
      },
      "spacingSizes": [
        {
          "size": "0",
          "name": "None",
          "slug": "none"
        },
        {
          "size": "0.5rem",
          "name": "X-Small",
          "slug": "x-small"
        },
        {
          "size": "1rem",
          "name": "Small",
          "slug": "small"
        },
        {
          "size": "1.5rem",
          "name": "Medium",
          "slug": "medium"
        },
        {
          "size": "2rem",
          "name": "Large",
          "slug": "large"
        }
      ]
    },
    "blocks": {
      "namespace/hero-section": {
        "spacing": {
          "padding": true,
          "margin": true
        }
      }
    }
  }
}
```

**Spacing Validation:**

- [ ] `spacingSizes` array defined (3-7 sizes)
- [ ] Each size has: `size` (string), `name` (string), `slug` (kebab-case)
- [ ] Sizes use consistent units (rem or px)
- [ ] Sizes increase logically (additive or multiplicative)
- [ ] Padding controls available
- [ ] Margin controls available
- [ ] Block respects spacing scale
- [ ] Responsive spacing supported

**Spacing Test Cases:**

```javascript
// Test: Valid CSS values
spacingSizes.forEach(item => {
  assert(/^\d+(\.\d+)?(rem|em|px|%)?$/.test(item.size), `Invalid: ${item.size}`);
});

// Test: Sizes increase
for (let i = 0; i < spacingSizes.length - 1; i++) {
  const current = convertToPixels(spacingSizes[i].size);
  const next = convertToPixels(spacingSizes[i + 1].size);
  assert(current <= next, "Spacing sizes not in ascending order");
}

// Test: Reasonable increments (0.5-2x multiplier)
for (let i = 0; i < spacingSizes.length - 1; i++) {
  const ratio = convertToPixels(spacingSizes[i + 1].size) / convertToPixels(spacingSizes[i].size);
  assert(ratio >= 1 && ratio <= 2.5, `Spacing ratio extreme: ${ratio}`);
}
```

### 4.2 CSS Variable Application

**Validation Requirement:**

```css
.wp-block-namespace-hero-section {
  padding: var(--wp--preset--spacing--medium);
  margin: var(--wp--preset--spacing--large);
}

.wp-block-namespace-hero-section__content {
  padding: var(--wp--preset--spacing--small);
}
```

**Spacing CSS Validation:**

- [ ] Spacing uses `var(--wp--preset--spacing--{slug})`
- [ ] All custom spacing references theme.json slugs
- [ ] Fallback values provided
- [ ] No hardcoded spacing values (except calculated)
- [ ] Responsive padding/margin considered

---

## Part 5: Border Radius Configuration

**Validation Requirement:**

```json
{
  "settings": {
    "border": {
      "radius": true
    },
    "blocks": {
      "namespace/hero-section": {
        "border": {
          "radius": true
        }
      }
    }
  }
}
```

**Border Radius Validation:**

- [ ] `border.radius` enabled (true)
- [ ] Block supports rounded corners
- [ ] Radius values in range 0-50px
- [ ] Site Editor control available
- [ ] CSS applies: `border-radius: var(--wp--style--border--radius)`

---

## Part 6: Responsive Breakpoints

**Validation Requirement:**

```json
{
  "settings": {
    "layout": {
      "contentSize": "620px",
      "wideSize": "1200px"
    }
  },
  "styles": {
    "blocks": {
      "namespace/hero-section": {
        "typography": {
          "fontSize": "2rem"
        }
      }
    }
  }
}
```

**Responsive Breakpoint Validation:**

| Breakpoint | Width | Test | Pass |
|-----------|-------|------|------|
| Mobile | 375px | [ ] | [ ] |
| Tablet | 768px | [ ] | [ ] |
| Desktop | 1024px | [ ] | [ ] |
| Wide | 1200px | [ ] | [ ] |

**Responsive Design Tests:**

- [ ] Block layout adapts at 375px
- [ ] Block layout adapts at 768px
- [ ] Block layout adapts at 1024px
- [ ] Font sizes scale on mobile
- [ ] Spacing scales on mobile
- [ ] Images scale responsively
- [ ] Text overlay positioned correctly at all widths

---

## Part 7: Site Editor Integration

### 7.1 Block Settings Panel

**Validation Checklist:**

The block must show controls in the Site Editor inspector:

- [ ] Color tab visible in inspector
  - [ ] Text color picker
  - [ ] Background color picker
  - [ ] Overlay color/opacity slider
- [ ] Typography tab visible
  - [ ] Font family selector
  - [ ] Font size selector
  - [ ] Line height control
- [ ] Spacing tab visible
  - [ ] Padding controls
  - [ ] Margin controls
- [ ] Border tab visible (if applicable)
  - [ ] Border radius slider
- [ ] Advanced tab available
  - [ ] Additional CSS class input

### 7.2 Block Editing Experience

**Validation Tests:**

```typescript
test('Site Editor: Color controls visible', async ({ page }) => {
  await page.goto(`${WP_HOME}/wp-admin/site-editor.php`);
  
  // Select hero block
  await page.click('[data-type="namespace/hero-section"]');
  
  // Open color settings
  const colorTab = await page.$('[role="tab"]:has-text("Color")');
  expect(colorTab).toBeTruthy();
  
  // Check controls
  const bgColorPicker = await page.$('input[type="color"]');
  expect(bgColorPicker).toBeTruthy();
});

test('Site Editor: Theme colors applied', async ({ page }) => {
  // Colors should reflect current theme.json palette
  const colorOptions = await page.locator('[role="button"][style*="background"]').all();
  expect(colorOptions.length).toBeGreaterThan(0);
});

test('Site Editor: Changes persist', async ({ page }) => {
  // Change a setting
  const colorPicker = await page.$('input[type="color"]');
  await colorPicker?.fill('#FF0000');
  
  // Reload
  await page.reload();
  
  // Should still be there
  const savedColor = await colorPicker?.inputValue();
  expect(savedColor).toBe('#FF0000');
});
```

---

## Part 8: Block Supports Array

**Validation Requirement:**

The block.json `supports` array must align with theme.json capabilities:

```json
{
  "supports": {
    "align": ["wide", "full"],
    "anchor": true,
    "className": true,
    "color": {
      "background": true,
      "text": true,
      "defaultPalette": false
    },
    "spacing": {
      "padding": true,
      "margin": true
    },
    "typography": {
      "fontSize": true,
      "fontFamily": true,
      "lineHeight": true,
      "letterSpacing": true
    },
    "border": {
      "radius": true
    }
  }
}
```

**Supports Validation:**

- [ ] `supports.align` includes at least "wide"
- [ ] `supports.color` matches theme.json color settings
- [ ] `supports.spacing` matches theme.json spacing settings
- [ ] `supports.typography` matches theme.json typography settings
- [ ] `supports.border` if theme has border settings
- [ ] No unsupported features in theme.json

---

## Part 9: Custom Block Styles (style.json)

**Validation Requirement:**

If using registered block styles:

```json
{
  "styles": [
    {
      "name": "default",
      "label": "Default"
    },
    {
      "name": "dark",
      "label": "Dark Overlay"
    }
  ]
}
```

**Block Styles Validation:**

- [ ] Each style has unique `name` (kebab-case)
- [ ] Each style has user-friendly `label`
- [ ] Styles have corresponding CSS class
- [ ] CSS class names: `.is-style-{name}`
- [ ] Styles don't duplicate block.json settings
- [ ] Maximum 5 styles (avoid UI bloat)

---

## Part 10: Validation Test Suite

### 10.1 JSON Schema Validation

```bash
# Validate theme.json against schema
npm install -g @wordpress/scripts

wp-scripts validate-theme theme.json
```

**Expected Output:**
```
✓ theme.json is valid according to the schema
```

**Validation Checklist:**

- [ ] `wp-scripts validate-theme` passes
- [ ] No schema validation errors
- [ ] All required fields present
- [ ] Data types match schema

### 10.2 PHP Validation

```php
<?php
// Verify block registration
$registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
assert( isset( $registered_blocks['namespace/hero-section'] ) );

// Verify theme.json loaded
$settings = wp_get_global_settings();
assert( isset( $settings['blocks']['namespace/hero-section'] ) );

// Verify color palette
$colors = $settings['blocks']['namespace/hero-section']['color']['palette'];
assert( count( $colors ) > 0 );
?>
```

### 10.3 JavaScript Validation

```javascript
// Verify theme settings accessible
const { useSelect } = wp.data;
const settings = useSelect( select => 
  select( 'core/block-editor' ).getSettings()
);

console.assert(
  settings.colors !== undefined,
  'Colors not accessible in block editor'
);

console.assert(
  settings.fontSizes !== undefined,
  'Font sizes not accessible in block editor'
);
```

---

## Part 11: Performance Validation

**Validation Checklist:**

- [ ] theme.json file size < 100KB (uncompressed)
- [ ] Color palette < 20 colors
- [ ] Font families < 5
- [ ] Font sizes < 10
- [ ] Spacing sizes < 10
- [ ] No duplicate entries
- [ ] CSS variables generated efficiently
- [ ] Block editor loads < 3 seconds

**Performance Test:**

```bash
# Measure theme.json size
wc -c theme.json

# Expected output: ~20000 bytes

# Check for duplicates
jq '.settings.blocks | group_by(.name) | map(select(length > 1))' theme.json
```

---

## Part 12: Browser Compatibility

**Validation Checklist:**

- [ ] CSS custom properties work in Chrome 49+
- [ ] CSS custom properties work in Firefox 31+
- [ ] CSS custom properties work in Safari 9.1+
- [ ] Fallback values provided for legacy browsers
- [ ] No CSS Grid (use Flexbox for IE11 compatibility if needed)

---

## Part 13: Validation Checklist Template

**Run through before release:**

```markdown
## Theme.json Validation Checklist

### Block Registration
- [ ] Block registered in `settings.blocks.namespace/hero-section`
- [ ] All required fields present

### Colors
- [ ] Color palette defined with hex values
- [ ] Color slugs unique and kebab-case
- [ ] CSS uses `var(--wp--preset--color--{slug})`
- [ ] Text contrast >= 7:1 (AAA)
- [ ] Focus indicator contrast >= 3:1

### Typography
- [ ] Font families defined
- [ ] Font sizes defined (3-7 sizes)
- [ ] Line height >= 1.5
- [ ] Letter spacing >= 0.12em
- [ ] CSS uses font-family variables

### Spacing
- [ ] Spacing sizes defined (3-7 sizes)
- [ ] Padding controls enabled
- [ ] Margin controls enabled
- [ ] CSS uses spacing variables

### Responsiveness
- [ ] Tested at 375px width
- [ ] Tested at 768px width
- [ ] Tested at 1024px width

### Site Editor
- [ ] Color controls visible and functional
- [ ] Typography controls visible and functional
- [ ] Spacing controls visible and functional
- [ ] Changes persist after save

### Validation
- [ ] `wp-scripts validate-theme` passes
- [ ] No console errors in Site Editor
- [ ] No console errors on frontend
- [ ] JSON Schema validation passes

### Performance
- [ ] theme.json < 100KB
- [ ] Block editor loads quickly
- [ ] No layout shifts on load

**Validation Date:** ________________
**Approved:** [ ] Yes [ ] No
**Reviewer:** ________________
```

---

## Part 14: Common Validation Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Invalid theme.json schema" | Syntax error in JSON | Run through JSON validator, fix commas/braces |
| "Color values are invalid" | Non-hex color codes | Change to #RRGGBB format |
| "Duplicate color slugs" | Same slug used twice | Rename slugs to be unique |
| "CSS variables not applying" | Wrong variable name | Verify slug matches `var(--wp--preset--color--{slug})` |
| "Site Editor controls missing" | `supports` array missing | Add required entries to block.json `supports` |
| "Theme.json not loaded" | File path incorrect | Verify `wp_get_global_settings()` returns data |
| "Colors not showing in picker" | `defaultPalette: false` with empty palette | Set `defaultPalette: true` OR add colors |

---

## Resources

- **WordPress Theme.json Schema:** https://schemas.wp.org/wp/6.8/theme.json
- **Design Token Docs:** https://make.wordpress.org/core/2023/07/20/design-tokens/
- **Theme.json Reference:** https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/
- **Block Supports:** https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/
- **Color Accessibility:** https://webaim.org/resources/contrastchecker/

---

**Document Version:** 1.0  
**Last Updated:** 2026-10-30  
**WordPress Version:** 6.4+  
**PHP Version:** 8.0+
