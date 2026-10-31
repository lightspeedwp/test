# Lefthook Pre-Commit Hook Setup

Configure automated testing before commits.

## Installation

See references/lefthook-setup.md for platform-specific installation.

## Configuration

Copy `lefthook.yml` from skill root to project root.

## Running Hooks

```bash
# Run all pre-commit hooks
lefthook run pre-commit

# Run specific hook
lefthook run pre-commit jest

# Bypass hooks
git commit --no-verify
```

## Configuration Options

- **glob:** Files to match
- **exclude:** Files to exclude  
- **run:** Command to execute
- **fail_text:** Message if hook fails

---

See lefthook.yml in skill root for complete configuration example.
