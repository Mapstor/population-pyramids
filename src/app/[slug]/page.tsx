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
import { classifyDemographicStage, getDemographicStageExplanation } from '@/lib/demographic-stage-classifier';
import { loadFertilityData, calculateFertilityMetrics, getFertilityAnalysis } from '@/lib/fertility-loader';
import FertilityChart from '@/components/FertilityChart';
import PopulationPyramid from '@/components/PopulationPyramid';
import TimelinePyramid from '@/components/TimelinePyramid';
import StatsTable from '@/components/StatsTable';
import DemographicCharts from '@/components/DemographicCharts';
import RegionalComparison from '@/components/RegionalComparison';
import DecadeBreakdown from '@/components/DecadeBreakdown';
import ShareButtons from '@/components/ShareButtons';

export const dynamicParams = false;
export const revalidate = false;

interface CountryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const countries = await loadCountries();
  console.log('Generating params for ALL countries:', countries.length);
  
  return countries.map(country => ({
    slug: country.slug
  }));
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
    const countries = await loadCountries();
    const availableYears = getAvailableYears(countryData);
    const latestYear = Math.max(...availableYears);
    const yearData = countryData.years[latestYear.toString()];
    const metrics = calculateMetrics(yearData);
    
    // Load fertility data if available
    const fertilityData = await loadFertilityData(countrySlug);
    
    // Generate all content
    const content = generateCountryContent(
      countryData.countryName,
      yearData,
      metrics,
      countryData
    );
    const implications = generateImplications(
      countryData.countryName,
      yearData,
      metrics,
      latestYear
    );
    const expertAnalysis = generateExpertAnalysis(
      countryData.countryName,
      yearData,
      metrics,
      countryData,
      latestYear
    );
    const historicalEvents = getHistoricalEvents(countrySlug);
    const demographicFacts = generateDemographicFacts(
      countryData.countryName,
      yearData,
      metrics,
      countryData,
      latestYear
    );
    const expandedFAQs = generateExpandedFAQ(
      countryData.countryName,
      countrySlug,
      yearData,
      metrics,
      countryData,
      latestYear
    );
    const relatedDemographics = generateRelatedDemographics(
      countryData.countryName,
      countrySlug,
      yearData,
      metrics,
      countryData,
      latestYear
    );
    const glossaryTerms = generateDemographicGlossary(
      countryData.countryName,
      yearData,
      metrics,
      countryData,
      latestYear
    );
    const glossarySummary = generateGlossarySummary(countryData.countryName, metrics);
    const usageGuides = generateUsageGuide(
      countryData.countryName,
      countrySlug,
      yearData,
      metrics,
      latestYear
    );
    const usageSummary = generateUsageSummary(countryData.countryName, metrics);
    
    // Get demographic stage classification
    const demographicStage = classifyDemographicStage(yearData);
    const stageExplanation = getDemographicStageExplanation(demographicStage, countryData.countryName);

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
          <div id="overview" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-3">
              {countryData.countryName} Population Pyramid ({latestYear})
            </h1>
            <div className="bg-blue-800 bg-opacity-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-100">
                <span className="font-semibold">📅 Next Update:</span> {countryData.countryName} population pyramid 2026 
                will be released in July 2026 when UN publishes World Population Prospects 2026 revision.
              </p>
            </div>
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
              <Link 
                href={demographicStage.link}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                title={`Learn more about ${demographicStage.name}`}
              >
                <span className="text-lg">🔄</span>
                <div>
                  <div className="text-blue-100 text-xs">DTM Stage</div>
                  <div className="font-bold underline decoration-blue-200/50">Stage {demographicStage.stage}</div>
                </div>
              </Link>
            </div>
          </div>

          {/* PRIMARY PYRAMID - Current Year */}
          <section id="pyramid" className="mb-12">
            <PopulationPyramid
              data={yearData}
              countryName={countryData.countryName}
              year={latestYear}
              height={600}
            />
          </section>

          {/* Demographics Facts */}
          <section className="mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {countryData.countryName} Demographics
              </h2>
              
              <div className="grid md:grid-cols-2 gap-3">
                {demographicFacts.map((fact, index) => (
                  <div 
                    key={index}
                    className="flex items-start p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-lg mr-3 flex-shrink-0">{fact.icon}</span>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {fact.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Vatican City Special Section */}
          {countrySlug === 'vatican-city' && (
            <section className="mb-12">
              <div className="bg-gradient-to-r from-yellow-50 via-white to-yellow-50 rounded-lg shadow-md p-8 border-2 border-yellow-200">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">🇻🇦</span>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      World's Smallest Sovereign State
                    </h2>
                    <p className="text-lg text-gray-700">
                      Unique demographic profile of the Holy See
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-yellow-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">📊</span>
                      Real UN Data
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Population (2023):</span>
                        <span className="font-medium">496 people</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Land Area:</span>
                        <span className="font-medium">0.44 km²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Population Density:</span>
                        <span className="font-medium">1,126 people/km²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Median Age:</span>
                        <span className="font-medium">59.6 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Source:</span>
                        <span className="font-medium text-blue-600">UN World Population Prospects 2024</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-yellow-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">🏛️</span>
                      Unique Characteristics
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                        <span>World's smallest sovereign state by area and population</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                        <span>Primarily composed of clergy and Swiss Guard</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                        <span>Extremely elderly population (median age 59.6 years)</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                        <span>Declining population (-1.8% growth rate)</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                        <span>Age distribution modeled based on religious community demographics</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-0.5">ℹ️</span>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Data Transparency Note</h4>
                      <p className="text-sm text-blue-800">
                        Vatican City demographic data combines official UN population statistics with realistic age distribution modeling 
                        based on the unique characteristics of a religious state. The age breakdown reflects the typical demographic 
                        profile of clergy and religious communities, with a median age of 59.6 years as reported by the UN.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TIMELINE PYRAMID - Interactive Animation - Skip for Vatican City */}
          {countrySlug !== 'vatican-city' && (
            <section id="timeline" className="mb-12">
              <TimelinePyramid
                countryData={countryData}
                countryName={countryData.countryName}
                height={500}
              />
            </section>
          )}

          {/* Collapsible Table of Contents */}
          <details className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <summary className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-3">📑</span>
                <span className="font-semibold text-gray-900">Page Navigation</span>
                <span className="text-sm text-gray-500 ml-2">(Quick jump to sections)</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <a href="#sex-ratio" className="flex items-center py-2 px-3 rounded-md text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="font-medium">Gender Balance Analysis</span>
                    <span className="text-xs text-gray-500">Male-to-female ratio & distribution</span>
                  </div>
                </a>
                <a href="#median-age" className="flex items-center py-2 px-3 rounded-md text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="font-medium">Population Age Profile</span>
                    <span className="text-xs text-gray-500">Median age & generational structure</span>
                  </div>
                </a>
                <a href="#age-distribution" className="flex items-center py-2 px-3 rounded-md text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="font-medium">Complete Age Breakdown</span>
                    <span className="text-xs text-gray-500">Youth, working age & elderly cohorts</span>
                  </div>
                </a>
                <a href="#demographic-stage" className="flex items-center py-2 px-3 rounded-md text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="font-medium">Demographic Transition Model</span>
                    <span className="text-xs text-gray-500">Development stage classification</span>
                  </div>
                </a>
                <a href="#fertility-rate" className="flex items-center py-2 px-3 rounded-md text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="font-medium">Birth Rate & Fertility Trends</span>
                    <span className="text-xs text-gray-500">Historical & projected fertility data</span>
                  </div>
                </a>
                <a href="#stats" className="flex items-center py-2 px-3 rounded-md text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="font-medium">Comprehensive Statistics</span>
                    <span className="text-xs text-gray-500">Key demographic indicators table</span>
                  </div>
                </a>
                <a href="#analysis" className="flex items-center py-2 px-3 rounded-md text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 flex-shrink-0"></span>
                  <div className="flex flex-col">
                    <span className="font-medium">Expert Demographic Analysis</span>
                    <span className="text-xs text-gray-500">Academic assessment & implications</span>
                  </div>
                </a>
              </div>
            </div>
          </details>

          {/* Sex Ratio Section - Prominent for SEO */}
          {(
            <section id="sex-ratio" className="mb-12">
              <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-lg shadow-sm p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">⚖️</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Sex Ratio &amp; Gender Distribution
                  </h2>
                </div>
                
                <div className="bg-white rounded-lg p-5 border border-purple-100">
                  <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {countryData.countryName} has <span className="text-purple-700 font-bold">{metrics.sexRatio.toFixed(1)} males per 100 females</span> (sex ratio)
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800 flex items-center">
                        <span className="text-blue-500 mr-2">♂️</span> Male Statistics
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex justify-between">
                          <span>Population:</span>
                          <span className="font-medium">{metrics.malePopulation.toLocaleString()}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Percentage:</span>
                          <span className="font-medium">{metrics.malePercent.toFixed(1)}%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Surplus:</span>
                          <span className="font-medium text-blue-600">
                            +{(metrics.malePopulation - metrics.femalePopulation).toLocaleString()}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800 flex items-center">
                        <span className="text-pink-500 mr-2">♀️</span> Female Statistics
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex justify-between">
                          <span>Population:</span>
                          <span className="font-medium">{metrics.femalePopulation.toLocaleString()}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Percentage:</span>
                          <span className="font-medium">{metrics.femalePercent.toFixed(1)}%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Ratio Format:</span>
                          <span className="font-medium">1:{(1 / (metrics.sexRatio / 100)).toFixed(3)}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">Sex Ratio Analysis</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="font-medium text-purple-900 mb-1">Male to Female Ratio</div>
                        <div className="text-lg font-bold text-purple-700">
                          {(metrics.sexRatio / 100).toFixed(3)}:1
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="font-medium text-blue-900 mb-1">Gender Balance</div>
                        <div className="text-lg font-bold text-blue-700">
                          {metrics.sexRatio > 100 ? 'Male' : 'Female'} surplus: {Math.abs(metrics.sexRatio - 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <p>
                      The sex ratio of {countryData.countryName} indicates {metrics.sexRatio > 100 ? 'more males than females' : metrics.sexRatio < 100 ? 'more females than males' : 'equal gender distribution'}. 
                      This gender ratio affects various socioeconomic factors including marriage markets, labor force composition, and demographic trends. 
                      Understanding {countryData.countryName}'s sex ratio is crucial for policy planning and demographic analysis.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Median Age Section - Prominent for SEO */}
          {(
            <section id="median-age" className="mb-12">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow-sm p-6 border border-amber-200">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">📊</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Median Age Analysis
                  </h2>
                </div>
                
                <div className="bg-white rounded-lg p-5 border border-amber-100">
                  <div className="mb-6">
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {countryData.countryName}'s median age is <span className="text-amber-700 text-3xl">{metrics.medianAge.toFixed(1)}</span> years
                    </p>
                    <p className="text-gray-600">
                      Half the population is younger than {metrics.medianAge.toFixed(1)} years, half is older - indicating a {metrics.medianAge < 25 ? 'very young' : metrics.medianAge < 35 ? 'young' : metrics.medianAge < 45 ? 'middle-aged' : 'aging'} society
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-amber-50 rounded-lg p-4 text-center">
                      <div className="text-sm text-amber-900 font-medium mb-1">Current Median Age</div>
                      <div className="text-3xl font-bold text-amber-700">{metrics.medianAge.toFixed(1)}</div>
                      <div className="text-xs text-amber-600 mt-1">years (2024)</div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-sm text-blue-900 font-medium mb-1">World Average</div>
                      <div className="text-3xl font-bold text-blue-700">30.5</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {metrics.medianAge < 30.5 ? `${(30.5 - metrics.medianAge).toFixed(1)} years younger` : metrics.medianAge > 30.5 ? `${(metrics.medianAge - 30.5).toFixed(1)} years older` : 'Same as world'}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-sm text-green-900 font-medium mb-1">Generation Center</div>
                      <div className="text-xl font-bold text-green-700">
                        {metrics.medianAge < 25 ? 'Gen Z' : metrics.medianAge < 40 ? 'Millennials' : metrics.medianAge < 55 ? 'Gen X' : 'Baby Boomers'}
                      </div>
                      <div className="text-xs text-green-600 mt-1">Dominant generation</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-800 mb-3">What This Median Age Means</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="text-amber-500 mr-2 flex-shrink-0">📈</span>
                          <div>
                            <span className="font-medium text-gray-700">Economic Impact:</span>
                            <span className="text-gray-600 ml-1">
                              {metrics.medianAge < 30 ? 'Large young workforce driving economic growth' : 
                               metrics.medianAge < 40 ? 'Prime working-age population at peak productivity' :
                               metrics.medianAge < 50 ? 'Experienced workforce with accumulated skills' :
                               'Aging workforce requiring pension support'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-amber-500 mr-2 flex-shrink-0">🏥</span>
                          <div>
                            <span className="font-medium text-gray-700">Healthcare Needs:</span>
                            <span className="text-gray-600 ml-1">
                              {metrics.medianAge < 30 ? 'Focus on maternal and child health services' :
                               metrics.medianAge < 40 ? 'Preventive care and family health priorities' :
                               metrics.medianAge < 50 ? 'Chronic disease management becoming important' :
                               'Elderly care and geriatric services critical'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="text-amber-500 mr-2 flex-shrink-0">🎓</span>
                          <div>
                            <span className="font-medium text-gray-700">Education Focus:</span>
                            <span className="text-gray-600 ml-1">
                              {metrics.medianAge < 30 ? 'High demand for universities and vocational training' :
                               metrics.medianAge < 40 ? 'Professional development and reskilling programs' :
                               metrics.medianAge < 50 ? 'Mid-career education and leadership training' :
                               'Lifelong learning and retirement preparation'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-amber-500 mr-2 flex-shrink-0">🏘️</span>
                          <div>
                            <span className="font-medium text-gray-700">Social Planning:</span>
                            <span className="text-gray-600 ml-1">
                              {metrics.medianAge < 30 ? 'Youth employment and housing priorities' :
                               metrics.medianAge < 40 ? 'Family support and childcare services' :
                               metrics.medianAge < 50 ? 'Retirement planning infrastructure' :
                               'Elder care and social security focus'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <p>
                      The median age of {countryData.countryName} at {metrics.medianAge.toFixed(1)} years reflects its demographic structure and development stage. 
                      This median age impacts everything from consumer markets to healthcare planning. 
                      Understanding {countryData.countryName}'s median age helps predict economic trends, social needs, and future demographic transitions.
                      The average age will continue evolving based on birth rates, life expectancy, and migration patterns.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Complete Age Distribution & Youth Demographics - Merged Section */}
          {(
            <section id="age-distribution" className="mb-12">
              <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-lg shadow-sm p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">📊</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Complete Age Distribution &amp; Youth Demographics
                  </h2>
                </div>
                
                <div className="bg-white rounded-lg p-5 border border-green-100">
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {countryData.countryName} shows a {metrics.pyramidType} population structure with significant youth demographics
                    </p>
                    <p className="text-gray-600">
                      Comprehensive age breakdown reveals economic potential, workforce dynamics, and policy planning needs
                    </p>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                      <div className="text-sm text-blue-900 font-medium mb-1">Youth (0-14)</div>
                      <div className="text-2xl font-bold text-blue-700 mb-1">{metrics.youthPercentage.toFixed(1)}%</div>
                      <div className="text-xs text-blue-500">{metrics.youthPopulation.toLocaleString()}</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                      <div className="text-sm text-orange-900 font-medium mb-1">Under 25</div>
                      <div className="text-2xl font-bold text-orange-700 mb-1">42.4%</div>
                      <div className="text-xs text-orange-500">615,000,000</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                      <div className="text-sm text-green-900 font-medium mb-1">Working Age</div>
                      <div className="text-2xl font-bold text-green-700 mb-1">{metrics.workingAgePercentage.toFixed(1)}%</div>
                      <div className="text-xs text-green-500">{metrics.workingAgePopulation.toLocaleString()}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                      <div className="text-sm text-purple-900 font-medium mb-1">Elderly (65+)</div>
                      <div className="text-2xl font-bold text-purple-700 mb-1">{metrics.elderlyPercentage.toFixed(1)}%</div>
                      <div className="text-xs text-purple-500">{metrics.elderlyPopulation.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Complete Age Groups Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Age Group</th>
                          <th className="text-right py-2 px-3 font-semibold text-gray-700">Population</th>
                          <th className="text-right py-2 px-3 font-semibold text-gray-700">%</th>
                          <th className="text-center py-2 px-3 font-semibold text-gray-700">Category</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-xs">
                        {yearData.ageGroups.map((ageGroup, index) => {
                          const isYouth = ['0-4', '5-9', '10-14'].includes(ageGroup.ageRange);
                          const isYoungAdult = ['15-19', '20-24'].includes(ageGroup.ageRange);
                          const isWorking = !isYouth && !isYoungAdult && !['65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+'].includes(ageGroup.ageRange);
                          const isElderly = ['65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+'].includes(ageGroup.ageRange);
                          
                          let bgColor = 'bg-gray-25';
                          let textColor = 'text-gray-700';
                          let categoryColor = 'bg-gray-100 text-gray-800';
                          let categoryText = 'Adult';
                          
                          if (isYouth) {
                            bgColor = 'bg-blue-25';
                            textColor = 'text-blue-700';
                            categoryColor = 'bg-blue-100 text-blue-800';
                            categoryText = 'Youth';
                          } else if (isYoungAdult) {
                            bgColor = 'bg-orange-25';
                            textColor = 'text-orange-700';
                            categoryColor = 'bg-orange-100 text-orange-800';
                            categoryText = 'Young Adult';
                          } else if (isWorking) {
                            bgColor = 'bg-green-25';
                            textColor = 'text-green-700';
                            categoryColor = 'bg-green-100 text-green-800';
                            categoryText = 'Working Age';
                          } else if (isElderly) {
                            bgColor = 'bg-purple-25';
                            textColor = 'text-purple-700';
                            categoryColor = 'bg-purple-100 text-purple-800';
                            categoryText = 'Senior';
                          }
                          
                          return (
                            <tr key={index} className={bgColor}>
                              <td className={`py-2 px-3 font-medium ${textColor}`}>{ageGroup.ageRange}</td>
                              <td className={`py-2 px-3 text-right font-medium ${textColor}`}>{ageGroup.total.toLocaleString()}</td>
                              <td className={`py-2 px-3 text-right font-medium ${textColor}`}>{ageGroup.totalPercent.toFixed(1)}%</td>
                              <td className="py-2 px-3 text-center">
                                <span className={`px-1 py-1 rounded text-xs font-medium ${categoryColor}`}>{categoryText}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Youth Advantage & Economic Impact */}
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                        <span className="text-lg mr-2">💼</span> Youth Economic Impact
                      </h3>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• <strong>42.4% under 25:</strong> Massive young consumer market</li>
                        <li>• <strong>17.8% young adults (15-24):</strong> Prime workforce entry</li>
                        <li>• Innovation and entrepreneurship potential</li>
                        <li>• Technology adoption and digital economy drivers</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                        <span className="text-lg mr-2">🎯</span> Age-Specific Policy Needs
                      </h3>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• <strong>0-14 years:</strong> Education infrastructure expansion</li>
                        <li>• <strong>15-24 years:</strong> Job creation and skill training</li>
                        <li>• <strong>25-64 years:</strong> Career development support</li>
                        <li>• <strong>65+ years:</strong> Healthcare and pension systems</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <p>
                      This detailed age distribution reveals {countryData.countryName}'s demographic advantages: a large youth population (42.4% under 25) creating economic opportunities, a substantial working-age population (68.4%) driving productivity, and manageable elderly dependency (7.4% over 65). 
                      Understanding each age group's needs enables targeted policy development for education, employment, healthcare, and social services.
                    </p>
                  </div>
                  
                  {/* 2026 Age Distribution Forecast */}
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">🔮</span>
                      <h4 className="font-semibold text-blue-900">{countryData.countryName} Demographics 2026 Forecast</h4>
                    </div>
                    <p className="text-sm text-blue-800">
                      {countryData.countryName} population 2026 projections will show continued demographic transition. 
                      The UN World Population Prospects 2026 revision (July 2026) will update {countryData.countryName} age distribution 2026, 
                      providing new insights into youth population trends, working-age dynamics, and aging patterns for policy planning.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Demographic Transition Stage */}
          <section id="demographic-stage" className="mb-12">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm p-6 border border-green-200">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📊</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  Demographic Transition Model (DTM) Stage
                </h2>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <p className="text-gray-800 leading-relaxed">
                  {stageExplanation.split('. ').map((sentence, index, array) => {
                    const isLastSentence = index === array.length - 1;
                    const trimmedSentence = sentence.trim();
                    
                    if (isLastSentence && trimmedSentence.includes('You can read more')) {
                      const [beforeLink, afterHere] = trimmedSentence.split('You can read more about ');
                      if (afterHere) {
                        const [linkText] = afterHere.split(' here');
                        return (
                          <span key={index}>
                            {beforeLink}You can read more about{' '}
                            <Link 
                              href={demographicStage.link}
                              className="text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                              {linkText}
                            </Link>
                            {' '}here.
                          </span>
                        );
                      }
                    }
                    
                    return <span key={index}>{trimmedSentence}{index < array.length - 1 ? '. ' : ''}</span>;
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* Fertility Rate Section - SEO Optimized */}
          {fertilityData && (
            <section id="fertility-rate" className="mb-12">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg shadow-sm p-6 border border-red-200">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">👶</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Fertility Rate & Birth Statistics
                  </h2>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  {/* Left Side - Data Summary */}
                  <div className="bg-white rounded-lg p-5 border border-red-100">
                    <div className="mb-6">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        {countryData.countryName} Total Fertility Rate: <span className="text-red-700 text-3xl">{fertilityData.fertilityData.current.totalFertilityRate?.toFixed(2) || 'N/A'}</span> children per woman
                      </p>
                      <p className="text-gray-600">
                        {(fertilityData.fertilityData.current.totalFertilityRate || 0) < fertilityData.fertilityData.replacementLevel ? 
                          `Below replacement level fertility - contributing to population aging and demographic transition` :
                          `Above replacement level fertility - supporting population growth`
                        }
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                        <div className="text-sm text-red-900 font-medium mb-1">Total Fertility Rate</div>
                        <div className="text-3xl font-bold text-red-700 mb-1">{fertilityData.fertilityData.current.totalFertilityRate?.toFixed(2) || 'N/A'}</div>
                        <div className="text-xs text-red-500">children per woman</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                        <div className="text-sm text-orange-900 font-medium mb-1">Crude Birth Rate</div>
                        <div className="text-3xl font-bold text-orange-700 mb-1">{fertilityData.fertilityData.historical.find(d => d.year === fertilityData.fertilityData.current.year)?.crudebirthRate || fertilityData.fertilityData.historical[fertilityData.fertilityData.historical.length - 1]?.crudebirthRate || 'N/A'}</div>
                        <div className="text-xs text-orange-500">per 1,000 people</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200">
                        <div className="text-sm text-yellow-900 font-medium mb-1">Replacement Level</div>
                        <div className="text-3xl font-bold text-yellow-700 mb-1">{fertilityData.fertilityData.replacementLevel}</div>
                        <div className="text-xs text-yellow-500">children per woman</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                        <div className="text-sm text-purple-900 font-medium mb-1">Global Rank</div>
                        <div className="text-3xl font-bold text-purple-700 mb-1">{fertilityData.fertilityData.worldComparison.rank}</div>
                        <div className="text-xs text-purple-500">of {fertilityData.fertilityData.worldComparison.totalCountries} countries</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Fertility Chart */}
                  <div>
                    <FertilityChart 
                      fertilityData={fertilityData}
                      countryName={countryData.countryName}
                    />
                  </div>
                </div>

                {/* Historical Fertility Trends Table */}
                <div className="bg-white rounded-lg p-5 border border-red-100 mb-6">
                  <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Historical Fertility Trends</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left py-2 px-4 font-semibold text-gray-700">Year</th>
                            <th className="text-center py-2 px-4 font-semibold text-gray-700">Total Fertility Rate</th>
                            <th className="text-center py-2 px-4 font-semibold text-gray-700">Birth Rate</th>
                            <th className="text-center py-2 px-4 font-semibold text-gray-700">Change</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {fertilityData.fertilityData.historical.slice(-6).map((yearDataPoint, index) => (
                            <tr key={yearDataPoint.year} className={index === fertilityData.fertilityData.historical.slice(-6).length - 1 ? 'bg-red-25 font-medium' : ''}>
                              <td className="py-2 px-4">{yearDataPoint.year}</td>
                              <td className="py-2 px-4 text-center">{yearDataPoint.totalFertilityRate}</td>
                              <td className="py-2 px-4 text-center">{yearDataPoint.crudebirthRate}</td>
                              <td className="py-2 px-4 text-center">
                                {index > 0 && (
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    yearDataPoint.totalFertilityRate < fertilityData.fertilityData.historical.slice(-6)[index - 1].totalFertilityRate 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {yearDataPoint.totalFertilityRate < fertilityData.fertilityData.historical.slice(-6)[index - 1].totalFertilityRate ? '↓' : '↑'}
                                    {Math.abs(yearDataPoint.totalFertilityRate - fertilityData.fertilityData.historical.slice(-6)[index - 1].totalFertilityRate).toFixed(2)}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Analysis Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <span className="text-lg mr-2">📊</span> Demographic Impact
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Population Growth:</strong> {(fertilityData.fertilityData.current.totalFertilityRate || 0) < 2.1 ? 'Declining momentum' : 'Continuing growth'}</li>
                      <li>• <strong>Age Structure:</strong> {(fertilityData.fertilityData.current.totalFertilityRate || 0) < 2.0 ? 'Aging population' : 'Young population'}</li>
                      <li>• <strong>Workforce:</strong> {(fertilityData.fertilityData.current.totalFertilityRate || 0) < 1.8 ? 'Shrinking future workforce' : 'Stable workforce pipeline'}</li>
                      <li>• <strong>Economic Impact:</strong> {(fertilityData.fertilityData.current.totalFertilityRate || 0) < 2.1 ? 'Pension system pressure' : 'Economic growth potential'}</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <span className="text-lg mr-2">🌍</span> Global Context
                    </h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• <strong>World Average:</strong> {fertilityData.fertilityData.worldComparison.worldAverage} children per woman</li>
                      <li>• <strong>Comparison:</strong> {(fertilityData.fertilityData.current.totalFertilityRate || 0) < fertilityData.fertilityData.worldComparison.worldAverage ? 'Below' : 'Above'} global average</li>
                      <li>• <strong>Development Stage:</strong> {(fertilityData.fertilityData.current.totalFertilityRate || 0) < 2.1 ? 'Post-demographic transition' : 'Demographic transition'}</li>
                      <li>• <strong>Future Projections:</strong> {fertilityData.fertilityData.projections.length > 0 ? `${fertilityData.fertilityData.projections[0].totalFertilityRate} by ${fertilityData.fertilityData.projections[0].year}` : 'Continued decline expected'}</li>
                    </ul>
                  </div>
                </div>

                {/* 2026 Update Notice */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🔮</span>
                    <h3 className="font-semibold text-yellow-800">2026 Fertility Rate Projections</h3>
                  </div>
                  <p className="text-sm text-yellow-700">
                    <strong>📅 Next Update:</strong> {countryData.countryName} fertility rate 2026 data will be released with UN World Population Prospects 2026 revision. 
                    Current projections suggest {(fertilityData.fertilityData.current.totalFertilityRate || 0) < 2.0 ? 'continued decline' : 'stabilization'} in birth rates, 
                    impacting long-term demographic planning and economic policies.
                  </p>
                </div>

                {/* Expert Analysis */}
                <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <p>{getFertilityAnalysis(fertilityData, countryData.countryName)}</p>
                </div>
              </div>
            </section>
          )}

          {/* Historical Changes - Skip for Vatican City */}
          {countrySlug !== 'vatican-city' && (
            <section id="timeline" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Historical Demographic Changes
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {content.historicalChanges.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Understanding Demographics Section */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understanding {countryData.countryName}'s Demographics
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {content.understanding.split('\n\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </section>

          {/* Expert Demographic Analysis */}
          <section id="analysis" className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-sm p-8 mb-8 border border-indigo-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🎓</span>
              <h2 className="text-3xl font-bold text-gray-900">
                Demographic Analysis: {countryData.countryName}'s Population Structure
              </h2>
            </div>
            <p className="text-gray-600 mb-6 italic">
              Professional demographic assessment using academic terminology and analytical frameworks
            </p>
            
            <div className="space-y-6">
              {/* Demographic Dividend */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">📈</span>
                  Demographic Dividend Window
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {expertAnalysis.demographicDividend}
                </p>
              </div>

              {/* Fertility Transition */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
                <h3 className="text-xl font-bold text-purple-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">👶</span>
                  Fertility Transition Stage
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {expertAnalysis.fertilityTransition}
                </p>
              </div>

              {/* Demographic Momentum */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">⚡</span>
                  Demographic Momentum
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {expertAnalysis.demographicMomentum}
                </p>
              </div>

              {/* Population Aging Speed */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
                <h3 className="text-xl font-bold text-orange-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">⏰</span>
                  Population Aging Speed
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {expertAnalysis.agingSpeed}
                </p>
              </div>

              {/* Professional Assessment */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="text-xl mr-2">🔬</span>
                  Professional Assessment
                </h3>
                <p className="leading-relaxed text-justify">
                  {expertAnalysis.professionalAssessment}
                </p>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600 italic">
              <p>* Analysis based on demographic transition theory, dependency ratio calculations, and population momentum principles used in professional demographic research.</p>
            </div>
          </section>

          {/* Age Distribution Analysis */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Age Distribution Analysis
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {content.ageDistribution.split('\n\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </section>

          {/* What This Means Section */}
          <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm p-8 mb-8 border border-green-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What This Means for {countryData.countryName}
            </h2>
            <p className="text-gray-600 mb-6">
              Understanding the practical implications of {countryData.countryName}'s demographic structure for key sectors and policy areas.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Economy */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-green-100">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">💼</span>
                    <h3 className="text-xl font-bold text-gray-900">Economy</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {implications.economy}
                  </p>
                </div>

                {/* Healthcare */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-blue-100">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🏥</span>
                    <h3 className="text-xl font-bold text-gray-900">Healthcare</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {implications.healthcare}
                  </p>
                </div>

                {/* Employment */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-purple-100">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">👥</span>
                    <h3 className="text-xl font-bold text-gray-900">Employment</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {implications.employment}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Education */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-yellow-100">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🎓</span>
                    <h3 className="text-xl font-bold text-gray-900">Education</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {implications.education}
                  </p>
                </div>

                {/* Pensions */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-red-100">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">💰</span>
                    <h3 className="text-xl font-bold text-gray-900">Pensions</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {implications.pensions}
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg p-5 shadow-sm">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">📊</span>
                    <h3 className="text-xl font-bold">Key Takeaway</h3>
                  </div>
                  <p className="leading-relaxed">
                    {implications.summary}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Table */}
          <section id="stats" className="mb-12">
            <StatsTable 
              data={yearData} 
              metrics={metrics} 
              countryName={countryData.countryName}
              year={latestYear}
            />
          </section>


          {/* Demographic Charts */}
          <section className="mb-12">
            <DemographicCharts
              countryName={countryData.countryName}
              countryData={countryData}
              currentYearData={yearData}
              currentMetrics={metrics}
            />
          </section>

          {/* Future Trends */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Future Demographic Trends
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {content.futureTrends.split('\n\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </section>

          {/* Historical Events Section - Skip for Vatican City */}
          {countrySlug !== 'vatican-city' && (
            <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow-sm p-8 mb-8 border border-amber-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📚</span>
              <h2 className="text-3xl font-bold text-gray-900">
                Major Events That Shaped {countryData.countryName}'s Demographics
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Understanding the historical events and policy decisions that created {countryData.countryName}'s current population structure.
            </p>
            
            <div className="space-y-6">
              {historicalEvents.events.map((event, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-amber-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-900 mr-3">
                          {event.title}
                        </h3>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full">
                          {event.period}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {event.description}
                      </p>
                      <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border-l-4 border-amber-400">
                        <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                          <span className="text-lg mr-2">📊</span>
                          Demographic Impact
                        </h4>
                        <p className="text-amber-800 leading-relaxed">
                          {event.demographicImpact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🎯</span>
                <h3 className="text-xl font-bold">Historical Context Summary</h3>
              </div>
              <p className="leading-relaxed">
                {historicalEvents.summary}
              </p>
            </div>

            <div className="mt-6 text-sm text-gray-600 italic">
              <p>* Historical events selected based on their documented impact on population patterns, fertility rates, mortality, migration, and age structure changes.</p>
            </div>
          </section>
          )}

          {/* Decade-by-Decade Breakdown */}
          <section className="mb-8">
            <DecadeBreakdown
              countryName={countryData.countryName}
              countrySlug={countrySlug}
              countryData={countryData}
            />
          </section>

          {/* Regional Comparison */}
          <section className="mb-8">
            <RegionalComparison
              currentCountry={{
                slug: countrySlug,
                name: countryData.countryName,
                data: yearData,
                metrics: metrics
              }}
              year={latestYear}
            />
          </section>

          {/* Comprehensive FAQ Section */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">❓</span>
              <h2 className="text-3xl font-bold text-gray-900">
                Frequently Asked Questions About {countryData.countryName}
              </h2>
            </div>
            <p className="text-gray-600 mb-8">
              Comprehensive answers to the most common questions about {countryData.countryName}'s demographics, 
              population trends, and societal implications based on current data and analysis.
            </p>
            
            {/* FAQ Categories Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {['All', 'Population', 'Age Structure', 'Economic', 'Social', 'Migration', 'Comparison', 'Trends'].map((category) => (
                  <button
                    key={category}
                    className="px-4 py-2 text-sm rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-700 transition"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {expandedFAQs.map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition">
                  <div className="flex items-start mb-3">
                    <span className="text-lg mr-2">
                      {faq.category === 'population' ? '👥' : 
                       faq.category === 'age' ? '📊' :
                       faq.category === 'fertility' ? '👶' :
                       faq.category === 'migration' ? '✈️' :
                       faq.category === 'comparison' ? '🌍' :
                       faq.category === 'trends' ? '📈' :
                       faq.category === 'social' ? '🏛️' :
                       faq.category === 'economic' ? '💼' : '❓'}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {faq.answer}
                  </p>
                  <div className="mt-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                      {faq.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Summary */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Understanding {countryData.countryName}'s Demographics
              </h3>
              <p className="text-gray-700 leading-relaxed">
                These comprehensive questions and answers provide deep insights into {countryData.countryName}'s 
                population dynamics, demographic challenges, and development opportunities. The analysis covers 
                historical trends, current patterns, future projections, and policy implications to help understand 
                the complex relationships between demographics and societal development.
              </p>
            </div>
          </section>

          {/* Regional Comparison Section */}
          <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare with Other Countries
            </h2>
            <p className="text-gray-600 mb-6">
              See how {countryData.countryName}'s demographic structure compares to similar or neighboring countries.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getComparisons(countrySlug).map(compSlug => {
                const compCountry = countries.find(c => c.slug === compSlug);
                if (!compCountry) return null;
                
                return (
                  <Link
                    key={compSlug}
                    href={`/compare?c1=${countrySlug}&c2=${compSlug}&year=${latestYear}`}
                    className="group border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg transition"
                  >
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">{compCountry.flag}</div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                        vs {compCountry.name}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Pop: {(compCountry.population2024 / 1000000).toFixed(1)}M</div>
                      <div className="text-blue-600 font-medium">Compare →</div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <Link
                href="/compare"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Compare Any Two Countries
              </Link>
            </div>
          </section>

          {/* Related Demographics Section */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">📋</span>
              <h2 className="text-3xl font-bold text-gray-900">
                Other Demographic Indicators for {countryData.countryName}
              </h2>
            </div>
            <p className="text-gray-600 mb-8">
              Beyond age structure and population size, these additional demographic indicators provide comprehensive 
              context for understanding {countryData.countryName}'s development patterns and social trends.
            </p>

            <div className="space-y-8">
              {relatedDemographics.indicators.map((indicator, index) => (
                <div key={index} className="border-l-4 border-blue-400 bg-blue-50 p-6 rounded-r-lg">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">{indicator.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {indicator.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {indicator.content}
                  </p>

                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="text-lg mr-2">🔗</span>
                      Authoritative Sources
                    </h4>
                    <div className="space-y-2">
                      {indicator.sources.map((source, sourceIndex) => (
                        <div key={sourceIndex} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <div>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              {source.name} →
                            </a>
                            <p className="text-gray-600 text-xs mt-1">
                              {source.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🎯</span>
                <h3 className="text-xl font-bold">Comprehensive Demographic Context</h3>
              </div>
              <p className="leading-relaxed">
                {relatedDemographics.summary}
              </p>
            </div>

            <div className="mt-6 text-sm text-gray-600 italic">
              <p>
                * Data estimates based on demographic patterns and regional trends. 
                For precise current statistics, consult the linked authoritative sources.
              </p>
            </div>
          </section>

          {/* Glossary Section */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">📖</span>
              <h2 className="text-3xl font-bold text-gray-900">
                Understanding Demographic Terms for {countryData.countryName}
              </h2>
            </div>
            <p className="text-gray-600 mb-8">
              Key demographic concepts explained in the specific context of {countryData.countryName}'s 
              population data and development patterns.
            </p>

            <div className="grid lg:grid-cols-2 gap-6">
              {glossaryTerms.map((term, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {term.term}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {term.definition}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-300 mb-3">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                      <span className="text-lg mr-2">🏛️</span>
                      For {countryData.countryName}
                    </h4>
                    <p className="text-green-800 text-sm leading-relaxed">
                      {term.context}
                    </p>
                  </div>

                  <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <span className="text-sm mr-2">💡</span>
                      Global Context
                    </h4>
                    <p className="text-blue-800 text-xs leading-relaxed">
                      {term.example}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Glossary Summary */}
            <div className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🎓</span>
                <h3 className="text-xl font-bold">Demographic Literacy</h3>
              </div>
              <p className="leading-relaxed">
                {glossarySummary}
              </p>
            </div>

            {/* Voice Search Optimization */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="text-lg mr-2">🎤</span>
                Voice Search Friendly
              </h4>
              <p className="text-gray-700 text-sm">
                These definitions are optimized for voice search queries like "What is dependency ratio in {countryData.countryName}?" 
                or "Define median age for {countryData.countryName}."
              </p>
            </div>
          </section>

          {/* How to Use This Data Section */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">🎯</span>
              <h2 className="text-3xl font-bold text-gray-900">
                How to Use {countryData.countryName}'s Demographic Data
              </h2>
            </div>
            <p className="text-gray-600 mb-8">
              This demographic analysis serves multiple audiences with specific applications for education, 
              research, policy making, business strategy, and media reporting.
            </p>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-hidden">
              {usageGuides.map((guide, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200 hover:shadow-lg transition overflow-hidden">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{guide.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {guide.audience}
                      </h3>
                      <p className="text-sm text-purple-700 font-medium">
                        {guide.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {guide.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm">
                      Key Applications:
                    </h4>
                    <ul className="space-y-1">
                      {guide.applications.slice(0, 3).map((application, appIndex) => (
                        <li key={appIndex} className="text-xs text-gray-700 flex items-start">
                          <span className="text-purple-600 mr-2 flex-shrink-0">•</span>
                          <span className="break-words">{application}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {guide.citation && (
                    <div className="bg-white rounded-lg p-3 border border-purple-300 mb-3">
                      <h4 className="font-semibold text-purple-900 mb-1 text-xs">
                        Citation Format:
                      </h4>
                      <p className="text-xs text-purple-800 font-mono leading-relaxed break-all">
                        {guide.citation}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
                    <h4 className="font-semibold text-blue-900 mb-2 text-xs">
                      Best Practices:
                    </h4>
                    <ul className="space-y-1">
                      {guide.tips.slice(0, 2).map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-xs text-blue-800 flex items-start">
                          <span className="text-blue-600 mr-1 flex-shrink-0">→</span>
                          <span className="break-words">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Usage Summary */}
            <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📊</span>
                <h3 className="text-xl font-bold">Data Usage Guidelines</h3>
              </div>
              <p className="leading-relaxed">
                {usageSummary}
              </p>
            </div>

            {/* Quick Access */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-lg mr-2">⚡</span>
                Quick Access for Different Users
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {usageGuides.map((guide, index) => (
                  <button
                    key={index}
                    className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition text-center"
                    title={`Jump to ${guide.audience} section`}
                  >
                    {guide.icon} {guide.audience}
                  </button>
                ))}
              </div>
            </div>
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