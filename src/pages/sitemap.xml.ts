import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '@/config/site';

const staticPaths = [
  '/',
  '/about',
  '/blog',
  '/books',
  '/contact',
  '/privacy',
  '/search',
];

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export const GET: APIRoute = async () => {
  const [posts, books] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('books'),
  ]);

  const urls = [
    ...staticPaths.map(path => ({ path })),
    ...posts.map(post => ({
      path: `/blog/${post.id}`,
      lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    })),
    ...books.map(book => ({
      path: `/books/${book.id}`,
      lastmod: book.data.publishDate?.toISOString(),
    })),
  ];

  const entries = urls.map(({ path, lastmod }) => {
    const location = escapeXml(new URL(path, SITE.url).toString());
    const modified = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${location}</loc>${modified}\n  </url>`;
  }).join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};