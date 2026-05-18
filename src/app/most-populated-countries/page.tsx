import Link from 'next/link';
import { getCountryRankings, formatPopulation, formatDensity } from '@/lib/country-rankings';

export const metadata = {
  title: 'Most Populated Countries in the World 2026 — All 195 Ranked',
  description:
    'Complete list of every country in the world ranked by population in 2026. India, China, and the United States lead with over 1.4 billion, 1.4 billion, and 340 million people. Sortable table, regional breakdowns, growth trends, and demographic data from UN World Population Prospects 2024.',
  keywords:
    'most populated countries, countries by population, most populous nations, largest countries by population, countries ranked by population, world population by country, list of countries by population',
  openGraph: {
    title: 'Most Populated Countries in the World 2026 — All 195 Ranked',
    description:
      'Every country in the world ranked by population. India leads with 1.43 billion people. Full table with growth rates, median age, and density.',
    type: 'website',
    url: 'https://populationpyramids.org/most-populated-countries',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/most-populated-countries',
  },
};

function generateSchema(top10: any[], worldPopulation: number) {
  const top3Text = top10
    .slice(0, 3)
    .map((c) => `${c.name} (${formatPopulation(c.population2024)})`)
    .join(', ');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/most-populated-countries#webpage',
        name: 'Most Populated Countries in the World 2026',
        url: 'https://populationpyramids.org/most-populated-countries',
        description:
          'Complete ranking of all 195 countries by population in 2026, sourced from UN World Population Prospects 2024 Revision.',
        inLanguage: 'en-US',
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/most-populated-countries#dataset',
        name: 'World Countries Ranked by Population 2026',
        description:
          'Population data for all 195 countries with rankings, growth rates, median age, and density.',
        url: 'https://populationpyramids.org/most-populated-countries',
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
        temporalCoverage: '1950/2025',
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Population', description: 'Total population in 2024' },
          { '@type': 'PropertyValue', name: 'Population Change', description: 'Percent change since 2000' },
          { '@type': 'PropertyValue', name: 'Median Age', description: 'Median age of population' },
          { '@type': 'PropertyValue', name: 'Population Density', description: 'People per square kilometer' },
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
            name: 'Most Populated Countries',
            item: 'https://populationpyramids.org/most-populated-countries',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the most populated country in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${top10[0].name} is the most populated country in the world with ${top10[0].population2024.toLocaleString()} people in 2024, representing ${top10[0].worldPopulationShare.toFixed(1)}% of the global population.`,
            },
          },
          {
            '@type': 'Question',
            name: 'What are the top 10 most populated countries?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The 10 most populated countries in the world are: ${top10
                .map((c, i) => `${i + 1}. ${c.name} (${formatPopulation(c.population2024)})`)
                .join(', ')}.`,
            },
          },
          {
            '@type': 'Question',
            name: 'How many people live on Earth?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The world population in 2024 is approximately ${formatPopulation(worldPopulation)} people across 195 countries. The top 3 most populated countries — ${top3Text} — account for roughly ${(top10.slice(0, 3).reduce((s, c) => s + c.worldPopulationShare, 0)).toFixed(0)}% of all humans.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Did India overtake China as the most populous country?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Yes. According to UN World Population Prospects 2024, India surpassed China to become the most populous country in 2023. India\'s population continues to grow while China\'s has begun declining due to long-term low fertility.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between "most populated" and "largest" countries?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                '"Most populated" refers to the number of people, while "largest" usually refers to land area in square kilometers. Russia is the largest country by area, but India is the most populated. The two rankings rarely overlap — only China, the United States, Brazil, and India appear in the top 10 of both.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where does data on country populations come from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'The figures on this page are sourced from the United Nations Department of Economic and Social Affairs, Population Division — specifically the World Population Prospects 2024 Revision, the most authoritative global demographic dataset available.',
            },
          },
        ],
      },
    ],
  };
}

export default async function MostPopulatedCountriesPage() {
  const { countries, worldPopulation } = await getCountryRankings();
  const top10 = countries.slice(0, 10);
  const top3 = countries.slice(0, 3);
  const schema = generateSchema(top10, worldPopulation);
  const top3Share = top3.reduce((s, c) => s + c.worldPopulationShare, 0);

  // Regional aggregation
  const byRegion = countries.reduce<Record<string, { pop: number; count: number }>>((acc, c) => {
    if (!acc[c.region]) acc[c.region] = { pop: 0, count: 0 };
    acc[c.region].pop += c.population2024;
    acc[c.region].count += 1;
    return acc;
  }, {});

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/countries" className="hover:text-blue-600">Countries</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Most Populated Countries</li>
            </ol>
          </nav>

          {/* H1 + lede */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Most Populated Countries in the World 2026
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-4xl">
            All 195 countries ranked by population. <strong>{top10[0].name}</strong> leads with{' '}
            <strong>{top10[0].population2024.toLocaleString()}</strong> people — roughly{' '}
            {top10[0].worldPopulationShare.toFixed(1)}% of the global population of{' '}
            {formatPopulation(worldPopulation)}. The top three nations — {top3.map((c) => c.name).join(', ')} —
            together hold about {top3Share.toFixed(0)}% of all people on Earth.
          </p>

          {/* Top stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {top3.map((c, i) => (
              <div key={c.slug} className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-600">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">#{i + 1}</div>
                <div className="text-lg font-bold text-gray-900 mb-1">{c.name}</div>
                <div className="text-2xl font-bold text-blue-700">{formatPopulation(c.population2024)}</div>
                <div className="text-xs text-gray-600 mt-1">{c.worldPopulationShare.toFixed(1)}% of world</div>
              </div>
            ))}
            <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-600">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">World Total</div>
              <div className="text-lg font-bold text-gray-900 mb-1">All 195 countries</div>
              <div className="text-2xl font-bold text-green-700">{formatPopulation(worldPopulation)}</div>
              <div className="text-xs text-gray-600 mt-1">Earth's total population</div>
            </div>
          </div>

          {/* Top 10 inline list — LLM-friendly */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Top 10 Most Populated Countries in the World
            </h2>
            <ol className="space-y-2">
              {top10.map((c, i) => (
                <li key={c.slug} className="flex items-baseline gap-4 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-bold text-gray-500 w-8">#{i + 1}</span>
                  <Link href={`/${c.slug}`} className="font-semibold text-blue-700 hover:text-blue-900 flex-1">
                    {c.name}
                  </Link>
                  <span className="text-gray-900 font-semibold">{c.population2024.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 w-20 text-right">
                    {c.worldPopulationShare.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-sm text-gray-600 mt-4">
              Source: UN World Population Prospects 2024 Revision. Population estimates for 2024.
            </p>
          </section>

          {/* Full table */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              All 195 Countries Ranked by Population
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <caption className="sr-only">List of all 195 countries ranked by population in 2024</caption>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Country</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Population 2024</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">vs 2000</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">% World</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Density /km²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {countries.map((c, i) => (
                    <tr key={c.slug} className="hover:bg-blue-50">
                      <td className="px-4 py-2.5 text-sm text-gray-700">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{c.region}</td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-900 font-medium">
                        {c.population2024.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm">
                        {c.populationChangePercent !== 0 && (
                          <span className={c.populationChangePercent > 0 ? 'text-green-700' : 'text-red-600'}>
                            {c.populationChangePercent > 0 ? '+' : ''}
                            {c.populationChangePercent.toFixed(1)}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {c.worldPopulationShare.toFixed(2)}%
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-700">
                        {c.densityPerKm2 > 0 ? formatDensity(c.densityPerKm2) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Regional breakdown */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Population by Region</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(byRegion)
                .sort(([, a], [, b]) => b.pop - a.pop)
                .map(([region, data]) => (
                  <div key={region} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-semibold text-gray-900 mb-1">{region}</div>
                    <div className="text-2xl font-bold text-blue-700">{formatPopulation(data.pop)}</div>
                    <div className="text-sm text-gray-600">
                      {data.count} countries · {((data.pop / worldPopulation) * 100).toFixed(1)}% of world
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* SEO content + context */}
          <section className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">How the World's Population Is Distributed</h2>
            <p>
              The world's population is highly concentrated. {top3.map((c) => c.name).join(', ')} alone account
              for roughly {top3Share.toFixed(0)}% of all humans alive today. India overtook China as the most
              populated country in 2023 and continues to grow, while China's population is now declining for the
              first time in decades. The United States, with around 340 million people, remains the third most
              populated country and has the highest population among developed economies.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">The Top 10 Population Powerhouses</h3>
            <p>
              After the top three, populations drop sharply. {top10[3].name} ({formatPopulation(top10[3].population2024)})
              is the fourth most populated country, followed by {top10[4].name}, {top10[5].name},{' '}
              {top10[6].name}, {top10[7].name}, {top10[8].name}, and {top10[9].name}. Six of the top 10 are in
              Asia — a reflection of how Asia, with about 60% of the world's population, dominates global
              demographics. Africa is the fastest-growing region and is projected to overtake Asia's share of
              global growth in coming decades.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Why Country Populations Matter</h3>
            <p>
              A country's population shapes its economy, political power, labor force, and resource consumption.
              Large populations create vast domestic markets, but also strain housing, healthcare, education,
              and infrastructure. Small-population countries often face the opposite challenge — sustaining
              public services on a narrow tax base. Understanding these rankings is essential for investors,
              policymakers, educators, and anyone trying to make sense of the global economy.
            </p>
          </section>

          {/* Cross-links */}
          <section className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Rankings</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li>
                <Link href="/top-10-most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">
                  → Top 10 Most Populated Countries (Detailed Profiles)
                </Link>
              </li>
              <li>
                <Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">
                  → Largest Countries in the World by Area
                </Link>
              </li>
              <li>
                <Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900 font-medium">
                  → Smallest Countries in the World
                </Link>
              </li>
              <li>
                <Link href="/median-age-by-country" className="text-blue-700 hover:text-blue-900 font-medium">
                  → Median Age by Country
                </Link>
              </li>
              <li>
                <Link href="/countries" className="text-blue-700 hover:text-blue-900 font-medium">
                  → All 195 Countries with Full Demographics
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-blue-700 hover:text-blue-900 font-medium">
                  → Compare Any Two Countries Side-by-Side
                </Link>
              </li>
            </ul>
          </section>

          {/* Data source */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <strong>Data source:</strong> All population figures are from the United Nations Department of
            Economic and Social Affairs, Population Division —{' '}
            <a
              href="https://population.un.org/wpp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              World Population Prospects 2024 Revision
            </a>
            . Land area data from the CIA World Factbook. Last updated 2026.
          </section>
        </div>
      </div>
    </>
  );
}
