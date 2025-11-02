import type { CountryPopulationData, YearData } from '@/types/population';
import { loadCountries } from './data-loader';
import { getCountryFlag } from './country-flags';

interface WorldPopulationData {
  years: Record<string, YearData>;
}

// Cache for world data to improve performance
let worldDataCache: WorldPopulationData | null = null;

export async function generateWorldPopulationData(): Promise<WorldPopulationData> {
  // Return cached data if available (for development performance)
  if (worldDataCache) {
    return worldDataCache;
  }

  const countries = await loadCountries();
  const worldData: WorldPopulationData = { years: {} };
  
  // Years we want to aggregate (1950-2025)
  const targetYears = Array.from({ length: 76 }, (_, i) => 1950 + i);
  
  for (const year of targetYears) {
    const yearStr = year.toString();
    
    // Initialize world data for this year
    const worldYearData: YearData = {
      year,
      totalPopulation: 0,
      malePopulation: 0,
      femalePopulation: 0,
      medianAge: 0,
      ageGroups: []
    };
    
    // Age group structure (standard UN age groups)
    const ageRanges = ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', 
                      '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', 
                      '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+'];
    
    const worldAgeGroups: Record<string, { male: number; female: number; total: number }> = {};
    
    // Initialize age groups
    ageRanges.forEach(range => {
      worldAgeGroups[range] = { male: 0, female: 0, total: 0 };
    });
    
    let validCountries = 0;
    let totalPopulationWeightedAge = 0;
    
    // Aggregate data from all countries
    for (const country of countries) {
      try {
        const countryData = await import(`@/data/population/${country.slug}.json`);
        const data = countryData.default as CountryPopulationData;
        
        if (data.years[yearStr]) {
          const countryYearData = data.years[yearStr];
          validCountries++;
          
          // Add to totals
          worldYearData.totalPopulation += countryYearData.totalPopulation;
          worldYearData.malePopulation += countryYearData.malePopulation;
          worldYearData.femalePopulation += countryYearData.femalePopulation;
          
          // Weight median age by population size
          totalPopulationWeightedAge += countryYearData.medianAge * countryYearData.totalPopulation;
          
          // Aggregate age groups
          countryYearData.ageGroups.forEach(ageGroup => {
            if (worldAgeGroups[ageGroup.ageRange]) {
              worldAgeGroups[ageGroup.ageRange].male += ageGroup.male;
              worldAgeGroups[ageGroup.ageRange].female += ageGroup.female;
              worldAgeGroups[ageGroup.ageRange].total += ageGroup.total;
            }
          });
        }
      } catch (error) {
        // Skip countries without data
        continue;
      }
    }
    
    // Calculate population-weighted median age
    if (worldYearData.totalPopulation > 0) {
      worldYearData.medianAge = totalPopulationWeightedAge / worldYearData.totalPopulation;
    }
    
    // Convert aggregated age groups to final format
    worldYearData.ageGroups = ageRanges.map(range => {
      const ageGroup = worldAgeGroups[range];
      return {
        ageRange: range,
        male: ageGroup.male,
        female: ageGroup.female,
        total: ageGroup.total,
        malePercent: ageGroup.total > 0 ? (ageGroup.male / ageGroup.total) * 100 : 0,
        femalePercent: ageGroup.total > 0 ? (ageGroup.female / ageGroup.total) * 100 : 0,
        totalPercent: worldYearData.totalPopulation > 0 ? (ageGroup.total / worldYearData.totalPopulation) * 100 : 0
      };
    });
    
    worldData.years[yearStr] = worldYearData;
  }
  
  // Cache the result
  worldDataCache = worldData;
  
  return worldData;
}

export async function getCountriesWithPopulationChange(): Promise<Array<{
  code: string;
  name: string;
  slug: string;
  flag: string;
  population2024: number;
  population2000: number;
  population1990: number;
  populationChange: number;
  populationChangePercent: number;
  medianAge2024: number;
  medianAge2000: number;
  medianAgeChange: number;
  youthPercent2024: number;
  elderlyPercent2024: number;
  dependencyRatio2024: number;
  urbanizationRate?: number;
  region: string;
}>> {
  const countries = await loadCountries();
  const enrichedCountries = [];
  
  for (const country of countries) {
    try {
      const countryData = await import(`@/data/population/${country.slug}.json`);
      const data = countryData.default as CountryPopulationData;
      
      const pop2024 = data.years['2024']?.totalPopulation || 0;
      const pop2000 = data.years['2000']?.totalPopulation || 0;
      const pop1990 = data.years['1990']?.totalPopulation || 0;
      
      const populationChange = pop2024 - pop2000;
      const populationChangePercent = pop2000 > 0 ? ((pop2024 - pop2000) / pop2000) * 100 : 0;
      
      // Median age data
      const medianAge2024 = data.years['2024']?.medianAge || 0;
      const medianAge2000 = data.years['2000']?.medianAge || 0;
      const medianAgeChange = medianAge2024 - medianAge2000;
      
      // Calculate age structure percentages for 2024
      const data2024 = data.years['2024'];
      let youthPercent2024 = 0;
      let elderlyPercent2024 = 0;
      let dependencyRatio2024 = 0;
      
      if (data2024 && data2024.ageGroups) {
        const youthPop = data2024.ageGroups
          .filter(ag => ['0-4', '5-9', '10-14'].includes(ag.ageRange))
          .reduce((sum, ag) => sum + ag.total, 0);
        
        const elderlyPop = data2024.ageGroups
          .filter(ag => ag.ageRange.includes('65') || ag.ageRange.includes('70') || 
                        ag.ageRange.includes('75') || ag.ageRange.includes('80') || 
                        ag.ageRange.includes('85') || ag.ageRange.includes('90') || 
                        ag.ageRange.includes('95') || ag.ageRange.includes('100'))
          .reduce((sum, ag) => sum + ag.total, 0);
        
        const workingAgePop = data2024.totalPopulation - youthPop - elderlyPop;
        
        youthPercent2024 = (youthPop / data2024.totalPopulation) * 100;
        elderlyPercent2024 = (elderlyPop / data2024.totalPopulation) * 100;
        dependencyRatio2024 = workingAgePop > 0 ? ((youthPop + elderlyPop) / workingAgePop) * 100 : 0;
      }
      
      enrichedCountries.push({
        code: country.code,
        name: country.name,
        slug: country.slug,
        flag: getCountryFlag(country.code),
        population2024: pop2024,
        population2000: pop2000,
        population1990: pop1990,
        populationChange,
        populationChangePercent,
        medianAge2024,
        medianAge2000,
        medianAgeChange,
        youthPercent2024,
        elderlyPercent2024,
        dependencyRatio2024,
        region: data.region || 'Unknown'
      });
    } catch (error) {
      // Use basic data if country data is not available
      enrichedCountries.push({
        code: country.code,
        name: country.name,
        slug: country.slug,
        flag: getCountryFlag(country.code),
        population2024: country.population2024 || 0,
        population2000: 0,
        population1990: 0,
        populationChange: 0,
        populationChangePercent: 0,
        medianAge2024: 0,
        medianAge2000: 0,
        medianAgeChange: 0,
        youthPercent2024: 0,
        elderlyPercent2024: 0,
        dependencyRatio2024: 0,
        region: 'Unknown'
      });
    }
  }
  
  // Sort by population (largest first)
  return enrichedCountries.sort((a, b) => b.population2024 - a.population2024);
}