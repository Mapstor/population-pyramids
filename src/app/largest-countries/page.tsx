import Link from 'next/link';
import { getCountryRankings, formatPopulation, formatArea } from '@/lib/country-rankings';

export const metadata = {
  title: 'Largest Countries in the World by Area 2026 — All 195 Ranked',
  description:
    'Complete ranking of every country in the world by land area. Russia leads with 17 million km², followed by Canada, the United States, China, and Brazil. Sortable table, regional breakdowns, and population context for all 195 countries.',
  keywords:
    'largest countries in the world, biggest countries in the world, biggest countries, largest countries by area, largest country, top 10 largest countries, countries ranked by area',
  openGraph: {
    title: 'Largest Countries in the World by Area 2026 — All 195 Ranked',
    description:
      'Every country ranked by land area in square kilometers. Russia is largest at 17M km². Complete table with population, density, and regional breakdowns.',
    type: 'website',
    url: 'https://populationpyramids.org/largest-countries',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/largest-countries',
  },
};

function generateSchema(top10: any[], worldLandArea: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/largest-countries#webpage',
        name: 'Largest Countries in the World by Area 2026',
        url: 'https://populationpyramids.org/largest-countries',
        description:
          'Complete ranking of all 195 countries by land area in square kilometers, with population context.',
        inLanguage: 'en-US',
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/largest-countries#dataset',
        name: 'World Countries Ranked by Land Area 2026',
        description:
          'Land area data for all 195 countries in square kilometers, paired with population and density data.',
        url: 'https://populationpyramids.org/largest-countries',
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
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Area', description: 'Total land area in square kilometers' },
          { '@type': 'PropertyValue', name: 'Population', description: 'Total population in 2024' },
          { '@type': 'PropertyValue', name: 'Density', description: 'People per square kilometer' },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Countries', item: 'https://populationpyramids.org/countries' },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Largest Countries',
            item: 'https://populationpyramids.org/largest-countries',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the largest country in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${top10[0].name} is the largest country in the world by land area, covering ${top10[0].areaKm2.toLocaleString()} square kilometers — roughly ${((top10[0].areaKm2 / worldLandArea) * 100).toFixed(1)}% of the world's total land area.`,
            },
          },
          {
            '@type': 'Question',
            name: 'What are the top 10 largest countries in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The 10 largest countries in the world by area are: ${top10
                .map((c, i) => `${i + 1}. ${c.name} (${formatArea(c.areaKm2)})`)
                .join(', ')}.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Why is Russia the largest country?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Russia spans 11 time zones across northern Europe and Asia, covering more than 17 million square kilometers — almost twice the size of the second-largest country, Canada. Most of Russia is in Siberia, a vast sparsely populated region with subarctic and arctic climates.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is the United States bigger than China?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The United States covers ${(9833517).toLocaleString()} square kilometers and China covers ${(9596961).toLocaleString()} square kilometers — meaning the United States is slightly larger by total area. If only land area (excluding inland water) is counted, China is marginally larger. Different sources rank them differently depending on this distinction.`,
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between "largest" and "most populated" countries?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                '"Largest" typically refers to total land area in square kilometers, while "most populated" refers to the number of people. Russia is the largest by area, but India is the most populated. Only China, the United States, Brazil, and India appear in the top 10 of both rankings.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where does country area data come from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Area figures on this page are sourced from the CIA World Factbook and reflect total area including inland water. Population data is from UN World Population Prospects 2024 Revision.',
            },
          },
        ],
      },
    ],
  };
}

export default async function LargestCountriesPage() {
  const { countries, worldLandArea } = await getCountryRankings();
  const sortedByArea = [...countries].sort((a, b) => b.areaKm2 - a.areaKm2);
  const top10 = sortedByArea.slice(0, 10);
  const schema = generateSchema(top10, worldLandArea);

  // Regional aggregation by area
  const byRegion = sortedByArea.reduce<Record<string, { area: number; count: number }>>((acc, c) => {
    if (!acc[c.region]) acc[c.region] = { area: 0, count: 0 };
    acc[c.region].area += c.areaKm2;
    acc[c.region].count += 1;
    return acc;
  }, {});

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
              <li className="text-gray-900 font-medium">Largest Countries</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Largest Countries in the World by Area 2026
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-4xl">
            Every country in the world ranked by land area in square kilometers. <strong>{top10[0].name}</strong>{' '}
            is the largest country at <strong>{top10[0].areaKm2.toLocaleString()} km²</strong> — roughly{' '}
            {((top10[0].areaKm2 / worldLandArea) * 100).toFixed(1)}% of all land on Earth — followed by{' '}
            {top10[1].name} ({formatArea(top10[1].areaKm2)}) and {top10[2].name} ({formatArea(top10[2].areaKm2)}).
            The top 10 largest countries together cover more than half of Earth's land surface.
          </p>

          {/* Top stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {top10.slice(0, 3).map((c, i) => (
              <div key={c.slug} className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-600">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">#{i + 1}</div>
                <div className="text-lg font-bold text-gray-900 mb-1">{c.name}</div>
                <div className="text-2xl font-bold text-blue-700">{formatArea(c.areaKm2)}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {((c.areaKm2 / worldLandArea) * 100).toFixed(1)}% of world land
                </div>
              </div>
            ))}
            <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-600">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">World Total</div>
              <div className="text-lg font-bold text-gray-900 mb-1">All 195 countries</div>
              <div className="text-2xl font-bold text-green-700">{formatArea(worldLandArea)}</div>
              <div className="text-xs text-gray-600 mt-1">Total land area</div>
            </div>
          </div>

          {/* Top 10 inline list */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Top 10 Largest Countries in the World by Area
            </h2>
            <ol className="space-y-2">
              {top10.map((c, i) => (
                <li key={c.slug} className="flex items-baseline gap-4 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-bold text-gray-500 w-8">#{i + 1}</span>
                  <Link href={`/${c.slug}`} className="font-semibold text-blue-700 hover:text-blue-900 flex-1">
                    {c.name}
                  </Link>
                  <span className="text-gray-900 font-semibold">{c.areaKm2.toLocaleString()} km²</span>
                  <span className="text-sm text-gray-500 w-20 text-right">
                    {((c.areaKm2 / worldLandArea) * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-sm text-gray-600 mt-4">
              Total area includes inland water bodies. Source: CIA World Factbook.
            </p>
          </section>

          {/* Full table */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All 195 Countries Ranked by Area</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <caption className="sr-only">List of all 195 countries ranked by land area in 2026</caption>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Country</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Area (km²)</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">% World Land</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Population 2024</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedByArea.map((c, i) => (
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
                        {((c.areaKm2 / worldLandArea) * 100).toFixed(2)}%
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

          {/* Regional area breakdown */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Land Area by Region</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(byRegion)
                .sort(([, a], [, b]) => b.area - a.area)
                .map(([region, data]) => (
                  <div key={region} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-semibold text-gray-900 mb-1">{region}</div>
                    <div className="text-2xl font-bold text-blue-700">{formatArea(data.area)}</div>
                    <div className="text-sm text-gray-600">
                      {data.count} countries · {((data.area / worldLandArea) * 100).toFixed(1)}% of world land
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* SEO content */}
          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">How the World's Land Is Distributed</h2>
            <p>
              The Earth's total land area is roughly 148 million square kilometers, but country borders make
              this number look unevenly drawn. Just three countries — {top10[0].name}, {top10[1].name}, and{' '}
              {top10[2].name} — together cover nearly a quarter of all land. Russia alone is so large that it
              spans 11 time zones; Canada is so empty that 90% of its 39 million people live within 160 km of
              the US border. The disparity between area and population is one of the most striking features of
              world geography.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Asia and the Americas Dominate</h3>
            <p>
              Most of the largest countries lie in Asia or the Americas. {top10[3].name}, {top10[4].name}, and{' '}
              {top10[5].name} round out the top six, all exceeding 7 million square kilometers each. By
              contrast, the largest European country other than Russia is Ukraine, at just over 600,000 km² —
              smaller than Texas. This pattern reflects continental geography: Asia, the Americas, and Africa
              are simply much larger continents than Europe, and they contain most of the world's largest
              countries.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Area vs Population: The Demographic Mismatch</h3>
            <p>
              A country's size does not predict its population. Russia is twice the size of India but has one
              tenth the people. Australia is bigger than India but has only 26 million inhabitants. India,
              meanwhile, has more people than the entire African continent despite being smaller than several
              individual African nations. This mismatch between land and people is why population density is
              such a useful demographic indicator — and why some of the world's most influential countries are
              not the largest by area.
            </p>
          </section>

          {/* Cross-links */}
          <section className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Rankings</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li><Link href="/top-10-largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Largest Countries (Detailed Profiles)</Link></li>
              <li><Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Most Populated Countries in the World</Link></li>
              <li><Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Smallest Countries in the World</Link></li>
              <li><Link href="/countries" className="text-blue-700 hover:text-blue-900 font-medium">→ All 195 Countries with Full Demographics</Link></li>
              <li><Link href="/median-age-by-country" className="text-blue-700 hover:text-blue-900 font-medium">→ Median Age by Country</Link></li>
              <li><Link href="/compare" className="text-blue-700 hover:text-blue-900 font-medium">→ Compare Any Two Countries</Link></li>
            </ul>
          </section>

          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <strong>Data sources:</strong> Area figures from the CIA World Factbook. Population figures from
            UN World Population Prospects 2024 Revision. Last updated 2026.
          </section>
        </div>
      </div>
    </>
  );
}
