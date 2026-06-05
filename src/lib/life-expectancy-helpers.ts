/**
 * Pure math + formatting helpers for the life-expectancy calculator.
 * No React, no fetch — safe to import on server and client.
 */

import type { LifeExpectancyData } from './life-expectancy-loader';

export type Sex = 'total' | 'male' | 'female';

// Slim shape we ship to the client island (full LifeExpectancyData has fields the
// calculator doesn't read; keeping the payload tight keeps page HTML smaller).
export interface SlimCountryLE {
  slug: string;
  name: string;
  flag: string;
  current: { year: number; total: number; male: number; female: number };
  historical: Array<{ year: number; total: number }>;
  projections: Array<{ year: number; total: number }>;
  rank: { position: number; outOf: number };
  worldAverage: { total: number; male: number; female: number };
}

export function toSlim(le: LifeExpectancyData, flag: string): SlimCountryLE {
  return {
    slug: le.slug,
    name: le.country,
    flag,
    current: le.current,
    historical: le.historical,
    projections: le.projections,
    rank: le.rank,
    worldAverage: le.worldAverage,
  };
}

// Year coverage we let the user enter. WPP estimates start 1950; older inputs
// would force us to fabricate the "when you were born" value.
export const MIN_BIRTH_YEAR = 1950;
export const REFERENCE_YEAR = 2026;
export const MAX_BIRTH_YEAR = REFERENCE_YEAR;

export function currentAgeFromBirthYear(birthYear: number): number {
  return Math.max(0, REFERENCE_YEAR - birthYear);
}

// Linear interpolation between two (year, value) points.
function lerp(x: number, x0: number, y0: number, x1: number, y1: number): number {
  if (x1 === x0) return y0;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

/**
 * Country-wide LE at any given year, interpolated across the sparse historical +
 * projection points. Falls back to nearest endpoint when out of range.
 *
 * Historical points carry only `total`; sex-specific lookups outside the current
 * year fall back to scaling by the current-year M:F ratio. Honest approximation
 * documented in prose — flagged because we don't have sex-specific historical.
 */
export function leAtYear(c: SlimCountryLE, year: number, sex: Sex = 'total'): number | null {
  // Merge historical + projections into one sorted (year, total) series.
  const series: Array<{ year: number; total: number }> = [...c.historical];
  // Ensure current year is in the series even if not in historical.
  if (!series.some(p => p.year === c.current.year)) {
    series.push({ year: c.current.year, total: c.current.total });
  }
  for (const p of c.projections) {
    if (!series.some(s => s.year === p.year)) series.push({ year: p.year, total: p.total });
  }
  series.sort((a, b) => a.year - b.year);

  if (series.length === 0) return null;
  if (year <= series[0].year) return adjustForSex(series[0].total, c, sex);
  if (year >= series[series.length - 1].year) return adjustForSex(series[series.length - 1].total, c, sex);

  // Find the bracketing pair and lerp.
  for (let i = 0; i < series.length - 1; i++) {
    const a = series[i], b = series[i + 1];
    if (year >= a.year && year <= b.year) {
      const v = lerp(year, a.year, a.total, b.year, b.total);
      return adjustForSex(v, c, sex);
    }
  }
  return null;
}

// Convert a total-LE value into M or F using the current-year ratio.
// Crude but data-honest: we don't have sex-specific historical/projection series.
function adjustForSex(total: number, c: SlimCountryLE, sex: Sex): number {
  if (sex === 'total') return total;
  const cur = c.current;
  if (!cur.total) return total;
  const ratio = sex === 'male' ? cur.male / cur.total : cur.female / cur.total;
  return total * ratio;
}

export interface CalculatorResult {
  country: SlimCountryLE;
  birthYear: number;
  sex: Sex;
  currentAge: number;
  expectedLifespan: number;        // Country LE today, for the chosen sex
  leAtBirth: number | null;        // Country LE in the user's birth year
  deltaSinceBirth: number | null;  // expectedLifespan - leAtBirth
  projectedAt65: number | null;    // Projected LE in (birthYear + 65), if in range
  sexGapYears: number;             // F - M, current year
  vsWorld: number;                 // expectedLifespan - world average (matching sex)
  worldAvg: number;
  projectedDeathYear: number;      // birthYear + expectedLifespan, rounded
}

export function computeResult(c: SlimCountryLE, birthYear: number, sex: Sex): CalculatorResult {
  const expectedLifespan = sex === 'total' ? c.current.total : sex === 'male' ? c.current.male : c.current.female;
  const leAtBirth = leAtYear(c, birthYear, sex);
  const deltaSinceBirth = leAtBirth !== null ? expectedLifespan - leAtBirth : null;
  const age = currentAgeFromBirthYear(birthYear);
  const yearAt65 = birthYear + 65;
  const projectedAt65 = age < 65 ? leAtYear(c, yearAt65, sex) : null;
  const worldAvg = sex === 'total' ? c.worldAverage.total : sex === 'male' ? c.worldAverage.male : c.worldAverage.female;

  return {
    country: c,
    birthYear,
    sex,
    currentAge: age,
    expectedLifespan,
    leAtBirth,
    deltaSinceBirth,
    projectedAt65,
    sexGapYears: c.current.female - c.current.male,
    vsWorld: expectedLifespan - worldAvg,
    worldAvg,
    projectedDeathYear: Math.round(birthYear + expectedLifespan),
  };
}

// Formatting helpers used in JSX.
export function fmtYears(v: number, decimals = 1): string {
  return v.toFixed(decimals);
}

export function fmtDelta(v: number, decimals = 1): string {
  const sign = v > 0 ? '+' : v < 0 ? '' : '±';
  return `${sign}${v.toFixed(decimals)}`;
}

export function ordinalSuffix(n: number): string {
  const m100 = n % 100;
  if (m100 >= 11 && m100 <= 13) return 'th';
  const m10 = n % 10;
  if (m10 === 1) return 'st';
  if (m10 === 2) return 'nd';
  if (m10 === 3) return 'rd';
  return 'th';
}

export function rankLabel(rank: number, outOf: number): string {
  return `#${rank}${ordinalSuffix(rank)} of ${outOf}`;
}

// Bounded clamp for birth-year input.
export function clampBirthYear(y: number): number {
  if (Number.isNaN(y)) return 1990;
  if (y < MIN_BIRTH_YEAR) return MIN_BIRTH_YEAR;
  if (y > MAX_BIRTH_YEAR) return MAX_BIRTH_YEAR;
  return y;
}
