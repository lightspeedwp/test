# PHPUnit Reference

PHP backend testing for WordPress.

## Basic Test

```php
class MyTest extends \PHPUnit\Framework\TestCase {
  public function test_function_returns_value() {
    $result = my_function();
    $this->assertEquals('expected', $result);
  }
}
```

## WordPress Setup

```php
class WordPressTest extends \WP_UnitTestCase {
  public function setUp() {
    parent::setUp();
    $this->factory = new \WP_UnitTest_Factory();
  }
}
```

---

See TESTING.md for general testing guidance.
