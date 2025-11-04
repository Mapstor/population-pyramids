import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadCountries, loadCountryData, getAvailableYears } from '@/lib/data-loader';
import { calculateMetrics } from '@/lib/calculations';
// import { generateCountryContent } from '@/lib/content-generator';
import { generateCountryMetadata } from '@/lib/seo-helpers';
// import { getComparisons } from '@/lib/country-comparisons';
// import { generateImplications } from '@/lib/implications-analyzer';
// import { generateExpertAnalysis } from '@/lib/expert-analysis';
// import { getHistoricalEvents } from '@/lib/historical-events';
// import { generateDemographicFacts } from '@/lib/demographic-facts';
// import { generateExpandedFAQ } from '@/lib/expanded-faq';
// import { generateRelatedDemographics } from '@/lib/related-demographics';
// import { generateDemographicGlossary, generateGlossarySummary } from '@/lib/demographic-glossary';
// import { generateUsageGuide, generateUsageSummary } from '@/lib/usage-guide';
import PopulationPyramid from '@/components/PopulationPyramid';
// import TimelinePyramid from '@/components/TimelinePyramid';
import StatsTable from '@/components/StatsTable';
// import DemographicCharts from '@/components/DemographicCharts';
// import RegionalComparison from '@/components/RegionalComparison';
// import DecadeBreakdown from '@/components/DecadeBreakdown';
import ShareButtons from '@/components/ShareButtons';

// export const dynamic = 'force-static';
// export const dynamicParams = false;

interface CountryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const countries = await loadCountries();
  console.log('Generating params for countries:', countries.length);
  
  // IMPORTANT: Only generate Afghanistan for testing
  const testCountries = countries.filter(c => c.slug === 'afghanistan');
  console.log('Filtered to test countries:', testCountries.length);
  console.log('Afghanistan slug will be:', testCountries[0]?.slug);
  
  // Return ONLY Afghanistan
  return [{
    slug: 'afghanistan'
  }];
}

export async function generateMetadata({ params }: CountryPageProps) {
  try {
    const countrySlug = params.slug;
    const countryData = await loadCountryData(countrySlug);
    const availableYears = getAvailableYears(countryData);
    const latestYear = Math.max(...availableYears);
    const yearData = countryData.years[latestYear.toString()];
    
    return generateCountryMetadata(
      countryData.countryName,
      latestYear,
      yearData.totalPopulation
    );
  } catch {
    return {
      title: 'Country Not Found'
    };
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  try {
    const countrySlug = params.slug;
    const countryData = await loadCountryData(countrySlug);
    const availableYears = getAvailableYears(countryData);
    const latestYear = Math.max(...availableYears);
    const yearData = countryData.years[latestYear.toString()];
    const metrics = calculateMetrics(yearData);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{countryData.countryName}</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-3">
              {countryData.countryName} Population Pyramid ({latestYear})
            </h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <div>
                  <div className="text-blue-100 text-xs">Total Population</div>
                  <div className="font-bold">{yearData.totalPopulation.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <div>
                  <div className="text-blue-100 text-xs">Median Age</div>
                  <div className="font-bold">{yearData.medianAge.toFixed(1)} years</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📈</span>
                <div>
                  <div className="text-blue-100 text-xs">Pyramid Type</div>
                  <div className="font-bold capitalize">{metrics.pyramidType}</div>
                </div>
              </div>
            </div>
          </div>

          {/* PRIMARY PYRAMID - Current Year */}
          <section className="mb-12">
            <PopulationPyramid
              data={yearData}
              countryName={countryData.countryName}
              year={latestYear}
              height={600}
            />
          </section>

          {/* Stats Table */}
          <section className="mb-12">
            <StatsTable 
              data={yearData} 
              metrics={metrics} 
              countryName={countryData.countryName}
              year={latestYear}
            />
          </section>

          {/* Data Sources */}
          <section className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Data Sources & Methodology
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              All population data is sourced from the United Nations Department of Economic and Social Affairs, 
              Population Division. The data represents medium-variant projections based on comprehensive demographic research.
            </p>
            <a 
              href="https://population.un.org/wpp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View UN World Population Prospects Data →
            </a>
          </section>

          {/* Share Buttons */}
          <ShareButtons
            url={`https://populationpyramids.org/${params.slug}`}
            title={`${countryData.countryName} Population Pyramid ${latestYear}`}
            description={`Explore demographic data and population trends for ${countryData.countryName}`}
          />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}