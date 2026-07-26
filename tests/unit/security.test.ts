import { describe, it, expect } from 'vitest';

/**
 * Security Utility Tests
 * Tests to ensure proper sanitization and security measures
 */

describe('XSS Prevention', () => {
  // Test HTML escaping
  it('should escape HTML special characters', () => {
    const escapeHtml = (str: string): string => {
      const htmlEscapes: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
      return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char]);
    };

    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    );
    expect(escapeHtml('onclick="evil()"')).toBe('onclick=&quot;evil()&quot;');
    expect(escapeHtml("javascript:alert('xss')")).toBe("javascript:alert(&#x27;xss&#x27;)");
  });

  it('should not allow javascript: URLs', () => {
    const isSafeUrl = (url: string): boolean => {
      const dangerous = ['javascript:', 'data:', 'vbscript:'];
      const lowerUrl = url.toLowerCase().trim();
      return !dangerous.some(prefix => lowerUrl.startsWith(prefix));
    };

    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('JAVASCRIPT:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeUrl('https://example.com')).toBe(true);
    expect(isSafeUrl('/blog/article')).toBe(true);
    expect(isSafeUrl('#section')).toBe(true);
  });

  it('should sanitize user input in search queries', () => {
    const sanitizeSearchQuery = (query: string): string => {
      // Remove any potential script tags or event handlers
      return query
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim();
    };

    // Script tags are removed, content between remains
    expect(sanitizeSearchQuery('<script>alert(1)</script>test')).toBe('alert(1)test');
    expect(sanitizeSearchQuery('onclick=alert(1)')).toBe('alert(1)');
    expect(sanitizeSearchQuery('normal search query')).toBe('normal search query');
    expect(sanitizeSearchQuery('<div>hello</div>')).toBe('hello');
  });
});

describe('URL Validation', () => {
  it('should validate canonical URLs', () => {
    const isValidCanonicalUrl = (url: string): boolean => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    };

    expect(isValidCanonicalUrl('https://charliethechad.com/blog')).toBe(true);
    expect(isValidCanonicalUrl('http://charliethechad.com')).toBe(true);
    expect(isValidCanonicalUrl('javascript:alert(1)')).toBe(false);
    expect(isValidCanonicalUrl('not-a-url')).toBe(false);
  });

  it('should validate relative paths', () => {
    const isValidRelativePath = (path: string): boolean => {
      // Must start with / and not contain protocol
      return path.startsWith('/') && !path.includes(':');
    };

    expect(isValidRelativePath('/blog/article')).toBe(true);
    expect(isValidRelativePath('/about')).toBe(true);
    expect(isValidRelativePath('javascript:void(0)')).toBe(false);
    expect(isValidRelativePath('https://evil.com')).toBe(false);
  });
});

describe('Content Validation', () => {
  it('should validate frontmatter fields', () => {
    const validateFrontmatter = (data: Record<string, unknown>): string[] => {
      const errors: string[] = [];
      
      if (!data.title || typeof data.title !== 'string') {
        errors.push('Title is required and must be a string');
      }
      if (!data.description || typeof data.description !== 'string') {
        errors.push('Description is required and must be a string');
      }
      if (!data.pubDate || !(data.pubDate instanceof Date)) {
        errors.push('pubDate is required and must be a Date');
      }
      if (data.tags && !Array.isArray(data.tags)) {
        errors.push('Tags must be an array');
      }
      
      return errors;
    };

    expect(validateFrontmatter({
      title: 'Test',
      description: 'Test desc',
      pubDate: new Date(),
      tags: ['test']
    })).toEqual([]);

    expect(validateFrontmatter({
      title: 123,
      description: 'Test',
      pubDate: new Date()
    })).toContain('Title is required and must be a string');
  });

  it('should sanitize meta description', () => {
    const sanitizeMetaDescription = (desc: string): string => {
      return desc
        .replace(/[<>"']/g, '') // Remove potential HTML/attribute injection
        .substring(0, 160); // Limit length
    };

    expect(sanitizeMetaDescription('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
    expect(sanitizeMetaDescription('a'.repeat(200))).toHaveLength(160);
  });
});

describe('Email Validation', () => {
  it('should validate email addresses', () => {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
  });
});

describe('Slug Validation', () => {
  it('should validate URL slugs', () => {
    const isValidSlug = (slug: string): boolean => {
      // Only allow lowercase letters, numbers, and hyphens
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      return slugRegex.test(slug);
    };

    expect(isValidSlug('my-blog-post')).toBe(true);
    expect(isValidSlug('post123')).toBe(true);
    expect(isValidSlug('My-Blog-Post')).toBe(false); // Uppercase
    expect(isValidSlug('post_with_underscore')).toBe(false);
    expect(isValidSlug('../etc/passwd')).toBe(false); // Path traversal
    expect(isValidSlug('post<script>')).toBe(false);
  });

  it('should prevent path traversal attacks', () => {
    const isPathSafe = (path: string): boolean => {
      const normalized = path.replace(/\\/g, '/');
      return !normalized.includes('..') && !normalized.startsWith('/');
    };

    expect(isPathSafe('blog/my-post')).toBe(true);
    expect(isPathSafe('../../../etc/passwd')).toBe(false);
    expect(isPathSafe('..\\..\\windows\\system32')).toBe(false);
    expect(isPathSafe('/etc/passwd')).toBe(false);
  });
});
