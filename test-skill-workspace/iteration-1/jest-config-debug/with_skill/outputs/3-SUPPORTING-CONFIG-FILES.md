# Supporting Configuration Files

To make the Jest configuration work properly, you also need these supporting files.

---

## 1. jest.setup.js

Create `jest.setup.js` in your project root to configure the test environment.

```javascript
/**
 * Jest setup file
 * Runs before every test suite
 */

// Polyfills and globals
import '@testing-library/jest-dom';

// Mock WordPress globals that might be needed
global.wp = {
  i18n: {
    __: (text) => text,
    _x: (text) => text,
    _n: (singular, plural, count) => count === 1 ? singular : plural,
  },
  element: {},
  components: {},
  hooks: {},
  data: {},
  blocks: {},
  blockEditor: {},
};

// Mock fetch if needed
global.fetch = jest.fn();

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('useLayoutEffect'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

**Update jest.config.js:**
```javascript
setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
```

---

## 2. .babelrc or babel.config.js

Babel transpiles modern JavaScript and JSX for Jest.

```javascript
/**
 * babel.config.js
 * Configuration for Babel transpilation
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
        '@babel/preset-react',
      ],
    },
  },
};
```

**Install required packages:**
```bash
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-jest
```

---

## 3. Mock Files

Jest needs to mock CSS, images, and other static assets.

### __mocks__/styleMock.js

```javascript
/**
 * Mock for CSS/SCSS imports in tests
 * Prevents "Cannot find module: .css" errors
 */
module.exports = {};
```

### __mocks__/fileMock.js

```javascript
/**
 * Mock for image and file imports
 */
module.exports = 'test-file-stub';
```

**Directory structure:**
```
project/
├── __mocks__/
│   ├── styleMock.js
│   └── fileMock.js
├── __tests__/
├── jest.config.js
├── jest.setup.js
└── .babelrc or babel.config.js
```

---

## 4. package.json Scripts

Add these npm scripts for testing:

```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:verbose": "jest --verbose --coverage",
    "test:ci": "jest --coverage --ci --maxWorkers=2",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  },
  "devDependencies": {
    "@babel/core": "^7.22.0",
    "@babel/preset-env": "^7.22.0",
    "@babel/preset-react": "^7.22.0",
    "@babel/preset-typescript": "^7.22.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@wordpress/element": "^5.0.0",
    "@wordpress/components": "^25.0.0",
    "babel-jest": "^29.5.0",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0"
  }
}
```

---

## 5. tsconfig.json (if using TypeScript)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@wordpress/*": ["node_modules/@wordpress/*"]
    }
  },
  "include": ["src/**/*", "__tests__/**/*"],
  "exclude": ["node_modules", "dist", "build"]
}
```

---

## 6. .eslintignore (if using ESLint)

Prevent ESLint from interfering with Jest:

```
coverage/
dist/
build/
node_modules/
__mocks__/
jest.setup.js
```

---

## File Structure Checklist

Create this structure for your WordPress plugin:

```
my-wordpress-plugin/
├── src/
│   ├── blocks/
│   │   ├── hero.js
│   │   ├── hero.test.js          ← Test here
│   │   └── hero.scss
│   ├── components/
│   │   ├── button.js
│   │   └── button.test.js        ← Or here
│   ├── utils/
│   │   ├── helpers.js
│   │   └── helpers.test.js       ← Or here
│   └── index.js
├── __tests__/                     ← Or centralized here
│   ├── blocks/
│   ├── components/
│   └── utils/
├── __mocks__/                     ← REQUIRED
│   ├── styleMock.js
│   └── fileMock.js
├── jest.config.js                ← REQUIRED (fixed)
├── jest.setup.js                 ← NEW
├── .babelrc or babel.config.js   ← NEW
├── package.json
└── tsconfig.json (optional)
```

---

## Verification Checklist

- [ ] jest.config.js has testMatch with `<rootDir>` prefix
- [ ] jest.config.js has moduleNameMapper with @wordpress/* mappings
- [ ] jest.config.js has collectCoverageFrom patterns
- [ ] jest.setup.js exists and is referenced in setupFilesAfterEnv
- [ ] .babelrc or babel.config.js exists with React preset
- [ ] __mocks__/styleMock.js exists
- [ ] __mocks__/fileMock.js exists
- [ ] package.json has babel-jest in devDependencies
- [ ] At least one test file exists: src/**/*.test.js

---

## Testing the Setup

Run these commands to verify everything works:

```bash
# 1. List discovered tests (should show your test files)
npx jest --listTests

# 2. Run tests with verbose output
npm run test:verbose

# 3. Check coverage (should be 100% if all source is imported by tests)
npm test

# 4. Debug mode (step through tests in debugger)
npm run test:debug
```

Expected output:
```
PASS  src/blocks/hero.test.js (1.234s)
  Hero Block
    ✓ renders without crashing (45ms)
    ✓ renders title prop (23ms)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COVERAGE summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Statements   : 100% (42/42)
Branches     : 100% (12/12)
Functions    : 100% (8/8)
Lines        : 100% (40/40)
```

If you see errors, check the **4-BEST-PRACTICES.md** file for troubleshooting.
