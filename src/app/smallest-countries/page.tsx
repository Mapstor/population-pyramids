import Link from 'next/link';
import { getCountryRankings, formatPopulation, formatArea } from '@/lib/country-rankings';

export const metadata = {
  title: 'Smallest Countries in the World 2026 — By Area and Population',
  description:
    'Complete ranking of the smallest countries in the world by both land area and population. Vatican City is the smallest at just 0.49 km² and 496 people. Full list of every country sorted from smallest to largest, with area, population, and density data.',
  keywords:
    'smallest countries in the world, smallest countries, least populated countries, smallest countries by population, top 10 smallest countries, smallest nation in the world, countries with lowest population',
  openGraph: {
    title: 'Smallest Countries in the World 2026 — By Area and Population',
    description:
      'Every country ranked smallest to largest. Vatican City leads at 0.49 km². Complete tables for both area and population rankings.',
    type: 'website',
    url: 'https://populationpyramids.org/smallest-countries',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/smallest-countries',
  },
};

function generateSchema(top10Area: any[], top10Pop: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/smallest-countries#webpage',
        name: 'Smallest Countries in the World 2026',
        url: 'https://populationpyramids.org/smallest-countries',
        description:
          'Smallest countries in the world ranked by both land area and population, with full data for all 195 countries.',
        inLanguage: 'en-US',
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/smallest-countries#dataset',
        name: 'World Countries Ranked from Smallest to Largest 2026',
        description: 'Area and population data for all 195 countries, sorted from smallest to largest.',
        url: 'https://populationpyramids.org/smallest-countries',
        creator: [
          {
            '@type': 'Organization',
            name: 'United Nations Department of Economic and Social Affairs, Population Division',
            url: 'https://population.un.org/',
          },
          { '@type': 'Organization', name: 'CIA World Factbook' },
        ],
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Countries', item: 'https://populationpyramids.org/countries' },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Smallest Countries',
            item: 'https://populationpyramids.org/smallest-countries',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the smallest country in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${top10Area[0].name} is the smallest country in the world by both land area and population. It covers just ${top10Area[0].areaKm2} square kilometers and has a population of approximately ${top10Area[0].population2024.toLocaleString()} people — making it smaller than New York's Central Park.`,
            },
          },
          {
            '@type': 'Question',
            name: 'What are the 10 smallest countries in the world by area?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The 10 smallest countries in the world by land area are: ${top10Area
                .map((c, i) => `${i + 1}. ${c.name} (${formatArea(c.areaKm2)})`)
                .join(', ')}.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Which countries have the smallest populations?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The countries with the smallest populations in the world include ${top10Pop
                .slice(0, 5)
                .map((c) => `${c.name} (${c.population2024.toLocaleString()})`)
                .join(', ')}. These nations often face unique challenges sustaining services on a tiny tax base.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Is Monaco smaller than Vatican City?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'No. Vatican City is the smallest country in the world at 0.49 km², while Monaco is the second smallest at 2 km². However, Monaco has a much larger population (around 40,000) than Vatican City (under 500), and Monaco is the most densely populated country in the world.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many microstates are there in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'There are roughly a dozen microstates — countries with very small land area and population — including Vatican City, Monaco, Nauru, Tuvalu, San Marino, Liechtenstein, Marshall Islands, Saint Kitts and Nevis, Maldives, and Malta. Most are island nations or European enclaves with unique historical origins.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where does the data on small countries come from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Area data is from the CIA World Factbook and population data is from UN World Population Prospects 2024 Revision. For very small countries, population figures are usually government estimates released through national statistical offices.',
            },
          },
        ],
      },
    ],
  };
}

export default async function SmallestCountriesPage() {
  const { countries } = await getCountryRankings();
  const byArea = [...countries].sort((a, b) => a.areaKm2 - b.areaKm2);
  const byPopulation = [...countries].sort((a, b) => a.population2024 - b.population2024);
  const top10Area = byArea.slice(0, 10);
  const top10Pop = byPopulation.slice(0, 10);
  const schema = generateSchema(top10Area, top10Pop);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/countries" className="hover:text-blue-600">Countries</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Smallest Countries</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Smallest Countries in the World 2026
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-4xl">
            The world's smallest countries ranked by both land area and population. <strong>{top10Area[0].name}</strong>{' '}
            is the smallest at just <strong>{top10Area[0].areaKm2} km²</strong> — smaller than New York's
            Central Park — and is home to about {top10Area[0].population2024.toLocaleString()} people. The
            next smallest, {top10Area[1].name}, covers only {top10Area[1].areaKm2} km², while{' '}
            {top10Area[2].name} ({top10Area[2].areaKm2} km²) is the smallest island nation in the world.
          </p>

          {/* Top 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {top10Area.slice(0, 3).map((c, i) => (
              <div key={c.slug} className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-amber-600">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">#{i + 1} Smallest</div>
                <div className="text-lg font-bold text-gray-900 mb-1">{c.name}</div>
                <div className="text-2xl font-bold text-amber-700">{formatArea(c.areaKm2)}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Population: {c.population2024.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Top 10 smallest by area */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Top 10 Smallest Countries in the World by Area
            </h2>
            <ol className="space-y-2">
              {top10Area.map((c, i) => (
                <li key={c.slug} className="flex items-baseline gap-4 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-bold text-gray-500 w-8">#{i + 1}</span>
                  <Link href={`/${c.slug}`} className="font-semibold text-blue-700 hover:text-blue-900 flex-1">
                    {c.name}
                  </Link>
                  <span className="text-gray-900 font-semibold">{c.areaKm2.toLocaleString()} km²</span>
                  <span className="text-sm text-gray-500 w-28 text-right">
                    {c.population2024.toLocaleString()} people
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Top 10 smallest by population */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Top 10 Smallest Countries by Population
            </h2>
            <ol className="space-y-2">
              {top10Pop.map((c, i) => (
                <li key={c.slug} className="flex items-baseline gap-4 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-bold text-gray-500 w-8">#{i + 1}</span>
                  <Link href={`/${c.slug}`} className="font-semibold text-blue-700 hover:text-blue-900 flex-1">
                    {c.name}
                  </Link>
                  <span className="text-gray-900 font-semibold">{c.population2024.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 w-28 text-right">{formatArea(c.areaKm2)}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Full table */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              All 195 Countries Sorted Smallest to Largest by Area
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <caption className="sr-only">All 195 countries ranked from smallest to largest by area</caption>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Country</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Area (km²)</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Population 2024</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {byArea.map((c, i) => (
                    <tr key={c.slug} className="hover:bg-blue-50">
                      <td className="px-4 py-2.5 text-sm text-gray-700">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{c.region}</td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-900 font-medium">
                        {c.areaKm2.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {formatPopulation(c.population2024)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SEO content */}
          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Microstates and Why They Exist</h2>
            <p>
              The world's smallest countries are scattered across three regions: European enclaves (Vatican
              City, Monaco, San Marino, Liechtenstein, Malta, Andorra), Caribbean and Pacific island nations
              (Saint Kitts and Nevis, Dominica, Grenada, Nauru, Tuvalu, Marshall Islands, Maldives), and a few
              outliers. Each has a different origin story: papal territory, royal protectorates, former
              colonies, or coral atolls. Despite their size, several are full members of the United Nations
              and run their own foreign policies.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Smallest by Area vs Smallest by Population</h3>
            <p>
              The two rankings overlap but are not identical. Monaco is the second-smallest country by area
              but the most densely populated on Earth — about 40,000 people packed into 2 km². Tuvalu, by
              contrast, has more land than Monaco but only about 5,000 inhabitants, making it one of the
              least populated countries despite its larger area. The single country that tops both rankings
              is {top10Area[0].name}, the only country smaller in both area and population than every other
              nation on Earth.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Why Small Countries Matter</h3>
            <p>
              Small countries are economic and political laboratories. Several — including Singapore, Monaco,
              and Luxembourg — rank among the richest places in the world per capita. Others, like the
              Maldives and Tuvalu, are on the front line of climate change, with rising sea levels
              threatening their existence. Their stories illustrate that geographic size is a poor predictor
              of national impact.
            </p>
          </section>

          {/* Cross-links */}
          <section className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Rankings</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li><Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Largest Countries in the World by Area</Link></li>
              <li><Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Most Populated Countries in the World</Link></li>
              <li><Link href="/top-10-largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Largest Countries (Detailed)</Link></li>
              <li><Link href="/countries" className="text-blue-700 hover:text-blue-900 font-medium">→ All 195 Countries with Full Demographics</Link></li>
              <li><Link href="/median-age-by-country" className="text-blue-700 hover:text-blue-900 font-medium">→ Median Age by Country</Link></li>
              <li><Link href="/compare" className="text-blue-700 hover:text-blue-900 font-medium">→ Compare Any Two Countries</Link></li>
            </ul>
          </section>

          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <strong>Data sources:</strong> Area data from the CIA World Factbook. Population data from UN
            World Population Prospects 2024 Revision. Last updated 2026.
          </section>
        </div>
      </div>
    </>
  );
}
