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
import TimelinePyramid from '@/components/TimelinePyramid';
import StatsTable from '@/components/StatsTable';
import DemographicCharts from '@/components/DemographicCharts';
import RegionalComparison from '@/components/RegionalComparison';
import DecadeBreakdown from '@/components/DecadeBreakdown';
import ShareButtons from '@/components/ShareButtons';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface CountryPageProps {
  params: {
    'country-population-pyramid': string;
  };
}

export async function generateStaticParams() {
  const countries = await loadCountries();
  return countries.map(country => ({
    'country-population-pyramid': `${country.slug}-population-pyramid`
  }));
}

export async function generateMetadata({ params }: CountryPageProps) {
  try {
    const countrySlug = params['country-population-pyramid'].replace('-population-pyramid', '');
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
    const countrySlug = params['country-population-pyramid'].replace('-population-pyramid', '');
    const countryData = await loadCountryData(countrySlug);
    const countries = await loadCountries();
    const availableYears = getAvailableYears(countryData);
    const latestYear = Math.max(...availableYears);
    const yearData = countryData.years[latestYear.toString()];
    const metrics = calculateMetrics(yearData);
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

          {/* TIMELINE PYRAMID - Interactive Animation */}
          <section className="mb-12">
            <TimelinePyramid
              countryData={countryData}
              countryName={countryData.countryName}
              height={500}
            />
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
          <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-sm p-8 mb-8 border border-indigo-200">
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
          <section className="mb-12">
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

          {/* Historical Events Section */}
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

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {usageGuides.map((guide, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200 hover:shadow-lg transition">
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
                          <span>{application}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {guide.citation && (
                    <div className="bg-white rounded-lg p-3 border border-purple-300 mb-3">
                      <h4 className="font-semibold text-purple-900 mb-1 text-xs">
                        Citation Format:
                      </h4>
                      <p className="text-xs text-purple-800 font-mono leading-relaxed">
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
                          <span>{tip}</span>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
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
            url={`https://populationpyramids.org/${params['country-population-pyramid']}`}
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