import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '@/config/site';

/**
 * JSON Feed (https://jsonfeed.org/)
 * An alternative to RSS that's easier to parse with JavaScript
 */
export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE.name,
    home_page_url: SITE.url,
    feed_url: `${SITE.url}/feed.json`,
    description: SITE.description,
    language: SITE.language,
    authors: [
      {
        name: SITE.author.name,
        url: SITE.url,
      }
    ],
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        id: `${SITE.url}/blog/${post.id}/`,
        url: `${SITE.url}/blog/${post.id}/`,
        title: post.data.title,
        summary: post.data.description,
        date_published: post.data.pubDate.toISOString(),
        date_modified: post.data.updatedDate?.toISOString() || post.data.pubDate.toISOString(),
        authors: [
          {
            name: post.data.author || SITE.author.name,
          }
        ],
        tags: post.data.tags,
      })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
    },
  });
}
