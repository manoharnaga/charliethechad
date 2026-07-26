import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('charliethechad'),
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('General'),
    readingTime: z.number().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    canonicalURL: z.string().optional(),
  }),
});

// Promotion configuration schema for books
const promotionSchema = z.object({
  enabled: z.boolean().default(true),
  announcementBanner: z.boolean().default(true),
  homepageHero: z.boolean().default(true),
  articlePromo: z.boolean().default(true),
  stickyWidget: z.boolean().default(true),
  badge: z.string().default('NEW RELEASE'),
  launchMessage: z.string().optional(),
}).default({});

// Book themes schema for "What Readers Will Experience" section
const themeSchema = z.object({
  label: z.string(),
  icon: z.string().optional(),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tagline: z.string().optional(),
    coverImage: z.string(),
    publishDate: z.date().optional(),
    amazonLink: z.string().optional(),
    goodreadsLink: z.string().optional(),
    previewLink: z.string().optional(),
    otherRetailers: z.array(z.object({
      name: z.string(),
      url: z.string(),
      icon: z.string().optional(),
    })).optional(),
    featured: z.boolean().default(false),
    status: z.enum(['upcoming', 'available', 'bestseller']).default('available'),
    themes: z.array(z.string()).default([]),
    genres: z.array(z.string()).default([]),
    pageCount: z.number().optional(),
    isbn: z.string().optional(),
    promotion: promotionSchema,
    seoDescription: z.string().optional(),
  }),
});

export const collections = { blog, books };
