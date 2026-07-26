# Test Results — charliethechad

_Last run: 2026-07-26 · Node 22.19 · Astro 7.0.3_

## Summary

| Suite | Command | Tests | Result |
|-------|---------|------:|:------:|
| Unit (Vitest) | `npm run test:unit` | 37 | ✅ all passed |
| Integration + Security (Playwright / Chromium) | `npm run test:integration` | 106 | ✅ all passed |
| **Total** | `npm test` | **143** | **✅ passed** |

- Playwright HTML report: [playwright-report/index.html](playwright-report/index.html) (`npx playwright show-report`)
- Security-only run: `npm run test:security`

## Integration coverage (`tests/integration/`)

- **pages.spec.ts** — every route returns the right status; home, blog, all 4 real
  posts, about, contact, books, search, privacy, 404, RSS, JSON feed, sitemap, robots.txt.
- **navigation.spec.ts** — header/footer nav, logo, search icon, dark-mode toggle +
  persistence, blog card links, live search filter, empty state, category filter,
  reading-progress bar, share + copy-link buttons, TOC generation, `/search` behavior.
- **seo.spec.ts** — title/description/canonical/lang, Open Graph, Twitter Card,
  Article + WebSite JSON-LD, semantic landmarks, single-h1 per page, a11y basics.
- **performance.spec.ts** — viewport, lazy images, async fonts, no render-blocking
  CSS, deferred scripts, HTML size, no duplicate assets, mobile/touch, CWV prep.

## Security coverage (`tests/integration/security.spec.ts`)

- **XSS** — `<script>`, `<img onerror>`, `<svg onload>`, `javascript:` in the search
  inputs and URL fragments never execute (dialog trap) and never enter the live DOM.
- **Injection resilience** — SQL, server-side template (`{{7*7}}`, `${7*7}`),
  command (`$(rm -rf /)`) and XSS payloads in query params never crash, deface, get
  evaluated, or get reflected. (Static site → params aren't evaluated server-side.)
- **Path traversal / source disclosure** — `/../etc/passwd`, encoded traversal,
  `/.env`, `/package.json`, `/astro.config.mjs`, `/src/...`, `/.git/config`,
  `/node_modules/...` are never served with source or secrets.
- **DoS / DDoS resilience** — 30-request concurrent burst, post-burst responsiveness,
  8 KB oversized query string, 25 unique cache-busting URLs, and oversized POST bodies
  all handled without a 5xx.
- **ReDoS** — regex-metacharacter-heavy search input does not hang the page.
- **Security headers** — validates the `public/_headers` config declares
  `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
  `Permissions-Policy`, `Strict-Transport-Security`, `Content-Security-Policy`
  (with `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`,
  `form-action 'self'`) and `Cross-Origin-Opener-Policy`.
- **Data exposure / safe links / forms** — no secrets, server paths or stack traces
  in output; external links carry `rel="noopener"`; no `javascript:`/`data:` links;
  newsletter form posts same-origin only.

## Notes

- The `_headers` file is applied by **Cloudflare Pages in production**, not by the
  local `astro preview` server — so header tests validate the config file directly.
- Dependencies are clean: all 7 declared packages are used. The packages `npm ls`
  flags as "extraneous" (`@emnapi/*`, `@napi-rs/wasm-runtime`, `@tybys/wasm-util`,
  `tslib`) are optional WASM/native fallbacks of `lightningcss`/`@astrojs/sitemap`;
  `npm prune` intentionally keeps them, so nothing was removed.
