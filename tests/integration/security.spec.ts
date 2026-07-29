import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BLOG_PATH, CORE_PAGES } from './constants';

/**
 * Security Tests
 * Verify the site is resilient against common web vulnerabilities:
 * XSS, injection (SQL / template / command), path traversal, ReDoS,
 * clickjacking, sensitive-data exposure, and DoS / DDoS-style bursts.
 *
 * NOTE: This is a fully static Astro site. Query strings and request
 * bodies are not evaluated on the server, which makes most classic
 * injection attacks structurally impossible. These tests assert that
 * property holds and that malicious input never crashes or defaces a page.
 */

// A representative catalogue of hostile payloads.
const XSS_PAYLOADS = [
  '<script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  "'><svg/onload=alert(1)>",
  'javascript:alert(1)',
];

const SQLI_PAYLOADS = [
  "' OR '1'='1",
  "'; DROP TABLE users;--",
  "1' UNION SELECT username, password FROM users--",
  "admin'--",
];

const TEMPLATE_PAYLOADS = ['{{7*7}}', '${7*7}', '#{7*7}', '<%= 7*7 %>'];

const COMMAND_PAYLOADS = ['; rm -rf /', '$(rm -rf /)', '| cat /etc/passwd', '&& shutdown now'];

// Fail the test immediately if any injected payload manages to open a dialog.
function trapDialogs(page: import('@playwright/test').Page) {
  page.on('dialog', async (dialog) => {
    await dialog.dismiss().catch(() => {});
    throw new Error(`Unexpected dialog opened (possible XSS): ${dialog.message()}`);
  });
}

test.describe('XSS Prevention', () => {
  test('search input does not execute injected markup', async ({ page }) => {
    trapDialogs(page);
    await page.goto('/search');

    const searchInput = page.locator('#search-input');
    for (const payload of XSS_PAYLOADS) {
      await searchInput.fill(payload);
      await page.waitForTimeout(150);
    }

    // The raw input is preserved as text, never as live DOM.
    expect(await searchInput.inputValue()).toBe(XSS_PAYLOADS[XSS_PAYLOADS.length - 1]);
    expect(await page.locator('.search-results script').count()).toBe(0);
    expect(await page.locator('img[onerror]').count()).toBe(0);
    expect(await page.locator('svg[onload]').count()).toBe(0);
  });

  test('blog search filter does not execute injected markup', async ({ page }) => {
    trapDialogs(page);
    await page.goto('/blog');

    const searchInput = page.locator('#search-input');
    await searchInput.fill('<img src=x onerror=alert(1)>');
    await page.waitForTimeout(200);

    expect(await page.locator('#posts-grid img[onerror]').count()).toBe(0);
  });

  test('rendered blog content contains no inline event handlers or js: URLs', async ({ page }) => {
    await page.goto(BLOG_PATH);

    const html = (await page.locator('article').innerHTML()).toLowerCase();
    for (const vector of ['onclick=', 'onerror=', 'onload=', 'onmouseover=', 'javascript:']) {
      expect(html, `content should not contain ${vector}`).not.toContain(vector);
    }
  });

  test('URL fragment payloads do not execute', async ({ page }) => {
    trapDialogs(page);
    await page.goto('/#<script>alert(1)</script>');
    await page.waitForTimeout(200);
    await expect(page.locator('h1.hero-title')).toBeVisible();
  });
});

test.describe('Injection Resilience (SQL / Template / Command / XSS via query params)', () => {
  const allPayloads = [...XSS_PAYLOADS, ...SQLI_PAYLOADS, ...TEMPLATE_PAYLOADS, ...COMMAND_PAYLOADS];

  test('malicious query params never crash or deface the blog page', async ({ page }) => {
    trapDialogs(page);

    for (const payload of allPayloads) {
      const response = await page.goto(`/blog?category=${encodeURIComponent(payload)}`);
      // Static pages always render regardless of query input.
      expect(response?.status(), `payload "${payload}" should keep page healthy`).toBe(200);
      await expect(page.locator('h1')).toContainText('Blog');
    }
  });

  test('server-side template injection is not evaluated', async ({ page }) => {
    for (const payload of TEMPLATE_PAYLOADS) {
      const response = await page.goto(`/?q=${encodeURIComponent(payload)}`);
      expect(response?.status()).toBe(200);
      const body = await page.content();
      // If the template were evaluated, "49" would appear in reflected output.
      // The payload is never reflected at all on a static page.
      expect(body).not.toContain(payload);
    }
  });

  test('injection payloads are not reflected into the DOM', async ({ page }) => {
    for (const payload of [...SQLI_PAYLOADS, ...XSS_PAYLOADS]) {
      await page.goto(`/search?query=${encodeURIComponent(payload)}`);
      const html = await page.content();
      expect(html).not.toContain(payload);
    }
  });
});

test.describe('Path Traversal & Source Disclosure', () => {
  const forbidden = [
    '/../../../../etc/passwd',
    '/%2e%2e/%2e%2e/%2e%2e/etc/passwd',
    '/.env',
    '/package.json',
    '/astro.config.mjs',
    '/tsconfig.json',
    '/src/config/site.ts',
    '/node_modules/astro/package.json',
    '/.git/config',
  ];

  for (const path of forbidden) {
    test(`does not serve sensitive path: ${path}`, async ({ request }) => {
      const response = await request.get(path, { failOnStatusCode: false });
      const status = response.status();
      const body = await response.text().catch(() => '');

      // Either the path 404s, or it definitely must not leak source/secrets.
      expect(status).not.toBe(200);
      expect(body).not.toContain('AWS_SECRET');
      expect(body).not.toContain('PRIVATE_KEY');
      expect(body).not.toContain('BEGIN RSA');
      expect(body).not.toMatch(/"dependencies"\s*:/);
    });
  }
});

test.describe('DoS / DDoS Resilience', () => {
  test('survives a burst of concurrent requests', async ({ request }) => {
    const BURST = 30;
    const responses = await Promise.all(
      Array.from({ length: BURST }, () => request.get('/', { failOnStatusCode: false }))
    );
    for (const res of responses) {
      expect(res.status()).toBe(200);
    }
  });

  test('stays responsive immediately after a burst', async ({ request }) => {
    await Promise.all(Array.from({ length: 20 }, () => request.get('/blog', { failOnStatusCode: false })));
    const after = await request.get('/', { failOnStatusCode: false });
    expect(after.status()).toBe(200);
  });

  test('handles an oversized query string without crashing', async ({ request }) => {
    const huge = 'a'.repeat(8000);
    const response = await request.get(`/?flood=${huge}`, { failOnStatusCode: false });
    // Accept success, not-found, or "URI too long" — but never a 5xx crash.
    expect(response.status()).toBeLessThan(500);
  });

  test('handles many unique cache-busting URLs (resource exhaustion attempt)', async ({ request }) => {
    const responses = await Promise.all(
      Array.from({ length: 25 }, (_, i) => request.get(`/?_=${i}-${Date.now()}`, { failOnStatusCode: false }))
    );
    for (const res of responses) {
      expect(res.status()).toBe(200);
    }
  });

  test('rejects/ignores unexpected POST bodies without a server error', async ({ request }) => {
    const response = await request.post('/api/subscribe', {
      data: 'x'.repeat(20000),
      headers: { 'content-type': 'text/plain' },
      failOnStatusCode: false,
    });
    // Static host has no POST handler; it must respond cleanly, never 5xx.
    expect(response.status()).toBeLessThan(500);
  });
});

test.describe('ReDoS Resilience', () => {
  test('pathological search input does not hang the page', async ({ page }) => {
    await page.goto('/search');
    const searchInput = page.locator('#search-input');

    // Regex-metacharacter-heavy input that a naive highlighter could choke on.
    await searchInput.fill('(a+)+$' + '!'.repeat(2000));
    await page.waitForTimeout(300);

    // Page must remain interactive: a follow-up query resolves quickly.
    const start = Date.now();
    await searchInput.fill('money');
    await page.waitForTimeout(250);
    await expect(page.locator('.result-item').first()).toBeVisible();
    expect(Date.now() - start).toBeLessThan(4000);
  });
});

test.describe('Security Headers Configuration', () => {
  // The `_headers` file drives Cloudflare Pages security headers in production.
  // (The local preview server does not apply it, so we validate the file directly.)
  const headersFile = readFileSync(resolve(process.cwd(), 'public', '_headers'), 'utf-8');

  const requiredDirectives: Array<[string, RegExp]> = [
    ['X-Content-Type-Options', /X-Content-Type-Options:\s*nosniff/i],
    ['X-Frame-Options', /X-Frame-Options:\s*DENY/i],
    ['Referrer-Policy', /Referrer-Policy:\s*strict-origin-when-cross-origin/i],
    ['Permissions-Policy', /Permissions-Policy:/i],
    ['Strict-Transport-Security', /Strict-Transport-Security:\s*max-age=\d+/i],
    ['Content-Security-Policy', /Content-Security-Policy:/i],
    ['Cross-Origin-Opener-Policy', /Cross-Origin-Opener-Policy:\s*same-origin/i],
  ];

  for (const [name, pattern] of requiredDirectives) {
    test(`_headers declares ${name}`, () => {
      expect(headersFile).toMatch(pattern);
    });
  }

  test('CSP hardens against clickjacking and object/base abuse', () => {
    expect(headersFile).toMatch(/frame-ancestors\s+'none'/i);
    expect(headersFile).toMatch(/object-src\s+'none'/i);
    expect(headersFile).toMatch(/base-uri\s+'self'/i);
    expect(headersFile).toMatch(/form-action\s+'self'/i);
  });

  test('CSP allows Google Analytics resources', () => {
    expect(headersFile).toMatch(/script-src[^;]*https:\/\/www\.googletagmanager\.com/i);
    expect(headersFile).toMatch(/connect-src[^;]*https:\/\/www\.google-analytics\.com/i);
    expect(headersFile).toMatch(/connect-src[^;]*https:\/\/region1\.google-analytics\.com/i);
  });

  test('CSP allows Cloudflare Web Analytics resources', () => {
    expect(headersFile).toMatch(/script-src[^;]*https:\/\/static\.cloudflareinsights\.com/i);
    expect(headersFile).toMatch(/connect-src[^;]*https:\/\/cloudflareinsights\.com/i);
  });
});

test.describe('No Sensitive Data Exposure', () => {
  test('no API keys or secrets in page source', async ({ page }) => {
    for (const url of ['/', '/blog', '/about', '/contact', BLOG_PATH]) {
      await page.goto(url);
      const html = await page.content();

      expect(html).not.toMatch(/api[_-]?key\s*[:=]\s*["'][a-zA-Z0-9]{20,}/i);
      expect(html).not.toMatch(/secret[_-]?key\s*[:=]\s*["'][a-zA-Z0-9]{20,}/i);
      expect(html).not.toMatch(/password\s*[:=]\s*["'][^"']+["']/i);
      expect(html).not.toMatch(/bearer\s+[a-zA-Z0-9_-]{20,}/i);
      expect(html).not.toContain('AWS_SECRET');
      expect(html).not.toContain('PRIVATE_KEY');
    }
  });

  test('no server file paths exposed', async ({ page }) => {
    for (const url of ['/', '/blog', BLOG_PATH]) {
      await page.goto(url);
      const html = await page.content();

      expect(html).not.toMatch(/[A-Z]:\\Users\\/i);
      expect(html).not.toMatch(/\/home\/\w+\//);
      expect(html).not.toMatch(/\/var\/www\//);
    }
  });

  test('no debug information or stack traces in production output', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();

    expect(html).not.toContain('at Object.');
    expect(html).not.toContain('TypeError:');
    expect(html).not.toContain('ReferenceError:');
  });
});

test.describe('Safe Links', () => {
  test('external links open safely with rel="noopener"', async ({ page }) => {
    await page.goto('/');
    for (const link of await page.locator('a[target="_blank"]').all()) {
      expect(await link.getAttribute('rel')).toContain('noopener');
    }
  });

  test('no javascript: URLs in links', async ({ page }) => {
    for (const url of CORE_PAGES) {
      await page.goto(url);
      expect(await page.locator('a[href^="javascript:"]').count()).toBe(0);
    }
  });

  test('no data: URLs in links', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('a[href^="data:"]').count()).toBe(0);
  });
});

test.describe('Content Security', () => {
  test('inline scripts are limited to known-safe purposes', async ({ page }) => {
    await page.goto(BLOG_PATH);

    for (const script of await page.locator('script:not([src])').all()) {
      const content = await script.innerHTML();
      if (!content.trim()) continue;

      const allowed =
        (content.includes('@context') && content.includes('schema.org')) || // JSON-LD
        (content.includes('localStorage') && content.includes('theme')) || // theme init
        content.includes('requestAnimationFrame') || // transition re-enable
        content.includes('window.searchPosts') || // search data
        content.includes('progress-bar-fill') || // article progress/TOC
        content.includes('rotating-words'); // homepage animation

      if (!allowed) {
        expect(content).not.toContain('eval(');
        expect(content).not.toContain('document.write(');
      }
    }
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('img:not([alt])').count()).toBe(0);
  });
});

test.describe('Form Security', () => {
  test('newsletter form posts to a same-origin endpoint', async ({ page }) => {
    await page.goto(BLOG_PATH);

    const form = page.locator('form.newsletter-form');
    if (await form.count() > 0) {
      expect((await form.getAttribute('method'))?.toLowerCase()).toBe('post');

      const action = await form.getAttribute('action');
      // Must not post credentials/emails to an arbitrary external origin.
      expect(action).toBeTruthy();
      expect(action!.startsWith('/') || action!.includes('charliethechad.com')).toBe(true);

      expect(await form.locator('input[type="email"]').count()).toBe(1);
      await expect(form.locator('input[type="email"]')).toHaveAttribute('required', '');
    }
  });
});

test.describe('URL Security', () => {
  test('canonical URLs are safe absolute URLs', async ({ page }) => {
    await page.goto(BLOG_PATH);
    const href = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
    expect(href).not.toContain('javascript:');
  });

  test('social meta URLs are safe', async ({ page }) => {
    await page.goto(BLOG_PATH);
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    const twitterUrl = await page.locator('meta[name="twitter:url"]').getAttribute('content');
    if (ogUrl) expect(ogUrl).toMatch(/^https?:\/\//);
    if (twitterUrl) expect(twitterUrl).toMatch(/^https?:\/\//);
  });
});
