# PHPUnit Testing Guide

Quick reference guide for PHPUnit testing.

## Quick Start

```bash
composer require --dev phpunit/phpunit

# Run tests
composer test

# Or directly
./vendor/bin/phpunit

# Watch mode
./vendor/bin/phpunit -w

# Coverage
./vendor/bin/phpunit --coverage-html coverage/
```

## Configuration

**phpunit.xml**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/9.5/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         cacheResultFile=".phpunit.cache/test-results"
         executionOrder="random"
         failOnWarning="true"
         failOnRisky="true">
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory suffix="Test.php">tests/Feature</directory>
        </testsuite>
    </testsuites>
    <coverage processUncoveredFiles="true">
        <include>
            <directory suffix=".php">src</directory>
        </include>
        <report>
            <html outputDirectory="coverage"/>
            <text outputFile="php://stdout" showUncoveredFiles="true"/>
        </report>
    </coverage>
    <php>
        <env name="APP_ENV" value="testing"/>
    </php>
</phpunit>
```

## Writing Tests

### Basic Test

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class MathTest extends TestCase {
    public function test_add() {
        $this->assertEquals(3, 1 + 2);
    }
}
```

### Test Structure

```php
class UserTest extends TestCase {
    /**
     * Set up test fixtures
     */
    protected function setUp(): void {
        parent::setUp();
        // Setup code before each test
    }

    /**
     * Clean up after each test
     */
    protected function tearDown(): void {
        // Cleanup code after each test
        parent::tearDown();
    }

    public function test_something() {
        // Arrange
        $user = new User();
        
        // Act
        $user->setName('John');
        
        // Assert
        $this->assertEquals('John', $user->getName());
    }
}
```

### Assertions

| Assertion | Usage |
|-----------|-------|
| `assertEquals()` | Values are equal |
| `assertSame()` | Values are identical (===) |
| `assertNull()` | Value is null |
| `assertTrue()` | Value is true |
| `assertFalse()` | Value is false |
| `assertCount()` | Array count |
| `assertContains()` | Contains value |
| `assertArrayHasKey()` | Array has key |
| `assertStringContains()` | String contains substring |
| `assertThrows()` | Throws exception |
| `assertInstanceOf()` | Is instance of class |
| `assertEmpty()` | Value is empty |

### Mocking

```php
// Create mock
$mock = $this->createMock(UserRepository::class);
$mock->method('findById')
    ->willReturn(new User('John'));

// Create mock with configuration
$mock = $this->getMockBuilder(UserRepository::class)
    ->onlyMethods(['findById'])
    ->getMock();

$mock->expects($this->once())
    ->method('findById')
    ->with(1)
    ->willReturn(new User('John'));

// Spy on method
$user = $this->getMockBuilder(User::class)
    ->addMethods(['save'])
    ->getMock();
```

### Stubs

```php
$stub = $this->createStub(SomeClass::class);
$stub->method('doSomething')
    ->willReturn('foo');

$this->assertEquals('foo', $stub->doSomething());
```

### Test Doubles

```php
// Dummy - object is passed but never used
$dummy = $this->createMock(Logger::class);

// Stub - returns configured value
$stub = $this->createStub(UserRepository::class);

// Mock - verifies interaction
$mock = $this->createMock(PaymentGateway::class);
$mock->expects($this->once())
    ->method('charge')
    ->willReturn(true);

// Spy - tracks actual calls
$spy = $this->getMockBuilder(Logger::class)
    ->addMethods(['debug'])
    ->getMock();
```

### Data Providers

```php
/**
 * @dataProvider additionProvider
 */
public function test_add($a, $b, $expected) {
    $this->assertEquals($expected, $a + $b);
}

public function additionProvider() {
    return [
        [1, 2, 3],
        [0, 0, 0],
        [-1, 1, 0],
    ];
}
```

### Database Testing

```php
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserRepositoryTest extends TestCase {
    use DatabaseTransactions;

    public function test_save_user() {
        $user = User::factory()->make();
        
        $user->save();
        
        $this->assertDatabaseHas('users', [
            'name' => $user->name,
        ]);
    }
}
```

### Exception Testing

```php
public function test_invalid_email_throws() {
    $this->expectException(InvalidEmailException::class);
    
    new User('invalid-email');
}

// With message
$this->expectExceptionMessage('Invalid email format');

// With code
$this->expectExceptionCode(400);
```

## Running Tests

```bash
./vendor/bin/phpunit                          # All tests
./vendor/bin/phpunit tests/Unit/UserTest.php  # Single file
./vendor/bin/phpunit --testdox                # Better format
./vendor/bin/phpunit -v                       # Verbose
./vendor/bin/phpunit -x                       # Stop on first failure
./vendor/bin/phpunit --filter="testName"      # Pattern match
./vendor/bin/phpunit -w                       # Watch mode
./vendor/bin/phpunit --coverage-html coverage/  # Coverage report
```

## Debugging

```bash
# Verbose output
./vendor/bin/phpunit -v

# Debug with print statements
./vendor/bin/phpunit tests/Unit/UserTest.php --debug

# Stop on first failure
./vendor/bin/phpunit -x

# With code coverage
./vendor/bin/phpunit --coverage-text

# Single test with detailed output
./vendor/bin/phpunit -v tests/Feature/UserTest.php::testCreate
```

## Tips & Tricks

- Use factories for test data creation
- Isolate tests (no shared state between tests)
- Use transactions to rollback database changes
- Mock external dependencies (APIs, file systems)
- Keep setup code clean with helper methods
- Use data providers for testing multiple inputs
- Verify behavior, not implementation details
- Name tests descriptively

---

*PHPUnit Reference Guide v1.0*
