import Link from 'next/link';
import type { Metadata } from 'next';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { loadCountries } from '@/lib/data-loader';
import { getCountryFlag } from '@/lib/country-flags';
import { CURRENT_YEAR, LAST_UPDATED_ISO } from '@/lib/site-meta';
import { getCountryRankings } from '@/lib/country-rankings';
import { getWorldMapPaths } from '@/lib/world-map-data';
import WorldPopulationMap, { type CountryMapDatum } from '@/components/WorldPopulationMap';
import FertilityCalculator from './FertilityCalculator';
import FertilityContextSections from './FertilityContextSections';
import ToolCrossLinks from '@/components/ToolCrossLinks';
import {
  fmtTFR,
  fmtCBR,
  REPLACEMENT_TFR,
  WORLD_TFR_POINTS,
  type SlimFertility,
  type FertilityPoint,
} from '@/lib/fertility-rate-helpers';

export const revalidate = 86400;

const WORLD_2024_TFR = WORLD_TFR_POINTS[WORLD_TFR_POINTS.length - 1].tfr;

export const metadata: Metadata = {
  title: `Fertility Rate by Country ${CURRENT_YEAR} — Calculator + All Countries Below Replacement`,
  description:
    `Personal fertility rate calculator + every country ranked by Total Fertility Rate. Find out if your country has dropped below the replacement rate of 2.1 children per woman, and when. South Korea leads the global low at ~0.72; Niger leads the high at ~6.0. UN World Population Prospects ${CURRENT_YEAR} data with birth rate (CBR) and projections to 2050.`,
  keywords:
    'fertility rate by country, birth rate by country, total fertility rate 2026, lowest fertility rate in the world, countries below replacement rate, replacement rate 2.1, world fertility rate, fertility rate calculator, crude birth rate by country, fertility collapse, south korea fertility rate, china fertility rate, japan fertility rate',
  openGraph: {
    title: `Fertility Rate by Country ${CURRENT_YEAR} — Calculator + Rankings`,
    description: `Personal calculator + all countries ranked by TFR. Find out when your country dropped below the 2.1 replacement rate. UN WPP ${CURRENT_YEAR} data, 1965 → 2050.`,
    type: 'website',
    url: 'https://populationpyramids.org/fertility-rate-by-country',
    siteName: 'Population Pyramids',
    // og:image auto-generated from src/app/fertility-rate-by-country/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: `Fertility Rate by Country ${CURRENT_YEAR}`,
    description: 'Has your country dropped below the replacement rate of 2.1 children per woman? Calculator + global ranking.',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/fertility-rate-by-country',
  },
};

interface FertilityFile {
  countryCode: string;
  countryName: string;
  slug: string;
  fertilityData: {
    current: { year: number; totalFertilityRate: number };
    historical: Array<{ year: number; totalFertilityRate: number; crudebirthRate?: number }>;
    projections: Array<{ year: number; totalFertilityRate: number; crudebirthRate?: number }>;
    replacementLevel: number;
    belowReplacementSince: number | null;
    worldComparison?: { worldAverage: number; rank: number; totalCountries: number };
  };
}

function loadFertilityFiles(): FertilityFile[] {
  const dir = join(process.cwd(), 'src', 'data', 'fertility');
  const out: FertilityFile[] = [];
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    try {
      const raw = readFileSync(join(dir, f), 'utf-8');
      out.push(JSON.parse(raw) as FertilityFile);
    } catch {
      // skip malformed entries
    }
  }
  return out;
}

function generateSchema(countries: SlimFertility[], belowCount: number, lowest: SlimFertility, highest: SlimFertility) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://populationpyramids.org/fertility-rate-by-country#webapp',
        name: 'Fertility Rate Calculator & Country Ranking',
        url: 'https://populationpyramids.org/fertility-rate-by-country',
        applicationCategory: 'EducationalApplication',
        applicationSubCategory: 'Demographics Tool',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'Interactive tool to look up any country\'s total fertility rate, see when it dropped below the 2.1 replacement rate, and rank all countries.',
        featureList: [
          'Personal fertility rate calculator by birth year and country',
          'Year each country dropped below replacement rate',
          'TFR and crude birth rate for 194 countries',
          'Historical trend 1965 to projected 2050',
          'World fertility ranking with comparison vs replacement',
        ],
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/fertility-rate-by-country#dataset',
        name: 'World Fertility Rate Data, 1965–2050',
        description: 'Total Fertility Rate and Crude Birth Rate for 194 countries from UN World Population Prospects 2024 Revision, with medium-variant projections to 2050.',
        creator: {
          '@type': 'Organization',
          name: 'United Nations Department of Economic and Social Affairs, Population Division',
          url: 'https://population.un.org/',
        },
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        temporalCoverage: '1965/2050',
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Total Fertility Rate', unitText: 'children per woman' },
          { '@type': 'PropertyValue', name: 'Crude Birth Rate', unitText: 'births per 1000 population' },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Fertility Rate by Country', item: 'https://populationpyramids.org/fertility-rate-by-country' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the total fertility rate?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Total Fertility Rate (TFR) is the average number of children a woman would have if she lived through her childbearing years at current age-specific birth rates. It's the standard demographer's measure. The world TFR is currently about ${fmtTFR(WORLD_2024_TFR)} children per woman (UN WPP 2024).`,
            },
          },
          {
            '@type': 'Question',
            name: 'What is the replacement rate?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The replacement rate is approximately ${REPLACEMENT_TFR} children per woman in low-mortality settings. Below this, a population shrinks over time from births alone (immigration can offset this). The exact replacement rate is slightly higher in places with high child mortality.`,
            },
          },
          {
            '@type': 'Question',
            name: `Which country has the lowest fertility rate?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${lowest.name} has the world's lowest fertility rate at ${fmtTFR(lowest.currentTFR)} children per woman (UN WPP 2024) — far below the replacement rate of ${REPLACEMENT_TFR}. Several East Asian and Southern European countries cluster in the bottom 10.`,
            },
          },
          {
            '@type': 'Question',
            name: `Which country has the highest fertility rate?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${highest.name} has the world's highest fertility rate at ${fmtTFR(highest.currentTFR)} children per woman. All 10 highest-fertility countries are in Sub-Saharan Africa.`,
            },
          },
          {
            '@type': 'Question',
            name: 'How many countries are below replacement rate?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${belowCount} of ${countries.length} countries with data are below the ${REPLACEMENT_TFR} replacement rate — more than half. This includes all of East Asia, most of Europe, much of South America, and increasingly the Middle East and South Asia.`,
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between fertility rate and birth rate?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Total Fertility Rate (TFR) is children per woman over her lifetime — averages around 2 globally. Crude Birth Rate (CBR) is births per 1,000 people per year — averages around 17 globally. TFR is the demographer's standard; CBR is easier to compare to death rates for natural-increase calculations.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Why is fertility falling worldwide?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Urbanization, women\'s education and labor force participation, contraceptive availability, falling child mortality (parents need fewer children to ensure survival), the rising cost of raising children, and changing cultural expectations around family size. The fall is universal but rates vary — fastest in East Asia, slowest in Sub-Saharan Africa.',
            },
          },
          {
            '@type': 'Question',
            name: 'Will the world drop below replacement rate?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `UN WPP 2024 medium-variant projection has the world TFR crossing below ${REPLACEMENT_TFR} in the late 2030s — first time in human history. Total world population continues growing for several decades after this because of demographic momentum (large cohorts of women still in childbearing years), but peaks near 10.3 billion in the 2080s.`,
            },
          },
        ],
      },
    ],
  };
}

export default async function FertilityRateByCountryPage() {
  const [countriesMeta, fertilityFiles] = await Promise.all([
    loadCountries(),
    Promise.resolve(loadFertilityFiles()),
  ]);
  const metaBySlug = new Map(countriesMeta.map(c => [c.slug, c]));
  const regionBySlug = new Map<string, string>();
  // Pull region from population files (small loop, cached).
  await Promise.all(
    countriesMeta.map(async c => {
      try {
        const data = await import(`@/data/population/${c.slug}.json`);
        regionBySlug.set(c.slug, (data.default as any).region || 'Unknown');
      } catch {
        regionBySlug.set(c.slug, 'Unknown');
      }
    })
  );

  // Build slim list. Use the most recent historical entry for the current
  // crude birth rate (the `current` block carries only TFR).
  const slim: SlimFertility[] = [];
  for (const f of fertilityFiles) {
    const fd = f.fertilityData;
    const meta = metaBySlug.get(f.slug);
    if (!meta) continue;
    const lastHist = [...fd.historical].sort((a, b) => b.year - a.year)[0];
    const currentCBR = (lastHist?.crudebirthRate ?? 0);
    slim.push({
      slug: f.slug,
      name: f.countryName,
      flag: getCountryFlag(meta.code) || '🌍',
      region: regionBySlug.get(f.slug) || 'Unknown',
      currentTFR: fd.current.totalFertilityRate,
      currentCBR,
      currentYear: fd.current.year,
      historical: fd.historical
        .map(h => ({ year: h.year, tfr: h.totalFertilityRate, cbr: h.crudebirthRate }))
        .sort((a, b) => a.year - b.year),
      projections: fd.projections
        .map(p => ({ year: p.year, tfr: p.totalFertilityRate, cbr: p.crudebirthRate }))
        .sort((a, b) => a.year - b.year),
      belowReplacementSince: fd.belowReplacementSince,
      rankByTFR: 0, // filled below
      outOf: 0,
    });
  }

  // Sort by TFR descending — assign rankByTFR (rank 1 = highest TFR).
  slim.sort((a, b) => b.currentTFR - a.currentTFR);
  slim.forEach((c, i) => {
    c.rankByTFR = i + 1;
    c.outOf = slim.length;
  });

  // Build a "world" virtual entry for the calculator dropdown.
  const worldEntry: SlimFertility = {
    slug: 'world',
    name: 'World',
    flag: '🌍',
    region: 'World',
    currentTFR: WORLD_2024_TFR,
    currentCBR: WORLD_TFR_POINTS[WORLD_TFR_POINTS.length - 1].cbr ?? 16.9,
    currentYear: 2024,
    historical: WORLD_TFR_POINTS as FertilityPoint[],
    projections: [
      { year: 2030, tfr: 2.16, cbr: 16.2 },
      { year: 2050, tfr: 2.10, cbr: 13.7 },
    ],
    belowReplacementSince: null, // world hasn't crossed yet (projected for late 2030s)
    rankByTFR: 0,
    outOf: slim.length,
  };

  // Calculator gets a sorted-alphabetically list with World first
  const calculatorPlaces = [worldEntry, ...[...slim].sort((a, b) => a.name.localeCompare(b.name))];

  // Context sections use the TFR-sorted list
  const belowReplacement = slim.filter(c => c.currentTFR < REPLACEMENT_TFR);
  const highest = slim[0];
  const lowest = slim[slim.length - 1];

  // ── Build map data: merge fertility values with country-rankings (pop, region, area, code) ──
  const { countries: rankings } = await getCountryRankings();
  const features = getWorldMapPaths();
  const fertilityBySlug = new Map(slim.map(c => [c.slug, c]));
  const dataByAlpha: Record<string, CountryMapDatum> = {};
  for (const c of rankings) {
    const fert = fertilityBySlug.get(c.slug);
    dataByAlpha[c.code] = {
      population2024: c.population2024,
      worldPopulationShare: c.worldPopulationShare,
      slug: c.slug,
      medianAge2024: c.medianAge2024,
      densityPerKm2: c.densityPerKm2,
      region: c.region,
      areaKm2: c.areaKm2,
      fertilityRate: fert?.currentTFR,
      belowReplacementSince: fert?.belowReplacementSince ?? null,
    };
  }

  const schema = generateSchema(slim, belowReplacement.length, lowest, highest);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Fertility Rate by Country</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Fertility Rate by Country &amp; Personal Calculator {CURRENT_YEAR}
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mb-2">
            The world's average fertility rate is <strong>{fmtTFR(WORLD_2024_TFR)} children per woman</strong> (UN WPP 2024) — only just above
            the replacement rate of <strong>{REPLACEMENT_TFR}</strong>. <strong>{highest.name}</strong> leads
            the global high at <strong>{fmtTFR(highest.currentTFR)}</strong>; <strong>{lowest.name}</strong>{' '}
            anchors the low at <strong>{fmtTFR(lowest.currentTFR)}</strong>. More than half of all countries —{' '}
            <strong>{belowReplacement.length} of {slim.length}</strong> — are already below replacement.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time> · Source:{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
              UN World Population Prospects 2024
            </a>
          </p>

          {/* Calculator */}
          <FertilityCalculator
            countries={calculatorPlaces}
            defaultSlug="world"
            defaultBirthYear={1990}
            worldTfrToday={WORLD_2024_TFR}
          />

          {/* World choropleth — colored by current fertility rate */}
          <div className="mb-10">
            <WorldPopulationMap
              features={features}
              dataByAlpha={dataByAlpha}
              mode="fertility-rate"
              title={`World Fertility Rate Map ${CURRENT_YEAR}`}
              hint="Color shows current TFR (children per woman). Indigo = below replacement · green = at replacement · warm = high fertility. Hover any country for details · Click to open."
              source="Source: UN WPP 2024 · Boundaries: Natural Earth"
            />
          </div>

          {/* SSR context sections — below-replacement panel, top/bottom 10, timeline, full table */}
          <FertilityContextSections countries={slim} worldTfrToday={WORLD_2024_TFR} />

          {/* Visible FAQ */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: 'What is the total fertility rate?',
                  a: `TFR is the average number of children a woman would have over her lifetime at current age-specific birth rates. World today: ~${fmtTFR(WORLD_2024_TFR)} (UN WPP 2024).`,
                },
                {
                  q: 'What is the replacement rate?',
                  a: `About ${REPLACEMENT_TFR} children per woman in low-mortality settings. Below this, a population shrinks over time from births alone — immigration can offset this. The exact replacement rate is slightly higher where child mortality is high.`,
                },
                {
                  q: 'Which country has the lowest fertility rate?',
                  a: `${lowest.name} at ${fmtTFR(lowest.currentTFR)} children per woman — the lowest in the world (UN WPP 2024). The 10 lowest-TFR countries are concentrated in East Asia (South Korea, Hong Kong, Taiwan, China) and Southern Europe.`,
                },
                {
                  q: 'Which country has the highest fertility rate?',
                  a: `${highest.name} at ${fmtTFR(highest.currentTFR)} children per woman. All 10 highest-fertility countries are in Sub-Saharan Africa.`,
                },
                {
                  q: 'How many countries are below replacement?',
                  a: `${belowReplacement.length} of ${slim.length} countries with data — more than half of the world. Includes all of East Asia, most of Europe, much of the Americas, and a growing share of the Middle East and South Asia.`,
                },
                {
                  q: 'What is the difference between TFR and birth rate?',
                  a: 'TFR (Total Fertility Rate) = children per woman over her lifetime, ~2 globally. CBR (Crude Birth Rate) = births per 1,000 people per year, ~17 globally. TFR is age-standardized; CBR is easier to compare with the crude death rate.',
                },
                {
                  q: 'Why is fertility falling worldwide?',
                  a: 'Urbanization, women\'s education and labor force participation, contraceptive availability, falling child mortality, rising cost of raising children, and changing cultural norms around family size. The decline is universal but happening at very different speeds across regions.',
                },
                {
                  q: 'Will the world drop below replacement?',
                  a: `UN WPP 2024 medium variant projects the world TFR crosses below ${REPLACEMENT_TFR} in the late 2030s — the first time in human history. Total population keeps growing for decades after that thanks to demographic momentum (large cohorts already in childbearing years), peaking near 10.3 billion in the 2080s.`,
                },
                {
                  q: 'Why is South Korea\'s fertility rate so low?',
                  a: 'Many drivers: long working hours, high cost of housing and education, intense competition for jobs and schools, late marriage age, and a tight labor market that disadvantages parents (especially women). South Korea\'s TFR has fallen below 1.0 — far lower than any other major economy.',
                },
                {
                  q: 'Where does this data come from?',
                  a: `UN World Population Prospects 2024 Revision (population.un.org/wpp). Historical 1965–2023 estimates plus medium-variant projections to 2030 and 2050. Last updated ${LAST_UPDATED_ISO}.`,
                },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                  <p className="text-sm text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <ToolCrossLinks currentSlug="fertility-rate-by-country" />

          {/* Sources footer */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources &amp; Methodology</h3>
            <ul className="space-y-1.5">
              <li>
                <strong>Primary source — TFR & CBR per country:</strong>{' '}
                <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN World Population Prospects 2024 Revision
                </a>{' '}
                — historical TFR &amp; crude birth rate for {slim.length} countries, 1965 onwards plus medium-variant projections to 2050.
              </li>
              <li>
                <strong>World aggregate TFR series:</strong>{' '}
                <a href="https://population.un.org/wpp/Download/Standard/MostUsed/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN WPP 2024 — World Total Fertility Rate (medium variant)
                </a>{' '}
                — five-year averages used for the "World" option in the calculator.
              </li>
              <li>
                <strong>Methodology:</strong>{' '}
                <a href="https://population.un.org/wpp/Publications/Files/WPP2024_Methodology.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN WPP 2024 Methodology Report
                </a>{' '}
                — estimation methods, projection variants, uncertainty intervals.
              </li>
              <li>
                <strong>Coverage note:</strong> Vatican City has no fertility data and is omitted from the ranking
                (194 of 195 UN member/observer states included). All charts on this page are inline SVG generated
                server-side from primary sources — no third-party tracking, no external chart libraries.
              </li>
              <li>Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
