import { test, expect } from '@playwright/test';
import { BRAND, BLOG_PATH, BLOG_TITLE, FEATURED_BOOK_TITLE } from './constants';

/**
 * Page Loading Tests
 * Verify all pages load correctly and return proper status codes.
 */

test.describe('Page Loading', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(new RegExp(BRAND, 'i'));
    await expect(page.locator('h1.hero-title')).toHaveText(BRAND);
  });

  test('blog listing page loads successfully', async ({ page }) => {
    const response = await page.goto('/blog');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Blog');
    // At least one post card should render.
    expect(await page.locator('.post-item').count()).toBeGreaterThan(0);
  });

  test('blog post loads successfully', async ({ page }) => {
    const response = await page.goto(BLOG_PATH);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1.article-title')).toHaveText(BLOG_TITLE);
  });

  test('about page loads successfully', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBe(200);
    // h1 is "Hi, I'm {author}".
    await expect(page.locator('h1')).toContainText(new RegExp(BRAND, 'i'));
  });

  test('contact page loads successfully', async ({ page }) => {
    const response = await page.goto('/contact');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Contact');
  });

  test('books page loads successfully', async ({ page }) => {
    const response = await page.goto('/books');
    expect(response?.status()).toBe(200);
    // The featured book hero renders the book title as the page h1.
    await expect(page.locator('h1')).toContainText(FEATURED_BOOK_TITLE);
  });

  test('search page loads successfully', async ({ page }) => {
    const response = await page.goto('/search');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Search');
  });

  test('privacy page loads successfully', async ({ page }) => {
    const response = await page.goto('/privacy');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Privacy');
  });

  test('404 page shows for invalid routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.locator('body')).toContainText('404');
  });

  test('all real blog posts are reachable', async ({ page }) => {
    const slugs = [
      'apache-spark-data-engineering',
      'what-is-money',
      'love-at-first-sight-one',
      'love-at-first-sight-two',
    ];
    for (const slug of slugs) {
      const response = await page.goto(`/blog/${slug}`);
      expect(response?.status(), `slug ${slug} should return 200`).toBe(200);
      await expect(page.locator('article')).toBeVisible();
    }
  });
});

test.describe('Feeds & Machine-Readable Routes', () => {
  test('RSS feed is accessible and is XML', async ({ page }) => {
    const response = await page.goto('/rss.xml');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('xml');
  });

  test('JSON feed is accessible', async ({ page }) => {
    const response = await page.goto('/feed.json');
    expect(response?.status()).toBe(200);
  });

  test('sitemap index is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap-index.xml');
    expect(response?.status()).toBe(200);
  });

  test('robots.txt is accessible and references the sitemap', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const body = await response!.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Sitemap:');
  });
});
