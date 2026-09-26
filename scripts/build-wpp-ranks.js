/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * T4c: precompute the country rankings so rankBy() and the T5a rank facts read ONE
 * small file instead of loading all 194 wpp2024 + population files on every page during
 * static generation.
 *
 * Writes src/data/wpp2024/ranks-<REFERENCE_YEAR>.json:
 *   { referenceYear, N, bySlug: { slug: { pop, tfr, e0, medianAge, o65, u15 } }, world }
 * Each value is a 1-based rank (1 = highest), vatican-city excluded. Ties break by name.
 *
 * Usage: node scripts/build-wpp-ranks.js
 */
const fs = require('fs');
const path = require('path');

const REFERENCE_YEAR = 2026; // keep in sync with src/lib/site-meta.ts
const WPP = path.join(__dirname, '..', 'src', 'data', 'wpp2024');
const POP = path.join(__dirname, '..', 'src', 'data', 'population');
const countries = require('../src/data/countries.json');

const U15 = ['0-4', '5-9', '10-14'];
const O65 = ['65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+'];
const shareOf = (yd, bands) => {
  const t = yd.totalPopulation;
  if (!t) return 0;
  return (yd.ageGroups.filter((a) => bands.includes(a.ageRange)).reduce((s, a) => s + (a.total ?? 0), 0) / t) * 100;
};
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const rows = [];
for (const c of countries) {
  if (c.slug === 'vatican-city') continue;
  let w, pd;
  try { w = readJson(path.join(WPP, `${c.slug}.json`)).years[String(REFERENCE_YEAR)]; } catch { continue; }
  try { pd = readJson(path.join(POP, `${c.slug}.json`)).years[String(REFERENCE_YEAR)]; } catch { continue; }
  if (!w || !pd || w.medianAge == null) continue;
  rows.push({
    slug: c.slug, name: c.name,
    pop: w.pop, tfr: w.tfr, e0: w.e0, medianAge: w.medianAge,
    o65: shareOf(pd, O65), u15: shareOf(pd, U15),
  });
}

const rankMap = (key) => {
  const sorted = [...rows].filter((r) => typeof r[key] === 'number')
    .sort((a, b) => b[key] - a[key] || a.name.localeCompare(b.name));
  const m = {};
  sorted.forEach((r, i) => { m[r.slug] = i + 1; });
  return m;
};

const fields = ['pop', 'tfr', 'e0', 'medianAge', 'o65', 'u15'];
const maps = Object.fromEntries(fields.map((f) => [f, rankMap(f)]));
const bySlug = {};
for (const r of rows) {
  bySlug[r.slug] = Object.fromEntries(fields.map((f) => [f, maps[f][r.slug] ?? null]));
}

const world = readJson(path.join(WPP, 'world.json')).years[String(REFERENCE_YEAR)] || null;

const out = { referenceYear: REFERENCE_YEAR, N: rows.length, bySlug, world };
const outPath = path.join(WPP, `ranks-${REFERENCE_YEAR}.json`);
fs.writeFileSync(outPath, JSON.stringify(out));
console.log(`wrote ${outPath}: N=${rows.length}, ${Object.keys(bySlug).length} slugs, ${Buffer.byteLength(JSON.stringify(out))} bytes`);
// sanity
console.log('japan:', JSON.stringify(bySlug['japan']), '| south-korea u15 rank:', bySlug['south-korea']?.u15);
