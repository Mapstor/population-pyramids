// Test version with gradual import addition to isolate the failing import
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadCountries, loadCountryData, getAvailableYears } from '@/lib/data-loader';
import { calculateMetrics } from '@/lib/calculations';
import { generateCountryContent } from '@/lib/content-generator';
import { generateCountryMetadata } from '@/lib/seo-helpers';
import { getComparisons } from '@/lib/country-comparisons';
import { generateImplications } from '@/lib/implications-analyzer';
import { generateExpertAnalysis } from '@/lib/expert-analysis';
import { getHistoricalEvents } from '@/lib/historical-events';
import { generateDemographicFacts } from '@/lib/demographic-facts';
import { generateExpandedFAQ } from '@/lib/expanded-faq';
import { generateRelatedDemographics } from '@/lib/related-demographics';
import { generateDemographicGlossary, generateGlossarySummary } from '@/lib/demographic-glossary';
import { generateUsageGuide, generateUsageSummary } from '@/lib/usage-guide';
import fs from 'fs';
import path from 'path';
import PopulationPyramid from '@/components/PopulationPyramid';
import TimelinePyramid from '@/components/TimelinePyramid';
import StatsTable from '@/components/StatsTable';
import DemographicCharts from '@/components/DemographicCharts';
import RegionalComparison from '@/components/RegionalComparison';
import DecadeBreakdown from '@/components/DecadeBreakdown';
import ShareButtons from '@/components/ShareButtons';

export async function generateStaticParams() {
  console.log('🔍 TEST generateStaticParams EXECUTING');
  return [
    { country: 'germany-population-pyramid' },
    { country: 'afghanistan-population-pyramid' },
    { country: 'united-states-population-pyramid' }
  ];
}

export const dynamic = 'force-dynamic';
export const dynamicParams = false;

export default async function CountryPage({ params }: { params: { country: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>TEST: {params.country}</h1>
      <p>Testing with minimal imports</p>
    </div>
  );
}