/**
 * Pure helpers for the population-projection page.
 * Reads the per-country JSON files at src/data/population-projections/<slug>.json
 * (produced by scripts/extract-population-projections.js).
 *
 * All population values are stored in *thousands* (UN WPP source format);
 * helpers expose them either as thousands or scaled to absolute when needed.
 */

export const PROJECTION_MIN_YEAR = 1950;
export const PROJECTION_MAX_YEAR = 2100;
export const PROJECTION_REFERENCE_YEAR = 2025;

export interface ProjectionRecord {
  countryCode: string;
  countryName: string;
  slug: string;
  source: string;
  lastUpdated: string;
  estimateYears?: [number, number];
  projectionYears?: [number, number];
  peakYear: number | null;
  peakPopulationThousands: number;
  pop2025Thousands: number | null;
  pop2050Thousands: number | null;
  pop2100Thousands: number | null;
  values: Record<string, number>; // year → population in thousands
}

export interface SlimProjection {
  slug: string;
  name: string;
  flag: string;
  region: string;
  pop2025: number;          // absolute people (× 1000 already applied)
  pop2050: number;
  pop2100: number;
  peakYear: number | null;
  peakPopulation: number;   // absolute
  values: Record<string, number>; // year → absolute people (× 1000 already applied)
}

export function toSlim(rec: ProjectionRecord, flag: string, region: string): SlimProjection {
  const values: Record<string, number> = {};
  for (const [y, v] of Object.entries(rec.values)) {
    values[y] = v * 1000;
  }
  return {
    slug: rec.slug,
    name: rec.countryName,
    flag,
    region,
    pop2025: (rec.pop2025Thousands ?? 0) * 1000,
    pop2050: (rec.pop2050Thousands ?? 0) * 1000,
    pop2100: (rec.pop2100Thousands ?? 0) * 1000,
    peakYear: rec.peakYear,
    peakPopulation: rec.peakPopulationThousands * 1000,
    values,
  };
}

export function clampYear(y: number): number {
  if (Number.isNaN(y)) return 2050;
  if (y < PROJECTION_MIN_YEAR) return PROJECTION_MIN_YEAR;
  if (y > PROJECTION_MAX_YEAR) return PROJECTION_MAX_YEAR;
  return y;
}

export function popAtYear(p: SlimProjection, year: number): number | null {
  const v = p.values[String(year)];
  return typeof v === 'number' ? v : null;
}

export interface ProjectionResult {
  place: SlimProjection;
  year: number;
  popAtYear: number | null;
  popToday: number;         // 2025
  delta: number | null;
  growthPercent: number | null;
  peakYear: number | null;
  peakPopulation: number;
  yearsToOrFromPeak: number | null;   // negative = already past peak
  hasPeaked: boolean;
}

export function computeResult(place: SlimProjection, targetYear: number, referenceYear = PROJECTION_REFERENCE_YEAR): ProjectionResult {
  const popY = popAtYear(place, targetYear);
  const popToday = popAtYear(place, referenceYear) ?? place.pop2025;
  const delta = popY !== null ? popY - popToday : null;
  const growthPercent = popY !== null && popToday > 0 ? ((popY - popToday) / popToday) * 100 : null;
  const hasPeaked = place.peakYear !== null && place.peakYear <= referenceYear;
  const yearsToOrFromPeak = place.peakYear !== null ? place.peakYear - referenceYear : null;
  return {
    place,
    year: targetYear,
    popAtYear: popY,
    popToday,
    delta,
    growthPercent,
    peakYear: place.peakYear,
    peakPopulation: place.peakPopulation,
    yearsToOrFromPeak,
    hasPeaked,
  };
}

// ─── Formatters ──────────────────────────────────────────────────────────────

export function fmtPop(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(decimals)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return Math.round(n).toLocaleString();
}

export function fmtSign(n: number): string {
  return n > 0 ? '+' : n < 0 ? '−' : '±';
}

export function fmtPercent(n: number, decimals = 1): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(decimals)}%`;
}

// Categorize trajectory for badges
export type Trajectory = 'past-peak' | 'rapid-growth' | 'moderate-growth' | 'plateauing';

export function trajectoryFor(p: SlimProjection, currentYear = PROJECTION_REFERENCE_YEAR): Trajectory {
  // Compare pop today vs pop in 2050
  const today = popAtYear(p, currentYear) ?? p.pop2025;
  const future = popAtYear(p, 2050) ?? p.pop2050;
  if (today === 0) return 'plateauing';
  if (p.peakYear !== null && p.peakYear <= currentYear) return 'past-peak';
  const growth = (future - today) / today;
  if (growth >= 0.5) return 'rapid-growth';
  if (growth >= 0.10) return 'moderate-growth';
  return 'plateauing';
}
