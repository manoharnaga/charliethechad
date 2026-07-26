# 🖼️ Images Folder Structure

This folder contains all images for CharlieTheChad.

## 📁 Folder Organization

```
images/
├── branding/          # Site-wide branding assets
│   ├── logo.png       # Site logo (any size, SVG preferred)
│   ├── og-default.png # Social sharing image (1200×630px)
│   ├── apple-touch-icon.png  # iOS home screen (180×180px)
│   ├── author.png     # Your photo for About page (optional)
│   └── default-cover.png  # Fallback for posts without images
│
├── blog/              # Blog post images
│   ├── investing-basics.png
│   ├── budgeting-tips.png
│   └── ...
│
└── books/             # Book cover images
    ├── mindful-money.png
    └── ...
```

## 📐 Recommended Sizes

| Image | Size | Format | Notes |
|-------|------|--------|-------|
| og-default.png | 1200×630px | PNG | Social media preview |
| apple-touch-icon.png | 180×180px | PNG | iOS home screen icon |
| logo.png | Any | SVG/PNG | Header logo |
| Blog covers | 1200×630px | PNG/WebP | Post thumbnails |
| Book covers | 400×600px | PNG | 2:3 ratio recommended |

## 🚀 Performance Tips

1. **Compress images** before uploading (use [Squoosh](https://squoosh.app/))
2. **Use WebP** format for better compression (70-80% smaller than JPG)
3. **Keep blog images under 200KB** each
4. **Cloudflare caches** these automatically - great for speed!

## 🔗 Using Images in Content

In your markdown files:
```markdown
# Blog post
coverImage: "/images/blog/my-post.png"

# Book
coverImage: "/images/books/my-book.png"
```
