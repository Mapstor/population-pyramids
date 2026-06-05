/**
 * Site-wide constants that change over time.
 *
 * Used by ranking pages, schema markup, and page titles so the year
 * in headlines and last-updated dates auto-rolls forward without a
 * manual edit each January.
 *
 * Pair with `export const revalidate = 86400` on consuming pages so
 * Next.js regenerates them at most once per day — the year transition
 * lands within ~24 hours of January 1.
 */

export const CURRENT_YEAR: number = new Date().getFullYear();

/**
 * The vintage of UN World Population Prospects data we use site-wide.
 * Update this only when UN publishes a new Revision (every ~2 years).
 */
export const DATA_YEAR = 2024;

/**
 * UN WPP revision label used in citations and schema attribution.
 */
export const DATA_SOURCE_REVISION = 'UN World Population Prospects 2024 Revision';

/**
 * Today's date in YYYY-MM-DD, recomputed at build/revalidate time.
 * Use this for `dateModified` schema fields and visible "Last updated"
 * strings so they stay fresh.
 */
export const LAST_UPDATED_ISO: string = new Date().toISOString().slice(0, 10);
