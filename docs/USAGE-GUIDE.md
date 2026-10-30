# Expert Test Skill Usage Guide

Complete guide to using the expert-level test skill workflows, with quick-start guides, common scenarios, and best practices.

## Table of Contents

1. [Quick Start (5 Minutes)](#quick-start)
2. [Common Scenarios](#common-scenarios)
3. [Workflow Patterns](#workflow-patterns)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Installation

**Local Skill** (already installed):
```bash
~/.claude/skills/test/
```

**Access in Claude Code**:
```
/test [your prompt]
```

### Activate the Skill

In Claude Code chat:
```
Use the test skill to [what you need]
```

Or directly:
```
/test "Evaluate this PRD and create a test strategy"
```

### Your First Test Strategy

**Input**:
```
Evaluate this PRD and create a comprehensive test strategy:

Feature: User Login
- Users should log in with email + password
- Display error for invalid credentials
- Lock account after 3 failed attempts
- Send 2FA code via email
- Requirement: WCAG 2.2 AAA accessible
```

**Expected Output**:
1. Test matrix (unit, E2E, accessibility)
2. Test case specifications
3. Accessibility requirements
4. Playwright test templates
5. Performance criteria

**Time**: 15-20 minutes for expert-level specification

---

## Common Scenarios

### Scenario 1: "We Have a PRD, Where Do We Start?"

**Your Request**:
```
I have a PRD for a new feature. Help me design a comprehensive test strategy.
```

**What Happens**:
1. Test skill analyzes the PRD
2. Asks clarifying questions:
   - What's the scope (component, workflow, API)?
   - Performance requirements?
   - Accessibility requirements?
   - Browser/device support?
3. Creates test matrix
4. Designs test cases
5. Provides Playwright test templates

**You Get**:
- Test case specification document
- Coverage matrix
- Edge cases identified
- Playwright boilerplate code
- Accessibility checklist

**Next Step**: Implement tests using the templates

---

### Scenario 2: "We Have a Figma Design, Does Code Match?"

**Your Request**:
```
Validate that our code implementation matches the Figma design system.
Review design tokens, components, and responsive behavior.
```

**What Happens**:
1. Skill analyzes Figma design specifications
2. Extracts design tokens
3. Compares to code implementation
4. Tests visual regression
5. Validates responsive breakpoints
6. Generates comparison report

**You Get**:
- Design-to-code fidelity report
- Token mismatch list
- Visual regression test cases
- Theme variant validation
- Recommendations for fixes

**Next Step**: Fix discrepancies, re-test

---

### Scenario 3: "We Need to Audit Accessibility"

**Your Request**:
```
Audit this application for WCAG 2.2 AAA compliance and provide a fix plan.
```

**What Happens**:
1. Automated accessibility checks run
2. Manual testing workflow:
   - Keyboard navigation
   - Screen reader testing
   - Color contrast validation
   - Form accessibility
   - Focus management
3. Generates detailed audit report
4. Prioritizes fixes (critical → minor)

**You Get**:
- Accessibility audit report
- Critical issues with fixes
- Test cases for validation
- Team remediation roadmap
- Automated test suite to prevent regression

**Next Step**: Implement fixes, re-audit

---

### Scenario 4: "We're Building a WordPress Block"

**Your Request**:
```
Create comprehensive tests for this WordPress block plugin covering
editor functionality, frontend rendering, and accessibility.
```

**What Happens**:
1. Skill designs block testing strategy
2. Creates test cases for:
   - Block registration and discovery
   - Editor UI functionality
   - Frontend rendering
   - Responsive behavior
   - Accessibility
3. Provides Playwright test templates
4. Provides BATS shell script tests for build
5. Generates checklist

**You Get**:
- Block testing checklist
- Playwright E2E tests
- Unit test structure
- Shell script tests
- Accessibility validation

**Next Step**: Run tests in CI/CD

---

### Scenario 5: "Tests Are Failing, Help Debug"

**Your Request**:
```
This Playwright test is flaky. Debug it and help me fix the issue.
[paste test code]
```

**What Happens**:
1. Analyzes test code
2. Identifies potential issues:
   - Timing issues (hard waits)
   - Flaky selectors
   - State issues
   - Network mocking problems
3. Uses Chrome DevTools MCP for debugging
4. Provides corrected test code
5. Suggests debugging approach

**You Get**:
- Root cause analysis
- Fixed test code
- Debugging commands
- Prevention strategies
- Performance metrics

**Next Step**: Run fixed test

---

## Workflow Patterns

### Pattern 1: PRD → Test Strategy → Implementation

```
┌─────────────────────────────────────────┐
│ 1. Have PRD (or describe feature)        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. Ask test skill to create test plan   │
│    "Create test strategy for PRD"       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 3. Get test matrix, cases, and templates│
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 4. Implement tests from templates       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 5. Run tests, get feedback              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 6. Ask skill to audit accessibility     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 7. Fix issues, all tests pass ✓         │
└─────────────────────────────────────────┘
```

**Duration**: 2-5 days per feature

---

### Pattern 2: Design Review → Code Validation

```
Figma Design
    ↓
Extract Design Tokens
    ↓
Compare to Code
    ↓
Visual Regression Tests
    ↓
Responsive Validation
    ↓
Generate Report
    ↓
Fix Discrepancies
    ↓
Re-test ✓
```

**Duration**: 4-6 hours per design system

---

### Pattern 3: Continuous Accessibility

```
Every PR
    ↓
Automated Accessibility Check
    ↓
Playwright A11y Tests
    ↓
Report WCAG Violations
    ↓
Block Merge if Critical
    ↓
Team Fixes Issues
    ↓
Re-run, Merge ✓
```

**Duration**: Continuous

---

## Best Practices

### 1. **Always Start with PRD Evaluation**

Don't jump to writing tests. Get clarity first:

```
❌ "Write Playwright tests for login"
✅ "Evaluate this login PRD and create test strategy"
```

The skill will:
- Ask clarifying questions
- Identify edge cases
- Design comprehensive strategy
- THEN provide test templates

**Result**: Better tests, fewer misunderstandings

---

### 2. **Accessibility First, Not Last**

Include accessibility in initial test strategy:

```
❌ Test for functionality → then add accessibility tests
✅ Design accessibility requirements → build in tests from start
```

**Benefit**: WCAG 2.2 AAA from day one, not retrofitted

---

### 3. **Use the Skill's Prompts**

Don't reinvent the wheel. Use expert prompts:

```
~/.claude/skills/test/prompts/
├── prd-evaluation-workflow.md ← Use for new features
├── accessibility-wcag-audit.md ← Use for accessibility
├── wordpress-block-testing.md ← Use for blocks
├── figma-design-to-code-testing.md ← Use for design validation
└── ... (others)
```

**Benefit**: Structured workflows, consistent results

---

### 4. **Iterate on Feedback**

Test strategy doesn't need to be perfect first time:

```
Round 1: Create test strategy
    ↓
Round 2: Get team feedback
    ↓
Round 3: Refine based on feedback
    ↓
Round 4: Implement with confidence
```

**Benefit**: Tests aligned with team expectations

---

### 5. **Document Decisions**

Save the skill's output. It's your testing spec:

```bash
# Save in repo
docs/test-strategy-[feature-name].md
```

**Benefit**: Reference for future work, onboarding

---

### 6. **Test Real Scenarios**

Don't just test happy paths:

```
❌ "User logs in with valid email"
✅ "User logs in, forgets password, resets, logs in again"
```

Ask the skill to identify edge cases:

```
"What edge cases matter for login? Include account lockout,
2FA failures, password reset flows, etc."
```

**Benefit**: Catches real-world issues

---

### 7. **Make Accessibility a Requirement**

Build it in:

```
❌ "Make tests then audit accessibility"
✅ "Create test strategy including WCAG 2.2 AAA requirements"
```

**Benefit**: WCAG compliance built in, not retrofitted

---

## Troubleshooting

### Issue 1: "Test Strategy Is Overwhelming"

**Symptom**: Strategy has too many test cases, unclear where to start

**Solution**:
```
"Prioritize this test strategy. What's the minimum viable coverage?
What can we skip initially?"
```

The skill will:
- Rank test cases by importance
- Suggest MVP approach
- Identify follow-up tests

---

### Issue 2: "Playwright Tests Are Flaky"

**Symptom**: Same test passes sometimes, fails sometimes

**Solution**:
```
"Debug this flaky Playwright test. It passes 80% of the time.
[paste test code]

Use Chrome DevTools to help diagnose."
```

The skill will:
- Identify timing issues
- Suggest better selectors
- Provide fixed code

**Prevention**:
- Use data-testid attributes
- Avoid hard timeouts (use waitFor)
- Mock external services

---

### Issue 3: "Accessibility Report Too Long"

**Symptom**: 50+ violations, don't know where to start

**Solution**:
```
"Prioritize these accessibility violations. What are the critical
issues blocking WCAG 2.2 AAA compliance?"
```

The skill will:
- Sort by severity
- Suggest quick wins first
- Provide fix roadmap

---

### Issue 4: "Don't Know If Design Matches Code"

**Symptom**: Uncertainty about design-to-code fidelity

**Solution**:
```
"Validate this Figma design against the code implementation.
Check: tokens, responsive behavior, components, states."
```

The skill will:
- Compare design to code
- Generate visual regression tests
- Provide fidelity report

---

### Issue 5: "Test Coverage Dropping"

**Symptom**: Coverage went from 85% → 78%, not sure why

**Solution**:
```
"Analyze coverage change. What files lost coverage? What
should we prioritize to get back to 85%?"
```

The skill will:
- Identify dropped coverage
- Suggest tests to add
- Prioritize by impact

---

## Command Reference

### PRD Evaluation
```
"Evaluate this PRD and create test cases"
"Create test strategy for [feature]"
"Identify edge cases for [scenario]"
```

### Playwright Testing
```
"Write Playwright tests for [flow]"
"Debug this failing Playwright test"
"Create visual regression tests for [component]"
```

### Accessibility
```
"Audit WCAG 2.2 AAA compliance for [page/app]"
"Fix this accessibility violation"
"Create accessibility test cases for [feature]"
```

### WordPress Blocks
```
"Test this WordPress block plugin"
"Create block editor tests"
"Validate block accessibility"
```

### Design Validation
```
"Validate Figma design against code"
"Compare design tokens"
"Test responsive design against Figma breakpoints"
```

### Debugging
```
"Debug this flaky test"
"Why is this performance metric degrading?"
"Help diagnose this accessibility issue"
```

---

## Tips for Success

1. **Be Specific**: Include examples, code, context
2. **Ask Clarifying Questions**: Let the skill ask you
3. **Iterate**: First version doesn't need to be perfect
4. **Document**: Save outputs for future reference
5. **Use in CI/CD**: Automate the checks
6. **Team Alignment**: Share strategy with team before implementation
7. **Accessibility First**: Make it a non-negotiable requirement
8. **Regular Audits**: Run accessibility audits weekly or monthly

---

## Getting Help

If stuck:
```
"What am I missing in my test strategy?"
"How would an expert approach testing [scenario]?"
"What are common pitfalls for [type of testing]?"
```

The skill is expert-level and designed to help you think through complex testing scenarios.

---

## See Also

- [TESTING.md](./TESTING.md) — Framework-specific testing guides
- [JEST.md](./JEST.md) — Jest reference
- [PLAYWRIGHT.md](./PLAYWRIGHT.md) — Playwright reference
- [PHPUNIT.md](./PHPUNIT.md) — PHPUnit reference
- [CI-CD-INTEGRATION.md](./CI-CD-INTEGRATION.md) — GitHub Actions workflows
- [TESTING-DOMAINS-EXTENSION.md](./TESTING-DOMAINS-EXTENSION.md) — Future extensions

