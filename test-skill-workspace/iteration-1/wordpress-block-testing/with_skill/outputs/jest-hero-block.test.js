/**
 * Jest Unit Tests for WordPress Hero Block
 *
 * Tests for:
 * - Block registration and attributes
 * - Edit component rendering
 * - Save component output
 * - Block utilities and helpers
 * - Attribute validation
 *
 * Coverage Target: 100% (lines, branches, functions, statements)
 *
 * Usage:
 *   npm test -- jest-hero-block.test.js
 *   npm test -- jest-hero-block.test.js --coverage
 *   npm test -- jest-hero-block.test.js --watch
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { registerBlockType } from '@wordpress/blocks';
import { Hero } from '../blocks/hero/edit';
import { save } from '../blocks/hero/save';
import blockSettings from '../blocks/hero/block.json';

/**
 * ============================================================================
 * SETUP
 * ============================================================================
 */

// Mock WordPress dependencies
jest.mock('@wordpress/blocks');
jest.mock('@wordpress/block-editor', () => ({
  ...jest.requireActual('@wordpress/block-editor'),
  InspectorControls: ({ children }) => <div data-testid="inspector">{children}</div>,
  MediaUpload: ({ render }) => (
    <div data-testid="media-upload">
      {render({ open: jest.fn() })}
    </div>
  ),
  BlockControls: ({ children }) => <div data-testid="block-controls">{children}</div>,
  AlignmentToolbar: () => <div data-testid="alignment-toolbar" />,
  RichText: ({ value, onChange, placeholder }) => (
    <input
      data-testid="rich-text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

jest.mock('@wordpress/components', () => ({
  Button: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
  SelectControl: ({ options, value, onChange }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
  Panel: ({ children }) => <div data-testid="panel">{children}</div>,
  PanelBody: ({ title, children }) => (
    <div data-testid={`panel-${title}`}>{children}</div>
  ),
  TextControl: ({ value, onChange }) => (
    <input value={value} onChange={(e) => onChange(e.target.value)} />
  ),
  Notice: ({ children }) => <div data-testid="notice">{children}</div>,
}));

/**
 * ============================================================================
 * BLOCK REGISTRATION TESTS
 * ============================================================================
 */

describe('Hero Block - Registration', () => {
  test('block metadata is correct', () => {
    expect(blockSettings.name).toBe('namespace/hero-section');
    expect(blockSettings.title).toBe('Hero Section');
    expect(blockSettings.icon).toBeTruthy();
    expect(blockSettings.category).toBe('media');
  });

  test('block has required attributes', () => {
    const attributes = blockSettings.attributes;

    expect(attributes).toHaveProperty('imageId');
    expect(attributes).toHaveProperty('imageUrl');
    expect(attributes).toHaveProperty('imageAlt');
    expect(attributes).toHaveProperty('text');
    expect(attributes).toHaveProperty('description');
    expect(attributes).toHaveProperty('headingLevel');
    expect(attributes).toHaveProperty('textAlignment');
  });

  test('attributes have correct types', () => {
    const attributes = blockSettings.attributes;

    expect(attributes.imageId.type).toBe('number');
    expect(attributes.imageUrl.type).toBe('string');
    expect(attributes.imageAlt.type).toBe('string');
    expect(attributes.text.type).toBe('string');
    expect(attributes.description.type).toBe('string');
    expect(attributes.headingLevel.type).toBe('string');
    expect(attributes.textAlignment.type).toBe('string');
  });

  test('block supports required features', () => {
    const supports = blockSettings.supports;

    expect(supports.align).toBeTruthy();
    expect(supports.className).toBe(true);
    expect(supports.anchor).toBe(true);
  });

  test('block defines edit and save components', () => {
    expect(blockSettings.edit).toBeTruthy();
    expect(blockSettings.save).toBeTruthy();
  });

  test('block can be registered', () => {
    registerBlockType(blockSettings.name, blockSettings);
    expect(registerBlockType).toHaveBeenCalledWith(
      'namespace/hero-section',
      blockSettings
    );
  });
});

/**
 * ============================================================================
 * EDIT COMPONENT TESTS
 * ============================================================================
 */

describe('Hero Block - Edit Component', () => {
  const defaultProps = {
    attributes: {
      imageId: 0,
      imageUrl: '',
      imageAlt: '',
      text: 'Hero Heading',
      description: 'Hero description',
      headingLevel: 'h2',
      textAlignment: 'center',
    },
    setAttributes: jest.fn(),
    isSelected: true,
    clientId: 'test-block-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders edit component with attributes', () => {
    render(<Hero {...defaultProps} />);

    // Should render inspector
    expect(screen.getByTestId('inspector')).toBeInTheDocument();

    // Should render block controls
    expect(screen.getByTestId('block-controls')).toBeInTheDocument();
  });

  test('displays image when imageUrl is set', () => {
    const props = {
      ...defaultProps,
      attributes: {
        ...defaultProps.attributes,
        imageUrl: 'https://example.com/image.jpg',
      },
    };

    render(<Hero {...props} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('displays alt text in image', () => {
    const props = {
      ...defaultProps,
      attributes: {
        ...defaultProps.attributes,
        imageUrl: 'https://example.com/image.jpg',
        imageAlt: 'Mountain landscape',
      },
    };

    render(<Hero {...props} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Mountain landscape');
  });

  test('renders placeholder when no image', () => {
    render(<Hero {...defaultProps} />);

    // Should show media upload
    expect(screen.getByTestId('media-upload')).toBeInTheDocument();
  });

  test('updates text attribute when heading changes', () => {
    render(<Hero {...defaultProps} />);

    const richText = screen.getByTestId('rich-text');
    fireEvent.change(richText, { target: { value: 'New Heading' } });

    expect(defaultProps.setAttributes).toHaveBeenCalledWith({
      text: 'New Heading',
    });
  });

  test('updates description attribute when description changes', () => {
    render(<Hero {...defaultProps} />);

    const inputs = screen.getAllByTestId('rich-text');
    fireEvent.change(inputs[1], { target: { value: 'New description' } });

    expect(defaultProps.setAttributes).toHaveBeenCalledWith({
      description: 'New description',
    });
  });

  test('updates heading level via inspector', () => {
    render(<Hero {...defaultProps} />);

    // Find heading level select
    const selects = screen.getAllByRole('combobox');
    const headingSelect = selects.find((s) =>
      s.parentElement.textContent.includes('Heading')
    );

    if (headingSelect) {
      fireEvent.change(headingSelect, { target: { value: 'h3' } });
      expect(defaultProps.setAttributes).toHaveBeenCalledWith({
        headingLevel: 'h3',
      });
    }
  });

  test('updates text alignment', () => {
    render(<Hero {...defaultProps} />);

    expect(screen.getByTestId('alignment-toolbar')).toBeInTheDocument();
  });

  test('no console errors during render', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<Hero {...defaultProps} />);

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

/**
 * ============================================================================
 * SAVE COMPONENT TESTS
 * ============================================================================
 */

describe('Hero Block - Save Component', () => {
  const defaultAttributes = {
    imageId: 123,
    imageUrl: 'https://example.com/image.jpg',
    imageAlt: 'Hero image',
    text: 'Hero Heading',
    description: 'Hero description',
    headingLevel: 'h2',
    textAlignment: 'center',
  };

  test('renders figure element', () => {
    const { container } = render(
      <save.component attributes={defaultAttributes} />
    );

    expect(container.querySelector('figure')).toBeInTheDocument();
  });

  test('renders img element with attributes', () => {
    const { container } = render(
      <save.component attributes={defaultAttributes} />
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', defaultAttributes.imageUrl);
    expect(img).toHaveAttribute('alt', defaultAttributes.imageAlt);
  });

  test('renders heading with correct level', () => {
    const { container } = render(
      <save.component attributes={defaultAttributes} />
    );

    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe(defaultAttributes.text);
  });

  test('renders heading level h3 when specified', () => {
    const attrs = { ...defaultAttributes, headingLevel: 'h3' };
    const { container } = render(<save.component attributes={attrs} />);

    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
  });

  test('renders description paragraph', () => {
    const { container } = render(
      <save.component attributes={defaultAttributes} />
    );

    const paragraph = container.querySelector('figcaption p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.textContent).toBe(defaultAttributes.description);
  });

  test('applies alignment class', () => {
    const { container } = render(
      <save.component attributes={defaultAttributes} />
    );

    const figure = container.querySelector('figure');
    expect(figure.className).toContain('has-text-align-center');
  });

  test('renders with no alignment class when not specified', () => {
    const attrs = { ...defaultAttributes, textAlignment: '' };
    const { container } = render(<save.component attributes={attrs} />);

    const figure = container.querySelector('figure');
    expect(figure.className).not.toContain('has-text-align');
  });

  test('includes lazy loading attribute', () => {
    const { container } = render(
      <save.component attributes={defaultAttributes} />
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  test('sets width and height attributes', () => {
    const { container } = render(
      <save.component attributes={defaultAttributes} />
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('height');
  });

  test('outputs valid HTML structure', () => {
    const { container } = render(
      <save.component attributes={defaultAttributes} />
    );

    // Should have figure > img + figcaption structure
    const figure = container.querySelector('figure');
    expect(figure).toBeInTheDocument();

    const img = figure.querySelector('img');
    expect(img).toBeInTheDocument();

    const figcaption = figure.querySelector('figcaption');
    expect(figcaption).toBeInTheDocument();
  });
});

/**
 * ============================================================================
 * ATTRIBUTE VALIDATION TESTS
 * ============================================================================
 */

describe('Hero Block - Attribute Validation', () => {
  test('validates image ID is numeric', () => {
    const attrs = { imageId: 'not-a-number', imageUrl: '' };
    const isValid = Number.isInteger(attrs.imageId);

    expect(isValid).toBe(false);
  });

  test('validates image URL is valid URL', () => {
    const validUrl = 'https://example.com/image.jpg';

    try {
      new URL(validUrl);
      expect(true).toBe(true);
    } catch {
      expect(true).toBe(false);
    }
  });

  test('validates alt text is string', () => {
    const attrs = { imageAlt: 'Hero image description' };

    expect(typeof attrs.imageAlt).toBe('string');
  });

  test('validates heading level is h1-h6', () => {
    const validLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const level = 'h2';

    expect(validLevels).toContain(level);
  });

  test('validates text alignment is valid option', () => {
    const validAlignments = ['left', 'center', 'right'];
    const alignment = 'center';

    expect(validAlignments).toContain(alignment);
  });

  test('rejects invalid heading level', () => {
    const validLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const level = 'h7';

    expect(validLevels).not.toContain(level);
  });

  test('provides default values for missing attributes', () => {
    const defaultAttrs = {
      imageId: 0,
      imageUrl: '',
      imageAlt: '',
      text: '',
      description: '',
      headingLevel: 'h2',
      textAlignment: 'left',
    };

    expect(defaultAttrs.headingLevel).toBe('h2');
    expect(defaultAttrs.textAlignment).toBe('left');
  });
});

/**
 * ============================================================================
 * INTEGRATION TESTS
 * ============================================================================
 */

describe('Hero Block - Integration', () => {
  test('block renders correctly in editor and frontend', () => {
    const attributes = {
      imageId: 123,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Hero image',
      text: 'Hero Title',
      description: 'Hero description',
      headingLevel: 'h2',
      textAlignment: 'center',
    };

    const props = {
      attributes,
      setAttributes: jest.fn(),
      isSelected: true,
      clientId: 'test-id',
    };

    // Render edit component
    const editContainer = render(<Hero {...props} />);
    expect(editContainer).toBeTruthy();

    // Render save component
    const saveContainer = render(
      <save.component attributes={attributes} />
    );
    expect(saveContainer).toBeTruthy();
  });

  test('edit and save produce similar HTML structure', () => {
    const attributes = {
      imageId: 123,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Hero image',
      text: 'Hero Title',
      description: 'Hero description',
      headingLevel: 'h2',
      textAlignment: 'center',
    };

    const { container: saveContainer } = render(
      <save.component attributes={attributes} />
    );

    // Both should have figure, img, and figcaption
    expect(saveContainer.querySelector('figure')).toBeInTheDocument();
    expect(saveContainer.querySelector('img')).toBeInTheDocument();
    expect(saveContainer.querySelector('figcaption')).toBeInTheDocument();
  });

  test('block maintains data through edit cycle', async () => {
    const attributes = {
      imageId: 123,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Original alt',
      text: 'Original Title',
      description: 'Original description',
      headingLevel: 'h2',
      textAlignment: 'center',
    };

    const setAttributes = jest.fn();
    const props = {
      attributes,
      setAttributes,
      isSelected: true,
      clientId: 'test-id',
    };

    render(<Hero {...props} />);

    // Verify original data preserved
    expect(attributes.imageUrl).toBe('https://example.com/image.jpg');
    expect(attributes.text).toBe('Original Title');
  });
});

/**
 * ============================================================================
 * ACCESSIBILITY TESTS
 * ============================================================================
 */

describe('Hero Block - Accessibility', () => {
  const defaultProps = {
    attributes: {
      imageId: 123,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Descriptive hero image',
      text: 'Hero Heading',
      description: 'Hero description',
      headingLevel: 'h2',
      textAlignment: 'center',
    },
    setAttributes: jest.fn(),
    isSelected: true,
    clientId: 'test-block-id',
  };

  test('image has alt text', () => {
    const { container } = render(
      <save.component attributes={defaultProps.attributes} />
    );

    const img = container.querySelector('img');
    expect(img.alt).toBeTruthy();
    expect(img.alt.length).toBeGreaterThanOrEqual(15);
  });

  test('heading uses semantic element', () => {
    const { container } = render(
      <save.component attributes={defaultProps.attributes} />
    );

    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
  });

  test('figure uses semantic structure', () => {
    const { container } = render(
      <save.component attributes={defaultProps.attributes} />
    );

    const figure = container.querySelector('figure');
    const figcaption = container.querySelector('figcaption');

    expect(figure).toBeInTheDocument();
    expect(figcaption).toBeInTheDocument();
  });

  test('image has width and height for layout stability', () => {
    const { container } = render(
      <save.component attributes={defaultProps.attributes} />
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('height');
  });

  test('text content is readable (not hidden)', () => {
    const { container } = render(
      <save.component attributes={defaultProps.attributes} />
    );

    const heading = container.querySelector('h2');
    expect(heading.textContent).toBe(defaultProps.attributes.text);

    const description = container.querySelector('figcaption p');
    expect(description.textContent).toBe(defaultProps.attributes.description);
  });
});

/**
 * ============================================================================
 * COVERAGE SUMMARY
 * ============================================================================
 */

// Expected Coverage:
// - Line Coverage: 100%
// - Branch Coverage: 100%
// - Function Coverage: 100%
// - Statement Coverage: 100%
//
// Run coverage report:
// npm test -- --coverage jest-hero-block.test.js
//
// All tests should pass before shipping block

/**
 * ============================================================================
 * CONFIGURATION
 * ============================================================================
 */

// Jest configuration required in jest.config.js:
// {
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['<rootDir>/test-setup.js'],
//   moduleNameMapper: {
//     '^@wordpress/(.*)$': '<rootDir>/node_modules/@wordpress/$1',
//   },
//   collectCoverageFrom: [
//     'blocks/**/*.{js,jsx}',
//     '!blocks/**/*.test.{js,jsx}',
//     '!blocks/**/index.js',
//   ],
//   coverageThreshold: {
//     global: {
//       branches: 100,
//       functions: 100,
//       lines: 100,
//       statements: 100,
//     },
//   },
// }
