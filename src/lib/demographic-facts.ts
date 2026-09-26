import type { YearData, DemographicMetrics, CountryPopulationData } from '@/types/population';

export interface DemographicFact {
  icon: string;
  text: string;
  category: string;
}

/**
 * T5a: the hardcoded per-country "enhanced facts" (including the United States
 * ones) were deleted. Country pages now derive their four key facts from the UN
 * data via keyFacts() in src/lib/country-rules.ts.
 *
 * This stub keeps the export only so the legacy, non-routed copy
 * src/app/[slug]/page-partial.tsx still type-checks; it renders nothing.
 */
export function generateDemographicFacts(
  _countryName: string,
  _yearData: YearData,
  _metrics: DemographicMetrics,
  _countryData: CountryPopulationData,
  _currentYear: number
): DemographicFact[] {
  return [];
}
