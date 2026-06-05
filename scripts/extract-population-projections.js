/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * One-shot ETL: extract total population (Jul 1) per country per year from
 * UN WPP 2024 → per-country JSON files under src/data/population-projections/.
 *
 *   Estimates sheet  → 1950–2023 (historical)
 *   Medium variant   → 2024–2100 (projections)
 *
 * Source values are in thousands; we store them in thousands too (the UI
 * multiplies by 1000 for display).
 *
 * Usage:
 *   node --max-old-space-size=4096 scripts/extract-population-projections.js
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const XLSX_PATH = '/workspace/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_FULL.xlsx';
const COUNTRIES_PATH = path.join(__dirname, '..', 'src', 'data', 'countries.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'population-projections');

// Verified column indexes (header row 17 in the WPP file)
const COL = {
  variant: 1,
  name: 2,
  iso3: 5,
  type: 8,
  year: 10,
  popJul1Thousands: 12,
};
const HEADER_ROWS = 17;

function loadCountries() {
  return JSON.parse(fs.readFileSync(COUNTRIES_PATH, 'utf-8'));
}

function readSheet(wb, sheetName) {
  const sheet = wb.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);
  return XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
}

// Build {iso3: {year: popThousands}}
function indexByIso3AndYear(rows) {
  const out = {};
  for (let i = HEADER_ROWS; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    const iso3 = r[COL.iso3];
    const year = r[COL.year];
    const pop = r[COL.popJul1Thousands];
    // Only keep rows with valid iso3 (filters out region rollups) and numeric pop
    if (!iso3 || typeof year !== 'number' || typeof pop !== 'number') continue;
    if (!out[iso3]) out[iso3] = {};
    out[iso3][year] = pop;
  }
  return out;
}

// Also pull the World aggregate (no ISO3 — identified by name === "World")
function indexWorldByYear(rows) {
  const out = {};
  for (let i = HEADER_ROWS; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    if (r[COL.name] !== 'World') continue;
    const year = r[COL.year];
    const pop = r[COL.popJul1Thousands];
    if (typeof year !== 'number' || typeof pop !== 'number') continue;
    out[year] = pop;
  }
  return out;
}

function main() {
  console.log('Reading countries.json...');
  const countries = loadCountries();
  console.log(`  ${countries.length} countries.`);

  console.log(`Loading WPP xlsx (Estimates + Medium variant only)...`);
  const t0 = Date.now();
  const wb = XLSX.readFile(XLSX_PATH, {
    sheets: ['Estimates', 'Medium variant'],
    cellStyles: false, cellHTML: false, cellFormula: false,
    cellNF: false, cellDates: false,
    bookDeps: false, bookProps: false, bookSheets: false, bookVBA: false,
  });
  console.log(`  Loaded in ${((Date.now() - t0) / 1000).toFixed(1)}s. mem rss: ${(process.memoryUsage().rss / 1e6).toFixed(0)} MB`);

  console.log('Parsing Estimates (1950–2023)...');
  const estRows = readSheet(wb, 'Estimates');
  const estByCountry = indexByIso3AndYear(estRows);
  const estWorld = indexWorldByYear(estRows);
  console.log(`  ${Object.keys(estByCountry).length} ISO3 countries with estimates.`);

  console.log('Parsing Medium variant (2024–2100)...');
  const medRows = readSheet(wb, 'Medium variant');
  const medByCountry = indexByIso3AndYear(medRows);
  const medWorld = indexWorldByYear(medRows);
  console.log(`  ${Object.keys(medByCountry).length} ISO3 countries with projections.`);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let written = 0;
  let skipped = 0;
  const skippedList = [];
  const summary = [];

  // Per-country files
  for (const c of countries) {
    const est = estByCountry[c.code] || {};
    const med = medByCountry[c.code] || {};
    const yearsAll = new Set([...Object.keys(est), ...Object.keys(med)].map(Number));

    if (yearsAll.size === 0) {
      skipped++;
      skippedList.push(c.slug);
      continue;
    }

    const values = {};
    const estYears = [];
    const projYears = [];
    for (const y of [...yearsAll].sort((a, b) => a - b)) {
      const v = med[y] ?? est[y];
      if (typeof v !== 'number') continue;
      values[String(y)] = Math.round(v); // thousand-people, integer
      if (y <= 2023) estYears.push(y);
      else projYears.push(y);
    }

    // Find peak year (max population) and the year/pop in 2050 + 2100 for quick lookups
    let peakYear = null, peakPop = -1;
    for (const [y, v] of Object.entries(values)) {
      if (v > peakPop) { peakPop = v; peakYear = Number(y); }
    }
    const pop2025 = values['2025'] ?? null;
    const pop2050 = values['2050'] ?? null;
    const pop2100 = values['2100'] ?? null;

    const out = {
      countryCode: c.code,
      countryName: c.name,
      slug: c.slug,
      source: 'UN World Population Prospects 2024 Revision (medium variant)',
      lastUpdated: new Date().toISOString().slice(0, 10),
      estimateYears: [estYears[0], estYears[estYears.length - 1]],
      projectionYears: [projYears[0], projYears[projYears.length - 1]],
      peakYear,
      peakPopulationThousands: peakPop,
      pop2025Thousands: pop2025,
      pop2050Thousands: pop2050,
      pop2100Thousands: pop2100,
      values, // year-string → population in thousands
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${c.slug}.json`),
      JSON.stringify(out, null, 0) // compact — files load fast
    );
    written++;
    summary.push({ slug: c.slug, name: c.name, pop2025, pop2050, pop2100, peakYear });
  }

  // Also write a world.json
  const worldYears = new Set([...Object.keys(estWorld), ...Object.keys(medWorld)].map(Number));
  const worldValues = {};
  let worldPeakYear = null, worldPeakPop = -1;
  for (const y of [...worldYears].sort((a, b) => a - b)) {
    const v = medWorld[y] ?? estWorld[y];
    if (typeof v !== 'number') continue;
    worldValues[String(y)] = Math.round(v);
    if (v > worldPeakPop) { worldPeakPop = v; worldPeakYear = y; }
  }
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'world.json'),
    JSON.stringify({
      countryCode: 'WORLD',
      countryName: 'World',
      slug: 'world',
      source: 'UN World Population Prospects 2024 Revision (medium variant)',
      lastUpdated: new Date().toISOString().slice(0, 10),
      peakYear: worldPeakYear,
      peakPopulationThousands: worldPeakPop,
      pop2025Thousands: worldValues['2025'] ?? null,
      pop2050Thousands: worldValues['2050'] ?? null,
      pop2100Thousands: worldValues['2100'] ?? null,
      values: worldValues,
    }, null, 0)
  );

  console.log(`\n✓ Wrote ${written} country files + world.json`);
  if (skipped) console.log(`  Skipped ${skipped} (no ISO3 data): ${skippedList.join(', ')}`);

  // Sanity output: top 10 by 2050, bottom 10 by % change
  const has2050 = summary.filter(s => s.pop2050).sort((a, b) => b.pop2050 - a.pop2050);
  console.log('\nTop 10 by projected 2050 population:');
  has2050.slice(0, 10).forEach((s, i) =>
    console.log(`  ${i + 1}. ${s.name.padEnd(28)} ${(s.pop2050 * 1000).toLocaleString().padStart(15)} (peak ${s.peakYear})`));

  console.log('\nWorld checkpoints:');
  console.log(`  2025: ${worldValues['2025']?.toLocaleString()} thousand`);
  console.log(`  2050: ${worldValues['2050']?.toLocaleString()} thousand`);
  console.log(`  2100: ${worldValues['2100']?.toLocaleString()} thousand`);
  console.log(`  Peak: ${worldPeakYear} at ${worldPeakPop.toLocaleString()} thousand`);
}

main();
