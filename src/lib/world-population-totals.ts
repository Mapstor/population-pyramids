import countries from '@/data/countries.json';

interface PopulationEntry {
  year: number;
  total: number;
  male: number;
  female: number;
  age_distribution: Record<string, { male: number; female: number }>;
}

interface CountryData {
  country: string;
  data: PopulationEntry[];
}

// Hardcoded world population totals from UN data
// These are approximate aggregates for demonstration
export function getWorldPopulationTotals(): PopulationEntry[] {
  return [
    { year: 1950, total: 2536431149, male: 1280000000, female: 1256431149, age_distribution: {} },
    { year: 1955, total: 2773019936, male: 1400000000, female: 1373019936, age_distribution: {} },
    { year: 1960, total: 3034949748, male: 1530000000, female: 1504949748, age_distribution: {} },
    { year: 1965, total: 3339583597, male: 1680000000, female: 1659583597, age_distribution: {} },
    { year: 1970, total: 3700437046, male: 1860000000, female: 1840437046, age_distribution: {} },
    { year: 1975, total: 4079480606, male: 2050000000, female: 2029480606, age_distribution: {} },
    { year: 1980, total: 4458003514, male: 2240000000, female: 2218003514, age_distribution: {} },
    { year: 1985, total: 4870921740, male: 2450000000, female: 2420921740, age_distribution: {} },
    { year: 1990, total: 5327231061, male: 2680000000, female: 2647231061, age_distribution: {} },
    { year: 1995, total: 5744212979, male: 2890000000, female: 2854212979, age_distribution: {} },
    { year: 2000, total: 6143493823, male: 3090000000, female: 3053493823, age_distribution: {} },
    { year: 2005, total: 6541907027, male: 3290000000, female: 3251907027, age_distribution: {} },
    { year: 2010, total: 6956823603, male: 3500000000, female: 3456823603, age_distribution: {} },
    { year: 2015, total: 7379797139, male: 3710000000, female: 3669797139, age_distribution: {} },
    { year: 2020, total: 7794798739, male: 3920000000, female: 3874798739, age_distribution: {} },
    { year: 2025, total: 8190000000, male: 4120000000, female: 4070000000, age_distribution: {} }
  ];
}

export function getCountryPopulationData(slug: string): PopulationEntry[] {
  try {
    const data = require(`@/data/population/${slug}.json`) as CountryData;
    return data.data;
  } catch {
    return [];
  }
}