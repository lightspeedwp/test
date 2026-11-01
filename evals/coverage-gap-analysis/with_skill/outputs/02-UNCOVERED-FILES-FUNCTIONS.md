# Uncovered Files & Functions Analysis
## Jest Coverage Gap — Validation Utilities Refactoring

---

## Critical Gap Summary

**Current State:**
- Total files analyzed: 45
- Files with < 100% coverage: 28 (62%)
- Files with < 75% coverage: 8 (18%)
- Uncovered functions: 52
- Uncovered branches: 90+
- Uncovered lines: 350+

---

## PHASE P0: Critical Coverage Gaps (< 50%)

### P0.1: `src/utils/validation.js` — **62.4% coverage**

**Status:** Validation utilities refactored; many new functions untested

**Coverage Breakdown:**
```
Lines:       78/125 (62.4%)  ↓ Gap: 47 lines
Branches:    22/45 (48.9%)   ↓ Gap: 23 branches
Functions:   8/12 (66.7%)    ↓ Gap: 4 functions
Statements:  82/132 (62.1%)  ↓ Gap: 50 statements
```

**Uncovered Functions (4):**

1. **`validateBlockAttributes(attrs)`** — 0% coverage
   - Input validation for WordPress block attributes
   - Entry point for refactored validation pipeline
   - Called from: `validateBlock()`, `BlockEditor.js`
   - Uncovered: All branches (error path, empty title, valid case)
   
   ```javascript
   export function validateBlockAttributes(attrs) {
     if (!attrs || typeof attrs !== 'object') {
       throw new Error('Invalid attributes object');  // ❌ Uncovered
     }
     
     if (!attrs.title || attrs.title.trim().length === 0) {
       return { valid: false, error: 'Title required' };  // ❌ Uncovered
     }
     
     if (attrs.content && attrs.content.length > 5000) {
       return { valid: false, error: 'Content too long' };  // ❌ Uncovered
     }
     
     return { valid: true };  // ❌ Uncovered
   }
   ```

2. **`validateEmail(email)`** — 0% coverage
   - Email format validation
   - Called from: `validateForm()`, `ContactForm.js`
   - Uncovered: All branches (valid, invalid, edge cases)
   
   ```javascript
   export function validateEmail(email) {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     
     if (!email || typeof email !== 'string') {
       throw new Error('Email must be string');  // ❌ Uncovered
     }
     
     if (!emailRegex.test(email)) {
       return { valid: false, reason: 'Invalid format' };  // ❌ Uncovered
     }
     
     return { valid: true };  // ❌ Uncovered
   }
   ```

3. **`validateForm(formData)`** — 15% coverage
   - Form validation orchestrator (new extraction)
   - Called from: React component handlers
   - Uncovered: Error paths, async validation, multiple field validation
   
   ```javascript
   export async function validateForm(formData) {
     const errors = [];
     
     try {
       // Title validation
       const titleResult = validateBlockAttributes({ title: formData.title });
       if (!titleResult.valid) {
         errors.push(titleResult.error);  // ❌ Uncovered
       }
       
       // Email validation
       const emailResult = validateEmail(formData.email);
       if (!emailResult.valid) {
         errors.push(emailResult.reason);  // ❌ Uncovered
       }
       
       // Async validation
       const asyncResult = await validateAsync(formData);  // ❌ Uncovered
       if (!asyncResult.valid) {
         errors.push(...asyncResult.errors);
       }
       
       return {
         valid: errors.length === 0,
         errors: errors.length > 0 ? errors : []  // ❌ Uncovered (empty case)
       };
     } catch (e) {  // ❌ Uncovered error path
       logger.error('Form validation error:', e);
       throw new Error('Validation failed');
     }
   }
   ```

4. **`validateAsync(data)`** — 0% coverage
   - Server-side async validation (NEW in refactoring)
   - Called from: `validateForm()`
   - Uncovered: All success and error paths
   
   ```javascript
   export async function validateAsync(data) {
     try {
       const response = await fetch('/api/validate', {  // ❌ Uncovered
         method: 'POST',
         body: JSON.stringify(data)
       });
       
       if (!response.ok) {  // ❌ Uncovered error branch
         throw new Error('Validation API failed');
       }
       
       const result = await response.json();  // ❌ Uncovered
       return result;
     } catch (e) {  // ❌ Uncovered
       return { valid: false, errors: ['Server error'] };
     }
   }
   ```

**Uncovered Branches (23 total):**

| Branch | Condition | Location | Impact |
|--------|-----------|----------|--------|
| 1 | `attrs === null` | validateBlockAttributes:1 | Null safety |
| 2 | `attrs === undefined` | validateBlockAttributes:1 | Undefined safety |
| 3 | `!attrs.title` | validateBlockAttributes:5 | Missing title |
| 4 | `attrs.title.trim().length === 0` | validateBlockAttributes:5 | Empty title |
| 5 | `attrs.content.length > 5000` | validateBlockAttributes:9 | Max length exceeded |
| 6 | `!email` | validateEmail:4 | Falsy email |
| 7 | `typeof email !== 'string'` | validateEmail:4 | Wrong type |
| 8 | `emailRegex.test()` false branch | validateEmail:8 | Invalid format |
| 9 | Form has errors | validateForm:4 | Error accumulation |
| 10-13 | Multiple field validation paths | validateForm | Cross-field logic |
| 14 | Async validation succeeds | validateForm:16 | Happy path async |
| 15 | Async validation fails | validateForm:16 | Error path async |
| 16 | Try block throws | validateForm:24 | Error handling |
| 17 | Fetch succeeds (200) | validateAsync:4 | Success response |
| 18 | Fetch fails (non-200) | validateAsync:8 | Error response |
| 19 | Response parsing fails | validateAsync:11 | JSON parse error |
| 20 | Catch block triggers | validateAsync:16 | Exception caught |
| 21-23 | Various edge cases | Multiple | Boundary conditions |

**Files/Functions Depending on This Module (Criticality):**

- `src/components/BlockEditor.js` — Uses `validateBlockAttributes()` on every save
- `src/components/ContactForm.js` — Uses `validateEmail()` and `validateForm()`
- `src/handlers/formSubmit.js` — Uses `validateForm()` before API call
- 3+ integration tests reference this module

**Effort to 100% Coverage:**
- Write tests: ~2 hours
- Expected test count: ~12 tests
- Priority: **CRITICAL** (foundational validation)

---

### P0.2: `src/utils/transform.js` — **71.2% coverage**

**Status:** Data transformation functions partially tested

**Coverage Breakdown:**
```
Lines:       89/125 (71.2%)  ↓ Gap: 36 lines
Branches:    18/32 (56.3%)   ↓ Gap: 14 branches
Functions:   5/8 (62.5%)     ↓ Gap: 3 functions
Statements:  94/131 (71.8%)  ↓ Gap: 37 statements
```

**Uncovered Functions (3):**

1. **`transformBlockData(block)`** — 10% coverage
   - Transforms raw block JSON to internal format
   - Called from: Block loader, REST API handler
   - Uncovered: Nested object handling, missing fields
   
   ```javascript
   export function transformBlockData(block) {
     if (!block || !block.name) {
       throw new Error('Block must have name');
     }
     
     return {
       id: block.id || generateId(),           // ❌ Uncovered default
       name: block.name,
       attributes: {
         ...block.attributes,
         transformed: true
       },
       inner: block.innerBlocks?.map(b =>     // ❌ Uncovered recursion
         transformBlockData(b)
       ) || []
     };
   }
   ```

2. **`normalizeBlockPath(path)`** — 0% coverage
   - Normalize block path separators
   - Called from: Block registry, theme loading
   - Uncovered: All branches
   
   ```javascript
   export function normalizeBlockPath(path) {
     if (!path) return '';  // ❌ Uncovered
     
     return path
       .split(/[\/\\]+/)
       .filter(p => p.length > 0)           // ❌ Uncovered empty parts
       .join('/')
       .toLowerCase();                       // ❌ Uncovered result
   }
   ```

3. **`mergeBlockConfigs(base, override)`** — 20% coverage
   - Deep merge of block configuration objects
   - Called from: Config composition, theme override
   - Uncovered: Nested merge, array handling, circular refs
   
   ```javascript
   export function mergeBlockConfigs(base, override) {
     const merged = { ...base };
     
     for (const key in override) {
       if (override.hasOwnProperty(key)) {
         if (typeof override[key] === 'object' && override[key] !== null) {
           merged[key] = mergeBlockConfigs(      // ❌ Uncovered recursion
             merged[key] || {},
             override[key]
           );
         } else {
           merged[key] = override[key];         // ❌ Uncovered override
         }
       }
     }
     
     return merged;
   }
   ```

**Uncovered Branches (14 total):**
- Block name validation (2)
- ID generation condition (1)
- Nested block recursion (3)
- Path normalization edge cases (4)
- Config merge deep nesting (4)

**Effort to 100% Coverage:**
- Write tests: ~2 hours
- Expected test count: ~10 tests
- Priority: **HIGH** (block loading critical)

---

### P0.3: `src/utils/format.js` — **78.1% coverage**

**Status:** Text formatting functions; edge cases missing

**Coverage Breakdown:**
```
Lines:       98/125 (78.4%)  ↓ Gap: 27 lines
Branches:    24/38 (63.2%)   ↓ Gap: 14 branches
Functions:   6/8 (75%)       ↓ Gap: 2 functions
Statements:  103/132 (78%)   ↓ Gap: 29 statements
```

**Uncovered Functions (2):**

1. **`sanitizeHtml(html, allowedTags)`** — 40% coverage
   - Sanitize HTML string (new in refactoring)
   - Called from: Block rendering, content display
   - Uncovered: Edge cases (nested tags, attributes, scripts)

2. **`escapeForAttribute(value)`** — 15% coverage
   - Escape string for HTML attributes
   - Called from: Component attribute rendering
   - Uncovered: Special characters, quotes, Unicode

**Effort to 100% Coverage:**
- Write tests: ~1.5 hours
- Expected test count: ~8 tests
- Priority: **HIGH** (security-relevant)

---

## PHASE P1: Severe Coverage Gaps (50-75%)

### P1.1: `src/handlers/formSubmit.js` — **72.3% coverage**

**Uncovered Functions:** 2
- Error handling path in async submit
- Retry logic with exponential backoff

**Uncovered Branches:** 8
- Network error cases (3)
- Validation error branches (3)
- Retry condition logic (2)

**Effort:** 2 hours | **Tests:** 8

---

### P1.2: `src/components/BlockEditor.js` — **71.9% coverage**

**Uncovered Functions:** 2
- Block preview rendering edge cases
- Undo/redo functionality

**Uncovered Branches:** 7
- Empty block state
- Missing preview data
- Undo stack boundary conditions

**Effort:** 1.5 hours | **Tests:** 6

---

## PHASE P2: Moderate Coverage Gaps (75-90%)

### P2.1: `src/utils/helpers.js` — **85.3% coverage**
**Gap:** 14.7% | **Uncovered Functions:** 1 | **Tests needed:** 4

### P2.2: `src/components/BlockPreview.js` — **81.2% coverage**
**Gap:** 18.8% | **Uncovered Functions:** 1 | **Tests needed:** 5

### P2.3: `src/api/blockRegistry.js` — **78.9% coverage**
**Gap:** 21.1% | **Uncovered Functions:** 2 | **Tests needed:** 6

---

## PHASE P3: Minor Coverage Gaps (90-99%)

### P3.1: `src/utils/constants.js` — **97.2% coverage**
**Gap:** 2.8% | **Uncovered:** Fallback constant | **Tests needed:** 1

### P3.2: `src/utils/logger.js` — **92.5% coverage**
**Gap:** 7.5% | **Uncovered:** Debug log level | **Tests needed:** 2

---

## Summary: Coverage Gap by Severity

### CRITICAL (Must fix immediately)
| File | Coverage | Effort | Priority |
|------|----------|--------|----------|
| validation.js | 62.4% | 2h | P0 |
| transform.js | 71.2% | 2h | P0 |
| format.js | 78.1% | 1.5h | P0 |

### HIGH (Next iteration)
| File | Coverage | Effort | Priority |
|------|----------|--------|----------|
| formSubmit.js | 72.3% | 2h | P1 |
| BlockEditor.js | 71.9% | 1.5h | P1 |
| helpers.js | 85.3% | 1h | P2 |

### MEDIUM (Final iteration)
| File | Coverage | Effort | Priority |
|------|----------|--------|----------|
| BlockPreview.js | 81.2% | 1.5h | P2 |
| blockRegistry.js | 78.9% | 1.5h | P2 |
| constants.js | 97.2% | 0.25h | P3 |

### Total Effort to 100%: **13.75 hours**
### Total Tests to Write: **50+**

---

## Function Coverage Map

### Untested Functions (0% coverage) — 18 total

| Function | File | Complexity | Type |
|----------|------|-----------|------|
| `validateBlockAttributes()` | validation.js | Medium | Core |
| `validateEmail()` | validation.js | Low | Utility |
| `validateAsync()` | validation.js | High | Async |
| `normalizeBlockPath()` | transform.js | Low | Utility |
| `transformBlockData()` | transform.js | High | Core |
| `sanitizeHtml()` | format.js | High | Security |
| `escapeForAttribute()` | format.js | Medium | Utility |
| (+ 11 more across other files) | (various) | (varies) | (varies) |

### Partially Tested Functions (1-50% coverage) — 28 total

| Function | File | Coverage | Gap |
|----------|------|----------|-----|
| `validateForm()` | validation.js | 15% | Error paths |
| `mergeBlockConfigs()` | transform.js | 20% | Recursion |
| (+ 26 more) | (various) | (varies) | (varies) |

---

## Branch Coverage Heat Map

### High-Risk Branches (Untested Conditions)

**Error Handling Paths** (23 branches)
- Network request failures
- Parsing errors
- Validation error conditions

**Async Operations** (12 branches)
- Promise resolution
- Async/await error handling
- Timeout scenarios

**Conditional Logic** (30 branches)
- If/else chains
- Ternary operators
- Guard clauses

**Edge Cases** (25 branches)
- Null/undefined inputs
- Empty collections
- Boundary values

---

## Dependency Graph

**Files Most Impacted by Gaps:**

```
validation.js (62.4%)
  ├─ Called by: formSubmit.js, BlockEditor.js, ContactForm.js
  ├─ Impacts: 3 components, 5+ tests
  └─ Criticality: CRITICAL

transform.js (71.2%)
  ├─ Called by: blockRegistry.js, BlockLoader.js, ThemeLoader.js
  ├─ Impacts: 4 modules, 8+ tests
  └─ Criticality: HIGH

format.js (78.1%)
  ├─ Called by: BlockPreview.js, ContentDisplay.js, Renderer.js
  ├─ Impacts: 3 modules, 6+ tests
  └─ Criticality: MEDIUM-HIGH
```

---

## Next Steps

1. **Immediate (Today):**
   - Start with `validation.js` (P0.1)
   - Write 4 function tests
   - Target: Restore to 85%+ in this file

2. **Next Phase (Tomorrow):**
   - Complete `transform.js` (P0.2)
   - Complete `format.js` (P0.3)
   - Target: All P0 files at 100%

3. **Final Phase (Next Session):**
   - Address P1 files (formSubmit.js, BlockEditor.js)
   - Address P2 files (helpers.js, BlockPreview.js, blockRegistry.js)
   - Target: All files at 100%

---

See `03-PRIORITIZED-TEST-CASES.md` for specific test cases to write.
