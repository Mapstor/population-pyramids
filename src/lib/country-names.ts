/**
 * Country-name grammar helpers, keyed on the site's DISPLAY names (as stored
 * in countries.json / the per-country files). Running text must route every
 * country-name interpolation through these; headings/labels/table cells use
 * the bare name.
 */
import countriesData from '@/data/countries.json';

/** Display names that take a definite article ("the …") in running text. */
const THE_NAMES = new Set<string>([
  'United States',
  'United Kingdom',
  'Philippines',
  'Netherlands',
  'Bahamas',
  'Gambia',
  'Maldives',
  'Comoros',
  'Marshall Islands',
  'Solomon Islands',
  'United Arab Emirates',
  'Central African Republic',
  'Dominican Republic',
  'Czech Republic',
  'Democratic Republic of the Congo',
  'Republic of the Congo',
  'Congo',
  'Holy See',
  'State of Palestine',
  'Federated States of Micronesia',
]);

/** Plural-form display names whose possessive is an apostrophe only. */
const PLURAL_NAMES = new Set<string>([
  'United States',
  'Philippines',
  'Netherlands',
  'Bahamas',
  'Maldives',
  'Comoros',
  'Seychelles',
  'United Arab Emirates',
]);

/** Slugs whose page title uses a short label instead of the full display name. */
const TITLE_OVERRIDES: Record<string, string> = {
  'united-states': 'US',
  'united-kingdom': 'UK',
  'united-arab-emirates': 'UAE',
  'democratic-republic-of-the-congo': 'DR Congo',
};

const NAME_BY_SLUG: Record<string, string> = Object.fromEntries(
  (countriesData as Array<{ slug: string; name: string }>).map((c) => [c.slug, c.name])
);

/** Mid-sentence name with a lowercase article where one is needed ("the Philippines"). */
export function inText(name: string): string {
  return THE_NAMES.has(name) ? `the ${name}` : name;
}

/** Sentence-initial name with a capitalised article where needed ("The Philippines"). */
export function sentenceStart(name: string): string {
  return THE_NAMES.has(name) ? `The ${name}` : name;
}

/**
 * Possessive form: plural-form names (and any "… Islands") get an apostrophe
 * only ("United States'"); everything else gets "'s" (Belarus's, Cyprus's,
 * Laos's).
 */
export function possessive(name: string): string {
  if (PLURAL_NAMES.has(name) || /Islands$/.test(name)) return `${name}'`;
  return `${name}'s`;
}

/**
 * Running-text possessive with the article where needed:
 * "the United States'", "the Democratic Republic of the Congo's", "Japan's".
 * Use in prose; headings/labels use the bare name (no possessive) instead.
 */
export function possessiveInText(name: string): string {
  return THE_NAMES.has(name) ? `the ${possessive(name)}` : possessive(name);
}

/** Sentence-initial possessive: "The United States'", "Japan's". */
export function possessiveStart(name: string): string {
  return THE_NAMES.has(name) ? `The ${possessive(name)}` : possessive(name);
}

/** Title label for a slug: short forms for US/UK/UAE/DR Congo, else the display name. */
export function titleName(slug: string): string {
  return TITLE_OVERRIDES[slug] ?? NAME_BY_SLUG[slug] ?? slug;
}
