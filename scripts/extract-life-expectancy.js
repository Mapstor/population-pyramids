/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * One-shot ETL: extract life expectancy data from UN WPP 2024 xlsx
 * into per-country JSON files under src/data/life-expectancy/.
 *
 * Usage:
 *   node --max-old-space-size=4096 scripts/extract-life-expectancy.js
 *
 * Reads:
 *   - /workspace/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_FULL.xlsx
 *   - src/data/countries.json (slug + ISO3 mapping)
 *   - src/lib/country-neighbors.ts (parsed loosely for neighbor lookup)
 *
 * Writes:
 *   - src/data/life-expectancy/<slug>.json (one per matched country)
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const XLSX_PATH = '/workspace/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_FULL.xlsx';
const COUNTRIES_PATH = path.join(__dirname, '..', 'src', 'data', 'countries.json');
const NEIGHBORS_PATH = path.join(__dirname, '..', 'src', 'lib', 'country-neighbors.ts');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'life-expectancy');

// Column indexes in the WPP file (verified against header row 16)
const COL = {
  index: 0,
  variant: 1,
  name: 2,
  iso3: 5,
  year: 10,
  leTotal: 34,
  leMale: 35,
  leFemale: 36,
};

// Key years we want in the historical series (Estimates sheet ends 2023)
const HIST_YEARS = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2015, 2020, 2023];
// Key years for projections (Medium variant covers 2024+)
const PROJ_YEARS = [2024, 2030, 2050, 2100];
// The "current year" we'll report (UN WPP 2024 medium-variant projection for 2024)
const CURRENT_YEAR = 2024;

function loadCountries() {
  return JSON.parse(fs.readFileSync(COUNTRIES_PATH, 'utf-8'));
}

function parseNeighbors() {
  // Loose parse of country-neighbors.ts — match 'slug': ['neighbor1', 'neighbor2', ...]
  const src = fs.readFileSync(NEIGHBORS_PATH, 'utf-8');
  const map = {};
  const re = /'([\w-]+)'\s*:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(src))) {
    const slug = m[1];
    const list = m[2]
      .split(',')
      .map((s) => s.trim().replace(/^'|'$/g, ''))
      .filter(Boolean);
    map[slug] = list;
  }
  return map;
}

function readSheet(wb, sheetName) {
  const sheet = wb.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);
  return XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
}

function indexByIso3AndYear(rows) {
  // Skip header rows (first ~17 are metadata)
  const out = {};
  for (let i = 17; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    const iso3 = r[COL.iso3];
    const year = r[COL.year];
    if (!iso3 || typeof year !== 'number') continue;
    if (!out[iso3]) out[iso3] = {};
    out[iso3][year] = {
      total: typeof r[COL.leTotal] === 'number' ? r[COL.leTotal] : null,
      male: typeof r[COL.leMale] === 'number' ? r[COL.leMale] : null,
      female: typeof r[COL.leFemale] === 'number' ? r[COL.leFemale] : null,
    };
  }
  return out;
}

function indexWorldByYear(rows) {
  // World rows have Location code 900 and empty ISO3
  const out = {};
  for (let i = 17; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    if (r[COL.name] !== 'World') continue;
    const year = r[COL.year];
    if (typeof year !== 'number') continue;
    out[year] = {
      total: typeof r[COL.leTotal] === 'number' ? r[COL.leTotal] : null,
      male: typeof r[COL.leMale] === 'number' ? r[COL.leMale] : null,
      female: typeof r[COL.leFemale] === 'number' ? r[COL.leFemale] : null,
    };
  }
  return out;
}

function r1(n) {
  return Math.round(n * 10) / 10;
}

function main() {
  console.log('Reading countries.json...');
  const countries = loadCountries();
  console.log(`  ${countries.length} countries.`);

  console.log('Parsing neighbors map...');
  const neighbors = parseNeighbors();
  console.log(`  ${Object.keys(neighbors).length} countries have neighbors defined.`);

  console.log(`Loading xlsx (${XLSX_PATH}) — sheets: Estimates + Medium variant only...`);
  const t0 = Date.now();
  const wb = XLSX.readFile(XLSX_PATH, {
    sheets: ['Estimates', 'Medium variant'],
    cellStyles: false,
    cellHTML: false,
    cellFormula: false,
    cellNF: false,
    cellDates: false,
    bookDeps: false,
    bookProps: false,
    bookSheets: false,
    bookVBA: false,
  });
  console.log(`  Loaded in ${((Date.now() - t0) / 1000).toFixed(1)}s. mem rss: ${(process.memoryUsage().rss/1e6).toFixed(0)} MB`);

  console.log('Reading Estimates sheet (historical)...');
  const estimates = readSheet(wb, 'Estimates');
  const histByCountry = indexByIso3AndYear(estimates);
  const worldHist = indexWorldByYear(estimates);
  console.log(`  ${Object.keys(histByCountry).length} ISO3 countries in Estimates.`);

  console.log('Reading Medium variant sheet (projections)...');
  const medium = readSheet(wb, 'Medium variant');
  const projByCountry = indexByIso3AndYear(medium);
  console.log(`  ${Object.keys(projByCountry).length} ISO3 countries in Medium variant.`);

  // Build current-year (2024) ranking — 2024 is in Medium variant (it's the first projection year)
  const all2024 = [];
  for (const c of countries) {
    const d = projByCountry[c.code]?.[CURRENT_YEAR];
    if (d && d.total != null) {
      all2024.push({ slug: c.slug, code: c.code, name: c.name, value: d.total });
    }
  }
  all2024.sort((a, b) => b.value - a.value);
  const rankBySlug = {};
  all2024.forEach((c, i) => {
    rankBySlug[c.slug] = i + 1;
  });
  const rankTotal = all2024.length;

  // World averages for current year (2024 lives in Medium variant)
  const worldProj = indexWorldByYear(medium);
  const worldNow = worldProj[CURRENT_YEAR] || worldHist[2023];

  // Pre-build a code->slug map for neighbor lookup helpers
  const codeBySlug = {};
  countries.forEach((c) => {
    codeBySlug[c.slug] = c.code;
  });

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let written = 0;
  let skipped = 0;
  const skippedList = [];

  for (const c of countries) {
    const hist = histByCountry[c.code] || {};
    const proj = projByCountry[c.code] || {};
    const cur = proj[CURRENT_YEAR]; // 2024 is in Medium variant

    if (!cur || cur.total == null || cur.male == null || cur.female == null) {
      skipped++;
      skippedList.push(c.slug);
      continue;
    }

    const historical = HIST_YEARS.map((y) => {
      const d = hist[y];
      return d && d.total != null ? { year: y, total: r1(d.total) } : null;
    }).filter(Boolean);

    const projections = PROJ_YEARS.map((y) => {
      const d = proj[y];
      return d && d.total != null ? { year: y, total: r1(d.total) } : null;
    }).filter(Boolean);

    // Neighbors (try defined neighbors; if not, leave empty)
    const neighborSlugs = (neighbors[c.slug] || []).slice(0, 3);
    const neighborObjs = neighborSlugs
      .map((slug) => {
        const code = codeBySlug[slug];
        if (!code) return null;
        const d = projByCountry[code]?.[CURRENT_YEAR];
        if (!d || d.total == null) return null;
        const name = countries.find((cn) => cn.slug === slug)?.name || slug;
        return { name, slug, value: r1(d.total) };
      })
      .filter(Boolean);

    const payload = {
      country: c.name,
      slug: c.slug,
      lastUpdated: '2026-05-20',
      source: 'UN World Population Prospects 2024 Revision',
      current: {
        year: CURRENT_YEAR,
        total: r1(cur.total),
        male: r1(cur.male),
        female: r1(cur.female),
      },
      rank: {
        position: rankBySlug[c.slug] ?? rankTotal,
        outOf: rankTotal,
      },
      worldAverage: {
        total: r1(worldNow?.total ?? 73.4),
        male: r1(worldNow?.male ?? 70.8),
        female: r1(worldNow?.female ?? 76.0),
      },
      historical,
      projections,
      neighbors: neighborObjs,
    };

    const outPath = path.join(OUTPUT_DIR, `${c.slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');
    written++;
  }

  console.log(`\nDone. Wrote ${written} files. Skipped ${skipped} (no data):`);
  if (skipped > 0) console.log('  ' + skippedList.join(', '));
}

main();
