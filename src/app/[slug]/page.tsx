import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadCountryData, getAvailableYears } from '@/lib/data-loader';
import { calculateMetrics } from '@/lib/calculations';
import { generateCountryContent } from '@/lib/content-generator';
import { generateImplications } from '@/lib/implications-analyzer';
import PopulationPyramid from '@/components/PopulationPyramid';
import StatsTable from '@/components/StatsTable';
import ShareButtons from '@/components/ShareButtons';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface CountryPageProps {
  params: {
    slug: string;
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  try {
    const countrySlug = params.slug.endsWith('-population-pyramid') 
      ? params.slug.replace('-population-pyramid', '')
      : params.slug;
      
    const countryData = await loadCountryData(countrySlug);
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

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span>{countryData.countryName}</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {countryData.countryName} Population Pyramid ({latestYear})
          </h1>
          <p className="text-lg text-gray-600">
            Interactive demographic visualization and analysis
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {(yearData.totalPopulation / 1_000_000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Total Population</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {metrics.medianAge.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Median Age</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {(metrics.growthRate * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Growth Rate</div>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {metrics.dependencyRatio.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Dependency Ratio</div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="mb-8">
          <PopulationPyramid
            data={yearData}
            countryName={countryData.countryName}
            year={latestYear}
          />
        </div>

        {/* Historical Changes */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Historical Demographic Changes in {countryData.countryName}
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {content.historicalChanges.split('\n\n').map((para, i) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
          </div>
        </section>

        {/* Understanding Demographics */}
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

        {/* Frequently Asked Questions */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">❓</span>
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions About {countryData.countryName}
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Common questions about {countryData.countryName}'s demographics, population trends, and societal implications.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {[
              {
                question: `What is the current population of ${countryData.countryName}?`,
                answer: `As of ${latestYear}, ${countryData.countryName} has a population of ${yearData.totalPopulation.toLocaleString()} people, with ${((yearData.malePopulation / yearData.totalPopulation) * 100).toFixed(1)}% male and ${((yearData.femalePopulation / yearData.totalPopulation) * 100).toFixed(1)}% female.`
              },
              {
                question: `What is the median age in ${countryData.countryName}?`,
                answer: `The median age in ${countryData.countryName} is ${yearData.medianAge?.toFixed(1) || 'approximately 25'} years, indicating the age that divides the population into two equal halves.`
              },
              {
                question: `How has ${countryData.countryName}'s population changed over time?`,
                answer: `${countryData.countryName}'s population has evolved significantly over the decades. Historical data from ${Math.min(...availableYears)} to ${latestYear} shows patterns influenced by economic development, healthcare improvements, and social changes.`
              },
              {
                question: `What are the main demographic challenges facing ${countryData.countryName}?`,
                answer: `Based on the current demographic structure, ${countryData.countryName} faces challenges related to ${metrics.dependencyRatio > 60 ? 'high dependency ratios requiring significant support systems' : 'managing population growth and development'}.`
              },
              {
                question: `What is the dependency ratio in ${countryData.countryName}?`,
                answer: `The dependency ratio in ${countryData.countryName} is ${metrics.dependencyRatio.toFixed(1)}, meaning there are ${metrics.dependencyRatio.toFixed(1)} dependents for every 100 working-age people.`
              },
              {
                question: `How does ${countryData.countryName} compare to other countries?`,
                answer: `${countryData.countryName}'s demographic profile shows unique characteristics. The median age of ${yearData.medianAge?.toFixed(1) || '25'} years and dependency ratio of ${metrics.dependencyRatio.toFixed(1)} reflect the country's position in demographic transition.`
              }
            ].map((faq, i) => (
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

        {/* Year Navigation */}
        <div className="mb-8 bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Explore Other Years</h2>
          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2">
            {availableYears.slice(-10).map(year => (
              <Link
                key={year}
                href={`/${params.slug}/${year}`}
                className={`p-2 text-center rounded transition ${
                  year === latestYear
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {year}
              </Link>
            ))}
          </div>
        </div>

        {/* Share Buttons */}
        <ShareButtons
          url={`https://populationpyramids.org/${params.slug}`}
          title={`${countryData.countryName} Population Pyramid ${latestYear}`}
          description={`Explore demographic data and population trends for ${countryData.countryName}`}
        />
      </div>
    );
  } catch (error) {
    console.error('Country page error:', error);
    notFound();
  }
}