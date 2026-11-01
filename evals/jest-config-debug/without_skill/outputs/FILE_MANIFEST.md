# File Manifest

Complete list of files in this Jest debugging package with descriptions and usage.

## Configuration Files (Copy to Your Plugin)

### `jest.config.js`
**Purpose:** Main Jest configuration file  
**Action:** Copy directly to your plugin root  
**Size:** ~350 lines with extensive comments  
**Contains:**
- testMatch patterns for finding tests (Issue 1 fix)
- collectCoverageFrom and coverage reporters (Issue 2 fix)
- moduleNameMapper for WordPress packages (Issue 3 fix)
- Transform configuration
- CSS/image mocking
- TypeScript support
- Inline explanations for each section

**Must-read sections:**
- Line 11-40: testMatch explanation (Issue 1)
- Line 45-80: Coverage collection (Issue 2)
- Line 85-130: Module mapping (Issue 3)

---

### `jest.setup.js`
**Purpose:** Optional global test setup  
**Action:** Copy to plugin root, then enable in jest.config.js  
**Size:** ~140 lines  
**Contains:**
- Global wp.* object mocks
- WordPress hooks API mock
- WordPress i18n mock
- Window polyfill mocks
- Helper functions for tests

**Enable in jest.config.js:**
```javascript
setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
```

**When to use:**
- If you need wp.* objects in all tests
- To avoid importing WordPress packages in every test
- For consistent mock behavior across test suite

---

### `__mocks__/styleMock.js`
**Purpose:** Mock CSS/SCSS imports  
**Action:** Create in `__mocks__/` directory in your plugin root  
**Size:** 7 lines  
**Required for:** Tests with components that import CSS

**Example error this fixes:**
```
SyntaxError: Unexpected token '.' at import './style.scss'
```

---

### `__mocks__/fileMock.js`
**Purpose:** Mock image/font imports  
**Action:** Create in `__mocks__/` directory in your plugin root  
**Size:** 7 lines  
**Required for:** Tests with components that use images or fonts

**Example error this fixes:**
```
SyntaxError: Unexpected token '.' at import logo from './logo.png'
```

---

### `.babelrc.example`
**Purpose:** Example Babel configuration for WordPress  
**Action:** Copy content to `.babelrc` or `package.json` babel field  
**Size:** 10 lines  
**Contains:** WordPress babel preset configuration

**Note:** You may already have this from wp-scripts, just verify it exists

---

### `package.json.example`
**Purpose:** Example package.json with needed scripts and dependencies  
**Action:** Reference for needed scripts and devDependencies  
**Size:** ~30 lines  
**Contains:**
- Test scripts (test, test:watch, test:coverage, test:debug, test:ci)
- All needed devDependencies
- WordPress package versions
- Testing library versions

**Scripts to add to your package.json:**
```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage",
"test:debug": "node --inspect-brk ./node_modules/.bin/jest --runInBand",
"test:ci": "jest --coverage --watchAll=false"
```

---

## Documentation Files

### `README.md`
**Purpose:** Package overview and quick start  
**Read this if:** You're new to this package  
**Size:** ~200 lines  
**Contains:**
- What the three issues are
- What's included in package
- Quick start (5 minutes)
- Common scenarios with solutions
- Which file to read for your question
- Key points to remember

**Start here:** YES (before copying any files)

---

### `JEST_DEBUG_GUIDE.md`
**Purpose:** Deep technical explanation of all three issues  
**Read this if:**
- You want to understand WHY the fixes work
- You're learning Jest + WordPress testing
- You need to customize the configuration
- You're debugging similar issues in other projects

**Size:** ~400 lines  
**Contains:**
- Issue 1: testMatch explanation (symptoms, root causes, diagnosis, fixes, why it works)
- Issue 2: Coverage 0% explanation (symptoms, root causes, diagnosis, fixes, why it works)
- Issue 3: Module mapping explanation (symptoms, root causes, diagnosis, fixes, why it works)
- WordPress package resolution patterns
- Complete fixed configuration with comments
- Best practices for WordPress Jest setup
- Progressive coverage thresholds
- Debugging checklist
- References

**Key sections:**
- Pages 1-40: Issue 1 detailed
- Pages 41-80: Issue 2 detailed
- Pages 81-150: Issue 3 detailed
- Pages 151-200: Best practices

---

### `QUICK_REFERENCE.md`
**Purpose:** One-page cheat sheet for common tasks  
**Read this if:**
- You need fast answers
- You want copy-paste code
- You're looking for a specific command
- You need a diagnostic checklist

**Size:** ~250 lines  
**Contains:**
- Three issues summary table
- Copy-paste fixes for each issue
- Setup files needed checklist
- Diagnostic commands
- Common problems & solutions table
- File organization best practice
- package.json scripts
- CI/CD example
- Debugging checklist
- Version compatibility

**Use as:** Reference while coding

---

### `TROUBLESHOOTING.md`
**Purpose:** Step-by-step systematic debugging  
**Read this if:**
- Tests still don't work after using jest.config.js
- You need to understand what's wrong
- You want guided problem-solving
- You're stuck on a specific error

**Size:** ~500 lines  
**Contains:**
- 11 debugging steps (each with commands, expected output, fixes)
- Test file discovery troubleshooting
- Configuration validation
- Dependency verification
- Module resolution testing
- Simple test approach
- Coverage collection diagnosis
- CSS/image import issues
- React component issues
- Transform chain debugging
- Individual test debugging
- Comprehensive diagnosis script
- Common errors reference table
- Performance debugging
- Quick fix checklist
- When all else fails

**Follow in order:** Yes (Step 1, 2, 3, ... etc)

---

### `EXAMPLE_TESTS.md`
**Purpose:** Working code examples  
**Read this if:**
- You want to see how to write tests
- You need patterns to copy
- You're testing similar scenarios

**Size:** ~400 lines  
**Contains:**
- Example 1: Testing WordPress blocks (React components)
- Example 2: Testing utility functions
- Example 3: Testing WordPress hooks
- Example 4: Integration testing
- Running tests (commands)
- Common testing patterns
- References

**Copy from:** Yes (patterns and test code)

---

### `FILE_MANIFEST.md`
**Purpose:** This file - description of all files  
**Size:** ~300 lines  
**Use for:** Understanding what each file does

---

## Usage Flowchart

```
START
  |
  v
Read README.md (2 min)
  |
  +---> Want to understand? ---> Read JEST_DEBUG_GUIDE.md
  |
  +---> Just fix it? ---> Copy jest.config.js + mocks
  |
  +---> Need quick lookup? ---> Use QUICK_REFERENCE.md
  |
  +---> Tests still broken? ---> Follow TROUBLESHOOTING.md
  |
  +---> Want test code? ---> See EXAMPLE_TESTS.md
  |
  v
END
```

---

## File Dependencies

```
jest.config.js
  ├── Needs: __mocks__/styleMock.js (for CSS)
  ├── Needs: __mocks__/fileMock.js (for images)
  └── Optional: jest.setup.js (for global mocks)

jest.setup.js
  ├── Optional reference in jest.config.js
  └── Needs: installed @wordpress packages

.babelrc.example
  └── Info only, may already exist

package.json.example
  └── Info only, copy snippets as needed
```

---

## File Sizes & Read Times

| File | Size | Read Time | Best For |
|------|------|-----------|----------|
| README.md | 200 lines | 5 min | Quick overview |
| JEST_DEBUG_GUIDE.md | 400 lines | 30 min | Understanding |
| QUICK_REFERENCE.md | 250 lines | 10 min | Lookup/copy |
| TROUBLESHOOTING.md | 500 lines | 45 min | Debugging |
| EXAMPLE_TESTS.md | 400 lines | 30 min | Learning |
| jest.config.js | 350 lines | 15 min | Implementation |
| jest.setup.js | 140 lines | 5 min | Optional |
| FILE_MANIFEST.md | 300 lines | 10 min | This file |

---

## Content Index

### Configuration Explained
- Jest configuration structure: jest.config.js (with comments)
- Babel setup: .babelrc.example
- Package.json: package.json.example
- Global setup: jest.setup.js

### Issue Fixes Explained
- Issue 1 (testMatch): JEST_DEBUG_GUIDE.md p.1-40
- Issue 2 (Coverage): JEST_DEBUG_GUIDE.md p.41-80
- Issue 3 (Module mapping): JEST_DEBUG_GUIDE.md p.81-150
- All three as table: QUICK_REFERENCE.md p.1

### Practical Debugging
- Find your error: TROUBLESHOOTING.md (Common Problems table)
- Step-by-step process: TROUBLESHOOTING.md (11 steps)
- Fast commands: QUICK_REFERENCE.md (Diagnostic Commands)

### Code Examples
- React component tests: EXAMPLE_TESTS.md (Example 1)
- Utility function tests: EXAMPLE_TESTS.md (Example 2)
- WordPress hooks tests: EXAMPLE_TESTS.md (Example 3)
- Integration tests: EXAMPLE_TESTS.md (Example 4)
- Common patterns: EXAMPLE_TESTS.md (Common Patterns section)

### Best Practices
- Project structure: JEST_DEBUG_GUIDE.md + QUICK_REFERENCE.md
- Package.json scripts: package.json.example + QUICK_REFERENCE.md
- Coverage thresholds: JEST_DEBUG_GUIDE.md
- CI/CD setup: JEST_DEBUG_GUIDE.md + QUICK_REFERENCE.md

---

## Quick Access by Problem

### "I can't find my tests"
1. Start: README.md (scenario table)
2. Check: QUICK_REFERENCE.md (diagnostic commands)
3. Fix: jest.config.js (testMatch section)
4. Understand: JEST_DEBUG_GUIDE.md (Issue 1)
5. Debug: TROUBLESHOOTING.md (Step 2)

### "Coverage shows 0%"
1. Start: README.md (scenario table)
2. Check: QUICK_REFERENCE.md (common problems)
3. Fix: jest.config.js (collectCoverageFrom section)
4. Understand: JEST_DEBUG_GUIDE.md (Issue 2)
5. Debug: TROUBLESHOOTING.md (Step 7)

### "@wordpress modules not found"
1. Start: README.md (scenario table)
2. Check: QUICK_REFERENCE.md (common problems)
3. Fix: jest.config.js (moduleNameMapper section)
4. Understand: JEST_DEBUG_GUIDE.md (Issue 3)
5. Debug: TROUBLESHOOTING.md (Step 4-5)

### "CSS/image import errors"
1. Fix: Create __mocks__/styleMock.js and fileMock.js
2. Verify: jest.config.js has moduleNameMapper CSS sections
3. Debug: TROUBLESHOOTING.md (Step 8)

### "How do I write tests?"
1. Study: EXAMPLE_TESTS.md
2. Copy: Patterns from relevant example
3. Verify: jest.config.js handles your file types

---

## Recommended Reading Order

### For Implementation (Just Make It Work)
1. README.md (2 min)
2. Copy jest.config.js, __mocks__/, jest.setup.js
3. QUICK_REFERENCE.md (copy package.json sections)
4. Test: `npx jest --listTests`

### For Understanding
1. README.md (2 min)
2. JEST_DEBUG_GUIDE.md (30 min) - all three issues explained
3. jest.config.js (10 min) - read with comments
4. QUICK_REFERENCE.md (5 min) - for reference

### For Learning Testing
1. README.md (2 min)
2. EXAMPLE_TESTS.md (20 min) - see patterns
3. Copy example test into your project
4. Run: `npm test`
5. Modify to fit your code

### For Debugging
1. Identify your error
2. QUICK_REFERENCE.md (find error in table)
3. TROUBLESHOOTING.md (follow steps)
4. JEST_DEBUG_GUIDE.md (understand why)

---

## File Checklist for Your Plugin

After using these files, your plugin should have:

```
my-plugin/
├── jest.config.js                  ✓ Copied from package
├── jest.setup.js                   ✓ Optional, copied if using global mocks
├── __mocks__/
│   ├── styleMock.js                ✓ Required, copied from package
│   └── fileMock.js                 ✓ Required, copied from package
├── .babelrc                        ✓ May already exist (check .babelrc.example)
├── package.json                    ✓ Updated with scripts and deps
└── src/
    ├── blocks/
    │   └── my-block/
    │       ├── edit.js
    │       └── edit.test.js         ✓ Your tests
    └── utils/
        └── helpers.test.js          ✓ Your tests
```

---

## Support Map

| Question | Goto |
|----------|------|
| "What's included?" | README.md |
| "Why does this work?" | JEST_DEBUG_GUIDE.md |
| "How do I fix this?" | QUICK_REFERENCE.md |
| "I'm stuck, help me debug" | TROUBLESHOOTING.md |
| "Show me working code" | EXAMPLE_TESTS.md |
| "What's in this file?" | FILE_MANIFEST.md |
| "I need configuration" | jest.config.js |
| "I need the mocks" | __mocks__/styleMock.js, fileMock.js |

---

## Version Info

- Jest: 29.x
- WordPress packages: @5.x - @6.x
- WordPress components: 20.x+
- Node.js: 14.x+
- React: 18.x
- Testing Library: 13.x+

---

## Notes

- All markdown files use consistent formatting for easy scanning
- jest.config.js includes extensive inline comments
- Copy jest.config.js directly or study line-by-line
- __mocks__/ files are minimal - create in __mocks__/ directory
- Some documentation assumes wp-scripts is used (standard approach)
- Babel config may already exist if using wp-scripts
- All paths use <rootDir> for CI/CD compatibility

---

Last Updated: 2024  
For WordPress plugin testing with Jest 29.x and wp-scripts
