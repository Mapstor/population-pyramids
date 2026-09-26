/**
 * Pure demographic threshold helpers — NO data-file imports, so this module is safe
 * to pull into client components (e.g. via calculations.ts) without dragging the
 * server data layer (wpp2024 / data-loader) into client bundles. (T4c)
 */
import type { YearData } from '@/types/population';

export const U15_BANDS = ['0-4', '5-9', '10-14'];
export const O65_BANDS = ['65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+'];
export const W15_64_BANDS = ['15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64'];
const MID_BANDS = ['15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49'];

export function shareOf(yd: YearData, bands: string[]): number {
  const t = yd.totalPopulation;
  if (!t) return 0;
  return (yd.ageGroups.filter((a) => bands.includes(a.ageRange ?? '')).reduce((s, a) => s + (a.total ?? 0), 0) / t) * 100;
}
export function workingShare(yd: YearData): number {
  return shareOf(yd, W15_64_BANDS);
}
export function dependencyRatio(yd: YearData): number {
  const w = shareOf(yd, W15_64_BANDS);
  return w > 0 ? ((shareOf(yd, U15_BANDS) + shareOf(yd, O65_BANDS)) / w) * 100 : 0;
}

/** Pyramid type from a single year's age bands (T5a rule). */
export function pyramidTypeOf(yd: YearData): 'expansive' | 'constrictive' | 'stationary' {
  const u15 = shareOf(yd, U15_BANDS);
  if (u15 >= 30) return 'expansive';
  const band04 = yd.ageGroups.find((a) => a.ageRange === '0-4')?.total ?? 0;
  const maxMid = Math.max(0, ...yd.ageGroups.filter((a) => MID_BANDS.includes(a.ageRange ?? '')).map((a) => a.total ?? 0));
  if (u15 < 20 && maxMid > 0 && band04 <= 0.85 * maxMid) return 'constrictive';
  return 'stationary';
}

/** Human label for a fertility level, by TFR. */
export function fertilityBand(tfr: number): string {
  if (tfr >= 4) return 'high fertility';
  if (tfr >= 2.1) return 'above replacement';
  if (tfr >= 1.3) return 'below replacement';
  return 'very low (lowest-low) fertility';
}
export function under15Band(pct: number): string {
  if (pct < 15) return 'very small';
  if (pct < 25) return 'moderate';
  if (pct < 35) return 'large';
  return 'very large';
}
export function over65Band(pct: number): string {
  if (pct < 7) return 'young';
  if (pct < 14) return 'ageing';
  if (pct < 21) return 'aged';
  return 'super-aged';
}
export function dependencyBand(ratio: number): string {
  if (ratio < 50) return 'low';
  if (ratio <= 65) return 'moderate';
  return 'high';
}
