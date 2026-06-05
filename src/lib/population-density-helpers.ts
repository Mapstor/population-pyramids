/**
 * Pure math + formatting helpers for the population-density calculator.
 * No React, no fetch — safe on server and client.
 */

export const KM2_TO_MI2 = 0.386102;            // 1 km² = 0.386102 mi²
export const DENSITY_REFERENCE_YEAR = 2025;
export const MIN_YEAR = 1950;
export const MAX_YEAR = 2025;

export interface SlimDensityPlace {
  slug: string;
  name: string;
  flag: string;
  region: string;
  areaKm2: number;
  popLatest: number;
  densityKm2: number;       // people per km²
  densityMi2: number;       // people per square mile
  popsByYear: Record<string, number>; // for density-over-time
}

export function densityOf(pop: number, areaKm2: number): number {
  return areaKm2 > 0 ? pop / areaKm2 : 0;
}

export function densityAtYear(p: SlimDensityPlace, year: number): number | null {
  const pop = p.popsByYear[String(year)];
  if (typeof pop !== 'number' || p.areaKm2 <= 0) return null;
  return pop / p.areaKm2;
}

export interface DensityResult {
  place: SlimDensityPlace;
  compare?: SlimDensityPlace;
  // Ratio = primary density / compare density
  ratio: number | null;
  // Hypothetical pops swapping densities
  popIfCompareDensity: number | null;     // primary area × compare density
  popIfPrimaryDensity: number | null;     // compare area × primary density
  rank: number;
  outOf: number;
  densityOverTime: Array<{ year: number; density: number }>;
}

export function computeResult(
  place: SlimDensityPlace,
  compare: SlimDensityPlace | undefined,
  sortedAll: SlimDensityPlace[]
): DensityResult {
  const rank = sortedAll.findIndex(p => p.slug === place.slug) + 1;
  const outOf = sortedAll.length;

  const ratio = compare && compare.densityKm2 > 0 ? place.densityKm2 / compare.densityKm2 : null;
  const popIfCompareDensity = compare ? place.areaKm2 * compare.densityKm2 : null;
  const popIfPrimaryDensity = compare ? compare.areaKm2 * place.densityKm2 : null;

  // Density over time at decade intervals — for the trend chart
  const densityOverTime: Array<{ year: number; density: number }> = [];
  for (const y of [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025]) {
    const d = densityAtYear(place, y);
    if (d !== null) densityOverTime.push({ year: y, density: d });
  }

  return {
    place,
    compare,
    ratio,
    popIfCompareDensity,
    popIfPrimaryDensity,
    rank,
    outOf,
    densityOverTime,
  };
}

// ─── Formatters ──────────────────────────────────────────────────────────────

export function fmtDensity(d: number): string {
  if (!Number.isFinite(d) || d <= 0) return '—';
  if (d >= 1000) return Math.round(d).toLocaleString();
  if (d >= 10) return d.toFixed(1);
  return d.toFixed(2);
}

export function fmtPop(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return Math.round(n).toLocaleString();
}

export function fmtArea(km2: number): string {
  if (!Number.isFinite(km2) || km2 <= 0) return '—';
  if (km2 >= 1_000_000) return `${(km2 / 1_000_000).toFixed(2)}M km²`;
  if (km2 >= 1_000) return `${Math.round(km2).toLocaleString()} km²`;
  return `${km2.toFixed(1)} km²`;
}

export function fmtRatio(r: number): string {
  if (!Number.isFinite(r) || r <= 0) return '—';
  if (r >= 100) return `${Math.round(r).toLocaleString()}×`;
  if (r >= 10) return `${r.toFixed(1)}×`;
  if (r >= 1) return `${r.toFixed(2)}×`;
  // less than 1
  return `${r.toFixed(3)}×`;
}

export function rankLabel(rank: number, outOf: number): string {
  return `#${rank} of ${outOf}`;
}

export function categoryFor(density: number): { label: string; color: string } {
  if (density >= 1000) return { label: 'Extremely dense (city-state)', color: '#4c1d95' };
  if (density >= 500)  return { label: 'Very dense', color: '#6d28d9' };
  if (density >= 200)  return { label: 'Dense', color: '#7c3aed' };
  if (density >= 100)  return { label: 'Moderate', color: '#8b5cf6' };
  if (density >= 50)   return { label: 'Spread out', color: '#a78bfa' };
  if (density >= 10)   return { label: 'Sparse', color: '#c4b5fd' };
  return { label: 'Very sparse', color: '#ddd6fe' };
}
