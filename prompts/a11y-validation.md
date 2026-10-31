# Accessibility (A11y) Validation

Validate WCAG 2.2 AAA accessibility compliance across the application.

## Prompt

Validate accessibility compliance:

1. Run Playwright accessibility tests
2. Check WCAG 2.2 AAA standards
3. Verify keyboard navigation
4. Test screen reader compatibility
5. Check color contrast ratios
6. Validate form labels and error messages
7. Review focus management

## Commands

### Playwright A11y Tests
```bash
# Run accessibility tests
npm run test:e2e -- --project=accessibility

# With coverage
npm run test:e2e -- --project=accessibility --coverage

# Debug mode
npm run test:e2e:debug -- --project=accessibility

# Headed (see browser)
npx playwright test --headed --project=chromium
```

### Manual Accessibility Checks

**Keyboard Navigation**
1. Tab through all interactive elements
2. Verify logical tab order
3. Check for keyboard traps
4. Test keyboard shortcuts work

**Screen Reader (NVDA, JAWS, VoiceOver)**
1. Test page structure and headings
2. Verify button/link labels
3. Check form instructions
4. Test dynamic content updates

**Color Contrast**
- Normal text: 7:1 contrast ratio
- Large text: 4.5:1 contrast ratio
- Graphics: 3:1 contrast ratio

**ARIA & Labels**
- Form inputs have associated labels
- Buttons have descriptive text or aria-label
- Dynamic regions use aria-live
- Error messages are announced

## Success Criteria

- All Playwright a11y tests pass
- No contrast violations
- Keyboard navigation complete
- Screen reader announces content correctly
- Form error messages are accessible
- WCAG 2.2 AAA Level compliance achieved

## References

- [WCAG 2.2 AAA Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Playwright Accessibility](https://playwright.dev/docs/accessibility-testing)
- [Accessibility Checklist](../guidelines/accessibility-checklist.md)
