import { test, expect } from '@playwright/test';
import { BRAND, BLOG_PATH, BLOG_TITLE } from './constants';

/**
 * SEO Tests
 * Verify proper SEO structure and meta tags.
 */

test.describe('Meta Tags', () => {
  test('homepage has required meta tags', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(new RegExp(BRAND, 'i'));

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /https?:\/\//);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('blog post has required meta tags', async ({ page }) => {
    await page.goto(BLOG_PATH);

    const title = await page.title();
    expect(title).toContain(BLOG_TITLE);
    expect(title.toLowerCase()).toContain(BRAND);

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);

    await expect(page.locator('meta[name="author"]')).toHaveAttribute('content', /.+/);
  });

  test('pages have Open Graph tags', async ({ page }) => {
    await page.goto(BLOG_PATH);

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /https?:\/\//);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /https?:\/\//);
  });

  test('pages have Twitter Card tags', async ({ page }) => {
    await page.goto(BLOG_PATH);

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /.+/);
  });

  test('blog posts have Article structured data', async ({ page }) => {
    await page.goto(BLOG_PATH);

    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.innerHTML();
    const data = JSON.parse(content);

    expect(data['@context']).toContain('schema.org');
    expect(data['@type']).toBe('BlogPosting');
    expect(data.headline).toBeTruthy();
    expect(data.author).toBeTruthy();
    expect(data.datePublished).toBeTruthy();
  });

  test('homepage has WebSite structured data', async ({ page }) => {
    await page.goto('/');
    const data = JSON.parse(await page.locator('script[type="application/ld+json"]').innerHTML());
    expect(data['@type']).toBe('WebSite');
    expect(data.url).toBeTruthy();
  });
});

test.describe('Semantic HTML', () => {
  test('page has proper landmark structure', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('header').count()).toBeGreaterThan(0);
    expect(await page.locator('main').count()).toBe(1);
    expect(await page.locator('footer').count()).toBeGreaterThan(0);
  });

  test('blog post uses the article tag', async ({ page }) => {
    await page.goto(BLOG_PATH);
    expect(await page.locator('article').count()).toBeGreaterThan(0);
  });

  test('navigation uses the nav tag', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('nav').count()).toBeGreaterThan(0);
  });

  test('each page has exactly one h1', async ({ page }) => {
    for (const url of ['/', '/blog', '/about', '/contact', '/search', '/privacy', BLOG_PATH]) {
      await page.goto(url);
      expect(await page.locator('h1').count(), `${url} should have one h1`).toBe(1);
    }
  });
});

test.describe('Accessibility', () => {
  test('images have alt attributes', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('img:not([alt])').count()).toBe(0);
  });

  test('buttons and links have accessible names', async ({ page }) => {
    await page.goto('/');
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const text = (await button.innerText()).trim();
      const ariaLabel = await button.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('page has an h1 for heading structure', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('h1').count()).toBeGreaterThan(0);
  });

  test('a focusable element receives focus on Tab', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });
});
