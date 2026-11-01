import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for WordPress Block Editor
 * Handles all interactions with the Gutenberg block editor
 */

export class EditorPage {
  readonly page: Page;
  readonly addBlockButton: Locator;
  readonly publishButton: Locator;
  readonly saveButton: Locator;
  readonly previewButton: Locator;
  readonly postTitleInput: Locator;
  readonly postContentArea: Locator;
  readonly blockInserter: Locator;
  readonly blockSearch: Locator;
  readonly settingsSidebar: Locator;
  readonly publishPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addBlockButton = page.locator('button:has-text("Add block")');
    this.publishButton = page.locator('button:has-text("Publish")');
    this.saveButton = page.locator('button:has-text("Save")');
    this.previewButton = page.locator('button:has-text("Preview")');
    this.postTitleInput = page.locator('[data-type="core/post-title"]');
    this.postContentArea = page.locator('[role="region"][aria-label="Editor content"]');
    this.blockInserter = page.locator('[aria-label*="Insert"]');
    this.blockSearch = page.locator('input[placeholder*="Search"]');
    this.settingsSidebar = page.locator('[aria-label*="Settings"]');
    this.publishPanel = page.locator('[role="region"][aria-label*="Publish"]');
  }

  /**
   * Navigate to WordPress admin page for creating/editing posts
   */
  async goto(postId?: string) {
    if (postId) {
      await this.page.goto(`/wp-admin/post.php?post=${postId}&action=edit`);
    } else {
      await this.page.goto('/wp-admin/post-new.php');
    }
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add a post title
   */
  async addPostTitle(title: string) {
    const titleLocator = this.page.locator('[data-type="core/post-title"] textarea, [data-type="core/post-title"] h1');
    await titleLocator.click();
    await titleLocator.clear();
    await titleLocator.fill(title);
    await this.page.waitForTimeout(500);
  }

  /**
   * Insert a block by name (e.g., 'Custom Block', 'Paragraph')
   */
  async insertBlock(blockName: string) {
    // Click the add block button or use the keyboard shortcut
    await this.page.keyboard.press('/');
    await this.page.waitForTimeout(300);

    // Type the block name to search
    await this.page.keyboard.type(blockName, { delay: 50 });
    await this.page.waitForTimeout(500);

    // Select the first matching block
    const blockOption = this.page.locator(
      `[role="option"]:has-text("${blockName}")`
    ).first();
    await blockOption.click({ timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  /**
   * Insert a block using the block inserter GUI
   */
  async insertBlockViaGUI(blockName: string, blockCategory?: string) {
    // Click the add block button
    await this.addBlockButton.click();
    await this.page.waitForTimeout(300);

    // If category is provided, click the category tab
    if (blockCategory) {
      const categoryTab = this.page.locator(
        `button[role="tab"]:has-text("${blockCategory}")`
      );
      await categoryTab.click();
      await this.page.waitForTimeout(200);
    }

    // Click the block
    const blockButton = this.page.locator(
      `[role="button"]:has-text("${blockName}")`
    ).first();
    await blockButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Fill block content (for text/custom blocks)
   */
  async fillBlockContent(blockIndex: number, content: string) {
    const blockContent = this.page.locator('[role="textbox"]').nth(blockIndex);
    await blockContent.click();
    await blockContent.fill(content);
    await this.page.waitForTimeout(300);
  }

  /**
   * Set block attributes via the block settings sidebar
   */
  async setBlockAttribute(attributeName: string, value: string) {
    // Find the input field with the attribute label
    const attributeInput = this.page.locator(
      `label:has-text("${attributeName}") ~ input, label:has-text("${attributeName}") ~ textarea`
    );
    await attributeInput.fill(value);
    await this.page.waitForTimeout(300);
  }

  /**
   * Save the draft post
   */
  async saveDraft() {
    // Check if there's a save button
    const saveButton = this.page.locator('button:has-text("Save draft")');
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Publish the post
   */
  async publishPost() {
    // Click the publish button
    const publishBtn = this.page.locator('button:has-text("Publish")').first();
    await publishBtn.click();
    await this.page.waitForTimeout(500);

    // Confirm in the publish panel if needed
    const confirmBtn = this.page.locator(
      'button:has-text("Publish"), button:has-text("Update")'
    ).last();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Get the published post URL from the success message
   */
  async getPublishedPostUrl(): Promise<string> {
    await this.page.waitForSelector('a[href*="/"]', { timeout: 10000 });
    const urlElement = this.page.locator(
      'a:has-text("View"), a:has-text("Edit"), [aria-label*="View"]'
    ).first();
    const href = await urlElement.getAttribute('href');
    return href || '';
  }

  /**
   * Check if the block exists in the editor
   */
  async blockExists(blockName: string): Promise<boolean> {
    const block = this.page.locator(
      `[data-type*="${blockName.toLowerCase()}"], [aria-label*="${blockName}"]`
    ).first();
    return await block.isVisible().catch(() => false);
  }

  /**
   * Get the current block count
   */
  async getBlockCount(): Promise<number> {
    const blocks = await this.page.locator('[data-type]').count();
    return blocks;
  }

  /**
   * Select a block by index
   */
  async selectBlock(blockIndex: number) {
    const block = this.page.locator('[data-type]').nth(blockIndex);
    await block.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Undo the last action
   */
  async undo() {
    await this.page.keyboard.press('Control+z');
    await this.page.waitForTimeout(500);
  }

  /**
   * Redo the last undone action
   */
  async redo() {
    await this.page.keyboard.press('Control+y');
    await this.page.waitForTimeout(500);
  }

  /**
   * Wait for the editor to be fully loaded
   */
  async waitForEditorReady() {
    // Wait for the main editor area to be visible
    await this.postContentArea.waitFor({ state: 'visible', timeout: 10000 });
    // Wait for any loading spinners to disappear
    await this.page.waitForSelector('[aria-busy="true"]', { state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  /**
   * Delete a block by index
   */
  async deleteBlock(blockIndex: number) {
    const block = this.page.locator('[data-type]').nth(blockIndex);
    await block.click();
    await this.page.keyboard.press('Backspace');
    await this.page.waitForTimeout(300);
  }

  /**
   * Get the current editor content as HTML
   */
  async getEditorHTML(): Promise<string> {
    const html = await this.page.evaluate(() => {
      const editor = document.querySelector('[role="region"][aria-label="Editor content"]');
      return editor?.innerHTML || '';
    });
    return html;
  }

  /**
   * Check if the post has unsaved changes
   */
  async hasUnsavedChanges(): Promise<boolean> {
    const saveButton = this.page.locator('button:has-text("Save draft")');
    return await saveButton.isVisible();
  }
}
