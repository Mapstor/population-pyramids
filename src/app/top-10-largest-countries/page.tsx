import Link from 'next/link';
import { getCountryRankings, formatPopulation, formatArea, formatDensity } from '@/lib/country-rankings';
import RankingBarChart, { BarItem } from '@/components/RankingBarChart';
import { getWorldMapPaths } from '@/lib/world-map-data';
import WorldPopulationMap, { CountryMapDatum } from '@/components/WorldPopulationMap';

export const metadata = {
  title: 'Top 10 Largest Countries in the World by Area 2026',
  description:
    'The 10 largest countries ranked by land area. Russia leads with 17M km², followed by Canada, the US, China, Brazil, Australia, India, Argentina, Kazakhstan, and Algeria. Detailed profiles with geography, climate, history, and demographic context.',
  keywords:
    'top 10 largest countries in the world, top 10 biggest countries in the world, top 10 biggest countries, largest countries in the world, 10 biggest countries, ten largest countries, top 10 countries by area',
  openGraph: {
    title: 'Top 10 Largest Countries in the World by Area 2026',
    description: 'Detailed profiles of the 10 biggest countries by land area.',
    type: 'website',
    url: 'https://populationpyramids.org/top-10-largest-countries',
  },
  alternates: { canonical: 'https://populationpyramids.org/top-10-largest-countries' },
};

const LAST_UPDATED = '2026-05-18';
const PUBLISHED = '2026-05-18';

const PROFILES: Record<string, { intro: string; geography: string; history: string }> = {
  russia: {
    intro: 'Largest country in the world by a wide margin — nearly twice the size of Canada. 17,098,242 km² across 11 time zones from the Baltic to the Bering Strait. Despite vast size, population (~144M) is smaller than Bangladesh\'s.',
    geography: 'Spans subarctic to humid subtropical. Three-quarters in Siberia — taiga, tundra, arctic coast. European Russia (west of the Urals) contains most population, cities, economy. Longest coastline after Canada, almost entirely arctic.',
    history: 'Four centuries of eastward expansion from Muscovy across Siberia (largely complete by 1700), plus 19th-century expansion into Central Asia and the Caucasus. The USSR (1922–1991) was 22M+ km²; after dissolution Russia kept the largest share.',
  },
  canada: {
    intro: '#2 largest in the world, #1 in the Americas. 9.98M km² hold just 39M people — 90% within 160 km of the US border. The vast majority is uninhabited boreal forest, tundra, and arctic archipelago.',
    geography: 'Longest coastline of any country (~200,000 km, mostly arctic). 8% inland water — world\'s highest share. Hudson Bay drainage basin alone is larger than most countries.',
    history: 'Indigenous First Nations and Inuit inhabited for thousands of years before European colonization. French settlement from early 1600s; British control from 1763. Confederation in 1867; full territorial reach with Newfoundland in 1949.',
  },
  'united-states': {
    intro: '#3 largest, slightly larger than China by total area. ~9.83M km² stretching from Atlantic to Pacific plus Alaska and Hawaii. Population ~340M — only top-10 largest country also in top 3 most populated.',
    geography: 'Spans arctic (N. Alaska) to tropical (Hawaii, S. Florida). Mississippi-Missouri is the world\'s 3rd most extensive river system. Rocky Mountains, Appalachians, Great Plains, Sonoran Desert, Pacific Northwest, Great Lakes — every major biome.',
    history: '13 original colonies declared independence in 1776. Expansion westward through purchase (Louisiana, Alaska), war (Mexican-American), and treaty. Continental borders by 1853. Alaska and Hawaii added 1959.',
  },
  china: {
    intro: '#4 largest, largest entirely in Asia. 9.6M km² include some of Earth\'s most extreme geography: Himalayan Plateau, Gobi/Taklamakan deserts, fertile Yangtze and Yellow River basins. ~1.43B people, mostly eastern third.',
    geography: 'Subarctic to tropical. Western two-thirds (Tibet, Xinjiang, Inner Mongolia) sparsely populated. Eastern third holds nearly all cities and economy. 14 land borders — most of any country tied with Russia.',
    history: 'Has occupied roughly current borders for centuries. Qing dynasty (1644–1912) reached modern western/northern bounds, incorporating Tibet, Xinjiang, Inner Mongolia. PRC established 1949. Hong Kong (1997), Macau (1999) returned.',
  },
  brazil: {
    intro: '#5 largest, by far #1 in South America — over half the continent. 8.5M km² include ~60% of the Amazon rainforest. Borders every South American country except Chile and Ecuador.',
    geography: 'Amazon basin (world\'s largest tropical forest), Pantanal (largest tropical wetland), Cerrado savanna, Caatinga semi-arid, Atlantic Forest, Pampas. Amazon River discharges more water than the next seven largest combined.',
    history: 'Portuguese colonization from 1500 over 3+ centuries. Independent empire 1822, republic 1889. Borders largely settled by treaty and arbitration in late 19th/early 20th century. Only Portuguese-speaking country in the Americas.',
  },
  australia: {
    intro: '#6 largest, only country occupying an entire continent. Most of 7.69M km² is uninhabited Outback. 26M people clustered in coastal cities on south/east — among the most urbanized countries globally.',
    geography: 'Lowest, flattest, and (after Antarctica) driest continent. Outback covers ~70% of land. Great Barrier Reef on east coast is world\'s largest coral reef system. Unique fauna from long isolation.',
    history: 'Aboriginal Australians for at least 65,000 years. British colonization from First Fleet at Sydney in 1788. Commonwealth of Australia formed in 1901 through federation of six British colonies.',
  },
  india: {
    intro: '#7 largest by area but #1 most populated since 2023. 3.29M km² contain ~1.43B people. Most densely populated of the top 10 largest countries.',
    geography: 'Himalayas in the north (world\'s highest mountains), Indo-Gangetic plain (one of Earth\'s most fertile agricultural regions), Thar Desert in west, Deccan Plateau in south, tropical coast on three sides.',
    history: 'One of world\'s oldest continuous civilizations — Indus Valley Civilization dates back 4,500+ years. Modern state created by 1947 partition of British India. World\'s largest democracy.',
  },
  argentina: {
    intro: '#8 largest, #2 in South America after Brazil. 2.78M km² from subtropical north to subantarctic Tierra del Fuego — north-south extent of ~3,800 km.',
    geography: 'Pampas (vast temperate grasslands), Andes Mountains (world\'s longest range) on western border, Patagonia (cold, windy steppes in south), Gran Chaco (subtropical lowlands in north). Longest South American coastline after Brazil and Chile.',
    history: 'Spanish colonization from 16th century. Independence from Spain 1810–1816. Modern borders consolidated by late 19th century. Among world\'s wealthiest in early 20th century — large European immigration wave.',
  },
  kazakhstan: {
    intro: '#9 largest, #1 landlocked country on Earth. 2.72M km² of steppe, semi-desert, and mountain in Central Asia. Population just 20M — one of the least densely populated countries.',
    geography: 'Dominated by Eurasian Steppe — vast grasslands that historically supported nomadic horse cultures. Caspian Sea (world\'s largest enclosed body of water) on western border. Tian Shan mountains on southeast border with China.',
    history: 'Historically inhabited by Turkic nomads; key part of the Mongol Empire and successor states. Russian Empire in the 19th century, Soviet Union in 1936. Independence in 1991 — instantly the 9th largest country in the world.',
  },
  algeria: {
    intro: '#10 largest, largest in Africa. ~90% of 2.38M km² is the Sahara Desert. 45M Algerians concentrated along the Mediterranean coast in the north.',
    geography: 'Mediterranean coast → Atlas Mountains → Sahara. World\'s largest hot desert. Tassili n\'Ajjer plateau (UNESCO site with prehistoric rock art), parts of the Ahaggar Mountains. Central Sahara: ~3 people per km².',
    history: 'Conquered by Arab invaders in the 7th–8th centuries. Ruled by various Berber/Arab dynasties; in Ottoman Empire from 16th century. French conquest from 1830 — made part of metropolitan France. Independence in 1962 after 8-year war. Africa\'s largest country since South Sudan separation (2011).',
  },
};

function generateSchema(top10: any[], worldLandArea: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': 'https://populationpyramids.org/top-10-largest-countries#article',
        headline: 'Top 10 Largest Countries in the World by Area 2026',
        description: 'Detailed profiles of the 10 biggest countries by land area.',
        author: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org' },
        publisher: { '@type': 'Organization', name: 'PopulationPyramids.org', url: 'https://populationpyramids.org', logo: { '@type': 'ImageObject', url: 'https://populationpyramids.org/icon.svg' } },
        datePublished: PUBLISHED,
        dateModified: LAST_UPDATED,
        articleSection: 'Geography',
        wordCount: 4500,
      },
      {
        '@type': 'WebPage',
        '@id': 'https://populationpyramids.org/top-10-largest-countries#webpage',
        name: 'Top 10 Largest Countries in the World by Area 2026',
        url: 'https://populationpyramids.org/top-10-largest-countries',
        inLanguage: 'en-US',
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
          { '@type': 'ListItem', position: 2, name: 'Largest Countries', item: 'https://populationpyramids.org/largest-countries' },
          { '@type': 'ListItem', position: 3, name: 'Top 10', item: 'https://populationpyramids.org/top-10-largest-countries' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What are the top 10 largest countries?', acceptedAnswer: { '@type': 'Answer', text: top10.map((c, i) => `${i + 1}. ${c.name} (${formatArea(c.areaKm2)})`).join(', ') + '.' } },
          { '@type': 'Question', name: 'What is the largest country in the world?', acceptedAnswer: { '@type': 'Answer', text: `${top10[0].name}, at ${top10[0].areaKm2.toLocaleString()} km² — nearly twice the size of ${top10[1].name}.` } },
          { '@type': 'Question', name: 'How much of Earth\'s land do the top 10 cover?', acceptedAnswer: { '@type': 'Answer', text: `~${((top10.reduce((s, c) => s + c.areaKm2, 0) / worldLandArea) * 100).toFixed(0)}% of all national land.` } },
          { '@type': 'Question', name: 'Is the US or China larger?', acceptedAnswer: { '@type': 'Answer', text: 'Nearly the same. By total area (with inland water), US is slightly larger (9.83M vs 9.60M km²). By land area only, China is marginally larger. CIA Factbook ranks US third.' } },
          { '@type': 'Question', name: 'Why is Russia the largest?', acceptedAnswer: { '@type': 'Answer', text: 'Four centuries of eastward expansion from Muscovy across Siberia (~1700), plus 19th-century Central Asia expansion.' } },
          { '@type': 'Question', name: 'Did Soviet collapse change rankings?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. USSR was 22M+ km². Russia kept 17M and stayed #1; Kazakhstan emerged as #9 immediately.' } },
          { '@type': 'Question', name: 'Largest landlocked country?', acceptedAnswer: { '@type': 'Answer', text: 'Kazakhstan, 2.72M km² — larger than Western Europe combined.' } },
          { '@type': 'Question', name: 'Largest in Africa?', acceptedAnswer: { '@type': 'Answer', text: 'Algeria, 2.38M km² — ~90% Sahara. Africa\'s largest since South Sudan separated from Sudan in 2011.' } },
          { '@type': 'Question', name: 'Largest in South America?', acceptedAnswer: { '@type': 'Answer', text: 'Brazil — 8.5M km², half the continent.' } },
          { '@type': 'Question', name: 'Density of largest countries?', acceptedAnswer: { '@type': 'Answer', text: 'Variable. India ~440/km² (highest). Australia, Kazakhstan, Russia, Canada all under 10/km². Most have sparsely populated interiors.' } },
          { '@type': 'Question', name: 'How are disputed territories counted?', acceptedAnswer: { '@type': 'Answer', text: 'Per CIA Factbook (de facto control). India, China, Pakistan, Israel, Morocco, Argentina have disputed claims that affect figures by a few percent.' } },
          { '@type': 'Question', name: 'Australia: country or continent?', acceptedAnswer: { '@type': 'Answer', text: 'Both. Only country occupying an entire continent.' } },
          { '@type': 'Question', name: 'Total area vs land area?', acceptedAnswer: { '@type': 'Answer', text: 'Total area = land + inland water. Land area = excludes water. Differ most for Canada (8% water), the US, Russia.' } },
          { '@type': 'Question', name: 'Data source?', acceptedAnswer: { '@type': 'Answer', text: 'CIA Factbook (area), UN WPP 2024 (population).' } },
          { '@type': 'Question', name: 'When updated?', acceptedAnswer: { '@type': 'Answer', text: `${LAST_UPDATED}.` } },
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
              <li><Link href="/largest-countries" className="hover:text-blue-600">Largest Countries</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Top 10</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Top 10 Largest Countries in the World by Area 2026
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            The world&apos;s 10 largest countries cover about <strong>{totalShare.toFixed(0)}%</strong> of all national land area on Earth.
            Russia and Canada alone — over 27M km² — are almost double the size of every European country combined.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Source:{' '}
            <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a>
          </p>

          {/* Quick top-3 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {top10.slice(0, 3).map((c, i) => (
              <div key={c.slug} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">#{i + 1}</div>
                <Link href={`/${c.slug}`} className="block text-base font-bold text-gray-900 hover:text-blue-700 mb-1">{c.name}</Link>
                <div className="text-2xl font-bold text-blue-700">{formatArea(c.areaKm2)}</div>
                <div className="text-xs text-gray-600 mt-1">{((c.areaKm2 / worldLandArea) * 100).toFixed(1)}% of world · CIA Factbook</div>
              </div>
            ))}
          </div>

          {/* Quick-insight cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-emerald-700">
              <div className="text-3xl font-bold text-emerald-700">2×</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Russia vs Canada</div>
              <div className="text-sm text-gray-700 mt-1">Russia (17.1M km²) is nearly double Canada</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-emerald-600">
              <div className="text-3xl font-bold text-emerald-700">27M</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Russia + Canada km²</div>
              <div className="text-sm text-gray-700 mt-1">Together &gt; all of Europe combined</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-emerald-500">
              <div className="text-3xl font-bold text-emerald-700">{totalShare.toFixed(0)}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Top 10 share</div>
              <div className="text-sm text-gray-700 mt-1">Of all national land on Earth</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-emerald-400">
              <div className="text-3xl font-bold text-emerald-700">1</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Australia</div>
              <div className="text-sm text-gray-700 mt-1">Only country to occupy an entire continent</div>
            </div>
          </section>

          {/* World map — top 10 highlighted in area mode */}
          <div className="mb-8">
            <WorldPopulationMap
              features={features}
              dataByAlpha={dataByAlpha}
              highlightedSlugs={top10Slugs}
              mode="area"
              worldLandArea={worldLandArea}
              title="The 10 Largest on the Map"
              hint="Numbered badges show rank by land area. Hover any country for details · Click to open."
              source="Area: CIA World Factbook · Boundaries: Natural Earth"
            />
          </div>

          {/* Bar chart */}
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
                  Russia stands alone at the top — bigger than the 3rd and 4th largest combined.
                  Canada, the US, and China cluster together in the 9–10M km² range. Click any
                  bar to view that country&apos;s demographics.
                </>
              }
            />
          </div>

          {/* Sources panel */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">📋 Data Sources & Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Area figures</div>
                <p className="text-gray-700">Total area (land + inland water) from <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a>.</p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Population & density</div>
                <p className="text-gray-700">Population from <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN WPP 2024</a>. Density = pop ÷ area.</p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Disputed territories</div>
                <p className="text-gray-700">Per CIA Factbook (de facto control). India, China, Pakistan, Israel, Morocco, Argentina all have notable claims affecting figures slightly.</p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Excluded</div>
                <p className="text-gray-700">Antarctica, overseas dependencies (Greenland, Puerto Rico, French Polynesia), EEZs. France includes overseas regions.</p>
              </div>
            </div>
          </section>

          {/* The 10 profiles */}
          <div className="space-y-6">
            {top10.map((c, i) => {
              const p = PROFILES[c.slug];
              return (
                <article key={c.slug} className="bg-white rounded-xl shadow-sm overflow-hidden border-l-4 border-blue-600">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                      <div>
                        <div className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-1">#{i + 1} Largest by Area</div>
                        <h2 className="text-2xl font-bold text-gray-900"><Link href={`/${c.slug}`} className="hover:text-blue-700">{c.name}</Link></h2>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-700">{formatArea(c.areaKm2)}</div>
                        <div className="text-xs text-gray-600 mt-1">{((c.areaKm2 / worldLandArea) * 100).toFixed(1)}% of world · CIA Factbook</div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">
                      {p?.intro ?? `#${i + 1} largest at ${c.areaKm2.toLocaleString()} km².`}
                    </p>

                    {p?.geography && (
                      <div className="bg-emerald-50 rounded p-4 mb-4 border-l-2 border-emerald-300">
                        <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Geography</div>
                        <p className="text-gray-700 text-sm">{p.geography}</p>
                      </div>
                    )}

                    {p?.history && (
                      <div className="bg-amber-50 rounded p-4 mb-4 border-l-2 border-amber-300">
                        <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">History</div>
                        <p className="text-gray-700 text-sm">{p.history}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Land area</div>
                        <div className="font-semibold text-gray-900">{c.areaKm2.toLocaleString()} km²</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Population 2024</div>
                        <div className="font-semibold text-gray-900">{formatPopulation(c.population2024)}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Density</div>
                        <div className="font-semibold text-gray-900">{c.densityPerKm2 > 0 ? formatDensity(c.densityPerKm2) : '—'}/km²</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Region</div>
                        <div className="font-semibold text-gray-900">{c.region}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link href={`/${c.slug}`} className="text-blue-700 hover:text-blue-900 font-medium text-sm">
                        View full {c.name} demographics →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Comparative scale grid */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Putting These Sizes in Perspective</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                { stat: '17.1M km²', label: 'Russia', detail: 'Roughly the size of Pluto\'s surface. Spans 11 time zones. Bigger than Antarctica\'s ice-free land.' },
                { stat: '9.98M km²', label: 'Canada', detail: 'About the size of all of Europe (including European Russia). Province of Nunavut alone is bigger than Mexico.' },
                { stat: '8.52M km²', label: 'Brazil', detail: 'Could fit the continental US inside with ~600,000 km² to spare. Holds 60% of the Amazon rainforest.' },
                { stat: '7.69M km²', label: 'Australia', detail: '80% the size of the continental US — yet has fewer people than Texas.' },
              ].map((c) => (
                <div key={c.label} className="bg-gray-50 rounded p-4">
                  <div className="text-2xl font-bold text-blue-700 mb-1">{c.stat}</div>
                  <div className="font-semibold text-gray-900 mb-1">{c.label}</div>
                  <div className="text-gray-700">{c.detail}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Glossary */}
          <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Geography Glossary</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ['Total area', 'Land + internal water. Used in this ranking.'],
                ['Land area', 'Excludes inland water. Differs most for Canada, US, Russia.'],
                ['Continent', 'One of seven large landmasses. Australia is the only country to occupy an entire continent.'],
                ['Landlocked', 'No direct ocean access. Kazakhstan is the largest such country.'],
                ['Transcontinental country', 'Territory in more than one continent. Russia, Turkey, Egypt.'],
                ['EEZ', 'Exclusive Economic Zone, 200 nautical miles from coast. France has the largest EEZ.'],
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
                { q: 'Top 10 largest?', a: `${top10.map((c, i) => `${i + 1}. ${c.name} (${formatArea(c.areaKm2)})`).join(', ')}.` },
                { q: 'Largest country?', a: `${top10[0].name}, ${top10[0].areaKm2.toLocaleString()} km² — nearly twice ${top10[1].name}.` },
                { q: 'Top 10 cover?', a: `~${totalShare.toFixed(0)}% of national land.` },
                { q: 'US or China larger?', a: 'Nearly equal. By total area, US is slightly larger (9.83M vs 9.60M). By land area only, China is marginally larger.' },
                { q: 'Why is Russia largest?', a: 'Eastward expansion from Muscovy across Siberia (largely complete by 1700) + 19th-century Central Asia expansion.' },
                { q: 'Soviet collapse impact?', a: 'USSR was 22M+ km². Russia kept 17M and stayed #1; Kazakhstan emerged as #9.' },
                { q: 'Largest landlocked?', a: 'Kazakhstan, 2.72M km².' },
                { q: 'Largest in Africa?', a: 'Algeria, 2.38M km² — since South Sudan separation from Sudan in 2011.' },
                { q: 'Largest in South America?', a: 'Brazil — 8.5M km².' },
                { q: 'Density of largest countries?', a: 'India ~440/km² (highest). Australia, Kazakhstan, Russia, Canada all under 10/km².' },
                { q: 'Disputed territories?', a: 'Per CIA Factbook (de facto control). India, China, Pakistan, Israel, Morocco, Argentina have notable claims.' },
                { q: 'Australia: country or continent?', a: 'Both. Only country to occupy an entire continent.' },
                { q: 'Total vs land area?', a: 'Total = land + inland water. Land = excludes water. Differs most for Canada (8% water), US, Russia.' },
                { q: 'Data source?', a: 'CIA Factbook (area), UN WPP 2024 (population).' },
                { q: 'When updated?', a: `${LAST_UPDATED}.` },
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
              <li><Link href="/largest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ All 195 Countries Ranked by Area</Link></li>
              <li><Link href="/top-10-most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Top 10 Most Populated</Link></li>
              <li><Link href="/most-populated-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Most Populated Countries</Link></li>
              <li><Link href="/smallest-countries" className="text-blue-700 hover:text-blue-900 font-medium">→ Smallest Countries</Link></li>
              <li><Link href="/median-age-by-country" className="text-blue-700 hover:text-blue-900 font-medium">→ Median Age by Country</Link></li>
              <li><Link href="/compare" className="text-blue-700 hover:text-blue-900 font-medium">→ Compare Two Countries</Link></li>
            </ul>
          </section>

          {/* Sources */}
          <section className="bg-gray-100 rounded-lg p-5 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Sources & Further Reading</h3>
            <ul className="space-y-1">
              <li><strong>Area:</strong> <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">CIA World Factbook</a></li>
              <li><strong>Population:</strong> <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">UN World Population Prospects 2024</a></li>
              <li>Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
