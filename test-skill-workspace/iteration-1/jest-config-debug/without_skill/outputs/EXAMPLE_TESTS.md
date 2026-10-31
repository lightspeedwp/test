# Example Tests Using Fixed Jest Configuration

This document shows how to structure tests that work with the fixed `jest.config.js`.

## Example 1: Testing a WordPress Block (React Component)

### File Structure
```
plugin/
├── src/
│   ├── blocks/
│   │   ├── my-block/
│   │   │   ├── index.js
│   │   │   ├── edit.js
│   │   │   ├── edit.test.js
│   │   │   ├── save.js
│   │   │   ├── save.test.js
│   │   │   └── style.scss
│   └── index.js
└── jest.config.js
```

### src/blocks/my-block/edit.js
```jsx
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { content } = attributes;
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <TextControl
        label={__('Block Content', 'my-plugin')}
        value={content}
        onChange={(value) => setAttributes({ content: value })}
      />
    </div>
  );
}
```

### src/blocks/my-block/edit.test.js
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Edit from './edit';

describe('My Block - Edit Component', () => {
  // Test 1: Component renders without error
  it('renders without crashing', () => {
    const setAttributes = jest.fn();
    const { container } = render(
      <Edit
        attributes={{ content: '' }}
        setAttributes={setAttributes}
      />
    );
    expect(container).toBeInTheDocument();
  });

  // Test 2: Displays label from i18n
  it('displays the correct label', () => {
    const setAttributes = jest.fn();
    render(
      <Edit
        attributes={{ content: 'Test' }}
        setAttributes={setAttributes}
      />
    );
    // The label should be rendered by TextControl
    // (i18n __() returns the text as-is in tests)
    expect(screen.getByText('Block Content')).toBeInTheDocument();
  });

  // Test 3: Calls setAttributes when content changes
  it('updates attributes on text change', async () => {
    const setAttributes = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Edit
        attributes={{ content: 'Initial' }}
        setAttributes={setAttributes}
      />
    );
    
    const input = screen.getByDisplayValue('Initial');
    await user.clear(input);
    await user.type(input, 'New Content');
    
    expect(setAttributes).toHaveBeenCalledWith({ content: 'New Content' });
  });

  // Test 4: Handles empty state
  it('renders with empty content', () => {
    const setAttributes = jest.fn();
    const { container } = render(
      <Edit
        attributes={{ content: '' }}
        setAttributes={setAttributes}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });
});
```

### Why This Works

1. **@wordpress/i18n** resolved by moduleNameMapper
2. **@wordpress/block-editor** caught by `^@wordpress/(.+)$` pattern
3. **@wordpress/components** has explicit mapping
4. **TextControl** component available through components package
5. **CSS not imported** in test - style.scss mapped to styleMock.js
6. **jsdom testEnvironment** allows DOM operations

---

## Example 2: Testing Utility Functions

### File Structure
```
plugin/
├── src/
│   ├── utils/
│   │   ├── helpers.js
│   │   └── helpers.test.js
│   └── index.js
└── jest.config.js
```

### src/utils/helpers.js
```javascript
/**
 * Format a price for display
 */
export function formatPrice(amount, currency = 'USD') {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(amount);
}

/**
 * Check if a block name is valid
 */
export function isValidBlockName(name) {
  // Block names must be namespace/name format
  return /^[\w-]+\/[\w-]+$/.test(name);
}

/**
 * Recursively filter object keys
 */
export function filterObjectKeys(obj, predicate) {
  return Object.entries(obj)
    .filter(([key]) => predicate(key))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}
```

### src/utils/helpers.test.js
```javascript
import {
  formatPrice,
  isValidBlockName,
  filterObjectKeys,
} from './helpers';

describe('Helper Utilities', () => {
  describe('formatPrice', () => {
    it('formats USD currency', () => {
      expect(formatPrice(100)).toBe('$100.00');
      expect(formatPrice(1234.5)).toBe('$1,234.50');
    });

    it('formats EUR currency', () => {
      const result = formatPrice(100, 'EUR');
      expect(result).toContain('100');
      // Currency symbol varies by locale, just check amount
    });

    it('handles zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('handles negative amounts', () => {
      expect(formatPrice(-50)).toBe('-$50.00');
    });
  });

  describe('isValidBlockName', () => {
    it('validates correct block names', () => {
      expect(isValidBlockName('core/paragraph')).toBe(true);
      expect(isValidBlockName('my-plugin/my-block')).toBe(true);
      expect(isValidBlockName('acme-plugin-name/my-custom-block')).toBe(true);
    });

    it('rejects invalid block names', () => {
      expect(isValidBlockName('core')).toBe(false);          // No namespace
      expect(isValidBlockName('core/para/graph')).toBe(false); // Too many slashes
      expect(isValidBlockName('core/')).toBe(false);         // No block name
      expect(isValidBlockName('/paragraph')).toBe(false);    // No namespace
      expect(isValidBlockName('core block')).toBe(false);    // Space invalid
    });

    it('handles edge cases', () => {
      expect(isValidBlockName('')).toBe(false);
      expect(isValidBlockName(null)).toBe(false);
    });
  });

  describe('filterObjectKeys', () => {
    it('filters object keys based on predicate', () => {
      const obj = { foo: 1, bar: 2, baz: 3 };
      const result = filterObjectKeys(obj, (key) => key.startsWith('b'));
      expect(result).toEqual({ bar: 2, baz: 3 });
    });

    it('returns empty object when no keys match', () => {
      const obj = { foo: 1, bar: 2 };
      const result = filterObjectKeys(obj, (key) => key.startsWith('z'));
      expect(result).toEqual({});
    });

    it('preserves all values', () => {
      const obj = {
        keep1: { nested: true },
        skip: 'ignored',
        keep2: [1, 2, 3],
      };
      const result = filterObjectKeys(obj, (key) => key.startsWith('keep'));
      expect(result.keep1).toEqual({ nested: true });
      expect(result.keep2).toEqual([1, 2, 3]);
      expect(result.skip).toBeUndefined();
    });

    it('handles empty object', () => {
      const result = filterObjectKeys({}, () => true);
      expect(result).toEqual({});
    });
  });
});
```

### Why This Works

1. **No WordPress packages** - pure JavaScript functions
2. **No CSS/images** - no mock dependencies needed
3. **testMatch** finds `src/utils/helpers.test.js`
4. **Coverage collected** - file included in collectCoverageFrom

---

## Example 3: Testing WordPress Hooks Integration

### File Structure
```
plugin/
├── src/
│   ├── hooks/
│   │   ├── index.js
│   │   └── index.test.js
│   └── index.js
└── jest.config.js
```

### src/hooks/index.js
```javascript
import { addAction, applyFilters } from '@wordpress/hooks';

/**
 * Initialize WordPress hooks for the plugin
 */
export function initializeHooks() {
  // Filter the block data before it's registered
  addAction(
    'blocks.registerBlockType',
    'my-plugin/validate-block',
    validateBlockType
  );
  
  return true;
}

/**
 * Validate block type before registration
 */
export function validateBlockType(blockType) {
  // Apply filter to allow customization
  const validated = applyFilters(
    'my-plugin/validate-block-type',
    blockType
  );
  
  // Ensure required fields
  if (!validated.title || !validated.name) {
    throw new Error('Block must have title and name');
  }
  
  return validated;
}

/**
 * Register a custom block
 */
export function registerCustomBlock(blockConfig) {
  const prepared = applyFilters(
    'my-plugin/prepare-block-config',
    blockConfig
  );
  
  // In production, would call wp.blocks.registerBlockType
  return prepared;
}
```

### src/hooks/index.test.js
```javascript
import {
  initializeHooks,
  validateBlockType,
  registerCustomBlock,
} from './index';

// Mock WordPress hooks
jest.mock('@wordpress/hooks', () => ({
  addAction: jest.fn(),
  removeAction: jest.fn(),
  applyFilters: jest.fn((hook, value) => value), // Pass through
  doAction: jest.fn(),
}));

import { addAction, applyFilters } from '@wordpress/hooks';

describe('WordPress Hooks Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeHooks', () => {
    it('registers the block validation action', () => {
      initializeHooks();
      
      expect(addAction).toHaveBeenCalledWith(
        'blocks.registerBlockType',
        'my-plugin/validate-block',
        validateBlockType
      );
    });

    it('returns true on success', () => {
      expect(initializeHooks()).toBe(true);
    });
  });

  describe('validateBlockType', () => {
    it('validates block with required fields', () => {
      const blockType = {
        name: 'my-plugin/test-block',
        title: 'Test Block',
        category: 'common',
      };
      
      const result = validateBlockType(blockType);
      expect(result).toEqual(blockType);
    });

    it('throws when title missing', () => {
      const blockType = {
        name: 'my-plugin/test-block',
        category: 'common',
      };
      
      expect(() => {
        validateBlockType(blockType);
      }).toThrow('Block must have title and name');
    });

    it('throws when name missing', () => {
      const blockType = {
        title: 'Test Block',
        category: 'common',
      };
      
      expect(() => {
        validateBlockType(blockType);
      }).toThrow('Block must have title and name');
    });

    it('applies filter to block type', () => {
      const blockType = { name: 'core/paragraph', title: 'Paragraph' };
      validateBlockType(blockType);
      
      expect(applyFilters).toHaveBeenCalledWith(
        'my-plugin/validate-block-type',
        blockType
      );
    });
  });

  describe('registerCustomBlock', () => {
    it('prepares block config via filter', () => {
      const config = { name: 'my-block', title: 'My Block' };
      
      registerCustomBlock(config);
      
      expect(applyFilters).toHaveBeenCalledWith(
        'my-plugin/prepare-block-config',
        config
      );
    });

    it('returns prepared config', () => {
      const config = { name: 'my-block' };
      
      // Mock filter to modify config
      applyFilters.mockImplementationOnce(
        (hook, value) => ({
          ...value,
          apiVersion: 3,
        })
      );
      
      const result = registerCustomBlock(config);
      
      expect(result.apiVersion).toBe(3);
      expect(result.name).toBe('my-block');
    });
  });
});
```

### Why This Works

1. **@wordpress/hooks** resolved by moduleNameMapper
2. **jest.mock()** allows testing without real hooks
3. **applyFilters mock** configured to pass through values
4. **Clear mocks** between tests prevents test pollution
5. **testMatch** finds `src/hooks/index.test.js`

---

## Example 4: Integration Test

### File Structure
```
plugin/
├── tests/
│   └── integration/
│       └── plugin-startup.test.js
└── jest.config.js
```

### tests/integration/plugin-startup.test.js
```javascript
/**
 * Integration test: Plugin initialization
 * 
 * Tests that the plugin can start up and register blocks
 * without errors. This is higher-level than unit tests.
 */

import { initializeHooks, registerCustomBlock } from '../../src/hooks';

describe('Plugin Startup Integration', () => {
  it('can initialize without errors', () => {
    expect(() => {
      initializeHooks();
    }).not.toThrow();
  });

  it('can register a complete block', () => {
    const blockConfig = {
      name: 'my-plugin/test-block',
      title: 'Integration Test Block',
      category: 'common',
      icon: 'star',
      edit: () => 'Edit',
      save: () => 'Save',
    };
    
    expect(() => {
      registerCustomBlock(blockConfig);
    }).not.toThrow();
  });

  it('can initialize and register in sequence', () => {
    initializeHooks();
    
    const blockConfig = {
      name: 'my-plugin/integration-block',
      title: 'Integration Block',
    };
    
    expect(() => {
      registerCustomBlock(blockConfig);
    }).not.toThrow();
  });
});
```

### Why This Works

1. **testMatch** finds tests in `tests/` directory
2. **Multiple test directories** supported by configuration
3. **Integration tests** can import from `src/` and test real flows

---

## Running These Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- edit.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="renders"

# Debug a test
npm run test:debug
```

---

## Common Patterns

### Mocking WordPress Hooks

```javascript
jest.mock('@wordpress/hooks');
import { applyFilters } from '@wordpress/hooks';

it('applies filter', () => {
  applyFilters.mockReturnValue('modified');
  // ...
});
```

### Mocking WordPress Data Store

```javascript
jest.mock('@wordpress/data');
import { select, dispatch } from '@wordpress/data';

it('reads from store', () => {
  select.mockReturnValue({
    getSetting: jest.fn().mockReturnValue('value'),
  });
  // ...
});
```

### Testing Async Operations

```javascript
it('handles async API calls', async () => {
  global.wp.apiFetch.mockResolvedValue({ success: true });
  
  const result = await fetchData();
  
  expect(result).toEqual({ success: true });
});
```

### Snapshot Testing (Use Sparingly)

```javascript
it('renders component correctly', () => {
  const { container } = render(<MyComponent />);
  expect(container.firstChild).toMatchSnapshot();
});
```

### Asserting DOM Content

```javascript
import { render, screen } from '@testing-library/react';

it('displays correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveClass('active');
});
```

---

## See Also

- Main debug guide: JEST_DEBUG_GUIDE.md
- Fixed configuration: jest.config.js
- Setup file: jest.setup.js
- Mocks: __mocks__/styleMock.js, __mocks__/fileMock.js
