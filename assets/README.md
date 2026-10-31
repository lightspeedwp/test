# Test Fixtures & Mock Data

Test fixtures, mock data, and templates for testing.

## Contents

### fixtures/
Reusable test data:
- WordPress block fixtures
- Theme configuration samples
- API response mocks
- User data fixtures
- Post/page samples

### mocks/
Mock implementations:
- Mock WordPress blocks
- Mock database responses
- Mock API clients
- Mock file systems
- Mock DOM structures

## Usage

Import fixtures in tests:
```javascript
import { blockFixture } from '../fixtures/block.fixture.js';
```

Use mocks for isolated testing:
```javascript
import { mockWP } from '../mocks/wp.mock.js';
```

## Creating Fixtures

1. Create realistic test data
2. Export as reusable constants
3. Document expected structure
4. Add validation helpers

---

See [JEST.md](../docs/JEST.md) and [PLAYWRIGHT.md](../docs/PLAYWRIGHT.md) for fixture patterns and best practices.
