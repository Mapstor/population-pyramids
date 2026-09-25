/**
 * Permanent (308) redirects for legacy/orphan blog slugs whose folders
 * never shipped a page.tsx. Each one is paired with the most semantically
 * adjacent live article so external links and search-index entries land
 * on real content instead of a 404 / hub bounce.
 */
const blogRedirects = [
  { from: 'africa-population-explosion',                    to: 'youth-explosion-africa-youngest-populations' },
  { from: 'china-india-population-shift',                   to: 'china-india-population-swap-global-shift' },
  { from: 'countries-losing-people-fast',                   to: 'demographic-time-bombs-countries-losing-people' },
  { from: 'europe-aging-crisis',                            to: 'worlds-aging-crisis-9-countries-seniors' },
  { from: 'fertility-collapse-countries-stopped-having-babies', to: 'fertility-apocalypse-countries-stopped-having-babies' },
  { from: 'gender-ratio-crisis-too-many-men',               to: 'country-2-5-men-for-every-woman-dating-crisis' },
  { from: 'global-fertility-crisis',                        to: 'fertility-apocalypse-countries-stopped-having-babies' },
  { from: 'japan-demographic-time-bomb',                    to: 'demographic-time-bombs-countries-losing-people' },
  { from: 'middle-east-demographic-divide',                 to: 'country-2-5-men-for-every-woman-dating-crisis' },
  { from: 'migration-nations-gaining-losing-millions',      to: 'migration-nations-countries-gaining-losing-millions' },
  { from: 'us-immigration-demographics',                    to: 'migration-nations-countries-gaining-losing-millions' },
  { from: 'youth-bulge-political-instability',              to: 'half-this-country-under-17-youth-explosion' },
  // Old year-laden URLs that the blog index used to link to (broken in prod):
  // canonical equivalents drop the year so the slug stays evergreen.
  { from: '10-states-people-fleeing-2024',                  to: 'states-people-fleeing' },
  { from: '15-fastest-growing-states-2024',                 to: 'fastest-growing-states' },
  { from: 'best-states-retire-2025',                        to: 'best-states-retire' },
  { from: 'fastest-growing-states-population-2024',         to: 'fastest-growing-states-population' },
  // Duplicate content — consolidate to the longer slug we link to from the index.
  { from: 'china-india-population-swap',                    to: 'china-india-population-swap-global-shift' },
  // Nested ugly URL replaced by its evergreen parent.
  { from: 'fastest-growing-states-population/fastest-growing-states-population-2024',
    to:   'fastest-growing-states-population' },
];

module.exports = {
  swcMinify: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return blogRedirects.map(({ from, to }) => ({
      source: `/blog/${from}`,
      destination: `/blog/${to}`,
      permanent: true,
    }));
  },
};
