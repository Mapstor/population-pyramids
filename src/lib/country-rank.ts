import { cache } from 'react';
import { worldPopulation } from './world-population';
import { rankBy } from './wpp2024';

export interface RankTable {
  /** slug -> 1-based rank by population for the given year */
  ranks: Record<string, number>;
  /** number of ranked country entries (N) */
  N: number;
}

/**
 * Rank every country by population for `year`, descending, ties broken by
 * display name. Source is the WPP 2024 layer (getWpp pop via rankBy), so the
 * ranking matches the UN 1 July totals shown on the pages. Vatican City is
 * excluded (RANK_EXCLUDED in wpp2024), so N is the number of countries
 * actually ranked (194). Cached per year.
 */
export const getRankTable = cache(async (year: number): Promise<RankTable> => {
  const { rank, N } = await rankBy('pop', year, { direction: 'desc' });
  return { ranks: rank, N };
});

/** Population share of the world total for `year` (percent), or null if unknown. */
export function computeShare(population: number, year: number): number | null {
  const world = worldPopulation(year);
  if (!world || world <= 0) return null;
  return (population / world) * 100;
}
