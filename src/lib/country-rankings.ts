import { cache } from 'react';
import { getCountriesWithPopulationChange } from './world-data-aggregator';
import countryAreas from '@/data/country-areas.json';

export interface CountryRanking {
  code: string;
  name: string;
  slug: string;
  flag: string;
  region: string;
  population2024: number;
  population2000: number;
  populationChangePercent: number;
  medianAge2024: number;
  areaKm2: number;
  densityPerKm2: number;
  worldPopulationShare: number;
}

const AREAS = countryAreas as Record<string, number>;

export const getCountryRankings = cache(async (): Promise<{
  countries: CountryRanking[];
  worldPopulation: number;
  worldLandArea: number;
}> => {
  const enriched = await getCountriesWithPopulationChange();
  const worldPopulation = enriched.reduce((sum, c) => sum + c.population2024, 0);
  const worldLandArea = Object.values(AREAS).reduce((sum, a) => sum + a, 0);

  const countries: CountryRanking[] = enriched.map((c) => {
    const areaKm2 = AREAS[c.slug] ?? 0;
    const densityPerKm2 = areaKm2 > 0 ? c.population2024 / areaKm2 : 0;
    const worldPopulationShare =
      worldPopulation > 0 ? (c.population2024 / worldPopulation) * 100 : 0;

    return {
      code: c.code,
      name: c.name,
      slug: c.slug,
      flag: c.flag,
      region: c.region,
      population2024: c.population2024,
      population2000: c.population2000,
      populationChangePercent: c.populationChangePercent,
      medianAge2024: c.medianAge2024,
      areaKm2,
      densityPerKm2,
      worldPopulationShare,
    };
  });

  return { countries, worldPopulation, worldLandArea };
});

export function formatPopulation(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatArea(km2: number): string {
  if (km2 >= 1_000_000) return `${(km2 / 1_000_000).toFixed(2)}M km²`;
  if (km2 >= 1_000) return `${Math.round(km2).toLocaleString()} km²`;
  if (km2 >= 1) return `${Math.round(km2).toLocaleString()} km²`;
  return `${km2} km²`;
}

export function formatDensity(d: number): string {
  if (d >= 1000) return Math.round(d).toLocaleString();
  if (d >= 10) return d.toFixed(1);
  if (d >= 1) return d.toFixed(1);
  return d.toFixed(2);
}
