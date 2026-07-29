/**
 * Shared constants for integration tests.
 * These reflect the ACTUAL content and configuration of the site
 * (src/config/site.ts and src/content/blog/*). Keep in sync if content changes.
 */

// Brand name as configured in src/config/site.ts (lowercase by design).
export const BRAND = 'charliethechad';

// A real, published blog post slug (file: src/content/blog/apache-spark-data-engineering.md).
export const BLOG_SLUG = 'apache-spark-data-engineering';
export const BLOG_PATH = `/blog/${BLOG_SLUG}`;
export const BLOG_TITLE = 'The New Joinee and the Data Engineer';

// A second real post used for search assertions (file: what-is-money.md).
export const MONEY_SLUG = 'what-is-money';
export const MONEY_PATH = `/blog/${MONEY_SLUG}`;

// A search term guaranteed to match at least one post title/description.
export const SEARCH_TERM = 'money';

// The featured book (src/content/books/love-on-fridays.md, featured: true).
export const FEATURED_BOOK_TITLE = 'Love on Fridays!';
// Featured book detail page (promotion.stickyWidget: true).
export const FEATURED_BOOK_SLUG = 'love-on-fridays';
export const FEATURED_BOOK_PATH = `/books/${FEATURED_BOOK_SLUG}`;
// Book with promotion.stickyWidget: false — the sticky promo must NOT render here.
export const NO_STICKY_BOOK_PATH = '/books/death-on-fridays';

// A long-form blog post. The sticky promo historically failed to appear on long
// posts (content-visibility + IntersectionObserver sentinel), so it's the key
// regression case for the sticky-promo tests.
export const LONG_BLOG_PATH = BLOG_PATH;

// All public, crawlable page routes.
export const CORE_PAGES = ['/', '/blog', '/about', '/contact', '/books', '/search', '/privacy'];
