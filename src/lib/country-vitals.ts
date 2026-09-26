/**
 * T4b: UN WPP 2024 "vitals" for a country at the site reference year (2026).
 *
 * Single server-side source for the births, fertility and life-expectancy
 * sections on country pages. It reshapes the WPP 2024 layer (src/data/wpp2024)
 * into the shapes the existing sections already consume — so those sections show
 * UN births / TFR / e0 for the reference year instead of computed or World-Bank
 * figures — plus a births payload the BirthStatistics component renders directly.
 *
 * Estimates are 1950–2023; 2024+ are medium-variant projections (`projected`).
 */
import { cache } from 'react';
import { getWpp, getWorld, rankBy, type WppData } from '@/lib/wpp2024';
import { REFERENCE_YEAR } from '@/lib/site-meta';
import type { FertilityData } from '@/lib/fertility-loader';
import type { LifeExpectancyData } from '@/lib/life-expectancy-loader';

const REPLACEMENT_LEVEL = 2.1;
const FIRST_ESTIMATE_YEAR = 1950;
const LAST_ESTIMATE_YEAR = 2023; // 2024+ are projections

export interface BirthsSeriesRow {
  year: number;
  births: number | null;
  cbr: number | null;
  tfr: number | null;
  projected: boolean;
}

export interface BirthsPayload {
  referenceYear: number;
  births: number;
  crudeBirthRate: number;
  tfr: number;
  /** Annual series 1950 → reference year for the chart and the recent-years table. */
  series: BirthsSeriesRow[];
  /** Peak crude birth rate over the estimate window (1950–2023). */
  peakCbr: { year: number; value: number } | null;
  /** Peak annual births over the estimate window (1950–2023). */
  peakBirths: { year: number; value: number } | null;
  /** World figures for the reference year (from world.json). */
  world: { births: number; birthsPerDay: number; crudeBirthRate: number };
}

export interface CountryVitals {
  referenceYear: number;
  /** Full FertilityData shape (UN-sourced) for the fertility section + FertilityChart. */
  fertility: FertilityData | null;
  /** Full LifeExpectancyData shape (UN-sourced) for the LifeExpectancySection. */
  lifeExpectancy: LifeExpectancyData | null;
  /** UN births payload for the BirthStatistics component. */
  births: BirthsPayload | null;
  /** UN world median age for the reference year (from world.json), for comparison cards. */
  worldMedianAge: number | null;
}

const yr = (d: WppData | null, y: number) => (d ? d.years[String(y)] : undefined);

export const getCountryVitals = cache(
  async (slug: string, countryName: string): Promise<CountryVitals> => {
    const year = REFERENCE_YEAR;
    const [data, world, tfrRank, e0Rank] = await Promise.all([
      getWpp(slug),
      getWorld(),
      rankBy('tfr', year, { direction: 'desc' }),
      rankBy('e0', year, { direction: 'desc' }),
    ]);
    const cur = yr(data, year);
    const w = yr(world, year);

    // ---- births payload ----
    let births: BirthsPayload | null = null;
    if (data && cur && w && typeof cur.births === 'number') {
      const years = Object.keys(data.years)
        .map(Number)
        .filter((y) => y >= FIRST_ESTIMATE_YEAR && y <= year)
        .sort((a, b) => a - b);
      const series: BirthsSeriesRow[] = years.map((y) => {
        const d = data.years[String(y)];
        return { year: y, births: d.births, cbr: d.cbr, tfr: d.tfr, projected: y >= 2024 };
      });
      let peakCbr: BirthsPayload['peakCbr'] = null;
      let peakBirths: BirthsPayload['peakBirths'] = null;
      for (const row of series) {
        if (row.year > LAST_ESTIMATE_YEAR) continue; // peaks come from estimates only
        if (row.cbr != null && (!peakCbr || row.cbr > peakCbr.value)) peakCbr = { year: row.year, value: row.cbr };
        if (row.births != null && (!peakBirths || row.births > peakBirths.value)) peakBirths = { year: row.year, value: row.births };
      }
      births = {
        referenceYear: year,
        births: cur.births,
        crudeBirthRate: cur.cbr ?? 0,
        tfr: cur.tfr ?? 0,
        series,
        peakCbr,
        peakBirths,
        world: {
          births: w.births ?? 0,
          birthsPerDay: w.births != null ? Math.round(w.births / 365) : 0,
          crudeBirthRate: w.cbr ?? 0,
        },
      };
    }

    // ---- fertility (FertilityData shape) ----
    let fertility: FertilityData | null = null;
    if (data && cur && typeof cur.tfr === 'number') {
      const hist = Object.keys(data.years)
        .map(Number)
        .filter((y) => y >= FIRST_ESTIMATE_YEAR && y <= year)
        .sort((a, b) => a - b)
        .map((y) => {
          const d = data.years[String(y)];
          return { year: y, totalFertilityRate: d.tfr ?? 0, crudebirthRate: d.cbr ?? 0 };
        });
      const projYears = [2030, 2050].filter((y) => data.years[String(y)]);
      const projections = projYears.map((y) => {
        const d = data.years[String(y)];
        return { year: y, totalFertilityRate: d.tfr ?? 0, crudebirthRate: d.cbr ?? 0 };
      });
      // first year TFR dropped below replacement and stayed below through the reference year
      let belowReplacementSince: number | undefined;
      for (let i = hist.length - 1; i >= 0; i--) {
        if (hist[i].totalFertilityRate >= REPLACEMENT_LEVEL) break;
        belowReplacementSince = hist[i].year;
      }
      fertility = {
        countryCode: data.iso3 ?? '',
        countryName,
        slug,
        fertilityData: {
          current: { year, totalFertilityRate: cur.tfr, crudebirthRate: cur.cbr ?? 0 },
          historical: hist,
          projections,
          replacementLevel: REPLACEMENT_LEVEL,
          belowReplacementSince,
          worldComparison: {
            worldAverage: (w?.tfr ?? 0),
            rank: tfrRank.rank[slug] ?? tfrRank.N,
            totalCountries: tfrRank.N,
          },
        },
      };
    }

    // ---- life expectancy (LifeExpectancyData shape) ----
    // e0 is displayed to one decimal, so round here (matches the old file convention).
    const r1 = (v: number | null | undefined) => (typeof v === 'number' ? Math.round(v * 10) / 10 : 0);
    let lifeExpectancy: LifeExpectancyData | null = null;
    if (data && cur && typeof cur.e0 === 'number') {
      const histE0 = Object.keys(data.years)
        .map(Number)
        .filter((y) => y >= FIRST_ESTIMATE_YEAR && y <= LAST_ESTIMATE_YEAR)
        .sort((a, b) => a - b)
        .map((y) => ({ year: y, total: r1(data.years[String(y)].e0) }));
      const projE0 = [2050, 2100]
        .filter((y) => data.years[String(y)])
        .map((y) => ({ year: y, total: r1(data.years[String(y)].e0) }));
      lifeExpectancy = {
        country: countryName,
        slug,
        lastUpdated: '',
        source: 'UN World Population Prospects 2024 Revision',
        current: {
          year,
          total: r1(cur.e0),
          male: r1(cur.e0M ?? cur.e0),
          female: r1(cur.e0F ?? cur.e0),
        },
        rank: { position: e0Rank.rank[slug] ?? e0Rank.N, outOf: e0Rank.N },
        worldAverage: {
          total: r1(w?.e0),
          male: r1(w?.e0M),
          female: r1(w?.e0F),
        },
        historical: histE0,
        projections: projE0,
        neighbors: [],
      };
    }

    const worldMedianAge = typeof w?.medianAge === 'number' ? Math.round(w.medianAge * 10) / 10 : null;

    return { referenceYear: year, fertility, lifeExpectancy, births, worldMedianAge };
  }
);
