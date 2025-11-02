import type { YearData, DemographicMetrics } from './population';
import type { Country } from './country';

export interface PopulationPyramidProps {
  data: YearData;
  countryName: string;
  year: number;
  showLegend?: boolean;
  height?: number;
  className?: string;
}

export interface YearSelectorProps {
  currentYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
  minYear: number;
  maxYear: number;
  className?: string;
}

export interface CountrySelectorProps {
  countries: Country[];
  selectedCountry?: string;
  onCountrySelect: (slug: string) => void;
  placeholder?: string;
  className?: string;
}

export interface StatsTableProps {
  data: YearData;
  metrics: DemographicMetrics;
  showCalculations?: boolean;
  className?: string;
}

export interface ComparisonChartProps {
  country1Data: YearData;
  country2Data: YearData;
  country1Name: string;
  country2Name: string;
  year: number;
}

export interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export interface CountryGridProps {
  countries: Country[];
  className?: string;
}