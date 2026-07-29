import { test, expect, type Page } from '@playwright/test';
import {
  FEATURED_BOOK_PATH,
  NO_STICKY_BOOK_PATH,
  LONG_BLOG_PATH,
  MONEY_PATH,
} from './constants';

/**
 * BookStickyPromo Tests
 *
 * This widget has a long history of silently breaking. Two failure modes:
 *   1. It never appears on scroll (the reveal logic relied on an
 *      IntersectionObserver sentinel that was unreliable with
 *      `content-visibility: auto`, so long posts never triggered it).
 *   2. The cover image renders blank (the off-screen widget defers a lazy image
 *      forever, so the cover must stay `loading="eager"`).
 *
 * These tests lock down both behaviours across every page type that renders the
 * widget, so regressions fail loudly instead of shipping.
 */

const WIDGET = '#sticky-promo';

/** Remove any persisted dismissal so each test starts from a clean slate. */
async function clearDismissal(page: Page) {
  await page.evaluate(() => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('dismissed-'))
      .forEach((k) => localStorage.removeItem(k));
  });
}

/** Scroll well past the reveal threshold and wait for the show transition. */
async function scrollPastThreshold(page: Page) {
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
}

// Every route that is expected to render the widget.
const PAGES_WITH_WIDGET = [
  { name: 'homepage', path: '/' },
  { name: 'books listing', path: '/books' },
  { name: 'featured book page', path: FEATURED_BOOK_PATH },
  { name: 'long blog post', path: LONG_BLOG_PATH },
  { name: 'second blog post', path: MONEY_PATH },
];

test.describe('BookStickyPromo', () => {
  for (const { name, path } of PAGES_WITH_WIDGET) {
    test(`is hidden at the top of the ${name}`, async ({ page }) => {
      await page.goto(path);
      await clearDismissal(page);
      await page.reload();

      const widget = page.locator(WIDGET);
      await expect(widget).toHaveCount(1);
      await expect(widget).not.toHaveClass(/visible/);
    });

    test(`becomes visible after scrolling on the ${name}`, async ({ page }) => {
      await page.goto(path);
      await clearDismissal(page);
      await page.reload();

      await scrollPastThreshold(page);

      // This is the core regression: the widget MUST appear after scrolling,
      // regardless of content length or `content-visibility`.
      await expect(page.locator(WIDGET)).toHaveClass(/visible/, { timeout: 4000 });
    });

    test(`renders a loaded cover image on the ${name}`, async ({ page }) => {
      await page.goto(path);
      await clearDismissal(page);
      await page.reload();
      await scrollPastThreshold(page);
      await expect(page.locator(WIDGET)).toHaveClass(/visible/, { timeout: 4000 });

      // Guard against the lazy-loading regression: the cover must be a real,
      // decoded image (non-zero natural dimensions), never a blank box.
      const img = page.locator(`${WIDGET} .sticky-promo-cover img`);
      await expect(img).toHaveAttribute('loading', 'eager');
      const dimensions = await img.evaluate((el: HTMLImageElement) => ({
        complete: el.complete,
        naturalWidth: el.naturalWidth,
      }));
      expect(dimensions.complete).toBe(true);
      expect(dimensions.naturalWidth).toBeGreaterThan(0);
    });
  }

  test('hides again when scrolled back to the top', async ({ page }) => {
    await page.goto(LONG_BLOG_PATH);
    await clearDismissal(page);
    await page.reload();

    await scrollPastThreshold(page);
    await expect(page.locator(WIDGET)).toHaveClass(/visible/, { timeout: 4000 });

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator(WIDGET)).not.toHaveClass(/visible/, { timeout: 4000 });
  });

  test('dismiss button hides the widget and persists across reloads', async ({ page }) => {
    await page.goto(LONG_BLOG_PATH);
    await clearDismissal(page);
    await page.reload();

    await scrollPastThreshold(page);
    await expect(page.locator(WIDGET)).toHaveClass(/visible/, { timeout: 4000 });

    await page.locator('#sticky-promo-close').click();
    await expect(page.locator(WIDGET)).toHaveClass(/dismissed/, { timeout: 2000 });

    // Dismissal must survive a reload and a scroll.
    await page.reload();
    await scrollPastThreshold(page);
    await page.waitForTimeout(500);
    await expect(page.locator(WIDGET)).not.toHaveClass(/visible/);
  });

  test('does not render on a book with stickyWidget disabled', async ({ page }) => {
    await page.goto(NO_STICKY_BOOK_PATH);
    await expect(page.locator(WIDGET)).toHaveCount(0);
  });
});
