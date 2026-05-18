import Link from 'next/link';
import USStatesClient from './USStatesClient';

export const metadata = {
  title: 'US States by Population 2026 — All 50 States Ranked',
  description:
    'Complete list of all 50 US states ranked by population in 2026. California leads with 38.9M residents, followed by Texas and Florida. Sortable table with growth rates, median age, and regional breakdowns.',
  keywords:
    'us states by population, states by population, state by state population, states ranked by population, us state population ranking, list of state populations, american states by population, state with highest population, most populated states, states with lowest population, smallest states by population, largest states by population, state of texas population, state of new york population, wyoming population',
  openGraph: {
    title: 'US States by Population 2026 — All 50 States Ranked',
    description:
      'Every US state ranked by population. California, Texas, and Florida lead. Full table with growth and demographic data.',
    type: 'website',
    url: 'https://populationpyramids.org/us-states',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/us-states',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://populationpyramids.org/us-states#webpage',
      name: 'US States Ranked by Population 2026',
      url: 'https://populationpyramids.org/us-states',
      description:
        'Complete population and demographic data for all 50 US states plus DC, sortable by population, growth rate, and median age.',
      inLanguage: 'en-US',
    },
    {
      '@type': 'Dataset',
      '@id': 'https://populationpyramids.org/us-states#dataset',
      name: 'US States Population Demographics Dataset 2026',
      description:
        'Population, growth rate, and median age data for all 50 US states. Source: US Census Bureau.',
      url: 'https://populationpyramids.org/us-states',
      creator: { '@type': 'Organization', name: 'US Census Bureau', url: 'https://www.census.gov/' },
      publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
      spatialCoverage: { '@type': 'Place', name: 'United States' },
      temporalCoverage: '2010/2024',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      variableMeasured: [
        { '@type': 'PropertyValue', name: 'Population', description: 'Total state population in 2024' },
        { '@type': 'PropertyValue', name: 'Growth Rate', description: 'Population change since 2020' },
        { '@type': 'PropertyValue', name: 'Median Age', description: 'Median age of state population' },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
        { '@type': 'ListItem', position: 2, name: 'US States', item: 'https://populationpyramids.org/us-states' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the most populated state in the US?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'California is the most populated state in the United States with approximately 38.97 million residents, followed by Texas (30.5 million) and Florida (22.6 million). Together these three states hold more than a quarter of the entire US population.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the least populated state in the US?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Wyoming is the least populated state in the United States with approximately 584,000 residents — fewer people than many individual US cities. Vermont, Alaska, and North Dakota are the next smallest states by population.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which states are the fastest growing in the US?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The fastest-growing US states since 2020 are Idaho, Utah, Florida, Texas, and South Carolina — all growing more than 3% per year. Together they have absorbed millions of new residents from slower-growing states like New York, Illinois, and California.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many states are there in the United States?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'There are 50 states in the United States, plus the federal district of Washington, D.C., and several territories (Puerto Rico, Guam, US Virgin Islands, American Samoa, and Northern Mariana Islands).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the total US population?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The total US population is approximately 334.9 million people based on the most recent US Census Bureau estimates for 2024. This makes the United States the third most populated country in the world after India and China.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where does state population data come from?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'All state population figures come from the US Census Bureau, which publishes annual population estimates each year. The decennial census provides the official baseline; annual updates account for births, deaths, and migration.',
          },
        },
      ],
    },
  ],
};

export default function USStatesPageServer() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <USStatesClient />

      {/* Server-rendered SEO content + FAQ below the interactive table */}
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
        {/* FAQ */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What is the most populated state in the US?</h3>
              <p className="text-gray-700">
                California is the most populated state with about 38.97 million residents, followed by Texas
                (30.5 million) and Florida (22.6 million). The top three alone hold more than a quarter of
                the entire US population.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What is the least populated state?</h3>
              <p className="text-gray-700">
                Wyoming is the least populated state with about 584,000 residents — fewer people than many
                individual US cities. Vermont, Alaska, and North Dakota are the next smallest.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Which states are the fastest growing?</h3>
              <p className="text-gray-700">
                Idaho, Utah, Florida, Texas, and South Carolina have grown fastest since 2020 — all above 3%
                cumulative growth. See our{' '}
                <Link href="/blog/fastest-growing-states" className="text-blue-700 hover:text-blue-900">
                  fastest-growing states analysis
                </Link>{' '}
                for the full breakdown.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How many states are there in the US?</h3>
              <p className="text-gray-700">
                There are 50 states in the United States, plus the federal district of Washington, D.C., and
                five inhabited territories.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What is the total US population?</h3>
              <p className="text-gray-700">
                The total US population is approximately 334.9 million people (US Census Bureau, 2024
                estimate). The United States is the third most populated country in the world after India
                and China.
              </p>
            </div>
          </div>
        </section>

        {/* SEO copy — states by population */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">How US State Populations Compare</h2>
          <p>
            US state populations vary by almost a factor of 70 — from California's nearly 39 million to
            Wyoming's 584,000. If California were a country, it would be the 36th most populated nation in
            the world, larger than Canada or Poland. Texas would rank 47th. Wyoming, on the other hand,
            would rank below Solomon Islands or Comoros. This vast range makes the United States one of the
            most demographically diverse federal countries on Earth.
          </p>
          <p>
            Population growth across the country is also uneven. Since 2020, Idaho, Utah, Florida, Texas,
            and South Carolina have all grown by more than 3%, while New York, Illinois, California,
            Louisiana, Hawaii, Mississippi, and West Virginia have lost residents. The net result is a
            steady reshuffling of political and economic weight away from the Northeast and Midwest toward
            the South and Mountain West.
          </p>
        </section>

        {/* Cross-links to country-level rankings */}
        <section className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Rankings</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li>
              <Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">
                → Most Populated Countries in the World
              </Link>
            </li>
            <li>
              <Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">
                → Largest Countries by Area
              </Link>
            </li>
            <li>
              <Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900 font-medium">
                → Smallest Countries in the World
              </Link>
            </li>
            <li>
              <Link href="/countries" className="text-blue-700 hover:text-blue-900 font-medium">
                → All 195 Countries with Demographics
              </Link>
            </li>
            <li>
              <Link href="/median-age-by-country" className="text-blue-700 hover:text-blue-900 font-medium">
                → Median Age by Country
              </Link>
            </li>
            <li>
              <Link href="/united-states" className="text-blue-700 hover:text-blue-900 font-medium">
                → United States Population Pyramid
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
