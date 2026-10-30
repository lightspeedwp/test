---
name: test
description: |
  Expert testing and quality assurance skill for comprehensive software validation.
  Specializes in: PRD evaluation → test case generation → implementation testing.
  Supports Playwright E2E tests with MCP integration, accessibility auditing (WCAG 2.2 AAA),
  WordPress block themes/plugins, BATS shell script testing, Figma design validation,
  and Chrome DevTools integration. Expert in test design, test automation, accessibility
  compliance, and design-to-code testing workflows. Use when evaluating PRDs, writing
  test strategies, creating Playwright tests, auditing accessibility, testing WordPress
  blocks, validating shell scripts, or reviewing design implementations.
metadata:
  category: quality
  enabled: 'True'
  tags:
    - testing
    - qa
    - playwright
    - accessibility
    - wordpress
    - shell-scripting
    - figma
    - design-testing
    - prd-evaluation
    - chrome-devtools
  subskills:
    - test:prd-evaluation
    - test:playwright-expert
    - test:accessibility-audit
    - test:wordpress-blocks
    - test:bats-shell
    - test:figma-design-validation
    - test:chrome-devtools-integration
---

# Test & Quality Assurance Expert Skill

Comprehensive testing and quality assurance expertise covering PRD evaluation, test case design, Playwright automation, accessibility auditing, WordPress block development, shell script testing, Figma design validation, and Chrome DevTools integration.

## Core Capabilities

### 🎯 PRD Evaluation & Test Strategy
Transform product requirements into comprehensive test plans.

**Workflow**:
1. Review and analyze PRD specifications
2. Ask clarifying questions about requirements
3. Identify testable scenarios and edge cases
4. Design test strategy (unit, integration, E2E, accessibility)
5. Create test case matrix
6. Define acceptance criteria and success metrics

**Outputs**:
- Test case specification document
- Coverage matrix (features vs. test types)
- Edge cases and failure scenarios
- Accessibility requirements checklist
- Performance and load testing requirements

---

### 🎭 Playwright E2E Testing Expert
Advanced Playwright test creation with MCP integration and Chrome DevTools.

**Expertise**:
- Writing maintainable Playwright test suites
- Multi-browser testing (Chromium, Firefox, WebKit, Mobile)
- Test data management and fixtures
- Network mocking and API testing
- Screenshot and visual regression testing
- Performance benchmarking
- Flaky test diagnosis and remediation
- Playwright MCP integration for intelligent test generation
- Chrome DevTools MCP for debugging complex scenarios

**Test Types**:
- User workflow validation
- Navigation and routing
- Form submission and validation
- API integration testing
- File upload/download
- Authentication flows
- Permission-based UI testing
- Responsive design validation
- Cross-device testing

**Sub-skill**: `test:playwright-expert`

---

### ♿ Accessibility Auditing (WCAG 2.2 AAA Expert)
Comprehensive accessibility validation and remediation.

**Standard**: WCAG 2.2 Level AAA (per D3 Decision, Ash Shaw 2026-10-25)

**Expertise**:
- Keyboard navigation testing (all interactive elements)
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Color contrast validation (7:1 normal, 4.5:1 large)
- Focus management and visible focus indicators
- Form accessibility (labels, error messages, ARIA)
- Semantic HTML validation
- ARIA roles, properties, and states
- Dynamic content announcements
- Skip navigation implementation
- Page structure and heading hierarchy
- Link and button context
- Image alt text validation
- Video captions and transcripts
- Mobile accessibility

**Testing Tools**:
- Playwright accessibility checks (axe-core)
- Chrome DevTools Accessibility Inspector
- Lighthouse audits
- Manual screen reader testing
- Color contrast analyzers
- Focus indicator visibility testing

**Output**: Accessibility audit report with:
- Pass/fail status for each WCAG criterion
- Severity level (critical, major, minor)
- Code locations and remediation guidance
- Test screenshots and evidence
- Remediation recommendations

**Sub-skill**: `test:accessibility-audit`

---

### 🧱 WordPress Block Theme & Plugin Testing
Specialized testing for WordPress block-based development.

**Block Theme Testing**:
- Theme variant testing (light/dark mode, color schemes)
- Block composition and nesting
- Template responsiveness
- Typography and spacing validation
- Color palette compliance
- Custom block development testing
- Block pattern functionality
- Theme.json configuration validation
- Fallback behavior
- Browser compatibility

**Block Plugin Testing**:
- Block registration and discovery
- Block attributes and controls
- Block rendering (frontend & editor)
- RichText and editable area handling
- Nested block management
- Block transforms and migrations
- Save/load functionality
- Editor UI functionality
- Reusable block behavior
- Block API integration
- Plugin dependency testing

**Testing Scope**:
- Editor functionality (block insertion, editing, deletion)
- Frontend rendering
- Responsive behavior
- Accessibility compliance
- Performance (bundle size, load time)
- Backward compatibility
- PHP/JavaScript integration
- Database storage format

**Sub-skill**: `test:wordpress-blocks`

---

### 🐚 BATS Shell Script Testing
Bash Automated Testing System expertise for shell script validation.

**BATS Framework**:
- Unit testing shell scripts
- Function testing
- Exit code validation
- Output verification
- Mock command testing
- File system testing
- Environment variable handling
- Error scenario testing

**Use Cases**:
- Build scripts
- Deployment automation
- System utilities
- DevOps tooling
- Installation scripts
- Maintenance tasks

**Testing Patterns**:
```bash
#!/usr/bin/env bats

@test "script returns success on valid input" {
  run ./script.sh valid-input
  [ "$status" -eq 0 ]
  [[ "$output" == *"Success"* ]]
}

@test "script returns error on invalid input" {
  run ./script.sh invalid-input
  [ "$status" -ne 0 ]
  [[ "$output" == *"Error"* ]]
}
```

**Sub-skill**: `test:bats-shell`

---

### 🎨 Figma Design Validation & Testing
Evaluate design systems and validate design-to-code implementation.

**Figma Integration**:
- Analyze Figma component library
- Evaluate design tokens (colors, typography, spacing)
- Review component variations and states
- Validate design system consistency
- Compare design to code implementation
- Test responsive breakpoints
- Verify accessibility properties in design
- Check design-to-code fidelity

**Design System Audit**:
- Component documentation completeness
- Design token naming consistency
- Spacing and typography scale validation
- Color palette WCAG compliance
- Shadow and elevation systems
- Border radius consistency
- Icon sizing and alignment
- Animation and interaction specifications

**Design-to-Code Testing**:
- Visual regression testing (screenshots)
- Component prop coverage
- Responsive design points
- State handling (hover, active, disabled)
- Theme switching
- Dark mode implementation
- Design token values in code

**Sub-skill**: `test:figma-design-validation`

---

### 🔧 Chrome DevTools MCP Integration
Advanced debugging and performance analysis.

**Integration Points**:
- Network request inspection
- Console error tracking
- Performance profiling
- Memory leak detection
- Accessibility tree inspection
- CSS property validation
- JavaScript execution tracking
- Storage inspection
- Service worker debugging

**Use Cases**:
- Complex E2E test debugging
- Performance issue investigation
- Network error diagnosis
- Memory optimization
- Rendering performance
- API integration debugging

**Sub-skill**: `test:chrome-devtools-integration`

---

## Testing Workflow: PRD → Tests

### Phase 1: PRD Evaluation
```
1. Read and understand requirements
2. Ask clarifying questions:
   - What are acceptance criteria?
   - What edge cases matter?
   - What's the scope (user workflow, component, API)?
   - Performance requirements?
   - Accessibility requirements?
   - Mobile/responsive requirements?
   - Browser/device support?
   - Error scenarios?
3. Identify test scenarios
4. Define test types needed (unit, integration, E2E, accessibility)
5. Create test matrix
```

### Phase 2: Test Case Design
```
1. Write test case specification
   - Feature: [Feature Name]
   - Scenario: [User Action]
   - Given: [Setup]
   - When: [Action]
   - Then: [Expected Result]

2. Identify accessibility requirements
3. Define test data needs
4. Specify edge cases
5. List performance criteria
```

### Phase 3: Implementation
```
1. Write Playwright tests
2. Implement accessibility checks
3. Add performance monitoring
4. Verify cross-browser compatibility
5. Test responsive behavior
6. Validate against acceptance criteria
```

### Phase 4: Validation
```
1. Run full test suite
2. Generate coverage report
3. Audit accessibility compliance
4. Performance benchmarking
5. Create test report
```

---

## Sub-Skills Reference

| Sub-Skill | Purpose | Use When |
|-----------|---------|----------|
| `test:prd-evaluation` | Analyze requirements and create test strategy | Evaluating new features or requirements |
| `test:playwright-expert` | Write advanced Playwright tests | Creating E2E test suites |
| `test:accessibility-audit` | Audit WCAG 2.2 AAA compliance | Validating accessibility |
| `test:wordpress-blocks` | Test block themes and plugins | WordPress development |
| `test:bats-shell` | Test shell scripts with BATS | Testing build/deploy scripts |
| `test:figma-design-validation` | Validate design system and implementation | Design review and testing |
| `test:chrome-devtools-integration` | Debug with Chrome DevTools MCP | Complex test debugging |

---

## Starter Prompts

### "Evaluate This PRD and Create Test Cases"
```
I have a new feature PRD. Please:
1. Analyze the requirements
2. Ask clarifying questions about:
   - Acceptance criteria
   - Edge cases
   - Accessibility needs
   - Performance requirements
3. Create a test case matrix
4. Identify test types needed (unit, E2E, accessibility)
5. Define test data scenarios
```

### "Create Playwright Tests for This Feature"
```
Create comprehensive Playwright tests for [feature description]:
1. Write test cases covering happy path and edge cases
2. Include accessibility validation
3. Add performance benchmarks
4. Test responsive behavior
5. Cover error scenarios
```

### "Audit Accessibility Compliance"
```
Audit this application for WCAG 2.2 AAA compliance:
1. Test keyboard navigation
2. Validate screen reader compatibility
3. Check color contrast
4. Verify form accessibility
5. Test focus management
6. Generate audit report
```

### "Review Design and Test Implementation"
```
Compare this Figma design to the code implementation:
1. Evaluate design system tokens
2. Check component implementation fidelity
3. Test responsive design points
4. Verify accessibility properties
5. Validate design-to-code consistency
```

### "Create BATS Tests for Shell Script"
```
Create BATS tests for this shell script:
1. Test success scenarios
2. Test error handling
3. Validate exit codes
4. Check output formats
5. Test edge cases
```

---

## Expert Topics

### Playwright + Chrome DevTools Debugging
Complex scenarios requiring both Playwright test automation and Chrome DevTools MCP:
- Network request mocking and inspection
- Performance profiling during tests
- Memory leak detection
- Console error tracking
- API response validation

### WordPress Block Accessibility
Ensuring WordPress blocks meet accessibility standards:
- Block markup semantic correctness
- ARIA attributes in block templates
- Color contrast in block UI
- Keyboard navigation in block editor
- Block pattern accessibility

### Figma-to-Code Testing
Validating design system implementation:
- Component prop mapping to Figma variants
- Token value verification
- Responsive breakpoint testing
- State and interaction coverage
- Visual regression testing

### Performance Testing
Validating performance requirements from PRD:
- Page load time benchmarks
- Interaction responsiveness
- Core Web Vitals (LCP, INP, CLS)
- Bundle size limits
- Rendering performance

---

## MCP Integrations

### Playwright MCP
- Intelligent test case generation from requirements
- Test code generation from user workflows
- Test result analysis and reporting
- Flaky test diagnosis

### Chrome DevTools MCP
- Network inspection and mocking
- Performance profiling
- Memory analysis
- Accessibility tree inspection
- CSS and DOM debugging

### Figma MCP (Design Plugin)
- Component library analysis
- Design token extraction
- Variant enumeration
- Design system audit
- Design-to-code comparison

---

## Testing Standards

### Code Coverage Minimums
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

### Accessibility Standards
- WCAG 2.2 Level AAA compliance
- Keyboard navigation for all interactive elements
- Screen reader compatibility
- Color contrast: 7:1 (normal), 4.5:1 (large)
- Form labels and error messages
- Focus management

### Performance Standards
- Lighthouse score: 90+
- Page load time: < 3s (LCP)
- Interaction responsiveness: < 100ms (INP)
- Layout stability: < 0.1 (CLS)

---

## When to Use This Skill

✅ **Use this skill when**:
- Evaluating a new product requirement (PRD)
- Creating comprehensive test strategies
- Writing Playwright E2E tests
- Auditing accessibility compliance
- Testing WordPress block themes or plugins
- Validating shell script functionality
- Reviewing Figma designs vs. implementation
- Debugging complex test failures with Chrome DevTools
- Validating design-to-code fidelity
- Creating test cases from requirements

❌ **Don't use this skill for**:
- Simple quick manual testing
- Running existing tests (use test runner directly)
- General code review (use code-review skill)
- Simple unit test writing (Jest/PHPUnit basic cases)

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [BATS Framework](https://github.com/bats-core/bats-core)
- [WordPress Block Development](https://developer.wordpress.org/block-editor/)
- [Chrome DevTools API](https://chromedevtools.github.io/devtools-protocol/)

---

*Test & QA Expert Skill v2.0 — Comprehensive testing and quality assurance*
