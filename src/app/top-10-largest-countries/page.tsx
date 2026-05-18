import Link from 'next/link';
import { getCountryRankings, formatPopulation, formatArea } from '@/lib/country-rankings';

export const metadata = {
  title: 'Top 10 Largest Countries in the World by Area 2026',
  description:
    'The 10 largest countries in the world ranked by land area. Russia is largest at 17 million km², followed by Canada, the United States, China, and Brazil. Detailed profiles with area, population, density, and geographic context.',
  keywords:
    'top 10 largest countries in the world, top 10 biggest countries in the world, top 10 biggest countries, largest countries in the world, 10 biggest countries, ten largest countries, top 10 countries by area',
  openGraph: {
    title: 'Top 10 Largest Countries in the World by Area 2026',
    description:
      'The 10 largest countries by land area, each with detailed profile. Russia and Canada alone span 27 million km².',
    type: 'website',
    url: 'https://populationpyramids.org/top-10-largest-countries',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/top-10-largest-countries',
  },
};

const PROFILES: Record<string, string> = {
  russia:
    'Russia is the largest country in the world by a wide margin, spanning 11 time zones across northern Europe and Asia. More than three quarters of its territory lies in Siberia — a vast region of forests, tundra, and arctic coastline that is sparsely populated. Despite its size, Russia\'s population of about 144 million ranks only ninth in the world.',
  canada:
    'Canada is the second largest country in the world and the largest in the Americas. Its 9.98 million square kilometers contain just 39 million people — 90% of whom live within 160 km of the US border. The vast majority of Canada\'s landmass is uninhabitable boreal forest, tundra, and arctic islands.',
  'united-states':
    'The United States is the third largest country in the world by total area (slightly larger than China if inland water is included). Stretching from the Atlantic to the Pacific and including the disconnected states of Alaska and Hawaii, it covers nearly 9.83 million km² with a population of about 340 million people.',
  china:
    'China is the fourth largest country in the world by total area and the largest entirely in Asia. Its 9.6 million km² contain virtually every kind of geography — from the Himalayan Plateau to the Gobi Desert to the Pacific coast. About 1.4 billion people live mostly in the eastern third of the country.',
  brazil:
    'Brazil is the fifth largest country in the world and by far the largest in South America, covering more than half the continent. Its 8.5 million km² include the Amazon rainforest — the largest tropical forest on Earth — and a population of about 211 million, mostly concentrated along the Atlantic coast.',
  australia:
    'Australia is the sixth largest country in the world and the only one to occupy an entire continent. Most of its 7.69 million km² is uninhabited outback, with the population of 26 million clustered in coastal cities on the south and east edges. Australia is one of the most urbanized countries in the world.',
  india:
    'India is the seventh largest country by area and, since 2023, the most populous in the world. Its 3.29 million km² contain about 1.43 billion people — roughly 18% of all humans. India is the seventh largest country yet has the densest large population of any major nation.',
  argentina:
    'Argentina is the eighth largest country in the world and the second largest in South America after Brazil. Its 2.78 million km² stretch from the subtropical north to the subantarctic Tierra del Fuego at the southern tip of South America. The population of about 46 million is heavily concentrated around Buenos Aires.',
  kazakhstan:
    'Kazakhstan is the ninth largest country in the world and the largest landlocked country on Earth. Its 2.72 million km² of steppe and semi-desert in Central Asia hold a population of just 20 million — making it one of the least densely populated countries.',
  algeria:
    'Algeria is the tenth largest country in the world and the largest in Africa. About 90% of its 2.38 million km² is the Sahara Desert, leaving most of the population of 45 million concentrated along the Mediterranean coast in the north.',
};

function generateSchema(top10: any[], worldLandArea: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/top-10-largest-countries#webpage',
        name: 'Top 10 Largest Countries in the World by Area 2026',
        url: 'https://populationpyramids.org/top-10-largest-countries',
        description: 'The 10 largest countries by land area with detailed profiles.',
        inLanguage: 'en-US',
      },
      {
        '@type': 'ItemList',
        '@id': 'https://populationpyramids.org/top-10-largest-countries#itemlist',
        name: 'Top 10 Largest Countries by Area',
        numberOfItems: 10,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: top10.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          description: `${c.name} is the #${i + 1} largest country with ${c.areaKm2.toLocaleString()} km² of land area.`,
          url: `https://populationpyramids.org/${c.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Largest Countries', item: 'https://populationpyramids.org/largest-countries' },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Top 10',
            item: 'https://populationpyramids.org/top-10-largest-countries',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What are the top 10 largest countries in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The top 10 largest countries in the world by total area are: ${top10
                .map((c, i) => `${i + 1}. ${c.name} (${formatArea(c.areaKm2)})`)
                .join(', ')}.`,
            },
          },
          {
            '@type': 'Question',
            name: 'What is the largest country in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${top10[0].name} is the largest country in the world by area, covering ${top10[0].areaKm2.toLocaleString()} square kilometers — roughly twice the size of the second-largest country, ${top10[1].name}.`,
            },
          },
          {
            '@type': 'Question',
            name: 'How much of Earth\'s land do the top 10 largest countries cover?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The top 10 largest countries cover ${((top10.reduce((s, c) => s + c.areaKm2, 0) / worldLandArea) * 100).toFixed(0)}% of all land area among the world's 195 countries — well over half of the world's land.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Is the United States or China larger?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'The United States and China are nearly the same size and rankings vary by source. By total area including inland water, the United States is slightly larger at 9.83 million km². By land area only, China is marginally larger at 9.39 million km². The CIA World Factbook places the US in third position, just ahead of China.',
            },
          },
        ],
      },
    ],
  };
}

export default async function Top10LargestCountriesPage() {
  const { countries, worldLandArea } = await getCountryRankings();
  const top10 = [...countries].sort((a, b) => b.areaKm2 - a.areaKm2).slice(0, 10);
  const schema = generateSchema(top10, worldLandArea);
  const totalShare = (top10.reduce((s, c) => s + c.areaKm2, 0) / worldLandArea) * 100;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/largest-countries" className="hover:text-blue-600">Largest Countries</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Top 10</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Top 10 Largest Countries in the World by Area 2026
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            The world's 10 largest countries together cover about <strong>{totalShare.toFixed(0)}%</strong> of
            all national land area. Russia and Canada alone account for more than 25 million km² — almost
            double the size of every European country combined. Here is the complete ranking from largest to
            tenth-largest, with a detailed profile of each.
          </p>

          <div className="space-y-6">
            {top10.map((c, i) => (
              <article
                key={c.slug}
                className="bg-white rounded-xl shadow-sm overflow-hidden border-l-4 border-blue-600"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-1">
                        #{i + 1} Largest by Area
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        <Link href={`/${c.slug}`} className="hover:text-blue-700">
                          {c.name}
                        </Link>
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-700">{formatArea(c.areaKm2)}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {((c.areaKm2 / worldLandArea) * 100).toFixed(1)}% of world land
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {PROFILES[c.slug] ??
                      `${c.name} is the #${i + 1} largest country in the world by land area, covering ${c.areaKm2.toLocaleString()} square kilometers.`}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Land Area</div>
                      <div className="font-semibold text-gray-900">{c.areaKm2.toLocaleString()} km²</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Population 2024</div>
                      <div className="font-semibold text-gray-900">{formatPopulation(c.population2024)}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Density /km²</div>
                      <div className="font-semibold text-gray-900">{c.densityPerKm2.toFixed(1)}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Region</div>
                      <div className="font-semibold text-gray-900">{c.region}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/${c.slug}`}
                      className="text-blue-700 hover:text-blue-900 font-medium text-sm"
                    >
                      View full {c.name} demographics →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="bg-blue-50 rounded-lg p-6 border border-blue-200 mt-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Rankings</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li><Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ All 195 Countries Ranked by Area</Link></li>
              <li><Link href="/top-10-most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Most Populated Countries</Link></li>
              <li><Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Most Populated Countries</Link></li>
              <li><Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Smallest Countries in the World</Link></li>
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
