/**
 * ═══════════════════════════════════════════════════════════════
 * RETAILER REGISTRY - Single source of truth for book store links
 * ═══════════════════════════════════════════════════════════════
 *
 * This is the ONLY place you edit to add / reorder / restyle a store.
 *
 * To publish a book to a new store:
 *   1. (If the store isn't listed below) add an entry here once.
 *   2. In the book's markdown frontmatter, add the store `id` under
 *      `retailers:` with its URL. That's it.
 *
 * The BookRetailers component renders stores in the order defined here
 * and automatically hides any store the book doesn't have a URL for,
 * so the same component works for every book, fully data-driven.
 *
 * Each tile picks its artwork in this priority order:
 *   1. `image`    -> a local brand PNG/SVG file in /public (fills the tile)
 *   2. `svg`      -> an inline SVG glyph authored in a 0 0 24 24 space
 *   3. `monogram` -> a single letter drawn in the brand colors (always works)
 *
 * To use a local logo image, drop the file in
 *   public/images/book_publisher_brand_images/
 * and set `image: '/images/book_publisher_brand_images/<file>.png'` below.
 */

export interface Retailer {
  /** Stable key used in frontmatter `retailers:` and Schema.org output. */
  id: string;
  /** Full brand name, used in aria-labels, hover caption and JSON-LD. */
  name: string;
  /** Tile background (solid color or CSS gradient). */
  bg: string;
  /** Glyph / monogram color for the monogram fallback. */
  fg: string;
  /** 1-char fallback shown when no `image`/`svg` is provided. */
  monogram: string;
  /**
   * Optional local brand image (absolute path from /public), e.g.
   * '/images/book_publisher_brand_images/kobo_brand_icon.png'.
   * Takes priority over `svg` and `monogram`. If the file is missing the
   * tile still works — it falls back to the `svg`/`monogram` glyph.
   */
  image?: string;
  /** Optional inline SVG glyph markup, authored in a 0 0 24 24 space. */
  svg?: string;
  /** Optional font family for the monogram (e.g. a serif). */
  font?: string;
  /** Draw a subtle inner border (for light/white tiles). */
  border?: boolean;
  /** Purchase link -> adds rel="sponsored" for FTC/SEO correctness. */
  sponsored?: boolean;
  /** Reviews / community link -> rendered separately from stores. */
  community?: boolean;
}

export const RETAILERS: Retailer[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    bg: 'linear-gradient(160deg, #ffb34d 0%, #ff9900 55%, #f08c00 100%)',
    fg: '#232f3e',
    monogram: 'a',
    image: '/images/book_publisher_brand_images/amazonkdp.png',
    sponsored: true,
    svg: '<text x="12" y="10.5" text-anchor="middle" dominant-baseline="central" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="800" fill="#232f3e">a</text><path d="M3.6 16.4c2.5 1.7 5.4 2.5 8.4 2.5 2.7 0 5.3-.6 7.7-1.9" fill="none" stroke="#232f3e" stroke-width="1.9" stroke-linecap="round"/><path d="M17.2 15.4l2.9.8-.7 2.8" fill="none" stroke="#232f3e" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'applebooks',
    name: 'Apple Books',
    bg: 'linear-gradient(160deg, #ff8a3d 0%, #ff5a63 100%)',
    fg: '#ffffff',
    monogram: 'A',
    image: '/images/book_publisher_brand_images/applebooks.png',
    sponsored: true,
    svg: '<path d="M12 6.7C10 5.4 7.4 4.9 5.1 5.4c-.6.1-1.1.7-1.1 1.3v9.1c0 .8.7 1.3 1.4 1.2 2-.4 4.4 0 6.6 1.3V6.7z" fill="#fff"/><path d="M12 6.7c2-1.3 4.6-1.8 6.9-1.3.6.1 1.1.7 1.1 1.3v9.1c0 .8-.7 1.3-1.4 1.2-2-.4-4.4 0-6.6 1.3V6.7z" fill="#fff" opacity="0.92"/>',
  },
  {
    id: 'googleplay',
    name: 'Google Play Books',
    bg: 'linear-gradient(160deg, #ffffff 0%, #f3f5f9 100%)',
    fg: '#0b57d0',
    monogram: 'G',
    image: '/images/book_publisher_brand_images/googleplaybooks.png',
    border: true,
    sponsored: true,
    svg: '<polygon points="4,2.8 13.9,12 4,12" fill="#00c3ff"/><polygon points="4,21.2 4,12 13.9,12" fill="#00d364"/><polygon points="4,2.8 20.4,12 13.9,12" fill="#ffce2b"/><polygon points="4,21.2 13.9,12 20.4,12" fill="#ff424b"/>',
  },
  {
    id: 'kobo',
    name: 'Kobo',
    bg: 'linear-gradient(160deg, #3a3a3c 0%, #1a1a1c 100%)',
    fg: '#ffffff',
    monogram: 'K',
    image: '/images/book_publisher_brand_images/kobo_brand_icon.png',
    sponsored: true,
  },
  {
    id: 'barnesnoble',
    name: 'Barnes & Noble',
    bg: 'linear-gradient(160deg, #0a8a5f 0%, #00674a 100%)',
    fg: '#ffffff',
    monogram: 'B',
    sponsored: true,
  },
  {
    id: 'everand',
    name: 'Everand',
    bg: 'linear-gradient(160deg, #6a4bff 0%, #4b2fd6 100%)',
    fg: '#ffffff',
    monogram: 'e',
    image: '/images/book_publisher_brand_images/everand_brand_icon.png',
    sponsored: true,
  },
  {
    id: 'smashwords',
    name: 'Smashwords',
    bg: 'linear-gradient(160deg, #ffb04d 0%, #f7941e 100%)',
    fg: '#ffffff',
    monogram: 'S',
    image: '/images/book_publisher_brand_images/smashwords_brand_icon.png',
    sponsored: true,
  },
  {
    id: 'vivlio',
    name: 'Vivlio',
    bg: 'linear-gradient(160deg, #ff6b78 0%, #ff2f45 100%)',
    fg: '#ffffff',
    monogram: 'V',
    image: '/images/book_publisher_brand_images/vivlio_brand_icon.png',
    sponsored: true,
  },
  {
    id: 'tolino',
    name: 'Tolino',
    bg: 'linear-gradient(160deg, #33bff0 0%, #009ee0 100%)',
    fg: '#ffffff',
    monogram: 't',
    sponsored: true,
  },
  {
    id: 'thalia',
    name: 'Thalia',
    bg: 'linear-gradient(160deg, #ff2a41 0%, #e2001a 100%)',
    fg: '#ffffff',
    monogram: 'T',
    image: '/images/book_publisher_brand_images/thalia_brand_icon.png',
    sponsored: true,
  },
  {
    id: 'angusrobertson',
    name: 'Angus & Robertson',
    bg: 'linear-gradient(160deg, #2a2f38 0%, #12151b 100%)',
    fg: '#ffffff',
    monogram: 'A',
    image: '/images/book_publisher_brand_images/angus_and_robertson_brand_icon.png',
    sponsored: true,
  },
  {
    id: 'fable',
    name: 'Fable',
    bg: 'linear-gradient(160deg, #8a7bff 0%, #6c5ce7 100%)',
    fg: '#ffffff',
    monogram: 'F',
    image: '/images/book_publisher_brand_images/fable_brand_icon.png',
    sponsored: true,
  },
  {
    id: 'goodreads',
    name: 'Goodreads',
    bg: 'linear-gradient(160deg, #f3efe3 0%, #e7e1d1 100%)',
    fg: '#382110',
    monogram: 'g',
    font: 'Georgia, serif',
    border: true,
    community: true,
    svg: '<text x="12" y="13" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-size="21" font-weight="700" fill="#382110">g</text>',
  },
];

/** Valid retailer id union, e.g. for typing frontmatter. */
export type RetailerId = (typeof RETAILERS)[number]['id'];
