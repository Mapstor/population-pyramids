import { loadCountries, loadCountryData } from './data-loader';
import { calculateMetrics } from './calculations';
import { getCountryFlag } from './country-flags';

export interface CountryDependencyData {
  slug: string;
  name: string;
  code: string;
  flag: string;
  region: string;
  totalPopulation: number;
  youthPopulation: number;
  workingAgePopulation: number;
  elderlyPopulation: number;
  youthPercentage: number;
  workingAgePercentage: number;
  elderlyPercentage: number;
  totalDependencyRatio: number;
  youthDependencyRatio: number;
  oldAgeDependencyRatio: number;
  potentialSupportRatio: number;
  agingIndex: number;
  medianAge: number;
}

export async function getDependencyRatioData(): Promise<{
  world: CountryDependencyData;
  countries: CountryDependencyData[];
}> {
  const countries = await loadCountries();
  const allCountryData: CountryDependencyData[] = [];
  
  let worldYouth = 0;
  let worldWorking = 0;
  let worldElderly = 0;
  let worldTotal = 0;
  let worldMaleTotal = 0;
  let worldFemaleTotal = 0;

  for (const country of countries) {
    try {
      const data = await loadCountryData(country.slug);
      
      // Get most recent year data (2024 preferably, then 2023, then 2025)
      const year2024 = data.years?.['2024'];
      const year2023 = data.years?.['2023'];
      const year2025 = data.years?.['2025'];
      const recentYear = year2024 || year2023 || year2025;
      
      if (!recentYear || !recentYear.ageGroups || recentYear.ageGroups.length === 0) continue;

      // Calculate metrics using existing calculation function
      const metrics = calculateMetrics(recentYear);
      
      // Add to world totals
      worldYouth += metrics.youthPopulation;
      worldWorking += metrics.workingAgePopulation;
      worldElderly += metrics.elderlyPopulation;
      worldTotal += metrics.totalPopulation;
      worldMaleTotal += metrics.malePopulation;
      worldFemaleTotal += metrics.femalePopulation;

      allCountryData.push({
        slug: country.slug,
        name: country.name,
        code: country.code,
        flag: getCountryFlag(country.code),
        region: data.region || country.region || 'Unknown',
        totalPopulation: metrics.totalPopulation,
        youthPopulation: metrics.youthPopulation,
        workingAgePopulation: metrics.workingAgePopulation,
        elderlyPopulation: metrics.elderlyPopulation,
        youthPercentage: metrics.youthPercentage,
        workingAgePercentage: metrics.workingAgePercentage,
        elderlyPercentage: metrics.elderlyPercentage,
        totalDependencyRatio: metrics.dependencyRatio,
        youthDependencyRatio: metrics.childDependencyRatio,
        oldAgeDependencyRatio: metrics.oldAgeDependencyRatio,
        potentialSupportRatio: metrics.potentialSupportRatio,
        agingIndex: metrics.agingIndex,
        medianAge: metrics.medianAge || 0
      });
    } catch (error) {
      console.error(`Error loading data for ${country.slug}:`, error);
    }
  }

  // Calculate world metrics
  const worldYouthPercent = worldTotal > 0 ? (worldYouth / worldTotal) * 100 : 0;
  const worldWorkingPercent = worldTotal > 0 ? (worldWorking / worldTotal) * 100 : 0;
  const worldElderlyPercent = worldTotal > 0 ? (worldElderly / worldTotal) * 100 : 0;
  const worldTotalDR = worldWorking > 0 ? ((worldYouth + worldElderly) / worldWorking) * 100 : 0;
  const worldYouthDR = worldWorking > 0 ? (worldYouth / worldWorking) * 100 : 0;
  const worldOldAgeDR = worldWorking > 0 ? (worldElderly / worldWorking) * 100 : 0;
  const worldPSR = worldElderly > 0 ? worldWorking / worldElderly : 0;
  const worldAgingIndex = worldYouth > 0 ? (worldElderly / worldYouth) * 100 : 0;
  
  // Calculate weighted average of median ages
  let weightedAgeSum = 0;
  let totalValidPopulation = 0;
  allCountryData.forEach(country => {
    if (country.medianAge > 0) {
      weightedAgeSum += country.medianAge * country.totalPopulation;
      totalValidPopulation += country.totalPopulation;
    }
  });
  const worldMedianAge = totalValidPopulation > 0 ? weightedAgeSum / totalValidPopulation : 30;

  const worldData: CountryDependencyData = {
    slug: 'world',
    name: 'World',
    code: 'WORLD',
    flag: '🌍',
    region: 'World',
    totalPopulation: worldTotal,
    youthPopulation: worldYouth,
    workingAgePopulation: worldWorking,
    elderlyPopulation: worldElderly,
    youthPercentage: worldYouthPercent,
    workingAgePercentage: worldWorkingPercent,
    elderlyPercentage: worldElderlyPercent,
    totalDependencyRatio: worldTotalDR,
    youthDependencyRatio: worldYouthDR,
    oldAgeDependencyRatio: worldOldAgeDR,
    potentialSupportRatio: worldPSR,
    agingIndex: worldAgingIndex,
    medianAge: worldMedianAge
  };

  // Sort countries by total dependency ratio (highest to lowest)
  allCountryData.sort((a, b) => b.totalDependencyRatio - a.totalDependencyRatio);

  return {
    world: worldData,
    countries: allCountryData
  };
}