/**
 * WPP 2024 indicator data layer (T4a).
 *
 * Reads the per-slug files in src/data/wpp2024/ (built by scripts/build-wpp2024.js
 * from the UN World Population Prospects 2024 xlsx). Every field is a UN
 * indicator for 1 July, years 1950–2100; counts are whole persons. `projected`
 * is true for 2024 and later (medium variant).
 *
 * This is the single source for population rank/share and world totals. It does
 * NOT yet feed the births, fertility or life-expectancy sections — that is T4b.
 */
import { cache } from 'react';
import { loadCountries } from './data-loader';

export type WppField =
  | 'pop' | 'male' | 'female' | 'medianAge'
  | 'births' | 'deaths' | 'cbr' | 'cdr' | 'tfr'
  | 'e0' | 'e0M' | 'e0F'
  | 'growthRatePct' | 'natChangeRate' | 'netMigrants' | 'netMigrationRate'
  | 'srbPer100' | 'sexRatioPer100';

export interface WppYear {
  pop: number;
  male: number;
  female: number;
  medianAge: number | null;
  births: number | null;
  deaths: number | null;
  cbr: number | null;
  cdr: number | null;
  tfr: number | null;
  e0: number | null;
  e0M: number | null;
  e0F: number | null;
  growthRatePct: number | null;
  natChangeRate: number | null;
  netMigrants: number | null;
  netMigrationRate: number | null;
  srbPer100: number | null;
  sexRatioPer100: number | null;
  projected: boolean;
}

export interface WppData {
  slug: string;
  unLocationCode: number | null;
  iso3: string | null;
  years: Record<string, WppYear>;
}

/** Country slugs that never appear in rankings. */
export const RANK_EXCLUDED = ['vatican-city'] as const;

/** Load one slug's WPP 2024 series ('world' for the world aggregate). Cached per slug. */
export const getWpp = cache(async (slug: string): Promise<WppData | null> => {
  try {
    const data = await import(`@/data/wpp2024/${slug}.json`);
    return data.default as WppData;
  } catch {
    return null;
  }
});

/** Load the world WPP 2024 series (UN world totals, 1950–2100). */
export const getWorld = cache(async (): Promise<WppData> => {
  const data = await import('@/data/wpp2024/world.json');
  return data.default as WppData;
});

/** One indicator value for slug/field/year, or null if the slug/year/field is absent. */
export async function value(slug: string, field: WppField, year: number): Promise<number | null> {
  const d = await getWpp(slug);
  const y = d?.years[String(year)];
  const v = y ? y[field] : null;
  return typeof v === 'number' ? v : null;
}

export interface RankResult {
  /** slug -> 1-based rank */
  rank: Record<string, number>;
  /** number of ranked countries */
  N: number;
}

/**
 * Rank countries by `field` for `year`.
 *
 * direction (default 'desc'):
 *   'desc' — rank 1 is the HIGHEST value. Use for `pop`, `tfr`, `e0`,
 *            `medianAge` (biggest population / longest life / oldest first).
 *   'asc'  — rank 1 is the LOWEST value.
 *
 * vatican-city is always excluded (RANK_EXCLUDED); opts.exclude drops more
 * slugs. Countries with no value for that field/year are dropped, so N is the
 * count actually ranked. Ties break by country display name.
 */
export const rankBy = cache(async (
  field: WppField,
  year: number,
  opts?: { direction?: 'asc' | 'desc'; exclude?: string[] }
): Promise<RankResult> => {
  const direction = opts?.direction ?? 'desc';
  const excluded = new Set<string>([...RANK_EXCLUDED, ...(opts?.exclude ?? [])]);
  const countries = await loadCountries();
  const rows: { slug: string; name: string; v: number }[] = [];
  await Promise.all(
    countries.map(async (c) => {
      if (excluded.has(c.slug)) return;
      const v = await value(c.slug, field, year);
      if (typeof v === 'number') rows.push({ slug: c.slug, name: c.name, v });
    })
  );
  rows.sort((a, b) => (direction === 'desc' ? b.v - a.v : a.v - b.v) || a.name.localeCompare(b.name));
  const rank: Record<string, number> = {};
  rows.forEach((r, i) => {
    rank[r.slug] = i + 1;
  });
  return { rank, N: rows.length };
});
