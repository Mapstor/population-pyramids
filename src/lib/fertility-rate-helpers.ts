/**
 * Pure math + formatting helpers for the fertility-rate calculator.
 * No React, no fetch — safe on server and client.
 */

export const MIN_BIRTH_YEAR = 1965;     // earliest historical fertility data point
export const MAX_BIRTH_YEAR = 2026;
export const REFERENCE_YEAR = 2026;
export const LATEST_DATA_YEAR = 2024;
export const REPLACEMENT_TFR = 2.1;

export interface FertilityPoint {
  year: number;
  tfr: number;
  cbr?: number;
}

// Slim per-country payload shipped to the client island.
export interface SlimFertility {
  slug: string;
  name: string;
  flag: string;
  region: string;
  // Latest available values
  currentTFR: number;
  currentCBR: number;
  currentYear: number;
  // Series, sorted ascending by year
  historical: FertilityPoint[];       // 1965-2023 from data
  projections: FertilityPoint[];      // 2030, 2050
  // Pre-computed
  belowReplacementSince: number | null;
  // Globally computed ranks (filled in by the server before serialization)
  rankByTFR: number;     // 1 = highest TFR (e.g. Niger), N = lowest (e.g. Korea)
  outOf: number;
}

// World total fertility rate series (UN WPP 2024 published — primary source).
// We don't have a per-world fertility file in the data dir, so we hardcode
// authoritative figures here and surface "World" as a virtual option.
export const WORLD_TFR_POINTS: FertilityPoint[] = [
  { year: 1965, tfr: 5.05, cbr: 34.2 },
  { year: 1970, tfr: 4.83, cbr: 33.0 },
  { year: 1980, tfr: 3.58, cbr: 27.5 },
  { year: 1990, tfr: 3.16, cbr: 25.1 },
  { year: 2000, tfr: 2.69, cbr: 21.9 },
  { year: 2010, tfr: 2.51, cbr: 20.0 },
  { year: 2020, tfr: 2.32, cbr: 17.5 },
  { year: 2024, tfr: 2.25, cbr: 16.9 },
];
export const WORLD_TFR_PROJECTIONS: FertilityPoint[] = [
  { year: 2030, tfr: 2.16, cbr: 16.2 },
  { year: 2050, tfr: 2.10, cbr: 13.7 },
];

export function clampBirthYear(y: number): number {
  if (Number.isNaN(y)) return 1990;
  if (y < MIN_BIRTH_YEAR) return MIN_BIRTH_YEAR;
  if (y > MAX_BIRTH_YEAR) return MAX_BIRTH_YEAR;
  return y;
}

function lerp(x: number, x0: number, y0: number, x1: number, y1: number): number {
  if (x1 === x0) return y0;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

// Look up TFR (or CBR) at any year by interpolating across the sparse points.
// Returns null only if the country has no data at all.
function valueAtYear(
  hist: FertilityPoint[],
  proj: FertilityPoint[],
  year: number,
  key: 'tfr' | 'cbr'
): number | null {
  const series = [...hist, ...proj].sort((a, b) => a.year - b.year);
  const validSeries = series.filter(p => (key === 'tfr' ? p.tfr : p.cbr) !== undefined);
  if (validSeries.length === 0) return null;
  if (year <= validSeries[0].year) return validSeries[0][key] ?? null;
  if (year >= validSeries[validSeries.length - 1].year) return validSeries[validSeries.length - 1][key] ?? null;
  for (let i = 0; i < validSeries.length - 1; i++) {
    const a = validSeries[i], b = validSeries[i + 1];
    if (year >= a.year && year <= b.year) {
      return lerp(year, a.year, a[key]!, b.year, b[key]!);
    }
  }
  return null;
}

export function tfrAtYear(c: SlimFertility, year: number): number | null {
  return valueAtYear(c.historical, c.projections, year, 'tfr');
}
export function cbrAtYear(c: SlimFertility, year: number): number | null {
  return valueAtYear(c.historical, c.projections, year, 'cbr');
}

export interface FertilityResult {
  country: SlimFertility;
  birthYear: number;
  tfrAtBirth: number | null;
  tfrToday: number;
  tfrDelta: number | null;
  cbrAtBirth: number | null;
  cbrToday: number;
  cbrDelta: number | null;
  belowReplacement: boolean;
  belowReplacementSince: number | null;
  yearsBelowReplacement: number | null;   // null if never below
  bornBeforeOrAfterCrossing: 'before' | 'after' | 'never' | null;
  vsReplacement: number;                  // currentTFR - 2.1
  vsWorld: number;                        // currentTFR - world 2024 TFR
}

const WORLD_2024_TFR = WORLD_TFR_POINTS[WORLD_TFR_POINTS.length - 1].tfr; // 2.25

export function computeFertilityResult(c: SlimFertility, birthYear: number): FertilityResult {
  const tfrAtBirth = tfrAtYear(c, birthYear);
  const tfrToday = c.currentTFR;
  const tfrDelta = tfrAtBirth !== null ? tfrToday - tfrAtBirth : null;

  const cbrAtBirth = cbrAtYear(c, birthYear);
  const cbrToday = c.currentCBR;
  const cbrDelta = cbrAtBirth !== null ? cbrToday - cbrAtBirth : null;

  const belowReplacement = tfrToday < REPLACEMENT_TFR;
  const crossing = c.belowReplacementSince;
  const yearsBelowReplacement = crossing !== null ? Math.max(0, REFERENCE_YEAR - crossing) : null;

  let bornBeforeOrAfterCrossing: FertilityResult['bornBeforeOrAfterCrossing'] = null;
  if (crossing === null) bornBeforeOrAfterCrossing = 'never';
  else if (birthYear < crossing) bornBeforeOrAfterCrossing = 'before';
  else bornBeforeOrAfterCrossing = 'after';

  return {
    country: c,
    birthYear,
    tfrAtBirth,
    tfrToday,
    tfrDelta,
    cbrAtBirth,
    cbrToday,
    cbrDelta,
    belowReplacement,
    belowReplacementSince: crossing,
    yearsBelowReplacement,
    bornBeforeOrAfterCrossing,
    vsReplacement: tfrToday - REPLACEMENT_TFR,
    vsWorld: tfrToday - WORLD_2024_TFR,
  };
}

// Formatters
export function fmtTFR(v: number, decimals = 2): string {
  return v.toFixed(decimals);
}
export function fmtCBR(v: number, decimals = 1): string {
  return v.toFixed(decimals);
}
export function fmtDeltaTFR(v: number): string {
  const sign = v > 0 ? '+' : v < 0 ? '−' : '±';
  return `${sign}${Math.abs(v).toFixed(2)}`;
}
export function fmtDeltaCBR(v: number): string {
  const sign = v > 0 ? '+' : v < 0 ? '−' : '±';
  return `${sign}${Math.abs(v).toFixed(1)}`;
}

// Ordinal label, e.g. "#42 of 194"
export function rankLabel(rank: number, outOf: number, ascending = false): string {
  return `#${rank} of ${outOf}`;
}

// Lookup helpers used by SSR sections.
export function sortByTFR(places: SlimFertility[], direction: 'asc' | 'desc'): SlimFertility[] {
  return [...places].sort((a, b) =>
    direction === 'asc' ? a.currentTFR - b.currentTFR : b.currentTFR - a.currentTFR
  );
}
