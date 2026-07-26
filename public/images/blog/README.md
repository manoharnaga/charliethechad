# Blog Post Images

Place images for your blog posts here.

## Naming Convention
Use the same slug as your blog post.

Recommended structure:
- Post: `src/content/blog/what-is-money.md`
- Images folder: `public/images/blog/what-is-money/`
- Cover image: `public/images/blog/what-is-money/the_ten_dollarbill_thumbnail_compressed.png`
- Inline images: `public/images/blog/what-is-money/the_barter_system_compressed.png`

## Recommended
- Size: 1200×630px (same as OG images)
- Format: WebP or PNG
- Max file size: 200KB

## Usage in Blog Frontmatter
```yaml
---
title: "My Blog Post"
coverImage: "/images/blog/my-post.png"
coverAlt: "Short descriptive alt text for the cover image"
---
```

## Usage Inside Content
```md
Some paragraph before the image.

![Clear, descriptive alt text](/images/blog/what-is-money/the_barter_system_compressed.png)

*Optional short caption in italics.*

Some paragraph after the image.
---
```
