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
  // Micronesia's list/display name stays "Micronesia"; the page title
  // disambiguates it from the wider region as the Federated States.
  micronesia: 'Micronesia (FSM)',
  // Congo (Brazzaville): title/running text name it in full to distinguish it
  // from the Democratic Republic of the Congo.
  congo: 'Republic of the Congo',
};

/**
 * Micronesia is displayed as the bare "Micronesia" in lists, but running text
 * must name the country (the Federated States of Micronesia) so it is never
 * confused with the sub-region of the same name.
 */
const MICRONESIA_DISPLAY = 'Micronesia';
const MICRONESIA_IN_TEXT = 'the Federated States of Micronesia';
const MICRONESIA_SENTENCE_START = 'The Federated States of Micronesia';

/** Congo (slug "congo", display name "Congo") is named in full in running text. */
const CONGO_DISPLAY = 'Congo';
const CONGO_IN_TEXT = 'the Republic of the Congo';
const CONGO_SENTENCE_START = 'The Republic of the Congo';

const NAME_BY_SLUG: Record<string, string> = Object.fromEntries(
  (countriesData as Array<{ slug: string; name: string }>).map((c) => [c.slug, c.name])
);

/** Mid-sentence name with a lowercase article where one is needed ("the Philippines"). */
export function inText(name: string): string {
  if (name === MICRONESIA_DISPLAY) return MICRONESIA_IN_TEXT;
  if (name === CONGO_DISPLAY) return CONGO_IN_TEXT;
  return THE_NAMES.has(name) ? `the ${name}` : name;
}

/** Sentence-initial name with a capitalised article where needed ("The Philippines"). */
export function sentenceStart(name: string): string {
  if (name === MICRONESIA_DISPLAY) return MICRONESIA_SENTENCE_START;
  if (name === CONGO_DISPLAY) return CONGO_SENTENCE_START;
  return THE_NAMES.has(name) ? `The ${name}` : name;
}

/**
 * Possessive form: plural-form names (and any "… Islands") get an apostrophe
 * only ("United States'"); everything else gets "'s" (Belarus's, Cyprus's,
 * Laos's).
 */
export function possessive(name: string): string {
  if (name === MICRONESIA_DISPLAY) return "Federated States of Micronesia's";
  if (name === CONGO_DISPLAY) return "Republic of the Congo's";
  if (PLURAL_NAMES.has(name) || /Islands$/.test(name)) return `${name}'`;
  return `${name}'s`;
}

/**
 * Running-text possessive with the article where needed:
 * "the United States'", "the Democratic Republic of the Congo's", "Japan's".
 * Use in prose; headings/labels use the bare name (no possessive) instead.
 */
export function possessiveInText(name: string): string {
  if (name === MICRONESIA_DISPLAY || name === CONGO_DISPLAY) return `the ${possessive(name)}`;
  return THE_NAMES.has(name) ? `the ${possessive(name)}` : possessive(name);
}

/** Sentence-initial possessive: "The United States'", "Japan's". */
export function possessiveStart(name: string): string {
  if (name === MICRONESIA_DISPLAY || name === CONGO_DISPLAY) return `The ${possessive(name)}`;
  return THE_NAMES.has(name) ? `The ${possessive(name)}` : possessive(name);
}

/** Title label for a slug: short forms for US/UK/UAE/DR Congo, else the display name. */
export function titleName(slug: string): string {
  return TITLE_OVERRIDES[slug] ?? NAME_BY_SLUG[slug] ?? slug;
}
