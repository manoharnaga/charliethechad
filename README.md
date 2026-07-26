# CharlieTheChad

A place for curious minds who refuse to accept simple answers. A blazing-fast static blog built with [Astro](https://astro.build). Optimized for Core Web Vitals and designed for excellent reading experience.

## ⚡ Performance

- **Build size:** ~280KB total (including all pages)
- **Lighthouse score:** Targeting 95+ on all metrics
- **First Contentful Paint:** < 1s on 3G
- **No JavaScript required** for content (progressive enhancement)

### Optimizations Applied

| Optimization | Description |
|-------------|-------------|
| Font loading | Async font load with system fallback (no FOIT) |
| CSS | Lightning CSS, content-visibility for off-screen |
| Images | Lazy loading, aspect-ratio for CLS prevention |
| JavaScript | Minimal, deferred, rAF-throttled scroll handlers |
| Caching | Cloudflare headers with immutable assets |
| Prefetch | Viewport-based prefetching for instant navigation |

## 🚀 Quick Start

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at localhost:4321
npm run build     # Build for production
npm run preview   # Preview production build
```

## 📁 Project Structure

```
src/
├── config/
│   └── site.ts         # ⭐ Single source of truth for all config
├── components/         # Reusable UI components
├── content/
│   ├── blog/           # Markdown blog posts
│   └── books/          # Book entries
├── layouts/            # Page layouts
├── pages/              # Routes
└── styles/
    └── global.css      # Design tokens & base styles

public/
├── images/
│   ├── branding/       # Logo, OG image, icons
│   ├── blog/           # Post images
│   └── books/          # Book covers
├── _headers            # Cloudflare caching rules
└── _redirects          # Cloudflare redirects
```

## ✏️ Adding Content

### New Blog Post

```bash
# Create file
touch src/content/blog/my-post.md
```

```markdown
---
title: "Your Post Title"
description: "Brief description for SEO and previews"
pubDate: 2024-01-15
category: "Investing"
tags: ["money", "beginner"]
coverImage: "/images/blog/my-post.png"
---

Your content here...
```

### New Book

```markdown
---
title: "Book Title"
description: "Book description"
coverImage: "/images/books/my-book.png"
publishDate: 2024-06-01
amazonLink: "https://amazon.com/your-book"
---
```

## 🔧 Configuration

Edit `src/config/site.ts` to update:
- Site name, URL, description
- Author info and social links
- Newsletter settings
- Navigation links

## 📈 Performance Best Practices

### Images
- Keep under 200KB per image
- Use WebP format when possible
- Always include `width` and `height` attributes
- Compress at [squoosh.app](https://squoosh.app)

### Content
- Use heading hierarchy (h2 → h3 → h4)
- Keep paragraphs short for readability
- Use descriptive link text for accessibility

## 🌐 Deployment

### Cloudflare Pages

1. Push to GitHub
2. Connect to Cloudflare Pages
3. Build settings:
   - Build command: `npm run build`
   - Output: `dist`
   - Node: 22.x

Assets are cached automatically via `_headers` file.

## 🧪 Testing

```bash
npm run test              # All tests
npm run test:unit         # Unit tests only
npm run test:integration  # E2E tests
npm run test:security     # Security tests
```

## 📦 Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run all tests |

## 🔍 SEO

- Auto-generated sitemap at `/sitemap-index.xml`
- `robots.txt` included
- Open Graph meta tags
- Canonical URLs

---

Built with ❤️ using [Astro](https://astro.build)
