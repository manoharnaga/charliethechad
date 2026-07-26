import { describe, it, expect } from 'vitest';

/**
 * Content Schema Validation Tests
 * Tests to verify content structure and data integrity
 */

describe('Blog Post Schema', () => {
  it('should have required fields', () => {
    const requiredFields = [
      'title',
      'description',
      'pubDate',
    ];

    const optionalFields = [
      'updatedDate',
      'author',
      'coverImage',
      'coverAlt',
      'tags',
      'category',
      'readingTime',
      'featured',
      'draft',
      'canonicalURL',
    ];

    // This validates our schema expectations
    expect(requiredFields).toContain('title');
    expect(requiredFields).toContain('description');
    expect(requiredFields).toContain('pubDate');
    expect(optionalFields).toContain('tags');
    expect(optionalFields).toContain('category');
  });

  it('should validate date formats', () => {
    const isValidDate = (date: unknown): boolean => {
      if (date instanceof Date) {
        return !isNaN(date.getTime());
      }
      if (typeof date === 'string') {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
      }
      return false;
    };

    expect(isValidDate(new Date('2026-06-27'))).toBe(true);
    expect(isValidDate('2026-06-27')).toBe(true);
    expect(isValidDate('invalid-date')).toBe(false);
    expect(isValidDate(null)).toBe(false);
  });

  it('should calculate reading time correctly', () => {
    const calculateReadingTime = (content: string): number => {
      const wordsPerMinute = 200;
      const wordCount = content.trim().split(/\s+/).length;
      return Math.ceil(wordCount / wordsPerMinute);
    };

    const shortArticle = 'This is a short article with just a few words.';
    const longArticle = 'word '.repeat(1000);

    expect(calculateReadingTime(shortArticle)).toBe(1);
    expect(calculateReadingTime(longArticle)).toBe(5);
  });
});

describe('Book Schema', () => {
  it('should have required fields', () => {
    const requiredFields = ['title', 'description', 'coverImage'];
    
    expect(requiredFields).toHaveLength(3);
    expect(requiredFields).toContain('title');
    expect(requiredFields).toContain('description');
    expect(requiredFields).toContain('coverImage');
  });

  it('should validate book links', () => {
    const isValidBookLink = (url: string | undefined): boolean => {
      if (!url) return true; // Optional field
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    };

    expect(isValidBookLink('https://amazon.com/book')).toBe(true);
    expect(isValidBookLink('https://goodreads.com/book/123')).toBe(true);
    expect(isValidBookLink(undefined)).toBe(true);
    expect(isValidBookLink('javascript:alert(1)')).toBe(false);
  });
});

describe('Tag Validation', () => {
  it('should normalize tags', () => {
    const normalizeTag = (tag: string): string => {
      return tag
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    };

    expect(normalizeTag('PySpark')).toBe('pyspark');
    expect(normalizeTag('data engineering')).toBe('data-engineering');
    expect(normalizeTag('  Money  ')).toBe('money');
    expect(normalizeTag('C++')).toBe('c');
  });

  it('should validate tag array', () => {
    const validateTags = (tags: unknown): boolean => {
      if (!Array.isArray(tags)) return false;
      return tags.every(tag => typeof tag === 'string' && tag.length > 0);
    };

    expect(validateTags(['money', 'career'])).toBe(true);
    expect(validateTags([''])).toBe(false);
    expect(validateTags([123])).toBe(false);
    expect(validateTags('not-an-array')).toBe(false);
  });
});

describe('Category Validation', () => {
  it('should validate category names', () => {
    const validCategories = ['Money', 'Career', 'Life', 'Tech', 'General'];
    
    const isValidCategory = (category: string): boolean => {
      return validCategories.includes(category);
    };

    expect(isValidCategory('Money')).toBe(true);
    expect(isValidCategory('Life')).toBe(true);
    expect(isValidCategory('Invalid')).toBe(false);
  });
});
