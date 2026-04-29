import { cache } from 'react';
import { loadCountries, loadCountryData } from '@/lib/data-loader';
import { 
  calculateGenerationPopulations, 
  calculateWorldGenerationPopulations,
  type GenerationPopulation 
} from '@/lib/generation-utils';
import type { Country } from '@/types/country';

// Cached world data computation - runs once per build
export const getWorldGenerationData = cache(async (): Promise<GenerationPopulation[]> => {
  try {
    return await calculateWorldGenerationPopulations();
  } catch (error) {
    console.error('Failed to calculate world generation data:', error);
    // Return empty array as fallback
    return [];
  }
});

// Cached per-country computation - deduped via React cache
export const getCountryGenerationData = cache(async (slug: string): Promise<GenerationPopulation[]> => {
  try {
    const countryData = await loadCountryData(slug);
    
    // Try to get most recent year data
    const year2024 = countryData.years['2024'] || 
                     countryData.years['2023'] || 
                     countryData.years['2025'] ||
                     countryData.years['2022'];
    
    if (!year2024 || !year2024.ageGroups || year2024.ageGroups.length === 0) {
      console.warn(`No age group data available for ${slug}`);
      return [];
    }
    
    return calculateGenerationPopulations(year2024, 2026);
  } catch (error) {
    console.error(`Failed to load generation data for ${slug}:`, error);
    return []; // Graceful degradation
  }
});

// Reuse existing cached loaders
export const getAllCountries = loadCountries;

// Get country by slug with caching
export const getCountryBySlug = cache(async (slug: string): Promise<Country | null> => {
  const countries = await loadCountries();
  return countries.find(c => c.slug === slug) || null;
});