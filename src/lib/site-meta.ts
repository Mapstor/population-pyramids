import type { Metadata } from 'next';

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
 * NOTE: this is the SOURCE revision year ("UN WPP 2024"), not the year of the
 * figures we display as "current" — that is REFERENCE_YEAR below.
 */
export const DATA_YEAR = 2024;

/**
 * The single reference year the site shows as "current". The WPP 2024 data runs
 * 1950–2100; we present REFERENCE_YEAR as today's figures and anything after it
 * only where explicitly labelled a projection. Every page that shows "current"
 * numbers must read this — never "the latest year in the file" (that is 2030).
 * Fixed on purpose (not new Date().getFullYear()) so it never drifts past the
 * data we have vetted; bump it deliberately when we roll the reference forward.
 */
export const REFERENCE_YEAR = 2026;

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

// ---------------------------------------------------------------------------
// Canonical host + metadata helpers — the single source of truth for the site
// URL. www.populationpyramids.org is the one canonical host.
//
// SITE_URL is hardcoded on purpose, NOT read from an env var: a production env
// var may still hold the apex host, and VERCEL_URL is a per-deploy/preview host
// — neither is safe for canonical / og:url / sitemap URLs.
// ---------------------------------------------------------------------------

/** The single canonical origin for the site. No trailing slash. */
export const SITE_URL = 'https://www.populationpyramids.org';

/** Brand name used in <title>, openGraph.siteName, and JSON-LD. */
export const SITE_NAME = 'Population Pyramids';

/** Default social-share image (site-relative; resolved to an absolute www URL). */
export const DEFAULT_OG_IMAGE = '/og-image.png';

/**
 * Turn a site path into an absolute www URL for canonical / og / JSON-LD use.
 * Clean path only: any trailing slash is stripped (trailingSlash is off) and
 * '/' maps to the bare origin.
 */
export function absoluteUrl(path: string = '/'): string {
  if (!path || path === '/') return SITE_URL;
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  const trimmed =
    withLeading.length > 1 && withLeading.endsWith('/')
      ? withLeading.slice(0, -1)
      : withLeading;
  return `${SITE_URL}${trimmed}`;
}

interface BuildMetadataInput {
  /** Core page title WITHOUT the brand suffix — the brand is appended once. */
  title: string;
  description: string;
  /** Clean path the route actually serves, e.g. '/compare' (no query/hash). */
  path: string;
  /** openGraph type: 'article' for blog posts, 'website' otherwise. */
  type?: 'website' | 'article';
  /** Custom OG image (absolute URL or site-relative). Defaults to DEFAULT_OG_IMAGE. */
  image?: string;
  imageAlt?: string;
  /**
   * Whether to append " | {SITE_NAME}" to the title. Default true. Set false
   * when the page supplies a complete, self-contained answer-first title that
   * must not carry a brand suffix (e.g. country pages).
   */
  brandInTitle?: boolean;
  keywords?: string[];
}

/**
 * Produce a complete, self-referencing Metadata object: an absolute www
 * canonical plus a matching, FULL openGraph and twitter block. Next.js
 * shallow-merges metadata, so a child openGraph replaces the parent's
 * entirely — it must carry every field or the inherited value leaks through
 * (this is why some pages used to show the homepage as og:url). Title is
 * emitted as `absolute` so the brand appears exactly once regardless of any
 * parent title template.
 */
export function buildMetadata({
  title,
  description,
  path,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  keywords,
  brandInTitle = true,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = brandInTitle ? `${title} | ${SITE_NAME}` : title;
  const ogImage = image.startsWith('http') ? image : absoluteUrl(image);
  const ogBase = {
    locale: 'en_US',
    url,
    siteName: SITE_NAME,
    title: fullTitle,
    description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt ?? fullTitle }],
  };
  return {
    title: { absolute: fullTitle },
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph:
      type === 'article'
        ? { type: 'article', ...ogBase }
        : { type: 'website', ...ogBase },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
