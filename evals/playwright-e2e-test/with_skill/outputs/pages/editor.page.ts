/**
 * Editor Page Object
 *
 * Abstracts WordPress block editor interactions using page object pattern.
 * Provides methods for creating posts, inserting blocks, configuring attributes,
 * and publishing content.
 */

import { Page, expect } from '@playwright/test';

export interface BlockConfig {
  title?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  paddingSize?: string;
  alignment?: string;
  [key: string]: string | undefined;
}

export interface BlockInspectorValues {
  title?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  [key: string]: string | undefined;
}

export class EditorPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to WordPress new post screen
   */
  async createNewPost(postTitle: string): Promise<void> {
    await this.page.goto(this.page.url().replace('/wp-admin/', '') + '/wp-admin/post-new.php');

    // Wait for editor to load
    await this.page.waitForSelector('.wp-block-post-title', { timeout: 10000 });

    // Enter post title
    await this.page.fill('.wp-block-post-title', postTitle);

    // Wait for editor to be ready
    await this.page.waitForSelector('[data-type="core/paragraph"]', { timeout: 5000 }).catch(() => {
      // It's okay if initial paragraph block doesn't exist
    });
  }

  /**
   * Inserts a block by name
   */
  async insertBlock(blockName: string): Promise<void> {
    // Click the add block button
    const addBlockBtn = await this.page.$('button[aria-label*="Add"], button[aria-label*="add"]');

    if (addBlockBtn) {
      await addBlockBtn.click();
    } else {
      // Try keyboard shortcut
      await this.page.keyboard.press('Control+Shift+Alt+I');
    }

    // Wait for block inserter to appear
    await this.page.waitForSelector('.block-editor-inserter__search', { timeout: 5000 }).catch(() => {
      // Try alternative selector
      return this.page.waitForSelector('input[placeholder*="Search"]', { timeout: 5000 });
    });

    // Search for block
    const searchInput = await this.page.$('input[placeholder*="Search"]') ||
                       await this.page.$('.block-editor-inserter__search');

    if (searchInput) {
      await searchInput.fill(blockName);
      await this.page.waitForTimeout(500); // Wait for search results
    }

    // Click the block
    const blockItem = await this.page.$(`button[aria-label*="${blockName}"]`) ||
                     await this.page.$(`text=${blockName}`);

    if (blockItem) {
      await blockItem.click();
    }

    // Wait for block to be inserted
    await this.page.waitForSelector(`[data-block-name="${this.normalizeBlockName(blockName)}"]`, {
      timeout: 5000
    }).catch(() => {
      // Block might not have data-block-name attribute
    });
  }

  /**
   * Gets a block element by name
   */
  async getBlock(blockName: string): Promise<any> {
    const normalizedName = this.normalizeBlockName(blockName);
    return this.page.$(`[data-block-name="${normalizedName}"]`) ||
           this.page.$(`.wp-block-${normalizedName}`);
  }

  /**
   * Configures block attributes via inspector panel
   */
  async configureBlock(config: BlockConfig): Promise<void> {
    // For each configuration option, find and update the control
    for (const [key, value] of Object.entries(config)) {
      if (!value) continue;

      // Title field
      if (key === 'title') {
        const titleInput = await this.page.$('input[aria-label*="Title"], input[placeholder*="Title"]');
        if (titleInput) {
          await titleInput.fill(value);
        }
      }

      // Description field
      if (key === 'description') {
        const descInput = await this.page.$('textarea[aria-label*="Description"]') ||
                         await this.page.$('textarea[placeholder*="Description"]');
        if (descInput) {
          await descInput.fill(value);
        }
      }

      // Color controls
      if (key === 'backgroundColor' || key === 'textColor') {
        const colorLabel = key === 'backgroundColor' ? 'Background' : 'Text';
        const colorControl = await this.page.$(`button[aria-label*="${colorLabel} color"]`);

        if (colorControl) {
          await colorControl.click();
          await this.page.waitForSelector('.components-color-palette', { timeout: 3000 }).catch(() => {});

          const colorInput = await this.page.$('input[type="color"], input[placeholder*="#"]');
          if (colorInput) {
            await colorInput.fill(value);
          }
        }
      }

      // Alignment control
      if (key === 'alignment') {
        const alignControl = await this.page.$(`button[aria-label*="${value}"]`);
        if (alignControl) {
          await alignControl.click();
        }
      }

      // Other attributes
      if (['paddingSize', 'borderRadius', 'alignment'].includes(key)) {
        const control = await this.page.$(`button[aria-label*="${value}"], input[value="${value}"]`);
        if (control) {
          await control.click();
        }
      }
    }

    // Wait for changes to be applied
    await this.page.waitForTimeout(500);
  }

  /**
   * Gets current block inspector values
   */
  async getBlockInspectorValues(): Promise<BlockInspectorValues> {
    return this.page.evaluate(() => {
      const values: BlockInspectorValues = {};

      // Get title
      const titleInput = document.querySelector('input[aria-label*="Title"]') as HTMLInputElement;
      if (titleInput) {
        values.title = titleInput.value;
      }

      // Get description
      const descInput = document.querySelector('textarea[aria-label*="Description"]') as HTMLTextAreaElement;
      if (descInput) {
        values.description = descInput.value;
      }

      // Get background color
      const bgColorStyle = document.querySelector('[data-block-name]')?.getAttribute('style');
      if (bgColorStyle?.includes('background-color')) {
        const match = bgColorStyle.match(/background-color:\s*([^;]+)/);
        if (match) {
          values.backgroundColor = match[1];
        }
      }

      return values;
    });
  }

  /**
   * Saves the post
   */
  async savePost(): Promise<void> {
    // Look for save button
    const saveButton = await this.page.$('button:has-text("Save"), button[aria-label*="Save"]');

    if (saveButton) {
      await saveButton.click();
      // Wait for save to complete
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Gets save status message
   */
  async getSaveMessage(): Promise<string> {
    const message = await this.page.locator(
      '.components-notice__content, [role="status"]'
    ).first().textContent();
    return message || '';
  }

  /**
   * Publishes the post and returns URL
   */
  async publishPost(): Promise<string | null> {
    // Click publish button
    const publishButton = await this.page.$('button:has-text("Publish"), button[aria-label*="Publish"]');

    if (publishButton) {
      await publishButton.click();

      // Wait for publish dialog
      await this.page.waitForSelector('.editor-post-publish-panel', { timeout: 5000 }).catch(() => {});

      // Confirm publish if dialog appears
      const confirmButton = await this.page.$('button:has-text("Publish"), button[aria-label*="Publish"]');
      if (confirmButton && confirmButton !== publishButton) {
        await confirmButton.click();
      }

      // Wait for redirect to published post
      await this.page.waitForNavigation({ timeout: 10000 }).catch(() => {});
    }

    // Get the current URL (should be the published post)
    return this.page.url();
  }

  /**
   * Gets current post ID from URL or DOM
   */
  async getCurrentPostId(): Promise<string | null> {
    // Try to get from URL
    const urlMatch = this.page.url().match(/[?&]post=(\d+)/);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Try to get from DOM
    const postIdElement = await this.page.$('input[name="post_ID"]');
    if (postIdElement) {
      return postIdElement.getAttribute('value');
    }

    return null;
  }

  /**
   * Creates and publishes a post with a block
   */
  async createAndPublishBlockPost(postTitle: string, blockName: string): Promise<string> {
    await this.createNewPost(postTitle);
    await this.insertBlock(blockName);
    await this.savePost();
    return this.publishPost() || '';
  }

  /**
   * Inserts a pattern into the editor
   */
  async insertPattern(patternName: string): Promise<void> {
    // Click add block button
    const addBlockBtn = await this.page.$('button[aria-label*="Add"]');
    if (addBlockBtn) {
      await addBlockBtn.click();
    }

    // Wait for inserter
    await this.page.waitForSelector('[role="listbox"]', { timeout: 5000 }).catch(() => {});

    // Look for patterns tab
    const patternsTab = await this.page.$('button[aria-label*="Patterns"]');
    if (patternsTab) {
      await patternsTab.click();
      await this.page.waitForTimeout(500);
    }

    // Search and click pattern
    const patternButton = await this.page.$(`text=${patternName}`);
    if (patternButton) {
      await patternButton.click();
    }
  }

  /**
   * Normalizes block name to kebab-case for selectors
   */
  private normalizeBlockName(blockName: string): string {
    return blockName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
