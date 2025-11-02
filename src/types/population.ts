export interface AgeGroup {
  id: number;
  range: string;
  label: string;
  minAge: number;
  maxAge: number | null;
}

export interface AgeGroupData {
  ageGroup: AgeGroup;
  male: number;
  female: number;
  total?: number;
  malePercent?: number;
  femalePercent?: number;
  totalPercent?: number;
  ageRange?: string;
}

export interface YearData {
  year: number;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  medianAge: number;
  ageGroups: AgeGroupData[];
}

export interface CountryPopulationData {
  countryCode: string;
  countryName: string;
  slug: string;
  region: string;
  years: {
    [year: string]: YearData;
  };
}

export interface DemographicMetrics {
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  medianAge: number;
  sexRatio: number;
  malePercent: number;
  femalePercent: number;
  youthPopulation: number;
  workingAgePopulation: number;
  elderlyPopulation: number;
  youthPercentage: number;
  workingAgePercentage: number;
  elderlyPercentage: number;
  dependencyRatio: number;
  childDependencyRatio: number;
  oldAgeDependencyRatio: number;
  potentialSupportRatio: number;
  agingIndex: number;
  pyramidType: 'expansive' | 'constrictive' | 'stationary';
}