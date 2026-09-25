/**
 * Single source of truth for every INTERNAL redirect on the site (T3).
 *
 * CommonJS on purpose: next.config.js (plain JS, loaded before TS compilation)
 * `require()`s this and returns it from `redirects()`. All internal rules are
 * permanent (308). External-destination rules (e.g. /ads.txt) stay in
 * vercel.json and are NOT represented here.
 *
 * T10/T11 re-point the blog rules when those posts merge; T3 leaves the
 * destinations unchanged.
 */
const countries = require('../data/countries.json');

/** All 195 country slugs (vatican-city included). */
const COUNTRY_SLUGS = countries.map((c) => c.slug);

const CANONICAL_ORIGIN = 'https://www.populationpyramids.org';
// Matched by Next as `^<value>$` (host lowercased); dots escaped so localhost,
// preview *.vercel.app deploys and www itself can never match.
const LEGACY_HOSTS = ['populationpyramids\\.org', 'population-pyramids-peach\\.vercel\\.app'];

/** Years the old year-laden URLs used. */
const YEARS = '1950|1980|1990|2000|2010|2020|2025';

/** Orphan / duplicate blog slugs -> the closest live article (from the WIP). */
const BLOG_REDIRECTS = [
  { from: 'africa-population-explosion', to: 'youth-explosion-africa-youngest-populations' },
  { from: 'china-india-population-shift', to: 'china-india-population-swap-global-shift' },
  { from: 'countries-losing-people-fast', to: 'demographic-time-bombs-countries-losing-people' },
  { from: 'europe-aging-crisis', to: 'worlds-aging-crisis-9-countries-seniors' },
  { from: 'fertility-collapse-countries-stopped-having-babies', to: 'fertility-apocalypse-countries-stopped-having-babies' },
  { from: 'gender-ratio-crisis-too-many-men', to: 'country-2-5-men-for-every-woman-dating-crisis' },
  { from: 'global-fertility-crisis', to: 'fertility-apocalypse-countries-stopped-having-babies' },
  { from: 'japan-demographic-time-bomb', to: 'demographic-time-bombs-countries-losing-people' },
  { from: 'middle-east-demographic-divide', to: 'country-2-5-men-for-every-woman-dating-crisis' },
  { from: 'migration-nations-gaining-losing-millions', to: 'migration-nations-countries-gaining-losing-millions' },
  { from: 'us-immigration-demographics', to: 'migration-nations-countries-gaining-losing-millions' },
  { from: 'youth-bulge-political-instability', to: 'half-this-country-under-17-youth-explosion' },
  { from: '10-states-people-fleeing-2024', to: 'states-people-fleeing' },
  { from: '15-fastest-growing-states-2024', to: 'fastest-growing-states' },
  { from: 'best-states-retire-2025', to: 'best-states-retire' },
  { from: 'fastest-growing-states-population-2024', to: 'fastest-growing-states-population' },
  { from: 'china-india-population-swap', to: 'china-india-population-swap-global-shift' },
  { from: 'fastest-growing-states-population/fastest-growing-states-population-2024', to: 'fastest-growing-states-population' },
];

/** Country-name aliases -> canonical slug (each destination verified to exist). */
const COUNTRY_ALIASES = {
  'united-states': ['united-states-of-america', 'usa', 'us'],
  'united-kingdom': ['uk', 'great-britain', 'britain'],
  'united-arab-emirates': ['uae'],
  russia: ['russian-federation'],
  iran: ['iran-islamic-republic-of'],
  turkey: ['turkiye'],
  vietnam: ['viet-nam'],
  syria: ['syrian-arab-republic'],
  'south-korea': ['republic-of-korea', 'korea-south'],
  'north-korea': ['dem-peoples-republic-of-korea', 'dem-people-s-republic-of-korea', 'dprk', 'korea-north'],
  laos: ['lao-peoples-democratic-republic', 'lao-people-s-democratic-republic', 'lao-pdr'],
  tanzania: ['united-republic-of-tanzania'],
  moldova: ['republic-of-moldova'],
  bolivia: ['bolivia-plurinational-state-of'],
  venezuela: ['venezuela-bolivarian-republic-of'],
  micronesia: ['micronesia-fed-states-of', 'federated-states-of-micronesia'],
  palestine: ['state-of-palestine'],
  'vatican-city': ['holy-see', 'vatican'],
  'czech-republic': ['czechia'],
  'cote-divoire': ['cote-d-ivoire', 'ivory-coast'],
  'cabo-verde': ['cape-verde'],
  eswatini: ['swaziland'],
  myanmar: ['burma'],
  'timor-leste': ['east-timor'],
  'north-macedonia': ['macedonia'],
  brunei: ['brunei-darussalam'],
  'democratic-republic-of-the-congo': ['drc', 'dr-congo', 'congo-kinshasa'],
  congo: ['republic-of-the-congo', 'congo-brazzaville'],
  netherlands: ['holland', 'the-netherlands'],
  philippines: ['the-philippines'],
  gambia: ['the-gambia'],
  bahamas: ['the-bahamas'],
  'bosnia-and-herzegovina': ['bosnia'],
  'saint-lucia': ['st-lucia'],
  'saint-kitts-and-nevis': ['st-kitts-and-nevis'],
  'saint-vincent-and-the-grenadines': ['st-vincent-and-the-grenadines'],
};

/** Old URLs that 404 today but have Search Console impressions. */
const OLD_URLS = [
  { source: '/blog/5-stage-demographic-transition-complete-model', destination: '/blog/5-stages-demographic-transition-complete-model' },
  { source: '/blog/4-vs-5-stages-demographic-transition', destination: '/blog/4-vs-5-stages-demographic-transition-model' },
  { source: '/blog/china-india-swap-global-shift', destination: '/blog/china-india-population-swap-global-shift' },
  { source: '/top-10-most-populous-countries', destination: '/top-10-most-populated-countries' },
  { source: '/male-to-female-ratio-by-country-2026', destination: '/male-to-female-ratio' },
  { source: '/population-pyramid-by-country', destination: '/countries' },
  // /stage-4-demographic-transition -> the live Stage 4 blog post.
  { source: '/stage-4-demographic-transition', destination: '/blog/stage-4-demographic-transition' },
];

/** Build the full internal-redirect list (all permanent = 308). */
function redirects() {
  const rules = [];
  const P = (source, destination) => ({ source, destination, permanent: true });

  // 1) Host redirects (T1): every path from a legacy host -> www, query preserved.
  for (const value of LEGACY_HOSTS) {
    rules.push({
      source: '/:path*',
      has: [{ type: 'host', value }],
      destination: `${CANONICAL_ORIGIN}/:path*`,
      permanent: true,
    });
  }

  // 2) Blog slug redirects (WIP).
  for (const { from, to } of BLOG_REDIRECTS) rules.push(P(`/blog/${from}`, `/blog/${to}`));

  // 3) State year redirects (moved from vercel.json; was 301, now 308).
  rules.push(P(`/states/:state/:year(${YEARS})`, '/states/:state'));

  // 4) Country sub-paths: /{country}/{anything} -> /{country}. A single
  //    slug-restricted regex (all 195 slugs, longest-first for clean backtracking)
  //    so it only ever matches a real country segment — never /blog, /compare,
  //    /states, /countries, /life-expectancy-by-country/opengraph-image, etc. —
  //    and ":rest+" requires >=1 extra segment, so the bare /{country} is never
  //    matched (no loop). Replaces the old /:country/:year year-only rule.
  const SLUGS_ALT = [...COUNTRY_SLUGS].sort((a, b) => b.length - a.length).join('|');
  rules.push(P(`/:country(${SLUGS_ALT})/:rest+`, '/:country'));
  //    /countries/{country} -> /{country}. Slug-restricted so /countries/{alias}
  //    can never chain into an alias rule; no real /countries/[x] route exists.
  rules.push(P(`/countries/:country(${SLUGS_ALT})`, '/:country'));

  // 5) Country aliases: /{alias} and /{alias}/{anything} -> /{slug}.
  for (const [slug, aliases] of Object.entries(COUNTRY_ALIASES)) {
    for (const alias of aliases) {
      rules.push(P(`/${alias}`, `/${slug}`));
      rules.push(P(`/${alias}/:rest+`, `/${slug}`));
    }
  }

  // 6) Old 404'd URLs with impressions.
  for (const { source, destination } of OLD_URLS) rules.push(P(source, destination));

  return rules;
}

module.exports = redirects;
module.exports.redirects = redirects;
module.exports.COUNTRY_SLUGS = COUNTRY_SLUGS;
module.exports.COUNTRY_ALIASES = COUNTRY_ALIASES;
module.exports.BLOG_REDIRECTS = BLOG_REDIRECTS;
module.exports.OLD_URLS = OLD_URLS;
