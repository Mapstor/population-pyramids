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
import 'server-only';
import { cache } from 'react';
import fs from 'node:fs';
import path from 'node:path';
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

// Server-only file reads: read + parse each wpp2024 file straight off disk and memoize
// at module scope, so a file is parsed once per process (not once per page). This avoids
// the ~196 dynamic-import() webpack chunks the old `await import()` produced and keeps the
// data out of every client bundle. (T4c) Files are traced via next.config outputFileTracing.
const WPP_DIR = path.join(process.cwd(), 'src', 'data', 'wpp2024');
const wppCache = new Map<string, WppData | null>();

/** Load one slug's WPP 2024 series ('world' for the world aggregate). Memoized per process. */
export async function getWpp(slug: string): Promise<WppData | null> {
  if (wppCache.has(slug)) return wppCache.get(slug) ?? null;
  let data: WppData | null = null;
  try {
    data = JSON.parse(fs.readFileSync(path.join(WPP_DIR, `${slug}.json`), 'utf8')) as WppData;
  } catch {
    data = null;
  }
  wppCache.set(slug, data);
  return data;
}

/** Load the world WPP 2024 series (UN world totals, 1950–2100). */
export async function getWorld(): Promise<WppData> {
  return (await getWpp('world')) as WppData;
}

/** One indicator value for slug/field/year, or null if the slug/year/field is absent. */
export async function value(slug: string, field: WppField, year: number): Promise<number | null> {
  const d = await getWpp(slug);
  const y = d?.years[String(year)];
  const v = y ? y[field] : null;
  return typeof v === 'number' ? v : null;
}

// Precomputed rankings (scripts/build-wpp-ranks.js): read once instead of loading all
// 194 wpp2024 + population files per page during static generation. 15 KB, server-side.
import ranks2026 from '@/data/wpp2024/ranks-2026.json';
export interface PrecomputedRanks {
  referenceYear: number;
  N: number;
  bySlug: Record<string, Record<string, number | null>>;
  world: Record<string, number> | null;
}
const PRECOMPUTED: Record<number, PrecomputedRanks> = { 2026: ranks2026 as unknown as PrecomputedRanks };
/** The precomputed ranks table for a year (null if not precomputed). */
export function getPrecomputedRanks(year: number): PrecomputedRanks | null {
  return PRECOMPUTED[year] ?? null;
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
  // Fast path: precomputed desc rankings (vatican-only exclusion) for known fields.
  const pre = PRECOMPUTED[year];
  if (pre && direction === 'desc' && !opts?.exclude) {
    const sample = pre.bySlug[Object.keys(pre.bySlug)[0]] ?? {};
    if (field in sample) {
      const rank: Record<string, number> = {};
      for (const [slug, m] of Object.entries(pre.bySlug)) {
        const r = m[field];
        if (r != null) rank[slug] = r;
      }
      return { rank, N: pre.N };
    }
  }
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
