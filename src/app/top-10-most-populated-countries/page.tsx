import Link from 'next/link';
import { getCountryRankings, formatPopulation, formatArea } from '@/lib/country-rankings';

export const metadata = {
  title: 'Top 10 Most Populated Countries in the World 2026',
  description:
    'The 10 most populated countries in the world ranked. India and China each have over 1.4 billion people. Full profiles with populations, growth trends, median age, density, and economic context for the top 10.',
  keywords:
    'top 10 most populated countries, top 10 most populous countries, top 10 populous countries, top 10 countries with highest population, 10 most populated countries, 10 most populous countries, ten most populous countries',
  openGraph: {
    title: 'Top 10 Most Populated Countries in the World 2026',
    description:
      'The 10 most populous countries ranked, each with a detailed profile. Together they hold over half of all humans on Earth.',
    type: 'website',
    url: 'https://populationpyramids.org/top-10-most-populated-countries',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/top-10-most-populated-countries',
  },
};

// Brief stable profiles for each of the typical top-10 countries.
// Falls back to a generic description if a country isn't in this map.
const PROFILES: Record<string, string> = {
  india:
    'India became the world\'s most populous country in 2023, surpassing China. With a median age in the late 20s and the largest working-age population on Earth, India is in the middle of its demographic dividend — a decades-long window where the share of working-age people peaks. Hindi and English are the most widely used languages, and the country contains more linguistic and religious diversity than any other.',
  china:
    'China was the world\'s most populous country for centuries until India overtook it in 2023. After decades of the one-child policy and falling fertility, China\'s population began declining in 2022 and is projected to fall sharply through this century. The country\'s rapid aging is one of the defining economic challenges of the coming decades.',
  'united-states':
    'The United States is the third most populous country and by far the largest population among developed economies. Its growth has slowed but immigration continues to add hundreds of thousands of people per year, sustaining a relatively young age structure compared to Europe or Japan. The US economy remains the world\'s largest in nominal terms.',
  indonesia:
    'Indonesia is the world\'s fourth most populous country and the largest Muslim-majority nation. Spread across more than 17,000 islands, its population is heavily concentrated on Java — one of the most densely populated places on Earth. The country has been one of the fastest-growing major economies in Southeast Asia.',
  pakistan:
    'Pakistan has one of the highest fertility rates among major countries and is on track to overtake Indonesia within decades. Its population is overwhelmingly young, with a median age in the low 20s, and Pakistan\'s growth is expected to add tens of millions of people every decade through mid-century.',
  nigeria:
    'Nigeria is Africa\'s most populous country and the seventh most populous in the world. With a fertility rate well above 4 children per woman and a median age under 18, Nigeria is projected to become the third most populous country in the world by 2050, eventually overtaking the United States.',
  brazil:
    'Brazil is the most populous country in South America and the seventh most populous globally. Its population growth has slowed dramatically since the 1960s as fertility fell, and Brazil now has a median age in the mid-30s. Greater São Paulo alone contains more people than most countries.',
  bangladesh:
    'Bangladesh has one of the highest population densities of any country — more than 1,200 people per square kilometer — making it more densely populated than India, China, or Indonesia. Despite its small land area, Bangladesh ranks eighth in the world by population.',
  russia:
    'Russia spans 11 time zones but has a smaller population than several countries that fit inside a single province of Russia. The population has been in long-term decline due to low fertility, high mortality, and emigration, and Russia is now the ninth most populous country after being in the top 6 for most of the 20th century.',
  mexico:
    'Mexico is the most populous Spanish-speaking country in the world and the second most populous in Latin America after Brazil. Its growth has slowed considerably and the country is entering a phase of demographic maturity, with median age rising and dependency ratios falling.',
  ethiopia:
    'Ethiopia is one of the fastest-growing populations among major countries and is poised to enter the top 10 within the next decade. It is the second most populous country in Africa after Nigeria, with a fertility rate well above replacement.',
  japan:
    'Japan, once the world\'s most populous developed country, has been shrinking since 2010 due to ultra-low fertility and almost no immigration. It now has the second-highest median age in the world and is the global reference case for population aging.',
  philippines:
    'The Philippines has long had one of the highest fertility rates in Asia and continues to grow steadily. It is the second most populous country in Southeast Asia after Indonesia.',
  egypt:
    'Egypt is the most populous country in the Arab world and the third most populous in Africa. Almost all of its population is concentrated along the Nile, making the inhabited strip one of the most densely populated places on Earth.',
};

function generateSchema(top10: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/top-10-most-populated-countries#webpage',
        name: 'Top 10 Most Populated Countries in the World 2026',
        url: 'https://populationpyramids.org/top-10-most-populated-countries',
        description: 'The 10 most populated countries in the world ranked, with detailed profiles.',
        inLanguage: 'en-US',
      },
      {
        '@type': 'ItemList',
        '@id': 'https://populationpyramids.org/top-10-most-populated-countries#itemlist',
        name: 'Top 10 Most Populated Countries',
        numberOfItems: 10,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: top10.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          description: `${c.name} is the #${i + 1} most populated country with ${c.population2024.toLocaleString()} people.`,
          url: `https://populationpyramids.org/${c.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Most Populated Countries',
            item: 'https://populationpyramids.org/most-populated-countries',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Top 10',
            item: 'https://populationpyramids.org/top-10-most-populated-countries',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What are the top 10 most populated countries in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The top 10 most populated countries are: ${top10
                .map((c, i) => `${i + 1}. ${c.name} (${formatPopulation(c.population2024)})`)
                .join(', ')}. Together they account for more than half of the world's total population.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Which country has the highest population in the world?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${top10[0].name} has the highest population in the world with ${top10[0].population2024.toLocaleString()} people in 2024, ahead of ${top10[1].name} (${top10[1].population2024.toLocaleString()}).`,
            },
          },
          {
            '@type': 'Question',
            name: 'Did India overtake China in population?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Yes. According to UN World Population Prospects 2024, India surpassed China to become the world\'s most populous country in 2023. India continues to grow while China is now in long-term population decline.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much of the world lives in the top 10 most populated countries?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The top 10 most populated countries together hold roughly ${top10.reduce((s, c) => s + c.worldPopulationShare, 0).toFixed(0)}% of the global population — well over half of all humans on Earth.`,
            },
          },
        ],
      },
    ],
  };
}

export default async function Top10MostPopulatedCountriesPage() {
  const { countries } = await getCountryRankings();
  const top10 = countries.slice(0, 10);
  const schema = generateSchema(top10);
  const totalShare = top10.reduce((s, c) => s + c.worldPopulationShare, 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/most-populated-countries" className="hover:text-blue-600">Most Populated Countries</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Top 10</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Top 10 Most Populated Countries in the World 2026
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            The world's 10 most populated countries together hold about <strong>{totalShare.toFixed(0)}%</strong>{' '}
            of all humans on Earth — more than half of the global population, concentrated in just five percent
            of the countries. India and China each have over 1.4 billion people, and the third-place United
            States is less than a quarter their size. Here is the complete ranking with a detailed profile of
            each country.
          </p>

          {/* The 10 cards */}
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
                        #{i + 1} Most Populated
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        <Link href={`/${c.slug}`} className="hover:text-blue-700">
                          {c.name}
                        </Link>
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-700">
                        {formatPopulation(c.population2024)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {c.worldPopulationShare.toFixed(1)}% of world
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {PROFILES[c.slug] ??
                      `${c.name} is the #${i + 1} most populated country in the world with ${c.population2024.toLocaleString()} people in 2024 — approximately ${c.worldPopulationShare.toFixed(1)}% of the global population.`}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Population 2024</div>
                      <div className="font-semibold text-gray-900">{c.population2024.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Change since 2000</div>
                      <div className="font-semibold text-gray-900">
                        {c.populationChangePercent > 0 ? '+' : ''}
                        {c.populationChangePercent.toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Median Age</div>
                      <div className="font-semibold text-gray-900">
                        {c.medianAge2024 > 0 ? c.medianAge2024.toFixed(1) : '—'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Land Area</div>
                      <div className="font-semibold text-gray-900">{formatArea(c.areaKm2)}</div>
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

          {/* Cross-links */}
          <section className="bg-blue-50 rounded-lg p-6 border border-blue-200 mt-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Rankings</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li><Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ All 195 Countries Ranked by Population</Link></li>
              <li><Link href="/top-10-largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Largest Countries by Area</Link></li>
              <li><Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Largest Countries in the World</Link></li>
              <li><Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Smallest Countries in the World</Link></li>
              <li><Link href="/median-age-by-country" className="text-blue-700 hover:text-blue-900 font-medium">→ Median Age by Country</Link></li>
              <li><Link href="/compare" className="text-blue-700 hover:text-blue-900 font-medium">→ Compare Any Two Countries</Link></li>
            </ul>
          </section>

          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <strong>Data source:</strong> UN World Population Prospects 2024 Revision. Population figures are
            for 2024 (most recent available). Last updated 2026.
          </section>
        </div>
      </div>
    </>
  );
}
