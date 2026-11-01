# WordPress Hero Block - Theme.json Integration & Validation

## Overview

The hero block must integrate properly with WordPress block theme architecture via `theme.json`. This document specifies schema requirements, validation procedures, and testing strategies.

---

## Part 1: Theme.json Schema Requirements

### 1.1 Block Theme Configuration

**Required theme.json structure for hero block**:

```json
{
  "$schema": "https://schemas.wp.org/wp/6.6/theme.json",
  "version": 3,
  
  "settings": {
    "blocks": {
      "namespace/hero-section": {
        "color": {
          "palette": []
        },
        "typography": {
          "fontSizes": [],
          "fontFamilies": []
        },
        "spacing": {
          "spacingScale": {}
        }
      }
    }
  },
  
  "styles": {
    "blocks": {
      "namespace/hero-section": {
        "color": {},
        "typography": {},
        "spacing": {},
        "border": {}
      }
    }
  }
}
```

### 1.2 Global Settings Referenced by Block

**Required global settings that hero block uses**:

```json
{
  "settings": {
    "color": {
      "palette": [
        {
          "name": "Black",
          "slug": "black",
          "color": "#000000"
        },
        {
          "name": "White", 
          "slug": "white",
          "color": "#FFFFFF"
        }
      ]
    },
    
    "typography": {
      "fontFamilies": [
        {
          "name": "Inter",
          "slug": "inter",
          "fontFamily": "'Inter', sans-serif",
          "fontFace": []
        }
      ],
      "fontSizes": [
        {
          "name": "Small",
          "slug": "small",
          "size": "1rem"
        },
        {
          "name": "Medium",
          "slug": "medium",
          "size": "1.25rem"
        },
        {
          "name": "Large",
          "slug": "large",
          "size": "2rem"
        },
        {
          "name": "Extra Large",
          "slug": "x-large",
          "size": "3rem"
        }
      ]
    },
    
    "spacing": {
      "spacingScale": {
        "operator": "*",
        "increment": 1.5,
        "steps": 7,
        "mediumStep": 3.5,
        "unit": "rem"
      }
    },
    
    "custom": {
      "breakpoints": {
        "mobile": "480px",
        "tablet": "768px",
        "desktop": "1024px",
        "wide": "1440px"
      }
    }
  }
}
```

---

## Part 2: Block-Specific Configuration

### 2.1 Block Settings Object

**Block hero-section settings**:

```json
{
  "settings": {
    "blocks": {
      "namespace/hero-section": {
        "color": {
          "defaultPalette": true,
          "duotone": true,
          "custom": false,
          "gradients": true,
          "palette": [
            {
              "name": "Overlay Dark",
              "slug": "overlay-dark",
              "color": "rgba(0, 0, 0, 0.7)"
            }
          ]
        },
        
        "typography": {
          "customFontSize": false,
          "fontSizes": [
            {
              "name": "Heading Large",
              "slug": "heading-large",
              "size": "clamp(1.5rem, 10vw, 3.5rem)"
            },
            {
              "name": "Heading Medium",
              "slug": "heading-medium", 
              "size": "clamp(1.25rem, 8vw, 2.5rem)"
            }
          ],
          "fontFamilies": [
            {
              "name": "Primary Serif",
              "slug": "primary-serif",
              "fontFamily": "'Georgia', serif"
            }
          ]
        },
        
        "spacing": {
          "spacingScale": {
            "operator": "*",
            "increment": 1.25,
            "steps": 5,
            "mediumStep": 2.5,
            "unit": "rem"
          },
          "customMargin": true,
          "customPadding": true
        }
      }
    }
  }
}
```

### 2.2 Block Styles Object

**CSS and style configuration for hero block**:

```json
{
  "styles": {
    "blocks": {
      "namespace/hero-section": {
        "color": {
          "text": "var(--wp-preset-color-white)",
          "background": "transparent"
        },
        
        "typography": {
          "fontFamily": "var(--wp-preset-font-family-primary-serif)",
          "fontSize": "var(--wp-preset-font-size-heading-large)",
          "fontWeight": "700",
          "lineHeight": "1.2",
          "letterSpacing": "0"
        },
        
        "spacing": {
          "margin": "0",
          "padding": "var(--wp-preset-spacing-30)"
        },
        
        "elements": {
          "heading": {
            "typography": {
              "fontFamily": "var(--wp-preset-font-family-primary-serif)",
              "fontSize": "var(--wp-preset-font-size-heading-large)",
              "fontWeight": "700",
              "lineHeight": "1.2"
            }
          },
          
          "paragraph": {
            "typography": {
              "fontSize": "var(--wp-preset-font-size-medium)",
              "lineHeight": "1.6",
              "letterSpacing": "0.02em"
            }
          },
          
          "link": {
            "color": {
              "text": "var(--wp-preset-color-white)"
            },
            ":hover": {
              "color": {
                "text": "var(--wp-preset-color-light-gray)"
              }
            },
            ":focus": {
              "outline": "3px solid var(--wp-preset-color-white)"
            }
          }
        }
      }
    }
  }
}
```

---

## Part 3: Responsive Design Configuration

### 3.1 Responsive Typography

**Fluid font sizing using theme.json**:

```json
{
  "settings": {
    "typography": {
      "fontSizes": [
        {
          "name": "Hero Heading",
          "slug": "hero-heading",
          "size": "clamp(1.5rem, 10vw, 4rem)",
          "fluid": true
        },
        {
          "name": "Section Heading",
          "slug": "section-heading",
          "size": "clamp(1.25rem, 8vw, 2.5rem)",
          "fluid": true
        },
        {
          "name": "Body Text",
          "slug": "body",
          "size": "clamp(0.875rem, 4vw, 1.125rem)",
          "fluid": true
        }
      ]
    }
  }
}
```

### 3.2 Custom Breakpoints

**Define theme breakpoints**:

```json
{
  "settings": {
    "custom": {
      "breakpoints": {
        "small": "480px",
        "medium": "768px",
        "large": "1024px",
        "extra-large": "1440px"
      }
    }
  }
}
```

### 3.3 Responsive Spacing

**Use spacing scale for responsive layouts**:

```json
{
  "styles": {
    "blocks": {
      "namespace/hero-section": {
        "spacing": {
          "padding": {
            "top": "var(--wp-preset-spacing-50)",
            "right": "var(--wp-preset-spacing-40)",
            "bottom": "var(--wp-preset-spacing-50)",
            "left": "var(--wp-preset-spacing-40)"
          }
        }
      }
    }
  }
}
```

---

## Part 4: Color Token Integration

### 4.1 Using Color Presets

**Hero block must use theme colors, not hardcoded colors**:

```css
/* GOOD - Uses CSS custom property from theme.json */
.wp-block-namespace-hero-section {
  background-color: var(--wp-preset-color-black);
  color: var(--wp-preset-color-white);
}

/* BAD - Hardcoded color */
.wp-block-namespace-hero-section {
  background-color: #000000;
  color: #FFFFFF;
}
```

### 4.2 Color Palette Definition

**Required colors in theme.json**:

```json
{
  "settings": {
    "color": {
      "palette": [
        {
          "name": "Primary",
          "slug": "primary",
          "color": "#0073aa"
        },
        {
          "name": "Secondary",
          "slug": "secondary",
          "color": "#6c63ff"
        },
        {
          "name": "Accent",
          "slug": "accent",
          "color": "#ff6b6b"
        },
        {
          "name": "Background",
          "slug": "background",
          "color": "#ffffff"
        },
        {
          "name": "Text",
          "slug": "text",
          "color": "#222222"
        },
        {
          "name": "Text Light",
          "slug": "text-light",
          "color": "#666666"
        },
        {
          "name": "Border",
          "slug": "border",
          "color": "#e0e0e0"
        }
      ],
      
      "gradients": [
        {
          "name": "Hero Overlay",
          "slug": "hero-overlay",
          "gradient": "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)"
        }
      ]
    }
  }
}
```

### 4.3 Duotone Filters

**Optional duotone support**:

```json
{
  "settings": {
    "color": {
      "duotone": [
        {
          "name": "Dark to Light",
          "slug": "dark-light",
          "colors": ["#222222", "#ffffff"]
        },
        {
          "name": "Purple to White",
          "slug": "purple-white",
          "colors": ["#6c63ff", "#ffffff"]
        }
      ]
    }
  }
}
```

---

## Part 5: Validation Procedures

### 5.1 JSON Schema Validation

**Validate theme.json against WordPress schema**:

```bash
# Install validator
npm install --save-dev ajv-cli

# Validate theme.json
ajv validate -s https://schemas.wp.org/wp/6.6/theme.json -d theme.json
```

**Test case: Valid theme.json**

```json
{
  "$schema": "https://schemas.wp.org/wp/6.6/theme.json",
  "version": 3,
  "settings": {
    "color": { "palette": [] },
    "typography": { "fontSizes": [] },
    "spacing": { "spacingScale": {} }
  },
  "styles": {}
}
```

**Expected result**: Valid ✓

### 5.2 Block Configuration Validation

**Checklist for block-specific settings**:

| Requirement | Test | Result |
|-----------|------|--------|
| Block namespace | `namespace/hero-section` exists | [ ] Pass [ ] Fail |
| Has color settings | `settings.blocks.namespace/hero-section.color` defined | [ ] Pass [ ] Fail |
| Has typography settings | `settings.blocks.namespace/hero-section.typography` defined | [ ] Pass [ ] Fail |
| Has spacing settings | `settings.blocks.namespace/hero-section.spacing` defined | [ ] Pass [ ] Fail |
| Has styles | `styles.blocks.namespace/hero-section` defined | [ ] Pass [ ] Fail |
| Color palette present | At least 1 color defined | [ ] Pass [ ] Fail |
| Font sizes present | At least 1 font size defined | [ ] Pass [ ] Fail |

### 5.3 CSS Custom Properties Validation

**Verify block CSS uses custom properties**:

```bash
# Find all hardcoded colors in block CSS
grep -r "color: #\|background: #\|background-color: #" blocks/hero/

# Expected result: Empty (no hardcoded colors)

# Verify custom properties are used
grep -r "var(--wp-preset" blocks/hero/

# Expected result: Multiple matches
```

### 5.4 Responsive Design Validation

**Test responsive behavior**:

| Breakpoint | Layout Test | Expected | Result |
|-----------|-------------|----------|--------|
| Mobile (480px) | Image full width, text below | [ ] Pass | __ |
| Tablet (768px) | Image + text side-by-side | [ ] Pass | __ |
| Desktop (1024px) | Full design layout | [ ] Pass | __ |

---

## Part 6: Testing Strategy

### 6.1 Theme.json Integration Tests (Jest)

```javascript
describe('Hero Block - Theme.json Integration', () => {
  let themeJson;

  beforeAll(() => {
    // Load theme.json
    themeJson = require('../theme.json');
  });

  test('theme.json is valid JSON', () => {
    expect(themeJson).toBeDefined();
  });

  test('block namespace defined in theme.json', () => {
    expect(themeJson.settings.blocks).toHaveProperty('namespace/hero-section');
  });

  test('block has color settings', () => {
    const heroSettings = themeJson.settings.blocks['namespace/hero-section'];
    expect(heroSettings).toHaveProperty('color');
  });

  test('block has typography settings', () => {
    const heroSettings = themeJson.settings.blocks['namespace/hero-section'];
    expect(heroSettings).toHaveProperty('typography');
  });

  test('block has spacing settings', () => {
    const heroSettings = themeJson.settings.blocks['namespace/hero-section'];
    expect(heroSettings).toHaveProperty('spacing');
  });

  test('color palette not empty', () => {
    const heroSettings = themeJson.settings.blocks['namespace/hero-section'];
    expect(heroSettings.color.palette.length).toBeGreaterThan(0);
  });

  test('font sizes not empty', () => {
    const heroSettings = themeJson.settings.blocks['namespace/hero-section'];
    expect(heroSettings.typography.fontSizes.length).toBeGreaterThan(0);
  });

  test('no hardcoded colors in block styles', () => {
    const blockStyles = themeJson.styles.blocks['namespace/hero-section'];
    const stylesJson = JSON.stringify(blockStyles);
    
    // Should not contain hex colors
    expect(stylesJson).not.toMatch(/#[0-9a-f]{3,6}/gi);
    
    // Should contain CSS custom properties
    expect(stylesJson).toContain('var(--wp-preset');
  });

  test('CSS custom properties are defined', () => {
    const globalColors = themeJson.settings.color.palette;
    const usedColors = findUsedCssVars(themeJson.styles);
    
    usedColors.forEach(colorVar => {
      expect(globalColors.some(p => 
        colorVar.includes(p.slug)
      )).toBe(true);
    });
  });
});
```

### 6.2 Playwright E2E Tests

```javascript
test.describe('Hero Block - Theme.json Applied', () => {
  test('block uses theme color', async ({ page }) => {
    await page.goto(pageUrl);
    
    const block = page.locator('.wp-block-namespace-hero-section');
    const computed = await block.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should be computed color, not CSS var
    expect(computed).not.toContain('var(');
    // Should have valid RGB value
    expect(computed).toMatch(/rgb\(/);
  });

  test('block uses theme typography', async ({ page }) => {
    await page.goto(pageUrl);
    
    const heading = page.locator('.wp-block-namespace-hero-section h2');
    const fontFamily = await heading.evaluate(el => {
      return window.getComputedStyle(el).fontFamily;
    });
    
    // Should have a font family set from theme
    expect(fontFamily).toBeTruthy();
  });

  test('responsive spacing applied', async ({ page }) => {
    // Test mobile
    await page.setViewportSize({ width: 480, height: 667 });
    await page.goto(pageUrl);
    
    const paddingMobile = await page.locator(
      '.wp-block-namespace-hero-section'
    ).evaluate(el => window.getComputedStyle(el).padding);
    
    // Test desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    const paddingDesktop = await page.locator(
      '.wp-block-namespace-hero-section'
    ).evaluate(el => window.getComputedStyle(el).padding);
    
    // Spacing should be different
    expect(paddingMobile).not.toEqual(paddingDesktop);
  });
});
```

### 6.3 BATS Shell Tests

```bash
@test "theme.json is valid JSON" {
  jq empty ./theme.json
  [ "$?" -eq 0 ]
}

@test "hero block in theme.json" {
  local has_hero=$(jq 'has("settings") and .settings | has("blocks")' ./theme.json)
  [ "$has_hero" = "true" ]
}

@test "block color palette not empty" {
  local palette=$(jq '.settings.blocks."namespace/hero-section".color.palette | length' ./theme.json)
  [ "$palette" -gt 0 ]
}

@test "block uses CSS custom properties" {
  local block_css=$(find ./blocks/hero -name "*.css" -o -name "*.scss")
  local has_vars=$(grep -c "var(--wp-preset" $block_css || echo 0)
  [ "$has_vars" -gt 0 ]
}

@test "no hardcoded colors in block CSS" {
  local block_css=$(find ./blocks/hero -name "*.css" -o -name "*.scss")
  local hardcoded=$(grep -c "color: #\|background: #" $block_css || echo 0)
  [ "$hardcoded" -eq 0 ]
}
```

---

## Part 7: Theme.json Validation Checklist

### Pre-Ship Validation

- [ ] theme.json is valid JSON
- [ ] Block namespace `namespace/hero-section` defined
- [ ] Block has color settings configured
- [ ] Block has typography settings configured
- [ ] Block has spacing settings configured
- [ ] Color palette defined with at least 3 colors
- [ ] Font sizes defined with heading and body options
- [ ] Spacing scale configured
- [ ] Breakpoints defined (mobile, tablet, desktop)
- [ ] Block CSS uses CSS custom properties (`var(--wp-preset-*)`)
- [ ] No hardcoded colors in block CSS
- [ ] No hardcoded font families in block CSS
- [ ] Responsive typography working (clamp() or fluid)
- [ ] Responsive spacing working
- [ ] Theme changes update block appearance
- [ ] All Jest theme.json tests pass
- [ ] All E2E theme.json tests pass
- [ ] All BATS theme.json tests pass
- [ ] Axe audit shows no color/contrast issues
- [ ] Lighthouse accessibility score ≥95

### Validation Command Checklist

```bash
# 1. Validate JSON structure
jq empty ./theme.json

# 2. Validate hero block config
jq '.settings.blocks."namespace/hero-section"' ./theme.json

# 3. Check for hardcoded values
grep -r "color: #" blocks/hero/ || echo "✓ No hardcoded colors"
grep -r "font-family:" blocks/hero/ | grep -v "var(" || echo "✓ Using CSS vars for fonts"

# 4. Run Jest tests
npm test -- --testPathPattern="theme-json"

# 5. Run E2E tests
npx playwright test --grep "theme"

# 6. Run BATS tests
bats tests/theme-json.bats

# 7. Run accessibility audit
npm run test:a11y

# 8. Check Lighthouse score
npm run lighthouse
```

---

## Part 8: Common Issues & Fixes

### Issue: Colors not updating when theme changes

**Problem**: Block shows hardcoded colors instead of theme colors

**Check**:
```bash
# Inspect CSS
grep -n "#" blocks/hero/style.scss

# Fix: Use CSS custom properties
# Before: color: #ffffff;
# After: color: var(--wp-preset-color-white);
```

### Issue: Typography not inheriting from theme

**Problem**: Block has its own font, doesn't use theme font

**Fix**:
```json
{
  "styles": {
    "blocks": {
      "namespace/hero-section": {
        "typography": {
          "fontFamily": "var(--wp-preset-font-family-primary)"
        }
      }
    }
  }
}
```

### Issue: Spacing not responsive

**Problem**: Block has fixed padding, not responsive to viewport

**Fix**:
```css
/* Before: Fixed spacing */
.wp-block-namespace-hero-section {
  padding: 2rem;
}

/* After: Responsive spacing */
.wp-block-namespace-hero-section {
  padding: var(--wp-preset-spacing-50);
}

@media (max-width: 768px) {
  .wp-block-namespace-hero-section {
    padding: var(--wp-preset-spacing-30);
  }
}
```

### Issue: Breakpoints not matching theme

**Problem**: Block breakpoints don't align with theme breakpoints

**Fix**:
```javascript
// Use theme breakpoints in CSS
@media (max-width: var(--custom-breakpoint-tablet)) {
  // tablet styles
}
```

---

## Part 9: Resources

### Documentation
- [WordPress Block Theme Handbook](https://developer.wordpress.org/themes/block-themes/)
- [theme.json Reference](https://developer.wordpress.org/themes/global-settings-and-styles/theme-json-reference/)
- [Global Settings & Styles](https://developer.wordpress.org/themes/global-settings-and-styles/)

### Validation Tools
- [JSON Schema Validator](https://www.jsonschemavalidator.com/)
- [ajv-cli](https://github.com/ajv-validator/ajv-cli)
- [WordPress Theme Validator](https://wordpress.org/plugins/theme-check/)

### Examples
- [WordPress Theme Experiments](https://github.com/WordPress/theme-experiments)
- [Twenty Twenty-Four](https://github.com/WordPress/twentytwentyfour)
- [Blockbase](https://github.com/Automattic/blockbase)

---

## Approval Sign-Off

**Block**: Hero Section (namespace/hero-section)  
**Date**: ___________  
**Validated By**: ___________  

- [ ] All theme.json requirements met
- [ ] All validation tests pass
- [ ] Colors use theme palette
- [ ] Typography uses theme presets
- [ ] Spacing uses theme scale
- [ ] Responsive breakpoints defined
- [ ] Ready for production

**Signed**: ___________  
**Approved**: ___________
