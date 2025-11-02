import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadCountryData, getAvailableYears } from '@/lib/data-loader';
import { calculateMetrics } from '@/lib/calculations';
import { generateCountryContent } from '@/lib/content-generator';
import { generateImplications } from '@/lib/implications-analyzer';
import PopulationPyramid from '@/components/PopulationPyramid';
import StatsTable from '@/components/StatsTable';
import ShareButtons from '@/components/ShareButtons';

// Force dynamic rendering
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

        {/* Stats Table */}
        <section className="mb-12">
          <StatsTable 
            data={yearData} 
            metrics={metrics} 
            countryName={countryData.countryName}
            year={latestYear}
          />
        </section>

        {/* Demographic Glossary */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">📖</span>
            <h2 className="text-3xl font-bold text-gray-900">
              Understanding Demographic Terms for {countryData.countryName}
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Key demographic concepts explained in the specific context of {countryData.countryName}'s population data and development patterns.
          </p>

          <div className="grid lg:grid-cols-2 gap-6">
            {[
              {
                term: "Population Pyramid",
                definition: "A graphical representation of the age and sex distribution of a population, with males typically shown on the left and females on the right.",
                context: `${countryData.countryName}'s population pyramid shows a ${metrics.pyramidType || 'expanding'} pattern, indicating the country's demographic stage.`,
                example: "Countries with young populations show wide bases, while aging populations show narrow bases and wider tops."
              },
              {
                term: "Median Age",
                definition: "The age that divides a population into two equal halves - half younger and half older than this age.",
                context: `With a median age of ${yearData.medianAge?.toFixed(1) || '25'} years, ${countryData.countryName} has a ${(yearData.medianAge || 25) < 30 ? 'young' : (yearData.medianAge || 25) < 40 ? 'mature' : 'aging'} population structure.`,
                example: "Global median age is approximately 30 years, with significant variation between developed and developing countries."
              },
              {
                term: "Dependency Ratio",
                definition: "The ratio of dependents (people younger than 15 or older than 64) to the working-age population (ages 15-64).",
                context: `${countryData.countryName}'s dependency ratio of ${metrics.dependencyRatio.toFixed(1)} means ${metrics.dependencyRatio.toFixed(1)} dependents per 100 working-age people.`,
                example: "High ratios indicate greater economic burden on the working population to support dependents."
              },
              {
                term: "Population Growth Rate",
                definition: "The annual rate at which a population increases or decreases as a percentage of the total population.",
                context: `${countryData.countryName}'s current growth patterns reflect economic development, healthcare improvements, and demographic transition.`,
                example: "Global population growth has slowed from 2.1% in the 1960s to about 1.0% today."
              }
            ].map((term, index) => (
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
        </section>

        {/* How to Use This Data */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">🎯</span>
            <h2 className="text-3xl font-bold text-gray-900">
              How to Use {countryData.countryName}'s Demographic Data
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            This demographic analysis serves multiple audiences with specific applications for education, research, policy making, business strategy, and media reporting.
          </p>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              {
                audience: "Students & Educators",
                icon: "🎓",
                title: "Educational Applications",
                description: "Use this data for geography, social studies, economics, and demographics coursework. Perfect for research projects and comparative studies.",
                applications: [
                  "School geography projects and presentations",
                  "University demographic research papers",
                  "Comparative population studies between countries",
                  "Understanding global development patterns"
                ],
                citation: `Population Pyramids. (${new Date().getFullYear()}). ${countryData.countryName} Population Pyramid ${latestYear}. Retrieved from https://populationpyramids.org/${params.slug}`,
                tips: [
                  "Compare with neighboring countries for regional analysis",
                  "Track changes over decades to see demographic transition"
                ]
              },
              {
                audience: "Researchers",
                icon: "🔬",
                title: "Academic Research",
                description: "Comprehensive demographic data for scholarly research, policy analysis, and academic publications in demography and development studies.",
                applications: [
                  "Peer-reviewed academic publications",
                  "Demographic transition research",
                  "Development studies and policy analysis",
                  "Comparative international studies"
                ],
                citation: `UN DESA Population Division data via Population Pyramids platform. ${countryData.countryName} demographic analysis ${latestYear}.`,
                tips: [
                  "Cite original UN sources for academic credibility",
                  "Cross-reference with official national statistics"
                ]
              },
              {
                audience: "Policy Makers",
                icon: "🏛️",
                title: "Policy Development",
                description: "Essential demographic insights for evidence-based policy making in healthcare, education, employment, and social services planning.",
                applications: [
                  "Healthcare system capacity planning",
                  "Education infrastructure development",
                  "Pension and social security policy",
                  "Economic development strategies"
                ],
                citation: `Demographic analysis supporting policy brief - ${countryData.countryName} Population Structure ${latestYear}`,
                tips: [
                  "Focus on dependency ratios for social service planning",
                  "Consider demographic momentum in long-term planning"
                ]
              },
              {
                audience: "Business & Investment",
                icon: "💼",
                title: "Market Analysis",
                description: "Demographic trends for market research, investment decisions, and business strategy development in emerging and established markets.",
                applications: [
                  "Market size estimation and growth projections",
                  "Consumer demographic profiling",
                  "Infrastructure investment planning",
                  "Labor market analysis for operations"
                ],
                citation: `${countryData.countryName} Market Demographics ${latestYear} - Population Pyramids Analysis`,
                tips: [
                  "Young populations indicate growing consumer markets",
                  "Aging populations suggest healthcare and services opportunities"
                ]
              },
              {
                audience: "Media & Journalism",
                icon: "📺",
                title: "News & Reporting",
                description: "Reliable demographic context for news stories, feature articles, and documentary research on population trends and social issues.",
                applications: [
                  "News articles on demographic trends",
                  "Documentary background research",
                  "Feature stories on aging or youth bulges",
                  "International development reporting"
                ],
                citation: `According to UN demographic data via Population Pyramids, ${countryData.countryName} has...`,
                tips: [
                  "Use visualizations to illustrate demographic stories",
                  "Connect demographic data to current events and trends"
                ]
              },
              {
                audience: "General Public",
                icon: "👥",
                title: "Personal Interest",
                description: "Accessible demographic information for personal curiosity, travel planning, cultural understanding, and general knowledge about world populations.",
                applications: [
                  "Understanding countries before travel or relocation",
                  "Satisfying curiosity about global population trends",
                  "Educational family discussions and learning",
                  "Cultural and social awareness development"
                ],
                citation: `Population facts about ${countryData.countryName} from Population Pyramids website`,
                tips: [
                  "Compare your country with others to gain perspective",
                  "Explore historical trends to understand current conditions"
                ]
              }
            ].map((guide, index) => (
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

                <div className="bg-white rounded-lg p-3 border border-purple-300 mb-3">
                  <h4 className="font-semibold text-purple-900 mb-1 text-xs">
                    Citation Format:
                  </h4>
                  <p className="text-xs text-purple-800 font-mono leading-relaxed">
                    {guide.citation}
                  </p>
                </div>

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