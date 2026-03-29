import type { CountryData, YearData } from '@/types/population';

export interface ComparisonMetrics {
  populationGrowthRate: number;
  birthRate: number;
  fertilityRate: number;
  populationDensity?: number;
  urbanizationRate?: number;
  lifeExpectancy?: number;
}

export function calculateGrowthRate(
  countryData: CountryData,
  currentYear: number = 2025
): number {
  const years = Object.keys(countryData.years)
    .map(y => parseInt(y))
    .sort((a, b) => a - b);
  
  // Find the year 5 years ago
  const targetYear = currentYear - 5;
  const previousYear = years.find(y => y === targetYear) || 
                       years.find(y => y === targetYear - 1) ||
                       years.find(y => y === targetYear + 1) ||
                       2020;
  
  if (!countryData.years[previousYear] || !countryData.years[currentYear]) {
    return 0;
  }
  
  const previousPop = countryData.years[previousYear].totalPopulation;
  const currentPop = countryData.years[currentYear].totalPopulation;
  const yearsDiff = currentYear - previousYear;
  
  // Calculate CAGR (Compound Annual Growth Rate)
  const growthRate = (Math.pow(currentPop / previousPop, 1 / yearsDiff) - 1) * 100;
  
  return growthRate;
}

export function calculateProjectedGrowth(
  countryData: CountryData,
  fromYear: number = 2025,
  toYear: number = 2050
): number {
  if (!countryData.years[fromYear] || !countryData.years[toYear]) {
    return 0;
  }
  
  const fromPop = countryData.years[fromYear].totalPopulation;
  const toPop = countryData.years[toYear].totalPopulation;
  const yearsDiff = toYear - fromYear;
  
  // Calculate CAGR for future projection
  const growthRate = (Math.pow(toPop / fromPop, 1 / yearsDiff) - 1) * 100;
  
  return growthRate;
}

export function getPopulationChange(
  countryData: CountryData,
  year1: number,
  year2: number
): { absolute: number; percentage: number } {
  if (!countryData.years[year1] || !countryData.years[year2]) {
    return { absolute: 0, percentage: 0 };
  }
  
  const pop1 = countryData.years[year1].totalPopulation;
  const pop2 = countryData.years[year2].totalPopulation;
  
  const absolute = pop2 - pop1;
  const percentage = ((pop2 - pop1) / pop1) * 100;
  
  return { absolute, percentage };
}

export function calculateBirthRate(yearData: YearData): number {
  // Estimate birth rate from age 0-4 population
  // This is a rough approximation: (0-4 population / 5) / total population * 1000
  const age0to4 = yearData.ageGroups.find(ag => ag.ageRange === '0-4');
  if (!age0to4) return 0;
  
  const annualBirths = age0to4.total / 5;
  const birthRate = (annualBirths / yearData.totalPopulation) * 1000;
  
  return birthRate;
}

export function getYouthBulge(yearData: YearData): number {
  // Calculate percentage of population aged 15-29
  const youthAgeRanges = ['15-19', '20-24', '25-29'];
  
  const youthPopulation = yearData.ageGroups
    .filter(ag => ag.ageRange && youthAgeRanges.includes(ag.ageRange))
    .reduce((sum, ag) => sum + (ag.total || ag.male + ag.female), 0);
  
  return (youthPopulation / yearData.totalPopulation) * 100;
}

export function getWorkforceShare(yearData: YearData): number {
  // Calculate percentage of population aged 25-54 (prime working age)
  const workingAgeRanges = ['25-29', '30-34', '35-39', '40-44', '45-49', '50-54'];
  
  const workforcePopulation = yearData.ageGroups
    .filter(ag => ag.ageRange && workingAgeRanges.includes(ag.ageRange))
    .reduce((sum, ag) => sum + (ag.total || ag.male + ag.female), 0);
  
  return (workforcePopulation / yearData.totalPopulation) * 100;
}