/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * T4a STEP 2: fold the WPP 2024 layer into src/data/population/<slug>.json.
 *
 *  1. Replace micronesia's years with the FSM (code 583) series 1950–2030;
 *     keep slug "micronesia", set countryCode "FSM".
 *  2. Add years 2026–2030 (5-year bands) to every other country from
 *     age-bands-2026-2030.json (194 countries; micronesia already covered).
 *  3. Overwrite totalPopulation / malePopulation / femalePopulation / medianAge
 *     in EVERY year of EVERY population file with the Step-1 UN values from
 *     src/data/wpp2024/<slug>.json (1 July totals + UN median age).
 *     vatican-city: only its existing years are overwritten (no years added).
 *  ageGroups are left unchanged.
 *
 * Usage: node scripts/apply-wpp2024-to-population.js
 */
const fs = require('fs');
const path = require('path');
const POP = path.join(__dirname, '..', 'src', 'data', 'population');
const WPP = path.join(__dirname, '..', 'src', 'data', 'wpp2024');
const countries = require('../src/data/countries.json');
const ageBands = JSON.parse(fs.readFileSync('/workspace/t4-data/age-bands-2026-2030.json', 'utf8'));
const micro = JSON.parse(fs.readFileSync('/workspace/t4-data/micronesia-fsm-1950-2030.json', 'utf8'));

const round1 = (v) => (v == null ? null : Math.round(v * 10) / 10);
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJson = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
const clone = (o) => JSON.parse(JSON.stringify(o));

let addedYears = 0, overwritten = 0, filesTouched = 0;
const warnings = [];

// 1. micronesia: full FSM replacement
{
  const p = path.join(POP, 'micronesia.json');
  const f = readJson(p);
  f.slug = 'micronesia';
  f.countryCode = 'FSM';
  f.years = clone(micro.years);
  writeJson(p, f);
  console.log(`micronesia: replaced years -> ${Object.keys(f.years).length} (1950–2030), countryCode=FSM`);
}

// 2. add 2026–2030 from age bands (micronesia already covered; vatican not present)
for (const slug of Object.keys(ageBands)) {
  if (slug === 'micronesia') continue;
  const p = path.join(POP, `${slug}.json`);
  if (!fs.existsSync(p)) { warnings.push(`no population file for age-band slug ${slug}`); continue; }
  const f = readJson(p);
  for (const y of ['2026', '2027', '2028', '2029', '2030']) {
    const yr = ageBands[slug].years[y];
    if (yr) { f.years[y] = clone(yr); addedYears++; }
  }
  writeJson(p, f);
}

// 3. overwrite UN totals + median age for every year of every population file
for (const c of countries) {
  const p = path.join(POP, `${c.slug}.json`);
  if (!fs.existsSync(p)) { warnings.push(`no population file for ${c.slug}`); continue; }
  const w = (() => { try { return readJson(path.join(WPP, `${c.slug}.json`)); } catch { return null; } })();
  if (!w) { warnings.push(`no wpp2024 file for ${c.slug}`); continue; }
  const f = readJson(p);
  let touched = false;
  for (const y of Object.keys(f.years)) {
    const wy = w.years[y];
    if (!wy) { warnings.push(`${c.slug}: no wpp year ${y}`); continue; }
    f.years[y].totalPopulation = wy.pop;
    f.years[y].malePopulation = wy.male;
    f.years[y].femalePopulation = wy.female;
    f.years[y].medianAge = round1(wy.medianAge);
    overwritten++; touched = true;
  }
  if (touched) { writeJson(p, f); filesTouched++; }
}

console.log(JSON.stringify({ addedYears, overwritten, filesTouched, warnings: warnings.length }, null, 0));
if (warnings.length) warnings.slice(0, 40).forEach((w) => console.warn('  WARN', w));
