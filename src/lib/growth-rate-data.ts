import { loadCountries, loadCountryData } from './data-loader';
import { getCountryFlag } from './country-flags';

export interface CountryGrowthData {
  slug: string;
  name: string;
  code: string;
  flag: string;
  region: string;
  currentPopulation: number;
  population2024: number;
  population2000?: number;
  population1950?: number;
  annualGrowthRate: number;
  absoluteChange: number;
  growthSince2000: number;
  growthSince1950: number;
  doublingTime: number | null;
  status: 'Growing' | 'Stable' | 'Declining';
}

export async function getGrowthRateData(): Promise<{
  world: CountryGrowthData;
  countries: CountryGrowthData[];
}> {
  const countries = await loadCountries();
  const allCountryData: CountryGrowthData[] = [];
  
  // Track world totals
  let worldCurrent = 0;
  let worldPrevious = 0;
  let world2000 = 0;
  let world1950 = 0;

  for (const country of countries) {
    try {
      const data = await loadCountryData(country.slug);
      if (!data || !data.years) continue;
      
      // Get most recent years data
      const years = Object.keys(data.years).sort((a, b) => parseInt(b) - parseInt(a));
      const currentYear = years[0]; // Most recent year
      const previousYear = years[1]; // Previous year
      
      const current = data.years[currentYear]?.totalPopulation;
      const previous = data.years[previousYear]?.totalPopulation;
      const pop2000 = data.years['2000']?.totalPopulation;
      const pop1950 = data.years['1950']?.totalPopulation;
      
      if (!current || !previous) continue;

      // Calculate growth metrics
      const annualGrowthRate = ((current / previous) - 1) * 100;
      const absoluteChange = current - previous;
      const growthSince2000 = pop2000 ? ((current - pop2000) / pop2000) * 100 : 0;
      const growthSince1950 = pop1950 ? ((current - pop1950) / pop1950) * 100 : 0;
      const doublingTime = annualGrowthRate > 0 ? 70 / annualGrowthRate : null;
      
      let status: 'Growing' | 'Stable' | 'Declining';
      if (annualGrowthRate > 0.5) status = 'Growing';
      else if (annualGrowthRate < -0.5) status = 'Declining';
      else status = 'Stable';

      // Add to world totals
      worldCurrent += current;
      worldPrevious += previous;
      if (pop2000) world2000 += pop2000;
      if (pop1950) world1950 += pop1950;

      allCountryData.push({
        slug: country.slug,
        name: country.name,
        code: country.code,
        flag: getCountryFlag(country.code),
        region: data.region || country.region || 'Unknown',
        currentPopulation: current,
        population2024: current,
        population2000: pop2000,
        population1950: pop1950,
        annualGrowthRate,
        absoluteChange,
        growthSince2000,
        growthSince1950,
        doublingTime,
        status
      });
    } catch (error) {
      console.error(`Error loading data for ${country.slug}:`, error);
    }
  }

  // Calculate world metrics
  const worldAnnualGrowthRate = worldPrevious > 0 ? ((worldCurrent / worldPrevious) - 1) * 100 : 0;
  const worldAbsoluteChange = worldCurrent - worldPrevious;
  const worldGrowthSince2000 = world2000 > 0 ? ((worldCurrent - world2000) / world2000) * 100 : 0;
  const worldGrowthSince1950 = world1950 > 0 ? ((worldCurrent - world1950) / world1950) * 100 : 0;
  const worldDoublingTime = worldAnnualGrowthRate > 0 ? 70 / worldAnnualGrowthRate : null;
  
  let worldStatus: 'Growing' | 'Stable' | 'Declining';
  if (worldAnnualGrowthRate > 0.5) worldStatus = 'Growing';
  else if (worldAnnualGrowthRate < -0.5) worldStatus = 'Declining';
  else worldStatus = 'Stable';

  const worldData: CountryGrowthData = {
    slug: 'world',
    name: 'World',
    code: 'WORLD',
    flag: '🌍',
    region: 'World',
    currentPopulation: worldCurrent,
    population2024: worldCurrent,
    population2000: world2000,
    population1950: world1950,
    annualGrowthRate: worldAnnualGrowthRate,
    absoluteChange: worldAbsoluteChange,
    growthSince2000: worldGrowthSince2000,
    growthSince1950: worldGrowthSince1950,
    doublingTime: worldDoublingTime,
    status: worldStatus
  };

  // Sort countries by annual growth rate (highest to lowest)
  allCountryData.sort((a, b) => b.annualGrowthRate - a.annualGrowthRate);

  return {
    world: worldData,
    countries: allCountryData
  };
}