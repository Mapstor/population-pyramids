import type { Country } from '@/types/country';
import type { CountryPopulationData } from '@/types/population';
import type { AgeGroup } from '@/types/population';

// Load all countries
export async function loadCountries(): Promise<Country[]> {
  try {
    const countries = await import('@/data/countries.json');
    return countries.default as Country[];
  } catch (error) {
    console.error('Failed to load countries:', error);
    throw new Error('Failed to load countries data');
  }
}

// Load specific country population data
export async function loadCountryData(slug: string): Promise<CountryPopulationData> {
  try {
    const data = await import(`@/data/population/${slug}.json`);
    return data.default as CountryPopulationData;
  } catch (error) {
    console.error(`Failed to load data for ${slug}:`, error);
    throw new Error(`Country data not found: ${slug}`);
  }
}

// Load population data by country code (temporary for current structure)
export async function loadCountryPopulation(countryCode: string): Promise<import('@/types/population').YearData[]> {
  try {
    const populationData = await import(`@/data/${countryCode.toLowerCase()}-population.json`);
    return populationData.default as import('@/types/population').YearData[];
  } catch (error) {
    console.error(`Failed to load population data for ${countryCode}:`, error);
    throw new Error(`Failed to load population data for ${countryCode}`);
  }
}

// Get country by slug
export async function getCountryBySlug(slug: string): Promise<Country | null> {
  const countries = await loadCountries();
  return countries.find(country => country.slug === slug) || null;
}

// Load age groups definition
export async function loadAgeGroups(): Promise<AgeGroup[]> {
  try {
    const ageGroups = await import('@/data/age-groups.json');
    return ageGroups.default as AgeGroup[];
  } catch (error) {
    console.error('Failed to load age groups:', error);
    throw new Error('Failed to load age groups data');
  }
}

// Get available years for a country
export function getAvailableYears(countryData: CountryPopulationData): number[] {
  return Object.keys(countryData.years).map(Number).sort((a, b) => b - a);
}