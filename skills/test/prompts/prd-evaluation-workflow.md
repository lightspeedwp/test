# PRD Evaluation to Test Case Workflow

Transform product requirements into comprehensive test cases and testing strategy.

## Workflow Overview

1. **Analyze Requirements** — Read and understand the PRD
2. **Ask Clarifying Questions** — Identify gaps and assumptions
3. **Create Test Matrix** — Map features to test types
4. **Design Test Cases** — Specify scenarios and expected outcomes
5. **Define Acceptance Criteria** — Success metrics and validation points
6. **Plan Testing Strategy** — Determine test approach and tools

## Process

### Step 1: PRD Analysis

**Questions to answer**:
- What are the main features?
- What are acceptance criteria?
- What are edge cases and error scenarios?
- What's the user workflow?
- What are dependencies and integrations?
- What are performance requirements?
- What are accessibility requirements?
- What browsers/devices must be supported?

### Step 2: Clarifying Questions

**Ask the user**:
- "What constitutes success for this feature?"
- "What edge cases are critical to test?"
- "Are there specific error scenarios to handle?"
- "What's the expected performance (load time, responsiveness)?"
- "Must this be accessible (WCAG 2.2)?"
- "What browsers and devices are required?"
- "Are there security considerations?"
- "What's the expected data volume/scale?"
- "Are there integrations with external services?"
- "What's the rollback strategy if issues occur?"

### Step 3: Test Matrix

Create a matrix showing:
- Feature → Test Type mapping
- Coverage: Unit, Integration, E2E, Accessibility, Performance
- Test scenarios per feature
- Expected outcomes

### Step 4: Test Case Design

For each feature, define:
```
Feature: [Feature Name]

Scenario: [User Action]
Given [Initial State]
When [User Action]
Then [Expected Outcome]
And [Side Effects]

Acceptance Criteria:
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

Edge Cases:
- [Edge Case 1]
- [Edge Case 2]

Accessibility:
- [A11y Requirement]

Performance:
- [Performance Metric]
```

### Step 5: Test Implementation Strategy

- **Unit Tests**: Component logic, utility functions
- **Integration Tests**: Database, API, service interactions
- **E2E Tests**: Full user workflows
- **Accessibility Tests**: WCAG 2.2 AAA compliance
- **Performance Tests**: Load time, responsiveness benchmarks

## Execution

### Run the Workflow

```
1. Paste or describe the PRD
2. Answer clarifying questions
3. Receive test case specification
4. Get test implementation recommendations
5. Receive Playwright test templates
```

## Success Criteria

- ✅ Test cases cover all features
- ✅ Edge cases and errors identified
- ✅ Accessibility requirements specified
- ✅ Performance criteria defined
- ✅ Test types and tools selected
- ✅ Implementation roadmap provided
- ✅ Coverage targets established

## Example Output

```markdown
# Test Strategy for [Feature]

## Coverage Matrix
| Feature | Unit | Integration | E2E | A11y | Performance |
|---------|------|-------------|-----|------|-------------|
| Feature 1 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Feature 2 | ✓ | - | ✓ | ✓ | - |

## Test Cases
### Feature: User Login
- TC-001: Valid credentials
- TC-002: Invalid password
- TC-003: Account locked
- TC-004: Forgot password flow
- TC-005: 2FA validation

## Accessibility Checklist
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast validation
- [ ] Focus management

## Performance Criteria
- Page load: < 3s
- Form submission: < 1s
- API response: < 500ms
```

## Tips

- Be specific about edge cases
- Include error scenarios
- Consider accessibility from the start
- Define performance expectations
- Plan for different data volumes
- Consider browser/device coverage
- Include security testing
- Document assumptions
