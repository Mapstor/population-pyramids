import Link from 'next/link';
import { getCountriesWithPopulationChange } from '@/lib/world-data-aggregator';
import SortableCountryTable from '@/components/SortableCountryTable';

export const metadata = {
  title: 'All 195 Countries Ranked by Population — Complete Demographic Data',
  description:
    'Comprehensive demographic data for every country in the world, with sortable rankings by population, growth rate, median age, and dependency ratio. Browse all 195 countries from UN World Population Prospects 2024.',
  keywords:
    'countries by population, list of countries by population, list of countries and population, every country population, countries and population, list of countries in the world by population, countries ranked by population, countries sorted by population, world population by country, all countries population',
  openGraph: {
    title: 'All 195 Countries Ranked by Population — Complete Demographic Data',
    description:
      'Sortable table of every country in the world with population, growth, median age, and density. UN World Population Prospects 2024 data.',
    type: 'website',
    url: 'https://populationpyramids.org/countries',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/countries',
  },
};

function generateSchema(totalPopulation: number, topCountries: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/countries#webpage',
        name: 'All 195 Countries Ranked by Population',
        url: 'https://populationpyramids.org/countries',
        description:
          'Comprehensive demographic data for all 195 countries, sortable by population, growth, median age, and more.',
        inLanguage: 'en-US',
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/countries#dataset',
        name: 'World Countries Population Demographics Dataset',
        description:
          'Complete demographic data for 195 countries including population, median age, growth rates, and dependency ratios.',
        url: 'https://populationpyramids.org/countries',
        creator: {
          '@type': 'Organization',
          name: 'United Nations Department of Economic and Social Affairs, Population Division',
          url: 'https://population.un.org/',
        },
        publisher: {
          '@type': 'Organization',
          name: 'PopulationPyramids.org',
          url: 'https://populationpyramids.org',
        },
        distribution: {
          '@type': 'DataDownload',
          contentUrl: 'https://populationpyramids.org/countries',
          encodingFormat: 'text/html',
        },
        temporalCoverage: '1950/2025',
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Countries', item: 'https://populationpyramids.org/countries' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How many countries are there in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'There are 195 countries in the world recognized by the United Nations — 193 UN member states plus 2 observer states (the Holy See and Palestine). This page lists demographic data for all 195.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the most populated country in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${topCountries[0].name} is the most populated country in the world with ${topCountries[0].population2024.toLocaleString()} people in 2024, followed by ${topCountries[1].name} (${topCountries[1].population2024.toLocaleString()}) and ${topCountries[2].name} (${topCountries[2].population2024.toLocaleString()}).`,
            },
          },
          {
            '@type': 'Question',
            name: 'What is the total world population?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The world's total population is approximately ${(totalPopulation / 1_000_000_000).toFixed(2)} billion people across 195 countries, based on UN World Population Prospects 2024 estimates.`,
            },
          },
          {
            '@type': 'Question',
            name: 'How are countries ranked on this page?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The table is sortable by any column — click a column header to re-sort by population, growth rate, median age, or other metrics. Use the search box to find a specific country, and the region filter to narrow the list.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where does the population data come from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'All data on this page comes from the United Nations Department of Economic and Social Affairs, Population Division — specifically the World Population Prospects 2024 Revision, the most authoritative global demographic dataset.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which country has the smallest population?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Vatican City has the smallest population in the world with about 500 residents, followed by Tuvalu, Nauru, and Palau — all with populations under 25,000. See our smallest countries page for the full list.',
            },
          },
        ],
      },
    ],
  };
}

export default async function CountriesPage() {
  const countries = await getCountriesWithPopulationChange();
  const totalPopulation = countries.reduce((sum, c) => sum + c.population2024, 0);
  const top3 = countries.slice(0, 3);
  const schema = generateSchema(totalPopulation, top3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

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
              <li className="text-gray-900 font-medium">Countries</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              All {countries.length} Countries Ranked by Population
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Comprehensive demographic data for every country in the world, sortable by population, growth
              rate, median age, and dependency ratio. {top3[0].name} leads with{' '}
              {top3[0].population2024.toLocaleString()} people, followed by {top3[1].name} and {top3[2].name}.
              Click any country to view detailed population pyramids and historical trends.
            </p>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{countries.length}</div>
              <div className="text-sm text-gray-600">Countries & Territories</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {Math.round((totalPopulation / 1_000_000_000) * 10) / 10}B
              </div>
              <div className="text-sm text-gray-600">Total World Population</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">1950-2025</div>
              <div className="text-sm text-gray-600">Data Coverage</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">75 Years</div>
              <div className="text-sm text-gray-600">Historical Data</div>
            </div>
          </div>

          {/* Country Rankings — links to new ranking pages */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Country Rankings</h2>
            <p className="text-gray-700 mb-6">
              Explore countries ranked by population, area, and demographic indicators. Each ranking includes
              all 195 countries plus detailed top-10 breakdowns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/most-populated-countries"
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="font-semibold text-gray-900 mb-1">Most Populated Countries</div>
                <div className="text-sm text-gray-600">
                  All 195 countries ranked by population. India and China lead with over 1.4 billion each.
                </div>
              </Link>
              <Link
                href="/largest-countries"
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="font-semibold text-gray-900 mb-1">Largest Countries by Area</div>
                <div className="text-sm text-gray-600">
                  Ranked by land area in km². Russia leads at 17M km², followed by Canada and the US.
                </div>
              </Link>
              <Link
                href="/smallest-countries"
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="font-semibold text-gray-900 mb-1">Smallest Countries</div>
                <div className="text-sm text-gray-600">
                  By area and by population. Vatican City is smallest in both — just 0.49 km² and ~500 people.
                </div>
              </Link>
              <Link
                href="/median-age-by-country"
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="font-semibold text-gray-900 mb-1">Median Age by Country</div>
                <div className="text-sm text-gray-600">
                  World's oldest and youngest populations. Monaco and Japan lead; African nations are youngest.
                </div>
              </Link>
              <Link
                href="/top-10-most-populated-countries"
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="font-semibold text-gray-900 mb-1">Top 10 Most Populated</div>
                <div className="text-sm text-gray-600">
                  Detailed profiles of the 10 countries that hold over half of all humans on Earth.
                </div>
              </Link>
              <Link
                href="/top-10-largest-countries"
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="font-semibold text-gray-900 mb-1">Top 10 Largest by Area</div>
                <div className="text-sm text-gray-600">
                  Detailed profiles of the 10 biggest countries on Earth, from Russia to Algeria.
                </div>
              </Link>
            </div>
          </section>

          {/* About the Data */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What's Included</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• <strong>Population Data:</strong> Current 2024 population and historical trends since 1990</li>
                  <li>• <strong>Median Age:</strong> Age distribution midpoint showing demographic maturity</li>
                  <li>• <strong>Growth Rates:</strong> Population change percentages and absolute numbers</li>
                  <li>• <strong>Age Structure:</strong> Youth (0-14) and elderly (65+) percentages</li>
                  <li>• <strong>Dependency Ratios:</strong> Economic burden calculations</li>
                  <li>• <strong>Regional Groups:</strong> UN geographic classifications</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Use</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• <strong>Sort:</strong> Click column headers to sort by any metric</li>
                  <li>• <strong>Search:</strong> Use the search box to find specific countries</li>
                  <li>• <strong>Filter:</strong> Select regions to narrow down the view</li>
                  <li>• <strong>Compare:</strong> Click country names to view detailed demographics</li>
                  <li>• <strong>Analyze:</strong> Data for research, planning, or education</li>
                  <li>• <strong>Export:</strong> Suitable for further analysis</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Table */}
          <SortableCountryTable countries={countries} />

          {/* FAQ — visible section, complements the FAQPage schema */}
          <section className="bg-white rounded-lg shadow-sm p-6 mt-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How many countries are there in the world?</h3>
                <p className="text-gray-700">
                  There are 195 countries in the world recognized by the United Nations — 193 UN member states
                  plus 2 observer states (the Holy See and Palestine). This page lists demographic data for all 195.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Which country has the largest population in the world?
                </h3>
                <p className="text-gray-700">
                  {top3[0].name} is the most populated country with {top3[0].population2024.toLocaleString()}{' '}
                  people, followed by {top3[1].name} ({top3[1].population2024.toLocaleString()}) and{' '}
                  {top3[2].name} ({top3[2].population2024.toLocaleString()}). See our{' '}
                  <Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900">
                    full population ranking
                  </Link>{' '}
                  for all 195 countries.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What is the total world population?</h3>
                <p className="text-gray-700">
                  The world's total population is approximately{' '}
                  {(totalPopulation / 1_000_000_000).toFixed(2)} billion people across 195 countries (UN
                  estimates for 2024).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Where does the data come from?</h3>
                <p className="text-gray-700">
                  All demographic data is sourced from the United Nations Department of Economic and Social
                  Affairs, Population Division — specifically the{' '}
                  <a
                    href="https://population.un.org/wpp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900"
                  >
                    World Population Prospects 2024 Revision
                  </a>
                  , the most authoritative global demographic dataset available.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Which country has the smallest population?</h3>
                <p className="text-gray-700">
                  Vatican City has the smallest population in the world with about 500 residents. See our{' '}
                  <Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900">
                    smallest countries page
                  </Link>{' '}
                  for the full ranking.
                </p>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Sources & Methodology</h3>
            <p className="text-gray-700 text-sm mb-2">
              All demographic data is sourced from the United Nations Department of Economic and Social Affairs,
              Population Division. World Population Prospects 2024 Revision represents the most authoritative
              and comprehensive demographic dataset available globally.
            </p>
            <p className="text-gray-700 text-sm mb-3">
              Data includes medium-variant population projections based on comprehensive demographic research,
              historical trends analysis, and standardized methodologies applied consistently across all{' '}
              {countries.length} countries.
            </p>
            <a
              href="https://population.un.org/wpp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Official UN World Population Prospects Data →
            </a>
          </div>

          {/* Quick Access */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Access by Region</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Africa', 'Asia', 'Europe', 'Americas', 'Oceania'].map((region) => {
                const regionCountries = countries.filter((c) => c.region === region);
                const totalPop = regionCountries.reduce((sum, c) => sum + c.population2024, 0);

                return (
                  <div key={region} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <h4 className="font-semibold text-gray-900 mb-2">{region}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{regionCountries.length} countries</div>
                      <div>{(totalPop / 1_000_000_000).toFixed(2)}B population</div>
                      <div className="text-blue-600 cursor-pointer hover:text-blue-700">
                        Filter to {region} →
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
