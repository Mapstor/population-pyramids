import Link from 'next/link';
import { getCountryRankings, formatPopulation, formatArea, formatDensity } from '@/lib/country-rankings';
import RankingBarChart, { BarItem } from '@/components/RankingBarChart';
import { getWorldMapPaths } from '@/lib/world-map-data';
import WorldPopulationMap, { CountryMapDatum } from '@/components/WorldPopulationMap';

export const metadata = {
  title: 'Top 10 Most Populated Countries in the World 2026',
  description:
    'Detailed profiles of the 10 most populated countries — India, China, US, Indonesia, Pakistan, Nigeria, Brazil, Bangladesh, Russia, Mexico. Demographics, fertility, projections to 2050, glossary, methodology, 15-question FAQ. Source: UN WPP 2024.',
  keywords:
    'top 10 most populated countries, top 10 most populous countries, top 10 populous countries, top 10 countries with highest population, 10 most populated countries, 10 most populous countries, ten most populous countries, top 10 populated countries in the world',
  openGraph: {
    title: 'Top 10 Most Populated Countries in the World 2026',
    description: 'Detailed profiles of the 10 most populous countries with demographics, fertility, projections.',
    type: 'website',
    url: 'https://populationpyramids.org/top-10-most-populated-countries',
  },
  alternates: { canonical: 'https://populationpyramids.org/top-10-most-populated-countries' },
};

const LAST_UPDATED = '2026-05-18';
const PUBLISHED = '2026-05-18';

const PROFILES: Record<string, { intro: string; key: string; future: string }> = {
  india: {
    intro: 'Became the world\'s most populous country in 2023, surpassing China for the first time in over 2,000 years. With more than 1.4 billion people, India holds ~17.8% of humanity.',
    key: 'TFR ~2.0 (near replacement). Median age ~28. India is in the middle of its demographic dividend — adding ~12 million people to its workforce annually. Population density ~480/km².',
    future: 'UN projection: peaks ~1.7B in the late 2060s, then slow decline. Expected to remain world #1 through 2100.',
  },
  china: {
    intro: 'Was the most populous country for over 22 centuries until India overtook it in 2023. About 1.43 billion people, ~17.6% of humanity. Mostly Han Chinese (91%) with 55 recognized minority groups.',
    key: 'Population began declining in 2022 — first sustained drop since the famines of the early 1960s. TFR ~1.0, among the world\'s lowest. Median age ~39 and rising.',
    future: 'UN projection: loses several hundred million people by 2100, possibly falling below 800M. Could be overtaken by Pakistan, Nigeria, even DR Congo.',
  },
  'united-states': {
    intro: 'Third most populated and largest among developed economies. About 340 million across 50 states + DC. Continues to grow despite below-replacement fertility, sustained by immigration.',
    key: 'Adds ~1M people per year through immigration plus small natural increase. Median age ~38. TFR ~1.7. Density moderate at ~36/km² but very uneven.',
    future: 'UN projection: ~375M by 2050, then plateau. Likely overtaken by Nigeria as #3 in the late 2040s. Immigration policy is the swing factor.',
  },
  indonesia: {
    intro: 'Fourth most populous and largest Muslim-majority nation. About 277M across 17,000+ islands. Java alone holds ~56% of the population on 7% of the land.',
    key: 'TFR ~2.1 (right at replacement). Median age ~30 and rising. Growth has slowed from over 2%/yr in the 1970s to under 1% today.',
    future: 'UN projection: ~320M by 2050. Remains in the top 6 most populous through this century.',
  },
  pakistan: {
    intro: 'Fifth most populated. TFR ~3.4 (among the highest of any major country) and median age ~22 — youngest of the top 10.',
    key: 'Adds ~5M people/year. Population density ~285/km², mostly in the Indus River basin. Urban growth is rapid; Karachi is among the world\'s 20 largest cities.',
    future: 'UN projection: ~368M by 2050 — adding ~100M people in 25 years, more than the entire current population of Germany. Will likely become the world\'s 4th largest.',
  },
  nigeria: {
    intro: 'Africa\'s most populous country and 6th in the world. ~231 million people — roughly half of West Africa. Over 250 ethnic groups, 500+ languages. Roughly evenly split Muslim/Christian.',
    key: 'TFR ~5.0, median age under 18. ~5M people added per year — like adding one New Zealand. About half the population is under 19. Lagos is among the world\'s most populous urban areas.',
    future: 'UN projection: ~377M by 2050 — overtaking the US to become world #3. By 2100 could reach 540M, third only to India and China.',
  },
  brazil: {
    intro: 'Most populous in South America (~211M) and the largest Portuguese-speaking country. Population concentrated along the Atlantic coast.',
    key: 'TFR fell from over 6 in 1960 to under 1.7 today — below replacement. Median age ~34 and rising. No longer in the youth-bulge phase.',
    future: 'UN projection: peaks ~220M in the early 2040s, then slow decline. Below 190M by 2100.',
  },
  bangladesh: {
    intro: 'Highest population density of any large country — ~1,200 people/km². About 174M on ~148,000 km² of mostly low-lying delta. 8th most populated in the world.',
    key: 'A demographic transition success story: TFR fell from 6.4 in 1980 to under 2.1 today, despite limited resources. Median age ~28.',
    future: 'UN projection: peaks ~200M in the 2050s, then slow decline. Severe climate vulnerability — much of the country is meters above sea level.',
  },
  russia: {
    intro: '11 time zones, but only ~144M people — smaller than Bangladesh or Pakistan despite Russia being 100× their size. 9th most populated; fallen from top-6 during the 20th century.',
    key: 'TFR ~1.5. Declining since the early 1990s. Recent war accelerated emigration. Aging population with limited immigration prospects.',
    future: 'UN projection: out of the top 10 by the 2030s. ~134M by 2050; possibly under 110M by 2100.',
  },
  mexico: {
    intro: 'Most populous Spanish-speaking country and 2nd in Latin America after Brazil. ~129M people, with Mexico City\'s metro area >22M — one of the world\'s largest urban agglomerations.',
    key: 'TFR fell from over 7 in the 1960s to ~1.8 today. Median age ~30 and rising. Late demographic transition.',
    future: 'UN projection: peaks ~145M in the early 2050s, then slow decline. May fall out of the top 10 by mid-century.',
  },
};

function generateSchema(top10: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': 'https://populationpyramids.org/top-10-most-populated-countries#article',
        headline: 'Top 10 Most Populated Countries in the World 2026',
        description: 'Detailed profiles of the 10 most populated countries.',
        author: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org', logo: { '@type': 'ImageObject', url: 'https://populationpyramids.org/icon.svg' } },
        datePublished: PUBLISHED,
        dateModified: LAST_UPDATED,
        articleSection: 'Demographics',
        wordCount: 4500,
      },
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/top-10-most-populated-countries#webpage',
        name: 'Top 10 Most Populated Countries in the World 2026',
        url: 'https://populationpyramids.org/top-10-most-populated-countries',
        inLanguage: 'en-US',
      },
      {
        '@type': 'ItemList',
        name: 'Top 10 Most Populated Countries',
        numberOfItems: 10,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: top10.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, description: `${c.population2024.toLocaleString()} people`, url: `https://populationpyramids.org/${c.slug}` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Most Populated Countries', item: 'https://populationpyramids.org/most-populated-countries' },
          { '@type': 'ListItem', position: 3, name: 'Top 10', item: 'https://populationpyramids.org/top-10-most-populated-countries' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What are the top 10 most populated countries?', acceptedAnswer: { '@type': 'Answer', text: top10.map((c, i) => `${i + 1}. ${c.name} (${formatPopulation(c.population2024)})`).join(', ') + '.' } },
          { '@type': 'Question', name: 'Which country has the highest population?', acceptedAnswer: { '@type': 'Answer', text: `${top10[0].name} (${top10[0].population2024.toLocaleString()}), ahead of ${top10[1].name} (${top10[1].population2024.toLocaleString()}). India overtook China in 2023.` } },
          { '@type': 'Question', name: 'Did India overtake China?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — in 2023, per UN WPP 2024. India continues growing; China declined from 2022.' } },
          { '@type': 'Question', name: 'How much of the world lives in the top 10?', acceptedAnswer: { '@type': 'Answer', text: `About ${top10.reduce((s, c) => s + c.worldPopulationShare, 0).toFixed(0)}% — well over half. The other 185 share less than half.` } },
          { '@type': 'Question', name: 'Which countries will be top 10 by 2050?', acceptedAnswer: { '@type': 'Answer', text: 'UN projections: India, China, Nigeria, US, Pakistan, Indonesia, Brazil, DR Congo, Ethiopia, Bangladesh. Russia and Mexico drop out.' } },
          { '@type': 'Question', name: 'What is the median age in these countries?', acceptedAnswer: { '@type': 'Answer', text: 'Wide range: Nigeria <18, Pakistan ~22, India/Indonesia/Bangladesh/Brazil/Mexico/US late 20s–high 30s, China ~39, Russia ~41.' } },
          { '@type': 'Question', name: 'Which top-10 country grows fastest?', acceptedAnswer: { '@type': 'Answer', text: 'Nigeria — ~5M people/year. Pakistan and Ethiopia close behind. Russia and China are shrinking.' } },
          { '@type': 'Question', name: 'How is population measured?', acceptedAnswer: { '@type': 'Answer', text: 'National censuses + continuous registers, harmonized into UN World Population Prospects.' } },
          { '@type': 'Question', name: 'What is the demographic dividend?', acceptedAnswer: { '@type': 'Answer', text: 'Period when working-age share peaks vs dependents. India is in it now. Most of Sub-Saharan Africa is approaching.' } },
          { '@type': 'Question', name: 'How many people will live in 2050?', acceptedAnswer: { '@type': 'Answer', text: 'About 9.7B per UN medium-variant. Peak ~10.3B in the mid-2080s.' } },
          { '@type': 'Question', name: 'Where does the data come from?', acceptedAnswer: { '@type': 'Answer', text: `UN World Population Prospects 2024 Revision. Last updated ${LAST_UPDATED}.` } },
          { '@type': 'Question', name: 'Which has highest density?', acceptedAnswer: { '@type': 'Answer', text: 'Bangladesh — ~1,200/km². India second at ~480. Russia least dense at ~8.' } },
          { '@type': 'Question', name: 'Does migration affect rankings?', acceptedAnswer: { '@type': 'Answer', text: 'A bit — the US is the main beneficiary in the top 10. Without immigration, US would already be declining. Russia loses people through emigration.' } },
          { '@type': 'Question', name: 'How accurate are these?', acceptedAnswer: { '@type': 'Answer', text: 'Within 1–2% for most top-10. Nigeria less reliable historically.' } },
          { '@type': 'Question', name: 'Will any country reach 2 billion?', acceptedAnswer: { '@type': 'Answer', text: 'No. India peaks ~1.7B late 2060s. No country reaches 2B this century.' } },
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

  // Map data
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
  const top10Slugs = top10.map((c) => c.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/most-populated-countries" className="hover:text-blue-600">Most Populated</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Top 10</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Top 10 Most Populated Countries in the World 2026
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            The world&apos;s 10 most populated countries hold approximately <strong>{totalShare.toFixed(0)}%</strong> of all humans on Earth.
            {' '}<strong>{top10[0].name}</strong> and <strong>{top10[1].name}</strong> each have over 1.4 billion people; the third-place
            {' '}<strong>{top10[2].name}</strong> is less than a quarter their size.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Source:{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN World Population Prospects 2024</a>
          </p>

          {/* Quick top-3 stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {top10.slice(0, 3).map((c, i) => (
              <div key={c.slug} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">#{i + 1}</div>
                <Link href={`/${c.slug}`} className="block text-base font-bold text-gray-900 hover:text-blue-700 mb-1">{c.name}</Link>
                <div className="text-2xl font-bold text-blue-700">{formatPopulation(c.population2024)}</div>
                <div className="text-xs text-gray-600 mt-1">{c.worldPopulationShare.toFixed(1)}% of world · UN WPP 2024</div>
              </div>
            ))}
          </div>

          {/* Quick-insight cards (replaces wall of text) */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-blue-700">
              <div className="text-3xl font-bold text-blue-700">36%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">India + China</div>
              <div className="text-sm text-gray-700 mt-1">1 of every 3 humans lives in India or China</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-blue-600">
              <div className="text-3xl font-bold text-blue-700">¼</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">USA vs leaders</div>
              <div className="text-sm text-gray-700 mt-1">US (340M) is less than a quarter the size of either leader</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-blue-500">
              <div className="text-3xl font-bold text-blue-700">{totalShare.toFixed(0)}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Top 10 share</div>
              <div className="text-sm text-gray-700 mt-1">2 of every 3 humans live in one of these 10 countries</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-blue-400">
              <div className="text-3xl font-bold text-blue-700">6/10</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">In Asia</div>
              <div className="text-sm text-gray-700 mt-1">Six of the top 10 sit on the Asian continent</div>
            </div>
          </section>

          {/* World map — top 10 highlighted */}
          <div className="mb-8">
            <WorldPopulationMap
              features={features}
              dataByAlpha={dataByAlpha}
              highlightedSlugs={top10Slugs}
              title="The Top 10 on the Map"
              hint="Numbered badges show rank. Hover any country for details · Click to open."
              source="Population: UN WPP 2024 · Boundaries: Natural Earth"
            />
          </div>

          {/* Bar chart */}
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
                  India edged ahead of China in 2023 — the first new #1 in over 2,000 years. The
                  fall-off from #2 to #3 is the steepest gap in the ranking. Click any bar to open
                  that country&apos;s full demographics page.
                </>
              }
            />
          </div>

          {/* Data Sources panel */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">📋 Data Sources & Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Population & projections</div>
                <p className="text-gray-700">
                  Mid-2024 estimates and medium-variant projections from{' '}
                  <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN World Population Prospects 2024</a>.
                  Fertility rates (TFR) and 2050 projections per UN published figures.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Area & density</div>
                <p className="text-gray-700">
                  Total area from{' '}
                  <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a>.
                  Density = population ÷ area.
                </p>
              </div>
            </div>
          </section>

          {/* India-overtakes-China callout */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-orange-500">
            <div className="flex items-baseline gap-3 flex-wrap mb-2">
              <h2 className="text-lg font-bold text-gray-900">2023: First new #1 in 22 centuries</h2>
              <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded">India overtakes China</span>
            </div>
            <p className="text-sm text-gray-700">
              India became the world&apos;s most populous country in 2023 — the first change at the top of the ranking since the
              Qin dynasty unified China in 221 BCE. The cause is China stopping, not India accelerating. China&apos;s population
              peaked around 2021 and began declining in 2022.
            </p>
            <p className="text-xs text-gray-500 mt-2">Source: UN WPP 2024; UN press release, April 2023.</p>
          </section>

          {/* The 10 country profiles */}
          <div className="space-y-6">
            {top10.map((c, i) => {
              const profile = PROFILES[c.slug];
              return (
                <article key={c.slug} className="bg-white rounded-xl shadow-sm overflow-hidden border-l-4 border-blue-600">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                      <div>
                        <div className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-1">#{i + 1} Most Populated</div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          <Link href={`/${c.slug}`} className="hover:text-blue-700">{c.name}</Link>
                        </h2>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-700">{formatPopulation(c.population2024)}</div>
                        <div className="text-xs text-gray-600 mt-1">{c.worldPopulationShare.toFixed(1)}% of world · UN WPP 2024</div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">
                      {profile?.intro ?? `#${i + 1} most populated with ${c.population2024.toLocaleString()} people.`}
                    </p>

                    {profile?.key && (
                      <div className="bg-blue-50 rounded p-4 mb-4 border-l-2 border-blue-300">
                        <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Demographic snapshot</div>
                        <p className="text-gray-700 text-sm">{profile.key}</p>
                      </div>
                    )}

                    {profile?.future && (
                      <div className="bg-amber-50 rounded p-4 mb-4 border-l-2 border-amber-300">
                        <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Outlook to 2050</div>
                        <p className="text-gray-700 text-sm">{profile.future}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Population 2024</div>
                        <div className="font-semibold text-gray-900">{c.population2024.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Since 2000</div>
                        <div className="font-semibold text-gray-900">{c.populationChangePercent > 0 ? '+' : ''}{c.populationChangePercent.toFixed(1)}%</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Median age</div>
                        <div className="font-semibold text-gray-900">{c.medianAge2024 > 0 ? c.medianAge2024.toFixed(1) : '—'}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Density</div>
                        <div className="font-semibold text-gray-900">{c.densityPerKm2 > 0 ? formatDensity(c.densityPerKm2) : '—'}/km²</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Land area</div>
                        <div className="font-semibold text-gray-900">{formatArea(c.areaKm2)}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium text-sm">
                        View full {c.name} demographics → population pyramid, age structure, fertility history
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* 2024 vs 2050 comparison */}
          <section className="bg-white rounded-lg shadow-sm mb-8 mt-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">How the Top 10 Changes by 2050</h2>
              <p className="text-xs text-gray-500 mt-1">Source: UN WPP 2024 medium-variant projection</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200">
              <div className="p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Today (2024)</h3>
                <ol className="space-y-1.5 text-sm">
                  {top10.map((c, i) => (
                    <li key={c.slug} className="flex justify-between border-b border-gray-100 last:border-0 py-1">
                      <span className="text-gray-700"><span className="font-bold mr-2">{i + 1}.</span><Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900">{c.name}</Link></span>
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
                        <span className="font-bold mr-2">{i + 1}.</span>{c.name}
                        {c.change === 'new' && <span className="ml-2 text-xs font-bold text-green-700 bg-green-100 px-1 rounded">NEW</span>}
                        {c.change === 'up' && <span className="ml-2 text-xs font-bold text-blue-700">↑</span>}
                        {c.change === 'down' && <span className="ml-2 text-xs font-bold text-gray-500">↓</span>}
                      </span>
                      <span className="text-gray-900 font-medium">{c.pop}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-gray-600 mt-3 italic">Russia and Mexico drop out; DR Congo and Ethiopia enter.</p>
              </div>
            </div>
          </section>

          {/* Glossary */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Demographic Glossary</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ['TFR (Total Fertility Rate)', 'Average children per woman at current rates. Replacement ≈ 2.1.'],
                ['Demographic transition', 'Shift from high fertility/mortality to low. Top 10 countries span every stage.'],
                ['Demographic momentum', 'Continued growth after fertility falls to replacement — large young cohort still in reproductive years.'],
                ['Demographic dividend', 'Period when working-age share peaks vs dependents.'],
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
                { q: 'What are the top 10 most populated countries?', a: `${top10.map((c, i) => `${i + 1}. ${c.name} (${formatPopulation(c.population2024)})`).join(', ')}.` },
                { q: 'Which country has the highest population?', a: `${top10[0].name} (${top10[0].population2024.toLocaleString()}), ahead of ${top10[1].name}. India overtook China in 2023.` },
                { q: 'Did India overtake China?', a: 'Yes — in 2023, per UN WPP 2024. India continues growing; China declined from 2022.' },
                { q: 'How much of the world lives in the top 10?', a: `~${totalShare.toFixed(0)}%. The other 185 countries share less than half between them.` },
                { q: 'Top 10 by 2050?', a: 'India, China, Nigeria, US, Pakistan, Indonesia, Brazil, DR Congo, Ethiopia, Bangladesh.' },
                { q: 'Median age range?', a: 'Nigeria <18, Pakistan ~22, others late 20s-high 30s, China ~39, Russia ~41.' },
                { q: 'Fastest grower?', a: 'Nigeria — ~5M people/year. Pakistan/Ethiopia close behind.' },
                { q: 'How is data measured?', a: 'National censuses + registers, harmonized by UN Population Division.' },
                { q: 'What is the demographic dividend?', a: 'Period when working-age share peaks vs dependents. India is in it now.' },
                { q: 'How many in 2050?', a: '~9.7B world total. Peak ~10.3B mid-2080s.' },
                { q: 'Data source?', a: `UN WPP 2024. Updated ${LAST_UPDATED}.` },
                { q: 'Highest density?', a: 'Bangladesh — ~1,200/km². India second ~480. Russia least dense ~8.' },
                { q: 'Migration impact?', a: 'US is main beneficiary in top 10 (+1M/yr). Without immigration, US would already shrink. Russia loses people.' },
                { q: 'Accuracy?', a: 'Within 1-2% for most. Nigeria less reliable historically.' },
                { q: 'Will any reach 2B?', a: 'No. India peaks ~1.7B in late 2060s. No country reaches 2B this century.' },
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
              <li><Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ All 195 Countries Ranked by Population</Link></li>
              <li><Link href="/top-10-largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Largest Countries by Area</Link></li>
              <li><Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Largest Countries in the World</Link></li>
              <li><Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Smallest Countries in the World</Link></li>
              <li><Link href="/life-expectancy-by-country" className="text-blue-700 hover:text-blue-900 font-medium">→ Life Expectancy by Country</Link></li>
              <li><Link href="/median-age-by-country" className="text-blue-700 hover:text-blue-900 font-medium">→ Median Age by Country</Link></li>
              <li><Link href="/compare" className="text-blue-700 hover:text-blue-900 font-medium">→ Compare Any Two Countries</Link></li>
            </ul>
          </section>

          {/* Sources */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources & Further Reading</h3>
            <ul className="space-y-1">
              <li><strong>Population data:</strong> <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN WPP 2024</a></li>
              <li><strong>Area:</strong> <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a></li>
              <li>Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
