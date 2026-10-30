# Testing Domains Extension Framework

Design for extending the test skill with specialized sub-skills and prompts for additional testing domains and scenarios.

## Current Coverage

**Existing Domains** (v2.0):
- ✅ PRD Evaluation & Test Case Design
- ✅ Playwright E2E Testing
- ✅ Accessibility Testing (WCAG 2.2 AAA)
- ✅ WordPress Block Theme/Plugin Testing
- ✅ BATS Shell Script Testing
- ✅ Figma Design-to-Code Testing
- ✅ Chrome DevTools Integration

## Proposed Extensions

### Tier 1: High Priority (Quick Win)

#### 1.1 **Performance & Load Testing**
**Purpose**: Identify and validate performance bottlenecks.

**Sub-skill**: `test:performance`

**Prompts to Create**:
- `performance-audit.md` — Lighthouse audit and Core Web Vitals analysis
- `load-testing.md` — Artillery/k6 load testing for backends
- `bundle-size-analysis.md` — Webpack bundle analysis and optimization
- `database-query-optimization.md` — Query profiling and optimization

**Key Tools**:
- Lighthouse (Automated)
- Playwright performance tracing
- Artillery or k6 (load testing)
- Chrome DevTools Performance tab
- Webpack Bundle Analyzer

**Integration Points**:
- CI/CD performance benchmarking
- Regression detection
- Performance budgets enforcement

---

#### 1.2 **API & Integration Testing**
**Purpose**: Validate API contracts and service integrations.

**Sub-skill**: `test:api-integration`

**Prompts to Create**:
- `api-contract-testing.md` — OpenAPI/Swagger contract validation
- `api-mock-testing.md` — Mock server setup and testing
- `integration-workflow-testing.md` — Multi-service workflow validation
- `webhook-testing.md` — Event-driven testing

**Key Tools**:
- Playwright API testing
- Postman/Insomnia collections
- Mock servers (Mockoon, Prism)
- Contract testing (Pact)
- WireMock for Java services

**Integration Points**:
- Staging environment testing
- Microservice coordination
- Third-party API validation

---

#### 1.3 **Security Testing**
**Purpose**: Identify security vulnerabilities and compliance issues.

**Sub-skill**: `test:security`

**Prompts to Create**:
- `security-vulnerability-scanning.md` — Dependency vulnerability scanning
- `owasp-testing.md` — OWASP Top 10 vulnerability testing
- `penetration-testing-prep.md` — Security testing checklist
- `authentication-authorization-testing.md` — Auth flow security validation

**Key Tools**:
- npm audit / Composer audit (dependency scanning)
- OWASP ZAP (automated security scanning)
- Burp Suite (manual testing)
- Snyk (vulnerability tracking)
- Trivy (container scanning)

**Integration Points**:
- Dependency updates
- Code scanning in CI/CD
- Security compliance verification

---

### Tier 2: Medium Priority (Standard Features)

#### 2.1 **Visual Regression Testing**
**Purpose**: Detect unintended UI changes.

**Sub-skill**: `test:visual-regression`

**Prompts to Create**:
- `screenshot-testing-setup.md` — Baseline creation and comparison
- `responsive-visual-testing.md` — Mobile/tablet/desktop visual validation
- `theme-variant-testing.md` — Light/dark mode visual consistency
- `cross-browser-visual-testing.md` — Browser-specific rendering

**Key Tools**:
- Percy (cloud-based visual regression)
- Chromatic (Storybook integration)
- BackstopJS (local testing)
- Playwright visual comparisons

---

#### 2.2 **Database & Data Testing**
**Purpose**: Validate data integrity and database operations.

**Sub-skill**: `test:database`

**Prompts to Create**:
- `database-migration-testing.md` — Migration validation and rollback testing
- `data-integrity-testing.md` — Constraint and relationship validation
- `database-performance-testing.md` — Query optimization and indexing
- `data-seeding-fixtures.md` — Test data management

**Key Tools**:
- PHPUnit with database transactions
- Factory patterns (Laravel factories, etc.)
- Database testing frameworks (DBUnit)
- Query analyzers

---

#### 2.3 **Mobile & Native Testing**
**Purpose**: Validate mobile-specific behavior and responsiveness.

**Sub-skill**: `test:mobile`

**Prompts to Create**:
- `mobile-responsive-testing.md` — Viewport and touch testing
- `native-app-testing.md` — React Native / Flutter testing
- `mobile-performance-testing.md` — Mobile-specific performance
- `offline-functionality-testing.md` — Service worker and offline support

**Key Tools**:
- Playwright mobile emulation
- Appium (native mobile automation)
- React Testing Library (React Native)
- BrowserStack (real device testing)

---

### Tier 3: Advanced Features (Specialized)

#### 3.1 **Analytics & Tracking Testing**
**Purpose**: Verify analytics implementation and data flow.

**Sub-skill**: `test:analytics`

**Prompts to Create**:
- `google-analytics-testing.md` — GA4 event tracking validation
- `event-tracking-verification.md` — Custom event verification
- `analytics-data-flow-testing.md` — End-to-end tracking validation
- `privacy-tracking-compliance.md` — GDPR/privacy validation

---

#### 3.2 **Infrastructure & DevOps Testing**
**Purpose**: Validate infrastructure, deployments, and infrastructure-as-code.

**Sub-skill**: `test:infrastructure`

**Prompts to Create**:
- `infrastructure-code-testing.md` — Terraform/CloudFormation testing
- `docker-image-testing.md` — Container image validation
- `deployment-smoke-testing.md` — Post-deployment verification
- `backup-restore-testing.md` — Disaster recovery validation

---

#### 3.3 **Compliance & Legal Testing**
**Purpose**: Verify compliance with regulations and standards.

**Sub-skill**: `test:compliance`

**Prompts to Create**:
- `gdpr-compliance-testing.md` — GDPR requirement validation
- `pci-dss-testing.md` — PCI DSS compliance checks
- `wcag-a11y-testing.md` — Accessibility compliance (existing, can expand)
- `content-moderation-testing.md` — Content policy compliance

---

## Extension Framework

### Step 1: Define Testing Domain

**Template**:
```markdown
# Testing Domain: [Name]

## Purpose
[Why this testing domain matters]

## Scope
- What it covers
- What it doesn't cover

## Test Types
1. [Type 1]
2. [Type 2]

## Use Cases
- When to apply this domain
- Real-world scenarios

## Key Tools & Frameworks
- Tool 1
- Tool 2

## Success Criteria
- How to know tests pass
- Quality metrics

## Integration Points
- Where in CI/CD
- What triggers tests
```

### Step 2: Create Sub-Skill

**File Structure**:
```
skills/test/
└── subskills/
    └── [domain]/
        ├── SKILL.md          # Sub-skill definition
        ├── prompts/          # Domain-specific prompts
        │   ├── [scenario-1].md
        │   └── [scenario-2].md
        └── references/       # Tools and resources
            └── [tool-guide].md
```

### Step 3: Write Prompts

**Prompt Template**:
```markdown
# [Testing Scenario]

## Purpose
[What this prompt helps with]

## Workflow
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Implementation
[Code examples, commands, or procedures]

## Success Criteria
[How to know it worked]

## Tools & Resources
[Links and documentation]
```

### Step 4: Create Test Agent Sub-Command

**Update Test Agent**:
```markdown
## Sub-Agents

### test:performance
Diagnose and optimize performance bottlenecks.

### test:api-integration
Validate API contracts and service integrations.

### test:security
Identify vulnerabilities and security issues.
```

### Step 5: Add to SKILL.md

**Update Main Skill**:
```markdown
## Available Sub-Skills

| Domain | Purpose | Use When |
|--------|---------|----------|
| test:performance | Performance optimization | Load testing needed |
| test:api-integration | API validation | Testing APIs/services |
| test:security | Security vulnerability scanning | Security audit needed |
```

---

## Proposed Timeline

### Phase 1 (Weeks 1-2): High Priority
- Performance & Load Testing
- API & Integration Testing
- Security Testing

### Phase 2 (Weeks 3-4): Medium Priority
- Visual Regression Testing
- Database & Data Testing
- Mobile & Native Testing

### Phase 3 (Weeks 5-6): Advanced Features
- Analytics & Tracking Testing
- Infrastructure & DevOps Testing
- Compliance & Legal Testing

---

## Cross-Domain Considerations

### Overlapping Domains

Some domains overlap with existing skills:

| Domain | Overlaps With | How to Handle |
|--------|---------------|--------------|
| Visual Regression | Playwright E2E | Extend Playwright prompts |
| Mobile Testing | Responsive Design | Add Playwright mobile profile |
| Accessibility | WordPress Blocks | Accessibility sub-skill covers this |

### Shared Tooling

Leverage existing tooling:

- **Playwright**: E2E, visual regression, performance, mobile
- **Chrome DevTools**: Performance, debugging, security
- **CI/CD Integration**: Reuse GitHub Actions patterns

### Testing Strategy Integration

New domains feed into:
1. PRD evaluation (identify testing needs)
2. Test strategy design (plan approach)
3. Implementation (create tests)
4. CI/CD automation (run in pipeline)
5. Reporting (comprehensive results)

---

## Prioritization Matrix

| Domain | Effort | Impact | Priority |
|--------|--------|--------|----------|
| Performance Testing | Medium | High | Tier 1 |
| API Testing | Medium | High | Tier 1 |
| Security Testing | High | High | Tier 1 |
| Visual Regression | Low | Medium | Tier 2 |
| Database Testing | Medium | Medium | Tier 2 |
| Mobile Testing | Medium | Medium | Tier 2 |
| Analytics Testing | Low | Low | Tier 3 |
| Infrastructure Testing | High | Low | Tier 3 |
| Compliance Testing | High | High | Tier 3 |

---

## Success Metrics

### Adoption
- % of teams using new sub-skills
- Number of tests created per domain

### Quality
- Coverage by domain
- Defect detection rates

### Efficiency
- Time to create tests
- Maintenance effort

---

## Implementation Checklist

For each domain:

- [ ] Define scope and purpose
- [ ] Create sub-skill definition
- [ ] Write 3-5 specialist prompts
- [ ] Create tool/resource references
- [ ] Update main skill
- [ ] Update test agent
- [ ] Add CI/CD integration patterns
- [ ] Create team training materials
- [ ] Document with case studies
- [ ] Get team feedback
- [ ] Release and iterate

---

## Notes

- Start with Tier 1 domains (highest ROI)
- Leverage existing tooling to reduce effort
- Ensure each domain integrates with PRD evaluation workflow
- Build community feedback loops for prioritization
- Consider creating specialized agents per Tier 1 domain

