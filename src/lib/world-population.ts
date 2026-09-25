/**
 * Total world population by year — UN World Population Prospects 2024,
 * 1 July, medium variant. This is the single source for every world figure
 * and every population share on country pages; never sum the per-country
 * files to derive a world total (they don't add up to the UN world series).
 *
 * Only display these rounded (e.g. "8.23 billion" via popWords), never raw.
 * T4 extends this to the full 1950–2100 series.
 */
const WORLD_POPULATION: Record<number, number> = {
  2020: 7_887_001_292,
  2021: 7_954_448_392,
  2022: 8_021_407_192,
  2023: 8_091_734_930,
  2024: 8_161_972_572,
  2025: 8_231_613_070,
  2026: 8_300_678_396,
  2027: 8_369_094_345,
  2028: 8_436_618_887,
  2029: 8_503_285_323,
  2030: 8_569_124_911,
};

/** World population for a year, or null if that year is not in the series. */
export function worldPopulation(year: number): number | null {
  return WORLD_POPULATION[year] ?? null;
}
