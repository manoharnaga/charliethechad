import { test, expect } from '@playwright/test';
import { BLOG_PATH, SEARCH_TERM } from './constants';

/**
 * Navigation Tests
 * Verify navigation and interactive features work correctly.
 */

test.describe('Header Navigation', () => {
  test('logo navigates to home', async ({ page }) => {
    await page.goto('/blog');
    await page.click('.logo');
    await expect(page).toHaveURL('/');
  });

  test('blog link works', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-links a[href="/blog"]').click();
    await expect(page).toHaveURL('/blog');
  });

  test('books link works', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-links a[href="/books"]').click();
    await expect(page).toHaveURL('/books');
  });

  test('about link works', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-links a[href="/about"]').click();
    await expect(page).toHaveURL('/about');
  });

  test('search icon navigates to search page', async ({ page }) => {
    await page.goto('/');
    await page.locator('a.icon-btn[href="/search"]').click();
    await expect(page).toHaveURL('/search');
  });
});

test.describe('Dark Mode Toggle', () => {
  test('dark mode toggle switches theme', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('#theme-toggle');
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    await themeToggle.click();

    const newTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    expect(newTheme).not.toBe(initialTheme);
  });

  test('dark mode persists in localStorage', async ({ page }) => {
    await page.goto('/');
    await page.locator('#theme-toggle').click();

    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(savedTheme === 'dark' || savedTheme === 'light').toBe(true);
  });
});

test.describe('Blog Navigation', () => {
  test('blog card links to an article', async ({ page }) => {
    await page.goto('/blog');
    await page.locator('.post-item .card-link').first().click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.locator('article')).toBeVisible();
  });

  test('search filters articles by title/description', async ({ page }) => {
    await page.goto('/blog');

    const searchInput = page.locator('#search-input');
    await searchInput.fill(SEARCH_TERM);
    await page.waitForTimeout(300);

    // "money" matches the "What Is Money?" post title.
    const visibleCards = page.locator('.post-item:not(.hidden)');
    expect(await visibleCards.count()).toBeGreaterThan(0);

    // The post count label updates to reflect the filtered set.
    await expect(page.locator('#post-count')).toContainText(/article/);
  });

  test('search with no matches shows the empty state', async ({ page }) => {
    await page.goto('/blog');

    await page.locator('#search-input').fill('zzzznonexistentqueryzzzz');
    await page.waitForTimeout(300);

    expect(await page.locator('.post-item:not(.hidden)').count()).toBe(0);
    await expect(page.locator('#no-results')).toBeVisible();
  });

  test('category filter "All" is active by default', async ({ page }) => {
    await page.goto('/blog');
    const allButton = page.locator('.filter-btn[data-category="all"]');
    await expect(allButton).toHaveClass(/active/);
  });

  test('clicking a category filter narrows the results', async ({ page }) => {
    await page.goto('/blog');

    const moneyButton = page.locator('.filter-btn[data-category="Money"]');
    if (await moneyButton.count() > 0) {
      await moneyButton.click();
      await page.waitForTimeout(200);
      const visible = page.locator('.post-item:not(.hidden)');
      expect(await visible.count()).toBeGreaterThan(0);
      // Every visible item should belong to the Money category.
      for (const item of await visible.all()) {
        expect(await item.getAttribute('data-category')).toBe('Money');
      }
    }
  });
});

test.describe('Article Interactions', () => {
  test('reading progress bar exists and grows on scroll', async ({ page }) => {
    await page.goto(BLOG_PATH);

    const fill = page.locator('#progress-bar-fill');
    await expect(fill).toHaveCount(1);

    const initialWidth = await fill.evaluate(el => el.getBoundingClientRect().width);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);

    const newWidth = await fill.evaluate(el => el.getBoundingClientRect().width);
    expect(newWidth).toBeGreaterThan(initialWidth);
  });

  test('share buttons are present', async ({ page }) => {
    await page.goto(BLOG_PATH);
    const shareButtons = page.locator('.share-buttons .share-btn');
    expect(await shareButtons.count()).toBeGreaterThanOrEqual(2);
  });

  test('copy-link button is interactive', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(BLOG_PATH);

    const copyButton = page.locator('#copy-link');
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await page.waitForTimeout(300);
    await expect(copyButton.locator('svg')).toBeVisible();
  });

  test('table of contents is generated from headings', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto(BLOG_PATH);
    await page.waitForTimeout(200);

    const tocLinks = page.locator('#toc-list a');
    expect(await tocLinks.count()).toBeGreaterThan(0);
  });
});

test.describe('Search Page', () => {
  test('search input autofocuses on load', async ({ page }) => {
    await page.goto('/search');
    await expect(page.locator('#search-input')).toBeFocused();
  });

  test('search shows matching results', async ({ page }) => {
    await page.goto('/search');
    await page.locator('#search-input').fill(SEARCH_TERM);
    await page.waitForTimeout(300);
    expect(await page.locator('.result-item').count()).toBeGreaterThan(0);
  });

  test('clicking a result navigates to the article', async ({ page }) => {
    await page.goto('/search');
    await page.locator('#search-input').fill(SEARCH_TERM);
    await page.waitForTimeout(300);
    await page.locator('.result-item').first().click();
    await expect(page).toHaveURL(/\/blog\/.+/);
  });

  test('the "/" shortcut focuses the search input', async ({ page }) => {
    await page.goto('/search');
    await page.locator('#search-input').blur();
    await page.keyboard.press('/');
    await expect(page.locator('#search-input')).toBeFocused();
  });
});

test.describe('Footer Navigation', () => {
  test('footer links work', async ({ page }) => {
    await page.goto('/');
    
    // RSS link
    const rssLink = page.locator('footer a[href="/rss.xml"]');
    await expect(rssLink).toBeVisible();
    
    // Privacy link
    const privacyLink = page.locator('footer a[href="/privacy"]');
    await expect(privacyLink).toBeVisible();
  });

  test('social links have proper attributes', async ({ page }) => {
    await page.goto('/');
    
    const socialLinks = page.locator('.footer-section .social-link');
    const count = await socialLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = socialLinks.nth(i);
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      
      expect(target).toBe('_blank');
      expect(rel).toContain('noopener');
    }
  });
});
