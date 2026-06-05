/**
 * Pure math + formatting helpers for the "Population when you were born" tool.
 * No React, no fetch — safe to import on both server and client.
 */

export const MIN_BIRTH_YEAR = 1950;
export const MAX_BIRTH_YEAR = 2026;
export const REFERENCE_YEAR = 2026;
// Latest year for which we actually have population numbers in src/data/population/.
// 2026 is the user's "today" framing year; pop data tops out at 2025.
export const DATA_LATEST_YEAR = 2025;

export interface AgeBucket {
  ageRange: string;
  total: number;
}

export interface SlimPlace {
  slug: string;            // "world" or country slug
  name: string;
  flag: string;
  popsByYear: Record<string, number>;  // year string → total population
  ageGroupsLatest: AgeBucket[];        // age structure in DATA_LATEST_YEAR
}

export function clampBirthYear(y: number): number {
  if (Number.isNaN(y)) return 1990;
  if (y < MIN_BIRTH_YEAR) return MIN_BIRTH_YEAR;
  if (y > MAX_BIRTH_YEAR) return MAX_BIRTH_YEAR;
  return y;
}

export function currentAgeFromBirthYear(birthYear: number): number {
  return Math.max(0, REFERENCE_YEAR - birthYear);
}

export function popAtYear(p: SlimPlace, year: number): number | null {
  const v = p.popsByYear[String(year)];
  return typeof v === 'number' ? v : null;
}

// Parse "20-24" → [20, 24]; "100+" → [100, 119]; "0-4" → [0, 4].
function parseRange(range: string): [number, number] {
  if (range.endsWith('+')) {
    const lo = parseInt(range, 10);
    return [lo, lo + 19];
  }
  const [a, b] = range.split('-').map(n => parseInt(n, 10));
  return [a, b];
}

/**
 * Fraction of `place`'s current-year population older than `age`. Handles partial
 * buckets: if user is 36 (inside 35-39), only 37/38/39 of that bucket count as older.
 */
export function fractionOlderThan(place: SlimPlace, age: number): number {
  if (age <= 0) return 1;
  if (age >= 100) return 0;
  let total = 0;
  let older = 0;
  for (const ag of place.ageGroupsLatest) {
    const [lo, hi] = parseRange(ag.ageRange);
    const spanYears = hi - lo + 1;
    total += ag.total;
    if (age >= hi) {
      // Entire bucket is at or below user's age — none older.
      continue;
    }
    if (age < lo) {
      // Entire bucket is older than user.
      older += ag.total;
      continue;
    }
    // Partial: ages > userAge inside this bucket.
    const yearsOlder = hi - age;
    older += ag.total * (yearsOlder / spanYears);
  }
  if (total === 0) return 0;
  return older / total;
}

export function fractionYoungerOrSame(place: SlimPlace, age: number): number {
  return 1 - fractionOlderThan(place, age);
}

export interface WhenBornResult {
  place: SlimPlace;
  birthYear: number;
  currentAge: number;

  popAtBirth: number | null;
  popToday: number;
  growthAbsolute: number | null;       // popToday - popAtBirth
  growthPercent: number | null;        // % increase
  multiplier: number | null;           // popToday / popAtBirth

  popDayOfBirthYearDelta: number | null; // pop change during birth year (proxy for births minus deaths that year)

  fractionOlder: number;               // 0..1
  fractionYoungerOrSame: number;       // 0..1

  // Friendly tag based on multiplier
  growthCategory: 'shrunk' | 'stable' | 'grew' | 'doubled' | 'tripled' | 'more';
}

export function computeResult(place: SlimPlace, birthYear: number): WhenBornResult {
  const currentAge = currentAgeFromBirthYear(birthYear);
  const popAtBirth = popAtYear(place, birthYear);
  // Use latest data year ("today" in narrative ≈ 2025/2026; users won't distinguish).
  const popToday = popAtYear(place, DATA_LATEST_YEAR) ?? 0;

  const growthAbsolute = popAtBirth !== null ? popToday - popAtBirth : null;
  const growthPercent = popAtBirth !== null && popAtBirth > 0
    ? ((popToday - popAtBirth) / popAtBirth) * 100
    : null;
  const multiplier = popAtBirth !== null && popAtBirth > 0
    ? popToday / popAtBirth
    : null;

  const popBirthNext = popAtYear(place, birthYear + 1);
  const popDayOfBirthYearDelta =
    popAtBirth !== null && popBirthNext !== null ? popBirthNext - popAtBirth : null;

  const fractionOlder = fractionOlderThan(place, currentAge);
  const fractionYoungerOrSameVal = 1 - fractionOlder;

  const growthCategory: WhenBornResult['growthCategory'] =
    multiplier === null ? 'stable'
      : multiplier < 0.97 ? 'shrunk'
      : multiplier < 1.05 ? 'stable'
      : multiplier < 1.5 ? 'grew'
      : multiplier < 2.0 ? 'grew'
      : multiplier < 2.5 ? 'doubled'
      : multiplier < 3.5 ? 'tripled'
      : 'more';

  return {
    place,
    birthYear,
    currentAge,
    popAtBirth,
    popToday,
    growthAbsolute,
    growthPercent,
    multiplier,
    popDayOfBirthYearDelta,
    fractionOlder,
    fractionYoungerOrSame: fractionYoungerOrSameVal,
    growthCategory,
  };
}

// Big-number formatting tuned for population values.
export function fmtPop(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(decimals)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals === 2 ? 1 : decimals)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return Math.round(n).toLocaleString();
}

export function fmtPercent(n: number, decimals = 1): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(decimals)}%`;
}

export function fmtMultiplier(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `×${n.toFixed(decimals)}`;
}

export function fmtDeltaSign(n: number): string {
  if (n > 0) return '+';
  if (n < 0) return '−';
  return '±';
}

// Headline countries shown in the comparison grid at the bottom of the tool.
// Top 10 by current population + a "world" anchor.
export const HEADLINE_SLUGS = [
  'india',
  'china',
  'united-states',
  'indonesia',
  'pakistan',
  'nigeria',
  'brazil',
  'bangladesh',
  'russia',
  'mexico',
];
