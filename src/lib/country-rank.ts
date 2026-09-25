import { cache } from 'react';
import { loadCountries, loadCountryData } from './data-loader';
import { worldPopulation } from './world-population';

export interface RankTable {
  /** slug -> 1-based rank by population for the given year */
  ranks: Record<string, number>;
  /** number of ranked country entries (N) */
  N: number;
}

/**
 * Rank every country entry by population for `year`, descending, ties broken
 * by display name. Universe = all entries in countries.json (no World or
 * regional aggregates exist there). Entries without data for `year` (e.g.
 * Vatican City, which has no WPP series) are excluded, so N reflects the
 * countries actually ranked. Cached so the 194-file load happens once per
 * render pass and is shared across every country page.
 */
export const getRankTable = cache(async (year: number): Promise<RankTable> => {
  const countries = await loadCountries();
  const rows: { slug: string; name: string; pop: number }[] = [];
  await Promise.all(
    countries.map(async (c) => {
      try {
        const data = await loadCountryData(c.slug);
        const y = data.years[String(year)];
        if (y && typeof y.totalPopulation === 'number') {
          rows.push({ slug: c.slug, name: c.name, pop: y.totalPopulation });
        }
      } catch {
        /* country with no data file for this slug — skip */
      }
    })
  );
  rows.sort((a, b) => b.pop - a.pop || a.name.localeCompare(b.name));
  const ranks: Record<string, number> = {};
  rows.forEach((r, i) => {
    ranks[r.slug] = i + 1;
  });
  return { ranks, N: rows.length };
});

/** Population share of the world total for `year` (percent), or null if unknown. */
export function computeShare(population: number, year: number): number | null {
  const world = worldPopulation(year);
  if (!world || world <= 0) return null;
  return (population / world) * 100;
}
