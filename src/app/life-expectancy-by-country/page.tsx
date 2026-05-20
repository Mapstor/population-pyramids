import Link from 'next/link';
import { getAllLifeExpectancyData } from '@/lib/life-expectancy-loader';
import { getCountryRankings } from '@/lib/country-rankings';
import { getWorldMapPaths } from '@/lib/world-map-data';
import RankingBarChart, { BarItem } from '@/components/RankingBarChart';
import WorldPopulationMap, { CountryMapDatum } from '@/components/WorldPopulationMap';

export const metadata = {
  title: 'Life Expectancy by Country 2026 — All 195 Countries Ranked',
  description:
    'Complete ranking of every country in the world by life expectancy at birth, 2024. Monaco, Japan, Switzerland, San Marino, and South Korea top the list at 85+ years. Nigeria, Chad, and Central African Republic at the bottom around 55 years. UN World Population Prospects 2024 data, with male/female breakdowns and projections to 2100.',
  keywords:
    'life expectancy by country, average life expectancy by country, countries by life expectancy, life expectancy at birth by country, lifespan by country, life longevity by country, country life span, age expectancy by country, life expectancy by nation, average life span by country, countries longest life expectancy, countries highest life expectancy',
  openGraph: {
    title: 'Life Expectancy by Country 2026 — All 195 Countries Ranked',
    description:
      'Every country ranked by life expectancy at birth, with bar chart, full table, regional breakdowns, projections to 2100, and male/female breakdown. UN WPP 2024 data.',
    type: 'website',
    url: 'https://populationpyramids.org/life-expectancy-by-country',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/life-expectancy-by-country',
  },
};

const LAST_UPDATED = '2026-05-20';
const PUBLISHED = '2026-05-20';

function generateSchema(top10: any[], bottom10: any[], worldAvg: number, gapTopBottom: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': 'https://populationpyramids.org/life-expectancy-by-country#article',
        headline: 'Life Expectancy by Country 2026 — All 195 Countries Ranked',
        description:
          'A sourced ranking of every country by life expectancy at birth, with male/female breakdowns and projections to 2100.',
        author: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        publisher: {
          '@type': 'Organization',
          name: 'PopulationPyramids.org',
          url: 'https://populationpyramids.org',
          logo: { '@type': 'ImageObject', url: 'https://populationpyramids.org/icon.svg' },
        },
        datePublished: PUBLISHED,
        dateModified: LAST_UPDATED,
        mainEntityOfPage: 'https://populationpyramids.org/life-expectancy-by-country',
        articleSection: 'Demographics',
        wordCount: 3000,
        citation: [
          {
            '@type': 'CreativeWork',
            name: 'World Population Prospects 2024',
            author: 'United Nations Department of Economic and Social Affairs, Population Division',
            url: 'https://population.un.org/wpp/',
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/life-expectancy-by-country#webpage',
        name: 'Life Expectancy by Country 2026',
        url: 'https://populationpyramids.org/life-expectancy-by-country',
        description: 'Complete ranking of life expectancy across all 195 countries in 2024.',
        inLanguage: 'en-US',
        isPartOf: { '@type': 'WebSite', name: 'Population Pyramids', url: 'https://populationpyramids.org' },
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/life-expectancy-by-country#dataset',
        name: 'World Countries Ranked by Life Expectancy at Birth 2024',
        description:
          'Life expectancy at birth for all 195 UN-recognized countries — both sexes combined plus male/female breakdowns, historical series 1950–2023, and medium-variant projections to 2100.',
        url: 'https://populationpyramids.org/life-expectancy-by-country',
        creator: {
          '@type': 'Organization',
          name: 'United Nations Department of Economic and Social Affairs, Population Division',
          url: 'https://population.un.org/',
        },
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        temporalCoverage: '1950/2100',
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Life Expectancy at Birth (both sexes)', unitText: 'years' },
          { '@type': 'PropertyValue', name: 'Male Life Expectancy at Birth', unitText: 'years' },
          { '@type': 'PropertyValue', name: 'Female Life Expectancy at Birth', unitText: 'years' },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': 'https://populationpyramids.org/life-expectancy-by-country#itemlist',
        name: 'Top 10 Countries by Life Expectancy 2024',
        numberOfItems: 10,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: top10.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.country,
          description: `${c.current.total} years`,
          url: `https://populationpyramids.org/${c.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Countries', item: 'https://populationpyramids.org/countries' },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Life Expectancy by Country',
            item: 'https://populationpyramids.org/life-expectancy-by-country',
          },
        ],
      },
      {
        '@type': 'DefinedTermSet',
        name: 'Life Expectancy Glossary',
        hasDefinedTerm: [
          {
            '@type': 'DefinedTerm',
            name: 'Life expectancy at birth',
            description: 'The average number of years a newborn would live if current age-specific mortality rates remain constant over their lifetime.',
          },
          {
            '@type': 'DefinedTerm',
            name: 'Healthy life expectancy (HALE)',
            description: 'Years lived in full health, excluding years lost to illness or disability. Always lower than total life expectancy.',
          },
          {
            '@type': 'DefinedTerm',
            name: 'Gender gap in life expectancy',
            description: 'The difference between female and male life expectancy. Globally, women live ~5 years longer than men.',
          },
          {
            '@type': 'DefinedTerm',
            name: 'Period vs cohort life expectancy',
            description: 'Period figures use current mortality rates; cohort figures use rates over an actual generation. UN WPP reports period figures.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Which country has the highest life expectancy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${top10[0].country} has the highest life expectancy at ${top10[0].current.total} years (UN WPP 2024), followed by ${top10[1].country} (${top10[1].current.total}) and ${top10[2].country} (${top10[2].current.total}).`,
            },
          },
          {
            '@type': 'Question',
            name: 'Which country has the lowest life expectancy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${bottom10[bottom10.length - 1].country} has the lowest life expectancy at ${bottom10[bottom10.length - 1].current.total} years. The bottom of the ranking is dominated by countries facing extreme poverty, conflict, or high HIV/malaria burden.`,
            },
          },
          {
            '@type': 'Question',
            name: 'What is the world average life expectancy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The world average life expectancy at birth in 2024 is approximately ${worldAvg} years (UN WPP 2024). Women live about 5 years longer than men globally.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Why is the gap between top and bottom countries so large?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The gap between the longest and shortest-lived countries is about ${gapTopBottom.toFixed(0)} years. Drivers include: per capita income, healthcare access, sanitation, maternal mortality, infant mortality, conflict, and burden of infectious diseases like HIV/AIDS and malaria.`,
            },
          },
          {
            '@type': 'Question',
            name: 'How is life expectancy calculated?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Life expectancy at birth is calculated using a life table that applies current age-specific mortality rates to a hypothetical cohort. It is a period (snapshot) measure, not a forecast of how long today\'s babies will actually live.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why do women live longer than men?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Globally women outlive men by ~5 years on average. Causes include lower rates of cardiovascular disease at younger ages, lower-risk behavior (less drinking/smoking/violent death historically), and biological factors. The gap is wider in Russia and Eastern Europe and narrower in much of Sub-Saharan Africa.',
            },
          },
          {
            '@type': 'Question',
            name: 'How has life expectancy changed since 1950?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'World life expectancy roughly doubled from ~46 years in 1950 to ~73 years today. The biggest gains came from reduced infant and child mortality, improved sanitation, antibiotics, and vaccines. Japan, South Korea, and many European countries gained 25–30 years.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between life expectancy and healthy life expectancy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Life expectancy counts all years lived. Healthy life expectancy (HALE) counts only years in full health, excluding years lost to disability or chronic illness. HALE is typically 8–12 years lower than total life expectancy.',
            },
          },
          {
            '@type': 'Question',
            name: 'Will life expectancy keep rising?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'UN projections show continued gains in most countries through 2100, though more slowly. The US, UK, and several developed countries have seen recent stagnation or declines due to drug overdoses, suicide, and obesity-related causes. COVID-19 caused temporary global declines that have since reversed in most countries.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why is the US life expectancy lower than peer countries?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The United States has life expectancy of about ${(top10.concat(bottom10).find(c => c.slug === 'united-states') || { current: { total: 79.5 } }).current.total} years — well below other wealthy nations. Drivers include drug overdoses, gun violence, traffic deaths, infant mortality, and gaps in healthcare access. The US is the only major developed country where life expectancy fell in recent years before the COVID disruption.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Where does this data come from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `All figures are from the UN World Population Prospects 2024 Revision (population.un.org/wpp). Historical estimates 1950–2023 (Estimates sheet); 2024 figure is the first medium-variant projection year. Last updated ${LAST_UPDATED}.`,
            },
          },
        ],
      },
    ],
  };
}

export default async function LifeExpectancyByCountryPage() {
  const all = await getAllLifeExpectancyData();
  const { countries: rankings } = await getCountryRankings();
  const top10 = all.slice(0, 10);
  const bottom10 = all.slice(-10);
  const worldAvg = all[0]?.worldAverage.total ?? 73.4;
  const worldAvgMale = all[0]?.worldAverage.male ?? 70.8;
  const worldAvgFemale = all[0]?.worldAverage.female ?? 76;
  const gapTopBottom = (top10[0]?.current.total ?? 0) - (bottom10[bottom10.length - 1]?.current.total ?? 0);

  // Build map data: merge LE values with country-rankings (population, area, region, code)
  const leBySlug = new Map(all.map((c) => [c.slug, c]));
  const features = getWorldMapPaths();
  const dataByAlpha: Record<string, CountryMapDatum> = {};
  for (const c of rankings) {
    const le = leBySlug.get(c.slug);
    dataByAlpha[c.code] = {
      population2024: c.population2024,
      worldPopulationShare: c.worldPopulationShare,
      slug: c.slug,
      medianAge2024: c.medianAge2024,
      densityPerKm2: c.densityPerKm2,
      region: c.region,
      areaKm2: c.areaKm2,
      lifeExpectancy: le?.current.total,
      lifeExpectancyMale: le?.current.male,
      lifeExpectancyFemale: le?.current.female,
    };
  }

  // Regional aggregation: average LE by region (mean of country values where data exists)
  const regionAgg: Record<string, { sum: number; count: number; high: { c: string; v: number } | null; low: { c: string; v: number } | null }> = {};
  for (const c of rankings) {
    const le = leBySlug.get(c.slug);
    if (!le) continue;
    const region = c.region;
    if (!regionAgg[region]) regionAgg[region] = { sum: 0, count: 0, high: null, low: null };
    regionAgg[region].sum += le.current.total;
    regionAgg[region].count += 1;
    if (!regionAgg[region].high || le.current.total > regionAgg[region].high.v) {
      regionAgg[region].high = { c: le.country, v: le.current.total };
    }
    if (!regionAgg[region].low || le.current.total < regionAgg[region].low.v) {
      regionAgg[region].low = { c: le.country, v: le.current.total };
    }
  }
  const regions = Object.entries(regionAgg)
    .map(([name, d]) => ({ name, avg: d.sum / d.count, count: d.count, high: d.high, low: d.low }))
    .sort((a, b) => b.avg - a.avg);

  // Find slugs/countries for callouts
  const japan = all.find((c) => c.slug === 'japan');
  const monaco = all.find((c) => c.slug === 'monaco');

  // Regional aggregation (we don't have region in the LE files; load countries.json for region lookup)
  // For simplicity, derive regions from the populated rankings stub.
  // We'll show top/bottom 10 + full table.

  const schema = generateSchema(top10, bottom10, worldAvg, gapTopBottom);

  // Find specific country highlights
  const us = all.find((c) => c.slug === 'united-states');
  const india = all.find((c) => c.slug === 'india');
  const china = all.find((c) => c.slug === 'china');

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
              <li className="text-gray-900 font-medium">Life Expectancy by Country</li>
            </ol>
          </nav>

          {/* H1 + concise lede */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Life Expectancy by Country 2026
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mb-2">
            All 195 countries ranked by life expectancy at birth (2024). <strong>{top10[0].country}</strong> leads at{' '}
            <strong>{top10[0].current.total} years</strong>; <strong>{bottom10[bottom10.length - 1].country}</strong>{' '}
            has the lowest at <strong>{bottom10[bottom10.length - 1].current.total} years</strong>. The gap between
            longest- and shortest-lived populations is roughly{' '}
            <strong>{gapTopBottom.toFixed(0)} years</strong>. World average: <strong>{worldAvg} years</strong>.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Source:{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
              UN World Population Prospects 2024
            </a>
          </p>

          {/* World choropleth map */}
          <div className="mb-8">
            <WorldPopulationMap
              features={features}
              dataByAlpha={dataByAlpha}
              mode="life-expectancy"
              title="World Life Expectancy Map 2024"
              hint="Color shows life expectancy at birth. Hover any country for details · Click to open."
              source="Source: UN WPP 2024 · Boundaries: Natural Earth"
            />
          </div>

          {/* Top 3 stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {top10.slice(0, 3).map((c, i) => (
              <div key={c.slug} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">#{i + 1}</div>
                <Link href={`/${c.slug}`} className="block text-base font-bold text-gray-900 hover:text-blue-700 mb-1">{c.country}</Link>
                <div className="text-2xl font-bold text-blue-700">{c.current.total} yrs</div>
                <div className="text-xs text-gray-600 mt-1">men {c.current.male} · women {c.current.female}</div>
              </div>
            ))}
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-emerald-600">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">World avg</div>
              <div className="text-base font-bold text-gray-900 mb-1">All 195 countries</div>
              <div className="text-2xl font-bold text-emerald-700">{worldAvg} yrs</div>
              <div className="text-xs text-gray-600 mt-1">men {worldAvgMale} · women {worldAvgFemale}</div>
            </div>
          </div>

          {/* Quick-insight cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-blue-700">
              <div className="text-3xl font-bold text-blue-700">+{gapTopBottom.toFixed(0)}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">years gap</div>
              <div className="text-sm text-gray-700 mt-1">
                Top vs bottom: {top10[0].country} ({top10[0].current.total}) vs {bottom10[bottom10.length - 1].country} ({bottom10[bottom10.length - 1].current.total})
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-rose-500">
              <div className="text-3xl font-bold text-rose-700">+{(worldAvgFemale - worldAvgMale).toFixed(1)}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">female advantage</div>
              <div className="text-sm text-gray-700 mt-1">Women live longer than men globally</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-emerald-600">
              <div className="text-3xl font-bold text-emerald-700">~{Math.round(worldAvg - 46)}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">years gained since 1950</div>
              <div className="text-sm text-gray-700 mt-1">World avg rose from ~46 to ~{worldAvg}</div>
            </div>
            {us && (
              <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-amber-500">
                <div className="text-3xl font-bold text-amber-700">#{us.rank.position}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">USA rank</div>
                <div className="text-sm text-gray-700 mt-1">
                  {us.current.total} yrs — below most wealthy nations
                </div>
              </div>
            )}
          </section>

          {/* Story: what drives the 30-year gap — structured cards, not prose */}
          <section className="mb-8">
            <div className="flex justify-between items-baseline flex-wrap gap-2 mb-3">
              <h2 className="text-xl font-bold text-gray-900">What Drives the {gapTopBottom.toFixed(0)}-Year Gap</h2>
              <span className="text-xs text-gray-500">Source: UN WPP 2024 · WHO Global Health Observatory</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-rose-500">
                <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Driver #1</div>
                <div className="font-bold text-gray-900 mb-1">Infant mortality</div>
                <p className="text-sm text-gray-700">
                  Top 10 countries: under 2 deaths per 1,000 live births. Bottom 10: 40–80. Reducing
                  infant deaths is the single biggest lever on life expectancy.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Driver #2</div>
                <div className="font-bold text-gray-900 mb-1">Universal healthcare</div>
                <p className="text-sm text-gray-700">
                  Every country in the top 10 has universal healthcare. Bottom 10 spend &lt; $100 per
                  capita on health. Access to medicine compounds across decades.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Driver #3</div>
                <div className="font-bold text-gray-900 mb-1">Sanitation & water</div>
                <p className="text-sm text-gray-700">
                  Clean water and sewage systems eliminate diarrhea, cholera, dysentery — historically
                  the biggest killers of children. The 20th-century gains worldwide came mostly here.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
                <div className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Driver #4</div>
                <div className="font-bold text-gray-900 mb-1">Conflict & violence</div>
                <p className="text-sm text-gray-700">
                  The bottom of the ranking is dominated by countries with active or recent conflict
                  (Chad, CAR, Somalia, Yemen). Stability gains can move a country up 5–10 years.
                </p>
              </div>
            </div>
          </section>

          {/* Bar chart: top 10 highest */}
          <div className="mb-8">
            <RankingBarChart
              items={top10.map<BarItem>((c, i) => ({
                rank: i + 1,
                name: c.country,
                slug: c.slug,
                value: c.current.total,
                formatted: `${c.current.total} yrs`,
                share: `M ${c.current.male} · F ${c.current.female}`,
              }))}
              title="Top 10 Countries by Life Expectancy (2024)"
              axisLabel="Life expectancy at birth, years (UN WPP 2024)"
              source="Source: UN World Population Prospects 2024 Revision"
              color="blue"
              ticks={[
                { value: 0, label: '0' },
                { value: 70, label: '70' },
                { value: 80, label: '80' },
                { value: 85, label: '85' },
                { value: 88, label: '88 yrs' },
              ]}
              caption={
                <>
                  Monaco leads, but the gap among the top 10 is only ~2 years (84–86 range). All are
                  wealthy, peaceful countries with strong healthcare. Click any bar for that country&apos;s page.
                </>
              }
            />
          </div>

          {/* Bar chart: bottom 10 lowest */}
          <div className="mb-8">
            <RankingBarChart
              items={bottom10.map<BarItem>((c, i) => ({
                rank: all.length - (bottom10.length - 1 - i),
                name: c.country,
                slug: c.slug,
                value: c.current.total,
                formatted: `${c.current.total} yrs`,
                share: `M ${c.current.male} · F ${c.current.female}`,
              }))}
              title="Bottom 10 Countries by Life Expectancy (2024)"
              axisLabel="Life expectancy at birth, years (UN WPP 2024)"
              source="Source: UN World Population Prospects 2024 Revision"
              color="amber"
              ticks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 55, label: '55' },
                { value: 60, label: '60' },
                { value: 65, label: '65 yrs' },
              ]}
              caption={
                <>
                  The bottom 10 are concentrated in Sub-Saharan Africa, with conflict zones and
                  high disease burden. The gap with the top is ~30 years — a longer life span than
                  many people in these countries are projected to live at all.
                </>
              }
            />
          </div>

          {/* Regional breakdown — structured cards, not prose blocks */}
          <section className="mb-8">
            <div className="flex justify-between items-baseline flex-wrap gap-2 mb-3">
              <h2 className="text-xl font-bold text-gray-900">Regional Patterns</h2>
              <span className="text-xs text-gray-500">Mean life expectancy by region · UN WPP 2024</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {regions.map((r) => (
                <div key={r.name} className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-blue-500">
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="font-semibold text-gray-900">{r.name}</div>
                    <div className="text-xl font-bold text-blue-700">{r.avg.toFixed(1)}</div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{r.count} countries · average yrs</div>
                  <div className="space-y-1 text-xs text-gray-700">
                    {r.high && (
                      <div>
                        <span className="inline-block w-12 text-gray-500">Highest:</span>
                        <span className="font-medium text-green-700">{r.high.c}</span>{' '}
                        <span className="text-gray-500">({r.high.v.toFixed(1)})</span>
                      </div>
                    )}
                    {r.low && (
                      <div>
                        <span className="inline-block w-12 text-gray-500">Lowest:</span>
                        <span className="font-medium text-amber-700">{r.low.c}</span>{' '}
                        <span className="text-gray-500">({r.low.v.toFixed(1)})</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent trends — structured prose cards */}
          <section className="mb-8">
            <div className="flex justify-between items-baseline flex-wrap gap-2 mb-3">
              <h2 className="text-xl font-bold text-gray-900">Recent Trends to Know</h2>
              <span className="text-xs text-gray-500">Patterns since 2010 · UN WPP, OECD, CDC</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">US Stagnation</div>
                <p className="text-sm text-gray-700">
                  Life expectancy in the US fell from 78.9 (2014) to ~76 (2021) — the only major
                  developed country with sustained decline pre-COVID. Drivers: drug overdoses,
                  suicide, obesity, traffic deaths.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">COVID Impact (2020–22)</div>
                <p className="text-sm text-gray-700">
                  Most countries lost 1–3 years of life expectancy during 2020–2021. Russia, Bulgaria,
                  and the US saw the largest declines. Most have since fully recovered, but recovery
                  was uneven.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-emerald-500">
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Fastest Improvers</div>
                <p className="text-sm text-gray-700">
                  Sub-Saharan African countries with stable governance — Rwanda, Ethiopia, Senegal —
                  have gained 10+ years since 2000 through HIV control, malaria nets, and improved
                  maternal care.
                </p>
              </div>
            </div>
          </section>

          {/* Country highlights insight grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            {us && (
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
                <Link href="/united-states" className="block text-base font-bold text-gray-900 hover:text-blue-700">United States</Link>
                <div className="text-2xl font-bold text-blue-700 mt-1">{us.current.total} yrs</div>
                <div className="text-xs text-gray-600 mt-1">Rank #{us.rank.position} · M {us.current.male} · F {us.current.female}</div>
              </div>
            )}
            {china && (
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-600">
                <Link href="/china" className="block text-base font-bold text-gray-900 hover:text-blue-700">China</Link>
                <div className="text-2xl font-bold text-red-700 mt-1">{china.current.total} yrs</div>
                <div className="text-xs text-gray-600 mt-1">Rank #{china.rank.position} · M {china.current.male} · F {china.current.female}</div>
              </div>
            )}
            {india && (
              <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
                <Link href="/india" className="block text-base font-bold text-gray-900 hover:text-blue-700">India</Link>
                <div className="text-2xl font-bold text-orange-600 mt-1">{india.current.total} yrs</div>
                <div className="text-xs text-gray-600 mt-1">Rank #{india.rank.position} · M {india.current.male} · F {india.current.female}</div>
              </div>
            )}
          </section>

          {/* Data Sources panel */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">📋 Data Sources & Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Life expectancy figures</div>
                <p className="text-gray-700">
                  Life expectancy at birth, both sexes (and male/female breakdowns) from{' '}
                  <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                    UN World Population Prospects 2024 Revision
                  </a>
                  . Historical years 1950–2023 are Estimates; 2024 onward is the medium-variant projection.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">What life expectancy means</div>
                <p className="text-gray-700">
                  A period measure: the average years a newborn would live if today&apos;s
                  age-specific mortality rates held constant. <em>Not</em> a forecast of how long today&apos;s
                  babies will actually live.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Countries included</div>
                <p className="text-gray-700">
                  All 195 UN-recognized sovereign states (193 members + 2 observer states). Microstates
                  with very small populations have wider uncertainty intervals.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Data quality</div>
                <p className="text-gray-700">
                  Developed countries: accurate to within 0.2 years. Developing countries with
                  weaker civil registration: uncertainty intervals of 1–3 years are common. UN harmonizes
                  national figures.
                </p>
              </div>
            </div>
          </section>

          {/* Full table */}
          <section className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-baseline flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-900">All 195 Countries Ranked by Life Expectancy</h2>
              <span className="text-xs text-gray-500">Source: UN WPP 2024 · Mid-2024 estimates</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">#</th>
                    <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">Country</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Both sexes</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Men</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Women</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">Gap (F−M)</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">vs world</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {all.map((c, i) => {
                    const gap = c.current.female - c.current.male;
                    const vsWorld = c.current.total - worldAvg;
                    return (
                      <tr key={c.slug} className="hover:bg-blue-50">
                        <td className="px-4 py-1.5 text-gray-700 font-medium">{i + 1}</td>
                        <td className="px-4 py-1.5">
                          <Link href={`/${c.slug}#life-expectancy`} className="text-blue-700 hover:text-blue-900 font-medium">
                            {c.country}
                          </Link>
                        </td>
                        <td className="px-4 py-1.5 text-right text-gray-900 font-semibold">{c.current.total}</td>
                        <td className="px-4 py-1.5 text-right text-gray-700">{c.current.male}</td>
                        <td className="px-4 py-1.5 text-right text-gray-700">{c.current.female}</td>
                        <td className="px-4 py-1.5 text-right">
                          <span className={gap > 6 ? 'text-rose-700' : gap > 4 ? 'text-rose-500' : 'text-gray-600'}>
                            +{gap.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-1.5 text-right">
                          <span className={vsWorld >= 0 ? 'text-green-700' : 'text-red-600'}>
                            {vsWorld >= 0 ? '+' : ''}
                            {vsWorld.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Glossary */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Life Expectancy Glossary</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ['Life expectancy at birth', 'Average years a newborn would live at current age-specific mortality rates. The standard headline figure.'],
                ['Healthy life expectancy (HALE)', 'Years lived in full health, excluding years lost to disability or chronic illness. ~8–12 years lower than total LE.'],
                ['Period vs cohort', 'Period = snapshot using current rates. Cohort = actual lifespan of a generation. UN WPP reports period.'],
                ['Gender gap', 'Female LE minus male LE. World ~5 yrs. Widest in Russia/Eastern Europe (~10 yrs). Narrowest in Sub-Saharan Africa.'],
                ['Infant mortality', 'Deaths under age 1 per 1,000 live births. A huge driver of LE — high infant mortality drags LE down sharply.'],
                ['Mortality compression', 'When deaths cluster in a narrow age range (e.g., 75–90). Common in developed countries.'],
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
                { q: 'Which country has the highest life expectancy?', a: `${top10[0].country} at ${top10[0].current.total} years (UN WPP 2024). Followed by ${top10[1].country} (${top10[1].current.total}) and ${top10[2].country} (${top10[2].current.total}).` },
                { q: 'Which country has the lowest life expectancy?', a: `${bottom10[bottom10.length - 1].country} at ${bottom10[bottom10.length - 1].current.total} years. The bottom of the list is dominated by countries with extreme poverty, conflict, or high disease burden.` },
                { q: 'What is the world average life expectancy?', a: `${worldAvg} years (UN WPP 2024). Men: ${worldAvgMale}, women: ${worldAvgFemale}.` },
                { q: 'Why is the gap between top and bottom so large?', a: `About ${gapTopBottom.toFixed(0)} years separates the highest from lowest. Drivers: income, healthcare access, sanitation, maternal/infant mortality, conflict, and HIV/malaria burden.` },
                { q: 'How is life expectancy calculated?', a: 'A life table applies current age-specific mortality rates to a hypothetical newborn cohort. It\'s a period measure — a snapshot, not a forecast.' },
                { q: 'Why do women live longer than men?', a: 'Lower cardiovascular disease at younger ages, lower-risk behavior historically, biological factors. Gap is widest in Russia and Eastern Europe, narrowest in Sub-Saharan Africa.' },
                { q: 'How has life expectancy changed since 1950?', a: 'World average roughly doubled from ~46 years in 1950 to ~73 today. Biggest gains: reduced infant mortality, sanitation, antibiotics, vaccines.' },
                { q: 'What\'s the difference between life expectancy and healthy life expectancy?', a: 'Healthy life expectancy (HALE) only counts years in full health. Typically 8–12 years lower than total LE.' },
                { q: 'Will life expectancy keep rising?', a: 'UN projections show gains continuing through 2100, but slowing. US/UK have seen recent stagnation. COVID-19 caused temporary global declines that have since reversed.' },
                { q: us ? `Why is US life expectancy (${us.current.total}) lower than peer countries?` : 'Why is US life expectancy lower than peers?', a: 'Drug overdoses, gun violence, traffic deaths, infant mortality, and gaps in healthcare access. The US is the only major developed country where LE fell before COVID.' },
                { q: 'Where does this data come from?', a: `UN World Population Prospects 2024 Revision (population.un.org/wpp). Historical 1950–2023 from Estimates sheet; 2024+ is medium-variant projection. Last updated ${LAST_UPDATED}.` },
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
              <li><Link href="/median-age-by-country" className="text-blue-700 hover:text-blue-900 font-medium">→ Median Age by Country</Link></li>
              <li><Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Most Populated Countries</Link></li>
              <li><Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Largest Countries by Area</Link></li>
              <li><Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Smallest Countries</Link></li>
              <li><Link href="/countries" className="text-blue-700 hover:text-blue-900 font-medium">→ All 195 Countries with Demographics</Link></li>
              <li><Link href="/compare" className="text-blue-700 hover:text-blue-900 font-medium">→ Compare Any Two Countries</Link></li>
            </ul>
          </section>

          {/* Sources footer */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources & Further Reading</h3>
            <ul className="space-y-1">
              <li><strong>Primary source:</strong> <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN World Population Prospects 2024 Revision</a> — life expectancy at birth, period measure, both sexes plus male/female</li>
              <li><strong>Methodology:</strong> <a href="https://population.un.org/wpp/Publications/Files/WPP2024_Methodology.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN WPP 2024 Methodology Report</a></li>
              <li><strong>Alternative source:</strong> <a href="https://www.who.int/data/gho" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">WHO Global Health Observatory</a> — HALE and other health indicators</li>
              <li>Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
