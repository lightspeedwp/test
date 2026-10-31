# BATS Shell Script Testing

Testing build and deploy scripts with BATS framework.

## Basic BATS Test

```bash
#!/usr/bin/env bats

@test "npm build succeeds" {
  run npm run build
  [ "$status" -eq 0 ]
  [[ "$output" == *"Build complete"* ]]
}

@test "build output contains dist folder" {
  run npm run build
  [ -d "dist" ]
  [ -f "dist/index.js" ]
}
```

## Setup and Teardown

```bash
setup() {
  export TEST_DIR=$(mktemp -d)
  cd "$TEST_DIR"
}

teardown() {
  rm -rf "$TEST_DIR"
}

@test "creates output file" {
  run ../scripts/process.sh input.txt
  [ -f "output.txt" ]
}
```

## Error Handling

```bash
@test "script handles missing file" {
  run ../scripts/process.sh missing.txt
  [ "$status" -ne 0 ]
  [[ "$output" == *"File not found"* ]]
}
```

---

See LEFTHOOK.md for integrating BATS into pre-commit hooks.
