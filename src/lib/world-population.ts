/**
 * Total world population by year — UN World Population Prospects 2024,
 * 1 July, medium variant. This is the single source for every world figure
 * and every population share on country pages; never sum the per-country
 * files to derive a world total (they don't add up to the UN world series).
 *
 * Only display these rounded (e.g. "8.23 billion" via popWords), never raw.
 * T4a: reads the full 1950–2100 world series from src/data/wpp2024/world.json
 * (replacing the old 2020–2030 constant map), so every year now resolves.
 */
import worldData from '@/data/wpp2024/world.json';

const WORLD_YEARS = (worldData as { years: Record<string, { pop: number }> }).years;

/** World population for a year 1950–2100, or null if that year is not in the series. */
export function worldPopulation(year: number): number | null {
  const y = WORLD_YEARS[String(year)];
  return y && typeof y.pop === 'number' ? y.pop : null;
}
