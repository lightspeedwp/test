# WordPress Block Testing Standards

Standards and conventions for WordPress block testing.

## Block Structure

```
namespace/block-name/
├── block.json
├── index.js
├── edit.js
├── save.js
└── style.scss
```

## Test Organization

```
__tests__/
├── blocks/
│   └── block-name/
│       ├── registration.test.js
│       ├── editor.test.js
│       ├── frontend.test.js
│       └── accessibility.test.js
```

## Naming Conventions

- Block name: `namespace/block-name` (kebab-case)
- Class names: `wp-block-namespace-block-name`
- Data attributes: `data-testid="block-name-control"`
- Tests: `*.test.js` in `__tests__` folder

---

See wordpress-blocks-testing.md for testing strategy.
