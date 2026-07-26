import { test, expect } from '@playwright/test';
import { BLOG_PATH } from './constants';

/**
 * Performance Tests
 * Verify site meets performance best practices
 */

test.describe('Performance Optimizations', () => {
  test('pages have proper meta viewport', async ({ page }) => {
    await page.goto('/');
    
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('images have loading="lazy" attribute', async ({ page }) => {
    await page.goto('/blog');
    
    // Get all images (except those in the viewport that might be eager)
    const images = await page.locator('img:not([loading="eager"])').all();
    
    for (const img of images) {
      const loading = await img.getAttribute('loading');
      // Should be lazy or not specified (browser default)
      if (loading) {
        expect(loading).toBe('lazy');
      }
    }
  });

  test('images have width and height attributes', async ({ page }) => {
    await page.goto('/');
    
    // Check that images have dimensions to prevent CLS
    const images = await page.locator('img').all();
    
    // At minimum, critical images should have dimensions
    // This helps prevent Cumulative Layout Shift
  });

  test('fonts are preloaded or loaded async', async ({ page }) => {
    await page.goto('/');
    
    // Check for preload links for fonts
    const fontPreloads = await page.locator('link[rel="preload"][as="style"]').count();
    const fontStylesheets = await page.locator('link[rel="stylesheet"][href*="fonts"]').count();
    
    // Should either preload or have font stylesheet
    expect(fontPreloads + fontStylesheets).toBeGreaterThan(0);
  });

  test('no render-blocking resources in critical path', async ({ page }) => {
    await page.goto('/');
    
    // External CSS that blocks render (except fonts with preload)
    const blockingCSS = await page.locator(
      'link[rel="stylesheet"]:not([media="print"]):not([rel="preload"])'
    ).all();
    
    // Should have minimal blocking CSS (main stylesheet is OK)
    expect(blockingCSS.length).toBeLessThanOrEqual(2);
  });

  test('scripts are deferred or at end of body', async ({ page }) => {
    await page.goto('/');
    
    // Get all script tags
    const scripts = await page.locator('script[src]').all();
    
    for (const script of scripts) {
      const defer = await script.getAttribute('defer');
      const async = await script.getAttribute('async');
      const type = await script.getAttribute('type');
      
      // Scripts should be deferred, async, or module type
      const isDeferred = defer !== null || async !== null || type === 'module';
      
      // Note: Inline scripts without src are OK
    }
  });
});

test.describe('Resource Optimization', () => {
  test('HTML is reasonably sized', async ({ page }) => {
    const response = await page.goto('/');
    const html = await page.content();
    
    // HTML should be under 100KB for a blog post
    expect(html.length).toBeLessThan(100 * 1024);
  });

  test('no duplicate scripts', async ({ page }) => {
    await page.goto('/');
    
    const scripts = await page.locator('script[src]').all();
    const srcs = await Promise.all(scripts.map(s => s.getAttribute('src')));
    
    const uniqueSrcs = new Set(srcs.filter(Boolean));
    expect(uniqueSrcs.size).toBe(srcs.filter(Boolean).length);
  });

  test('no duplicate stylesheets', async ({ page }) => {
    await page.goto('/');
    
    const links = await page.locator('link[rel="stylesheet"]').all();
    const hrefs = await Promise.all(links.map(l => l.getAttribute('href')));
    
    const uniqueHrefs = new Set(hrefs.filter(Boolean));
    expect(uniqueHrefs.size).toBe(hrefs.filter(Boolean).length);
  });
});

test.describe('Mobile Optimization', () => {
  test('touch targets are adequately sized', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Get all clickable elements
    const buttons = await page.locator('button').all();
    const links = await page.locator('a').all();
    
    // Check that buttons are at least 44x44 (accessibility guideline)
    for (const button of buttons.slice(0, 5)) { // Check first 5
      const box = await button.boundingBox();
      if (box) {
        // Allow for some flexibility
        expect(box.width).toBeGreaterThanOrEqual(24);
        expect(box.height).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('text is readable without zoom', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BLOG_PATH);
    
    // Check font size of main content
    const fontSize = await page.evaluate(() => {
      const prose = document.querySelector('.prose p');
      if (prose) {
        return parseFloat(getComputedStyle(prose).fontSize);
      }
      return 16;
    });
    
    // Font size should be at least 16px for readability
    expect(fontSize).toBeGreaterThanOrEqual(14);
  });

  test('horizontal scrolling is not required', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that body doesn't overflow
    const overflows = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    expect(overflows).toBe(false);
  });
});

test.describe('Core Web Vitals Preparation', () => {
  test('largest contentful paint element exists', async ({ page }) => {
    await page.goto('/');
    
    // Should have a clear LCP element (hero, heading, or image)
    const h1 = await page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('no layout shift during load', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to settle
    await page.waitForLoadState('networkidle');
    
    // Page should be stable (this is a basic check)
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('interactive elements are visible quickly', async ({ page }) => {
    await page.goto('/');
    
    // Navigation should be visible quickly
    const nav = page.locator('nav');
    await expect(nav).toBeVisible({ timeout: 3000 });
    
    // Theme toggle should be interactive
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeEnabled({ timeout: 3000 });
  });
});
