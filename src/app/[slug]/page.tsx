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
import PopulationPyramid from '@/components/PopulationPyramid';
import StatsTable from '@/components/StatsTable';
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
  console.log('Generating params for countries:', countries.length);
  
  // Test with our 10 countries
  const testCountrySlugs = [
    'afghanistan',
    'pakistan', 
    'india',
    'china',
    'united-states',
    'brazil',
    'nigeria',
    'japan',
    'germany',
    'united-kingdom'
  ];
  
  const testCountries = countries.filter(c => testCountrySlugs.includes(c.slug));
  console.log('Filtered to test countries:', testCountries.length);
  console.log('Test countries:', testCountries.map(c => c.slug).join(', '));
  
  return testCountries.map(country => ({
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

          {/* PRIMARY PYRAMID */}
          <section className="mb-12">
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

          {/* Historical Changes */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Historical Demographic Changes
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {content.historicalChanges.split('\n\n').map((para, i) => (
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
                <div className="bg-white rounded-lg p-5 shadow-sm border border-green-100">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">💼</span>
                    <h3 className="text-xl font-bold text-gray-900">Economy</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {implications.economy}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border border-blue-100">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🏥</span>
                    <h3 className="text-xl font-bold text-gray-900">Healthcare</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {implications.healthcare}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-5 shadow-sm border border-yellow-100">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🎓</span>
                    <h3 className="text-xl font-bold text-gray-900">Education</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {implications.education}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border border-red-100">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">💰</span>
                    <h3 className="text-xl font-bold text-gray-900">Pensions</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {implications.pensions}
                  </p>
                </div>
              </div>
            </div>
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

          {/* Expert Analysis */}
          <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-sm p-8 mb-8 border border-indigo-200">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🎓</span>
              <h2 className="text-3xl font-bold text-gray-900">
                Expert Demographic Analysis
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">📈</span>
                  Demographic Dividend Window
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {expertAnalysis.demographicDividend}
                </p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">❓</span>
              <h2 className="text-3xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {expandedFAQs.slice(0, 6).map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
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