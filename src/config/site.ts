/**
 * ═══════════════════════════════════════════════════════════════
 * SITE CONFIGURATION - Single source of truth for CharlieTheChad
 * ═══════════════════════════════════════════════════════════════
 * 
 * Edit this file to configure your entire site.
 * All components pull from here - change once, update everywhere.
 */

export const SITE = {
  // ─────────────────────────────────────────────────────────────
  // BASIC INFO
  // ─────────────────────────────────────────────────────────────
  name: 'charliethechad',
  tagline: 'Question everything in life!',
  description: 'Essays exploring money, careers, relationships, psychology, society, and the biggest questions in life through logic, evidence, and curiosity.',
  
  // Your production URL (no trailing slash)
  url: 'https://charliethechad.com',
  
  // Language & locale
  language: 'en',
  locale: 'en_US',

  // ─────────────────────────────────────────────────────────────
  // AUTHOR INFO
  // ─────────────────────────────────────────────────────────────
  author: {
    name: 'charliethechad',           // Your real name
    bio: 'Engineer. Writer. Curious human.',  // Short tagline
    email: 'hello@charliethechad.me',
    
    // About page content
    story: `I started CharlieTheChad for curious minds like mine that refuse to accept simple answers to life's most difficult questions. In every essay, I explore money, careers, unemployment, relationships, heartbreak, happiness, success, failure, psychology, philosophy, society, and everything in between with honesty, depth, and careful research.

  I write each article like a story you can genuinely enjoy while still being challenged by it. I begin with a real question, question common beliefs, examine multiple perspectives, and follow the reasoning wherever it leads-even when the conclusions are uncomfortable or unexpected.

  Whether you're trying to make better decisions, understand yourself and the people around you, overcome life's setbacks, or simply become a clearer thinker, my goal is to leave you with something far more valuable than quick advice: a deeper understanding of how life works and the confidence to think for yourself.`,
    
    // Milestones for About page timeline
    milestones: [
      { year: '2024', title: 'Started the Journey', description: 'First blog post published' },
      { year: '2025', title: 'Growing Community', description: 'Newsletter launched' },
      { year: '2026', title: 'First Book', description: 'Love on Fridays released' },
    ],
    
    // Stats for About page (set to null to hide)
    stats: {
      monthlyReaders: '10,000+',
      articlesWritten: '50+',
      newsletterSubscribers: '5,000+',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // SOCIAL LINKS
  // Set to null or empty string to hide a platform
  // ─────────────────────────────────────────────────────────────
  social: {
    twitter: 'https://x.com/charliethechad',
    twitterHandle: '@charliethechad',     // For Twitter Cards
    linkedin: 'https://linkedin.com/in/manoharnaga',
    github: 'https://github.com/manoharnaga',
    instagram: null,                 // Set URL or null to hide
    youtube: null,
  },

  // ─────────────────────────────────────────────────────────────
  // IMAGES - All paths relative to /public
  // ─────────────────────────────────────────────────────────────
  images: {
    // Branding (required)
    logo: '/images/branding/logo.png',
    ogDefault: '/images/branding/og-default.png',      // 1200x630px for social sharing
    appleTouchIcon: '/images/branding/apple-touch-icon.png',  // 180x180px
    favicon: '/favicon.ico',
    
    // Author photo for About page (optional - shows initials if not set)
    authorPhoto: '/images/branding/author.png',
    
    // Placeholder for posts without cover images
    defaultCover: '/images/branding/default-cover.png',
  },

  // ─────────────────────────────────────────────────────────────
  // NEWSLETTER
  // ─────────────────────────────────────────────────────────────
  newsletter: {
    enabled: true,
    
    // Choose your provider and set the endpoint
    // Buttondown: https://buttondown.email/api/emails/embed-subscribe/YOUR_USERNAME
    // ConvertKit: https://app.convertkit.com/forms/FORM_ID/subscriptions
    // Mailchimp: Your form action URL
    endpoint: '/api/subscribe',  // Replace with real endpoint
    
    // CTA text
    heading: 'Get weekly thought-provoking essays',
    description: 'Join curious minds getting deep insights on life, money, careers, and psychology every week.',
    buttonText: 'Subscribe',
    placeholder: 'Enter your email',
  },

  // ─────────────────────────────────────────────────────────────
  // CONTENT SETTINGS
  // ─────────────────────────────────────────────────────────────
  content: {
    // How many posts to show on homepage
    postsOnHomepage: 6,
    
    // How many posts per page on blog listing
    postsPerPage: 12,
    
    // Default reading speed (words per minute)
    wordsPerMinute: 200,
    
    // Categories (used for filtering)
    categories: [
      "Money",
      "Career",
      "Psychology",
      "Relationships",
      "Society",
      "Philosophy",
      "Self",
      "Success"
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  // ANALYTICS (optional)
  // ─────────────────────────────────────────────────────────────
  analytics: {
    // Google Analytics 4
    googleAnalyticsId: null,  // e.g., 'G-XXXXXXXXXX'
    
    // Plausible (privacy-friendly)
    plausibleDomain: null,    // e.g., 'charliethechad.com'
  },
} as const;

// Type exports for TypeScript
export type SiteConfig = typeof SITE;
