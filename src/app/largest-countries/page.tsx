import Link from 'next/link';
import { getCountryRankings, formatPopulation, formatArea, formatDensity } from '@/lib/country-rankings';
import RankingBarChart, { BarItem } from '@/components/RankingBarChart';

export const metadata = {
  title: 'Largest Countries in the World by Area 2026 — All 195 Ranked',
  description:
    'Complete ranking of every country by land area in 2026. Russia leads with 17 million km², followed by Canada, the United States, China, and Brazil. Sortable table, regional breakdowns, geographic context, historical changes, glossary, methodology, and 15-question FAQ.',
  keywords:
    'largest countries in the world, biggest countries in the world, biggest countries, largest countries by area, largest country, top 10 largest countries, countries ranked by area, biggest country in the world, list of countries by area',
  openGraph: {
    title: 'Largest Countries in the World by Area 2026',
    description: 'Every country ranked by land area. Russia leads at 17M km². Regional breakdowns, geographic context, historical changes, glossary, methodology, and 15-question FAQ.',
    type: 'website',
    url: 'https://populationpyramids.org/largest-countries',
  },
  alternates: { canonical: 'https://populationpyramids.org/largest-countries' },
};

const LAST_UPDATED = '2026-05-18';
const PUBLISHED = '2026-05-18';

const TOP10_GEOGRAPHY: Record<string, { climate: string; coastline: string; uniqueFact: string }> = {
  russia: { climate: 'Subarctic, continental, humid subtropical', coastline: 'Longest after Canada (mostly arctic)', uniqueFact: '11 time zones — wider than London to Tokyo' },
  canada: { climate: 'Boreal forest, tundra, temperate', coastline: 'Longest in the world (~200,000 km)', uniqueFact: '8% inland water — highest share globally' },
  'united-states': { climate: 'Arctic to tropical (Alaska to Hawaii)', coastline: '~19,924 km', uniqueFact: 'Mississippi-Missouri = 3rd longest river system' },
  china: { climate: 'Subarctic to tropical', coastline: '~14,500 km', uniqueFact: '14 land borders — most of any country with Russia' },
  brazil: { climate: 'Tropical (mostly Amazon)', coastline: '~7,491 km', uniqueFact: '60% of Amazon rainforest is in Brazil' },
  australia: { climate: 'Arid (Outback), temperate coastal', coastline: '~25,760 km', uniqueFact: 'Only country occupying an entire continent' },
  india: { climate: 'Tropical, monsoon, alpine (Himalaya)', coastline: '~7,000 km', uniqueFact: 'Densest populated country in the top 10 largest' },
  argentina: { climate: 'Subtropical to subantarctic', coastline: '~4,989 km', uniqueFact: 'Reaches to ~55°S — nearest country to Antarctica' },
  kazakhstan: { climate: 'Continental steppe and semi-desert', coastline: 'Landlocked (Caspian Sea border)', uniqueFact: 'Largest landlocked country in the world' },
  algeria: { climate: '90% Sahara desert', coastline: '~998 km Mediterranean', uniqueFact: 'Largest country in Africa since South Sudan separation (2011)' },
};

function generateSchema(top10: any[], worldLandArea: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': 'https://populationpyramids.org/largest-countries#article',
        headline: 'Largest Countries in the World by Area 2026 — All 195 Ranked',
        description: 'A sourced ranking of every country by land area, with regional breakdowns and geographic context.',
        author: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org', logo: { '@type': 'ImageObject', url: 'https://populationpyramids.org/icon.svg' } },
        datePublished: PUBLISHED,
        dateModified: LAST_UPDATED,
        mainEntityOfPage: 'https://populationpyramids.org/largest-countries',
        articleSection: 'Geography',
        wordCount: 4500,
        citation: [
          { '@type': 'CreativeWork', name: 'The World Factbook', author: 'Central Intelligence Agency', url: 'https://www.cia.gov/the-world-factbook/' },
          { '@type': 'CreativeWork', name: 'World Population Prospects 2024', author: 'UN DESA Population Division', url: 'https://population.un.org/wpp/' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/largest-countries#webpage',
        name: 'Largest Countries in the World by Area 2026',
        url: 'https://populationpyramids.org/largest-countries',
        inLanguage: 'en-US',
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/largest-countries#dataset',
        name: 'World Countries Ranked by Land Area 2026',
        description: 'Land area for all 195 countries paired with population and density.',
        url: 'https://populationpyramids.org/largest-countries',
        creator: [{ '@type': 'Organization', name: 'CIA World Factbook' }, { '@type': 'Organization', name: 'UN DESA Population Division', url: 'https://population.un.org/' }],
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
      {
        '@type': 'ItemList',
        name: 'Top 10 Largest Countries by Area',
        numberOfItems: 10,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: top10.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, description: `${c.areaKm2.toLocaleString()} km²`, url: `https://populationpyramids.org/${c.slug}` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Countries', item: 'https://populationpyramids.org/countries' },
          { '@type': 'ListItem', position: 3, name: 'Largest Countries', item: 'https://populationpyramids.org/largest-countries' },
        ],
      },
      {
        '@type': 'DefinedTermSet',
        '@id': 'https://populationpyramids.org/largest-countries#glossary',
        name: 'Geography Glossary',
        hasDefinedTerm: [
          { '@type': 'DefinedTerm', name: 'Total area', description: 'Combined land plus internal water (lakes, rivers).' },
          { '@type': 'DefinedTerm', name: 'Land area', description: 'Territory excluding inland water.' },
          { '@type': 'DefinedTerm', name: 'Exclusive Economic Zone', description: '200 nautical miles from coast where a country has special economic rights.' },
          { '@type': 'DefinedTerm', name: 'Landlocked', description: 'No direct access to the open ocean. Kazakhstan is the largest such country.' },
          { '@type': 'DefinedTerm', name: 'Transcontinental country', description: 'Territory in more than one continent (Russia, Turkey, Egypt).' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is the largest country in the world?', acceptedAnswer: { '@type': 'Answer', text: `${top10[0].name}, at ${top10[0].areaKm2.toLocaleString()} km² (CIA World Factbook) — ~${((top10[0].areaKm2 / worldLandArea) * 100).toFixed(1)}% of all national land, nearly twice the size of ${top10[1].name}.` } },
          { '@type': 'Question', name: 'What are the top 10 largest countries?', acceptedAnswer: { '@type': 'Answer', text: top10.map((c, i) => `${i + 1}. ${c.name} (${formatArea(c.areaKm2)})`).join(', ') + '.' } },
          { '@type': 'Question', name: 'Is the US bigger than China?', acceptedAnswer: { '@type': 'Answer', text: 'By total area (with inland water) the US is slightly larger at 9,833,517 km² vs China at 9,596,961 km². By land area only, China is marginally larger. CIA Factbook places the US third.' } },
          { '@type': 'Question', name: 'Why is Russia the largest country?', acceptedAnswer: { '@type': 'Answer', text: 'Four centuries of eastward expansion from Muscovy across Siberia (completed ~1700), plus 19th-century expansion into Central Asia. Most of Russia is sparsely populated Siberian taiga and tundra.' } },
          { '@type': 'Question', name: 'How much of Earth\'s land do the top 10 cover?', acceptedAnswer: { '@type': 'Answer', text: `${((top10.reduce((s, c) => s + c.areaKm2, 0) / worldLandArea) * 100).toFixed(0)}% of all national land area.` } },
          { '@type': 'Question', name: 'What is the largest country in Africa?', acceptedAnswer: { '@type': 'Answer', text: 'Algeria, at 2,381,741 km² — largest in Africa since South Sudan separated from Sudan in 2011.' } },
          { '@type': 'Question', name: 'What is the largest country in Europe?', acceptedAnswer: { '@type': 'Answer', text: 'Excluding Russia (transcontinental, mostly Asian), Ukraine is largest entirely in Europe at 603,628 km². France is largest in the EU at 643,801 km² including overseas regions.' } },
          { '@type': 'Question', name: 'What is the largest country in South America?', acceptedAnswer: { '@type': 'Answer', text: 'Brazil, at 8,515,767 km² — about half the continent. Argentina second at 2,780,400 km².' } },
          { '@type': 'Question', name: 'What is the largest landlocked country?', acceptedAnswer: { '@type': 'Answer', text: 'Kazakhstan, at 2,724,900 km² — larger than all of Western Europe.' } },
          { '@type': 'Question', name: 'Did the Soviet Union\'s collapse change the rankings?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The USSR was 22+ million km². Russia kept the largest piece (17M km²) and stayed #1, while Kazakhstan, Ukraine, Turkmenistan, and others emerged as separate countries.' } },
          { '@type': 'Question', name: 'How are disputed territories counted?', acceptedAnswer: { '@type': 'Answer', text: 'Per CIA Factbook conventions, reflecting de facto control. India, China, Pakistan, Israel, Morocco, and Argentina have notable disputed claims that affect figures slightly.' } },
          { '@type': 'Question', name: 'What\'s total area vs land area?', acceptedAnswer: { '@type': 'Answer', text: 'Total area includes inland water (lakes, rivers); land area excludes them. They differ most for Canada (8% water), the US, Russia.' } },
          { '@type': 'Question', name: 'Is Australia a country or continent?', acceptedAnswer: { '@type': 'Answer', text: 'Both. Australia is the only country to occupy an entire continent.' } },
          { '@type': 'Question', name: 'Where does the area data come from?', acceptedAnswer: { '@type': 'Answer', text: 'Area from CIA World Factbook; population from UN World Population Prospects 2024.' } },
          { '@type': 'Question', name: 'When was this page last updated?', acceptedAnswer: { '@type': 'Answer', text: `Last updated ${LAST_UPDATED}. Area data is stable over decades.` } },
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
  const top10Share = (top10.reduce((s, c) => s + c.areaKm2, 0) / worldLandArea) * 100;

  const byRegion = sortedByArea.reduce<Record<string, { area: number; count: number }>>((acc, c) => {
    if (!acc[c.region]) acc[c.region] = { area: 0, count: 0 };
    acc[c.region].area += c.areaKm2;
    acc[c.region].count += 1;
    return acc;
  }, {});
  const regionList = Object.entries(byRegion).sort(([, a], [, b]) => b.area - a.area);
  const maxRegion = Math.max(...regionList.map(([, d]) => d.area));

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

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Largest Countries in the World by Area 2026
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mb-2">
            All 195 countries ranked by total area. <strong>{top10[0].name}</strong> is largest at{' '}
            <strong>{top10[0].areaKm2.toLocaleString()} km²</strong> — {((top10[0].areaKm2 / worldLandArea) * 100).toFixed(1)}% of world land,
            roughly twice the size of <strong>{top10[1].name}</strong>. Top 10 cover {top10Share.toFixed(0)}% of all national land.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Area:{' '}
            <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a>{' '}
            · Population:{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN WPP 2024</a>
          </p>

          {/* Top 3 + world total */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {top10.slice(0, 3).map((c, i) => (
              <div key={c.slug} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">#{i + 1} largest</div>
                <Link href={`/${c.slug}`} className="block text-base font-bold text-gray-900 hover:text-blue-700 mb-1">{c.name}</Link>
                <div className="text-2xl font-bold text-blue-700">{formatArea(c.areaKm2)}</div>
                <div className="text-xs text-gray-600 mt-1">{((c.areaKm2 / worldLandArea) * 100).toFixed(1)}% of world · CIA Factbook</div>
              </div>
            ))}
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-600">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">World total</div>
              <div className="text-base font-bold text-gray-900 mb-1">All 195 countries</div>
              <div className="text-2xl font-bold text-green-700">{formatArea(worldLandArea)}</div>
              <div className="text-xs text-gray-600 mt-1">Sum of CIA Factbook figures</div>
            </div>
          </div>

          {/* Data Sources panel — prominent */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">📋 Data Sources & Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Area figures</div>
                <p className="text-gray-700">
                  Total area (land + inland water) from the{' '}
                  <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a>.
                  Includes inland water bodies (lakes, rivers, reservoirs).
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Population & density</div>
                <p className="text-gray-700">
                  Population from{' '}
                  <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN WPP 2024</a>.
                  Density = population ÷ total area.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Countries included</div>
                <p className="text-gray-700">
                  193 UN member states + 2 observer states (Holy See, Palestine). Antarctica, dependencies (Greenland, Puerto Rico), and EEZs excluded.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Disputed territories</div>
                <p className="text-gray-700">
                  Attributed per CIA Factbook conventions (de facto control). India, China, Pakistan, Israel, Morocco, Argentina have notable disputed claims affecting figures by small amounts.
                </p>
              </div>
            </div>
          </section>

          <div className="mb-8">
            <RankingBarChart
              items={top10.map<BarItem>((c, i) => ({
                rank: i + 1,
                name: c.name,
                slug: c.slug,
                value: c.areaKm2,
                formatted: `${(c.areaKm2 / 1_000_000).toFixed(2)}M km²`,
                share: `${((c.areaKm2 / worldLandArea) * 100).toFixed(1)}% of world`,
              }))}
              title="Top 10 Countries by Land Area"
              axisLabel="Total area in millions of km² (land + inland water)"
              source="Source: CIA World Factbook"
              color="emerald"
              ticks={[
                { value: 0, label: '0' },
                { value: 3_000_000, label: '3M' },
                { value: 6_000_000, label: '6M' },
                { value: 9_000_000, label: '9M' },
                { value: 12_000_000, label: '12M' },
                { value: 15_000_000, label: '15M' },
                { value: 18_000_000, label: '18M' },
              ]}
              caption={
                <>
                  These 10 countries cover roughly <strong>{top10Share.toFixed(0)}%</strong> of
                  all national land area on Earth — fewer than 5% of countries hold more than
                  half of all land.
                </>
              }
            />
          </div>

          {/* Top 10 ranking table */}
          <section className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-900">Top 10 Largest Countries</h2>
              <span className="text-xs text-gray-500">Source: CIA World Factbook</span>
            </div>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Area (km²)</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">% world</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Population 2024</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {top10.map((c, i) => (
                  <tr key={c.slug} className="hover:bg-blue-50">
                    <td className="px-4 py-2 text-gray-700 font-medium">{i + 1}</td>
                    <td className="px-4 py-2"><Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{c.name}</Link></td>
                    <td className="px-4 py-2 text-right text-gray-900 font-semibold">{c.areaKm2.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{((c.areaKm2 / worldLandArea) * 100).toFixed(1)}%</td>
                    <td className="px-4 py-2 text-right text-gray-700">{formatPopulation(c.population2024)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr className="text-sm font-semibold">
                  <td colSpan={2} className="px-4 py-2 text-gray-700">Top 10 combined</td>
                  <td className="px-4 py-2 text-right text-gray-900">{top10.reduce((s, c) => s + c.areaKm2, 0).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-gray-700">{top10Share.toFixed(0)}%</td>
                  <td className="px-4 py-2 text-right text-gray-500">—</td>
                </tr>
              </tfoot>
            </table>
          </section>

          {/* Geographic profile table */}
          <section className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-900">Geographic Profile of the Top 10</h2>
              <span className="text-xs text-gray-500">Climate, coastline, distinguishing features</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Climate zones</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Coastline</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Distinguishing feature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {top10.map((c) => {
                    const g = TOP10_GEOGRAPHY[c.slug];
                    if (!g) return null;
                    return (
                      <tr key={c.slug}>
                        <td className="px-4 py-2"><Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{c.name}</Link></td>
                        <td className="px-4 py-2 text-gray-700">{g.climate}</td>
                        <td className="px-4 py-2 text-gray-700">{g.coastline}</td>
                        <td className="px-4 py-2 text-gray-700">{g.uniqueFact}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 text-xs text-gray-600 border-t border-gray-200">
              Source: CIA World Factbook (coastline, climate); Natural Earth (terrain).
            </div>
          </section>

          {/* Area vs Population mismatch — concrete data */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Area vs Population: A Major Mismatch</h2>
            <p className="text-sm text-gray-600 mb-4">Land size doesn&apos;t predict population. The world&apos;s biggest countries are mostly empty.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Biggest, but not most populated</div>
                <div className="space-y-1 text-gray-700">
                  <div><strong>Russia</strong>: #1 area, #9 population (8/km²)</div>
                  <div><strong>Canada</strong>: #2 area, #38 population (4/km²)</div>
                  <div><strong>Australia</strong>: #6 area, #55 population (3/km²)</div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">In top 10 of both</div>
                <div className="space-y-1 text-gray-700">
                  <div><strong>China</strong>: #4 area, #2 population</div>
                  <div><strong>USA</strong>: #3 area, #3 population</div>
                  <div><strong>Brazil</strong>: #5 area, #7 population</div>
                  <div><strong>India</strong>: #7 area, #1 population</div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Most populated, but not biggest</div>
                <div className="space-y-1 text-gray-700">
                  <div><strong>Indonesia</strong>: #4 pop, #14 area</div>
                  <div><strong>Pakistan</strong>: #5 pop, #33 area</div>
                  <div><strong>Bangladesh</strong>: #8 pop, #92 area</div>
                  <div><strong>Nigeria</strong>: #6 pop, #32 area</div>
                </div>
              </div>
            </div>
          </section>

          {/* Land area by region */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-baseline flex-wrap gap-2 mb-4">
              <h2 className="text-xl font-bold text-gray-900">Land Area by Region</h2>
              <span className="text-xs text-gray-500">Source: CIA World Factbook · sum across 195 countries</span>
            </div>
            <div className="space-y-2">
              {regionList.map(([region, d]) => (
                <div key={region}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-900">{region}</span>
                    <span className="text-gray-700">{formatArea(d.area)} · {((d.area / worldLandArea) * 100).toFixed(1)}% · {d.count} countries</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded" style={{ width: `${(d.area / maxRegion) * 100}%` }} aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Historical changes — structured timeline */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Recent Ranking Changes</h2>
            <p className="text-sm text-gray-600 mb-4">The top 10 has been stable for decades. Notable shifts:</p>
            <div className="space-y-3">
              {[
                { year: '1991', event: 'USSR dissolution', detail: 'World\'s largest country (22M km²) breaks into 15 successor states. Russia inherits 17M km² and remains #1. Kazakhstan instantly becomes the 9th largest country.' },
                { year: '2011', event: 'South Sudan separates from Sudan', detail: 'Sudan loses ~25% of its area. Algeria displaces Sudan as Africa\'s largest country.' },
                { year: '1993', event: 'Eritrea independence', detail: 'Ethiopia loses its coastline and becomes Africa\'s largest landlocked country.' },
                { year: '2006', event: 'Montenegro independence', detail: 'Last major European border change; Serbia\'s area shrinks but rank unchanged.' },
              ].map((e, i) => (
                <div key={i} className="flex gap-4 border-l-4 border-blue-600 pl-4 py-1">
                  <div className="font-bold text-blue-700 w-16 shrink-0">{e.year}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{e.event}</div>
                    <div className="text-sm text-gray-700">{e.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Source: UN treaty records; CIA Factbook historical revisions.</p>
          </section>

          {/* Comparative scale — grid not prose */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Putting These Sizes in Perspective</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded p-4">
                <div className="text-2xl font-bold text-blue-700 mb-1">17.1M km²</div>
                <div className="font-semibold text-gray-900 mb-1">Russia is roughly...</div>
                <div className="text-gray-700">the size of Pluto&apos;s surface. Larger than Antarctica&apos;s ice-free land. Spans 11 time zones.</div>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <div className="text-2xl font-bold text-blue-700 mb-1">9.98M km²</div>
                <div className="font-semibold text-gray-900 mb-1">Canada is roughly...</div>
                <div className="text-gray-700">the size of all of Europe (including European Russia). Its province of Nunavut alone is bigger than Mexico.</div>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <div className="text-2xl font-bold text-blue-700 mb-1">8.52M km²</div>
                <div className="font-semibold text-gray-900 mb-1">Brazil could fit...</div>
                <div className="text-gray-700">the continental US inside it with ~600,000 km² to spare. Holds 60% of the Amazon rainforest.</div>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <div className="text-2xl font-bold text-blue-700 mb-1">7.69M km²</div>
                <div className="font-semibold text-gray-900 mb-1">Australia is roughly...</div>
                <div className="text-gray-700">80% the size of the continental US — yet has a population smaller than Texas.</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Sources: CIA World Factbook (areas); UN WPP 2024 (populations).</p>
          </section>

          {/* Full table */}
          <section className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-900">All 195 Countries Ranked by Area</h2>
              <span className="text-xs text-gray-500">Source: CIA World Factbook</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Region</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Area (km²)</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Population 2024</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Density /km²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedByArea.map((c, i) => (
                    <tr key={c.slug} className="hover:bg-blue-50">
                      <td className="px-4 py-1.5 text-gray-700">{i + 1}</td>
                      <td className="px-4 py-1.5"><Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{c.name}</Link></td>
                      <td className="px-4 py-1.5 text-gray-600">{c.region}</td>
                      <td className="px-4 py-1.5 text-right text-gray-900 font-medium">{c.areaKm2.toLocaleString()}</td>
                      <td className="px-4 py-1.5 text-right text-gray-700">{formatPopulation(c.population2024)}</td>
                      <td className="px-4 py-1.5 text-right text-gray-700">{c.densityPerKm2 > 0 ? formatDensity(c.densityPerKm2) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Glossary */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Geography Glossary</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ['Total area', 'Combined land plus internal water (lakes, rivers, reservoirs). Used in this ranking.'],
                ['Land area', 'Excludes inland water. Differs most for Canada (8% water), the US, and Russia.'],
                ['Exclusive Economic Zone (EEZ)', '200 nautical miles from coast where a country has special economic rights. France has the largest EEZ.'],
                ['Continent', 'One of the seven large landmasses. Australia is the only country occupying an entire continent.'],
                ['Landlocked', 'No direct access to the open ocean. Kazakhstan is largest; 44 countries are landlocked.'],
                ['Doubly landlocked', 'Surrounded only by other landlocked countries. Just two: Liechtenstein and Uzbekistan.'],
                ['Transcontinental country', 'Territory in more than one continent. Russia, Turkey, Egypt are the main examples.'],
                ['Population density', 'People per km². World average ~60. Top-10-largest countries are mostly low density.'],
              ].map(([term, def]) => (
                <div key={term as string}>
                  <dt className="font-semibold text-gray-900">{term}</dt>
                  <dd className="text-gray-700">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {[
                { q: 'What is the largest country in the world?', a: `${top10[0].name}, at ${top10[0].areaKm2.toLocaleString()} km² — ~${((top10[0].areaKm2 / worldLandArea) * 100).toFixed(1)}% of world land. (Source: CIA World Factbook)` },
                { q: 'What are the top 10 largest countries?', a: `${top10.map((c, i) => `${i + 1}. ${c.name} (${formatArea(c.areaKm2)})`).join(', ')}.` },
                { q: 'Is the US bigger than China?', a: 'By total area, yes (9.83M vs 9.60M km²). By land area only, China is marginally larger. CIA Factbook places the US third.' },
                { q: 'Why is Russia the largest?', a: 'Four centuries of eastward expansion from Muscovy across Siberia (~1700), plus 19th-century expansion into Central Asia. Most of Russia is sparsely populated Siberian taiga.' },
                { q: 'How much of Earth\'s land do the top 10 cover?', a: `${top10Share.toFixed(0)}% of all national land area.` },
                { q: 'What is the largest country in Africa?', a: 'Algeria, at 2,381,741 km². Africa\'s largest since South Sudan separated from Sudan in 2011.' },
                { q: 'What is the largest country in Europe?', a: 'Excluding transcontinental Russia, Ukraine at 603,628 km² is entirely European. France is largest in the EU.' },
                { q: 'What is the largest country in South America?', a: 'Brazil, at 8.5M km² — half the continent.' },
                { q: 'What is the largest landlocked country?', a: 'Kazakhstan, 2.72M km² — larger than Western Europe.' },
                { q: 'How densely populated are the largest countries?', a: 'Mostly low density. India is highest at ~440/km²; Australia, Kazakhstan, Russia, Canada all under 10/km².' },
                { q: 'Did the Soviet collapse change the rankings?', a: 'Yes. The USSR was 22M+ km². Russia kept 17M and stayed #1; Kazakhstan, Ukraine, others became separate countries.' },
                { q: 'How are disputed territories counted?', a: 'Per CIA Factbook conventions (de facto control). India, China, Pakistan, Israel, Morocco, Argentina all have notable claims that affect figures slightly.' },
                { q: 'Is Australia a country or continent?', a: 'Both. Only country occupying an entire continent.' },
                { q: 'What is total area vs land area?', a: 'Total area includes inland water (lakes, rivers); land area excludes them. Differs most for Canada, US, Russia.' },
                { q: 'When was this page last updated?', a: `${LAST_UPDATED}. Area data is stable over decades.` },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                  <p className="text-sm text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Cross-links */}
          <section className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Explore More Rankings</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li><Link href="/top-10-largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Largest (detailed profiles)</Link></li>
              <li><Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Most Populated Countries</Link></li>
              <li><Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Smallest Countries</Link></li>
              <li><Link href="/top-10-most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Most Populated</Link></li>
              <li><Link href="/countries" className="text-blue-700 hover:text-blue-900 font-medium">→ All 195 Countries with Demographics</Link></li>
              <li><Link href="/compare" className="text-blue-700 hover:text-blue-900 font-medium">→ Compare Any Two Countries</Link></li>
            </ul>
          </section>

          {/* Sources footer */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources & Further Reading</h3>
            <ul className="space-y-1">
              <li><strong>Area data:</strong> <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a></li>
              <li><strong>Population data:</strong> <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN World Population Prospects 2024</a></li>
              <li><strong>Maritime zones:</strong> <a href="https://www.un.org/depts/los/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN Convention on the Law of the Sea</a></li>
              <li>Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
