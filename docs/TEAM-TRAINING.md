# Team Training Materials

Expert test skill training guide with case studies, common patterns, and hands-on examples for team adoption.

## Training Overview

**Audience**: All developers, QA, and technical leads  
**Duration**: 2-4 hours (self-paced or instructor-led)  
**Format**: Case studies, examples, hands-on exercises

---

## Module 1: Fundamentals (45 minutes)

### What Is the Expert Test Skill?

**Definition**:
> A comprehensive testing and quality assurance expert that transforms product requirements into tested, accessible, well-performing code.

**Key Strengths**:
- ✅ Evaluates PRDs and designs test strategies
- ✅ Creates Playwright E2E tests
- ✅ Audits WCAG 2.2 AAA accessibility compliance
- ✅ Validates WordPress block development
- ✅ Debugs complex test failures
- ✅ Validates Figma design implementations

### When to Use It

**Perfect For**:
- Starting a new feature (design test strategy)
- Building WordPress blocks
- Auditing accessibility
- Reviewing design implementations
- Debugging failing tests

**Not For**:
- Running tests (use `npm test` directly)
- Simple manual testing
- One-off questions (use general Claude)

### Quick Mental Model

```
PRD                  Test Strategy        Implementation
 ↓                      ↓                       ↓
 │────────→ Expert Skill ────────→ Playwright Tests
                   ↓
            Edge Cases
            Accessibility
            Performance
            Responsiveness
```

---

## Module 2: Core Workflows (90 minutes)

### Workflow A: PRD → Test Strategy

**Scenario**: New feature in PRD, need test plan

**Step-by-Step**:

1. **Paste or describe the PRD**
   ```
   Feature: User preferences panel
   - Users can change email, password, name
   - Changes persist on page reload
   - Email change requires verification
   - Must be mobile-responsive
   ```

2. **Ask the expert skill to evaluate**
   ```
   /test "Evaluate this PRD and create a comprehensive test strategy"
   ```

3. **Skill asks clarifying questions**
   ```
   - What if password is invalid? Should we show specific errors?
   - Do we need performance targets?
   - Must this be accessible (WCAG)?
   - How many users at peak load?
   ```

4. **You answer clarifications**
   ```
   - Yes, specific error messages
   - No specific performance targets
   - Yes, WCAG 2.2 AAA required
   - 1000 concurrent users expected
   ```

5. **Skill creates test matrix**
   ```
   | Feature | Unit | Integration | E2E | A11y | Performance |
   |---------|------|-------------|-----|------|-------------|
   | Email change | ✓ | ✓ | ✓ | ✓ | - |
   | Password change | ✓ | ✓ | ✓ | ✓ | - |
   | Verification flow | ✓ | ✓ | ✓ | ✓ | ✓ |
   ```

6. **You implement tests from templates**
   ```
   // Playwright test template provided
   test('user changes email with verification', async ({ page }) => {
     // Test code here
   });
   ```

7. **You run tests and iterate**

**Duration**: 30-45 minutes for a feature

---

### Workflow B: Figma Design Validation

**Scenario**: New component design needs code validation

**Step-by-Step**:

1. **Get Figma design link**
   ```
   https://www.figma.com/file/ABC123/components
   ```

2. **Ask expert skill to validate**
   ```
   /test "Compare this Figma design to our code implementation:
   - Review design tokens (colors, typography)
   - Check component implementation fidelity
   - Test responsive design points
   - Validate accessibility properties"
   ```

3. **Skill extracts design specifications**
   - Color tokens with hex values
   - Typography scales
   - Spacing system
   - Component variants

4. **Skill creates comparison report**
   ```
   | Token | Design Value | Code Value | Status |
   |-------|--------------|-----------|--------|
   | primary-500 | #3b82f6 | #2563eb | ❌ Mismatch |
   | heading-h1 | 3.5rem | 56px | ✓ Match |
   ```

5. **You fix mismatches**
6. **You create visual regression tests**

**Duration**: 1-2 hours per design system

---

### Workflow C: Accessibility Audit

**Scenario**: Need to verify WCAG 2.2 AAA compliance

**Step-by-Step**:

1. **Ask for accessibility audit**
   ```
   /test "Audit this application for WCAG 2.2 AAA compliance.
   Focus on: keyboard navigation, screen readers, color contrast,
   form accessibility, focus management"
   ```

2. **Skill runs automated checks**
   - Accessibility tree inspection
   - Color contrast validation
   - ARIA attribute checking

3. **Skill identifies issues by severity**
   ```
   🔴 Critical (blocks access):
   - Form inputs missing labels (5 instances)
   
   🟡 Major (significant barrier):
   - Color contrast < 7:1 (8 instances)
   
   🟢 Minor:
   - Missing alt text (2 images)
   ```

4. **You fix critical issues first**
5. **Skill creates test cases to prevent regression**
6. **You add tests to CI/CD**

**Duration**: 2-4 hours for audit + fixes

---

## Module 3: Case Studies (60 minutes)

### Case Study 1: Building a WordPress Block

**Situation**: Building a custom hero block for WordPress

**User's Journey**:

1. **Start**: Have PRD, need test plan
   ```
   Feature: Hero Block
   - Displays image + text overlay
   - Editable in WordPress editor
   - Mobile responsive
   - Should be accessible
   ```

2. **Step 1: Create test strategy**
   ```
   /test "I'm building a WordPress block for a hero image with text.
   Create a comprehensive test strategy covering:
   - Block registration and editor UI
   - Frontend rendering
   - Responsive behavior (mobile, tablet, desktop)
   - Accessibility compliance
   - Build script testing with BATS"
   ```

3. **Skill Output**:
   - Block testing checklist
   - Playwright E2E test templates
   - BATS shell script for build
   - Accessibility requirements
   - WordPress block best practices

4. **Step 2: Implement**
   ```javascript
   // Use template to write block
   test('hero block displays on frontend', async ({ page }) => {
     await page.goto('/with-hero-block');
     await expect(page.locator('.wp-block-hero')).toBeVisible();
   });
   ```

5. **Step 3: Test**
   ```bash
   npm run test:e2e                    # Run tests
   npm run test:e2e -- --headed       # Debug
   ```

6. **Step 4: Audit accessibility**
   ```
   /test "Audit the hero block for WCAG 2.2 AAA compliance.
   Check: keyboard navigation, screen reader, color contrast,
   focus indicators"
   ```

7. **Result**: Block is tested, accessible, responsive ✓

**Learning Points**:
- Use prompts to structure complex work
- Iterate on feedback
- Test from the start
- Accessibility is non-negotiable

---

### Case Study 2: Debugging Flaky E2E Tests

**Situation**: Checkout test passes ~70% of the time

**User's Journey**:

1. **Notice**: Test is flaky
   ```
   ❌ Test failed (but usually passes)
   ```

2. **Ask for help**
   ```
   /test "This Playwright test is flaky - passes ~70% of the time.
   Debug it and help me fix it.
   
   [paste test code]
   
   What's causing the intermittent failure?"
   ```

3. **Skill Diagnoses**:
   - Hard timeout on payment processing
   - Should use `waitFor` instead
   - Race condition with confirmation message

4. **Skill Provides Fix**:
   ```javascript
   // ❌ Before (flaky)
   await page.waitForTimeout(2000);
   
   // ✓ After (reliable)
   await expect(page.locator('.confirmation')).toBeVisible();
   ```

5. **You Apply Fix**
   ```bash
   npm run test:e2e -- --headed  # Test in headed mode
   ```

6. **Result**: Test is now reliable ✓

**Learning Points**:
- Don't use hard timeouts
- Use `waitFor` for async operations
- The skill helps diagnose root causes
- Chrome DevTools MCP aids debugging

---

### Case Study 3: Pre-Launch Accessibility Audit

**Situation**: Feature shipping tomorrow, need accessibility sign-off

**User's Journey**:

1. **Timeline**: 4 hours to launch

2. **Ask for expedited audit**
   ```
   /test "Quick WCAG 2.2 AAA accessibility audit for [feature].
   Identify critical blocking issues only. Assume minor issues
   can be fixed in next release.
   
   Focus on: keyboard, screen readers, color contrast, forms"
   ```

3. **Skill Prioritizes**:
   ```
   🔴 CRITICAL (blocks accessibility):
   - Form labels missing (MUST FIX)
   - Color contrast < 7:1 (MUST FIX)
   
   🟡 Major (should fix):
   - Missing ARIA roles (2 items)
   
   🟢 Minor (next release):
   - Alt text improvements
   ```

4. **You Fix Critical Issues**
   ```bash
   # 30 minutes to fix
   # Add labels, adjust colors
   ```

5. **Re-audit**
   ```
   /test "Re-audit after fixes. Are we WCAG 2.2 AAA compliant now?"
   ```

6. **Skill Says**: ✓ Compliant! Safe to ship

**Learning Points**:
- Prioritization matters
- Accessibility isn't perfect → it's compliant
- Iterative improvements acceptable
- Test early, not late

---

## Module 4: Common Patterns (45 minutes)

### Pattern 1: "I Have a Bug, Need Tests"

**Situation**: User found bug in form validation

**Approach**:
```
1. Ask skill to create test case for bug
   /test "This form accepts invalid email addresses.
   Create test cases that should fail but don't."

2. Skill creates test cases

3. You fix code to make tests pass

4. Tests prevent regression
```

---

### Pattern 2: "Design System Update"

**Situation**: Colors updated in Figma

**Approach**:
```
1. Ask skill to validate implementation
   /test "Our color tokens were updated in Figma.
   Validate that code implementation matches new values."

2. Skill creates visual regression tests

3. You update code tokens

4. Tests verify the update
```

---

### Pattern 3: "Performance Degradation"

**Situation**: Page load time increased from 2s to 3.5s

**Approach**:
```
1. Ask skill to diagnose
   /test "Diagnose performance regression on [page].
   What changed? Where's the bottleneck?"

2. Skill uses Chrome DevTools to profile

3. You optimize based on findings

4. Tests verify improvement
```

---

## Module 5: Hands-On Exercise (60 minutes)

### Exercise: Design Tests for a Login Feature

**Time**: 60 minutes

**Steps**:

1. **Read PRD** (5 min)
   ```
   Feature: User Login
   - Email + password authentication
   - "Remember me" checkbox
   - Forgot password link
   - Account lockout after 3 failed attempts
   - 2FA via email
   ```

2. **Ask Skill for Test Strategy** (10 min)
   ```
   /test "Create a comprehensive test strategy for this login feature:
   - Design test cases
   - Identify edge cases
   - WCAG 2.2 AAA requirements
   - Performance criteria"
   ```

3. **Review Output** (10 min)
   - Test matrix
   - Accessibility checklist
   - Edge cases identified

4. **Write Playwright Tests** (25 min)
   - Happy path (valid login)
   - Edge case (invalid password)
   - Accessibility test (keyboard, screen reader)

5. **Run Tests** (5 min)
   ```bash
   npm run test:e2e:ui
   ```

6. **Debug Failures** (5 min)
   - Use Chrome DevTools MCP
   - Fix and re-run

**Success Criteria**:
- All tests pass
- Coverage of happy path and edge cases
- Accessibility validation included
- Code is readable and maintainable

---

## Best Practices Summary

| Practice | Why | How |
|----------|-----|-----|
| **PRD First** | Clarity before implementation | Start with `/test "Evaluate this PRD"` |
| **Accessibility Early** | Easier to build in than retrofit | Include a11y in test strategy from start |
| **Iterate** | First draft rarely perfect | Ask for feedback, refine, implement |
| **Test Edge Cases** | Real-world issues aren't happy paths | Ask skill to identify edge cases |
| **Automate Checks** | Prevents regression | Use CI/CD workflows from TESTING.md |
| **Document Decisions** | Future reference | Save skill outputs in repo |
| **Team Alignment** | Shared understanding | Review test strategy with team |

---

## FAQ for Team

**Q: Do I write tests or does the skill write them?**  
A: Skill designs the strategy and provides templates. You implement the tests.

**Q: What if I don't have a PRD?**  
A: Describe the feature, and the skill will ask clarifying questions to design the test strategy.

**Q: Is this only for new features?**  
A: No. Use it for: existing features, accessibility audits, design validation, debugging, performance optimization.

**Q: How long does a test strategy take?**  
A: 30-60 minutes for a feature, depending on complexity.

**Q: Can we automate this in CI/CD?**  
A: Yes! See CI-CD-INTEGRATION.md for GitHub Actions workflows.

**Q: What about our existing tests?**  
A: Start using the skill for new features. Gradually audit and update existing tests.

---

## Team Checklist for Adoption

- [ ] Everyone reads this training guide
- [ ] Everyone does the hands-on exercise
- [ ] Set up GitHub Actions workflows (CI-CD-INTEGRATION.md)
- [ ] Create test strategy for next feature
- [ ] Run accessibility audit on current site
- [ ] Add test skill to project README
- [ ] Schedule weekly "testing sync"
- [ ] Document team patterns in projects

---

## Next Steps

1. **This Week**: Do the hands-on exercise
2. **Next Feature**: Use skill to create test strategy
3. **Next Month**: Audit entire site for accessibility
4. **Ongoing**: Use skill for every feature

---

## Resources

- [USAGE-GUIDE.md](./USAGE-GUIDE.md) — Detailed usage guide
- [CI-CD-INTEGRATION.md](./CI-CD-INTEGRATION.md) — GitHub Actions setup
- [TESTING.md](./TESTING.md) — General testing guide
- [Skill Prompts](../skills/test/prompts/) — Expert prompts to use

---

## Contact & Questions

Team testing sync: [Meeting details]  
Slack: #testing-qa  
Questions: Ask in Slack or use `/test` directly in Claude Code

---

**Prepared by**: LightSpeedWP Testing Team  
**Date**: 2026-10-30  
**Version**: 1.0
