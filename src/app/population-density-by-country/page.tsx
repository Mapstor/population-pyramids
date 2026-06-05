import Link from 'next/link';
import type { Metadata } from 'next';
import { loadCountries, loadCountryData } from '@/lib/data-loader';
import { getCountryFlag } from '@/lib/country-flags';
import { getCountryRankings } from '@/lib/country-rankings';
import { getWorldMapPaths } from '@/lib/world-map-data';
import WorldPopulationMap, { type CountryMapDatum } from '@/components/WorldPopulationMap';
import countryAreas from '@/data/country-areas.json';
import { CURRENT_YEAR, LAST_UPDATED_ISO } from '@/lib/site-meta';
import DensityCalculator from './DensityCalculator';
import DensityContextSections, { type RegionDensity } from './DensityContextSections';
import ToolCrossLinks from '@/components/ToolCrossLinks';
import {
  fmtDensity,
  fmtPop,
  fmtArea,
  KM2_TO_MI2,
  DENSITY_REFERENCE_YEAR,
  type SlimDensityPlace,
} from '@/lib/population-density-helpers';

export const revalidate = 86400;

const AREAS = countryAreas as Record<string, number>;

export const metadata: Metadata = {
  title: `Population Density by Country ${CURRENT_YEAR} — All 195 Ranked + Calculator`,
  description: `Complete population density ranking for every country in ${CURRENT_YEAR}, plus a personal calculator. Monaco leads at ~19,000 people per km²; Mongolia anchors the low at ~2/km². Includes interactive map, top/bottom 10 charts, continental averages, city density comparison, and a "what if" thought experiment to compare any two countries. UN WPP 2024 + CIA World Factbook.`,
  keywords:
    'population density by country, most densely populated countries, least densely populated countries, population density calculator, country density ranking, people per square mile by country, people per square km by country, monaco population density, singapore population density, world population density',
  openGraph: {
    title: `Population Density by Country ${CURRENT_YEAR} — Calculator + Rankings`,
    description: `All 195 countries ranked by population density. Personal calculator + 'what if' comparisons. UN WPP ${CURRENT_YEAR} + CIA Factbook.`,
    type: 'website',
    url: 'https://populationpyramids.org/population-density-by-country',
    siteName: 'Population Pyramids',
    // og:image auto-generated from src/app/population-density-by-country/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: `Population Density by Country ${CURRENT_YEAR}`,
    description: 'Which countries are most crowded? Calculator + every country ranked. Monaco vs Mongolia: 8,500× different.',
  },
  alternates: {
    canonical: 'https://populationpyramids.org/population-density-by-country',
  },
};

function generateSchema(top: SlimDensityPlace[], bottom: SlimDensityPlace[], worldDensity: number, totalCountries: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://populationpyramids.org/population-density-by-country#webapp',
        name: 'Population Density Calculator & Country Ranking',
        url: 'https://populationpyramids.org/population-density-by-country',
        applicationCategory: 'EducationalApplication',
        applicationSubCategory: 'Demographics Tool',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description:
          'Interactive tool to look up any country\'s population density, compare two countries, and explore "what if" hypotheticals (e.g. if the US had Bangladesh\'s density).',
        featureList: [
          'Density per square km and per square mile',
          'Pairwise country density comparison',
          '"What if" hypothetical population transformations',
          'Continental density averages',
          'Megacity density comparison',
          'Density-over-time chart 1950 → present',
        ],
      },
      {
        '@type': 'Dataset',
        '@id': 'https://populationpyramids.org/population-density-by-country#dataset',
        name: `World Population Density by Country ${CURRENT_YEAR}`,
        description: `Population density (people per km²) for all ${totalCountries} countries, computed from UN WPP 2024 population estimates and CIA World Factbook land-area figures.`,
        creator: [
          { '@type': 'Organization', name: 'United Nations Department of Economic and Social Affairs, Population Division', url: 'https://population.un.org/' },
          { '@type': 'Organization', name: 'Central Intelligence Agency', url: 'https://www.cia.gov/the-world-factbook/' },
        ],
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        temporalCoverage: '1950/2025',
        spatialCoverage: { '@type': 'Place', name: 'World' },
        license: 'https://creativecommons.org/licenses/by/4.0/',
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Population Density', unitText: 'people per square kilometer' },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': 'https://populationpyramids.org/population-density-by-country#itemlist',
        name: 'Top 10 Most Densely Populated Countries',
        numberOfItems: 10,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: top.slice(0, 10).map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          description: `${Math.round(c.densityKm2).toLocaleString()} people per km²`,
          url: `https://populationpyramids.org/${c.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://populationpyramids.org/' },
          { '@type': 'ListItem', position: 2, name: 'Countries', item: 'https://populationpyramids.org/countries' },
          { '@type': 'ListItem', position: 3, name: 'Population Density', item: 'https://populationpyramids.org/population-density-by-country' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is population density?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Population density is the average number of people per unit of land area, usually expressed as people per square kilometer (or per square mile). It is calculated as total population ÷ land area. The world average is roughly ${fmtDensity(worldDensity)} people per km², but national values range from about 2/km² in Mongolia to nearly 20,000/km² in Monaco.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Which country has the highest population density?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${top[0].name} has the world's highest population density at about ${Math.round(top[0].densityKm2).toLocaleString()} people per km² (UN WPP 2024 ÷ CIA Factbook area). The top 10 most-densely-populated countries are dominated by city-states and small island nations.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Which country has the lowest population density?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${bottom[0].name} has the world's lowest population density at about ${bottom[0].densityKm2.toFixed(1)} people per km². The 10 least-dense countries are large territories with mostly uninhabitable land (deserts, ice, jungle, mountains).`,
            },
          },
          {
            '@type': 'Question',
            name: 'How is population density calculated?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Population density = total population ÷ land area. Land area excludes inland water (lakes, rivers, reservoirs) per CIA Factbook definitions. The result is people per unit area — typically people/km² internationally or people/mi² in the US. Country-wide averages hide huge internal variation (Canada\'s southern strip vs the Arctic, for example).',
            },
          },
          {
            '@type': 'Question',
            name: 'Why are city-states so densely populated?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'City-states (Monaco, Singapore, Vatican City) have small territories that consist almost entirely of urbanized land. They lack the rural hinterland that drags down most countries\' average density. The world\'s most densely-populated cities (Dhaka, Mumbai, Manila) actually exceed even Singapore\'s density at the metro-area level.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the population density of the United States?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The United States has about 37 people per km² (96 per mi²) — well below the world average. Most US population is concentrated in cities (New York metro: ~4,500/km²) while vast interior areas have very low density.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where does this data come from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Population: UN World Population Prospects ${CURRENT_YEAR} Revision (population.un.org/wpp). Land area: CIA World Factbook (cia.gov/the-world-factbook). City density: Demographia World Urban Areas 2023 (Wendell Cox). Last updated ${LAST_UPDATED_ISO}.`,
            },
          },
        ],
      },
    ],
  };
}

export default async function PopulationDensityByCountryPage() {
  const countriesMeta = await loadCountries();

  // Build slim density list (and capture per-country pops-by-year for the chart)
  const places: SlimDensityPlace[] = (
    await Promise.all(
      countriesMeta.map(async (c) => {
        const areaKm2 = AREAS[c.slug] ?? 0;
        if (areaKm2 <= 0) return null;
        try {
          const data = await loadCountryData(c.slug);
          const latestYearKey = String(DENSITY_REFERENCE_YEAR) in data.years
            ? String(DENSITY_REFERENCE_YEAR)
            : '2024' in data.years
            ? '2024'
            : '2023';
          const popLatest = data.years[latestYearKey]?.totalPopulation ?? 0;
          if (popLatest <= 0) return null;
          const popsByYear: Record<string, number> = {};
          for (const [yr, yd] of Object.entries(data.years)) {
            popsByYear[yr] = yd.totalPopulation;
          }
          const densityKm2 = popLatest / areaKm2;
          return {
            slug: c.slug,
            name: c.name,
            flag: getCountryFlag(c.code) || '🌍',
            region: (data as any).region || 'Unknown',
            areaKm2,
            popLatest,
            densityKm2,
            densityMi2: densityKm2 * KM2_TO_MI2,
            popsByYear,
          } as SlimDensityPlace;
        } catch {
          return null;
        }
      })
    )
  ).filter((p): p is SlimDensityPlace => p !== null);

  // Sort descending by density (Monaco first)
  const sortedDesc = [...places].sort((a, b) => b.densityKm2 - a.densityKm2);
  // Calculator's place list — alphabetical with a smart default
  const calculatorPlaces = [...places].sort((a, b) => a.name.localeCompare(b.name));

  // Regional aggregates
  const regionMap = new Map<string, { totalPop: number; totalArea: number; countryCount: number }>();
  for (const p of places) {
    if (p.region === 'Unknown') continue;
    const entry = regionMap.get(p.region) ?? { totalPop: 0, totalArea: 0, countryCount: 0 };
    entry.totalPop += p.popLatest;
    entry.totalArea += p.areaKm2;
    entry.countryCount += 1;
    regionMap.set(p.region, entry);
  }
  const regions: RegionDensity[] = Array.from(regionMap.entries())
    .map(([region, t]) => ({
      region,
      totalPop: t.totalPop,
      totalArea: t.totalArea,
      density: t.totalArea > 0 ? t.totalPop / t.totalArea : 0,
      countryCount: t.countryCount,
    }))
    .sort((a, b) => b.density - a.density);

  const worldPop = places.reduce((s, p) => s + p.popLatest, 0);
  const worldArea = places.reduce((s, p) => s + p.areaKm2, 0);
  const worldDensity = worldArea > 0 ? worldPop / worldArea : 0;

  // Build map data
  const { countries: rankings } = await getCountryRankings();
  const features = getWorldMapPaths();
  const densityBySlug = new Map(places.map(p => [p.slug, p]));
  const dataByAlpha: Record<string, CountryMapDatum> = {};
  for (const c of rankings) {
    const dens = densityBySlug.get(c.slug);
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

  const top10 = sortedDesc.slice(0, 10);
  const bottom10 = [...sortedDesc].slice(-10).reverse();
  const schema = generateSchema(top10, bottom10, worldDensity, places.length);

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
              <li className="text-gray-900 font-medium">Population Density</li>
            </ol>
          </nav>

          {/* H1 + answer-first lede */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Population Density by Country &amp; Calculator {CURRENT_YEAR}
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mb-2">
            World average density is about <strong>{fmtDensity(worldDensity)} people per km²</strong>{' '}
            ({fmtDensity(worldDensity * KM2_TO_MI2)} per mi²). <strong>{top10[0].name}</strong> tops the
            world at <strong>~{Math.round(top10[0].densityKm2).toLocaleString()} people/km²</strong>;{' '}
            <strong>{bottom10[0].name}</strong> sits at just <strong>~{bottom10[0].densityKm2.toFixed(1)}/km²</strong>.
            That's an <strong>{Math.round(top10[0].densityKm2 / bottom10[0].densityKm2).toLocaleString()}×</strong>{' '}
            range between extremes.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time> · Population from{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN WPP 2024</a>
            {' '}· Land area from{' '}
            <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a>
          </p>

          {/* Calculator */}
          <DensityCalculator
            places={calculatorPlaces}
            sortedByDensity={sortedDesc}
            defaultSlug="bangladesh"
            defaultCompareSlug="united-states"
          />

          {/* World choropleth — density mode */}
          <div className="mb-10">
            <WorldPopulationMap
              features={features}
              dataByAlpha={dataByAlpha}
              mode="population-density"
              title={`World Population Density Map ${CURRENT_YEAR}`}
              hint="Color shows national density (people per km²). Pale = sparse · dark purple = extremely crowded. Hover any country for details · Click to open."
              source="Source: UN WPP 2024 (population) · CIA Factbook (area) · Boundaries: Natural Earth"
            />
          </div>

          {/* SSR enriched-content sections */}
          <DensityContextSections
            sortedDesc={sortedDesc}
            regions={regions}
            worldPop={worldPop}
            worldLandArea={worldArea}
          />

          {/* Visible FAQ */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: 'What is population density?',
                  a: `Population density is the average number of people per unit of land area. World average: ~${fmtDensity(worldDensity)}/km² (UN WPP 2024 + CIA Factbook). National values span from ~2/km² (Mongolia) to ~19,000/km² (Monaco) — an 8,500× range.`,
                },
                {
                  q: 'Which country has the highest population density?',
                  a: `${top10[0].name} at ~${Math.round(top10[0].densityKm2).toLocaleString()} people per km². The top 10 most-dense are dominated by city-states (Monaco, Singapore, Bahrain) and small island nations (Maldives, Malta). Bangladesh is the only country with over 100M people in the top 10.`,
                },
                {
                  q: 'Which country has the lowest population density?',
                  a: `${bottom10[0].name} at ~${bottom10[0].densityKm2.toFixed(1)} people per km². The bottom 10 are large countries with mostly uninhabitable terrain (deserts, ice, jungle, mountains): Mongolia, Namibia, Australia, Iceland, Suriname, Guyana, Libya, Canada, Botswana, Mauritania.`,
                },
                {
                  q: 'How is population density calculated?',
                  a: 'Density = total population ÷ land area. Land area excludes inland water (CIA Factbook methodology). The result is people per km² (international standard) or people per mi² (US). National averages mask huge internal variation — Canada\'s southern strip is densely populated, the Arctic is empty.',
                },
                {
                  q: 'Why are city-states so densely populated?',
                  a: 'Monaco, Singapore, Vatican City and similar microstates have small territories that are almost entirely urbanized. They lack the rural hinterland that drags down most countries\' average density. The world\'s densest cities (Dhaka, Mumbai, Manila) actually exceed even Singapore\'s density at the metro-area level.',
                },
                {
                  q: 'What is the population density of the United States?',
                  a: 'The United States has about 37 people per km² (96 per mi²) — well below the world average. Population is concentrated on the coasts: New York metro ~4,500/km², LA ~3,200/km², while interior states like Wyoming have under 3/km².',
                },
                {
                  q: 'Which continent is most densely populated?',
                  a: `Asia, at about ${fmtDensity(regions.find(r => r.region === 'Asia')?.density ?? 0)} people per km² on average — over triple the world average. About 60% of humanity lives there. Europe is second-densest; Oceania and the Americas have lower averages because of vast territory in Australia, Canada, and Brazil.`,
                },
                {
                  q: 'Why does country density not tell you about everyday crowding?',
                  a: 'Country averages divide population by all land — including mountains, deserts, and uninhabited areas. Real urban density is far higher. Even in low-density countries like Canada (4/km²), most people live in cities at 1,000+/km². Megacities like Dhaka, Mumbai and Manila pack 20,000–36,000 people per km² in their metro areas.',
                },
                {
                  q: 'Where does this data come from?',
                  a: `Population: UN World Population Prospects ${CURRENT_YEAR} Revision (population.un.org/wpp). Land area: CIA World Factbook (cia.gov/the-world-factbook). City density: Demographia World Urban Areas 2023 (demographia.com). Last updated ${LAST_UPDATED_ISO}.`,
                },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                  <p className="text-sm text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <ToolCrossLinks currentSlug="population-density-by-country" />

          {/* Sources footer */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources &amp; Methodology</h3>
            <ul className="space-y-1.5">
              <li>
                <strong>Population (numerator):</strong>{' '}
                <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  UN World Population Prospects 2024 Revision
                </a>{' '}
                — total population for each country, mid-{DENSITY_REFERENCE_YEAR} estimate.
              </li>
              <li>
                <strong>Land area (denominator):</strong>{' '}
                <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  CIA World Factbook
                </a>{' '}
                — total land area in km² (excluding inland water bodies).
              </li>
              <li>
                <strong>City density:</strong>{' '}
                <a href="http://www.demographia.com/db-worldua.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  Demographia World Urban Areas 2023 (Wendell Cox)
                </a>{' '}
                — metropolitan-area density estimates from national census data.
              </li>
              <li>
                <strong>Map boundaries:</strong>{' '}
                <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                  Natural Earth
                </a>{' '}
                via the <code>world-atlas</code> TopoJSON package.
              </li>
              <li>
                <strong>Coverage:</strong> {places.length} of 195 countries (areas data covers all 195; some
                tiny territories may be excluded if population data is unavailable). All charts on this page
                are inline SVG generated server-side — no third-party tracking or external chart libraries.
              </li>
              <li>Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
