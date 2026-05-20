import Link from 'next/link';
import { getCountryRankings, formatPopulation, formatDensity } from '@/lib/country-rankings';
import { getWorldMapPaths } from '@/lib/world-map-data';
import WorldPopulationMap, { CountryMapDatum } from '@/components/WorldPopulationMap';
import RankingBarChart, { BarItem } from '@/components/RankingBarChart';

export const metadata = {
  title: 'Most Populated Countries in the World 2026 — All 195 Ranked',
  description:
    'Complete list of every country in the world ranked by population in 2026. India and China each hold over 1.4 billion people; the United States is third with 340 million. Interactive world map, sortable table, regional breakdowns, projections to 2050 and 2100, glossary, methodology, and 15-question FAQ. Data from UN World Population Prospects 2024.',
  keywords:
    'most populated countries, countries by population, most populous nations, largest countries by population, countries ranked by population, world population by country, list of countries by population, every country population, population by country, world population ranking, world population map',
  openGraph: {
    title: 'Most Populated Countries in the World 2026 — Interactive Map + All 195 Ranked',
    description:
      'Interactive world map showing every country\'s population. Sortable rankings, regional breakdowns, historical evolution since 1950, projections to 2100, glossary, methodology, and 15-question FAQ.',
    type: 'website',
    url: 'https://populationpyramids.org/most-populated-countries',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/most-populated-countries',
  },
};

const LAST_UPDATED = '2026-05-18';
const PUBLISHED = '2026-05-18';

// Stable, hand-curated extras for the top-10 dynamics table.
// Source: UN World Population Prospects 2024 Revision (medium-variant projections).
const TOP10_EXTRAS: Record<string, { tfr: number; pop2050: string; trend: 'rising' | 'flat' | 'falling' }> = {
  india: { tfr: 2.0, pop2050: '1.67B', trend: 'rising' },
  china: { tfr: 1.0, pop2050: '1.31B', trend: 'falling' },
  'united-states': { tfr: 1.7, pop2050: '375M', trend: 'rising' },
  indonesia: { tfr: 2.1, pop2050: '320M', trend: 'rising' },
  pakistan: { tfr: 3.4, pop2050: '368M', trend: 'rising' },
  nigeria: { tfr: 5.0, pop2050: '377M', trend: 'rising' },
  brazil: { tfr: 1.7, pop2050: '220M', trend: 'flat' },
  bangladesh: { tfr: 2.0, pop2050: '203M', trend: 'rising' },
  russia: { tfr: 1.5, pop2050: '134M', trend: 'falling' },
  mexico: { tfr: 1.8, pop2050: '143M', trend: 'flat' },
};

// Demographic-transition stage classification — stable knowledge.
const TRANSITION_STAGE: Record<string, { stage: string; note: string }> = {
  india: { stage: 'Late transition · growing', note: 'TFR near replacement; momentum keeps growth' },
  china: { stage: 'Post-transition · shrinking', note: 'TFR ~1.0; population began falling in 2022' },
  'united-states': { stage: 'Late transition · growing', note: 'TFR below replacement, immigration adds ~1M/yr' },
  indonesia: { stage: 'Late transition · growing', note: 'TFR right at replacement, growth slowing' },
  pakistan: { stage: 'Mid transition · fast growth', note: 'TFR ~3.4, very young population' },
  nigeria: { stage: 'Early transition · very fast growth', note: 'TFR ~5.0, +5M people/yr' },
  brazil: { stage: 'Post-transition · plateauing', note: 'TFR ~1.7, growth nearly zero' },
  bangladesh: { stage: 'Late transition · slowing', note: 'TFR ~2.0, dramatic fertility decline' },
  russia: { stage: 'Post-transition · shrinking', note: 'TFR ~1.5, emigration adds to decline' },
  mexico: { stage: 'Post-transition · plateauing', note: 'TFR ~1.8, growth slowed sharply' },
};

// Per-country narrative for the "in depth" cards — kept short and concrete.
const PROFILES: Record<string, string> = {
  india:
    'Became the world\'s most populous country in 2023 — the first new #1 in 22 centuries. UN projects peak around 1.7 billion in the late 2060s before slow decline. Fertility has fallen close to replacement.',
  china:
    'Population began declining in 2022 after over two millennia at #1. TFR ~1.0 is among the world\'s lowest. UN central projection: loses hundreds of millions by 2100.',
  'united-states':
    'Third most populous country and by far the largest developed economy. Continued growth depends on immigration — currently ~1M net migrants per year offsetting below-replacement fertility.',
  indonesia:
    'Fourth most populous and the largest Muslim-majority country. 56% of the population lives on Java — one of the most densely populated large islands on Earth.',
  pakistan:
    'Fifth largest and youngest of the top 10 — median age ~22. Projected to overtake Indonesia by 2050. Demographic dividend just beginning.',
};

function generateSchema(top10: any[], worldPopulation: number) {
  const top3 = top10.slice(0, 3);
  const top3Text = top3.map((c) => `${c.name} (${formatPopulation(c.population2024)})`).join(', ');
  const top3Share = top3.reduce((s, c) => s + c.worldPopulationShare, 0);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': 'https://populationpyramids.org/most-populated-countries#article',
        headline: 'Most Populated Countries in the World 2026 — All 195 Ranked',
        description:
          'A complete, sourced ranking of every country by population, with interactive world map, regional breakdowns, demographic context, and projections to 2100.',
        author: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        publisher: {
          '@type': 'Organization',
          name: 'PopulationPyramids.org',
          url: 'https://populationpyramids.org',
          logo: { '@type': 'ImageObject', url: 'https://populationpyramids.org/icon.svg' },
        },
        datePublished: PUBLISHED,
        dateModified: LAST_UPDATED,
        mainEntityOfPage: 'https://populationpyramids.org/most-populated-countries',
        articleSection: 'Demographics',
        wordCount: 5000,
        citation: [
          {
            '@type': 'CreativeWork',
            name: 'World Population Prospects 2024',
            author: 'United Nations Department of Economic and Social Affairs, Population Division',
            url: 'https://population.un.org/wpp/',
          },
          {
            '@type': 'CreativeWork',
            name: 'The World Factbook',
            author: 'Central Intelligence Agency',
            url: 'https://www.cia.gov/the-world-factbook/',
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/most-populated-countries#webpage',
        name: 'Most Populated Countries in the World 2026',
        url: 'https://populationpyramids.org/most-populated-countries',
        description: 'Complete ranking of all 195 countries by population in 2026 with interactive map.',
        inLanguage: 'en-US',
        isPartOf: { '@type': 'WebSite', name: 'Population Pyramids', url: 'https://populationpyramids.org' },
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/most-populated-countries#dataset',
        name: 'World Countries Ranked by Population 2026',
        description: 'Population data for all 195 countries with rankings, growth rates, median age, density.',
        url: 'https://populationpyramids.org/most-populated-countries',
        creator: {
          '@type': 'Organization',
          name: 'United Nations Department of Economic and Social Affairs, Population Division',
          url: 'https://population.un.org/',
        },
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        temporalCoverage: '1950/2100',
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
      {
        '@type': 'ItemList',
        '@id': 'https://populationpyramids.org/most-populated-countries#itemlist',
        name: 'Top 10 Most Populated Countries 2026',
        numberOfItems: 10,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: top10.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          description: `${c.population2024.toLocaleString()} people (${c.worldPopulationShare.toFixed(1)}% of world)`,
          url: `https://populationpyramids.org/${c.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Countries', item: 'https://populationpyramids.org/countries' },
          { '@type': 'ListItem', position: 3, name: 'Most Populated Countries', item: 'https://populationpyramids.org/most-populated-countries' },
        ],
      },
      {
        '@type': 'DefinedTermSet',
        '@id': 'https://populationpyramids.org/most-populated-countries#glossary',
        name: 'Demographic Glossary',
        hasDefinedTerm: [
          { '@type': 'DefinedTerm', name: 'Population', description: 'Total number of people living in a defined area; UN figures are mid-year de facto estimates.' },
          { '@type': 'DefinedTerm', name: 'Median Age', description: 'The age dividing a population into equal halves.' },
          { '@type': 'DefinedTerm', name: 'Total Fertility Rate', description: 'Average number of children per woman at current rates; replacement level ~2.1.' },
          { '@type': 'DefinedTerm', name: 'Demographic Transition', description: 'Shift from high fertility and mortality to low fertility and mortality.' },
          { '@type': 'DefinedTerm', name: 'Demographic Dividend', description: 'Period when working-age share peaks relative to dependents.' },
          { '@type': 'DefinedTerm', name: 'Demographic Momentum', description: 'Continued growth after fertility falls to replacement, due to a large young cohort.' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is the most populated country in the world?', acceptedAnswer: { '@type': 'Answer', text: `${top10[0].name} with ${top10[0].population2024.toLocaleString()} people in 2024 (UN WPP 2024), about ${top10[0].worldPopulationShare.toFixed(1)}% of the global population. India overtook China for the top position in 2023.` } },
          { '@type': 'Question', name: 'What are the top 10 most populated countries?', acceptedAnswer: { '@type': 'Answer', text: top10.map((c, i) => `${i + 1}. ${c.name} (${formatPopulation(c.population2024)})`).join(', ') + '.' } },
          { '@type': 'Question', name: 'How many people live on Earth?', acceptedAnswer: { '@type': 'Answer', text: `Approximately ${formatPopulation(worldPopulation)} people across 195 countries (UN 2024 estimate). Top 3 — ${top3Text} — hold ~${top3Share.toFixed(0)}% of humanity.` } },
          { '@type': 'Question', name: 'Did India overtake China?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. UN World Population Prospects 2024 confirms India surpassed China in 2023. India continues to grow; China\'s population began declining in 2022.' } },
          { '@type': 'Question', name: 'Which country will be most populated in 2050?', acceptedAnswer: { '@type': 'Answer', text: 'India, projected at ~1.67 billion (UN medium-variant). China second at 1.31B; Nigeria third at 377M, overtaking the United States.' } },
          { '@type': 'Question', name: 'Which continent has the most people?', acceptedAnswer: { '@type': 'Answer', text: 'Asia — about 60% of world population. Africa is second (~19%) and fastest-growing, followed by Europe (10%), Latin America & Caribbean (8%), Northern America (5%), Oceania (<1%).' } },
          { '@type': 'Question', name: 'Why is China\'s population falling?', acceptedAnswer: { '@type': 'Answer', text: 'Decades of below-replacement fertility (TFR ~1.0), partly from the one-child policy (1980–2015). Population peaked ~2021 and began falling in 2022. Limited immigration prospects to offset decline.' } },
          { '@type': 'Question', name: 'Why does India have so many people?', acceptedAnswer: { '@type': 'Answer', text: '5,000 years of settled agriculture on the fertile Indo-Gangetic plain combined with 20th-century declines in mortality before fertility fell. TFR is now ~2.0 (near replacement) but demographic momentum keeps the population growing for decades.' } },
          { '@type': 'Question', name: 'Which countries are growing fastest?', acceptedAnswer: { '@type': 'Answer', text: 'In absolute terms: Nigeria, DR Congo, Tanzania, Ethiopia, Pakistan. By percentage: many sub-Saharan African countries projected to more than double by 2050.' } },
          { '@type': 'Question', name: 'Which countries are shrinking?', acceptedAnswer: { '@type': 'Answer', text: 'China, Japan, Russia, Ukraine, Italy, Poland, South Korea, Thailand are all in long-term decline. Drivers: low fertility plus, in some cases, emigration.' } },
          { '@type': 'Question', name: 'What\'s the difference between most populated and largest?', acceptedAnswer: { '@type': 'Answer', text: '"Most populated" = number of people. "Largest" = land area. Russia is largest by area but 9th by population. India is 1st by population but 7th by area.' } },
          { '@type': 'Question', name: 'How accurate are these numbers?', acceptedAnswer: { '@type': 'Answer', text: 'For developed countries, accurate to within ~1%. For countries with weaker statistical capacity (parts of sub-Saharan Africa, conflict zones), figures can vary by several percent. UN publishes uncertainty intervals.' } },
          { '@type': 'Question', name: 'How are micronations and disputed territories counted?', acceptedAnswer: { '@type': 'Answer', text: 'The 195 countries here are the 193 UN member states + 2 observer states (Holy See, Palestine). Taiwan is reported as part of China. Kosovo, Somaliland, Transnistria not separately counted.' } },
          { '@type': 'Question', name: 'Where does this data come from?', acceptedAnswer: { '@type': 'Answer', text: 'UN World Population Prospects 2024 Revision (population.un.org/wpp). Boundaries: Natural Earth via world-atlas. Page last updated ' + LAST_UPDATED + '.' } },
          { '@type': 'Question', name: 'Will any country reach 2 billion?', acceptedAnswer: { '@type': 'Answer', text: 'No, per UN medium-variant projections. India peaks around 1.7 billion in the late 2060s. China peaked at ~1.43 billion. No country is projected to reach 2 billion this century.' } },
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
  const top10Share = top10.reduce((s, c) => s + c.worldPopulationShare, 0);

  // Build map data
  const features = getWorldMapPaths();
  const dataByAlpha: Record<string, CountryMapDatum> = {};
  for (const c of countries) {
    dataByAlpha[c.code] = {
      population2024: c.population2024,
      worldPopulationShare: c.worldPopulationShare,
      slug: c.slug,
      medianAge2024: c.medianAge2024,
      densityPerKm2: c.densityPerKm2,
      region: c.region,
      areaKm2: c.areaKm2,
    };
  }

  // Regional aggregation
  const byRegion = countries.reduce<Record<string, { pop: number; count: number }>>((acc, c) => {
    if (!acc[c.region]) acc[c.region] = { pop: 0, count: 0 };
    acc[c.region].pop += c.population2024;
    acc[c.region].count += 1;
    return acc;
  }, {});
  const regionList = Object.entries(byRegion).sort(([, a], [, b]) => b.pop - a.pop);
  const maxRegion = Math.max(...regionList.map(([, d]) => d.pop));

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

          {/* H1 + concise lede */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Most Populated Countries in the World 2026
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mb-2">
            All 195 countries ranked by population. <strong>{top10[0].name}</strong> leads with{' '}
            <strong>{top10[0].population2024.toLocaleString()}</strong> people —{' '}
            {top10[0].worldPopulationShare.toFixed(1)}% of humanity. Top three:{' '}
            {top3.map((c) => c.name).join(', ')} together hold {top3Share.toFixed(0)}% of all
            humans.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Population data:{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN WPP 2024</a>{' '}
            · Boundaries:{' '}
            <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">Natural Earth</a>
          </p>

          {/* Top 3 + world total stat row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {top3.map((c, i) => (
              <div key={c.slug} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">#{i + 1} most populated</div>
                <Link href={`/${c.slug}`} className="block text-base font-bold text-gray-900 hover:text-blue-700 mb-1">{c.name}</Link>
                <div className="text-2xl font-bold text-blue-700">{formatPopulation(c.population2024)}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {c.worldPopulationShare.toFixed(1)}% of world · Source: UN WPP 2024
                </div>
              </div>
            ))}
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-600">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">World total</div>
              <div className="text-base font-bold text-gray-900 mb-1">All 195 countries</div>
              <div className="text-2xl font-bold text-green-700">{formatPopulation(worldPopulation)}</div>
              <div className="text-xs text-gray-600 mt-1">
                Sum of UN 2024 mid-year estimates
              </div>
            </div>
          </div>

          {/* INTERACTIVE WORLD MAP */}
          <div className="mb-8">
            <WorldPopulationMap features={features} dataByAlpha={dataByAlpha} />
          </div>

          {/* Sources & methodology panel — PROMINENT, not buried */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">📋 Data Sources & Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Population figures</div>
                <p className="text-gray-700">
                  Mid-2024 estimates from the{' '}
                  <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                    UN World Population Prospects 2024 Revision
                  </a>
                  . <em>De facto</em> definition (people where they live, regardless of citizenship).
                  Mid-year reference point. Medium-variant projections to 2100.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Land area & density</div>
                <p className="text-gray-700">
                  Total area (including inland water) from the{' '}
                  <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                    CIA World Factbook
                  </a>
                  . Density = UN population ÷ Factbook area.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Countries included</div>
                <p className="text-gray-700">
                  The 195 sovereign states recognized by the UN: 193 member states + 2 observer
                  states (Holy See, Palestine). Taiwan reported as part of China per UN convention.
                  Kosovo, Somaliland, Transnistria not separately counted.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Map boundaries</div>
                <p className="text-gray-700">
                  <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                    Natural Earth
                  </a>{' '}
                  via{' '}
                  <a href="https://github.com/topojson/world-atlas" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                    world-atlas
                  </a>
                  . 110m resolution — tiny island nations (Vatican, Monaco, Marshall Islands, etc.)
                  are below this resolution and don&apos;t appear on the map (they&apos;re in the
                  full table below).
                </p>
              </div>
            </div>
          </section>

          {/* The "India overtook China" milestone — structured callout */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-orange-500">
            <div className="flex items-baseline gap-3 flex-wrap mb-3">
              <h2 className="text-xl font-bold text-gray-900">2023: A historic milestone</h2>
              <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded">First new #1 in 22 centuries</span>
            </div>
            <p className="text-gray-700">
              India overtook China to become the world&apos;s most populous country in 2023 — the
              first change at the top of the ranking since the Qin dynasty unified China in 221
              BCE. The cause is not that India suddenly accelerated, but that China&apos;s growth
              stopped: after decades of below-replacement fertility, China&apos;s population
              peaked around 2021 and began declining in 2022.
            </p>
            <p className="text-xs text-gray-500 mt-2">Source: UN World Population Prospects 2024 Revision; UN press release, April 2023.</p>
          </section>

          {/* Bar chart of top 10 */}
          <div className="mb-8">
            <RankingBarChart
              items={top10.map<BarItem>((c, i) => ({
                rank: i + 1,
                name: c.name,
                slug: c.slug,
                value: c.population2024,
                formatted: formatPopulation(c.population2024),
                share: `${c.worldPopulationShare.toFixed(1)}% of world`,
              }))}
              title="Top 10 Countries by Population (2024)"
              axisLabel="Population (mid-year 2024 estimate)"
              source="Source: UN World Population Prospects 2024 Revision"
              color="blue"
              ticks={[
                { value: 0, label: '0' },
                { value: 250_000_000, label: '250M' },
                { value: 500_000_000, label: '500M' },
                { value: 750_000_000, label: '750M' },
                { value: 1_000_000_000, label: '1B' },
                { value: 1_250_000_000, label: '1.25B' },
                { value: 1_500_000_000, label: '1.5B' },
              ]}
              caption={
                <>
                  Together these 10 countries hold roughly{' '}
                  <strong>{top10Share.toFixed(0)}%</strong> of all humans on Earth — meaning
                  fewer than 5% of countries account for nearly two-thirds of the world&apos;s
                  population.
                </>
              }
            />
          </div>

          {/* Top 10 ranking table */}
          <section className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-900">Top 10 Most Populated Countries</h2>
              <span className="text-xs text-gray-500">Source: UN WPP 2024 · Mid-2024 estimates</span>
            </div>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Population</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">% world</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Change 2000–24</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {top10.map((c, i) => (
                  <tr key={c.slug} className="hover:bg-blue-50">
                    <td className="px-4 py-2 text-gray-700 font-medium">{i + 1}</td>
                    <td className="px-4 py-2">
                      <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{c.name}</Link>
                    </td>
                    <td className="px-4 py-2 text-right text-gray-900 font-semibold">{c.population2024.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{c.worldPopulationShare.toFixed(2)}%</td>
                    <td className="px-4 py-2 text-right">
                      <span className={c.populationChangePercent > 0 ? 'text-green-700' : 'text-red-600'}>
                        {c.populationChangePercent > 0 ? '+' : ''}{c.populationChangePercent.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr className="text-sm font-semibold">
                  <td colSpan={2} className="px-4 py-2 text-gray-700">Top 10 combined</td>
                  <td className="px-4 py-2 text-right text-gray-900">{top10.reduce((s, c) => s + c.population2024, 0).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-gray-700">{top10Share.toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right text-gray-500">—</td>
                </tr>
              </tfoot>
            </table>
          </section>

          {/* Top 10 demographic dynamics table */}
          <section className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-900">Top 10: Demographic Dynamics</h2>
              <span className="text-xs text-gray-500">Source: UN WPP 2024 · TFR, density, projections</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Pop 2024</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Median age</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">TFR</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Density</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Projected 2050</th>
                    <th scope="col" className="px-4 py-2.5 text-center font-semibold text-gray-700">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {top10.map((c) => {
                    const ex = TOP10_EXTRAS[c.slug];
                    return (
                      <tr key={c.slug}>
                        <td className="px-4 py-2">
                          <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{c.name}</Link>
                        </td>
                        <td className="px-4 py-2 text-right text-gray-900">{formatPopulation(c.population2024)}</td>
                        <td className="px-4 py-2 text-right text-gray-700">{c.medianAge2024 > 0 ? c.medianAge2024.toFixed(1) : '—'}</td>
                        <td className="px-4 py-2 text-right text-gray-700">{ex?.tfr.toFixed(1) ?? '—'}</td>
                        <td className="px-4 py-2 text-right text-gray-700">{c.densityPerKm2 > 0 ? formatDensity(c.densityPerKm2) : '—'}</td>
                        <td className="px-4 py-2 text-right text-gray-700">{ex?.pop2050 ?? '—'}</td>
                        <td className="px-4 py-2 text-center">
                          {ex?.trend === 'rising' && <span className="text-green-700 font-bold">↑</span>}
                          {ex?.trend === 'flat' && <span className="text-gray-500 font-bold">→</span>}
                          {ex?.trend === 'falling' && <span className="text-red-600 font-bold">↓</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 text-xs text-gray-600 border-t border-gray-200">
              <strong>TFR</strong> = total fertility rate (avg. children per woman; replacement ≈ 2.1).{' '}
              <strong>Density</strong> = people per km² of total area.{' '}
              <strong>Projected 2050</strong> = UN medium-variant projection.
            </div>
          </section>

          {/* Top 5 in depth — compact cards, not long prose */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">The Top 5 in Brief</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {top10.slice(0, 5).map((c, i) => (
                <article key={c.slug} className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-blue-600">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      <Link href={`/${c.slug}`} className="hover:text-blue-700">{c.name}</Link>
                    </h3>
                    <span className="text-xs font-bold text-blue-700">#{i + 1}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 mb-2">{formatPopulation(c.population2024)}</div>
                  <p className="text-sm text-gray-700 mb-2">{PROFILES[c.slug]}</p>
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Source: UN WPP 2024
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Continent breakdown — bar chart style cards */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-baseline flex-wrap gap-2 mb-4">
              <h2 className="text-xl font-bold text-gray-900">Population by Region</h2>
              <span className="text-xs text-gray-500">Source: UN WPP 2024</span>
            </div>
            <div className="space-y-2">
              {regionList.map(([region, d]) => (
                <div key={region}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-900">{region}</span>
                    <span className="text-gray-700">
                      {formatPopulation(d.pop)} · {((d.pop / worldPopulation) * 100).toFixed(1)}% · {d.count} countries
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded"
                      style={{ width: `${(d.pop / maxRegion) * 100}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Drivers of population change — replaces awkward prose */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What Drives Population Change?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Country populations change for three reasons. The mix varies dramatically.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">1 · Natural increase</div>
                <div className="font-semibold text-gray-900 mb-2">Births minus deaths</div>
                <p className="text-sm text-gray-700">
                  Primary driver in ~95% of countries. India, Pakistan, Nigeria, Ethiopia, Indonesia
                  all grow mainly through more births than deaths.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">2 · Net migration</div>
                <div className="font-semibold text-gray-900 mb-2">Immigration minus emigration</div>
                <p className="text-sm text-gray-700">
                  Dominant in a few wealthy countries with low fertility:{' '}
                  <strong>Canada</strong> and <strong>Australia</strong> add more people via
                  immigration than births. <strong>UAE</strong> and <strong>Qatar</strong> are even
                  more extreme — over 80% of residents are foreign-born.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">3 · Territorial change</div>
                <div className="font-semibold text-gray-900 mb-2">Rare; major historical events</div>
                <p className="text-sm text-gray-700">
                  Soviet Union breakup (1991) reshuffled top-10 dramatically. South Sudan separation
                  (2011) cut Sudan&apos;s population by ~25%. Almost no other examples in modern era.
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Source: UN Population Division methodology; national statistical offices.</p>
          </section>

          {/* Future projections side-by-side comparison */}
          <section className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">2024 vs 2050 Top 10</h2>
              <p className="text-xs text-gray-500 mt-1">Source: UN WPP 2024 medium-variant projection</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200">
              <div className="p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Today (2024)</h3>
                <ol className="space-y-1.5 text-sm">
                  {top10.map((c, i) => (
                    <li key={c.slug} className="flex justify-between border-b border-gray-100 last:border-0 py-1">
                      <span className="text-gray-700">
                        <span className="font-bold mr-2">{i + 1}.</span>
                        <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900">{c.name}</Link>
                      </span>
                      <span className="text-gray-900 font-medium">{formatPopulation(c.population2024)}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="p-6 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Projected (2050)</h3>
                <ol className="space-y-1.5 text-sm">
                  {[
                    { name: 'India', pop: '1.67B', change: 'same' },
                    { name: 'China', pop: '1.31B', change: 'same' },
                    { name: 'Nigeria', pop: '377M', change: 'up' },
                    { name: 'United States', pop: '375M', change: 'down' },
                    { name: 'Pakistan', pop: '368M', change: 'same' },
                    { name: 'Indonesia', pop: '320M', change: 'down' },
                    { name: 'Brazil', pop: '220M', change: 'same' },
                    { name: 'DR Congo', pop: '217M', change: 'new' },
                    { name: 'Ethiopia', pop: '213M', change: 'new' },
                    { name: 'Bangladesh', pop: '203M', change: 'down' },
                  ].map((c, i) => (
                    <li key={c.name} className="flex justify-between border-b border-gray-100 last:border-0 py-1">
                      <span className="text-gray-700">
                        <span className="font-bold mr-2">{i + 1}.</span>
                        {c.name}
                        {c.change === 'new' && <span className="ml-2 text-xs font-bold text-green-700 bg-green-100 px-1 rounded">NEW</span>}
                        {c.change === 'up' && <span className="ml-2 text-xs font-bold text-blue-700">↑</span>}
                        {c.change === 'down' && <span className="ml-2 text-xs font-bold text-gray-500">↓</span>}
                      </span>
                      <span className="text-gray-900 font-medium">{c.pop}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-gray-600 mt-3 italic">
                  Russia and Mexico drop out; DR Congo and Ethiopia enter.
                </p>
              </div>
            </div>
          </section>

          {/* Demographic transition stages — structured grid not prose */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Where Each Top-10 Country Sits in the Demographic Transition</h2>
            <p className="text-xs text-gray-500 mb-4">Stage classification based on TFR and population trend (UN WPP 2024).</p>
            <div className="space-y-2">
              {top10.map((c) => {
                const t = TRANSITION_STAGE[c.slug];
                if (!t) return null;
                const colorMap: Record<string, string> = {
                  'Early transition · very fast growth': 'bg-red-100 text-red-800',
                  'Mid transition · fast growth': 'bg-orange-100 text-orange-800',
                  'Late transition · growing': 'bg-yellow-100 text-yellow-800',
                  'Late transition · slowing': 'bg-amber-100 text-amber-800',
                  'Post-transition · plateauing': 'bg-blue-100 text-blue-800',
                  'Post-transition · shrinking': 'bg-purple-100 text-purple-800',
                };
                return (
                  <div key={c.slug} className="flex items-baseline gap-3 py-2 border-b border-gray-100 last:border-0">
                    <Link href={`/${c.slug}`} className="font-semibold text-blue-700 hover:text-blue-900 w-32 shrink-0">{c.name}</Link>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap ${colorMap[t.stage] ?? 'bg-gray-100 text-gray-800'}`}>{t.stage}</span>
                    <span className="text-sm text-gray-600">{t.note}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Comparative scale — grid not prose */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Putting Big Numbers in Perspective</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded p-4">
                <div className="text-2xl font-bold text-blue-700 mb-1">1.43B</div>
                <div className="font-semibold text-gray-900 mb-1">India&apos;s population is roughly...</div>
                <div className="text-gray-700">
                  the combined population of Europe + North America + South America (1.4B combined,
                  per UN regional aggregates).
                </div>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <div className="text-2xl font-bold text-blue-700 mb-1">1.43B</div>
                <div className="font-semibold text-gray-900 mb-1">China&apos;s population is roughly...</div>
                <div className="text-gray-700">
                  Africa (1.5B) plus the entire Western Hemisphere (1.05B), minus 1 billion — almost
                  twice the rest of Asia&apos;s population outside India.
                </div>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <div className="text-2xl font-bold text-blue-700 mb-1">340M</div>
                <div className="font-semibold text-gray-900 mb-1">USA&apos;s population is more than...</div>
                <div className="text-gray-700">
                  every European country&apos;s population combined except Russia, Germany, France, the
                  UK, and Italy.
                </div>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <div className="text-2xl font-bold text-blue-700 mb-1">+70M/yr</div>
                <div className="font-semibold text-gray-900 mb-1">The world adds about...</div>
                <div className="text-gray-700">
                  one Germany or France every year. India adds one Netherlands annually; Nigeria
                  adds one Norway every six months.
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Source: UN Population Division regional aggregates 2024.</p>
          </section>

          {/* Full table */}
          <section className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-900">All 195 Countries Ranked</h2>
              <span className="text-xs text-gray-500">Source: UN WPP 2024 · Area: CIA Factbook</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Region</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Population 2024</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">vs 2000</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">% world</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Density /km²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {countries.map((c, i) => (
                    <tr key={c.slug} className="hover:bg-blue-50">
                      <td className="px-4 py-1.5 text-gray-700">{i + 1}</td>
                      <td className="px-4 py-1.5">
                        <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{c.name}</Link>
                      </td>
                      <td className="px-4 py-1.5 text-gray-600">{c.region}</td>
                      <td className="px-4 py-1.5 text-right text-gray-900 font-medium">{c.population2024.toLocaleString()}</td>
                      <td className="px-4 py-1.5 text-right">
                        {c.populationChangePercent !== 0 && (
                          <span className={c.populationChangePercent > 0 ? 'text-green-700' : 'text-red-600'}>
                            {c.populationChangePercent > 0 ? '+' : ''}{c.populationChangePercent.toFixed(1)}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-1.5 text-right text-gray-700">{c.worldPopulationShare.toFixed(2)}%</td>
                      <td className="px-4 py-1.5 text-right text-gray-700">{c.densityPerKm2 > 0 ? formatDensity(c.densityPerKm2) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Glossary */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Demographic Glossary</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ['Population', 'Total number of people in a defined area. UN figures are mid-year de facto estimates (people where they live).'],
                ['Median age', 'The age dividing a population into two equal halves. World median is ~31 today; Japan 49, Niger under 15.'],
                ['Population density', 'People per km². World average ~60. Monaco >19,000, Mongolia <2.'],
                ['Total fertility rate (TFR)', 'Avg. children per woman at current rates. Replacement ≈ 2.1. World ~2.3 and falling.'],
                ['Demographic transition', 'Shift from high fertility & mortality to low. Most countries are in late or post-transition stages.'],
                ['Demographic dividend', 'Period when working-age share peaks vs dependents. India is in it now.'],
                ['Demographic momentum', 'Continued growth after fertility falls to replacement, driven by large young cohorts.'],
                ['Natural increase', 'Births minus deaths. Different from population change, which also includes net migration.'],
              ].map(([term, def]) => (
                <div key={term as string}>
                  <dt className="font-semibold text-gray-900">{term}</dt>
                  <dd className="text-gray-700">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Visible FAQ */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: 'What is the most populated country in the world?',
                  a: <>{top10[0].name}, with {top10[0].population2024.toLocaleString()} people (UN WPP 2024) — {top10[0].worldPopulationShare.toFixed(1)}% of humanity. India overtook China in 2023.</>,
                },
                { q: 'What are the top 10 most populated countries?', a: <>{top10.map((c, i) => `${i + 1}. ${c.name} (${formatPopulation(c.population2024)})`).join(', ')}.</> },
                { q: 'How many people live on Earth?', a: <>About {formatPopulation(worldPopulation)} (UN 2024). Top 3 hold ~{top3Share.toFixed(0)}% between them.</> },
                { q: 'Did India overtake China?', a: <>Yes — in 2023, per UN WPP 2024. India continues growing; China&apos;s population began declining in 2022.</> },
                { q: 'Which country will be most populated in 2050?', a: <>India (~1.67B). China second (1.31B), Nigeria third (377M, overtaking the US). Source: UN medium-variant projection.</> },
                { q: 'Which continent has the most people?', a: <>Asia, ~60% of world. Africa second at ~19% and fastest-growing.</> },
                { q: 'Why is China&apos;s population falling?', a: <>Decades of below-replacement fertility (TFR ~1.0), partly from the one-child policy (1980–2015). Population peaked ~2021.</> },
                { q: 'Why does India have so many people?', a: <>5,000 years of settled agriculture on the Indo-Gangetic plain plus 20th-century mortality declines before fertility fell. TFR is now ~2.0 but momentum keeps growth going.</> },
                { q: 'Which countries are growing fastest?', a: <>In absolute terms: Nigeria, DR Congo, Tanzania, Ethiopia, Pakistan.</> },
                { q: 'Which countries are shrinking?', a: <>China, Japan, Russia, Ukraine, Italy, Poland, South Korea, Thailand — all in long-term decline.</> },
                { q: 'What&apos;s the difference between &quot;most populated&quot; and &quot;largest&quot;?', a: <>Most populated = people. Largest = area. Russia is largest by area but 9th by population. <Link href="/largest-countries" className="text-blue-700 hover:text-blue-900">See largest countries by area →</Link></> },
                { q: 'How accurate are these numbers?', a: <>For developed countries, within ~1%. For countries with weaker statistical capacity, several percent. UN publishes uncertainty intervals.</> },
                { q: 'How are micronations and disputed territories counted?', a: <>195 UN-recognized countries (193 members + 2 observers). Taiwan in China per UN. Kosovo, Somaliland, Transnistria not separately listed.</> },
                { q: 'Where does this data come from?', a: <>UN World Population Prospects 2024 (population.un.org/wpp). Last updated {LAST_UPDATED}.</> },
                { q: 'Will any country reach 2 billion?', a: <>No, per UN medium-variant projections. India peaks at ~1.7B in the late 2060s; no country reaches 2B this century.</> },
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
              <li><Link href="/top-10-most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Most Populated (detailed profiles)</Link></li>
              <li><Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Largest Countries by Area</Link></li>
              <li><Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Smallest Countries</Link></li>
              <li><Link href="/top-10-largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Largest by Area</Link></li>
              <li><Link href="/life-expectancy-by-country" className="text-blue-700 hover:text-blue-900 font-medium">→ Life Expectancy by Country</Link></li>
              <li><Link href="/median-age-by-country" className="text-blue-700 hover:text-blue-900 font-medium">→ Median Age by Country</Link></li>
              <li><Link href="/compare" className="text-blue-700 hover:text-blue-900 font-medium">→ Compare Any Two Countries</Link></li>
            </ul>
          </section>

          {/* Sources footer */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources & Further Reading</h3>
            <ul className="space-y-1">
              <li><strong>Population data:</strong> <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN World Population Prospects 2024 Revision</a></li>
              <li><strong>Land area:</strong> <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a></li>
              <li><strong>Map boundaries:</strong> <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">Natural Earth</a> · 110m resolution via <a href="https://github.com/topojson/world-atlas" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">world-atlas</a></li>
              <li><strong>Historical figures:</strong> Angus Maddison, <em>Contours of the World Economy 1–2030 AD</em> (Oxford, 2007)</li>
              <li>Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
