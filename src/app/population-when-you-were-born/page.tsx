import Link from 'next/link';
import type { Metadata } from 'next';
import { loadCountries, loadCountryData } from '@/lib/data-loader';
import { generateWorldPopulationData } from '@/lib/world-data-aggregator';
import { getCountryFlag } from '@/lib/country-flags';
import { CURRENT_YEAR, LAST_UPDATED_ISO } from '@/lib/site-meta';
import PopulationWhenBornCalculator from './PopulationWhenBornCalculator';
import PopulationContextSections, {
  type MilestoneEntry,
  type GrowthRatePoint,
  type TopTenEntry,
  type RegionEntry,
} from './PopulationContextSections';
import ToolCrossLinks from '@/components/ToolCrossLinks';
import {
  fmtPop,
  fmtMultiplier,
  fmtPercent,
  DATA_LATEST_YEAR,
  type SlimPlace,
  type AgeBucket,
} from '@/lib/population-when-born-helpers';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: `Population When You Were Born — How Much Has the World Grown in Your Lifetime?`,
  description:
    `Enter your birth year to see the world's population the day you were born vs. today. Find out how many people lived in your country in any year from 1950 to ${DATA_LATEST_YEAR}, what % of people alive today are older than you, and how the planet has changed since you arrived. UN World Population Prospects ${CURRENT_YEAR} data.`,
  keywords:
    'world population when I was born, population when I was born, world population by year, how many people were alive when I was born, world population in 1990, world population 1980, population since 1950, world population growth since I was born, how much has the world grown',
  openGraph: {
    title: `Population When You Were Born — Personal World Population Calculator`,
    description:
      `Enter your birth year and country: see how the world (and your country) has grown since the day you were born. UN WPP ${CURRENT_YEAR} data, every year 1950–${DATA_LATEST_YEAR}.`,
    type: 'website',
    url: 'https://populationpyramids.org/population-when-you-were-born',
    siteName: 'Population Pyramids',
    // og:image auto-generated from src/app/population-when-you-were-born/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: `Population When You Were Born`,
    description: `See the world's population the day you were born vs. today. Personal calculator + country picker.`,
  },
  alternates: {
    canonical: 'https://populationpyramids.org/population-when-you-were-born',
  },
};

function generateSchema(worldPopToday: number, worldPop1950: number, worldPop1990: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://populationpyramids.org/population-when-you-were-born#webapp',
        name: 'Population When You Were Born Calculator',
        url: 'https://populationpyramids.org/population-when-you-were-born',
        applicationCategory: 'EducationalApplication',
        applicationSubCategory: 'Demographics Tool',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'Interactive tool that compares world (or country) population the year you were born to today, with annual data from 1950 to present.',
        featureList: [
          'Enter birth year, see world or country population then vs today',
          'Annual population data 1950 onwards',
          '195 countries plus world aggregate',
          'Inline chart with lifetime segment shaded',
          'Percent of people alive today older or younger than you',
        ],
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/population-when-you-were-born#dataset',
        name: `World and Country Population by Year, 1950–${DATA_LATEST_YEAR}`,
        description: 'Annual total population for the world and 195 countries from UN World Population Prospects 2024 Revision.',
        creator: {
          '@type': 'Organization',
          name: 'United Nations Department of Economic and Social Affairs, Population Division',
          url: 'https://population.un.org/',
        },
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        temporalCoverage: `1950/${DATA_LATEST_YEAR}`,
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Population When You Were Born', item: 'https://populationpyramids.org/population-when-you-were-born' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What was the world population when I was born?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Enter your birth year in the calculator on this page to see the exact figure. For reference: the world had about ${fmtPop(worldPop1950)} people in 1950, ${fmtPop(worldPop1990)} in 1990, and ${fmtPop(worldPopToday)} today (UN WPP 2024).`,
            },
          },
          {
            '@type': 'Question',
            name: `How much has the world's population grown since 1950?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The world's population has grown from about ${fmtPop(worldPop1950)} in 1950 to ${fmtPop(worldPopToday)} today — roughly ${fmtMultiplier(worldPopToday / worldPop1950)} (${fmtPercent(((worldPopToday - worldPop1950) / worldPop1950) * 100)} growth) in 75 years. The fastest absolute growth happened between the 1960s and 1990s.`,
            },
          },
          {
            '@type': 'Question',
            name: `When did the world reach 8 billion people?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The United Nations declared the world reached 8 billion on November 15, 2022. The previous billion-thresholds: 7 billion in 2011, 6 billion in 1999, 5 billion in 1987, 4 billion in 1974, 3 billion in 1960, 2 billion in 1928, 1 billion around 1804.`,
            },
          },
          {
            '@type': 'Question',
            name: `How many people are older than me?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The calculator computes this from the current age structure of your selected place. Globally, the share of people older than any given age depends heavily on country: developed countries have far more elderly than young populations like much of Sub-Saharan Africa.`,
            },
          },
          {
            '@type': 'Question',
            name: `Will the world's population keep growing?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `UN medium-variant projections expect the world to reach roughly 9.7 billion by 2050 and peak near 10.3 billion in the 2080s before slow decline. Many countries — including China, Japan, and most of Europe — are already shrinking; growth from 2030 onward is concentrated in Sub-Saharan Africa.`,
            },
          },
          {
            '@type': 'Question',
            name: `Where does this data come from?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `All figures are from the UN World Population Prospects 2024 Revision (population.un.org/wpp). Historical years 1950–2023 are Estimates; 2024–${DATA_LATEST_YEAR} are medium-variant projections. Last updated ${LAST_UPDATED_ISO}.`,
            },
          },
        ],
      },
    ],
  };
}

export default async function PopulationWhenBornPage() {
  // Load world data (annual aggregate) and country list.
  const [worldData, countriesMeta] = await Promise.all([
    generateWorldPopulationData(),
    loadCountries(),
  ]);

  // Build slim world place
  const worldPopsByYear: Record<string, number> = {};
  for (const [yr, yd] of Object.entries(worldData.years)) {
    worldPopsByYear[yr] = yd.totalPopulation;
  }
  const worldAgeGroupsLatest: AgeBucket[] = (worldData.years[String(DATA_LATEST_YEAR)]?.ageGroups || [])
    .filter(ag => ag.ageRange && typeof ag.total === 'number')
    .map(ag => ({ ageRange: ag.ageRange as string, total: ag.total as number }));

  const worldPlace: SlimPlace = {
    slug: 'world',
    name: 'World',
    flag: '🌍',
    popsByYear: worldPopsByYear,
    ageGroupsLatest: worldAgeGroupsLatest,
  };

  // Build slim places for every country (in parallel — loadCountryData is React-cached).
  const countryPlaces: SlimPlace[] = (
    await Promise.all(
      countriesMeta.map(async (c) => {
        try {
          const data = await loadCountryData(c.slug);
          const popsByYear: Record<string, number> = {};
          for (const [yr, yd] of Object.entries(data.years)) {
            popsByYear[yr] = yd.totalPopulation;
          }
          const latest = data.years[String(DATA_LATEST_YEAR)] || data.years['2024'] || data.years['2023'];
          const ageGroupsLatest: AgeBucket[] = (latest?.ageGroups || [])
            .filter(ag => ag.ageRange)
            .map(ag => ({
              ageRange: ag.ageRange as string,
              total: ag.total ?? (ag.male + ag.female),
            }));
          return {
            slug: c.slug,
            name: c.name,
            flag: getCountryFlag(c.code) || '🌍',
            popsByYear,
            ageGroupsLatest,
          } as SlimPlace;
        } catch {
          return null;
        }
      })
    )
  ).filter((p): p is SlimPlace => p !== null);

  countryPlaces.sort((a, b) => a.name.localeCompare(b.name));
  const places: SlimPlace[] = [worldPlace, ...countryPlaces];

  // Hero-context figures for SEO prose + JSON-LD
  const worldPopToday = worldPopsByYear[String(DATA_LATEST_YEAR)] ?? 0;
  const worldPop1950 = worldPopsByYear['1950'] ?? 0;
  const worldPop1990 = worldPopsByYear['1990'] ?? 0;
  const worldPop2000 = worldPopsByYear['2000'] ?? 0;

  // ── Compute extra data for the enriched context sections ────────────────

  // Milestones — when world crossed each billion. Pre-1950: HYDE; 1950+: UN WPP;
  // 9B/10B/peak: UN medium-variant projection. Hardcoded years are authoritative
  // dates reported by UN DESA & PRB; not derived from our data.
  const milestones: MilestoneEntry[] = [
    { year: 1804, pop: 1, label: '1 billion', source: 'HYDE' },
    { year: 1928, pop: 2, label: '2 billion', source: 'HYDE', yearsSincePrev: 124 },
    { year: 1960, pop: 3, label: '3 billion', source: 'UN', yearsSincePrev: 32 },
    { year: 1974, pop: 4, label: '4 billion', source: 'UN', yearsSincePrev: 14 },
    { year: 1987, pop: 5, label: '5 billion', source: 'UN', yearsSincePrev: 13 },
    { year: 1999, pop: 6, label: '6 billion', source: 'UN', yearsSincePrev: 12 },
    { year: 2011, pop: 7, label: '7 billion', source: 'UN', yearsSincePrev: 12 },
    { year: 2022, pop: 8, label: '8 billion', source: 'UN', yearsSincePrev: 11 },
    { year: 2037, pop: 9, label: '9 billion', source: 'UN-projected', yearsSincePrev: 15 },
    { year: 2058, pop: 10, label: '10 billion', source: 'UN-projected', yearsSincePrev: 21 },
  ];

  // Year-over-year growth rate series (1951 → DATA_LATEST_YEAR) computed
  // directly from our world annual totals.
  const growthRateSeries: GrowthRatePoint[] = [];
  for (let y = 1951; y <= DATA_LATEST_YEAR; y++) {
    const prev = worldPopsByYear[String(y - 1)];
    const cur = worldPopsByYear[String(y)];
    if (prev && cur) growthRateSeries.push({ year: y, rate: ((cur - prev) / prev) * 100 });
  }
  const peakGrowth = growthRateSeries.reduce((a, b) => (b.rate > a.rate ? b : a), growthRateSeries[0]);
  const latestGrowth = growthRateSeries[growthRateSeries.length - 1];

  // Top 10 by population — 1950 vs latest year.
  const popRankFor = (year: number): TopTenEntry[] => {
    return countryPlaces
      .map(p => ({ slug: p.slug, name: p.name, flag: p.flag, pop: p.popsByYear[String(year)] ?? 0 }))
      .filter(c => c.pop > 0)
      .sort((a, b) => b.pop - a.pop)
      .slice(0, 10)
      .map((c, i) => ({ rank: i + 1, ...c }));
  };
  const topTen1950 = popRankFor(1950);
  const topTen2025 = popRankFor(DATA_LATEST_YEAR);

  // Regional aggregates 1950 → latest. Region field comes from per-country JSON.
  const regionTotals = new Map<string, { p1950: number; pLatest: number }>();
  for (const c of countriesMeta) {
    try {
      const data = await loadCountryData(c.slug);
      const region = (data as any).region as string | undefined;
      if (!region || region === 'Unknown') continue;
      const p1950 = data.years?.['1950']?.totalPopulation ?? 0;
      const pLatest = data.years?.[String(DATA_LATEST_YEAR)]?.totalPopulation
        ?? data.years?.['2024']?.totalPopulation
        ?? data.years?.['2023']?.totalPopulation
        ?? 0;
      const entry = regionTotals.get(region) ?? { p1950: 0, pLatest: 0 };
      entry.p1950 += p1950;
      entry.pLatest += pLatest;
      regionTotals.set(region, entry);
    } catch {
      // skip
    }
  }
  const regions: RegionEntry[] = Array.from(regionTotals.entries())
    .map(([name, t]) => ({
      name,
      pop1950: t.p1950,
      popLatest: t.pLatest,
      multiplier: t.p1950 > 0 ? t.pLatest / t.p1950 : 0,
    }))
    .sort((a, b) => b.multiplier - a.multiplier);

  const schema = generateSchema(worldPopToday, worldPop1950, worldPop1990);

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
              <li className="text-gray-900 font-medium">Population When You Were Born</li>
            </ol>
          </nav>

          {/* H1 + answer-first lede */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Population When You Were Born
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mb-2">
            In <strong>1950</strong> the world had about <strong>{fmtPop(worldPop1950)}</strong> people. By{' '}
            <strong>1990</strong> it was <strong>{fmtPop(worldPop1990)}</strong>; today it's{' '}
            <strong>{fmtPop(worldPopToday)}</strong> — roughly{' '}
            <strong>{fmtMultiplier(worldPopToday / worldPop1950)}</strong> what it was when the UN's modern records
            began. Enter your birth year below to see how the world (or any single country) has grown in <em>your</em>{' '}
            lifetime.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time> · Source:{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
              UN World Population Prospects 2024
            </a>
          </p>

          {/* Calculator (SSR-rendered with defaults, hydrates client-side) */}
          <PopulationWhenBornCalculator
            places={places}
            defaultSlug="world"
            defaultBirthYear={1990}
          />

          {/* ── Enriched context: 6 server-rendered chart sections with primary-source data ── */}
          <PopulationContextSections
            milestones={milestones}
            growthRateSeries={growthRateSeries}
            peakGrowth={peakGrowth}
            latestGrowth={latestGrowth}
            topTen1950={topTen1950}
            topTen2025={topTen2025}
            regions={regions}
            worldPop1950={worldPop1950}
            worldPopLatest={worldPopToday}
          />

          {/* Visible FAQ — JSON-LD above mirrors this */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: 'What was the world population when I was born?',
                  a: `Use the calculator above. For reference: ${fmtPop(worldPop1950)} in 1950, ${fmtPop(worldPop1990)} in 1990, ${fmtPop(worldPopToday)} today.`,
                },
                {
                  q: `How much has the world's population grown since 1950?`,
                  a: `From ${fmtPop(worldPop1950)} in 1950 to ${fmtPop(worldPopToday)} today — about ${fmtMultiplier(worldPopToday / worldPop1950)} (${fmtPercent(((worldPopToday - worldPop1950) / worldPop1950) * 100)} growth) in 75 years.`,
                },
                {
                  q: 'When did the world reach 8 billion people?',
                  a: 'The UN declared 8 billion on November 15, 2022. Previous milestones: 7B (2011), 6B (1999), 5B (1987), 4B (1974), 3B (1960), 2B (1928), 1B (~1804).',
                },
                {
                  q: 'How many people are older than me?',
                  a: 'The calculator computes this from the current age structure of the selected place. Globally, the share of people older than any given age varies a lot: aged countries like Japan have far more elderly than youth-heavy countries like Niger.',
                },
                {
                  q: 'How many people have ever lived?',
                  a: 'Demographers estimate roughly 117 billion humans have ever been born — meaning the 8 billion alive today are about 7% of every human who has ever lived (Population Reference Bureau estimate).',
                },
                {
                  q: `Will the world's population keep growing?`,
                  a: 'UN medium-variant projections expect roughly 9.7B by 2050 and a peak near 10.3B in the 2080s before slow decline. Growth from 2030 onwards is concentrated in Sub-Saharan Africa; China, Japan, and most of Europe are already shrinking.',
                },
                {
                  q: 'What year did world population double from 1950?',
                  a: `World population doubled from 2.5B (1950) to 5B around 1987. It has not yet doubled again; current projections suggest it will peak near ${fmtMultiplier(10.3 / 2.5)} the 1950 level around the 2080s.`,
                },
                {
                  q: 'Where does this data come from?',
                  a: `UN World Population Prospects 2024 Revision. Historical 1950–2023 are Estimates; 2024–${DATA_LATEST_YEAR} are medium-variant projections. Last updated ${LAST_UPDATED_ISO}.`,
                },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                  <p className="text-sm text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <ToolCrossLinks currentSlug="population-when-you-were-born" />

          {/* Sources footer */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources &amp; Methodology</h3>
            <ul className="space-y-1.5">
              <li>
                <strong>Primary source — population:</strong>{' '}
                <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN World Population Prospects 2024 Revision
                </a>{' '}
                — annual total population for 195 countries and world aggregate, 1950 → 2025; medium-variant projections to 2100.
              </li>
              <li>
                <strong>Primary source — fertility:</strong>{' '}
                <a href="https://population.un.org/wpp/Download/Standard/MostUsed/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN WPP 2024, World Total Fertility Rate (medium variant)
                </a>{' '}
                — five-year averages 1950 → 2100, used in the fertility-collapse chart.
              </li>
              <li>
                <strong>Methodology:</strong>{' '}
                <a href="https://population.un.org/wpp/Publications/Files/WPP2024_Methodology.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN WPP 2024 Methodology Report
                </a>{' '}
                — estimation methods, projection variants, uncertainty intervals.
              </li>
              <li>
                <strong>Pre-1950 milestones (1B, 2B):</strong>{' '}
                <a href="https://www.pbl.nl/en/image/links/hyde" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  HYDE 3.3 historical population database
                </a>{' '}
                (Klein Goldewijk et al., PBL Netherlands Environmental Assessment Agency).
              </li>
              <li>
                <strong>Billion-thresholds (3B onwards):</strong>{' '}
                <a href="https://www.un.org/en/desa" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN Department of Economic and Social Affairs
                </a>{' '}
                — official "Day of N Billion" announcements (5B: 11 July 1987; 6B: 12 October 1999; 7B: 31 October 2011; 8B: 15 November 2022).
              </li>
              <li>
                <strong>"How many people have ever lived":</strong>{' '}
                <a href="https://www.prb.org/articles/how-many-people-have-ever-lived-on-earth/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  Population Reference Bureau (Haub / Kaneda, 2022 update)
                </a>{' '}
                — ~117B estimate, with documented assumptions.
              </li>
              <li>Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time>. All charts on this page are inline SVG generated server-side from these primary sources — no third-party tracking or external chart libraries.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
