# Prioritized Test Cases for Coverage Restoration
## From 72% to 100% Coverage

---

## PHASE P0: Critical Priority Tests

### 📋 Test Pack P0.1: `validateBlockAttributes()`

**Objective:** Achieve 100% coverage for block attribute validation  
**Complexity:** Low  
**Estimated Tests:** 5  
**Time Estimate:** 45 minutes  

**Test Cases:**

#### TC-P0.1.1: Valid block attributes return success

**Scenario:** Function receives valid block attributes object  
**Given:**
```javascript
{
  title: 'My Block',
  content: 'Block content here',
  id: 'block-123'
}
```
**When:** `validateBlockAttributes()` is called  
**Then:** Should return `{ valid: true }`  

**Coverage Impact:**
- Line: Return statement (100% to 100%)
- Branch: Valid case (0% to 100%)
- Function: Main path (0% to 60%)

---

#### TC-P0.1.2: Null attributes throws error

**Scenario:** Function receives null instead of object  
**Given:** `null` as attributes  
**When:** `validateBlockAttributes(null)` is called  
**Then:** Should throw error "Invalid attributes object"  

**Coverage Impact:**
- Line: Type check throw (0% to 100%)
- Branch: Null check (0% to 100%)
- Function: Error path (60% to 75%)

---

#### TC-P0.1.3: Undefined attributes throws error

**Scenario:** Function receives undefined  
**Given:** `undefined` as attributes  
**When:** `validateBlockAttributes(undefined)` is called  
**Then:** Should throw error "Invalid attributes object"  

**Coverage Impact:**
- Line: Type check (already covered by TC-P0.1.2)
- Branch: Undefined check (0% to 100%)
- Function: Error variance (75% to 80%)

---

#### TC-P0.1.4: Non-object attributes throws error

**Scenario:** Function receives scalar value  
**Given:** `'string'` as attributes  
**When:** `validateBlockAttributes('string')` is called  
**Then:** Should throw error "Invalid attributes object"  

**Coverage Impact:**
- Line: Type validation (already covered)
- Branch: Type-of check (0% to 100%)
- Function: Type safety (80% to 85%)

---

#### TC-P0.1.5: Empty/whitespace title returns validation error

**Scenario:** Block attributes has empty or whitespace-only title  
**Given:**
```javascript
{ title: '   ' }
```
**When:** `validateBlockAttributes()` is called  
**Then:** Should return `{ valid: false, error: 'Title required' }`  

**Coverage Impact:**
- Line: Trim/empty check (0% to 100%)
- Branch: Empty title condition (0% to 100%)
- Function: Validation logic (85% to 100%)

---

#### TC-P0.1.6: Missing title returns validation error

**Scenario:** Block attributes missing title field  
**Given:** `{ content: 'Some content' }`  
**When:** `validateBlockAttributes()` is called  
**Then:** Should return `{ valid: false, error: 'Title required' }`  

**Coverage Impact:**
- Line: Missing field handling (already covered by TC-P0.1.5)
- Branch: Missing field branch (0% to 100%)
- Function: Edge case (additional coverage)

---

#### TC-P0.1.7: Oversized content returns validation error

**Scenario:** Content exceeds 5000 character limit  
**Given:**
```javascript
{
  title: 'My Block',
  content: 'x'.repeat(5001)
}
```
**When:** `validateBlockAttributes()` is called  
**Then:** Should return `{ valid: false, error: 'Content too long' }`  

**Coverage Impact:**
- Line: Content length check (0% to 100%)
- Branch: Length exceeded condition (0% to 100%)
- Function: Boundary validation (additional coverage)

---

### 📋 Test Pack P0.2: `validateEmail()`

**Objective:** Achieve 100% coverage for email validation  
**Complexity:** Low  
**Estimated Tests:** 4  
**Time Estimate:** 30 minutes  

#### TC-P0.2.1: Valid email returns success

**Test Code:**
```javascript
test('validateEmail returns valid for correct format', () => {
  const result = validateEmail('user@example.com');
  expect(result.valid).toBe(true);
  expect(result.reason).toBeUndefined();
});
```

**Coverage:** Happy path (100%)

---

#### TC-P0.2.2: Missing email throws error

**Test Code:**
```javascript
test('validateEmail throws for missing email', () => {
  expect(() => validateEmail(null)).toThrow('Email must be string');
  expect(() => validateEmail(undefined)).toThrow('Email must be string');
});
```

**Coverage:** Null/undefined check (100%)

---

#### TC-P0.2.3: Wrong type throws error

**Test Code:**
```javascript
test('validateEmail throws for non-string input', () => {
  expect(() => validateEmail(123)).toThrow('Email must be string');
  expect(() => validateEmail({ email: 'user@test.com' })).toThrow();
});
```

**Coverage:** Type validation (100%)

---

#### TC-P0.2.4: Invalid format returns error

**Test Code:**
```javascript
test('validateEmail returns error for invalid formats', () => {
  const testCases = [
    'plaintext',
    'missing@domain',
    '@example.com',
    'user@',
    'user @example.com'
  ];
  
  testCases.forEach(email => {
    const result = validateEmail(email);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Invalid format');
  });
});
```

**Coverage:** Regex validation branches (100%)

---

### 📋 Test Pack P0.3: `validateForm()`

**Objective:** Achieve 100% coverage for form validation orchestration  
**Complexity:** High (async)  
**Estimated Tests:** 6  
**Time Estimate:** 1 hour  

#### TC-P0.3.1: Valid form passes validation

**Test Code:**
```javascript
test('validateForm passes with all valid fields', async () => {
  const formData = {
    title: 'Valid Title',
    email: 'user@example.com',
    content: 'Valid content'
  };
  
  jest.spyOn(module, 'validateAsync').mockResolvedValue({ valid: true });
  
  const result = await validateForm(formData);
  
  expect(result.valid).toBe(true);
  expect(result.errors).toEqual([]);
});
```

**Coverage:**
- Happy path (0% to 100%)
- No errors branch (0% to 100%)
- Function: Main flow (15% to 40%)

---

#### TC-P0.3.2: Invalid title accumulates error

**Test Code:**
```javascript
test('validateForm captures title validation error', async () => {
  const formData = {
    title: '',  // Invalid
    email: 'user@example.com'
  };
  
  jest.spyOn(module, 'validateAsync').mockResolvedValue({ valid: true });
  
  const result = await validateForm(formData);
  
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Title required');
});
```

**Coverage:**
- Title error branch (0% to 100%)
- Error accumulation (0% to 100%)
- Function: Error handling (40% to 60%)

---

#### TC-P0.3.3: Invalid email accumulates error

**Test Code:**
```javascript
test('validateForm captures email validation error', async () => {
  const formData = {
    title: 'Valid Title',
    email: 'invalid-email'
  };
  
  jest.spyOn(module, 'validateAsync').mockResolvedValue({ valid: true });
  
  const result = await validateForm(formData);
  
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Invalid format');
});
```

**Coverage:** Email error branch (0% to 100%)

---

#### TC-P0.3.4: Multiple validation errors accumulate

**Test Code:**
```javascript
test('validateForm accumulates multiple errors', async () => {
  const formData = {
    title: '',
    email: 'bad-email'
  };
  
  jest.spyOn(module, 'validateAsync').mockResolvedValue({ valid: true });
  
  const result = await validateForm(formData);
  
  expect(result.valid).toBe(false);
  expect(result.errors.length).toBe(2);
  expect(result.errors).toContain('Title required');
  expect(result.errors).toContain('Invalid format');
});
```

**Coverage:** Multiple field validation path (0% to 100%)

---

#### TC-P0.3.5: Async validation failure captured

**Test Code:**
```javascript
test('validateForm captures async validation failures', async () => {
  const formData = {
    title: 'Valid Title',
    email: 'user@example.com'
  };
  
  jest.spyOn(module, 'validateAsync').mockResolvedValue({
    valid: false,
    errors: ['Email already registered', 'Domain not whitelisted']
  });
  
  const result = await validateForm(formData);
  
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Email already registered');
  expect(result.errors).toContain('Domain not whitelisted');
});
```

**Coverage:**
- Async error path (0% to 100%)
- Error spreading (0% to 100%)
- Function: Async handling (60% to 85%)

---

#### TC-P0.3.6: Validation exception caught and re-thrown

**Test Code:**
```javascript
test('validateForm catches and re-throws validation errors', async () => {
  const formData = { title: 'Valid' };
  
  jest.spyOn(module, 'validateAsync').mockRejectedValue(
    new Error('Network error')
  );
  
  await expect(validateForm(formData)).rejects.toThrow('Validation failed');
  expect(logger.error).toHaveBeenCalledWith(
    'Form validation error:',
    expect.any(Error)
  );
});
```

**Coverage:**
- Try-catch error path (0% to 100%)
- Error logging (0% to 100%)
- Function: Exception handling (85% to 100%)

---

### 📋 Test Pack P0.4: `validateAsync()`

**Objective:** Achieve 100% coverage for server-side async validation  
**Complexity:** High (async, network)  
**Estimated Tests:** 5  
**Time Estimate:** 1 hour  

#### TC-P0.4.1: Successful validation response

**Test Code:**
```javascript
test('validateAsync returns validation result on success', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      valid: true,
      warnings: []
    })
  });
  
  const result = await validateAsync({ email: 'user@example.com' });
  
  expect(result.valid).toBe(true);
  expect(global.fetch).toHaveBeenCalledWith('/api/validate', {
    method: 'POST',
    body: JSON.stringify({ email: 'user@example.com' })
  });
});
```

**Coverage:**
- Fetch call (0% to 100%)
- Success branch (0% to 100%)
- JSON parsing (0% to 100%)
- Return success (0% to 100%)

---

#### TC-P0.4.2: Failed response (non-200) throws error

**Test Code:**
```javascript
test('validateAsync throws on failed response', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 400
  });
  
  await expect(validateAsync({})).rejects.toThrow('Validation API failed');
});
```

**Coverage:** Error response branch (0% to 100%)

---

#### TC-P0.4.3: Network error caught

**Test Code:**
```javascript
test('validateAsync returns error on network failure', async () => {
  global.fetch = jest.fn().mockRejectedValue(
    new Error('Network timeout')
  );
  
  const result = await validateAsync({});
  
  expect(result.valid).toBe(false);
  expect(result.errors).toEqual(['Server error']);
});
```

**Coverage:** Catch block (0% to 100%)

---

#### TC-P0.4.4: JSON parsing error caught

**Test Code:**
```javascript
test('validateAsync returns error on JSON parse failure', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockRejectedValue(
      new SyntaxError('Invalid JSON')
    )
  });
  
  const result = await validateAsync({});
  
  expect(result.valid).toBe(false);
  expect(result.errors).toEqual(['Server error']);
});
```

**Coverage:** Parse error scenario (0% to 100%)

---

#### TC-P0.4.5: Multiple async call sequencing

**Test Code:**
```javascript
test('validateAsync handles multiple sequential calls', async () => {
  const mockFetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ valid: true })
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ valid: false, errors: ['Error'] })
    });
  
  global.fetch = mockFetch;
  
  const result1 = await validateAsync({ email: 'user1@test.com' });
  const result2 = await validateAsync({ email: 'user2@test.com' });
  
  expect(result1.valid).toBe(true);
  expect(result2.valid).toBe(false);
  expect(mockFetch).toHaveBeenCalledTimes(2);
});
```

**Coverage:** Multiple call patterns (0% to 100%)

---

## PHASE P1: High Priority Tests

### 📋 Test Pack P1.1: `transformBlockData()`

**Objective:** 100% coverage for block data transformation  
**Complexity:** Medium (recursive)  
**Estimated Tests:** 4  
**Time Estimate:** 45 minutes  

#### TC-P1.1.1: Simple block transformation

```javascript
test('transformBlockData transforms simple block', () => {
  const block = {
    id: 'block-1',
    name: 'core/paragraph',
    attributes: { content: 'Hello' }
  };
  
  const result = transformBlockData(block);
  
  expect(result.id).toBe('block-1');
  expect(result.name).toBe('core/paragraph');
  expect(result.attributes.transformed).toBe(true);
  expect(result.inner).toEqual([]);
});
```

---

#### TC-P1.1.2: Block with ID generation

```javascript
test('transformBlockData generates ID when missing', () => {
  const block = {
    name: 'core/paragraph',
    attributes: { content: 'Hello' }
  };
  
  const result = transformBlockData(block);
  
  expect(result.id).toBeDefined();
  expect(result.id).toMatch(/^[a-z0-9-]+$/);
});
```

---

#### TC-P1.1.3: Nested blocks transformation (recursion)

```javascript
test('transformBlockData transforms nested blocks recursively', () => {
  const block = {
    id: 'parent',
    name: 'core/group',
    innerBlocks: [
      {
        name: 'core/paragraph',
        attributes: { content: 'Child 1' }
      },
      {
        name: 'core/paragraph',
        attributes: { content: 'Child 2' }
      }
    ]
  };
  
  const result = transformBlockData(block);
  
  expect(result.inner).toHaveLength(2);
  expect(result.inner[0].name).toBe('core/paragraph');
  expect(result.inner[0].attributes.transformed).toBe(true);
  expect(result.inner[1].name).toBe('core/paragraph');
});
```

---

#### TC-P1.1.4: Invalid block throws error

```javascript
test('transformBlockData throws for missing name', () => {
  expect(() => transformBlockData({})).toThrow('Block must have name');
  expect(() => transformBlockData(null)).toThrow();
  expect(() => transformBlockData(undefined)).toThrow();
});
```

---

## Summary: Test Implementation Priority

### Phase 1 (2 hours) — Start Today
1. ✅ **P0.1.1-P0.1.7:** validateBlockAttributes (5 tests) — 45 min
2. ✅ **P0.2.1-P0.2.4:** validateEmail (4 tests) — 30 min
3. ✅ **P0.3.1-P0.3.6:** validateForm (6 tests) — 1 hour (async complexity)
4. ✅ **P0.4.1-P0.4.5:** validateAsync (5 tests) — 1 hour (mocking fetch)

**Expected Coverage Gain:** 72% → 85%+ on P0 files

### Phase 2 (2 hours) — Next Session
1. ✅ **P1.1.1-P1.1.4:** transformBlockData (4 tests)
2. ✅ **P1.2.1-P1.2.4:** normalizeBlockPath (4 tests)
3. ✅ **P1.3.1-P1.3.4:** mergeBlockConfigs (4 tests)

**Expected Coverage Gain:** 75% → 90%+ on P1 files

### Phase 3 (1.5 hours) — Final Session
1. ✅ **P2.1:** Helper functions edge cases (4 tests)
2. ✅ **P2.2:** Component preview variants (3 tests)
3. ✅ **P2.3:** Registry edge cases (2 tests)

**Expected Final Coverage:** 90%+ → 100% globally

---

## Key Test Patterns

See `04-TEST-CASE-TEMPLATES.md` for reusable test templates and patterns.

