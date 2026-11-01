# Test Case Templates & Patterns
## Reusable Test Patterns for Jest Coverage Restoration

---

## Template 1: Input Validation Testing

### Pattern: Testing Type & Null Checks

**Use Case:** Functions with input parameter validation  
**Coverage Gain:** Error path branches, guard clauses  
**Complexity:** Low  

#### Template Code:

```javascript
/**
 * Template: Input Validation Tests
 * Use this for functions that validate their inputs
 */
describe('functionName - Input Validation', () => {
  
  // Template: Null input
  test('throws error when input is null', () => {
    expect(() => functionName(null))
      .toThrow('Expected error message');
  });
  
  // Template: Undefined input
  test('throws error when input is undefined', () => {
    expect(() => functionName(undefined))
      .toThrow('Expected error message');
  });
  
  // Template: Wrong type (string)
  test('throws error for wrong type (string)', () => {
    expect(() => functionName('string'))
      .toThrow('Expected error message');
  });
  
  // Template: Wrong type (number)
  test('throws error for wrong type (number)', () => {
    expect(() => functionName(123))
      .toThrow('Expected error message');
  });
  
  // Template: Wrong type (object)
  test('throws error for wrong type (object)', () => {
    expect(() => functionName({ key: 'value' }))
      .toThrow('Expected error message');
  });
  
  // Template: Wrong type (array)
  test('throws error for wrong type (array)', () => {
    expect(() => functionName([1, 2, 3]))
      .toThrow('Expected error message');
  });
});
```

#### Application Example:

```javascript
describe('validateBlockAttributes - Input Validation', () => {
  
  test('throws error when input is null', () => {
    expect(() => validateBlockAttributes(null))
      .toThrow('Invalid attributes object');
  });
  
  test('throws error when input is undefined', () => {
    expect(() => validateBlockAttributes(undefined))
      .toThrow('Invalid attributes object');
  });
  
  test('throws error for string input', () => {
    expect(() => validateBlockAttributes('not-an-object'))
      .toThrow('Invalid attributes object');
  });
  
  test('throws error for number input', () => {
    expect(() => validateBlockAttributes(42))
      .toThrow('Invalid attributes object');
  });
});
```

---

## Template 2: Conditional Branch Testing

### Pattern: Testing If/Else Logic

**Use Case:** Functions with multiple conditional branches  
**Coverage Gain:** Branch coverage, else paths  
**Complexity:** Low-Medium  

#### Template Code:

```javascript
describe('functionName - Conditional Branches', () => {
  
  // Template: Test condition TRUE
  test('returns expected value when condition is true', () => {
    const result = functionName(/* args that make condition TRUE */);
    expect(result).toEqual(expectedValue);
  });
  
  // Template: Test condition FALSE
  test('returns expected value when condition is false', () => {
    const result = functionName(/* args that make condition FALSE */);
    expect(result).toEqual(expectedValue);
  });
  
  // Template: Test ELSE branch
  test('returns error value in else case', () => {
    const result = functionName(/* args for else path */);
    expect(result.error).toBeDefined();
    expect(result.valid).toBe(false);
  });
});
```

#### Application Example:

```javascript
describe('validateEmail - Conditional Branches', () => {
  
  test('returns valid result for correct email format', () => {
    const result = validateEmail('user@example.com');
    expect(result.valid).toBe(true);
  });
  
  test('returns error when email missing @', () => {
    const result = validateEmail('userexample.com');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Invalid format');
  });
  
  test('returns error when email missing domain extension', () => {
    const result = validateEmail('user@example');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Invalid format');
  });
});
```

---

## Template 3: Error Path Testing

### Pattern: Testing Exception Handling

**Use Case:** Functions with try/catch blocks  
**Coverage Gain:** Catch blocks, error handlers  
**Complexity:** Medium  

#### Template Code:

```javascript
describe('functionName - Error Handling', () => {
  
  beforeEach(() => {
    // Mock dependencies that might throw
    jest.spyOn(global, 'fetch');
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  // Template: Function throws when dependency fails
  test('throws error when dependency operation fails', () => {
    // Mock dependency to throw
    jest.spyOn(module, 'dependencyFunction')
      .mockImplementation(() => {
        throw new Error('Dependency failed');
      });
    
    expect(() => functionName())
      .toThrow('Error message');
  });
  
  // Template: Function catches and handles error
  test('catches error and logs it', () => {
    jest.spyOn(fs, 'readFileSync')
      .mockImplementation(() => {
        throw new Error('File not found');
      });
    
    // Depending on function behavior...
    const result = functionName();
    
    expect(console.error).toHaveBeenCalled();
    // or expect result to indicate error
  });
});
```

#### Application Example:

```javascript
describe('validateForm - Error Handling', () => {
  
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('throws when async validation throws', async () => {
    jest.spyOn(module, 'validateAsync')
      .mockRejectedValue(new Error('Network error'));
    
    await expect(validateForm({ title: 'Test' }))
      .rejects.toThrow('Validation failed');
  });
  
  test('catches validation error and logs it', async () => {
    jest.spyOn(module, 'validateAsync')
      .mockRejectedValue(new Error('API unavailable'));
    
    try {
      await validateForm({ title: 'Test' });
    } catch (e) {
      expect(console.error).toHaveBeenCalledWith(
        'Form validation error:',
        expect.any(Error)
      );
    }
  });
});
```

---

## Template 4: Async/Await Testing

### Pattern: Testing Async Functions & Promises

**Use Case:** Async functions, Promise handling  
**Coverage Gain:** Async paths, Promise resolution/rejection  
**Complexity:** High  

#### Template Code:

```javascript
describe('asyncFunctionName - Async Operations', () => {
  
  // Template: Happy path async
  test('resolves successfully with valid input', async () => {
    const result = await asyncFunctionName(validInput);
    
    expect(result).toEqual(expectedValue);
  });
  
  // Template: Mock successful async dependency
  test('resolves when dependency succeeds', async () => {
    jest.spyOn(module, 'asyncDependency')
      .mockResolvedValue({ success: true, data: 'result' });
    
    const result = await asyncFunctionName();
    
    expect(result.success).toBe(true);
  });
  
  // Template: Reject case
  test('rejects when dependency fails', async () => {
    jest.spyOn(module, 'asyncDependency')
      .mockRejectedValue(new Error('Dependency failed'));
    
    await expect(asyncFunctionName())
      .rejects.toThrow('Dependency failed');
  });
  
  // Template: Timeout handling (if applicable)
  test('times out after specified delay', async () => {
    jest.useFakeTimers();
    
    const promise = asyncFunctionName();
    jest.advanceTimersByTime(5000);
    
    await expect(promise).rejects.toThrow('Timeout');
    jest.useRealTimers();
  });
});
```

#### Application Example:

```javascript
describe('validateAsync - Async Operations', () => {
  
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('resolves with validation result on success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ valid: true })
    });
    
    const result = await validateAsync({ email: 'test@test.com' });
    
    expect(result.valid).toBe(true);
  });
  
  test('rejects when fetch fails', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    
    const result = await validateAsync({});
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Server error');
  });
  
  test('rejects when response is not ok', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400
    });
    
    await expect(validateAsync({}))
      .rejects.toThrow('Validation API failed');
  });
});
```

---

## Template 5: Mocking Dependencies

### Pattern: Mock Objects, Functions, and External APIs

**Use Case:** Testing with mocked dependencies  
**Coverage Gain:** All code paths that depend on mocks  
**Complexity:** Medium-High  

#### Template Code:

```javascript
// Template: Mock module function
jest.spyOn(module, 'functionToMock').mockImplementation(() => {
  return mockReturnValue;
});

// Template: Mock resolved value (for async)
jest.spyOn(module, 'asyncFunction').mockResolvedValue({
  success: true,
  data: 'mock data'
});

// Template: Mock rejected value (for async)
jest.spyOn(module, 'asyncFunction').mockRejectedValue(
  new Error('Mock error')
);

// Template: Mock with multiple return values
jest.spyOn(module, 'function').mockImplementationOnce(returnsFirstValue)
  .mockImplementationOnce(returnsSecondValue);

// Template: Mock object property
const mockObject = {
  property: 'original value',
  method: jest.fn().mockReturnValue('mock value')
};

// Template: Mock fetch API
global.fetch = jest.fn()
  .mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ key: 'value' })
  });

// Template: Verify mock was called
expect(module.mockedFunction).toHaveBeenCalled();
expect(module.mockedFunction).toHaveBeenCalledWith(expectedArg);
expect(module.mockedFunction).toHaveBeenCalledTimes(1);
```

#### Application Example:

```javascript
describe('validateForm - With Mocked Dependencies', () => {
  
  beforeEach(() => {
    // Mock all validation functions
    jest.spyOn(module, 'validateBlockAttributes')
      .mockReturnValue({ valid: true });
    
    jest.spyOn(module, 'validateEmail')
      .mockReturnValue({ valid: true });
    
    jest.spyOn(module, 'validateAsync')
      .mockResolvedValue({ valid: true });
    
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('calls all validation functions', async () => {
    const formData = {
      title: 'Test',
      email: 'test@test.com'
    };
    
    await validateForm(formData);
    
    expect(module.validateBlockAttributes).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Test' })
    );
    expect(module.validateEmail).toHaveBeenCalledWith('test@test.com');
    expect(module.validateAsync).toHaveBeenCalledWith(formData);
  });
});
```

---

## Template 6: Edge Case Testing

### Pattern: Testing Boundary Conditions and Edge Cases

**Use Case:** Functions with boundary conditions  
**Coverage Gain:** Edge case branches, boundary logic  
**Complexity:** Low-Medium  

#### Template Code:

```javascript
describe('functionName - Edge Cases', () => {
  
  // Template: Empty string
  test('handles empty string input', () => {
    const result = functionName('');
    expect(result).toBeDefined();
    // Assert expected behavior
  });
  
  // Template: Empty object
  test('handles empty object input', () => {
    const result = functionName({});
    expect(result).toBeDefined();
  });
  
  // Template: Empty array
  test('handles empty array input', () => {
    const result = functionName([]);
    expect(result).toBeDefined();
  });
  
  // Template: Maximum value
  test('handles maximum value', () => {
    const result = functionName(Number.MAX_VALUE);
    expect(result).toBeDefined();
  });
  
  // Template: Minimum value
  test('handles minimum value', () => {
    const result = functionName(Number.MIN_VALUE);
    expect(result).toBeDefined();
  });
  
  // Template: Zero
  test('handles zero', () => {
    const result = functionName(0);
    expect(result).toBeDefined();
  });
  
  // Template: Negative number
  test('handles negative number', () => {
    const result = functionName(-42);
    expect(result).toBeDefined();
  });
  
  // Template: Very long string
  test('handles very long string', () => {
    const longString = 'x'.repeat(10000);
    const result = functionName(longString);
    expect(result).toBeDefined();
  });
  
  // Template: Special characters
  test('handles special characters', () => {
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const result = functionName(specialChars);
    expect(result).toBeDefined();
  });
  
  // Template: Unicode characters
  test('handles Unicode characters', () => {
    const unicode = '你好世界🎉';
    const result = functionName(unicode);
    expect(result).toBeDefined();
  });
});
```

#### Application Example:

```javascript
describe('validateBlockAttributes - Edge Cases', () => {
  
  test('handles title with only whitespace', () => {
    const result = validateBlockAttributes({
      title: '   \n\t  '
    });
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Title required');
  });
  
  test('handles content at exactly 5000 characters', () => {
    const result = validateBlockAttributes({
      title: 'Valid',
      content: 'x'.repeat(5000)
    });
    
    expect(result.valid).toBe(true);
  });
  
  test('handles content exceeding 5000 characters', () => {
    const result = validateBlockAttributes({
      title: 'Valid',
      content: 'x'.repeat(5001)
    });
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Content too long');
  });
  
  test('handles special characters in title', () => {
    const result = validateBlockAttributes({
      title: 'Test™ Block® with © symbols!',
      content: 'Content'
    });
    
    expect(result.valid).toBe(true);
  });
  
  test('handles Unicode in title', () => {
    const result = validateBlockAttributes({
      title: '你好 مرحبا הלו',
      content: 'Content'
    });
    
    expect(result.valid).toBe(true);
  });
});
```

---

## Template 7: Return Value Variation Testing

### Pattern: Testing Different Return Values

**Use Case:** Functions with multiple return value types  
**Coverage Gain:** All return statement paths  
**Complexity:** Low  

#### Template Code:

```javascript
describe('functionName - Return Values', () => {
  
  // Template: Object return
  test('returns object with expected properties', () => {
    const result = functionName();
    
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty('key1');
    expect(result).toHaveProperty('key2');
    expect(result.key1).toBe(expectedValue);
  });
  
  // Template: Array return
  test('returns array with expected elements', () => {
    const result = functionName();
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(expectedLength);
    expect(result[0]).toEqual(firstElement);
  });
  
  // Template: String return
  test('returns string of expected value', () => {
    const result = functionName();
    
    expect(typeof result).toBe('string');
    expect(result).toBe('expected string');
  });
  
  // Template: Boolean return
  test('returns boolean value', () => {
    const result = functionName();
    
    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });
  
  // Template: Null/undefined return
  test('returns null when condition not met', () => {
    const result = functionName();
    
    expect(result).toBeNull();
  });
});
```

#### Application Example:

```javascript
describe('validateForm - Return Values', () => {
  
  test('returns object with valid:true when all checks pass', async () => {
    jest.spyOn(module, 'validateBlockAttributes')
      .mockReturnValue({ valid: true });
    jest.spyOn(module, 'validateEmail')
      .mockReturnValue({ valid: true });
    jest.spyOn(module, 'validateAsync')
      .mockResolvedValue({ valid: true });
    
    const result = await validateForm({
      title: 'Test',
      email: 'test@test.com'
    });
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('errors');
    expect(Array.isArray(result.errors)).toBe(true);
    expect(result.errors.length).toBe(0);
  });
  
  test('returns object with valid:false and errors array', async () => {
    jest.spyOn(module, 'validateBlockAttributes')
      .mockReturnValue({ valid: false, error: 'Title required' });
    jest.spyOn(module, 'validateEmail')
      .mockReturnValue({ valid: true });
    jest.spyOn(module, 'validateAsync')
      .mockResolvedValue({ valid: true });
    
    const result = await validateForm({
      title: '',
      email: 'test@test.com'
    });
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Title required');
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
```

---

## Template 8: Recursive Function Testing

### Pattern: Testing Functions That Call Themselves

**Use Case:** Recursive algorithms, tree traversal  
**Coverage Gain:** Base case, recursive case, all recursion depths  
**Complexity:** High  

#### Template Code:

```javascript
describe('recursiveFunctionName - Recursion', () => {
  
  // Template: Base case
  test('returns value for base case', () => {
    const result = recursiveFunction(baseInput);
    
    expect(result).toEqual(baseExpectedValue);
  });
  
  // Template: Single recursion level
  test('recurses once for single nested input', () => {
    const singleLevelInput = {
      value: 1,
      nested: { value: 2 }  // One level deep
    };
    
    const result = recursiveFunction(singleLevelInput);
    
    expect(result).toEqual(expectedResult);
  });
  
  // Template: Multiple recursion levels
  test('recurses multiple times for deeply nested input', () => {
    const multiLevelInput = {
      value: 1,
      nested: {
        value: 2,
        nested: {
          value: 3,
          nested: {
            value: 4  // Four levels deep
          }
        }
      }
    };
    
    const result = recursiveFunction(multiLevelInput);
    
    expect(result).toEqual(expectedDeepResult);
  });
  
  // Template: Empty recursion case
  test('handles empty nested structures', () => {
    const emptyInput = {
      value: 1,
      nested: null
    };
    
    const result = recursiveFunction(emptyInput);
    
    expect(result).toBeDefined();
  });
});
```

#### Application Example:

```javascript
describe('transformBlockData - Recursion', () => {
  
  test('transforms single block (base case)', () => {
    const block = {
      name: 'core/paragraph',
      attributes: { content: 'Hello' }
    };
    
    const result = transformBlockData(block);
    
    expect(result.inner).toEqual([]);
  });
  
  test('transforms block with one nested child', () => {
    const block = {
      name: 'core/group',
      innerBlocks: [
        {
          name: 'core/paragraph',
          attributes: { content: 'Child' }
        }
      ]
    };
    
    const result = transformBlockData(block);
    
    expect(result.inner).toHaveLength(1);
    expect(result.inner[0].name).toBe('core/paragraph');
  });
  
  test('transforms block with multiple levels of nesting', () => {
    const block = {
      name: 'core/group',
      innerBlocks: [
        {
          name: 'core/group',
          innerBlocks: [
            {
              name: 'core/paragraph',
              attributes: { content: 'Deep child' }
            }
          ]
        }
      ]
    };
    
    const result = transformBlockData(block);
    
    expect(result.inner).toHaveLength(1);
    expect(result.inner[0].inner).toHaveLength(1);
    expect(result.inner[0].inner[0].name).toBe('core/paragraph');
  });
});
```

---

## Template 9: Boundary Value Testing

### Pattern: Testing Values at Boundaries

**Use Case:** Functions with numeric ranges, string lengths, etc.  
**Coverage Gain:** Boundary condition branches  
**Complexity:** Low-Medium  

#### Template Code:

```javascript
describe('functionName - Boundary Values', () => {
  
  // Template: Just under limit
  test('accepts value just below limit', () => {
    const result = functionName(limit - 1);
    expect(result.valid).toBe(true);
  });
  
  // Template: At limit
  test('accepts value exactly at limit', () => {
    const result = functionName(limit);
    expect(result.valid).toBe(true);
  });
  
  // Template: Just over limit
  test('rejects value just above limit', () => {
    const result = functionName(limit + 1);
    expect(result.valid).toBe(false);
  });
  
  // Template: Far over limit
  test('rejects value far above limit', () => {
    const result = functionName(limit * 2);
    expect(result.valid).toBe(false);
  });
});
```

#### Application Example:

```javascript
describe('validateBlockAttributes - Boundary Values', () => {
  
  test('accepts content at exactly 5000 characters', () => {
    const result = validateBlockAttributes({
      title: 'Valid',
      content: 'x'.repeat(5000)
    });
    expect(result.valid).toBe(true);
  });
  
  test('accepts content under 5000 characters', () => {
    const result = validateBlockAttributes({
      title: 'Valid',
      content: 'x'.repeat(4999)
    });
    expect(result.valid).toBe(true);
  });
  
  test('rejects content over 5000 characters', () => {
    const result = validateBlockAttributes({
      title: 'Valid',
      content: 'x'.repeat(5001)
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Content too long');
  });
  
  test('rejects content way over 5000 characters', () => {
    const result = validateBlockAttributes({
      title: 'Valid',
      content: 'x'.repeat(10000)
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Content too long');
  });
});
```

---

## Template 10: Integration Test Pattern

### Pattern: Testing Multiple Functions Together

**Use Case:** Testing workflows that span multiple modules  
**Coverage Gain:** Integration paths, cross-module branches  
**Complexity:** High  

#### Template Code:

```javascript
describe('Workflow - Complete Flow', () => {
  
  beforeEach(() => {
    // Set up all mocks for integration
    jest.spyOn(module1, 'function1').mockReturnValue({ success: true });
    jest.spyOn(module2, 'function2').mockReturnValue({ valid: true });
    jest.spyOn(api, 'call').mockResolvedValue({ status: 'ok' });
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('completes full workflow from start to finish', async () => {
    // Step 1: Initial processing
    const step1 = function1(input);
    expect(step1.success).toBe(true);
    
    // Step 2: Validation
    const step2 = function2(step1.output);
    expect(step2.valid).toBe(true);
    
    // Step 3: API call
    const step3 = await api.call(step2.output);
    expect(step3.status).toBe('ok');
  });
  
  test('workflow handles error at step 2', async () => {
    jest.spyOn(module2, 'function2')
      .mockReturnValue({ valid: false, error: 'Validation failed' });
    
    const step1 = function1(input);
    const step2 = function2(step1.output);
    
    expect(step2.valid).toBe(false);
    // Should not reach step 3
  });
});
```

---

## Summary: Which Template for Which Gap

| Gap Type | Template | Effort | Tests |
|----------|----------|--------|-------|
| Uncovered error path | Template 3 | Medium | 2-4 |
| Uncovered branch | Template 2 | Low | 1-2 |
| Uncovered return | Template 7 | Low | 1-2 |
| Uncovered function | Template 1 + others | Medium | 3-5 |
| Uncovered async path | Template 4 | High | 2-4 |
| Uncovered recursion | Template 8 | High | 3-5 |
| Uncovered edge case | Template 6 | Low-Med | 2-4 |
| Boundary condition | Template 9 | Medium | 2-3 |

---

## Best Practices

✅ **Coverage-Focused Testing:**
1. Write one test per uncovered line/branch
2. Use specific test names that document what's being covered
3. Add comments indicating the coverage impact
4. Verify each test fails before refactoring code

✅ **Test Quality:**
1. Each test should test ONE thing
2. Use arrange-act-assert pattern
3. Mock external dependencies
4. Don't test framework behavior

✅ **Maintainability:**
1. Create reusable fixtures for common test data
2. Extract common test setup into beforeEach
3. Use descriptive variable names
4. Document WHY tests exist, not just WHAT they test

---

**Next:** See `05-COVERAGE-ENFORCEMENT-STRATEGY.md` for CI/CD setup and enforcement.
