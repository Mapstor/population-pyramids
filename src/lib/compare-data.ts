import { loadCountryData, loadCountries } from './data-loader';
import { calculateMetrics } from './calculations';
import { getCountryFlag } from './country-flags';
import { calculateGrowthRate } from './comparison-metrics';

export interface CompareCountryData {
  slug: string;
  name: string;
  code: string;
  flag: string;
  region: string;
  totalPopulation: number;
  medianAge: number;
  sexRatio: number;
  growthRate: number;
  youthDependencyRatio: number;
  oldAgeDependencyRatio: number;
  ageGroups: Array<{
    ageGroup: string;
    male: number;
    female: number;
    total: number;
    malePercent: number;
    femalePercent: number;
  }>;
}

export interface DefaultComparisonData {
  country1: CompareCountryData;
  country2: CompareCountryData;
  comparisonType: string;
  insights: string[];
}

export interface CountryListData {
  slug: string;
  name: string;
  code: string;
  flag: string;
  region: string;
  population: number;
}

export async function getComparePageData(): Promise<{
  defaultComparison: DefaultComparisonData;
  allCountries: CountryListData[];
}> {
  const countries = await loadCountries();
  
  // Create default comparison: India vs China (historic population shift)
  const country1Slug = 'india';
  const country2Slug = 'china';
  
  const [data1, data2] = await Promise.all([
    loadCountryData(country1Slug),
    loadCountryData(country2Slug)
  ]);
  
  if (!data1 || !data2 || !data1.years || !data2.years) {
    throw new Error('Failed to load comparison data');
  }
  
  const year2024_1 = data1.years['2024'];
  const year2024_2 = data2.years['2024'];
  
  if (!year2024_1 || !year2024_2 || !year2024_1.ageGroups || !year2024_2.ageGroups) {
    throw new Error('Invalid data structure for comparison countries');
  }
  
  const metrics1 = calculateMetrics(year2024_1);
  const metrics2 = calculateMetrics(year2024_2);
  
  // Convert age groups to comparison format
  const convertAgeGroups = (ageGroups: any[]) => {
    return ageGroups.map(group => ({
      ageGroup: group.ageGroup,
      male: group.male,
      female: group.female,
      total: group.male + group.female,
      malePercent: (group.male / (group.male + group.female)) * 100,
      femalePercent: (group.female / (group.male + group.female)) * 100
    }));
  };
  
  const country1: CompareCountryData = {
    slug: country1Slug,
    name: 'India',
    code: 'IND',
    flag: getCountryFlag('IND'),
    region: data1.region || 'Asia',
    totalPopulation: year2024_1.totalPopulation,
    medianAge: metrics1.medianAge,
    sexRatio: metrics1.sexRatio,
    growthRate: calculateGrowthRate(data1, 2024),
    youthDependencyRatio: metrics1.childDependencyRatio,
    oldAgeDependencyRatio: metrics1.oldAgeDependencyRatio,
    ageGroups: convertAgeGroups(year2024_1.ageGroups)
  };
  
  const country2: CompareCountryData = {
    slug: country2Slug,
    name: 'China',
    code: 'CHN',
    flag: getCountryFlag('CHN'),
    region: data2.region || 'Asia',
    totalPopulation: year2024_2.totalPopulation,
    medianAge: metrics2.medianAge,
    sexRatio: metrics2.sexRatio,
    growthRate: calculateGrowthRate(data2, 2024),
    youthDependencyRatio: metrics2.childDependencyRatio,
    oldAgeDependencyRatio: metrics2.oldAgeDependencyRatio,
    ageGroups: convertAgeGroups(year2024_2.ageGroups)
  };
  
  const defaultComparison: DefaultComparisonData = {
    country1,
    country2,
    comparisonType: 'Asian Giants Population Shift',
    insights: [
      'India overtook China as the world\'s most populous country in 2023',
      'India has a significantly younger population with median age of 28.7 vs China\'s 39.6 years',
      'China faces rapid aging and population decline while India continues growing',
      'India\'s workforce advantage could drive economic growth for decades',
      'Both countries represent over 1/3 of global population combined'
    ]
  };
  
  // Get all countries for the country listing
  const allCountries: CountryListData[] = countries.map(country => ({
    slug: country.slug,
    name: country.name,
    code: country.code,
    flag: getCountryFlag(country.code),
    region: country.region || 'Unknown',
    population: country.population2024 || 0
  })).sort((a, b) => a.name.localeCompare(b.name));
  
  return {
    defaultComparison,
    allCountries
  };
}

// Helper function to group countries by region
export function groupCountriesByRegion(countries: CountryListData[]): Record<string, CountryListData[]> {
  const grouped: Record<string, CountryListData[]> = {};
  
  countries.forEach(country => {
    const region = country.region || 'Other';
    if (!grouped[region]) {
      grouped[region] = [];
    }
    grouped[region].push(country);
  });
  
  // Sort countries within each region by population
  Object.keys(grouped).forEach(region => {
    grouped[region].sort((a, b) => b.population - a.population);
  });
  
  return grouped;
}