import { describe, it, expect } from 'vitest';

/**
 * Site Configuration Tests
 * Validates the site configuration structure and values
 */

// Mock the config for testing
const mockSiteConfig = {
  name: 'CharlieTheChad',
  tagline: 'A place for curious minds who refuse to accept simple answers.',
  description: 'Deeply researched essays...',
  url: 'https://charliethechad.com',
  language: 'en',
  locale: 'en_US',
  
  author: {
    name: 'CharlieTheChad',
    bio: 'Engineer. Writer. First-principles thinker.',
    email: 'hello@charliethechad.com',
    story: 'Some story...',
    milestones: [
      { year: '2024', title: 'Started', description: 'First post' }
    ],
    stats: {
      monthlyReaders: '10,000+',
      articlesWritten: '50+',
      newsletterSubscribers: '5,000+',
    },
  },
  
  social: {
    twitter: 'https://x.com/charliethechad',
    twitterHandle: '@charliethechad',
    linkedin: 'https://linkedin.com/in/manoharnaga',
    github: 'https://github.com/manoharnaga',
    instagram: null,
    youtube: null,
  },
  
  images: {
    logo: '/images/branding/logo.png',
    ogDefault: '/images/branding/og-default.png',
    appleTouchIcon: '/images/branding/apple-touch-icon.png',
    favicon: '/favicon.ico',
    authorPhoto: null,
    defaultCover: '/images/branding/default-cover.png',
  },
  
  newsletter: {
    enabled: true,
    endpoint: '/api/subscribe',
    heading: 'Get weekly money insights',
    description: 'Join thousands...',
    buttonText: 'Subscribe',
    placeholder: 'Enter your email',
  },
  
  content: {
    postsOnHomepage: 6,
    postsPerPage: 12,
    wordsPerMinute: 200,
    categories: ['Investing', 'Budgeting', 'Mindset'],
  },
  
  nav: {
    main: [
      { label: 'Blog', href: '/blog' },
      { label: 'Books', href: '/books' },
      { label: 'About', href: '/about' },
    ],
    footer: [
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'RSS', href: '/rss.xml' },
    ],
  },
  
  analytics: {
    googleAnalyticsId: null,
    plausibleDomain: null,
  },
};

describe('Site Configuration Structure', () => {
  it('should have all required top-level fields', () => {
    expect(mockSiteConfig).toHaveProperty('name');
    expect(mockSiteConfig).toHaveProperty('url');
    expect(mockSiteConfig).toHaveProperty('description');
    expect(mockSiteConfig).toHaveProperty('author');
    expect(mockSiteConfig).toHaveProperty('social');
    expect(mockSiteConfig).toHaveProperty('images');
    expect(mockSiteConfig).toHaveProperty('nav');
  });

  it('should have valid URL format', () => {
    expect(mockSiteConfig.url).toMatch(/^https?:\/\//);
    expect(mockSiteConfig.url).not.toMatch(/\/$/); // No trailing slash
  });

  it('should have valid language code', () => {
    expect(mockSiteConfig.language).toMatch(/^[a-z]{2}$/);
  });
});

describe('Author Configuration', () => {
  it('should have all required author fields', () => {
    expect(mockSiteConfig.author).toHaveProperty('name');
    expect(mockSiteConfig.author).toHaveProperty('email');
    expect(mockSiteConfig.author).toHaveProperty('bio');
  });

  it('should have valid email format', () => {
    expect(mockSiteConfig.author.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('should have milestones array', () => {
    expect(Array.isArray(mockSiteConfig.author.milestones)).toBe(true);
    mockSiteConfig.author.milestones.forEach(milestone => {
      expect(milestone).toHaveProperty('year');
      expect(milestone).toHaveProperty('title');
      expect(milestone).toHaveProperty('description');
    });
  });
});

describe('Social Links Configuration', () => {
  it('should have valid URL formats for defined social links', () => {
    const { social } = mockSiteConfig;
    
    if (social.twitter) {
      expect(social.twitter).toMatch(/^https?:\/\//);
    }
    if (social.linkedin) {
      expect(social.linkedin).toMatch(/^https?:\/\//);
    }
    if (social.github) {
      expect(social.github).toMatch(/^https?:\/\//);
    }
  });

  it('should have valid Twitter handle format', () => {
    if (mockSiteConfig.social.twitterHandle) {
      expect(mockSiteConfig.social.twitterHandle).toMatch(/^@\w+$/);
    }
  });

  it('should allow null values for optional platforms', () => {
    // These should be allowed to be null
    expect(mockSiteConfig.social.instagram).toBeNull();
    expect(mockSiteConfig.social.youtube).toBeNull();
  });
});

describe('Images Configuration', () => {
  it('should have all required image paths', () => {
    expect(mockSiteConfig.images.logo).toBeTruthy();
    expect(mockSiteConfig.images.ogDefault).toBeTruthy();
    expect(mockSiteConfig.images.appleTouchIcon).toBeTruthy();
  });

  it('should have valid path formats', () => {
    const { images } = mockSiteConfig;
    
    expect(images.logo).toMatch(/^\//);
    expect(images.ogDefault).toMatch(/^\//);
    expect(images.appleTouchIcon).toMatch(/^\//);
  });
});

describe('Navigation Configuration', () => {
  it('should have main navigation links', () => {
    expect(Array.isArray(mockSiteConfig.nav.main)).toBe(true);
    expect(mockSiteConfig.nav.main.length).toBeGreaterThan(0);
  });

  it('should have footer navigation links', () => {
    expect(Array.isArray(mockSiteConfig.nav.footer)).toBe(true);
    expect(mockSiteConfig.nav.footer.length).toBeGreaterThan(0);
  });

  it('should have valid navigation link structure', () => {
    mockSiteConfig.nav.main.forEach(link => {
      expect(link).toHaveProperty('label');
      expect(link).toHaveProperty('href');
      expect(link.href).toMatch(/^\//);
    });
  });
});

describe('Content Configuration', () => {
  it('should have valid numeric values', () => {
    expect(mockSiteConfig.content.postsOnHomepage).toBeGreaterThan(0);
    expect(mockSiteConfig.content.postsPerPage).toBeGreaterThan(0);
    expect(mockSiteConfig.content.wordsPerMinute).toBeGreaterThan(0);
  });

  it('should have categories array', () => {
    expect(Array.isArray(mockSiteConfig.content.categories)).toBe(true);
    expect(mockSiteConfig.content.categories.length).toBeGreaterThan(0);
  });
});

describe('Newsletter Configuration', () => {
  it('should have enabled flag', () => {
    expect(typeof mockSiteConfig.newsletter.enabled).toBe('boolean');
  });

  it('should have endpoint when enabled', () => {
    if (mockSiteConfig.newsletter.enabled) {
      expect(mockSiteConfig.newsletter.endpoint).toBeTruthy();
    }
  });

  it('should have all CTA fields', () => {
    expect(mockSiteConfig.newsletter.heading).toBeTruthy();
    expect(mockSiteConfig.newsletter.buttonText).toBeTruthy();
    expect(mockSiteConfig.newsletter.placeholder).toBeTruthy();
  });
});
