import { Page, expect } from '@playwright/test';

/**
 * Accessibility testing utilities for WordPress block plugin E2E tests
 */

export interface A11yIssue {
  element: string;
  issue: string;
  severity: 'error' | 'warning';
}

export class A11yUtils {
  /**
   * Check for common accessibility issues on the page
   */
  static async checkPageAccessibility(page: Page): Promise<A11yIssue[]> {
    const issues: A11yIssue[] = [];

    // Check for images without alt text
    const imagesWithoutAlt = await page.$$eval(
      'img:not([alt])',
      (images) => images.length
    );
    if (imagesWithoutAlt > 0) {
      issues.push({
        element: 'img',
        issue: `Found ${imagesWithoutAlt} images without alt text`,
        severity: 'error',
      });
    }

    // Check for buttons without accessible names
    const buttonsByRole = await page.locator('button').all();
    for (const button of buttonsByRole) {
      const name = await button.getAttribute('aria-label');
      const text = await button.textContent();
      if (!name && !text?.trim()) {
        issues.push({
          element: 'button',
          issue: 'Button without accessible name or text',
          severity: 'error',
        });
      }
    }

    // Check for proper heading hierarchy
    const headingHierarchy = await this.checkHeadingHierarchy(page);
    if (headingHierarchy.length > 0) {
      issues.push(...headingHierarchy);
    }

    // Check for color contrast (basic check)
    const contrastIssues = await this.checkColorContrast(page);
    if (contrastIssues.length > 0) {
      issues.push(...contrastIssues);
    }

    // Check for keyboard navigation
    const keyboardIssues = await this.checkKeyboardNavigation(page);
    if (keyboardIssues.length > 0) {
      issues.push(...keyboardIssues);
    }

    return issues;
  }

  /**
   * Verify proper heading hierarchy (h1, h2, h3, etc.)
   */
  static async checkHeadingHierarchy(page: Page): Promise<A11yIssue[]> {
    const issues: A11yIssue[] = [];
    const headingElements = await page.locator('h1, h2, h3, h4, h5, h6').all();

    let previousLevel = 0;
    for (const heading of headingElements) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const level = parseInt(tagName[1]);

      // Check if heading hierarchy skips levels (e.g., h1 -> h3)
      if (previousLevel > 0 && level > previousLevel + 1) {
        issues.push({
          element: tagName,
          issue: `Heading hierarchy skipped from h${previousLevel} to h${level}`,
          severity: 'warning',
        });
      }

      // Check for multiple h1 elements
      if (level === 1 && previousLevel === 1) {
        issues.push({
          element: 'h1',
          issue: 'Multiple h1 elements found on page',
          severity: 'warning',
        });
      }

      previousLevel = level;
    }

    return issues;
  }

  /**
   * Check for focusable elements that are not keyboard accessible
   */
  static async checkKeyboardNavigation(page: Page): Promise<A11yIssue[]> {
    const issues: A11yIssue[] = [];

    // Check for elements with click handlers but no keyboard event handlers
    const clickableElements = await page.$$eval(
      '[onclick]:not(button):not(a):not([role="button"])',
      (elements) =>
        elements.map((el) => ({
          tag: el.tagName,
          tabindex: el.getAttribute('tabindex'),
        }))
    );

    if (clickableElements.length > 0) {
      const withoutTabindex = clickableElements.filter((el) => !el.tabindex);
      if (withoutTabindex.length > 0) {
        issues.push({
          element: 'clickable elements',
          issue: `${withoutTabindex.length} clickable elements without tabindex`,
          severity: 'warning',
        });
      }
    }

    return issues;
  }

  /**
   * Basic color contrast check (checks for elements with contrasting background/text)
   */
  static async checkColorContrast(page: Page): Promise<A11yIssue[]> {
    const issues: A11yIssue[] = [];

    // This is a simplified check - in production, use axe-core or similar
    const lowContrastElements = await page.$$eval(
      'p, span, a, button',
      (elements) => {
        return elements
          .filter((el) => {
            const styles = window.getComputedStyle(el);
            const bgColor = styles.backgroundColor;
            const color = styles.color;

            // Very basic check - this should use proper contrast ratio calculation
            return (
              bgColor === 'rgba(0, 0, 0, 0)' ||
              (bgColor === color && bgColor !== 'rgba(0, 0, 0, 0)')
            );
          })
          .slice(0, 5) // Limit results
          .map((el) => ({
            tag: el.tagName,
            class: el.className,
          }));
      }
    );

    if (lowContrastElements.length > 0) {
      issues.push({
        element: 'text elements',
        issue: `${lowContrastElements.length} potential color contrast issues detected`,
        severity: 'warning',
      });
    }

    return issues;
  }

  /**
   * Check for form accessibility
   */
  static async checkFormAccessibility(page: Page): Promise<A11yIssue[]> {
    const issues: A11yIssue[] = [];

    // Check for form inputs without labels
    const inputsWithoutLabel = await page.$$eval(
      'input:not([type="hidden"]):not([aria-label])',
      (inputs) =>
        inputs
          .filter((input) => {
            const id = input.getAttribute('id');
            if (!id) return true;

            const label = document.querySelector(`label[for="${id}"]`);
            return !label;
          })
          .slice(0, 5)
          .map((input) => ({
            type: input.getAttribute('type'),
            name: input.getAttribute('name'),
          }))
    );

    if (inputsWithoutLabel.length > 0) {
      issues.push({
        element: 'input',
        issue: `${inputsWithoutLabel.length} form inputs without associated labels`,
        severity: 'error',
      });
    }

    return issues;
  }

  /**
   * Verify ARIA attributes are correctly used
   */
  static async checkAriaAttributes(page: Page): Promise<A11yIssue[]> {
    const issues: A11yIssue[] = [];

    // Check for invalid ARIA roles
    const ariaElements = await page.$$eval('[role]', (elements) =>
      elements
        .filter((el) => {
          const role = el.getAttribute('role');
          const validRoles = [
            'button',
            'link',
            'navigation',
            'main',
            'article',
            'complementary',
            'contentinfo',
            'region',
            'dialog',
            'alertdialog',
            'alert',
            'status',
            'log',
            'menuitem',
            'menu',
            'menubar',
            'checkbox',
            'radio',
            'slider',
            'spinbutton',
            'textbox',
            'combobox',
            'listbox',
            'option',
            'grid',
            'row',
            'gridcell',
            'columnheader',
            'rowheader',
            'tab',
            'tablist',
            'tabpanel',
            'tree',
            'treeitem',
            'presentation',
          ];
          return role && !validRoles.includes(role);
        })
        .slice(0, 5)
        .map((el) => ({
          tag: el.tagName,
          role: el.getAttribute('role'),
        }))
    );

    if (ariaElements.length > 0) {
      issues.push({
        element: 'aria elements',
        issue: `${ariaElements.length} elements with invalid ARIA roles`,
        severity: 'warning',
      });
    }

    return issues;
  }

  /**
   * Assert that no accessibility issues were found
   */
  static async assertNoA11yIssues(page: Page, severity: 'error' | 'warning' = 'error') {
    const issues = await this.checkPageAccessibility(page);
    const filteredIssues = issues.filter((issue) => issue.severity === severity);

    if (filteredIssues.length > 0) {
      const issueList = filteredIssues
        .map((issue) => `- ${issue.element}: ${issue.issue}`)
        .join('\n');
      throw new Error(`Accessibility ${severity}s found:\n${issueList}`);
    }
  }
}
