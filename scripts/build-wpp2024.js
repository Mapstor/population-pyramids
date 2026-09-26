/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * T4a ETL: build the WPP 2024 indicator data layer.
 *
 * Primary source : /workspace/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_FULL.xlsx
 *   sheets "Estimates" (1950–2023) and "Medium variant" (2024–2100).
 * Fallback source : /workspace/t4-data/wpp2024-indicators-fallback.csv
 *   (used only if the xlsx cannot be parsed / OOM; set FORCE_FALLBACK=1).
 *
 * Writes src/data/wpp2024/<slug>.json for all 195 site slugs + world.json,
 * one record per year 1950–2100. Counts are converted thousands -> persons.
 *
 * Usage:
 *   NODE_PATH=./node_modules node --max-old-space-size=4096 scripts/build-wpp2024.js
 */
const fs = require('fs');
const path = require('path');

const XLSX_PATH = '/workspace/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_FULL.xlsx';
const FALLBACK_CSV = '/workspace/t4-data/wpp2024-indicators-fallback.csv';
const EXPECTED_CSV = '/workspace/t4-data/expected-indicators.csv';
const COUNTRIES_PATH = path.join(__dirname, '..', 'src', 'data', 'countries.json');
const OUT_DIR = path.join(__dirname, '..', 'src', 'data', 'wpp2024');

// Verified column indices in WPP2024 GEN_F01 indicators file (header row 16).
const COL = {
  name: 2, loc: 4, iso3: 5, type: 8, year: 10,
  pop: 12, male: 13, female: 14,        // thousands (1 July)
  sexRatioPer100: 16, medianAge: 17,
  natChangeRate: 19, growthRatePct: 21,
  births: 23, cbr: 25, tfr: 26, srbPer100: 29,
  deaths: 30, cdr: 33, e0: 34, e0M: 35, e0F: 36,
  netMigrants: 63, netMigrationRate: 64, // netMigrants thousands
};
const YEAR_MIN = 1950, YEAR_MAX = 2100;
const EXPECTED_LOC = { micronesia: 583, palestine: 275, 'vatican-city': 336 };

const persons = (thousands) => (thousands == null ? null : Math.round(thousands * 1000));
const rnd = (v, d) => (v == null ? null : Math.round(v * 10 ** d) / 10 ** d);

// Build one year record from a field-getter (values in xlsx units: counts=thousands).
function record(get, year) {
  const male = persons(get('male')), female = persons(get('female'));
  // pop = male + female (both 1 July): the UN total equals the sex sum, and this
  // matches the exact published/verify totals at the sub-person rounding boundary
  // (e.g. World 2100 = 10,180,160,752). Falls back to the total column if a sex is null.
  const pop = (male != null && female != null) ? male + female : persons(get('pop'));
  return {
    pop, male, female,
    medianAge: rnd(get('medianAge'), 3),
    births: persons(get('births')), deaths: persons(get('deaths')),
    cbr: rnd(get('cbr'), 3), cdr: rnd(get('cdr'), 3), tfr: rnd(get('tfr'), 3),
    e0: rnd(get('e0'), 3), e0M: rnd(get('e0M'), 3), e0F: rnd(get('e0F'), 3),
    growthRatePct: rnd(get('growthRatePct'), 3), natChangeRate: rnd(get('natChangeRate'), 3),
    netMigrants: persons(get('netMigrants')), netMigrationRate: rnd(get('netMigrationRate'), 3),
    srbPer100: rnd(get('srbPer100'), 2), sexRatioPer100: rnd(get('sexRatioPer100'), 2),
    projected: year >= 2024,
  };
}

// ---- source: official xlsx ------------------------------------------------
function extractFromXlsx() {
  const XLSX = require('xlsx');
  const t0 = Date.now();
  const wb = XLSX.readFile(XLSX_PATH, {
    sheets: ['Estimates', 'Medium variant'],
    cellStyles: false, cellHTML: false, cellFormula: false, cellNF: false,
    cellDates: false, bookDeps: false, bookProps: false, bookSheets: false, bookVBA: false,
  });
  console.log(`  xlsx loaded in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  const byIso3 = {}, byLoc = {}, iso3ToLoc = {};
  const ingest = (sheetName, yLo, yHi) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, raw: true });
    let hdr = 0;
    for (let i = 0; i < 25; i++) if ((rows[i] || []).some(c => typeof c === 'string' && /ISO3/i.test(c))) { hdr = i; break; }
    for (let i = hdr + 1; i < rows.length; i++) {
      const r = rows[i]; if (!r) continue;
      const type = r[COL.type], loc = r[COL.loc], year = r[COL.year];
      if (typeof year !== 'number' || year < yLo || year > yHi) continue;
      if (type !== 'Country/Area' && loc !== 900) continue;
      const get = (k) => { const v = r[COL[k]]; return typeof v === 'number' ? v : null; };
      const rec = record(get, year);
      const iso3 = r[COL.iso3];
      if (iso3) { (byIso3[iso3] = byIso3[iso3] || {})[year] = rec; iso3ToLoc[iso3] = loc; }
      (byLoc[loc] = byLoc[loc] || {})[year] = rec;
    }
  };
  ingest('Estimates', 1950, 2023);
  ingest('Medium variant', 2024, 2100);
  return { byIso3, byLoc, iso3ToLoc, source: 'xlsx' };
}

// ---- source: fallback CSV -------------------------------------------------
function parseCsv(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.length);
  const cols = lines[0].split(',');
  return lines.slice(1).map(line => {
    const cells = line.split(',');
    const o = {}; cols.forEach((c, i) => { o[c] = cells[i]; });
    return o;
  });
}
const num = (s) => (s === '' || s == null ? null : Number(s));
function extractFromFallback() {
  const rows = parseCsv(fs.readFileSync(FALLBACK_CSV, 'utf-8'));
  const bySlug = {}, byLoc = {}, slugToLoc = {};
  const map = { pop: 'pop', male: 'male', female: 'female', medianAge: 'medianAgeApprox',
    births: 'births', deaths: 'deaths', cbr: 'cbr', cdr: 'cdr', tfr: 'tfr', e0: 'e0',
    e0M: 'e0M', e0F: 'e0F', growthRatePct: 'growthRatePct', natChangeRate: 'natChangeRate',
    netMigrants: 'netMigrants', netMigrationRate: 'netMigrationRate',
    srbPer100: 'srbPer100', sexRatioPer100: 'sexRatioPer100' };
  const countKeys = new Set(['pop', 'male', 'female', 'births', 'deaths', 'netMigrants']);
  for (const row of rows) {
    const year = Number(row.year);
    if (!(year >= YEAR_MIN && year <= YEAR_MAX)) continue;
    const get = (k) => {
      const v = num(row[map[k]]); if (v == null) return null;
      return countKeys.has(k) ? v / 1000 : v; // CSV counts are persons; record() re-multiplies
    };
    const rec = record(get, year);
    const slug = row.slug === 'WORLD' ? 'world' : row.slug;
    (bySlug[slug] = bySlug[slug] || {})[year] = rec;
    slugToLoc[slug] = Number(row.unLocationCode);
    (byLoc[Number(row.unLocationCode)] = byLoc[Number(row.unLocationCode)] || {})[year] = rec;
  }
  return { bySlug, byLoc, slugToLoc, source: 'fallback' };
}

// ---- main -----------------------------------------------------------------
function main() {
  const countries = JSON.parse(fs.readFileSync(COUNTRIES_PATH, 'utf-8'));
  console.log(`countries: ${countries.length}`);

  let data;
  if (process.env.FORCE_FALLBACK) { console.log('FORCE_FALLBACK -> fallback CSV'); data = extractFromFallback(); }
  else { try { data = extractFromXlsx(); } catch (e) { console.error('xlsx failed -> fallback:', e.message); data = extractFromFallback(); } }
  const SOURCE = data.source;
  console.log(`source used: ${SOURCE}`);
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // Resolve each slug's year series + loc code.
  const seriesFor = (slug, iso3) => {
    if (SOURCE === 'xlsx') {
      if (data.byIso3[iso3]) return { years: data.byIso3[iso3], loc: data.iso3ToLoc[iso3] };
      if (EXPECTED_LOC[slug] && data.byLoc[EXPECTED_LOC[slug]]) return { years: data.byLoc[EXPECTED_LOC[slug]], loc: EXPECTED_LOC[slug] };
      return null;
    }
    if (data.bySlug[slug]) return { years: data.bySlug[slug], loc: data.slugToLoc[slug] };
    if (EXPECTED_LOC[slug] && data.byLoc[EXPECTED_LOC[slug]]) return { years: data.byLoc[EXPECTED_LOC[slug]], loc: EXPECTED_LOC[slug] };
    return null;
  };

  const missing = [], resolvedLoc = {};
  let totalBytes = 0, written = 0;
  for (const c of countries) {
    const s = seriesFor(c.slug, c.code);
    if (!s || Object.keys(s.years).length === 0) { missing.push(c.slug); resolvedLoc[c.slug] = null; continue; }
    resolvedLoc[c.slug] = s.loc;
    const out = { slug: c.slug, unLocationCode: s.loc, iso3: c.code, years: s.years };
    const json = JSON.stringify(out);
    fs.writeFileSync(path.join(OUT_DIR, `${c.slug}.json`), json);
    totalBytes += Buffer.byteLength(json); written++;
  }
  // world
  const worldYears = SOURCE === 'xlsx' ? data.byLoc[900] : data.bySlug['world'];
  if (!worldYears) throw new Error('World (900) not found');
  { const out = { slug: 'world', unLocationCode: 900, iso3: null, years: worldYears };
    const json = JSON.stringify(out); fs.writeFileSync(path.join(OUT_DIR, 'world.json'), json);
    totalBytes += Buffer.byteLength(json); }

  // confirm special location codes (stop on mismatch)
  const confirm = [];
  for (const [slug, want] of Object.entries(EXPECTED_LOC)) {
    const got = resolvedLoc[slug];
    confirm.push(`${slug}: loc ${got} (want ${want}) ${got === want ? 'OK' : 'MISMATCH'}`);
    if (got !== want) throw new Error(`location code mismatch for ${slug}: got ${got} want ${want}`);
  }
  console.log('special loc codes:\n  ' + confirm.join('\n  '));
  if (missing.length) console.error('MISSING series:', missing.join(', '));
  console.log(`wrote ${written}/${countries.length} country files + world.json`);
  console.log(`total wpp2024 bytes: ${totalBytes} (${(totalBytes / 1e6).toFixed(2)} MB)`);

  validate();
  if (missing.length) { console.error('STOP: missing series'); process.exitCode = 1; }
  console.log(`\nSOURCE_USED=${SOURCE}`);
}

function validate() {
  const rows = parseCsv(fs.readFileSync(EXPECTED_CSV, 'utf-8'));
  const near = (d) => (a, e) => Math.abs(a - e) <= d;
  const tol = {
    pop: (a, e) => Math.abs(a - e) <= Math.max(50, e * 0.00001),
    male: (a, e) => Math.abs(a - e) <= Math.max(50, e * 0.00001),
    female: (a, e) => Math.abs(a - e) <= Math.max(50, e * 0.00001),
    births: near(2), deaths: near(2),
    cbr: near(0.002), cdr: near(0.002), tfr: near(0.002),
    growthRatePct: near(0.002), natChangeRate: near(0.002), netMigrationRate: near(0.002),
    e0: near(0.01), e0M: near(0.01), e0F: near(0.01),
    srbPer100: near(0.1), netMigrants: near(50),
  };
  const fields = Object.keys(tol);
  let fail = 0, checks = 0; const failRows = []; const cache = {};
  for (const row of rows) {
    const slug = row.slug === 'WORLD' ? 'world' : row.slug;
    if (!cache[slug]) { try { cache[slug] = JSON.parse(fs.readFileSync(path.join(OUT_DIR, `${slug}.json`), 'utf-8')); } catch { cache[slug] = { years: {} }; } }
    const rec = cache[slug].years[row.year];
    if (!rec) { failRows.push(`${slug} ${row.year}: NO RECORD`); fail++; continue; }
    for (const f of fields) {
      const raw = row[f];
      if (raw === undefined || raw === '' || raw == null) continue;
      const e = Number(raw), a = rec[f]; checks++;
      if (a == null || !tol[f](a, e)) { fail++; failRows.push(`${slug} ${row.year} ${f}: got ${a} exp ${e}`); }
    }
  }
  console.log(`\n=== VALIDATION vs expected-indicators.csv ===`);
  console.log(`checks: ${checks}  failures: ${fail}`);
  failRows.slice(0, 80).forEach(f => console.log('  FAIL ' + f));
  if (fail) { console.error('VALIDATION FAILED — stop.'); process.exitCode = 1; }
  else console.log('ALL VALIDATION CHECKS PASSED');
}

main();
