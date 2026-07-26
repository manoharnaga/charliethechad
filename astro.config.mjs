import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://charliethechad.com',
  
  integrations: [sitemap()],
  
  // Build optimizations
  build: {
    // Inline small assets (< 4kb) to reduce HTTP requests
    inlineStylesheets: 'auto',
  },
  
  // Vite optimizations
  vite: {
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Minify CSS
      cssMinify: 'lightningcss',
      // Rollup optimizations
      rollupOptions: {
        output: {
          // Optimize chunk splitting
          manualChunks: undefined,
        },
      },
    },
    css: {
      // Use Lightning CSS for faster processing
      transformer: 'lightningcss',
    },
  },
  
  // Prefetch configuration for faster navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
