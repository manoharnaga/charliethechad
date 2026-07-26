# 🚀 Quick Setup Guide

Everything is configured in **one place**: `src/config/site.ts`

## ⚡ 5-Minute Setup

### 1. Edit Your Config
Open `src/config/site.ts` and update:

```typescript
export const SITE = {
  name: 'YourSiteName',
  url: 'https://yourdomain.com',
  
  author: {
    name: 'Your Name',
    email: 'you@yourdomain.com',
    bio: 'Your tagline here',
    story: 'Your about page story...',
  },
  
  social: {
    twitter: 'https://x.com/yourhandle',
    linkedin: 'https://linkedin.com/in/yourprofile',
    github: 'https://github.com/yourusername',
    // Set to null to hide any platform
  },
  
  // ... rest of config
}
```

### 2. Add Your Images
Drop these into `public/images/branding/`:
- `og-default.png` (1200×630px) - Social media preview
- `apple-touch-icon.png` (180×180px) - iOS icon
- `logo.png` - Your logo
- `author.png` (optional) - Your photo

**Tip:** Compress at [squoosh.app](https://squoosh.app) before uploading.

### 3. Write Your First Post
Create `src/content/blog/my-first-post.md`:

```markdown
---
title: "My First Post"
description: "A short description for SEO and previews"
pubDate: 2024-01-15
category: "Investing"
tags: ["money", "beginner"]
coverImage: "/images/blog/my-first-post.png"
---

Your content here...
```

### 4. Run the Site
```bash
npm run dev     # Development server
npm run build   # Build for production
npm run preview # Preview production build
```

---

## 📁 Project Structure

```
src/
├── config/
│   └── site.ts          # ⭐ ALL YOUR CONFIG HERE
├── content/
│   ├── blog/            # Your blog posts (markdown)
│   └── books/           # Your books (markdown)
├── layouts/             # Page templates
├── components/          # Reusable UI pieces
└── pages/               # Routes

public/
└── images/
    ├── branding/        # Site logos, OG images
    ├── blog/            # Blog post images
    └── books/           # Book cover images
```

---

## ✅ Checklist Before Launch

### Required
- [ ] Update `src/config/site.ts` with your info
- [ ] Add `public/images/branding/og-default.png`
- [ ] Add `public/images/branding/apple-touch-icon.png`
- [ ] Write at least one blog post
- [ ] Test with `npm run build && npm run preview`

### Optional
- [ ] Add author photo (`authorPhoto` in config)
- [ ] Set up newsletter (Buttondown, ConvertKit, etc.)
- [ ] Add analytics (GA4 or Plausible)
- [ ] Create a book entry

---

## 📝 Adding Content

### New Blog Post
1. Create `src/content/blog/your-slug.md`
2. Add frontmatter (title, description, pubDate, etc.)
3. Add image to `public/images/blog/your-slug.png`
4. Write your content in markdown

### New Book
1. Create `src/content/books/your-book.md`
2. Add frontmatter with Amazon/Goodreads links
3. Add cover to `public/images/books/your-book.png`

---

## 🌐 Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: 22.x

Images will be cached automatically by Cloudflare's CDN.

---

## 🔧 Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run all tests |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run e2e tests |

---

## 💡 Tips

- **Images:** Keep under 200KB, use WebP when possible
- **SEO:** Fill in `description` for every post
- **Categories:** Use ones from `config.content.categories`
- **Draft posts:** Add `draft: true` to hide from production

Questions? The config file has comments explaining each option.
