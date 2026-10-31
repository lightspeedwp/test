# BATS Shell Script Tests

Shell script tests using BATS framework for build, deploy, and system testing.

## Structure

### *.bats
Test files using BATS syntax:
- One test file per component
- Clear test names
- Isolated test execution

### helpers/
Helper functions:
- Common assertions
- Setup/teardown functions
- Utility functions
- Mock helpers

### fixtures/
Test data and fixtures:
- Mock scripts
- Test configuration files
- Sample data

## Running Tests

```bash
# Run all BATS tests
npm run test:bats

# Run specific test file
bats tests/build.bats

# Run with verbose output
bats tests/*.bats --verbose
```

## Writing Tests

```bash
@test "npm script exits successfully" {
  run npm run build
  [ "$status" -eq 0 ]
  [[ "$output" == *"build succeeded"* ]]
}
```

## Test Patterns

- **Success checks** — Verify exit code and output
- **Error handling** — Test failure scenarios
- **File operations** — Verify file creation/modification
- **Environment setup** — Test configuration

---

See LEFTHOOK.md for integrating BATS into pre-commit hooks.
