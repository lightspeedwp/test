# Jest Test Case Templates for Validation Utilities

## Template Overview

These templates cover the most common uncovered patterns in validation utility refactoring.

---

## Template 1: Simple String Validator

### Scenario
Email, phone, URL validators that check format and return boolean.

### Coverage Gaps
- Missing error cases (null, undefined, empty string)
- Missing branch coverage (true/false paths)
- Missing edge cases (special characters, length limits)

### Template Code

```typescript
// src/validators/email.ts
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// ✓ Test file with full coverage
describe('validateEmail', () => {
  // HAPPY PATH
  describe('Happy path - valid emails', () => {
    test('returns true for valid email format', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    test('returns true for email with subdomain', () => {
      expect(validateEmail('user@mail.example.co.uk')).toBe(true);
    });

    test('returns true for email with numbers and dots', () => {
      expect(validateEmail('user.name123@example.com')).toBe(true);
    });

    test('trims whitespace from input', () => {
      expect(validateEmail('  user@example.com  ')).toBe(true);
    });
  });

  // SAD PATH - Invalid formats
  describe('Sad path - invalid email formats', () => {
    test('returns false for email without @ symbol', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    test('returns false for email without domain', () => {
      expect(validateEmail('user@.com')).toBe(false);
    });

    test('returns false for email without TLD', () => {
      expect(validateEmail('user@example')).toBe(false);
    });

    test('returns false for email with space in address', () => {
      expect(validateEmail('user name@example.com')).toBe(false);
    });

    test('returns false for email with consecutive dots', () => {
      expect(validateEmail('user..name@example.com')).toBe(false);
    });
  });

  // EDGE CASES
  describe('Edge cases - null, undefined, wrong types', () => {
    test('returns false for null input', () => {
      expect(validateEmail(null as any)).toBe(false);
    });

    test('returns false for undefined input', () => {
      expect(validateEmail(undefined as any)).toBe(false);
    });

    test('returns false for empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    test('returns false for only whitespace', () => {
      expect(validateEmail('   ')).toBe(false);
    });

    test('returns false for non-string input', () => {
      expect(validateEmail(123 as any)).toBe(false);
    });
  });

  // BOUNDARY TESTS
  describe('Boundary conditions', () => {
    test('handles very long email addresses', () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      expect(validateEmail(longEmail)).toBe(true);
    });

    test('handles email with special valid characters', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });
  });
});
```

---

## Template 2: Object Validator with Multiple Properties

### Scenario
Validators that check multiple properties of an object and return validation result with detailed errors.

### Coverage Gaps
- Missing property validation paths
- Missing error accumulation logic
- Missing optional property handling

### Template Code

```typescript
// src/validators/userValidator.ts
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface User {
  name: string;
  email: string;
  age?: number;
  phone?: string;
}

export const validateUser = (user: any): ValidationResult => {
  const errors: string[] = [];

  // Validate required fields
  if (!user || typeof user !== 'object') {
    return { isValid: false, errors: ['Input must be an object'] };
  }

  if (!user.name || typeof user.name !== 'string' || user.name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!user.email || typeof user.email !== 'string') {
    errors.push('Email is required');
  } else if (!user.email.includes('@')) {
    errors.push('Email must be valid format');
  }

  // Validate optional fields
  if (user.age !== undefined && user.age !== null) {
    if (typeof user.age !== 'number' || user.age < 0 || user.age > 150) {
      errors.push('Age must be a number between 0 and 150');
    }
  }

  if (user.phone && typeof user.phone !== 'string') {
    errors.push('Phone must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ✓ Complete test coverage
describe('validateUser', () => {
  describe('Happy path - valid users', () => {
    test('accepts user with all required fields', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('accepts user with required and optional fields', () => {
      const result = validateUser({
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 30,
        phone: '555-1234'
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('accepts user with only required fields', () => {
      const result = validateUser({
        name: 'Bob Smith',
        email: 'bob@example.com'
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('Sad path - invalid input types', () => {
    test('rejects null input', () => {
      const result = validateUser(null);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toBe('Input must be an object');
    });

    test('rejects undefined input', () => {
      const result = validateUser(undefined);
      expect(result.isValid).toBe(false);
    });

    test('rejects non-object input', () => {
      const result = validateUser('not an object');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Field validation - name', () => {
    test('rejects missing name', () => {
      const result = validateUser({
        email: 'test@example.com'
      });
      expect(result.errors).toContain('Name is required and must be a non-empty string');
    });

    test('rejects empty name', () => {
      const result = validateUser({
        name: '',
        email: 'test@example.com'
      });
      expect(result.errors).toContain('Name is required and must be a non-empty string');
    });

    test('rejects whitespace-only name', () => {
      const result = validateUser({
        name: '   ',
        email: 'test@example.com'
      });
      expect(result.errors).toContain('Name is required and must be a non-empty string');
    });

    test('rejects non-string name', () => {
      const result = validateUser({
        name: 123,
        email: 'test@example.com'
      });
      expect(result.errors).toContain('Name is required and must be a non-empty string');
    });
  });

  describe('Field validation - email', () => {
    test('rejects missing email', () => {
      const result = validateUser({
        name: 'John Doe'
      });
      expect(result.errors).toContain('Email is required');
    });

    test('rejects invalid email format', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'invalid-email'
      });
      expect(result.errors).toContain('Email must be valid format');
    });

    test('rejects non-string email', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 123
      });
      expect(result.errors).toContain('Email is required');
    });
  });

  describe('Field validation - age (optional)', () => {
    test('accepts valid age', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      });
      expect(result.isValid).toBe(true);
    });

    test('accepts missing age', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(result.isValid).toBe(true);
    });

    test('accepts null age', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: null
      });
      expect(result.isValid).toBe(true);
    });

    test('rejects negative age', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: -1
      });
      expect(result.errors).toContain('Age must be a number between 0 and 150');
    });

    test('rejects age over 150', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 151
      });
      expect(result.errors).toContain('Age must be a number between 0 and 150');
    });

    test('rejects non-numeric age', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 'twenty-five'
      });
      expect(result.errors).toContain('Age must be a number between 0 and 150');
    });

    test('accepts age 0', () => {
      const result = validateUser({
        name: 'Infant',
        email: 'infant@example.com',
        age: 0
      });
      expect(result.isValid).toBe(true);
    });

    test('accepts age 150', () => {
      const result = validateUser({
        name: 'Elder',
        email: 'elder@example.com',
        age: 150
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('Field validation - phone (optional)', () => {
    test('accepts valid phone', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234'
      });
      expect(result.isValid).toBe(true);
    });

    test('accepts missing phone', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(result.isValid).toBe(true);
    });

    test('rejects non-string phone', () => {
      const result = validateUser({
        name: 'John Doe',
        email: 'john@example.com',
        phone: 5551234
      });
      expect(result.errors).toContain('Phone must be a string');
    });
  });

  describe('Multiple errors', () => {
    test('accumulates multiple errors', () => {
      const result = validateUser({
        name: '',
        email: 'invalid',
        age: 200
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(2);
    });
  });
});
```

---

## Template 3: Conditional Logic Validator

### Scenario
Validators with if/else branches, early returns, and conditional logic.

### Coverage Gaps
- Unexercised else branches
- Conditional operators not tested both ways
- Guard clauses only tested one way

### Template Code

```typescript
// src/validators/passwordValidator.ts
export interface PasswordValidation {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  // Guard clause
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      strength: 'weak',
      errors: ['Password must be a non-empty string']
    };
  }

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (password.length > 128) {
    errors.push('Password must be at most 128 characters');
  }

  // Complexity checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]/.test(password);

  if (!hasUppercase) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!hasLowercase) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }

  // Calculate strength
  if (password.length >= 8 && hasUppercase && hasLowercase && hasNumbers) {
    if (hasSpecial) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors
  };
};

// ✓ Complete test coverage
describe('validatePassword', () => {
  describe('Guard clauses', () => {
    test('rejects null password', () => {
      const result = validatePassword(null as any);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toBe('Password must be a non-empty string');
    });

    test('rejects undefined password', () => {
      const result = validatePassword(undefined as any);
      expect(result.isValid).toBe(false);
    });

    test('rejects empty string', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
    });

    test('rejects non-string input', () => {
      const result = validatePassword(12345 as any);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Length validation', () => {
    test('rejects password shorter than 8 characters', () => {
      const result = validatePassword('Pass123');
      expect(result.errors).toContain('Password must be at least 8 characters');
    });

    test('accepts password exactly 8 characters', () => {
      const result = validatePassword('Password123');
      expect(result.errors).not.toContain('Password must be at least 8 characters');
    });

    test('rejects password longer than 128 characters', () => {
      const result = validatePassword('P' + 'a'.repeat(127) + 'ss123');
      expect(result.errors).toContain('Password must be at most 128 characters');
    });

    test('accepts password exactly 128 characters', () => {
      const password = 'P' + 'a'.repeat(124) + '123';
      const result = validatePassword(password);
      expect(result.errors).not.toContain('Password must be at most 128 characters');
    });
  });

  describe('Character type validation', () => {
    // Missing uppercase
    test('rejects password without uppercase', () => {
      const result = validatePassword('password123');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    // Missing lowercase
    test('rejects password without lowercase', () => {
      const result = validatePassword('PASSWORD123');
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    // Missing numbers
    test('rejects password without numbers', () => {
      const result = validatePassword('PasswordTest');
      expect(result.errors).toContain('Password must contain at least one number');
    });

    // All required types present
    test('accepts password with all required character types', () => {
      const result = validatePassword('Password123');
      expect(result.errors.filter(e => 
        e.includes('uppercase') || e.includes('lowercase') || e.includes('number')
      )).toHaveLength(0);
    });
  });

  describe('Strength calculation', () => {
    test('weak strength for password missing elements', () => {
      const result = validatePassword('pass');
      expect(result.strength).toBe('weak');
    });

    test('medium strength for password without special characters', () => {
      const result = validatePassword('Password123');
      expect(result.strength).toBe('medium');
    });

    test('strong strength for password with all elements', () => {
      const result = validatePassword('Password123!');
      expect(result.strength).toBe('strong');
    });

    test('strong strength with various special characters', () => {
      const specials = ['!', '@', '#', '$', '%', '^', '&', '*'];
      specials.forEach(special => {
        const result = validatePassword(`Password123${special}`);
        expect(result.strength).toBe('strong');
      });
    });
  });

  describe('Valid passwords', () => {
    test('accepts valid medium-strength password', () => {
      const result = validatePassword('MyPassword123');
      expect(result.isValid).toBe(true);
      expect(result.strength).toBe('medium');
    });

    test('accepts valid strong password', () => {
      const result = validatePassword('MyP@ssw0rd!');
      expect(result.isValid).toBe(true);
      expect(result.strength).toBe('strong');
    });
  });
});
```

---

## Template 4: Array/Collection Validator

### Scenario
Validators that process arrays and collections.

### Coverage Gaps
- Empty array handling
- Single element edge case
- Each array item validation

### Template Code

```typescript
// src/validators/arrayValidator.ts
export interface Item {
  id: string;
  name: string;
  value: number;
}

export const validateItems = (items: any[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Null/undefined check
  if (!Array.isArray(items)) {
    return { valid: false, errors: ['Input must be an array'] };
  }

  // Empty array
  if (items.length === 0) {
    return { valid: false, errors: ['Array cannot be empty'] };
  }

  // Validate each item
  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      errors.push(`Item at index ${index} must be an object`);
      return;
    }

    if (!item.id || typeof item.id !== 'string') {
      errors.push(`Item at index ${index} must have a non-empty string id`);
    }

    if (!item.name || typeof item.name !== 'string') {
      errors.push(`Item at index ${index} must have a non-empty string name`);
    }

    if (typeof item.value !== 'number' || item.value < 0) {
      errors.push(`Item at index ${index} must have a non-negative number value`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

// ✓ Complete test coverage
describe('validateItems', () => {
  describe('Input validation', () => {
    test('rejects non-array input', () => {
      const result = validateItems({} as any);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toBe('Input must be an array');
    });

    test('rejects string input', () => {
      const result = validateItems('not an array' as any);
      expect(result.valid).toBe(false);
    });

    test('rejects null input', () => {
      const result = validateItems(null as any);
      expect(result.valid).toBe(false);
    });

    test('rejects undefined input', () => {
      const result = validateItems(undefined as any);
      expect(result.valid).toBe(false);
    });
  });

  describe('Array length validation', () => {
    test('rejects empty array', () => {
      const result = validateItems([]);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toBe('Array cannot be empty');
    });

    test('accepts single-item array', () => {
      const result = validateItems([{
        id: 'item1',
        name: 'Item 1',
        value: 100
      }]);
      expect(result.valid).toBe(true);
    });

    test('accepts multi-item array', () => {
      const result = validateItems([
        { id: 'item1', name: 'Item 1', value: 100 },
        { id: 'item2', name: 'Item 2', value: 200 }
      ]);
      expect(result.valid).toBe(true);
    });
  });

  describe('Item validation - structure', () => {
    test('rejects null item', () => {
      const result = validateItems([null as any]);
      expect(result.errors).toContain('Item at index 0 must be an object');
    });

    test('rejects non-object item', () => {
      const result = validateItems(['string' as any]);
      expect(result.errors).toContain('Item at index 0 must be an object');
    });
  });

  describe('Item validation - id field', () => {
    test('rejects missing id', () => {
      const result = validateItems([{
        name: 'Item 1',
        value: 100
      } as any]);
      expect(result.errors).toContain('Item at index 0 must have a non-empty string id');
    });

    test('rejects empty id', () => {
      const result = validateItems([{
        id: '',
        name: 'Item 1',
        value: 100
      }]);
      expect(result.errors).toContain('Item at index 0 must have a non-empty string id');
    });

    test('rejects non-string id', () => {
      const result = validateItems([{
        id: 123,
        name: 'Item 1',
        value: 100
      } as any]);
      expect(result.errors).toContain('Item at index 0 must have a non-empty string id');
    });
  });

  describe('Item validation - name field', () => {
    test('rejects missing name', () => {
      const result = validateItems([{
        id: 'item1',
        value: 100
      } as any]);
      expect(result.errors).toContain('Item at index 0 must have a non-empty string name');
    });

    test('rejects empty name', () => {
      const result = validateItems([{
        id: 'item1',
        name: '',
        value: 100
      }]);
      expect(result.errors).toContain('Item at index 0 must have a non-empty string name');
    });
  });

  describe('Item validation - value field', () => {
    test('rejects missing value', () => {
      const result = validateItems([{
        id: 'item1',
        name: 'Item 1'
      } as any]);
      expect(result.errors).toContain('Item at index 0 must have a non-negative number value');
    });

    test('rejects non-numeric value', () => {
      const result = validateItems([{
        id: 'item1',
        name: 'Item 1',
        value: 'not a number'
      } as any]);
      expect(result.errors).toContain('Item at index 0 must have a non-negative number value');
    });

    test('rejects negative value', () => {
      const result = validateItems([{
        id: 'item1',
        name: 'Item 1',
        value: -1
      }]);
      expect(result.errors).toContain('Item at index 0 must have a non-negative number value');
    });

    test('accepts zero value', () => {
      const result = validateItems([{
        id: 'item1',
        name: 'Item 1',
        value: 0
      }]);
      expect(result.valid).toBe(true);
    });
  });

  describe('Multiple items with mixed validity', () => {
    test('reports errors for all invalid items', () => {
      const result = validateItems([
        { id: '', name: 'Item 1', value: 100 },
        { id: 'item2', name: '', value: 200 },
        { id: 'item3', name: 'Item 3', value: -1 }
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });
});
```

---

## Template 5: Exception Handling Validator

### Scenario
Validators that throw exceptions in specific conditions.

### Coverage Gaps
- Exception paths not tested
- Both throw and non-throw branches missing

### Template Code

```typescript
// src/validators/strictValidator.ts
export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super(errors.join('; '));
  }
}

export const strictValidateConfig = (config: any): void => {
  if (!config) {
    throw new ValidationError(['Config cannot be null or undefined']);
  }

  if (typeof config !== 'object' || Array.isArray(config)) {
    throw new ValidationError(['Config must be an object']);
  }

  if (!config.apiUrl || typeof config.apiUrl !== 'string') {
    throw new ValidationError(['Config must have apiUrl string']);
  }

  if (config.timeout && (typeof config.timeout !== 'number' || config.timeout <= 0)) {
    throw new ValidationError(['Config timeout must be a positive number']);
  }

  if (config.retries && (typeof config.retries !== 'number' || config.retries < 0)) {
    throw new ValidationError(['Config retries must be a non-negative number']);
  }
};

// ✓ Complete test coverage
describe('strictValidateConfig', () => {
  describe('Happy path - valid configs', () => {
    test('accepts minimal valid config', () => {
      expect(() => {
        strictValidateConfig({ apiUrl: 'https://api.example.com' });
      }).not.toThrow();
    });

    test('accepts config with all optional fields', () => {
      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          timeout: 5000,
          retries: 3
        });
      }).not.toThrow();
    });

    test('accepts config with timeout = 1', () => {
      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          timeout: 1
        });
      }).not.toThrow();
    });

    test('accepts config with retries = 0', () => {
      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          retries: 0
        });
      }).not.toThrow();
    });
  });

  describe('Sad path - null/undefined/wrong type', () => {
    test('throws for null config', () => {
      expect(() => {
        strictValidateConfig(null);
      }).toThrow(ValidationError);

      expect(() => {
        strictValidateConfig(null);
      }).toThrow('Config cannot be null or undefined');
    });

    test('throws for undefined config', () => {
      expect(() => {
        strictValidateConfig(undefined);
      }).toThrow(ValidationError);
    });

    test('throws for array config', () => {
      expect(() => {
        strictValidateConfig([]);
      }).toThrow(ValidationError);

      expect(() => {
        strictValidateConfig([]);
      }).toThrow('Config must be an object');
    });

    test('throws for primitive config', () => {
      expect(() => {
        strictValidateConfig('not an object');
      }).toThrow(ValidationError);
    });
  });

  describe('apiUrl validation', () => {
    test('throws when apiUrl is missing', () => {
      expect(() => {
        strictValidateConfig({});
      }).toThrow(ValidationError);

      expect(() => {
        strictValidateConfig({});
      }).toThrow('Config must have apiUrl string');
    });

    test('throws when apiUrl is not string', () => {
      expect(() => {
        strictValidateConfig({ apiUrl: 123 });
      }).toThrow(ValidationError);

      expect(() => {
        strictValidateConfig({ apiUrl: 123 });
      }).toThrow('Config must have apiUrl string');
    });

    test('throws when apiUrl is empty string', () => {
      expect(() => {
        strictValidateConfig({ apiUrl: '' });
      }).toThrow(ValidationError);
    });
  });

  describe('timeout validation', () => {
    test('throws when timeout is not a number', () => {
      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          timeout: 'not a number'
        });
      }).toThrow(ValidationError);

      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          timeout: 'not a number'
        });
      }).toThrow('Config timeout must be a positive number');
    });

    test('throws when timeout is zero', () => {
      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          timeout: 0
        });
      }).toThrow(ValidationError);

      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          timeout: 0
        });
      }).toThrow('Config timeout must be a positive number');
    });

    test('throws when timeout is negative', () => {
      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          timeout: -1000
        });
      }).toThrow(ValidationError);
    });
  });

  describe('retries validation', () => {
    test('throws when retries is not a number', () => {
      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          retries: 'not a number'
        });
      }).toThrow(ValidationError);

      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          retries: 'not a number'
        });
      }).toThrow('Config retries must be a non-negative number');
    });

    test('throws when retries is negative', () => {
      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          retries: -1
        });
      }).toThrow(ValidationError);

      expect(() => {
        strictValidateConfig({
          apiUrl: 'https://api.example.com',
          retries: -1
        });
      }).toThrow('Config retries must be a non-negative number');
    });
  });

  describe('Error details', () => {
    test('provides ValidationError with error array', () => {
      try {
        strictValidateConfig(null);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.errors).toContain('Config cannot be null or undefined');
      }
    });

    test('includes all validation errors in message', () => {
      try {
        strictValidateConfig({
          timeout: 'not a number',
          retries: -1
        });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.message).toContain('Config must have apiUrl string');
      }
    });
  });
});
```

---

## Test Case Prioritization Checklist

For coverage gaps, implement tests in this order:

### Phase 1: Critical Path (72% → 80%)
- [ ] Happy path scenarios (basic valid inputs)
- [ ] Error path scenarios (guard clauses: null, undefined, wrong type)
- [ ] Required field validation

### Phase 2: High Priority (80% → 90%)
- [ ] Branch coverage (both true/false paths for all if/else)
- [ ] Boundary value testing (min/max, 0, -1, empty string)
- [ ] Optional field handling

### Phase 3: Comprehensive (90% → 100%)
- [ ] Exception handling paths
- [ ] All edge cases and combinations
- [ ] Error message validation
- [ ] Complex scenarios with multiple validation rules

## Implementation Strategy

1. **Use these templates as starting points** - Don't write tests from scratch
2. **Copy the appropriate template** for each function category
3. **Adapt test data** to your specific domain
4. **Run coverage before/after** to confirm impact
5. **Prioritize by coverage delta**, not by code complexity
